import { Structs } from "node-napcat-ts";
import { CommandBase } from "./CommandBase.js";
import { HourTime } from "../../Time.js";
import { MessageCount } from "../../db/Message.js";
import { MessageCountPieChart } from "../../image/MessageCountChart.js";
import { safeParseInt } from "../../util.js";

class StatisticCommand extends CommandBase {
    getTimeRange(args: string[]): { startTime: HourTime; endTime: HourTime } {
        return {
            startTime: new HourTime(0, 0, 0, 0),
            endTime: new HourTime(0, 0, 0, 0),
        };
    }

    async execute(groupId: number, senderId: number, args: string[]) {
        this.bot.bot.send_group_msg({
            group_id: groupId,
            message: [
                Structs.at(senderId),
                Structs.text(" ✏️喵喵绘制中 (test)"),
            ],
        });

        const { startTime, endTime } = this.getTimeRange(args);

        const messageCount = new MessageCount(groupId, startTime, endTime);
        const chart = new MessageCountPieChart(650, 400, 12);

        await messageCount.fetch();
        const chartData = await messageCount.toChartData(async (_id) => {
            const id = safeParseInt(_id);
            if (!id) return null;
            const nickname = await this.bot.getGroupNickname(groupId, id);
            if (!nickname) return null;
            return nickname;
        });
        chart.setData(chartData);

        this.bot.bot.send_group_msg({
            group_id: groupId,
            message: [Structs.image(chart.toDataUrl())],
        });
    }
}

export class DayStatisticCommand extends StatisticCommand {
    name = "日统计";
    description = "获取今日统计信息";
    usage = "日统计";
    id = "#日统计";
    alias = ["日统计"];

    getTimeRange(args: string[]): { startTime: HourTime; endTime: HourTime } {
        const now = HourTime.fromCurrentTime();
        return {
            startTime: new HourTime(now.year, now.month, now.day, 0),
            endTime: now,
        };
    }
}
