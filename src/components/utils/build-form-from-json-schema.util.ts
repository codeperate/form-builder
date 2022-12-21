import { IWidget } from '../form-builder';
import { CustomJSONSchema } from '../type/custom-json-schema';
import { ArrayWidget } from '../widget/array-widget/array-widget';
import { DateWidget } from '../widget/date-widget/date-widget';
import { DateTimeWidget } from '../widget/datetime-widget/datetime-widget';
import { NumberWidget } from '../widget/number-widget/number-widget';
import { ObjectWidget } from '../widget/object-widget/object-widget';
import { StringWidget } from '../widget/string-widget/string-widget';
type ExtractT<A> = A extends any[] ? A[number] : A;
export type ConfigByJSONSchema<
    T extends FormSchemaFromJSONSchema<T, J, M>,
    J extends CustomJSONSchema<J>,
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
> {
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
};
export function buildFormFromJSONSchema<
    T extends FormSchemaFromJSONSchema<T, J, M>,
    J extends CustomJSONSchema<J>,
    M extends JSONSchemaTypeMapper = typeof defaultTypeMapper,
    K extends string = any,
>(formSchema: T, jsonSchema: J, mapper: M = defaultTypeMapper as any) {
    //return s as FormSchema<T>;
}

buildFormFromJSONSchema(
    {
        properties: {
            name: {
                config: {},
            },
        },
        config: {},
    },
    {
        type: 'string',
        format: 'date',
        properties: {
            name: {
                type: 'string',
                format: 'date',
            },
        },
    },
);
