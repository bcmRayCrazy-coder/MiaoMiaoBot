import { NCWebsocket, Structs, type SendMessageSegment } from "node-napcat-ts";
import { env } from "../Env.js";
import { StatisticListener } from "./StatisticListener.js";
import { CommandListener } from "./CommandListener.js";

/**
 * { groupId : { userId : nickname } }
 */
export type GroupNicknameCache = Record<number, Record<number, string>>;

export class Bot {
    bot: NCWebsocket;
    selfId = 0;

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

    init() {
        this.bot
            .connect()
            .then(async () => {
                const loginInfo = await this.bot.get_login_info();
                this.selfId = loginInfo.user_id;
            })
            .catch((err) => {
                console.error(err);
            });

        this.listen();

        console.log("Bot Ok");
    }

    listen() {
        new StatisticListener(this).listen();
        new CommandListener(this).listen();
    }

    getHelpMessage(): SendMessageSegment[] {
        return [Structs.text("喵喵帮助信息")];
    }

    async getGroupNickname(groupId: number, userId: number) {
        if (!this.groupNicknameCache[groupId])
            this.groupNicknameCache[groupId] = {};
        if (!this.groupNicknameCache[groupId][userId]) {
            try {
                const info = await this.bot.get_group_member_info({
                    group_id: groupId,
                    user_id: userId,
                });
                this.groupNicknameCache[groupId][userId] =
                    info.card || info.nickname;
            } catch (err) {
                // 群成员不存在
            }
        }
        return this.groupNicknameCache[groupId][userId];
    }
}
