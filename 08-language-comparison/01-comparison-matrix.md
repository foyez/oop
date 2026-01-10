# 8.1 OOP Feature Comparison Matrix

[← Back to Real World](../07-real-world/04-game-characters.md) | [Next: Interview Prep →](../09-interview-prep/01-faq.md) | [↑ Back to README](../README.md)

---

## Quick Comparison Table

| Feature | Python | TypeScript | C++ |
|---------|--------|------------|-----|
| **Classes** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Encapsulation** | ⚠️ Convention (`_private`) | ✅ `private`, `protected` | ✅ `private`, `protected`, `public` |
| **Inheritance** | ✅ Single & Multiple | ✅ Single | ✅ Single & Multiple |
| **Abstract Classes** | ✅ `ABC` module | ✅ `abstract` keyword | ✅ Pure virtual functions |
| **Interfaces** | ⚠️ Protocol (duck typing) | ✅ `interface` keyword | ⚠️ Abstract classes |
| **Method Overloading** | ❌ No (use default params) | ✅ Yes | ✅ Yes |
| **Operator Overloading** | ✅ Magic methods | ❌ No | ✅ Yes |
| **Static Typing** | ⚠️ Optional (type hints) | ✅ Yes (compiles to JS) | ✅ Yes |
| **Access Modifiers** | ⚠️ Convention-based | ✅ Compile-time | ✅ Compile-time |
| **Properties** | ✅ `@property` decorator | ✅ Getters/setters | ⚠️ Manual implementation |
| **Decorators** | ✅ Native (`@`) | ✅ Native (`@`) | ❌ No (macros instead) |
| **Multiple Inheritance** | ✅ Yes (MRO) | ❌ No (interfaces only) | ✅ Yes (virtual inheritance) |

---

## Detailed Comparisons

### 1. Class Definition

**Python:**
```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def greet(self):
        return f"Hello, I'm {self.name}"
```

**TypeScript:**
```typescript
class Person {
    name: string;
    age: number;
    
    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
    
    greet(): string {
        return `Hello, I'm ${this.name}`;
    }
}
```

**C++:**
```cpp
class Person {
private:
    std::string name;
    int age;

public:
    Person(std::string n, int a) : name(n), age(a) {}
    
    std::string greet() {
        return "Hello, I'm " + name;
    }
};
```

---

### 2. Encapsulation

**Python (Convention-based):**
```python
class BankAccount:
    def __init__(self, balance):
        self._balance = balance  # Protected (convention)
        self.__secret = "xyz"     # Name mangling
    
    def get_balance(self):
        return self._balance
```

**TypeScript:**
```typescript
class BankAccount {
    private balance: number;
    protected accountId: string;
    
    constructor(balance: number) {
        this.balance = balance;
    }
    
    getBalance(): number {
        return this.balance;
    }
}
```

**C++:**
```cpp
class BankAccount {
private:
    double balance;

protected:
    std::string accountId;

public:
    BankAccount(double b) : balance(b) {}
    
    double getBalance() const {
        return balance;
    }
};
```

---

### 3. Inheritance

**Python (Multiple Inheritance):**
```python
class Animal:
    def breathe(self):
        return "Breathing"

class Swimmer:
    def swim(self):
        return "Swimming"

class Dolphin(Animal, Swimmer):  # Multiple inheritance
    pass

d = Dolphin()
print(d.breathe())  # Works
print(d.swim())     # Works
```

**TypeScript (Single Inheritance + Interfaces):**
```typescript
interface Swimmer {
    swim(): string;
}

class Animal {
    breathe(): string {
        return "Breathing";
    }
}

class Dolphin extends Animal implements Swimmer {
    swim(): string {
        return "Swimming";
    }
}
```

**C++ (Multiple Inheritance):**
```cpp
class Animal {
public:
    std::string breathe() { return "Breathing"; }
};

class Swimmer {
public:
    std::string swim() { return "Swimming"; }
};

class Dolphin : public Animal, public Swimmer {
    // Inherits from both
};
```

---

### 4. Abstract Classes & Interfaces

**Python:**
```python
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self):
        pass

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius
    
    def area(self):
        return 3.14 * self.radius ** 2
```

**TypeScript:**
```typescript
abstract class Shape {
    abstract area(): number;
}

class Circle extends Shape {
    constructor(private radius: number) {
        super();
    }
    
