import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateAutoserviceDto } from './dto/create-autoservice.dto';
import { UpdateAutoserviceDto } from './dto/update-autoservice.dto';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
// import { AllExceptionsFilter } from '../all.exceptions';
import * as moment from 'moment';
//import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
@Injectable()
export class AssobravService {
  startDate
  endDate

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    // //@InjectPinoLogger(AutoserviceService.name) private readonly logger: PinoLogger
    // private readonly logger = new Logger(AutoserviceService.name)
  ) { }

  async cadastroClientes() {
    const clientes3k = await this.prisma.findAll('ck6041')
    for (const client of clientes3k.data) {
      // console.log(client);
      const teste = await this.prisma.ck6041.findFirst({
        where: {
          id: 1
        },
        include: {
          ck6042: {
            include: {
              telefones: true,
              emails: true
            }
          }
        }
      })
      console.log(teste);
      const exists = await this.prisma.tb_cad_cadastro_os_clientes.findFirst({
        where: {
          nome: client.nome_do_cliente
        }
      });

      if (exists) {
        await this.prisma.tb_cad_cadastro_nfs_cliente.update({
          where: {
            id_cadastro: exists.id_cadastro
          },
          data: {

          }
        })
      }
    }
  }
}
