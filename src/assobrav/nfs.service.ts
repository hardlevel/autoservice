import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConnectableObservable } from 'rxjs';

@Injectable()
export class NfsService {
    constructor(private readonly prisma: PrismaService) {

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

    nfs = {

    }

    async start() {
        let page = 1;

        while (true) {
            const nfs = await this.getNfs(page);

            if (nfs.length === 0) {
                break;
            }

            await this.saveNfs(nfs, async () => {
                console.log(`Página ${page} processada!`);
            });

            page++;
        }

        page = 1;

        // while (true) {
        //     const clientes = await this.getClientes(page);

        //     if (clientes.length === 0) {
        //         break;
        //     }

        //     await this.saveClientes(clientes);

        //     page++;
        // }

        // page = 1;
    }

    async getNfs(page = 1) {
        return this.prisma.nf_view.findMany({
            skip: (page - 1) * 50,
            take: 50,
        });
    }

    async getNf(numero_nf) {
        return this.prisma.tb_cad_cadastro_nfs.findFirst({
            where: { id_nf: numero_nf }
        })
    }

    async saveNfs(nfs, callback) {
        // Processa os registros de NFs e faz o upsert
        for (const nf of nfs) {
            const data = {
                id_nf: nf.numero_da_nota_fiscal,
                serie_nf: nf.serie_da_nota_fiscal,
                valor_total_mo: nf.valor_total_liquido_da_mao_de_obra_na_nota_fiscal,
                valor_total_pecas: nf.valor_total_liquido_das_pecas_na_nota_fiscal,
                data_emissao_os: nf.data_e_hora_da_abertura_da_os,
                data_emissao: nf.data_e_hora_da_emissao_da_nota_fiscal,
            };

            const response = await this.prisma.tb_cad_cadastro_nfs.upsert({
                where: {
                    id_nf: nf.numero_da_nota_fiscal
                },
                create: data,
                update: data
            });

            await this.getClient(nf, response);
            await this.getPecas(nf, response);
            await this.getServicos(nf, response);
            await this.getFontePagadora(nf, response);
            await this.getCancelamentos();
        }

        // Chama o callback após o processamento
        if (callback) {
            await callback();
        }
    }

    async getCancelamentos(page = 1) {
        const cancelamentos = await this.prisma.ck4001.findMany(
            {
                skip: (page - 1) * 50,
                take: 50,
            }
        );

        if (!cancelamentos) return;

        for (const ck4 of cancelamentos) {
            await this.saveCancelamento(ck4);
        }

        if (cancelamentos.length > 0) {
            return this.getCancelamentos(page + 1);
        }

        return;
    }

    async saveCancelamento(ck4) {
        let fonte_pagadora;
        let nfConnect;
        let osConnect;
        if (ck4.tipo_do_cancelamento == 'NS') {

            const nf = await this.prisma.tb_cad_cadastro_nfs.findFirst({
                where: {
                    id_nf: ck4.numero_da_nota_fiscal,
                }
            });
            if (nf) {
                nfConnect = {
                    connect: {
                        id: nf.id
                    }
                }


                const fp = await this.prisma.tb_cad_cadastro_nfs_clientes_fontes_pagadoras.findFirst({
                    where: {
                        id_nf: nf.id
                    }
                });

                fonte_pagadora = {
                    fonte_pagadora_nf: {
                        connect: {
                            id: fp.id
                        }
                    }
                }
            }
        }

        if (ck4.tipo_do_cancelamento == 'OS') {
            const os = await this.prisma.tb_cad_cadastro_os.findFirst({
                where: {
                    os: ck4.numero_da_os
                }
            });

            if (os) {
                osConnect = {
                    connect: {
                        id: os.id
                    }
                }


                const fp = await this.prisma.tb_cad_cadastro_os_fontes_pagadoras.findFirst({
                    where: {
                        os_id: os.id
                    }
                });

                fonte_pagadora = {
                    fonte_pagadora_nf: {
                        connect: {
                            id: fp.id
                        }
                    }
                }
            }
        }

        const data = {
            tipo_cancelamento: ck4.tipo_do_cancelamento,
            nfConnect,
            osConnect,
            fonte_pagadora,
            data_emissao: ck4.data_data_e_hora_da_emissao_da_nota_fiscal,
            data_abertura_os: ck4.data_data_e_hora_da_abertura_da_os,
            data_cancelamento: ck4.data_do_cancelamento_do_documento,
            serie_nf: ck4.serie_da_nota_fiscal,
            numero_dn: ck4.numero_do_dn,
            numero_nf: ck4.numero_da_nota_fiscal,
            numero_os: ck4.numero_da_os,
        };

        try {
            if (ck4.tipo_do_cancelamento == 'OS') {
                return this.prisma.tb_cad_cadastro_nfs_os_cancelamento.upsert({
                    where: {
                        cancelamento_os: {
                            numero_dn: data.numero_dn,
                            numero_os: data.numero_os
                        }
                    },
                    create: data,
                    update: data
                })
            }

            if (ck4.tipo_do_cancelamento == 'NF') {
                return this.prisma.tb_cad_cadastro_nfs_os_cancelamento.upsert({
                    where: {
                        cancelamento_nf: {
                            numero_dn: data.numero_dn,
                            numero_nf: data.numero_nf,
                        }
                    },
                    create: data,
                    update: data
                })
            }
        } catch (error) {
            console.error(error, ck4);
        }
    }

    async getFontePagadora(nf_ck, nf_view) {
        const fp = await this.prisma.fontes_pagadoras_view.findFirst({
            where: {
                numero_da_nota_fiscal: nf_ck.numero_da_nota_fiscal
            }
        });

        if (!fp) return;

        const data = {
            id_nf: fp.nota_fiscal_id,
            serie_nf: fp.serie_da_nota_fiscal,
            id_os: fp.os_id,
            nota_fiscal_id: fp.nota_fiscal_id,
            fonte_pagadora_id: fp.fonte_pagadora_id,
        }

        return this.prisma.tb_cad_cadastro_nfs_clientes_fontes_pagadoras.upsert({
            where: {
                fp_nfs: {
                    nota_fiscal_id: data.nota_fiscal_id,
                    fonte_pagadora_id: data.fonte_pagadora_id
                }
            },
            create: data,
            update: data
        });
    }

    async getClient(nf, response) {
        const client = await this.prisma.clientes_view.findFirst({
            where: {
                AND: [
                    { parent: nf.categoria },
                    { parent_id: nf.id }
                ]
            }
        });

        if (!client) return;

        const fonte_pagadora = await this.prisma.tb_cki_fontes_pagadoras.findUnique({
            where: {
                id: client.fonte_pagadora
            }
        })

        if (fonte_pagadora) {
            const classificacao = await this.saveClientClassificacao(fonte_pagadora, response)
        }

        return this.saveClient(client, response);
    }

    async getPecas(nf, response) {
        const pecas = await this.prisma.pecas_view.findMany({
            where: {
                AND: [
                    { parent: nf.categoria },
                    { parent_id: nf.id }
                ]
            }
        });

        if (pecas) {
            for (const peca of pecas) {
                const data = {
                    id_nf: response.id,
                    serie_nf: response.serie_nf,
                    qtd: peca.quantidade_da_peca,
                    valor_unitario: peca.valor_total_liquido_da_peca,
                    descricao: peca.descricao_da_peca,
                    valor_total_liquido: peca.valor_total_liquido_da_peca,
                    id_peca: peca.codigo_da_peca
                };
                await this.prisma.tb_cad_cadastro_nfs_pecas.upsert({
                    where: {
                        pecas_nfs: {
                            tb_cad_cadastro_nfs_id: response.id,
                            id_peca: peca.codigo_da_peca
                        }
                    },
                    create: data,
                    update: data
                })
            }
        }
    }

    async getServicos(nf, response) {
        const servicos = await this.prisma.servicos_view.findMany({
            where: {
                AND: [
                    { parent: nf.categoria },
                    { parent_id: nf.id }
                ]
            }
        });

        if (servicos) {
            for (const servico of servicos) {
                const data = {
                    id_nf: response.id,
                    serie_nf: response.serie_nf,
                    hora_vendida: servico.hora_vendida,
                    id_cos: servico.cos,
                    des_cos: servico.descricao_do_servico,
                    valor_total_liquido: servico.valor_total_liquido_da_mao_de_obra,
                };
                await this.prisma.tb_cad_cadastro_nfs_servicos.upsert({
                    where: {
                        id_cos: servico.cos
                    },
                    create: data,
                    update: data
                })
            }
        }
    }

    async getClientes(page = 1) {
        return this.prisma.clientes_view.findMany({
            skip: (page - 1) * 50,
            take: 50,
        })
    }

    async saveClientClassificacao(classificacao, nf) {
        const data = {
            id_nf: nf.id,
            serie_nf: nf.serie_nf,
            classificacao: {
                connectOrCreate: {
                    where: {
                        id_cla_cliente: classificacao.id
                    },
                    create: {
                        id_cla_cliente: classificacao.id,
                        desc_cla_cliente: classificacao.desc_fonte_pagadora
                    }
                }
            }
        };
        try {
            return this.prisma.tb_cad_cadastro_nfs_clientes_classificacao.upsert({
                where: {
                    cli_class: {
                        id_nf: nf.id,
                        id_cla_cliente: classificacao.id
                    }
                },
                create: data,
                update: data
            });
        } catch (error) {
            console.error(error, data);
        }
    }

    async saveClient(client, nf) {
        const data = {
            nome: client.nome_do_cliente,
            cpf_cnpj: client.cpf_cnpj,
            endereco: client.endereco,
            numero: client.numero,
            complemento: client.complemento,
            bairro: client.bairro,
            municipio: client.cidade,
            uf: client.uf,
            cep: client.cep,
            indicador: nf.indicador,
            tel_res: client.tel_res,
            tel_cel: client.tel_cel,
            tel_com: client.tel_com,
            email: client.email_res ?? client.email_com,
            serie_nf: nf.serie_nf,
            id_nf: nf.id_nf,
            tb_cad_cadastro_nfs: {
                connect: {
                    id: nf.id
                }
            }
        };

        return this.prisma.tb_cad_cadastro_nfs_cliente.upsert({
            where: {
                clientes_nfs: {
                    nome: client.nome_do_cliente,
                    cpf_cnpj: client.cpf_cnpj
                }
            },
            create: data,
            update: data
        });
    }

    async savePeca(peca, nf) {

    }

    // async saveClientes(clientes) {
    //     for (const cliente of clientes) {
    //         const data = {

    //         };

    //         await this.prisma.tb_cad_cadastro_nfs_cliente.upsert({
    //             where: {
    //                 clientes_nfs: {
    //                     nome: cliente.nome,
    //                     cpf_cnpj: cliente.cpf_cnpj
    //                 }
    //             },
    //             create: data,
    //             update: data
    //         });
    //     }
    // }

    // async proccessCk3(page = 1) {
    //     if (page === 0) page++;

    //     const ck3 = await this.prisma.ck3001.findMany({
    //         skip: (page - 1) * 50,
    //         take: 50,
    //         include: {
    //             ck3002: {
    //                 include: {
    //                     telefones: true,
    //                     emails: true
    //                 }
    //             },
    //             ck3003: true
    //         }
    //     })
    //         .then(async (result) => {
    //             for (const ck of result) {
    //                 const nfs = await this.saveNfCk3(ck);
    //                 const clientes = await this.saveClientsCk3(nfs.id, ck);
    //             }
    //             if (result.length > 0) {
    //                 return this.proccessCk3(page + 1);
    //             }
    //         })
    //         .catch(err => console.error(err));
    // }

    // async proccessCk7(page = 1) {
    //     if (page === 0) page++;

    //     const ck7 = await this.prisma.ck7001.findMany({
    //         skip: (page - 1) * 50,
    //         take: 50,
    //         include: {
    //             ck7002: {
    //                 include: {
    //                     telefones: true,
    //                     emails: true
    //                 }
    //             },
    //             ck7003: true,
    //             ck7004: true
    //         }
    //     })
    //         .then(async (result) => {
    //             for (const ck of result) {
    //                 const nfs = await this.saveNfCk7(ck);
    //                 const clientes = await this.saveClientsCk7(nfs.id, ck);
    //                 const service = await this.saveServicesCk7(nfs.id, ck);
    //                 if (service) {
    //                     const fontes_pagadoras = await this.saveFPCk7(nfs.id, service.id, ck);
    //                 }
    //                 const pecas = await this.savePecasCk7(nfs.id, ck);
    //             }
    //             if (result.length > 0) {
    //                 return this.proccessCk7(page + 1);
    //             }
    //         })
    //         .catch(err => console.error(err));
    // }

    // async getCk3(id) {
    //     try {
    //         return this.prisma.ck3001.findUnique({
    //             where: { id },
    //             include: {
    //                 ck3002: {
    //                     include: {
    //                         telefones: true,
    //                         emails: true
    //                     }
    //                 },
    //                 ck3003: true
    //             }
    //         });
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    // async saveNfCk3(ck3) {
    //     const data = {
    //         serie_nf: ck3.serie_da_nota_fiscal,
    //         data_emissao: ck3.data_e_hora_da_emissao_da_nota_fiscal,
    //         valor_total: ck3.valor_total_liquido_das_pecas_na_nota_fiscal,
    //         id_nf: ck3.numero_da_nota_fiscal
    //     };

    //     try {
    //         return this.prisma.tb_cad_cadastro_nfs.upsert({
    //             where: {
    //                 id_nf: ck3.numero_da_nota_fiscal
    //             },
    //             create: data,
    //             update: data
    //         });
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    // async saveClientsCk3(id, ck3) {
    //     const data = {
    //         nome: ck3.nome_do_cliente,
    //         serie_nf: ck3.serie_da_nota_fiscal,
    //         endereco: ck3.endereco,
    //         numero: ck3.numero,
    //         complemento: ck3.complemento,
    //         cpf_cnpj: ck3.cpf_cnpj,
    //         indicador: ck3.indicador,
    //         cep: ck3.ck3002[0].uf,
    //         bairro: ck3.ck3002[0].bairro,
    //         municipio: ck3.ck3002[0].cidade,
    //         uf: ck3.ck3002[0].uf,
    //         tb_cad_cadastro_nfs: {
    //             connect: { id }
    //         }
    //     };

    //     const phones = ck3.ck3002[0].telefones.reduce((acc, phone) => {
    //         const descricao = phone.descricao.toLowerCase();

    //         if (descricao === 'residencial') acc.tel_res = phone.numero;
    //         if (descricao === 'celular') acc.tel_cel = phone.numero;
    //         if (descricao === 'comercial') acc.tel_com = phone.numero;

    //         return acc;
    //     }, {});

    //     const email = ck3.ck3002[0].emails?.[0]?.email || null;

    //     try {
    //         return this.prisma.tb_cad_cadastro_nfs_cliente.upsert({
    //             where: {
    //                 clientes_nfs: {
    //                     nome: data.nome,
    //                     cpf_cnpj: data.cpf_cnpj
    //                 }
    //             },
    //             create: { ...data, ...phones, email },
    //             update: { ...data, ...phones, email }
    //         });
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    // async saveNfCk7(ck7) {
    //     const valor_total = (parseFloat(ck7.valor_total_liquido_da_mao_de_obra_na_nota_fiscal) +
    //         parseFloat(ck7.valor_total_liquido_das_pecas_na_nota_fiscal)).toFixed(2);

    //     const data = {
    //         id_nf: ck7.numero_da_nota_fiscal,
    //         data_emissao: ck7.data_e_hora_da_emissao_da_nota_fiscal,
    //         valor_total_mo: ck7.valor_total_liquido_da_mao_de_obra_na_nota_fiscal,
    //         valor_total_pecas: ck7.valor_total_liquido_das_pecas_na_nota_fiscal,
    //         data_emissao_os: ck7.data_e_hora_da_abertura_da_os,
    //         id_os: ck7.numero_da_os,
    //         serie_nf: ck7.serie_da_nota_fiscal,
    //         valor_total,
    //     };

    //     try {
    //         return this.prisma.tb_cad_cadastro_nfs.upsert({
    //             where: {
    //                 id_nf: data.id_nf
    //             },
    //             create: data,
    //             update: data
    //         });
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    // async saveClientsCk7(id, ck7) {
    //     const data = {
    //         serie_nf: ck7.serie_da_nota_fiscal,
    //         nome: ck7.nome_do_cliente,
    //         cpf_cnpj: ck7.ck7002[0].cpf_cnpj,
    //         endereco: ck7.endereco,
    //         uf: ck7.ck7002[0].uf,
    //         bairro: ck7.ck7002[0].bairro,
    //         numero: ck7.ck7002[0].numero,
    //         municipio: ck7.ck7002[0].cidade,
    //         cep: ck7.ck7002[0].cep,
    //         indicador: ck7.indicador,
    //         complemento: ck7.ck7002[0].complemento,
    //         tb_cad_cadastro_nfs: {
    //             connect: { id }
    //         }

    //     };

    //     const phones = ck7.ck7002[0].telefones.reduce((acc, phone) => {
    //         const descricao = phone.descricao.toLowerCase();

    //         if (descricao === 'residencial') acc.tel_res = phone.numero;
    //         if (descricao === 'celular') acc.tel_cel = phone.numero;
    //         if (descricao === 'comercial') acc.tel_com = phone.numero;

    //         return acc;
    //     }, {});

    //     const email = ck7.ck7002[0].emails?.[0]?.email || null;

    //     try {
    //         return this.prisma.tb_cad_cadastro_nfs_cliente.upsert({
    //             where: {
    //                 clientes_nfs: {
    //                     nome: data.nome,
    //                     cpf_cnpj: data.cpf_cnpj
    //                 }
    //             },
    //             create: { ...data, ...phones, email },
    //             update: { ...data, ...phones, email }
    //         })
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    // async saveServicesCk7(id, ck7) {
    //     const service = ck7.ck7004[0];

    //     if (!service) return;

    //     const data = {
    //         serie_nf: ck7.serie_da_nota_fiscal,
    //         hora_vendida: service.hora_vendida,
    //         id_cos: service.cos,
    //         des_cos: service.descricao_do_servico,
    //         valor_total_liquido: service.valor_total_liquido_da_mao_de_obra,
    //         tb_cad_cadastro_nfs: {
    //             connect: { id }
    //         }
    //     }

    //     try {
    //         return this.prisma.tb_cad_cadastro_nfs_servicos.upsert({
    //             where: {
    //                 id_cos: data.id_cos
    //             },
    //             create: data,
    //             update: data
    //         });
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    // async savePecasCk7(id, ck7) {
    //     for (const peca of ck7.ck7003) {
    //         const valor = parseFloat(peca.valor_total_liquido_da_peca?.toString().replace(',', '.')) || 0;
    //         const qtd = parseInt(peca.quantidade_da_peca);
    //         const data = {
    //             id_peca: peca.codigo_da_peca,
    //             serie_nf: ck7.serie_da_nota_fiscal,
    //             qtd: peca.quantidade_da_peca,
    //             descricao: peca.descricao_da_peca,
    //             valor_unitario: valor,
    //             valor_total_liquido: valor * qtd,
    //             tb_cad_cadastro_nfs: {
    //                 connect: { id }
    //             }
    //         }

    //         try {
    //             return this.prisma.tb_cad_cadastro_nfs_pecas.upsert({
    //                 where: {
    //                     pecas_nfs: {
    //                         tb_cad_cadastro_nfs_id: id,
    //                         id_peca: data.id_peca
    //                     }
    //                 },
    //                 create: data,
    //                 update: data
    //             });
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     }
    // }

