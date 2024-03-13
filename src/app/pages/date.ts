import { html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { DateWidget, FormSchema, ObjectWidget } from '../../components';
import { NonShadow } from '../../components/base-class/non-shadow';

@customElement('page-date')
export class PageDate extends NonShadow {
    schema: FormSchema = {
        widget: ObjectWidget,
        properties: {
            date: {
                widget: DateWidget,
            },
        },
    };
    render() {
        return html` <cdp-form-builder @formChange=${e => console.log(e.detail)} .schema=${this.schema} .value=${{}}></cdp-form-builder>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'page-date': PageDate;
    }
}
