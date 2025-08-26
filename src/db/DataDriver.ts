export class DataDriver {
    data: Record<any, any> = {};
    constructor() {}
    async fetch() {}
    async toChartData(getName: (id: any) => Promise<string | null>) {
        var result: { name: string; value: any }[] = [];
        for (const key in this.data) {
            if (Object.prototype.hasOwnProperty.call(this.data, key)) {
                addToResult: {
                    const value = this.data[key];
                    if (!value) break addToResult;
                    const name = await getName(key);
                    if (!name) break addToResult;
                    result.push({ value, name });
                }
            }
        }
        return result;
    }
}