    // async saveFPCk7(id, id_os, ck7) {
    //     const data = {
    //         serie_nf: ck7.serie_da_nota_fiscal,
    //         id_os,
    //         fonte_pagadora: {
    //             connect: {
    //                 id: ck7.fonte_pagadora
    //             }
    //         },
    //         tb_cad_cadastro_nfs: {
    //             connect: { id }
    //         }
    //     }

    //     try {
    //         return this.prisma.tb_cad_cadastro_nfs_clientes_fontes_pagadoras.upsert({
    //             where: {
    //                 fp_nfs: {
    //                     id_os,
    //                     tb_cad_cadastro_nfs_id: id,
    //                     id_fonte_pagadora: ck7.fonte_pagadora
    //                 }
    //             },
    //             create: data,
    //             update: data
    //         })
    //     } catch (error) {
    //         console.error(error, 'dados:', ck7, 'data:', data);
    //     }
    // }

    // async proccessCk4(page = 1) {
    //     if (page === 0) page++;

    //     const ck4 = await this.prisma.ck4001.findMany({
    //         skip: (page - 1) * 50,
    //         take: 50,
    //     })
    //         .then(async (result) => {
    //             for (const ck of result) {
    //                 const cancelamento = await this.saveCancelamentos(ck);
    //             }
    //             if (result.length > 0) {
    //                 return this.proccessCk4(page + 1);
    //             }
    //         })
    //         .catch(err => console.error(err));
    // }

