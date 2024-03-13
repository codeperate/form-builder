import { html } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { FormWidgetMixin } from '../../base-class/cdp-widget.js';
import { NonShadow } from '../../base-class/non-shadow.js';
import { CmptType } from '../../config.js';
import './date-widget.config.js';
import { ifDefined } from 'lit/directives/if-defined.js';
@customElement('cdp-date-widget')
export class CdpDateWidget extends FormWidgetMixin(CmptType.DateWidget, NonShadow) {
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
        const { empty } = this.config;
        if (this.view) return html`<div>${this.value ?? empty}</div>`;
        let validatedClass = 'cfb-bg-gray-200 hover:cfb-bg-gray-300';
        if (this.isValidated)
            validatedClass = this.validatedMeta?.validity
                ? /*tw*/ 'cfb-bg-valid-100 hover:cfb-bg-valid-200'
                : /*tw*/ 'cfb-bg-danger-100 hover:cfb-bg-danger-200';
        const id = this.config.id ?? this.schema.label;

        return html`
            <input
                .required=${required}
                id=${ifDefined(id)}
                class="cfb-rounded-lg cfb-p-1.5 ${validatedClass} cfb-min-w-0 cfb-w-full cfb-appearance-none cfb-h-10"
                type="date"
                @input=${e => {
                    this.setValue(e.target.value);
                    this.validate();
                }}
                .value=${this.value?.substr(0, 10) || ''}
            />
            <span class="cfb-mt-1 cfb-text-sm cfb-text-danger-600">${this.validatedMeta?.err?.[0].msg}</span>
        `;
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'cdp-date-widget': CdpDateWidget;
    }
}
