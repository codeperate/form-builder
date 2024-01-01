import { html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { BooleanWidget, FormSchema, IFormWidget, ObjectWidget, StringWidget } from '../../components';
import { NonShadow } from '../../components/base-class/non-shadow';

@customElement('page-listen-to')
export class PageListenTo extends NonShadow {
    schema: FormSchema = {
        widget: ObjectWidget,
        properties: {
            isOK: {
                widget: BooleanWidget,
            },
            name: {
                listenTo: ['isOK'],
                hidden: function (this: IFormWidget) {
                    console.log(this.form.getValue('isOK'));
                    return !this.form.getValue('isOK');
                },
                widget: StringWidget,
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
        'page-listen-to': PageListenTo;
    }
}