    area(): number {
        return Math.PI * this.radius ** 2;
    }
}

// Or using interface
interface IShape {
    area(): number;
}

class Square implements IShape {
    constructor(private side: number) {}
    
    area(): number {
        return this.side ** 2;
    }
}
```

**C++:**
```cpp
// Pure virtual function = abstract
class Shape {
public:
    virtual double area() = 0;  // Pure virtual
    virtual ~Shape() {}
};

class Circle : public Shape {
private:
    double radius;

public:
    Circle(double r) : radius(r) {}
    
    double area() override {
        return 3.14159 * radius * radius;
    }
};
```

---

### 5. Method Overloading

**Python (No true overloading):**
```python
class Calculator:
    def add(self, a, b, c=0):  # Default parameters
        return a + b + c

calc = Calculator()
print(calc.add(2, 3))      # 5
print(calc.add(2, 3, 4))   # 9
```

**TypeScript (Full overloading):**
```typescript
class Calculator {
    add(a: number, b: number): number;
    add(a: string, b: string): string;
    add(a: any, b: any): any {
        return a + b;
    }
}

let calc = new Calculator();
console.log(calc.add(2, 3));        // 5 (number)
console.log(calc.add("Hi", "!")); // "Hi!" (string)
```

**C++ (Full overloading):**
```cpp
class Calculator {
public:
    int add(int a, int b) {
        return a + b;
    }
    
    double add(double a, double b) {
        return a + b;
    }
    
    int add(int a, int b, int c) {
        return a + b + c;
    }
};
```

---

### 6. Operator Overloading

**Python (Magic methods):**
```python
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    def __add__(self, other):  # Overload +
        return Vector(self.x + other.x, self.y + other.y)
    
    def __str__(self):
        return f"Vector({self.x}, {self.y})"

v1 = Vector(1, 2)
v2 = Vector(3, 4)
v3 = v1 + v2  # Uses __add__
print(v3)     # Vector(4, 6)
```

**TypeScript (Not supported):**
```typescript
// Must use methods instead
class Vector {
    constructor(public x: number, public y: number) {}
    
    add(other: Vector): Vector {
        return new Vector(this.x + other.x, this.y + other.y);
    }
}

let v1 = new Vector(1, 2);
let v2 = new Vector(3, 4);
let v3 = v1.add(v2);  // Must use method
```

**C++ (Full support):**
```cpp
class Vector {
private:
    double x, y;

public:
    Vector(double x, double y) : x(x), y(y) {}
    
    Vector operator+(const Vector& other) const {
        return Vector(x + other.x, y + other.y);
    }
    
    friend std::ostream& operator<<(std::ostream& os, const Vector& v) {
        os << "Vector(" << v.x << ", " << v.y << ")";
        return os;
    }
};

Vector v1(1, 2);
Vector v2(3, 4);
Vector v3 = v1 + v2;  // Uses operator+
std::cout << v3;       // Uses operator<<
```

---

## When to Use Each Language

### Python ✅
**Best for:**
- Rapid prototyping
- Data science / ML
- Scripting
- When development speed > execution speed
- Cross-platform compatibility

**Avoid when:**
- Need maximum performance
- Large-scale enterprise (lack of compile-time checks)
- Real-time systems

### TypeScript ✅
**Best for:**
- Web applications
- Frontend development
- Node.js backend
- When need type safety in JavaScript ecosystem
- Team projects (catches errors early)

**Avoid when:**
- Pure backend (Python/Java might be better)
- System programming
- Maximum performance needed

### C++ ✅
**Best for:**
- High-performance applications
- Game engines
- Operating systems
- Embedded systems
- When control over memory is critical

**Avoid when:**
- Rapid prototyping needed
- Web development
- Simple scripts

---

## Summary

| Aspect | Python | TypeScript | C++ |
|--------|--------|------------|-----|
| **Learning Curve** | Easy | Medium | Hard |
| **Performance** | Slow | Medium | Fast |
| **Type Safety** | Runtime | Compile-time | Compile-time |
| **Flexibility** | Very High | High | Medium |
| **Best Use** | Scripting, Data Science | Web Apps | Systems, Games |

---

[← Back to Real World](../07-real-world/04-game-characters.md) | [Next: Interview Prep →](../09-interview-prep/01-faq.md) | [↑ Back to README](../README.md)