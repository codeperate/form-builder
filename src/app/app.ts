import { html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { NonShadow } from '../components/base-class/non-shadow';
import { FormBuilder } from '../components/form-builder';
import { buildForm, buildFormFromJSONSchema, CdpFormBuilder } from '../components/index.js';
import { GenerateFormFromJSONSchema } from '../components/utils/generate-form-from-json-schema.util.js';
import {
    ArrayWidget,
    DateTimeWidget,
    DateWidget,
    FileWidget,
    ListWidget,
    NumberWidget,
    ObjectWidget,
    PasswordWidget,
    Section,
    SectionWidget,
    StringWidget,
    TextAreaWidget,
} from '../components/widgets';

import './app.css';
const components = import.meta.glob('../components/**/*.ts', { eager: true });

CdpFormBuilder.init({
    widgets: {
        StringWidget: {
            selectText: 'asdf',
        },
    },
    enums: {
        default: {
            Male: 'GLOBAL MALE',
            Female: 'GLOBAL FEMALE',
            a: 'GLOBAL a',
        },
    },
});

@customElement('app-root')
export class AppRoot extends NonShadow {
    @query('cdp-form-builder') formEl: FormBuilder;
    @state() switch: boolean = false;
    @state() view: boolean = false;
    @state() value = {
        name: 'asuidhasuidh',
    };
    @state() schema3 = GenerateFormFromJSONSchema(
        {
            type: 'object',
            properties: {
                boolean: { type: 'boolean', hidden: true },
                date: {
                    $ref: '#/components/Date',
                },
                enum: {
                    type: 'string',
                    enum: ['Y', 'N'],
                    hidden: true,
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
    @state() schema = buildForm({
        config: {},
        widget: ObjectWidget,
        properties: {
            list: {
                widget: ListWidget,
                config: {
                    name: 'list',
                    list: [{ key: 'asdasd' }, { key: 'itemA' }, { key: 'itemB' }],
                },
            },
            dateTime2: {
                widget: DateTimeWidget,
            },
            name: {
                label: 'asdasdasd',
                widget: StringWidget,
                hidden: true,
                config: {
                    default: 'weurhuiehwr',
                },
                enum: ['asdf'],
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
            password: {
                widget: PasswordWidget,
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
            number2: {
                widget: NumberWidget,
                config: {
                    multipleOf: 0.01,
                },
            },
            number3: {
                widget: NumberWidget,
                config: {
                    multipleOf: 0.01,
                },
            },
            number4: {
                widget: NumberWidget,
                config: {
                    multipleOf: 0.01,
                },
                required: true,
            },
            number5: {
                widget: NumberWidget,
                config: {
                    multipleOf: 0.01,
                },
                required: true,
            },
            number6: {
                widget: NumberWidget,
                config: {
                    multipleOf: 0.01,
                },
                required: true,
            },
            number7: {
                widget: NumberWidget,
                config: {
                    multipleOf: 0.01,
                },
                required: true,
            },
            number8: {
                widget: NumberWidget,
                config: {
                    multipleOf: 0.01,
                },
            },
            number9: {
                widget: NumberWidget,
                config: {
                    multipleOf: 0.01,
                },
                required: true,
            },
            number10: {
                widget: NumberWidget,
                config: {
                    multipleOf: 0.01,
                },
                required: true,
            },
        },
    });
    fileSchema = buildForm({
        widget: ObjectWidget,
        properties: {
            asd: { widget: NumberWidget, config: { multipleOf: 1 } },
        },
    });
    schema4 = buildFormFromJSONSchema(
        {
            label: 'Address',
            properties: {
                address: {
                    label: 'Address2',
                    properties: {
                        flat: { label: 'Flat' },
                    },
                },
            },
        },
        {
            type: 'object',
            properties: {
                address: {
                    $ref: '#/components/Address',
                },
            },
            required: ['name'],
        },
        { refSchema: { components: { Address: { type: 'object', properties: { flat: { type: 'string' } } } } } },
    );
    render() {
        console.log(this.schema4);
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
                <button @click=${() => console.log(this.formEl.exportValue())}>ExportValue</button>
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
                    .schema=${this.schema}
                    @formChange=${e => {
                        console.log(e.detail);
                    }}
                    .view=${this.view}
                    .config=${{
                        save: { location: 'test', autoSave: true },
                    }}
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
