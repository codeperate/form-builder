import { CdpFormBuilder } from '../../config';

export type FileWidgetConfig = {
    fileSizeBytesLimit?: number;
    fileNumberLimit?: number;
    empty?: string;
    uploadText?: string;
};

CdpFormBuilder.setConfig(c => c.FileWidget, {
    empty: 'N/A',
    fileSizeBytesLimit: 5242880,
    fileNumberLimit: 5,
    uploadText: 'Drag or click to upload',
});
