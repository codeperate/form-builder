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
import { StringWidgetConfig } from './widget/string-widget/string-widget.config';
import { TextAreaWidgetConfig } from './widget/textarea-widget/textarea-widget.config.js';
export type FormBuilderConfig = CmptConfig;

const config = {};
export namespace CdpFormBuilder {
    export function setConfig<C>(path: (obj: FormBuilderConfig) => C, value: C) {
        return safeSet(config, path, value);
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
    FormBuilder = 'FormBuilder',
    ObjectWidget = 'ObjectWidget',
    StringWidget = 'StringWidget',
    TextAreaWidget = 'TextAreaWidget',
    ArrayWidget = 'ArrayWidget',
    DateWidget = 'DateWidget',
    DateTimeWidget = 'DateTimeWidget',
    NumberWidget = 'NumberWidget',
    DataViewerWidget = 'DataViewerWidget',
    BooleanWidget = 'BooleanWidget',
    EnumMapper = 'EnumMapper'
}
export interface CmptConfig {
    [CmptType.FormBuilder]: FormBuilderOption;
    [CmptType.ObjectWidget]: ObjectWidgetConfig;
    [CmptType.StringWidget]: StringWidgetConfig;
    [CmptType.ArrayWidget]: ArrayWidgetConfig;
    [CmptType.TextAreaWidget]: TextAreaWidgetConfig;
    [CmptType.DataViewerWidget]: any;
    [CmptType.DateWidget]: DateWidgetConfig;
    [CmptType.DateTimeWidget]: DateTimeWidgetConfig;
    [CmptType.BooleanWidget]: BooleanWidgetConfig;
    [CmptType.NumberWidget]: NumberWidgetConfig;
    [CmptType.EnumMapper]: Record<string,string> | {[key:string]:string}
    [CmptType.FileWidget]: FileWidgetConfig;
    [key: string]: any;
}
export type ConfigType<K extends string> = K extends keyof CmptConfig ? CmptConfig[K] : any;