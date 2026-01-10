# 2.3 Inheritance

[← Back to Abstraction](02-abstraction.md) | [Next: Polymorphism →](04-polymorphism.md) | [↑ Back to README](../README.md)

---

## What is Inheritance? 👨‍👩‍👧‍👦

**Inheritance** is a mechanism where a new class (**child/derived/subclass**) acquires properties and methods from an existing class (**parent/base/superclass**).

### Core Concept

**Think of it like family traits:**
- Children inherit eye color, height genes from parents
- But children also have their own unique features
- Grandchildren inherit from both parents and grandparents

### Key Principle

**"IS-A relationship"** - Dog IS-A Animal, Car IS-A Vehicle

---

## Why Use Inheritance?

### 1. Code Reuse ♻️
Write common code once in parent class

```python
# Without inheritance - code duplication
class Dog:
    def __init__(self, name):
        self.name = name
    
    def eat(self):
        return f"{self.name} is eating"
    
    def sleep(self):
        return f"{self.name} is sleeping"
    
    def bark(self):
        return "Woof!"

class Cat:
    def __init__(self, name):
        self.name = name
    
    def eat(self):  # Duplicate
        return f"{self.name} is eating"
    
    def sleep(self):  # Duplicate
        return f"{self.name} is sleeping"
    
    def meow(self):
        return "Meow!"

# With inheritance - code reuse
class Animal:
    def __init__(self, name):
        self.name = name
    
    def eat(self):
        return f"{self.name} is eating"
    
    def sleep(self):
        return f"{self.name} is sleeping"

class Dog(Animal):  # Inherits eat() and sleep()
    def bark(self):
        return "Woof!"

class Cat(Animal):  # Inherits eat() and sleep()
    def meow(self):
        return "Meow!"
```

### 2. Hierarchical Classification 📊
Model real-world hierarchies

```python
# Vehicle hierarchy
class Vehicle:
    def start_engine(self):
        return "Engine started"

class LandVehicle(Vehicle):
    def drive(self):
        return "Driving on road"

class WaterVehicle(Vehicle):
    def sail(self):
        return "Sailing on water"

class Car(LandVehicle):
    pass

class Boat(WaterVehicle):
    pass
```

### 3. Polymorphism Support 🎨
Same interface, different implementations (covered in next section)

### 4. Extensibility 📈
Add new features without modifying existing code

---

## Real-World Analogy

### Animal Kingdom

```
                    Animal (Parent)
                    ├── name
                    ├── age
                    ├── eat()
                    └── sleep()
                    /              \
                   /                \
            Mammal                  Bird
          ├── fur_color         ├── can_fly
          └── give_birth()      └── lay_eggs()
          /        \                 /        \
         /          \               /          \
       Dog          Cat         Eagle        Penguin
    └── bark()    └── meow()  └── hunt()   └── swim()
```

**Inheritance chain:**
- Dog inherits from Mammal → inherits from Animal
- Dog has: name, age, eat(), sleep() (from Animal) + fur_color, give_birth() (from Mammal) + bark() (own)

---

## Basic Inheritance Syntax

### Python

```python
class Parent:
    def __init__(self, name):
        self.name = name
    
    def parent_method(self):
        return "Parent method"

class Child(Parent):  # Inherits from Parent
    def __init__(self, name, age):
        super().__init__(name)  # Call parent constructor
        self.age = age
    
    def child_method(self):
        return "Child method"

# Usage
child = Child("Alice", 10)
print(child.name)           # From Parent
print(child.age)            # From Child
print(child.parent_method()) # From Parent
print(child.child_method())  # From Child
```

### TypeScript

```typescript
class Parent {
    name: string;
    
    constructor(name: string) {
        this.name = name;
    }
    
    parentMethod(): string {
        return "Parent method";
    }
}

class Child extends Parent {
    age: number;
    
    constructor(name: string, age: number) {
        super(name);  // Call parent constructor
        this.age = age;
    }
    
    childMethod(): string {
        return "Child method";
    }
}

// Usage
const child = new Child("Alice", 10);
console.log(child.name);          // From Parent
console.log(child.age);           // From Child
console.log(child.parentMethod()); // From Parent
console.log(child.childMethod());  // From Child
```

### C++

```cpp
class Parent {
protected:
    std::string name;

public:
    Parent(std::string n) : name(n) {}
    
    std::string parentMethod() {
        return "Parent method";
    }
};

class Child : public Parent {
private:
    int age;

public:
    Child(std::string n, int a) : Parent(n), age(a) {}
    
    std::string childMethod() {
        return "Child method";
    }
};

// Usage
Child child("Alice", 10);
std::cout << child.parentMethod() << std::endl; // From Parent
std::cout << child.childMethod() << std::endl;  // From Child
```

---

## The `super()` Function

### Purpose
Call parent class methods, especially constructors

### Python Examples

```python
class Vehicle:
    def __init__(self, brand, model):
        self.brand = brand
        self.model = model
        print(f"Vehicle created: {brand} {model}")
    
    def start(self):
        return f"{self.brand} {self.model} started"

class Car(Vehicle):
    def __init__(self, brand, model, num_doors):
        super().__init__(brand, model)  # Call parent constructor
        self.num_doors = num_doors
        print(f"Car created with {num_doors} doors")
    
    def start(self):
        # Call parent's start() and extend it
        parent_result = super().start()
        return f"{parent_result} with {self.num_doors} doors"

# Usage
car = Car("Tesla", "Model 3", 4)
# Output:
# Vehicle created: Tesla Model 3
# Car created with 4 doors

print(car.start())
# Output: Tesla Model 3 started with 4 doors
```

