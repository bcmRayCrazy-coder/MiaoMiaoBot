import "dotenv/config";
import chalk from "chalk";
import { env } from "./Env.js";
import { Database } from "./db/Database.js";
import { MessageTable } from "./db/Message.js";

class MainApp {
    database = new Database();

    async main() {
        await this.init();
    }

    async init() {
        if (!env.checkEnv()) return env.initEnv();
        this.database.createConnection();
        this.database.initDb();
    }
}

const app = new MainApp();
app.main();
