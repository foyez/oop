# 4.3 Abstract Classes vs Interfaces

[← Back to Dependency Injection](02-dependency-injection.md) | [Next: Design Patterns →](../05-design-patterns/01-creational-patterns.md) | [↑ Back to README](../README.md)

---

## Key Differences

| Feature | Abstract Class | Interface |
|---------|---------------|-----------|
| **Can have state** | ✅ Yes | ❌ No |
| **Can have implementation** | ✅ Yes (concrete methods) | ❌ No (Python Protocol has none) |
| **Multiple inheritance** | ❌ No (single in most languages) | ✅ Yes |
| **Constructor** | ✅ Yes | ❌ No |
| **Use case** | Share code + define contract | Pure contract only |

---

## Abstract Classes

### When to Use

✅ Need to share code among related classes  
✅ Have common state (attributes)  
✅ Have some concrete methods  
✅ Define a template with default behavior  

### Python Example

```python
from abc import ABC, abstractmethod

class Animal(ABC):
    def __init__(self, name, age):
        self.name = name  # Shared state
        self.age = age
    
    @abstractmethod
    def make_sound(self):
        """Must be implemented by subclasses"""
        pass
    
    @abstractmethod
    def move(self):
        """Must be implemented by subclasses"""
        pass
    
    # Concrete method - shared implementation
    def sleep(self):
        return f"{self.name} is sleeping"
    
    def get_info(self):
        return f"{self.name} is {self.age} years old"

class Dog(Animal):
    def make_sound(self):
        return "Woof!"
    
    def move(self):
        return "Running on four legs"

class Bird(Animal):
    def make_sound(self):
        return "Tweet!"
    
    def move(self):
        return "Flying"

# Usage
dog = Dog("Buddy", 3)
print(dog.make_sound())  # Woof! (implemented)
print(dog.sleep())       # Buddy is sleeping (inherited)
print(dog.get_info())    # Buddy is 3 years old (inherited)

# animal = Animal("Generic", 5)  # ❌ Cannot instantiate
```

### TypeScript Abstract Class

```typescript
abstract class Employee {
    protected name: string;
    protected salary: number;
    
    constructor(name: string, salary: number) {
        this.name = name;
        this.salary = salary;
    }
    
    // Abstract method - must implement
    abstract calculateBonus(): number;
    
    // Concrete method - shared implementation
    getInfo(): string {
        return `${this.name} earns $${this.salary}`;
    }
    
    protected calculateTax(): number {
        return this.salary * 0.2;
    }
}

class Developer extends Employee {
    calculateBonus(): number {
        return this.salary * 0.15;
    }
}

class Manager extends Employee {
    private teamSize: number;
    
    constructor(name: string, salary: number, teamSize: number) {
        super(name, salary);
        this.teamSize = teamSize;
    }
    
    calculateBonus(): number {
        return this.salary * 0.20 + this.teamSize * 1000;
    }
}

const dev = new Developer("Alice", 90000);
console.log(dev.getInfo());         // Shared method
console.log(dev.calculateBonus());  // Implemented method
```

---

## Interfaces (Protocols in Python)

### When to Use

✅ Define a contract (what methods must exist)  
✅ No shared implementation needed  
✅ Need multiple inheritance  
✅ Different classes with unrelated implementations  

### Python Protocol

```python
from typing import Protocol

class Drawable(Protocol):
    """Interface - defines contract only"""
    def draw(self) -> str:
        ...
    
    def get_position(self) -> tuple:
        ...

# No inheritance needed!
class Circle:
    def __init__(self, x, y, radius):
        self.x = x
        self.y = y
        self.radius = radius
    
    def draw(self) -> str:
        return f"Drawing circle at ({self.x}, {self.y})"
    
    def get_position(self) -> tuple:
        return (self.x, self.y)

class Rectangle:
    def __init__(self, x, y, width, height):
        self.x = x
        self.y = y
        self.width = width
        self.height = height
    
    def draw(self) -> str:
        return f"Drawing rectangle at ({self.x}, {self.y})"
    
    def get_position(self) -> tuple:
        return (self.x, self.y)

# Works with anything that has draw() and get_position()
def render(shape: Drawable):
    print(shape.draw())
    print(f"Position: {shape.get_position()}")

render(Circle(10, 20, 5))
render(Rectangle(5, 10, 100, 50))
```

### TypeScript Interface

