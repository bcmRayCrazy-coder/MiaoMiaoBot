import { Structs } from "node-napcat-ts";
import { GroupTable } from "../../../db/Group.js";
import { CommandBase, type CommandArgs } from "../CommandBase.js";

export class BroadcastCommand extends CommandBase {
    name = "群广播";
    description = "向所有激活群里发送广播.";
    usage = "/gb <消息>";
    id = "/gb";
    alias = [];

    async execute(groupId: number, senderId: number, args: CommandArgs) {
        const groupList = await GroupTable.getActivateGroupList();
        if (!groupList) return;
        groupList.forEach(({ groupId }) => {
            this.bot.messageSender.sendGroupMsg(
                groupId,
                args.map((msg) => {
                    if (typeof msg == "string") return Structs.text(msg);
                    return msg as any;
                }),
            );
        });
    }
}
