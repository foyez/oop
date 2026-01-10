# 3.4 Interface Segregation Principle (ISP)

[← Back to LSP](03-lsp.md) | [Next: Dependency Inversion →](05-dip.md) | [↑ Back to README](../README.md)

---

## What is ISP?

**"Clients should not be forced to depend on interfaces they don't use"**

Or: **"Many specific interfaces are better than one general-purpose interface"**

### Core Concept

Don't force classes to implement methods they don't need.

### Real-World Analogy

**Restaurant Menu:**
- ❌ One giant menu for everyone (vegetarians see meat dishes)
- ✅ Separate menus: Vegetarian, Vegan, Regular

---

## Violation Example

```python
# ❌ BAD - Fat interface
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
        return "Working"
    
    def eat(self):
        return "Eating"
    
    def sleep(self):
        return "Sleeping"

class Robot(Worker):
    def work(self):
        return "Working"
    
    def eat(self):
        raise Exception("Robots don't eat!")  # Forced to implement!
    
    def sleep(self):
        raise Exception("Robots don't sleep!")  # Forced to implement!
```

---

## ISP Applied

```python
# ✅ GOOD - Segregated interfaces
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
        return "Working"
    
    def eat(self):
        return "Eating"
    
    def sleep(self):
        return "Sleeping"

class Robot(Workable):  # Only implements what it needs
    def work(self):
        return "Working"
```

---

## Practice Questions

<details>
<summary><strong>View Questions</strong></summary>

### Fill in the Gaps

1. ISP states that clients shouldn't be forced to depend on __________ they don't use.
2. It's better to have __________ specific interfaces than one __________ interface.
3. A "fat" interface is one that has too __________ methods.
4. ISP helps avoid implementing __________ methods in classes.

<details>
<summary><strong>View Answers</strong></summary>

1. interfaces (or methods)
2. many, general (or general-purpose/large)
3. many
4. unnecessary (or unused/irrelevant)

</details>

</details>

---

[← Back to LSP](03-lsp.md) | [Next: Dependency Inversion →](05-dip.md) | [↑ Back to README](../README.md)