import { deepAssign } from '@codeperate/utils';
import { LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import { CdpFormBuilder, CmptConfig } from '../config';
import { FormBuilder, FormSchema } from '../form-builder';
import { Class } from '../type/class';

export interface FormWidgetProps {
    form: FormBuilder;
    path: (string | symbol | number)[];
}
export interface IFormWidget<T = any> {
    form: FormBuilder;
    path: (string | symbol | number)[];
    schema: FormSchema;
    key?: string | symbol;
    value: any;
    isValidated: boolean;
    validatedMeta: ValidatedMeta | undefined;
    unsubscribe: Function;
    config: T;
    view: boolean;
    validator(): ValidatedMeta;
    setValue(value: any): void;
    updateValue(): void;
    validate(): ValidatedMeta | undefined;
    connectedCallback(): void;
    disconnectedCallback(): void;
}

export function FormWidgetMixin<T extends Class<LitElement>, K extends string>(name: K, superClass: T) {
    class FormWidget extends superClass {
        @property() form: FormBuilder;
        @property() path: (string | symbol | number)[];
        get schema(): FormSchema {
            return this.form.getSchema(this.path);
        }
        readonly key?: string | symbol;
        @state() value: any;
        @state() isValidated: boolean;
        @state() validatedMeta: ValidatedMeta | undefined;
        unsubscribe: Function;
        config: ConfigType<K>;

        get view() {
            return this.schema.view ?? this.form.view;
        }
        validator() {
            return { validity: true, path: this.path };
        }
        setValue(value) {
            this.form.setValue(this.path, value);
        }
        updateValue() {
            this.value = this.form.getValue(this.path);
        }
        validate() {
            let result;
            const { validate } = this.schema;
            if (!this.view && (validate ?? true)) {
                result = this.validator();
                this.isValidated = true;
                this.validatedMeta = result;
                return result;
            }
        }
        connectedCallback() {
            super.connectedCallback();
            this.form.regWidget(this.path, this);
            this.unsubscribe = this.form.onChange(this.path, (v, pv) => {
                this.value = pv || v;
            });
            this.config = deepAssign(
                CdpFormBuilder.getConfig(o => o.cmpts[name]),
                this.schema.config ?? {},
            );
        }
        disconnectedCallback(): void {
            this.form.unRegWidget(this.path);
            this.unsubscribe();
        }
    }
    return FormWidget as T & Class<IFormWidget<ConfigType<K>>>;
}
export type ConfigType<K extends string> = K extends keyof CmptConfig ? CmptConfig[K] : any;
export type ValidatedMeta = {
    validity: boolean;
    path: (string | symbol | number)[];
    err?: { msg: string }[];
};
