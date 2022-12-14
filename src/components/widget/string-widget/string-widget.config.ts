import { CdpFormBuilder } from '../../config';

export type StringWidgetConfig = {
    default?: string;
    maxLength?: number;
    minLength?: number;
    pattern?: string | RegExp;
    empty?: string;
    enum?: string[];
    enumMapper?: {[key:string]:string} | Record<string,string>;
    selectText?: string;
    type?: string;
};

CdpFormBuilder.setDefaultConfig(c => c.StringWidget, {
    empty: 'N/A',
    selectText: 'Please Select',
    type: 'text',
});
