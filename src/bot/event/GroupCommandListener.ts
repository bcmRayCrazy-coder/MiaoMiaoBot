import { Structs, type GroupMessage } from "node-napcat-ts";
import { BotEventListener } from "./BotEventListener.js";
import { CommandManager } from "../command/CommandManager.js";
import type { Bot } from "../Bot.js";
import { HelpCommand } from "../command/HelpCommand.js";
import {
    DayCountCommand,
    MonthCountCommand,
    YearCountCommand,
} from "../command/group/CountCommand.js";
import { InfoCommand } from "../command/InfoCommand.js";
import HelpMessage from "../message/HelpMessage.js";
import { DayTrendCommand, MonthTrendCommand } from "../command/group/TrendCommand.js";
import type { CommandArgs } from "../command/CommandBase.js";

export class GroupCommandListener extends BotEventListener {
    groupCommandManager = new CommandManager();

    constructor(bot: Bot) {
        super(bot);

        this.registerCommands();
    }

    listen() {
        this.bot.bot.on("message.group", this.onGroupMessage.bind(this));
    }

    registerCommands() {
        this.groupCommandManager.register(new HelpCommand(this.bot));
        this.groupCommandManager.register(new InfoCommand(this.bot));

        this.groupCommandManager.register(new DayCountCommand(this.bot));
        this.groupCommandManager.register(new MonthCountCommand(this.bot));
        this.groupCommandManager.register(new YearCountCommand(this.bot));

        this.groupCommandManager.register(new DayTrendCommand(this.bot));
        this.groupCommandManager.register(new MonthTrendCommand(this.bot));
    }

    async onGroupMessage(ctx: GroupMessage) {
        if (!(await this.bot.getIsActivate(ctx.group_id))) return;

        const _0message = ctx.message[0];
        if (!_0message) return;

        if (
            _0message.type == "at" &&
            _0message.data.qq == this.bot.selfId.toString()
        ) {
            this.bot.messageSender.sendGroupMsg(ctx.group_id, HelpMessage);
            return;
        }

        if (_0message.type != "text") return;

        const _msg = _0message.data.text.split(" ");
        const args: CommandArgs = _msg.slice(1);
        args.push(...ctx.message.slice(1));

        if (!_msg[0] || _msg[0].length >= 7) return;

        this.groupCommandManager.execute(
            _msg[0],
            args,
            ctx.group_id,
            ctx.user_id,
        );
    }
}
