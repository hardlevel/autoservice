import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AutoserviceService } from './autoservice.service';
import { UtilService } from '../util/util.service';
//import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class Ck5Service {
    startDate: string | Date;
    endDate: string | Date;
    originalData: any;

    constructor(
        private readonly config: ConfigService,
        private readonly prisma: PrismaService,
        private readonly autoservice: AutoserviceService,
        private readonly util: UtilService
        //@InjectPinoLogger(Ck5Service.name) private readonly logger: PinoLogger
    ) { }

    async ck5001(ck5001, startDate, endDate) {
        this.originalData = ck5001;
        this.startDate = startDate;
        this.endDate = endDate;

        const fields = [
            'numero_do_dn',
            'tempo_remunerado',
            'tempo_disponivel_servicos_gerais_produtivos',
            'tempo_disponivel_servicos_rapido_produtivos',
            'tempo_disponivel_servicos_carroceria_produtivos_funileiros',
            'tempo_disponivel_servicos_carroceria_produtivos_pintores',
            'taxa_de_mao_de_obra_publico',
            'servicos_gerente',
            'servicos_chefe_de_oficina',
            'servicos_consultor_tecnico',
            'servicos_aprendiz',
            'servicos_suporte',
            'servicos_gerais_produtivos',
            'servicos_rapido_produtivos',
            'servicos_carroceria_produtivos_funileiros',
            'servicos_carroceria_produtivos_pintores',
            'servicos_lavadores_lubrificadores',
            'servicos_terceiros',
            'pecas_gerente',
            'pecas_suporte',
            'pecas_balconista_varejo',
            'pecas_balconista_oficina',
            'pecas_vendedor_atacado',
            'pecas_vendedor_acessorios',
            'locais_de_trabalho_servicos_gerais',
            'locais_de_trabalho_servico_rapido',
            'locais_de_trabalho_servicos_de_funilaria',
            'locais_de_trabalho_servicos_de_pintura',
            'locais_de_trabalho_lavagem_e_lubrificacao',
            'locais_de_trabalho_utilizados_por_terceiros',
            'mes_e_ano_de_referencia',
            'ano_de_referencia',
            'mes_de_referencia',
        ];

        const data = this.util.extractData(ck5001, fields);

        try {
            const ck = await this.prisma.ck5001.upsert({
                where: {
                    ck5001_cod: {
                        numero_do_dn: data.numero_do_dn,
                        ano_de_referencia: data.ano_de_referencia,
                        mes_de_referencia: data.mes_de_referencia
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
                category: 'ck5001',
                message: error.message,
                code: error.code,
                params: data,
                cause: error.cause,
                originalData: this.originalData
            });
            this.autoservice.setLog('error', 'Falha ao registrar CK5001', error.message, this.startDate, this.endDate);
            return;
        }
    }
}
