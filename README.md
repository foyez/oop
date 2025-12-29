# Object Oriented Programming

## What is OOP?

**Object-Oriented Programming (OOP)** is a programming paradigm that organizes code around **objects** rather than functions and logic.

**Think of it like this:** Instead of writing a recipe (procedural), you're building LEGO blocks (objects) that can interact with each other.

An **object**:

* Holds **data** → *attributes*
* Performs **actions** → *methods*

### Real-Life Example

A **Car**:

* Data → color, brand, speed
* Actions → start(), stop(), accelerate()

---

## Why Use OOP?

✅ **Modularity** - Code is organized into self-contained objects  
✅ **Reusability** - Write once, use many times  
✅ **Maintainability** - Easier to fix and update  
✅ **Scalability** - Easier to expand your application  
✅ **Real-world modeling** - Mirrors how we think about the world  

---

## Class & Object

### Class

A **class** is a **blueprint**.

### Object (Instance)

An **object** is a **real thing created from the class**.

---

<details>
<summary><strong>View contents</strong></summary>

### Python Example

```python
class Car:
    def __init__(self, brand, color):
        self.brand = brand
        self.color = color

    def drive(self):
        return f"The {self.color} {self.brand} is driving"

my_car = Car("Tesla", "Red")
print(my_car.drive())
```

### Real-Life Example

* **Class** → Blueprint of a house
* **Object** → Actual house built from blueprint

---

</details>

## The Four Pillars of OOP

Think of these as the **AEIP** (pronounced "AYE-IP"):
1. **A**bstraction
2. **E**ncapsulation
3. **I**nheritance
4. **P**olymorphism

---

### 1. Encapsulation (Data Protection) 🔒

**Hide internal data and expose only controlled access**

#### Why?

* Prevents misuse
* Protects object state

#### Real-Life Analogy

A **washing machine**: You press buttons (public interface), but you don't mess with the motor or circuit board inside (private data).

#### Key Concepts

- Bundle related data and methods in a class
- Hide internal data (make it private)
- Provide controlled access through public methods (getters/setters)

<details>
<summary><strong>View contents</strong></summary>

#### Python Example

```python
class BankAccount:
    def __init__(self, account_holder):
        self.account_holder = account_holder  # public
        self.__balance = 0  # private (double underscore)
    
    # Getter method (controlled access)
    def get_balance(self):
        return self.__balance
    
    # Setter method (controlled modification)
    def deposit(self, amount):
        if amount > 0:
            self.__balance += amount
            return f"Deposited ${amount}. New balance: ${self.__balance}"
        return "Invalid amount"
    
    def withdraw(self, amount):
        if 0 < amount <= self.__balance:
            self.__balance -= amount
            return f"Withdrew ${amount}. Remaining: ${self.__balance}"
        return "Insufficient funds"

# Usage
account = BankAccount("Alice")
print(account.deposit(1000))  # ✅ Works
print(account.withdraw(200))  # ✅ Works
# account.__balance = 999999  # ❌ Doesn't actually change the private variable
print(account.get_balance())  # ✅ Proper way to access
```

#### Real-Life Example

**ATM Card**: You can check balance, deposit, withdraw (public methods), but you can't directly access the bank's database (private data).

#### Interview Tip

"Encapsulation is about **data hiding** and **controlled access**. It's the difference between giving someone your house keys vs. answering the doorbell."

</details>

---

### 2. Abstraction (Hide Complexity) 🎭

**"Hiding complexity, showing only what's necessary. Show what an object does, not how it does it."**

#### Real-Life Analogy

A **car**: You drive using pedals and steering wheel (simple interface), without knowing how the engine, transmission, or fuel injection works (hidden complexity).

#### Key Concepts

- Hide implementation details
- Show only essential features
- Use abstract classes/methods to define "what" not "how"

<details>
<summary><strong>View contents</strong></summary>

#### Python Example

```python
from abc import ABC, abstractmethod

# Abstract class - defines the interface
class PaymentProcessor(ABC):
    @abstractmethod
    def process_payment(self, amount):
        """Every payment processor must implement this"""
        pass
    
    @abstractmethod
    def refund(self, amount):
        """Every payment processor must implement this"""
        pass

# Concrete implementations
class CreditCardProcessor(PaymentProcessor):
    def process_payment(self, amount):
        return f"Processing ${amount} via Credit Card..."
    
    def refund(self, amount):
        return f"Refunding ${amount} to Credit Card..."

class PayPalProcessor(PaymentProcessor):
    def process_payment(self, amount):
        return f"Processing ${amount} via PayPal..."
    
    def refund(self, amount):
        return f"Refunding ${amount} to PayPal..."

class BitcoinProcessor(PaymentProcessor):
    def process_payment(self, amount):
        return f"Processing ${amount} via Bitcoin..."
    
    def refund(self, amount):
        return f"Refunding ${amount} to Bitcoin wallet..."

# Usage - we don't care HOW payment is processed
def checkout(processor: PaymentProcessor, amount):
    print(processor.process_payment(amount))

# Same function works with any payment method
checkout(CreditCardProcessor(), 100)
checkout(PayPalProcessor(), 50)
checkout(BitcoinProcessor(), 200)
```

#### Real-Life Example

**TV Remote**: You press "Volume Up" (abstract interface) without knowing the electronics, infrared signals, or digital processing happening inside (implementation).

#### Interview Tip

"Abstraction is about **hiding HOW things work** and showing only **WHAT they do**. Think of it as using a smartphone without knowing circuit design."

</details>

---

### 3. Inheritance (Code Reuse) 👨‍👩‍👧‍👦

**"Child classes inherit properties and methods from parent classes"**

#### Real-Life Analogy

**Family traits**: Children inherit eye color, height genes from parents but also have their own unique features.

#### Key Concepts

- Promotes code reuse
- Establishes "is-a" relationships (Dog IS-A Animal)
- Child class extends parent class functionality

<details>
<summary><strong>View contents</strong></summary>

#### Python Example

```python
# Parent class (Base class)
class Animal:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def eat(self):
        return f"{self.name} is eating..."
    
    def sleep(self):
        return f"{self.name} is sleeping..."
    
    def make_sound(self):
        return "Some generic sound"

# Child class (Derived class)
class Dog(Animal):
    def __init__(self, name, age, breed):
        super().__init__(name, age)  # Call parent constructor
        self.breed = breed
    
    # Override parent method
    def make_sound(self):
        return "Woof! Woof!"
    
    # New method specific to Dog
    def fetch(self):
        return f"{self.name} is fetching the ball!"

class Cat(Animal):
    def __init__(self, name, age, color):
        super().__init__(name, age)
        self.color = color
    
    # Override parent method
    def make_sound(self):
        return "Meow! Meow!"
    
    # New method specific to Cat
    def scratch(self):
        return f"{self.name} is scratching the furniture!"

# Usage
dog = Dog("Buddy", 3, "Golden Retriever")
cat = Cat("Whiskers", 2, "Orange")

print(dog.eat())  # Inherited from Animal
print(dog.make_sound())  # Overridden in Dog
print(dog.fetch())  # Unique to Dog

print(cat.sleep())  # Inherited from Animal
print(cat.make_sound())  # Overridden in Cat
print(cat.scratch())  # Unique to Cat
```

#### Real-Life Example
**Vehicle Hierarchy**: 
- Vehicle (parent) → has wheels, engine
- Car (child) → inherits wheels, engine + adds trunk
- Motorcycle (child) → inherits wheels, engine + adds kickstand

#### Types of Inheritance

```python
# 1. Single Inheritance (One parent)
class Parent:
    pass

class Child(Parent):
    pass

# 2. Multiple Inheritance (Multiple parents)
class Father:
    def skills(self):
        return "Gardening"

class Mother:
    def skills(self):
        return "Cooking"

class Child(Father, Mother):  # Inherits from both
    pass

child = Child()
print(child.skills())  # "Gardening" (first parent wins)

# 3. Multilevel Inheritance (Chain)
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
print(child.heritage())  # From Grandparent
print(child.knowledge())  # From Parent
print(child.innovation())  # Own method
```

#### Interview Tip
"Inheritance is about **code reuse** and **hierarchical relationships**. If you find yourself copying code between classes, consider inheritance."

</details>

---

### 4. Polymorphism (Many Forms) 🎨

**"Same interface, different implementations"**

#### Real-Life Analogy

A **smartphone charger port**: Same USB-C port (interface) works with phone, laptop, tablet, earbuds (different devices, same action).

#### Key Concepts

- One interface, multiple forms
- Method overriding (runtime polymorphism)
- Method overloading (compile-time polymorphism)
- Duck typing in Python

<details>
<summary><strong>View contents</strong></summary>

#### Python Example - Method Overriding

