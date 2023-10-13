import { html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { NonShadow } from '../../components/base-class/non-shadow';
import { ArrayWidget, FormSchema, ObjectWidget, StringWidget } from '../../components';

@customElement('page-array')
export class PageArray extends NonShadow {
    schema: FormSchema = {
        widget: ObjectWidget,
        properties: {
            array: {
                widget: ArrayWidget,
                label: 'Array',
                config: {
                    minItems: 1,
                },
                items: {
                    label: 'name',
                    widget: StringWidget,
                },
            },
        },
    };
    render() {
        return html` <cdp-form-builder
            @formChange=${e => console.log(e.detail)}
            .schema=${this.schema}
            .value=${{ array: null }}
        ></cdp-form-builder>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'page-array': PageArray;
    }
}
