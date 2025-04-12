import { Injectable } from "@nestjs/common";

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
  constructor() {}

  public daysInMonth(year: number, month: number): number {
    return new Date(year, month, 0).getDate();
  }

  public setDate(
    year: number = 2024,
    month: number = 0,
    day: number = 0,
    hours: number = 0,
    minutes: number = 0,
    seconds: number = 0,
  ): string {
    if (hours === -1) {
      const previousDay = new Date(year, month, day, hours);
      month = previousDay.getMonth();
      day = previousDay.getDate();
      hours = previousDay.getHours();
    }
    const fMonth = (month + 1).toString().padStart(2, "0");
    const fDay = day.toString().padStart(2, "0");
    const fHours = hours.toString().padStart(2, "0");
    const fMinutes = minutes.toString().padStart(2, "0");
    const fSeconds = seconds.toString().padStart(2, "0");
    if (isNaN(new Date(`${year}-${fMonth}-${fDay}`).getTime())) {
      throw new Error(`Invalid date: ${year}-${fMonth}-${fDay}T${fHours}:${fMinutes}:${fSeconds}`);
    }
    return `${year}-${fMonth}-${fDay}T${fHours}:${fMinutes}:${fSeconds}`;
  }

  // public getDates(year: number = 2024, month: number = 0, day: number = 1, hours: number = 0, minutes: number = 0, seconds: number = 0, interval: number = 1) {
  //     const startDate = this.setDate(year, month, day, hours - interval, minutes, seconds);
  //     const endDate = this.setDate(year, month, day, hours, minutes, seconds);
  //     return { startDate, endDate };
  // }

  // public getDates(year: number = 2024, month: number = 0, day: number = 1, hour: number = 0, minutes: number = 0, seconds: number = 0) {
  //     const start = new Date(year, month, day, hour, minutes, seconds);
  //     const end = new Date(start);
  //     end.setHours(end.getHours() + 1);

  //     return {
  //         startDate: start.toISOString(),
  //         endDate: end.toISOString(),
  //     };
  // }

  public getDates(
    year: number = 2024,
    month: number = 0,
    day: number = 1,
    hour: number = 0,
    minutes: number = 0,
    seconds: number = 0,
  ) {
    const startDate = this.formatDate(new Date(year, month, day, hour - 1, minutes, seconds));
    const endDate = this.formatDate(new Date(year, month, day, hour, minutes, seconds));

    return {
      startDate,
      endDate,
    };
  }

  private formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const d = date.getDate().toString().padStart(2, "0");
    const h = date.getHours().toString().padStart(2, "0");
    const min = date.getMinutes().toString().padStart(2, "0");
    const s = date.getSeconds().toString().padStart(2, "0");
    return `${y}-${m}-${d}T${h}:${min}:${s}`;
  }

  public getDatesFormat(
    year: number = 2024,
    month: number = 0,
    day: number = 1,
    hours: number = 0,
    minutes: number = 0,
    interval: number = 1,
  ) {
    const d = day.toString().padStart(2, "0");
    const h1 = hours.toString().padStart(2, "0");
    let h2, m2, s2;
    if (hours === 23) {
      h2 = hours.toString().padStart(2, "0");
      m2 = 59;
      s2 = 59;
    } else {
      h2 = (hours + interval).toString().padStart(2, "0");
      m2 = "00";
      s2 = "00";
    }
    const min = minutes.toString().padStart(2, "0");
    const m = month.toString().padStart(2, "0");
    return {
      startDate: `${year}-${m}-${d}T${h1}:${min}:00`,
      endDate: `${year}-${m}-${d}T${h2}:${m2}:${s2}`,
    };
  }

  public getDatesFormatMinutes(
    year: number = 2024,
    month: number = 1,
    day: number = 1,
    hours: number = 0,
    minutes: number = 0,
    interval: number = 10,
  ) {
    const d = day.toString().padStart(2, "0");
    const h1 = hours.toString().padStart(2, "0");
    const min = minutes.toString().padStart(2, "0");
    const m = month.toString().padStart(2, "0");

    let h2: string, m2: string, s2: string;

    if (hours === 23 && minutes + interval >= 60) {
      // fim do dia
      h2 = "23";
      m2 = "59";
      s2 = "59";
    } else {
      let newMinutes = minutes + interval;
      let newHours = hours;

      if (newMinutes >= 60) {
        newMinutes = newMinutes % 60;
        newHours += 1;
      }

      h2 = newHours.toString().padStart(2, "0");
      m2 = newMinutes.toString().padStart(2, "0");
      s2 = "00";
    }

    return {
      startDate: `${year}-${m}-${d}T${h1}:${min}:00`,
      endDate: `${year}-${m}-${d}T${h2}:${m2}:${s2}`,
    };
  }

  public getEndOf(term: string, year: number, month: number = 11, day: number = 1): string {
    let result: string;

    switch (term) {
      case "year":
        result = this.setDate(year, 11, 31, 23, 59, 59);
        break;
      case "month":
        const days = this.daysInMonth(year, month);
        result = this.setDate(year, month, days, 23, 59, 59);
        break;
      case "day":
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

  public async processMonth(
    year: number = 2024,
    month: number = 0,
    callback?,
    day: number = 1,
    hours: number = 0,
    minutes: number = 0,
  ) {
    const date: CustomDate = { year, month, day, hours, minutes };

    for (let m = month; month <= 11; month++) {
      await this.processDay(date, callback);
    }
  }

  public async processDay(date: CustomDate, callback?) {
    const { year, month, day, hours, minutes } = date;

    for (let h = hours; h < 24; h++) {
      const { startDate, endDate } = this.getDates(year, month, day, h, minutes, 1);
      console.debug("processando dados de", startDate, endDate);
      await callback(startDate, endDate);
    }
  }

  public async processComplete(
    year: number = 2024,
    month: number = 1,
    day: number = 1,
    hour: number = 0,
  ) {
    for (let m = 0; m <= 11; m++) {
      const days = this.daysInMonth(year, m);
      for (let d = 1; d <= days; d++) {
        for (let h = 0; h < 24; h++) {
          const { startDate, endDate } = this.getDates(year, m, d, h, 0, 1);
          console.debug("processando dados de", startDate, endDate);
        }
      }
    }
  }

  public getDateObject(dateStr: string = ""): any {
    const date = dateStr === "" ? new Date() : new Date(dateStr);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const hour = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();
    return { date, year, month, day, hour, minutes, seconds };
  }

  public isDateValid(timestamp) {
    if (isNaN(timestamp)) {
      return false;
    }
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return false;
    }
    return true;
  }

  public async isToday(year, month, day, hour) {
    const today = this.getDateObject();
    return year === today.year && month === today.month && day === today.day && hour === today.hour;
  }
}
