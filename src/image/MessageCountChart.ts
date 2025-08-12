import { Chart } from "./Chart.js";

export class MessageCountPieChart extends Chart {
    setData(data: any) {
        super.setSeries([
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
