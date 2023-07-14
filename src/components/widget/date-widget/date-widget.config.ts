import { CdpFormBuilder } from '../../config';

export type DateWidgetConfig = {
    default?: string;
    empty?: string;
    id?: string;
};

CdpFormBuilder.setDefaultConfig(c => c.widgets.DateWidget, {
    empty: 'N/A',
    id: undefined,
});
