import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AutoserviceService } from './autoservice.service';
import { AllExceptionsFilter } from '../common/errors/all.exceptions';
import { UtilService } from '../util/util.service';
//import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class Ck6Service {
    startDate: string | Date;
    endDate: string | Date;
    originalData: any;

    constructor(
        private readonly config: ConfigService,
        private readonly prisma: PrismaService,
        private readonly autoservice: AutoserviceService,
        private readonly util: UtilService
        //@InjectPinoLogger(Ck6Service.name) private readonly logger: PinoLogger
    ) { }

    async ck6011(ck6011, startDate, endDate) {
        this.originalData = ck6011;
        this.startDate = startDate;
        this.endDate = endDate;

        const fields = [
            'numero_do_dn',
            'numero_da_os',
            'data_e_hora_da_abertura_da_os',
            'data_e_hora_do_fechamento_da_os',
            'fonte_pagadora',
            'valor_total_liquido_das_pecas_na_os',
            'valor_total_liquido_da_mao_de_obra_na_os'
        ];

        const data = await this.util.extractData(ck6011, fields);

        try {
            const ck = await this.prisma.ck6011.upsert({
                where: {
                    ck6011_cod: {
                        numero_do_dn: data.numero_do_dn,
                        numero_da_os: data.numero_da_os
                    }
                },
                create: data,
                update: data,
                select: {
                    id: true
                }
            })

            if (ck6011.CK6021) await this.ck6021(ck.id, ck6011.CK6021);
            if (ck6011.CK6031) await this.ck6031(ck.id, ck6011.CK6031);
            if (ck6011.CK6041) await this.ck6041(ck.id, ck6011.CK6041);
        } catch (error) {
            await this.prisma.logError({
                category: 'ck6011',
                message: error.message,
                code: error.code,
                params: data,
                cause: error.cause,
                originalData: this.originalData
            });
            this.autoservice.setLog('error', 'Falha ao registrar CK6001', error.message, this.startDate, this.endDate);
            return;
        }
    }

    async ck6021(id, ck6021) {
        const fields = [
            'codigo_da_peca',
            'descricao_da_peca',
            'quantidade_da_peca',
            'valor_total_liquido_da_peca',
            'codigo_promocional'
        ];

        for (const peca of ck6021) {
            const data = { ...this.util.extractData(peca, fields), ck6011_id: id }

            try {
                const ck = await this.prisma.ck6021.upsert({
                    where: {
                        ck6021_cod: {
                            codigo_da_peca: data.codigo_da_peca,
                            ck6011_id: data.ck6011_id
                        }
                    },
                    create: data,
                    update: data,
                    select: {
                        id: true
                    }
                });
            } catch (error) {
                await this.prisma.logError({
                    category: 'ck6021',
                    message: error.message,
                    code: error.code,
                    params: data,
                    cause: error.cause,
                    originalData: this.originalData
                });
                this.autoservice.setLog('error', 'Falha ao registrar CK6021', error.message, this.startDate, this.endDate);
                return;
            }
        }
    }

    async ck6031(id, ck6031) {
        const fields = [
            'cos',
            'descricao_do_servico',
            'tipo_de_servico',
            'hora_vendida',
            'valor_total_liquido_da_mao_de_obra'
        ];

        for (const servico of ck6031) {
            const data = { ...this.util.extractData(servico, fields), ck6011_id: id }

            try {
                const ck = await this.prisma.ck6031.upsert({
                    where: {
                        ck6031_cod: {
                            cos: data.cos,
                            ck6011_id: data.ck6011_id
                        }
                    },
                    create: data,
                    update: data,
                    select: {
                        id: true
                    }
                });
            } catch (error) {
                await this.prisma.logError({
                    category: 'ck6031',
                    message: error.message,
                    code: error.code,
                    params: data,
                    cause: error.cause,
                    originalData: this.originalData
                });
                this.autoservice.setLog('error', 'Falha ao registrar CK6031', error.message, this.startDate, this.endDate);
                return;
            }
        }
    }

    async ck6041(id, ck6041) {
        if (!ck6041.nome_do_cliente) return;
        //os campos chassi e placa são opcionais, portanto não podem ser usados como identificadores
        //então deve-se primeiro tentar localizar o veiculo, caso exista atualizar, caso não exista, adicionar
        const fields = [
            'chassi_do_veiculo',
            'placa_do_veiculo',
            'quilometragem_do_veiculo',
            'nome_do_cliente',
            'indicador',
            'cpf_cnpj',
            'endereco',
            'numero',
            'complemento',
            'bairro',
        ];

        const data = { ...this.util.extractData(ck6041, fields), ck6011_id: id }

        try {
            const ck = await this.prisma.ck6041.upsert({
                where: {
                    ck6041_cod: {
                        nome_do_cliente: data.nome_do_cliente,
                        chassi_do_veiculo: data.chassi_do_veiculo,
                        ck6011_id: id
                    },
                },
                create: data,
                update: data
            });
            await this.ck6042(ck.id, ck6041.CK6042);
        } catch (error) {
            await this.prisma.logError({
                category: 'ck6041',
                message: error.message,
                code: error.code,
                params: data,
                cause: error.cause,
                originalData: this.originalData
            });
            this.autoservice.setLog('error', 'Falha ao registrar CK6041', error.message, this.startDate, this.endDate);
            return;
        }
    }

    async ck6042(id, ck6042) {
        const fields = [
            'cidade',
            'uf',
            'cep',
        ];

        const data = { ...this.util.extractData(ck6042, fields), ck6041_id: id }

        try {
            const ck = await this.prisma.ck6042.upsert({
                where: {
                    ck6042_cod: {
                        cidade: data.cidade,
                        uf: data.uf,
                        cep: data.cep,
                        ck6041_id: data.ck6041_id
                    }
                },
                create: data,
                update: data,
                select: {
                    id: true
                }
            });
            await this.phones(ck.id, ck6042.telefones);
            await this.emails(ck.id, ck6042.emails);
        } catch (error) {
            await this.prisma.logError({
                category: 'ck6042',
                message: error.message,
                code: error.code,
                params: data,
                cause: error.cause,
                originalData: this.originalData
            });
            this.autoservice.setLog('error', 'Falha ao registrar CK6041', error.message, this.startDate, this.endDate);
            return;
        }
    }

    async phones(id, phones) {
        const fields = [
            'numero',
            'descricao',
            'autoriza_contato',
            'autoriza_pesquisa',
        ];

        for (const phone of phones) {
            const data = { ...this.util.extractData(phone, fields), ck6042_id: id }

            if (!phone.numero) return;

            try {
                const ck = await this.prisma.telefones.upsert({
                    where: {
                        numero: data.numero
                    },
                    create: data,
                    update: data,
                });
            } catch (error) {
                await this.prisma.logError({
                    category: 'ck6042',
                    message: error.message,
                    code: error.code,
                    params: data,
                    cause: error.cause,
                    originalData: this.originalData
                });
                this.autoservice.setLog('error', 'Falha ao registrar CK6042', error.message, this.startDate, this.endDate);
                return;
            }
        }
    }

    async emails(id, emails) {
        const fields = [
            'email',
            'descricao',
            'autoriza_contato',
            'autoriza_pesquisa',
        ];

        for (const email of emails) {
            const data = { ...this.util.extractData(email, fields), ck6042_id: id }

            if (!email.email) return;

            try {
                const ck = await this.prisma.emails.upsert({
                    where: {
                        email: data.email
                    },
                    create: data,
                    update: data,
                });
            } catch (error) {
                await this.prisma.logError({
                    category: 'ck6042',
                    message: error.message,
                    code: error.code,
                    params: data,
                    cause: error.cause,
                    originalData: this.originalData
                });
                this.autoservice.setLog('error', 'Falha ao registrar CK6042', error.message, this.startDate, this.endDate);
                return;
            }
        }
    }
}
