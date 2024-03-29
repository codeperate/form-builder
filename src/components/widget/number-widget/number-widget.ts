import { html } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { FormWidgetMixin } from '../../base-class/cdp-widget.js';
import { NonShadow } from '../../base-class/non-shadow.js';
import { CmptType } from '../../config.js';
import './number-widget.config.js';
@customElement('cdp-number-widget')
export class CdpNumberWidget extends FormWidgetMixin(CmptType.NumberWidget, NonShadow) {
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
            this.setValue(defaultValue, { silence: true });
        }
    }
    render() {
        let { required } = this.schema;
        required = typeof required == 'function' ? required.bind(this)() : required;
        const { empty, multipleOf, minimum, maximum } = this.config;
        const id = this.config.id ?? this.schema.label;
        if (this.view) return html`<div>${this.value ?? empty}</div>`;
        let validatedClass = 'cfb-bg-gray-200 hover:cfb-bg-gray-300';
        if (this.isValidated)
            validatedClass = this.validatedMeta?.validity
                ? /*tw*/ 'cfb-bg-valid-100 hover:cfb-bg-valid-200'
                : /*tw*/ 'cfb-bg-danger-100 hover:cfb-bg-danger-200';
        let isInteger = multipleOf == 1;
        return html`
            <input
                .required=${required}
                id="${ifDefined(id)}"
                class="cfb-rounded-lg cfb-p-1.5 ${validatedClass} cfb-min-w-0 cfb-w-full cfb-appearance-none"
                type="number"
                min=${ifDefined(minimum)}
                max=${ifDefined(maximum)}
                inputmode="${ifDefined(isInteger ? 'numeric' : undefined)}"
                @input=${e => {
                    this.setValue(e.target.valueAsNumber);
                    this.validate();
                }}
                step=${ifDefined(multipleOf)}
                .value=${this.value || ''}
            />
            <span class="cfb-mt-1 cfb-text-sm cfb-text-danger-600">${this.validatedMeta?.err?.[0].msg}</span>
        `;
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'cdp-number-widget': CdpNumberWidget;
    }
}
