import { Body, Controller, Delete, Get, Header, HttpCode, HttpStatus, Param, ParseFilePipeBuilder, ParseIntPipe, Patch, Post, Query, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { CreatePegawaiDto } from './dto/create-pegawai.dto';
import { UpdatePegawaiTokenDto } from './dto/update-pegawai-token.dto';
import { UpdatePegawaiDto } from './dto/update-pegawai.dto';
import { PegawaiService } from './pegawai.service';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import * as xlsx from 'xlsx'


@Controller('pegawai')
// @ApiTags("Pegawai")
@UseGuards(AccessTokenGuard)
export class PegawaiController {
  constructor(private readonly pegawaiService: PegawaiService) { }

  @Post()
  async create(@Body() createPegawaiDto: CreatePegawaiDto) {
    return await this.pegawaiService.create(createPegawaiDto);
  }

  @Get()
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('search') search?: string,
  ) {
    return await this.pegawaiService.findAll(page, limit, search);
  }

  @Get('/download')
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=siswa-template.xlsx"')
  async downloadFileTemplate(@Res() res: Response) {
    const file = await this.pegawaiService.downloadTemplate();
    res.send(file);
  }

  @Get("/group")
  async getSiswaClass() {
    return await this.pegawaiService.getGroup()
  }

  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe()) id: string) {
    return await this.pegawaiService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id', new ParseIntPipe()) id: string, @Body() updatePegawaiDto: UpdatePegawaiDto) {
    return await this.pegawaiService.update(+id, updatePegawaiDto);
  }

  // @Delete('/reset')
  // async reset() {
  //   // return await this.siswaService.reset()
  //   throw new ServiceUnavailableException()
  // }

  @Delete(':id')
  async remove(@Param('id', new ParseIntPipe()) id: string) {
    return await this.pegawaiService.remove(+id);
  }

  @Post(':id/rfid-token')
  async registerRfid(@Param('id', new ParseIntPipe()) id: string, @Body() updateToken: UpdatePegawaiTokenDto) {
    return await this.pegawaiService.registerRfid(+id, updateToken)
  }

  @Delete(':id/rfid-token')
  async resetTokenRFID(@Param('id', new ParseIntPipe()) id: string) {
    return await this.pegawaiService.resetTokenRFID(+id)
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
    const data = xlsx.utils.sheet_to_json(worksheet);
    return await this.pegawaiService.import(data, keys);
  }

}
