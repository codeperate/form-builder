import { html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { DataListWidget, FormSchema, ObjectWidget } from '../../components';
import { NonShadow } from '../../components/base-class/non-shadow';

@customElement('page-data-list')
export class PageDataList extends NonShadow {
    schema: FormSchema = {
        widget: ObjectWidget,
        properties: {
            list: {
                widget: DataListWidget,
                label: 'data-list',
                config: {
                    listId: 'test',
                    listItems: ['test1', 'test2'],
                },
            },
        },
    };
    render() {
        return html` <cdp-form-builder .schema=${this.schema}></cdp-form-builder>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'page-data-list': PageDataList;
    }
}
