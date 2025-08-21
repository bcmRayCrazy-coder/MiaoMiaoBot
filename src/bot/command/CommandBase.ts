import type { Bot } from "../Bot.js";

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

    execute(groupId: number, senderId: number, args: string[]) {}
}
