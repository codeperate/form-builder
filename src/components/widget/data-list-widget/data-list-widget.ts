import { html } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { FormWidgetMixin } from '../../base-class/cdp-widget.js';
import { NonShadow } from '../../base-class/non-shadow.js';
import { CdpFormBuilder, CmptType } from '../../config.js';
import './data-list-widget.config.js';
@customElement('cdp-data-list-widget')
export class CdpDataListWidget extends FormWidgetMixin(CmptType.DataListWidget, NonShadow) {
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
        const { pattern, minLength, maxLength, empty, listId, listItems } = this.config;
        const id = this.config.id ?? this.schema.label;
        if (this.view) {
            return html`<div>${this.value ?? empty}</div>`;
        }
        let validatedClass = 'cfb-bg-gray-200 hover:cfb-bg-gray-300';

        if (this.isValidated)
            validatedClass = this.validatedMeta?.validity
                ? /*tw*/ 'cfb-bg-valid-100 hover:cfb-bg-valid-200'
                : /*tw*/ 'cfb-bg-danger-100 hover:cfb-bg-danger-200';
        return html`
            <input
                id=${ifDefined(id)}
                .required=${required}
                class="cfb-rounded-lg cfb-p-1.5 ${validatedClass} cfb-min-w-0 cfb-w-full cfb-appearance-none"
                list=${ifDefined(listId)}
                @input=${e => {
                    if (typeof e.target.value == 'string' && e.target.value.trim().length == 0) this.setValue(null);
                    else this.setValue(e.target.value);
                    this.validate();
                }}
                @change=${e => {
                    this.setValue(e.target.value);
                    this.validate();
                }}
                .value=${this.value || ''}
                minlength=${ifDefined(minLength)}
                maxlength=${ifDefined(maxLength)}
                pattern=${ifDefined(pattern)}
            />
            ${listId
                ? html`
                      <datalist id=${listId}>
                          ${listItems.map(item =>
                              typeof item == 'string'
                                  ? html`<option value=${item}></option>`
                                  : html`<option value=${item.value}>${item.text}</option>`,
                          )}
                      </datalist>
                  `
                : ''}

            <span class="cfb-mt-1 cfb-text-sm cfb-text-danger-600">${this.validatedMeta?.err?.[0].msg}</span>
        `;
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'cdp-data-list-widget': CdpDataListWidget;
    }
}
