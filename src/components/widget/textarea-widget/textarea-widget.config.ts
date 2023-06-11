import { CdpFormBuilder } from '../../config';

export type TextAreaWidgetConfig = {
    default?: string;
    maxLength?: number;
    minLength?: number;
    empty?: string;
    rows?: number;
    autoExpandHeight?: boolean;
    heightLimit?: number;
};

CdpFormBuilder.setDefaultConfig(c => c.widgets.TextAreaWidget, {
    empty: 'N/A',
    rows: 5,
    autoExpandHeight: true,
    heightLimit: 500,
});
