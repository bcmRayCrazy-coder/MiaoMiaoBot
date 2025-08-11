import type { GroupMessage } from "node-napcat-ts";
import { bot } from "./Bot.js";

export class StatisticListener {
    listen() {
        bot.bot.on("message.group", (ctx) => {
            this.onGroupMessage(ctx);
        });
    }

    onGroupMessage(ctx: GroupMessage) {}
}
