import { html } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { FormWidgetMixin } from '../../base-class/cdp-widget.js';
import { NonShadow } from '../../base-class/non-shadow.js';
import { CmptType } from '../../config.js';
import { IWidget } from '../../form-builder.js';
import './string-widget.config.js';
import { StringWidgetConfig } from './string-widget.config.js';
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
            this.form.setValue(this.path, defaultValue);
        }
    }
    render() {
        const { required } = this.schema;
        const { pattern, minLength, maxLength, empty } = this.config;

        if (this.view) return html`<div>${this.value ?? empty}</div>`;
        let validatedClass = 'cfb-bg-gray-200 hover:cfb-bg-gray-300';
        if (this.isValidated)
            validatedClass = this.validatedMeta?.validity
                ? /*tw*/ 'cfb-bg-valid-100 hover:cfb-bg-valid-200'
                : /*tw*/ 'cfb-bg-danger-100 hover:cfb-bg-danger-200';
        return html`
            <input
                .required=${required}
                class="cfb-rounded-lg cfb-p-1.5 ${validatedClass} cfb-min-w-0 cfb-w-full"
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

export const StringWidget: IWidget<StringWidgetConfig> = {
    template: async ({ path, form }) => html`<cdp-string-widget .form=${form} .path=${path}></cdp-string-widget>`,
    columns: 6,
};
