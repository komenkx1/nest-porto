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
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UserDto } from './user.dto';
import * as fs from 'fs/promises';
import * as path from 'path';
import { User } from './user.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

const imageFileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    const error = new BadRequestException('Only image files are allowed!');
    return cb(error, false);
  }
  cb(null, true);
};
@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private cloudinary: CloudinaryService,
  ) {}

  //crud
  @Get()
  async findAll(
    @Query() query: { name?: string; is_active?: boolean; title?: string },
  ) {
    const user: User[] = await this.userService.findAll(query);
    return {
      message: 'User fecched successfully',
      data: user,
      code: 200,
    };
  }

  @Post()
  @UseInterceptors(FileInterceptor('profileImage'))
  async create(
    @Body() data: UserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      await this.cloudinary
        .uploadImage(file, 'profile_image')
        .then((result) => {
          const imageUrl = result.secure_url;
          if (file) {
            data.profileImage = imageUrl;
          }
        })
        .catch((error) => {
          console.error('Cloudinary upload error:', error);
          throw new BadRequestException('Invalid file type.');
        });

      const newUser: User = await this.userService.create({ ...data });
      //delete user password
      delete newUser.password;
      return { message: 'User created successfully', data: newUser, code: 200 };
    } catch (error) {
      throw new BadRequestException('Validation failed', error.message);
    }
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('profileImage'))
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
        try {
          await this.cloudinary.deleteImage(user.profileImage, 'profile_image');
        } catch (error) {
          console.error(`Error deleting file: ${user.profileImage}`);
          console.error(error.message);
        }

        await this.cloudinary
          .uploadImage(file, 'profile_image')
          .then((result) => {
            const imageUrl = result.secure_url;
            if (file) {
              updatedData.profileImage = imageUrl;
            }
          })
          .catch((error) => {
            console.error('Cloudinary upload error:', error);
            throw new BadRequestException('Invalid file type.');
          });
      }
      const userEdited: User = await this.userService.update(id, updatedData);
      delete userEdited.password;

      return {
        message: 'User updated successfully',
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
      const user = await this.userService.findById(id);
      if (!user) {
        throw new BadRequestException('User not found');
      }
      if (user.profileImage) {
        try {
          await fs.access(user.profileImage);
          await fs.unlink(user.profileImage);
        } catch (error) {
          console.error(`Error deleting file: ${user.profileImage}`);
          console.error(error.message);
        }
      }

      await this.userService.delete(id);
      delete user.password;
      return { message: 'User deleted successfully', data: user, code: 200 };
    } catch (error) {
      throw new BadRequestException('Delete failed', error.message);
    }
  }

  //transaction
  @Post('set-active-user/:id')
  async setActiveUser(@Param('id') id: number, @Body() updatedData: UserDto) {
    const user: User = await this.userService.findById(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const activeUser: User[] = await this.userService.findAll({
      is_active: true,
    });

    if (activeUser.length > 0) {
      await this.userService.update(activeUser[0].id, { is_active: false });
    }

    await this.userService.update(user.id, updatedData);

    return { message: 'User updated successfully' };
  }
}
