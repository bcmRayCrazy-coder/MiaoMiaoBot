export function safeParseInt(value: string): number | false {
    if (!/^-?\d+(\.\d+)?$/.test(value)) return false;
    return parseInt(value);
}

export function sortRecord(data: Record<any, number>) {
    var result: { key: string; value: number }[] = [];
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const num = data[key];
            insertNum: {
                if (!num) break insertNum;
                for (let i = 0; i < result.length; i++) {
                    const element = result[i];
                    if (!element) break insertNum;
                    if (num < element.value) {
                        result.splice(i, 0, { key, value: num });
                        break insertNum;
                    }
                }
                result.push({ key, value: num });
            }
        }
    }
    return result;
}
