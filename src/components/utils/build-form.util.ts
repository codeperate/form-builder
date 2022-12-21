import { FormSchema } from '../form-builder.interface.js';

export function buildForm<T extends FormSchema<T>>(s: T) {
    return s as FormSchema<T>;
}
