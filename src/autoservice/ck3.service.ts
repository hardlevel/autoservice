import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AutoserviceService } from './autoservice.service';
import { UtilService } from '../util/util.service';
//import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class Ck3Service {
    startDate: string | Date;
    endDate: string | Date;
    originalData: any;

    constructor(
        private readonly config: ConfigService,
        private readonly prisma: PrismaService,
        private readonly autoservice: AutoserviceService,
        private readonly util: UtilService
        //@InjectPinoLogger(Ck3Service.name) private readonly logger: PinoLogger
    ) { }

    async ck3001(ck3001, startDate, endDate) {
        this.originalData = ck3001;
        this.startDate = startDate;
        this.endDate = endDate;

        const fields = [
            'nome_do_cliente',
            'cpf_cnpj',
            'endereco',
            'complemento',
            'numero',
            'numero_da_nota_fiscal',
            'numero_do_dn',
            'serie_da_nota_fiscal',
            'data_e_hora_da_emissao_da_nota_fiscal',
            'fonte_pagadora',
            'valor_total_liquido_das_pecas_na_nota_fiscal',
            'indicador',
        ]

        const data = this.util.extractData(ck3001, fields);

        try {
            const ck = await this.prisma.ck3001.upsert({
                where: {
                    ck3001_cod: {
                        cpf_cnpj: data.cpf_cnpj,
                        numero_da_nota_fiscal: data.numero_da_nota_fiscal
                    }
                },
                create: data,
                update: data,
                select: {
                    id: true
                }
            })
            if (ck3001.CK3002) await this.ck3002(ck.id, ck3001.CK3002);
            if (ck3001.CK3003) await this.ck3003(ck.id, ck3001.CK3003);
        } catch (error) {
            await this.prisma.logError({
                category: 'ck3001',
                message: error.message,
                code: error.code,
                params: data,
                cause: error.cause,
                originalData: this.originalData
            });
            this.autoservice.setLog('error', 'Falha ao registrar CK3001', error.message, this.startDate, this.endDate);
            return;
        }
    }

    async ck3002(id, ck3002) {
        const fields = [
            'cidade',
            'bairro',
            'uf',
            'cep',
        ]

        const data = { ...this.util.extractData(ck3002, fields), ck3001_id: id }

        try {
            const ck = await this.prisma.ck3002.upsert({
                where: {
                    ck3002_cod: {
                        ck3001_id: id,
                        cidade: ck3002.cidade,
                        bairro: ck3002.bairro,
                        uf: ck3002.uf,
                        cep: ck3002.cep,
                    }
                },
                create: data,
                update: data,
                select: {
                    id: true
                }
            })
            if (ck3002.telefones) await this.phones(ck.id, ck3002.telefones);
            if (ck3002.emails) await this.emails(ck.id, ck3002.emails);
        } catch (error) {
            await this.prisma.logError({
                category: 'ck3002',
                message: error.message,
                code: error.code,
                params: data,
                cause: error.cause,
                originalData: this.originalData
            });
            this.autoservice.setLog('error', 'Falha ao registrar CK3002', error.message, this.startDate, this.endDate);
            return;
        }
    }

    async phones(id, phones) {
        for (const phone of phones) {
            const fields = [
                'numero',
                'descricao',
                'autoriza_contato',
                'autoriza_pesquisa',
            ]

            const data = { ...this.util.extractData(phone, fields), ck3002_id: id }

            if (!phone.numero) return;

            try {
                if (data.numero) {
                    const ckPhone = await this.prisma.telefones.upsert({
                        where: {
                            numero: phone.numero
                        },
                        update: data,
                        create: data
                    })
                }
            } catch (error) {
                await this.prisma.logError({
                    category: 'ck3002',
                    message: error.message,
                    code: error.code,
                    params: phone,
                    cause: error.cause,
                    originalData: this.originalData
                });
                this.autoservice.setLog('error', 'Falha ao registrar CK3002', error.message, this.startDate, this.endDate);
                return;
            }
        }
    }

    async emails(id, emails) {
        for (const email of emails) {
            const fields = [
                'email',
                'descricao',
                'autoriza_contato',
                'autoriza_pesquisa'
            ]

            const data = { ...this.util.extractData(email, fields), ck3002_id: id }

            if (!email.email) return;

            try {
                if (data.email) {
                    const ckEmail = await this.prisma.emails.upsert({
                        where: {
                            email: email.email
                        },
                        update: data,
                        create: data
                    })
                }
            } catch (error) {
                await this.prisma.logError({
                    category: 'ck3002',
                    message: error.message,
                    code: error.code,
                    params: email,
                    cause: error.cause,
                    originalData: this.originalData
                });
                this.autoservice.setLog('error', 'Falha ao registrar CK3002', error.message, this.startDate, this.endDate);
                return;
            }
        }
    }

    async ck3003(id, ck3003) {
        for (const item of ck3003) {
            const fields = [
                'codigo_da_peca',
                'descricao_da_peca',
                'valor_total_liquido_da_peca',
                'codigo_promocional',
                'quantidade_da_peca'
            ]

            const data = { ...this.util.extractData(item, fields), ck3001_id: id }

            try {
                const ck = await this.prisma.ck3003.upsert({
                    where: {
                        ck3003_cod: {
                            codigo_da_peca: data.codigo_da_peca,
                            ck3001_id: id
                        }
                    },
                    create: data,
                    update: data
                })
            } catch (error) {
                await this.prisma.logError({
                    category: 'ck3003',
                    message: error.message,
                    code: error.code,
                    params: data,
                    cause: error.cause,
                    originalData: this.originalData
                });
                this.autoservice.setLog('error', 'Falha ao registrar CK3003', error.message, this.startDate, this.endDate);
                return;
            }
        }
    }
}
