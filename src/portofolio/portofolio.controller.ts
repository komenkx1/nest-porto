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
import { diskStorage } from 'multer';
import * as fs from 'fs/promises';
import * as path from 'path';
import { PortofolioTagService } from 'src/portofolio_tag/portofolio_tag.service';

const imageFileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    const error = new BadRequestException('Only image files are allowed!');
    return cb(error, false);
  }
  cb(null, true);
};
@Controller()
export class PortofolioController {
  constructor(
    private readonly portofolioService: PortofolioService,
    private readonly portofolioTagService: PortofolioTagService,
  ) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query() query: { title?: string; category?: string; tag?: string },
  ): Promise<{ data: Portofolio[]; currentPage: number; totalPages: number }> {
    return this.portofolioService.findAll(page, pageSize, query);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('thumbnail', {
      storage: diskStorage({
        destination: 'public/img/portofolio',
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
    @Body(new ValidationPipe({ transform: true })) data: PortofolioDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      if (file) {
        data.thumbnail = file.path.replace(/\\/g, '/');
      }
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
  @UseInterceptors(
    FileInterceptor('thumbnail', {
      storage: diskStorage({
        destination: 'public/img/portofolio',
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
          await fs.access(porto.thumbnail);
          await fs.unlink(porto.thumbnail);
        } catch (error) {
          console.error(`Error deleting file: ${porto.thumbnail}`);
          console.error(error.message);
        }
        updatedData.thumbnail = file.path.replace(/\\/g, '/');
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
