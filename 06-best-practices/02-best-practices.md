# 6.2 Best Practices

[← Back to Anti-Patterns](01-anti-patterns.md) | [Next: Code Smells →](03-code-smells.md) | [↑ Back to README](../README.md)

---

## Core Principles

### SOLID Principles (Review)

The foundation of good OOP design:

**S** - Single Responsibility  
**O** - Open/Closed  
**L** - Liskov Substitution  
**I** - Interface Segregation  
**D** - Dependency Inversion

---

## 1. Favor Composition Over Inheritance 🧩

### The Principle

**"Has-A relationships are often more flexible than Is-A relationships"**

### Why

✅ **Flexibility** - Change behavior at runtime  
✅ **Loose coupling** - Components independent  
✅ **No fragile base class problem**  
✅ **Multiple behaviors** - Combine many components

### Example

```python
# ❌ BAD - Inheritance for code reuse
class Robot:
    def walk(self):
        return "Walking with legs"

class FlyingRobot(Robot):
    def fly(self):
        return "Flying with propellers"

class SwimmingRobot(Robot):
    def swim(self):
        return "Swimming with fins"

# Problem: What if we want a flying AND swimming robot?
class FlyingSwimmingRobot(FlyingRobot, SwimmingRobot):
    # Diamond problem!
    pass

# ✅ GOOD - Composition
class WalkingCapability:
    def walk(self):
        return "Walking with legs"

class FlyingCapability:
    def fly(self):
        return "Flying with propellers"

class SwimmingCapability:
    def swim(self):
        return "Swimming with fins"

class Robot:
    def __init__(self, *capabilities):
        self.capabilities = capabilities
    
    def perform_actions(self):
        for capability in self.capabilities:
            if hasattr(capability, 'walk'):
                print(capability.walk())
            if hasattr(capability, 'fly'):
                print(capability.fly())
            if hasattr(capability, 'swim'):
                print(capability.swim())

# Easy to create any combination!
basic_robot = Robot(WalkingCapability())
advanced_robot = Robot(WalkingCapability(), FlyingCapability(), SwimmingCapability())
```

### When to Use Inheritance

Use inheritance ONLY when:
- Clear IS-A relationship
- Shallow hierarchy (2-3 levels max)
- Subclass truly IS a specialized version
- Need polymorphic behavior

---

## 2. Program to Interfaces, Not Implementations 🔌

### The Principle

**"Depend on abstractions, not concrete classes"**

### Why

✅ **Flexibility** - Easy to swap implementations  
✅ **Testability** - Mock interfaces easily  
✅ **Loose coupling** - Don't depend on details

### Example

```python
# ❌ BAD - Depends on implementation
class UserService:
    def __init__(self):
        self.db = MySQLDatabase()  # Concrete class!
    
    def get_user(self, user_id):
        return self.db.query(f"SELECT * FROM users WHERE id = {user_id}")

# Can't easily switch to PostgreSQL or test with mock!

# ✅ GOOD - Depends on interface
from abc import ABC, abstractmethod

class Database(ABC):
    @abstractmethod
    def query(self, sql):
        pass

class MySQLDatabase(Database):
    def query(self, sql):
        # MySQL-specific implementation
        return "MySQL result"

class PostgreSQLDatabase(Database):
    def query(self, sql):
        # PostgreSQL-specific implementation
        return "PostgreSQL result"

class UserService:
    def __init__(self, database: Database):  # Interface!
        self.db = database
    
    def get_user(self, user_id):
        return self.db.query(f"SELECT * FROM users WHERE id = {user_id}")

# Easy to switch or test
service = UserService(MySQLDatabase())
# or
service = UserService(PostgreSQLDatabase())
# or (testing)
service = UserService(MockDatabase())
```

---

## 3. Keep It Simple (KISS) 💋

### The Principle

**"Keep It Simple, Stupid"** or **"Keep It Short and Simple"**

### Why

✅ **Easier to understand**  
✅ **Easier to maintain**  
✅ **Fewer bugs**  
✅ **Faster development**

### Example

```python
# ❌ BAD - Overcomplicated
def is_valid_email(email):
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    match = re.match(pattern, email)
    if match:
        if match.group() == email:
            if len(email) > 5:
                if '@' in email:
                    parts = email.split('@')
                    if len(parts) == 2:
                        if '.' in parts[1]:
                            return True
    return False

# ✅ GOOD - Simple and clear
def is_valid_email(email):
    return '@' in email and '.' in email.split('@')[-1]

# Even better - use library
from email_validator import validate_email

def is_valid_email(email):
    try:
        validate_email(email)
        return True
    except:
        return False
```

