import { html } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { FormWidgetMixin } from '../../base-class/cdp-widget.js';
import { NonShadow } from '../../base-class/non-shadow.js';
import { CmptType } from '../../config.js';
import './boolean-widget.config.js';
@customElement('cdp-boolean-widget')
export class CdpBooleanWidget extends FormWidgetMixin(CmptType.BooleanWidget, NonShadow) {
    @query('input') inputEl: HTMLInputElement;
    validator() {
        let el = this.inputEl;
        const meta = super.validator();
        meta.validity = el.checkValidity();
        if (el.validationMessage) meta.err ??= [{ msg: el.validationMessage }];
        return meta;
    }
    connectedCallback(): void {
        super.connectedCallback();
        const defaultValue = this.config.default;
        if (defaultValue && this.value == null) {
            this.form.setValue(this.path, defaultValue, { silence: true });
        }
    }
    render() {
        let { required } = this.schema;
        required = typeof required == 'function' ? required.bind(this)() : required;
        const { empty, trueVal, falseVal } = this.config;
        if (this.view) return html`<div>${this.value != null ? (this.value ? trueVal : falseVal) : empty}</div>`;
        let validatedClass = this.value ? /*tw*/ 'cfb-bg-main-500 hover:cfb-bg-main-600' : /*tw*/ 'cfb-bg-gray-500 hover:cfb-bg-gray-600';
        if (this.isValidated && !this.validatedMeta?.validity) validatedClass = /*tw*/ 'cfb-bg-danger-500 hover:cfb-bg-danger-600';
        return html`
            <div class="cfb-grid">
                <button
                    @click=${() => {
                        if (!this.view) this.inputEl.click();
                    }}
                    type="button"
                    class="cfb-w-14 cfb-mb-2 cfb-h-7 cfb-rounded-3xl cfb-relative cfb-cursor-pointer ${validatedClass}"
                >
                    <div
                        class="cfb-grid cfb-items-center cfb-h-full cfb-top-0 cfb-absolute cfb-px-1 cfb-transition-all ${this.value
                            ? 'cfb-left-[calc(100%-1.7rem)]'
                            : 'cfb-left-0'}"
                    >
                        <div class="cfb-w-5 cfb-h-5 cfb-shadow cfb-bg-white cfb-rounded-3xl"></div>
                    </div>
                </button>
                <input
                    id=""
                    class="cfb-hidden"
                    type="checkbox"
                    @change=${e => {
                        this.setValue(e.target.checked);
                        this.validate();
                    }}
                    .required=${required}
                    .checked=${this.value}
                />
                <span class="cfb-mt-1 cfb-text-sm cfb-text-danger-600">${this.validatedMeta?.err?.[0].msg}</span>
            </div>
        `;
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'cdp-boolean-widget': CdpBooleanWidget;
    }
}
