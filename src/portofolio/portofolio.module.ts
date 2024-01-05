import { Module } from '@nestjs/common';
import { PortofolioController } from './portofolio.controller';
import { PortofolioService } from './portofolio.service';
import { PortofolioTagService } from 'src/portofolio_tag/portofolio_tag.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  providers: [PortofolioService, PortofolioTagService],
  controllers: [PortofolioController],
})
export class PortofolioModule {}
