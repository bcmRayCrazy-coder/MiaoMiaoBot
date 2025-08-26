import { type PrivateFriendMessage } from "node-napcat-ts";
import { BotEventListener } from "./BotEventListener.js";
import { CommandManager } from "../command/CommandManager.js";
import type { Bot } from "../Bot.js";
import { env } from "../../Env.js";
import { BroadcastCommand } from "../command/admin/BroadcastCommand.js";

export class PrivateCommandListener extends BotEventListener {
    privateCommandManager = new CommandManager();
    adminCommandManager = new CommandManager();

    constructor(bot: Bot) {
        super(bot);

        this.registerCommands();
    }

    listen() {
        this.bot.bot.on("message.private.friend", (ctx) => {
            this.onPrivateMessage(ctx);
        });
    }

    registerCommands() {
        this.adminCommandManager.register(new BroadcastCommand(this.bot));
    }

    async onPrivateMessage(ctx: PrivateFriendMessage) {
        const _0message = ctx.message[0];
        if (!_0message) return;

        if (_0message.type != "text") return;

        const _msg = _0message.data.text.split(" ");
        const args = _msg.slice(1);

        if (!_msg[0] || _msg[0].length >= 7) return;

        this.privateCommandManager.execute(_msg[0], args, 0, ctx.user_id);
        if (ctx.user_id == env.bot.admin)
            this.adminCommandManager.execute(_msg[0], args, 0, ctx.user_id);
    }
}
