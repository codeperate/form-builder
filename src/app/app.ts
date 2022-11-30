import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { NonShadow } from '../components/base-class/non-shadow';
@customElement('app-root')
export class AppRoot extends NonShadow {
    render() {
        return html` JHADKJFHDFJSKa `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'app-root': AppRoot;
    }
}
