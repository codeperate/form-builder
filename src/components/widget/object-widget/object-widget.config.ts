import { CdpFormBuilder } from '../../config';

export type ObjectWidgetConfig = {
    required?: {
        text: string;
    };
};
CdpFormBuilder.setConfig(o => o.cmpts.ObjectWidget, {
    required: {
        text: '*',
    },
});
