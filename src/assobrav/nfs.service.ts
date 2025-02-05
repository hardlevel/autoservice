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

    //TODO fazer os registros consultados serem paginados

    async start() {
        await this.proccessCk3();
    }

    async proccessCk3(page = 1) {
        const ck3 = await this.prisma.findAll('ck3001', page);
        // console.log(ck3);
        for (const ck of ck3.data) {
            console.log(ck);
        }

        if (ck3.next) {
            this.proccessCk3(ck3.next);
        }
    }

    async saveNf() {

    }
}
