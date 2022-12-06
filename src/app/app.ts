import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { NonShadow } from '../components/base-class/non-shadow';
const components = import.meta.glob('../components/**/*.ts', { eager: true });
@customElement('app-root')
export class AppRoot extends NonShadow {
    render() {
        return html`<cdp-form-builder> </cdp-form-builder> `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'app-root': AppRoot;
    }
}
