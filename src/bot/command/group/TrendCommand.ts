import { Structs } from "node-napcat-ts";
import { MessageTrend } from "../../../db/Message.js";
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
        return `${time.hour}h`;
    }

    async execute(groupId: number, senderId: number, args: CommandArgs) {
        const { startTime, endTime } = this.getTimeRange(args);

        const userIdList = [senderId];
        args.forEach((val) => {
            if (typeof val == "object" && val.type == "at") {
                var userId = parseInt(val.data.qq);
                if (!isNaN(userId)) userIdList.push(userId);
            }
        });

        const trendSeries: MessageTrendStackSeries[] = [];
        for (let i = 0; i < userIdList.length; i++) {
            addTrendSeries: {
                const userId = userIdList[i];
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
        chart.setTitle(
            `${await this.bot.getGroupName(groupId)} 的${this.rangeName}趋势`,
            "堆叠折线图",
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
