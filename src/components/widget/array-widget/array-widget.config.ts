import { CdpFormBuilder } from '../../config';

export interface ArrayWidgetConfig {
    addable?: boolean;
    deletable?: boolean;
    movable?: boolean;
    minItems?: number;
    maxItems?: number;
    pagination?:
        | boolean
        | {
              limit: number;
          };
}

export type ArrayWidgetMode = 'delete' | 'move' | 'default';
CdpFormBuilder.setConfig(o => o.cmpts.ArrayWidget, {
    addable: true,
    deletable: true,
    movable: true,
    pagination: {
        limit: 10,
    },
});