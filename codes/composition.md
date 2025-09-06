# Composition

**when to use composition instead of inheritance.**

---

## 🔑 Rule of Thumb

* **Use inheritance** when there is a clear **"is-a" relationship**.
  Example: `Car is a Vehicle`, `Bike is a Vehicle`.

* **Use composition** when there is a **"has-a" relationship**.
  Example: `Car has an Engine`, `Computer has a CPU`.

---

## ✅ When Composition is Better

1. **Avoiding Tight Coupling**

   * Inheritance tightly couples child to parent.
   * If the parent changes, all children are affected.
   * Composition lets you swap parts easily.

   Example: A `Car` **has** an `Engine`. You can replace a `PetrolEngine` with an `ElectricEngine` without rewriting `Car`.

---

2. **Multiple Behaviors without Multiple Inheritance**

   * Many languages (like Java, Go, TS) don’t support multiple inheritance.
   * Composition lets you **mix and match behaviors**.

   Example: Instead of `FlyingCar extends Car, extends Airplane`, you do:

   ```ts
   class FlyingCar {
     private car: Car;
     private plane: Plane;
   }
   ```

---

3. **Greater Flexibility & Reusability**

   * Composition allows you to **reuse small components** across many classes.
   * Inheritance usually locks you into one hierarchy.

   Example: `Logger` or `DatabaseConnection` can be composed into any class.

---

4. **Encapsulation of Details**

   * With composition, the inner object’s details are hidden.
   * You expose only what the outer class decides.

   Example: `Car` may use `GPS` internally but doesn’t expose the entire `GPS` API.

---

5. **Follows “Favor Composition Over Inheritance” Principle**

   * From the **Gang of Four (GoF) Design Patterns** book.
   * Promotes flexible, maintainable designs.

---

## 🔄 Quick Example

### Inheritance (tight coupling):

```ts
class Engine {
  start() { console.log("Engine starts"); }
}

class Car extends Engine {  // ❌ Bad: Car is NOT an Engine
  drive() { 
    this.start();
    console.log("Car drives"); 
  }
}
```

### Composition (better):

```ts
class Engine {
  start() { console.log("Engine starts"); }
}

class Car {                 // ✅ Good: Car has an Engine
  private engine: Engine;

  constructor(engine: Engine) {
    this.engine = engine;
  }

  drive() {
    this.engine.start();
    console.log("Car drives");
  }
}

const petrolCar = new Car(new Engine());
petrolCar.drive();
```

---

**when do I put behavior in an abstract parent vs. when do I use composition?**

---

## 🚗 Case 1: Abstract Method (Inheritance)

```ts
abstract class Vehicle {
  abstract startEngine(): void;
}

class Truck extends Vehicle {
  startEngine(): void {
    console.log("Truck engine roars!");
  }
}
```

👉 Use this when:

* All subclasses are **conceptually vehicles with engines**, but they each **start differently**.
* You want to force derived classes to **implement the behavior**.
* Example: `Car`, `Bike`, `Truck` are all vehicles, but maybe a **Bike engine** starts differently (kickstart vs electric start).

🔑 Key: You’re modeling **different types of the same thing**.

---

## ⚙️ Case 2: Composition (Engine Class)

```ts
class Engine {
  start(): void {
    console.log("Generic engine starts");
  }
}

class Car {
  private engine: Engine;

  constructor(engine: Engine) {
    this.engine = engine;
  }

  drive() {
    this.engine.start();
    console.log("Car drives...");
  }
}
```

👉 Use this when:

* An **engine is a separate concept** that may have **multiple implementations** (`PetrolEngine`, `DieselEngine`, `ElectricEngine`).
* You want the ability to **swap engines** without touching `Car`.
* Behavior is not intrinsic to “being a vehicle” but rather a **part a vehicle has**.

🔑 Key: You’re modeling **has-a relationships and interchangeable parts**.

---

## 🔄 So, When to Use Which?

| **Abstract Method (Inheritance)**                           | **Composition (Engine Class)**                          |
| ----------------------------------------------------------- | ------------------------------------------------------- |
| All vehicles *must* implement the behavior.                 | Vehicles can be built from interchangeable parts.       |
| Behavior is intrinsic to being a vehicle.                   | Behavior comes from a component (engine).               |
| You want to enforce a common interface.                     | You want flexibility and loose coupling.                |
| Example: `Vehicle.startEngine()` (every vehicle needs one). | Example: `Car` with `PetrolEngine` or `ElectricEngine`. |

---

## ⚡ Combined Example (Best of Both)

You can **combine both** when appropriate:

```ts
abstract class Vehicle {
  protected engine: Engine; // composition inside parent

  constructor(engine: Engine) {
    this.engine = engine;
  }

  // All vehicles must have startEngine (abstract)
  abstract startEngine(): void;
}

class Car extends Vehicle {
  startEngine(): void {
    this.engine.start(); // delegate to composition
    console.log("Car ready to go!");
  }
}

interface Engine {
  start(): void;
}

class PetrolEngine implements Engine {
  start() { console.log("Petrol engine starts..."); }
}

class ElectricEngine implements Engine {
  start() { console.log("Electric engine hums..."); }
}

const tesla = new Car(new ElectricEngine());
tesla.startEngine();

const ford = new Car(new PetrolEngine());
ford.startEngine();
```

👉 Here we get **abstraction** (`Vehicle` enforces contract)

* **composition** (`Car` delegates work to `Engine`).

This is a **Strategy pattern**: you can swap behaviors (engines) at runtime.

---

✅ **Final Answer**:

* Use **abstract methods** when the behavior is *essential* to all subclasses and you want to enforce implementation.
* Use **composition** when the behavior is *optional, interchangeable, or external* to the core identity of the class.
* Use **both** if you need an abstract contract **and** flexible interchangeable parts (best practice in large systems).

---