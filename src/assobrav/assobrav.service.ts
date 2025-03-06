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
    // async teste() {
    //     const test = await this.prisma.findMany({
    //         take: 100,
    //         skip: 0,
    //     });
    //     console.log(test);
    // }
    async proccessData() {
        // await this.saveDefaultPG();
        // await this.getNFCk3();
        // await this.getNFCk7()
        // const nfs = await this.getNF();
        // console.log(nfs);
        // const pecas = await this.getPecas();
        // console.log(pecas);
        // const servicos = await this.getServicos();
        // console.log(servicos);
        // const clientes = await this.getClientes();
        // console.log(clientes);
    }

    // async getClientes(page: number = 1) {
    //     return this.prisma.clientes_view.findMany({
    //         take: 100,
    //         skip: (page - 1) * 100,
    //     });
    // }

    // async getServicos(page: number = 1) {
    //     return this.prisma.servicos_view.findMany({
    //         take: 100,
    //         skip: (page - 1) * 100,
    //     });
    // }

    // async getPecas(page: number = 1) {
    //     return this.prisma.pecas_view.findMany({
    //         take: 100,
    //         skip: (page - 1) * 100,
    //     });
    // }

    // async getNF(page: number = 1) {
    //     //teste
    //     return this.prisma.nf_view.findMany({
    //         take: 100,
    //         skip: (page - 1) * 100,
    //     });
    // }
}
