import { Store } from '@codeperate/simple-store';
import { Listener } from '@codeperate/simple-store/dist/listeners.js';
import { deepAssign, deepCloneJSON, get } from '@codeperate/utils';
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { until } from 'lit/directives/until.js';
import { IFormWidget } from './base-class/cdp-widget.js';
import { NonShadow } from './base-class/non-shadow.js';
import { CdpFormBuilder } from './config.js';
import './form-builder.config.js';
import type { FormBuilderOption, FormSchema } from './form-builder.interface.js';
import { lazySet } from './utils/lazy-set.utils.js';
import { LocalStorage } from './utils/localstorage.util.js';
@customElement('cdp-form-builder')
export class FormBuilder extends NonShadow {
    @property({ type: Object }) schema: FormSchema;
    @property() value: any;
    @property({ type: Boolean }) view: boolean = false;
    @property() name: string;
    @property({ type: Object }) config: FormBuilderOption = {};
    _config: FormBuilderOption = {};
    context: any;
    widgetMap: Map<string, (IFormWidget & LitElement)[]> = new Map();
    widgetCount: number = 0;
    store: Store<any>;
    connectedCallback() {
        super.connectedCallback();
        this._config = deepAssign(
            CdpFormBuilder.getConfig(o => o.formBuilder),
            this.config,
        );
        this.store = new Store({ value: this.value });
        this.store.onChange(obj => this.dispatchEvent(new CustomEvent('formChange', { detail: obj.value })));
    }
    willUpdate(c): void {
        super.willUpdate(c);
        if (c.has('value')) {
            this.setValue([], this.value, { silence: true });
            //this.getWidgets().forEach(w => w.updateValue());
        }
        if (c.has('schema')) {
            this.getWidgets().forEach(w => w.loadSchemaConfig());
        }
        if (c.has('view')) {
            this.getWidgets().forEach(w => w.requestUpdate());
        }
    }
    updated(c) {
        super.updated(c);
    }

    public getSchema(path: string | (string | number)[]) {
        if (typeof path == 'string') path = path.split('.').filter(p => p);
        let curPos = this.schema;
        for (const p of path) {
            if (curPos.properties) {
                for (const key of Object.keys(curPos.properties)) if (key == p) curPos = curPos.properties[key];
            } else if (curPos.items) curPos = curPos.items;
        }
        return curPos;
    }
    public getTarget() {
        return this.store.getTarget()?.value;
    }
    public getValue(path: (string | number)[] | string, { target }: { target?: boolean } = {}) {
        if (typeof path == 'string') path = path.split('.').filter(p => p);
        return get(target ? this.getTarget() : this.store.state, ['value', ...path]);
    }
    public exportValue() {
        const _value = deepCloneJSON(this.store.getTarget().value);
        this.getWidgets().forEach(w => w.onExportValue(_value));
        return _value;
    }
    public setValue(path: (string | number)[] | string, value: any, option: { silence?: boolean } = {}) {
        if (typeof path == 'string') path = path.split('.').filter(p => p);
        if (option.silence) this.store.silence(() => lazySet(this.store.state, ['value', ...path], value));
        else lazySet(this.store.state, ['value', ...path], value);
        this.getWidgets().forEach(w => w.updateValue());
    }
    public regWidget(path: string | (string | number)[], widget: IFormWidget & LitElement) {
        const pathStr = typeof path == 'string' ? path : path.join('.');
        const widgets = this.widgetMap.get(pathStr);
        if (!widgets) {
            this.widgetMap.set(pathStr, [widget]);
            this.widgetCount += 1;
            return;
        } else {
            const found = widgets.find(w => w === widget);
            if (found) return;
            else {
                widgets.push(widget);
                this.widgetCount += 1;
            }
        }
    }
    public unRegWidget(path: string | (string | number)[], widget: IFormWidget & LitElement) {
        const pathStr = typeof path == 'string' ? path : path.join('.');
        const widgets = this.widgetMap.get(pathStr);
        if (!widgets) return;
        const found = widgets.find(w => w === widget);
        if (found)
            this.widgetMap.set(
                pathStr,
                widgets.filter(w => w !== widget),
            );
    }
    public getWidgets(path: string | (string | number)[] = ''): (IFormWidget & LitElement)[] {
        const pathStr = typeof path == 'string' ? path : path.join('.');
        const widgets = [];
        for (const [key, value] of this.widgetMap.entries()) {
            if (key.startsWith(pathStr)) widgets.push(...value);
        }
        return widgets;
    }
    public onChange(path: string | (string | number)[], listener: Listener) {
        if (typeof path == 'string') path = path.split('.').filter(p => p);
        return this.store.onChange({
            selector: ['value', ...path],
            listener: (data, proxiedData) => {
                if (this._config.save && this._config.save.autoSave) this.save();
                listener(data, proxiedData);
            },
        });
    }
    public validate(option: { scrollToInvalidWidget?: boolean } = {}) {
        const defaultOption = {
            scrollToInvalidWidget: true,
        };
        Object.assign(option, defaultOption);
        const result = this.getWidgets()
            .filter(w => !w.isHidden())
            .map(w => w.validate())
            .filter(r => r);
        if (option.scrollToInvalidWidget) {
            let invalidField = result.find(r => r?.validity == false);
            if (invalidField) {
                this.getWidgets(invalidField.path)[0].scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
            }
        }
        return result;
    }
    public undoValidate() {
        return this.getWidgets().forEach(w => w.undoValidate());
    }
    public save() {
        if (!this._config.save) throw new Error('You must enable save option first.');
        try {
            LocalStorage.set(this._config.save.location, { value: this.getTarget() });
        } catch (err) {}
    }
    public load() {
        if (!this._config.save) throw new Error('You must enable save option first.');
        const value = LocalStorage.get(this._config.save.location)?.value;
        if (value != null) this.setValue([], value);
        this.getWidgets().forEach(w => w.onLoadHistory());
    }
    public getHistory() {
        if (!this._config.save) throw new Error('You must enable save option first.');
        return LocalStorage.get(this._config.save.location)?.value;
    }
    public clearHistory() {
        if (this._config.save) LocalStorage.remove(this._config.save.location);
    }
    render() {
        let hidden;
        if (this.schema.hidden) hidden = typeof this.schema.hidden == 'function' ? this.schema.hidden.bind(this)() : this.schema.hidden;
        if (!hidden) return html`${until(this.schema.widget.template({ form: this, path: '' }))}`;
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'cdp-form-builder': FormBuilder;
    }
}
