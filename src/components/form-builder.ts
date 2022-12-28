import { Store } from '@codeperate/simple-store';
import { Listener } from '@codeperate/simple-store/dist/listeners.js';
import { deepAssign, get } from '@codeperate/utils';
import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { until } from 'lit/directives/until.js';
import { IFormWidget } from './base-class/cdp-widget.js';
import { NonShadow } from './base-class/non-shadow.js';
import { CdpFormBuilder } from './config.js';
import './form-builder.config.js';
import type { FormBuilderOption, FormSchema } from './form-builder.interface.js';
import { lazySet } from './utils/lazy-set.utils.js';
import { LocalStorage } from './utils/localstorage.util.js';
const WIDGET_KEY = Symbol();
@customElement('cdp-form-builder')
export class FormBuilder extends NonShadow {
    @property({ type: Object }) schema: FormSchema;
    @property() value: any;
    @property() view: boolean = false;
    @property() name: string;
    @property() config: FormBuilderOption = {};
    _config: FormBuilderOption = {};
    context: any;
    widgetRecord: Record<string | number | symbol, any> = {};
    widgetCount: number = 0;
    store: Store<any>;
    connectedCallback() {
        super.connectedCallback();
        this._config = deepAssign(
            CdpFormBuilder.getConfig(o => o.FormBuilder),
            this.config,
        );
        this.store = new Store({ value: this.value });
        this.store.onChange(obj => this.dispatchEvent(new CustomEvent('formChange', { detail: obj.value })));
    }
    willUpdate(c): void {
        super.willUpdate(c);
    }
    updated(c) {
        super.updated(c);
        if (c.has('value')) {
            this.setValue([], this.value);
        }
    }
    public getSchema(path: (string | number | symbol)[] = []) {
        let curPos = this.schema;
        for (const p of path) {
            if (curPos.properties) {
                for (const key of Reflect.ownKeys(curPos.properties)) if (key == p) curPos = curPos.properties[key];
            } else if (curPos.items) curPos = curPos.items;
        }
        return curPos;
    }
    public getTarget() {
        return this.store.getTarget().value;
    }
    public getValue(path: (string | number | symbol)[], { target }: { target?: boolean } = {}) {
        return get(target ? this.store.getTarget() : this.store.state, ['value', ...path]);
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
    public getWidgets(path?: (string | symbol | number)[]): (IFormWidget & LitElement)[] {
        let record = this.widgetRecord;
        if (path) record = get(this.widgetRecord, path);
        const widgets = [];
        const stack = [record];
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
            listener: (data, proxiedData) => {
                if (this.config.save && this.config.save.autoSave) this.save();
                listener(data, proxiedData);
            },
        });
    }
    public validate() {
        return this.getWidgets().map(w => w.validate());
    }
    public undoValidate() {
        return this.getWidgets().forEach(w => w.undoValidate());
    }
    public save() {
        if (!this.config.save) throw new Error('You must enable save option first.');
        LocalStorage.set(this.config.save.location, { value: this.getTarget().value });
    }
    public load() {
        if (!this.config.save) throw new Error('You must enable save option first.');
        this.setValue([], LocalStorage.get(this.config.save.location).value);
    }
    public clearHistory() {
        if (this.config.save) LocalStorage.remove(this.config.save.location);
    }
    render() {
        let hidden = typeof this.schema.hidden == 'function' ? this.schema.hidden.bind(this)() : this.schema.hidden;
        if (!hidden) return html`${until(this.schema.widget.template({ form: this, path: [] }))}`;
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'cdp-form-builder': FormBuilder;
    }
}
