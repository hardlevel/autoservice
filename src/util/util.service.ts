import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { PrismaService } from '../prisma/prisma.service';
import { CustomError } from '../common/errors/custom-error';

@Injectable()
export class UtilService {
    constructor() { }

    delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getCurrentDate(interval: number) {
        const date = moment();
        const endDate = date.format();
        const startDate = date.subtract(interval, 'hours').format();
        return {
            endDate,
            startDate,
            endDateShort: date.format('YYYY-MM-DDTHH:mm:ss'),
            startDateShort: date.subtract(interval, 'hours').format('YYYY-MM-DDTHH:mm:ss'),
        }
    }

    convertDate(date) {
        const now = moment().local();
        const local = moment(date).local();
        return {
            original: date,
            originalJs: new Date(date),
            moment: local,
            local,
            br: local.toLocaleString(),
            momentFormat: local.format(),
            momentSimple: local.format('YYYY-MM-DDTHH:mm:ss'),
            timestampM: local.unix(),
            timestampS: local.valueOf(),
            now: moment().format(),
            diff: now.diff(local, 'hours')
        }
    }

    extractData(data, fields) {
        const newData = fields.reduce((acc, field) => {
            if (data[field] != null && data[field] !== '') {
                if (field.startsWith('data_')) {
                    acc[field] = new Date(data[field]);
                    // } else if (field.startsWith('valor_')) {
                    //   acc[field] = data[field].toLocaleString('pt-BR');
                } else {
                    acc[field] = data[field];
                }
            }
            return acc;
        }, {});
        return newData;
    };

    extractUnique(data: Record<string, any>, fields: string[], table: string) {
        return {
            [`${table}_cod`]: fields.reduce((acc, field) => {
                if (data[field] !== undefined) {
                    acc[field] = data[field];
                }
                return acc;
            }, {})
        };
    }

    getDate() {
        const date = moment();
        return {
            date,
            day: date.date(),
            month: date.month(),
            year: date.year()
        }
    }

    serialize(data) {
        return JSON.stringify(
            this,
            (key, value) => (typeof value === 'bigint' ? value.toString() : value)
        );
    }

    async timer(seconds: number, text: string = "Aguardando...") {
        let remainingSeconds = seconds;

        const progressInterval = setInterval(() => {
            process.stdout.write(`\r${text} ${remainingSeconds} segundos restantes`);
            remainingSeconds--;

            if (remainingSeconds < 0) {
                clearInterval(progressInterval);
                console.log("\n");
            }
        }, 1000);

        await new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }

    async progressByTime(taskName: string, total: number, progressInterval: number = 1000) {
        let progress = 0;

        const progressBarLength = 30;
        const progressIntervalTime = total / progressBarLength;

        const interval = setInterval(() => {
            const progressBar = '='.repeat(Math.floor(progress / (100 / progressBarLength))) + ' '.repeat(progressBarLength - Math.floor(progress / (100 / progressBarLength)));

            process.stdout.write(`\r[${progressBar}] ${progress.toFixed(2)}% - ${taskName}`);

            if (progress >= 100) {
                clearInterval(interval);
                console.log('\nTarefa concluída!');
            }
        }, progressIntervalTime);

        for (let i = 0; i <= total; i++) {
            await new Promise(resolve => setTimeout(resolve, progressInterval));
            progress = (i / total) * 100;
        }
    }

    async progressByValue(taskName, total, currentProgress) {
        const progressBarLength = 30;
        const progressPercentage = ((total - currentProgress) / total) * 100;
        const progressBar = '='.repeat(Math.floor(progressPercentage / (100 / progressBarLength))) + ' '.repeat(progressBarLength - Math.floor(progressPercentage / (100 / progressBarLength)));
        process.stdout.write(`\r${taskName}: [${progressBar}] ${progressPercentage.toFixed(2)}%\n`);

        if (progressPercentage >= 100) {
            console.log('\nTarefa concluída!');
        }
    }


    async diffDays(date) {
        const currentDate = moment(date);
        const end = currentDate.clone().endOf('year');
        const leap = currentDate.clone().isLeapYear();
        const total = leap ? 366 : 365;
        const remaining = end.diff(currentDate, 'days');
        return { total, remaining }
    }

    async remainingDays(date) {
        const days = await this.diffDays(date);
        await this.progressByValue('Dias restantes', days.total, days.remaining);
    }

    isLastDayOfYear(date) {
        const currentDate = moment(date);
        const lastMomentOfYear = moment().endOf('year');
        return currentDate.isSame(lastMomentOfYear);
    }
}
