import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
    this.$use(this.softDeleteMiddleware);
    this.$use(this.querySoftdelMiddleware);
  }
  softDeleteMiddleware: Prisma.Middleware = async (params, next) => {
    if (params.action === 'delete') {
      return next({
        ...params,
        action: 'update',
        args: {
          ...params.args,
          data: {
            deletedAt: new Date(),
          },
        },
      });
    }
    return next(params);
  };

  querySoftdelMiddleware: Prisma.Middleware = async (params, next) => {
    if (params.action === 'findUnique' || params.action === 'findFirst') {
      return next({
        ...params,
        action: 'findFirst',
        args: {
          ...params.args,
          where: {
            ...params.args?.where,
            deletedAt: null,
          },
        },
      });
    }
    if (params.action === 'findMany') {
      return next({
        ...params,
        args: {
          ...params.args,
          where: {
            ...params.args?.where,
            deletedAt: null,
          },
        },
      });
    }
    return next(params);
  };

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
