import { Structs } from "node-napcat-ts";
import { MessageCount, MessageTrend } from "../../../db/Message.js";
import {
    MessageTrendStackChart,
    type MessageTrendStackSeries,
} from "../../../image/MessageChart.js";
import { HourTime } from "../../../Time.js";
import { CommandBase, type CommandArgs } from "../CommandBase.js";

class TrendCommand extends CommandBase {
    rangeName = "";
    timeInterval = new HourTime(1970, 0, 1, 0);
    getTimeRange(args: CommandArgs): {
        startTime: HourTime;
        endTime: HourTime;
    } {
        return {
            startTime: new HourTime(0, 0, 0, 0),
            endTime: new HourTime(0, 0, 0, 0),
        };
    }

    getTimeName(time: HourTime) {
        return time.toString();
    }

    async getAutoUserIdList(
        startTime: HourTime,
        endTime: HourTime,
        groupId: number,
    ): Promise<Set<number>> {
        const messageCount = new MessageCount(groupId, startTime, endTime);
        await messageCount.fetch();

        const sortableCount: { userId: number; value: number }[] = [];
        for (const userId in messageCount.data) {
            if (
                Object.prototype.hasOwnProperty.call(messageCount.data, userId)
            ) {
                const value = messageCount.data[userId];
                if (value)
                    sortableCount.push({ userId: parseInt(userId), value });
            }
        }

        const userIdList = new Set<number>();
        sortableCount
            .sort((a, b) => b.value - a.value)
            .slice(0, 12)
            .forEach(({ userId }) => {
                userIdList.add(userId);
            });
        return userIdList;
    }

    addToUserIdList(list: Set<number>, content: string) {
        var userId = parseInt(content);
        if (!isNaN(userId)) list.add(userId);
    }

    async execute(groupId: number, senderId: number, args: CommandArgs) {
        const { startTime, endTime } = this.getTimeRange(args);

        var userIdList = new Set<number>();
        var useStack = false;

        if (args.includes("自动")) {
            userIdList = await this.getAutoUserIdList(
                startTime,
                endTime,
                groupId,
            );
        } else {
            args.forEach((val) => {
                if (typeof val == "object" && val.type == "at")
                    this.addToUserIdList(userIdList, val.data.qq);
                else if (typeof val == "string")
                    this.addToUserIdList(userIdList, val);
            });
        }
        useStack = args.includes("堆叠");

        userIdList.add(senderId);

        const trendSeries: MessageTrendStackSeries[] = [];

        for (let userId of userIdList) {
            addTrendSeries: {
                if (!userId) break addTrendSeries;

                const messageTrend = new MessageTrend(
                    groupId,
                    userId,
                    startTime,
                    endTime,
                    this.timeInterval,
                );
                await messageTrend.fetch();

                const name = await this.bot.getGroupNickname(groupId, userId);
                if (!name) break addTrendSeries;

                trendSeries.push({
                    name,
                    data: messageTrend.toLineChartData(),
                });
            }
        }

        const timeList: string[] = [];
        var currentTime = startTime.toTimestamp();
        while (currentTime <= endTime.toTimestamp()) {
            timeList.push(
                this.getTimeName(HourTime.fromTimestamp(currentTime)),
            );
            currentTime += this.timeInterval.toTimestamp();
        }

        const chart = new MessageTrendStackChart(650, 400, 12);
        chart.setAxis(timeList);
        chart.setStack(useStack);
        chart.setTitle(
            `${await this.bot.getGroupName(groupId)} 的${this.rangeName}趋势`,
            `${useStack ? "堆叠" : ""}折线图 - 数据来源 喵喵`,
        );
        chart.setData(trendSeries);
        this.bot.messageSender.sendGroupMsg(groupId, [
            Structs.image(chart.toDataUrl()),
        ]);
    }
}

export class DayTrendCommand extends TrendCommand {
    name = "日趋势";
    description = "获取本日消息趋势";
    usage = "日趋势";
    id = "#日趋势 [@目标QQ]";
    alias = ["日趋势"];

    rangeName = "本日";
    timeInterval = new HourTime(1970, 0, 1, 1);

    getTimeRange(args: string[]): { startTime: HourTime; endTime: HourTime } {
        const now = HourTime.fromCurrentTime();
        return {
            startTime: new HourTime(now.year, now.month, now.day, 0),
            endTime: new HourTime(now.year, now.month, now.day, 23),
        };
    }

    getTimeName(time: HourTime): string {
        return `${time.hour}h`;
    }

    // async getAutoUserIdList(
    //     startTime: HourTime,
    //     endTime: HourTime,
    //     groupId: number,
    // ): Promise<Set<number>> {

    // }
}
export class MonthTrendCommand extends TrendCommand {
    name = "月趋势";
    description = "获取本月消息趋约势";
    usage = "月趋势";
    id = "#月趋势 [@目标QQ]";
    alias = ["月趋势"];

    rangeName = "本月";
    timeInterval = new HourTime(1970, 0, 2, 0);

    getTimeRange(args: string[]): { startTime: HourTime; endTime: HourTime } {
        const now = HourTime.fromCurrentTime();
        return {
            startTime: new HourTime(now.year, now.month, 0, 0),
            endTime: new HourTime(now.year, now.month, 31, 23),
        };
    }

    getTimeName(time: HourTime): string {
        return `${time.day}日`;
    }
}
