import { Database } from "./Database.js";

export type AutoSendStat = "disabled" | "day" | "month" | "year";

export class Group {
    groupId: number;
    active: boolean;
    banned: boolean;
    autoSendStat: AutoSendStat;

    constructor(
        groupId: number,
        active: boolean,
        banned: boolean,
        autoSendStat: AutoSendStat,
    ) {
        this.groupId = groupId;
        this.active = active;
        this.banned = banned;
        this.autoSendStat = autoSendStat;
    }

    toString() {
        return ``;
    }

    toJSON() {
        return {
            groupId: this.groupId,
            active: this.active,
            banned: this.banned,
            autoSendStat: this.autoSendStat,
        };
    }

    static parseJSON(data: any) {
        return new Group(
            data.groupId,
            data.active,
            data.banned,
            data.autoSendStat,
        );
    }

    static defaultGroup(groupId: number) {
        return new Group(groupId, true, false, "disabled");
    }
}
export class GroupTable {
    static tableName = "group";

    static async createTable() {
        if (!Database.connection)
            return console.error("Database connection not created");
        await Database.connection.schema.createTable(
            this.tableName,
            (builder) => {
                builder.integer("groupId");
                builder.boolean("active");
                builder.boolean("banned");
                builder.string("autoSendStat");
            },
        );
    }

    static async addGroup(group: Group) {
        if (!Database.connection)
            return console.error("Database connection not created");

        await Database.connection(this.tableName).insert(group.toJSON());
    }

    static async selectGroup(data: any): Promise<Group | void> {
        if (!Database.connection)
            return console.error("Database connection not created");

        const raw = (
            await Database.connection(this.tableName).select("*").where(data)
        )[0];
        if (!raw) return;
        return Group.parseJSON(raw);
    }

    static async updateGroup(groupId: number, newData: Group) {
        if (!Database.connection)
            return console.error("Database connection not created");

        await Database.connection(this.tableName)
            .where({ groupId })
            .update(newData.toJSON());
    }

    static async deleteGroup(data: any) {
        if (!Database.connection)
            return console.error("Database connection not created");

        await Database.connection(this.tableName).where(data).delete();
    }
}
