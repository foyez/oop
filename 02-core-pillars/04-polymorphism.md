# 2.4 Polymorphism

[← Back to Inheritance Part 2](03-inheritance-part2.md) | [Next: SOLID Principles →](../03-solid-principles/00-introduction.md) | [↑ Back to README](../README.md)

---

## What is Polymorphism? 🎨

**Polymorphism** means "many forms". It's the ability of different objects to respond to the same message (method call) in different ways.

### Core Concept

**"One interface, many implementations"**

Think of a **power button**:
- TV power button → Turns TV on/off
- Computer power button → Boots/shuts down computer
- AC power button → Starts/stops AC
- Same action (press button), different behaviors

### Key Principle

Objects of different types can be accessed through the same interface, with each type providing its own implementation.

---

## Types of Polymorphism

### 1. Compile-Time Polymorphism (Static)
Resolved at compile time

**Types:**
- Method Overloading
- Operator Overloading

### 2. Runtime Polymorphism (Dynamic)
Resolved at runtime

**Types:**
- Method Overriding
- Duck Typing (Python)

---

## Method Overriding (Runtime Polymorphism)

### Definition
Child class provides a specific implementation of a method already defined in parent class.

### Python Example

```python
class Animal:
    def speak(self):
        return "Some sound"

class Dog(Animal):
    def speak(self):  # Override
        return "Woof!"

class Cat(Animal):
    def speak(self):  # Override
        return "Meow!"

class Cow(Animal):
    def speak(self):  # Override
        return "Moo!"

# Polymorphism in action
def make_animal_speak(animal: Animal):
    print(animal.speak())

# Same function, different behaviors
animals = [Dog(), Cat(), Cow()]
for animal in animals:
    make_animal_speak(animal)
# Output:
# Woof!
# Meow!
# Moo!
```

### Real-World Example: Payment Processing

```python
from abc import ABC, abstractmethod

class PaymentProcessor(ABC):
    @abstractmethod
    def process_payment(self, amount):
        pass
    
    @abstractmethod
    def refund(self, amount):
        pass

class CreditCardProcessor(PaymentProcessor):
    def process_payment(self, amount):
        return f"Processing ${amount} via Credit Card..."
    
    def refund(self, amount):
        return f"Refunding ${amount} to Credit Card..."

class PayPalProcessor(PaymentProcessor):
    def process_payment(self, amount):
        return f"Processing ${amount} via PayPal..."
    
    def refund(self, amount):
        return f"Refunding ${amount} to PayPal account..."

class CryptoProcessor(PaymentProcessor):
    def process_payment(self, amount):
        return f"Processing ${amount} via Cryptocurrency..."
    
    def refund(self, amount):
        return f"Refunding ${amount} to Crypto wallet..."

# Polymorphic function - works with any PaymentProcessor
def checkout(processor: PaymentProcessor, amount):
    print(processor.process_payment(amount))

# Same function, different implementations
checkout(CreditCardProcessor(), 100)
checkout(PayPalProcessor(), 50)
checkout(CryptoProcessor(), 200)
```

---

## Method Overloading (Compile-Time Polymorphism)

### Python: No True Overloading

Python doesn't support traditional method overloading. Last definition wins.

```python
# ❌ Doesn't work as expected
class Calculator:
    def add(self, a, b):
        return a + b
    
    def add(self, a, b, c):  # Overwrites previous definition
        return a + b + c

calc = Calculator()
# calc.add(2, 3)  # ❌ Error: missing 1 required positional argument
calc.add(2, 3, 4)  # ✅ Works
```

### Python Workaround: Default Parameters

```python
class Calculator:
    def add(self, a, b, c=0, d=0):
        return a + b + c + d

calc = Calculator()
print(calc.add(2, 3))        # 5
print(calc.add(2, 3, 4))     # 9
print(calc.add(2, 3, 4, 5))  # 14
```

### Python Workaround: *args

