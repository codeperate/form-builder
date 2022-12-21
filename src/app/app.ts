import { html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { NonShadow } from '../components/base-class/non-shadow';
import { FormBuilder } from '../components/form-builder';
import { buildFormFromJSONSchema } from '../components/utils/build-form-from-json-schema.util';
import { ArrayWidget, DateTimeWidget, DateWidget, NumberWidget, ObjectWidget, SectionWidget, StringWidget } from '../components/widgets';

import './app.css';
const components = import.meta.glob('../components/**/*.ts', { eager: true });
@customElement('app-root')
export class AppRoot extends NonShadow {
    @query('cdp-form-builder') formEl: FormBuilder;
    @state() switch: boolean = false;
    @state() view: boolean = false;
    @state() value: any;
    schema = buildFormFromJSONSchema(
        {
            config: {},
            properties: {
                name: { config: {} },
                date: {
                    widget: DateWidget,
                },
                dateTime: {
                    widget: DateTimeWidget,
                },
                TITLE: {
                    label: false,
                    widget: SectionWidget,
                    config: {
                        title: 'TITLE',
                    },
                },
                number: {
                    widget: NumberWidget,
                    config: {
                        multipleOf: 0.01,
                    },
                },

                array: {
                    widget: ArrayWidget,
                    items: {
                        widget: StringWidget,
                        required: true,
                    },
                },
                boolean: {
                    //widget: BooleanWidget,
                    required: true,
                },
            },
        },
        {
            type: 'object',
            properties: {
                name: { type: 'string', format: 'date', default: '2022-01-28' },
                boolean: { type: 'boolean' },
            },
            required: ['name'],
        },
    );
    render() {
        if (this.switch) {
            return html` <button @click=${() => (this.switch = false)}>Click</button>`;
        }
        return html`
            <div class="cfb-p-4">
                <button @click=${() => (this.switch = true)}>Hide</button>
                <button @click=${() => this.formEl.validate()}>Validate</button>
                <button @click=${() => this.formEl.undoValidate()}>Undo Validate</button>
                <button @click=${() => (this.view = !this.view)}>View</button>
                <button @click=${() => console.log(this.formEl.getWidgets())}>GetWidgets</button>
                <button @click=${() => console.log(this.formEl.getSchema())}>GetSchema</button>
                <button @click=${() => console.log(this.formEl.load())}>Load History</button>
                <button @click=${() => console.log(this.formEl.save())}>Save History</button>
                <cdp-form-builder
                    .schema=${this.schema}
                    @formChange=${e => {
                        this.value = { ...e.detail };
                    }}
                    .value=${{}}
                    .view=${this.view}
                    name="asd"
                >
                </cdp-form-builder>
                <pre>${JSON.stringify(this.value, null, 2)}</pre>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'app-root': AppRoot;
    }
}
