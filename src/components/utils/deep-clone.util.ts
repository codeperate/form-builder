export function deepClone<T>(val: T): T {
    if (val == null || typeof val !== 'object') return val;
    if (Array.isArray(val)) {
        return val.map(deepClone) as T;
    } else {
        let obj = {};
        for (const key of Reflect.ownKeys(val as object)) {
            obj[key] = deepClone(val[key]);
        }
        return obj as T;
    }
}
