import { CdpFormBuilder } from '../../config';

export type StringWidgetConfig = {
    default?: string;
    maxLength?: number;
    minLength?: number;
    pattern?: string | RegExp;
    empty?: string;
};

CdpFormBuilder.setConfig(c => c.StringWidget, {
    empty: 'N/A',
});
