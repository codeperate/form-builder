import { TemplateResult } from 'lit';
import { CdpFormBuilder } from '../../config';

export type BooleanWidgetConfig = {
    default?: string;
    empty?: string;
    trueVal?: string | TemplateResult;
    falseVal?: string | TemplateResult;
};

CdpFormBuilder.setDefaultConfig(c => c.BooleanWidget, {
    empty: 'N/A',
    trueVal: 'Y',
    falseVal: 'N',
});