### Multiple Levels

```python
class Animal:
    def __init__(self, name):
        self.name = name
        print(f"Animal: {name}")

class Mammal(Animal):
    def __init__(self, name, fur_color):
        super().__init__(name)  # Calls Animal.__init__
        self.fur_color = fur_color
        print(f"Mammal with {fur_color} fur")

class Dog(Mammal):
    def __init__(self, name, fur_color, breed):
        super().__init__(name, fur_color)  # Calls Mammal.__init__
        self.breed = breed
        print(f"Dog breed: {breed}")

dog = Dog("Buddy", "brown", "Golden Retriever")
# Output:
# Animal: Buddy
# Mammal with brown fur
# Dog breed: Golden Retriever
```

---

## Method Overriding

### Definition
Child class provides its own implementation of a parent's method

### Basic Example

```python
class Animal:
    def make_sound(self):
        return "Some generic sound"

class Dog(Animal):
    def make_sound(self):  # Override parent method
        return "Woof! Woof!"

class Cat(Animal):
    def make_sound(self):  # Override parent method
        return "Meow! Meow!"

# Usage
animals = [Animal(), Dog(), Cat()]
for animal in animals:
    print(animal.make_sound())
# Output:
# Some generic sound
# Woof! Woof!
# Meow! Meow!
```

### Extending Parent Method

```python
class BankAccount:
    def __init__(self, account_holder, balance=0):
        self.account_holder = account_holder
        self.balance = balance
    
    def withdraw(self, amount):
        if amount <= self.balance:
            self.balance -= amount
            return f"Withdrew ${amount}. Balance: ${self.balance}"
        return "Insufficient funds"

class SavingsAccount(BankAccount):
    def __init__(self, account_holder, balance=0, interest_rate=0.02):
        super().__init__(account_holder, balance)
        self.interest_rate = interest_rate
    
    def withdraw(self, amount):
        # Add minimum balance check before calling parent
        MIN_BALANCE = 500
        if self.balance - amount < MIN_BALANCE:
            return f"Cannot withdraw. Minimum balance: ${MIN_BALANCE}"
        
        # Call parent's withdraw
        return super().withdraw(amount)
    
    def add_interest(self):
        interest = self.balance * self.interest_rate
        self.balance += interest
        return f"Interest added: ${interest:.2f}. New balance: ${self.balance:.2f}"

# Usage
savings = SavingsAccount("Alice", 1000, 0.03)
print(savings.withdraw(600))  # Cannot withdraw (min balance)
print(savings.withdraw(400))  # OK
print(savings.add_interest()) # New method
```

---

## Types of Inheritance

### 1. Single Inheritance
One parent, one child

```python
class Parent:
    def parent_method(self):
        return "Parent"

class Child(Parent):  # Single parent
    def child_method(self):
        return "Child"
```

**Real-world:** Car IS-A Vehicle

### 2. Multiple Inheritance
One child, multiple parents (Python and C++ support this)

```python
class Father:
    def father_trait(self):
        return "Father's height"

class Mother:
    def mother_trait(self):
        return "Mother's eye color"

class Child(Father, Mother):  # Multiple parents
    def child_trait(self):
        return "Child's smile"

child = Child()
print(child.father_trait())  # From Father
print(child.mother_trait())  # From Mother
print(child.child_trait())   # Own trait
```

**Real-world:** Child inherits traits from both father and mother

**Note:** TypeScript doesn't support multiple inheritance (only multiple interfaces)

### 3. Multilevel Inheritance
Grandparent → Parent → Child chain

```python
class Grandparent:
    def heritage(self):
        return "Family values"

class Parent(Grandparent):
    def knowledge(self):
        return "Life lessons"

class Child(Parent):
    def innovation(self):
        return "New ideas"

child = Child()
print(child.heritage())    # From Grandparent
print(child.knowledge())   # From Parent
print(child.innovation())  # Own
```

**Real-world:** Genetic traits passed through generations

### 4. Hierarchical Inheritance
One parent, multiple children

```python
class Animal:
    def breathe(self):
        return "Breathing..."

class Dog(Animal):
    def bark(self):
        return "Woof!"

class Cat(Animal):
    def meow(self):
        return "Meow!"

class Bird(Animal):
    def fly(self):
        return "Flying..."

# All inherit from Animal
```

**Real-world:** Different animals all breathe

### 5. Hybrid Inheritance
Combination of above types

```python
class Animal:
    def breathe(self):
        return "Breathing"

class Mammal(Animal):
    def give_birth(self):
        return "Live birth"

class Carnivore(Animal):
    def eat_meat(self):
        return "Eating meat"

class Dog(Mammal, Carnivore):  # Multiple + Multilevel
    def bark(self):
        return "Woof!"

dog = Dog()
print(dog.breathe())      # From Animal (via Mammal)
print(dog.give_birth())   # From Mammal
print(dog.eat_meat())     # From Carnivore
print(dog.bark())         # Own
```

---

## Real-World Example: Employee Management System

