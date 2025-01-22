import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AutoserviceService } from './autoservice.service';

@Injectable()
export class Ck3Service {
    constructor(
        private readonly config: ConfigService,
        private readonly prisma: PrismaService,
        private readonly autoservice: AutoserviceService
    ) { }

    async ck3001(ck3001) {
        const data = {
            nome_do_cliente: ck3001.nome_do_cliente,
            cpf_cnpj: ck3001.cpf_cnpj,
            endereco: ck3001.endereco,
            complemento: ck3001.complemento,
            numero: ck3001.numero,
            numero_da_nota_fiscal: ck3001.numero_da_nota_fiscal,
            numero_do_dn: ck3001.numero_do_dn,
            serie_da_nota_fiscal: ck3001.serie_da_nota_fiscal,
            data_e_hora_da_emissao_da_nota_fiscal: new Date(ck3001.data_e_hora_da_emissao_da_nota_fiscal),
            fonte_pagadora: ck3001.fonte_pagadora,
            valor_total_liquido_das_pecas_na_nota_fiscal: ck3001.valor_total_liquido_das_pecas_na_nota_fiscal,
            indicador: ck3001.indicador,
        }
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
            await this.ck3002(ck.id, ck3001.CK3002);
            await this.ck3003(ck.id, ck3001.CK3003);
        } catch (error) {
            console.log(error);
        }
    }

    async ck3002(id, ck3002) {
        const data = {
            cidade: ck3002.cidade,
            bairro: ck3002.bairro,
            uf: ck3002.uf,
            cep: ck3002.cep,
            ck3001_id: id
        }

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
            console.log(error);
        }
    }

    async phones(id, phones) {
        for (const phone of phones) {
            const data = {
                numero: phone.numero,
                descricao: phone.descricao,
                autoriza_contato: phone.autoriza_contato,
                autoriza_pesquisa: phone.autoriza_pesquisa,
                ck3002_id: id
            }

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
                console.log(error, phones)
            }
        }
    }

    async emails(id, emails) {
        for (const email of emails) {
            const data = {
                email: email.email,
                descricao: email.descricao,
                autoriza_contato: email.autoriza_contato,
                autoriza_pesquisa: email.autoriza_pesquisa,
                ck3002_id: id
            }

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
                console.log(error, emails)
            }
        }
    }

    async ck3003(id, ck3003) {
        for (const item of ck3003) {
            const data = {
                ck3001_id: id,
                codigo_da_peca: item.codigo_da_peca,
                descricao_da_peca: item.descricao_da_peca,
                valor_total_liquido_da_peca: item.valor_total_liquido_da_peca,
                codigo_promocional: item.codigo_promocional,
                quantidade_da_peca: item.quantidade_da_peca
            }

            try {
                const ck = await this.prisma.ck3003.upsert({
                    where: {
                        ck3003_cod: {
                            codigo_da_peca: item.codigo_da_peca,
                            ck3001_id: id
                        }
                    },
                    create: data,
                    update: data
                })
            } catch (error) {
                console.log('erro ao salvar ck3003', data, error);
            }
        }
    }
}
