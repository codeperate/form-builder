import { JSONSchema7 } from 'json-schema';

export interface CustomJSONSchema extends JSONSchema7 {
    [key: string]: any;
}
