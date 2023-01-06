import { deepAssign } from '@codeperate/utils';
import { html } from 'lit';
import { FormSchema, IWidget } from './form-builder.interface.js';
import { ArrayWidgetConfig } from './widget/array-widget/array-widget.config';
import { BooleanWidgetConfig } from './widget/boolean-widget/boolean-widget.config';
import { DateWidgetConfig } from './widget/date-widget/date-widget.config';
import { DateTimeWidgetConfig } from './widget/datetime-widget/datetime-widget.config';
import { NumberWidgetConfig } from './widget/number-widget/number-widget.config';
import { ObjectWidgetConfig } from './widget/object-widget/object-widget.config';
import { PasswordWidgetConfig } from './widget/password-widget/password-widget.config.js';
import { StringWidgetConfig } from './widget/string-widget/string-widget.config';
import { TextAreaWidgetConfig } from './widget/textarea-widget/textarea-widget.config.js';

export const ArrayWidget: IWidget<ArrayWidgetConfig> = {
    template: async ({ path, form }) => {
        await import('./widget/array-widget/array-widget.js');
        return html`<cdp-array-widget .form=${form} .path=${path}></cdp-array-widget>`;
    },
    columns: 12,
};
export const ObjectWidget: IWidget<ObjectWidgetConfig> = {
    template: async ({ path, form }) => {
        await import('./widget/object-widget/object-widget.js');
        return html`<cdp-object-widget .form=${form} .path=${path}></cdp-object-widget>`;
    },
    jsonSchemaConverter: (formSchema, jsonSchema) => {
        if (jsonSchema.required) {
            for (const r of jsonSchema.required) {
                if (formSchema.properties && r in formSchema.properties) formSchema.properties[r].required = true;
            }
        }
    },
    columns: 12,
};
export const StringWidget: IWidget<StringWidgetConfig> = {
    template: async ({ path, form }) => {
        await import('./widget/string-widget/string-widget.js');
        return html`<cdp-string-widget .form=${form} .path=${path}></cdp-string-widget>`;
    },
    jsonSchemaConverter: (formSchema, jsonSchema) => {
        formSchema.config ??= {};
        formSchema.config.default ??= jsonSchema.default as string;
        formSchema.config.pattern ??= jsonSchema.pattern;
        formSchema.config.maxLength ??= jsonSchema.maxLength;
        formSchema.config.minLength ??= jsonSchema.minLength;
        formSchema.config.enum ??= jsonSchema.enum as string[];
        formSchema.config.enumMapper = {...formSchema.config.enumMapper, ...jsonSchema['x-cdp-enum-mapper']}
        if (jsonSchema.format == 'email') formSchema.config.type ??= 'email';
    },
    columns: 6,
};
export const PasswordWidget: IWidget<PasswordWidgetConfig> = {
    template: async ({ path, form }) => {
        await import('./widget/password-widget/password-widget.js');
        return html`<cdp-password-widget .form=${form} .path=${path}></cdp-password-widget>`;
    },
    jsonSchemaConverter: (formSchema, jsonSchema) => {
        formSchema.config ??= {};
        formSchema.config.default ??= jsonSchema.default as string;
        formSchema.config.pattern ??= jsonSchema.pattern;
        formSchema.config.maxLength ??= jsonSchema.maxLength;
        formSchema.config.minLength ??= jsonSchema.minLength;
    },
    columns: 6,
};
export const TextAreaWidget: IWidget<TextAreaWidgetConfig> = {
    template: async ({ path, form }) => {
        await import('./widget/textarea-widget/textarea-widget.js');
        return html`<cdp-textarea-widget .form=${form} .path=${path}></cdp-textarea-widget>`;
    },
    jsonSchemaConverter: (formSchema, jsonSchema) => {
        formSchema.config ??= {};
        formSchema.config.default ??= jsonSchema.default as string;
        formSchema.config.maxLength ??= jsonSchema.maxLength;
        formSchema.config.minLength ??= jsonSchema.minLength;
    },
    columns: 6,
};
export const BooleanWidget: IWidget<BooleanWidgetConfig> = {
    template: async ({ path, form }) => {
        await import('./widget/boolean-widget/boolean-widget.js');
        return html`<cdp-boolean-widget .form=${form} .path=${path}></cdp-boolean-widget>`;
    },
    jsonSchemaConverter: (formSchema, jsonSchema) => {
        formSchema.config ??= {};
        formSchema.config.default ??= jsonSchema.default as string;
    },
    columns: 6,
};
export const DateWidget: IWidget<DateWidgetConfig> = {
    template: async ({ path, form }) => {
        await import('./widget/date-widget/date-widget.js');
        return html`<cdp-date-widget .form=${form} .path=${path}></cdp-date-widget>`;
    },
    jsonSchemaConverter: (formSchema, jsonSchema) => {
        formSchema.config ??= {};
        formSchema.config.default ??= jsonSchema.default as string;
    },
    columns: 6,
};
export const DateTimeWidget: IWidget<DateTimeWidgetConfig> = {
    template: async ({ path, form }) => {
        await import('./widget/datetime-widget/datetime-widget.js');
        return html`<cdp-datetime-widget .form=${form} .path=${path}></cdp-datetime-widget>`;
    },
    columns: 6,
    jsonSchemaConverter: (formSchema, jsonSchema) => {
        formSchema.config ??= {};
        formSchema.config.default ??= jsonSchema.default as string;
    },
};

export const NumberWidget: IWidget<NumberWidgetConfig> = {
    template: async ({ path, form }) => {
        await import('./widget/number-widget/number-widget.js');
        return html`<cdp-number-widget .form=${form} .path=${path}></cdp-number-widget>`;
    },
    jsonSchemaConverter: (formSchema, jsonSchema) => {
        formSchema.config ??= {};
        formSchema.config.minimum ??= jsonSchema.minimum;
        formSchema.config.maximum ??= jsonSchema.maximum;
        formSchema.config.multipleOf ??= jsonSchema.multipleOf;
        formSchema.config.default ??= jsonSchema.default as number;
        if (jsonSchema.type == 'integer') formSchema.config.multipleOf ??= 1;
    },
    columns: 6,
};
export const SectionWidget: IWidget<{ title: string }> = {
    template: async ({ form, path }) => {
        return html`<div class="cfb-font-bold cfb-text-xl">${form.getSchema(path).config.title ?? 'Section'}</div>`;
    },
    columns: 12,
};
export const Section = (title: string, formSchema: FormSchema = {}, key?: number | string | symbol) => {
    const obj = deepAssign({ widget: SectionWidget, config: { title }, label: false }, formSchema);
    return { [key ?? title]: obj };
};

export const FileWidget: IWidget = {
    template: async ({ form, path }) => {
        await import('./widget/file-widget/file-widget.js');
        return html`<cdp-file-widget .form=${form} .path=${path}></cdp-file-widget>`;
    },
    columns: 12,
};
