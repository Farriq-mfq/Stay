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
export class PegawaiController {
  constructor(private readonly pegawaiService: PegawaiService) { }

  @UseGuards(AccessTokenGuard)
  @Post()
  async create(@Body() createPegawaiDto: CreatePegawaiDto) {
    return await this.pegawaiService.create(createPegawaiDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('search') search?: string,
  ) {
    return await this.pegawaiService.findAll(page, limit, search);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/download')
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=siswa-template.xlsx"')
  async downloadFileTemplate(@Res() res: Response) {
    const file = await this.pegawaiService.downloadTemplate();
    res.send(file);
  }

  @Get("/:sessionId/all")
  async findWithoutPaginate(
    @Param('sessionId') sessionId:string
  ) {
    return await this.pegawaiService.findWithoutPaginate(sessionId)
  }

  @UseGuards(AccessTokenGuard)
  @Get("/group")
  async getSiswaClass() {
    return await this.pegawaiService.getGroup()
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard)
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

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  async remove(@Param('id', new ParseIntPipe()) id: string) {
    return await this.pegawaiService.remove(+id);
  }

  @UseGuards(AccessTokenGuard)
  @Post(':id/rfid-token')

  async registerRfid(@Param('id', new ParseIntPipe()) id: string, @Body() updateToken: UpdatePegawaiTokenDto) {
    return await this.pegawaiService.registerRfid(+id, updateToken)
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id/rfid-token')
  async resetTokenRFID(@Param('id', new ParseIntPipe()) id: string) {
    return await this.pegawaiService.resetTokenRFID(+id)
  }

  @UseGuards(AccessTokenGuard)
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