```python
class Calculator:
    def add(self, *args):
        return sum(args)

calc = Calculator()
print(calc.add(2, 3))           # 5
print(calc.add(2, 3, 4))        # 9
print(calc.add(2, 3, 4, 5, 6))  # 20
```

### Python Workaround: Type Checking

```python
class Calculator:
    def add(self, a, b=None):
        if b is None:
            # Single argument - square it
            return a * a
        else:
            # Two arguments - add them
            return a + b

calc = Calculator()
print(calc.add(5))      # 25 (5 * 5)
print(calc.add(5, 3))   # 8 (5 + 3)
```

### TypeScript: True Method Overloading

```typescript
class Calculator {
    // Overload signatures
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
console.log(calc.add(5, 3));              // 8 (number)
console.log(calc.add("Hello", "World"));  // "HelloWorld" (string)
console.log(calc.add([1,2], [3,4]));      // [1,2,3,4] (array)
```

### C++: True Method Overloading

```cpp
class Calculator {
public:
    // Overloaded methods - same name, different parameters
    int add(int a, int b) {
        return a + b;
    }
    
    double add(double a, double b) {
        return a + b;
    }
    
    string add(string a, string b) {
        return a + b;
    }
    
    int add(int a, int b, int c) {
        return a + b + c;
    }
};

// Usage
Calculator calc;
cout << calc.add(5, 3);           // 8 (int)
cout << calc.add(5.5, 3.2);       // 8.7 (double)
cout << calc.add("Hi", "There");  // "HiThere" (string)
cout << calc.add(1, 2, 3);        // 6 (three ints)
```

---

## Duck Typing (Python's Polymorphism)

### Concept

**"If it walks like a duck and quacks like a duck, it's a duck"**

Python doesn't care about the type, only that the object has the required methods.

### Example

```python
class Dog:
    def speak(self):
        return "Woof!"

class Cat:
    def speak(self):
        return "Meow!"

class Car:
    def speak(self):
        return "Beep beep!"

class Person:
    def speak(self):
        return "Hello!"

# No inheritance needed!
def make_it_speak(thing):
    print(thing.speak())

# Works with anything that has speak()
make_it_speak(Dog())     # Woof!
make_it_speak(Cat())     # Meow!
make_it_speak(Car())     # Beep beep!
make_it_speak(Person())  # Hello!
```

### Real-World Example: File-like Objects

```python
class FileWriter:
    def write(self, data):
        with open('output.txt', 'w') as f:
            f.write(data)

class ConsoleWriter:
    def write(self, data):
        print(data)

class NetworkWriter:
    def write(self, data):
        # Send data over network
        print(f"Sending over network: {data}")

# Duck typing - anything with write() works
def save_data(writer, data):
    writer.write(data)

# All work!
save_data(FileWriter(), "Hello File")
save_data(ConsoleWriter(), "Hello Console")
save_data(NetworkWriter(), "Hello Network")
```

---

## Operator Overloading

### Python: Magic Methods

Python allows operator overloading through magic methods.

```python
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    def __add__(self, other):  # Overload +
        return Vector(self.x + other.x, self.y + other.y)
    
    def __sub__(self, other):  # Overload -
        return Vector(self.x - other.x, self.y - other.y)
    
    def __mul__(self, scalar):  # Overload *
        return Vector(self.x * scalar, self.y * scalar)
    
    def __eq__(self, other):  # Overload ==
        return self.x == other.x and self.y == other.y
    
    def __str__(self):  # Overload str()
        return f"Vector({self.x}, {self.y})"
    
    def __len__(self):  # Overload len()
        return int((self.x**2 + self.y**2)**0.5)

# Usage
v1 = Vector(2, 3)
v2 = Vector(4, 5)

v3 = v1 + v2        # Uses __add__
print(v3)           # Vector(6, 8)

v4 = v2 - v1        # Uses __sub__
print(v4)           # Vector(2, 2)

v5 = v1 * 3         # Uses __mul__
print(v5)           # Vector(6, 9)

print(v1 == v2)     # False (uses __eq__)
print(len(v1))      # 3 (uses __len__)
```

