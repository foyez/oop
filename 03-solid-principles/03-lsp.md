# 3.3 Liskov Substitution Principle (LSP)

[← Back to OCP](02-ocp.md) | [Next: Interface Segregation →](04-isp.md) | [↑ Back to README](../README.md)

---

## What is LSP?

**"Subtypes must be substitutable for their base types"**

Or: **"Child classes should work anywhere the parent class works, without breaking the program"**

### Core Concept

If you have code that works with a parent class, it should work with any child class WITHOUT modification.

### Real-World Analogy

**Car keys:**
- Main key works → Spare key should also work
- Spare key shouldn't require different ignition

**Remote control:**
- If universal remote works with your TV
- New batteries should work the same way

---

## The Rectangle-Square Problem

Classic LSP violation:

```python
# ❌ VIOLATES LSP
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
        self.height = width  # Breaks Rectangle's behavior!
    
    def set_height(self, height):
        self.width = height
        self.height = height  # Breaks Rectangle's behavior!

# Test function
def test_rectangle(rect):
    rect.set_width(5)
    rect.set_height(4)
    assert rect.area() == 20, f"Expected 20, got {rect.area()}"

test_rectangle(Rectangle(0, 0))  # ✅ Pass (20)
test_rectangle(Square(0))        # ❌ Fail (16, not 20)
```

**Why it fails:** Square changes both dimensions, breaking Rectangle's behavior.

---

## LSP Applied

```python
# ✅ FOLLOWS LSP
from abc import ABC, abstractmethod

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

# Both can be used as Shape
def print_area(shape: Shape):
    print(f"Area: {shape.area()}")

print_area(Rectangle(5, 4))  # Works
print_area(Square(5))         # Works
```

---

## More Examples

### ❌ Violation: Bird Example

```python
class Bird:
    def fly(self):
        return "Flying"

class Penguin(Bird):
    def fly(self):
        raise Exception("Penguins can't fly!")  # Breaks contract!

def make_bird_fly(bird: Bird):
    print(bird.fly())

make_bird_fly(Bird())     # ✅ Works
make_bird_fly(Penguin())  # ❌ Exception!
```

### ✅ LSP Applied

```python
from abc import ABC, abstractmethod

class Bird(ABC):
    @abstractmethod
    def move(self):
        pass

class FlyingBird(Bird):
    def move(self):
        return "Flying"

class FlightlessBird(Bird):
    def move(self):
        return "Walking/Swimming"

class Sparrow(FlyingBird):
    pass

class Penguin(FlightlessBird):
    pass

def make_bird_move(bird: Bird):
    print(bird.move())

make_bird_move(Sparrow())  # ✅ Works
make_bird_move(Penguin())  # ✅ Works
```

---

## Practice Questions

<details>
<summary><strong>View Questions</strong></summary>

### Fill in the Gaps

1. LSP states that __________ must be substitutable for their __________ types.
2. If a child class can't fully replace its parent without breaking functionality, it __________ LSP.
3. The classic Rectangle-Square problem demonstrates a __________ of LSP.
4. Following LSP ensures that code written for the __________ class works correctly with any __________ class.

<details>
<summary><strong>View Answers</strong></summary>

1. subtypes (or child classes), base (or parent)
2. violates
3. violation
4. parent (or base), child (or derived/subclass)

</details>

### True/False

1. Child classes must be able to replace parent classes without breaking behavior.
2. Throwing exceptions in child classes that the parent doesn't throw always violates LSP.
3. Square IS-A Rectangle is a good inheritance relationship.
4. LSP helps ensure polymorphism works correctly.

<details>
<summary><strong>View Answers</strong></summary>

1. True - This is the core of LSP
2. False - It depends on whether the exception breaks the expected behavior contract
3. False - This is the classic LSP violation example
4. True - LSP ensures substitutability works properly

</details>

</details>

---

[← Back to OCP](02-ocp.md) | [Next: Interface Segregation →](04-isp.md) | [↑ Back to README](../README.md)