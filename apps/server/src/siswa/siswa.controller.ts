import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseInterceptors, UploadedFile, HttpCode, ParseFilePipeBuilder, HttpStatus, UseGuards, Res, StreamableFile, Header, ServiceUnavailableException } from '@nestjs/common';
import { SiswaService } from './siswa.service';
import { CreateSiswaDto, UpdateRombelDto } from './dto/create-siswa.dto';
import { UpdateSiswaDto } from './dto/update-siswa.dto';
import { UpdateTokenDto } from './dto/update-token.dto'
import { FileInterceptor } from '@nestjs/platform-express';
import * as xlsx from 'xlsx';
import { siswa } from '@prisma/client';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@Controller('siswa')
@ApiTags("Siswa")
@UseGuards(AccessTokenGuard)
export class SiswaController {
  constructor(private readonly siswaService: SiswaService) { }

  @Post()
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
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('search') search?: string,
  ) {
    return await this.siswaService.findAll(page, limit, search);
  }

  @Get('/download')
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=siswa-template.xlsx"')
  async downloadFileTemplate(@Res() res: Response) {
    const file = await this.siswaService.downloadTemplate();
    res.send(file);
  }

  @Get("/rombel")
  async getSiswaClass() {
    return await this.siswaService.getGroupClass()
  }

  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe()) id: string) {
    return await this.siswaService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
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
  async remove(@Param('id', new ParseIntPipe()) id: string) {
    return await this.siswaService.remove(+id);
  }

  @Post(':id/rfid-token')
  async registerRfid(@Param('id', new ParseIntPipe()) id: string, @Body() updateToken: UpdateTokenDto) {
    return await this.siswaService.registerRfid(+id, updateToken)
  }

  @Delete(':id/rfid-token')
  async resetTokenRFID(@Param('id', new ParseIntPipe()) id: string) {
    return await this.siswaService.resetTokenRFID(+id)
  }

  @Post('/import')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
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
  async updateRombel(
    @Body() updateRombelDto: UpdateRombelDto
  ) {
    return await this.siswaService.updateRombel(updateRombelDto)
  }


}
