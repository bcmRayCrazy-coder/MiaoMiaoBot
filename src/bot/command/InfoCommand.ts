import { CommandBase } from "./CommandBase.js";
import InfoMessage from "../message/InfoMessage.js";

export class InfoCommand extends CommandBase {
    name = "详细信息";
    description = "获取喵喵详细信息";
    usage = "#信息";
    id = "#信息";
    alias = [];

    execute(groupId: number, senderId: number, args: string[]) {
        this.bot.messageSender.sendGroupMsg(groupId, InfoMessage);
    }
}
