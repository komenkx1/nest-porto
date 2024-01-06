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
import { ApiResponse } from '../api-response';
import { FileInterceptor } from '@nestjs/platform-express';
import { CertificateDto } from './certificate.dto';
import { Certificate } from './certificate.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller()
export class CertificateController {
  constructor(
    private readonly certificateService: CertificateService,
    private cloudinary: CloudinaryService,
  ) {}

  @Get()
  async findAll(): Promise<any> {
    const data = await this.certificateService.findAll();
    return ApiResponse.success(data);
  }

  @Post()
  @UseInterceptors(FileInterceptor('thumbnail'))
  async create(
    @Body(new ValidationPipe({ transform: true })) data: CertificateDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      if (file) {
        await this.cloudinary
          .uploadImage(file, 'certificate')
          .then((result) => {
            const imageUrl = result.secure_url;
            if (file) {
              console.log(imageUrl);
              data.thumbnail = imageUrl;
            }
          })
          .catch((error) => {
            console.error('Cloudinary upload error:', error);
            throw new BadRequestException('Invalid file type.');
          });
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
  @UseInterceptors(FileInterceptor('thumbnail'))
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
          await this.cloudinary.deleteImage(
            certificate.thumbnail,
            'certificate',
          );
        } catch (error) {
          console.error(`Error deleting file: ${certificate.thumbnail}`);
          console.error(error.message);
        }

        await this.cloudinary
          .uploadImage(file, 'certificate')
          .then((result) => {
            const imageUrl = result.secure_url;
            if (file) {
              updatedData.thumbnail = imageUrl;
            }
          })
          .catch((error) => {
            console.error('Cloudinary upload error:', error);
            throw new BadRequestException('Invalid file type.');
          });
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
      if (certificate.thumbnail) {
        try {
          await this.cloudinary.deleteImage(
            certificate.thumbnail,
            'certificate',
          );
        } catch (error) {
          console.error(`Error deleting file: ${certificate.thumbnail}`);
          console.error(error.message);
        }
      }

      await this.certificateService.delete(certificateId);
      return ApiResponse.success(certificate);
    } catch (error) {
      throw new BadRequestException('Delete failed', error.message);
    }
  }
}
