export enum BotConnectionStatus {
    CONNECTING = "Connecting",
    OK = "Ok",
    FAILED = "Failed",
}

export interface BotStatusEvents {
    "bot.connection": BotConnectionStatus;
    "bot.sendMsg.error": string;
    "bot.sendMsg.success": null;
    "bot.request.reconnect": null;
    "bot.group.activate": number;
}
