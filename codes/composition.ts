// When to use compositon instead of inheritence?
// Use inheritence when there is a clear "is-a" relationship
// Example: Car is a Vehicle, Bike is a Vehicle.
// Use composition when there is a "has-a" relationship
// Example: Car has an Engine, Computer has a CPU.

// When Composition is Better?
// 1. Avoid Tight Coupling
//    - Inheritance tightly couples child to parent
//    - If the parent changes, all children are affected
//    - Composition let us swap parts easily
// Example: A Car has an Engine. We can replace a PetrolEngine with an ElectricEngine without rewriting Car.
// 2. Multiple Behaviors without Multiple Inheritance
//    - Composition let us mix and match behaviors