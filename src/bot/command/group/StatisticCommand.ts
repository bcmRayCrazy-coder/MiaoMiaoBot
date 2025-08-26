import { Structs } from "node-napcat-ts";
import { CommandBase } from "../CommandBase.js";
import { HourTime } from "../../../Time.js";
import { MessageCount } from "../../../db/Message.js";
import { MessageCountPieChart } from "../../../image/MessageCountChart.js";
import { safeParseInt, sortRecord } from "../../../util.js";

class StatisticCommand extends CommandBase {
    rangeName = "";
    getTimeRange(args: string[]): { startTime: HourTime; endTime: HourTime } {
        return {
            startTime: new HourTime(0, 0, 0, 0),
            endTime: new HourTime(0, 0, 0, 0),
        };
    }

    async execute(groupId: number, senderId: number, args: string[]) {
        this.bot.messageSender.sendGroupMsg(groupId, [
            Structs.at(senderId),
            Structs.text(" ✏️喵喵绘制中 (test)"),
        ]);

        const { startTime, endTime } = this.getTimeRange(args);

        const messageCount = new MessageCount(groupId, startTime, endTime);
        const chart = new MessageCountPieChart(650, 400, 12);

        await messageCount.fetch();
        var chartData = await messageCount.toChartData(async (_id) => {
            const id = safeParseInt(_id);
            if (!id) return null;
            const nickname = await this.bot.getGroupNickname(groupId, id);
            if (!nickname) return null;
            return nickname;
        });
        chartData = chartData.sort((a, b) => b.value - a.value);
        // @ts-ignore Will change next time
        chartData[0].itemStyle = {
            color: "#fff176",
        };
        chart.setData(chartData);
        chart.setTitle(
            `${await this.bot.getGroupName(groupId)} 的${this.rangeName}消息`,
        );

        this.bot.messageSender.sendGroupMsg(groupId, [
            Structs.image(chart.toDataUrl()),
        ]);
    }
}

export class DayStatisticCommand extends StatisticCommand {
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

export class MonthStatisticCommand extends StatisticCommand {
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

export class YearStatisticCommand extends StatisticCommand {
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
