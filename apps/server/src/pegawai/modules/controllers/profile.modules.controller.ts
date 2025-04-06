import { Body, Controller, HttpStatus, ParseFilePipeBuilder, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { Request } from "express";
import { ChangePasswordDto } from "../dto/profile.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { AccessTokenPegawaiGuard } from "src/pegawai/guards/accessTokenPegawai.guard";
import { ProfileModulesService } from "../services/profile.modules.service";

@Controller("pegawai/modules/profile")
@UseGuards(AccessTokenPegawaiGuard)
export class ProfileModulesController {
    constructor(private readonly profileModulesService: ProfileModulesService) { }

    @Post('update-profile-picture')
    @UseInterceptors(FileInterceptor('profile_picture'))
    async updateProfilePicture(
        @Req() req: Request,
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({
                    fileType: /(jpg|jpeg|png)$/i,
                })
                .addMaxSizeValidator({
                    maxSize: 1.5 * 1024 * 1024,
                })
                .build({
                    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                    fileIsRequired: false
                }),
        ) profile_picture: Express.Multer.File | undefined) {
        return await this.profileModulesService.updateProfilePicture(req.user, profile_picture)
    }

    @Post('change-password')
    async changePassword(@Req() req: Request, @Body() ChangePasswordDto: ChangePasswordDto) {
        return await this.profileModulesService.changePassword(req.user, ChangePasswordDto)
    }
}