### Common Python Magic Methods

```python
class CustomNumber:
    def __init__(self, value):
        self.value = value
    
    # Arithmetic operators
    def __add__(self, other):      # +
        return CustomNumber(self.value + other.value)
    
    def __sub__(self, other):      # -
        return CustomNumber(self.value - other.value)
    
    def __mul__(self, other):      # *
        return CustomNumber(self.value * other.value)
    
    def __truediv__(self, other):  # /
        return CustomNumber(self.value / other.value)
    
    def __mod__(self, other):      # %
        return CustomNumber(self.value % other.value)
    
    def __pow__(self, other):      # **
        return CustomNumber(self.value ** other.value)
    
    # Comparison operators
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
    
    # Unary operators
    def __neg__(self):             # -x
        return CustomNumber(-self.value)
    
    def __pos__(self):             # +x
        return CustomNumber(+self.value)
    
    def __abs__(self):             # abs(x)
        return CustomNumber(abs(self.value))
    
    # String representation
    def __str__(self):             # str(x)
        return f"CustomNumber({self.value})"
    
    def __repr__(self):            # repr(x)
        return f"CustomNumber({self.value})"
```

### C++: Full Operator Overloading

```cpp
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
};

// Usage
Complex c1(3, 4);
Complex c2(1, 2);

Complex c3 = c1 + c2;   // Uses operator+
Complex c4 = c1 * c2;   // Uses operator*

cout << c3 << endl;     // Uses operator<<
cout << (c1 == c2);     // Uses operator==
```

### TypeScript: No Operator Overloading

```typescript
// TypeScript doesn't support operator overloading
// Must use methods instead

class Money {
    constructor(private amount: number, private currency: string) {}
    
    // Can't overload +, must use methods
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

// Usage - must call methods
const price1 = new Money(100, "USD");
const price2 = new Money(50, "USD");

const total = price1.add(price2);  // Can't use: price1 + price2
console.log(total.toString());     // USD 150
```

---

## Real-World Example: Shape Drawing System

```python
from abc import ABC, abstractmethod
import math

class Shape(ABC):
    """Abstract base class for all shapes"""
    
    def __init__(self, color):
        self.color = color
    
    @abstractmethod
    def area(self):
        pass
    
    @abstractmethod
    def perimeter(self):
        pass
    
    @abstractmethod
    def draw(self):
        pass
    
    def info(self):
        return f"{self.color} {self.__class__.__name__}"

class Circle(Shape):
    def __init__(self, color, radius):
        super().__init__(color)
        self.radius = radius
    
    def area(self):
        return math.pi * self.radius ** 2
    
    def perimeter(self):
        return 2 * math.pi * self.radius
    
    def draw(self):
        return f"Drawing a {self.color} circle with radius {self.radius}"

class Rectangle(Shape):
    def __init__(self, color, width, height):
        super().__init__(color)
        self.width = width
        self.height = height
    
    def area(self):
        return self.width * self.height
    
    def perimeter(self):
        return 2 * (self.width + self.height)
    
    def draw(self):
        return f"Drawing a {self.color} rectangle {self.width}x{self.height}"

class Triangle(Shape):
    def __init__(self, color, side1, side2, side3):
        super().__init__(color)
        self.side1 = side1
        self.side2 = side2
        self.side3 = side3
    
    def area(self):
        # Heron's formula
        s = self.perimeter() / 2
        return math.sqrt(s * (s - self.side1) * (s - self.side2) * (s - self.side3))
    
    def perimeter(self):
        return self.side1 + self.side2 + self.side3
    
    def draw(self):
        return f"Drawing a {self.color} triangle with sides {self.side1}, {self.side2}, {self.side3}"

# Polymorphic functions
def render_shape(shape: Shape):
    """Works with any Shape"""
    print(shape.draw())
    print(f"Area: {shape.area():.2f}")
    print(f"Perimeter: {shape.perimeter():.2f}")
    print()

def calculate_total_area(shapes: list[Shape]):
    """Calculate total area of all shapes"""
    return sum(shape.area() for shape in shapes)

# Usage - polymorphism in action
shapes = [
    Circle("red", 5),
    Rectangle("blue", 4, 6),
    Triangle("green", 3, 4, 5),
    Circle("yellow", 3),
    Rectangle("purple", 10, 2)
]

print("=== Rendering Shapes ===")
for shape in shapes:
    render_shape(shape)

print(f"Total area of all shapes: {calculate_total_area(shapes):.2f}")

# Filter specific shapes
circles = [s for s in shapes if isinstance(s, Circle)]
print(f"\nNumber of circles: {len(circles)}")
```

