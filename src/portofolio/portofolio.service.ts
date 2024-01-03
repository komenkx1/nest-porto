import { Injectable, Query } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Portofolio } from './portofolio.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class PortofolioService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 3,
    filterParams?: {
      title?: string;
      category?: string;
      tag?: string;
    },
  ): Promise<{ data: Portofolio[]; currentPage: number; totalPages: number }> {
    const perPage: number = Number(pageSize);
    const skip = (page - 1) * perPage;
    const query: any = {}; // Use `any` to allow dynamic assignment

    if (filterParams && filterParams.title) {
      // Use `contains` for a case-sensitive search
      query.title = {
        contains: filterParams.title,
      };
    }

    if (filterParams && filterParams.category) {
      query.category_id = Number(filterParams.category);
    }

    if (filterParams && filterParams.tag) {
      query.portofolioTag = {
        some: {
          tag: {
            name: filterParams.tag,
          },
        },
      };
    }

    const [data, total] = await Promise.all([
      this.databaseService.portofolio.findMany({
        where: query,
        skip,
        take: perPage,
        include: {
          user: true,
          category: true,
          portofolioTag: {
            include: {
              tag: true,
            },
          },
        },
      }),
      this.databaseService.portofolio.count({
        where: query, // Apply the same filter for counting
      }),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return { data, currentPage: page, totalPages };
  }

  async findById(id: number): Promise<Portofolio> {
    const portofolioId: number = Number(id);
    const portofolio: Portofolio =
      await this.databaseService.portofolio.findUnique({
        where: { id: portofolioId },
        include: {
          category: true,
          portofolioTag: {
            include: {
              tag: true,
            },
          },
        },
      });

    if (!portofolio) {
      throw new Error('Portofolio not found');
    }

    return portofolio;
  }

  async create(data: Prisma.portofolioCreateInput): Promise<Portofolio> {
    const portofolioTagData: any = data.portofolioTag || [];
    return this.databaseService.portofolio.create({
      data: {
        ...data,
        portofolioTag: {
          create: portofolioTagData,
        },
      },
    });
  }
  //update
  async update(
    id: number,
    data: Prisma.portofolioUpdateInput,
  ): Promise<Portofolio> {
    const portofolioId: number = Number(id);
    const portofolio: Portofolio = await this.findById(portofolioId);

    if (!portofolio) {
      throw new Error('Portofolio not found');
    }

    delete data.portofolioTag;
    return this.databaseService.portofolio.update({
      where: { id: portofolioId },
      data: {
        ...data,
      },
    });
  }

  //delete
  async delete(id: number): Promise<Portofolio> {
    const portofolioId: number = Number(id);
    const portofolio: Portofolio = await this.findById(portofolioId);

    if (!portofolio) {
      throw new Error('Portofolio not found');
    }
    // Delete associated portofolioTag records
    await this.databaseService.portofolio_tag.deleteMany({
      where: {
        portofolio_id: portofolioId,
      },
    });
    return this.databaseService.portofolio.delete({
      where: { id: portofolioId },
    });
  }
}