```python
from datetime import datetime

class Employee:
    """Base class for all employees"""
    
    employee_count = 0  # Class variable
    
    def __init__(self, name, employee_id, salary):
        self.name = name
        self.employee_id = employee_id
        self.salary = salary
        self.hire_date = datetime.now()
        Employee.employee_count += 1
    
    def get_info(self):
        return f"ID: {self.employee_id}, Name: {self.name}, Salary: ${self.salary}"
    
    def calculate_annual_bonus(self):
        """Base bonus - 10% of salary"""
        return self.salary * 0.10
    
    @classmethod
    def get_employee_count(cls):
        return f"Total employees: {cls.employee_count}"

class Manager(Employee):
    """Manager with team management responsibilities"""
    
    def __init__(self, name, employee_id, salary, department):
        super().__init__(name, employee_id, salary)
        self.department = department
        self.team_members = []
    
    def add_team_member(self, employee):
        self.team_members.append(employee)
        return f"Added {employee.name} to {self.name}'s team"
    
    def get_team_size(self):
        return len(self.team_members)
    
    def calculate_annual_bonus(self):
        """Override - Managers get 20% + $500 per team member"""
        base_bonus = self.salary * 0.20
        team_bonus = len(self.team_members) * 500
        return base_bonus + team_bonus
    
    def get_info(self):
        """Extend parent method"""
        base_info = super().get_info()
        return f"{base_info}, Department: {self.department}, Team Size: {self.get_team_size()}"

class Developer(Employee):
    """Developer with programming skills"""
    
    def __init__(self, name, employee_id, salary, programming_languages):
        super().__init__(name, employee_id, salary)
        self.programming_languages = programming_languages
        self.projects = []
    
    def add_project(self, project_name):
        self.projects.append(project_name)
        return f"Assigned {project_name} to {self.name}"
    
    def calculate_annual_bonus(self):
        """Override - Developers get 15% + $1000 per project"""
        base_bonus = self.salary * 0.15
        project_bonus = len(self.projects) * 1000
        return base_bonus + project_bonus
    
    def get_info(self):
        """Extend parent method"""
        base_info = super().get_info()
        languages = ", ".join(self.programming_languages)
        return f"{base_info}, Languages: {languages}, Projects: {len(self.projects)}"

class Designer(Employee):
    """Designer with creative skills"""
    
    def __init__(self, name, employee_id, salary, design_tools):
        super().__init__(name, employee_id, salary)
        self.design_tools = design_tools
        self.portfolio_items = 0
    
    def add_portfolio_item(self):
        self.portfolio_items += 1
        return f"{self.name}'s portfolio now has {self.portfolio_items} items"
    
    def calculate_annual_bonus(self):
        """Override - Designers get 12% + $800 per portfolio item"""
        base_bonus = self.salary * 0.12
        portfolio_bonus = self.portfolio_items * 800
        return base_bonus + portfolio_bonus
    
    def get_info(self):
        """Extend parent method"""
        base_info = super().get_info()
        tools = ", ".join(self.design_tools)
        return f"{base_info}, Tools: {tools}, Portfolio: {self.portfolio_items}"

# Usage
print("=== Creating Employees ===")
manager = Manager("Alice Johnson", "MGR001", 120000, "Engineering")
dev1 = Developer("Bob Smith", "DEV001", 90000, ["Python", "JavaScript", "Go"])
dev2 = Developer("Carol White", "DEV002", 85000, ["Java", "Kotlin"])
designer = Designer("David Brown", "DES001", 75000, ["Figma", "Photoshop", "Illustrator"])

print(Employee.get_employee_count())  # Total employees: 4

print("\n=== Building Team ===")
print(manager.add_team_member(dev1))
print(manager.add_team_member(dev2))
print(manager.add_team_member(designer))

print("\n=== Assigning Work ===")
print(dev1.add_project("Mobile App Redesign"))
print(dev1.add_project("API Development"))
print(dev2.add_project("Backend Microservices"))
print(designer.add_portfolio_item())
print(designer.add_portfolio_item())
print(designer.add_portfolio_item())

print("\n=== Employee Information ===")
employees = [manager, dev1, dev2, designer]
for emp in employees:
    print(emp.get_info())

print("\n=== Annual Bonuses ===")
for emp in employees:
    bonus = emp.calculate_annual_bonus()
    print(f"{emp.name}: ${bonus:,.2f}")
```

---

## The Diamond Problem 💎

### What is the Diamond Problem?

The **Diamond Problem** occurs in multiple inheritance when a class inherits from two classes that both inherit from the same base class, creating ambiguity about which parent's method to use.

### Visual Representation

```
        A (Grandparent)
       / \
      /   \
     B     C (Parents)
      \   /
       \ /
        D (Child)
```

If B and C both override a method from A, which version should D inherit?

### Python Example

```python
class A:
    def method(self):
        return "A's method"

class B(A):
    def method(self):
        return "B's method"

class C(A):
    def method(self):
        return "C's method"

class D(B, C):  # Diamond problem!
    pass

d = D()
print(d.method())  # Which method? B's or C's?
```

**Output:** `"B's method"`

**Why?** Python uses **Method Resolution Order (MRO)**

---

## Method Resolution Order (MRO)

### What is MRO?

MRO is the order in which Python searches for methods in a class hierarchy. Python uses the **C3 Linearization** algorithm.

### Viewing MRO

```python
class A:
    def method(self):
        return "A"

class B(A):
    def method(self):
        return "B"

class C(A):
    def method(self):
        return "C"

class D(B, C):
    pass

# View MRO
print(D.__mro__)
# Output: (<class 'D'>, <class 'B'>, <class 'C'>, <class 'A'>, <class 'object'>)

print(D.mro())
# Same output in list format

# Also works with help
import pprint
pprint.pprint(D.__mro__)
```

### MRO Rules

1. **Left-to-right**: Check classes from left to right in inheritance list
2. **Depth-first**: Go deep into inheritance tree before going wide
3. **Parent before grandparent**: Check parent before its parent

