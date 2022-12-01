import { LitElement } from 'lit';
import { state } from 'lit/decorators';
import { FormBuilder, FormSchema } from '../form-builder';
import { Class } from '../type/class';

export interface FormWidgetProps {}
export function FormWidgetFn(superClass) {
    class FormWidget extends superClass {
        readonly form: FormBuilder;
        readonly path: (string | symbol | number)[];
        readonly targetPath: (string | symbol | number)[];
        readonly schema: FormSchema;
        @state() value: any;
        @state() isValidated: boolean;
        unsubscribe;
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
    return FormWidget;
}
export function FormWidgetMixin<T extends Class<LitElement>>(superClass: T) {
    return FormWidgetFn(superClass);
}
export type ValidatedMeta = {
    validity: boolean;
    path: (string | symbol | number)[];
    err?: { msg: string }[];
};
