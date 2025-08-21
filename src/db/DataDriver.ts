export class DataDriver {
    data: Record<any, any> = {};
    constructor() {}
    async fetch() {}
    async toChartData(getName: (id: any) => Promise<string | null>) {
        var result: any[] = [];
        for (const id in this.data) {
            addToResult: {
                if (Object.prototype.hasOwnProperty.call(this.data, id)) {
                    const value = this.data[id];
                    if (!value) break addToResult;
                    const name = await getName(id);
                    if (!name) break addToResult;
                    result.push({
                        value,
                        name,
                    });
                }
            }
        }
        return result;
    }
}
