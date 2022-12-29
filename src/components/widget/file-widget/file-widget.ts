import { html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { FormWidgetMixin, ValidatedMeta } from '../../base-class/cdp-widget.js';
import { NonShadow } from '../../base-class/non-shadow.js';
import { CmptType } from '../../config.js';
import { byteSize } from '../../utils/byte-size.utils.js';
import './file-widget.config.js';
interface FileState {
    image?: string;
    progress?: number;
    error?: string;
}
@customElement('cdp-file-widget')
export class CdpFileWidget extends FormWidgetMixin(CmptType.FileWidget, NonShadow) {
    @query('input') inputEl: HTMLInputElement;
    @state() dragging: boolean = false;
    @state() uploading: boolean = false;
    fileReader: FileReader;
    fileState: WeakMap<File, FileState> = new WeakMap();
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
        const { fileSizeBytesLimit, fileSizeBytesLimitErr } = this.config;
        for (let i = 0; i < files.length; i++) {
            if (files[i].type.startsWith('image')) {
                this.fileReader.readAsDataURL(files[i]);
                url = await new Promise(res => {
                    this.fileReader.addEventListener('load', e => res(e.target.result as string), { once: true });
                });
            }
            fileInfo.push(files[i]);
            let fileState: FileState = {
                progress: 0,
            };
            if (files[i].size > fileSizeBytesLimit) fileState.error = fileSizeBytesLimitErr;
            if (url) fileState.image = url;
            this.fileState.set(files[i], fileState);
        }
        return fileInfo;
    }
    async upload() {
        const { uploadFn } = this.config;
        this.uploading = true;
        for (const file of this.value) {
            const state = this.fileState.get(file);
            if (state.error) continue;
            await uploadFn(file, percentage => {
                state.progress = percentage;
                this.requestUpdate();
            });
        }
        this.uploading = false;
    }
    async changeHandler(e) {
        const fileArr = await this.processFile(e.target.files);
        if (fileArr.length > 0) this.form.setValue(this.path, fileArr);
        this.validate();
    }
    async deleteHandler(data) {
        const index = this.value.findIndex(v => v == data);
        this.value.splice(index, 1);
        this.inputEl.value = '';
        this.requestUpdate();
    }
    render() {
        const {
            uploadText,
            fileNumberLimitText,
            fileSizeBytesLimitText,
            fileNumberLimit,
            fileSizeBytesLimit,
            fileSizeBytesLimitErr,
            uploadButton,
        } = this.config;
        const files = Array.from(this.value ?? []);

        return html` <input @change=${e => this.changeHandler(e)} class="cfb-hidden" type="file" .multiple=${true} />
            <div
                class=""
                @drop=${e => this.dropHandler(e)}
                @click=${() => {
                    if (!this.uploading) this.inputEl.click();
                }}
                @dragover=${e => {
                    e.preventDefault();
                    this.dragging = true;
                }}
                @dragenter=${e => {
                    e.preventDefault();
                    this.dragging = true;
                }}
                @dragleave=${e => {
                    e.preventDefault();
                    this.dragging = false;
                }}
                @dragend=${e => {
                    e.preventDefault();
                    this.dragging = false;
                }}
            >
                <div
                    class="cfb-min-h-[18rem] cfb-flex cfb-rounded-lg cfb-ring-2 cfb-ring-main-400 ${this.dragging ? 'cfb-bg-main-100' : ''}"
                >
                    ${files.length > 0
                        ? html`<div
                              class="cfb-p-4 cfb-w-full cfb-grid cfb-grid-cols-1 tab:cfb-grid-cols-[repeat(auto-fill,20rem)] cfb-gap-4 cfb-place-self-start"
                          >
                              ${files.map(f => {
                                  const state = this.fileState.get(f);
                                  return html` <div class="cfb-flex cfb-gap-4 cfb-rounded-lg cfb-p-1 cfb-w-full cfb-cursor-pointer">
                                      ${state.image
                                          ? html`<img
                                                class="cfb-w-20 cfb-rounded-lg cfb-aspect-square cfb-object-cover cfb-self-start"
                                                src=${state.image}
                                            />`
                                          : html`<div
                                                class="cfb-w-20 cfb-rounded-lg cfb-aspect-square cfb-self-start cfb-bg-gray-100 cfb-flex cfb-justify-center cfb-items-center"
                                            >
                                                <i class="fa-duotone fa-file cfb-text-[3rem] cfb-text-main-500"></i>
                                            </div>`}
                                      <div class="cfb-text-xs cfb-flex-shrink cfb-min-w-0 cfb-flex-col cfb-flex cfb-flex-grow">
                                          <div class="cfb-text-sm cfb-break-words cfb-flex-grow cfb-mb-2">${f.name}</div>
                                          ${state.error
                                              ? html`<div class="cfb-text-danger-600">${state.error}</div> `
                                              : html`<div class="cfb-self-end">${byteSize(f.size)}</div>
                                                    <div class="cfb-bg-gray-200 cfb-rounded-lg cfb-h-[4px] cfb-relative">
                                                        <div
                                                            class="cfb-bg-main-500 cfb-absolute cfb-h-full"
                                                            style="width:${state.progress + '%'}"
                                                        ></div>
                                                    </div>`}
                                      </div>
                                      <div class="">
                                          <button
                                              .disabled=${this.uploading}
                                              class="cfb-text-danger-600 hover:cfb-bg-gray-100 cfb-rounded-lg cfb-w-5 cfb-aspect-square disabled:cfb-text-gray-700"
                                              @click=${(e: Event) => {
                                                  e.stopPropagation();
                                                  this.deleteHandler(f);
                                              }}
                                          >
                                              <i class="fa-solid fa-ban"></i>
                                          </button>
                                      </div>
                                  </div>`;
                              })}
                          </div>`
                        : html`
                              <div
                                  class="cfb-w-full cfb-justify-center cfb-grid cfb-items-center hover:cfb-bg-main-100 cfb-cursor-pointer cfb-rounded-lg"
                              >
                                  <div class="cfb-grid cfb-font-bold cfb-text-main-500 cfb-text-lg cfb-text-center cfb-gap-4">
                                      <i class="fa-thin fa-folder-arrow-up cfb-text-[5rem]"></i>
                                      <div>${uploadText}</div>
                                  </div>
                              </div>
                          `}
                </div>
            </div>
            <div class="cfb-flex cfb-justify-between cfb-mt-3">
                <div class="cfb-text-sm cfb-text cfb-text-main-600 cfb-grid">
                    <div>${fileSizeBytesLimitText(fileSizeBytesLimit)}</div>
                    <div>${fileNumberLimitText(fileNumberLimit)}</div>
                </div>
                <div class="">
                    ${uploadButton
                        ? html`<button
                              @click=${() => this.upload()}
                              .disabled=${!this.value || this.value.length == 0 || this.uploading}
                              class="disabled:cfb-bg-gray-600 cfb-bg-main-500 cfb-rounded-lg cfb-p-2 cfb-text-white"
                          >
                              ${uploadButton}${this.uploading
                                  ? html`<i class="fa-duotone fa-spinner-third cfb-animate-spin cfb-ml-2"></i>`
                                  : ''}
                          </button>`
                        : ''}
                </div>
            </div>`;
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'cdp-file-widget': CdpFileWidget;
    }
}
