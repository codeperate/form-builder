export namespace LocalStorage {
    export function set(key: string, value: object) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    export function get(key: string): any {
        let item = localStorage.getItem(key);
        try {
            item = JSON.parse(item);
        } catch {}
        return item;
    }
    export function remove(key: string): void {
        localStorage.removeItem(key);
    }
}
