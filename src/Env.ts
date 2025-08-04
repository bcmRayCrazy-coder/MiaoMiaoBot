import { writeFileSync } from "fs";

class Env {
    private _envTemplate = "ENV_TYPE=DEPLOY\nNC_HOST=\nNC_PORT=\nNC_TOKEN=";
    envType: string = process.env.ENV_TYPE || "";

    checkEnv() {
        return !!this.envType;
    }

    initEnv() {
        writeFileSync("./.env", this._envTemplate);
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
