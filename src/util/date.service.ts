import { Injectable } from '@nestjs/common';

interface CustomDate {
    year: number;
    month: number;
    day: number;
    hours: number;
    minutes: number;
    seconds?: number;
}

interface FormattedDates {
    startDate: string;
    endDate: string;
}

@Injectable()
export class DateService {
    constructor(
    ) { }

    public daysInMonth(year: number, month: number): number {
        return new Date(year, month, 0).getDate();
    }

    public setDate(year: number = 2024, month: number = 0, day: number = 0, hours: number = 0, minutes: number = 0, seconds: number = 0): string {
        if (hours === -1) {
            if (day === 1) {
                day = this.daysInMonth(year, (month - 1));
                month--;
            } else {
                day--;
            }
            hours = 23;
        }
        const fMonth = (month + 1).toString().padStart(2, '0');
        const fDay = day.toString().padStart(2, '0');
        const fHours = hours.toString().padStart(2, '0');
        const fMinutes = minutes.toString().padStart(2, '0');
        const fSeconds = minutes.toString().padStart(2, '0');
        return `${year}-${fMonth}-${fDay}T${fHours}:${fMinutes}:${fSeconds}`;
    }

    public getDates(year: number = 2024, month: number = 0, day: number = 1, hours: number = 0, minutes: number = 0, seconds: number = 0, interval: number = 1) {
        const startDate = this.setDate(year, month, day, hours - interval, minutes, seconds);
        const endDate = this.setDate(year, month, day, hours, minutes, seconds);
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

    public async processComplete(year: number = 2024, callback?) {
        for (let m = 0; m <= 11; m++) {
            const days = this.daysInMonth(year, m);
            for (let d = 1; d <= days; d++) {
                for (let h = 0; h < 24; h++) {
                    const { startDate, endDate } = this.getDates(year, m, d, h, 0, 1);
                    console.debug('processando dados de', startDate, endDate);
                    await callback(startDate, endDate);
                }
            }
        }
    }

    public async processCompleteTimestamp(
        year: number = 2024,
        month: number = 0,
        day: number = 1,
        hours: number = 0,
        minutes: number = 0,
        seconds: number = 0,
        callback?
    ) {
        let date = Date.UTC(year, month, day, hours, minutes, seconds);
        const finalDate = Date.UTC(year, 11, 31, 23, 59, 59);
        const oneHour = 60 * 60 * 1000;
        while (date <= finalDate) {
            if (callback) {
                const { startDate, endDate } = this.timestampToDates(date);
                await callback(startDate, endDate);
            }
            date += oneHour;
        }
    }

    public timestampToDate(timestamp: number): string {
        const date = new Date(timestamp);
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth() + 1;
        const day = date.getUTCDate();
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const seconds = date.getUTCSeconds();
        return this.setDate(year, month, day, hours, minutes, seconds);
    }

    public timestampToDates(timestamp: number): any {
        const date = new Date(timestamp);
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth();
        const day = date.getUTCDate();
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const seconds = date.getUTCSeconds();
        return this.getDates(year, month, day, hours, minutes, seconds);
    }

    public getDateObject(dateStr: string): any {
        const date = new Date(dateStr);
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth() + 1;
        const day = date.getUTCDate();
        const hour = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const seconds = date.getUTCSeconds();
        return { date, year, month, day, hour, minutes, seconds };
    }
}
