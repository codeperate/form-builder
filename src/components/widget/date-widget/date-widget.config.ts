import { CdpFormBuilder } from '../../config';

export type DateWidgetConfig = {
    default?: string;
    empty?: string;
};

CdpFormBuilder.setDefaultConfig(c => c.DateWidget, {
    empty: 'N/A',
});
