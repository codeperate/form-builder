import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { until } from 'lit/directives/until.js';
import { FormWidgetMixin } from '../../base-class/cdp-widget.js';
import { NonShadow } from '../../base-class/non-shadow.js';
import { CmptType } from '../../config.js';
import { columnClass } from '../../utils/columns.utils.js';
import './object-widget.config.js';
@customElement('cdp-object-widget')
export class CdpObjectWidget extends FormWidgetMixin(CmptType.ObjectWidget, NonShadow) {
    validator() {
        const meta = super.validator();
        if (this.schema.required && this.value == null) meta.validity = false;
        return meta;
    }
    render() {
        const c = this.config;
        return html` <div class="cfb-grid des:cfb-grid-cols-12 mob:cfb-grid-cols-6 cfb-gap-4">
            ${repeat(
                Object.keys(this.schema.properties),
                key => key,
                key => {
                    let { label, required, hidden, columns } = this.schema.properties[key];
                    hidden = typeof hidden == 'function' ? hidden.bind(this)() : hidden;
                    required = typeof required == 'function' ? required.bind(this)() : required;
                    if (!this.schema.properties[key].widget) return;
                    const { template, columns: defaultColumns } = this.schema.properties[key].widget;

                    return html`<div
                        class=" ${columnClass(columns ?? defaultColumns)} cfb-grid cfb-content-start ${hidden ? 'cfb-hidden' : ``}"
                    >
                        ${label === false
                            ? ''
                            : html`<label class="cfb-font-bold"
                                  >${label ?? (typeof key == 'string' ? key : '')}
                                  ${required && !this.view ? html`<span class="cfb-text-danger-600">${c.required.text}</span>` : ''}
                              </label>`}
                        ${until(template({ form: this.form, path: `${this.path}.${key}` }))}
                    </div>`;
                },
            )}
        </div>`;
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'cdp-object-widget': CdpObjectWidget;
    }
}
