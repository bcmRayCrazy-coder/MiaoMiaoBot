import EventEmitter from "events";
import type { BotStatusEvents } from "./BotStatusEvents.js";

export type StatusEventHandler = BotStatusEvents;

export interface StatusEventEmitter {
    on<K extends keyof StatusEventHandler>(
        event: K,
        listener: (data: StatusEventHandler[K]) => void,
    ): this;

    emit<K extends keyof StatusEventHandler>(
        event: K,
        data: StatusEventHandler[K],
    ): boolean;

    once<K extends keyof StatusEventHandler>(
        event: K,
        listener: (data: StatusEventHandler[K]) => void,
    ): this;

    off<K extends keyof StatusEventHandler>(
        event: K,
        listener: (data: StatusEventHandler[K]) => void,
    ): this;
}

export let statusEvents: StatusEventEmitter = new EventEmitter();
