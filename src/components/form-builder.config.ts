import { CdpFormBuilder } from './config.js';

export interface FormBuilderOption {
    autoSave?: boolean;
}

CdpFormBuilder.setConfig(o => o.FormBuilder, {
    autoSave: true,
});