```python
class Animal:
    def identify(self):
        return "Animal"

class Mammal(Animal):
    def identify(self):
        return "Mammal"

class WingedAnimal(Animal):
    def identify(self):
        return "WingedAnimal"

class Bat(Mammal, WingedAnimal):
    pass

bat = Bat()
print(bat.identify())  # "Mammal" (Mammal comes before WingedAnimal)
print(Bat.__mro__)
# (<class 'Bat'>, <class 'Mammal'>, <class 'WingedAnimal'>, <class 'Animal'>, <class 'object'>)
```

### Real-World Example: Employee System

```python
class Person:
    def __init__(self, name):
        self.name = name
    
    def introduce(self):
        return f"I'm {self.name}"

class Employee:
    def __init__(self, employee_id):
        self.employee_id = employee_id
    
    def introduce(self):
        return f"Employee ID: {self.employee_id}"

class Manager(Person, Employee):
    def __init__(self, name, employee_id, department):
        Person.__init__(self, name)
        Employee.__init__(self, employee_id)
        self.department = department

manager = Manager("Alice", "EMP001", "Engineering")
print(manager.introduce())  # Uses Person's introduce (leftmost parent)
print(Manager.__mro__)
# (<class 'Manager'>, <class 'Person'>, <class 'Employee'>, <class 'object'>)
```

---

## Diamond Problem in C++

### The Problem

C++ allows multiple inheritance but doesn't have automatic diamond problem resolution like Python.

```cpp
#include <iostream>
using namespace std;

class Animal {
public:
    string name;
    Animal(string n) : name(n) {}
    void eat() {
        cout << name << " is eating" << endl;
    }
};

class Mammal : public Animal {
public:
    Mammal(string n) : Animal(n) {}
};

class WingedAnimal : public Animal {
public:
    WingedAnimal(string n) : Animal(n) {}
};

// Diamond problem - Bat has TWO copies of Animal!
class Bat : public Mammal, public WingedAnimal {
public:
    Bat(string n) : Mammal(n), WingedAnimal(n) {}
};

int main() {
    Bat bat("Batty");
    // bat.eat();  // ERROR: Ambiguous! Which Animal::eat()?
    
    // Must specify which path:
    bat.Mammal::eat();      // Through Mammal
    bat.WingedAnimal::eat(); // Through WingedAnimal
    
    return 0;
}
```

### C++ Solution: Virtual Inheritance

```cpp
#include <iostream>
using namespace std;

class Animal {
public:
    string name;
    Animal(string n) : name(n) {
        cout << "Animal created: " << name << endl;
    }
    void eat() {
        cout << name << " is eating" << endl;
    }
};

// Virtual inheritance - only ONE copy of Animal
class Mammal : virtual public Animal {
public:
    Mammal(string n) : Animal(n) {
        cout << "Mammal created" << endl;
    }
};

class WingedAnimal : virtual public Animal {
public:
    WingedAnimal(string n) : Animal(n) {
        cout << "WingedAnimal created" << endl;
    }
};

class Bat : public Mammal, public WingedAnimal {
public:
    Bat(string n) : Animal(n), Mammal(n), WingedAnimal(n) {
        cout << "Bat created" << endl;
    }
};

int main() {
    Bat bat("Batty");
    bat.eat();  // No ambiguity - only one Animal!
    
    return 0;
}
```

---

## TypeScript: Multiple Inheritance Not Allowed

TypeScript doesn't support multiple class inheritance, but allows multiple interface implementation:

```typescript
interface Flyable {
    fly(): string;
}

interface Swimmable {
    swim(): string;
}

// Can implement multiple interfaces (but not extend multiple classes)
class Duck implements Flyable, Swimmable {
    fly(): string {
        return "Duck is flying";
    }
    
    swim(): string {
        return "Duck is swimming";
    }
}

// Can only extend ONE class
class Animal {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
}

class Bird extends Animal implements Flyable {
    constructor(name: string) {
        super(name);
    }
    
    fly(): string {
        return `${this.name} is flying`;
    }
}

// ERROR: Cannot extend multiple classes
// class Penguin extends Animal, Bird { } // ❌ Not allowed
```

---

## When to Use Multiple Inheritance

### ✅ Good Use Cases

1. **Mixins** - Adding orthogonal functionality

```python
class JSONSerializableMixin:
    def to_json(self):
        import json
        return json.dumps(self.__dict__)

class LoggableMixin:
    def log(self, message):
        print(f"[{self.__class__.__name__}] {message}")

class User(JSONSerializableMixin, LoggableMixin):
    def __init__(self, name, email):
        self.name = name
        self.email = email

user = User("Alice", "alice@example.com")
print(user.to_json())  # From JSONSerializableMixin
user.log("User created")  # From LoggableMixin
```

2. **Interface Implementation** - Implementing multiple interfaces

```python
from abc import ABC, abstractmethod

class Readable(ABC):
    @abstractmethod
    def read(self):
        pass

class Writable(ABC):
    @abstractmethod
    def write(self, data):
        pass

class File(Readable, Writable):
    def read(self):
        return "Reading file..."
    
    def write(self, data):
        return f"Writing: {data}"
```

### ❌ When to Avoid

1. **Deep diamond hierarchies**
2. **Unclear inheritance relationships**
3. **When composition would be clearer**

---

## Method Resolution with `super()`

### How `super()` Works with MRO

```python
class A:
    def method(self):
        print("A")

class B(A):
    def method(self):
        print("B")
        super().method()  # Calls next in MRO

class C(A):
    def method(self):
        print("C")
        super().method()  # Calls next in MRO

class D(B, C):
    def method(self):
        print("D")
        super().method()  # Calls next in MRO

d = D()
d.method()
# Output:
# D
# B
# C
# A

print(D.__mro__)
# (<class 'D'>, <class 'B'>, <class 'C'>, <class 'A'>, <class 'object'>)
```

