import { LitElement } from 'lit';
import { Class } from '../type/class';
export class NonShadow extends LitElement {
    createRenderRoot() {
        return this;
    }
}
export function NonShadowMixin<T extends Class<LitElement>>(superClass: T) {
    class NonShadow extends superClass {
        createRenderRoot() {
            return this;
        }
    }
    return NonShadow as T;
}
