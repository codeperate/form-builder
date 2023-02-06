import { deepAssign } from '@codeperate/utils';
import { LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import { CdpFormBuilder, ConfigType } from '../config';
import { FormBuilder } from '../form-builder';
import { FormSchema } from '../form-builder.interface.js';
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
    onExportValue(value: any): void;
    setValue(value: any, option?: { silence?: boolean }): void;
    updateValue(): void;
    isHidden(): boolean;
    validate(): ValidatedMeta | undefined;
    undoValidate(): void;
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
            this.unsubscribe = this.form.onChange(this.path, (v, pv) => {
                this.value = pv || v;
            });
            this.config = deepAssign(
                CdpFormBuilder.getConfig(o => o[name]),
                this.schema.config ?? {},
            );
            this.updateValue();
        }
        isHidden() {
            let hidden = this.schema?.hidden;
            if (hidden) return typeof hidden == 'function' ? hidden.bind(this)() : hidden;
            return false;
        }
        disconnectedCallback(): void {
            this.form.unRegWidget(this.path);
            this.unsubscribe();
        }
        onExportValue() {
            return;
        }
    }
    return FormWidget as T & Class<IFormWidget<ConfigType<K>>>;
}
export type ValidatedMeta = {
    validity: boolean;
    path: (string | symbol | number)[];
    err?: { msg: string }[];
};
