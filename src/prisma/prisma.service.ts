import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UtilService } from '../util/util.service';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly util: UtilService) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  // async createData(data, table) {}

  // async upsertData(data, table, condition) {

  // }

  // async create(table, data) {

  // }

  async findOne(id: number | null, table: string, field: string | null = null, value: string | number | null = null) {
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
    } catch (error) {
      throw new Error(`Erro ao buscar dados na tabela: ${table}: ${error}`);
    }
  }

  async findAll(table: string, skip: number = 1, take: number = 50) {
    const total = await this.count(table);
    const data = await this[table].findMany({
      skip: (skip - 1) * take,
      take,
    });
    const totalPages = Math.ceil(total / take);
    return {
      total,
      page: skip,
      items: data.length,
      data,
      ...(take < totalPages && { next: take + 1 }),
      ...(skip > 1 && { previous: skip - 1 }),
    }
  }

  async findMany(table: string, field: string, value: string | number | boolean, skip: number = 1, take: number = 50) {
    const total = await this.countFilter(table, field, value);
    const data = this[table].findMany({
      skip: (skip - 1) * take,
      take,
      where: {
        [field]: value
      }
    });
    const totalPages = Math.ceil(total / take);
    return {
      total,
      page: skip,
      items: data.length,
      data,
      ...(skip < totalPages && { next: skip + 1 }),
      ...(skip > 1 && { previous: skip - 1 }),
    }
  }

  async count(table: string) {
    return this[table].count();
  }

  async countFilter(table: string, field: string, value: string | number | boolean) {
    return this[table].count({
      where: {
        [field]: value
      }
    });
  }

  async findUnique(table: string, where) {
    return this[table].findUnique({ where });
  }

  async update(table: string, id: string, data: any) {
    return this[table].update({
      where: { id },
      data
    })
  }

  async create(table: string, data: any) {
    return this[table].create({ data });
  }

  async proccessCk(
    table: string,
    originalData: any,
    fields: any,
    uniqueFields: any
  ) {
    if (table == 'ck7001') {
      if (!originalData.numero_da_nota_fiscal) {
        console.error('sem nf!')
      }
    }
    console.log('validando nf', originalData.numero_da_nota_fiscal)
    const data = this.util.extractData(originalData, fields);
    const where = this.util.extractUnique(data, uniqueFields, table);

    const ck = await this.findUnique(table, where);

    if (ck) {
      if (table == 'ck7001') console.log('existe', ck.numero_da_nota_fiscal)
      return this[table].update({ where, data }).catch(error => {
        console.error(`erro ao salvar ${table}`, error, 'dados: ', data)
      });
    } else {
      if (table == 'ck7001') console.log('existe', ck.numero_da_nota_fiscal)
      return this[table].create({ data }).catch(error => {
        console.error(`erro ao salvar ${table}`, error, 'dados: ', data, originalData[table])
      });
    }
  }

  async logErrors(
    error: unknown,
    message: string,
    startDate: string,
    endDate: string,
    category: string,
    code: string = null,
    data: any = null) {
    const payload = {
      category,
      message,
      startDate,
      endDate,
      ...(code ? { code } : {}),
      ...(data ? { data } : {}),
    };

    // return this.errorLog.upsert({
    //   where: {
    //     error_log: {
    //       category,
    //       message,
    //       startDate,
    //       endDate
    //     }
    //   },
    //   create: payload,
    //   update: payload
    // })
  }
}