### Cooperative Multiple Inheritance

```python
class LoggerMixin:
    def log(self, message):
        print(f"[LOG] {message}")
        super().log(message) if hasattr(super(), 'log') else None

class TimestampMixin:
    def log(self, message):
        from datetime import datetime
        timestamped = f"{datetime.now()}: {message}"
        print(f"[TIMESTAMP] {timestamped}")
        super().log(timestamped) if hasattr(super(), 'log') else None

class FileLogger:
    def log(self, message):
        print(f"[FILE] Writing to file: {message}")

class CompleteLogger(LoggerMixin, TimestampMixin, FileLogger):
    pass

logger = CompleteLogger()
logger.log("System started")
# Output:
# [LOG] System started
# [TIMESTAMP] 2025-01-10 12:00:00: System started
# [FILE] Writing to file: 2025-01-10 12:00:00: System started
```

---

## Abstract Base Classes with Inheritance

### Forcing Implementation in Subclasses

```python
from abc import ABC, abstractmethod

class Shape(ABC):
    def __init__(self, color):
        self.color = color
    
    @abstractmethod
    def area(self):
        """Must be implemented by subclasses"""
        pass
    
    @abstractmethod
    def perimeter(self):
        """Must be implemented by subclasses"""
        pass
    
    def describe(self):
        """Concrete method - shared by all shapes"""
        return f"A {self.color} {self.__class__.__name__}"

class ColoredShape(Shape):
    """Still abstract - doesn't implement area/perimeter"""
    def get_color_code(self):
        color_codes = {'red': '#FF0000', 'blue': '#0000FF', 'green': '#00FF00'}
        return color_codes.get(self.color.lower(), '#000000')

class Circle(ColoredShape):
    def __init__(self, color, radius):
        super().__init__(color)
        self.radius = radius
    
    def area(self):
        return 3.14159 * self.radius ** 2
    
    def perimeter(self):
        return 2 * 3.14159 * self.radius

class Rectangle(ColoredShape):
    def __init__(self, color, width, height):
        super().__init__(color)
        self.width = width
        self.height = height
    
    def area(self):
        return self.width * self.height
    
    def perimeter(self):
        return 2 * (self.width + self.height)

# shape = Shape('red')  # ❌ Cannot instantiate abstract class
# colored = ColoredShape('blue')  # ❌ Still abstract

circle = Circle('red', 5)  # ✅ Concrete class
print(circle.describe())
print(f"Area: {circle.area()}")
print(f"Color code: {circle.get_color_code()}")
```

---

## Inheritance Best Practices

### 1. Favor Composition Over Inheritance

```python
# ❌ Bad - Deep inheritance for code reuse
class Vehicle:
    def start(self):
        return "Starting..."

class Car(Vehicle):
    pass

class ElectricCar(Car):
    pass

class TeslaModelS(ElectricCar):
    pass

# ✅ Good - Composition
class Engine:
    def start(self):
        return "Engine starting..."

class Battery:
    def charge(self):
        return "Charging battery..."

class Car:
    def __init__(self):
        self.engine = Engine()  # HAS-A relationship
        self.battery = Battery()
    
    def start(self):
        return self.engine.start()
```

### 2. Keep Inheritance Hierarchies Shallow

**Rule of thumb:** Maximum 2-3 levels deep

```python
# ✅ Good - Shallow hierarchy
class Animal:
    pass

class Dog(Animal):
    pass

# ❌ Bad - Too deep
class LivingThing:
    pass

class Animal(LivingThing):
    pass

class Vertebrate(Animal):
    pass

class Mammal(Vertebrate):
    pass

class Carnivore(Mammal):
    pass

class Canine(Carnivore):
    pass

class Dog(Canine):  # 7 levels deep!
    pass
```

### 3. Use Abstract Base Classes for Contracts

```python
from abc import ABC, abstractmethod

# Define clear contracts
class Repository(ABC):
    @abstractmethod
    def save(self, entity):
        pass
    
    @abstractmethod
    def find_by_id(self, id):
        pass
    
    @abstractmethod
    def delete(self, id):
        pass

# Implementations must follow the contract
class MySQLRepository(Repository):
    def save(self, entity):
        return "Saved to MySQL"
    
    def find_by_id(self, id):
        return f"Found {id} in MySQL"
    
    def delete(self, id):
        return f"Deleted {id} from MySQL"
```

### 4. Don't Use Inheritance Just for Code Reuse

```python
# ❌ Bad - No IS-A relationship
class Utils:
    def format_date(self, date):
        return str(date)

class User(Utils):  # User IS-A Utils? No!
    def __init__(self, name):
        self.name = name

# ✅ Good - Use composition or standalone functions
class DateUtils:
    @staticmethod
    def format_date(date):
        return str(date)

class User:
    def __init__(self, name):
        self.name = name
        self.utils = DateUtils()
```

### 5. Liskov Substitution Principle

Child must be substitutable for parent without breaking behavior.

```python
# ❌ Violates LSP
class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height
    
    def set_width(self, width):
        self.width = width
    
    def set_height(self, height):
        self.height = height
    
    def area(self):
        return self.width * self.height

class Square(Rectangle):
    def set_width(self, width):
        self.width = width
        self.height = width  # Breaks Rectangle behavior!
    
    def set_height(self, height):
        self.width = height
        self.height = height

# Test
def test_rectangle(rect):
    rect.set_width(5)
    rect.set_height(4)
    assert rect.area() == 20  # Fails for Square!

test_rectangle(Rectangle(0, 0))  # ✅ Pass
test_rectangle(Square(0, 0))     # ❌ Fail (area is 16, not 20)

# ✅ Better design
class Shape(ABC):
    @abstractmethod
    def area(self):
        pass

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height
    
    def area(self):
        return self.width * self.height

class Square(Shape):
    def __init__(self, side):
        self.side = side
    
    def area(self):
        return self.side * self.side
```

