import { Database } from "./Database.js";

export class Version {
    major: number;
    minor: number;
    constructor(major: number, minor: number) {
        this.major = major;
        this.minor = minor;
    }

    toString() {
        return `${this.major}.${this.minor}`;
    }

    toJSON() {
        return {
            major: this.major,
            minor: this.minor,
        };
    }
}
export class VersionTable {
    static tableName = "version";

    static async createTable() {
        if (!Database.connection)
            return console.error("Database connection not created");
        await Database.connection.schema.createTable(
            this.tableName,
            (builder) => {
                builder.integer("major");
                builder.integer("minor");
            },
        );
    }

    static async getVersion(): Promise<Version | void> {
        if (!Database.connection)
            return console.error("Database connection not created");
        const ver = (
            await Database.connection.select().from(this.tableName)
        )[0];
        if (!ver) return;
        return new Version(ver.major, ver.minor);
    }

    static async setVersion(newVersion: Version) {
        if (!Database.connection)
            return console.error("Database connection not created");
        await Database.connection(this.tableName).update(newVersion.toJSON());
    }
}
