import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { SiswaService } from './siswa.service';
import { CreateSiswaDto } from './dto/create-siswa.dto';
import { UpdateSiswaDto } from './dto/update-siswa.dto';
import { UpdateTokenDto } from './dto/update-token.dto'

@Controller('siswa')
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

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.siswaService.remove(+id);
  }

  @Post(':id/rfid-token')
  async registerRfid(@Param('id') id: string, @Body() updateToken: UpdateTokenDto) {
    return await this.siswaService.registerRfid(+id, updateToken)
  }
}
