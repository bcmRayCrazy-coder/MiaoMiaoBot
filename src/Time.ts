export class HourTime {
    /**
     * UTC FUllyear
     */
    year: number;

    /**
     * UTC Month
     * Start from 0 (Jan)
     */
    month: number;

    /**
     * UTC Date
     */
    day: number;

    /**
     * UTC Hour
     */
    hour: number;

    constructor(y: number, m: number, d: number, h: number) {
        this.year = y;
        this.month = m;
        this.day = d;
        this.hour = h;
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
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            date.getUTCHours(),
        );
    }

    static fromCurrentTime() {
        return HourTime.fromTimestamp(Date.now());
    }
}
