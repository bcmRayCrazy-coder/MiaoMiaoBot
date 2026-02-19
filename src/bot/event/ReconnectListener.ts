import { BotConnectionStatus } from "../../status/BotStatusEvents.js";
import { statusEvents } from "../../status/StatusEvents.js";
import { BotEventListener } from "./BotEventListener.js";

export class ReconnectListener extends BotEventListener {
    listen() {
        statusEvents.on(
            "bot.request.reconnect",
            this.onReconnectRequest.bind(this),
        );
    }

    onReconnectRequest() {
        statusEvents.emit("bot.connection", BotConnectionStatus.CONNECTING);
        this.bot.bot
            .reconnect()
            .then(() =>
                statusEvents.emit("bot.connection", BotConnectionStatus.OK),
            )
            .catch(() =>
                statusEvents.emit("bot.connection", BotConnectionStatus.FAILED),
            );
    }
}
