# 10.1 OOP Cheat Sheet

[↑ Back to README](../README.md)

---

## Quick Reference Guide

This cheat sheet provides a condensed overview of all Object-Oriented Programming concepts for quick review before interviews or problem-solving sessions.

---

## The Four Pillars (AEIP)

### 🔒 Encapsulation
**Definition**: Bundling data with methods and hiding internal details

```python
class BankAccount:
    def __init__(self, balance):
        self.__balance = balance  # Private
    
    @property
    def balance(self):  # Getter
        return self.__balance
    
    def deposit(self, amount):  # Controlled access
        if amount > 0:
            self.__balance += amount
```

**Key Points**:
- Bundle related data and methods
- Hide internal state (private/protected)
- Provide controlled access (getters/setters)
- **Real-world**: ATM machine - you can't access bank database directly

**Interview Answer**: "Encapsulation is about data protection through bundling and hiding. Like a capsule - you can't access what's inside directly."

---

### 🎭 Abstraction
**Definition**: Hiding complexity, showing only essential features

```python
from abc import ABC, abstractmethod

class PaymentProcessor(ABC):
    @abstractmethod
    def process_payment(self, amount):
        pass  # Define WHAT, not HOW

class CreditCard(PaymentProcessor):
    def process_payment(self, amount):
        return f"Processing ${amount} via credit card"
```

**Key Points**:
- Hide implementation details
- Show only necessary interface
- Use abstract classes/interfaces
- **Real-world**: Car steering wheel - simple interface, complex mechanism hidden

**Interview Answer**: "Abstraction hides HOW things work, shows only WHAT they do. Like a TV remote - you press buttons without knowing the electronics inside."

---

### 👨‍👩‍👧 Inheritance
**Definition**: Child classes inherit properties and methods from parents

```python
class Animal:
    def __init__(self, name):
        self.name = name
    
    def eat(self):
        return f"{self.name} is eating"

class Dog(Animal):  # Inherits from Animal
    def bark(self):
        return "Woof!"
```

**Key Points**:
- Code reuse through IS-A relationships
- Method overriding allowed
- Multiple inheritance possible (Python)
- **Real-world**: Family traits - children inherit eye color from parents

**Interview Answer**: "Inheritance enables code reuse through parent-child relationships. Dog IS-A Animal, so it inherits Animal's methods."

---

### 🎨 Polymorphism
**Definition**: One interface, multiple implementations

```python
class Shape(ABC):
    @abstractmethod
    def area(self):
        pass

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius
    
    def area(self):  # Different implementation
        return 3.14159 * self.radius ** 2

class Square(Shape):
    def __init__(self, side):
        self.side = side
    
    def area(self):  # Different implementation
        return self.side ** 2

# Same interface, different behavior
shapes = [Circle(5), Square(4)]
for shape in shapes:
    print(shape.area())  # Polymorphism!
```

**Key Points**:
- Method overriding (runtime polymorphism)
- Method overloading (compile-time) - not in Python
- Duck typing in Python
- **Real-world**: USB port - one interface, many devices

**Interview Answer**: "Polymorphism means 'many forms'. Same method name, different implementations. Like a print function that handles strings, numbers, and objects differently."

---

## SOLID Principles

### S - Single Responsibility Principle
**"One class, one job"**

```python
# ❌ Bad
class User:
    def save_to_db(self): pass
    def send_email(self): pass

# ✅ Good
class User:
    pass

class UserRepository:
    def save(self, user): pass

class EmailService:
    def send(self, user): pass
```

---

### O - Open/Closed Principle
**"Open for extension, closed for modification"**

```python
# ✅ Good - Use polymorphism
class DiscountStrategy(ABC):
    @abstractmethod
    def calculate(self, amount): pass

class RegularDiscount(DiscountStrategy):
    def calculate(self, amount):
        return amount * 0.1

# Add new discounts without modifying existing code
class VIPDiscount(DiscountStrategy):
    def calculate(self, amount):
        return amount * 0.2
```

---

