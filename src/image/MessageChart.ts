import { Chart } from "./Chart.js";

export class MessageCountPieChart extends Chart {
    setData(data: any) {
        this.setSeries([
            {
                type: "pie",
                data,
                label: {
                    show: true,
                    formatter(p: any) {
                        return `${p.data.name}\n${p.data.value} (${p.percent}%)`;
                    },
                },
            },
        ]);
    }
}

export type MessageTrendStackSeries = {
    name: string;
    data: number[];
};

export class MessageTrendStackChart extends Chart {
    stack = false;

    setAxis(xAxisData: string[]) {
        this.chart.setOption({
            xAxis: [{ type: "category", data: xAxisData }],
            yAxis: {},
        });
    }

    setStack(stack: boolean) {
        this.stack = stack;
    }

    setData(series: MessageTrendStackSeries[]) {
        this.setSeries(
            series.map(({ name, data }) => {
                return {
                    name,
                    data,
                    type: "line",
                    stack: this.stack ? "Total" : null,
                    smooth: true,
                    areaStyle: {},
                };
            }),
        );
        this.chart.setOption({
            legend: {
                data: series.map(({ name }) => name),
            },
        });
    }
}
