import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Logger, Query } from '@nestjs/common';
import { AutoserviceService } from './autoservice.service';
import { UtilService } from '../util/util.service';
import { ApiQuery } from '@nestjs/swagger';
import { Cron, CronExpression } from '@nestjs/schedule';
@Controller('autoservice')
export class AutoserviceController {
  constructor(
    private readonly autoserviceService: AutoserviceService,
    private readonly util: UtilService
  ) { }

  @Cron(CronExpression.EVERY_HOUR)
  @Get('request')
  async request() {
    try {
      const { startDate, endDate } = this.util.getDatesTimeZoneFormat();
      await this.autoserviceService.getData(startDate, endDate);
      return { message: 'Processo concluído com sucesso' };
    } catch (error) {
      return { message: 'Erro ao processar a solicitação', error: error.message };
    }
  }

  // @Get('past')
  // async pastData() {
  // await Promise.all([
  //   this.autoserviceService.startProcess(2024),
  //   this.autoserviceService.startProcess(2025),
  // ]);
  // return { message: 'Processamento concluído para 2025 e 2024.' };
  // }

  @Get('clients')
  async clients() {
    return this.autoserviceService.getClients();
  }

  @Get('servicos')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'year', required: false, type: Number })
  @ApiQuery({ name: 'month', required: false, type: Number })
  async services(@Query('page') page?: number, @Query('year') year?: number, @Query('month') month?: number) {
    return this.autoserviceService.getServicos(page, year, month);
  }

  @Get('servicos-ano')
  @ApiQuery({ name: 'year', required: false, type: Number })
  async servicesYear(@Query('year') year?: number) {
    return this.autoserviceService.getServicosYear(year);
  }

  @Get('servicos-mes')
  @ApiQuery({ name: 'year', required: true, type: Number })
  @ApiQuery({ name: 'month', required: true, type: Number })
  async servicesMontly(@Query('year') year: number, @Query('month') month: number) {
    return this.autoserviceService.getServicosMonth(year, month);
  }

  @Get('pecas')
  async parts() {
    return this.autoserviceService.getPecas();
  }

  @Get('nfs')
  async nfs() {
    return this.autoserviceService.getNfs();
  }

  @Get('servicos-estado')
  @ApiQuery({ name: 'year', required: true, type: Number })
  @ApiQuery({ name: 'month', required: true, type: Number })
  async servicesState(@Query('year') year: number, @Query('month') month: number) {
    return this.autoserviceService.getServicesStateMonth(year, month);
  }

  @Get('servicos-estado-ano')
  @ApiQuery({ name: 'year', required: false, type: Number })
  async servicesStateYear(@Query('year') year?: number) {
    return this.autoserviceService.getServicesStateYear(year);
  }
}
