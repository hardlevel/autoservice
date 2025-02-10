import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NfsService {
    constructor(private readonly prisma: PrismaService) {

    }

    //ck3 notas fiscais de peças no balcão
    //ck4 cancelamento da nf ou os
    //ck5 estrutura fisica do dn
    //ck6 ordem de serviços de peças e serviços na oficina
    //ck7 notas fiscais de peças e serviços na oficina
    //ck7001 -> nota fiscal
    //ck7002 -> dados do cliente
    //ck7003 -> dados de peças
    //ck7004 -> dados de serviço

    nfs = {

    }

    async start() {
        await this.proccessCk3();
        await this.proccessCk7();
        await this.proccessCk4();
    }

    async proccessCk3(page = 1) {
        if (page === 0) page++;

        const ck3 = await this.prisma.ck3001.findMany({
            skip: (page - 1) * 50,
            take: 50,
            include: {
                ck3002: {
                    include: {
                        telefones: true,
                        emails: true
                    }
                },
                ck3003: true
            }
        })
            .then(async (result) => {
                for (const ck of result) {
                    const nfs = await this.saveNfCk3(ck);
                    const clientes = await this.saveClientsCk3(nfs.id, ck);
                }
                if (result.length > 0) {
                    return this.proccessCk3(page + 1);
                }
            })
            .catch(err => console.error(err));
    }

    async proccessCk7(page = 1) {
        if (page === 0) page++;

        const ck7 = await this.prisma.ck7001.findMany({
            skip: (page - 1) * 50,
            take: 50,
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
        })
            .then(async (result) => {
                for (const ck of result) {
                    const nfs = await this.saveNfCk7(ck);
                    const clientes = await this.saveClientsCk7(nfs.id, ck);
                    const service = await this.saveServicesCk7(nfs.id, ck);
                    if (service) {
                        const fontes_pagadoras = await this.saveFPCk7(nfs.id, service.id, ck);
                    }
                    const pecas = await this.savePecasCk7(nfs.id, ck);
                }
                if (result.length > 0) {
                    return this.proccessCk7(page + 1);
                }
            })
            .catch(err => console.error(err));
    }

    async getCk3(id) {
        try {
            return this.prisma.ck3001.findUnique({
                where: { id },
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
        } catch (error) {
            console.error(error);
        }
    }

    async saveNfCk3(ck3) {
        const data = {
            serie_nf: ck3.serie_da_nota_fiscal,
            data_emissao: ck3.data_e_hora_da_emissao_da_nota_fiscal,
            valor_total: ck3.valor_total_liquido_das_pecas_na_nota_fiscal,
            id_nf: ck3.numero_da_nota_fiscal
        };

        try {
            return this.prisma.tb_cad_cadastro_nfs.upsert({
                where: {
                    id_nf: ck3.numero_da_nota_fiscal
                },
                create: data,
                update: data
            });
        } catch (error) {
            console.error(error);
        }
    }

    async saveClientsCk3(id, ck3) {
        const data = {
            nome: ck3.nome_do_cliente,
            serie_nf: ck3.serie_da_nota_fiscal,
            endereco: ck3.endereco,
            numero: ck3.numero,
            complemento: ck3.complemento,
            cpf_cnpj: ck3.cpf_cnpj,
            indicador: ck3.indicador,
            cep: ck3.ck3002[0].uf,
            bairro: ck3.ck3002[0].bairro,
            municipio: ck3.ck3002[0].cidade,
            uf: ck3.ck3002[0].uf,
            tb_cad_cadastro_nfs: {
                connect: { id }
            }
        };

        const phones = ck3.ck3002[0].telefones.reduce((acc, phone) => {
            const descricao = phone.descricao.toLowerCase();

            if (descricao === 'residencial') acc.tel_res = phone.numero;
            if (descricao === 'celular') acc.tel_cel = phone.numero;
            if (descricao === 'comercial') acc.tel_com = phone.numero;

            return acc;
        }, {});

        const email = ck3.ck3002[0].emails?.[0]?.email || null;

        try {
            return this.prisma.tb_cad_cadastro_nfs_cliente.upsert({
                where: {
                    clientes_nfs: {
                        nome: data.nome,
                        cpf_cnpj: data.cpf_cnpj
                    }
                },
                create: { ...data, ...phones, email },
                update: { ...data, ...phones, email }
            });
        } catch (error) {
            console.error(error);
        }
    }

    async saveNfCk7(ck7) {
        const valor_total = (parseFloat(ck7.valor_total_liquido_da_mao_de_obra_na_nota_fiscal) +
            parseFloat(ck7.valor_total_liquido_das_pecas_na_nota_fiscal)).toFixed(2);

        const data = {
            id_nf: ck7.numero_da_nota_fiscal,
            data_emissao: ck7.data_e_hora_da_emissao_da_nota_fiscal,
            valor_total_mo: ck7.valor_total_liquido_da_mao_de_obra_na_nota_fiscal,
            valor_total_pecas: ck7.valor_total_liquido_das_pecas_na_nota_fiscal,
            data_emissao_os: ck7.data_e_hora_da_abertura_da_os,
            id_os: ck7.numero_da_os,
            serie_nf: ck7.serie_da_nota_fiscal,
            valor_total,
        };

        try {
            return this.prisma.tb_cad_cadastro_nfs.upsert({
                where: {
                    id_nf: data.id_nf
                },
                create: data,
                update: data
            });
        } catch (error) {
            console.error(error);
        }
    }

    async saveClientsCk7(id, ck7) {
        const data = {
            serie_nf: ck7.serie_da_nota_fiscal,
            nome: ck7.nome_do_cliente,
            cpf_cnpj: ck7.ck7002[0].cpf_cnpj,
            endereco: ck7.endereco,
            uf: ck7.ck7002[0].uf,
            bairro: ck7.ck7002[0].bairro,
            numero: ck7.ck7002[0].numero,
            municipio: ck7.ck7002[0].cidade,
            cep: ck7.ck7002[0].cep,
            indicador: ck7.indicador,
            complemento: ck7.ck7002[0].complemento,
            tb_cad_cadastro_nfs: {
                connect: { id }
            }

        };

        const phones = ck7.ck7002[0].telefones.reduce((acc, phone) => {
            const descricao = phone.descricao.toLowerCase();

            if (descricao === 'residencial') acc.tel_res = phone.numero;
            if (descricao === 'celular') acc.tel_cel = phone.numero;
            if (descricao === 'comercial') acc.tel_com = phone.numero;

            return acc;
        }, {});

        const email = ck7.ck7002[0].emails?.[0]?.email || null;

        try {
            return this.prisma.tb_cad_cadastro_nfs_cliente.upsert({
                where: {
                    clientes_nfs: {
                        nome: data.nome,
                        cpf_cnpj: data.cpf_cnpj
                    }
                },
                create: { ...data, ...phones, email },
                update: { ...data, ...phones, email }
            })
        } catch (error) {
            console.error(error);
        }
    }

    async saveServicesCk7(id, ck7) {
        const service = ck7.ck7004[0];

        if (!service) return;

        const data = {
            serie_nf: ck7.serie_da_nota_fiscal,
            hora_vendida: service.hora_vendida,
            id_cos: service.cos,
            des_cos: service.descricao_do_servico,
            valor_total_liquido: service.valor_total_liquido_da_mao_de_obra,
            tb_cad_cadastro_nfs: {
                connect: { id }
            }
        }

        try {
            return this.prisma.tb_cad_cadastro_nfs_servicos.upsert({
                where: {
                    id_cos: data.id_cos
                },
                create: data,
                update: data
            });
        } catch (error) {
            console.error(error);
        }
    }

    async savePecasCk7(id, ck7) {
        for (const peca of ck7.ck7003) {
            const valor = parseFloat(peca.valor_total_liquido_da_peca?.toString().replace(',', '.')) || 0;
            const qtd = parseInt(peca.quantidade_da_peca);
            const data = {
                id_peca: peca.codigo_da_peca,
                serie_nf: ck7.serie_da_nota_fiscal,
                qtd: peca.quantidade_da_peca,
                descricao: peca.descricao_da_peca,
                valor_unitario: valor,
                valor_total_liquido: valor * qtd,
                tb_cad_cadastro_nfs: {
                    connect: { id }
                }
            }

            try {
                return this.prisma.tb_cad_cadastro_nfs_pecas.upsert({
                    where: {
                        pecas_nfs: {
                            tb_cad_cadastro_nfs_id: id,
                            id_peca: data.id_peca
                        }
                    },
                    create: data,
                    update: data
                });
            } catch (error) {
                console.error(error);
            }
        }
    }

    async saveFPCk7(id, id_os, ck7) {
        const data = {
            serie_nf: ck7.serie_da_nota_fiscal,
            id_os,
            fonte_pagadora: {
                connect: {
                    id: ck7.fonte_pagadora
                }
            },
            tb_cad_cadastro_nfs: {
                connect: { id }
            }
        }

        try {
            return this.prisma.tb_cad_cadastro_nfs_clientes_fontes_pagadoras.upsert({
                where: {
                    fp_nfs: {
                        id_os,
                        tb_cad_cadastro_nfs_id: id,
                        id_fonte_pagadora: ck7.fonte_pagadora
                    }
                },
                create: data,
                update: data
            })
        } catch (error) {
            console.error(error, 'dados:', ck7, 'data:', data);
        }
    }

    async proccessCk4(page = 1) {
        if (page === 0) page++;

        const ck4 = await this.prisma.ck4001.findMany({
            skip: (page - 1) * 50,
            take: 50,
        })
            .then(async (result) => {
                for (const ck of result) {
                    const cancelamento = await this.saveCancelamentos(ck);
                }
                if (result.length > 0) {
                    return this.proccessCk4(page + 1);
                }
            })
            .catch(err => console.error(err));
    }

    async saveCancelamentos(ck) {
        let id_nf: number;
        let id_os: number;
        let id_fonte_pagadora: number;

        const data: any = {
            tipo_cancelamento: ck.tipo_do_cancelamento,
            serie_nf: ck.serie_da_nota_fiscal,
            data_emissao: ck.data_e_hora_da_emissao_da_nota_fiscal,
            data_abertura_os: ck.data_e_hora_da_abertura_da_os,
            data_cancelamento: ck.data_do_cancelamento_do_documento,
            numero_dn: ck.numero_do_dn,
            numero_nf: ck.numero_da_nota_fiscal,
            numero_os: ck.numero_da_os,
        }
        try {
            if (ck.numero_da_nota_fiscal) {
                const nf = await this.prisma.tb_cad_cadastro_nfs.findFirst({
                    where: {
                        id_nf: ck.numero_da_nota_fiscal
                    },
                    include: {
                        fontes_pagadoras: true
                    }
                });
                console.log(nf)
                if (nf) {
                    console.log(nf.id);
                    // data.id_nf = nf.id;
                    data.nf = {
                        connect: { id: nf.id }
                    }
                    // data.id_fonte_pagadora = nf.fontes_pagadoras[0].id
                    // if (nf.fontes_pagadoras?.length) {
                    //     data.fonte_pagadora = {
                    //         connect: { id: nf.fontes_pagadoras[0].id }
                    //     }
                    // } else {
                    //     console.warn(`Nenhuma fonte_pagadora encontrada para NF ${nf.id}`);
                    // }

                }
                // console.log(nf);
            }

            if (ck.numero_da_os) {
                const os = await this.prisma.tb_cad_cadastro_os.findFirst({
                    where: {
                        os: ck.numero_da_os
                    },
                    include: {
                        fontes_pagadoras: true
                    }
                });
                // console.log(os);
                if (os) {
                    console.log(os.id)
                    // data.id_os = os.id;
                    data.os = {
                        connect: { id: os.id }
                    }
                    data.id_fonte_pagadora = os.fontes_pagadoras[0].id
                    // if (os.fontes_pagadoras?.length) {
                    //     data.fonte_pagadora = {
                    //         connect: { id: os.fontes_pagadoras[0].id }
                    //     }
                    // } else {
                    //     console.warn(`Nenhuma fonte_pagadora encontrada para OS ${os.id}`);
                    // }

                }
            }

            console.log(data);

            // const document = await this.prisma.tb_cad_cadastro_nfs_os_cancelamento.findFirst({
            //     where: {
            //         OR: [
            //             { id_os }, { id_nf }
            //         ]
            //     }
            // });

            // if (document) {
            //     return this.prisma.tb_cad_cadastro_nfs_os_cancelamento.update({
            //         where: {
            //             id: document.id
            //         },
            //         data
            //     });
            // } else {
            //     return this.prisma.tb_cad_cadastro_nfs_os_cancelamento.create({ data });
            // }
        } catch (error) {
            console.error(error, data);
        }
    }
}
