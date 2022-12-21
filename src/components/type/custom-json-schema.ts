import { JSONSchema7 } from 'json-schema';
import { JSONSchemaTypeMapper } from '../utils/build-form-from-json-schema.util';
type ExtractT<A> = A extends any[] ? A[number] : A;
type CustomFormat<J extends JSONSchema7, M extends JSONSchemaTypeMapper> =keyof M['string'];
export interface CustomJSONSchema<T extends { items?; properties?; format? } = any, M extends JSONSchemaTypeMapper = any>
    extends JSONSchema7 {
    items?: CustomJSONSchema<T['items'], M>;
    properties?: {
        [Key in keyof T['properties']]: CustomJSONSchema<T['properties'][Key], M>;
    };
    format?: keyof M
    [key: string]: any;
}
type X=keyof JSONSchemaTypeMapper

let x:X=