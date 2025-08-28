import { Structs } from "node-napcat-ts";
import { CommandBase, type CommandArgs } from "../CommandBase.js";
import { GroupTable } from "../../../db/Group.js";

export class BanGroupCommand extends CommandBase {
    name = "拉黑群聊";
    description = "拉黑指定群聊";
    usage = "/ban <groupId>";
    id = "/ban";
    alias = [];

    async execute(groupId: number, senderId: number, args: CommandArgs) {
        if (!args[0] || typeof args[0] != "string")
            return this.bot.messageSender.sendPrivateMsg(senderId, [
                Structs.text(this.usage),
            ]);
        const banGroupId = parseInt(args[0]);
        if (isNaN(banGroupId))
            return this.bot.messageSender.sendPrivateMsg(senderId, [
                Structs.text(this.usage),
            ]);

        const groupInfo = await GroupTable.selectGroup({ groupId: banGroupId });
        if (!groupInfo)
            return this.bot.messageSender.sendPrivateMsg(senderId, [
                Structs.text(`未激活群聊 ${banGroupId}`),
            ]);

        groupInfo.banned = !groupInfo.banned;
        await GroupTable.updateGroup(banGroupId, groupInfo);
        this.bot.messageSender.sendPrivateMsg(senderId, [
            Structs.text(
                `已将群聊 ${banGroupId} 拉黑设置为 ${groupInfo.banned}`,
            ),
        ]);
    }
}
