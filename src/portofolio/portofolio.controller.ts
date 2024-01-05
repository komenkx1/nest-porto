import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { PortofolioService } from './portofolio.service';
import { Portofolio } from './portofolio.entity';
import { PortofolioDto } from './portofolio.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs/promises';
import { PortofolioTagService } from 'src/portofolio_tag/portofolio_tag.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller()
export class PortofolioController {
  constructor(
    private readonly portofolioService: PortofolioService,
    private readonly portofolioTagService: PortofolioTagService,
    private cloudinary: CloudinaryService,
  ) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 3,
    @Query() query: { title?: string; category?: string; tag?: string },
  ): Promise<{ data: Portofolio[]; currentPage: number; totalPages: number }> {
    return this.portofolioService.findAll(page, pageSize, query);
  }

  @Post()
  @UseInterceptors(FileInterceptor('thumbnail'))
  async create(
    @Body(new ValidationPipe({ transform: true })) data: PortofolioDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      await this.cloudinary
        .uploadImage(file, 'thumbnail')
        .then((result) => {
          const imageUrl = result.secure_url;
          if (file) {
            data.thumbnail = imageUrl;
          }
        })
        .catch((error) => {
          console.error('Cloudinary upload error:', error);
          throw new BadRequestException('Invalid file type.');
        });

      const newPorto: Portofolio = await this.portofolioService.create({
        ...data,
      });

      return {
        message: 'Portofolio created successfully',
        data: newPorto,
        code: 200,
      };
    } catch (error) {
      throw new BadRequestException('Validation failed', error.message);
    }
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('thumbnail'))
  async update(
    @Param('id') id: number,
    @Body(new ValidationPipe({ transform: true })) updatedData: PortofolioDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const porto = await this.portofolioService.findById(id);
      if (!porto) {
        throw new BadRequestException('portofolio not found');
      }

      if (file) {
        try {
          await this.cloudinary.deleteImage(porto.thumbnail, 'thumbnail');
        } catch (error) {
          console.error(`Error deleting file: ${porto.thumbnail}`);
          console.error(error.message);
        }

        await this.cloudinary
          .uploadImage(file, 'thumbnail')
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

      if (updatedData.portofolioTag) {
        updatedData.portofolioTag.forEach((tag) => {
          this.portofolioTagService.update(tag.id, tag);
        });
      }
      const userEdited: Portofolio = await this.portofolioService.update(
        id,
        updatedData,
      );
      return {
        message: 'Portofolio updated successfully',
        data: userEdited,
        code: 200,
      };
    } catch (error) {
      throw new BadRequestException('Update failed', error.message);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    try {
      const porto = await this.portofolioService.findById(id);
      if (!porto) {
        throw new BadRequestException('Portofolio not found');
      }

      if (porto.thumbnail) {
        try {
          await fs.access(porto.thumbnail);
          await fs.unlink(porto.thumbnail);
        } catch (error) {
          console.error(`Error deleting file: ${porto.thumbnail}`);
          console.error(error.message);
        }
      }

      await this.portofolioService.delete(id);
      return {
        message: 'Portofolio deleted successfully',
        code: 200,
      };
    } catch (error) {
      throw new BadRequestException('Delete failed', error.message);
    }
  }
}
