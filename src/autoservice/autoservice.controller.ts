import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Logger, Query } from '@nestjs/common';
import { AutoserviceService } from './autoservice.service';
import { CreateAutoserviceDto } from './dto/create-autoservice.dto';
import { UpdateAutoserviceDto } from './dto/update-autoservice.dto';
import { UtilService } from '../util/util.service';
import fs from 'fs/promises';
import { ApiQuery } from '@nestjs/swagger';
@Controller('autoservice')
export class AutoserviceController {
  constructor(
    private readonly autoserviceService: AutoserviceService,
    private readonly util: UtilService
  ) { }

  // @Get('teste')
  // async test() {
  //   return this.autoserviceService.teste();
  // }

  @Get('past')
  async pastData() {
    // return this.autoserviceService.parseYear(2025);
    // return this.autoserviceService.pastData(2024, 0);
    await Promise.all([
      this.autoserviceService.parseYear(2025), // Executa para 2025
      this.autoserviceService.parseYear(2024)  // Executa para 2024
    ]);
    return { message: 'Processamento concluído para 2025 e 2024.' };
  }

  @Get('start')
  start() {
    try {
      this.autoserviceService.getData('2024-01-10T00:00:00', '2024-01-10T23:59:00');
    } catch (error) {
      throw new Error('Erro ao processar arquivos');
    }
  }

  @Get('teste')
  async teste() {
    const filePath = './dados.json';
    try {
      const data = await fs.readFile(filePath, 'utf8');
      const jsonData = JSON.parse(data);
      console.log(jsonData);
    } catch (error) {
      console.error('Erro ao carregar JSON:', error);
    }
  }

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
