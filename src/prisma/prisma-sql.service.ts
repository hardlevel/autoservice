import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CustomError } from '../common/errors/custom-error';
import { UtilService } from '../util/util.service';

@Injectable()
export class PrismaSqlService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly util: UtilService) {
    super()
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}