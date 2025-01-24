import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AutoserviceService } from './autoservice.service';
import { AllExceptionsFilter } from '../all.exceptions';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class Ck6Service {
    constructor(
        private readonly config: ConfigService,
        private readonly prisma: PrismaService,
        private readonly autoservice: AutoserviceService,
        @InjectPinoLogger(Ck6Service.name) private readonly logger: PinoLogger
    ) { }

    async ck6011(ck6011) {
        const fields = [
            'numero_do_dn',
            'numero_da_os',
            'data_e_hora_da_abertura_da_os',
            'data_e_hora_do_fechamento_da_os',
            'fonte_pagadora',
            'valor_total_liquido_das_pecas_na_os',
            'valor_total_liquido_da_mao_de_obra_na_os'
        ];

        const data = this.autoservice.extractData(ck6011, fields);

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
            await this.ck6021(ck.id, ck6011.CK6021);
            await this.ck6031(ck.id, ck6011.CK6031);
            await this.ck6041(ck.id, ck6011.CK6041);
        } catch (error) {
            console.error('Erro ao salvar ck6011', data, error);
            this.logger.error('Erro ao salvar ck6011', data, error);
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
            const data = { ...this.autoservice.extractData(peca, fields), ck6011_id: id }

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
                console.error('Erro ao salvar ck6021', data, error);
                this.logger.error('Erro ao salvar ck6021', data, error);
                throw new Error('Erro ao salvar CK6021');
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
            const data = { ...this.autoservice.extractData(servico, fields), ck6011_id: id }

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
                console.error('Erro ao salvar ck6031', data, error);
                this.logger.error('Erro ao salvar ck6031', data, error);
                throw new Error('Erro ao salvar CK6031');
            }
        }
    }

    async ck6041(id, ck6041) {
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

        const data = { ...this.autoservice.extractData(ck6041, fields), ck6011_id: id }
        const searchConditions = {
            id: null,
            field: '',
            value: '',
            table: 'ck6041'
        };

        if (data.chassi_do_veiculo) {
            searchConditions.field = 'chassi_do_veiculo';
            searchConditions.value = data.chassi_do_veiculo;
        } else if (data.placa_do_veiculo) {
            searchConditions.field = 'placa_do_veiculo';
            searchConditions.value = data.placa_do_veiculo;
        } else {
            return;
        }

        console.log(searchConditions);
        try {
            let ck = await this.prisma.findOne(
                searchConditions.id,
                searchConditions.table,
                searchConditions.field,
                searchConditions.value
            );

            if (ck) {
                await this.prisma.ck6041.update({
                    where: {
                        id: ck.id
                    },
                    data
                })
            } else {
                ck = await this.prisma.ck6041.create(data);
            }
            await this.ck6042(ck.id, ck6041.CK6042);
        } catch (error) {
            console.error('Erro ao salvar CK6041', data, error);
            this.logger.error('Erro ao salvar CK6041', data, error);
            throw new HttpException('Erro ao salvar CK6041', HttpStatus.BAD_REQUEST);

        }
    }

    async ck6042(id, ck6042) {
        const fields = [
            'cidade',
            'uf',
            'cep',
        ];

        const data = { ...this.autoservice.extractData(ck6042, fields), ck6041_id: id }

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
            console.error('Erro ao salvar ck6042', data, error);
            this.logger.error('Erro ao salvar ck6042', data, error);
            // throw new HttpException('Erro personalizado no controller!', HttpStatus.BAD_REQUEST);
            throw new Error('Erro ao salvar CK6042');
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
            const data = { ...this.autoservice.extractData(phone, fields), ck6042_id: id }

            try {
                const ck = await this.prisma.telefones.upsert({
                    where: {
                        numero: data.numero
                    },
                    create: data,
                    update: data,
                    select: {
                        id: true
                    }
                });
            } catch (error) {
                console.error('Erro ao salvar telefones do ck6011', data, error);
                this.logger.error('Erro ao salvar telefones do ck6011', data, error);
                throw new Error('Erro ao salvar telefones do CK6011');
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
            const data = { ...this.autoservice.extractData(email, fields), ck6042_id: id }

            try {
                const ck = await this.prisma.emails.upsert({
                    where: {
                        email: data.email
                    },
                    create: data,
                    update: data,
                    select: {
                        id: true
                    }
                });
            } catch (error) {
                console.error('Erro ao salvar emails do ck6011', data, error);
                this.logger.error('Erro ao salvar emails do ck6011', data, error);
                throw new Error('Erro ao salvar emails do CK6011');
                // throw new HttpException('Erro ao salvar e-mails para CK6011', HttpStatus.BAD_GATEWAY)
            }
        }
    }
}
