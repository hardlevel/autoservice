import { Inject, Injectable } from '@nestjs/common';
import { CreateAutoserviceDto } from './dto/create-autoservice.dto';
import { UpdateAutoserviceDto } from './dto/update-autoservice.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { Message } from "@aws-sdk/client-sqs";
import { SqsConsumerEventHandler, SqsMessageHandler, SqsService } from "@ssut/nestjs-sqs";
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AllExceptionsFilter } from '../all.exceptions';
@Injectable()
export class AutoserviceService {
  constructor(
    @InjectQueue('autoservice') private readonly autoserviceQueue: Queue,
    private readonly config: ConfigService,
    private readonly sqsService: SqsService,
    private readonly prisma: PrismaService
  ) { }

  @SqsMessageHandler('autoservice', false)
  async handleMessage(message: Message) {
    // console.log(this.config.get('SQS_URL'))
    // console.log(message);
    const msgBody = JSON.parse(message.Body);
    if (msgBody) console.log('mensagem recebida');
    try {
      const job = await this.autoserviceQueue.add('autoservice', msgBody, {
        delay: 2000,
        attempts: 10,
      });
    } catch (error) {
      console.log('consumer error', JSON.stringify(error));
    }
  }

  getCurrentDate(hoursToSubtract = 0) {
    const now = new Date();

    if (typeof hoursToSubtract === 'number') {
      now.setHours(now.getHours() - hoursToSubtract);
    }

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  getToken() {
    return fetch(this.config.get('TOKEN_URL'), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        client_id: this.config.get('API_ID'),
        client_secret: this.config.get('API_SECRET'),
        grant_type: 'client_credentials',
      })
    })
      .then(async response => {
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Error ${response.status}: ${errorData.error_description || errorData.error || 'Unknown error'}`);
        }
        return response.json();
      })
      // .then(data => {
      //   console.log("Token obtained:", data.access_token);
      // })
      .catch(error => {
        console.error("Failed to get token:", error.message);
      });
  }

  async getData() {
    let token, url;

    try {
      url = new URL('findByPeriod', this.config.get('API_URL'));
      // url.searchParams.append('dataInicio', this.getCurrentDate(1));
      // url.searchParams.append('dataFim', this.getCurrentDate());
      url.searchParams.append('dataInicio', '2025-01-02T00:41:37');
      url.searchParams.append('dataFim', '2025-01-03T23:41:37');
      token = await this.getToken();
    } catch (error) {
      console.log('Falha ao obter o token:', error);
    }

    return await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token.access_token}`
      }
    })
      .then(async response => {
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Error ${response.status}: ${errorData.error_description || errorData.error || 'Unknown error'}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("Dados solicitados", data);
      })
      .catch(error => {
        console.error("Failed to get token:", error.message);
      });
  }

  async addJob(data: any) {
    try {
      await this.autoserviceQueue.add('process-autoservice-job', data);
      console.log('Job added to queue:', data);
    } catch (error) {
      console.log(error);
      // throw new AllExceptionsFilter();
    }

  }

  create(createAutoserviceDto: CreateAutoserviceDto) {
    return 'This action adds a new autoservice';
  }

  findAll() {
    return `This action returns all autoservice`;
  }

  findOne(id: number) {
    return `This action returns a #${id} autoservice`;
  }

  update(id: number, updateAutoserviceDto: UpdateAutoserviceDto) {
    return `This action updates a #${id} autoservice`;
  }

  remove(id: number) {
    return `This action removes a #${id} autoservice`;
  }

  prepareData(fields, data) {
    // console.log('Fields:', fields);  // Verifique os campos a serem processados
    // console.log('Data:', data);      // Verifique os dados completos
    return fields.reduce((acc, field) => {
      if (data[field] !== undefined) {
        // Verifique o valor de data[field] para garantir que ele não é undefined
        console.log(`Processando campo: ${field} -> ${data[field]}`);
        acc[field] = field.includes('data_') ? new Date(data[field]) : data[field];
      }
      return acc;
    }, {});
  }

  extractFieldNames(obj) {
    return Object.keys(obj).filter(key => {
      return !(typeof obj[key] === 'string' && obj[key].startsWith('CK'));
    });
  }

  async mockData(format) {
    const path = require('path');
    const fs = require('fs').promises;
    try {
      const filePath = path.join(process.cwd(), `${format}.json`);
      const fileContent = await fs.readFile(filePath, 'utf8');
      const data = JSON.parse(fileContent);
      const job = await this.autoserviceQueue.add('autoservice', data, {
        delay: 2000,
        attempts: 10,
      });
      // return data;
      return;
    } catch (err) {
      console.error('Erro ao ler o arquivo:', err);
      throw new Error('Falha ao carregar os dados do mock');
    }
  }

  extractData(data, fields) {
    const newData = fields.reduce((acc, field) => {
      if (data[field] != null && data[field] !== '') {
        if (field.startsWith('data_')) {
          acc[field] = new Date(data[field]);
        // } else if (field.startsWith('valor_')) {
        //   acc[field] = data[field].toLocaleString('pt-BR');
        } else {
          acc[field] = data[field];
        }
      }
      return acc;
    }, {});

    return newData;
  };

  formatadorReais(value) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }
}
