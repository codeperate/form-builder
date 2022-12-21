import { CdpFormBuilder } from '../../config';

export type ObjectWidgetConfig = {
    required?: {
        text: string;
    };
};
CdpFormBuilder.setConfig(o => o.ObjectWidget, {
    required: {
        text: '*',
    },
});
