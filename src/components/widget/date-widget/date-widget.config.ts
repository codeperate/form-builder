import { CdpFormBuilder } from '../../config';

export type DateWidgetConfig = {
    default?: string;
    empty?: string;
};

CdpFormBuilder.setConfig(c => c.cmpts.DateWidget, {
    empty: 'N/A',
});
