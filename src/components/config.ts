import { deepAssign, safeGet, safeSet } from '@codeperate/utils';
import { CmptConfig } from './cmpt-config';
import { DeepPartial } from './type/deep-partial';
export interface FormBuilderConfig {
    cmpts: CmptConfig;
}

const config = {};
export namespace FormBuilder {
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
