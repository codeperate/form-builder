import { Store } from '@codeperate/simple-store';
import { Listener } from '@codeperate/simple-store/dist/listeners.js';
import { get } from '@codeperate/utils';
import { html, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { until } from 'lit/directives/until.js';
import { FormWidgetProps } from './base-class/cdp-widget.js';
import { NonShadow } from './base-class/non-shadow.js';

import { lazySet } from './utils/lazy-set.utils.js';
const WIDGET_KEY = Symbol();
@customElement('cdp-form-builder')
export class FormBuilder extends NonShadow {
    @property({ type: Object }) schema: FormSchema;
    @property() value: any;
    context: any;
    widgetRecord: Record<string | number | symbol, any> = {};
    widgetCount: number = 0;
    store = new Store({ value: undefined });
    connectedCallback() {
        super.connectedCallback();
        this.store.onChange(obj => this.dispatchEvent(new CustomEvent('formChange', { detail: obj.value })));
    }
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
        lazySet(this.store.state, ['value', ...path], value);
    }
    public regWidget(path: (string | number | symbol)[], widget: any) {
        let currentNode = this.widgetRecord;
        for (const key of path) {
            if (!currentNode[key]) {
                currentNode[key] = {};
            }
            currentNode = currentNode[key];
        }

        if (!currentNode[WIDGET_KEY]) {
            this.widgetCount++;
        }
        currentNode[WIDGET_KEY] = widget;
    }
    public unRegWidget(path: (string | number | symbol)[]) {
        let currentNode = this.widgetRecord;
        for (const key of path) {
            if (!currentNode[key]) {
                return;
            }

            currentNode = currentNode[key];
        }
        if (currentNode[WIDGET_KEY]) {
            delete currentNode[WIDGET_KEY];
            this.widgetCount--;
        }
    }
    getWidgets() {
        const widgets = [];
        const stack = [this.widgetRecord];
        while (stack.length > 0) {
            const currentTree = stack.pop();
            for (const key of Reflect.ownKeys(currentTree)) {
                if (key === WIDGET_KEY) {
                    widgets.push(currentTree[key]);
                } else {
                    stack.push(currentTree[key]);
                }
            }
        }
        return widgets;
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
    validate() {}
    render() {
        return html`${until(this.schema.widget.template({ form: this, path: [] }))}`;
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'cdp-form-builder': FormBuilder;
    }
}
export type FormConfig<T> = T extends number ? number : object;

export type FormSchema<T extends { properties?; widget? } = any> = {
    label?: string;
    items?: FormSchema;
    properties?: { [Key in keyof T['properties']]: FormSchema<T['properties'][Key]> } & {
        [Key in symbol]: FormSchema<T['properties'][Key]>;
    };
    widget?: IWidget;
    validate?: boolean;
    view?: boolean;
    hidden?: boolean;
    required?: boolean;
    columns?: Columns;
    config?: T['widget']['config'];
};
export interface IWidget<C = any> {
    template: (props: FormWidgetProps) => Promise<TemplateResult>;
    columns?: Columns;
    config?: C;
}
export type Columns = number | { [key: string]: number; default: number };
export function buildForm<T extends FormSchema<T>>(s: T) {
    return s as FormSchema<T>;
}
