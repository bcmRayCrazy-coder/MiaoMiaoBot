import { HourTime } from "../Time.js";
import { Database } from "./Database.js";
import { DataDriver } from "./DataDriver.js";

export class Message {
    id: number | null;
    groupId: number;
    userId: number;
    count: number;
    time: HourTime;

    constructor(
        id: number | null,
        groupId: number,
        userId: number,
        count: number,
        time: HourTime,
    ) {
        this.id = id;
        this.groupId = groupId;
        this.userId = userId;
        this.count = count;
        this.time = time;
    }

    toString() {
        return ``;
    }

    toJSON() {
        return {
            id: this.id,
            groupId: this.groupId,
            userId: this.userId,
            count: this.count,
            time: this.time.toTimestamp(),
        };
    }

    static parseJSON(raw: any) {
        return new Message(
            raw.id,
            raw.groupId || 0,
            raw.userId || 0,
            raw.count || 0,
            HourTime.fromTimestamp(raw.time || 0),
        );
    }
}

export class MessageCount extends DataDriver {
    groupId: number;
    startTime: HourTime;
    endTime: HourTime;

    /**
     * { userId: count }
     */
    data: Record<number, number> = {};

    constructor(groupId: number, startTime: HourTime, endTime: HourTime) {
        super();
        this.groupId = groupId;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    async fetch() {
        const rawData: Message[] =
            (await MessageTable.selectMessageByTimeRange(
                { groupId: this.groupId },
                this.startTime,
                this.endTime,
            )) || [];
        rawData.forEach((message) => {
            if (!this.data[message.userId]) this.data[message.userId] = 0;
            this.data[message.userId]! += message.count;
        });
    }
}

export class MessageTable {
    static tableName = "message";

    static async createTable() {
        if (!Database.connection)
            return console.error("Database connection not created");
        await Database.connection.schema.createTable(
            this.tableName,
            (builder) => {
                builder.increments("id");
                builder.integer("groupId");
                builder.integer("userId");
                builder.integer("count");
                builder.integer("time");
            },
        );
    }

    static async increaseMessageCounter(groupId: number, userId: number) {
        if (!Database.connection)
            return console.error("Database connection not created");

        const selectEndTime = HourTime.fromCurrentTime();
        selectEndTime.hour += 1;
        const _msg = await this.selectMessageByTimeRange(
            { groupId, userId },
            HourTime.fromCurrentTime(),
            selectEndTime,
        );
        if (!_msg) return;
        if (_msg[0]) {
            const message = _msg[0];
            message.count += 1;
            this.updateMessage(message);
            return;
        }

        await this.insertMessage(
            new Message(null, groupId, userId, 1, HourTime.fromCurrentTime()),
        );
    }

    static async insertMessage(message: Message) {
        if (!Database.connection)
            return console.error("Database connection not created");

        await Database.connection(this.tableName).insert(message.toJSON());
    }

    static async selectMessage(data: any): Promise<Message[] | void> {
        if (!Database.connection)
            return console.error("Database connection not created");

        const _raw = await Database.connection(this.tableName)
            .select("*")
            .where(data);
        var result: Message[] = [];
        _raw.forEach((v) => {
            result.push(Message.parseJSON(v));
        });
        return result;
    }

    static async selectMessageById(id: number): Promise<Message | void> {
        if (!Database.connection)
            return console.error("Database connection not created");

        const _raw = await Database.connection(this.tableName)
            .select("*")
            .where({ id });
        if (_raw.length == 0) return;
        return Message.parseJSON(_raw[0]);
    }

    static async selectMessageByTimeRange(
        mustCondition: any,
        startTime: HourTime,
        endTime: HourTime,
    ): Promise<Message[] | void> {
        if (!Database.connection)
            return console.error("Database connection not created");

        const _raw = await Database.connection(this.tableName)
            .select("*")
            .where(mustCondition)
            .andWhere("time", ">=", startTime.toTimestamp())
            .andWhere("time", "<=", endTime.toTimestamp());
        var result: Message[] = [];
        _raw.forEach((v) => {
            result.push(Message.parseJSON(v));
        });
        return result;
    }

    static async updateMessage(message: Message) {
        if (!Database.connection)
            return console.error("Database connection not created");
        await Database.connection(this.tableName)
            .where({ id: message.id })
            .update(message.toJSON());
    }
}