---

## Real-World Example: E-commerce Product Hierarchy

```python
from abc import ABC, abstractmethod
from datetime import datetime, timedelta

class Product(ABC):
    """Base product class"""
    
    def __init__(self, product_id, name, base_price, stock):
        self.product_id = product_id
        self.name = name
        self.base_price = base_price
        self.stock = stock
        self.created_at = datetime.now()
    
    @abstractmethod
    def calculate_price(self):
        """Calculate final price with any applicable rules"""
        pass
    
    @abstractmethod
    def can_be_shipped(self):
        """Check if product can be shipped"""
        pass
    
    def is_in_stock(self):
        return self.stock > 0
    
    def reduce_stock(self, quantity):
        if quantity <= self.stock:
            self.stock -= quantity
            return True
        return False

class PhysicalProduct(Product):
    """Products that need shipping"""
    
    def __init__(self, product_id, name, base_price, stock, weight, dimensions):
        super().__init__(product_id, name, base_price, stock)
        self.weight = weight  # in kg
        self.dimensions = dimensions  # (length, width, height) in cm
    
    def can_be_shipped(self):
        # Check if product meets shipping constraints
        max_weight = 30  # kg
        max_dimension = 150  # cm
        
        if self.weight > max_weight:
            return False, "Exceeds maximum weight"
        
        if max(self.dimensions) > max_dimension:
            return False, "Exceeds maximum dimension"
        
        return True, "Can be shipped"
    
    def calculate_shipping_cost(self):
        """Calculate shipping based on weight and dimensions"""
        base_cost = 5.00
        weight_cost = self.weight * 2.00
        
        # Volumetric weight
        volume = (self.dimensions[0] * self.dimensions[1] * self.dimensions[2]) / 5000
        volume_cost = volume * 1.50
        
        return base_cost + weight_cost + volume_cost

class DigitalProduct(Product):
    """Products delivered electronically"""
    
    def __init__(self, product_id, name, base_price, stock, download_link, file_size):
        super().__init__(product_id, name, base_price, stock)
        self.download_link = download_link
        self.file_size = file_size  # in MB
        self.license_type = "single-user"
    
    def can_be_shipped(self):
        return True, "Digital download - no shipping needed"
    
    def calculate_price(self):
        """Digital products might have volume licensing discounts"""
        return self.base_price
    
    def generate_license_key(self):
        import random
        import string
        return ''.join(random.choices(string.ascii_uppercase + string.digits, k=16))

class PerishableProduct(PhysicalProduct):
    """Products with expiration dates"""
    
    def __init__(self, product_id, name, base_price, stock, weight, dimensions, expiration_date):
        super().__init__(product_id, name, base_price, stock, weight, dimensions)
        self.expiration_date = expiration_date
    
    def calculate_price(self):
        """Discount products near expiration"""
        days_until_expiry = (self.expiration_date - datetime.now()).days
        
        if days_until_expiry < 0:
            return 0  # Expired
        elif days_until_expiry <= 3:
            return self.base_price * 0.50  # 50% off
        elif days_until_expiry <= 7:
            return self.base_price * 0.75  # 25% off
        else:
            return self.base_price
    
    def is_expired(self):
        return datetime.now() > self.expiration_date

class Electronics(PhysicalProduct):
    """Electronic products with warranty"""
    
    def __init__(self, product_id, name, base_price, stock, weight, dimensions, warranty_months):
        super().__init__(product_id, name, base_price, stock, weight, dimensions)
        self.warranty_months = warranty_months
        self.warranty_start = None
    
    def calculate_price(self):
        """Electronics might have tax added"""
        tax_rate = 0.10
        return self.base_price * (1 + tax_rate)
    
    def activate_warranty(self):
        self.warranty_start = datetime.now()
        return f"Warranty activated until {self.get_warranty_end_date()}"
    
    def get_warranty_end_date(self):
        if self.warranty_start:
            return self.warranty_start + timedelta(days=self.warranty_months * 30)
        return None
    
    def is_under_warranty(self):
        if not self.warranty_start:
            return False
        return datetime.now() < self.get_warranty_end_date()

class Subscription(DigitalProduct):
    """Recurring digital product"""
    
    def __init__(self, product_id, name, monthly_price, download_link, file_size, billing_cycle):
        # Subscription has unlimited stock
        super().__init__(product_id, name, monthly_price, float('inf'), download_link, file_size)
        self.billing_cycle = billing_cycle  # 'monthly', 'yearly'
        self.active_subscribers = 0
    
    def calculate_price(self):
        """Calculate based on billing cycle"""
        if self.billing_cycle == 'yearly':
            return self.base_price * 10  # 2 months free
        return self.base_price
    
    def subscribe(self):
        self.active_subscribers += 1
        return f"Subscribed! Next billing: {self.billing_cycle}"
    
    def unsubscribe(self):
        if self.active_subscribers > 0:
            self.active_subscribers -= 1
        return "Subscription cancelled"

# Usage Example
print("=== Product Catalog ===\n")

# Physical product
laptop = Electronics(
    "ELEC001", "Gaming Laptop", 1200.00, 10,
    weight=2.5, dimensions=(35, 25, 2), warranty_months=24
)
print(f"{laptop.name}: ${laptop.calculate_price():.2f}")
print(f"Shipping cost: ${laptop.calculate_shipping_cost():.2f}")
print(f"Can ship: {laptop.can_be_shipped()[1]}")
print(laptop.activate_warranty())

# Digital product
ebook = DigitalProduct(
    "DIG001", "Python Programming eBook", 29.99, 1000,
    download_link="https://example.com/ebook.pdf", file_size=5.2
)
print(f"\n{ebook.name}: ${ebook.calculate_price():.2f}")
print(f"License key: {ebook.generate_license_key()}")

# Perishable product
milk = PerishableProduct(
    "FOOD001", "Organic Milk", 4.99, 50,
    weight=1.0, dimensions=(10, 10, 20),
    expiration_date=datetime.now() + timedelta(days=5)
)
print(f"\n{milk.name}: ${milk.calculate_price():.2f}")
print(f"Days until expiry: {(milk.expiration_date - datetime.now()).days}")

# Subscription
streaming = Subscription(
    "SUB001", "Music Streaming", 9.99,
    download_link="https://stream.example.com", file_size=0,
    billing_cycle='yearly'
)
print(f"\n{streaming.name}")
print(f"Monthly: ${streaming.base_price}")
print(f"Yearly: ${streaming.calculate_price():.2f}")
print(streaming.subscribe())
```

