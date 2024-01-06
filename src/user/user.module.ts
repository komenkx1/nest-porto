import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { JargonService } from 'src/jargon/jargon.service';

@Module({
  imports: [CloudinaryModule],
  providers: [UserService, JargonService],
  controllers: [UserController],
})
export class UserModule {}
