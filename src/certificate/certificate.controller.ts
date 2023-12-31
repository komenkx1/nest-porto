import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { ApiResponse } from 'src/api-response';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs/promises';
import * as path from 'path';
import { CertificateDto } from './certificate.dto';
import { Certificate } from './certificate.entity';
const imageFileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    const error = new BadRequestException('Only image files are allowed!');
    return cb(error, false);
  }
  cb(null, true);
};
@Controller()
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @Get()
  async findAll(): Promise<any> {
    const data = await this.certificateService.findAll();
    return ApiResponse.success(data);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('thumbnail', {
      storage: diskStorage({
        destination: 'public/img/certificate',
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          const fileName = `${Math.round(
            Math.random() * 1e9,
          )}_${Date.now()}${ext}`;
          cb(null, fileName);
        },
      }),
      fileFilter: imageFileFilter,
      limits: {
        fileSize: 1024 * 1024 * 2,
      },
    }),
  )
  async create(
    @Body(new ValidationPipe({ transform: true })) data: CertificateDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      if (file) {
        data.thumbnail = file.path.replace(/\\/g, '/');
      }
      data.user_id = Number(data.user_id);
      const newCertificate: Certificate = await this.certificateService.create({
        ...data,
      });

      return ApiResponse.success(newCertificate);
    } catch (error) {
      throw new BadRequestException('Validation failed', error.message);
    }
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('thumbnail', {
      storage: diskStorage({
        destination: 'public/img/certificate',
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          const fileName = `${Math.round(
            Math.random() * 1e9,
          )}_${Date.now()}${ext}`;
          cb(null, fileName);
        },
      }),
      fileFilter: imageFileFilter,
      limits: {
        fileSize: 1024 * 1024 * 2,
      },
    }),
  )
  async update(
    @Param('id') id: number,
    @Body(new ValidationPipe({ transform: true })) updatedData: CertificateDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      updatedData.user_id = Number(updatedData.user_id);
      const idCertificate: number = Number(id);
      const certificate = await this.certificateService.findOne(idCertificate);
      if (!certificate) {
        throw new BadRequestException('certificate not found');
      }

      if (file) {
        try {
          await fs.access(certificate.thumbnail);
          await fs.unlink(certificate.thumbnail);
        } catch (error) {
          console.error(`Error deleting file: ${certificate.thumbnail}`);
          console.error(error.message);
        }
        updatedData.thumbnail = file.path.replace(/\\/g, '/');
      }
      const certificateEdited: Certificate =
        await this.certificateService.update(idCertificate, updatedData);

      return ApiResponse.success(certificateEdited);
    } catch (error) {
      throw new BadRequestException('Update failed', error.message);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    try {
      const certificateId: number = Number(id);
      const certificate = await this.certificateService.findOne(certificateId);
      if (!certificate) {
        throw new BadRequestException('Certificate not found');
      }
      certificate.thumbnail ? await fs.unlink(certificate.thumbnail) : null;
      await this.certificateService.delete(certificateId);
      return ApiResponse.success(certificate);
    } catch (error) {
      throw new BadRequestException('Delete failed', error.message);
    }
  }
}
