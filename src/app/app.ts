import { html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { NonShadow } from '../components/base-class/non-shadow';
import { buildForm, FormBuilder } from '../components/form-builder';
import { ObjectWidget } from '../components/widget/object-widget/object-widget';
import { StringWidget } from '../components/widget/string-widget/string-widget';
import './app.css';
const components = import.meta.glob('../components/**/*.ts', { eager: true });
@customElement('app-root')
export class AppRoot extends NonShadow {
    @query('cdp-form-builder') formEl: FormBuilder;
    @state()
    switch: boolean = false;
    schema = buildForm({
        widget: ObjectWidget,
        properties: {
            name: {
                widget: StringWidget,
                config: {},
                required: true,
            },
        },
    });
    render() {
        if (this.switch) {
            return html` <button @click=${() => (this.switch = false)}>Click</button>`;
        }
        return html`
            <button @click=${() => (this.switch = true)}>Click</button>
            <button @click=${() => this.formEl.validate()}>Validate</button>
            <cdp-form-builder
                .schema=${this.schema}
                @formChange=${e => {
                    console.log(e.detail);
                }}
            >
            </cdp-form-builder>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'app-root': AppRoot;
    }
}
