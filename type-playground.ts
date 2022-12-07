type Test<T = any> = {
    config?: T;
    [key: string]: any;
};
type dynamicType<T extends Test> = T['config'];

export type ArrayKeys = keyof any[];
export type Indices<T> = Exclude<keyof T, ArrayKeys>;
type ASD<T extends Test> = {
    nested?: ASD<T['nested']>;
    properties?: TupleToObject<UnionToTuple<keyof T['properties']>, T['properties']>;
    config;
    asd: dynamicType<T>;
};

type UnionToTuple<T> = (
    (T extends any ? (t: T) => T : never) extends infer U
        ? (U extends any ? (u: U) => any : never) extends (v: infer V) => any
            ? V
            : never
        : never
) extends (_: any) => infer W
    ? [...UnionToTuple<Exclude<T, W>>, W]
    : [];
type TupleToObject<Type extends readonly any[], R extends Record<any, any>> = {
    [Key in Type[number]]: R[Key];
};

let x: TupleToObject<UnionToTuple<keyof { a: number; b: string }>, { a: number; b: string }> = { a: 23454534, b: 'string' };

function test<T extends ASD<T>>(obj: T) {}

test({
    config: 90,
    asd: 89090,
    properties: {
        name: {
            config: '345',
            asd: 'asd',
        },
        fghgf: {
            config: 345,
            asd: 7878,
        },
    },
});

type MyType = {
    prop1: string;
    prop2: number;
    prop3: boolean;
};

type MyTypeKeysTuple<T> = {
    [K in keyof T]: K;
};
let a: MyTypeKeysTuple<MyType>;

// MyTypeKeysTuple is now a tuple type with elements "prop1", "prop2", and "prop3"
