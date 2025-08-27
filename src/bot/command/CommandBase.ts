import type { Receive } from "node-napcat-ts";
import type { Bot } from "../Bot.js";

export type CommandArgs = (string|Receive[keyof Receive])[]

export class CommandBase {
    name = "My Command";
    description = "This is my command.";
    usage = "mycmd <arg>";
    id = "mycmd";
    alias = ["md", "mycom"];

    bot: Bot;
    constructor(bot: Bot) {
        this.bot = bot;
    }

    execute(groupId: number, senderId: number, args: CommandArgs) {}
}
