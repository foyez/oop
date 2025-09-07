/*
============================
    OOP CONCEPTS RECAP
============================

1. Encapsulation
  - keep attributes private via private/protected fields
  - access/modify them via public getters/setters for controlled access
  - Real-life Example:
    - A bank account -> we can deposit/withdraw, but we cannot directly open the bank's database and change our balance
    - Access is controlled through an interface(ATM/banking app)

2. Abstraction
  - Hide implementation details, expose essential features
  - achieved via abstract classes / methods

3. Inheritance
  - reuse properties & behaviors of a base (parent) class
  - Derived (child) classes extend functionality

4. Polymorphism
  - Method overriding
  - Same interface, different implementations

5. Constructors & Destructors
  - Constructors exist
  - Destructors don't (GC handled by JS/TS runtime)

*/

//////////////////////////
// Base Class (Vehicle) //
//////////////////////////

class Vehicle {
  // Encapsulation: private attribute (hide sensitive data)
  private brand: string;

  constructor(brand: string = "Unknown") {
    this.brand = brand;
  }

  // Getter (read private attribute)
  public getBrand(): string {
    return this.brand;
  }

  // Setter (modify private attribute)
  public setBrand(b: string): void {
    this.brand = b;
  }

  // Polymorphic method (can be overridden in subclasses)
  public honk(): void {
    console.log("Vehicle makes a sound.");
  }
}

/////////////////////////
// Derived Class: Car  //
/////////////////////////

class Car extends Vehicle {
  private model: string;

  constructor(brand: string, model: string) {
    super(brand); // call base constructor
    this.model = model;
  }

  public getModel(): string {
    return this.model;
  }

  // Override method (runtime Polymorphism)
  public honk(): void {
    console.log("Tuut, tuut!");
  }
}

//////////////////////////
// Derived Class: Bike  //
//////////////////////////

class Bike extends Vehicle {
  constructor(brand: string) {
    super(brand);
  }

  public honk(): void {
    console.log("Peep, peep!");
  }
}

//////////////////////////
// Abstract Example     //
//////////////////////////

// Abstract class: defines class behavior
abstract class AbstractVehicle {
  // Abstract method (must be implemented by subclasses)
  public abstract startEngine(): void;
}

class Truck extends Vehicle implements AbstractVehicle {
  constructor(brand: string) {
    super(brand);
  }

  public honk(): void {
    console.log("Hoooonk!");
  }

  public startEngine(): void {
    console.log("Truck engine roars!");
  }
}

//////////////////////////
// Main Program         //
//////////////////////////

function main(): void {
  // Encapsulation + Constructor
  const vehicle = new Vehicle("Generic");
  console.log("Vehicle Brand:", vehicle.getBrand());
  vehicle.honk();

  console.log("----------------");

  // Inheritance + Polymorphism
  const car = new Car("Ford", "Mustang");
  console.log("Car:", car.getBrand(), car.getModel());
  car.honk();

  console.log("----------------");

  const bike = new Bike("Yamaha");
  console.log("Bike Brand:", bike.getBrand());
  bike.honk();

  console.log("----------------");

  const truck = new Truck("Volvo");
  console.log("Truck Brand:", truck.getBrand());
  truck.honk();
  truck.startEngine();

  console.log("----------------");

  // Runtime polymorphism
  const vehicles: Vehicle[] = [
    new Car("BMW", "M3"),
    new Bike("Ducati"),
    new Truck("Scania"),
  ];

  for (const v of vehicles) {
    v.honk(); // Each calls its own implementation
  }
}

main();
