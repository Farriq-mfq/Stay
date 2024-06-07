import { Test, TestingModule } from '@nestjs/testing';
import { SiswaController } from './siswa.controller';
import { SiswaService } from './siswa.service';

describe('SiswaController', () => {
  let controller: SiswaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SiswaController],
      providers: [SiswaService],
    }).compile();

    controller = module.get<SiswaController>(SiswaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
