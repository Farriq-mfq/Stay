import { Body, Controller, Delete, Get, Header, HttpCode, HttpStatus, Param, ParseFilePipeBuilder, ParseIntPipe, Patch, Post, Query, Res, UnprocessableEntityException, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import * as xlsx from 'xlsx';
import { CreatePegawaiDto, UpdatePasswordPegawaiDto } from './dto/create-pegawai.dto';
import { UpdatePegawaiTokenDto } from './dto/update-pegawai-token.dto';
import { UpdatePegawaiDto } from './dto/update-pegawai.dto';
import { PegawaiService } from './pegawai.service';


@Controller('pegawai')
// @ApiTags("Pegawai")
export class PegawaiController {
  constructor(private readonly pegawaiService: PegawaiService) { }

  @UseGuards(AccessTokenGuard)
  @Post()
  @UseInterceptors(FileFieldsInterceptor([{
    name: 'sign_picture',
    maxCount: 1,
  },
  {
    name: "profile_picture",
    maxCount: 1
  },
  ], {
    fileFilter(req, file, callback) {
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return callback(new UnprocessableEntityException('File format not supported'), false);
      }
      callback(null, true);
    },
    limits: {
      fileSize: 1.5 * 1024 * 1024
    },
  }))

  async create(@UploadedFiles() files: { sign_picture?: Express.Multer.File, profile_picture?: Express.Multer.File } | undefined, @Body() createPegawaiDto: CreatePegawaiDto) {

    return await this.pegawaiService.create(createPegawaiDto, files);
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
    @Param('sessionId') sessionId: string
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
  @UseInterceptors(FileFieldsInterceptor([{
    name: 'sign_picture',
    maxCount: 1,
  },
  {
    name: "profile_picture",
    maxCount: 1
  },
  ], {
    fileFilter(req, file, callback) {
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return callback(new UnprocessableEntityException('File format not supported'), false);
      }
      callback(null, true);
    },
    limits: {
      fileSize: 1.5 * 1024 * 1024
    },
  }))
  async update(@Param('id', new ParseIntPipe()) id: string, @UploadedFiles() files: { sign_picture?: Express.Multer.File, profile_picture?: Express.Multer.File } | undefined, @Body() updatePegawaiDto: UpdatePegawaiDto) {
    return await this.pegawaiService.update(+id, updatePegawaiDto, files);
  }

  // @Delete('/reset')
  // async reset() {
  //   // return await this.siswaService.reset()
  //   throw new ServiceUnavailableException()
  // }
  @Post(':id/reset-password')
  async resetPassword(@Param('id', new ParseIntPipe()) id: string, @Body() updatePasswordPegawaiDto: UpdatePasswordPegawaiDto) {
    return await this.pegawaiService.resetPassword(+id, updatePasswordPegawaiDto)
  }

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
