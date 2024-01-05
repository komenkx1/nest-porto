import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PortofolioTagService } from './portofolio_tag.service';
import { PortofolioTag } from './portofolio_tag.entity';
import { ApiResponse } from '../api-response';
import { PortofolioTagDto } from './portofolio_tag.dto';

@Controller()
export class PortofolioTagController {
  constructor(private readonly portofolioTagService: PortofolioTagService) {}

  @Get()
  async findAll() {
    const data: PortofolioTag[] = await this.portofolioTagService.findAll();
    return ApiResponse.success(data);
  }

  @Post()
  async create(
    @Body() data: PortofolioTagDto[],
  ): Promise<ApiResponse<PortofolioTag[]>> {
    const result: PortofolioTag[] =
      await this.portofolioTagService.bulkCreate(data);
    return ApiResponse.success(result);
  }

  @Put(':id')
  async update(
    @Body() data: PortofolioTagDto,
    @Param('id') id: number,
  ): Promise<ApiResponse<PortofolioTag>> {
    const result: PortofolioTag = await this.portofolioTagService.update(
      id,
      data,
    );
    return ApiResponse.success(result);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<ApiResponse<PortofolioTag>> {
    const result: PortofolioTag = await this.portofolioTagService.remove(id);
    return ApiResponse.success(result);
  }
}
