import { get } from '@codeperate/utils';
import { FormSchema, IWidget } from '../form-builder.interface.js';
import { CustomJSONSchema } from '../type/custom-json-schema';
import { ArrayWidget, BooleanWidget, DateTimeWidget, DateWidget, NumberWidget, ObjectWidget, StringWidget } from '../widgets';
type ExtractT<A> = A extends any[] ? A[number] : A;
export type ConfigByJSONSchema<
    T extends FormSchemaFromJSONSchema<T, J, M>,
    J extends CustomJSONSchema<J, M>,
    M extends JSONSchemaTypeMapper,
> = 'widget' extends keyof T
    ? T['widget']['config']
    : 'type' extends keyof J
    ? 'format' extends keyof J
        ? M[ExtractT<J['type']>][J['format']]['config']
        : M[ExtractT<J['type']>]['default']['config']
    : any;

export interface FormSchemaFromJSONSchema<
    T extends { properties?; widget?; items? },
    J extends CustomJSONSchema<J>,
    M extends JSONSchemaTypeMapper,
> extends FormSchema<T> {
    widget?: IWidget;
    config?: ConfigByJSONSchema<T, J, M>;
    items?: FormSchemaFromJSONSchema<T['items'], J['items'], M>;
    properties?: { [Key in keyof T['properties']]: FormSchemaFromJSONSchema<T['properties'][Key], J['properties'][Key], M> };
}
export interface WidgetByFormat {
    default?: IWidget;
    [key: string]: IWidget;
}
export interface JSONSchemaTypeMapper {
    string?: WidgetByFormat;
    number?: WidgetByFormat;
    integer?: WidgetByFormat;
    boolean?: WidgetByFormat;
    object?: WidgetByFormat;
    array?: WidgetByFormat;
    [key: string]: WidgetByFormat;
}

export const defaultTypeMapper = {
    string: { 'default': StringWidget, 'date': DateWidget, 'date-time': DateTimeWidget },
    number: {
        default: NumberWidget,
    },
    object: {
        default: ObjectWidget,
    },
    array: {
        default: ArrayWidget,
    },
    boolean: {
        default: BooleanWidget,
    },
};
export function buildFormFromJSONSchema<
    T extends FormSchemaFromJSONSchema<T, J, M>,
    J extends CustomJSONSchema<J, M>,
    M extends JSONSchemaTypeMapper = typeof defaultTypeMapper,
>(
    formSchema: T,
    jsonSchema: J,
    option: {
        mapper?: M;
        refSchema?: any;
    } = {},
) {
    function iterateFormSchema<T extends { properties?; widget?; items? }>(
        f: FormSchema<T>,
        j: CustomJSONSchema,
        callback: (formSchema: FormSchema<any>, jsonSchema: CustomJSONSchema) => void,
    ) {
        callback(f, j);
        if (f.properties) {
            for (const key of Object.keys(f.properties)) {
                const property = f.properties[key];
                iterateFormSchema(property, j?.['properties']?.[key], callback);
            }
        }
        if (f.items) {
            iterateFormSchema(f.items, j?.['items'], callback);
        }
    }
    let mapper = option.mapper ?? defaultTypeMapper;
    iterateFormSchema(formSchema, jsonSchema, (f, j) => {
        if (!j) return;
        if (j.$ref) {
            let pathArr = j.$ref.split('/');
            pathArr.shift();
            const schema = get(option.refSchema, pathArr) ?? {};
            j = { ...schema, ...j };
        }

        let type = Array.isArray(j.type) ? j.type[0] : j.type;
        if (j['x-cdp-widget-type']) type = j['x-cdp-widget-type'] as any;
        let format = j.format ?? 'default';
        f.widget = mapper[type][format];
        f.widget.jsonSchemaConverter?.(f, j);
    });
    return formSchema;
}
