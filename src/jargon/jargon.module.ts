/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { JargonController } from './jargon.controller';
import { JargonService } from './jargon.service';

@Module({
  providers: [JargonService],
  controllers: [JargonController],
})
export class JargonModule {}
