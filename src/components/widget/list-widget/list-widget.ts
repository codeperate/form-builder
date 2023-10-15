import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { FormWidgetMixin } from '../../base-class/cdp-widget.js';
import { NonShadow } from '../../base-class/non-shadow.js';
import { CdpFormBuilder, CmptType } from '../../config.js';
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
        const newArr = [...(this.value ?? [])];
        if (newArr.includes(key) && !value) this.setValue(newArr.filter(v => v != key));
        else if (!newArr.includes(key) && value) this.setValue([...newArr, key]);
    }
    selectAll() {
        this.setValue(this.config.list.map(v => v.key));
    }
    clearAll() {
        this.setValue([]);
    }
    loadSchemaConfig(): void {
        super.loadSchemaConfig();
        let globalEnumMapper = CdpFormBuilder.getConfig(o => o.enums)?.[this.config.enumMapperKey];
        if (globalEnumMapper) this.config.enumMapper = { ...globalEnumMapper, ...this.config.enumMapper };
    }
    render() {
        const { list, name, selectAllBtn, clearAllBtn, enumMapper } = this.config;

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
                            <label for=${key} class="cfb-cursor-pointer">${label ?? enumMapper ? enumMapper[key] : key}</label>
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
