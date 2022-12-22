import { JSONSchema7 } from 'json-schema';
import { JSONSchemaTypeMapper } from '../utils/build-form-from-json-schema.util';
//type ExtractT<A> = A extends any[] ? A[number] : A;
//type CustomFormat<J extends JSONSchema7, M extends JSONSchemaTypeMapper> = keyof M['string'];
type StringOnly<T> = T extends string ? T | string : never;

export interface CustomJSONSchema<T extends { items?; properties?; format?; type? } = any, M extends JSONSchemaTypeMapper = any>
    extends JSONSchema7 {
    items?: CustomJSONSchema<T['items'], M>;
    properties?: {
        [Key in keyof T['properties']]: CustomJSONSchema<T['properties'][Key], M>;
    };
    format?: StringOnly<keyof M[T['type']]>;
    ['x-cdp-widget-type']: string;
    [key: string]: any;
}
