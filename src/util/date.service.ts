import { Injectable } from '@nestjs/common';

interface CustomDate {
    year: number;
    month: number;
    day: number;
    hours: number;
    minutes: number;
    seconds?: number;
}

@Injectable()
export class DateService {
    constructor(
    ) { }

    public daysInMonth(year: number, month: number): number {
        return new Date(year, month, 0).getDate();
    }

    public setDate(year: number = 2024, month: number = 0, day: number = 0, hours: number = 0, minutes: number = 0, seconds: number = 0): string {
        const fMonth = month.toString().padStart(2, '0');
        const fDay = day.toString().padStart(2, '0');
        const fHours = hours.toString().padStart(2, '0');
        const fMinutes = minutes.toString().padStart(2, '0');
        const fSeconds = minutes.toString().padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}:${fSeconds}`;
    }

    public getDates(year: number = 2024, month: number = 0, day: number = 1, hours: number = 0, minutes: number = 0, interval: number = 1) {
        const startDate = this.setDate(year, month, day, (hours - interval), minutes);
        const endDate = this.setDate(year, month, day, hours, minutes);
        return { startDate, endDate };
    }

    public getEndOf(term: string, year: number, month: number = 11, day: number = 1): string {
        let result: string;

        switch (term) {
            case 'year':
                result = this.setDate(year, 11, 31, 23, 59, 59);
                break;
            case 'month':
                const days = this.daysInMonth(year, month);
                result = this.setDate(year, month, days, 23, 59, 59);
                break;
            case 'day':
                result = this.setDate(month, year, day, 23, 59, 59);
                break;
        }
        return result;
    }

    public async processYear(year: number = 2024, month: number = 0, callback?) {
        for (let m = month; m <= 11; m++) {
            await this.processMonth(year, month, callback);
        }
    }

    public async processMonth(year: number = 2024, month: number = 0, callback?, day: number = 1, hours: number = 0, minutes: number = 0) {
        const date: CustomDate = { year, month, day, hours, minutes };

        for (let m = month; month <= 11; month++) {
            await this.processDay(date, callback);
        }
    }

    public async processDay(date: CustomDate, callback?) {
        const { year, month, day, hours, minutes } = date;

        for (let h = hours; h < 24; h++) {
            const { startDate, endDate } = this.getDates(year, month, day, h, minutes, 1);
            console.debug('processando dados de', startDate, endDate);
            await callback(startDate, endDate);
        }
    }
}
