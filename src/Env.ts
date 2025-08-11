import chalk from "chalk";
import fs from "fs";

export interface EnvNapcatConfig {
    host: string;
    port: number;
    token: string;
    protocol: "ws" | "wss";
}

export interface EnvBotConfig {
    admin: number;
}

class Env {
    envType: string = process.env.ENV_TYPE || "";
    napcat: EnvNapcatConfig = {
        host: process.env.NC_HOST || "127.0.0.1",
        port: parseInt(process.env.NC_PORT || "6020"),
        token: process.env.NC_TOKEN || "miaomiao",
        protocol: (process.env.NC_PROTOCOL as "ws" | "wss") || "ws",
    };
    bot: EnvBotConfig = {
        admin: parseInt(process.env.BOT_ADMIN || "0"),
    };

    checkEnv() {
        return !!this.envType;
    }

    initEnv() {
        fs.createReadStream("./.env_template")
            .pipe(fs.createWriteStream("./.env"))
            .on("close", () => {
                console.warn(chalk.red("Please config .env file first!"));
                process.exit(0);
            });
        // writeFileSync("./.env", readFileSync("./.env_template"));
    }

    isTestEnv() {
        return this.envType == "TEST";
    }

    isDeployEnv() {
        return this.envType == "DEPLOY";
    }

    selectFromEnv(testVal: any, deployVal: any) {
        return this.isTestEnv() ? testVal : deployVal;
    }
}

export let env = new Env();
