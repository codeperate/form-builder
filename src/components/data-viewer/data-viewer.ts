import { customElement, property } from 'lit/decorators.js';
import { CmptMixin } from '../base-class/cdp-component.js';
import { NonShadow } from '../base-class/non-shadow.js';
import { CmptType } from '../config.js';
import type { DataMode } from './data-viewer.config.js';

@customElement('cdp-data-viewer-widget')
export class CdpDataViewer extends CmptMixin(CmptType.DataViewerWidget, NonShadow) {
    @property({ type: Array }) data: any[];
    @property() mode: DataMode = 'list';
    render() {}
}
declare global {
    interface HTMLElementTagNameMap {
        'cdp-data-viewer': CdpDataViewer;
    }
}
