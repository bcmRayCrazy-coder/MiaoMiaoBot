import chalk from "chalk";
import fs from "fs";

class Env {
    envType: string = process.env.ENV_TYPE || "";

    checkEnv() {
        return !!this.envType;
    }

    initEnv() {
        fs.createReadStream("./.env_template").pipe(
            fs.createWriteStream("./.env"),
        ).on('close',()=>{
            console.warn(chalk.red("Please config .env file first!"))
            process.exit(0);
        })
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
