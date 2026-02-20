import express, { Router } from "express";
import { BotConnectionStatus } from "./BotStatusEvents.js";
import { env } from "../Env.js";
import { statusEvents } from "./StatusEvents.js";

export class WebStatus {
    botConnectionStatus = BotConnectionStatus.CONNECTING;

    app = express();
    tokenRouter = express.Router();

    constructor() {
        this.app.get("/", (req, res) => {
            res.send("MiaoMiaoBot Running");
        });

        this.createShortcut(this.tokenRouter, "bot_connection_status", "bcs");
        this.tokenRouter.get("/bot_connection_status", (req, res) =>
            res.send(this.botConnectionStatus),
        );

        this.createShortcut(this.tokenRouter, "bot_request_reconnect", "brc");
        this.tokenRouter.get("bot_request_reconnect", (req, res) => {
            statusEvents.emit("bot.request.reconnect", null);
            res.send("ok");
        });

        this.app.use(`/${env.web.token}`, this.tokenRouter);
    }

    init() {
        this.listenStatus();
        this.listenWeb();
    }

    listenStatus() {
        statusEvents.on('bot.connection', newState => this.botConnectionStatus = newState);
    }

    listenWeb() {
        console.log(
            `Web status page at  127.0.0.1:${env.web.port}/${env.web.token}`,
        );
        this.app.listen(env.web.port, (err) => {
            if (err) console.error(err);
        });
    }

    private createShortcut(router: Router, full: string, shortcut: string) {
        router.get(`/${shortcut}`, (req, res) => res.redirect(`./${full}`));
    }
}
