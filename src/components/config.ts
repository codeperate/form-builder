import { deepAssign, safeGet, safeSet } from '@codeperate/utils';
import { DeepPartial } from './type/deep-partial';
import { ArrayWidgetConfig } from './widget/array-widget/array-widget.config';
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
}
export interface CmptConfig {
    [CmptType.FormBuilder]: FormBuilderConfig;
    [CmptType.ObjectWidget]: ObjectWidgetConfig;
    [CmptType.StringWidget]: StringWidgetConfig;
    [CmptType.ArrayWidget]: ArrayWidgetConfig;
    [key: string]: any;
}
