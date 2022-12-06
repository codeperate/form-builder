import { html } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { CmptMixin } from '../../base-class/cdp-component.js';
import { FormWidgetMixin } from '../../base-class/cdp-widget.js';
import { NonShadow } from '../../base-class/non-shadow.js';
import { CmptType } from '../../config.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import './cdp-object-widget.config.js';
@customElement('cdp-string-widget')
export class CdpStringWidget extends FormWidgetMixin(CmptMixin(CmptType.StringWidget, NonShadow)) {
    @query('input') inputEl: HTMLInputElement;
    @query('select') selectEl: HTMLSelectElement;
    validator() {
        let el = this.inputEl || this.selectEl;
        const meta = super.validator();
        meta.validity = el.checkValidity();
        if (el.validationMessage) meta.err ??= [{ msg: el.validationMessage }];
        return meta;
    }
    connectedCallback(): void {
        super.connectedCallback();
        const defaultValue = this._config.default;
        if (defaultValue && this.value == null) {
            this.form.setValue(this.path, defaultValue);
        }
    }
    render() {
        const { required } = this.schema;
        const { pattern } = this._config;

        return html`
            <input
                .required=${required}
                class="w-full rounded-lg p-2"
                @input=${e => {
                    this.setValue(e.target.value);
                    this.validate();
                }}
                .value=${this.value || ''}
                pattern=${ifDefined(pattern)}
            />
            <span class="cfb-mt-1 cfb-text-sm cfb-text-cdanger-600">${this.validatedMeta?.err?.[0].msg}</span>
        `;
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'cdp-string-widget': CdpStringWidget;
    }
}
