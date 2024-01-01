import { customElement } from 'lit/decorators/custom-element.js';
import { NonShadow } from '../components/base-class/non-shadow';

import { state } from 'lit/decorators/state.js';
import { html, unsafeStatic } from 'lit/static-html.js';
import { query } from 'lit/decorators/query.js';
import { FormBuilder } from '../components/form-builder';
import { kebabCase } from 'change-case';
const pages = import.meta.glob('./pages/**/*.ts', { eager: true }) as Record<string, any>;

@customElement('app-root')
export class AppRoot extends NonShadow {
    @state() currentPage = '';
    @query('cdp-form-builder') form: FormBuilder;
    pageName() {
        return Object.entries(pages).map(([key, value]) => {
            return { path: key, name: Object.values(value)[0]['name'] };
        }, []);
    }
    currentPageTag() {
        return unsafeStatic(kebabCase(this.currentPage));
    }

    render() {
        return html`
            <div class="cfb-flex">
                <div class="cfb-p-4 cfb-w-[300px] cfb-grid cfb-gap-2">${this.pageName().map(
                    ({ path, name }) => html`<div class="cfb-cursor-pointer" @click=${() => (this.currentPage = name)}>${path}</div>`,
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
