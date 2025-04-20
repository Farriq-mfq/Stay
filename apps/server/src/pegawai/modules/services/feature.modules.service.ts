import { Inject, Injectable, UnauthorizedException, UseGuards } from "@nestjs/common";
import { CustomPrismaService } from "nestjs-prisma/dist/custom/custom-prisma.service";
import { AccessTokenPegawaiGuard } from "src/pegawai/guards/accessTokenPegawai.guard";
import { ExtendedPrismaClient } from "src/prisma.extension";

@Injectable()
@UseGuards(AccessTokenPegawaiGuard)
export class PegawaiModulesFeatureService {
    constructor(
        @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>
    ) {
    }

    async getFeatures(user: any) {
        if (!user) throw new UnauthorizedException();

        const userId = parseInt(user.sub);

        const pegawai = await this.prismaService.client.pegawai.findUniqueOrThrow({
            where: {
                id: userId
            },
            select: {
                group: true
            }
        });

        const features = await this.prismaService.client.features.findMany({
            where: {
                status: true,
                role: "PEGAWAI",
            },
            orderBy: {
                id: "asc"
            }
        });

        return features.filter(feature => {
            if (!feature.group) return true;
            try {
                const parseString = JSON.parse(feature.group);
                return parseString.includes(pegawai.group);
            } catch {
                return true;
            }
        })
    }
}