---

## Real-World Example: Notification System

```python
from abc import ABC, abstractmethod
from datetime import datetime

class Notification(ABC):
    """Abstract notification base"""
    
    def __init__(self, recipient, message):
        self.recipient = recipient
        self.message = message
        self.timestamp = datetime.now()
        self.sent = False
    
    @abstractmethod
    def send(self):
        pass
    
    @abstractmethod
    def get_status(self):
        pass
    
    def mark_as_sent(self):
        self.sent = True
        return f"Notification sent at {self.timestamp}"

class EmailNotification(Notification):
    def __init__(self, recipient, message, subject):
        super().__init__(recipient, message)
        self.subject = subject
    
    def send(self):
        # Email sending logic
        print(f"[EMAIL] To: {self.recipient}")
        print(f"[EMAIL] Subject: {self.subject}")
        print(f"[EMAIL] Message: {self.message}")
        self.mark_as_sent()
        return "Email sent successfully"
    
    def get_status(self):
        status = "Sent" if self.sent else "Pending"
        return f"Email to {self.recipient}: {status}"

class SMSNotification(Notification):
    def __init__(self, recipient, message):
        super().__init__(recipient, message)
        self.char_count = len(message)
    
    def send(self):
        # SMS sending logic
        if self.char_count > 160:
            # Split into multiple messages
            print(f"[SMS] Sending {self.char_count // 160 + 1} messages")
        print(f"[SMS] To: {self.recipient}")
        print(f"[SMS] Message: {self.message[:160]}")
        self.mark_as_sent()
        return "SMS sent successfully"
    
    def get_status(self):
        status = "Sent" if self.sent else "Pending"
        return f"SMS to {self.recipient}: {status} ({self.char_count} chars)"

class PushNotification(Notification):
    def __init__(self, recipient, message, title, app_name):
        super().__init__(recipient, message)
        self.title = title
        self.app_name = app_name
    
    def send(self):
        # Push notification logic
        print(f"[PUSH] App: {self.app_name}")
        print(f"[PUSH] Title: {self.title}")
        print(f"[PUSH] Message: {self.message}")
        print(f"[PUSH] Device: {self.recipient}")
        self.mark_as_sent()
        return "Push notification sent successfully"
    
    def get_status(self):
        status = "Sent" if self.sent else "Pending"
        return f"Push to {self.recipient} ({self.app_name}): {status}"

class SlackNotification(Notification):
    def __init__(self, recipient, message, channel):
        super().__init__(recipient, message)
        self.channel = channel
    
    def send(self):
        # Slack API logic
        print(f"[SLACK] Channel: {self.channel}")
        print(f"[SLACK] To: @{self.recipient}")
        print(f"[SLACK] Message: {self.message}")
        self.mark_as_sent()
        return "Slack message sent successfully"
    
    def get_status(self):
        status = "Sent" if self.sent else "Pending"
        return f"Slack to @{self.recipient} in #{self.channel}: {status}"

# Polymorphic notification sender
class NotificationService:
    def __init__(self):
        self.notifications = []
    
    def add_notification(self, notification: Notification):
        self.notifications.append(notification)
    
    def send_all(self):
        """Send all notifications - polymorphism!"""
        results = []
        for notification in self.notifications:
            result = notification.send()  # Different behavior for each type
            results.append(result)
        return results
    
    def get_all_statuses(self):
        """Get status of all notifications"""
        return [n.get_status() for n in self.notifications]

# Usage
service = NotificationService()

# Add different types of notifications
service.add_notification(
    EmailNotification(
        "user@example.com",
        "Your order has been shipped!",
        "Order Shipment Notification"
    )
)

service.add_notification(
    SMSNotification(
        "+1234567890",
        "Your package will arrive in 2 days."
    )
)

service.add_notification(
    PushNotification(
        "device_token_12345",
        "Your order is on the way!",
        "Delivery Update",
        "ShoppingApp"
    )
)

service.add_notification(
    SlackNotification(
        "john_doe",
        "Order #12345 has been processed",
        "orders"
    )
)

# Send all - polymorphism in action
print("=== Sending Notifications ===\n")
results = service.send_all()

print("\n=== Status Report ===")
for status in service.get_all_statuses():
    print(status)
```

