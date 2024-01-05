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
import { ApiResponse } from 'src/api-response';
import { JargonDto } from './jargon.dto';

@Controller()
export class JargonController {
  constructor(private readonly jargonService: JargonService) {}

  @Get()
  async findAll() {
    const dataJargon: Jargon[] = await this.jargonService.findAll();
    return ApiResponse.success(dataJargon);
  }

  @Post()
  async create(@Body() data: JargonDto): Promise<ApiResponse<Jargon>> {
    const result: Jargon = await this.jargonService.create(data);
    return ApiResponse.success(result);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() data: JargonDto,
  ): Promise<ApiResponse<Jargon>> {
    const result: Jargon = await this.jargonService.update(id, data);
    return ApiResponse.success(result);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<ApiResponse<Jargon>> {
    const result: Jargon = await this.jargonService.remove(id);
    return ApiResponse.success(result);
  }
}
