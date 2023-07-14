import { CdpFormBuilder } from '../../config';

export type NumberWidgetConfig = {
    default?: number | string;
    empty?: string;
    multipleOf?: number;
    minimum?: number;
    maximum?: number;
    id?: string;
};

CdpFormBuilder.setDefaultConfig(c => c.widgets.NumberWidget, {
    empty: 'N/A',
    multipleOf: 0.01,
});