    // async saveCancelamentos(ck) {
    //     let id_nf: number;
    //     let id_os: number;
    //     let id_fonte_pagadora: number;

    //     const data: any = {
    //         tipo_cancelamento: ck.tipo_do_cancelamento,
    //         serie_nf: ck.serie_da_nota_fiscal,
    //         data_emissao: ck.data_e_hora_da_emissao_da_nota_fiscal,
    //         data_abertura_os: ck.data_e_hora_da_abertura_da_os,
    //         data_cancelamento: ck.data_do_cancelamento_do_documento,
    //         numero_dn: ck.numero_do_dn,
    //         numero_nf: ck.numero_da_nota_fiscal,
    //         numero_os: ck.numero_da_os,
    //     }
    //     try {
    //         if (ck.numero_da_nota_fiscal) {
    //             const nf = await this.prisma.tb_cad_cadastro_nfs.findFirst({
    //                 where: {
    //                     id_nf: ck.numero_da_nota_fiscal
    //                 },
    //                 include: {
    //                     fontes_pagadoras: true
    //                 }
    //             });
    //             console.log(nf)
    //             if (nf) {
    //                 console.log(nf.id);
    //                 // data.id_nf = nf.id;
    //                 data.nf = {
    //                     connect: { id: nf.id }
    //                 }
    //                 // data.id_fonte_pagadora = nf.fontes_pagadoras[0].id
    //                 // if (nf.fontes_pagadoras?.length) {
    //                 //     data.fonte_pagadora = {
    //                 //         connect: { id: nf.fontes_pagadoras[0].id }
    //                 //     }
    //                 // } else {
    //                 //     console.warn(`Nenhuma fonte_pagadora encontrada para NF ${nf.id}`);
    //                 // }

