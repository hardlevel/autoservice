import { Controller, Get } from '@nestjs/common';
import { AssobravService } from './assobrav.service';
import { OsService } from './os.service';
import { NfsService } from './nfs.service';

@Controller('assobrav')
export class AssobravController {
    constructor(
        private readonly assobrav: AssobravService,
        private readonly os: OsService,
        private readonly nfs: NfsService
    ) { }

    @Get()
    async start() {
        // await this.assobrav.teste();
        // await this.os.proccessCk();
        // await this.nfs.start();
        // await this.os.start();
        // await this.assobrav.proccessData();
        return 'concluido!';
    }
}
