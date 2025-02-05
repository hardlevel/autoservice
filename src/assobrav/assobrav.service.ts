import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssobravService {
    constructor(private readonly prisma: PrismaService) { }



    //fontes pagadoras
    // id_cadastro          Int       @id
    // id_os                Int
    // id_fonte_pagadora    Int
    // data_abertura_os     DateTime
    // data_fechamento_os   DateTime?
    // total_os             Decimal   @default(0)
    // total_orcamento      Decimal   @default(0)
    // total_mo_os          Decimal   @default(0)
    // total_peca_orcamento Decimal   @default(0)
    // total_mo_orcamento   Decimal   @default(0)
    // geral_nf             String
    // nr_orcamento         String
    // data_orcamento       DateTime
    // chassis              String
    // placa                String
    // certificacao         String
    // km                   Int

    async start() {
        const cks = await this.prisma.findAll('ck6011');
        // console.log(cks);

        //clientes
        // id_cadastro       Int     @id
        // id_os             Int //ck6011
        // id_fonte_pagadora Int //ck6011
        // nome              String? ck6041
        // endereco          String //ck6042 -> ck6041
        // numero            String //ck6042 -> ck6041
        // complemento       String? //ck6042 -> ck6041
        // bairro            String //ck6042 -> ck6041
        // municipio         String //ck6042 cidade
        // uf                String //ck6042
        // cep               String //ck6042 ok
        // cpf_cnpj          String //ck6042 -> ck6041
        // indicador         String //ck6041 -> ck6041
        // tel_res           String? //ck6042 ok
        // tel_com           String? //ck6042 ok
        // tel_cel           String? //ck6042 ok
        // email             String //ck6042 ok
        for (const ck of cks.data) {
            console.log(ck)
        }
    }
}
