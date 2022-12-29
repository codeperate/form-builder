import { CdpFormBuilder } from '../../config';
import { byteSize } from '../../utils/byte-size.utils.js';
import { CdpFileWidget } from './file-widget.js';

export type FileWidgetConfig = {
    fileSizeBytesLimit?: number;
    fileSizeBytesLimitText?: (limit: number) => string;
    fileNumberLimit?: number;
    fileSizeBytesLimitErr?: string;
    fileNumberLimitText?: (limit: number) => string;
    empty?: string;
    uploadText?: string;
    uploadButton?: false | string;
    uploadFn?: (this: CdpFileWidget, file: File, progress: (percentage: number) => void) => Promise<any>;
};

CdpFormBuilder.setConfig(c => c.FileWidget, {
    empty: 'N/A',
    fileSizeBytesLimit: 5242880,
    fileNumberLimit: 5,
    uploadText: 'Drag or click to upload',
    uploadButton: 'Upload',
    fileSizeBytesLimitText: limit => `Maximum upload size per file is ${byteSize(limit)}.`,
    fileSizeBytesLimitErr: 'Upload Failed - Size Exceeded',
    fileNumberLimitText: limit => `Maximum file upload limit is ${limit}.`,
    uploadFn: async (file, progress) => {
        let promises = [];
        promises.push(
            new Promise(res =>
                setTimeout(() => {
                    progress(20);
                    res(true);
                }, 2000),
            ),
        );
        promises.push(
            new Promise(res =>
                setTimeout(() => {
                    progress(25);
                    res(true);
                }, 3000),
            ),
        );
        promises.push(
            new Promise(res =>
                setTimeout(() => {
                    progress(50);
                    res(true);
                }, 4000),
            ),
        );
        promises.push(
            new Promise(res =>
                setTimeout(() => {
                    progress(100);
                    res(true);
                }, 5000),
            ),
        );

        await Promise.all(promises);
    },
});
