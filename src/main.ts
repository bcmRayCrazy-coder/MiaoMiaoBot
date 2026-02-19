import "dotenv/config";
import { env } from "./Env.js";
import { Database } from "./db/Database.js";
import { Bot } from "./bot/Bot.js";
import { WebStatus } from "./status/WebStatus.js";

class MainApp {
    webStatus = new WebStatus();
    database = new Database();
    bot = new Bot();

    async main() {
        await this.init();
    }

    async init() {
        if (!env.checkEnv()) return env.initEnv();

        this.webStatus.init();

        this.database.createConnection();
        this.database.initDb();

        this.bot.init();
    }
}

const app = new MainApp();
app.main();
