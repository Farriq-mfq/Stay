import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseInterceptors, UploadedFile, HttpCode, ParseFilePipeBuilder, HttpStatus, UseGuards } from '@nestjs/common';
import { SiswaService } from './siswa.service';
import { CreateSiswaDto } from './dto/create-siswa.dto';
import { UpdateSiswaDto } from './dto/update-siswa.dto';
import { UpdateTokenDto } from './dto/update-token.dto'
import { FileInterceptor } from '@nestjs/platform-express';
import * as xlsx from 'xlsx';
import { siswa } from '@prisma/client';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';

@Controller('siswa')
@UseGuards(AccessTokenGuard)
export class SiswaController {
  constructor(private readonly siswaService: SiswaService) { }

  @Post()
  async create(@Body() createSiswaDto: CreateSiswaDto) {
    return await this.siswaService.create(createSiswaDto);
  }

  @Get()
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('search') search?: string,
  ) {
    return await this.siswaService.findAll(page, limit, search);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.siswaService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSiswaDto: UpdateSiswaDto) {
    return await this.siswaService.update(+id, updateSiswaDto);
  }

  @Delete('/reset')
  async reset() {
    return await this.siswaService.reset()
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.siswaService.remove(+id);
  }

  @Post(':id/rfid-token')
  async registerRfid(@Param('id') id: string, @Body() updateToken: UpdateTokenDto) {
    return await this.siswaService.registerRfid(+id, updateToken)
  }

  @Delete(':id/rfid-token')
  async resetTokenRFID(@Param('id') id: string) {
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
}
