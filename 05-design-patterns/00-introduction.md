# 5.0 Design Patterns - Introduction

[← Back to Abstract vs Interface](../04-advanced-concepts/03-abstract-vs-interface.md) | [Next: Creational Patterns →](01-creational-patterns.md) | [↑ Back to README](../README.md)

---

## What are Design Patterns?

**Design patterns are proven, reusable solutions to common software design problems.**

Think of them as **blueprints** or **templates** that you can adapt to solve recurring design challenges in your code.

### Not Code, But Concepts

Design patterns are NOT:
- ❌ Ready-to-use code you can copy-paste
- ❌ Libraries or frameworks
- ❌ Language-specific features

Design patterns ARE:
- ✅ General concepts/ideas
- ✅ Best practices from experienced developers
- ✅ Common vocabulary for developers
- ✅ Adaptable to different situations

---

## Real-World Analogy

### House Building Patterns

When building a house, architects use proven patterns:

**Foundation Pattern**
- Problem: House needs stability
- Solution: Concrete foundation (proven approach)
- You don't reinvent foundations each time

**Open Floor Plan Pattern**
- Problem: Need flexible living space
- Solution: Remove walls between kitchen/living/dining
- Proven design that works

**Same with software** - why reinvent solutions when proven patterns exist?

---

## Why Are Design Patterns Important?

### 1. Proven Solutions ✅

```python
# Without pattern - messy singleton
class Database:
    instances = {}
    
    def __init__(self, db_type):
        if db_type in Database.instances:
            return Database.instances[db_type]
        # Complex logic...

# With Singleton pattern - clean
class Database:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
```

### 2. Common Vocabulary 🗣️

Instead of explaining complex design:
- ❌ "We use a class that creates other classes based on input"
- ✅ "We use the **Factory pattern**"

Everyone immediately understands!

### 3. Best Practices 📚

Patterns embody years of collective experience:
- Avoid common pitfalls
- Maintainable code
- Tested approaches

### 4. Interview Success 💼

**Top interview question:** *"Tell me about design patterns you've used"*

Knowing patterns shows:
- ✅ Software design maturity
- ✅ Problem-solving skills
- ✅ Industry best practices
- ✅ Team collaboration ability

---

## Categories of Design Patterns

### 1. Creational Patterns 🏗️

**Problem:** Object creation complexities

**Purpose:** How to create objects

**Common patterns:**
- **Singleton** - Only one instance
- **Factory** - Create objects without specifying exact class
- **Builder** - Construct complex objects step-by-step

**Example:**
```python
# Factory Pattern
class AnimalFactory:
    @staticmethod
    def create_animal(animal_type):
        if animal_type == "dog":
            return Dog()
        elif animal_type == "cat":
            return Cat()

animal = AnimalFactory.create_animal("dog")
```

### 2. Structural Patterns 🏛️

**Problem:** How classes and objects are composed

**Purpose:** Relationship between entities

**Common patterns:**
- **Adapter** - Make incompatible interfaces work together
- **Decorator** - Add behavior dynamically
- **Facade** - Simplified interface to complex system

**Example:**
```python
# Adapter Pattern
class OldPrinter:
    def print_old(self, text):
        print(f"[Old] {text}")

class PrinterAdapter:
    def __init__(self, old_printer):
        self.old_printer = old_printer
    
    def print(self, text):  # New interface
        self.old_printer.print_old(text)
```

### 3. Behavioral Patterns 🔄

**Problem:** Communication between objects

**Purpose:** How objects interact and distribute responsibility

**Common patterns:**
- **Strategy** - Encapsulate algorithms
- **Observer** - Notify multiple objects of changes
- **Command** - Encapsulate requests as objects

**Example:**
```python
# Strategy Pattern
class QuickSort:
    def sort(self, data):
        return sorted(data)

class BubbleSort:
    def sort(self, data):
        return sorted(data)

class Sorter:
    def __init__(self, strategy):
        self.strategy = strategy
    
    def sort_data(self, data):
        return self.strategy.sort(data)

# Easy to switch algorithms
sorter = Sorter(QuickSort())
```

---

## When to Use Design Patterns

### ✅ Use Patterns When:

1. **Problem matches pattern's intent**
   - Don't force patterns where they don't fit

