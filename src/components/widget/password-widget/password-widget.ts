import { html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { FormWidgetMixin } from '../../base-class/cdp-widget.js';
import { NonShadow } from '../../base-class/non-shadow';
import { CmptType } from '../../config';

@customElement('cdp-password-widget')
export class CdpPasswordWidget extends FormWidgetMixin(CmptType.PasswordWidget, NonShadow) {
    @query('input') inputEl: HTMLInputElement;
    @query('select') selectEl: HTMLSelectElement;
    @state() revealPw: boolean;
    validator() {
        let el = this.inputEl || this.selectEl;
        const meta = super.validator();
        meta.validity = el.checkValidity();
        if (el.validationMessage) meta.err ??= [{ msg: el.validationMessage }];
        return meta;
    }
    connectedCallback(): void {
        super.connectedCallback();
    }
    render() {
        let { required } = this.schema;
        required = typeof required == 'function' ? required.bind(this)() : required;
        const { pattern, minLength, maxLength, empty } = this.config;
        if (this.view) return html`<div>${empty}</div>`;
        let validatedClass = 'cfb-bg-gray-200 hover:cfb-bg-gray-300';
        const id = this.config.id ?? this.schema.label;
        if (this.isValidated)
            validatedClass = this.validatedMeta?.validity
                ? /*tw*/ 'cfb-bg-valid-100 hover:cfb-bg-valid-200'
                : /*tw*/ 'cfb-bg-danger-100 hover:cfb-bg-danger-200';
        return html`
            <div class="cfb-w-full cfb-rounded-lg ${validatedClass} cfb-flex cfb-pr-1 cfb-items-center">
                <input
                    id=${ifDefined(id)}
                    .required=${required}
                    class="cfb-flex-grow cfb-bg-opacity-0 cfb-bg-white cfb-p-1.5 cfb-rounded-lg focus:cfb-outline-none cfb-w-full cfb-appearance-none"
                    .type=${this.revealPw ? 'text' : 'password'}
                    @input=${e => {
                        this.setValue(e.target.value);
                        this.validate();
                    }}
                    .value=${this.value || ''}
                    minlength=${ifDefined(minLength)}
                    maxlength=${ifDefined(maxLength)}
                    pattern=${ifDefined(pattern)}
                />
                <button
                    type="button"
                    class="cfb-aspect-square cfb-w-7 cfb-rounded-lg hover:cfb-bg-gray-400"
                    @click=${() => (this.revealPw = !this.revealPw)}
                >
                    <i class="fa-solid  ${this.revealPw ? 'fa-eye' : 'fa-eye-slash'}"></i>
                </button>
            </div>
            <span class="cfb-mt-1 cfb-text-sm cfb-text-danger-600">${this.validatedMeta?.err?.[0].msg}</span>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'cdp-password-widget': CdpPasswordWidget;
    }
}
