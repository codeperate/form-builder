import { html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { NonShadow } from '../components/base-class/non-shadow';
import { FormBuilder } from '../components/form-builder';
import { buildForm } from '../components/index.js';
import { buildFormFromJSONSchema } from '../components/utils/build-form-from-json-schema.util';
import { GenerateFormFromJSONSchema } from '../components/utils/generate-form-from-json-schema.util.js';
import {
    ArrayWidget,
    DateTimeWidget,
    NumberWidget,
    ObjectWidget,
    Section,
    SectionWidget,
    StringWidget,
    TextAreaWidget,
} from '../components/widgets';

import './app.css';
const components = import.meta.glob('../components/**/*.ts', { eager: true });
@customElement('app-root')
export class AppRoot extends NonShadow {
    @query('cdp-form-builder') formEl: FormBuilder;
    @state() switch: boolean = false;
    @state() view: boolean = false;
    @state() value: any;
    @state() schema3 = GenerateFormFromJSONSchema(
        {
            type: 'object',
            properties: {
                boolean: { type: 'boolean' },
                date: {
                    $ref: '#/components/Date',
                },
                enum: {
                    type: 'string',
                    enum: ['Y', 'N'],
                },
            },
            required: ['name'],
        },
        {
            refSchema: {
                components: {
                    Date: {
                        type: 'string',
                        format: 'date',
                    },
                },
            },
        },
    );
    @state() schema2 = buildForm({
        widget: ArrayWidget,
        items: {
            widget: ObjectWidget,
            properties: {
                name: {
                    label: 'asdasdasd',
                    widget: StringWidget,
                    config: {},
                },
                date: {},
                dateTime: {
                    widget: DateTimeWidget,
                },
            },
        },
    });
    @state() schema = buildFormFromJSONSchema(
        {
            config: {},
            properties: {
                name: {
                    label: 'asdasdasd',
                    widget: StringWidget,
                    config: {},
                },
                date: {},
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
                ...Section('Testing'),
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
                enum: {},
            },
        },
        {
            type: 'object',
            properties: {
                boolean: { type: 'boolean' },
                date: {
                    $ref: '#/components/Date',
                },
                enum: {
                    type: 'string',
                    enum: ['Y', 'N'],
                },
            },
            required: ['name'],
        },
        {
            refSchema: {
                components: {
                    Date: {
                        type: 'string',
                        format: 'date',
                    },
                },
            },
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
                <button @click=${() => (this.schema = this.schema2)}>Switch Schema</button>
                <button @click=${() => this.formEl.setValue([], [{ name: '123123' }])}>Set Value</button>
                <button
                    @click=${() => {
                        this.value = { name: 'aekjdhakjs' };
                    }}
                >
                    Switch Value
                </button>
                <cdp-form-builder
                    .schema=${this.schema2}
                    @formChange=${e => {
                        console.log(e.detail);
                    }}
                    .value=${this.value}
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
