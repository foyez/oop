# 5.1 Creational Design Patterns

[← Back to Introduction](00-introduction.md) | [Next: Structural Patterns →](02-structural-patterns.md) | [↑ Back to README](../README.md)

---

## What Are Creational Patterns?

**Creational patterns** deal with **object creation mechanisms**.

### Problem They Solve
- Complex object creation logic
- Need flexibility in what gets created
- Want to hide creation details

### Core Idea
**"Control HOW and WHEN objects are created"**

---

## 1. Factory Pattern 🏭

### What Problem Does It Solve?

**Problem:** Need to create objects without knowing the exact class beforehand.

**Real-world analogy:** Restaurant kitchen
- Customer orders "vegetarian meal"
- Kitchen decides: salad, veggie burger, or pasta?
- Customer doesn't know/care about specific dish class

### When to Use

✅ Object creation logic is complex  
✅ Don't know exact type until runtime  
✅ Want to centralize creation logic  
✅ Need to add new types easily (Open/Closed Principle)

### Implementation

```python
from abc import ABC, abstractmethod

# Product interface
class Notification(ABC):
    @abstractmethod
    def send(self, message):
        pass

# Concrete products
class EmailNotification(Notification):
    def send(self, message):
        return f"Sending email: {message}"

class SMSNotification(Notification):
    def send(self, message):
        return f"Sending SMS: {message}"

class PushNotification(Notification):
    def send(self, message):
        return f"Sending push: {message}"

# Factory
class NotificationFactory:
    @staticmethod
    def create_notification(notification_type):
        notifications = {
            "email": EmailNotification,
            "sms": SMSNotification,
            "push": PushNotification
        }
        
        notification_class = notifications.get(notification_type)
        if not notification_class:
            raise ValueError(f"Unknown type: {notification_type}")
        
        return notification_class()

# Usage
def notify_user(channel, message):
    notification = NotificationFactory.create_notification(channel)
    return notification.send(message)

print(notify_user("email", "Welcome!"))
print(notify_user("sms", "Your code: 1234"))
```

### Benefits

✅ **Encapsulation** - Creation logic in one place  
✅ **Flexibility** - Easy to add new types  
✅ **Open/Closed** - Add types without modifying existing code  
✅ **Single Responsibility** - Factory only creates objects

### TypeScript Example

```typescript
interface Vehicle {
    drive(): string;
}

class Car implements Vehicle {
    drive(): string {
        return "Driving a car";
    }
}

class Motorcycle implements Vehicle {
    drive(): string {
        return "Riding a motorcycle";
    }
}

class VehicleFactory {
    static createVehicle(type: string): Vehicle {
        switch(type) {
            case "car":
                return new Car();
            case "motorcycle":
                return new Motorcycle();
            default:
                throw new Error(`Unknown vehicle type: ${type}`);
        }
    }
}

// Usage
const vehicle = VehicleFactory.createVehicle("car");
console.log(vehicle.drive());
```

---

## 2. Singleton Pattern 👑

### What Problem Does It Solve?

**Problem:** Need exactly ONE instance of a class throughout the application.

**Real-world analogy:** Government
- Only ONE president at a time
- Everyone refers to the same leader
- Can't have multiple presidents simultaneously

### When to Use

✅ Need exactly one instance (Logger, Configuration, Database connection)  
✅ Global access point required  
✅ Control resource usage  
⚠️ **Warning:** Can make testing difficult - use sparingly!

### Implementation

```python
class Logger:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.logs = []
        return cls._instance
    
    def log(self, message):
        self.logs.append(message)
        print(f"[LOG] {message}")
    
    def get_logs(self):
        return self.logs

# Usage
logger1 = Logger()
logger1.log("Application started")

logger2 = Logger()
logger2.log("User logged in")

print(logger1 is logger2)  # True - same instance!
print(logger1.get_logs())  # Both logs visible
# Output: ['Application started', 'User logged in']
```

### Thread-Safe Singleton

```python
import threading

class ThreadSafeLogger:
    _instance = None
    _lock = threading.Lock()
    
    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                # Double-check locking
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
                    cls._instance.logs = []
        return cls._instance
    
    def log(self, message):
        with self._lock:
            self.logs.append(message)
            print(f"[LOG] {message}")
```

### Benefits & Drawbacks

**Benefits:**