2. **Code becoming complex**
   - Pattern simplifies the design

3. **Anticipating change**
   - Need flexibility for future modifications

4. **Team collaboration**
   - Patterns provide common language

### ❌ Don't Use Patterns When:

1. **Overengineering simple problems**
   ```python
   # DON'T do this for simple cases
   class NumberFactory:
       def create_number(self, value):
           return Number(value)
   
   # Just do this
   number = 5
   ```

2. **Not understanding the pattern**
   - Learn it first, then apply

3. **Forcing patterns**
   - Pattern should solve a real problem

---

## Common Interview Questions

<details>
<summary><strong>Q1: What are design patterns and why are they important?</strong></summary>

**Answer:**

Design patterns are **proven, reusable solutions** to common software design problems. They're like blueprints that experienced developers have created and refined over time.

**Why important:**

1. **Proven solutions** - Tested and optimized by the community
2. **Common vocabulary** - "Use Factory pattern" vs lengthy explanation
3. **Best practices** - Avoid common mistakes
4. **Maintainability** - Easier for others to understand
5. **Interview success** - Shows design maturity

**Example:**
Instead of creating complex object creation logic each time, use **Factory pattern**:

```python
# Without pattern - messy
def get_shape(shape_type):
    if shape_type == "circle":
        return Circle()
    elif shape_type == "rectangle":
        return Rectangle()
    # Gets messy with more types

# With Factory pattern - clean
class ShapeFactory:
    @staticmethod
    def create_shape(shape_type):
        shapes = {
            "circle": Circle,
            "rectangle": Rectangle
        }
        return shapes[shape_type]()
```

</details>

<details>
<summary><strong>Q2: What are the three main categories of design patterns?</strong></summary>

**Answer:**

**1. Creational Patterns** - Object creation
- Focus: HOW objects are created
- Examples: Singleton, Factory, Builder
- Use when: Object creation is complex

**2. Structural Patterns** - Object composition
- Focus: HOW classes/objects are organized
- Examples: Adapter, Decorator, Facade
- Use when: Need to compose classes in flexible ways

**3. Behavioral Patterns** - Object interaction
- Focus: HOW objects communicate
- Examples: Strategy, Observer, Command
- Use when: Need flexible object communication

**Memory aid:** **CSB** - Creational, Structural, Behavioral
</details>

<details>
<summary><strong>Q3: Can you give an example of when NOT to use design patterns?</strong></summary>

**Answer:**

Don't use patterns when they overcomplicate simple problems:

**Bad - Overengineering:**
```python
# For a simple calculator, this is overkill
class AdditionStrategy:
    def execute(self, a, b):
        return a + b

class SubtractionStrategy:
    def execute(self, a, b):
        return a - b

class Calculator:
    def __init__(self, strategy):
        self.strategy = strategy
    
    def calculate(self, a, b):
        return self.strategy.execute(a, b)

calc = Calculator(AdditionStrategy())
result = calc.calculate(2, 3)
```

**Good - Keep it simple:**
```python
# Just use functions!
def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

result = add(2, 3)
```

**When to avoid patterns:**
1. Problem is simple and straightforward
2. You don't fully understand the pattern
3. Adding unnecessary complexity
4. No anticipated changes or flexibility needed

**Remember:** Patterns solve problems. No problem = No pattern needed.
</details>

<details>
<summary><strong>Q4: How do design patterns improve code maintainability?</strong></summary>

**Answer:**

Design patterns improve maintainability in several ways:

**1. Standardized Solutions**
```python
# Everyone knows Singleton pattern
class Logger:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

# New developer sees this and immediately understands
# "Ah, singleton - only one logger instance"
```

**2. Separation of Concerns**
```python
# Strategy pattern separates algorithm from usage
class PaymentProcessor:
    def __init__(self, payment_strategy):
        self.strategy = payment_strategy
    
    def process(self, amount):
        return self.strategy.pay(amount)

# Easy to modify payment methods without touching processor
```

**3. Common Vocabulary**
```python
# Code review becomes easier:
# "Let's use Observer pattern here" vs
# "Let's make objects that notify other objects when state changes"
```

