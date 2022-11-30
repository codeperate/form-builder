// import { JSONSchema7 } from 'json-schema';
// import { LitElement, TemplateResult } from 'lit';
// import { property, state } from 'lit/decorators.js';
// export type Columns = number | { [key: string]: number; default: number };
// export type WidgetFn = (props: WidgetProps) => Promise<{ template: TemplateResult; columns?: Columns }>;
// //export type CustomValidateFn = (value: any, obj: { form: CdpJSONForm; defaultValidator: () => ValidatedMeta }) => ValidatedMeta;
// export interface UISchema<T extends UISchema = any> extends Mutable<T | false, CdpJSONForm> {
//     widget?: WidgetFn;
//     view?: boolean;
//     validate?: CustomValidateFn;
//     items?: UISchema;
//     properties?: ObjectUISchema[];
//     props?: ((this: CdpJSONForm) => Record<string, any>) | Record<string, any>;
//     path?: string[];
//     schemaPath?: string[];
//     hidden?: boolean | ((this: CdpJSONForm) => boolean);
//     required?: boolean | ((this: CdpJSONForm) => boolean);
// }
// export interface ObjectUISchema extends UISchema<ObjectUISchema> {
//     label?: ((key: string) => TemplateResult) | string | false;
//     key?: string;
//     columns?: Columns;
// }
// export interface WidgetProps {
//     form: CdpJSONForm;
//     path: string[];
//     schemaPath: string[];
//     uiSchemaPath: string[];
//     required: boolean;
//     [key: string]: any;
// }
// export type ValidatedMeta = {
//     validity: boolean;
//     err?: { msg: string }[];
// };
// export abstract class ICdpWidget extends LitElement implements WidgetProps {
//     readonly form: CdpJSONForm;
//     readonly path: string[];
//     readonly schemaPath: string[];
//     readonly uiSchemaPath: string[];
//     readonly schema?: JSONSchema7;
//     readonly uiSchema?: UISchema | ObjectUISchema;
//     readonly value: any;
//     readonly required: boolean;
//     isValidated: boolean;
//     readonly view: boolean;

import { LitElement } from 'lit';
import { Class } from '../type/class';

//     validator(): ValidatedMeta {
//         return { validity: true };
//     }
//     validate: () => ValidatedMeta;
//     validatedMeta: ValidatedMeta;
// }
// export function WidgetMixin<T extends Class<LitElement>>(superClass: T) {
//     abstract class CdpWidget extends superClass {
//         @property({ type: Array }) schemaPath: string[];
//         @property({ type: Array }) uiSchemaPath: string[];
//         @property({ type: Array }) path: string[];
//         form: FormBuilder;
//         @property({ type: Boolean }) required: boolean = false;
//         @state() value: any;
//         @state() isValidated: boolean = false;
//         @state() validatedMeta: ValidatedMeta | undefined;
//         unsubscribe;
//         get view() {
//             return this.uiSchema?.view ?? this.form.view;
//         }
//         get schema(): JSONSchema7 {
//             return this.form.getSchemaByPath(this.schemaPath);
//         }
//         get uiSchema(): UISchema | ObjectUISchema {
//             return this.form.getUISchemaByPath(this.uiSchemaPath);
//         }
//         validator() {
//             return { validity: true };
//         }
//         validate() {
//             let result;
//             if (this.uiSchema.validate)
//                 result = this.uiSchema.validate.bind(this)(this.value, { form: this.form, defaultValidator: this.validator.bind(this) });
//             else result = this.validator();
//             this.isValidated = true;
//             this.validatedMeta = result;
//             return result;
//         }
//         connectedCallback() {
//             super.connectedCallback();
//             this.form.registerWidget(this.path, this);
//             this.value = this.form.getValue(this.path);
//             this.unsubscribe = this.form.onChange(
//                 () => this.path,
//                 (v, pv) => {
//                     this.value = pv || v;
//                     //this.pxValue = pv;
//                     //this.requestUpdate();
//                 },
//             );
//         }
//         willUpdate(changed) {
//             super.willUpdate(changed);
//             if (changed.has('path')) this.value = this.form.getValue(this.path);
//             if (this.uiSchema?.hidden != null) this.hidden = extractFn.bind(this.form)(this.uiSchema.hidden);
//         }
//         disconnectedCallback(): void {
//             this.form.unregisterWidget(this.path);
//             this.unsubscribe();
//         }
//     }
//     return CdpWidget as T & AbstractClass<ICdpWidget>;
// }
