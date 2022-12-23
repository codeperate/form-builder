import { TemplateResult } from 'lit';
import { FormWidgetProps, ValidatedMeta } from './base-class/cdp-widget.js';
import type { FormBuilder } from './form-builder.js';
import { CustomJSONSchema } from './type/custom-json-schema.js';
import { Columns } from './utils/columns.utils.js';

export type FormConfig<T> = T extends number ? number : object;

export type FormSchema<T extends { properties?; widget?; items? } = any, C = any> = {
    label?: string | false;
    items?: FormSchema<T['items']>;
    properties?: { [Key in keyof T['properties']]: FormSchema<T['properties'][Key]> } & {
        [Key in symbol]: FormSchema<T['properties'][Key]>;
    };
    widget?: IWidget;
    validate?: boolean;
    validateFn?: (value: any, extra: { form: FormBuilder; defaultValidator: () => ValidatedMeta }) => ValidatedMeta;
    targetPath?: (string | symbol | number)[];
    view?: boolean;
    hidden?: boolean;
    required?: boolean;
    columns?: Columns;
    config?: C extends undefined ? T['widget']['config'] : C;
    [key: string]: any;
};
export interface IWidget<C = any> {
    template: (props: FormWidgetProps) => Promise<TemplateResult>;
    columns?: Columns;
    config?: C;
    jsonSchemaConverter?: (formSchema: FormSchema<any, C>, jsonSchema: CustomJSONSchema) => void;
}
export interface FormBuilderOption {
    save?: { location: string; autoSave: boolean } | false;
}
