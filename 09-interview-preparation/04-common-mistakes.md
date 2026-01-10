# 9.4 Common Mistakes to Avoid

[← Back to System Design](03-system-design.md) | [↑ Back to README](../README.md)

---

## 1. Violating Encapsulation

### ❌ Mistake: Exposing Internal State

```python
class BankAccount:
    def __init__(self, balance):
        self.balance = balance  # Public! ❌
    
    def withdraw(self, amount):
        self.balance -= amount

# Anyone can modify directly
account = BankAccount(1000)
account.balance = 999999  # Bypassed all business logic!
```

### ✅ Correct: Proper Encapsulation

```python
class BankAccount:
    def __init__(self, balance):
        self._balance = balance  # Protected
    
    def get_balance(self):
        return self._balance
    
    def withdraw(self, amount):
        if amount > self._balance:
            raise ValueError("Insufficient funds")
        self._balance -= amount

account = BankAccount(1000)
# Can't modify directly - must use methods
account.withdraw(100)
```

**Why it matters:**
- ✅ Control how data is accessed/modified
- ✅ Enforce business rules
- ✅ Easier to debug and maintain

---

## 2. Inheritance for Code Reuse Only

### ❌ Mistake: Forcing IS-A Relationship

```python
class ArrayList:
    def add(self, item): pass
    def remove(self, item): pass
    def size(self): pass

# ❌ Stack is NOT an ArrayList!
class Stack(ArrayList):
    def push(self, item):
        self.add(item)
    
    def pop(self):
        return self.remove(self.size() - 1)

# Problem: Can still use ArrayList methods
stack = Stack()
stack.add("wrong!")  # Breaks stack semantics
```

### ✅ Correct: Use Composition

```python
class Stack:
    def __init__(self):
        self._items = []  # HAS-A list
    
    def push(self, item):
        self._items.append(item)
    
    def pop(self):
        if not self._items:
            raise IndexError("Stack is empty")
        return self._items.pop()

# Only stack operations available
stack = Stack()
stack.push("correct")
# stack.add() doesn't exist ✅
```

**Why it matters:**
- ✅ Clear interface
- ✅ Prevents misuse
- ✅ Follows Liskov Substitution Principle

---

## 3. Not Following Single Responsibility Principle

### ❌ Mistake: God Object

```python
class User:
    def __init__(self, name, email):
        self.name = name
        self.email = email
    
    def save_to_database(self):
        # Database logic ❌
        pass
    
    def send_welcome_email(self):
        # Email logic ❌
        pass
    
    def validate_email(self):
        # Validation logic ❌
        pass
    
    def calculate_age(self):
        # Business logic ❌
        pass
    
    def generate_report(self):
        # Reporting logic ❌
        pass
```

### ✅ Correct: Separate Responsibilities

```python
class User:
    """Just user data"""
    def __init__(self, name, email):
        self.name = name
        self.email = email

class UserRepository:
    """Database operations"""
    def save(self, user):
        pass

class EmailService:
    """Email operations"""
    def send_welcome(self, user):
        pass

class UserValidator:
    """Validation logic"""
    @staticmethod
    def validate_email(email):
        pass

# Each class has ONE responsibility
```

**Why it matters:**
- ✅ Easier to test
- ✅ Easier to maintain
- ✅ Easier to understand
- ✅ Changes isolated

---

## 4. Ignoring Interface Segregation

### ❌ Mistake: Fat Interface

```python
class Worker:
    def work(self): pass
    def eat(self): pass
    def sleep(self): pass

class Robot(Worker):
    def work(self):
        return "Working"
    
    def eat(self):
        raise NotImplementedError("Robots don't eat!")  # ❌
    
    def sleep(self):
        raise NotImplementedError("Robots don't sleep!")  # ❌
```

### ✅ Correct: Segregated Interfaces

```python
class Workable:
    def work(self): pass

class Eatable:
    def eat(self): pass

class Sleepable:
    def sleep(self): pass

class Human(Workable, Eatable, Sleepable):
    def work(self): return "Working"
    def eat(self): return "Eating"
    def sleep(self): return "Sleeping"

class Robot(Workable):
    def work(self): return "Working"
    # No eat() or sleep() ✅
```

