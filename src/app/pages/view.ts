import { html } from 'lit';
import { query, state } from 'lit/decorators.js';
import { customElement } from 'lit/decorators/custom-element.js';
import { FormSchema, NumberWidget, ObjectWidget, StringWidget } from '../../components';
import { NonShadow } from '../../components/base-class/non-shadow';
import { FormBuilder } from '../../components/form-builder';

@customElement('page-view')
export class PageView extends NonShadow {
    schema: FormSchema = {
        widget: ObjectWidget,
        label: 'object',

        properties: {
            name: { label: 'name', widget: StringWidget },
            other: { label: 'other', widget: NumberWidget },
            number: {
                label: 'number',
                widget: NumberWidget,
                config: {
                    multipleOf: 1,
                },
            },
        },
    };
    @query('cdp-form-builder') form: FormBuilder;
    @state() view = true;
    @state() value = undefined;
    firstUpdated() {}
    render() {
        return html`
            <cdp-form-builder .schema=${this.schema} .view=${this.view} .value=${this.value}></cdp-form-builder>
            <button @click=${() => (this.view = !this.view)}>Toggle View</button>
            <button @click=${() => (this.value = { name: 'asd', number: '1.00' })}>Toggle Value</button>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'page-view': PageView;
    }
}
