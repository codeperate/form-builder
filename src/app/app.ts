import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { NonShadow } from '../components/base-class/non-shadow';
import { FormSchema } from '../components/form-builder';
import { StringWidget } from '../components/widget/string-widget/string-widget';
const components = import.meta.glob('../components/**/*.ts', { eager: true });
@customElement('app-root')
export class AppRoot extends NonShadow {
    schema: FormSchema = {
        properties: {
            name: { widget: StringWidget({ pattern: '' }) },
        },
    };
    render() {
        return html`<cdp-form-builder
            .schema=${{
                widget: StringWidget(),
            }}
        >
        </cdp-form-builder> `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'app-root': AppRoot;
    }
}
