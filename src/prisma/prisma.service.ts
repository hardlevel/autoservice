import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async createData(data, table) {}

  async upsertData(data, table, condition) {

  }

  async findOne(id: number|null, table: string, field: string|null = null, value: string|number|null = null) {
    try {
      if (id) {
        return await this[table].findUnique({
          where: { id }
        });
      } else if (field && value) {
        return await this[table].findFirst({
          where: {
            [field]: value,
          },
        });
      } else {
        throw new Error('Nenhum parâmetro de consulta informado');
      }
    } catch(error) {
      throw new Error(`Erro ao buscar dados na tabela: ${table}: ${error}`);
    }
  }

  async findAll(table: string, skip: number, take: number) {
    const data = await this[table].findMany({
      skip, take
    });
    return data;
  }

  async findMany(table: string, skip: number, take: number, field: string, value: string|number|boolean) {
    return this[table].findMany({
      skip, take,
      where: {
        [field]: value
      }
    });
  }

  async count(table: string) {
    return this[table].count();
  }

  async countFilter(table: string, field: string, value: string|number|boolean) {
    return this[table].count({
      where: {
        [field]: value
      }
    });
  }
}