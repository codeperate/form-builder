import { pathArr as toPathArr } from '@codeperate/utils';

export function lazySet<T extends object, K>(obj: T, path: ((obj: T) => K) | (string | number)[], value: K) {
    let pathArr: (string | number)[];
    if (!Array.isArray(path)) pathArr = toPathArr(path);
    else pathArr = path;
    const lastIndex = pathArr.length - 1;
    let curPos = obj;
    for (let i = 0; i < pathArr.length; i++) {
        let curPath = pathArr[i];
        let nextPath = pathArr[i + 1];

        if (i == lastIndex) {
            curPos[curPath] = value;
            break;
        }
        let newVal: [] | {} = [];

        if (typeof nextPath == 'string' && Number.isNaN(parseInt(nextPath))) newVal = {};
        if (curPos[curPath] != null) {
            if (Array.isArray(curPos[curPath]) !== Array.isArray(newVal)) curPos[curPath] = newVal;
        } else curPos[curPath] = newVal;

        curPos = curPos[curPath];
    }
}
