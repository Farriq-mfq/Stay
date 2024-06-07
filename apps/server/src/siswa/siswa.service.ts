import { Injectable } from '@nestjs/common';
import { CreateSiswaDto } from './dto/create-siswa.dto';
import { UpdateSiswaDto } from './dto/update-siswa.dto';

@Injectable()
export class SiswaService {
  create(createSiswaDto: CreateSiswaDto) {
    return 'This action adds a new siswa';
  }

  findAll() {
    return `This action returns all siswa`;
  }

  findOne(id: number) {
    return `This action returns a #${id} siswa`;
  }

  update(id: number, updateSiswaDto: UpdateSiswaDto) {
    return `This action updates a #${id} siswa`;
  }

  remove(id: number) {
    return `This action removes a #${id} siswa`;
  }
}
