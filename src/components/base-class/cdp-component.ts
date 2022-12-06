import { deepAssign } from '@codeperate/utils';
import { LitElement, PropertyValueMap } from 'lit';
import { property, state } from 'lit/decorators.js';
import { CdpFormBuilder, CmptConfig, CmptType } from '../config.js';
import { Class } from '../type/class.js';
export abstract class ICmpt<K extends CmptType> {
    config: CmptConfig[K];
    _config: CmptConfig[K];
}
export function CmptMixin<T extends Class<LitElement>, K extends CmptType>(type: K, superClass: T) {
    class CdpCmpt extends superClass {
        @property() config: CmptConfig[K];
        @state() _config: CmptConfig[K];
        cmptType = type;
        connectedCallback(): void {
            super.connectedCallback();
            this._config = deepAssign(
                CdpFormBuilder.getConfig(c => c.cmpts[this.cmptType]),
                this.config,
            );
        }
        protected willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
            super.willUpdate(_changedProperties);
            if (_changedProperties.has('config'))
                this._config = deepAssign(
                    CdpFormBuilder.getConfig(c => c.cmpts[this.cmptType]),
                    this.config,
                );
        }
    }
    return CdpCmpt as T & Class<ICmpt<K>>;
}
