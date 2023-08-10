import { deepAssign, safeGet, safeSet } from '@codeperate/utils';
import { FormBuilderOption } from './form-builder.interface.js';
import { DeepPartial } from './type/deep-partial';
import { ArrayWidgetConfig } from './widget/array-widget/array-widget.config';
import { BooleanWidgetConfig } from './widget/boolean-widget/boolean-widget.config.js';
import { DateWidgetConfig } from './widget/date-widget/date-widget.config.js';
import { DateTimeWidgetConfig } from './widget/datetime-widget/datetime-widget.config';
import { FileWidgetConfig } from './widget/file-widget/file-widget.config.js';
import { NumberWidgetConfig } from './widget/number-widget/number-widget.config';
import { ObjectWidgetConfig } from './widget/object-widget/object-widget.config';
import { PasswordWidgetConfig } from './widget/password-widget/password-widget.config.js';
import { StringWidgetConfig } from './widget/string-widget/string-widget.config';
import { TextAreaWidgetConfig } from './widget/textarea-widget/textarea-widget.config.js';
import { JSONSchemaTypeMapper } from './utils/build-form-from-json-schema.util.js';
import {
    ArrayWidget,
    BooleanWidget,
    DateTimeWidget,
    DateWidget,
    NumberWidget,
    ObjectWidget,
    StringWidget,
    TextAreaWidget,
} from './widgets.js';
import { ListWidgetConfig } from './widget/list-widget/list-widget.config.js';
export type FormBuilderConfig = {
    widgets: CmptConfig;
    formBuilder: FormBuilderOption;
    enums: {
        [key: string]: { [key: string]: string };
    };
    typeMapper: JSONSchemaTypeMapper;
};

export const DefaultTypeMapper = {
    string: { 'default': StringWidget, 'date': DateWidget, 'date-time': DateTimeWidget, 'email': StringWidget },
    number: {
        default: NumberWidget,
    },
    integer: {
        default: NumberWidget,
    },
    object: {
        default: ObjectWidget,
    },
    array: {
        default: ArrayWidget,
    },
    boolean: {
        default: BooleanWidget,
    },
    textarea: {
        default: TextAreaWidget,
    },
};
let config = {
    typeMapper: DefaultTypeMapper,
} as DeepPartial<FormBuilderConfig>;
export namespace CdpFormBuilder {
    export function setConfig<C>(path: (obj: FormBuilderConfig) => C, value: C) {
        config = safeSet(config, path, value);
        return config;
    }
    export function setDefaultConfig<C>(path: (obj: FormBuilderConfig) => C, value: Partial<C>) {
        const currentConfig = CdpFormBuilder.getConfig(path) ?? {};
        CdpFormBuilder.setConfig(path, deepAssign(value, currentConfig));
    }
    export function getConfig<C>(path: (obj: FormBuilderConfig) => C) {
        return safeGet(config, path);
    }
    export function init(_config: DeepPartial<FormBuilderConfig>) {
        Object.assign(config, deepAssign(config, _config));
        return config;
    }
}

export enum CmptType {
    FileWidget = 'FileWidget',
    ObjectWidget = 'ObjectWidget',
    StringWidget = 'StringWidget',
    TextAreaWidget = 'TextAreaWidget',
    ArrayWidget = 'ArrayWidget',
    DateWidget = 'DateWidget',
    DateTimeWidget = 'DateTimeWidget',
    NumberWidget = 'NumberWidget',
    DataViewerWidget = 'DataViewerWidget',
    BooleanWidget = 'BooleanWidget',
    PasswordWidget = 'PasswordWidget',
    ListWidget = 'ListWidget',
}
export interface CmptConfig {
    [CmptType.ObjectWidget]: ObjectWidgetConfig;
    [CmptType.StringWidget]: StringWidgetConfig;
    [CmptType.ArrayWidget]: ArrayWidgetConfig;
    [CmptType.TextAreaWidget]: TextAreaWidgetConfig;
    [CmptType.DataViewerWidget]: any;
    [CmptType.DateWidget]: DateWidgetConfig;
    [CmptType.DateTimeWidget]: DateTimeWidgetConfig;
    [CmptType.BooleanWidget]: BooleanWidgetConfig;
    [CmptType.NumberWidget]: NumberWidgetConfig;
    [CmptType.FileWidget]: FileWidgetConfig;
    [CmptType.PasswordWidget]: PasswordWidgetConfig;
    [CmptType.ListWidget]: ListWidgetConfig;
    [key: string]: any;
}
export type ConfigType<K extends string> = K extends keyof CmptConfig ? CmptConfig[K] : any;
