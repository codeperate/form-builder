import { CdpFormBuilder } from '../../config';

export type NumberWidgetConfig = {
    default?: number | string;
    empty?: string;
    multipleOf?: number;
    minimum?: number;
    maximum?: number;
};

CdpFormBuilder.setDefaultConfig(c => c.NumberWidget, {
    empty: 'N/A',
    multipleOf: 0.01,
});
