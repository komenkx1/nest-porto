import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './category.entity';
import { ApiResponse } from '../api-response';
import { CategoryDto } from './category.dto';
import { Public } from 'src/public.decorator';

@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @Public()
  async findAll() {
    const data: Category[] = await this.categoryService.findAll();
    return ApiResponse.success(data);
  }

  @Post()
  async create(@Body() data: CategoryDto): Promise<ApiResponse<Category>> {
    const result: Category = await this.categoryService.create(data);
    return ApiResponse.success(result);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() data: CategoryDto,
  ): Promise<ApiResponse<Category>> {
    const result: Category = await this.categoryService.update(id, data);
    return ApiResponse.success(result);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<ApiResponse<Category>> {
    const result: Category = await this.categoryService.remove(id);
    return ApiResponse.success(result);
  }
}
