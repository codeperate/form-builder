import { get } from '@codeperate/utils';
import { FormSchema } from '../form-builder.interface.js';
import { CustomJSONSchema } from '../type/custom-json-schema';
import { defaultTypeMapper, JSONSchemaTypeMapper } from './build-form-from-json-schema.util.js';

export function GenerateFormFromJSONSchema<J extends CustomJSONSchema<J, M>, M extends JSONSchemaTypeMapper = typeof defaultTypeMapper>(
    jsonSchema: J,
    option: {
        mapper?: M;
        refSchema?: any;
    } = {},
) {
    function iterateFormSchema(j: CustomJSONSchema, callback: (jsonSchema: CustomJSONSchema) => FormSchema) {
        let result: FormSchema = {};
        Object.assign(result, callback(j));
        if (j.properties) {
            result.properties = {};
            for (const key of Object.keys(j.properties)) {
                result.properties[key] = iterateFormSchema(j['properties'][key], callback);
            }
        } else if (j.items) {
            result.items = iterateFormSchema(j.items, callback);
        }
        return result;
    }
    let mapper = option.mapper ?? defaultTypeMapper;
    let result = iterateFormSchema(jsonSchema, j => {
        let result: FormSchema = {};
        let js = j;
        if (js.$ref) {
            let pathArr = j.$ref.split('/');
            pathArr.shift();
            const schema = get(option.refSchema, pathArr) ?? {};
            js = { ...schema, ...j };
        }

        let type = Array.isArray(js.type) ? js.type[0] : js.type;
        if (js['x-cdp-widget-type']) type = js['x-cdp-widget-type'] as any;
        let format = js.format ?? 'default';
        if (!mapper[type]) throw new Error(`Type:${type} does not exist`);
        if (!mapper[type][format]) throw new Error(`Format:${format} does not exist`);
        result.widget = mapper[type][format];
        result.widget.jsonSchemaConverter?.(result, js);
        return result;
    });
    return result;
}
