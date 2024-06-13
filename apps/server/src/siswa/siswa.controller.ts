import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SiswaService } from './siswa.service';
import { CreateSiswaDto } from './dto/create-siswa.dto';
import { UpdateSiswaDto } from './dto/update-siswa.dto';

@Controller('siswa')
export class SiswaController {
  constructor(private readonly siswaService: SiswaService) { }

  @Post()
  async create(@Body() createSiswaDto: CreateSiswaDto) {
    return await this.siswaService.create(createSiswaDto);
  }

  @Get()
  async findAll() {
    return await this.siswaService.findAll();
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
}
