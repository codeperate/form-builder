import { LitElement } from 'lit';
import { state } from 'lit/decorators.js';
import { FormBuilder, FormSchema } from '../form-builder';
import { Class } from '../type/class';

export interface FormWidgetProps {
    form: FormBuilder;
    path: (string | symbol | number)[];
}
export interface IFormWidget {
    readonly form: FormBuilder;
    readonly path: (string | symbol | number)[];
    readonly schema: FormSchema;
    value: any;
    isValidated: boolean;
    unsubscribe: Function;
    validator();
}
export function FormWidgetMixin<T extends Class<LitElement>>(superClass: T) {
    class FormWidget extends superClass {
        readonly form: FormBuilder;
        readonly path: (string | symbol | number)[];
        readonly schema: FormSchema;
        @state() value: any;
        @state() isValidated: boolean;
        unsubscribe: Function;
        validator() {
            return { validity: true, path: this.path };
        }
        connectedCallback() {
            super.connectedCallback();
            this.form.regWidget(this.path, this);
            this.unsubscribe = this.form.onChange(this.path, (v, pv) => {
                this.value = pv || v;
            });
        }
        disconnectedCallback(): void {
            this.form.unRegWidget(this.path);
            this.unsubscribe();
        }
    }
    return FormWidget as T & Class<IFormWidget>;
}
export type ValidatedMeta = {
    validity: boolean;
    path: (string | symbol | number)[];
    err?: { msg: string }[];
};
