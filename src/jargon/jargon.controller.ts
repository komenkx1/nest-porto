/* eslint-disable prettier/prettier */

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { JargonService } from './jargon.service';
import { Jargon } from './jargon.enitity';
import { JargonDto } from './jargon.dto';

@Controller()
export class JargonController {
  constructor(private readonly jargonService: JargonService) {}

  @Get()
  async findAll() {
    const dataJargon: Jargon[] = await this.jargonService.findAll();
    return {
      message: 'User fecched successfully',
      data: dataJargon,
      code: 200,
    };
  }

  @Post()
  async create(@Body() data: JargonDto) {
    const result: Jargon = await this.jargonService.create(data);
    return {
      message: 'User fecched successfully',
      data: result,
      code: 200,
    };
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() data: JargonDto) {
    const result: Jargon = await this.jargonService.update(id, data);
    return {
      message: 'User fecched successfully',
      data: result,
      code: 200,
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    const result: Jargon = await this.jargonService.remove(id);
    return {
      message: 'User fecched successfully',
      data: result,
      code: 200,
    };
  }
}
