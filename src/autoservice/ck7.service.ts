import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AutoserviceService } from './autoservice.service';
import { tryCatch } from 'bullmq';

@Injectable()
export class Ck7Service {
    constructor(
        private readonly config: ConfigService,
        private readonly prisma: PrismaService,
        private readonly autoservice: AutoserviceService
    ) { }


    async ck7001(ck7001) {
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

        const data = this.autoservice.extractData(ck7001, fields);
        // const data = {
        //     nome_do_cliente: ck7001.nome_do_cliente,
        //     endereco: ck7001.endereco,
        //     fonte_pagadora: ck7001.fonte_pagadora,
        //     numero_do_dn: ck7001.numero_do_dn,
        //     numero_da_nota_fiscal: ck7001.numero_da_nota_fiscal,
        //     numero_da_os: ck7001.numero_da_os,
        //     serie_da_nota_fiscal: ck7001.serie_da_nota_fiscal,
        //     valor_total_liquido_das_pecas_na_nota_fiscal: ck7001.valor_total_liquido_das_pecas_na_nota_fiscal,
        //     valor_total_liquido_da_mao_de_obra_na_nota_fiscal: ck7001.valor_total_liquido_da_mao_de_obra_na_nota_fiscal,
        //     data_e_hora_da_abertura_da_os: new Date(ck7001.data_e_hora_da_abertura_da_os),
        //     data_e_hora_do_fechamento_da_os: new Date(ck7001.data_e_hora_do_fechamento_da_os),
        //     data_e_hora_da_emissao_da_nota_fiscal: new Date(ck7001.data_e_hora_da_emissao_da_nota_fiscal)
        // }
        try {
            const ck = await this.prisma.ck7001.upsert({
                where: {
                    ck7001_cod: {
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
            await this.ck7002(ck.id, ck7001.CK7002);
        } catch (error) {
            console.error('Erro ao salvar dados no CK7001', ck7001, error);
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
        const data = { ...this.autoservice.extractData(ck7002, fields), ck7001_id: id };
        // console.log(data);
        try {
            const ck = await this.prisma.ck7002.upsert({
                where: {
                    ck7002_cod: {
                        cidade: ck7002.cidade,
                        uf: ck7002.uf,
                        indicador: ck7002.indicador,
                        ck7001_id: id
                    }
                },
                create: data,
                update: data,
                select: {
                    id: true
                }
            })
            const phones = await this.phones(ck.id, ck7002.telefones);
            const emails = await this.emails(ck.id, ck7002.emails);
        } catch (error) {
            console.error('Erro ao salvar dados no CK7002', ck7002, error);
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
            const data = { ...this.autoservice.extractData(phone, fields), ck7002_id: id };
            // const data = {
            //     numero: phone.numero,
            //     descricao: phone.descricao,
            //     autoriza_pesquisa: phone.autoriza_pesquisa,
            //     autoriza_contato: phone.autoriza_contato,
            //     ck7002_id: id
            // }
            try {
                const ckPhone = await this.prisma.telefones.upsert({
                    where: {
                        numero: data.numero
                    },
                    create: data,
                    update: data,
                    select: {
                        id: true
                    }
                })
            } catch (error) {
                console.log('Erro ao salvar telefones do CK7002', data, error)
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

            const data = { ...this.autoservice.extractData(email, fields), ck7002_id: id };
            // const data = {
            //     email: email.email,
            //     descricao: email.descricao,
            //     autoriza_pesquisa: email.autoriza_pesquisa,
            //     autoriza_contato: email.autoriza_contato,
            //     ck7002_id: id
            // }
            try {
                const ckPhone = await this.prisma.emails.upsert({
                    where: {
                        email: data.email
                    },
                    create: data,
                    update: data,
                    select: {
                        id: true
                    }
                })
            } catch (error) {
                console.log('Erro ao salvar emails do CK7002', data, error)
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

            const data = { ...this.autoservice.extractData(item, fields), ck7001_id: id };
            // const data = {
            //     codigo_da_peca: item.codigo_da_peca,
            //     descricao_da_peca: item.descricao_da_peca,
            //     quantidade_da_peca: item.quantidade_da_peca,
            //     valor_total_liquido_da_peca: item.valor_total_liquido_da_peca,
            //     codigo_promocional: item.codigo_promocional,
            //     ck7001_id: id
            // }

            try {
                const ck = await this.prisma.ck7003.upsert({
                    where: {
                        ck7003_cod: {
                            codigo_da_peca: data.codigo_da_peca,
                            ck7001_id: data.ck7001_id
                        }
                    },
                    create: data,
                    update: data,
                    select: {
                        id: true
                    }
                });
            } catch (error) {
                console.log('Erro ao salvar CK7003', data, error)
            }
        }
    }

    async ck7004(id, ck7004) {
        for (const item of ck7004) {
            const fields = [
                "nome_do_cliente",
                "endereco",
                "fonte_pagadora",
                "numero_da_nota_fiscal",
                "serie_da_nota_fiscal",
                "data_e_hora_da_emissao_da_nota_fiscal",
                "numero_da_os",
                "data_e_hora_da_abertura_da_os",
                "valor_total_liquido_das_pecas_na_nota_fiscal",
                "valor_total_liquido_da_mao_de_obra_na_nota_fiscal",
                "numero_do_dn",
                "data_e_hora_do_fechamento_da_os",
            ]
            const data = { ...this.autoservice.extractData(ck7004, fields), ck7001_id: id };
            // console.log(data);
            try {
                const ck = await this.prisma.ck7004.upsert({
                    where: {
                        ck7004_cod: {
                            cos: data.cos,
                            ck7001_id: data.ck7001_id
                        }
                    },
                    create: data,
                    update: data,
                    select: {
                        id: true
                    }
                });
            } catch (error) {
                console.log('Erro ao salvar CK7004', data, error)
            }
        }
    }
}
