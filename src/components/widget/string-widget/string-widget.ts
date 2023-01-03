import { html } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { FormWidgetMixin } from '../../base-class/cdp-widget.js';
import { NonShadow } from '../../base-class/non-shadow.js';
import { CdpFormBuilder, CmptType } from '../../config.js';
import './string-widget.config.js';
@customElement('cdp-string-widget')
export class CdpStringWidget extends FormWidgetMixin(CmptType.StringWidget, NonShadow) {
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
        const defaultValue = this.config.default;
        if (defaultValue && this.value == null) {
            this.form.setValue(this.path, defaultValue, { silence: true });
        }
        let x = CdpFormBuilder.getConfig(o => o.EnumMapper);
        if (x) this.config.enumMapper = { ...x, ...this.config.enumMapper };
    }
    render() {
        let { required } = this.schema;
        required = typeof required == 'function' ? required.bind(this)() : required;
        const { pattern, minLength, maxLength, empty, selectText, type } = this.config;
        const enumVal = this.config.enum;
        const enumMapper = this.config.enumMapper;
        const defaultValue = this.config.default;
        if (this.view) return html`<div>${this.value ?? empty}</div>`;
        let validatedClass = 'cfb-bg-gray-200 hover:cfb-bg-gray-300';

        if (this.isValidated)
            validatedClass = this.validatedMeta?.validity
                ? /*tw*/ 'cfb-bg-valid-100 hover:cfb-bg-valid-200'
                : /*tw*/ 'cfb-bg-danger-100 hover:cfb-bg-danger-200';
        if (enumVal) {
            return html`
                <select
                    class="${validatedClass} cfb-w-full cfb-rounded-lg cfb-bg-gray-200 cfb-p-1.5"
                    ?required=${required}
                    .value=${this.value || ''}
                    @change=${e => {
                        this.form.setValue(this.path, e.target.value);
                        this.validate();
                    }}
                >
                    <option value="" .disabled=${required}>${selectText}</option>
                    ${enumVal
                        .filter(v => v)
                        .map(
                            val =>
                                html`<option value=${val} ?selected=${this.value ? this.value === val : defaultValue === val}>
                                    ${enumMapper ? enumMapper[val] ?? val : val}
                                </option>`,
                        )}
                </select>
                <span class="cfb-mt-1 cfb-text-sm cfb-text-danger-600">${this.validatedMeta?.err?.[0].msg}</span>
            `;
        }
        return html`
            <input
                .required=${required}
                class="cfb-rounded-lg cfb-p-1.5 ${validatedClass} cfb-min-w-0 cfb-w-full"
                .type=${type}
                @input=${e => {
                    this.setValue(e.target.value);
                    this.validate();
                }}
                .value=${this.value || ''}
                minlength=${ifDefined(minLength)}
                maxlength=${ifDefined(maxLength)}
                pattern=${ifDefined(pattern)}
            />
            <span class="cfb-mt-1 cfb-text-sm cfb-text-danger-600">${this.validatedMeta?.err?.[0].msg}</span>
        `;
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'cdp-string-widget': CdpStringWidget;
    }
}