```python
class Shape:
    def area(self):
        pass
    
    def description(self):
        return "I am a shape"

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius
    
    def area(self):
        return 3.14159 * self.radius ** 2
    
    def description(self):
        return "I am a circle"

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height
    
    def area(self):
        return self.width * self.height
    
    def description(self):
        return "I am a rectangle"

class Triangle(Shape):
    def __init__(self, base, height):
        self.base = base
        self.height = height
    
    def area(self):
        return 0.5 * self.base * self.height
    
    def description(self):
        return "I am a triangle"

# Polymorphism in action
def print_area(shape):
    """This function works with ANY shape"""
    print(f"{shape.description()}")
    print(f"Area: {shape.area()}")
    print()

# Same function, different behavior
shapes = [
    Circle(5),
    Rectangle(4, 6),
    Triangle(3, 8)
]

for shape in shapes:
    print_area(shape)  # Polymorphism!
```

#### Python Example - Duck Typing

```python
# "If it walks like a duck and quacks like a duck, it's a duck"

class Dog:
    def speak(self):
        return "Woof!"

class Cat:
    def speak(self):
        return "Meow!"

class Robot:
    def speak(self):
        return "Beep boop!"

# No inheritance needed - just need a speak() method
def make_it_speak(entity):
    print(entity.speak())

# Works with any object that has speak()
make_it_speak(Dog())
make_it_speak(Cat())
make_it_speak(Robot())
```

#### Python - Operator Overloading (Python supports this well!)

```python
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    # Overload + operator
    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)
    
    # Overload * operator
    def __mul__(self, scalar):
        return Vector(self.x * scalar, self.y * scalar)
    
    # Overload == operator
    def __eq__(self, other):
        return self.x == other.x and self.y == other.y
    
    # Overload str() function
    def __str__(self):
        return f"Vector({self.x}, {self.y})"
    
    # Overload len() function
    def __len__(self):
        return int((self.x**2 + self.y**2)**0.5)

# Usage
v1 = Vector(2, 3)
v2 = Vector(4, 5)

v3 = v1 + v2      # Uses __add__
print(v3)         # Vector(6, 8)

v4 = v1 * 3       # Uses __mul__
print(v4)         # Vector(6, 9)

print(v1 == v2)   # False (uses __eq__)
print(len(v1))    # 3 (uses __len__)
```

#### C++ - Full Operator Overloading:

```cpp
#include <iostream>
using namespace std;

class Complex {
private:
    double real, imag;

public:
    Complex(double r = 0, double i = 0) : real(r), imag(i) {}
    
    // Overload + operator
    Complex operator+(const Complex& c) {
        return Complex(real + c.real, imag + c.imag);
    }
    
    // Overload - operator
    Complex operator-(const Complex& c) {
        return Complex(real - c.real, imag - c.imag);
    }
    
    // Overload * operator
    Complex operator*(const Complex& c) {
        return Complex(
            real * c.real - imag * c.imag,
            real * c.imag + imag * c.real
        );
    }
    
    // Overload == operator
    bool operator==(const Complex& c) {
        return (real == c.real && imag == c.imag);
    }
    
    // Overload << operator for output
    friend ostream& operator<<(ostream& os, const Complex& c) {
        os << c.real << " + " << c.imag << "i";
        return os;
    }
    
    // Overload ++ operator (prefix)
    Complex& operator++() {
        real++;
        imag++;
        return *this;
    }
    
    // Overload ++ operator (postfix)
    Complex operator++(int) {
        Complex temp = *this;
        real++;
        imag++;
        return temp;
    }
};

int main() {
    Complex c1(3, 4);
    Complex c2(1, 2);
    
    Complex c3 = c1 + c2;   // Uses operator+
    Complex c4 = c1 * c2;   // Uses operator*
    
    cout << c3 << endl;     // Uses operator<<
    cout << (c1 == c2) << endl;  // Uses operator==
    
    ++c1;                   // Uses prefix ++
    cout << c1 << endl;
    
    return 0;
}
```

#### TypeScript - Limited Operator Overloading:

TypeScript doesn't support operator overloading, but you can use methods:

```typescript
class Money {
    constructor(private amount: number, private currency: string) {}
    
    // Can't overload +, but can create methods
    add(other: Money): Money {
        if (this.currency !== other.currency) {
            throw new Error("Currency mismatch");
        }
        return new Money(this.amount + other.amount, this.currency);
    }
    
    multiply(factor: number): Money {
        return new Money(this.amount * factor, this.currency);
    }
    
    equals(other: Money): boolean {
        return this.amount === other.amount && 
               this.currency === other.currency;
    }
    
    toString(): string {
        return `${this.currency} ${this.amount}`;
    }
}

const price1 = new Money(100, "USD");
const price2 = new Money(50, "USD");

const total = price1.add(price2);  // Can't use: price1 + price2
console.log(total.toString());     // USD 150
```

#### Common Python Magic Methods for Operator Overloading:

```python
class CustomNumber:
    def __init__(self, value):
        self.value = value
    
    # Arithmetic
    def __add__(self, other):      # +
        return CustomNumber(self.value + other.value)
    
    def __sub__(self, other):      # -
        return CustomNumber(self.value - other.value)
    
    def __mul__(self, other):      # *
        return CustomNumber(self.value * other.value)
    
    def __truediv__(self, other):  # /
        return CustomNumber(self.value / other.value)
    
    def __floordiv__(self, other): # //
        return CustomNumber(self.value // other.value)
    
    def __mod__(self, other):      # %
        return CustomNumber(self.value % other.value)
    
    def __pow__(self, other):      # **
        return CustomNumber(self.value ** other.value)
    
    # Comparison
    def __eq__(self, other):       # ==
        return self.value == other.value
    
    def __ne__(self, other):       # !=
        return self.value != other.value
    
    def __lt__(self, other):       # <
        return self.value < other.value
    
    def __le__(self, other):       # <=
        return self.value <= other.value
    
    def __gt__(self, other):       # >
        return self.value > other.value
    
    def __ge__(self, other):       # >=
        return self.value >= other.value
    
    # Unary
    def __neg__(self):             # -x
        return CustomNumber(-self.value)
    
    def __pos__(self):             # +x
        return CustomNumber(+self.value)
    
    def __abs__(self):             # abs(x)
        return CustomNumber(abs(self.value))
    
    # Container
    def __len__(self):             # len(x)
        return self.value
    
    def __getitem__(self, key):    # x[key]
        return self.value
    
    def __setitem__(self, key, value):  # x[key] = value
        self.value = value
    
    # String representation
    def __str__(self):             # str(x)
        return f"CustomNumber({self.value})"
    
    def __repr__(self):            # repr(x)
        return f"CustomNumber({self.value})"
```

#### Polymorphism Without Inheritance

```python
len("hello")
len([1, 2, 3])
len((4, 5))
```

➡️ Same function, different objects

#### Real-Life Example

- **Print Function**: Same `print()` can handle strings, numbers, lists, objects - different types, same action.
- 📺 **Power Button**: Same button, TV, AC, Projector react differently, same action.

#### Interview Tip

"Polymorphism means **'many forms'**. It's like a universal adapter - one plug, many devices. Python uses **duck typing** - if it has the methods you need, it works!"

</details>

---

## SOLID Principles

SOLID is an acronym for five design principles that make software more understandable, flexible, and maintainable.

### Memory Trick for SOLID

**"Some Old Italian Lovers Dance"**
- **S** - Single Responsibility
- **O** - Open/Closed
- **L** - Liskov Substitution
- **I** - Interface Segregation
- **D** - Dependency Inversion

---

### 1. Single Responsibility Principle (SRP) 📌

**"One class should have only ONE reason to change"**

#### Real-Life Analogy

A **chef** cooks food. They don't also fix the plumbing, manage finances, and clean the restaurant. Each person has ONE job.

<details>
<summary><strong>View contents</strong></summary>

#### ❌ Bad Example

```python
class User:
    def __init__(self, name, email):
        self.name = name
        self.email = email
    
    def save_to_database(self):
        # Database logic
        print(f"Saving {self.name} to database...")
    
    def send_email(self):
        # Email logic
        print(f"Sending email to {self.email}...")
    
    def generate_report(self):
        # Report logic
        print(f"Generating report for {self.name}...")

# Too many responsibilities! Database, Email, Reporting
```

#### ✅ Good Example

```python
class User:
    def __init__(self, name, email):
        self.name = name
        self.email = email

class UserDatabase:
    def save(self, user):
        print(f"Saving {user.name} to database...")

class EmailService:
    def send_email(self, user):
        print(f"Sending email to {user.email}...")

class ReportGenerator:
    def generate(self, user):
        print(f"Generating report for {user.name}...")

# Each class has ONE responsibility
user = User("Alice", "alice@example.com")
UserDatabase().save(user)
EmailService().send_email(user)
ReportGenerator().generate(user)
```

#### Interview Tip

"SRP is about **separation of concerns**. If your class has AND in its description (saves AND emails AND reports), it's doing too much!"

</details>

---

### 2. Open/Closed Principle (OCP) 🔓

**"Classes should be OPEN for extension but CLOSED for modification"**

#### Real-Life Analogy

A **smartphone**: You can add apps (open for extension) without modifying the phone's hardware (closed for modification).

<details>
<summary><strong>View contents</strong></summary>

#### ❌ Bad Example

```python
class DiscountCalculator:
    def calculate_discount(self, customer_type, amount):
        if customer_type == "regular":
            return amount * 0.1
        elif customer_type == "premium":
            return amount * 0.2
        elif customer_type == "vip":
            return amount * 0.3
        # Need to modify this class for every new customer type!
```