✅ Controlled access to single instance  
✅ Reduced memory footprint  
✅ Global access point

**Drawbacks:**

❌ Hard to test (global state)  
❌ Violates Single Responsibility  
❌ Can hide dependencies  
❌ Threading issues if not careful

### Alternative: Dependency Injection

```python
# Instead of Singleton, consider DI
class Logger:
    def __init__(self):
        self.logs = []
    
    def log(self, message):
        self.logs.append(message)

# Create once, inject everywhere
logger = Logger()

class UserService:
    def __init__(self, logger):
        self.logger = logger
    
    def create_user(self):
        self.logger.log("User created")

service = UserService(logger)  # Inject dependency
```

---

## 3. Builder Pattern 🏗️

### What Problem Does It Solve?

**Problem:** Creating complex objects with many optional parameters.

**Real-world analogy:** Ordering a custom pizza
- Choose crust type
- Choose sauce
- Choose toppings (multiple)
- Choose size
- Step-by-step construction

### When to Use

✅ Object has many parameters (especially optional)  
✅ Object construction requires multiple steps  
✅ Want immutable objects  
✅ Avoid "telescoping constructor" problem

### The Telescoping Constructor Problem

```python
# ❌ BAD - Too many parameters
class Computer:
    def __init__(self, cpu, ram, storage, gpu=None, wifi=None, 
                 bluetooth=None, screen_size=None, os=None):
        # Which parameter is which???
        pass

# Confusing usage
computer = Computer("i9", "32GB", "1TB", None, True, True, 15.6, "Windows")
```

### Builder Solution

```python
class Computer:
    def __init__(self):
        # Required
        self.cpu = None
        self.ram = None
        self.storage = None
        
        # Optional
        self.gpu = None
        self.wifi = False
        self.bluetooth = False
        self.screen_size = None
        self.os = None
    
    def __str__(self):
        return f"Computer: CPU={self.cpu}, RAM={self.ram}, Storage={self.storage}, GPU={self.gpu}"

class ComputerBuilder:
    def __init__(self):
        self.computer = Computer()
    
    # Required parameters
    def set_cpu(self, cpu):
        self.computer.cpu = cpu
        return self
    
    def set_ram(self, ram):
        self.computer.ram = ram
        return self
    
    def set_storage(self, storage):
        self.computer.storage = storage
        return self
    
    # Optional parameters
    def set_gpu(self, gpu):
        self.computer.gpu = gpu
        return self
    
    def set_wifi(self, enabled):
        self.computer.wifi = enabled
        return self
    
    def set_bluetooth(self, enabled):
        self.computer.bluetooth = enabled
        return self
    
    def set_screen_size(self, size):
        self.computer.screen_size = size
        return self
    
    def set_os(self, os):
        self.computer.os = os
        return self
    
    def build(self):
        # Validate required fields
        if not all([self.computer.cpu, self.computer.ram, self.computer.storage]):
            raise ValueError("CPU, RAM, and Storage are required")
        return self.computer

# Usage - Fluent interface (method chaining)
gaming_pc = (ComputerBuilder()
    .set_cpu("Intel i9")
    .set_ram("32GB")
    .set_storage("1TB SSD")
    .set_gpu("RTX 4090")
    .set_wifi(True)
    .build())

office_pc = (ComputerBuilder()
    .set_cpu("Intel i5")
    .set_ram("16GB")
    .set_storage("512GB SSD")
    .build())

print(gaming_pc)
print(office_pc)
```

### Director Pattern (Optional)

```python
class ComputerDirector:
    def __init__(self, builder):
        self.builder = builder
    
    def build_gaming_pc(self):
        return (self.builder
            .set_cpu("Intel i9")
            .set_ram("32GB")
            .set_storage("2TB SSD")
            .set_gpu("RTX 4090")
            .set_wifi(True)
            .set_bluetooth(True)
            .build())
    
    def build_office_pc(self):
        return (self.builder
            .set_cpu("Intel i5")
            .set_ram("16GB")
            .set_storage("512GB SSD")
            .set_wifi(True)
            .build())

# Usage
director = ComputerDirector(ComputerBuilder())
gaming_pc = director.build_gaming_pc()
office_pc = director.build_office_pc()
```

### Benefits

