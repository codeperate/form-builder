import { CdpFormBuilder, CmptType } from './config';

export interface FormBuilderConfig {}
CdpFormBuilder.setConfig(c => c.cmpts[CmptType.FormBuilder], null);
