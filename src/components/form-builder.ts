import { Store } from '@codeperate/simple-store';
import { Listener } from '@codeperate/simple-store/dist/listeners.js';
import { get, set } from '@codeperate/utils';
import { TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CmptMixin } from './base-class/cdp-component.js';
import { FormWidgetProps } from './base-class/cdp-widget.js';
import { NonShadow } from './base-class/non-shadow.js';
import { CmptType } from './config.js';

import { lazySet } from './utils/lazy-set.utils.js';
@customElement('cdp-form-builder')
export class FormBuilder extends CmptMixin(CmptType.FormBuilder, NonShadow) {
    @property({ type: Object }) schema: FormSchema;
    @property() value: any;
    context: any;
    widgetRecord: Record<string | number | symbol, any>;
    widgetCount: number = 0;
    store = new Store({ value: undefined });
    public getSchema(path: (string | number | symbol)[] = []) {
        let curPos = this.schema;
        for (const p of path) {
            if (typeof p == 'number') continue;
            if (curPos.properties) {
                for (const key of Reflect.ownKeys(curPos)) if (key == p) curPos = curPos.properties[key];
            } else if (curPos.items) curPos = curPos.items;
        }
        return curPos;
    }
    public getTarget() {
        return this.store.getTarget();
    }
    public getValue(path: (string | number | symbol)[]) {
        return get(this.store.state, path);
    }
    public setValue(path: (string | number | symbol)[], value: any) {
        lazySet(this.store, ['value', ...path], value);
    }
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
    public onChange(path: (string | number | symbol)[], listener: Listener) {
        return this.store.onChange({
            selector: s => {
                let selector = s;
                for (const p of ['value', ...path]) selector = selector[p];
                return selector;
            },
            listener,
        });
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'cdp-form-builder': FormBuilder;
    }
}

export interface FormSchema<C = any> {
    label?: string;
    items?: FormSchema;
    properties?: Record<string | number | symbol, FormSchema>;
    widget?: IFormWidget<C>;
    jsonSchema?: any;
    validate?: any;
    view?: boolean;
    hidden?: boolean;
    required?: boolean;
    columns?: Columns;
    config?: C;
}
export interface IFormWidget<C = any> {
    template: (props: FormWidgetProps) => Promise<TemplateResult>;
    columns?: Columns;
    configType: C;
}
export type Columns = number | { [key: string]: number; default: number };
