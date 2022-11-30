import { Store } from '@codeperate/simple-store';
import { get, set } from '@codeperate/utils';
import { customElement, property } from 'lit/decorators.js';
import { CmptMixin } from './base-class/cdp-component.js';
import { NonShadow } from './base-class/non-shadow.js';

import './cdp-json-form.config.js';
import { CmptType } from './cmpt-config.js';
@customElement('cdp-form-builder')
export class CdpFormBuilder extends CmptMixin(CmptType.FormBuilder, NonShadow) {
    @property({ type: Object }) schema: FormSchema;
    context: any;
    private widgetRecord: Record<string | number | symbol, any>;
    private widgetCount: number = 0;
    private store = new Store({ value: undefined });
    public regWidget(valPath: (string | number | symbol)[], widget: any) {
        if (!get(this.widgetRecord, valPath)) this.widgetCount++;
        set(this.widgetRecord, valPath, widget);
    }
    public unRegWidget(valPath: (string | number | symbol)[]) {
        let curPos = this.widgetRecord;
        for (const path of valPath) {
            const nextPos = curPos[path];
            if (nextPos) {
                if (Array.isArray(nextPos)) {
                    if (nextPos.length == 1) {
                        delete curPos[path];
                        break;
                    }
                } else {
                    if (Reflect.ownKeys(curPos).length == 1) {
                        delete curPos[path];
                        break;
                    }
                }
            }
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'cdp-form-builder': CdpFormBuilder;
    }
}

export interface FormSchema {
    items?: FormSchema;
    properties?: Record<string | number | symbol, FormSchema>;
    widget: any;
    jsonSchema?: any;
    validate?: any;
    view?: boolean;
    hidden?: boolean;
    required?: boolean;
}
