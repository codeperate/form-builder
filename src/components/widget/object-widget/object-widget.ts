import { customElement } from 'lit/decorators.js';
import { CmptMixin } from '../../base-class/cdp-component.js';
import { FormWidgetMixin } from '../../base-class/cdp-widget.js';
import { repeat } from 'lit/directives/repeat.js';
import { NonShadow } from '../../base-class/non-shadow.js';
import { CmptType } from '../../config.js';
import { until } from 'lit/directives/until.js';
import './cdp-object-widget.config.js';
import { html } from 'lit';
@customElement('cdp-object-widget')
export class CdpObjectWidget extends FormWidgetMixin(CmptMixin(CmptType.ObjectWidget, NonShadow)) {
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
                key => until(this.schema.properties[key].widget.template),
            )}
        </div>`;
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'cdp-object-widget': CdpObjectWidget;
    }
}
