import { NCWebsocket } from "node-napcat-ts";
import { env } from "../Env.js";
import { StatisticListener } from "./StatisticListener.js";

class Bot {
    bot: NCWebsocket;
    constructor() {
        this.bot = new NCWebsocket(
            {
                protocol: env.napcat.protocol,
                host: env.napcat.host,
                port: env.napcat.port,
                accessToken: env.napcat.token,
                throwPromise: true,
                reconnection: {
                    enable: true,
                    attempts: 10,
                    delay: 5000,
                },
            },
            false,
        );
    }

    listen(){
        new StatisticListener().listen();
    }
}

export let bot = new Bot();