### L - Liskov Substitution Principle
**"Subtypes must be substitutable for base types"**

```python
# ❌ Violates LSP
class Bird:
    def fly(self): pass

class Penguin(Bird):
    def fly(self):
        raise Exception("Can't fly!")  # Breaks contract

# ✅ Correct
class Bird:
    def move(self): pass

class FlyingBird(Bird):
    def fly(self): pass

class Penguin(Bird):
    def move(self):
        return "Swimming"
```

---

### I - Interface Segregation Principle
**"Many specific interfaces > One general interface"**

```python
# ❌ Bad - Robot forced to implement eat/sleep
class Worker(ABC):
    @abstractmethod
    def work(self): pass
    @abstractmethod
    def eat(self): pass
    @abstractmethod
    def sleep(self): pass

# ✅ Good - Separate interfaces
class Workable(ABC):
    @abstractmethod
    def work(self): pass

class Eatable(ABC):
    @abstractmethod
    def eat(self): pass

class Human(Workable, Eatable): pass
class Robot(Workable): pass  # Only what it needs
```

---

### D - Dependency Inversion Principle
**"Depend on abstractions, not concretions"**

```python
# ❌ Bad - Depends on concrete class
class UserService:
    def __init__(self):
        self.db = MySQLDatabase()  # Tightly coupled

# ✅ Good - Depends on abstraction
class UserService:
    def __init__(self, database: Database):
        self.db = database  # Can be any Database implementation
```

---

## Inheritance vs Composition

### Decision Matrix

| Question | Use This |
|----------|----------|
| IS-A relationship? (Dog IS-A Animal) | **Inheritance** |
| HAS-A relationship? (Car HAS-AN Engine) | **Composition** |
| Need runtime flexibility? | **Composition** |
| Deep hierarchy (3+ levels)? | **Composition** |
| Sharing just 1-2 methods? | **Composition** |

### Quick Rule
**"Favor Composition over Inheritance"**

```python
# Inheritance: IS-A
class Animal:
    def breathe(self): pass

class Dog(Animal):  # Dog IS-A Animal
    pass

# Composition: HAS-A
class Engine:
    def start(self): pass

class Car:  # Car HAS-AN Engine
    def __init__(self):
        self.engine = Engine()
```

---

## Design Patterns Quick Reference

### Strategy Pattern
**Switchable behavior**

```python
class PaymentStrategy(ABC):
    @abstractmethod
    def pay(self, amount): pass

class Order:
    def __init__(self, payment: PaymentStrategy):
        self.payment = payment  # Inject strategy
    
    def checkout(self, amount):
        return self.payment.pay(amount)
```

### Factory Pattern
**Create objects without specifying exact class**

```python
class AnimalFactory:
    @staticmethod
    def create(animal_type):
        if animal_type == "dog":
            return Dog()
        elif animal_type == "cat":
            return Cat()
```

### Observer Pattern
**Pub-Sub notification**

```python
class Subject:
    def __init__(self):
        self._observers = []
    
    def attach(self, observer):
        self._observers.append(observer)
    
    def notify(self, message):
        for obs in self._observers:
            obs.update(message)
```

---

## Common Anti-Patterns

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| **God Object** | One class does everything | Split into focused classes |
| **Yo-Yo Problem** | Deep inheritance (5+ levels) | Flatten or use composition |
| **Circular Dependency** | A needs B, B needs A | Use DI or mediator |
| **Shotgun Surgery** | One change affects many files | Better abstraction |

---

## Language Feature Comparison

| Feature | Python | TypeScript | C++ |
|---------|--------|-----------|-----|
| **Encapsulation** | Convention (`_`, `__`) | `private`, `protected` | `private:`, `protected:` |
| **Multiple Inheritance** | ✅ Yes | ❌ No (interfaces only) | ✅ Yes |
| **Method Overloading** | ❌ No | ✅ Yes (signatures) | ✅ Yes |
| **Operator Overloading** | ✅ Yes (`__add__`) | ❌ No | ✅ Yes |
| **Abstract Classes** | ✅ ABC module | ✅ `abstract` | ✅ Pure virtual |
| **Interfaces** | ⚠️ Protocol | ✅ `interface` | ⚠️ Abstract classes |
| **Properties** | ✅ `@property` | ✅ `get/set` | ❌ Manual getters/setters |