#### ✅ Good Example

```python
from abc import ABC, abstractmethod

class DiscountStrategy(ABC):
    @abstractmethod
    def calculate(self, amount):
        pass

class RegularDiscount(DiscountStrategy):
    def calculate(self, amount):
        return amount * 0.1

class PremiumDiscount(DiscountStrategy):
    def calculate(self, amount):
        return amount * 0.2

class VIPDiscount(DiscountStrategy):
    def calculate(self, amount):
        return amount * 0.3

class DiscountCalculator:
    def calculate_discount(self, strategy: DiscountStrategy, amount):
        return strategy.calculate(amount)

# Adding new discount types doesn't require changing existing code
class SuperVIPDiscount(DiscountStrategy):
    def calculate(self, amount):
        return amount * 0.5

# Usage
calculator = DiscountCalculator()
print(calculator.calculate_discount(RegularDiscount(), 100))
print(calculator.calculate_discount(SuperVIPDiscount(), 100))
```

#### Interview Tip

"OCP means **plug-and-play**. You can add new features without breaking existing code. Think of USB ports - new devices work without redesigning the port."

</details>

---

### 3. Liskov Substitution Principle (LSP) 🔄

**"Subtypes must be substitutable for their base types"**. Child class should replace parent **without breaking behavior**

#### Real-Life Analogy

- **Car keys**: If you have a key that opens your car, a spare key should also open it. The spare shouldn't require a different ignition system.
- 🔋 **AA battery**: Replace AA battery with another AA battery — device still works

<details>
<summary><strong>View contents</strong></summary>

#### ❌ Bad Example

```python
class Bird:
    def fly(self):
        return "Flying..."

class Sparrow(Bird):
    def fly(self):
        return "Sparrow flying!"

class Penguin(Bird):
    def fly(self):
        raise Exception("Penguins can't fly!")
        # Violates LSP - can't substitute Penguin for Bird

def make_bird_fly(bird: Bird):
    print(bird.fly())

make_bird_fly(Sparrow())  # ✅ Works
make_bird_fly(Penguin())  # ❌ Crashes!
```

#### ✅ Good Example

```python
class Bird:
    def move(self):
        pass

class FlyingBird(Bird):
    def move(self):
        return "Flying..."
    
    def fly(self):
        return "Soaring through the sky!"

class Sparrow(FlyingBird):
    def fly(self):
        return "Sparrow flying!"

class Penguin(Bird):
    def move(self):
        return "Swimming..."
    
    def swim(self):
        return "Penguin swimming!"

# Now we can safely substitute any Bird
def make_bird_move(bird: Bird):
    print(bird.move())

make_bird_move(Sparrow())  # ✅ Works
make_bird_move(Penguin())  # ✅ Works
```

#### Interview Tip

"LSP is about **behavioral consistency**. If a function expects a parent type, any child type should work without surprises. Don't make promises you can't keep!"

</details>

---

### 4. Interface Segregation Principle (ISP) ✂️

**"Clients shouldn't be forced to depend on interfaces they don't use"**. Don’t force classes to implement unused methods.

#### Real-Life Analogy

**Restaurant menu**: A vegetarian doesn't need to see meat dishes. Split menus instead of one giant menu everyone must read.

<details>
<summary><strong>View contents</strong></summary>

#### ❌ Bad Example

```python
from abc import ABC, abstractmethod

class Worker(ABC):
    @abstractmethod
    def work(self):
        pass
    
    @abstractmethod
    def eat(self):
        pass
    
    @abstractmethod
    def sleep(self):
        pass

class Human(Worker):
    def work(self):
        return "Working..."
    
    def eat(self):
        return "Eating lunch..."
    
    def sleep(self):
        return "Sleeping..."

class Robot(Worker):
    def work(self):
        return "Working..."
    
    def eat(self):
        raise Exception("Robots don't eat!")  # Forced to implement
    
    def sleep(self):
        raise Exception("Robots don't sleep!")  # Forced to implement
```

#### ✅ Good Example

```python
from abc import ABC, abstractmethod

class Workable(ABC):
    @abstractmethod
    def work(self):
        pass

class Eatable(ABC):
    @abstractmethod
    def eat(self):
        pass

class Sleepable(ABC):
    @abstractmethod
    def sleep(self):
        pass

class Human(Workable, Eatable, Sleepable):
    def work(self):
        return "Working..."
    
    def eat(self):
        return "Eating lunch..."
    
    def sleep(self):
        return "Sleeping..."

class Robot(Workable):  # Only implements what it needs
    def work(self):
        return "Working..."

# Usage
def make_work(worker: Workable):
    print(worker.work())

make_work(Human())
make_work(Robot())
```

#### Interview Tip

"ISP is about **lean interfaces**. Don't create fat interfaces that force classes to implement methods they don't need. Think of role-specific forms, not one giant questionnaire."

</details>

---

### 5. Dependency Inversion Principle (DIP) 🔌

**"Depend on abstractions, not on concretions"**

#### Real-Life Analogy

**Power outlets**: Your laptop doesn't depend on a specific power plant. It depends on a standard outlet (abstraction). Any power source that provides the right voltage works.

<details>
<summary><strong>View contents</strong></summary>

#### ❌ Bad Example

```python
class MySQLDatabase:
    def connect(self):
        return "Connected to MySQL"

class UserService:
    def __init__(self):
        self.database = MySQLDatabase()  # Tightly coupled!
    
    def get_user(self):
        connection = self.database.connect()
        return f"{connection}, fetching user..."

# If we want to switch to PostgreSQL, we must modify UserService
```

#### ✅ Good Example

```python
from abc import ABC, abstractmethod

# Abstraction
class Database(ABC):
    @abstractmethod
    def connect(self):
        pass

# Concrete implementations
class MySQLDatabase(Database):
    def connect(self):
        return "Connected to MySQL"

class PostgreSQLDatabase(Database):
    def connect(self):
        return "Connected to PostgreSQL"

class MongoDatabase(Database):
    def connect(self):
        return "Connected to MongoDB"

# High-level module depends on abstraction
class UserService:
    def __init__(self, database: Database):
        self.database = database  # Depends on abstraction!
    
    def get_user(self):
        connection = self.database.connect()
        return f"{connection}, fetching user..."

# Usage - easily switch databases
service1 = UserService(MySQLDatabase())
print(service1.get_user())

service2 = UserService(PostgreSQLDatabase())
print(service2.get_user())

service3 = UserService(MongoDatabase())
print(service3.get_user())
```

#### Interview Tip

"DIP is about **flexibility through abstraction**. Your code should depend on contracts (interfaces), not concrete implementations. It's like having a universal charger instead of phone-specific ones."

</details>

---

## Memory Tips & Tricks

<details>
<summary><strong>View contents</strong></summary>

### 1. Remember the Four Pillars (AEIP)

**Mnemonic: "All Elephants Inherit Pink"**
- **A**bstraction - Hiding complexity
- **E**ncapsulation - Data protection
- **I**nheritance - Code reuse
- **P**olymorphism - Many forms

### 2. Visual Memory Aids

```
Encapsulation 🔒 = Capsule (medicine) - contents hidden inside
Abstraction 🎭 = Theater mask - shows character, hides actor
Inheritance 👨‍👩‍👧 = Family tree - traits passed down
Polymorphism 🎨 = Chameleon - same animal, different colors
```

### 3. Remember SOLID

