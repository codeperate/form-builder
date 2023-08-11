import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { FormWidgetMixin } from '../../base-class/cdp-widget.js';
import { NonShadow } from '../../base-class/non-shadow.js';
import { CmptType } from '../../config.js';
import './list-widget.config.js';
@customElement('cdp-list-widget')
export class CdpListWidget extends FormWidgetMixin(CmptType.ListWidget, NonShadow) {
    value: string[];
    connectedCallback(): void {
        super.connectedCallback();
        const { list, default: defaultValue } = this.config;
        if (defaultValue == 'all') {
            this.setValue(
                list.map(v => v.key),
                { silence: true },
            );
        } else if (defaultValue != null) this.setValue(defaultValue, { silence: true });
        else this.setValue([], { silence: true });
    }
    toggle(key: string, value: boolean) {
        if (this.value.includes(key) && !value) this.setValue(this.value.filter(v => v != key));
        else if (!this.value.includes(key) && value) this.setValue([...this.value, key]);
        console.log(this.value);
    }
    selectAll() {
        this.setValue(this.config.list.map(v => v.key));
    }
    clearAll() {
        this.setValue([]);
    }
    render() {
        const { list, name, selectAllBtn, clearAllBtn } = this.config;

        return html`
            <div class="cfb-flex cfb-gap-2 cfb-flex-col">
                <div class="cfb-flex cfb-flex-wrap cfb-gap-4 w-full">
                    ${list.map(
                        ({ key, label }) => html` <div>
                            <input
                                type="checkbox"
                                id=${key}
                                name=${name}
                                @change=${e => this.toggle(key, e.target.checked)}
                                .checked=${(this.value ?? []).includes(key)}
                            />
                            <label for=${key} class="cfb-cursor-pointer">${label ?? key}</label>
                        </div>`,
                    )}
                </div>
                <div class="cfb-flex cfb-gap-2 cfb-border-t cfb-pt-2">
                    ${selectAllBtn !== false
                        ? html`<button
                              class="cfb-py-1 cfb-px-4 cfb-rounded-lg cfb-bg-main-600 hover:cfb-bg-main-700 cfb-text-white"
                              @click=${() => this.selectAll()}
                          >
                              ${selectAllBtn}
                          </button>`
                        : ''}
                    ${clearAllBtn !== false
                        ? html`<button
                              class="cfb-py-1 cfb-px-4 cfb-rounded-lg cfb-bg-main-600 hover:cfb-bg-main-700 cfb-text-white"
                              @click=${() => this.clearAll()}
                          >
                              ${clearAllBtn}
                          </button>`
                        : ''}
                </div>
            </div>
        `;
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'cdp-list-widget': CdpListWidget;
    }
}
