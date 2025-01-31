import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { AutoserviceService } from './autoservice.service';
import { CreateAutoserviceDto } from './dto/create-autoservice.dto';
import { UpdateAutoserviceDto } from './dto/update-autoservice.dto';
import { AssobravService } from './assobrav.service';
import { UtilService } from '../util/util.service';

@Controller('autoservice')
export class AutoserviceController {
  constructor(
    private readonly autoserviceService: AutoserviceService,
    private readonly assobravService: AssobravService,
    private readonly util: UtilService
  ) { }

  @Get('past')
  async pastData() {
    // return this.autoserviceService.parseYear(2024);
    return this.autoserviceService.pastData(2024, 11, 12);
  }

  @Get('clients')
  async () {
    return this.assobravService.cadastroClientes();
    // return this.autoserviceService.pastData(2024, 0);
  }

  @Get('start')
  start() {
    try {
      this.autoserviceService.getData('2024-01-10T00:00:00', '2024-01-10T23:59:00');
    } catch(error) {
      throw new Error('Erro ao processar arquivos');
    }
  }
}
