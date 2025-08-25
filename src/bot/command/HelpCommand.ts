import { CommandBase } from "./CommandBase.js";
import HelpMessage from "../message/HelpMessage.js";

export class HelpCommand extends CommandBase {
    name = "喵喵帮助";
    description = "获取帮助信息";
    usage = "喵喵帮助";
    id = "#帮助";
    alias = ["喵喵帮助"];

    execute(groupId: number, senderId: number, args: string[]) {
        this.bot.messageSender.sendGroupMsg(groupId, HelpMessage);
    }
}
