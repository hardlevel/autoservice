import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { AutoserviceService } from './autoservice.service';
import { UtilService } from '../util/util.service';
import { CustomError } from '../common/errors/custom-error';
//import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class Ck7Service {
    startDate: string | Date;
    endDate: string | Date;
    originalData: any;
    date: any;

    constructor(
        private readonly config: ConfigService,
        private readonly prisma: PrismaService,
        private readonly autoservice: AutoserviceService,
        private readonly util: UtilService
        //@InjectPinoLogger(Ck7Service.name) private readonly logger: PinoLogger
    ) {
        this.date = this.util.getDate();
    }

    async ck7001(ck7001, startDate, endDate) {
        this.originalData = ck7001;
        this.startDate = startDate;
        this.endDate = endDate;

        const fields = [
            "nome_do_cliente",
            "endereco",
            "fonte_pagadora",
            "numero_do_dn",
            "numero_da_nota_fiscal",
            "numero_da_os",
            "serie_da_nota_fiscal",
            "valor_total_liquido_das_pecas_na_nota_fiscal",
            "valor_total_liquido_da_mao_de_obra_na_nota_fiscal",
            "data_e_hora_da_abertura_da_os",
            "data_e_hora_do_fechamento_da_os",
            "data_e_hora_da_emissao_da_nota_fiscal",
        ]

        const data = { ...this.util.extractData(ck7001, fields) };

        try {
            // let ck = await this.prisma.ck7001.findUnique({
            //     where: {
            //         ck7001_cod: {
            //             numero_da_nota_fiscal: ck7001.numero_da_nota_fiscal,
            //             numero_do_dn: ck7001.numero_do_dn
            //         }
            //     }
            // });

            // if (ck) {
            //     await this.prisma.ck7001.update({
            //         where: {
            //             id: ck.id
            //         },
            //         data
            //     });
            // } else {
            //     ck = await this.prisma.ck7001.create({ data });
            // }

            // if (ck.created_at == ck.modified_at) {
            //     await this.prisma.recordDaily(this.date.year, this.date.month, this.date.day, 'ck7001', 1);
            // }
            const ck = await this.prisma.ck7001.upsert({
                where: {
                    ck7001_cod: {
                        numero_da_nota_fiscal: ck7001.numero_da_nota_fiscal,
                        numero_do_dn: ck7001.numero_do_dn
                    }
                },
                create: data,
                update: data,
                select: {
                    id: true,
                    created_at: true,
                    modified_at: true
                }
            });

            if (ck.created_at.getTime() === ck.modified_at.getTime()) {
                await this.prisma.recordDaily(this.date.year, this.date.month, this.date.day, 'ck7001', 1);
            }


            if (ck7001.CK7002) await this.ck7002(ck.id, ck7001.CK7002);
            if (ck7001.CK7003) await this.ck7003(ck.id, ck7001.CK7003);
            if (ck7001.CK7004) await this.ck7004(ck.id, ck7001.CK7004);
        } catch (error) {
            await this.prisma.logError({
                category: 'ck7001',
                message: error.message,
                code: error.code,
                params: data,
                cause: error.cause,
                originalData: this.originalData
            });
            this.autoservice.setLog('error', 'Falha ao registrar CK7001', error.message, this.startDate, this.endDate);
            return;
        }
    }

    async ck7002(id, ck7002) {
        const fields = [
            'indicador',
            'cpf_cnpj',
            'numero',
            'complemento',
            'bairro',
            'cidade',
            'uf',
            'cep',
        ];

        const data = { ...this.util.extractData(ck7002, fields), ck7001_id: id };

        try {
            let ck = await this.prisma.findUnique('ck7002', {
                ck7002_cod: {
                    cidade: ck7002.cidade,
                    uf: ck7002.uf,
                    indicador: ck7002.indicador,
                    ck7001_id: data.ck7001_id
                }
            })

            if (ck) {
                await this.prisma.update('ck7002', ck.id, data);
            } else {
                ck = await this.prisma.create('ck7002', data);
            }

            if (ck.created_at == ck.modified_at) {
                await this.prisma.recordDaily(this.date.year, this.date.month, this.date.day, 'ck7002', 1);
            }

            const phones = await this.phones(ck.id, ck7002.telefones);
            const emails = await this.emails(ck.id, ck7002.emails);
        } catch (error) {
            await this.prisma.logError({
                category: 'ck7002',
                message: error.message,
                code: error.code,
                params: data,
                cause: error.cause,
                originalData: this.originalData
            });
            this.autoservice.setLog('error', 'Falha ao registrar CK7002', error.message, this.startDate, this.endDate);
            return;
        }
    }

    async phones(id, phones) {
        for (const phone of phones) {
            const fields = [
                'numero',
                'descricao',
                'autoriza_pesquisa',
                'autoriza_contato'
            ];
            const data = { ...this.util.extractData(phone, fields), ck7002_id: id };

            try {
                const ckPhone = await this.prisma.telefones.upsert({
                    where: {
                        numero: data.numero,
                    },
                    create: data,
                    update: data,
                })
            } catch (error) {
                await this.prisma.logError({
                    category: 'ck7002',
                    message: error.message,
                    code: error.code,
                    params: phone,
                    cause: error.cause,
                    originalData: this.originalData
                });
                this.autoservice.setLog('error', 'Falha ao registrar CK7002', error.message, this.startDate, this.endDate);
                return;
            }
        }
    }

    async emails(id, emails) {
        for (const email of emails) {
            const fields = [
                'email',
                'descricao',
                'autoriza_pesquisa',
                'autoriza_contato',
            ];

            const data = { ...this.util.extractData(email, fields), ck7002_id: id };

            try {
                const ckEmails = await this.prisma.emails.upsert({
                    where: {
                        email: data.email
                    },
                    create: data,
                    update: data,
                })
            } catch (error) {
                await this.prisma.logError({
                    category: 'ck7002',
                    message: error.message,
                    code: error.code,
                    params: email,
                    cause: error.cause,
                    originalData: this.originalData
                });
                this.autoservice.setLog('error', 'Falha ao registrar CK7002', error.message, this.startDate, this.endDate);
                return;
            }
        }
    }

    async ck7003(id, ck7003) {
        for (const item of ck7003) {
            const fields = [
                'codigo_da_peca',
                'descricao_da_peca',
                'quantidade_da_peca',
                'valor_total_liquido_da_peca',
                'codigo_promocional',
            ]

            const data = { ...this.util.extractData(item, fields), ck7001_id: id };

            try {
                let ck = await this.prisma.findUnique('ck7003', {
                    ck7003_cod: {
                        codigo_da_peca: data.codigo_da_peca,
                        ck7001_id: id
                    }
                });

                if (ck) {
                    await this.prisma.update('ck7003', ck.id, data);
                } else {
                    ck = await this.prisma.create('ck7003', data);
                    await this.prisma.recordDaily(this.date.year, this.date.month, this.date.day, 'ck7003', 1);
                }
            } catch (error) {
                await this.prisma.logError({
                    category: 'ck7003',
                    message: error.message,
                    code: error.code,
                    params: item,
                    cause: error.cause,
                    originalData: this.originalData
                });
                this.autoservice.setLog('error', 'Falha ao registrar CK7003', error.message, this.startDate, this.endDate);
                return;
            }
        }
    }

    async ck7004(id, ck7004) {
        for (const item of ck7004) {
            const fields = [
                "cos",
                "descricao_do_servico",
                "hora_vendida",
                "valor_total_liquido_da_mao_de_obra",
                "tipo_de_servico",
            ]
            const data = { ...this.util.extractData(item, fields), ck7001_id: id };
            // console.log(data);
            try {
                let ck = await this.prisma.findUnique('ck7004', {
                    ck7004_cod: {
                        cos: data.cos,
                        ck7001_id: id
                    }
                });
                // https://hdlvl.dev/s/

                if (ck) {
                    await this.prisma.update('ck7004', ck.id, data);
                } else {
                    ck = await this.prisma.create('ck7004', data);
                    await this.prisma.recordDaily(this.date.year, this.date.month, this.date.day, 'ck7004', 1);
                }
                // const ck = await this.prisma.ck7004.upsert({
                //     where: {
                //         ck7004_cod: {
                //             cos: data.cos,
                //             ck7001_id: data.ck7001_id
                //         }
                //     },
                //     create: data,
                //     update: data,
                //     select: {
                //         id: true
                //     }
                // });
            } catch (error) {
                await this.prisma.logError({
                    category: 'ck7004',
                    message: error.message,
                    code: error.code,
                    params: item,
                    cause: error.cause,
                    originalData: this.originalData
                });
                this.autoservice.setLog('error', 'Falha ao registrar CK7004', error.message, this.startDate, this.endDate);
                return;
            }
        }
    }
}
