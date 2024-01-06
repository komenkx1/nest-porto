import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { Tag } from './tag.entity';
import { ApiResponse } from '../api-response';
import { TagDto } from './tag.dto';
import { Public } from 'src/public.decorator';

@Controller()
export class TagController {
  constructor(private tagService: TagService) {}

  @Get()
  @Public()
  async findAll() {
    const data: Tag[] = await this.tagService.findAll();
    return ApiResponse.success(data);
  }

  @Post()
  async create(@Body() data: TagDto): Promise<ApiResponse<Tag>> {
    const result: Tag = await this.tagService.create(data);
    return ApiResponse.success(result);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() data: TagDto,
  ): Promise<ApiResponse<Tag>> {
    const result: Tag = await this.tagService.update(id, data);
    return ApiResponse.success(result);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<ApiResponse<Tag>> {
    const result: Tag = await this.tagService.remove(id);
    return ApiResponse.success(result);
  }
}
