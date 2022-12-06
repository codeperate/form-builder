import { deepAssign, safeGet, safeSet } from '@codeperate/utils';
import { DeepPartial } from './type/deep-partial';
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
}
export interface CmptConfig {
    [CmptType.FormBuilder]: FormBuilderConfig;
    [CmptType.ObjectWidget]: any;
    [CmptType.StringWidget]: StringWidgetConfig;
}
