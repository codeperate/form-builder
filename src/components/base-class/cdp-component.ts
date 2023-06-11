import { deepAssign } from '@codeperate/utils';
import { LitElement, PropertyValueMap } from 'lit';
import { property, state } from 'lit/decorators.js';
import type { ConfigType } from '../config.js';
import { CdpFormBuilder } from '../config.js';
import { Class } from '../type/class.js';
export abstract class ICmpt<K extends string> {
    config: ConfigType<K>;
    _config: ConfigType<K>;
}
export function CmptMixin<T extends Class<LitElement>, K extends string>(type: K, superClass: T) {
    class CdpCmpt extends superClass {
        @property() config: ConfigType<K>;
        @state() _config: ConfigType<K>;
        cmptType = type;
        connectedCallback(): void {
            super.connectedCallback();
            this._config = deepAssign(
                CdpFormBuilder.getConfig(c => c.widgets[this.cmptType]),
                this.config,
            );
        }
        protected willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
            super.willUpdate(_changedProperties);
            if (_changedProperties.has('config'))
                this._config = deepAssign(
                    CdpFormBuilder.getConfig(c => c.widgets[this.cmptType]),
                    this.config,
                );
        }
    }
    return CdpCmpt as T & Class<ICmpt<K>>;
}