```typescript
interface PaymentProcessor {
    processPayment(amount: number): Promise<boolean>;
    refund(transactionId: string): Promise<boolean>;
}

interface Logger {
    log(message: string): void;
    error(message: string): void;
}

// Can implement multiple interfaces
class StripePayment implements PaymentProcessor, Logger {
    async processPayment(amount: number): Promise<boolean> {
        this.log(`Processing $${amount}`);
        // Payment logic
        return true;
    }
    
    async refund(transactionId: string): Promise<boolean> {
        this.log(`Refunding ${transactionId}`);
        // Refund logic
        return true;
    }
    
    log(message: string): void {
        console.log(`[INFO] ${message}`);
    }
    
    error(message: string): void {
        console.error(`[ERROR] ${message}`);
    }
}

// Different class, same interfaces
class PayPalPayment implements PaymentProcessor, Logger {
    async processPayment(amount: number): Promise<boolean> {
        this.log(`PayPal processing $${amount}`);
        return true;
    }
    
    async refund(transactionId: string): Promise<boolean> {
        this.log(`PayPal refunding ${transactionId}`);
        return true;
    }
    
    log(message: string): void {
        console.log(`[PAYPAL] ${message}`);
    }
    
    error(message: string): void {
        console.error(`[PAYPAL ERROR] ${message}`);
    }
}
```

---

## Comparison Examples

### Example 1: Vehicle System

#### With Abstract Class

```python
from abc import ABC, abstractmethod

class Vehicle(ABC):
    def __init__(self, brand, model):
        self.brand = brand  # Shared state
        self.model = model
        self.fuel_level = 100
    
    @abstractmethod
    def start_engine(self):
        pass
    
    # Shared implementation
    def get_info(self):
        return f"{self.brand} {self.model}"
    
    def refuel(self, amount):
        self.fuel_level = min(100, self.fuel_level + amount)
        return f"Refueled. Level: {self.fuel_level}%"

class Car(Vehicle):
    def start_engine(self):
        return f"Starting {self.brand} {self.model} engine..."

class Motorcycle(Vehicle):
    def start_engine(self):
        return f"Kicking {self.brand} {self.model} into gear..."
```

#### With Interface (Protocol)

```python
from typing import Protocol

class Startable(Protocol):
    def start_engine(self) -> str:
        ...

class Refuelable(Protocol):
    def refuel(self, amount: int) -> str:
        ...

# Different implementations, no shared code
class ElectricCar:
    def start_engine(self) -> str:
        return "Starting electric motor..."
    
    def refuel(self, amount: int) -> str:
        return f"Charging battery: {amount}%"

class GasCar:
    def start_engine(self) -> str:
        return "Starting combustion engine..."
    
    def refuel(self, amount: int) -> str:
        return f"Adding {amount}L of gasoline"

def start_vehicle(vehicle: Startable):
    print(vehicle.start_engine())

start_vehicle(ElectricCar())
start_vehicle(GasCar())
```

### Example 2: File Handling

#### Abstract Class Approach

```python
from abc import ABC, abstractmethod

class FileHandler(ABC):
    def __init__(self, filename):
        self.filename = filename
        self.is_open = False
    
    @abstractmethod
    def read(self):
        pass
    
    @abstractmethod
    def write(self, data):
        pass
    
    # Shared implementation
    def open_file(self):
        self.is_open = True
        return f"Opened {self.filename}"
    
    def close_file(self):
        self.is_open = False
        return f"Closed {self.filename}"

class TextFileHandler(FileHandler):
    def read(self):
        return f"Reading text from {self.filename}"
    
    def write(self, data):
        return f"Writing text to {self.filename}: {data}"

class BinaryFileHandler(FileHandler):
    def read(self):
        return f"Reading binary from {self.filename}"
    
    def write(self, data):
        return f"Writing binary to {self.filename}"
```

#### Interface Approach

```python
from typing import Protocol

class Readable(Protocol):
    def read(self) -> str:
        ...

class Writable(Protocol):
    def write(self, data: str) -> str:
        ...

class Closeable(Protocol):
    def close(self) -> str:
        ...

# Different classes implement different combinations
class TextFile:
    def read(self) -> str:
        return "Reading text..."
    
    def write(self, data: str) -> str:
        return f"Writing: {data}"
    
    def close(self) -> str:
        return "Closed"

class ReadOnlyFile:
    def read(self) -> str:
        return "Reading..."
    
    def close(self) -> str:
        return "Closed"

class WriteOnlyFile:
    def write(self, data: str) -> str:
        return f"Writing: {data}"
    
    def close(self) -> str:
        return "Closed"

# Functions work with any compatible type
def read_file(file: Readable):
    return file.read()

def close_resource(resource: Closeable):
    return resource.close()
```

---

## Decision Guide

### Use Abstract Class When:

```python
# You need to share state and behavior
class GameCharacter(ABC):
    def __init__(self, name, health):
        self.name = name      # Shared state
        self.health = health
    
    @abstractmethod
    def attack(self):
        pass
    
    def take_damage(self, amount):  # Shared behavior
        self.health -= amount
        if self.health <= 0:
            return f"{self.name} is defeated!"
```

### Use Interface When:

