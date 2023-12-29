import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { User } from './user.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(filterParams?: {
    name?: string;
    is_active?: boolean;
    title?: string;
  }): Promise<User[]> {
    const query = {};

    const isActive = Boolean(filterParams?.is_active);
    if (filterParams && filterParams.name) {
      query['name'] = filterParams.name;
    }

    if (filterParams && isActive) {
      query['is_active'] = isActive;
    }

    if (filterParams && filterParams.title) {
      query['title'] = filterParams.title;
    }
    return this.databaseService.user.findMany({
      where: query,
      include: {
        jargon: true,
      },
    });
  }

  async create(data: Prisma.userCreateInput): Promise<User> {
    return this.databaseService.user.create({ data });
  }

  async findById(id: number): Promise<User> {
    const userId: number = Number(id);
    const user: User = await this.databaseService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async update(id: number, data: Prisma.userUpdateInput): Promise<User> {
    const userId: number = Number(id);
    return this.databaseService.user.update({
      where: { id: userId },
      data,
    });
  }

  async delete(id: number): Promise<User> {
    const userId: number = Number(id);
    return this.databaseService.user.delete({
      where: { id: userId },
    });
  }
}
