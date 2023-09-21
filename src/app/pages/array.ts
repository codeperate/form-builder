import { html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { NonShadow } from '../../components/base-class/non-shadow';
import { ArrayWidget, FormSchema, StringWidget } from '../../components';
const pages = import.meta.glob('./pages/**/*.ts', { eager: true });

@customElement('page-array')
export class PageArray extends NonShadow {
    schema: FormSchema = {
        widget: ArrayWidget,
        label: 'Array',
        config: {
            minItems: 1,
        },
        items: {
            label: 'name',
            widget: StringWidget,
        },
    };
    render() {
        return html` <cdp-form-builder .schema=${this.schema}></cdp-form-builder>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'page-array': PageArray;
    }
}
