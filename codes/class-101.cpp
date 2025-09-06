#include <iostream>
#include <string>

/* 
============================
    OOP CONCEPTS RECAP
============================

1. Encapsulation
   - Keep attributes private
   - Access/modify them via public getters/setters

2. Abstraction
   - Hide implementation details, expose essential features
   - Achieved via abstract classes / pure virtual functions

3. Inheritance
   - Reuse properties & behaviors of a base (parent) class
   - Derived (child) classes extend functionality

4. Polymorphism
   - Compile-time (function/constructor overloading)
   - Runtime (virtual functions / method overriding)

5. Constructors & Destructors
   - Special methods for object lifecycle

*/

//////////////////////////
// Base Class (Vehicle) //
//////////////////////////

class Vehicle {
  private: 
    // Encapsulation: hide sensitive data
    std::string brand;

  public:
    // Default constructor
    Vehicle() : brand("Unknown") {
      std::cout << "Vehicle default constructor called\n";
    }

    // Constructor overloading
    Vehicle(std::string b) : brand(b) {
      std::cout << "Vehicle parameterized constructor called\n";
    }

    // Virtual destructor (important for polymorphism with inheritance)
    virtual ~Vehicle() {
      std::cout << "Vehicle destructor called\n";
    }

    // Getter & Setter (Encapsulation)
    // Getter (read private attribute)
    std::string getBrand() const { return brand; }
    // Setter (modify private attribute)
    void setBrand(const std::string& b) { brand = b; }

    // Virtual method -> allows polymorphic behavior
    virtual void honk() const {
      std::cout << "Vehicle makes a sound.\n";
    }
};

/////////////////////////
// Derived Class: Car  //
/////////////////////////

class Car : public Vehicle {
  private:
    std::string model;

  public:
    // Constructor with both brand + model
    Car(std::string b, std::string m) : Vehicle(b), model(m) {}

    // Override method (runtime Polymorphism)
    void honk() const override {
      std::cout << "Tuut, tuut!\n";
    }

    std::string getModel() const { return model; }
};

//////////////////////////
// Derived Class: Bike  //
//////////////////////////

class Bike : public Vehicle {
  public:
    Bike(std::string b) : Vehicle(b) {}

    void honk() const override {
      std::cout << "Peep, peep!\n";
    }
};

//////////////////////////
// Abstract Example     //
//////////////////////////

// Abstract class: defines interface but not full implementation
class AbstractVehicle {
  public:
    virtual void startEngine() const = 0; // Pure virtual function
    virtual ~AbstractVehicle() {}
};

class Truck : public Vehicle, public AbstractVehicle {
  public:
    Truck(std::string b) : Vehicle(b) {}

    void honk() const override {
      std::cout << "Hoooonk!\n";
    }

    void startEngine() const override {
      std::cout << "Truck engine roars!\n";
    }
};

//////////////////////////
// Main Program         //
//////////////////////////

int main() {
  // Encapsulation + Constructor
  Vehicle vehicle("Generic");
  std::cout << "Vehicle Brand: " << vehicle.getBrand() << "\n";
  vehicle.honk();

  std::cout << "----------------\n";

  // Inheritance + Polymorphism
  Car car("Ford", "Mustang");
  std::cout << "Car: " << car.getBrand() << " " << car.getModel() << "\n";
  car.honk();

  std::cout << "----------------\n";

  Bike bike("Yamaha");
  std::cout << "Bike Brand: " << bike.getBrand() << "\n";
  bike.honk();

  std::cout << "----------------\n";

  Truck truck("Volvo");
  std::cout << "Truck Brand: " << truck.getBrand() << "\n";
  truck.honk();
  truck.startEngine();

  std::cout << "----------------\n";

  // Runtime Polymorphism with base pointer
  Vehicle* v1 = new Car("BMW", "M3");
  Vehicle* v2 = new Bike("Ducati");

  v1->honk();  // Car’s honk
  v2->honk();  // Bike’s honk

  delete v1;
  delete v2;

  return 0;
}