---

## Practice Questions

<details>
<summary><strong>View Questions</strong></summary>

### Fill in the Gaps

1. The Diamond Problem occurs in __________ inheritance when a class inherits from two classes that both inherit from the same __________ class.
2. Python uses __________ to determine the order in which methods are searched in a class hierarchy, which follows the __________ Linearization algorithm.
3. In C++, the diamond problem can be solved using __________ inheritance to ensure only __________ copy of the base class exists.
4. TypeScript does not support multiple __________ inheritance, but does allow implementing multiple __________.
5. When using `super()` in Python with multiple inheritance, it calls the __________ class in the MRO chain, not necessarily the direct __________.

<details>
<summary><strong>View Answers</strong></summary>

1. multiple, base (or grandparent)
2. MRO (Method Resolution Order), C3
3. virtual, one
4. class, interfaces
5. next, parent

</details>

### True/False

1. Python's MRO always searches parent classes from right to left in the inheritance list.
2. The diamond problem only occurs when using multiple inheritance.
3. In C++, without virtual inheritance, a class can have multiple copies of the same base class.
4. TypeScript completely avoids the diamond problem because it doesn't support multiple class inheritance.
5. Using `super()` in Python always calls the direct parent class's method.
6. Keeping inheritance hierarchies shallow (2-3 levels max) is generally considered a best practice.
7. The Liskov Substitution Principle states that a child class must be able to replace its parent class without breaking the program.

<details>
<summary><strong>View Answers</strong></summary>

1. False - Python's MRO searches from left to right, not right to left.
2. True - The diamond problem specifically arises when multiple inheritance creates a diamond-shaped hierarchy.
3. True - Without virtual inheritance, each inheritance path creates a separate copy of the base class.
4. True - TypeScript only allows single class inheritance (one parent), though you can implement multiple interfaces.
5. False - `super()` calls the next class in the MRO, which may not be the direct parent, especially with multiple inheritance.
6. True - Shallow hierarchies are easier to understand and maintain. Deep hierarchies often indicate poor design.
7. True - LSP ensures that subclasses can substitute their parent classes without breaking expected behavior.

</details>

### Multiple Choice Questions

1. What does MRO stand for in Python?
   - A) Multiple Resolution Order
   - B) Method Resolution Order
   - C) Module Reference Order
   - D) Main Recursive Operation

2. Given `class D(B, C)`, which class will Python check first when looking for a method?
   - A) C
   - B) B
   - C) D
   - D) object

3. What is the purpose of virtual inheritance in C++?
   - A) To make methods virtual
   - B) To prevent the diamond problem by ensuring only one copy of the base class
   - C) To make classes abstract
   - D) To improve performance

4. Which statement about the diamond problem is correct?
   - A) It only affects Python
   - B) It's automatically solved in all languages
   - C) It creates ambiguity about which parent's method to use
   - D) It makes code run slower

5. What is the maximum recommended depth for inheritance hierarchies?
   - A) 1 level
   - B) 2-3 levels
   - C) 5-7 levels
   - D) No limit

6. When should you prefer composition over inheritance?
   - A) Never
   - B) Only for simple classes
   - C) When there's no clear IS-A relationship
   - D) Always

7. What happens if you try to instantiate an abstract base class in Python?
   - A) It works normally
   - B) TypeError is raised
   - C) None is returned
   - D) The program crashes

8. Which Python method can you use to view a class's MRO?
   - A) `__init__()`
   - B) `__str__()`
   - C) `__mro__` or `.mro()`
   - D) `__class__()`

<details>
<summary><strong>View Answers</strong></summary>

1. B) Method Resolution Order - The order Python searches for methods in inheritance hierarchies
2. C) D - Python always checks the class itself first, then follows MRO
3. B) To prevent the diamond problem by ensuring only one copy of the base class
4. C) It creates ambiguity about which parent's method to use - This is the core issue of the diamond problem
5. B) 2-3 levels - Best practice for maintainable code
6. C) When there's no clear IS-A relationship - Use composition for HAS-A relationships
7. B) TypeError is raised - Python prevents instantiation of abstract classes
8. C) `__mro__` or `.mro()` - Both show the method resolution order

</details>

### Code Challenges

**Challenge 1: Implement MRO-Aware Class**

Create a class hierarchy that demonstrates MRO:
- `A` (base class with method `identify()`)
- `B` inherits from `A`, overrides `identify()`
- `C` inherits from `A`, overrides `identify()`
- `D` inherits from both `B` and `C`

