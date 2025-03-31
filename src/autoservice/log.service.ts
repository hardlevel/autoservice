import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Logger } from "@nestjs/common";
import { DateService } from "../util/date.service";

@Injectable()
export class LogService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly dates: DateService,
    ) { }

    async saveLastSearch(startDate, endDate) {
        return this.prisma.lastSearch.upsert({
            where: { id: 1 },
            create: {
                id: 1, startDate, endDate
            },
            update: { startDate, endDate }
        });
    }

    async getLastSearch() {
        return this.prisma.lastSearch.findFirst({
            where: { id: 1 }
        });
    }

    async saveLastParams(data) {
        console.log('salvando data', data);
        return this.prisma.lastParams.upsert({
            where: { year: parseInt(data.year) },
            create: data,
            update: data
        });
    }

    async getLastParams(year) {
        return this.prisma.lastParams.findFirst({
            where: { year }
        });
    }

    async clearLastParam(year) {
        return this.prisma.lastParams.delete({
            where: { year }
        });
    }

    async changeStatusLastParam(year) {
        return this.prisma.lastParams.update({
            where: { year },
            data: { status: true }
        });
    }

    setLog(level: string, message: string, error: string, startDate?: string | Date, endDate?: string | Date) {
        return Logger[level](`message: ${message} \nErro: ${error} \nStartDate: ${startDate}, EndDate: ${endDate}`);
    }
}