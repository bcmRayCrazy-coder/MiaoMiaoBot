export class HourTime {
    year: number;
    month: number;
    day: number;
    hour: number;

    constructor(y: number, m: number, d: number, h: number) {
        this.year = y;
        this.month = m;
        this.day = d;
        this.hour = h;
    }

    setYear(n: number) {
        this.year = n;
    }
    setMonth(n: number) {
        this.month = n;
    }
    setDay(n: number) {
        this.day = n;
    }
    setHour(n: number) {
        this.hour = n;
    }

    toString() {
        return `${this.year}/${this.month}/${this.day} ${this.hour}h`;
    }

    toTimestamp() {
        return Date.UTC(this.year, this.month, this.day, this.hour, 0, 0, 0);
    }

    static fromTimestamp(time: number) {
        const date = new Date(time);
        return new HourTime(
            date.getFullYear(),
            date.getMonth(),
            date.getUTCDate(),
            date.getHours(),
        );
    }
}
