import { Canvas, createCanvas, registerFont } from "canvas";
// @ts-ignore
import * as echarts from "echarts";
import type { ECharts } from "echarts/types/dist/echarts";
import { readFileSync } from "fs";

const fontFamily = "HiraginoSansGB";
const themeName = "miaoTheme";
registerFont("res/HiraginoSansGB.ttc", { family: fontFamily });
echarts.registerTheme(
    themeName,
    JSON.parse(readFileSync("res/echartsTheme.json").toString("utf-8")),
);

export class Chart {
    canvas: Canvas;
    chart: ECharts;

    constructor(canvasWidth = 650, canvasHeight = 400, fontSize = 12) {
        this.canvas = createCanvas(650, 400);
        const ctx = this.canvas.getContext("2d");
        ctx.font = fontSize + "px";

        this.chart = echarts.init(this.canvas as any, themeName);
        echarts.setPlatformAPI({
            createCanvas: () => {
                return this.canvas;
            },
        });

        this.chart.setOption({
            animation: false,
            textStyle: {
                fontSize: fontSize,
                fontFamily,
            },
        });
    }

    setTitle(title: string, subText = "数据来源 喵喵") {
        this.chart.setOption({
            title: {
                text: title,
                subtext: "数据来源 喵喵",
                left: "center",
            },
        });
        return this;
    }

    setSeries(series: any[]) {
        this.chart.setOption({ series });
        return this;
    }

    toDataUrl() {
        return this.canvas.toDataURL();
    }
}