---

## Practice Questions

<details>
<summary><strong>View Questions</strong></summary>

### Fill in the Gaps

1. Polymorphism means "__________ forms" and allows objects of different types to be accessed through the same __________.
2. __________ polymorphism is resolved at runtime through method overriding, while __________ polymorphism is resolved at compile time.
3. Python doesn't support traditional method __________, but provides alternatives using default parameters or *args.
4. In Python, __________ typing means "if it walks like a duck and quacks like a duck, it's a duck" - the type doesn't matter, only the __________.
5. Operator overloading in Python is achieved through __________ methods like __add__, __sub__, and __mul__.

<details>
<summary><strong>View Answers</strong></summary>

1. many, interface
2. Runtime (or dynamic), compile-time (or static)
3. overloading
4. duck, methods (or behavior/interface)
5. magic (or dunder/special)

</details>

### True/False

1. Python supports true method overloading where multiple methods with the same name but different parameters can coexist.
2. Method overriding is a form of runtime polymorphism.
3. TypeScript supports operator overloading like Python and C++.
4. Duck typing requires explicit inheritance from a base class or interface.
5. In polymorphism, the actual method called is determined by the object's type at runtime, not the variable's type.
6. The __str__ method in Python allows you to customize how an object is displayed when converted to a string.
7. C++ supports both method overloading and operator overloading.

<details>
<summary><strong>View Answers</strong></summary>

1. False - Python's last definition wins. You can simulate overloading with default parameters or *args.
2. True - Method overriding happens when a child class provides a different implementation, resolved at runtime.
3. False - TypeScript doesn't support operator overloading. You must use methods instead.
4. False - Duck typing specifically doesn't require inheritance. Objects just need to have the required methods.
5. True - This is the essence of runtime polymorphism - the object's actual type determines behavior.
6. True - __str__ is the magic method that defines string representation for print() and str().
7. True - C++ fully supports both method overloading (same name, different parameters) and operator overloading.

</details>

### Multiple Choice Questions

1. What is the main benefit of polymorphism?
   - A) Faster code execution
   - B) Using the same interface for different object types
   - C) Reducing memory usage
   - D) Making code shorter

2. Which Python method would you override to customize the + operator?
   - A) __plus__
   - B) __add__
   - C) __sum__
   - D) __positive__

3. What is duck typing?
   - A) A way to type faster
   - B) Checking object type before using it
   - C) Using objects based on their methods, not their type
   - D) A debugging technique

4. In this code, what type of polymorphism is demonstrated?
   ```python
   class Dog:
       def speak(self):
           return "Woof"
   
   class Cat:
       def speak(self):
           return "Meow"
   
   def make_speak(animal):
       return animal.speak()
   ```
   - A) Method overloading
   - B) Operator overloading
   - C) Duck typing
   - D) Compile-time polymorphism

