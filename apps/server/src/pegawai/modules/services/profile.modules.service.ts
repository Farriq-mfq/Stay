import { BadRequestException, Inject, Injectable, InternalServerErrorException, UnprocessableEntityException } from "@nestjs/common";
import { ChangePasswordDto } from "../dto/profile.dto";
import { CustomPrismaService } from "nestjs-prisma";
import { ExtendedPrismaClient } from "src/prisma.extension";
import { CloudinaryService } from "src/services/cloudinary.service";
import { format } from "date-fns";
import { hash, verify } from "argon2";
@Injectable()
export class ProfileModulesService {
    constructor(
        @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,
        private readonly cloudinaryService: CloudinaryService
    ) { }
    async updateProfilePicture(user: any, profile_picture: Express.Multer.File | undefined) {
        const pegawai = await this.prismaService.client.pegawai.findUnique({
            where: {
                id: parseInt(user.sub)
            }
        })

        if (profile_picture) {

            if (pegawai.profile_picture_public_id) await this.cloudinaryService.deleteImage(pegawai.profile_picture_public_id)

            let result = null;
            try {
                result = await this.cloudinaryService.uploadImage(profile_picture, `${format(new Date(), "yyyy")}-${pegawai.username}`, `${pegawai.username}`)
            } catch (e) {
                throw new InternalServerErrorException()
            }

            return await this.prismaService.client.pegawai.update({
                where: {
                    id: parseInt(user.sub)
                },
                data: {
                    profile_picture: result.url,
                    profile_picture_public_id: result.public_id
                },
                select: {
                    profile_picture: true
                }
            })

        } else {
            throw new BadRequestException('Profile picture is required')
        }
    }

    async changePassword(user: any, ChangePasswordDto: ChangePasswordDto) {
        const pegawai = await this.prismaService.client.pegawai.findUnique({
            where: {
                id: parseInt(user.sub)
            }
        })

        // check old password
        const isOldPasswordCorrect = await verify(pegawai.password, ChangePasswordDto.old_password)
        if (!isOldPasswordCorrect) throw new UnprocessableEntityException('Password lama tidak sesuai')
        // update password
        return await this.prismaService.client.pegawai.update({
            where: {
                id: parseInt(user.sub)
            },
            data: { password: await hash(ChangePasswordDto.new_password) }
        })
    }
}

