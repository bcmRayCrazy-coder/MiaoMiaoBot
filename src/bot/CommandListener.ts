import { Structs, type GroupMessage } from "node-napcat-ts";
import { BotEventListener } from "./BotEventListener.js";
import { CommandManager } from "./command/CommandManager.js";
import type { Bot } from "./Bot.js";
import { HelpCommand } from "./command/HelpCommand.js";
import { DayStatisticCommand } from "./command/StatisticCommand.js";

export class CommandListener extends BotEventListener {
    groupCommandManager = new CommandManager();

    constructor(bot: Bot) {
        super(bot);

        this.registerCommands();
    }

    listen() {
        this.bot.bot.on("message.group", (ctx) => {
            this.onGroupMessage(ctx);
        });
    }

    registerCommands() {
        this.groupCommandManager.register(new HelpCommand(this.bot));
        this.groupCommandManager.register(new DayStatisticCommand(this.bot));
    }

    onGroupMessage(ctx: GroupMessage) {
        const _0message = ctx.message[0];
        if (!_0message) return;

        if (
            _0message.type == "at" &&
            _0message.data.qq == this.bot.selfId.toString()
        ) {
            return this.bot.bot.send_group_msg({
                group_id: ctx.group_id,
                message: this.bot.getHelpMessage(),
            });
        }

        if (_0message.type != "text") return;

        const _msg = _0message.data.text.split(" ");
        const args = _msg.slice(1);

        if (!_msg[0] || _msg[0].length >= 7) return;

        this.groupCommandManager.execute(
            _msg[0],
            args,
            ctx.group_id,
            ctx.user_id,
        );
    }
}
