import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { AutoserviceService } from '../autoservice.service';
import { UtilService } from '../../util/util.service';
import { CustomError } from '../../common/errors/custom-error';

@Injectable()
export class Ck4Service {
    startDate: string | Date;
    endDate: string | Date;
    originalData: any;

    constructor(
        private readonly config: ConfigService,
        private readonly prisma: PrismaService,
        private readonly autoservice: AutoserviceService,
        private readonly util: UtilService,
    ) { }

    async ck4001(ck4001, startDate, endDate) {
        this.originalData = ck4001;
        this.startDate = startDate;
        this.endDate = endDate;

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

        const data = this.util.extractData(ck4001, fields);
        // console.log('CK4: data da nota ', data.data_e_hora_da_emissao_da_nota_fiscal)
        try {
            const ck = await this.prisma.ck4001.upsert({
                where: {
                    ck4001_cod: {
                        numero_do_dn: data.numero_do_dn,
                        data_do_cancelamento_do_documento: data.data_do_cancelamento_do_documento
                    }
                },
                create: data,
                update: data,
                select: {
                    id: true
                }
            })
        } catch (error) {
            await this.prisma.logError({
                category: 'ck4001',
                message: error.message,
                code: error.code,
                params: data,
                cause: error.cause,
                originalData: this.originalData
            });
            // this.log.setLog('error', 'Falha ao registrar CK4001', error.message, this.startDate, this.endDate);
            return;
        }
    }
}
