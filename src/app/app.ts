import { html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { NonShadow } from '../components/base-class/non-shadow';
import { buildForm, FormBuilder } from '../components/form-builder';
import { ArrayWidget } from '../components/widget/array-widget/array-widget';
import { DateWidget } from '../components/widget/date-widget/date-widget';
import { ObjectWidget } from '../components/widget/object-widget/object-widget';
import { StringWidget } from '../components/widget/string-widget/string-widget';
import './app.css';
const components = import.meta.glob('../components/**/*.ts', { eager: true });
@customElement('app-root')
export class AppRoot extends NonShadow {
    @query('cdp-form-builder') formEl: FormBuilder;
    @state() switch: boolean = false;
    @state() view: boolean = false;
    @state() value: any;
    schema = buildForm({
        widget: ObjectWidget,
        config: {},
        properties: {
            name: { widget: StringWidget, config: {}, required: true },
            date: {
                widget: DateWidget,
            },
            array: {
                widget: ArrayWidget,
                items: {
                    widget: StringWidget,
                    required: true,
                },
            },
        },
    });
    render() {
        if (this.switch) {
            return html` <button @click=${() => (this.switch = false)}>Click</button>`;
        }
        return html`
            <div class="cfb-p-4">
                <button @click=${() => (this.switch = true)}>Hide</button>
                <button @click=${() => console.log(this.formEl.validate())}>Validate</button>
                <button @click=${() => (this.view = !this.view)}>View</button>
                <button @click=${() => console.log(this.formEl.getWidgets())}>GetWidgets</button>
                <cdp-form-builder
                    .schema=${this.schema}
                    @formChange=${e => {
                        this.value = { ...e.detail };
                    }}
                    .value=${{
                        name: 'asjkdajkdhsj',
                        array: ['asd', 'asd2', 'asd3'],
                    }}
                    .view=${this.view}
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
