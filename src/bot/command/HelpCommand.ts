import { Structs } from "node-napcat-ts";
import { CommandBase } from "./CommandBase.js";

export class HelpCommand extends CommandBase {
    name = "喵喵帮助";
    description = "获取帮助信息";
    usage = "喵喵帮助";
    id = "#帮助";
    alias = ["喵喵帮助"];

    execute(groupId: number, senderId: number, args: string[]) {
        this.bot.bot.send_group_msg({
            group_id: groupId,
            message: this.bot.getHelpMessage(),
        });
    }
}
