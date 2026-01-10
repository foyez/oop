# 10.4 Glossary

[← Back to Decision Trees](03-decision-trees.md) | [↑ Back to README](../README.md)

---

## A

**Abstract Class**  
A class that cannot be instantiated and may contain abstract methods that must be implemented by subclasses.
```python
from abc import ABC, abstractmethod
class Animal(ABC):
    @abstractmethod
    def sound(self): pass
```

**Abstraction**  
Hiding implementation details and showing only essential features. One of the four pillars of OOP.
```python
# User sees: car.start()
# Hidden: fuel injection, spark plugs, etc.
```

**Adapter Pattern**  
Design pattern that allows incompatible interfaces to work together.
```python
class PrinterAdapter:
    def __init__(self, old_printer):
        self.old_printer = old_printer
    def print(self, text):
        self.old_printer.print_old(text)
```

**Aggregation**  
"Has-A" relationship where the contained object can exist independently.
```python
# Department has Employees
# Employees can exist without Department
```

**Anti-Pattern**  
Common solution that appears helpful but creates more problems.  
Examples: God Object, Spaghetti Code, Copy-Paste Programming

---

## B

**Base Class**  
See Parent Class. The class being inherited from.

**Behavioral Pattern**  
Design patterns focused on object interaction and communication.  
Examples: Strategy, Observer, Command

**Builder Pattern**  
Design pattern for constructing complex objects step by step.
```python
computer = (ComputerBuilder()
    .set_cpu("i9")
    .set_ram("32GB")
    .build())
```

---

## C

**Class**  
Blueprint for creating objects. Defines attributes and methods.
```python
class Dog:
    def __init__(self, name):
        self.name = name
```

**Cohesion**  
How closely related responsibilities within a class are. High cohesion is good.

**Command Pattern**  
Design pattern that encapsulates a request as an object.
```python
class LightOnCommand:
    def execute(self):
        light.turn_on()
```

**Composition**  
"Has-A" relationship where an object contains other objects.
```python
class Car:
    def __init__(self):
        self.engine = Engine()  # Car HAS-A Engine
```

**Constructor**  
Special method called when creating an object.
```python
def __init__(self):  # Python constructor
```

**Coupling**  
Degree of interdependence between classes. Low coupling is good.

**Creational Pattern**  
Design patterns focused on object creation.  
Examples: Factory, Singleton, Builder

---

## D

**Decorator Pattern**  
Design pattern that adds behavior to objects dynamically.
```python
coffee = Sugar(Milk(SimpleCoffee()))
```

**Dependency Inversion Principle (DIP)**  
Depend on abstractions, not concrete implementations. The "D" in SOLID.
```python
class UserService:
    def __init__(self, db: Database):  # Depends on interface
        self.db = db
```

**Dependency Injection**  
Providing dependencies from outside rather than creating them internally.
```python
service = UserService(PostgreSQL())  # Inject dependency
```

**Derived Class**  
See Child Class. The class that inherits from another.

**Destructor**  
Method called when an object is destroyed.
```python
def __del__(self):  # Python destructor
```

**Diamond Problem**  
Ambiguity in multiple inheritance when two parent classes inherit from the same grandparent.

