import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OsService } from './os.service';
import { NfsService } from './nfs.service';

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

    }


}
