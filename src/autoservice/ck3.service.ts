import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AutoserviceService } from './autoservice.service';
import { UtilService } from '../util/util.service';
//import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class Ck3Service {
    constructor(
        private readonly config: ConfigService,
        private readonly prisma: PrismaService,
        private readonly autoservice: AutoserviceService,
        private readonly util: UtilService
        //@InjectPinoLogger(Ck3Service.name) private readonly logger: PinoLogger
    ) { }

    async ck3001(ck3001) {
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
        const uniqueFields = ['cpf_cnpj', 'numero_da_nota_fiscal'];
        const data = await this.prisma.proccessCk('ck3001', ck3001, fields, uniqueFields);
        // const data = this.util.extractData(ck3001, fields);

        // try {
        //     const ck = await this.prisma.ck3001.upsert({
        //         where: {
        //             ck3001_cod: {
        //                 cpf_cnpj: data.cpf_cnpj,
        //                 numero_da_nota_fiscal: data.numero_da_nota_fiscal
        //             }
        //         },
        //         create: data,
        //         update: data,
        //         select: {
        //             id: true
        //         }
        //     })
        //     await this.ck3002(ck.id, ck3001.CK3002);
        //     await this.ck3003(ck.id, ck3001.CK3003);
        // } catch (error) {
        //     console.error('Erro ao salvar CK3001', error, ck3001);
        //     //this.logger.error('Erro ao salvar CK3001', error);
        // }
    }

    async ck3002(id, ck3002) {
        const fields = [
            'cidade',
            'bairro',
            'uf',
            'cep',
        ]

        const data = {...this.util.extractData(ck3002, fields), ck3001_id: id}

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
            await this.phones(ck.id, ck3002.telefones);
            await this.emails(ck.id, ck3002.emails);
        } catch (error) {
            console.error('Erro ao salvar CK3002', error);
            //this.logger.error('Erro ao salvar CK3002', error);
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

            const data = {...this.util.extractData(phone, fields), ck3002_id: id}

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
                console.error('Erro ao salvar telefones do CK3001', error, phones);
                //this.logger.error('Erro ao salvar telefones do CK3001', error, phones);
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

            const data = {...this.util.extractData(email, fields), ck3002_id: id}

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
                console.error('Erro ao salvar emails do CK3001', error, emails)
                //this.logger.error('Erro ao salvar emails do CK3001', error, emails)
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

            const data = {...this.util.extractData(item, fields), ck3001_id: id}

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
                console.error('erro ao salvar ck3003', data, error);
                //this.logger.error('erro ao salvar ck3003', data, error);
            }
        }
    }
}