**Story: "Some Old Italian Lovers Dance"**
- **S** - SRP: One chef, one job
- **O** - OCP: Smartphone apps (extend, don't modify)
- **L** - LSP: Spare key works like original
- **I** - ISP: Vegetarian menu (only relevant options)
- **D** - DIP: Universal power outlet (abstraction)

### 4. Quick Comparison Table

| Concept | Question to Ask | Answer |
|---------|----------------|--------|
| Encapsulation | Can outsiders access internal data directly? | No, use methods |
| Abstraction | Do users need to know HOW it works? | No, just WHAT it does |
| Inheritance | Can I reuse this code? | Yes, extend parent class |
| Polymorphism | Can one interface handle multiple types? | Yes, override methods |

### 5. Interview Cheat Phrases

- **Encapsulation**: "Data hiding and controlled access"
- **Abstraction**: "Essential features only, hide complexity"
- **Inheritance**: "IS-A relationship, code reuse"
- **Polymorphism**: "Same interface, different implementations"
- **Composition**: "HAS-A relationship, flexible and loosely coupled"
- **Dependency Injection**: "Inject dependencies instead of creating them"
- **Strategy Pattern**: "Switchable behavior at runtime"

### 6. Remember When to Use What

**Quick Decision Flowchart:**

```
Need a relationship?
    ├── IS-A? → Inheritance (Dog IS-A Animal)
    ├── HAS-A? → Composition (Car HAS-AN Engine)
    └── USES? → Dependency Injection (Service USES Logger)

Need flexibility?
    ├── Switch behavior at runtime? → Strategy Pattern
    ├── Create objects without knowing type? → Factory Pattern
    └── Notify multiple objects? → Observer Pattern

Comparing options?
    ├── Abstract Class vs Interface?
    │   ├── Need to share code? → Abstract Class
    │   └── Just need contract? → Interface/Protocol
    │
    └── Inheritance vs Composition?
        ├── Simple, stable hierarchy? → Inheritance (maybe)
        └── Everything else? → Composition
```

### 7. Language-Specific Memory Aids

**Python Strengths:**
- ✅ Duck typing (no interfaces needed)
- ✅ Operator overloading (magic methods)
- ✅ Multiple inheritance (with MRO)
- ❌ No true method overloading (use default params)
- ❌ No true private variables (use conventions)

**TypeScript/JavaScript Strengths:**
- ✅ True interfaces
- ✅ Method overloading (signatures only)
- ✅ Async/await for composition
- ❌ No operator overloading
- ❌ No multiple inheritance (use interfaces)

**C++ Strengths:**
- ✅ Full operator overloading
- ✅ True method overloading
- ✅ Multiple inheritance
- ✅ Destructors (manual memory management)
- ❌ More complex syntax

</details>

---

## Language Feature Comparison

Understanding which language best demonstrates each OOP concept:

| Feature | Python | TypeScript | C++ | Best For Learning |
|---------|--------|-----------|-----|-------------------|
| **Classes & Objects** | ✅ Simple | ✅ Simple | ✅ Complex | Python |
| **Encapsulation** | ⚠️ Convention-based | ✅ True private | ✅ True private | TypeScript/C++ |
| **Abstraction** | ✅ ABC module | ✅ Interfaces | ✅ Abstract classes | TypeScript |
| **Inheritance** | ✅ Multiple | ⚠️ Single (+ interfaces) | ✅ Multiple | Python/C++ |
| **Polymorphism** | ✅ Duck typing | ✅ Type-based | ✅ Type-based | Python (easiest) |
| **Method Overloading** | ❌ No | ✅ Yes | ✅ Yes | C++ |
| **Operator Overloading** | ✅ Yes | ❌ No | ✅ Yes | Python/C++ |
| **Interfaces** | ⚠️ Protocol | ✅ True interfaces | ⚠️ Abstract classes | TypeScript |
| **Property Decorators** | ✅ @property | ✅ get/set | ❌ Verbose | Python |
| **Type Safety** | ⚠️ Optional | ✅ Strong | ✅ Strong | TypeScript |

<details>
<summary><strong>View contents</strong></summary>

### When to Use Each Language for Examples:

**Use Python for:**
- Basic OOP concepts (classes, objects)
- Duck typing and polymorphism
- Operator overloading
- Quick prototyping
- Real-world scenarios

**Use TypeScript for:**
- Interfaces and contracts
- Type-safe polymorphism
- Method overloading (signatures)
- Modern web development patterns
- Dependency injection patterns

**Use C++ for:**
- Complete operator overloading
- Memory management concepts
- True method overloading
- Performance-critical OOP
- Systems programming

</details>

---

## Common Interview Mistakes to Avoid

<details>
<summary><strong>View contents</strong></summary>

### ❌ Mistake 1: Confusing Overloading and Overriding

```python
# Wrong explanation:
"Overloading is when you change a parent's method" ❌

# Right explanation:
"Overloading: Same name, different parameters (compile-time)
 Overriding: Same signature, different implementation (runtime)"
```

### ❌ Mistake 2: Using Inheritance for Code Reuse

```python
# ❌ Bad reasoning
"I'll use inheritance because I want to reuse code"

# ✅ Good reasoning
"I'll use inheritance because there's a genuine IS-A relationship
 Otherwise, I'll use composition for code reuse"
```

### ❌ Mistake 3: Not Understanding the Difference

```python
# ❌ Vague answer
"Abstraction and Encapsulation are similar..."

# ✅ Clear answer
"Abstraction HIDES COMPLEXITY (HOW things work)
 Encapsulation PROTECTS DATA (controlling access)
 Example: TV remote is abstraction (simple interface)
          TV's internal components are encapsulated (can't touch)"
```

### ❌ Mistake 4: Wrong SOLID Explanation

```python
# ❌ Wrong
"Open/Closed means classes should be open"

# ✅ Correct
"Open/Closed: Open for EXTENSION (add features)
               Closed for MODIFICATION (don't change existing code)
 Example: Plugin architecture - add plugins without modifying core"
```

### ❌ Mistake 5: Ignoring Trade-offs

```python
# ❌ Absolute answer
"Always use composition, never use inheritance!"

# ✅ Nuanced answer
"Prefer composition for flexibility, but inheritance is fine for:
 - Clear, stable IS-A relationships
 - Shallow hierarchies (2-3 levels max)
 - When you need polymorphic behavior through class hierarchy"
```

</details>

---

## Real-World Scenarios

### Scenario 1: E-commerce System

**Problem**: Build a payment processing system that supports multiple payment methods.

<details>
<summary><strong>View contents</strong></summary>

**Wrong Approach (Deep Inheritance):**
```python
# ❌ Bad
class Payment:
    pass

class OnlinePayment(Payment):
    pass

class OfflinePayment(Payment):
    pass

class CreditCardPayment(OnlinePayment):
    pass

class DebitCardPayment(OnlinePayment):
    pass
# Becomes unmaintainable!
```

**Right Approach (Composition + Strategy):**
```python
# ✅ Good
from abc import ABC, abstractmethod

class PaymentStrategy(ABC):
    @abstractmethod
    def process(self, amount):
        pass

class CreditCardPayment(PaymentStrategy):
    def process(self, amount):
        return f"Processing ${amount} via Credit Card"

class PayPalPayment(PaymentStrategy):
    def process(self, amount):
        return f"Processing ${amount} via PayPal"

class Order:
    def __init__(self, payment_strategy: PaymentStrategy):
        self.payment = payment_strategy
    
    def checkout(self, amount):
        return self.payment.process(amount)

# Easy to add new payment methods without changing Order
class CryptoPayment(PaymentStrategy):
    def process(self, amount):
        return f"Processing ${amount} via Cryptocurrency"
```

</details>

### Scenario 2: Logging System

**Problem**: Need logging that can output to console, file, or database.

<details>
<summary><strong>View contents</strong></summary>

**Solution using Dependency Injection:**
```typescript
// TypeScript example
interface Logger {
    log(message: string): void;
}

class ConsoleLogger implements Logger {
    log(message: string): void {
        console.log(`[CONSOLE] ${message}`);
    }
}

class FileLogger implements Logger {
    constructor(private filename: string) {}
    
    log(message: string): void {
        // Write to file
        console.log(`[FILE: ${this.filename}] ${message}`);
    }
}

class DatabaseLogger implements Logger {
    log(message: string): void {
        // Save to database
        console.log(`[DATABASE] ${message}`);
    }
}

// Application uses abstraction
class UserService {
    constructor(private logger: Logger) {}  // DI!
    
    createUser(name: string): string {
        this.logger.log(`Creating user: ${name}`);
        return `User ${name} created`;
    }
}

// Production - use file logger
const prodLogger = new FileLogger('prod.log');
const prodService = new UserService(prodLogger);

// Development - use console
const devLogger = new ConsoleLogger();
const devService = new UserService(devLogger);

// Testing - use mock
class MockLogger implements Logger {
    messages: string[] = [];
    log(message: string): void {
        this.messages.push(message);
    }
}

const mockLogger = new MockLogger();
const testService = new UserService(mockLogger);
testService.createUser('TestUser');
console.log(mockLogger.messages);  // Verify in tests
```

</details>

### Scenario 3: Game Characters

**Problem**: Build a game with characters having different abilities.

<details>
<summary><strong>View contents</strong></summary>

**Solution using Composition:**
```python
# Instead of deep inheritance, use components
class Movement:
    def move(self):
        pass

class Walking(Movement):
    def move(self):
        return "Walking..."

class Flying(Movement):
    def move(self):
        return "Flying..."

class Swimming(Movement):
    def move(self):
        return "Swimming..."

class Attack:
    def attack(self):
        pass

class MeleeAttack(Attack):
    def attack(self):
        return "Sword slash!"

class RangedAttack(Attack):
    def attack(self):
        return "Arrow shot!"

class MagicAttack(Attack):
    def attack(self):
        return "Fireball!"

class Character:
    def __init__(self, name, movement: Movement, attack: Attack):
        self.name = name
        self.movement = movement
        self.attack = attack
    
    def perform_move(self):
        return f"{self.name}: {self.movement.move()}"
    
    def perform_attack(self):
        return f"{self.name}: {self.attack.attack()}"

# Flexible character creation!
warrior = Character("Warrior", Walking(), MeleeAttack())
mage = Character("Mage", Flying(), MagicAttack())
archer = Character("Archer", Walking(), RangedAttack())
dragon = Character("Dragon", Flying(), MeleeAttack())

# Easy to change abilities at runtime
warrior.movement = Swimming()  # Warrior learned to swim!
```

</details>

---

## Advanced OOP Concepts

### 1. Dependency Injection (DI) 💉

**What is it?**
Instead of a class creating its dependencies, they're "injected" from outside.

<details>
<summary><strong>View contents</strong></summary>

#### **Without DI (Bad):**

```python
# ❌ Tightly coupled - hard to test, inflexible
class EmailService:
    def send(self, message):
        print(f"Sending email: {message}")

class UserService:
    def __init__(self):
        self.email_service = EmailService()  # Created internally!
    
    def register_user(self, username):
        # Business logic
        self.email_service.send(f"Welcome {username}!")
        return "User registered"

# Problem: Can't test without sending real emails!
# Problem: Can't switch to SMS notification easily!
```

#### **With DI (Good):**

```python
# ✅ Loosely coupled - testable, flexible
from abc import ABC, abstractmethod

class NotificationService(ABC):
    @abstractmethod
    def send(self, message):
        pass

class EmailService(NotificationService):
    def send(self, message):
        print(f"Sending email: {message}")

class SMSService(NotificationService):
    def send(self, message):
        print(f"Sending SMS: {message}")

class PushNotificationService(NotificationService):
    def send(self, message):
        print(f"Sending push notification: {message}")

class UserService:
    def __init__(self, notification_service: NotificationService):
        self.notification_service = notification_service  # Injected!
    
    def register_user(self, username):
        # Business logic
        self.notification_service.send(f"Welcome {username}!")
        return "User registered"

# Usage - Easy to switch implementations
email_notifier = EmailService()
user_service = UserService(email_notifier)
user_service.register_user("Alice")

# Switch to SMS
sms_notifier = SMSService()
user_service = UserService(sms_notifier)
user_service.register_user("Bob")

# For testing - use a mock
class MockNotificationService(NotificationService):
    def __init__(self):
        self.messages = []
    
    def send(self, message):
        self.messages.append(message)

mock = MockNotificationService()
test_service = UserService(mock)
test_service.register_user("Test")
assert "Welcome Test!" in mock.messages  # Easy to test!
```

#### **TypeScript DI with Decorators:**

```typescript
// Modern framework approach (like Angular/NestJS)
interface Logger {
    log(message: string): void;
}

class ConsoleLogger implements Logger {
    log(message: string): void {
        console.log(`[LOG]: ${message}`);
    }
}

class FileLogger implements Logger {
    log(message: string): void {
        // Write to file
        console.log(`[FILE]: ${message}`);
    }
}

class UserController {
    // Dependency injected via constructor
    constructor(private logger: Logger) {}
    
    createUser(name: string): string {
        this.logger.log(`Creating user: ${name}`);
        return `User ${name} created`;
    }
}

// Dependency Injection Container (simplified)
class DIContainer {
    private services = new Map();
    
    register<T>(key: string, service: T): void {
        this.services.set(key, service);
    }
    
    resolve<T>(key: string): T {
        return this.services.get(key);
    }
}

// Setup
const container = new DIContainer();
container.register('logger', new ConsoleLogger());

const logger = container.resolve<Logger>('logger');
const controller = new UserController(logger);
controller.createUser('Alice');
```

#### **Benefits of DI:**
1. **Testability** - Easy to inject mocks
2. **Flexibility** - Swap implementations easily
3. **Loose Coupling** - Classes don't create dependencies
4. **Single Responsibility** - Classes focus on their job, not creating dependencies

</details>

---

### 2. Abstract Classes vs Interfaces

Python doesn't have true interfaces, but we can compare concepts:

<details>
<summary><strong>View contents</strong></summary>

#### **Abstract Classes:**

```python
from abc import ABC, abstractmethod

class Animal(ABC):
    def __init__(self, name):
        self.name = name  # Can have state!
    
    @abstractmethod
    def make_sound(self):
        pass
    
    # Can have concrete methods
    def sleep(self):
        return f"{self.name} is sleeping"

class Dog(Animal):
    def make_sound(self):
        return "Woof!"

# animal = Animal("Generic")  # ❌ Error: Can't instantiate abstract class
dog = Dog("Buddy")
print(dog.make_sound())  # Woof!
print(dog.sleep())       # Buddy is sleeping
```

#### **Protocol (Interface-like in Python 3.8+):**

```python
from typing import Protocol

class Drawable(Protocol):
    # No implementation, just signature
    def draw(self) -> str:
        ...

class Circle:
    def draw(self) -> str:
        return "Drawing circle"

class Square:
    def draw(self) -> str:
        return "Drawing square"

# Duck typing - no inheritance needed!
def render(shape: Drawable):
    print(shape.draw())

render(Circle())  # Works!
render(Square())  # Works!
```

#### **TypeScript - True Interfaces:**

```typescript
// Interface - pure contract, no implementation
interface Flyable {
    fly(): string;
    altitude: number;
}

interface Swimmable {
    swim(): string;
}

// Can implement multiple interfaces
class Duck implements Flyable, Swimmable {
    altitude: number = 0;
    
    fly(): string {
        return "Duck flying";
    }
    
    swim(): string {
        return "Duck swimming";
    }
}

// Abstract class - can have implementation
abstract class Bird {
    protected name: string;
    
    constructor(name: string) {
        this.name = name;
    }
    
    // Concrete method
    eat(): string {
        return `${this.name} is eating`;
    }
    
    // Abstract method
    abstract makeSound(): string;
}

class Parrot extends Bird {
    makeSound(): string {
        return "Squawk!";
    }
}
```

#### **When to Use What:**

| Feature | Abstract Class | Interface/Protocol |
|---------|---------------|-------------------|
| Can have state (properties) | ✅ Yes | ❌ No |
| Can have concrete methods | ✅ Yes | ❌ No (usually) |
| Multiple inheritance | ❌ No (single in Python) | ✅ Yes |
| Use case | Share code + enforce contract | Pure contract only |
| Example | Animal (has name, age) | Drawable (just draw()) |

**Rule of Thumb:**
- **Abstract Class**: When you need to share code AND enforce contract
- **Interface**: When you only need to define a contract

</details>

---

### 3. When to Use What: Decision Matrix

#### **Inheritance vs Composition vs DI:**

<details>
<summary><strong>View contents</strong></summary>

```python
# Scenario 1: Simple hierarchy - Use INHERITANCE
class Shape:
    def area(self):
        pass

class Circle(Shape):  # IS-A relationship
    def __init__(self, radius):
        self.radius = radius
    
    def area(self):
        return 3.14 * self.radius ** 2

# Scenario 2: Multiple behaviors - Use COMPOSITION
class Logger:
    def log(self, msg):
        print(f"LOG: {msg}")

class Database:
    def save(self, data):
        print(f"Saving: {data}")

class UserService:
    def __init__(self):
        self.logger = Logger()    # HAS-A Logger
        self.db = Database()      # HAS-A Database
    
    def create_user(self, name):
        self.logger.log(f"Creating user: {name}")
        self.db.save(name)

# Scenario 3: Need flexibility/testing - Use DI
class UserService:
    def __init__(self, logger, database):  # Dependencies injected
        self.logger = logger
        self.database = database
    
    def create_user(self, name):
        self.logger.log(f"Creating user: {name}")
        self.database.save(name)

# Can inject mocks for testing
service = UserService(MockLogger(), MockDatabase())
```

#### **Quick Decision Guide:**

```
Question: What's the relationship?

1. "X IS-A Y" (Dog is an Animal)
   → Use INHERITANCE
   
2. "X HAS-A Y" (Car has an Engine)
   → Use COMPOSITION
   
3. "X USES Y" (UserService uses Logger)
   → Use DEPENDENCY INJECTION
   
4. "X BEHAVES LIKE Y" (Duck behaves like Flyable)
   → Use INTERFACE/PROTOCOL
   
5. "X SHARES CODE WITH Y" (Dog and Cat share Animal behavior)
   → Use ABSTRACT CLASS
```

</details>

---

### 4. Common Design Patterns

#### **Strategy Pattern (Composition over Inheritance):**

<details>
<summary><strong>View contents</strong></summary>

```python
from abc import ABC, abstractmethod

# Instead of inheritance, use strategies
class SortStrategy(ABC):
    @abstractmethod
    def sort(self, data):
        pass

class QuickSort(SortStrategy):
    def sort(self, data):
        # Quick sort implementation
        return sorted(data)  # Simplified

class MergeSort(SortStrategy):
    def sort(self, data):
        # Merge sort implementation
        return sorted(data)  # Simplified

class BubbleSort(SortStrategy):
    def sort(self, data):
        # Bubble sort implementation
        return sorted(data)  # Simplified

class DataProcessor:
    def __init__(self, strategy: SortStrategy):
        self.strategy = strategy
    
    def process(self, data):
        print(f"Using {self.strategy.__class__.__name__}")
        return self.strategy.sort(data)

# Easy to switch algorithms
data = [5, 2, 8, 1, 9]
processor = DataProcessor(QuickSort())
print(processor.process(data))

# Switch strategy at runtime
processor.strategy = MergeSort()
print(processor.process(data))
```

</details>

#### **Factory Pattern (Create objects without specifying exact class):**

<details>
<summary><strong>View contents</strong></summary>

```typescript
// TypeScript example
interface Animal {
    speak(): string;
}

class Dog implements Animal {
    speak(): string {
        return "Woof!";
    }
}

class Cat implements Animal {
    speak(): string {
        return "Meow!";
    }
}

class Bird implements Animal {
    speak(): string {
        return "Tweet!";
    }
}

// Factory - encapsulates object creation
class AnimalFactory {
    static createAnimal(type: string): Animal {
        switch(type.toLowerCase()) {
            case 'dog':
                return new Dog();
            case 'cat':
                return new Cat();
            case 'bird':
                return new Bird();
            default:
                throw new Error('Unknown animal type');
        }
    }
}

// Usage - don't need to know concrete classes
const animal1 = AnimalFactory.createAnimal('dog');
const animal2 = AnimalFactory.createAnimal('cat');

console.log(animal1.speak());  // Woof!
console.log(animal2.speak());  // Meow!
```

</details>

#### **Observer Pattern (Pub-Sub):**

<details>
<summary><strong>View contents</strong></summary>

```python
class Subject:
    def __init__(self):
        self._observers = []
    
    def attach(self, observer):
        self._observers.append(observer)
    
    def detach(self, observer):
        self._observers.remove(observer)
    
    def notify(self, message):
        for observer in self._observers:
            observer.update(message)

class Observer(ABC):
    @abstractmethod
    def update(self, message):
        pass

class EmailSubscriber(Observer):
    def __init__(self, email):
        self.email = email
    
    def update(self, message):
        print(f"Email to {self.email}: {message}")

class SMSSubscriber(Observer):
    def __init__(self, phone):
        self.phone = phone
    
    def update(self, message):
        print(f"SMS to {self.phone}: {message}")

# Usage
blog = Subject()
blog.attach(EmailSubscriber("alice@email.com"))
blog.attach(SMSSubscriber("555-1234"))

blog.notify("New post published!")
# Output:
# Email to alice@email.com: New post published!
# SMS to 555-1234: New post published!
```

</details>

---

### 5. Anti-Patterns to Avoid

#### **1. God Object (Knows/Does Everything):**

<details>
<summary><strong>View contents</strong></summary>

```python
# ❌ BAD
class UserManager:
    def create_user(self): pass
    def delete_user(self): pass
    def send_email(self): pass
    def log_activity(self): pass
    def process_payment(self): pass
    def generate_report(self): pass
    def backup_database(self): pass
    # ... does everything!

# ✅ GOOD - Split responsibilities
class UserService:
    def create_user(self): pass
    def delete_user(self): pass

class EmailService:
    def send_email(self): pass

class PaymentService:
    def process_payment(self): pass
```

</details>

#### **2. Yo-Yo Problem (Too many inheritance levels):**

<details>
<summary><strong>View contents</strong></summary>

```python
# ❌ BAD
class A:
    def method(self): pass

class B(A):
    def method(self): pass

class C(B):
    def method(self): pass

class D(C):
    def method(self): pass

class E(D):
    def method(self): pass  # Yo-yo up and down!

# ✅ GOOD - Flatten or use composition
class Component:
    def method(self): pass

class Service:
    def __init__(self):
        self.component = Component()
```

</details>

#### **3. Circular Dependencies:**

<details>
<summary><strong>View contents</strong></summary>

```python
# ❌ BAD
class A:
    def __init__(self):
        self.b = B()  # A depends on B

class B:
    def __init__(self):
        self.a = A()  # B depends on A - CIRCULAR!

# ✅ GOOD - Use DI or mediator
class Mediator:
    def coordinate(self, a, b):
        pass

class A:
    def __init__(self, mediator):
        self.mediator = mediator

class B:
    def __init__(self, mediator):
        self.mediator = mediator
```

</details>

---

## Interview Questions & Answers

### Q1: What's the difference between Abstraction and Encapsulation?

<details>
<summary><strong>View contents</strong></summary>

**Answer:**
"While they're related, they serve different purposes:

**Encapsulation** is about **data protection** - bundling data and methods, making data private, and providing controlled access through public methods. It's like a capsule - you can't access what's inside directly.

**Abstraction** is about **hiding complexity** - showing only essential features and hiding implementation details. It's like a TV remote - you press buttons without knowing the electronics inside.

Example: A car engine is **encapsulated** (you can't touch it directly), but the steering wheel/pedals are **abstraction** (simple interface hiding complex mechanics)."

</details>

---

### Q2: Explain Method Overriding vs Method Overloading

<details>
<summary><strong>View contents</strong></summary>

**Answer:**

**Method Overriding (Runtime Polymorphism)**
```python
# Python - Works perfectly
class Animal:
    def sound(self):
        return "Some sound"

class Dog(Animal):
    def sound(self):  # Same signature, different implementation
        return "Woof"
```

**Method Overloading (Compile-time Polymorphism)**

Python doesn't support true method overloading. Here's why and how other languages do it:

```typescript
// TypeScript - True method overloading
class Calculator {
    // Multiple signatures
    add(a: number, b: number): number;
    add(a: string, b: string): string;
    add(a: number[], b: number[]): number[];
    
    // Implementation
    add(a: any, b: any): any {
        if (typeof a === 'number' && typeof b === 'number') {
            return a + b;
        }
        if (typeof a === 'string' && typeof b === 'string') {
            return a + b;
        }
        if (Array.isArray(a) && Array.isArray(b)) {
            return [...a, ...b];
        }
    }
}

const calc = new Calculator();
console.log(calc.add(2, 3));           // 5 (number)
console.log(calc.add("Hello", "World")); // "HelloWorld" (string)
console.log(calc.add([1,2], [3,4]));   // [1,2,3,4] (array)
```

```cpp
// C++ - True method overloading
class Calculator {
public:
    int add(int a, int b) {
        return a + b;
    }
    
    double add(double a, double b) {
        return a + b;
    }
    
    string add(string a, string b) {
        return a + b;
    }
};

Calculator calc;
cout << calc.add(5, 3);           // 8 (int)
cout << calc.add(5.5, 3.2);       // 8.7 (double)
cout << calc.add("Hi", "There");  // "HiThere" (string)
```

**Python Workaround:**
```python
from typing import overload, Union

class Calculator:
    # Type hints for IDE support (not enforced at runtime)
    @overload
    def add(self, a: int, b: int) -> int: ...
    
    @overload
    def add(self, a: str, b: str) -> str: ...
    
    # Actual implementation
    def add(self, a: Union[int, str], b: Union[int, str]) -> Union[int, str]:
        return a + b

# Or use default parameters
class Calculator2:
    def add(self, a, b=None, c=None):
        if b is None:
            return a
        if c is None:
            return a + b
        return a + b + c
```

**Key Difference:**
- **Overriding**: Same signature, different behavior (inheritance-based)
- **Overloading**: Same name, different signatures (parameter-based)

</details>

---

### Q3: What's the Diamond Problem?

<details>
<summary><strong>View contents</strong></summary>

**Answer:**
"The diamond problem occurs in multiple inheritance when two parent classes inherit from the same grandparent class, creating ambiguity.

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

class D(B, C):  # Which method() does D inherit?
    pass

d = D()
print(d.method())  # Python uses MRO (Method Resolution Order)
print(D.__mro__)   # Shows: D -> B -> C -> A
```

Python solves this using **MRO (Method Resolution Order)** - left-to-right, depth-first search. So `D` inherits from `B` first."

</details>

---

### Q4: When to use Composition vs Inheritance?

<details>
<summary><strong>View contents</strong></summary>

**Answer:**
"This is one of the most important design decisions in OOP!"

**The Golden Rule: "Favor Composition over Inheritance"**

#### **Use INHERITANCE when:**
1. There's a clear IS-A relationship
2. Child needs all parent functionality
3. Hierarchy is stable and unlikely to change
4. You need polymorphic behavior

```python
# ✅ Good use of Inheritance
class Animal:
    def breathe(self):
        return "Breathing..."
    
    def eat(self):
        return "Eating..."

class Dog(Animal):  # Dog IS-A Animal ✅
    def bark(self):
        return "Woof!"

class Cat(Animal):  # Cat IS-A Animal ✅
    def meow(self):
        return "Meow!"
```

#### **Use COMPOSITION when:**
1. There's a HAS-A relationship
2. You need flexibility to change behavior at runtime
3. You want to avoid deep inheritance hierarchies
4. You need to combine behaviors from multiple sources

```python
# ✅ Good use of Composition
class Engine:
    def start(self):
        return "Engine started"
    
    def stop(self):
        return "Engine stopped"

class GPS:
    def navigate(self, destination):
        return f"Navigating to {destination}"

class MusicSystem:
    def play(self, song):
        return f"Playing {song}"

class Car:
    def __init__(self):
        self.engine = Engine()        # HAS-A Engine
        self.gps = GPS()             # HAS-A GPS
        self.music = MusicSystem()   # HAS-A MusicSystem
    
    def start_journey(self, destination, song):
        print(self.engine.start())
        print(self.gps.navigate(destination))
        print(self.music.play(song))
        return "Journey started!"

# Easy to swap components
class ElectricEngine:
    def start(self):
        return "Electric motor activated"

car = Car()
car.engine = ElectricEngine()  # Runtime flexibility!
```

#### **Problems with Deep Inheritance:**

```python
# ❌ BAD - Inheritance Hell
class Vehicle:
    pass

class LandVehicle(Vehicle):
    pass

class WaterVehicle(Vehicle):
    pass

class AmphibiousVehicle(LandVehicle, WaterVehicle):  # Multiple inheritance!
    pass

class Car(LandVehicle):
    pass

class Truck(Car):
    pass

class PickupTruck(Truck):
    pass

class ElectricPickupTruck(PickupTruck):  # Too deep! Fragile!
    pass

# Problems:
# 1. Fragile base class problem - change Vehicle, breaks everything
# 2. Diamond problem with multiple inheritance
# 3. Hard to understand and maintain
# 4. Tight coupling
```

```python
# ✅ GOOD - Composition
class Movable:
    def move(self):
        pass

class LandMovement(Movable):
    def move(self):
        return "Moving on land"

class WaterMovement(Movable):
    def move(self):
        return "Moving on water"

class Vehicle:
    def __init__(self, movement_strategy: Movable):
        self.movement = movement_strategy
    
    def travel(self):
        return self.movement.move()

# Flexible and easy to test
car = Vehicle(LandMovement())
boat = Vehicle(WaterMovement())
amphibious = Vehicle(LandMovement())  # Can switch at runtime!

# Want it to swim now?
amphibious.movement = WaterMovement()
```

#### **Real-World Comparison:**

**TypeScript Example - Strategy Pattern (Composition):**

```typescript
// Instead of inheritance, use composition with strategies
interface PaymentStrategy {
    pay(amount: number): string;
}

class CreditCardPayment implements PaymentStrategy {
    constructor(private cardNumber: string) {}
    
    pay(amount: number): string {
        return `Paid ${amount} with credit card ${this.cardNumber}`;
    }
}

class PayPalPayment implements PaymentStrategy {
    constructor(private email: string) {}
    
    pay(amount: number): string {
        return `Paid ${amount} via PayPal ${this.email}`;
    }
}

class CryptoPayment implements PaymentStrategy {
    constructor(private walletAddress: string) {}
    
    pay(amount: number): string {
        return `Paid ${amount} with crypto to ${this.walletAddress}`;
    }
}

class ShoppingCart {
    private items: string[] = [];
    
    constructor(private paymentStrategy: PaymentStrategy) {}
    
    // Can change payment method at runtime!
    setPaymentStrategy(strategy: PaymentStrategy) {
        this.paymentStrategy = strategy;
    }
    
    checkout(amount: number): string {
        return this.paymentStrategy.pay(amount);
    }
}

// Usage - flexible and testable
let cart = new ShoppingCart(new CreditCardPayment("1234-5678"));
console.log(cart.checkout(100));

// Changed my mind, want to use PayPal
cart.setPaymentStrategy(new PayPalPayment("user@email.com"));
console.log(cart.checkout(100));
```

#### **Decision Tree:**

```
Need to model relationship?
│
├─ IS-A relationship? (Dog IS-A Animal)
│  └─ YES → Use INHERITANCE
│
├─ HAS-A relationship? (Car HAS-AN Engine)
│  └─ YES → Use COMPOSITION
│
├─ Need runtime flexibility?
│  └─ YES → Use COMPOSITION
│
├─ Need to combine multiple behaviors?
│  └─ YES → Use COMPOSITION
│
└─ Building a stable, narrow hierarchy?
   └─ YES → Consider INHERITANCE
   └─ NO → Use COMPOSITION
```

#### **Practical Guidelines:**

1. **Start with Composition** - It's easier to refactor to inheritance than vice versa

2. **Inheritance depth limit** - Max 2-3 levels deep
   ```
   ✅ Animal → Dog → Bulldog (OK)
   ❌ Animal → Mammal → Carnivore → Canine → Dog → Bulldog (Too deep!)
   ```

3. **Liskov Substitution Test** - If child can't fully replace parent, use composition

4. **Common Behavior Test** - If only sharing 1-2 methods, use composition/interfaces

5. **Change Frequency Test** - If behavior changes often, use composition (Strategy Pattern)

#### **Interview Power Answer:**

"I favor composition over inheritance because:
- **Flexibility**: Change behavior at runtime
- **Testability**: Mock dependencies easily
- **Loose Coupling**: Components are independent
- **Avoid Fragile Base Class**: Changes don't cascade
- **Multiple Behaviors**: Combine features without multiple inheritance

I use inheritance only when there's a genuine IS-A relationship and the hierarchy is stable, like Animal → Dog → Bulldog. For everything else, I use composition with interfaces/protocols for flexibility."

</details>

---

### Q5: Explain the Liskov Substitution Principle with an example

<details>
<summary><strong>View contents</strong></summary>

**Answer:**
"LSP states that child classes should be substitutable for their parent classes without breaking the program.

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
        self.height = width  # Must keep equal!
    
    def set_height(self, height):
        self.width = height
        self.height = height

# Problem:
def test(rect: Rectangle):
    rect.set_width(5)
    rect.set_height(4)
    assert rect.area() == 20  # Fails for Square!

test(Rectangle(0, 0))  # ✅ Pass
test(Square(0, 0))     # ❌ Fails (area is 16, not 20)
```

This violates LSP because Square can't truly replace Rectangle. The fix is to rethink the hierarchy - maybe Shape should be the parent with Circle and Polygon as children."

</details>

---

### Q6: How does Python implement private variables?

<details>
<summary><strong>View contents</strong></summary>

**Answer:**
"Python doesn't have true private variables, but uses name mangling for privacy:

```python
class MyClass:
    def __init__(self):
        self.public = "I'm public"
        self._protected = "I'm protected (convention)"
        self.__private = "I'm private (name mangled)"

obj = MyClass()
print(obj.public)      # ✅ Works
print(obj._protected)  # ✅ Works (but shouldn't)
print(obj.__private)   # ❌ AttributeError

# But you CAN access using name mangling:
print(obj._MyClass__private)  # ✅ Works

# Conventions:
# public_var - accessible everywhere
# _protected_var - internal use (convention, not enforced)
# __private_var - name mangled (pseudo-private)
```

Python philosophy: 'We're all consenting adults here' - use underscore conventions rather than strict enforcement."

</details>

---

### Q7: Explain Dependency Injection with a real-world example

<details>
<summary><strong>View contents</strong></summary>

**Answer:**
"Dependency Injection is when you provide (inject) dependencies to a class rather than having it create them internally.

**Real-world analogy**: Instead of a chef growing their own vegetables (tight coupling), the restaurant delivers ingredients to the chef (dependency injection). The chef can now work with any supplier!

```python
# ❌ Without DI - hard to test, inflexible
class OrderService:
    def __init__(self):
        self.payment = PayPalPayment()  # Hardcoded!
        self.email = GmailService()     # Hardcoded!
    
    def process(self, order):
        self.payment.charge(order.total)
        self.email.send(order.receipt)

# ✅ With DI - testable, flexible
class OrderService:
    def __init__(self, payment_service, email_service):
        self.payment = payment_service   # Injected!
        self.email = email_service       # Injected!
    
    def process(self, order):
        self.payment.charge(order.total)
        self.email.send(order.receipt)

# Production
service = OrderService(StripePayment(), SendGridEmail())

# Testing
service = OrderService(MockPayment(), MockEmail())
```

Benefits:
1. **Testability** - Easily inject mocks
2. **Flexibility** - Swap implementations
3. **Loose Coupling** - Classes don't know about concrete implementations
4. **Single Responsibility** - Classes focus on business logic

This follows the Dependency Inversion Principle (the 'D' in SOLID)!"

</details>

---

### Q8: What's the difference between Abstract Class and Interface?

<details>
<summary><strong>View contents</strong></summary>

**Answer:**
"Though Python doesn't have true interfaces, the conceptual difference is important:

**Abstract Class**:
- Can have both abstract and concrete methods
- Can have state (instance variables)
- Single inheritance only (in most languages)
- Use when you want to share code

**Interface** (Protocol in Python):
- Only method signatures (no implementation)
- No state
- Multiple inheritance
- Use when you only want to define a contract

```python
from abc import ABC, abstractmethod
from typing import Protocol

# Abstract Class - shares behavior
class Animal(ABC):
    def __init__(self, name):
        self.name = name  # Has state!
    
    @abstractmethod
    def make_sound(self):
        pass
    
    def sleep(self):  # Concrete method
        return f"{self.name} is sleeping"

# Protocol/Interface - pure contract
class Drawable(Protocol):
    def draw(self) -> str:
        ...  # No implementation!

class Circle:
    def draw(self) -> str:
        return "Drawing circle"
```

**When to use what:**
- **Abstract Class**: `Animal` - dogs and cats share common behavior (eating, sleeping)
- **Interface**: `Drawable` - circles and squares can both be drawn, but implementation is completely different

In TypeScript/Java, you can implement multiple interfaces but extend only one class, which is why interfaces are preferred for loose coupling."

</details>

---

### Q9: What are some OOP anti-patterns to avoid?

<details>
<summary><strong>View contents</strong></summary>

**Answer:**
"Here are the most common ones:

**1. God Object** - One class does everything
```python
# ❌ Bad
class UserManager:
    def create_user(self): pass
    def send_email(self): pass
    def process_payment(self): pass
    def generate_report(self): pass
    # Violates Single Responsibility!
```

**2. Yo-Yo Problem** - Deep inheritance forcing you to jump up and down
```python
# ❌ Bad - too many levels
A → B → C → D → E → F
# Hard to understand and maintain
```

**3. Circular Dependencies**
```python
# ❌ Bad
class A:
    def __init__(self):
        self.b = B()  # A needs B

class B:
    def __init__(self):
        self.a = A()  # B needs A - circular!
```

**4. Shotgun Surgery** - One change requires modifying many classes
```python
# Adding a new payment method requires changes in 10 files!
# Fix: Use Strategy pattern or better abstraction
```

**5. Premature Optimization** - Complex hierarchy for hypothetical future needs
```python
# ❌ Bad
class AbstractFactoryProxyBeanFactory:  # Over-engineered!
    pass

# ✅ Good - Start simple, refactor when needed
class Factory:
    pass
```

**How to avoid:**
- Follow SOLID principles
- Keep inheritance shallow (max 2-3 levels)
- Use composition over inheritance
- Write tests to catch tight coupling
- Refactor when you see code smells"

</details>

---

### Q10: Explain Strategy Pattern and when to use it

<details>
<summary><strong>View contents</strong></summary>

**Answer:**
"Strategy Pattern is about using composition to make behavior switchable at runtime. Instead of inheritance, you inject different strategies.

**Real-world analogy**: Navigation app - you can switch between 'fastest route', 'scenic route', 'avoid tolls' without changing the app itself.

```python
from abc import ABC, abstractmethod

# Strategy interface
class CompressionStrategy(ABC):
    @abstractmethod
    def compress(self, file):
        pass

# Concrete strategies
class ZipCompression(CompressionStrategy):
    def compress(self, file):
        return f"Compressing {file} using ZIP"

class RarCompression(CompressionStrategy):
    def compress(self, file):
        return f"Compressing {file} using RAR"

class SevenZipCompression(CompressionStrategy):
    def compress(self, file):
        return f"Compressing {file} using 7-Zip"

# Context - uses strategy
class FileCompressor:
    def __init__(self, strategy: CompressionStrategy):
        self.strategy = strategy
    
    def set_strategy(self, strategy: CompressionStrategy):
        self.strategy = strategy
    
    def compress_file(self, file):
        return self.strategy.compress(file)

# Usage - flexible!
compressor = FileCompressor(ZipCompression())
print(compressor.compress_file("data.txt"))

# Switch strategy at runtime
compressor.set_strategy(RarCompression())
print(compressor.compress_file("data.txt"))
```

**When to use:**
- When you have multiple algorithms for a task
- When you want to switch behavior at runtime
- When you want to avoid long if-else chains
- When you need to test different implementations

**Benefits:**
- Open/Closed Principle - add new strategies without modifying existing code
- Single Responsibility - each strategy has one job
- Eliminates conditional statements
- Easy to test each strategy independently

This is composition over inheritance in action!"

</details>

---

## Final Study Tips

### 1. Practice Pattern Recognition

When you see code, ask:
- Is this following SRP?
- Could this benefit from polymorphism?
- Is abstraction hiding complexity here?

### 2. Draw Diagrams

Visualize relationships:
```
        Animal
       /      \
     Dog      Cat
      |        |
  Bulldog   Siamese
```

### 3. Teach Someone

The best way to learn is to explain to others. If you can't explain it simply, you don't understand it well enough.

### 4. Code Daily

Write one small class every day practicing each principle:
- Monday: Encapsulation
- Tuesday: Abstraction
- Wednesday: Inheritance
- Thursday: Polymorphism
- Friday: SOLID review

### 5. Use Analogies

Always connect concepts to real-world analogies. Your brain remembers stories better than abstract concepts.

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────────┐
│                    OOP COMPLETE CHEAT SHEET                     │
├─────────────────────────────────────────────────────────────────┤
│ THE FOUR PILLARS                                                │
├─────────────────────────────────────────────────────────────────┤
│ ENCAPSULATION 🔒  →  Bundle + Hide                              │
│   Real: Medicine capsule                                        │
│   Code: Private vars + Public methods                           │
│   Python: __private, _protected                                 │
│                                                                 │
│ ABSTRACTION 🎭    →  Simplify Interface                         │
│   Real: Car steering (hide engine)                              │
│   Code: Abstract classes, Protocols                             │
│   Python: ABC, @abstractmethod                                  │
│                                                                 │
│ INHERITANCE 👨‍👩‍👧  →  Code Reuse                                  │
│   Real: Family traits                                           │
│   Code: class Child(Parent)                                     │
│   Use: IS-A relationships only                                  │
│                                                                 │
│ POLYMORPHISM 🎨   →  Many Forms                                 │
│   Real: USB ports (one interface, many devices)                 │
│   Code: Method overriding, Duck typing                          │
│   Python: No true overloading, use defaults                     │
├─────────────────────────────────────────────────────────────────┤
│ SOLID PRINCIPLES - "Some Old Italian Lovers Dance"             │
├─────────────────────────────────────────────────────────────────┤
│ S - Single Responsibility → One class, one job                  │
│     Example: UserService ≠ EmailService                         │
│                                                                 │
│ O - Open/Closed → Extend, don't modify                          │
│     Example: Add new payment methods without changing code      │
│                                                                 │
│ L - Liskov Substitution → Subtypes must substitute              │
│     Example: Square violates if it breaks Rectangle            │
│                                                                 │
│ I - Interface Segregation → Lean interfaces                     │
│     Example: Robot shouldn't implement eat() or sleep()        │
│                                                                 │
│ D - Dependency Inversion → Depend on abstractions               │
│     Example: Service depends on ILogger, not ConsoleLogger     │
├─────────────────────────────────────────────────────────────────┤
│ KEY DESIGN DECISIONS                                            │
├─────────────────────────────────────────────────────────────────┤
│ INHERITANCE vs COMPOSITION                                      │
│   Inheritance: IS-A → Dog IS-A Animal                          │
│   Composition: HAS-A → Car HAS-AN Engine                       │
│   Rule: Favor Composition (more flexible!)                     │
│                                                                 │
│ ABSTRACT CLASS vs INTERFACE                                     │
│   Abstract: Share code + contract → Animal (has name)          │
│   Interface: Pure contract → Drawable (just draw())            │
│                                                                 │
│ DEPENDENCY INJECTION                                            │
│   Don't create: self.logger = Logger()    ❌                   │
│   Inject: __init__(self, logger: ILogger) ✅                   │
│   Benefits: Testable, Flexible, Loosely Coupled                │
├─────────────────────────────────────────────────────────────────┤
│ COMMON PATTERNS                                                 │
├─────────────────────────────────────────────────────────────────┤
│ Strategy: Switchable behavior (sort algorithms)                │
│ Factory: Create objects without knowing type                   │
│ Observer: Pub-sub (one change, many listeners)                 │
│ Singleton: One instance only (database connection)             │
├─────────────────────────────────────────────────────────────────┤
│ ANTI-PATTERNS TO AVOID                                          │
├─────────────────────────────────────────────────────────────────┤
│ ❌ God Object: Class does everything                            │
│ ❌ Yo-Yo Problem: Too many inheritance levels                   │
│ ❌ Circular Dependencies: A needs B, B needs A                  │
│ ❌ Shotgun Surgery: One change affects many files              │
│ ❌ Premature Optimization: Over-engineering                     │
├─────────────────────────────────────────────────────────────────┤
│ QUICK DECISION GUIDE                                            │
├─────────────────────────────────────────────────────────────────┤
│ IS-A relationship? → Use Inheritance                            │
│ HAS-A relationship? → Use Composition                           │
│ USES relationship? → Use Dependency Injection                   │
│ BEHAVES-LIKE? → Use Interface/Protocol                         │
│ Need flexibility? → Use Composition + Strategy                 │
│ Need runtime switching? → Use Dependency Injection             │
├─────────────────────────────────────────────────────────────────┤
│ PYTHON-SPECIFIC NOTES                                           │
├─────────────────────────────────────────────────────────────────┤
│ • No true overloading (use default params)                     │
│ • No true private (use __name convention)                      │
│ • Duck typing (no interface inheritance needed)                │
│ • MRO for multiple inheritance (left-to-right)                 │
│ • Magic methods for operator overloading (__add__, etc.)       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Conclusion

Master these concepts by:
1. **Understanding** the "why" behind each principle
2. **Practicing** with real code examples
3. **Connecting** to real-world analogies
4. **Teaching** others to solidify your understanding

Remember: OOP isn't about memorizing definitions - it's about thinking in objects, relationships, and behaviors!

## References

1. [What Are OOP Concepts?](https://stackify.com/oops-concepts-in-java/)
2. [How to Use Object-Oriented Programming in Python – Key OOP Concepts and Interview Questions for Beginners](https://www.freecodecamp.org/news/object-oriented-programming-in-python-interview-questions/)
