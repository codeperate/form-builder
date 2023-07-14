import { html } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { FormWidgetMixin } from '../../base-class/cdp-widget.js';
import { NonShadow } from '../../base-class/non-shadow.js';
import { CmptType } from '../../config.js';
import './textarea-widget.config.js';
@customElement('cdp-textarea-widget')
export class CdpTextAreaWidget extends FormWidgetMixin(CmptType.TextAreaWidget, NonShadow) {
    @query('textarea') inputEl: HTMLTextAreaElement;
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
            this.setValue(defaultValue, { silence: true });
        }
    }
    autoExpandHeight() {
        if (this.config.autoExpandHeight) {
            this.inputEl.style.height = ''; /* Reset the height*/
            this.inputEl.style.height = Math.min(this.inputEl.scrollHeight, this.config.heightLimit) + 'px';
        }
    }
    render() {
        let { required } = this.schema;
        required = typeof required == 'function' ? required.bind(this)() : required;
        const { minLength, maxLength, empty, rows } = this.config;
        const id = this.config.id ?? this.schema.label;
        if (this.view)
            return html`<pre class="cfb-whitespace-pre-wrap cfb-break-all cfb-min-w-0 cfb-max-w-full">${this.value ?? empty}</pre>`;
        let validatedClass = 'cfb-bg-gray-200 hover:cfb-bg-gray-300';
        if (this.isValidated)
            validatedClass = this.validatedMeta?.validity
                ? /*tw*/ 'cfb-bg-valid-100 hover:cfb-bg-valid-200'
                : /*tw*/ 'cfb-bg-danger-100 hover:cfb-bg-danger-200';
        return html`
            <textarea
                id=${ifDefined(id)}
                .required=${required}
                class="cfb-rounded-lg cfb-p-1.5 ${validatedClass} cfb-min-w-0 cfb-w-full"
                @input=${e => {
                    this.autoExpandHeight();
                    this.setValue(e.target.value);
                    this.validate();
                }}
                .value=${this.value || ''}
                minlength=${ifDefined(minLength)}
                maxlength=${ifDefined(maxLength)}
                .rows=${rows}
            >
            </textarea>
            <span class="cfb-mt-1 cfb-text-sm cfb-text-danger-600">${this.validatedMeta?.err?.[0].msg}</span>
        `;
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'cdp-textarea-widget': CdpTextAreaWidget;
    }
}