5. Which language does NOT support operator overloading?
   - A) Python
   - B) C++
   - C) TypeScript
   - D) All support it

6. What is method overriding?
   - A) Defining multiple methods with the same name
   - B) Child class providing different implementation of parent's method
   - C) Changing a method's return type
   - D) Deleting a parent's method

7. Which is NOT a valid Python magic method?
   - A) __add__
   - B) __subtract__
   - C) __mul__
   - D) __eq__

8. What happens when you override the __len__ method?
   - A) Changes object's actual size
   - B) Customizes behavior of len() function on the object
   - C) Makes the object iterable
   - D) Nothing, it's not a valid method

<details>
<summary><strong>View Answers</strong></summary>

1. B) Using the same interface for different object types - This allows flexibility and code reuse
2. B) __add__ - This magic method handles the + operator
3. C) Using objects based on their methods, not their type - Duck typing focuses on behavior, not inheritance
4. C) Duck typing - No inheritance required, just a speak() method
5. C) TypeScript - It doesn't support operator overloading; must use methods
6. B) Child class providing different implementation of parent's method
7. B) __subtract__ - The correct magic method is __sub__, not __subtract__
8. B) Customizes behavior of len() function on the object

</details>

### Code Challenges

**Challenge 1: Implement Polymorphic Shape System**

Create a shape system with:
- Abstract `Shape` base class with `area()` and `perimeter()` methods
- `Circle`, `Square`, `Triangle` classes
- Function `total_area()` that calculates combined area of any shapes

<details>
<summary><strong>View Solution</strong></summary>

```python
from abc import ABC, abstractmethod
import math

class Shape(ABC):
    @abstractmethod
    def area(self):
        pass
    
    @abstractmethod
    def perimeter(self):
        pass

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius
    
    def area(self):
        return math.pi * self.radius ** 2
    
    def perimeter(self):
        return 2 * math.pi * self.radius

class Square(Shape):
    def __init__(self, side):
        self.side = side
    
    def area(self):
        return self.side ** 2
    
    def perimeter(self):
        return 4 * self.side

class Triangle(Shape):
    def __init__(self, side1, side2, side3):
        self.side1 = side1
        self.side2 = side2
        self.side3 = side3
    
    def area(self):
        s = self.perimeter() / 2
        return math.sqrt(s * (s - self.side1) * (s - self.side2) * (s - self.side3))
    
    def perimeter(self):
        return self.side1 + self.side2 + self.side3

def total_area(shapes):
    """Polymorphic function - works with any Shape"""
    return sum(shape.area() for shape in shapes)

# Test
shapes = [
    Circle(5),
    Square(4),
    Triangle(3, 4, 5),
    Circle(3)
]

print(f"Total area: {total_area(shapes):.2f}")
for i, shape in enumerate(shapes, 1):
    print(f"Shape {i} - Area: {shape.area():.2f}, Perimeter: {shape.perimeter():.2f}")
```

</details>

**Challenge 2: Create a Vector Class with Operator Overloading**

Create a `Vector2D` class with:
- `__init__(x, y)`
- Overload +, -, *, == operators
- Overload `__str__` and `__len__`
- `dot_product(other)` method

<details>
<summary><strong>View Solution</strong></summary>

```python
import math

class Vector2D:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    def __add__(self, other):
        """Overload + operator"""
        return Vector2D(self.x + other.x, self.y + other.y)
    
    def __sub__(self, other):
        """Overload - operator"""
        return Vector2D(self.x - other.x, self.y - other.y)
    
    def __mul__(self, scalar):
        """Overload * operator (scalar multiplication)"""
        return Vector2D(self.x * scalar, self.y * scalar)
    
    def __eq__(self, other):
        """Overload == operator"""
        return self.x == other.x and self.y == other.y
    
    def __str__(self):
        """String representation"""
        return f"Vector2D({self.x}, {self.y})"
    
    def __len__(self):
        """Magnitude of vector"""
        return int(math.sqrt(self.x**2 + self.y**2))
    
    def dot_product(self, other):
        """Calculate dot product"""
        return self.x * other.x + self.y * other.y

# Test
v1 = Vector2D(3, 4)
v2 = Vector2D(1, 2)

print(f"v1: {v1}")
print(f"v2: {v2}")
print(f"v1 + v2: {v1 + v2}")
print(f"v1 - v2: {v1 - v2}")
print(f"v1 * 3: {v1 * 3}")
print(f"v1 == v2: {v1 == v2}")
print(f"Length of v1: {len(v1)}")
print(f"Dot product: {v1.dot_product(v2)}")
```

