import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Category } from './category.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<Category[]> {
    return this.databaseService.category.findMany();
  }

  async create(data: Prisma.categoryCreateInput): Promise<Category> {
    return this.databaseService.category.create({ data });
  }

  async findOne(id: number): Promise<Category> {
    const categoryId: number = Number(id);
    const category: Category = await this.databaseService.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  }

  async update(
    id: number,
    data: Prisma.categoryUpdateInput,
  ): Promise<Category> {
    const categoryId: number = Number(id);
    return this.databaseService.category.update({
      where: { id: categoryId },
      data,
    });
  }

  async remove(id: number): Promise<Category> {
    const categoryId: number = Number(id);
    return this.databaseService.category.delete({
      where: { id: categoryId },
    });
  }
}