### Guidelines

- Use simple algorithms unless complexity is needed
- Avoid clever tricks
- Write code for humans, not machines
- If you can't explain it simply, it's too complex

---

## 4. Don't Repeat Yourself (DRY) 🌵

### The Principle

**"Every piece of knowledge must have a single, unambiguous representation"**

### Why

✅ **Single source of truth**  
✅ **Easier to maintain**  
✅ **Consistent behavior**  
✅ **Less code to test**

### Example

```python
# ❌ BAD - Repetition
class Order:
    def calculate_total(self):
        total = 0
        for item in self.items:
            total += item.price * item.quantity
        tax = total * 0.10
        return total + tax
    
    def calculate_subtotal(self):
        total = 0
        for item in self.items:
            total += item.price * item.quantity
        return total
    
    def calculate_tax(self):
        total = 0
        for item in self.items:
            total += item.price * item.quantity
        return total * 0.10

# ✅ GOOD - DRY
class Order:
    def calculate_subtotal(self):
        return sum(item.price * item.quantity for item in self.items)
    
    def calculate_tax(self):
        return self.calculate_subtotal() * 0.10
    
    def calculate_total(self):
        return self.calculate_subtotal() + self.calculate_tax()
```

### When NOT to DRY

**Don't** extract code that:
- Happens to look similar but represents different concepts
- Would create artificial coupling
- Makes code harder to understand

```python
# Different concepts - don't DRY
def calculate_order_total(items):
    return sum(item.price for item in items)

def calculate_employee_salary(hours):
    return sum(hour.rate for hour in hours)

# These look similar but are different business concepts
# Don't extract into one function!
```

---

## 5. YAGNI (You Aren't Gonna Need It) 🚫

### The Principle

**"Don't add functionality until you need it"**

### Why

✅ **Less code to maintain**  
✅ **Simpler codebase**  
✅ **Faster development**  
✅ **Requirements change anyway**

### Example

```python
# ❌ BAD - Building for "future needs"
class User:
    def __init__(self, name, email):
        self.name = name
        self.email = email
        self.phone = None  # Might need later
        self.address = None  # Might need later
        self.preferences = {}  # Might need later
        self.settings = {}  # Might need later
        self.metadata = {}  # Might need later
        self.tags = []  # Might need later
        self.notes = []  # Might need later
    
    def set_phone(self, phone):
        # Future functionality
        pass
    
    def set_preferences(self, prefs):
        # Future functionality
        pass
    
    # 20 more "future" methods...

# ✅ GOOD - Only what's needed now
class User:
    def __init__(self, name, email):
        self.name = name
        self.email = email

# Add more fields when actually needed!
```

### Balance

**Don't confuse YAGNI with:**
- Not thinking ahead at all
- Ignoring obvious extensibility needs
- Writing inflexible code

**Good example:**
```python
# Design for extensibility, but don't implement unused features
class PaymentProcessor:
    def process(self, amount):
        # Implement what's needed NOW
        pass

# Easy to extend LATER when needed
class CreditCardProcessor(PaymentProcessor):
    pass  # Add when needed

class PayPalProcessor(PaymentProcessor):
    pass  # Add when needed
```

---

## 6. Encapsulate What Varies 📦

### The Principle

**"Identify aspects that vary and separate them from what stays the same"**

### Why

✅ **Minimize impact of change**  
✅ **More flexible**  
✅ **Easier to extend**

### Example

```python
# ❌ BAD - Variation mixed with stable code
class PriceCalculator:
    def calculate(self, product, customer):
        price = product.price
        
        # Varying discount logic
        if customer.type == "regular":
            discount = 0
        elif customer.type == "premium":
            discount = price * 0.10
        elif customer.type == "vip":
            discount = price * 0.20
        
        return price - discount

# ✅ GOOD - Encapsulate varying part
class DiscountStrategy(ABC):
    @abstractmethod
    def calculate_discount(self, price):
        pass

class NoDiscount(DiscountStrategy):
    def calculate_discount(self, price):
        return 0

class PremiumDiscount(DiscountStrategy):
    def calculate_discount(self, price):
        return price * 0.10

class VIPDiscount(DiscountStrategy):
    def calculate_discount(self, price):
        return price * 0.20

class PriceCalculator:
    def __init__(self, discount_strategy: DiscountStrategy):
        self.discount_strategy = discount_strategy
    
    def calculate(self, product):
        price = product.price
        discount = self.discount_strategy.calculate_discount(price)
        return price - discount

# Easy to add new discount types!
```

---

## 7. Principle of Least Knowledge (Law of Demeter) 🎯

