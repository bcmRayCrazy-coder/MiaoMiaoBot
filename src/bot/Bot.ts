import { NCWebsocket } from "node-napcat-ts";
import { env } from "../Env.js";
import { StatisticListener } from "./StatisticListener.js";

/**
 * { groupId : { userId : nickname } }
 */
export type GroupNicknameCache = Record<number, Record<number, string>>;

export class Bot {
    bot: NCWebsocket;
    groupNicknameCache: GroupNicknameCache = {};
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

    listen() {
        new StatisticListener(this).listen();
    }
}
