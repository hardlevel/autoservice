import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AutoserviceService } from './autoservice.service';
//import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class Ck4Service {
    constructor(
        private readonly config: ConfigService,
        private readonly prisma: PrismaService,
        private readonly autoservice: AutoserviceService,
        //@InjectPinoLogger(Ck4Service.name) private readonly logger: PinoLogger
    ) { }

    async ck4001(ck4001) {
        const fields = [
            'tipo_do_cancelamento',
            'numero_do_dn',
            'numero_da_nota_fiscal',
            'numero_da_os',
            'serie_da_nota_fiscal',
            'data_e_hora_da_emissao_da_nota_fiscal',
            'data_do_cancelamento_do_documento',
            'data_e_hora_da_abertura_da_os',
            'data_e_hora_do_fechamento_da_os',
        ];

        const data = this.autoservice.extractData(ck4001, fields);

        try {
            const ck = await this.prisma.ck4001.upsert({
                where: {
                    ck4001_cod: {
                        numero_do_dn: data.numero_do_dn,
                        numero_da_nota_fiscal: data.numero_da_nota_fiscal
                    }
                },
                create: data,
                update: data,
                select: {
                    id: true
                }
            })

        } catch (error) {
            console.error('Erro ao salvar CK4001', error);
            //this.logger.error('Erro ao salvar CK4001', error);
        }
    }
}
