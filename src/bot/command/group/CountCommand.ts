import { Structs } from "node-napcat-ts";
import { CommandBase, type CommandArgs } from "../CommandBase.js";
import { HourTime } from "../../../Time.js";
import { MessageCount } from "../../../db/Message.js";
import { MessageCountPieChart } from "../../../image/MessageChart.js";
import { safeParseInt, sortRecord } from "../../../util.js";

class CountCommand extends CommandBase {
    rangeName = "";
    getTimeRange(args: CommandArgs): {
        startTime: HourTime;
        endTime: HourTime;
    } {
        return {
            startTime: new HourTime(0, 0, 0, 0),
            endTime: new HourTime(0, 0, 0, 0),
        };
    }

    async execute(groupId: number, senderId: number, args: CommandArgs) {
        const { startTime, endTime } = this.getTimeRange(args);

        const messageCount = new MessageCount(groupId, startTime, endTime);
        const chart = new MessageCountPieChart(650, 400, 12);

        await messageCount.fetch();
        var chartData = await messageCount.toPieChartData(async (_id) => {
            const id = safeParseInt(_id);
            if (!id) return null;
            const nickname = await this.bot.getGroupNickname(groupId, id);
            if (!nickname) return null;
            return nickname;
        });
        chartData = chartData.sort((a, b) => b.value - a.value);
        chart.setData(chartData);
        chart.setTitle(
            `${await this.bot.getGroupName(groupId)} 的${this.rangeName}消息`,
        );

        this.bot.messageSender.sendGroupMsg(groupId, [
            Structs.image(chart.toDataUrl()),
        ]);
    }
}

export class DayCountCommand extends CountCommand {
    name = "日统计";
    description = "获取今日统计信息";
    usage = "日统计";
    id = "#日统计";
    alias = ["日统计"];

    rangeName = "本日";

    getTimeRange(args: string[]): { startTime: HourTime; endTime: HourTime } {
        const now = HourTime.fromCurrentTime();
        return {
            startTime: new HourTime(now.year, now.month, now.day, 0),
            endTime: now,
        };
    }
}

export class MonthCountCommand extends CountCommand {
    name = "月统计";
    description = "获取本月统计信息";
    usage = "月统计";
    id = "#月统计";
    alias = ["月统计"];

    rangeName = "本月";

    getTimeRange(args: string[]): { startTime: HourTime; endTime: HourTime } {
        const now = HourTime.fromCurrentTime();
        return {
            startTime: new HourTime(now.year, now.month, 0, 0),
            endTime: now,
        };
    }
}

export class YearCountCommand extends CountCommand {
    name = "年统计";
    description = "获取本年统计信息";
    usage = "年统计";
    id = "#年统计";
    alias = ["年统计"];

    rangeName = "本年";

    getTimeRange(args: string[]): { startTime: HourTime; endTime: HourTime } {
        const now = HourTime.fromCurrentTime();
        return {
            startTime: new HourTime(now.year, 0, 0, 0),
            endTime: now,
        };
    }
}
