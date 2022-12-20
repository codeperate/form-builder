import { FormSchema, IWidget } from '../form-builder';
import { CustomJSONSchema } from '../type/json-schema';
import { ArrayWidget } from '../widget/array-widget/array-widget';
import { DateWidget } from '../widget/date-widget/date-widget';
import { DateTimeWidget } from '../widget/datetime-widget/datetime-widget';
import { NumberWidget } from '../widget/number-widget/number-widget';
import { ObjectWidget } from '../widget/object-widget/object-widget';
import { StringWidget } from '../widget/string-widget/string-widget';
export type WidgetByJSONSchema<J extends CustomJSONSchema, M extends JSONSchemaTypeMapper> = 'type' extends keyof J ? J['type'] : IWidget;
export interface FormSchemaFromJSONSchema<T extends FormSchema<T>, J extends CustomJSONSchema, M extends JSONSchemaTypeMapper>
    extends FormSchema<T> {
    widget?: IWidget;
    items?: FormSchema<T['items']>;
    properties?: { [Key in keyof T['properties']]: FormSchema<T['properties'][Key]> } & {
        [Key in symbol]: FormSchema<T['properties'][Key]>;
    };
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
};
export function buildFormFromJSONSchema<
    T extends FormSchema<T>,
    J extends CustomJSONSchema,
    M extends JSONSchemaTypeMapper = typeof defaultTypeMapper,
>(formSchema: T, jsonSchema: J, mapper: M = defaultTypeMapper as any) {
    //return s as FormSchema<T>;
}
