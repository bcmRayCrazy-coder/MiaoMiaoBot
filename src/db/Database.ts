import knex from "knex";
import type { Knex } from "knex";
import { env } from "../Env.js";
import chalk from "chalk";
import { Version, VersionTable } from "./Version.js";
import { MessageTable } from "./Message.js";
import { GroupTable } from "./Group.js";

export class Database {
    static connection: Knex | undefined;

    createConnection() {
        Database.connection = knex({
            client: "sqlite3",
            connection: {
                filename: this.getDbPath(),
            },
            useNullAsDefault: true,
        });
    }

    async initDb() {
        if (!Database.connection)
            return console.error(chalk.red("Db not connected"));

        this.createTable(VersionTable);
        this.createTable(MessageTable);
        this.createTable(GroupTable);

        VersionTable.setVersion(new Version(2, 0));
    }

    async createTable(table: any) {
        if (!Database.connection)
            return console.error(chalk.red("Db not connected"));

        if (!(await Database.connection.schema.hasTable(table.tableName)))
            await table.createTable();
    }

    getDbPath() {
        return `./db/db_${env.envType.toLowerCase()}.sqlite`;
    }
}
