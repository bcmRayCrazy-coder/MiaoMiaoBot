import type { GroupMessage } from "node-napcat-ts";
import { Bot } from "../Bot.js";
import { MessageTable } from "../../db/Message.js";
import { BotEventListener } from "./BotEventListener.js";

export class StatisticListener extends BotEventListener {
    listen() {
        this.bot.bot.on("message.group", (ctx) => {
            this.onGroupMessage(ctx);
        });
    }

    onGroupMessage(ctx: GroupMessage) {
        this.cacheNickname(ctx.group_id, ctx.user_id, ctx.sender.card || ctx.sender.nickname);
        MessageTable.increaseMessageCounter(ctx.group_id, ctx.user_id);
    }

    cacheNickname(groupId: number, userId: number, nickname: string) {
        if (!this.bot.groupNicknameCache[groupId])
            this.bot.groupNicknameCache[groupId] = {};
        this.bot.groupNicknameCache[groupId][userId] = nickname;
    }
}
