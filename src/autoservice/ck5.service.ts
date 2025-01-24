import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AutoserviceService } from './autoservice.service';
//import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class Ck5Service {
    constructor(
        private readonly config: ConfigService,
        private readonly prisma: PrismaService,
        private readonly autoservice: AutoserviceService,
        //@InjectPinoLogger(Ck5Service.name) private readonly logger: PinoLogger
    ) { }

    async ck5001(ck5001) {
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

        const data = this.autoservice.extractData(ck5001, fields);

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
            console.error('Erro ao salvar CK5001', error);
            //this.logger.error('Erro ao salvar CK5001', error);
        }
    }
}
