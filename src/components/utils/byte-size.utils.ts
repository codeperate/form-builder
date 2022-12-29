export function byteSize(bytes: number) {
    const table = [
        { from: 0, to: 1e3, unit: 'B' },
        { from: 1e3, to: 1e6, unit: 'KB' },
        { from: 1e6, to: 1e9, unit: 'MB' },
        { from: 1e9, to: 1e12, unit: 'GB' },
    ];
    const units = table.find(u => bytes >= u.from && bytes < u.to);
    return `${(bytes / (units.from || 1)).toFixed(1)} ${units.unit}`;
}
