import {
    Structs,
    type RequestFriend,
    type RequestGroupInvite,
} from "node-napcat-ts";
import { BotEventListener } from "./BotEventListener.js";

export class RequestListener extends BotEventListener {
    listen() {
        this.bot.bot.on("request.friend", this.onRequestFriend.bind(this));
        this.bot.bot.on("request.group.invite", this.onRequestGroup.bind(this));
    }

    onRequestFriend(ctx: RequestFriend) {
        ctx.quick_action(true)
            .then(() => {
                this.bot.sendToAdmin(`自动同意好友申请 ${ctx.user_id}`);
                this.bot.messageSender.sendPrivateMsg(ctx.user_id, [
                    Structs.text("你好, 我是喵喵\n欢迎拉我进群"),
                ]);
            })
            .catch((err) => {
                if (!err) return;
                this.bot.sendToAdmin(
                    `失败! 自动同意好友申请 ${ctx.user_id}\n${err}`,
                );
            });
    }

    onRequestGroup(ctx: RequestGroupInvite) {
        ctx.quick_action(true)
            .then(() => {
                this.bot.sendToAdmin(
                    `自动同意加群 ${ctx.group_id} 邀请人 ${ctx.user_id}`,
                );
            })
            .catch((err) => {
                if (!err) return;
                this.bot.sendToAdmin(
                    `失败! 自动同意加群 ${ctx.group_id} 邀请人 ${ctx.user_id}\n${err}`,
                );
            });
    }
}
