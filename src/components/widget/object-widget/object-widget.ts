import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { until } from 'lit/directives/until.js';
import { FormWidgetMixin } from '../../base-class/cdp-widget.js';
import { NonShadow } from '../../base-class/non-shadow.js';
import { CmptType } from '../../config.js';
import { IWidget } from '../../form-builder.js';
import './object-widget.config.js';
import { ObjectWidgetConfig } from './object-widget.config.js';
@customElement('cdp-object-widget')
export class CdpObjectWidget extends FormWidgetMixin(CmptType.ObjectWidget, NonShadow) {
    validator() {
        const meta = super.validator();
        if (this.schema.required && this.value == null) meta.validity = false;
        return meta;
    }
    render() {
        return html` <div class="cfb-grid cfb-grid-cols-12">
            ${repeat(
                Reflect.ownKeys(this.schema.properties),
                key => key,
                key => until(this.schema.properties[key].widget.template({ form: this.form, path: [...this.path, key] })),
            )}
        </div>`;
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'cdp-object-widget': CdpObjectWidget;
    }
}

export const ObjectWidget: IWidget<ObjectWidgetConfig> = {
    template: async ({ path, form }) => html`<cdp-object-widget .form=${form} .path=${path}></cdp-object-widget>`,
};