**DRY (Don't Repeat Yourself)**  
Principle that every piece of knowledge should have a single representation.

**Duck Typing**  
"If it walks like a duck and quacks like a duck, it's a duck." Type determined by behavior, not inheritance.
```python
# If object has .quack() method, treat it as a duck
```

---

## E

**Encapsulation**  
Bundling data and methods together and restricting access to internal details. One of the four pillars of OOP.
```python
class BankAccount:
    def __init__(self):
        self.__balance = 0  # Private
```

---

## F

**Facade Pattern**  
Design pattern that provides a simplified interface to a complex subsystem.
```python
class HomeTheater:
    def watch_movie(self):
        self.lights.dim()
        self.projector.on()
        self.dvd.play()
```

**Factory Pattern**  
Design pattern that creates objects without specifying their exact class.
```python
animal = AnimalFactory.create("dog")
```

**Favor Composition Over Inheritance**  
Design principle preferring "has-a" over "is-a" relationships.

---

## G

**Getter**  
Method that retrieves the value of a private field.
```python
def get_balance(self):
    return self._balance
```

**God Object**  
Anti-pattern where a class knows or does too much.

---

## I

**Inheritance**  
Mechanism where a class derives properties and behavior from another class. One of the four pillars of OOP.
```python
class Dog(Animal):  # Dog inherits from Animal
    pass
```

**Instance**  
A specific object created from a class.
```python
dog = Dog("Rex")  # dog is an instance
```

**Interface**  
Contract that defines methods a class must implement (without implementation details).
```python
class Drawable(Protocol):
    def draw(self): pass
```

**Interface Segregation Principle (ISP)**  
Clients shouldn't depend on interfaces they don't use. The "I" in SOLID.

---

## K

**KISS (Keep It Simple, Stupid)**  
Design principle favoring simplicity over complexity.

---

## L

**Law of Demeter**  
Principle of Least Knowledge - only talk to your immediate friends.
```python
# ❌ customer.getWallet().getMoney()
# ✅ customer.pay(amount)
```

**Liskov Substitution Principle (LSP)**  
Subtypes must be substitutable for their base types. The "L" in SOLID.

**Loose Coupling**  
Design where classes have minimal dependencies on each other.

---

## M

**Member Variable**  
Variable that belongs to a class or instance.

**Method**  
Function defined inside a class.
```python
class Dog:
    def bark(self):  # Method
        return "Woof"
```

**Method Overloading**  
Having multiple methods with same name but different parameters.
```python
# Python doesn't support true overloading
def add(self, a, b, c=0):  # Use default params
    return a + b + c
```

**Method Overriding**  
Subclass provides its own implementation of parent's method.
```python
class Dog(Animal):
    def sound(self):  # Override
        return "Woof"
```

**Mixin**  
Class that provides methods to other classes via multiple inheritance.
```python
class JsonSerializableMixin:
    def to_json(self): pass
```

**Multiple Inheritance**  
Class inheriting from more than one parent class.
```python
class Dolphin(Animal, Swimmer):
    pass
```

---

## O

**Object**  
Instance of a class.

**Observer Pattern**  
Design pattern where one object notifies multiple observers of state changes.
```python
subject.attach(observer1)
subject.attach(observer2)
subject.notify("Changed!")
```

**Open/Closed Principle (OCP)**  
Open for extension, closed for modification. The "O" in SOLID.

**Operator Overloading**  
Defining custom behavior for operators.
```python
def __add__(self, other):  # Overload +
    return Vector(self.x + other.x)
```

---

## P

**Parent Class**  
Class being inherited from (also called base class or superclass).

**Polymorphism**  
Ability to take many forms. Same interface, different implementations. One of the four pillars of OOP.
```python
def make_sound(animal):  # Works with any animal
    animal.sound()
```

**Premature Optimization**  
Optimizing code before knowing if it's actually a bottleneck.

**Private**  
Access level restricting access to class members.
```python
self.__private  # Python convention
```

**Protected**  
Access level allowing access within class and subclasses.
```python
self._protected  # Python convention
```

**Public**  
Access level allowing unrestricted access.
```python
self.public  # Python default
```

---

## S

**Setter**  
Method that sets the value of a private field.
```python
def set_balance(self, value):
    if value >= 0:
        self._balance = value
```

**Singleton Pattern**  
Design pattern ensuring only one instance of a class exists.
```python
class Database:
    _instance = None
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
```

**Single Responsibility Principle (SRP)**  
A class should have only one reason to change. The "S" in SOLID.

**SOLID**  
Five design principles: SRP, OCP, LSP, ISP, DIP.

**Spaghetti Code**  
Anti-pattern with tangled, hard-to-follow control flow.

**Static Method**  
Method that belongs to the class, not instances.
```python
@staticmethod
def calculate(a, b):
    return a + b
```

**Strategy Pattern**  
Design pattern encapsulating interchangeable algorithms.
```python
class Sorter:
    def __init__(self, strategy):
        self.strategy = strategy
```

**Structural Pattern**  
Design patterns focused on object composition.  
Examples: Adapter, Decorator, Facade

**Subclass**  
See Child Class.

**Superclass**  
See Parent Class.

---

## T

**Template Method Pattern**  
Design pattern defining algorithm skeleton, letting subclasses override steps.

**Tight Coupling**  
Design where classes are highly dependent on each other (bad).

---

## U

**UML (Unified Modeling Language)**  
Standard way to visualize system design.

---

## V

**Virtual Method**  
Method that can be overridden in subclasses.

---

## Y

**YAGNI (You Aren't Gonna Need It)**  
Principle of not adding functionality until it's needed.

---

## Common Acronyms

| Acronym | Full Form |
|---------|-----------|
| **OOP** | Object-Oriented Programming |
| **SOLID** | Single responsibility, Open/closed, Liskov substitution, Interface segregation, Dependency inversion |
| **DRY** | Don't Repeat Yourself |
| **KISS** | Keep It Simple, Stupid |
| **YAGNI** | You Aren't Gonna Need It |
| **SRP** | Single Responsibility Principle |
| **OCP** | Open/Closed Principle |
| **LSP** | Liskov Substitution Principle |
| **ISP** | Interface Segregation Principle |
| **DIP** | Dependency Inversion Principle |
| **DI** | Dependency Injection |
| **IoC** | Inversion of Control |
| **MRO** | Method Resolution Order |
| **ABC** | Abstract Base Class |
| **API** | Application Programming Interface |
| **UML** | Unified Modeling Language |

---

## Symbol Reference (Python)

| Symbol | Meaning | Example |
|--------|---------|---------|
| `_` | Protected (convention) | `self._protected` |
| `__` | Private (name mangling) | `self.__private` |
| `@property` | Getter decorator | `@property def age(self)` |
| `@staticmethod` | Static method | `@staticmethod def calc()` |
| `@classmethod` | Class method | `@classmethod def create()` |
| `@abstractmethod` | Abstract method | `@abstractmethod def sound()` |
| `super()` | Parent class reference | `super().__init__()` |
| `self` | Instance reference | `self.name = name` |
| `cls` | Class reference | `cls._instance` |

---

[← Back to Decision Trees](03-decision-trees.md) | [↑ Back to README](../README.md)