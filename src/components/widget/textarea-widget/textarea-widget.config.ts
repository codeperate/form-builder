import { CdpFormBuilder } from '../../config';

export type TextAreaWidgetConfig = {
    default?: string;
    maxLength?: number;
    minLength?: number;
    empty?: string;
    rows?: number;
};

CdpFormBuilder.setConfig(c => c.TextAreaWidget, {
    empty: 'N/A',
    rows: 5,
});
