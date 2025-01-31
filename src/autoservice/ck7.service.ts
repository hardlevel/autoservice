import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { AutoserviceService } from './autoservice.service';
import { UtilService } from '../util/util.service';
//import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class Ck7Service {
    constructor(
        private readonly config: ConfigService,
        private readonly prisma: PrismaService,
        private readonly autoservice: AutoserviceService,
        private readonly util: UtilService
        //@InjectPinoLogger(Ck7Service.name) private readonly logger: PinoLogger
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

        console.log(ck7001.numero_da_nota_fiscal)
        if (ck7001.numero_da_nota_fiscal == null) {
            debugger
        }
        if (ck7001.numero_da_nota_fiscal == undefined) {
            debugger
        }

        if (ck7001.numero_da_nota_fiscal == '') {
            debugger
        }
        const uniqueFields = ['numero_da_nota_fiscal', 'numero_do_dn'];
        // const data = await this.prisma.proccessCk('ck7001', ck7001, fields, uniqueFields);

        // if (data) console.log('registro salvo ck7001', data);
        // const data = this.util.extractData(ck7001, fields);

        // try {
        //     let ck = await this.prisma.ck7001.findUnique({
        //         where: {
        //             ck7001_cod: {
        //                 numero_da_nota_fiscal: ck7001.numero_da_nota_fiscal,
        //                 numero_do_dn: ck7001.numero_do_dn
        //             }
        //         }
        //     });

        //     if (ck) {
        //         await this.prisma.ck7001.update({
        //             where: {
        //                 id: ck.id
        //             },
        //             data
        //         });
        //     } else {
        //         ck = await this.prisma.ck7001.create({ data });
        //     }
        //     // const ck = await this.prisma.ck7001.upsert({
        //     //     where: {
        //     //         ck7001_cod: {
        //     //             numero_do_dn: data.numero_do_dn,
        //     //             numero_da_nota_fiscal: data.numero_da_nota_fiscal
        //     //         }
        //     //     },
        //     //     create: data,
        //     //     update: data,
        //     //     select: {
        //     //         id: true
        //     //     }
        //     // })
        //     if (ck7001.CK7002.length) await this.ck7002(ck.id, ck7001.CK7002);
        //     if (ck7001.CK7003.length) await this.ck7003(ck.id, ck7001.CK7003);
        //     if (ck7001.CK7004.length) await this.ck7004(ck.id, ck7001.CK7004);
        // } catch (error) {
        //     // console.error('Erro ao salvar dados no CK7001', ck7001, error);
        //     //this.logger.error('Erro ao salvar dados no CK7001', ck7001, error);
        // }
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
        const data = { ...this.util.extractData(ck7002, fields), ck7001_id: id };

        try {
            let ck = await this.prisma.findUnique('ck7002', {
                ck7002_cod: {
                    cidade: ck7002.cidade,
                    uf: ck7002.uf,
                    indicador: ck7002.indicador,
                    ck7001_id: id
                }
            })

            if (ck) {
                await this.prisma.update('ck7002', ck.id, data);
            } else {
                ck = await this.prisma.create('ck7002', data);
            }
            // const ck = await this.prisma.ck7002.upsert({
            //     where: {
            //         ck7002_cod: {
            //             cidade: ck7002.cidade,
            //             uf: ck7002.uf,
            //             indicador: ck7002.indicador,
            //             ck7001_id: id
            //         }
            //     },
            //     create: data,
            //     update: data,
            //     select: {
            //         id: true
            //     }
            // })
            const phones = await this.phones(ck.id, ck7002.telefones);
            const emails = await this.emails(ck.id, ck7002.emails);
        } catch (error) {
            // console.error('Erro ao salvar dados no CK7002', ck7002, error);
            //this.logger.error('Erro ao salvar dados no CK7002', ck7002, error);
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
            const data = { ...this.util.extractData(phone, fields), ck7002_id: id };

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
                // console.error('Erro ao salvar telefones do CK7002', data, error)
                //this.logger.error('Erro ao salvar telefones do CK7002', data, error)
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

            const data = { ...this.util.extractData(email, fields), ck7002_id: id };

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
                // console.error('Erro ao salvar emails do CK7002', data, error)
                //this.logger.error('Erro ao salvar emails do CK7002', data, error)
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

            const data = { ...this.util.extractData(item, fields), ck7001_id: id };

            try {
                let ck = await this.prisma.findUnique('ck7007', {
                    ck7003_cod: {
                        codigo_da_peca: data.codigo_da_peca,
                        ck7001_id: data.ck7001_id
                    }
                });

                if (ck) {
                    await this.prisma.update('ck7003', ck.id, data);
                } else {
                    ck = await this.prisma.create('ck7003', data);
                }
                // const ck = await this.prisma.ck7003.upsert({
                //     where: {
                //         ck7003_cod: {
                //             codigo_da_peca: data.codigo_da_peca,
                //             ck7001_id: data.ck7001_id
                //         }
                //     },
                //     create: data,
                //     update: data,
                //     select: {
                //         id: true
                //     }
                // });
            } catch (error) {
                // console.error('Erro ao salvar CK7003', data, error);
                //this.logger.error('Erro ao salvar CK7003', data, error);
            }
        }
    }

    async ck7004(id, ck7004) {
        for (const item of ck7004) {
            const fields = [
                "cos",
                "descricao_do_servico",
                "hora_vendida",
                "valor_total_liquido_da_mao_de_obra",
                "tipo_de_servico",
            ]
            const data = { ...this.util.extractData(ck7004, fields), ck7001_id: id };
            // console.log(data);
            try {
                let ck = await this.prisma.findUnique('ck7004', {
                    ck7004_cod: {
                        cos: data.cos,
                        ck7001_id: data.ck7001_id
                    }
                });

                if (ck) {
                    await this.prisma.update('ck7004', ck.id, data);
                } else {
                    ck = await this.prisma.create('ck7004', data);
                }
                // const ck = await this.prisma.ck7004.upsert({
                //     where: {
                //         ck7004_cod: {
                //             cos: data.cos,
                //             ck7001_id: data.ck7001_id
                //         }
                //     },
                //     create: data,
                //     update: data,
                //     select: {
                //         id: true
                //     }
                // });
            } catch (error) {
                // console.error('Erro ao salvar CK7004', ck7004, data, error)
                //this.logger.error('Erro ao salvar CK7004', data, error)
            }
        }
    }
}
