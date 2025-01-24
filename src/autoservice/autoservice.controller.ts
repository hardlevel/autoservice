import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { AutoserviceService } from './autoservice.service';
import { CreateAutoserviceDto } from './dto/create-autoservice.dto';
import { UpdateAutoserviceDto } from './dto/update-autoservice.dto';

@Controller('autoservice')
export class AutoserviceController {
  constructor(private readonly autoserviceService: AutoserviceService) { }

  @Get('teste')
  teste() {
    const data = {
      nome_do_cliente: "OMAR ANGEL AZAD BORGES",
      endereco: "AVE DOM VICENTE SCHERER",
      fonte_pagadora: 1,
      numero_da_nota_fiscal: "020247143",
      serie_da_nota_fiscal: "M",
      data_e_hora_da_emissao_da_nota_fiscal: "2024-12-10T17:09:00",
      numero_da_os: "0024296",
      data_e_hora_da_abertura_da_os: "2024-12-10T11:18:00",
      valor_total_liquido_das_pecas_na_nota_fiscal: 722.67,
      valor_total_liquido_da_mao_de_obra_na_nota_fiscal: 611.33,
      numero_do_dn: "130",
      data_e_hora_do_fechamento_da_os: "2024-12-10T17:09:00",
      CK7002: {
        indicador: "F",
        cpf_cnpj: "70469888202",
        numero: "499",
        complemento: "201",
        bairro: "CENTRO",
        cidade: "TAPES",
        uf: "RS",
        cep: "96760000",
        telefones: [
          {
            numero: "51-993407360",
            descricao: "celular",
            autoriza_pesquisa: true,
            autoriza_contato: true
          }
        ],
        emails: [
          {
            email: "junior.azadb@gmail.com",
            descricao: "pessoal",
            autoriza_pesquisa: true,
            autoriza_contato: true
          }
        ]
      },
    }
    const fields = ["data_e_hora_da_abertura_da_os", "valor_total_liquido_das_pecas_na_nota_fiscal", "nome_do_cliente", "endereco", "fonte_pagadora", "numero_da_nota_fiscal", "serie_da_nota_fiscal"];

    const newData = this.autoserviceService.extractData(data,fields);
    // console.log(newData);

      // // Lançando uma exceção para testar o filtro
      // throw new HttpException('Erro personalizado no controller!', HttpStatus.BAD_REQUEST);


    // this.autoserviceService.addJob({ teste: 'aaa' })
  }

  @Get('past')
  async pastData() {
    return this.autoserviceService.pastData(2024, 0, 10);
  }

  @Get('find')
  async find() {
    return await this.autoserviceService.findOne(0);
  }

  @Get('findAll')
  async findAll() {
    return await this.autoserviceService.findAll('ck6011');
  }

  @Get('findmany')
  async findMany() {
    return await this.autoserviceService.findMany('ck6011', 1, 50, 'numero_da_os', '689485');
  }

  @Get('date')
  processDate() {
    return this.autoserviceService.retro(2025, 1, 23, 11);
  }

  @Get('token')
  getToken() {
    this.autoserviceService.getToken();
  }

  @Get('start')
  start() {
    try {
      this.autoserviceService.getData('2024-01-10T00:00:00', '2024-01-10T23:59:00');
    } catch(error) {
      throw new Error('Erro ao processar arquivos');
    }
  }

  @Get('mock')
  async mock() {
    return this.autoserviceService.mockData('CK3001');
  }

  @Post()
  create(@Body() createAutoserviceDto: CreateAutoserviceDto) {
    return this.autoserviceService.create(createAutoserviceDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.autoserviceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAutoserviceDto: UpdateAutoserviceDto) {
    return this.autoserviceService.update(+id, updateAutoserviceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.autoserviceService.remove(+id);
  }
}