</details>

**Challenge 3: Duck Typing Logger System**

Create a logging system using duck typing:
- `FileLogger` - logs to file
- `ConsoleLogger` - logs to console
- `NetworkLogger` - simulates network logging
- `log_message(logger, message)` function that works with any logger

<details>
<summary><strong>View Solution</strong></summary>

```python
from datetime import datetime

class FileLogger:
    def __init__(self, filename):
        self.filename = filename
    
    def log(self, message):
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = f"[{timestamp}] {message}"
        # Simulating file write
        print(f"[FILE: {self.filename}] {log_entry}")

class ConsoleLogger:
    def __init__(self, prefix="LOG"):
        self.prefix = prefix
    
    def log(self, message):
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{self.prefix}] [{timestamp}] {message}")

class NetworkLogger:
    def __init__(self, server_address):
        self.server_address = server_address
    
    def log(self, message):
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        # Simulating network transmission
        print(f"[NETWORK -> {self.server_address}] [{timestamp}] {message}")

class DatabaseLogger:
    def __init__(self, table_name):
        self.table_name = table_name
    
    def log(self, message):
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        # Simulating database insert
        print(f"[DB: {self.table_name}] INSERT: [{timestamp}] {message}")

# Duck typing function - works with ANY logger that has log()
def log_message(logger, message):
    """Polymorphic function using duck typing"""
    logger.log(message)

# Test - no inheritance needed!
file_logger = FileLogger("app.log")
console_logger = ConsoleLogger("INFO")
network_logger = NetworkLogger("192.168.1.100:8080")
db_logger = DatabaseLogger("application_logs")

message = "User logged in successfully"

print("=== Logging with Different Loggers ===")
log_message(file_logger, message)
log_message(console_logger, message)
log_message(network_logger, message)
log_message(db_logger, message)

# Can even log to multiple loggers
print("\n=== Multi-Logger ===")
loggers = [file_logger, console_logger, network_logger, db_logger]
critical_message = "Critical error occurred!"

for logger in loggers:
    log_message(logger, critical_message)
```

</details>

</details>

---

## Summary

### Key Takeaways

1. **Polymorphism** = "Many forms" - same interface, different implementations
2. **Runtime Polymorphism** - Method overriding (resolved at runtime)
3. **Compile-time Polymorphism** - Method/operator overloading (resolved at compile time)
4. **Duck Typing** - Python's approach: if it has the methods, it works
5. **Operator Overloading** - Customize operators through magic methods (Python, C++)

### Memory Aid

**"PMOD" for Polymorphism:**
- **P**olymorphism = Many forms
- **M**ethod overriding (runtime)
- **O**perator overloading (magic methods)
- **D**uck typing (Python style)

### Language Comparison

| Feature | Python | TypeScript | C++ |
|---------|--------|-----------|-----|
| Method Overriding | ✅ Yes | ✅ Yes | ✅ Yes |
| Method Overloading | ❌ No (workarounds) | ✅ Yes | ✅ Yes |
| Operator Overloading | ✅ Yes | ❌ No | ✅ Yes |
| Duck Typing | ✅ Yes | ⚠️ Structural | ❌ No |

---

[← Back to Inheritance Part 2](03-inheritance-part2.md) | [Next: SOLID Principles →](../03-solid-principles/00-introduction.md) | [↑ Back to README](../README.md)