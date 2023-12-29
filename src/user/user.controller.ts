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
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UserDto } from './user.dto';
import * as fs from 'fs/promises';
import * as path from 'path';

const imageFileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    const error = new BadRequestException('Only image files are allowed!');
    return cb(error, false);
  }
  cb(null, true);
};
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('profileImage', {
      storage: diskStorage({
        destination: 'public/img',
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
    @Body(new ValidationPipe({ transform: true })) data: UserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      if (file) {
        data.profileImage = file.path.replace(/\\/g, '/');
      }
      this.userService.create({ ...data });
      return { message: 'User created successfully' };
    } catch (error) {
      throw new BadRequestException('Validation failed', error.message);
    }
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('profileImage', {
      storage: diskStorage({
        destination: 'public/img',
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
    @Body(new ValidationPipe({ transform: true })) updatedData: UserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const user = await this.userService.findById(id);
      if (!user) {
        throw new BadRequestException('User not found');
      }

      if (file) {
        user.profileImage ? await fs.unlink(user.profileImage) : null;
        updatedData.profileImage = file.path.replace(/\\/g, '/');
      }
      await this.userService.update(id, updatedData);

      return { message: 'User updated successfully' };
    } catch (error) {
      throw new BadRequestException('Update failed', error.message);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    try {
      const user = await this.userService.findById(id);
      if (!user) {
        throw new BadRequestException('User not found');
      }
      user.profileImage ? await fs.unlink(user.profileImage) : null;
      await this.userService.delete(id);
      return { message: 'User deleted successfully' };
    } catch (error) {
      throw new BadRequestException('Delete failed', error.message);
    }
  }
}
