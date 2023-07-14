import { CdpFormBuilder } from '../../config';

export type PasswordWidgetConfig = {
    maxLength?: number;
    minLength?: number;
    pattern?: string | RegExp;
    empty?: string;
    id?: string;
};

CdpFormBuilder.setDefaultConfig(c => c.widgets.PasswordWidget, {
    empty: '*************',
});
