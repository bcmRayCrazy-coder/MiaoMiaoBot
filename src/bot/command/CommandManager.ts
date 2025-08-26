import type { CommandBase } from "./CommandBase.js";

/**
 * CommandBase: 需要调用的指令
 * string: 指向真正的指令键(即该指令为其别名)
 */
export type CommandStorage = Record<string, CommandBase | string>;

export class CommandManager {
    private commandStorage: CommandStorage = {};

    register(command: CommandBase) {
        const commandId = command.id;
        this.commandStorage[commandId] = command;
        command.alias.forEach(
            (alias) => (this.commandStorage[alias] = commandId),
        );

        console.log("Registered command", command.name);
    }

    execute(
        commandId: string,
        args: string[],
        groupId: number,
        senderId: number,
    ): void {
        const command = this.commandStorage[commandId];
        if (!command) return;
        if (typeof command == "string")
            return this.execute(command, args, groupId, senderId);
        command.execute(groupId, senderId, args);
    }

    getCommandList(noAlias = true) {
        var list: (CommandBase | string)[] = [];
        for (const id in this.commandStorage) {
            addToList: {
                if (
                    Object.prototype.hasOwnProperty.call(
                        this.commandStorage,
                        id,
                    )
                ) {
                    const command = this.commandStorage[id];
                    if (!command) return;

                    if (!noAlias) {
                        list.push(command);
                        break addToList;
                    }
                    if (typeof command == "string") break;
                    list.push(command);
                }
            }
        }
    }
}
