import { Controller, Get } from '@nestjs/common';
import { AssobravService } from './assobrav.service';

@Controller('assobrav')
export class AssobravController {
    constructor(private readonly assobrav: AssobravService) {}

    @Get()
    async start() {
        await this.assobrav.start();
    }
}