✅ **Readable** - Clear what each parameter is  
✅ **Flexible** - Optional parameters easy to handle  
✅ **Immutable** - Build once, then use  
✅ **Validation** - Check required fields before building

---

## Interview Questions

<details>
<summary><strong>View Questions</strong></summary>

### Q1: What's the difference between Factory and Builder patterns?

<details>
<summary><strong>View Answer</strong></summary>

**Factory Pattern:**
- **Purpose:** Create different types of objects
- **When:** Don't know exact type until runtime
- **Focus:** WHICH object to create
- **Creation:** Usually one-step

```python
# Factory - creates different types
notification = NotificationFactory.create("email")
```

**Builder Pattern:**
- **Purpose:** Construct complex objects step-by-step
- **When:** Object has many parameters
- **Focus:** HOW to construct object
- **Creation:** Multi-step process

```python
# Builder - complex construction
pc = (ComputerBuilder()
    .set_cpu("i9")
    .set_ram("32GB")
    .build())
```

**Summary:**
- Factory → WHICH type
- Builder → HOW to construct
</details>

### Q2: Why is Singleton considered an anti-pattern by some?

<details>
<summary><strong>View Answer</strong></summary>

**Problems with Singleton:**

1. **Global State** - Hard to test
```python
# Hard to test - uses global Singleton
class UserService:
    def create_user(self):
        Logger().log("User created")  # Hidden dependency!

# Can't inject mock logger for testing
```

2. **Hidden Dependencies**
- Not clear from constructor what class needs
- Violates Dependency Injection

3. **Thread Safety Issues**
- Need extra code for thread safety

4. **Violates Single Responsibility**
- Manages both: instance creation + business logic

**Better Alternative:**
```python
# Dependency Injection instead
class UserService:
    def __init__(self, logger):  # Clear dependency!
        self.logger = logger

# Easy to test
mock_logger = MockLogger()
service = UserService(mock_logger)
```

**When Singleton IS acceptable:**
- Configuration that never changes
- Logger in simple applications
- Resource pools
</details>

### Q3: How would you implement Factory pattern for a payment system?

<details>
<summary><strong>View Answer</strong></summary>

```python
from abc import ABC, abstractmethod

# Product interface
class PaymentMethod(ABC):
    @abstractmethod
    def process_payment(self, amount):
        pass

# Concrete products
class CreditCardPayment(PaymentMethod):
    def process_payment(self, amount):
        return f"Processing ${amount} via Credit Card"

class PayPalPayment(PaymentMethod):
    def process_payment(self, amount):
        return f"Processing ${amount} via PayPal"

class CryptoPayment(PaymentMethod):
    def process_payment(self, amount):
        return f"Processing ${amount} via Cryptocurrency"

# Factory
class PaymentFactory:
    @staticmethod
    def create_payment(payment_type):
        payments = {
            "credit_card": CreditCardPayment,
            "paypal": PayPalPayment,
            "crypto": CryptoPayment
        }
        
        payment_class = payments.get(payment_type)
        if not payment_class:
            raise ValueError(f"Unsupported payment type: {payment_type}")
        
        return payment_class()

# Usage
def process_order(payment_type, amount):
    payment = PaymentFactory.create_payment(payment_type)
    return payment.process_payment(amount)

print(process_order("credit_card", 100))
print(process_order("paypal", 50))

# Easy to add new payment methods!
```

**Why this is good:**
- ✅ Easy to add new payment types
- ✅ Client code doesn't change
- ✅ Follows Open/Closed Principle
</details>

</details>

---

## Practice Questions

<details>
<summary><strong>View Questions</strong></summary>

### Fill in the Gaps

1. The Factory pattern is used to create objects without specifying the __________ class.
2. Singleton ensures only __________ instance of a class exists throughout the application.
3. Builder pattern helps construct __________ objects step by step.
4. The __________ constructor problem occurs when a class has too many parameters.
5. Factory pattern follows the __________ Principle by allowing new types without modifying existing code.

<details>
<summary><strong>View Answers</strong></summary>

1. exact
2. one
3. complex
4. telescoping
5. Open/Closed

</details>

### True/False

1. Factory pattern encapsulates object creation logic.
2. Singleton allows multiple instances of a class.
3. Builder pattern is useful for objects with many optional parameters.
4. Singleton pattern makes testing easier.
5. Factory pattern decides WHICH object to create, Builder decides HOW to create it.
6. The Builder pattern always requires a Director class.
7. Singleton can cause threading issues if not implemented carefully.

