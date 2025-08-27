import { Group, GroupTable } from "../../db/Group.js";
import HelpMessage from "../message/HelpMessage.js";
import { BotEventListener } from "./BotEventListener.js";

export class ActivateListener extends BotEventListener {
    listen() {
        this.bot.bot.on("message.group", async (ctx) => {
            const group = await GroupTable.selectGroup({
                groupId: ctx.group_id,
            });
            if (!!group) return;
            await GroupTable.addGroup(Group.defaultGroup(ctx.group_id));

            // this.bot.messageSender.sendGroupMsg(ctx.group_id, HelpMessage);
            // this.bot.sendToAdmin(`Auto activate at group ${ctx.group_id}`);
        });
    }
}
