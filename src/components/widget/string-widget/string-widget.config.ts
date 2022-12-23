import { CdpFormBuilder } from '../../config';

export type StringWidgetConfig = {
    default?: string;
    maxLength?: number;
    minLength?: number;
    pattern?: string | RegExp;
    empty?: string;
    enum?: string[];
    selectText?: string;
    type?: string;
};

CdpFormBuilder.setConfig(c => c.StringWidget, {
    empty: 'N/A',
    selectText: 'Please Select',
    type: 'text',
});
