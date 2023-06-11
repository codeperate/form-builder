import { CdpFormBuilder } from '../../config';

export type DateWidgetConfig = {
    default?: string;
    empty?: string;
};

CdpFormBuilder.setDefaultConfig(c => c.widgets.DateWidget, {
    empty: 'N/A',
});