```python
# You only need to define a contract
class Flyable(Protocol):
    def fly(self) -> str:
        ...

# Completely different implementations
class Airplane:
    def fly(self) -> str:
        return "Flying with engines"

class Bird:
    def fly(self) -> str:
        return "Flying with wings"

class Drone:
    def fly(self) -> str:
        return "Flying with rotors"
```

---

## Multiple Interface Implementation

### TypeScript

```typescript
interface Runnable {
    run(): void;
}

interface Jumpable {
    jump(): void;
}

interface Swimmable {
    swim(): void;
}

// Implement multiple interfaces
class Athlete implements Runnable, Jumpable, Swimmable {
    run(): void {
        console.log("Running...");
    }
    
    jump(): void {
        console.log("Jumping...");
    }
    
    swim(): void {
        console.log("Swimming...");
    }
}

// Different class, different combination
class Kangaroo implements Jumpable, Runnable {
    run(): void {
        console.log("Hopping...");
    }
    
    jump(): void {
        console.log("Jumping high...");
    }
}
```

### Python with ABC

```python
from abc import ABC, abstractmethod

class Runnable(ABC):
    @abstractmethod
    def run(self):
        pass

class Jumpable(ABC):
    @abstractmethod
    def jump(self):
        pass

class Swimmable(ABC):
    @abstractmethod
    def swim(self):
        pass

# Multiple inheritance for interfaces
class Athlete(Runnable, Jumpable, Swimmable):
    def run(self):
        return "Running..."
    
    def jump(self):
        return "Jumping..."
    
    def swim(self):
        return "Swimming..."

class Kangaroo(Runnable, Jumpable):
    def run(self):
        return "Hopping..."
    
    def jump(self):
        return "Jumping high..."
```

---

## Practice Questions

<details>
<summary><strong>View Questions</strong></summary>

### Fill in the Gaps

1. Abstract classes can have both __________ and __________ methods, while interfaces typically have only method signatures.
2. In Python, __________ are used to define interface-like contracts without requiring inheritance.
3. Abstract classes can have __________ (state), while interfaces cannot.
4. You can implement __________ interfaces but can only extend __________ abstract class in most languages.
5. Use abstract classes when you need to __________ code, use interfaces when you only need to define a __________.

<details>
<summary><strong>View Answers</strong></summary>

1. abstract, concrete
2. Protocols
3. attributes (or instance variables/state)
4. multiple, one
5. share, contract (or interface/specification)

</details>

### True/False

1. Abstract classes can have constructors but interfaces cannot.
2. In Python, you must inherit from a Protocol for duck typing to work.
3. TypeScript allows implementing multiple interfaces but extending only one class.
4. Abstract classes can have instance variables but interfaces cannot.
5. Interfaces are better when you need to share implementation code.
6. You can instantiate an abstract class if it has at least one concrete method.
7. Protocols in Python require classes to explicitly inherit from them.

<details>
<summary><strong>View Answers</strong></summary>

1. True - Abstract classes can have `__init__` methods, interfaces are just contracts
2. False - Protocols use structural typing (duck typing); no inheritance needed
3. True - This is a TypeScript limitation to avoid diamond problem
4. True - Interfaces define behavior contracts only, not state
5. False - Abstract classes are better for sharing implementation; interfaces are for contracts
6. False - Abstract classes with any abstract methods cannot be instantiated
7. False - Protocols use structural typing; classes just need matching methods

</details>

### Multiple Choice Questions

1. When should you use an abstract class over an interface?
   - A) When you need multiple inheritance
   - B) When you need to share code and state
   - C) When you want loose coupling
   - D) When you only need method signatures

2. What can an abstract class have that an interface cannot?
   - A) Method signatures
   - B) Instance variables and concrete methods
   - C) Abstract methods
   - D) Type hints

3. In Python, what is the main difference between ABC and Protocol?
   - A) ABC is faster
   - B) ABC requires inheritance, Protocol uses duck typing
   - C) Protocol is deprecated
   - D) ABC cannot have abstract methods

4. Which statement is true about interfaces?
   - A) They can have state
   - B) They can have constructors
   - C) They define contracts for behavior
   - D) They require single inheritance

5. What's the main advantage of using interfaces?
   - A) Better performance
   - B) Less code
   - C) Multiple inheritance support
   - D) Automatic implementation

<details>
<summary><strong>View Answers</strong></summary>

1. B) When you need to share code and state
2. B) Instance variables and concrete methods
3. B) ABC requires inheritance, Protocol uses duck typing
4. C) They define contracts for behavior
5. C) Multiple inheritance support - Can implement many interfaces

</details>

### Code Challenges

**Challenge 1: Refactor to Use Interface**

This code uses abstract class. Refactor to use interfaces (Protocols):

