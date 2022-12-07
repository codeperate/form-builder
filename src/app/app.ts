import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { NonShadow } from '../components/base-class/non-shadow';
import { buildForm } from '../components/form-builder';
import { StringWidget } from '../components/widget/string-widget/string-widget';
const components = import.meta.glob('../components/**/*.ts', { eager: true });
@customElement('app-root')
export class AppRoot extends NonShadow {
    schema = buildForm({
        widget: StringWidget,
        config: { pattern: '' },
        properties: {
            name: {
                widget: StringWidget,
                config: {},
            },
            name1: {
                widget: StringWidget,
                config: {},
            },
            name2: {
                widget: StringWidget,
                config: {},
            },
            name3: {
                widget: StringWidget,
                config: {},
            },
            name4: {
                widget: StringWidget,
                config: {},
            },
            name5: {
                widget: StringWidget,
                config: {},
            },
            name6: {
                widget: StringWidget,
                config: {},
            },
            name7: {
                widget: StringWidget,
                config: {},
            },
            name8: {
                widget: StringWidget,
                config: {},
            },
            name9: {
                widget: StringWidget,
                config: {},
            },
            name10: {
                widget: StringWidget,
                config: {
                    pattern: 'asd',
                },
            },
        },
    });
    render() {
        return html`<cdp-form-builder .schema=${this.schema}> </cdp-form-builder> `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'app-root': AppRoot;
    }
}
