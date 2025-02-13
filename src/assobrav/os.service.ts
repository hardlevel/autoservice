import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OsService {
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

    async start() {
        let page = 1;

        while (true) {
            const cks = await this.getServicesCk();

            for (const os of cks) {
                const assobravOs = await this.saveOs(os);
                const nfs = await this.saveNf(os, assobravOs);
                const chassi = await this.saveChassis(os.ck6041[0], assobravOs);
                //TODO fazer uma forma de conectar nas fontes pagadoras existentes
                const fonte_pagadora = await this.saveFontePagadora(os, assobravOs, chassi);

                const pecas = await this.savePecas(os.ck6021, assobravOs, fonte_pagadora.id);
                const servicos = await this.saveServicos(os.ck6031, assobravOs, fonte_pagadora.id);
                const clientes = await this.saveClientes(os.ck6041[0], assobravOs, fonte_pagadora.id);
                //TODO clientes, os-nfs, cancelamentos, rever fonte pagadora e outras funções, refatorar
                // minimizar a quantidade de consultas no banco
                //rever tambem nfs
            }

            page++;
        }
    }

    async getServicesCk(page = 1) {
        return this.prisma.ck6011.findMany({
            take: 50,
            skip: (page - 1) * 50,
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
    }

    async getServiceCk(numero_da_os) {
        return this.prisma.ck6011.findFirst({
            where: {
                numero_da_os
            },
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
    }

    async getServiceAssobrav(os) {
        return this.prisma.tb_cad_cadastro_os.findFirst({
            where: { os },
            include: {
                servicos: true,
                pecas: true,
                clientes: true,
                chassis: true,
                fontes_pagadoras: true,
                cancelamentos: true
            }
        });
    }

    async saveOs(os) {
        const data = { os: os.numero_da_os };

        return this.prisma.tb_cad_cadastro_os.upsert({
            where: data,
            create: data,
            update: data,
        });
    }

    async saveFontePagadora(os, assobravOs, veiculo) {
        const data = {
            data_abertura_os: os.data_e_hora_da_abertura_da_os,
            data_fechamento_os: os.data_e_hora_do_fechamento_da_os,
            total_mo_os: os.valor_total_liquido_da_mao_de_obra_na_os,
            total_peca_os: os.valor_total_liquido_das_pecas_na_os,
            chassis: veiculo.chassis,
            placa: veiculo.placa,
            km: veiculo.km,
            fonte_pagadora: {
                connect: { id: os.fonte_pagadora }
            },
            os: {
                connect: { id: assobravOs.id }
            }
        };
        return this.prisma.tb_cad_cadastro_os_fontes_pagadoras.upsert({
            where: {
                fp_os: {
                    os_id: assobravOs.id,
                    fonte_pagadora_id: os.fonte_pagadora
                }
            },
            create: data,
            update: data
        });
    }

    async getPecas(parent_id) {
        return this.prisma.pecas_view.findMany({
            where: {
                AND: [
                    { parent: 'Ck6011' },
                    { parent_id }
                ]
            }
        });
    }

    async savePecas(pecas, os, fp) {
        for (const peca of pecas) {
            const data = {
                descricao: peca.descricao_da_peca,
                id_fonte_pagadora: fp,
                qtd: peca.quantidade_da_peca,
                valor_unitario: peca.valor_total_liquido_da_peca,
                valor_total_liquido: peca.valor_total_liquido_da_peca,
                id_peca: peca.codigo_da_peca,
                os: {
                    connect: { id: os.id }
                }
            };

            await this.prisma.tb_cad_cadastro_os_pecas.upsert({
                where: {
                    pecas_os: {
                        id_peca: peca.codigo_da_peca,
                        os_id: os.id
                    }
                },
                create: data,
                update: data
            });
        }
    }

    async getServicoAssobravOs(os_id, id_cos) {
        return this.prisma.tb_cad_cadastro_os_servicos.findFirst({
            where: {
                AND: [
                    { os_id },
                    { id_cos }
                ]
            }
        });
    }

    async getServicos(parent_id) {
        return this.prisma.servicos_view.findMany({
            where: {
                AND: [
                    { parent: 'Ck6011' },
                    { parent_id }
                ]
            }
        });
    }

    async saveServicos(os, assobravOs, fp) {
        const servicos = await this.getServicos(os.id);

        for (const servico of servicos) {
            const data = {
                desc_cos: servico.descricao_do_servico,
                id_fonte_pagadora: fp,
                id_cos: servico.cos,
                hora_vendida: servico.hora_vendida,
                valor_total: servico.valor_total_liquido_da_mao_de_obra,
                os: {
                    connect: { id: assobravOs.id }
                }
            };
            await this.prisma.tb_cad_cadastro_os_servicos.upsert({
                where: {
                    servicos_os: {
                        id_cos: data.id_cos,
                        os_id: assobravOs.id
                    }
                },
                create: data,
                update: data
            });
        }
    }

    async saveServico(data) {
        return this.prisma.tb_cad_cadastro_os_servicos.upsert({
            where: {
                servicos_os: {
                    id_cos: data.id_cos,
                    os_id: data.os_id
                }
            },
            create: data,
            update: data
        });
    }

    async getChassis(id) {
        return this.prisma.ck6041.findFirst({
            where: {
                ck6011_id: id,
            }
        });
    }

    async saveChassis(os, assobravOs) {
        const vehicle = await this.getChassis(os.id);

        if (!vehicle) {
            return;
        }

        const data = {
            chassis: vehicle.chassi_do_veiculo,
            os_id: assobravOs.id,
        };

        const chassis = this.prisma.tb_cad_cadastro_os_chassis.upsert({
            where: {
                chassis_os: {
                    chassis: vehicle.chassi_do_veiculo,
                    os_id: assobravOs.id
                }
            },
            create: data,
            update: data,
        });

        return {
            id: (await chassis).id,
            chassis: vehicle.chassi_do_veiculo,
            placa: vehicle.placa_do_veiculo,
            km: vehicle.quilometragem_do_veiculo
        }
    }

    async getNfs(page = 1) {
        return this.prisma.nf_view.findMany({
            skip: (page - 1) * 50,
            take: 50,
        });
    }

    async getOsNf(id_nf, os_id) {
        return this.prisma.tb_cad_cadastro_os_nfs.findUnique({
            where: {
                nfs_os: { id_nf, os_id }
            }
        })
    }

    async saveCliente(cliente, os, id_fonte_pagadora) {
        const data = {
            id_fonte_pagadora,
            nome: cliente.nome_do_cliente,
        };
    }

    async saveNf(os, assobravOs) {
        console.log(os)
        // const nf = await this.prisma.ck7001.findFirst({
        //     where: {
        //         numero_da_os: os.numero_da_os,
        //     }
        // });

        // if (!nf) {
        //     return;
        // }

        // const storedNf = await this.prisma.nf_view.findFirst({
        //     where: {
        //         numero_da_nota_fiscal: nf.numero_da_nota_fiscal,
        //     }
        // });

        // const data = {
        //     serie_nf: nf.serie_da_nota_fiscal,
        //     nf: {
        //         connect: { id: storedNf.id }
        //     },
        //     fonte_pagadora: {
        //         connect: {
        //             id: fp
        //         }
        //     },
        //     os: {
        //         connect: { id: response.id }
        //     }
        // };


        // return this.prisma.tb_cad_cadastro_os_nfs.upsert({
        //     where: {
        //         nfs_os: {
        //             id_nf: storedNf.id,
        //             os_id: response.id
        //         }
        //     },
        //     create: data,
        //     update: data
        // });

    }

    // async proccessCk(page = 1) {
    //     const cks = await this.prisma.findAll('ck6011', page);
    //     for (const ck of cks.data) {
    //         const record = await this.prisma.ck6011.findUnique({
    //             where: { id: ck.id },
    //             include: {
    //                 ck6021: true,
    //                 ck6031: true,
    //                 ck6041: {
    //                     include: {
    //                         ck6042: {
    //                             include: {
    //                                 telefones: true,
    //                                 emails: true
    //                             }
    //                         }
    //                     }
    //                 }
    //             }
    //         });

    //         try {
    //             const os = await this.saveOs(record);
    //             const chassis = await this.saveChassis(os, record);
    //             const clientes = await this.saveClients(os, record);
    //             const pecas = await this.savePecas(os, record);
    //             const servicos = await this.saveServices(os, record);
    //             // const fp = await this.saveFP(os, record);
    //             // const nf = await this.saveNf(os, record, fp.id);
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     }
    //     if (cks.next) {
    //         page = cks.next;
    //         this.proccessCk(page);
    //     } else {
    //         return;
    //     }
    // }

    // // async saveOs(os) {
    // //     try {
    // //         return this.prisma.tb_cad_cadastro_os.upsert({
    // //             where: {
    // //                 os: os.numero_da_os
    // //             },
    // //             create: {
    // //                 os: os.numero_da_os,
    // //             },
    // //             update: {
    // //                 os: os.numero_da_os,
    // //             }
    // //         });
    // //     } catch (error) {
    // //         console.error(error);
    // //     }
    // // }

    // // async saveChassis(os, data) {
    // //     try {
    // //         const ck = data.ck6041.map(async (item) => {
    // //             return this.prisma.tb_cad_cadastro_os_chassis.upsert({
    // //                 where: {
    // //                     chassis_os: {
    // //                         chassis: item.chassi_do_veiculo,
    // //                         os_id: os.id
    // //                     }
    // //                 },
    // //                 create: {
    // //                     chassis: item.chassi_do_veiculo,
    // //                     os_id: os.id
    // //                 },
    // //                 update: {
    // //                     chassis: item.chassis,
    // //                     os_id: os.id
    // //                 }
    // //             });
    // //         })
    // //     } catch (error) {
    // //         console.error(error);
    // //     }
    // // }

    // async saveClients(os, data) {
    //     const ck = data.ck6041.map(async (item) => {
    //         const {
    //             id,
    //             indicador,
    //             nome_do_cliente: nome,
    //             cpf_cnpj,
    //             endereco,
    //             numero,
    //             complemento,
    //             bairro,
    //             ck6011_id
    //         } = item;

    //         const {
    //             cidade: municipio,
    //             cep,
    //             uf
    //         } = item.ck6042[0]

    //         const phone_residencial = item.ck6042[0].telefones.find(phone => phone.descricao.toLowerCase() == 'residencial');
    //         const phone_comercial = item.ck6042[0].telefones.find(phone => phone.descricao.toLowerCase() == 'comercial');
    //         const phone_celular = item.ck6042[0].telefones.find(phone => phone.descricao.toLowerCase() == 'celular');
    //         const email = item.ck6042[0].emails.find(email => email.email != null);

    //         const contacts = {
    //             tel_res: phone_residencial?.numero ?? null,
    //             tel_com: phone_comercial?.numero ?? null,
    //             tel_cel: phone_celular?.numero ?? null,
    //             email: email?.email ?? null
    //         }

    //         const values = {
    //             nome,
    //             cpf_cnpj,
    //             endereco,
    //             numero,
    //             complemento,
    //             bairro,
    //             municipio,
    //             uf,
    //             cep,
    //             indicador,
    //             id_fonte_pagadora: data.fonte_pagadora,
    //             ...contacts,
    //             os: {
    //                 connect: { id: os.id }
    //             }
    //         }

    //         try {
    //             return this.prisma.tb_cad_cadastro_os_clientes.upsert({
    //                 where: {
    //                     clientes_os: {
    //                         nome: values.nome,
    //                         cpf_cnpj: values.cpf_cnpj
    //                     }
    //                 },
    //                 create: values,
    //                 update: values
    //             })
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     });
    // }

    // async savePecas(os, record) {
    //     const ids: any = [];

    //     const { fonte_pagadora, } = record;

    //     const pecas = record.ck6021.map(peca => ({
    //         id_peca: peca.codigo_da_peca,
    //         id_fonte_pagadora: fonte_pagadora,
    //         valor_unitario: peca.valor_total_liquido_da_peca,
    //         qtd: peca.quantidade_da_peca,
    //         valor_total_liquido: peca.valor_total_liquido_da_peca * peca.quantidade_da_peca,
    //         descricao: peca.descricao_da_peca
    //     }));

    //     try {
    //         for (const peca of pecas) {
    //             const response = await this.prisma.tb_cad_cadastro_os_pecas.upsert({
    //                 where: {
    //                     pecas_os: {
    //                         id_peca: peca.id_peca,
    //                         os_id: os.id
    //                     }
    //                 },
    //                 create: {
    //                     ...peca,
    //                     os: { connect: { id: os.id } }
    //                 },
    //                 update: {
    //                     ...peca,
    //                     os: { connect: { id: os.id } }
    //                 },
    //             });
    //             ids.push(response.id);
    //         }
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    // async saveServices(os, record) {
    //     const ids: any = [];

    //     try {
    //         for (const service of record.ck6031) {
    //             const data = {
    //                 id_cos: service.cos,
    //                 desc_cos: service.descricao_do_servico,
    //                 hora_vendida: service.hora_vendida,
    //                 valor_total_liquido: service.valor_total_liquido_da_mao_de_obra,
    //                 id_tipo_servico: service.tipo_de_servico,
    //                 id_fonte_pagadora: record.fonte_pagadora,
    //                 os: {
    //                     connect: { id: os.id }
    //                 }
    //             }

    //             const response = await this.prisma.tb_cad_cadastro_os_servicos.upsert({
    //                 where: {
    //                     servicos_os: {
    //                         os_id: os.id,
    //                         id_cos: data.id_cos
    //                     }
    //                 },
    //                 create: data,
    //                 update: data
    //             });

    //             ids.push(response.id);
    //         }

    //         return ids;

    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    // // async saveFP(os, record) {
    // //     const {
    // //         fonte_pagadora: id_fonte_pagadora,
    // //         data_e_hora_da_abertura_da_os: data_abertura_os,
    // //         data_e_hora_do_fechamento_da_os: data_fechamento_os,
    // //         valor_total_liquido_das_pecas_na_os: total_peca_os,
    // //         valor_total_liquido_da_mao_de_obra_na_os: total_mo_os,
    // //     } = record;

    // //     const {
    // //         quilometragem_do_veiculo: km,
    // //         chassi_do_veiculo: chassis,
    // //         placa_do_veiculo: placa,
    // //     } = record.ck6041[0]

    // //     const total_os = parseFloat(total_mo_os) + parseFloat(total_peca_os);;

    // //     const data = {
    // //         km, chassis, placa, total_mo_os, total_peca_os, data_abertura_os, data_fechamento_os,
    // //         total_os,
    // //         os: {
    // //             connect: { id: os.id }
    // //         },
    // //         fonte_pagadora: {
    // //             connect: { id: id_fonte_pagadora }
    // //         }
    // //     }

    // //     try {
    // //         return await this.prisma.tb_cad_cadastro_os_fontes_pagadoras.upsert({
    // //             where: {
    // //                 fp_os: {
    // //                     os_id: os.id,
    // //                     fonte_pagadora_id
    // //                 }
    // //             },
    // //             create: data,
    // //             update: data
    // //         })
    // //     } catch (error) {
    // //         console.error(error, 'dados:', record, 'data:', data);
    // //     }
    // // }

    // async saveNf(os, record, id) {
    //     console.log(record);
    //     const data = {
    //         serie_nf: record.serie_da_nota_fiscal,
    //         id_fonte_pagadora: id,
    //         os_id: os.id
    //     };

    //     try {
    //         // return this.prisma.tb_cad_cadastro_os_nfs.upsert({
    //         //     where: {
    //         //         id_nf:
    //         //     },
    //         //     create: data,
    //         //     update: data
    //         // });
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }
}
