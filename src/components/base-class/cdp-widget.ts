import { LitElement } from 'lit';
import { property, state } from 'lit/decorators';
import { FormBuilder, FormSchema } from '../form-builder';
import { Class } from '../type/class';

export interface FormWidgetProps {}
export class FormWidget {
    readonly form: FormBuilder;
    readonly path: string[];
    readonly schema: FormSchema;
    private isValidated: boolean;
}
export function FormWidgetMixin<T extends Class<LitElement>>(superClass: T) {
    class Widget extends superClass {
        readonly form: FormBuilder;
        readonly path: string[];
        readonly schema: FormSchema;
        @state() value: any;
        @state() isValidated: boolean;
        unsubscribe;
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
    return Widget as unknown as T & Class<FormWidget>;
}
export type ValidatedMeta = {
    validity: boolean;
    path: (string | symbol | number)[];
    err?: { msg: string }[];
};