**Why it matters:**
- ✅ Clients only depend on what they need
- ✅ No forced implementations
- ✅ More flexible

---

## 5. Tight Coupling

### ❌ Mistake: Direct Dependencies

```python
class OrderProcessor:
    def __init__(self):
        self.email_service = GmailService()  # Hardcoded! ❌
        self.payment = StripePayment()       # Hardcoded! ❌
    
    def process(self, order):
        self.payment.charge(order.total)
        self.email_service.send(order.user.email)

# Can't test without real Gmail and Stripe!
# Can't switch to different services!
```

### ✅ Correct: Dependency Injection

```python
class OrderProcessor:
    def __init__(self, email_service, payment_service):
        self.email_service = email_service  # Injected ✅
        self.payment_service = payment_service  # Injected ✅
    
    def process(self, order):
        self.payment_service.charge(order.total)
        self.email_service.send(order.user.email)

# Easy to test with mocks
processor = OrderProcessor(MockEmailService(), MockPayment())

# Easy to switch implementations
processor = OrderProcessor(SendGridService(), PayPalPayment())
```

**Why it matters:**
- ✅ Testable
- ✅ Flexible
- ✅ Loosely coupled

---

## 6. Premature Optimization

### ❌ Mistake: Over-Engineering

```python
class StringCache:
    """❌ Complex caching for simple string storage"""
    def __init__(self):
        self._cache = {}
        self._access_counts = {}
        self._lru_queue = deque()
        self._lock = threading.Lock()
    
    def get(self, key):
        with self._lock:
            if key in self._cache:
                self._access_counts[key] += 1
                self._lru_queue.remove(key)
                self._lru_queue.append(key)
                return self._cache[key]
            return None
    
    # ... 100 more lines of complex caching logic

# Used for: storing 5 configuration strings 🤦
config = StringCache()
```

### ✅ Correct: Start Simple

```python
# Simple dictionary is enough!
config = {
    "api_key": "xyz",
    "timeout": "30",
    "retries": "3"
}

# If it becomes a bottleneck (proven by profiling), THEN optimize
```

**Why it matters:**
- ✅ Faster development
- ✅ Easier to understand
- ✅ Less bugs
- ✅ Optimize only when needed

**Remember:** *"Premature optimization is the root of all evil"* - Donald Knuth

---

## 7. Not Using Appropriate Design Patterns

### ❌ Mistake: Reinventing the Wheel

```python
class NotificationSender:
    def send(self, type, message):
        if type == "email":
            # Email sending code
            pass
        elif type == "sms":
            # SMS sending code
            pass
        elif type == "push":
            # Push notification code
            pass
        # More if-else for each new type ❌
```

### ✅ Correct: Use Strategy Pattern

```python
class NotificationStrategy(ABC):
    @abstractmethod
    def send(self, message): pass

class EmailNotification(NotificationStrategy):
    def send(self, message):
        # Email logic
        pass

class SMSNotification(NotificationStrategy):
    def send(self, message):
        # SMS logic
        pass

class NotificationSender:
    def __init__(self, strategy):
        self.strategy = strategy
    
    def send(self, message):
        self.strategy.send(message)

# Easy to add new types, no modifications needed
sender = NotificationSender(EmailNotification())
```

**Why it matters:**
- ✅ Open/Closed Principle
- ✅ Cleaner code
- ✅ Easier to extend

---

## 8. Mutable Default Arguments

### ❌ Mistake: Mutable Defaults

```python
class ShoppingCart:
    def __init__(self, items=[]):  # ❌ Mutable default!
        self.items = items

cart1 = ShoppingCart()
cart1.items.append("apple")

cart2 = ShoppingCart()
print(cart2.items)  # ['apple'] 😱 Shared list!
```

### ✅ Correct: Use None

