import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Certificate } from './certificate.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class CertificateService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<any> {
    const data = await this.databaseService.certificate.findMany({
      include: {
        user: true,
      },
    });

    return data;
  }

  async findOne(id: number): Promise<Certificate> {
    const data = await this.databaseService.certificate.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
      },
    });

    return data;
  }

  async create(data: Prisma.certificateCreateInput): Promise<Certificate> {
    const newData = await this.databaseService.certificate.create({
      data,
    });

    return newData;
  }

  async update(
    id: number,
    data: Prisma.certificateUpdateInput,
  ): Promise<Certificate> {
    const newData = await this.databaseService.certificate.update({
      where: {
        id,
      },
      data,
    });

    return newData;
  }

  async delete(id: number): Promise<Certificate> {
    const deletedData = await this.databaseService.certificate.delete({
      where: {
        id,
      },
    });

    return deletedData;
  }
}