Each `identify()` should print the class name and call `super().identify()`.

<details>
<summary><strong>View Solution</strong></summary>

```python
class A:
    def identify(self):
        print("A")

class B(A):
    def identify(self):
        print("B")
        super().identify()

class C(A):
    def identify(self):
        print("C")
        super().identify()

class D(B, C):
    def identify(self):
        print("D")
        super().identify()

# Test
d = D()
d.identify()
# Output:
# D
# B
# C
# A

# View MRO
print("\nMRO:", [cls.__name__ for cls in D.__mro__])
# Output: MRO: ['D', 'B', 'C', 'A', 'object']
```

</details>

**Challenge 2: Fix LSP Violation**

The following code violates the Liskov Substitution Principle. Refactor it:

```python
class Bird:
    def fly(self):
        return "Flying high!"

class Penguin(Bird):
    def fly(self):
        raise Exception("Penguins can't fly!")

def make_bird_fly(bird: Bird):
    print(bird.fly())

# This works
make_bird_fly(Bird())

# This breaks!
make_bird_fly(Penguin())  # Exception!
```

<details>
<summary><strong>View Solution</strong></summary>

```python
from abc import ABC, abstractmethod

# Solution: Restructure the hierarchy
class Bird(ABC):
    def __init__(self, name):
        self.name = name
    
    @abstractmethod
    def move(self):
        """All birds can move"""
        pass

class FlyingBird(Bird):
    def move(self):
        return f"{self.name} is flying"
    
    def fly(self):
        return f"{self.name} soars through the sky"

class FlightlessBird(Bird):
    def move(self):
        return f"{self.name} is walking/swimming"

class Sparrow(FlyingBird):
    def __init__(self):
        super().__init__("Sparrow")

class Penguin(FlightlessBird):
    def __init__(self):
        super().__init__("Penguin")
    
    def swim(self):
        return f"{self.name} is swimming"

# Now we can safely use any Bird
def make_bird_move(bird: Bird):
    print(bird.move())

sparrow = Sparrow()
penguin = Penguin()

make_bird_move(sparrow)  # ✅ Works
make_bird_move(penguin)  # ✅ Works - no exception!

# Specific capabilities
if isinstance(sparrow, FlyingBird):
    print(sparrow.fly())

if isinstance(penguin, FlightlessBird):
    print(penguin.swim())
```

</details>

**Challenge 3: Build a Mixin System**

Create a logging and timestamp mixin system:
- `LoggerMixin` - adds logging capability
- `TimestampMixin` - adds timestamp to operations
- `DataProcessor` - base class that processes data
- `EnhancedProcessor` - uses both mixins

<details>
<summary><strong>View Solution</strong></summary>

```python
from datetime import datetime

class LoggerMixin:
    """Mixin to add logging capability"""
    def log(self, message, level="INFO"):
        print(f"[{level}] {self.__class__.__name__}: {message}")

class TimestampMixin:
    """Mixin to add timestamp tracking"""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.created_at = datetime.now()
        self.last_modified = datetime.now()
    
    def update_timestamp(self):
        self.last_modified = datetime.now()
    
    def get_age(self):
        delta = datetime.now() - self.created_at
        return f"{delta.seconds} seconds"

class DataProcessor:
    """Base processor class"""
    def __init__(self, name):
        self.name = name
        self.data = []
    
    def add_data(self, item):
        self.data.append(item)
        return f"Added {item}"
    
    def process(self):
        return f"Processing {len(self.data)} items"

class EnhancedProcessor(LoggerMixin, TimestampMixin, DataProcessor):
    """Processor with logging and timestamps"""
    def __init__(self, name):
        super().__init__(name)
        self.log(f"Processor '{name}' created")
    
    def add_data(self, item):
        result = super().add_data(item)
        self.update_timestamp()
        self.log(f"Data added: {item}")
        return result
    
    def process(self):
        result = super().process()
        self.update_timestamp()
        self.log("Processing completed", level="SUCCESS")
        return result

# Test
processor = EnhancedProcessor("DataAnalyzer")
print(f"Created at: {processor.created_at}")

processor.add_data("dataset1.csv")
processor.add_data("dataset2.csv")
processor.process()

print(f"Age: {processor.get_age()}")
print(f"Last modified: {processor.last_modified}")

# Check MRO
print("\nMRO:", [cls.__name__ for cls in EnhancedProcessor.__mro__])
```

</details>

</details>

---

## Summary

### Key Takeaways

1. **Diamond Problem** - Occurs in multiple inheritance when a child inherits from two parents that share a common ancestor
2. **MRO (Method Resolution Order)** - Python's way of resolving which method to call; uses C3 Linearization
3. **Virtual Inheritance** - C++ solution to diamond problem
4. **TypeScript** - Avoids diamond problem by not supporting multiple class inheritance
5. **Best Practices** - Keep hierarchies shallow, favor composition, follow LSP

### Memory Aid

**"MRO-D" for Multiple Inheritance:**
- **M**ethod Resolution Order (Python's solution)
- **R**ight to left... NO! Left to right
- **O**ne copy with virtual (C++ solution)
- **D**iamond creates ambiguity

### When to Use Multiple Inheritance

✅ **Good:**
- Mixins for orthogonal functionality
- Multiple interface implementation
- Cooperative inheritance with `super()`

❌ **Avoid:**
- Deep diamond hierarchies
- When composition is clearer
- Just for code reuse without IS-A relationship

---

[← Back to Abstract](02-abstraction.md) | [Next: Polymorphism →](04-polymorphism.md) | [↑ Back to README](../README.md)