import { CdpFormBuilder } from '../../config';

export type PasswordWidgetConfig = {
    maxLength?: number;
    minLength?: number;
    pattern?: string | RegExp;
    empty?: string;
};

CdpFormBuilder.setDefaultConfig(c => c.PasswordWidget, {
    empty: '*************',
});