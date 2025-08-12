import type { GroupMessage, Receive } from "node-napcat-ts";
import { BotEventListener } from "./BotEventListener.js";

export class CommandListener extends BotEventListener {
    listen() {
        this.bot.bot.on("message.group", (ctx) => {
            this.onGroupMessage(ctx);
        });
    }

    onGroupMessage(ctx: GroupMessage) {
        const _0message = ctx.message[0];
        if(!_0message) return;
        // if (_0message.type == 'at' && _0message.data.qq == selfId)
        //     return this.bot.bot.send_group_msg({
        //         group_id: ctx.group_id,
        //         message: helpMessage,
        //     });

        // if (
        //     _0message.type != 'text' ||
        //     _0message.data.text.split(' ')[0].length >= 6
        // )
        //     return;

        // const _msg = _0message.data.text.split(' ');
        // const args = _msg.slice(1);
    }
}
