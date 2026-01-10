# 9.1 Frequently Asked Interview Questions

[← Back to README](../README.md) | [Next: Coding Challenges →](02-coding-challenges.md)

---

## Core OOP Questions

<details>
<summary><strong>Q1: What are the four pillars of OOP?</strong></summary>

**Answer:**

The four pillars are **Encapsulation, Abstraction, Inheritance, and Polymorphism (AEIP)**:

1. **Encapsulation** - Bundling data with methods and hiding internal details. Like a capsule protecting medicine inside.

2. **Abstraction** - Hiding complexity, showing only essential features. Like a TV remote - simple interface, complex internals hidden.

3. **Inheritance** - Code reuse through parent-child relationships. Child classes inherit properties and methods from parents.

4. **Polymorphism** - "Many forms" - same interface, different implementations. Like a power button that works differently for TV, computer, AC.

**Example:**
```python
# Encapsulation
class BankAccount:
    def __init__(self):
        self.__balance = 0  # Private
    
    def deposit(self, amount):  # Controlled access
        self.__balance += amount

# Abstraction
from abc import ABC, abstractmethod
class Shape(ABC):
    @abstractmethod
    def area(self):  # What, not how
        pass

# Inheritance
class Dog(Animal):  # Dog IS-A Animal
    pass

# Polymorphism
shapes = [Circle(5), Rectangle(4, 6)]
for shape in shapes:
    print(shape.area())  # Different implementations
```
</details>

<details>
<summary><strong>Q2: What's the difference between abstraction and encapsulation?</strong></summary>

**Answer:**

While related, they serve different purposes:

**Abstraction:**
- **Focus**: WHAT an object does
- **Purpose**: Hide complexity, show essential features
- **How**: Abstract classes, interfaces
- **Example**: Car steering wheel (simple interface) hides complex steering mechanism

**Encapsulation:**
- **Focus**: HOW you access data
- **Purpose**: Data protection through bundling and hiding
- **How**: Private variables, public methods
- **Example**: Car engine sealed in compartment - can't touch directly

**Real-world comparison:**
- **Abstraction**: TV remote buttons (simple interface hiding complex electronics)
- **Encapsulation**: TV circuit board inside case (data protection)

```python
# Abstraction - hiding HOW
class PaymentProcessor(ABC):
    @abstractmethod
    def process(self, amount):  # WHAT it does
        pass

# Encapsulation - hiding data
class Account:
    def __init__(self):
        self.__balance = 0  # HOW data is protected
    
    def get_balance(self):  # Controlled access
        return self.__balance
```
</details>

<details>
<summary><strong>Q3: Explain method overriding vs method overloading</strong></summary>

**Answer:**

**Method Overriding (Runtime Polymorphism):**
- Child class provides different implementation of parent's method
- Same method signature
- Resolved at runtime
- Python fully supports this

```python
class Animal:
    def speak(self):
        return "Some sound"

class Dog(Animal):
    def speak(self):  # Override
        return "Woof!"
```

**Method Overloading (Compile-time Polymorphism):**
- Same method name, different parameters
- Resolved at compile time
- Python doesn't support true overloading (last definition wins)
- TypeScript/C++ support this

```python
# Python workaround - default parameters
class Calculator:
    def add(self, a, b, c=0):
        return a + b + c

calc = Calculator()
calc.add(2, 3)     # 5
calc.add(2, 3, 4)  # 9
```

```typescript
// TypeScript - true overloading
class Calculator {
    add(a: number, b: number): number;
    add(a: string, b: string): string;
    add(a: any, b: any): any {
        return a + b;
    }
}
```
</details>

---

## SOLID Principles Questions

<details>
<summary><strong>Q4: Explain the Single Responsibility Principle</strong></summary>

**Answer:**

**"A class should have only ONE reason to change"**

Each class should do ONE thing well.

**Bad example:**
```python
class User:
    def save_to_database(self): pass  # Database responsibility
    def send_email(self): pass        # Email responsibility
    def generate_report(self): pass   # Reporting responsibility
```

**Good example:**
```python
class User:
    pass  # Just holds user data

class UserRepository:
    def save(self, user): pass  # Database responsibility

class EmailService:
    def send(self, user): pass  # Email responsibility

class ReportGenerator:
    def generate(self, user): pass  # Reporting responsibility
```

**Benefits:**
- Easier to understand
- Easier to test
- Easier to maintain
- Changes isolated to one class
</details>

<details>
<summary><strong>Q5: What is the Liskov Substitution Principle?</strong></summary>

**Answer:**

**"Subtypes must be substitutable for their base types"**

Child classes should work anywhere parent class works, without breaking behavior.

**Classic violation - Rectangle/Square:**
```python
class Rectangle:
    def set_width(self, w):
        self.width = w
    def set_height(self, h):
        self.height = h

class Square(Rectangle):
    def set_width(self, w):
        self.width = w
        self.height = w  # Breaks Rectangle behavior!

def test(rect):
    rect.set_width(5)
    rect.set_height(4)
    assert rect.area() == 20

test(Rectangle())  # ✅ Pass
test(Square())     # ❌ Fail (16, not 20)
```

