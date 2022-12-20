import { FormSchema } from '../form-builder';

export function buildForm<T extends FormSchema<T>>(s: T) {
    return s as FormSchema<T>;
}
