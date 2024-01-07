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
import { UserDto } from './user.dto';
import { User } from './user.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { JargonService } from 'src/jargon/jargon.service';
import { JargonDto } from 'src/jargon/jargon.dto';
import { Jargon } from 'src/jargon/jargon.enitity';
import { ApiResponse } from 'src/api-response';
import * as bcrypt from 'bcrypt';
import { Public } from '../public.decorator';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private cloudinary: CloudinaryService,
    private readonly jargonService: JargonService,
  ) {}

  //crud
  @Get()
  @Public()
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
    @Body(new ValidationPipe({ transform: true })) data: UserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
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
    }
    try {
      if (data.password) {
        data.password = bcrypt.hashSync(data.password, 10);
      }
      const newUser: User = await this.userService.create({ ...data });
      //delete user password
      delete newUser.password;
      return {
        message: 'User created successfully',
        data: newUser,
        code: 200,
      };
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
      } else {
        delete updatedData.profileImage;
      }
      if (updatedData.password !== '') {
        updatedData.password = bcrypt.hashSync(updatedData.password, 10);
      } else {
        delete updatedData.password;
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
          await this.cloudinary.deleteImage(user.profileImage, 'profile_image');
        } catch (error) {
          console.error(`Error deleting file: ${user.profileImage}`);
          console.error(error.message);
        }
      }
      user.jargon ? await this.jargonService.removeByUserId(id) : null;
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

  @Post('jargon/:id')
  async setJargon(@Param('id') id: number, @Body() updatedData: JargonDto) {
    const userId = Number(id);
    const jargon: Jargon = await this.jargonService.findByUserId(userId);

    if (jargon) {
      await this.jargonService.update(jargon.id, updatedData);
    } else {
      await this.jargonService.create({ ...updatedData });
    }

    return ApiResponse.success(updatedData);
  }
}
