import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { until } from 'lit/directives/until.js';
import { FormWidgetMixin } from '../../base-class/cdp-widget.js';
import { NonShadow } from '../../base-class/non-shadow.js';
import { CmptType } from '../../config.js';
import { columnClass } from '../../utils/columns.utils.js';
import './array-widget.config.js';
import type { ArrayWidgetMode } from './array-widget.config.js';
@customElement('cdp-array-widget')
export class CdpArrayWidget extends FormWidgetMixin(CmptType.ArrayWidget, NonShadow) {
    @state() mode: ArrayWidgetMode = 'default';
    @state() currentIndex: number;

    willUpdate(c) {
        super.willUpdate(c);
        if (this.view) this.mode = 'default';
    }
    add() {
        if (this.value == undefined) this.setValue([]);
        this.form.setValue([...this.path, this.value.length], undefined);
        this.validate();
        //this.requestUpdate();
    }
    delete(i) {
        this.value.splice(i, 1);
        this.validate();
        this.form.getWidgets(this.path).forEach(w => w.updateValue());
    }
    move(i) {
        function moveItem(array: any[], fromIndex: number, toIndex: number) {
            if (fromIndex < 0 || fromIndex >= array.length || toIndex < 0 || toIndex >= array.length) {
                return;
            }
            const item = array[fromIndex];
            array.splice(fromIndex, 1);
            array.splice(toIndex, 0, item);
        }
        moveItem(this.value, this.currentIndex, i);
        this.form.getWidgets(this.path).forEach(w => w.updateValue());
        this.currentIndex = null;
    }
    validator() {
        let result = super.validator();
        let { required } = this.schema;
        required = typeof required == 'function' ? required.bind(this)() : required;
        const { minItems, maxItems } = this.config;
        if (required && this.value == null) result.validity = false;
        if (minItems > 0 && this.value == null) result.validity = false;
        if (Array.isArray(this.value) && this.value.length < minItems) result.validity = false;
        if (Array.isArray(this.value) && this.value.length > maxItems) result.validity = false;
        return result;
    }
    changeMode(mode: ArrayWidgetMode) {
        if (this.mode == mode) this.mode = 'default';
        else this.mode = mode;
        if (this.mode != 'move') this.currentIndex = null;
    }
    render() {
        const { movable, addable, deletable } = this.config;
        const { items } = this.schema;
        return html`
            <div class="${this.view ? '' : 'cfb-bg-gray-50'} cfb-rounded-lg cfb-p-2">
                <div class="cfb-grid cfb-grid-flow-col cfb-justify-end cfb-p-1 cfb-mb-2 cfb-gap-2 cfb-col-span-full" .hidden=${this.view}>
                    ${
                        movable
                            ? html`<button
                                  type="button"
                                  class="cfb-rounded-lg cfb-aspect-square cfb-w-9 ${this.mode == 'move'
                                      ? 'cfb-bg-main-600 cfb-text-white hover:cfb-bg-main-700'
                                      : 'cfb-text-main-600 cfb-bg-gray-100 hover:cfb-bg-main-200 '}"
                                  @click=${() => this.changeMode('move')}
                              >
                                  <i class="fa-regular fa-arrows-up-down-left-right"></i>
                              </button>`
                            : ''
                    }
                    ${
                        deletable
                            ? html`
                                  <button
                                      type="button"
                                      class="cfb-rounded-lg cfb-aspect-square cfb-w-9 ${this.mode == 'delete'
                                          ? 'cfb-bg-main-600 cfb-text-white hover:cfb-bg-main-700'
                                          : 'cfb-text-main-600 cfb-bg-gray-100 hover:cfb-bg-gray-200 '}"
                                      @click=${() => this.changeMode('delete')}
                                  >
                                      <i class="fa-duotone fa-trash"></i>
                                  </button>
                              `
                            : ''
                    }
                    ${
                        addable
                            ? html` <button
                                  type="button"
                                  @click=${() => this.add()}
                                  class=" hover:cfb-bg-gray-200 cfb-rounded-lg cfb-aspect-square cfb-w-9 cfb-bg-gray-100 cfb-text-main-600"
                              >
                                  <i class="fa-duotone fa-grid-2-plus"></i>
                              </button>`
                            : ''
                    }
                </div>
                <div class="${
                    this.view
                        ? 'cfb-flex children:cfb-bg-gray-100 cfb-gap-2 children:cfb-rounded-lg children:cfb-p-1 children:cfb-flex-wrap cfb-flex-wrap'
                        : 'cfb-grid cfb-grid-cols-6 des:cfb-grid-cols-12 cfb-gap-4 cfb-items-start'
                }">
                    ${(this.value ?? []).map((_, i) => {
                        const { template, columns } = items.widget;
                        if (!items.hidden)
                            return html`<div
                                class="${columnClass(
                                    columns,
                                )} cfb-grid cfb-gap-1 cfb-grid-cols-[1fr,min-content] cfb-items-start cfb-max-w-full"
                            >
                                ${until(template({ path: [...this.path, i], form: this.form }))}
                                ${this.mode === 'delete'
                                    ? html` <button
                                          type="button"
                                          class="hover:cfb-bg-gray-200 cfb-rounded-lg cfb-aspect-square cfb-w-6 cfb-bg-gray-100 cfb-text-main-600 cfb-mb-2"
                                          @click=${() => this.delete(i)}
                                      >
                                          <i class="fa-duotone fa-trash"></i>
                                      </button>`
                                    : null}
                                ${this.mode === 'move'
                                    ? this.currentIndex == null || this.currentIndex == i
                                        ? html`<button
                                              type="button"
                                              class="cfb-rounded-lg cfb-aspect-square cfb-w-6 cfb-cursor-move cfb-mb-2 ${this
                                                  .currentIndex == i
                                                  ? 'cfb-bg-main-600 cfb-text-white hover:cfb-bg-main-700'
                                                  : 'cfb-bg-gray-100 hover:cfb-bg-gray-200 cfb-text-main-600'}"
                                              @click=${() => (this.currentIndex = i)}
                                          >
                                              <i class="fa-duotone fa-right-left"></i>
                                          </button>`
                                        : html` <button
                                              type="button"
                                              class="cfb-mb-2 hover:cfb-bg-gray-200 cfb-rounded-lg cfb-aspect-square cfb-w-6 cfb-bg-gray-100 cfb-text-main-600"
                                              @click=${() => this.move(i)}
                                          >
                                              <i class="fa-duotone fa-arrow-left-to-line"></i>
                                          </button>`
                                    : ''}
                            </div> `;
                    })}
                    </div>
                </div>
            </div>
        `;
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'cdp-array-widget': CdpArrayWidget;
    }
}
