import { html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { FormWidgetMixin, ValidatedMeta } from '../../base-class/cdp-widget.js';
import { NonShadow } from '../../base-class/non-shadow.js';
import { CmptType } from '../../config.js';
import './file-widget.config.js';
@customElement('cdp-file-widget')
export class CdpFileWidget extends FormWidgetMixin(CmptType.FileWidget, NonShadow) {
    @query('input') inputEl: HTMLInputElement;
    @state() dragging: boolean = false;
    fileReader: FileReader;
    imageMap: WeakMap<File, string> = new WeakMap();
    value: File[];
    connectedCallback() {
        super.connectedCallback();
        this.fileReader = new FileReader();
    }
    validator(): ValidatedMeta {
        let result = super.validator();
        return result;
    }
    async dropHandler(e: DragEvent) {
        e.preventDefault();
        const files = e.dataTransfer.files;
        const fileArr = await this.processFile(files);
        this.form.setValue(this.path, [...(this.value ?? []), ...fileArr]);
        this.dragging = false;
    }
    async processFile(files: FileList) {
        let fileInfo: File[] = [];
        let url: string;
        for (let i = 0; i < files.length; i++) {
            if (files[i].type.startsWith('image')) {
                this.fileReader.readAsDataURL(files[i]);
                url = await new Promise(res => {
                    this.fileReader.addEventListener('load', e => res(e.target.result as string), { once: true });
                });
            }
            fileInfo.push(files[i]);
            if (url) this.imageMap.set(files[i], url);
        }
        return fileInfo;
    }
    async changeHandler(e) {
        const fileArr = await this.processFile(e.target.files);
        this.form.setValue(this.path, fileArr);
        this.validate();
    }
    render() {
        const { uploadText } = this.config;
        const files = Array.from(this.value ?? []);
        return html` <input @change=${e => this.changeHandler(e)} class="cfb-hidden" type="file" .multiple=${true} />
            <div
                @drop=${e => this.dropHandler(e)}
                @click=${e => this.inputEl.click()}
                @dragover=${e => {
                    e.preventDefault();
                    this.dragging = true;
                }}
                @dragenter=${e => {
                    e.preventDefault();
                    //console.log(e);
                    this.dragging = true;
                }}
                @dragleave=${e => {
                    e.preventDefault();
                    this.dragging = false;
                }}
                @dragend=${e => {
                    e.preventDefault();
                    console.log(e);
                    this.dragging = false;
                }}
            >
                ${files.length > 0
                    ? html`${files.map(
                          f => html` <div class="flex h-full w-16 items-center justify-center">
                                  ${this.imageMap.get(f)
                                      ? html`<img src=${this.imageMap.get(f)} />`
                                      : html`<i class="fa-duotone fa-file text-[30px] text-cmain-500"></i>`}
                              </div>
                              <div class="flex w-full flex-col gap-1 rounded-lg p-2 text-xs">
                                  <div class="w-full text-xs">${f.name}</div>
                                  <div>${byteSize(f.size)}</div>
                                  <span class="col-span-full text-xs text-cdanger-700">${errorMsg}</span>
                                  <div class="flex justify-end">
                                      ${deleteBtn(e => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          const index = this.value.findIndex(v => v == data);
                                          this.value.splice(index, 1);
                                          this.requestUpdate();
                                      })(data)}
                                  </div>
                              </div>`,
                      )}`
                    : html`<div
                          class="cfb-min-h-[18rem] cfb-rounded-lg cfb-ring-2 cfb-ring-main-400 cfb-justify-center cfb-grid cfb-items-center hover:cfb-bg-main-100 cfb-cursor-pointer ${this
                              .dragging
                              ? 'cfb-bg-main-100'
                              : ''}"
                      >
                          <div class="cfb-grid cfb-font-bold cfb-text-main-500 cfb-text-lg cfb-text-center cfb-gap-4">
                              <i class="fa-thin fa-folder-arrow-up cfb-text-[5rem]"></i>
                              <div>${uploadText}</div>
                          </div>
                      </div>`}
            </div>`;
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'cdp-file-widget': CdpFileWidget;
    }
}
