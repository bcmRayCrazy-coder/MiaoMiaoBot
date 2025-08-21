import "dotenv/config";
import chalk from "chalk";
import { env } from "./Env.js";
import { Database } from "./db/Database.js";
import { MessageTable } from "./db/Message.js";
import { Bot } from "./bot/Bot.js";

class MainApp {
    database = new Database();
    bot: Bot = new Bot();

    async main() {
        await this.init();
    }

    async init() {
        if (!env.checkEnv()) return env.initEnv();
        this.database.createConnection();
        this.database.initDb();

        this.bot.init();
    }
}

const app = new MainApp();
app.main();
