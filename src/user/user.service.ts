import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { User } from './user.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<User[]> {
    return this.databaseService.user.findMany();
  }

  async create(data: Prisma.userCreateInput): Promise<User> {
    return this.databaseService.user.create({ data });
  }

  async findById(id: number): Promise<User> {
    const userId: number = Number(id);
    return this.databaseService.user.findUnique({
      where: { id: userId },
    });
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
