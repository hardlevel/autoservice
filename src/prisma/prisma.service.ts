import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from "@prisma-clients/clients/psql";
import { CustomError } from '../common/errors/custom-error';
import { UtilService } from '../util/util.service';
import { DateService } from '../util/date.service';
// import { PrismaClient } from './postgres';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(
    private readonly util: UtilService,
    private readonly dates: DateService
  ) { super(); }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
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

  async findAll(table: string, skip: number = 1, take: number = 50, ...relations) {
    if (skip == 0) skip++;

    const total = await this.count(table);
    const data = await this[table].findMany({
      skip: (skip - 1) * take,
      take,
      include: relations && relations.length > 0 ? Object.fromEntries(relations.map(relation => [relation, true])) : undefined
    });
    const totalPages = Math.ceil(total / take);
    return {
      total,
      page: skip,
      items: data.length,
      data,
      next: skip < totalPages ? skip + 1 : null,
      previous: skip > 1 ? skip - 1 : null,
    }
  }

  async findMany(table: string, field: string, value: string | number | boolean, skip: number = 1, take: number = 50, ...relations) {
    if (skip == 0) skip++;

    const total = await this.countFilter(table, field, value);
    const data = this[table].findMany({
      skip: (skip - 1) * take,
      take,
      where: {
        [field]: value
      },
      include: relations && relations.length > 0 ? Object.fromEntries(relations.map(relation => [relation, true])) : undefined
    });
    const totalPages = Math.ceil(total / take);
    return {
      total,
      page: skip,
      items: data.length,
      data,
      next: skip < totalPages ? skip + 1 : null,
      previous: skip > 1 ? skip - 1 : null,
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
    uniqueFields: any,
    id: any = null,
    parent: any = null
  ) {
    if (table == 'ck7001') {
      if (!originalData.numero_da_nota_fiscal) {
        console.error('sem nf!')
      }
    }
    // console.log('validando nf', originalData.numero_da_nota_fiscal)

    const data = { ...this.util.extractData(originalData, fields), ...(id && parent ? [parent] : id) };
    const where = this.util.extractUnique(data, uniqueFields, table);

    const ck = await this.findUnique(table, where);

    try {
      if (ck) {
        // if (table == 'ck7001') console.log('existe', ck.numero_da_nota_fiscal)
        return this[table].update({ where, data });
      } else {
        // if (table == 'ck7001') console.log('existe', ck.numero_da_nota_fiscal)
        return this[table].create({ data })
      }
    } catch (error) {
      console.error(`Erro ao salvar ${table}`, data);
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

  async logError(data) {
    const { category, message, code, params, cause, originalData } = data;

    await this.errorLogger.create({
      data: {
        time: new Date(),
        category,
        message,
        code,
        params: JSON.stringify(params),
        originalData: JSON.stringify(originalData)
      }
    })

    debugger
    throw new CustomError(
      message,
      code,
      category,
      new Date().toString(),
      data,
      cause
    )
  }

  async recordDaily(year: number, month: number, day: number, hour: number, minute: number, status: string, field?: any, value?: any) {
    return this.dailyCk.upsert({
      where: {
        daily: {
          day, month, year, hour, minute
        }
      },
      create: {
        day, month, year, hour, minute,
        [field]: value
      },
      update: {
        status,
        ...(field && value ? { [field]: value } : {}),
      }
    });
  }

  async loadDaily(year: number, month: number, day: number, hour: number, minute: number) {
    return this.dailyCk.findUnique({
      where: {
        daily: {
          day, month, year, hour, minute
        }
      },
    });
  }

  async saveLastSearch(startDate, endDate) {
    return this.lastSearch.upsert({
      where: { id: 1 },
      create: {
        id: 1, startDate, endDate
      },
      update: { startDate, endDate }
    });
  }

  async getLastSearch() {
    return this.lastSearch.findFirst({
      where: { id: 1 }
    });
  }

  async saveLastParams(data) {
    return this.lastParams.upsert({
      where: { year: parseInt(data.year) },
      create: data,
      update: data
    });
  }

  async getLastParams(year) {
    return this.lastParams.findFirst({
      where: { year }
    });
  }

  async clearLastParam(year) {
    return this.lastParams.delete({
      where: { year }
    });
  }

  async changeStatusLastParam(year) {
    return this.lastParams.update({
      where: { year },
      data: { status: true }
    });
  }
}
