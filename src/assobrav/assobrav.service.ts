import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OsService } from './os.service';
import { NfsService } from './nfs.service';
import { copyFile } from 'fs';

@Injectable()
export class AssobravService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly os: OsService,
        private readonly nfs: NfsService
    ) {

    }
    /*
        //ck3 notas fiscais de peças no balcão
        ck3001 - dados a nota fiscal, nome, endereço
        ck3002 - complementos do endereço, telefones emails
        ck3003 - dados de peças
        //ck4 cancelamento da nf ou os
        //ck5 estrutura fisica do dn
        //ck6 ordem de serviços de peças e serviços na oficina
        ck6011 - dados da os
        ck6021 - dados de peças
        ck6031 - dados de serviços
        ck6042 - endereço, telefones, emails
        //ck7 notas fiscais de peças e serviços na oficina
        ck7001 - dados da nf
        ck7002 - dados de endereço e cpf
        ck7003 - dados de peças
        ck7004 - dados de serviços
    */
    async proccessData() {
        await this.saveDefaultPG();
        // await this.getNFCk3();
        await this.getNFCk7()
    }

    async getNFCk3(page: number = 1): Promise<any> {
        try {
            const response = await this.prisma.ck3001.findMany({
                take: 100,
                skip: (page - 1) * 100,
                include: {
                    ck3002: {
                        include: {
                            telefones: true,
                            emails: true
                        }
                    },
                    ck3003: true
                }
            });
            if (response.length > 0) {
                // await this.getNFCk3(page + 1);
                for (const item of response) {
                    const fonte_pagadora = await this.getFontePagadora(item.fonte_pagadora);
                    const nfData = {
                        numero: item.numero_da_nota_fiscal,
                        serie: item.serie_da_nota_fiscal,
                        data_emissao: item.data_e_hora_da_emissao_da_nota_fiscal,
                        valor_total: item.valor_total_liquido_das_pecas_na_nota_fiscal,
                        valor_total_mo: item.valor_total_liquido_das_pecas_na_nota_fiscal,
                        indicador: item.indicador,
                        fonte_pagadora: {
                            connect: { id: fonte_pagadora.id }
                        },
                        dealer: {
                            connectOrCreate: {
                                where: {
                                    dn: item.numero_do_dn
                                },
                                create: { dn: item.numero_do_dn }
                            }
                        }
                    };
                    const nf = await this.saveNotaFiscal(nfData);
                    if (nf) {
                        const clientData = {
                            nome: item.nome_do_cliente,
                            cpf_cnpj: item.cpf_cnpj,
                            endereco: item.endereco,
                            numero: item.numero,
                            complemento: item.complemento,
                            bairro: item.ck3002[0].bairro,
                            cidade: item.ck3002[0].cidade,
                            uf: item.ck3002[0].uf,
                            cep: item.ck3002[0].cep,
                            nota_fiscal: {
                                connect: {
                                    id: nf.id
                                }
                            }
                        };
                        const cliente = await this.saveCliente(clientData);
                        const phones = await this.connectPhones(item.ck3002[0].telefones, cliente.id);
                        const emails = await this.connectEmails(item.ck3002[0].emails, cliente.id);

                        if (item.ck3003) {
                            await this.savePeca(item.ck3003, 'nf', nf.id);
                        }
                    }
                }
                if (response.length > 0) {
                    await this.getNFCk3(page + 1);
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    async getNFCk7(page: number = 1): Promise<any> {
        try {
            const response = await this.prisma.ck7001.findMany({
                take: 100,
                skip: (page - 1) * 100,
                include: {
                    ck7002: {
                        include: {
                            telefones: true,
                            emails: true
                        }
                    },
                    ck7003: true,
                    ck7004: true
                }
            });
            if (response.length > 0) {
                for (const item of response) {
                    const fonte_pagadora = await this.getFontePagadora(item.fonte_pagadora);
                    const nfData = {
                        numero: item.numero_da_nota_fiscal,
                        serie: item.serie_da_nota_fiscal,
                        data_emissao: item.data_e_hora_da_emissao_da_nota_fiscal,
                        valor_total: Number(item.valor_total_liquido_das_pecas_na_nota_fiscal) + Number(item.valor_total_liquido_da_mao_de_obra_na_nota_fiscal),
                        valor_total_mo: item.valor_total_liquido_das_pecas_na_nota_fiscal,
                        valor_total_pecas: item.valor_total_liquido_das_pecas_na_nota_fiscal,
                        indicador: item.ck7002[0].indicador,
                        fonte_pagadora: {
                            connect: { id: fonte_pagadora.id }
                        },
                        dealer: {
                            connectOrCreate: {
                                where: {
                                    dn: item.numero_do_dn
                                },
                                create: { dn: item.numero_do_dn }
                            }
                        }
                    };
                    const nf = await this.saveNotaFiscal(nfData);
                    if (nf) {
                        const osData = {
                            numero: item.numero_da_os,
                            data_abertura: item.data_e_hora_da_abertura_da_os,
                            data_fechamento: item.data_e_hora_do_fechamento_da_os,
                            valor_total: item.valor_total_liquido_da_mao_de_obra_na_nota_fiscal,
                            dealer: {
                                connectOrCreate: {
                                    where: {
                                        dn: item.numero_do_dn
                                    },
                                    create: { dn: item.numero_do_dn }
                                }
                            },
                            nota_fiscal: {
                                connect: { id: nf.id }
                            }
                        };
                        const os = await this.saveOS(osData);

                        const clientData = {
                            nome: item.nome_do_cliente,
                            cpf_cnpj: item.ck7002[0].cpf_cnpj,
                            endereco: item.endereco,
                            numero: item.ck7002[0].numero,
                            complemento: item.ck7002[0].complemento,
                            bairro: item.ck7002[0].bairro,
                            cidade: item.ck7002[0].cidade,
                            uf: item.ck7002[0].uf,
                            cep: item.ck7002[0].cep,
                            nota_fiscal: {
                                connect: {
                                    id: nf.id
                                }
                            }
                        };
                        const cliente = await this.saveCliente(clientData);
                        const phones = await this.connectPhones(item.ck7002[0].telefones, cliente.id);
                        const emails = await this.connectEmails(item.ck7002[0].emails, cliente.id);
                        //checar relations das tabelas, arrumar fontes pagadoras, terminar as demais tabelas
                        // if (item.ck3003) {
                        //     await this.savePeca(item.ck3003, 'nf', nf.id);
                        // }
                    }
                }
                if (response.length > 0) {
                    await this.getNFCk7(page + 1);
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    async saveOS(data) {
        return this.prisma.ordemDeServico.upsert({
            where: { numero: data.numero },
            create: data,
            update: data
        });
    }

    async saveNotaFiscal(data) {
        return this.prisma.notaFiscal.upsert({
            where: { numero: data.numero },
            create: data,
            update: data
        });
    }

    async saveCliente(data) {
        return this.prisma.clientes.upsert({
            where: { cpf_cnpj: data.cpf_cnpj },
            create: data,
            update: data
        });
    }

    async savePeca(data: any, type: string, id: number) {
        for (const peca of data) {
            const valor_unitario = Number(peca.valor_total_liquido_da_peca);
            const qtd = peca.quantidade_da_peca;
            const valor_total = valor_unitario * qtd;

            const data: any = {
                descricao: peca.descricao_da_peca,
                qtd: peca.quantidade_da_peca,
                valor_unitario,
                valor_total,
                codigo: peca.codigo_da_peca,
            };

            if (type == 'nf') {
                data.nota_fiscal = {
                    connect: { id }
                }
                return this.prisma.pecas.upsert({
                    where: {
                        peca_nf: {
                            nf_id: id,
                            codigo: data.codigo
                        }
                    },
                    create: data,
                    update: data
                });
            }

            if (type == 'peca_os') {
                data.ordem_de_servico = {
                    connect: { id }
                }
                return this.prisma.pecas.upsert({
                    where: {
                        peca_os: {
                            os_id: id,
                            codigo: data.codigo
                        }
                    },
                    create: data,
                    update: data
                });
            }
        }
    }

    async connectPhones(phones, id) {
        for (const phone of phones) {
            try {
                await this.prisma.telefones.update({
                    where: { numero: phone.numero },
                    data: {
                        cliente: {
                            connect: { id }
                        }
                    }
                });
            } catch (error) {
                console.log('Falha ao conectar telefone ao cliente', phone, error);
            }
        }
    }

    async connectEmails(emails, id) {
        for (const email of emails) {
            try {
                await this.prisma.emails.update({
                    where: { email: email.email },
                    data: {
                        cliente: {
                            connect: { id }
                        }
                    }
                });
            } catch (error) {
                console.log('Falha ao conectar telefone ao cliente', email, error);
            }
        }
    }

    async saveDefaultPG() {
        return this.prisma.fontesPagadoras.createMany({
            data: [
                {
                    fonte_pagadora: 1,
                    descricao: 'Cliente',
                    observacao: 'Vendas de Peças, Acessórios e Serviços para clientes PF e PJ, exceto revisões, promoções e Seguro'
                },
                {
                    fonte_pagadora: 2,
                    descricao: 'Internos',
                    observacao: 'Serviços executados nos veículos de propriedade do DN'
                },
                {
                    fonte_pagadora: 3,
                    descricao: 'Usados',
                    observacao: 'Serviços de manutenção e revisão realizados em veículos usados ou de troca na venda de um zero km'
                },
                {
                    fonte_pagadora: 4,
                    descricao: 'Lojas de Peças',
                    observacao: 'Vendas de peças e acessórios para lojistas'
                },
                {
                    fonte_pagadora: 5,
                    descricao: 'Governo',
                    observacao: 'Vendas de peças e acessórios ou serviços realizados para clientes Governo / Licitações'
                },
                {
                    fonte_pagadora: 6,
                    descricao: 'n/a',
                    observacao: 'desconhecido'
                },
                {
                    fonte_pagadora: 7,
                    descricao: 'Oficinas Independentes',
                    observacao: 'Vendas de peças e acessórios ou serviços realizados para oficinas independentes'
                },
                {
                    fonte_pagadora: 8,
                    descricao: 'Garantia',
                    observacao: 'Serviços realizados em garantia, exceto 1a revisão (Usar fonte 14 para 1o Revisão e Revisões de série)'
                },
                {
                    fonte_pagadora: 9,
                    descricao: 'Concessionárias da Rede',
                    observacao: 'Vendas de peças e acessórios ou serviços realizados para outras concessionárias da rede'
                },
                {
                    fonte_pagadora: 10,
                    descricao: 'Seguro',
                    observacao: 'Vendas de Peças e Acessórios ou Serviços realizados para empresas de seguros'
                },
                {
                    fonte_pagadora: 11,
                    descricao: 'Promoções',
                    observacao: 'Promoções de vendas de peças e acessórios ou serviços'
                },
                {
                    fonte_pagadora: 12,
                    descricao: 'Não informado',
                    observacao: 'desconhecido'
                },
                {
                    fonte_pagadora: 13,
                    descricao: 'Revisão de Entrega',
                    observacao: 'Revisão de entrega do veículo novo, revisão interna do DN antes da entrega para o Cliente'
                },
                {
                    fonte_pagadora: 14,
                    descricao: 'Revisão Garantia/Série',
                    observacao: 'Mão de obra da primeira revisão do Veículo / Revisão de Série'
                },
                {
                    fonte_pagadora: 15,
                    descricao: 'Revisão Normal',
                    observacao: 'Demais Revisões pagas pelo cliente e itens obrigatórios da revisão'
                },
                {
                    fonte_pagadora: 16,
                    descricao: 'Frotista / Locadoras / Contratos',
                    observacao: 'Serviços realizados para clientes Frotistas, locadoras de veículos, contratos ou comodatos (desde que não sejam Governo ou CPF)'
                },
                {
                    fonte_pagadora: 17,
                    descricao: 'E-Commerce',
                    observacao: 'Venda Online ou através da loja virtual VW'
                },
            ],
            skipDuplicates: true
        })
    }

    async getFontePagadora(fonte_pagadora) {
        let fp = await this.prisma.fontesPagadoras.findFirst({
            where: { fonte_pagadora }
        });
        if (!fp) {
            fp = await this.prisma.fontesPagadoras.create({
                data: { fonte_pagadora }
            })
        }
        return fp;
    }
}
