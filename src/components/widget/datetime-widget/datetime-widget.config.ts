import { TemplateResult } from 'lit';
import { CdpFormBuilder } from '../../config';

export type DateTimeWidgetConfig = {
    default?: string;
    empty?: string;
    view?: {
        template: (value: string) => TemplateResult | string;
    };
};

CdpFormBuilder.setDefaultConfig(c => c.DateTimeWidget, {
    empty: 'N/A',
    view: {
        template: s => (s ? new Date(s).toLocaleString() : undefined),
    },
});