### The Principle

**"Only talk to your immediate friends"**

### Why

✅ **Loose coupling**  
✅ **Less dependencies**  
✅ **Easier to change**

### Example

```python
# ❌ BAD - Violates Law of Demeter
class Wallet:
    def __init__(self, amount):
        self.amount = amount

class Customer:
    def __init__(self, wallet):
        self.wallet = wallet

class Cashier:
    def process_payment(self, customer, amount):
        # Reaches into customer's wallet!
        if customer.wallet.amount >= amount:
            customer.wallet.amount -= amount
            return True
        return False

# ✅ GOOD - Tell, Don't Ask
class Wallet:
    def __init__(self, amount):
        self._amount = amount
    
    def has_enough(self, amount):
        return self._amount >= amount
    
    def deduct(self, amount):
        if self.has_enough(amount):
            self._amount -= amount
            return True
        return False

class Customer:
    def __init__(self, wallet):
        self._wallet = wallet
    
    def pay(self, amount):
        return self._wallet.deduct(amount)

class Cashier:
    def process_payment(self, customer, amount):
        return customer.pay(amount)  # Just ask customer to pay!
```

### Rules

A method should only call methods on:
1. Itself
2. Its parameters
3. Objects it creates
4. Its direct components

**Don't:**
```python
# ❌ Don't chain method calls
customer.getWallet().getMoney().getAmount()

# ✅ Do encapsulate
customer.pay(amount)
```

---

## 8. Fail Fast ⚡

### The Principle

**"Detect problems as early as possible"**

### Why

✅ **Easier debugging**  
✅ **Prevent cascading failures**  
✅ **Clear error messages**

### Example

```python
# ❌ BAD - Fail late
class UserService:
    def create_user(self, name, email, age):
        user = User()
        user.name = name
        user.email = email
        user.age = age
        
        # Save to database
        self.db.save(user)
        
        # Send email
        self.email.send(email, "Welcome!")
        
        # Only now check if email is valid!
        if not self.is_valid_email(email):
            raise ValueError("Invalid email")

# ✅ GOOD - Fail fast
class UserService:
    def create_user(self, name, email, age):
        # Validate immediately!
        if not name:
            raise ValueError("Name is required")
        
        if not self.is_valid_email(email):
            raise ValueError("Invalid email")
        
        if age < 0:
            raise ValueError("Age must be positive")
        
        # Now proceed
        user = User(name, email, age)
        self.db.save(user)
        self.email.send(email, "Welcome!")
        return user
```

---

## 9. Write Tests ✅

### The Principle

**"Code without tests is legacy code"**

### Why

✅ **Confidence in changes**  
✅ **Documentation**  
✅ **Better design**  
✅ **Catch bugs early**

### Example

```python
# Production code
class Calculator:
    def add(self, a, b):
        return a + b
    
    def divide(self, a, b):
        if b == 0:
            raise ValueError("Cannot divide by zero")
        return a / b

# Tests
import pytest

def test_add():
    calc = Calculator()
    assert calc.add(2, 3) == 5
    assert calc.add(-1, 1) == 0

def test_divide():
    calc = Calculator()
    assert calc.divide(10, 2) == 5
    
    with pytest.raises(ValueError):
        calc.divide(10, 0)
```

### Best Practices

- Test behavior, not implementation
- One assert per test (when possible)
- Clear test names
- Arrange-Act-Assert pattern
- Keep tests fast
- Don't test private methods

---

## Interview Questions

<details>
<summary><strong>View Questions</strong></summary>

### Q1: Explain "Favor Composition Over Inheritance"

<details>
<summary><strong>View Answer</strong></summary>

**Composition** = Has-A relationship  
**Inheritance** = Is-A relationship

**Why favor composition:**

1. **Flexibility** - Change at runtime
```python
# Composition - switch behaviors easily
robot = Robot(WalkingCapability())
robot.add_capability(FlyingCapability())
```

2. **No diamond problem**
```python
# Inheritance - diamond problem
class A → B, C → D  # Ambiguous

# Composition - no problem
class D:
    def __init__(self):
        self.b = B()
        self.c = C()
```

3. **Multiple behaviors**
```python
# Easy with composition
robot = Robot(Walk(), Fly(), Swim())

# Hard with inheritance
class FlyingSwimmingWalkingRobot???
```

**When to use inheritance:**
- Clear IS-A (Dog IS-A Animal)
- Shallow hierarchy
- Need polymorphism

**Remember:** Composition for flexibility, inheritance for IS-A.
</details>

### Q2: What does KISS mean and why is it important?