    //             }
    //             // console.log(nf);
    //         }

    //         if (ck.numero_da_os) {
    //             const os = await this.prisma.tb_cad_cadastro_os.findFirst({
    //                 where: {
    //                     os: ck.numero_da_os
    //                 },
    //                 include: {
    //                     fontes_pagadoras: true
    //                 }
    //             });
    //             // console.log(os);
    //             if (os) {
    //                 console.log(os.id)
    //                 // data.id_os = os.id;
    //                 data.os = {
    //                     connect: { id: os.id }
    //                 }
    //                 data.id_fonte_pagadora = os.fontes_pagadoras[0].id
    //                 // if (os.fontes_pagadoras?.length) {
    //                 //     data.fonte_pagadora = {
    //                 //         connect: { id: os.fontes_pagadoras[0].id }
    //                 //     }
    //                 // } else {
    //                 //     console.warn(`Nenhuma fonte_pagadora encontrada para OS ${os.id}`);
    //                 // }

    //             }
    //         }

    //         console.log(data);

    //         // const document = await this.prisma.tb_cad_cadastro_nfs_os_cancelamento.findFirst({
    //         //     where: {
    //         //         OR: [
    //         //             { id_os }, { id_nf }
    //         //         ]
    //         //     }
    //         // });

    //         // if (document) {
    //         //     return this.prisma.tb_cad_cadastro_nfs_os_cancelamento.update({
    //         //         where: {
    //         //             id: document.id
    //         //         },
    //         //         data
    //         //     });
    //         // } else {
    //         //     return this.prisma.tb_cad_cadastro_nfs_os_cancelamento.create({ data });
    //         // }
    //     } catch (error) {
    //         console.error(error, data);
    //     }
    // }
}