**Fix:**
```python
class Shape(ABC):
    @abstractmethod
    def area(self): pass

class Rectangle(Shape):
    def area(self):
        return self.width * self.height

class Square(Shape):
    def area(self):
        return self.side * self.side
```
</details>

---

## Design & Architecture Questions

<details>
<summary><strong>Q6: When should you use composition over inheritance?</strong></summary>

**Answer:**

**"Favor composition over inheritance"**

**Use Inheritance when:**
- Clear, stable IS-A relationship
- Shallow hierarchy (2-3 levels max)
- Need polymorphic behavior

**Use Composition when:**
- HAS-A relationship
- Need runtime flexibility
- Want loose coupling
- Avoiding deep hierarchies
- Combining behaviors from multiple sources

**Example:**
```python
# Inheritance: IS-A
class Dog(Animal):  # Dog IS-A Animal ✅
    pass

# Composition: HAS-A
class Car:
    def __init__(self):
        self.engine = Engine()  # Car HAS-AN Engine ✅
```

**Why favor composition:**
1. More flexible - can swap components at runtime
2. Loose coupling - components are independent
3. Avoids fragile base class problem
4. No diamond problem
5. Easier to test (mock dependencies)
</details>

<details>
<summary><strong>Q7: What is dependency injection and why use it?</strong></summary>

**Answer:**

**Dependency Injection:** Providing dependencies to a class instead of having it create them internally.

**Without DI:**
```python
class UserService:
    def __init__(self):
        self.db = MySQLDatabase()  # Creates dependency
```

**With DI:**
```python
class UserService:
    def __init__(self, database):
        self.db = database  # Receives dependency

# Inject dependency
service = UserService(MySQLDatabase())
```

**Benefits:**
1. **Testability** - Easy to inject mocks
2. **Flexibility** - Swap implementations easily
3. **Loose coupling** - Class doesn't know concrete type
4. **Follows DIP** - Depend on abstractions

**Example:**
```python
# Testing with DI
class MockDatabase:
    def save(self, data):
        self.saved = data

mock_db = MockDatabase()
service = UserService(mock_db)
service.save_user(user)
assert mock_db.saved == user
```
</details>

---

## Practical Questions

<details>
<summary><strong>Q8: How do you prevent multiple instances of a class? (Singleton)</strong></summary>

**Answer:**

Use the Singleton pattern:

```python
class Database:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.connection = "Connected"
        return cls._instance

db1 = Database()
db2 = Database()
print(db1 is db2)  # True - same instance
```

**Thread-safe version:**
```python
import threading

class Database:
    _instance = None
    _lock = threading.Lock()
    
    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
        return cls._instance
```
</details>

<details>
<summary><strong>Q9: What's the diamond problem and how is it solved?</strong></summary>

**Answer:**

**Diamond Problem:** Occurs in multiple inheritance when a class inherits from two classes that share a common ancestor.

```
      A
     / \
    B   C
     \ /
      D
```

**Python solution - MRO (Method Resolution Order):**
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

d = D()
print(d.method())  # "B" (left-to-right in MRO)
print(D.__mro__)   # D → B → C → A → object
```

**C++ solution - Virtual inheritance:**
```cpp
class A { };
class B : virtual public A { };  // virtual
class C : virtual public A { };  // virtual
class D : public B, public C { };  // Only one A
```
</details>

<details>
<summary><strong>Q10: How would you design a logging system?</strong></summary>

**Answer:**

Use **abstraction** and **dependency injection**:

```python
from abc import ABC, abstractmethod

# Abstraction
class Logger(ABC):
    @abstractmethod
    def log(self, message):
        pass

# Implementations
class FileLogger(Logger):
    def log(self, message):
        # Write to file
        pass

class ConsoleLogger(Logger):
    def log(self, message):
        print(message)

class DatabaseLogger(Logger):
    def log(self, message):
        # Save to DB
        pass

# Dependency Injection
class Application:
    def __init__(self, logger: Logger):
        self.logger = logger
    
    def run(self):
        self.logger.log("App started")

# Easy to switch loggers
app = Application(ConsoleLogger())
app = Application(FileLogger())
```

**Why this design:**
- ✅ Open/Closed - Add new loggers without modifying existing code
- ✅ Dependency Inversion - Depend on Logger abstraction
- ✅ Easy to test - Inject mock logger
- ✅ Flexible - Switch loggers at runtime
</details>

---

## Quick Answer Templates

### For "What is X?"
1. Define it
2. Give real-world analogy
3. Show code example
4. Explain benefits

### For "Difference between X and Y?"
1. Define both
2. Create comparison table
3. Give examples of each
4. State when to use which

### For "When to use X?"
1. List criteria
2. Give good example
3. Give bad example
4. Provide decision rule

---

[← Back to README](../README.md) | [Next: Coding Challenges →](02-coding-challenges.md)