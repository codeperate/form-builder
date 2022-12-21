export type Columns = number | { [key: string]: number; default: number };
export function columnClass(columns: Columns) {
    if (typeof columns == 'number') {
        let defaultColumns = columns > 6 ? 6 : columns;
        return `des:cfb-col-span-${columns} cfb-col-span-${defaultColumns}`;
    } else {
        let str = [];
        for (const [key, val] of Object.entries(columns)) {
            if (key == 'default') str.push(`cfb-col-span-${val}`);
            else str.push(`cfb-${key}:col-span-${val}`);
        }
        return str.join(' ');
    }
}
