import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Tag } from './tag.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class TagService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<Tag[]> {
    const data = await this.databaseService.tag.findMany();
    return data;
  }

  async create(data: Prisma.tagCreateInput): Promise<Tag> {
    const result = await this.databaseService.tag.create({ data });
    return result;
  }

  async findOne(id: number): Promise<Tag> {
    const tagId: number = Number(id);
    const tag: Tag = await this.databaseService.tag.findUnique({
      where: { id: tagId },
    });

    if (!tag) {
      throw new Error('Tag not found');
    }

    return tag;
  }

  async update(id: number, data: Prisma.tagUpdateInput): Promise<Tag> {
    const tagId: number = Number(id);
    const result = await this.databaseService.tag.update({
      where: { id: tagId },
      data,
    });
    return result;
  }

  async remove(id: number): Promise<Tag> {
    const tagId: number = Number(id);
    const result = await this.databaseService.tag.delete({
      where: { id: tagId },
    });
    return result;
  }
}
