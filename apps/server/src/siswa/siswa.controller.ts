import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseInterceptors, UploadedFile, HttpCode, ParseFilePipeBuilder, HttpStatus, UseGuards, Res, StreamableFile, Header, ServiceUnavailableException } from '@nestjs/common';
import { SiswaService } from './siswa.service';
import { CreateSiswaDto, ResetPasswordDto, UpdateRombelDto } from './dto/create-siswa.dto';
import { UpdateSiswaDto } from './dto/update-siswa.dto';
import { UpdateTokenDto } from './dto/update-token.dto'
import { FileInterceptor } from '@nestjs/platform-express';
import * as xlsx from 'xlsx';
import { siswa } from '@prisma/client';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { PermissionGuard } from 'src/guards/permissions.guard';
import { Permissions } from 'src/decorators/permission.decorator';

@Controller('siswa')
@ApiTags("Siswa")
@UseGuards(AccessTokenGuard, PermissionGuard)
export class SiswaController {
  constructor(private readonly siswaService: SiswaService) { }

  @Post()
  @Permissions('siswa:create')
  @UseInterceptors(FileInterceptor('file'))
  async create(
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
    ) file: Express.Multer.File | undefined,
    @Body() createSiswaDto: CreateSiswaDto,) {
    return await this.siswaService.create(createSiswaDto, file);
  }

  @Get()
  @Permissions('siswa:read')
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('search') search?: string,
  ) {
    return await this.siswaService.findAll(page, limit, search);
  }

  @Get('public')
  async findAllWithoutPermission(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('search') search?: string,
  ) {
    return await this.siswaService.findAll(page, limit, search);
  }

  @Get('/download')
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=siswa-template.xlsx"')
  @Permissions('siswa:download')
  async downloadFileTemplate(@Res() res: Response) {
    const file = await this.siswaService.downloadTemplate();
    res.send(file);
  }

  @Get("/rombel")
  @Permissions('siswa:rombel')
  async getSiswaClass() {
    return await this.siswaService.getGroupClass()
  }

  @Get(':id')
  @Permissions('siswa:detail')
  async findOne(@Param('id', new ParseIntPipe()) id: string) {
    return await this.siswaService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  @Permissions('siswa:update')
  async update(@Param('id', new ParseIntPipe()) id: string, @UploadedFile(
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
  ) file: Express.Multer.File | undefined, @Body() updateSiswaDto: UpdateSiswaDto) {
    return await this.siswaService.update(+id, updateSiswaDto, file);
  }

  /**
   * @deprecated Reset Function
   */
  @Delete('/reset')
  async reset() {
    // return await this.siswaService.reset()
    throw new ServiceUnavailableException()
  }

  @Delete(':id')
  @Permissions('siswa:delete')
  async remove(@Param('id', new ParseIntPipe()) id: string) {
    return await this.siswaService.remove(+id);
  }

  @Post(':id/rfid-token')
  @Permissions('siswa:rfid-register')
  async registerRfid(@Param('id', new ParseIntPipe()) id: string, @Body() updateToken: UpdateTokenDto) {
    return await this.siswaService.registerRfid(+id, updateToken)
  }

  @Delete(':id/rfid-token')
  @Permissions('siswa:rfid-reset')
  async resetTokenRFID(@Param('id', new ParseIntPipe()) id: string) {
    return await this.siswaService.resetTokenRFID(+id)
  }

  @Post('/import')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  @Permissions('siswa:import')
  async import(@UploadedFile(
    new ParseFilePipeBuilder()
      .addFileTypeValidator({
        fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      .build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
      }),
  ) file: Express.Multer.File) {
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const keys = xlsx.utils.sheet_to_json(worksheet, { header: 1 })[0];
    const data: siswa[] = xlsx.utils.sheet_to_json(worksheet);
    return await this.siswaService.import(data, keys);
  }

  @Delete(':id/reset-telegram')
  async resetTelegram(
    @Param('id', new ParseIntPipe()) id: number
  ) {
    return await this.siswaService.resetTelegram(id)
  }

  @Patch('rombel/update')
  @Permissions('siswa:rombel-update')
  async updateRombel(
    @Body() updateRombelDto: UpdateRombelDto
  ) {
    return await this.siswaService.updateRombel(updateRombelDto)
  }

  @Patch(':id/reset-password')
  // @Permissions('siswa:reset-password')
  async resetPassword(@Param('id', new ParseIntPipe()) id: string, @Body() resetPasswordDto: ResetPasswordDto) {
    return await this.siswaService.resetPassword(+id, resetPasswordDto)
  }

  @Patch(':id/reset-login')
  // @Permissions('siswa:reset-login')
  async resetLogin(@Param('id', new ParseIntPipe()) id: string) {
    return await this.siswaService.resetLogin(+id)
  }

}
