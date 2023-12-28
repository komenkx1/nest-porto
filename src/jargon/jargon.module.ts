import { Module } from '@nestjs/common';
import { JargonController } from './jargon.controller';

@Module({
  controllers: [JargonController]
})
export class JargonModule {}
