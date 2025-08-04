import type { VersionTableType } from "./VersionTable.ts";

declare module "knex/types/tables.js" {
    interface Tables {
        version: VersionTableType;
    }
}
