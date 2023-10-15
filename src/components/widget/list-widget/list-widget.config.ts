import { CdpFormBuilder } from '../../config';

export interface ListWidgetConfig {
    list: { key: string; label?: string }[];
    default?: 'all' | string[];
    name: string;
    selectAllBtn?: string | false;
    clearAllBtn?: string | false;
    enumMapperKey?: string;
    enumMapper?: { [key: string]: string } | Record<string, string>;
}

CdpFormBuilder.setDefaultConfig(c => c.widgets.ListWidget, {
    selectAllBtn: 'Select All',
    clearAllBtn: 'Clear All',
    enumMapperKey: 'default',
});
