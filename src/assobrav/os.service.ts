import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OsService {
    constructor(private readonly prisma: PrismaService) {

    }

    //ck3 notas fiscais de peças no balcão
    //ck4 cancelamento da nf ou os
    //ck5 estrutura fisica do dn
    //ck6 ordem de serviços de peças e serviços na oficina
    //ck7 notas fiscais de peças e serviços na oficina

    async proccessCk(page = 1) {
        const cks = await this.prisma.findAll('ck6011', page);
        for (const ck of cks.data) {
            const record = await this.prisma.ck6011.findUnique({
                where: { id: ck.id },
                include: {
                    ck6021: true,
                    ck6031: true,
                    ck6041: {
                        include: {
                            ck6042: {
                                include: {
                                    telefones: true,
                                    emails: true
                                }
                            }
                        }
                    }
                }
            });
            // debugger;
            try {
                const os = await this.saveOs(record);
                const chassis = await this.saveChassis(os, record);
                const clientes = await this.saveClients(os, record);
                const pecas = await this.savePecas(os, record);
                const servicos = await this.saveServices(os, record);
                const fp = await this.saveFP(os, record);
            } catch (error) {
                console.error(error);
                debugger
            }
            // debugger;
        }
        if (cks.next) {
            page = cks.next;
            this.proccessCk(page);
        } else {
            return;
        }
    }

    async saveOs(os) {
        return this.prisma.tb_cad_cadastro_os.upsert({
            where: {
                os: os.numero_da_os
            },
            create: {
                os: os.numero_da_os,
            },
            update: {
                os: os.numero_da_os,
            }
        });
    }

    async saveChassis(os, data) {
        const ck = data.ck6041.map(async (item) => {
            return this.prisma.tb_cad_cadastro_os_chassis.upsert({
                where: {
                    chassis_os: {
                        chassis: item.chassi_do_veiculo,
                        os_id: os.id
                    }
                },
                create: {
                    chassis: item.chassi_do_veiculo,
                    os_id: os.id
                },
                update: {
                    chassis: item.chassis,
                    os_id: os.id
                }
            });
        })
    }

    async saveClients(os, data) {
        const ck = data.ck6041.map(async (item) => {
            const {
                id,
                indicador,
                nome_do_cliente: nome,
                cpf_cnpj,
                endereco,
                numero,
                complemento,
                bairro,
                ck6011_id
            } = item;

            const {
                cidade: municipio,
                cep,
                uf
            } = item.ck6042[0]

            const phone_residencial = item.ck6042[0].telefones.find(phone => phone.descricao.toLowerCase() == 'residencial');
            const phone_comercial = item.ck6042[0].telefones.find(phone => phone.descricao.toLowerCase() == 'comercial');
            const phone_celular = item.ck6042[0].telefones.find(phone => phone.descricao.toLowerCase() == 'celular');
            const email = item.ck6042[0].emails.find(email => email.email != null);

            const contacts = {
                tel_res: phone_residencial?.numero ?? null,
                tel_com: phone_comercial?.numero ?? null,
                tel_cel: phone_celular?.numero ?? null,
                email: email?.email ?? null
            }

            const values = {
                nome,
                cpf_cnpj,
                endereco,
                numero,
                complemento,
                bairro,
                municipio,
                uf,
                cep,
                indicador,
                id_fonte_pagadora: data.fonte_pagadora,
                ...contacts,
                os: {
                    connect: { id: os.id }
                }
            }

            return this.prisma.tb_cad_cadastro_os_clientes.upsert({
                where: {
                    clientes_os: {
                        nome: values.nome,
                        cpf_cnpj: values.cpf_cnpj
                    }
                },
                create: values,
                update: values
            })
        });
    }

    async savePecas(os, record) {
        const { fonte_pagadora, } = record;
        const pecas = record.ck6021.map(peca => ({
            id_peca: peca.codigo_da_peca,
            id_fonte_pagadora: fonte_pagadora,
            valor_unitario: peca.valor_total_liquido_da_peca,
            qtd: peca.quantidade_da_peca,
            valor_total_liquido: peca.valor_total_liquido_da_peca * peca.quantidade_da_peca,
            descricao: peca.descricao_da_peca
        }));

        for (const peca of pecas) {
            await this.prisma.tb_cad_cadastro_os_pecas.upsert({
                where: {
                    pecas_os: {
                        id_peca: peca.id_peca,
                        os_id: os.id
                    }
                },
                create: {
                    ...peca,
                    os: { connect: { id: os.id } }
                },
                update: {
                    ...peca,
                    os: { connect: { id: os.id } }
                },
            })
        }
    }

    async saveServices(os, record) {
        for (const service of record.ck6031) {
            const data = {
                id_cos: service.cos,
                desc_cos: service.descricao_do_servico,
                hora_vendida: service.hora_vendida,
                valor_total_liquido: service.valor_total_liquido_da_mao_de_obra,
                id_tipo_servico: service.tipo_de_servico,
                id_fonte_pagadora: record.fonte_pagadora,
                os: {
                    connect: { id: os.id }
                }
            }

            await this.prisma.tb_cad_cadastro_os_servicos.upsert({
                where: {
                    servicos_os: {
                        os_id: os.id,
                        id_cos: data.id_cos
                    }
                },
                create: data,
                update: data
            })
        }
    }

    async saveFP(os, record) {
        const {
            fonte_pagadora: id_fonte_pagadora,
            data_e_hora_da_abertura_da_os: data_abertura_os,
            data_e_hora_do_fechamento_da_os: data_fechamento_os,
            valor_total_liquido_das_pecas_na_os: total_peca_os,
            valor_total_liquido_da_mao_de_obra_na_os: total_mo_os,
        } = record;

        const {
            quilometragem_do_veiculo: km,
            chassi_do_veiculo: chassis,
            placa_do_veiculo: placa,
        } = record.ck6041[0]

        const total_os = parseFloat(total_mo_os) + parseFloat(total_peca_os);;

        const data = {
            km, chassis, placa, total_mo_os, total_peca_os, id_fonte_pagadora, data_abertura_os, data_fechamento_os,
            total_os,
            os: {
                connect: { id: os.id }
            }
        }

        await this.prisma.tb_cad_cadastro_os_fontes_pagadoras.upsert({
            where: {
                fp_os: {
                    os_id: os.id,
                    id_fonte_pagadora
                }
            },
            create: data,
            update: data
        })
    }
    // chassis: {
    //     create: os.ck6041.map(item => ({
    //         chassis: item.chassi_do_veiculo
    //     }))
    // },
    // servicos: {
    //     create: os.ck6031.map(item => ({
    //         id_fonte_pagadora: os.fonte_pagadora,
    //         id_cos: item.cos,
    //         desc_cos: item.descricao_do_servico,
    //         hora_vendida: item.hora_vendida,
    //         valor_total: item.valor_total_liquido_da_mao_de_obra,
    //         id_tipo_servico: item.tipo_de_servico
    //     }))
    // },
    // pecas: {
    //     create: os.ck6021.map(item => ({
    //         descricao: item.descricao_da_peca,
    //         if_fonte_pagadora: os.fonte_pagadora,
    //         qtd: item.quantidade_da_peca,
    //         valor_unitario: item.valor_total_liquido_da_peca,
    //         valor_total_liquido: (item.valor_total_liquido_da_peca * item.quantidade_da_peca)
    //     }))
    // },
    // fontes_pagadoras: {
    //     create: os.ck6041.map(item => ({
    //         id_fonte_pagadora: os.fonte_pagadora,
    //         data_abertura_os: os.data_abertura_os,
    //         data_fechamento_os: os.data_fechamento_os,
    //         total_peca_orcamento: os.valor_total_liquido_das_pecas_na_os,
    //         total_mo_orcamento: os.valor_total_liquido_da_mao_de_obra,
    //         chassis: item.chassi_do_veiculo,
    //         placa: item.placa_do_veiculo,
    //         km: item.quilometragem_do_veiculo
    //     }))
    // },
    // clientes: {
    //     create: os.ck6041.map(item => ({
    //         id_fonte_pagadora: item.fonte_pagadora,
    //         nome: item.nome_do_cliente,
    //         endereco: item.endereco,
    //         numero: item.numero,
    //         complemento: item.complemento,
    //         bairro: item.bairro,
    //         municipio: item.ck6042[0].cidade,
    //         uf: item.ck6042[0].uf,
    //         cep: item.ck6042[0].cep,
    //         cpf_cnpj: item.cpf_cnpj,
    //         indicador: item.indicador,
    //         tel_res: item.ck6042[0].telefones.find(phone => phone.descricao.toLowerCase() == 'residencial'),
    //         tel_com: item.ck6042[0].telefones.find(phone => phone.descricao.toLowerCase() == 'comercial'),
    //         tel_cel: item.ck6042[0].telefones.find(phone => phone.descricao.toLowerCase() == 'celular'),
    //         email: item.ck6042.emails[0].email
    //     }))
    // }
}
