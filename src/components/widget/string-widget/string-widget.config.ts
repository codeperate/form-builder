import { CdpFormBuilder } from '../../config';

export type StringWidgetConfig = {
    default?: string;
    id?: string;
    maxLength?: number;
    minLength?: number;
    pattern?: string | RegExp;
    empty?: string;
    enum?: string[] | (() => string[]);
    enumMapperKey?: string;
    enumMapping?: boolean;
    enumMapper?: { [key: string]: string } | Record<string, string>;
    selectText?: string;
    type?: string;
};

CdpFormBuilder.setDefaultConfig(c => c.widgets.StringWidget, {
    empty: 'N/A',
    selectText: 'Please Select',
    type: 'text',
    enumMapperKey: 'default',
    id: undefined,
    enumMapping: true,
});
