import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { PortofolioTag } from './portofolio_tag.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class PortofolioTagService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<PortofolioTag[]> {
    const data: PortofolioTag[] =
      await this.databaseService.portofolio_tag.findMany();
    return data;
  }

  async findOne(id: number): Promise<PortofolioTag> {
    const portofolioTagId: number = Number(id);
    const data: PortofolioTag =
      await this.databaseService.portofolio_tag.findUnique({
        where: { id: portofolioTagId },
      });
    return data;
  }

  async create(data: Prisma.portofolio_tagCreateInput): Promise<PortofolioTag> {
    const newData: PortofolioTag =
      await this.databaseService.portofolio_tag.create({
        data,
      });
    return newData;
  }

  //bulk add portofolio tag

  async bulkCreate(
    data: Prisma.portofolio_tagCreateManyInput[],
  ): Promise<PortofolioTag[]> {
    await this.databaseService.portofolio_tag.createMany({
      data,
    });

    return;
  }

  async update(
    id: number,
    data: Prisma.portofolio_tagUncheckedCreateInput,
  ): Promise<PortofolioTag> {
    const portofolioTagId: number = Number(id);
    const newData: PortofolioTag =
      await this.databaseService.portofolio_tag.update({
        where: { id: portofolioTagId },
        data,
      });
    return newData;
  }

  async remove(id: number): Promise<PortofolioTag> {
    const portofolioTagId: number = Number(id);

    const deletedData = await this.databaseService.portofolio_tag.delete({
      where: { id: portofolioTagId },
    });
    return deletedData;
  }
}
