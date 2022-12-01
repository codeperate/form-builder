import { Store } from '@codeperate/simple-store';
import { get, set } from '@codeperate/utils';
import { customElement, property } from 'lit/decorators.js';
import { CmptMixin } from './base-class/cdp-component.js';
import { NonShadow } from './base-class/non-shadow.js';

import './cdp-json-form.config.js';
import { CmptType } from './cmpt-config.js';
@customElement('cdp-form-builder')
export class CdpFormBuilder extends CmptMixin(CmptType.FormBuilder, NonShadow) {
    @property({ type: Object }) schema: FormSchema;
    context: any;
    private widgetRecord: Record<string | number | symbol, any>;
    private widgetCount: number = 0;
    private store = new Store({ value: undefined });
    public regWidget(valPath: (string | number | symbol)[], widget: any) {
        if (!get(this.widgetRecord, valPath)) this.widgetCount++;
        set(this.widgetRecord, valPath, widget);
    }
    public unRegWidget(path: (string | number | symbol)[]) {
        const deleteRecord = (obj, key) => {
            delete obj[key];
            this.widgetCount--;
        };
        let curPos = this.widgetRecord;
        for (let i = 0; i < path.length; i++) {
            const curPath = curPos[i];
            const nextPos = curPos[curPath];
            if (nextPos) {
                if (Array.isArray(curPos) && i + 1 == path.length && typeof path[i + 1] == 'number') {
                    curPos.splice(path[i + 1] as number, 1);
                    this.widgetCount--;
                    return;
                } else if (Array.isArray(nextPos)) {
                    if (nextPos.length == 1) return deleteRecord(curPos, curPath);
                } else {
                    if (Reflect.ownKeys(curPos).length == 1) return deleteRecord(curPos, curPath);
                    if (i + 1 == path.length) return deleteRecord(curPos, curPath);
                }
                curPos = nextPos;
            } else break;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'cdp-form-builder': CdpFormBuilder;
    }
}

export interface FormSchema {
    items?: FormSchema;
    properties?: Record<string | number | symbol, FormSchema>;
    widget: any;
    jsonSchema?: any;
    validate?: any;
    view?: boolean;
    hidden?: boolean;
    required?: boolean;
}
