/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Jargon } from './jargon.enitity';
import { Prisma } from '@prisma/client';

@Injectable()
export class JargonService {
  constructor(private readonly databaseService: DatabaseService) {}
  async findAll() {
    return this.databaseService.jargon.findMany();
  }

  async create(data: Prisma.jargonCreateInput): Promise<Jargon> {
    const result: Jargon = await this.databaseService.jargon.create({ data });
    return result;
  }

  async findOne(id: number): Promise<Jargon> {
    const jargonId: number = Number(id);
    const result: Jargon = await this.databaseService.jargon.findUnique({
      where: { id: jargonId },
    });
    return result;
  }

  findByUserId(userId: number): Promise<Jargon> {
    const idUser = Number(userId);
    return this.databaseService.jargon.findUnique({
      where: { user_id: idUser },
    });
  }
  removeByUserId(userId: number) {
    const idUser = Number(userId);
    return this.databaseService.jargon.delete({
      where: { user_id: idUser },
    });
  }

  async update(id: number, data: Prisma.jargonUpdateInput): Promise<Jargon> {
    const jargonId: number = Number(id);
    const result: Jargon = await this.databaseService.jargon.update({
      where: { id: jargonId },
      data,
    });
    return result;
  }

  async remove(id: number): Promise<Jargon> {
    const jargonId: number = Number(id);
    const result: Jargon = await this.databaseService.jargon.delete({
      where: { id: jargonId },
    });
    return result;
  }
}