<details>
<summary><strong>View Answer</strong></summary>

**KISS** = "Keep It Simple, Stupid" or "Keep It Short and Simple"

**Why important:**

1. **Easier to understand**
```python
# ❌ Complex
def check(x):
    return True if x > 0 and x < 100 and x % 2 == 0 else False

# ✅ Simple
def is_valid_even(x):
    return 0 < x < 100 and x % 2 == 0
```

2. **Fewer bugs** - Less code = fewer places for bugs
3. **Faster development** - Simple solutions faster to write
4. **Easier maintenance** - Future developers thank you

**How to apply:**
- Use simple algorithms unless proven necessary
- Avoid clever tricks
- If it's hard to explain, it's too complex
- Refactor complex code

**Quote:** *"Simplicity is the ultimate sophistication"*
</details>

### Q3: What is the Law of Demeter (Principle of Least Knowledge)?

<details>
<summary><strong>View Answer</strong></summary>

**Law of Demeter:** "Only talk to your immediate friends"

**A method should only call methods on:**
1. Itself (this)
2. Its parameters
3. Objects it creates
4. Its direct components

**Example:**
```python
# ❌ Violates Law of Demeter
customer.getWallet().getMoney().getAmount()

# ✅ Follows Law of Demeter
customer.pay(amount)
```

**Why important:**
- **Loose coupling** - Less dependencies
- **Easier to change** - Implementation details hidden
- **Better encapsulation**

**Real-world analogy:**
- ❌ Don't reach into someone's pocket for their wallet
- ✅ Ask them to pay you

This is also called **"Tell, Don't Ask"** principle.
</details>

</details>

---

## Practice Questions

<details>
<summary><strong>View Questions</strong></summary>

### Fill in the Gaps

1. "Favor __________ over __________" promotes flexible, loosely coupled designs.
2. KISS stands for "Keep It __________, __________".
3. DRY stands for "Don't __________ __________".
4. YAGNI means "You __________ __________ __________ __________".
5. The Law of Demeter states "Only talk to your __________ __________".

<details>
<summary><strong>View Answers</strong></summary>

1. Composition, Inheritance
2. Simple, Stupid (or Short, Simple)
3. Repeat, Yourself
4. Aren't, Gonna, Need, It
5. immediate, friends

</details>

### True/False

1. Composition is more flexible than inheritance.
2. You should always optimize code from the start (violates YAGNI).
3. The DRY principle means never having similar-looking code.
4. KISS means using the simplest solution that works.
5. Programming to interfaces makes code harder to test.
6. Fail Fast means catching errors as early as possible.
7. Law of Demeter promotes loose coupling.

<details>
<summary><strong>View Answers</strong></summary>

1. True - Can change behavior at runtime
2. False - YAGNI says don't add features until needed
3. False - DRY is about duplicated knowledge, not appearance
4. True - Simplicity is key
5. False - Interfaces make testing easier with mocks
6. True - Detect problems immediately
7. True - Reduces dependencies

</details>

### Multiple Choice Questions

1. When should you use inheritance over composition?
   - A) Always
   - B) Never
   - C) For clear IS-A relationships with shallow hierarchies
   - D) When you want flexibility

2. What's the main benefit of programming to interfaces?
   - A) Faster code
   - B) Less code to write
   - C) Easy to swap implementations
   - D) More classes

3. What does YAGNI help prevent?
   - A) Bugs
   - B) Over-engineering
   - C) Bad naming
   - D) Slow code

<details>
<summary><strong>View Answers</strong></summary>

1. C) For clear IS-A relationships with shallow hierarchies
2. C) Easy to swap implementations - Core benefit of abstraction
3. B) Over-engineering - Don't build what you don't need

</details>

</details>

---

## Summary

### Core Best Practices

1. **Composition over Inheritance** - Flexible, loosely coupled
2. **Program to Interfaces** - Depend on abstractions
3. **KISS** - Keep it simple
4. **DRY** - Don't repeat yourself
5. **YAGNI** - You aren't gonna need it
6. **Encapsulate What Varies** - Separate changing from stable
7. **Law of Demeter** - Only talk to friends
8. **Fail Fast** - Detect problems early
9. **Write Tests** - Confidence in changes

### For Interviews

Be ready to:
- ✅ Explain each principle with examples
- ✅ Show code that violates principles
- ✅ Refactor code to follow principles
- ✅ Discuss trade-offs
- ✅ Give real-world scenarios

---

[← Back to Anti-Patterns](01-anti-patterns.md) | [Next: Code Smells →](03-code-smells.md) | [↑ Back to README](../README.md)