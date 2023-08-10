import { CdpFormBuilder } from '../../config';

export interface ListWidgetConfig {
    list: { key: string; label?: string }[];
    default?: 'all' | string[];
    name: string;
    selectAllBtn?: string | false;
    clearAllBtn?: string | false;
}

CdpFormBuilder.setDefaultConfig(c => c.widgets.ListWidget, {
    selectAllBtn: 'Select All',
    clearAllBtn: 'Clear All',
});