---

## Python-Specific Shortcuts

### Access Modifiers
```python
class MyClass:
    public_var = "Anyone can access"
    _protected_var = "Convention: internal use"
    __private_var = "Name mangling"
```

### Properties
```python
class Circle:
    def __init__(self, radius):
        self._radius = radius
    
    @property
    def radius(self):
        return self._radius
    
    @radius.setter
    def radius(self, value):
        if value > 0:
            self._radius = value
    
    @property
    def area(self):  # Read-only computed
        return 3.14159 * self._radius ** 2
```

### Magic Methods (Operator Overloading)
```python
class Vector:
    def __init__(self, x, y):
        self.x, self.y = x, y
    
    def __add__(self, other):  # +
        return Vector(self.x + other.x, self.y + other.y)
    
    def __eq__(self, other):  # ==
        return self.x == other.x and self.y == other.y
    
    def __str__(self):  # str()
        return f"Vector({self.x}, {self.y})"
    
    def __len__(self):  # len()
        return int((self.x**2 + self.y**2)**0.5)
```

---

## Interview Quick Answers

### "What's the difference between Encapsulation and Abstraction?"
- **Encapsulation**: HOW you access data (bundling + hiding)
- **Abstraction**: WHAT you show (hiding complexity)
- **Example**: Car engine is encapsulated (can't touch directly), steering wheel is abstraction (simple interface)

### "Method Overriding vs Overloading?"
- **Overriding**: Same signature, different implementation (inheritance)
- **Overloading**: Same name, different parameters (Python doesn't support true overloading)

### "When to use Composition vs Inheritance?"
- **Inheritance**: Clear IS-A relationship, stable hierarchy
- **Composition**: Everything else (HAS-A, runtime flexibility, deep hierarchies)

### "What is Dependency Injection?"
- Providing dependencies instead of creating them internally
- **Benefits**: Testability, flexibility, loose coupling
- **Example**: Pass logger to class instead of creating logger inside

### "Explain Liskov Substitution Principle"
- Child must be substitutable for parent without breaking behavior
- **Test**: If function expects Parent, any Child should work
- **Violation**: Penguin can't fly, but inherits from Bird with fly()

---

## Common Code Smells

| Smell | Indicator | Fix |
|-------|-----------|-----|
| **Long Parameter List** | Method takes 5+ parameters | Use object or builder pattern |
| **Large Class** | 500+ lines | Split responsibilities |
| **Duplicate Code** | Same code in multiple places | Extract to method/class |
| **Dead Code** | Unused methods/classes | Delete |
| **Deep Nesting** | 3+ levels of if/for | Extract methods |

---

## Memory Mnemonics

### Four Pillars - "AEIP" (AYE-IP)
- **A**bstraction - Hide complexity
- **E**ncapsulation - Data protection
- **I**nheritance - Code reuse
- **P**olymorphism - Many forms

### SOLID - "Some Old Italian Lovers Dance"
- **S**ingle Responsibility
- **O**pen/Closed
- **L**iskov Substitution
- **I**nterface Segregation
- **D**ependency Inversion

### Composition vs Inheritance - "HAS-A vs IS-A"
- Car **HAS-A** Engine → Composition
- Dog **IS-A** Animal → Inheritance

---

## Decision Trees

### Should I use Inheritance?

```
Is there a genuine IS-A relationship?
├─ YES → Is the hierarchy stable (< 3 levels)?
│   ├─ YES → Consider Inheritance
│   └─ NO → Use Composition
└─ NO → Use Composition
```

### Which Access Modifier?

```
Should everyone access this?
├─ YES → Public
└─ NO → Should subclasses access?
    ├─ YES → Protected
    └─ NO → Private
```

### Which Design Pattern?

```
Need to...
├─ Switch behavior at runtime? → Strategy Pattern
├─ Create objects without knowing type? → Factory Pattern
├─ Notify multiple objects of changes? → Observer Pattern
├─ Simplify complex interface? → Facade Pattern
└─ Add functionality without modifying? → Decorator Pattern
```

---

## Code Templates

### Basic Class Template
```python
class ClassName:
    """Class description"""
    
    # Class variable
    CLASS_CONSTANT = "value"
    
    def __init__(self, param):
        """Initialize object"""
        self.public_attr = param
        self._protected_attr = None
        self.__private_attr = None
    
    @property
    def property_name(self):
        """Getter"""
        return self.__private_attr
    
    @property_name.setter
    def property_name(self, value):
        """Setter with validation"""
        if value > 0:
            self.__private_attr = value
    
    def public_method(self):
        """Public method"""
        return self._helper_method()
    
    def _protected_method(self):
        """Internal use (convention)"""
        pass
    
    def __private_method(self):
        """Private method"""
        pass
    
    def __str__(self):
        """String representation"""
        return f"ClassName({self.public_attr})"
```

### Abstract Class Template
```python
from abc import ABC, abstractmethod

class AbstractClass(ABC):
    """Abstract base class"""
    
    def __init__(self, param):
        self.param = param
    
    @abstractmethod
    def required_method(self):
        """Subclasses must implement"""
        pass
    
    def concrete_method(self):
        """Shared implementation"""
        return "Shared behavior"

class ConcreteClass(AbstractClass):
    def required_method(self):
        """Implementation"""
        return f"Implemented for {self.param}"
```

---

## Testing OOP Code

### Unit Testing Template
```python
import unittest

class TestBankAccount(unittest.TestCase):
    def setUp(self):
        """Run before each test"""
        self.account = BankAccount("Alice", 1000)
    
    def test_deposit(self):
        """Test deposit functionality"""
        self.account.deposit(500)
        self.assertEqual(self.account.get_balance(), 1500)
    
    def test_withdraw_insufficient(self):
        """Test withdrawal with insufficient funds"""
        result = self.account.withdraw(2000)
        self.assertIn("Insufficient", result)
    
    def tearDown(self):
        """Run after each test"""
        pass
```

### Mock Objects
```python
class MockDatabase:
    """Mock for testing"""
    def __init__(self):
        self.saved_items = []
    
    def save(self, item):
        self.saved_items.append(item)
        return True

# Use in tests
service = UserService(MockDatabase())
```

---

## Performance Considerations

### When to Avoid OOP
- Simple scripts (< 100 lines)
- Data processing pipelines
- Mathematical computations
- Performance-critical tight loops

### OOP Overhead
```python
# Faster - direct access
x = data[0] + data[1]

# Slower - method calls
x = obj.get_first() + obj.get_second()
```

**Trade-off**: OOP adds slight overhead but provides organization, maintainability, and flexibility.

---

## Best Practices Checklist

- [ ] Classes have single responsibility
- [ ] Use composition over inheritance by default
- [ ] Private data with public methods
- [ ] Properties for computed values
- [ ] Abstract classes for contracts
- [ ] Dependency injection for flexibility
- [ ] Follow SOLID principles
- [ ] Write unit tests for each class
- [ ] Document complex methods
- [ ] Keep inheritance hierarchies shallow (< 3 levels)
- [ ] Use meaningful class and method names
- [ ] Validate inputs in setters
- [ ] Handle errors appropriately
- [ ] Keep methods short (< 20 lines)

---

## Common Interview Questions

<details>
<summary><strong>1. Explain the four pillars of OOP</strong></summary>

"The four pillars are Abstraction, Encapsulation, Inheritance, and Polymorphism:

- **Encapsulation**: Bundling data with methods and hiding internal details. Like a capsule - you can't access the medicine directly.
- **Abstraction**: Hiding complexity, showing only essential features. Like a TV remote - simple interface, complex internals.
- **Inheritance**: Code reuse through parent-child relationships. Dog IS-A Animal.
- **Polymorphism**: One interface, many implementations. Same method name, different behaviors."
</details>

<details>
<summary><strong>2. What's the difference between abstraction and encapsulation?</strong></summary>

"While related, they serve different purposes:

- **Encapsulation** is about HOW you protect data - bundling and hiding internal state
- **Abstraction** is about WHAT you show - hiding complexity and showing only essential features

Example: A car engine is **encapsulated** (you can't touch it directly), but the steering wheel is **abstraction** (simple interface hiding complex mechanics)."
</details>

<details>
<summary><strong>3. When would you use composition over inheritance?</strong></summary>

"I favor composition over inheritance except for genuine IS-A relationships:

**Use Inheritance when**:
- Clear IS-A relationship (Dog IS-A Animal)
- Stable hierarchy (unlikely to change)
- Shallow hierarchy (2-3 levels max)

**Use Composition when**:
- HAS-A relationship (Car HAS-AN Engine)
- Need runtime flexibility
- Want to avoid tight coupling
- Combining behaviors from multiple sources

The rule of thumb: 'Favor composition over inheritance' because it's more flexible and maintainable."
</details>

<details>
<summary><strong>4. Explain Dependency Injection</strong></summary>

"Dependency Injection is providing dependencies to a class instead of having it create them internally.

**Without DI**:
```python
class Service:
    def __init__(self):
        self.logger = FileLogger()  # Tightly coupled
```

**With DI**:
```python
class Service:
    def __init__(self, logger):
        self.logger = logger  # Injected dependency
```

**Benefits**:
- Testability - can inject mocks
- Flexibility - easy to swap implementations
- Loose coupling - class doesn't depend on concrete types"
</details>

<details>
<summary><strong>5. What is the Liskov Substitution Principle?</strong></summary>

"LSP states that child classes must be substitutable for their parent classes without breaking the program.

**Example violation**:
```python
class Bird:
    def fly(self): pass

class Penguin(Bird):
    def fly(self):
        raise Exception('Cannot fly!')  # Breaks LSP
```

Penguin can't truly replace Bird because it breaks the fly() contract.

**Correct approach**:
```python
class Bird:
    def move(self): pass

class FlyingBird(Bird):
    def fly(self): pass

class Penguin(Bird):
    def move(self):
        return 'Swimming'
```

Now Penguin can replace Bird without breaking anything."
</details>

---

## Quick Syntax Reference

### Python
```python
# Class definition
class MyClass(ParentClass):
    def __init__(self, param):
        super().__init__()
        self.__private = param
    
    @property
    def value(self):
        return self.__private

# Instantiation
obj = MyClass("test")
```

### TypeScript
```typescript
// Class definition
class MyClass extends ParentClass {
    private privateVar: string;
    
    constructor(param: string) {
        super();
        this.privateVar = param;
    }
    
    get value(): string {
        return this.privateVar;
    }
}

// Instantiation
const obj = new MyClass("test");
```

### C++
```cpp
// Class definition
class MyClass : public ParentClass {
private:
    string privateVar;

public:
    MyClass(string param) {
        privateVar = param;
    }
    
    string getValue() {
        return privateVar;
    }
};

// Instantiation
MyClass obj("test");
```

---

## Final Tips

### Before Interviews
1. Review the Four Pillars (AEIP)
2. Memorize SOLID principles
3. Practice Composition vs Inheritance decision
4. Know Dependency Injection benefits
5. Be ready to explain LSP with examples

### During Coding
1. Start with clear class responsibilities
2. Use meaningful names
3. Keep methods short
4. Add validation in setters
5. Write tests first (TDD)

### Common Pitfalls
1. Over-engineering simple problems
2. Deep inheritance hierarchies
3. God objects (too many responsibilities)
4. Forgetting to validate inputs
5. Not writing tests

---

[↑ Back to README](../README.md)

**Print This Page**: Use Ctrl+P (or Cmd+P) to print this cheat sheet for quick reference during study sessions or interviews.