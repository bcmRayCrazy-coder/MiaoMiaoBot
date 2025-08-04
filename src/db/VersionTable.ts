import type { Knex } from "knex";

export interface VersionTableType {
    major: number;
    minor: number;
}

export class VersionTable {
    static tableName = "version";

    static async createTable(connection: Knex) {
        await connection.schema.createTable(this.tableName, (builder) => {
            builder.integer("major");
            builder.integer("minor");
        });
    }

    static async getVersion(connection: Knex): Promise<VersionTableType> {
        return (await connection.select().from(this.tableName))[0];
    }

    static async setVersion(connection: Knex, newVersion: VersionTableType) {
        await connection(this.tableName).update(newVersion);
    }
}
