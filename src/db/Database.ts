import knex from "knex";
import type { Knex } from "knex";
import { env } from "../Env.js";
import chalk from "chalk";
import { VersionTable } from "./VersionTable.js";

export class Database {
    connection: Knex | undefined;

    createConnection() {
        this.connection = knex({
            client: "sqlite3",
            connection: {
                filename: this.getDbPath(),
            },
            useNullAsDefault: true,
        });
    }

    async initDb() {
        if (!this.connection)
            return console.error(chalk.red("Db not connected"));

        if (!(await this.connection.schema.hasTable(VersionTable.tableName)))
            await VersionTable.createTable(this.connection);
        
        VersionTable.setVersion(this.connection,{major:2,minor:1});
    }

    getDbPath() {
        return `./db/db_${env.envType.toLowerCase()}.sqlite`;
    }
}