```python
from abc import ABC, abstractmethod

class Animal(ABC):
    @abstractmethod
    def make_sound(self):
        pass
    
    @abstractmethod
    def move(self):
        pass

class Dog(Animal):
    def make_sound(self):
        return "Woof"
    
    def move(self):
        return "Running"

class Car:  # Not an animal but makes sound and moves
    def make_sound(self):
        return "Vroom"
    
    def move(self):
        return "Driving"
```

<details>
<summary><strong>View Solution</strong></summary>

```python
from typing import Protocol

# Separate protocols for each behavior
class Soundable(Protocol):
    def make_sound(self) -> str:
        ...

class Movable(Protocol):
    def move(self) -> str:
        ...

# No inheritance needed - just implement methods
class Dog:
    def make_sound(self) -> str:
        return "Woof"
    
    def move(self) -> str:
        return "Running"

class Car:
    def make_sound(self) -> str:
        return "Vroom"
    
    def move(self) -> str:
        return "Driving"

class Bird:
    def make_sound(self) -> str:
        return "Tweet"
    
    def move(self) -> str:
        return "Flying"

# Functions work with any compatible type
def make_noise(thing: Soundable):
    print(thing.make_sound())

def start_moving(thing: Movable):
    print(thing.move())

# All work without inheritance
make_noise(Dog())
make_noise(Car())
start_moving(Bird())
```

</details>

**Challenge 2: Choose Abstract Class or Interface**

Design a system for different shapes. Decide whether to use abstract class or interface and implement:
- All shapes need `area()` and `perimeter()` methods
- All shapes have a `color` attribute
- All shapes can `display()` their info

<details>
<summary><strong>View Solution</strong></summary>

```python
from abc import ABC, abstractmethod

# Use Abstract Class - need to share state (color) and behavior (display)
class Shape(ABC):
    def __init__(self, color):
        self.color = color  # Shared state
    
    @abstractmethod
    def area(self):
        """Must implement"""
        pass
    
    @abstractmethod
    def perimeter(self):
        """Must implement"""
        pass
    
    # Shared behavior
    def display(self):
        return f"{self.color} {self.__class__.__name__}: Area={self.area():.2f}, Perimeter={self.perimeter():.2f}"

class Circle(Shape):
    def __init__(self, color, radius):
        super().__init__(color)
        self.radius = radius
    
    def area(self):
        return 3.14159 * self.radius ** 2
    
    def perimeter(self):
        return 2 * 3.14159 * self.radius

class Rectangle(Shape):
    def __init__(self, color, width, height):
        super().__init__(color)
        self.width = width
        self.height = height
    
    def area(self):
        return self.width * self.height
    
    def perimeter(self):
        return 2 * (self.width + self.height)

# Usage
circle = Circle("red", 5)
rectangle = Rectangle("blue", 4, 6)

print(circle.display())
print(rectangle.display())

# Why abstract class:
# ✅ Shared state (color)
# ✅ Shared behavior (display)
# ✅ Need some abstract methods (area, perimeter)
```

**Alternative with Interface (if no shared implementation needed):**

```python
from typing import Protocol

class Measurable(Protocol):
    def area(self) -> float:
        ...
    
    def perimeter(self) -> float:
        ...

class Colorable(Protocol):
    color: str

# Completely independent implementations
class Circle:
    def __init__(self, color, radius):
        self.color = color
        self.radius = radius
    
    def area(self) -> float:
        return 3.14159 * self.radius ** 2
    
    def perimeter(self) -> float:
        return 2 * 3.14159 * self.radius
    
    def display(self):
        return f"{self.color} Circle: Area={self.area():.2f}"

class Rectangle:
    def __init__(self, color, width, height):
        self.color = color
        self.width = width
        self.height = height
    
    def area(self) -> float:
        return self.width * self.height
    
    def perimeter(self) -> float:
        return 2 * (self.width + self.height)
    
    def display(self):
        return f"{self.color} Rectangle: Area={self.area():.2f}"

# Functions work with protocols
def print_area(shape: Measurable):
    print(f"Area: {shape.area():.2f}")

def print_color(item: Colorable):
    print(f"Color: {item.color}")
```

</details>

</details>

---

## Summary

### Key Differences

**Abstract Class:**
- ✅ Share code and state
- ✅ Template pattern
- ✅ Related classes
- ❌ Single inheritance

**Interface:**
- ✅ Pure contract
- ✅ Multiple inheritance
- ✅ Unrelated classes
- ❌ No shared implementation

### Decision Rule

**Ask yourself:**
1. Need to share implementation? → Abstract Class
2. Need to share state? → Abstract Class
3. Only defining contract? → Interface
4. Need multiple inheritance? → Interface
5. Classes are related? → Abstract Class
6. Classes are unrelated? → Interface

---

[← Back to Dependency Injection](02-dependency-injection.md) | [Next: Design Patterns →](../05-design-patterns/01-creational-patterns.md) | [↑ Back to README](../README.md)