**4. Easier Testing**
```python
# Factory pattern makes testing easier
def test_order_processing():
    # Easy to inject mock payment
    mock_payment = MockPaymentStrategy()
    processor = PaymentProcessor(mock_payment)
    # Test without real payment
```

</details>

<details>
<summary><strong>Q5: What's the difference between a design pattern and an algorithm?</strong></summary>

**Answer:**

**Design Pattern:**
- **What:** High-level solution blueprint
- **Purpose:** Solve design/architectural problems
- **Specific:** No - adaptable to many situations
- **Example:** Factory pattern for object creation

**Algorithm:**
- **What:** Step-by-step procedure
- **Purpose:** Solve computational problems
- **Specific:** Yes - exact steps defined
- **Example:** QuickSort for sorting data

**Analogy:**
- **Design Pattern** = House floor plan (general concept)
- **Algorithm** = Recipe (exact steps)

**Example:**

```python
# Algorithm - QuickSort (specific steps)
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)

# Design Pattern - Strategy (general concept)
class SortStrategy(ABC):
    @abstractmethod
    def sort(self, data):
        pass

class QuickSortStrategy(SortStrategy):
    def sort(self, data):
        return quicksort(data)  # Uses algorithm

class BubbleSortStrategy(SortStrategy):
    def sort(self, data):
        return bubblesort(data)  # Different algorithm

# Pattern lets you switch algorithms easily
```

**Key difference:** Pattern is about **structure**, algorithm is about **steps**.
</details>

<details>
<summary><strong>Q6: How do you know which design pattern to use?</strong></summary>

**Answer:**

Follow this decision process:

**1. Identify the Problem Type**

- **Object creation complexity?** → Creational patterns
- **Class relationship issues?** → Structural patterns  
- **Object communication needs?** → Behavioral patterns

**2. Ask Specific Questions**

| Question | Pattern |
|----------|---------|
| Need only one instance? | Singleton |
| Creating objects without knowing exact type? | Factory |
| Making incompatible interfaces work? | Adapter |
| Adding behavior dynamically? | Decorator |
| Multiple algorithms for same task? | Strategy |
| Notify multiple objects of changes? | Observer |

**3. Example Decision Tree**

```
Problem: Need to create different types of notifications

Q: Do I need to create objects? 
A: Yes → Creational pattern

Q: Is the creation logic complex?
A: Yes → Factory pattern

Q: Do notification types share interface?
A: Yes → Factory is perfect!
```

**4. Start Simple**

```python
# Start with simple solution
def send_notification(type, message):
    if type == "email":
        send_email(message)
    elif type == "sms":
        send_sms(message)

# Problem grows? Refactor to Factory
class NotificationFactory:
    @staticmethod
    def create(type):
        notifications = {
            "email": EmailNotification,
            "sms": SMSNotification
        }
        return notifications[type]()
```

**Remember:** Don't force patterns. Let the problem guide you.
</details>

---

## Quick Reference

### Pattern Selection Guide

```
Need to create objects?
├─ Single instance only → Singleton
├─ Complex construction → Builder
└─ Don't know exact type → Factory

Need to organize classes?
├─ Incompatible interfaces → Adapter
├─ Add behavior dynamically → Decorator
└─ Simplify complex system → Facade

Need objects to interact?
├─ Multiple algorithms → Strategy
├─ Notify multiple objects → Observer
└─ Encapsulate requests → Command
```

---

## Summary

### Key Takeaways

1. **Design patterns** = Proven solutions to common problems
2. **Not code** = Concepts you adapt
3. **Three categories** = Creational, Structural, Behavioral
4. **Benefits** = Common vocabulary, best practices, maintainability
5. **Don't overuse** = Only when problem matches pattern

### For Interviews

**Know:**
- ✅ What design patterns are
- ✅ Why they're important
- ✅ Main categories (CSB)
- ✅ 2-3 examples from each category
- ✅ When NOT to use them

**Be ready to:**
- ✅ Explain patterns with examples
- ✅ Describe real scenarios where you'd use them
- ✅ Compare different patterns
- ✅ Discuss trade-offs

---

[← Back to Abstract vs Interface](../04-advanced-concepts/03-abstract-vs-interface.md) | [Next: Creational Patterns →](01-creational-patterns.md) | [↑ Back to README](../README.md)