<details>
<summary><strong>View Answers</strong></summary>

1. True - Creation logic centralized in factory
2. False - Only one instance allowed
3. True - Handles optional parameters elegantly
4. False - Singleton makes testing harder due to global state
5. True - Factory=WHICH, Builder=HOW
6. False - Director is optional, provides pre-configured builds
7. True - Need thread-safe implementation in multi-threaded apps

</details>

### Multiple Choice Questions

1. When should you use Factory pattern?
   - A) Object has many optional parameters
   - B) Need exactly one instance
   - C) Don't know object type until runtime
   - D) Object construction requires validation

2. What's the main drawback of Singleton?
   - A) Uses too much memory
   - B) Too slow
   - C) Hard to test and maintain
   - D) Requires inheritance

3. Builder pattern is most useful for:
   - A) Creating different object types
   - B) Creating a single instance
   - C) Constructing objects with many parameters
   - D) Hiding implementation details

<details>
<summary><strong>View Answers</strong></summary>

1. C) Don't know object type until runtime - Factory creates different types based on input
2. C) Hard to test and maintain - Global state makes testing difficult
3. C) Constructing objects with many parameters - Especially optional ones

</details>

### Code Challenge

**Challenge:** Refactor this code to use Builder pattern

```python
class Pizza:
    def __init__(self, size, cheese, pepperoni, mushrooms, 
                 olives, bacon, extra_cheese):
        self.size = size
        self.cheese = cheese
        self.pepperoni = pepperoni
        self.mushrooms = mushrooms
        self.olives = olives
        self.bacon = bacon
        self.extra_cheese = extra_cheese

# Confusing!
pizza = Pizza("large", True, True, False, True, False, True)
```

<details>
<summary><strong>View Solution</strong></summary>

```python
class Pizza:
    def __init__(self):
        self.size = None
        self.cheese = False
        self.pepperoni = False
        self.mushrooms = False
        self.olives = False
        self.bacon = False
        self.extra_cheese = False
    
    def __str__(self):
        toppings = []
        if self.cheese: toppings.append("cheese")
        if self.pepperoni: toppings.append("pepperoni")
        if self.mushrooms: toppings.append("mushrooms")
        if self.olives: toppings.append("olives")
        if self.bacon: toppings.append("bacon")
        if self.extra_cheese: toppings.append("extra cheese")
        
        return f"{self.size} pizza with {', '.join(toppings)}"

class PizzaBuilder:
    def __init__(self):
        self.pizza = Pizza()
    
    def set_size(self, size):
        self.pizza.size = size
        return self
    
    def add_cheese(self):
        self.pizza.cheese = True
        return self
    
    def add_pepperoni(self):
        self.pizza.pepperoni = True
        return self
    
    def add_mushrooms(self):
        self.pizza.mushrooms = True
        return self
    
    def add_olives(self):
        self.pizza.olives = True
        return self
    
    def add_bacon(self):
        self.pizza.bacon = True
        return self
    
    def add_extra_cheese(self):
        self.pizza.extra_cheese = True
        return self
    
    def build(self):
        if not self.pizza.size:
            raise ValueError("Size is required")
        return self.pizza

# Clear and readable!
pizza = (PizzaBuilder()
    .set_size("large")
    .add_cheese()
    .add_pepperoni()
    .add_olives()
    .add_extra_cheese()
    .build())

print(pizza)
# Output: large pizza with cheese, pepperoni, olives, extra cheese
```

</details>

</details>

---

## Summary

### Key Takeaways

**Factory Pattern:**
- Creates different types of objects
- WHICH object to create
- Use when: Type unknown until runtime

**Singleton Pattern:**
- Ensures one instance
- Global access point
- Use sparingly: testing issues

**Builder Pattern:**
- Constructs complex objects
- HOW to build object
- Use when: Many optional parameters

### For Interviews

Be ready to:
- ✅ Explain each pattern's purpose
- ✅ Give real-world examples
- ✅ Code simple implementation
- ✅ Discuss pros/cons
- ✅ Know when to use each

---

[← Back to Introduction](00-introduction.md) | [Next: Structural Patterns →](02-structural-patterns.md) | [↑ Back to README](../README.md)