export function safeParseInt(value: string): number | false {
    if (!/^-?\d+(\.\d+)?$/.test(value)) return false;
    return parseInt(value);
}
