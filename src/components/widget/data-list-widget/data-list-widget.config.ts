import { CdpFormBuilder } from '../../config';

export type DataListWidgetConfig = {
    default?: string;
    id?: string;
    maxLength?: number;
    minLength?: number;
    pattern?: string | RegExp;
    empty?: string;
    listId: string;
    listItems: (string | { value: string; text: string })[];
};

CdpFormBuilder.setDefaultConfig(c => c.widgets.StringWidget, {
    empty: 'N/A',
    selectText: 'Please Select',
    type: 'text',
    enumMapperKey: 'default',
    id: undefined,
});
