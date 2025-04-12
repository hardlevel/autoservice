import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UtilService } from "../util/util.service";
import { DateService } from "../util/date.service";

@Injectable()
export class ApiService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly util: UtilService,
        private readonly date: DateService,
    ) { }

    // async getServicosYear(year: number = 2024) {
    //     const { startDate, endDate } = this.date.getDates(year);

    //     const monthlyCount = await this.prisma.$queryRaw<{ month: number; total: number }[]>`
    //       SELECT
    //         EXTRACT(MONTH FROM data_e_hora_da_abertura_da_os) AS month,
    //         COUNT(id) AS total
    //       FROM servicos_view
    //       WHERE data_e_hora_da_abertura_da_os >= ${startDate}
    //         AND data_e_hora_da_abertura_da_os < ${endDate}
    //       GROUP BY month
    //       ORDER BY month;
    //     `;

    //     const monthlyData = monthlyCount.reduce((acc: { [key: number]: number }, curr: { month: number; total: number }) => {
    //         acc[curr.month] = curr.total;
    //         return acc;
    //     }, {});

    //     const total = await this.prisma.servicos_view.count({
    //         where: {
    //             data_e_hora_da_abertura_da_os: {
    //                 gte: startDate,
    //                 lt: endDate
    //             }
    //         }
    //     });

    //     return {
    //         total,
    //         monthly: monthlyData
    //     };
    // }

    // async getServicosMonth(year: number = 2024, month: number = 0) {
    //     const { startDate, endDate } = this.date.getDates(year, month);

    //     const whereCondition: any = {
    //         data_e_hora_da_abertura_da_os: {
    //             gte: new Date(startDate),
    //             lt: new Date(endDate)
    //         }
    //     };

    //     const [total, daily] = await this.prisma.$transaction([
    //         this.prisma.servicos_view.count({
    //             where: whereCondition
    //         }),
    //         this.prisma.$queryRaw`
    //             SELECT
    //                 EXTRACT(DAY FROM data_e_hora_da_abertura_da_os) AS day,
    //                 COUNT(id) AS total
    //             FROM servicos_view
    //             WHERE data_e_hora_da_abertura_da_os >= ${whereCondition.data_e_hora_da_abertura_da_os.gte}
    //             AND data_e_hora_da_abertura_da_os < ${whereCondition.data_e_hora_da_abertura_da_os.lt}
    //             GROUP BY day
    //             ORDER BY day ASC;
    //         `
    //     ]);

    //     return {
    //         total,
    //         daily: (daily as { day: number; total: number }[]).reduce((acc, { day, total }) => {
    //             acc[day] = total;
    //             return acc;
    //         }, {} as Record<number, number>)
    //     };
    // }

    // async getServicesStateMonth(year: number = 2024, month: number = 0) {
    //     const { startDate, endDate } = this.date.getDates(year, month);

    //     const whereCondition: any = {
    //         data_e_hora_da_abertura_da_os: {
    //             gte: new Date(startDate),
    //             lt: new Date(endDate)
    //         }
    //     };

    //     return this.prisma.servicos_view.groupBy({
    //         by: ['uf'],
    //         where: whereCondition,
    //         _count: {
    //             id: true
    //         }
    //     });
    // }

    // async getServicesStateYear(year: number = 2024) {
    //     const { startDate, endDate } = this.date.getDates(year);

    //     const whereCondition: any = {
    //         data_e_hora_da_abertura_da_os: {
    //             gte: new Date(startDate),
    //             lt: new Date(endDate)
    //         }
    //     };


    //     return this.prisma.servicos_view.groupBy({
    //         by: ['uf'],
    //         where: whereCondition,
    //         _count: {
    //             id: true
    //         }
    //     });
    // }

    // async getClients(page = 1) {
    //     const [results, total] = await this.prisma.$transaction([
    //         this.prisma.clientes_view.findMany({
    //             skip: (page - 1) * 50,
    //             take: 50
    //         }),
    //         this.prisma.clientes_view.count()
    //     ]);
    //     return {
    //         results,
    //         total,
    //         page
    //     };
    // }

    // async getNfs(page = 1) {
    //     const [results, total] = await this.prisma.$transaction([
    //         this.prisma.nf_view.findMany({
    //             skip: (page - 1) * 50,
    //             take: 50
    //         }),
    //         this.prisma.nf_view.count()
    //     ]);
    //     return {
    //         results,
    //         total,
    //         page
    //     };
    // }

    // async getPecas(page = 1) {
    //     const [results, total] = await this.prisma.$transaction([
    //         this.prisma.nf_view.findMany({
    //             skip: (page - 1) * 50,
    //             take: 50
    //         }),
    //         this.prisma.nf_view.count()
    //     ]);
    //     return {
    //         results,
    //         total,
    //         page
    //     };
    // }

    // async getServicos(page = 1, year: number = 2024, month: number = 1) {
    //     const whereCondition: any = {};
    //     console.log(year);
    //     if (year) {
    //         whereCondition.data_e_hora_da_abertura_da_os = {
    //             gte: new Date(`${year}-${month.toString().padStart(2, "0")}-01`)
    //         }
    //     }

    //     const [results, total] = await this.prisma.$transaction([
    //         this.prisma.servicos_view.findMany({
    //             skip: (page - 1) * 50,
    //             take: 50,
    //             where: whereCondition
    //         }),
    //         this.prisma.servicos_view.count()
    //     ]);

    //     return {
    //         results,
    //         total,
    //         page
    //     };
    // }
}