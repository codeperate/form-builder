import { deepAssign, safeGet, safeSet } from '@codeperate/utils';
import { DeepPartial } from './type/deep-partial';
import { ArrayWidgetConfig } from './widget/array-widget/array-widget.config';
import { NumberWidgetConfig } from './widget/number-widget/number-widget.config';
import { ObjectWidgetConfig } from './widget/object-widget/object-widget.config';
import { StringWidgetConfig } from './widget/string-widget/string-widget.config';
export interface FormBuilderConfig {
    cmpts: CmptConfig;
}

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
    FormBuilder = 'FormBuilder',
    ObjectWidget = 'ObjectWidget',
    StringWidget = 'StringWidget',
    ArrayWidget = 'ArrayWidget',
    DateWidget = 'DateWidget',
    DateTimeWidget = 'DateTimeWidget',
    IntegerWidget = 'IntegerWidget',
    NumberWidget = 'NumberWidget',
    DataViewerWidget = 'DataViewerWidget',
    BooleanWidget = 'BooleanWidget',
}
export interface CmptConfig {
    [CmptType.FormBuilder]: FormBuilderConfig;
    [CmptType.ObjectWidget]: ObjectWidgetConfig;
    [CmptType.StringWidget]: StringWidgetConfig;
    [CmptType.ArrayWidget]: ArrayWidgetConfig;
    [CmptType.DataViewerWidget]: any;
    [CmptType.DateWidget]: any;
    [CmptType.DateTimeWidget]: any;
    [CmptType.IntegerWidget]: any;
    [CmptType.BooleanWidget]: any;
    [CmptType.NumberWidget]: NumberWidgetConfig;
    [key: string]: any;
}
export type ConfigType<K extends string> = K extends keyof CmptConfig ? CmptConfig[K] : any;
