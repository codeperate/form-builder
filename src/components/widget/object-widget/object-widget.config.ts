import { CdpFormBuilder } from '../../config';

export type ObjectWidgetConfig = {
    required?: {
        text: string;
    };
};
CdpFormBuilder.setDefaultConfig(o => o.ObjectWidget, {
    required: {
        text: '*',
    },
});
