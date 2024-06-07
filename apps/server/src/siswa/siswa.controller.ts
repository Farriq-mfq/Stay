import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SiswaService } from './siswa.service';
import { CreateSiswaDto } from './dto/create-siswa.dto';
import { UpdateSiswaDto } from './dto/update-siswa.dto';

@Controller('siswa')
export class SiswaController {
  constructor(private readonly siswaService: SiswaService) {}

  @Post()
  create(@Body() createSiswaDto: CreateSiswaDto) {
    return this.siswaService.create(createSiswaDto);
  }

  @Get()
  findAll() {
    return this.siswaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.siswaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSiswaDto: UpdateSiswaDto) {
    return this.siswaService.update(+id, updateSiswaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.siswaService.remove(+id);
  }
}
