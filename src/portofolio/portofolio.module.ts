import { Module } from '@nestjs/common';
import { PortofolioController } from './portofolio.controller';

@Module({
  controllers: [PortofolioController]
})
export class PortofolioModule {}
