import type { Bot } from "../Bot.js";

export class BotEventListener {
    bot: Bot;

    constructor(bot: Bot) {
        this.bot = bot;
    }

    listen() {}
}
