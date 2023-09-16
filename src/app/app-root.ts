import { customElement } from 'lit/decorators/custom-element.js';
import { NonShadow } from '../components/base-class/non-shadow';

import { state } from 'lit/decorators/state.js';
import { html, unsafeStatic } from 'lit/static-html.js';
import { query } from 'lit/decorators/query.js';
import { FormBuilder } from '../components/form-builder';
const pages = import.meta.glob('./pages/**/*.ts', { eager: true });

@customElement('app-root')
export class AppRoot extends NonShadow {
    @state() currentPage;
    @query('cdp-form-builder') form: FormBuilder;
    pageName() {
        return Object.keys(pages).map(p => p.split('/').pop().split('.').shift());
    }
    currentPageTag() {
        return unsafeStatic(`page-${this.currentPage}`);
    }

    render() {
        return html`
            <div class="">
                <div class="cfb-border-b cfb-p-4">${this.pageName().map(
                    name => html`<button @click=${() => (this.currentPage = name)}>${name}</button>`,
                )}</div>
                <div class="cfb-p-4"><${this.currentPageTag()}></${this.currentPageTag()}></div>
                <div class="cfb-fixed cfb-bottom-0 cfb-left-0 cfb-p-2 cfb-w-full cfb-bg-black">
                    <button class="cfb-bg-white cfb-text-black cfb-p-2 cfb-rounded-lg" @click=${() =>
                        this.form.validate()}>Validate</button>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'app-root': AppRoot;
    }
}
