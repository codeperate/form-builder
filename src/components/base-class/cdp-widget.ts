import { deepAssign } from '@codeperate/utils';
import { LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import { CdpFormBuilder } from '../config';
import type { ConfigType } from '../config';
import { FormBuilder } from '../form-builder';
import { FormSchema } from '../form-builder.interface.js';
import { Class } from '../type/class';

export interface FormWidgetProps {
    form: FormBuilder;
    path: string;
}
export interface IFormWidget<T = any> {
    form: FormBuilder;
    path: string;
    schema: FormSchema;
    key?: string;
    value: any;
    isValidated: boolean;
    validatedMeta: ValidatedMeta | undefined;
    unsubscribeFns: Function[];
    config: T;
    view: boolean;
    validator(): ValidatedMeta;
    onExportValue(value: any): void;
    onLoadHistory(): void;
    setValue(value: any, option?: { silence?: boolean }): void;
    updateValue(): void;
    isHidden(): boolean;
    validate(): ValidatedMeta | undefined;
    undoValidate(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    loadSchemaConfig(): void;
    unsubscribe(): void;
}

export function FormWidgetMixin<T extends Class<LitElement>, K extends string>(name: K, superClass: T) {
    class FormWidget extends superClass {
        @property() form: FormBuilder;
        @property()
        path: string;
        get schema(): FormSchema {
            return this.form.getSchema(this.path);
        }
        readonly key?: string;
        @state() value: any;
        @state() isValidated: boolean;
        @state() validatedMeta: ValidatedMeta | undefined;
        unsubscribeFns: Function[] = [];
        @state() config: ConfigType<K>;

        get view() {
            return this.schema.view ?? this.form.view;
        }
        validator() {
            return { validity: true, path: this.path };
        }
        getPath() {
            return this.schema.targetPath ?? this.path;
        }
        setValue(value, option: { silence?: boolean } = {}) {
            this.form.setValue(this.getPath(), value, option);
        }
        updateValue() {
            this.value = this.form.getValue(this.getPath());
        }
        validate() {
            let result;
            let { validate } = this.schema;
            validate = typeof validate == 'function' ? validate.bind(this)() : validate;
            if (!this.view && (validate ?? true)) {
                if (this.schema.validateFn)
                    result = this.schema.validateFn.bind(this)(this.value, {
                        form: this.form,
                        defaultValidator: this.validator.bind(this),
                    });
                else result = this.validator();
                this.isValidated = true;
                this.validatedMeta = result;
                return result;
            }
        }
        undoValidate() {
            this.isValidated = false;
            this.validatedMeta = undefined;
        }
        connectedCallback() {
            super.connectedCallback();
            this.form.regWidget(this.path, this);
            this.unsubscribeFns.push(
                this.form.onChange(this.path, (v, pv) => {
                    this.value = pv || v;
                }),
            );

            this.loadSchemaConfig();
            this.updateValue();
            if (this.schema.listenTo) {
                this.schema.listenTo.forEach(path => {
                    this.unsubscribeFns.push(this.form.onChange(path, () => this.requestUpdate()));
                });
            }
        }
        loadSchemaConfig() {
            this.config = deepAssign(
                CdpFormBuilder.getConfig(o => o.widgets[name]),
                this.schema.config ?? {},
            );
        }
        isHidden() {
            let hidden = this.schema?.hidden;
            if (hidden) return typeof hidden == 'function' ? hidden.bind(this)() : hidden;
            return false;
        }
        unsubscribe() {
            this.unsubscribeFns.forEach(fn => fn());
        }
        disconnectedCallback(): void {
            this.form.unRegWidget(this.path, this);
            this.unsubscribe();
        }
        onLoadHistory() {
            return;
        }
        onExportValue() {
            return;
        }
    }
    return FormWidget as T & Class<IFormWidget<ConfigType<K>>>;
}
export type ValidatedMeta = {
    validity: boolean;
    path: string;
    err?: { msg: string }[];
};
