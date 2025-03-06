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
}