```python
class ShoppingCart:
    def __init__(self, items=None):
        self.items = items if items is not None else []

cart1 = ShoppingCart()
cart1.items.append("apple")

cart2 = ShoppingCart()
print(cart2.items)  # [] ✅ Separate lists
```

**Why it matters:**
- ✅ Prevents shared state
- ✅ Each instance independent
- ✅ Avoids subtle bugs

---

## 9. Ignoring Error Handling

### ❌ Mistake: Silent Failures

```python
class FileProcessor:
    def process(self, filename):
        file = open(filename)  # ❌ What if file doesn't exist?
        data = file.read()
        result = self.parse(data)  # ❌ What if parse fails?
        return result
```

### ✅ Correct: Explicit Error Handling

```python
class FileProcessor:
    def process(self, filename):
        try:
            with open(filename, 'r') as file:
                data = file.read()
        except FileNotFoundError:
            raise ValueError(f"File not found: {filename}")
        except IOError as e:
            raise ValueError(f"Error reading file: {e}")
        
        try:
            result = self.parse(data)
            return result
        except ParseError as e:
            raise ValueError(f"Error parsing data: {e}")
```

**Why it matters:**
- ✅ Predictable behavior
- ✅ Easier debugging
- ✅ Better user experience

---

## 10. Not Writing Tests

### ❌ Mistake: No Tests

```python
class Calculator:
    def divide(self, a, b):
        return a / b  # What about b=0?

# No tests = bugs in production
```

### ✅ Correct: Write Tests

```python
class Calculator:
    def divide(self, a, b):
        if b == 0:
            raise ValueError("Cannot divide by zero")
        return a / b

# Tests
import pytest

def test_divide_normal():
    calc = Calculator()
    assert calc.divide(10, 2) == 5

def test_divide_by_zero():
    calc = Calculator()
    with pytest.raises(ValueError):
        calc.divide(10, 0)
```

**Why it matters:**
- ✅ Catch bugs early
- ✅ Confidence in changes
- ✅ Documentation
- ✅ Better design

---

## Quick Checklist Before Submitting Code

### ✅ OOP Principles
- [ ] Each class has single responsibility
- [ ] Used composition where appropriate
- [ ] Proper encapsulation (private fields)
- [ ] Followed SOLID principles

### ✅ Design Patterns
- [ ] Used appropriate patterns
- [ ] Didn't over-engineer
- [ ] Code is extensible

### ✅ Code Quality
- [ ] Meaningful names
- [ ] No code duplication
- [ ] Proper error handling
- [ ] Comments where needed

### ✅ Testing
- [ ] Unit tests written
- [ ] Edge cases covered
- [ ] Tests pass

### ✅ Common Pitfalls Avoided
- [ ] No mutable default arguments
- [ ] No tight coupling
- [ ] No premature optimization
- [ ] Proper interface segregation

---

## Summary of Key Mistakes

| Mistake | Impact | Fix |
|---------|--------|-----|
| **Breaking Encapsulation** | Uncontrolled state changes | Use private fields, getters/setters |
| **Wrong Inheritance** | Fragile code | Use composition instead |
| **God Objects** | Hard to maintain | Follow SRP, split classes |
| **Fat Interfaces** | Forced implementations | Segregate interfaces |
| **Tight Coupling** | Hard to test/change | Dependency injection |
| **Premature Optimization** | Wasted time | Profile first, optimize later |
| **No Design Patterns** | Reinventing wheel | Learn and apply patterns |
| **Mutable Defaults** | Shared state bugs | Use None, create new objects |
| **No Error Handling** | Silent failures | Try-except, validate inputs |
| **No Tests** | Production bugs | Write tests first |

---

## Interview Red Flags

Watch out for these in your code:

🚩 Classes with 10+ methods  
🚩 Methods with 50+ lines  
🚩 Deep nesting (3+ levels)  
🚩 Hard-coded values  
🚩 Public fields everywhere  
🚩 No error handling  
🚩 Copy-pasted code  
🚩 God classes  
🚩 No tests  

---

[← Back to System Design](03-system-design.md) | [↑ Back to README](../README.md)