import { toArray, toPath } from '@codeperate/utils';

export function lazySet<T extends object, K>(obj: T, path: ((obj: T) => K) | (string | number | symbol)[], value: K) {
    let pathArr: (string | symbol | number)[];
    if (!Array.isArray(path)) pathArr = toArray(path(toPath(obj)));
    else pathArr = path;
    const lastIndex = pathArr.length - 1;
    let curPos = obj;
    for (let i = 0; i < pathArr.length; i++) {
        let curPath = pathArr[i];

        if (i == lastIndex) {
            curPos[curPath] = value;
            break;
        }
        let newVal: [] | {} = [];
        if (typeof curPath == 'string' && Number.isNaN(parseInt(curPath))) newVal = {};
        if (curPos[curPath] != null) {
            if (Array.isArray(curPos[curPath]) !== Array.isArray(newVal)) curPos[curPath] = newVal;
        } else curPos[curPath] = newVal;
        curPos = curPos[curPath];
    }
}
