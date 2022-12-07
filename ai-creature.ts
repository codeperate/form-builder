// applyMutation(['banana'], { a: 1,b:2,c:3,mutate:{banana:} });

// interface Mutable<T> {
//   mutate: { [key: string]: T };
// }
// Now I have a typescript interface like this. The key of the mutate property is the condition string, and the value is the mutation.

// I am going to write a function to calculate the mutation result of an object without modifying it. The function should be like below:

// function applyMutation<T extends Mutable<T>>(conditions:string[],obj:T){
// //TO DO
// }
function applyMutation(any, any2) {}

//input:
applyMutation(['banana', 'orange'], {
    a: 1,
    b: { something: 'asdsad', mutate: { banana: { something: 'dsadsa' } } },
    c: 3,
    mutate: { banana: { c: 4 }, orange: { c: 2, d: 5 } },
});

// //result:
let x = {
    a: 1,
    b: {
        something: 'dsadsa',
    },
    c: 2,
    d: 5,
};
