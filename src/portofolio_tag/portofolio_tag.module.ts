import { Module } from '@nestjs/common';
import { PortofolioTagService } from './portofolio_tag.service';
import { PortofolioTagController } from './portofolio_tag.controller';

@Module({
  providers: [PortofolioTagService],
  controllers: [PortofolioTagController]
})
export class PortofolioTagModule {}
