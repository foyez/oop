# Chapter 7: Design Patterns

Design patterns are reusable solutions to commonly occurring problems in software design. They represent best practices refined over time and provide a shared vocabulary for developers.

---

## Table of Contents

- [1. Introduction to Design Patterns](#1-introduction-to-design-patterns)
- [2. Creational Patterns](#2-creational-patterns)
    - [Singleton](#a-singleton-pattern)
    - [Factory Method](#b-factory-method-pattern)
    - [Abstract Factory](#c-abstract-factory-pattern)
    - [Builder](#d-builder-pattern)
    - [Prototype](#e-prototype-pattern)
- [3. Structural Patterns](#3-structural-patterns)
    - [Adapter](#a-adapter-pattern)
    - [Decorator](#b-decorator-pattern)
    - [Facade](#c-facade-pattern)
    - [Proxy](#d-proxy-pattern)
    - [Composite](#e-composite-pattern)
    - [Bridge](#f-bridge-pattern)
    - [Flyweight](#g-flyweight-pattern)
- [4. Behavioral Patterns]()
    - [Strategy]()
    - [Observer]()
    - [Command]()
    - [Template Method]()
    - [Iterator]()
    - [State]()
    - [Chain of Responsibility]()
    - [Mediator]()
    - [Memento]()
    - [Visitor]()

---

## 1. Introduction to Design Patterns

**Definition**: Design patterns are typical solutions to common problems in software design. Each pattern is like a blueprint that you can customize to solve a particular design problem in your code.

**Real-world analogy**: Think of design patterns like architectural blueprints. Just as architects use proven patterns for building structures (open floor plans, load-bearing walls, arches), software developers use proven patterns for building software (factories for object creation, observers for event handling).

### History

- **Origins**: Introduced by "Gang of Four" (GoF) in 1994 book "Design Patterns: Elements of Reusable Object-Oriented Software"
- **Authors**: Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides
- **Impact**: Became the foundation of modern software design

### Categories

Design patterns are organized into three main categories:

1. **Creational Patterns**: Deal with object creation mechanisms
   - Control how objects are created
   - Hide creation logic
   - Make system independent of object creation

2. **Structural Patterns**: Deal with object composition
   - Compose objects into larger structures
   - Simplify relationships between entities
   - Provide flexible ways to organize code

3. **Behavioral Patterns**: Deal with communication between objects
   - Define how objects interact and communicate
   - Distribute responsibilities
   - Manage algorithms and relationships

### Why Use Design Patterns?

- **Proven Solutions**: Tested and refined over time
- **Common Vocabulary**: Team communication is clearer
- **Best Practices**: Avoid reinventing the wheel
- **Code Quality**: More maintainable and scalable
- **Problem Recognition**: Help identify and solve recurring problems

⚠️ **When NOT to Use Patterns**:
- Don't force patterns where they don't fit
- Patterns can add complexity
- Understand the problem before applying patterns
- KISS (Keep It Simple, Stupid) principle

<details>
<summary><strong>View Examples</strong></summary>

```typescript
// TypeScript - Design Patterns Overview

// ============================================
// Pattern Categories Overview
// ============================================

console.log("=== Design Patterns Overview ===\n");

// ============================================
// 1. Creational Pattern Example (Factory Method)
// ============================================

console.log("=== Creational Pattern: Factory Method ===\n");

interface Vehicle {
  drive(): void;
  getType(): string;
}

class Car implements Vehicle {
  drive(): void {
    console.log("Driving a car on the road");
  }
  
  getType(): string {
    return "Car";
  }
}

class Motorcycle implements Vehicle {
  drive(): void {
    console.log("Riding a motorcycle");
  }
  
  getType(): string {
    return "Motorcycle";
  }
}

class Truck implements Vehicle {
  drive(): void {
    console.log("Driving a truck");
  }
  
  getType(): string {
    return "Truck";
  }
}

// Factory creates objects without exposing creation logic
class VehicleFactory {
  static createVehicle(type: string): Vehicle {
    switch (type.toLowerCase()) {
      case 'car':
        return new Car();
      case 'motorcycle':
        return new Motorcycle();
      case 'truck':
        return new Truck();
      default:
        throw new Error(`Unknown vehicle type: ${type}`);
    }
  }
}

// Client code doesn't know about concrete classes
const vehicle1 = VehicleFactory.createVehicle('car');
const vehicle2 = VehicleFactory.createVehicle('motorcycle');

vehicle1.drive();
vehicle2.drive();

console.log("\n✓ Creational patterns control object creation");
console.log("✓ Client code independent of concrete classes");

// ============================================
// 2. Structural Pattern Example (Decorator)
// ============================================

console.log("\n\n=== Structural Pattern: Decorator ===\n");

interface Coffee {
  getCost(): number;
  getDescription(): string;
}

class SimpleCoffee implements Coffee {
  getCost(): number {
    return 2;
  }
  
  getDescription(): string {
    return "Simple coffee";
  }
}

// Decorator adds functionality without modifying original class
abstract class CoffeeDecorator implements Coffee {
  constructor(protected coffee: Coffee) {}
  
  abstract getCost(): number;
  abstract getDescription(): string;
}

class MilkDecorator extends CoffeeDecorator {
  getCost(): number {
    return this.coffee.getCost() + 0.5;
  }
  
  getDescription(): string {
    return this.coffee.getDescription() + ", milk";
  }
}

class SugarDecorator extends CoffeeDecorator {
  getCost(): number {
    return this.coffee.getCost() + 0.2;
  }
  
  getDescription(): string {
    return this.coffee.getDescription() + ", sugar";
  }
}

class VanillaDecorator extends CoffeeDecorator {
  getCost(): number {
    return this.coffee.getCost() + 0.7;
  }
  
  getDescription(): string {
    return this.coffee.getDescription() + ", vanilla";
  }
}

// Build coffee with decorators
let coffee: Coffee = new SimpleCoffee();
console.log(`${coffee.getDescription()} - $${coffee.getCost()}`);

coffee = new MilkDecorator(coffee);
console.log(`${coffee.getDescription()} - $${coffee.getCost()}`);

coffee = new SugarDecorator(coffee);
console.log(`${coffee.getDescription()} - $${coffee.getCost()}`);

coffee = new VanillaDecorator(coffee);
console.log(`${coffee.getDescription()} - $${coffee.getCost()}`);

console.log("\n✓ Structural patterns organize object relationships");
console.log("✓ Add functionality dynamically without modifying classes");

// ============================================
// 3. Behavioral Pattern Example (Observer)
// ============================================

console.log("\n\n=== Behavioral Pattern: Observer ===\n");

interface Observer {
  update(data: any): void;
  getName(): string;
}

class Subject {
  private observers: Observer[] = [];
  
  attach(observer: Observer): void {
    this.observers.push(observer);
    console.log(`${observer.getName()} subscribed`);
  }
  
  detach(observer: Observer): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
      console.log(`${observer.getName()} unsubscribed`);
    }
  }
  
  notify(data: any): void {
    console.log(`\nNotifying ${this.observers.length} observers...`);
    this.observers.forEach(observer => observer.update(data));
  }
}

class EmailSubscriber implements Observer {
  constructor(private email: string) {}
  
  update(data: any): void {
    console.log(`📧 Email to ${this.email}: ${data.message}`);
  }
  
  getName(): string {
    return `Email (${this.email})`;
  }
}

class SMSSubscriber implements Observer {
  constructor(private phone: string) {}
  
  update(data: any): void {
    console.log(`📱 SMS to ${this.phone}: ${data.message}`);
  }
  
  getName(): string {
    return `SMS (${this.phone})`;
  }
}

class PushSubscriber implements Observer {
  constructor(private deviceId: string) {}
  
  update(data: any): void {
    console.log(`🔔 Push to ${this.deviceId}: ${data.message}`);
  }
  
  getName(): string {
    return `Push (${this.deviceId})`;
  }
}

// News publisher (subject)
const newsPublisher = new Subject();

// Subscribers (observers)
const emailSub = new EmailSubscriber("user@example.com");
const smsSub = new SMSSubscriber("+1234567890");
const pushSub = new PushSubscriber("device_123");

// Subscribe
newsPublisher.attach(emailSub);
newsPublisher.attach(smsSub);
newsPublisher.attach(pushSub);

// Publish news
newsPublisher.notify({ message: "Breaking news: Design patterns are awesome!" });

// Unsubscribe
newsPublisher.detach(smsSub);

// Publish again
newsPublisher.notify({ message: "More news: Observer pattern in action!" });

console.log("\n✓ Behavioral patterns define object interactions");
console.log("✓ Objects can subscribe/unsubscribe to events");

// ============================================
// Pattern Benefits in Real Applications
// ============================================

console.log("\n\n=== Real-World Pattern Usage ===\n");

// Example: E-commerce Order Processing
// Uses multiple patterns together

// Strategy Pattern (payment methods)
interface PaymentStrategy {
  pay(amount: number): boolean;
}

class CreditCardPayment implements PaymentStrategy {
  pay(amount: number): boolean {
    console.log(`Paid $${amount} with credit card`);
    return true;
  }
}

class PayPalPayment implements PaymentStrategy {
  pay(amount: number): boolean {
    console.log(`Paid $${amount} with PayPal`);
    return true;
  }
}

// Factory Pattern (create orders)
class Order {
  constructor(
    public orderId: string,
    public items: string[],
    public total: number
  ) {}
}

class OrderFactory {
  static createOrder(items: string[]): Order {
    const orderId = `ORD-${Date.now()}`;
    const total = items.length * 10; // Simplified
    return new Order(orderId, items, total);
  }
}

// Observer Pattern (order notifications)
class OrderNotifier extends Subject {
  processOrder(order: Order, paymentStrategy: PaymentStrategy): void {
    console.log(`\nProcessing order ${order.orderId}`);
    
    if (paymentStrategy.pay(order.total)) {
      this.notify({
        message: `Order ${order.orderId} confirmed! Total: $${order.total}`
      });
    }
  }
}

// Using multiple patterns together
console.log("=== E-commerce System Using Multiple Patterns ===");

const orderNotifier = new OrderNotifier();
orderNotifier.attach(new EmailSubscriber("customer@example.com"));
orderNotifier.attach(new SMSSubscriber("+1234567890"));

const order = OrderFactory.createOrder(["Laptop", "Mouse", "Keyboard"]);
orderNotifier.processOrder(order, new CreditCardPayment());

console.log("\n✓ Patterns work together in real applications");
console.log("✓ Each pattern solves a specific problem");
console.log("✓ Combined patterns create robust systems");

// ============================================
// Pattern Selection Guide
// ============================================

console.log("\n\n=== When to Use Each Pattern Category ===\n");

console.log("Creational Patterns - Use when:");
console.log("  • Object creation is complex");
console.log("  • You need to control object creation");
console.log("  • Want to hide creation logic from clients");
console.log("  • Need to ensure only one instance (Singleton)");
console.log("  • Building complex objects step-by-step (Builder)");

console.log("\nStructural Patterns - Use when:");
console.log("  • Need to compose objects into larger structures");
console.log("  • Want to add functionality without modifying classes (Decorator)");
console.log("  • Need to simplify complex interfaces (Facade)");
console.log("  • Making incompatible interfaces work together (Adapter)");
console.log("  • Want to control access to objects (Proxy)");

console.log("\nBehavioral Patterns - Use when:");
console.log("  • Defining how objects communicate");
console.log("  • Need to notify multiple objects of changes (Observer)");
console.log("  • Want to swap algorithms at runtime (Strategy)");
console.log("  • Encapsulating requests as objects (Command)");
console.log("  • Need to iterate over collections (Iterator)");

// ============================================
// Common Pitfalls
// ============================================

console.log("\n\n=== Common Pattern Pitfalls ===\n");

console.log("❌ Don't:");
console.log("  • Force patterns where they don't fit");
console.log("  • Use patterns just to use patterns");
console.log("  • Over-engineer simple solutions");
console.log("  • Apply patterns without understanding the problem");
console.log("  • Make code more complex than necessary");

console.log("\n✓ Do:");
console.log("  • Understand the problem first");
console.log("  • Choose patterns that solve your specific problem");
console.log("  • Keep it simple when possible");
console.log("  • Use patterns to improve code quality");
console.log("  • Combine patterns when it makes sense");
```

```python
# Python - Design Patterns Overview

from abc import ABC, abstractmethod
from typing import List

# ============================================
# Pattern Categories Overview
# ============================================

print("=== Design Patterns Overview ===\n")

# ============================================
# 1. Creational Pattern Example (Factory Method)
# ============================================

print("=== Creational Pattern: Factory Method ===\n")

class Vehicle(ABC):
    @abstractmethod
    def drive(self) -> None:
        pass
    
    @abstractmethod
    def get_type(self) -> str:
        pass

class Car(Vehicle):
    def drive(self) -> None:
        print("Driving a car on the road")
    
    def get_type(self) -> str:
        return "Car"

class Motorcycle(Vehicle):
    def drive(self) -> None:
        print("Riding a motorcycle")
    
    def get_type(self) -> str:
        return "Motorcycle"

class Truck(Vehicle):
    def drive(self) -> None:
        print("Driving a truck")
    
    def get_type(self) -> str:
        return "Truck"

class VehicleFactory:
    @staticmethod
    def create_vehicle(vehicle_type: str) -> Vehicle:
        vehicle_type = vehicle_type.lower()
        if vehicle_type == 'car':
            return Car()
        elif vehicle_type == 'motorcycle':
            return Motorcycle()
        elif vehicle_type == 'truck':
            return Truck()
        else:
            raise ValueError(f"Unknown vehicle type: {vehicle_type}")

# Client code
vehicle1 = VehicleFactory.create_vehicle('car')
vehicle2 = VehicleFactory.create_vehicle('motorcycle')

vehicle1.drive()
vehicle2.drive()

print("\n✓ Creational patterns control object creation")
print("✓ Client code independent of concrete classes")

# ============================================
# 2. Structural Pattern Example (Decorator)
# ============================================

print("\n\n=== Structural Pattern: Decorator ===\n")

class Coffee(ABC):
    @abstractmethod
    def get_cost(self) -> float:
        pass
    
    @abstractmethod
    def get_description(self) -> str:
        pass

class SimpleCoffee(Coffee):
    def get_cost(self) -> float:
        return 2.0
    
    def get_description(self) -> str:
        return "Simple coffee"

class CoffeeDecorator(Coffee):
    def __init__(self, coffee: Coffee):
        self._coffee = coffee
    
    @abstractmethod
    def get_cost(self) -> float:
        pass
    
    @abstractmethod
    def get_description(self) -> str:
        pass

class MilkDecorator(CoffeeDecorator):
    def get_cost(self) -> float:
        return self._coffee.get_cost() + 0.5
    
    def get_description(self) -> str:
        return self._coffee.get_description() + ", milk"

class SugarDecorator(CoffeeDecorator):
    def get_cost(self) -> float:
        return self._coffee.get_cost() + 0.2
    
    def get_description(self) -> str:
        return self._coffee.get_description() + ", sugar"

class VanillaDecorator(CoffeeDecorator):
    def get_cost(self) -> float:
        return self._coffee.get_cost() + 0.7
    
    def get_description(self) -> str:
        return self._coffee.get_description() + ", vanilla"

# Build coffee with decorators
coffee = SimpleCoffee()
print(f"{coffee.get_description()} - ${coffee.get_cost()}")

coffee = MilkDecorator(coffee)
print(f"{coffee.get_description()} - ${coffee.get_cost()}")

coffee = SugarDecorator(coffee)
print(f"{coffee.get_description()} - ${coffee.get_cost()}")

coffee = VanillaDecorator(coffee)
print(f"{coffee.get_description()} - ${coffee.get_cost()}")

print("\n✓ Structural patterns organize object relationships")
print("✓ Add functionality dynamically without modifying classes")

# ============================================
# 3. Behavioral Pattern Example (Observer)
# ============================================

print("\n\n=== Behavioral Pattern: Observer ===\n")

class Observer(ABC):
    @abstractmethod
    def update(self, data: dict) -> None:
        pass
    
    @abstractmethod
    def get_name(self) -> str:
        pass

class Subject:
    def __init__(self):
        self._observers: List[Observer] = []
    
    def attach(self, observer: Observer) -> None:
        self._observers.append(observer)
        print(f"{observer.get_name()} subscribed")
    
    def detach(self, observer: Observer) -> None:
        if observer in self._observers:
            self._observers.remove(observer)
            print(f"{observer.get_name()} unsubscribed")
    
    def notify(self, data: dict) -> None:
        print(f"\nNotifying {len(self._observers)} observers...")
        for observer in self._observers:
            observer.update(data)

class EmailSubscriber(Observer):
    def __init__(self, email: str):
        self._email = email
    
    def update(self, data: dict) -> None:
        print(f"📧 Email to {self._email}: {data['message']}")
    
    def get_name(self) -> str:
        return f"Email ({self._email})"

class SMSSubscriber(Observer):
    def __init__(self, phone: str):
        self._phone = phone
    
    def update(self, data: dict) -> None:
        print(f"📱 SMS to {self._phone}: {data['message']}")
    
    def get_name(self) -> str:
        return f"SMS ({self._phone})"

class PushSubscriber(Observer):
    def __init__(self, device_id: str):
        self._device_id = device_id
    
    def update(self, data: dict) -> None:
        print(f"🔔 Push to {self._device_id}: {data['message']}")
    
    def get_name(self) -> str:
        return f"Push ({self._device_id})"

# News publisher
news_publisher = Subject()

# Subscribers
email_sub = EmailSubscriber("user@example.com")
sms_sub = SMSSubscriber("+1234567890")
push_sub = PushSubscriber("device_123")

# Subscribe
news_publisher.attach(email_sub)
news_publisher.attach(sms_sub)
news_publisher.attach(push_sub)

# Publish news
news_publisher.notify({'message': 'Breaking news: Design patterns are awesome!'})

# Unsubscribe
news_publisher.detach(sms_sub)

# Publish again
news_publisher.notify({'message': 'More news: Observer pattern in action!'})

print("\n✓ Behavioral patterns define object interactions")
print("✓ Objects can subscribe/unsubscribe to events")

# ============================================
# Real-World Example
# ============================================

print("\n\n=== Real-World Pattern Usage ===\n")

# Strategy Pattern
class PaymentStrategy(ABC):
    @abstractmethod
    def pay(self, amount: float) -> bool:
        pass

class CreditCardPayment(PaymentStrategy):
    def pay(self, amount: float) -> bool:
        print(f"Paid ${amount} with credit card")
        return True

class PayPalPayment(PaymentStrategy):
    def pay(self, amount: float) -> bool:
        print(f"Paid ${amount} with PayPal")
        return True

# Factory Pattern
class Order:
    def __init__(self, order_id: str, items: List[str], total: float):
        self.order_id = order_id
        self.items = items
        self.total = total

class OrderFactory:
    @staticmethod
    def create_order(items: List[str]) -> Order:
        import time
        order_id = f"ORD-{int(time.time())}"
        total = len(items) * 10  # Simplified
        return Order(order_id, items, total)

# Observer Pattern
class OrderNotifier(Subject):
    def process_order(self, order: Order, payment_strategy: PaymentStrategy) -> None:
        print(f"\nProcessing order {order.order_id}")
        
        if payment_strategy.pay(order.total):
            self.notify({
                'message': f"Order {order.order_id} confirmed! Total: ${order.total}"
            })

# Using multiple patterns together
print("=== E-commerce System Using Multiple Patterns ===")

order_notifier = OrderNotifier()
order_notifier.attach(EmailSubscriber("customer@example.com"))
order_notifier.attach(SMSSubscriber("+1234567890"))

order = OrderFactory.create_order(["Laptop", "Mouse", "Keyboard"])
order_notifier.process_order(order, CreditCardPayment())

print("\n✓ Patterns work together in real applications")
print("✓ Each pattern solves a specific problem")
print("✓ Combined patterns create robust systems")

print("\n\n=== When to Use Each Pattern Category ===\n")

print("Creational Patterns - Use when:")
print("  • Object creation is complex")
print("  • You need to control object creation")
print("  • Want to hide creation logic from clients")

print("\nStructural Patterns - Use when:")
print("  • Need to compose objects into larger structures")
print("  • Want to add functionality without modifying classes")
print("  • Need to simplify complex interfaces")

print("\nBehavioral Patterns - Use when:")
print("  • Defining how objects communicate")
print("  • Need to notify multiple objects of changes")
print("  • Want to swap algorithms at runtime")

print("\n\n=== Common Pattern Pitfalls ===\n")

print("❌ Don't:")
print("  • Force patterns where they don't fit")
print("  • Use patterns just to use patterns")
print("  • Over-engineer simple solutions")

print("\n✓ Do:")
print("  • Understand the problem first")
print("  • Choose patterns that solve your specific problem")
print("  • Keep it simple when possible")
```

</details>

---

## 2. Creational Patterns

Creational patterns deal with object creation mechanisms, trying to create objects in a manner suitable to the situation. They help make systems independent of how objects are created, composed, and represented.

---

### A. Singleton Pattern

**Intent**: Ensure a class has only one instance and provide a global point of access to it.

**Real-world analogy**: A country can have only one official government at a time. No matter how many times you reference "the government," you're always talking about the same instance.

**When to use**:
- Exactly one instance needed (database connection pool, configuration manager, logger)
- Global access point required
- Instance should be extensible by subclassing

**Pros**:
- Controlled access to sole instance
- Reduced namespace pollution
- Lazy initialization possible

**Cons**:
- Violates Single Responsibility Principle (manages lifecycle AND business logic)
- Difficult to test (global state)
- Can hide dependencies
- Thread-safety concerns in multi-threaded environments

<details>
<summary><strong>View Singleton Examples</strong></summary>

```typescript
// TypeScript - Singleton Pattern

// ============================================
// Basic Singleton
// ============================================

console.log("=== Basic Singleton ===\n");

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private connectionId: string;

  // Private constructor prevents direct instantiation
  private constructor() {
    this.connectionId = Math.random().toString(36).substring(7);
    console.log(`Database connection created: ${this.connectionId}`);
  }

  // Static method to get the single instance
  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      console.log("Creating first (and only) instance...");
      DatabaseConnection.instance = new DatabaseConnection();
    } else {
      console.log("Returning existing instance...");
    }
    return DatabaseConnection.instance;
  }

  public query(sql: string): any[] {
    console.log(`[${this.connectionId}] Executing: ${sql}`);
    return [];
  }

  public getConnectionId(): string {
    return this.connectionId;
  }
}

// Usage
const db1 = DatabaseConnection.getInstance();
const db2 = DatabaseConnection.getInstance();
const db3 = DatabaseConnection.getInstance();

console.log(`\ndb1 ID: ${db1.getConnectionId()}`);
console.log(`db2 ID: ${db2.getConnectionId()}`);
console.log(`db3 ID: ${db3.getConnectionId()}`);
console.log(`Same instance? ${db1 === db2 && db2 === db3}`);

db1.query("SELECT * FROM users");

// ============================================
// Thread-Safe Singleton (with lazy initialization)
// ============================================

console.log("\n\n=== Thread-Safe Singleton ===\n");

class Logger {
  private static instance: Logger;
  private static isCreating: boolean = false;
  private logs: string[] = [];

  private constructor() {
    console.log("Logger instance created");
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      if (Logger.isCreating) {
        throw new Error("Singleton creation in progress");
      }
      Logger.isCreating = true;
      Logger.instance = new Logger();
      Logger.isCreating = false;
    }
    return Logger.instance;
  }

  public log(message: string): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;
    this.logs.push(logEntry);
    console.log(logEntry);
  }

  public error(message: string): void {
    this.log(`ERROR: ${message}`);
  }

  public getLogs(): string[] {
    return [...this.logs];
  }

  public clearLogs(): void {
    this.logs = [];
    console.log("Logs cleared");
  }
}

const logger1 = Logger.getInstance();
const logger2 = Logger.getInstance();

logger1.log("Application started");
logger2.log("User logged in");
logger1.error("Connection timeout");

console.log(`\nTotal logs: ${logger1.getLogs().length}`);
console.log(`Same logger instance? ${logger1 === logger2}`);

// ============================================
// Real-World Example: Configuration Manager
// ============================================

console.log("\n\n=== Real-World: Configuration Manager ===\n");

interface AppConfig {
  apiUrl: string;
  apiKey: string;
  timeout: number;
  retries: number;
  environment: 'development' | 'staging' | 'production';
}

class ConfigurationManager {
  private static instance: ConfigurationManager;
  private config: AppConfig;

  private constructor() {
    // Load configuration (simulated)
    this.config = {
      apiUrl: 'https://api.example.com',
      apiKey: 'secret-key-12345',
      timeout: 5000,
      retries: 3,
      environment: 'production'
    };
    console.log("Configuration loaded");
  }

  public static getInstance(): ConfigurationManager {
    if (!ConfigurationManager.instance) {
      ConfigurationManager.instance = new ConfigurationManager();
    }
    return ConfigurationManager.instance;
  }

  public get<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return this.config[key];
  }

  public set<K extends keyof AppConfig>(key: K, value: AppConfig[K]): void {
    console.log(`Updating ${key}: ${this.config[key]} -> ${value}`);
    this.config[key] = value;
  }

  public getAll(): AppConfig {
    return { ...this.config };
  }

  public isProduction(): boolean {
    return this.config.environment === 'production';
  }
}

// Usage across different parts of the application
class ApiService {
  private config = ConfigurationManager.getInstance();

  makeRequest(endpoint: string): void {
    const url = `${this.config.get('apiUrl')}${endpoint}`;
    const timeout = this.config.get('timeout');
    console.log(`\nAPI Request to: ${url} (timeout: ${timeout}ms)`);
  }
}

class AuthService {
  private config = ConfigurationManager.getInstance();

  authenticate(): void {
    const apiKey = this.config.get('apiKey');
    console.log(`\nAuthenticating with API key: ${apiKey.substring(0, 10)}...`);
  }
}

const apiService = new ApiService();
const authService = new AuthService();

apiService.makeRequest('/users');
authService.authenticate();

// Update configuration globally
const config = ConfigurationManager.getInstance();
config.set('timeout', 10000);

// All services see the updated value
apiService.makeRequest('/posts');

// ============================================
// Real-World Example: Application State
// ============================================

console.log("\n\n=== Real-World: Application State ===\n");

interface User {
  id: string;
  name: string;
  email: string;
}

class ApplicationState {
  private static instance: ApplicationState;
  private currentUser: User | null = null;
  private isAuthenticated: boolean = false;
  private theme: 'light' | 'dark' = 'light';
  private listeners: Map<string, Function[]> = new Map();

  private constructor() {
    console.log("Application state initialized");
  }

  public static getInstance(): ApplicationState {
    if (!ApplicationState.instance) {
      ApplicationState.instance = new ApplicationState();
    }
    return ApplicationState.instance;
  }

  public login(user: User): void {
    this.currentUser = user;
    this.isAuthenticated = true;
    console.log(`User logged in: ${user.name}`);
    this.notifyListeners('login', user);
  }

  public logout(): void {
    const userName = this.currentUser?.name;
    this.currentUser = null;
    this.isAuthenticated = false;
    console.log(`User logged out: ${userName}`);
    this.notifyListeners('logout', null);
  }

  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public isUserAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  public setTheme(theme: 'light' | 'dark'): void {
    this.theme = theme;
    console.log(`Theme changed to: ${theme}`);
    this.notifyListeners('themeChange', theme);
  }

  public getTheme(): string {
    return this.theme;
  }

  public subscribe(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  private notifyListeners(event: string, data: any): void {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(callback => callback(data));
  }
}

// Different components use the same state
class Header {
  private state = ApplicationState.getInstance();

  constructor() {
    this.state.subscribe('login', (user: User) => {
      console.log(`  [Header] Displaying user: ${user.name}`);
    });

    this.state.subscribe('logout', () => {
      console.log(`  [Header] Displaying login button`);
    });
  }

  render(): void {
    const user = this.state.getCurrentUser();
    if (user) {
      console.log(`Header: Welcome, ${user.name}!`);
    } else {
      console.log(`Header: Please log in`);
    }
  }
}

class Sidebar {
  private state = ApplicationState.getInstance();

  constructor() {
    this.state.subscribe('themeChange', (theme: string) => {
      console.log(`  [Sidebar] Applying ${theme} theme`);
    });
  }

  render(): void {
    const theme = this.state.getTheme();
    console.log(`Sidebar: Using ${theme} theme`);
  }
}

// Usage
const header = new Header();
const sidebar = new Sidebar();

console.log("\n--- Initial State ---");
header.render();
sidebar.render();

console.log("\n--- After Login ---");
const appState = ApplicationState.getInstance();
appState.login({
  id: '1',
  name: 'Alice Johnson',
  email: 'alice@example.com'
});
header.render();

console.log("\n--- After Theme Change ---");
appState.setTheme('dark');
sidebar.render();

console.log("\n--- After Logout ---");
appState.logout();
header.render();

// ============================================
// Singleton Variations
// ============================================

console.log("\n\n=== Singleton Variations ===\n");

// 1. Eager Initialization (created immediately)
class EagerSingleton {
  private static instance: EagerSingleton = new EagerSingleton();

  private constructor() {
    console.log("Eager singleton created immediately");
  }

  public static getInstance(): EagerSingleton {
    return EagerSingleton.instance;
  }
}

// 2. With Reset (useful for testing)
class ResettableSingleton {
  private static instance: ResettableSingleton | null = null;

  private constructor() {
    console.log("Resettable singleton created");
  }

  public static getInstance(): ResettableSingleton {
    if (!ResettableSingleton.instance) {
      ResettableSingleton.instance = new ResettableSingleton();
    }
    return ResettableSingleton.instance;
  }

  public static reset(): void {
    console.log("Singleton reset");
    ResettableSingleton.instance = null;
  }
}

console.log("Creating eager singleton...");
const eager = EagerSingleton.getInstance();

console.log("\nCreating resettable singleton...");
const resettable1 = ResettableSingleton.getInstance();
ResettableSingleton.reset();
const resettable2 = ResettableSingleton.getInstance();
console.log(`Same instance after reset? ${resettable1 === resettable2}`);

// ============================================
// Key Takeaways
// ============================================

console.log("\n\n=== Singleton Pattern Summary ===");
console.log("\nWhen to use:");
console.log("  ✓ Need exactly one instance (config, logger, cache)");
console.log("  ✓ Global access point required");
console.log("  ✓ Instance should control access to shared resource");

console.log("\nBenefits:");
console.log("  ✓ Controlled access to single instance");
console.log("  ✓ Reduced memory footprint");
console.log("  ✓ Can be lazily initialized");

console.log("\nDrawbacks:");
console.log("  ⚠ Violates Single Responsibility Principle");
console.log("  ⚠ Can make unit testing difficult");
console.log("  ⚠ Hidden dependencies (not explicit in constructor)");
console.log("  ⚠ Can become a global state anti-pattern");

console.log("\nAlternatives:");
console.log("  • Dependency Injection with singleton lifetime");
console.log("  • Module pattern (in JavaScript/TypeScript)");
console.log("  • Static class methods (if no state needed)");
```

```python
# Python - Singleton Pattern

from typing import Optional, Dict, Callable, Any
from threading import Lock
from datetime import datetime

# ============================================
# Basic Singleton
# ============================================

print("=== Basic Singleton ===\n")

class DatabaseConnection:
    _instance: Optional['DatabaseConnection'] = None
    
    def __new__(cls):
        if cls._instance is None:
            print("Creating first (and only) instance...")
            cls._instance = super().__new__(cls)
            cls._instance._initialize()
        else:
            print("Returning existing instance...")
        return cls._instance
    
    def _initialize(self):
        import random
        import string
        self.connection_id = ''.join(random.choices(string.ascii_lowercase, k=6))
        print(f"Database connection created: {self.connection_id}")
    
    def query(self, sql: str) -> list:
        print(f"[{self.connection_id}] Executing: {sql}")
        return []
    
    def get_connection_id(self) -> str:
        return self.connection_id

# Usage
db1 = DatabaseConnection()
db2 = DatabaseConnection()
db3 = DatabaseConnection()

print(f"\ndb1 ID: {db1.get_connection_id()}")
print(f"db2 ID: {db2.get_connection_id()}")
print(f"db3 ID: {db3.get_connection_id()}")
print(f"Same instance? {db1 is db2 and db2 is db3}")

db1.query("SELECT * FROM users")

# ============================================
# Thread-Safe Singleton with Metaclass
# ============================================

print("\n\n=== Thread-Safe Singleton (Metaclass) ===\n")

class SingletonMeta(type):
    _instances: Dict[type, Any] = {}
    _lock: Lock = Lock()
    
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            with cls._lock:
                if cls not in cls._instances:
                    instance = super().__call__(*args, **kwargs)
                    cls._instances[cls] = instance
        return cls._instances[cls]

class Logger(metaclass=SingletonMeta):
    def __init__(self):
        self._logs: list = []
        print("Logger instance created")
    
    def log(self, message: str) -> None:
        timestamp = datetime.now().isoformat()
        log_entry = f"[{timestamp}] {message}"
        self._logs.append(log_entry)
        print(log_entry)
    
    def error(self, message: str) -> None:
        self.log(f"ERROR: {message}")
    
    def get_logs(self) -> list:
        return self._logs.copy()
    
    def clear_logs(self) -> None:
        self._logs = []
        print("Logs cleared")

logger1 = Logger()
logger2 = Logger()

logger1.log("Application started")
logger2.log("User logged in")
logger1.error("Connection timeout")

print(f"\nTotal logs: {len(logger1.get_logs())}")
print(f"Same logger instance? {logger1 is logger2}")

# ============================================
# Real-World Example: Configuration Manager
# ============================================

print("\n\n=== Real-World: Configuration Manager ===\n")

class ConfigurationManager(metaclass=SingletonMeta):
    def __init__(self):
        self._config = {
            'api_url': 'https://api.example.com',
            'api_key': 'secret-key-12345',
            'timeout': 5000,
            'retries': 3,
            'environment': 'production'
        }
        print("Configuration loaded")
    
    def get(self, key: str) -> Any:
        return self._config.get(key)
    
    def set(self, key: str, value: Any) -> None:
        old_value = self._config.get(key)
        print(f"Updating {key}: {old_value} -> {value}")
        self._config[key] = value
    
    def get_all(self) -> dict:
        return self._config.copy()
    
    def is_production(self) -> bool:
        return self._config.get('environment') == 'production'

class ApiService:
    def __init__(self):
        self._config = ConfigurationManager()
    
    def make_request(self, endpoint: str) -> None:
        url = f"{self._config.get('api_url')}{endpoint}"
        timeout = self._config.get('timeout')
        print(f"\nAPI Request to: {url} (timeout: {timeout}ms)")

class AuthService:
    def __init__(self):
        self._config = ConfigurationManager()
    
    def authenticate(self) -> None:
        api_key = self._config.get('api_key')
        print(f"\nAuthenticating with API key: {api_key[:10]}...")

api_service = ApiService()
auth_service = AuthService()

api_service.make_request('/users')
auth_service.authenticate()

# Update configuration globally
config = ConfigurationManager()
config.set('timeout', 10000)

# All services see the updated value
api_service.make_request('/posts')

# ============================================
# Real-World Example: Application State
# ============================================

print("\n\n=== Real-World: Application State ===\n")

class ApplicationState(metaclass=SingletonMeta):
    def __init__(self):
        self._current_user: Optional[dict] = None
        self._is_authenticated: bool = False
        self._theme: str = 'light'
        self._listeners: Dict[str, list] = {}
        print("Application state initialized")
    
    def login(self, user: dict) -> None:
        self._current_user = user
        self._is_authenticated = True
        print(f"User logged in: {user['name']}")
        self._notify_listeners('login', user)
    
    def logout(self) -> None:
        user_name = self._current_user.get('name') if self._current_user else None
        self._current_user = None
        self._is_authenticated = False
        print(f"User logged out: {user_name}")
        self._notify_listeners('logout', None)
    
    def get_current_user(self) -> Optional[dict]:
        return self._current_user
    
    def is_user_authenticated(self) -> bool:
        return self._is_authenticated
    
    def set_theme(self, theme: str) -> None:
        self._theme = theme
        print(f"Theme changed to: {theme}")
        self._notify_listeners('themeChange', theme)
    
    def get_theme(self) -> str:
        return self._theme
    
    def subscribe(self, event: str, callback: Callable) -> None:
        if event not in self._listeners:
            self._listeners[event] = []
        self._listeners[event].append(callback)
    
    def _notify_listeners(self, event: str, data: Any) -> None:
        callbacks = self._listeners.get(event, [])
        for callback in callbacks:
            callback(data)

class Header:
    def __init__(self):
        self._state = ApplicationState()
        self._state.subscribe('login', lambda user: print(f"  [Header] Displaying user: {user['name']}"))
        self._state.subscribe('logout', lambda _: print(f"  [Header] Displaying login button"))
    
    def render(self) -> None:
        user = self._state.get_current_user()
        if user:
            print(f"Header: Welcome, {user['name']}!")
        else:
            print(f"Header: Please log in")

class Sidebar:
    def __init__(self):
        self._state = ApplicationState()
        self._state.subscribe('themeChange', lambda theme: print(f"  [Sidebar] Applying {theme} theme"))
    
    def render(self) -> None:
        theme = self._state.get_theme()
        print(f"Sidebar: Using {theme} theme")

# Usage
header = Header()
sidebar = Sidebar()

print("\n--- Initial State ---")
header.render()
sidebar.render()

print("\n--- After Login ---")
app_state = ApplicationState()
app_state.login({'id': '1', 'name': 'Alice Johnson', 'email': 'alice@example.com'})
header.render()

print("\n--- After Theme Change ---")
app_state.set_theme('dark')
sidebar.render()

print("\n--- After Logout ---")
app_state.logout()
header.render()

# ============================================
# Singleton with Decorator
# ============================================

print("\n\n=== Singleton with Decorator ===\n")

def singleton(cls):
    instances = {}
    
    def get_instance(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]
    
    return get_instance

@singleton
class Cache:
    def __init__(self):
        self._data = {}
        print("Cache created")
    
    def set(self, key: str, value: Any) -> None:
        self._data[key] = value
    
    def get(self, key: str) -> Any:
        return self._data.get(key)

cache1 = Cache()
cache2 = Cache()

cache1.set('user', 'Alice')
print(f"cache2.get('user'): {cache2.get('user')}")
print(f"Same instance? {cache1 is cache2}")

print("\n\n=== Singleton Pattern Summary ===")
print("\nWhen to use:")
print("  ✓ Need exactly one instance (config, logger, cache)")
print("  ✓ Global access point required")
print("  ✓ Instance should control access to shared resource")

print("\nBenefits:")
print("  ✓ Controlled access to single instance")
print("  ✓ Reduced memory footprint")
print("  ✓ Can be lazily initialized")

print("\nDrawbacks:")
print("  ⚠ Violates Single Responsibility Principle")
print("  ⚠ Can make unit testing difficult")
print("  ⚠ Hidden dependencies")
print("  ⚠ Can become a global state anti-pattern")
```

</details>

---

### B. Factory Method Pattern

**Intent**: Define an interface for creating an object, but let subclasses decide which class to instantiate. Factory Method lets a class defer instantiation to subclasses.

**Real-world analogy**: Think of a logistics company. A road logistics company creates trucks, a sea logistics company creates ships. The planning department doesn't need to know the details - it just calls "create transport" and gets the appropriate vehicle.

**When to use**:
- You don't know ahead of time the exact types of objects you need to create
- You want to provide a library of products and expose only interfaces, not implementations
- You want to delegate object creation to subclasses

**Pros**:
- Avoids tight coupling between creator and concrete products
- Single Responsibility Principle: object creation in one place
- Open/Closed Principle: can introduce new products without breaking existing code

**Cons**:
- Code can become more complicated (many subclasses)
- May require subclassing just to create objects

<details>
<summary><strong>View Factory Method Examples</strong></summary>

```typescript
// TypeScript - Factory Method Pattern

// ============================================
// Basic Factory Method
// ============================================

console.log("=== Basic Factory Method ===\n");

// Product interface
interface Transport {
  deliver(): void;
  getType(): string;
  getCapacity(): number;
}

// Concrete products
class Truck implements Transport {
  deliver(): void {
    console.log("🚚 Delivering by truck on roads");
  }

  getType(): string {
    return "Truck";
  }

  getCapacity(): number {
    return 100; // tons
  }
}

class Ship implements Transport {
  deliver(): void {
    console.log("🚢 Delivering by ship across seas");
  }

  getType(): string {
    return "Ship";
  }

  getCapacity(): number {
    return 1000; // tons
  }
}

class Airplane implements Transport {
  deliver(): void {
    console.log("✈️ Delivering by airplane through air");
  }

  getType(): string {
    return "Airplane";
  }

  getCapacity(): number {
    return 50; // tons
  }
}

// Creator (abstract class with factory method)
abstract class Logistics {
  // Factory method - subclasses override this
  abstract createTransport(): Transport;

  // Business logic that uses the factory method
  planDelivery(): void {
    const transport = this.createTransport();
    console.log(`\n--- Planning ${transport.getType()} Delivery ---`);
    console.log(`Capacity: ${transport.getCapacity()} tons`);
    transport.deliver();
  }
}

// Concrete creators
class RoadLogistics extends Logistics {
  createTransport(): Transport {
    console.log("Creating truck transport...");
    return new Truck();
  }
}

class SeaLogistics extends Logistics {
  createTransport(): Transport {
    console.log("Creating ship transport...");
    return new Ship();
  }
}

class AirLogistics extends Logistics {
  createTransport(): Transport {
    console.log("Creating airplane transport...");
    return new Airplane();
  }
}

// Client code
function clientCode(logistics: Logistics) {
  logistics.planDelivery();
}

clientCode(new RoadLogistics());
clientCode(new SeaLogistics());
clientCode(new AirLogistics());

// ============================================
// Real-World Example: Document Generator
// ============================================

console.log("\n\n=== Real-World: Document Generator ===\n");

// Product interface
interface Document {
  open(): void;
  save(filename: string): void;
  close(): void;
  getFormat(): string;
  getContent(): string;
}

// Concrete products
class PDFDocument implements Document {
  private content: string = "";

  open(): void {
    console.log("📄 Opening PDF document");
    this.content = "PDF Content";
  }

  save(filename: string): void {
    console.log(`💾 Saving PDF as ${filename}.pdf`);
  }

  close(): void {
    console.log("Closing PDF document");
  }

  getFormat(): string {
    return "PDF";
  }

  getContent(): string {
    return this.content;
  }
}

class WordDocument implements Document {
  private content: string = "";

  open(): void {
    console.log("📝 Opening Word document");
    this.content = "Word Content";
  }

  save(filename: string): void {
    console.log(`💾 Saving Word document as ${filename}.docx`);
  }

  close(): void {
    console.log("Closing Word document");
  }

  getFormat(): string {
    return "DOCX";
  }

  getContent(): string {
    return this.content;
  }
}

class HTMLDocument implements Document {
  private content: string = "";

  open(): void {
    console.log("🌐 Opening HTML document");
    this.content = "<html><body>HTML Content</body></html>";
  }

  save(filename: string): void {
    console.log(`💾 Saving HTML as ${filename}.html`);
  }

  close(): void {
    console.log("Closing HTML document");
  }

  getFormat(): string {
    return "HTML";
  }

  getContent(): string {
    return this.content;
  }
}

// Creator
abstract class DocumentCreator {
  abstract createDocument(): Document;

  // Template method using factory method
  processDocument(title: string, content: string): void {
    const doc = this.createDocument();
    
    console.log(`\n=== Processing ${doc.getFormat()} Document ===`);
    doc.open();
    console.log(`Writing content: "${content}"`);
    doc.save(title);
    doc.close();
  }
}

// Concrete creators
class PDFCreator extends DocumentCreator {
  createDocument(): Document {
    return new PDFDocument();
  }
}

class WordCreator extends DocumentCreator {
  createDocument(): Document {
    return new WordDocument();
  }
}

class HTMLCreator extends DocumentCreator {
  createDocument(): Document {
    return new HTMLDocument();
  }
}

// Usage
const pdfCreator = new PDFCreator();
pdfCreator.processDocument("report", "Q4 Financial Report");

const wordCreator = new WordCreator();
wordCreator.processDocument("letter", "Business Proposal");

const htmlCreator = new HTMLCreator();
htmlCreator.processDocument("webpage", "Landing Page");

// ============================================
// Real-World Example: Payment Processing
// ============================================

console.log("\n\n=== Real-World: Payment Processing ===\n");

// Product interface
interface PaymentProcessor {
  processPayment(amount: number, currency: string): boolean;
  refund(transactionId: string, amount: number): boolean;
  getProviderName(): string;
  getFee(amount: number): number;
}

// Concrete products
class StripeProcessor implements PaymentProcessor {
  processPayment(amount: number, currency: string): boolean {
    console.log(`💳 Stripe: Processing ${currency}${amount}`);
    console.log("   Connecting to Stripe API...");
    console.log("   Payment successful");
    return true;
  }

  refund(transactionId: string, amount: number): boolean {
    console.log(`💳 Stripe: Refunding ${amount} (Transaction: ${transactionId})`);
    return true;
  }

  getProviderName(): string {
    return "Stripe";
  }

  getFee(amount: number): number {
    return amount * 0.029 + 0.30; // 2.9% + $0.30
  }
}

class PayPalProcessor implements PaymentProcessor {
  processPayment(amount: number, currency: string): boolean {
    console.log(`💰 PayPal: Processing ${currency}${amount}`);
    console.log("   Redirecting to PayPal...");
    console.log("   Payment successful");
    return true;
  }

  refund(transactionId: string, amount: number): boolean {
    console.log(`💰 PayPal: Refunding ${amount} (Transaction: ${transactionId})`);
    return true;
  }

  getProviderName(): string {
    return "PayPal";
  }

  getFee(amount: number): number {
    return amount * 0.034 + 0.30; // 3.4% + $0.30
  }
}

class CryptoProcessor implements PaymentProcessor {
  processPayment(amount: number, currency: string): boolean {
    console.log(`₿ Crypto: Processing ${currency}${amount}`);
    console.log("   Generating wallet address...");
    console.log("   Waiting for blockchain confirmation...");
    console.log("   Payment successful");
    return true;
  }

  refund(transactionId: string, amount: number): boolean {
    console.log(`₿ Crypto: Refunding ${amount} (Transaction: ${transactionId})`);
    console.log("   Note: Blockchain transactions are irreversible");
    return false;
  }

  getProviderName(): string {
    return "Cryptocurrency";
  }

  getFee(amount: number): number {
    return 2.00; // Flat fee
  }
}

// Creator
abstract class PaymentGateway {
  abstract createProcessor(): PaymentProcessor;

  // Business logic using factory method
  checkout(amount: number, currency: string = "$"): boolean {
    const processor = this.createProcessor();
    
    console.log(`\n--- Checkout with ${processor.getProviderName()} ---`);
    const fee = processor.getFee(amount);
    const total = amount + fee;
    
    console.log(`Amount: ${currency}${amount}`);
    console.log(`Fee: ${currency}${fee.toFixed(2)}`);
    console.log(`Total: ${currency}${total.toFixed(2)}`);
    
    return processor.processPayment(total, currency);
  }
}

// Concrete creators
class StripeGateway extends PaymentGateway {
  createProcessor(): PaymentProcessor {
    return new StripeProcessor();
  }
}

class PayPalGateway extends PaymentGateway {
  createProcessor(): PaymentProcessor {
    return new PayPalProcessor();
  }
}

class CryptoGateway extends PaymentGateway {
  createProcessor(): PaymentProcessor {
    return new CryptoProcessor();
  }
}

// Usage - easy to switch payment providers
const stripeGateway = new StripeGateway();
stripeGateway.checkout(100);

const paypalGateway = new PayPalGateway();
paypalGateway.checkout(100);

const cryptoGateway = new CryptoGateway();
cryptoGateway.checkout(100);

// ============================================
// Advanced: Parameterized Factory Method
// ============================================

console.log("\n\n=== Parameterized Factory Method ===\n");

interface Notification {
  send(recipient: string, message: string): void;
  getChannel(): string;
}

class EmailNotification implements Notification {
  send(recipient: string, message: string): void {
    console.log(`📧 Email to ${recipient}: ${message}`);
  }

  getChannel(): string {
    return "Email";
  }
}

class SMSNotification implements Notification {
  send(recipient: string, message: string): void {
    console.log(`📱 SMS to ${recipient}: ${message}`);
  }

  getChannel(): string {
    return "SMS";
  }
}

class PushNotification implements Notification {
  send(recipient: string, message: string): void {
    console.log(`🔔 Push to ${recipient}: ${message}`);
  }

  getChannel(): string {
    return "Push";
  }
}

// Parameterized factory method
class NotificationFactory {
  // Static factory method with parameter
  static createNotification(type: string): Notification {
    switch (type.toLowerCase()) {
      case 'email':
        return new EmailNotification();
      case 'sms':
        return new SMSNotification();
      case 'push':
        return new PushNotification();
      default:
        throw new Error(`Unknown notification type: ${type}`);
    }
  }

  // Can also determine type based on logic
  static createNotificationForUser(userPreference: string, isUrgent: boolean): Notification {
    if (isUrgent) {
      return new SMSNotification(); // Urgent messages via SMS
    }
    
    switch (userPreference) {
      case 'email':
        return new EmailNotification();
      case 'push':
        return new PushNotification();
      default:
        return new EmailNotification(); // Default to email
    }
  }
}

// Usage
const email = NotificationFactory.createNotification('email');
email.send('user@example.com', 'Welcome to our service!');

const sms = NotificationFactory.createNotification('sms');
sms.send('+1234567890', 'Your code is 1234');

// Smart factory based on context
const urgentNotif = NotificationFactory.createNotificationForUser('email', true);
urgentNotif.send('+9876543210', 'Security alert!');

const normalNotif = NotificationFactory.createNotificationForUser('push', false);
normalNotif.send('device_token_123', 'You have a new message');

// ============================================
// Factory Method with Dependency Injection
// ============================================

console.log("\n\n=== Factory Method with DI ===\n");

interface Logger {
  log(message: string): void;
}

class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(`[LOG] ${message}`);
  }
}

interface Database {
  connect(): void;
  query(sql: string): any[];
}

class MySQLDatabase implements Database {
  constructor(private logger: Logger) {}

  connect(): void {
    this.logger.log("Connected to MySQL");
  }

  query(sql: string): any[] {
    this.logger.log(`Executing: ${sql}`);
    return [];
  }
}

class PostgresDatabase implements Database {
  constructor(private logger: Logger) {}

  connect(): void {
    this.logger.log("Connected to PostgreSQL");
  }

  query(sql: string): any[] {
    this.logger.log(`Executing: ${sql}`);
    return [];
  }
}

// Factory with dependencies
abstract class DatabaseFactory {
  constructor(protected logger: Logger) {}

  abstract createDatabase(): Database;

  getConnection(): Database {
    const db = this.createDatabase();
    db.connect();
    return db;
  }
}

class MySQLFactory extends DatabaseFactory {
  createDatabase(): Database {
    return new MySQLDatabase(this.logger);
  }
}

class PostgresFactory extends DatabaseFactory {
  createDatabase(): Database {
    return new PostgresDatabase(this.logger);
  }
}

// Usage
const logger = new ConsoleLogger();

const mysqlFactory = new MySQLFactory(logger);
const mysqlDb = mysqlFactory.getConnection();
mysqlDb.query("SELECT * FROM users");

const postgresFactory = new PostgresFactory(logger);
const postgresDb = postgresFactory.getConnection();
postgresDb.query("SELECT * FROM products");

// ============================================
// Key Takeaways
// ============================================

console.log("\n\n=== Factory Method Summary ===");
console.log("\nWhen to use:");
console.log("  ✓ Don't know exact types of objects needed");
console.log("  ✓ Want to provide library/framework with extension points");
console.log("  ✓ Want to delegate instantiation to subclasses");
console.log("  ✓ Need to save system resources by reusing objects");

console.log("\nBenefits:");
console.log("  ✓ Avoids tight coupling between creator and products");
console.log("  ✓ Single Responsibility (creation logic separate)");
console.log("  ✓ Open/Closed (add new products without modifying code)");

console.log("\nDrawbacks:");
console.log("  ⚠ Can introduce many subclasses");
console.log("  ⚠ May be overkill for simple object creation");

console.log("\nRelated Patterns:");
console.log("  • Abstract Factory (factory of factories)");
console.log("  • Prototype (create by cloning)");
console.log("  • Builder (construct complex objects step by step)");
```

```python
# Python - Factory Method Pattern

from abc import ABC, abstractmethod

# ============================================
# Basic Factory Method
# ============================================

print("=== Basic Factory Method ===\n")

# Product interface
class Transport(ABC):
    @abstractmethod
    def deliver(self) -> None:
        pass
    
    @abstractmethod
    def get_type(self) -> str:
        pass
    
    @abstractmethod
    def get_capacity(self) -> int:
        pass

# Concrete products
class Truck(Transport):
    def deliver(self) -> None:
        print("🚚 Delivering by truck on roads")
    
    def get_type(self) -> str:
        return "Truck"
    
    def get_capacity(self) -> int:
        return 100  # tons

class Ship(Transport):
    def deliver(self) -> None:
        print("🚢 Delivering by ship across seas")
    
    def get_type(self) -> str:
        return "Ship"
    
    def get_capacity(self) -> int:
        return 1000  # tons

class Airplane(Transport):
    def deliver(self) -> None:
        print("✈️ Delivering by airplane through air")
    
    def get_type(self) -> str:
        return "Airplane"
    
    def get_capacity(self) -> int:
        return 50  # tons

# Creator
class Logistics(ABC):
    @abstractmethod
    def create_transport(self) -> Transport:
        """Factory method - subclasses override this"""
        pass
    
    def plan_delivery(self) -> None:
        """Business logic using factory method"""
        transport = self.create_transport()
        print(f"\n--- Planning {transport.get_type()} Delivery ---")
        print(f"Capacity: {transport.get_capacity()} tons")
        transport.deliver()

# Concrete creators
class RoadLogistics(Logistics):
    def create_transport(self) -> Transport:
        print("Creating truck transport...")
        return Truck()

class SeaLogistics(Logistics):
    def create_transport(self) -> Transport:
        print("Creating ship transport...")
        return Ship()

class AirLogistics(Logistics):
    def create_transport(self) -> Transport:
        print("Creating airplane transport...")
        return Airplane()

# Client code
def client_code(logistics: Logistics):
    logistics.plan_delivery()

client_code(RoadLogistics())
client_code(SeaLogistics())
client_code(AirLogistics())

# ============================================
# Real-World Example: Document Generator
# ============================================

print("\n\n=== Real-World: Document Generator ===\n")

class Document(ABC):
    @abstractmethod
    def open(self) -> None:
        pass
    
    @abstractmethod
    def save(self, filename: str) -> None:
        pass
    
    @abstractmethod
    def close(self) -> None:
        pass
    
    @abstractmethod
    def get_format(self) -> str:
        pass

class PDFDocument(Document):
    def __init__(self):
        self._content = ""
    
    def open(self) -> None:
        print("📄 Opening PDF document")
        self._content = "PDF Content"
    
    def save(self, filename: str) -> None:
        print(f"💾 Saving PDF as {filename}.pdf")
    
    def close(self) -> None:
        print("Closing PDF document")
    
    def get_format(self) -> str:
        return "PDF"

class WordDocument(Document):
    def __init__(self):
        self._content = ""
    
    def open(self) -> None:
        print("📝 Opening Word document")
        self._content = "Word Content"
    
    def save(self, filename: str) -> None:
        print(f"💾 Saving Word document as {filename}.docx")
    
    def close(self) -> None:
        print("Closing Word document")
    
    def get_format(self) -> str:
        return "DOCX"

class HTMLDocument(Document):
    def __init__(self):
        self._content = ""
    
    def open(self) -> None:
        print("🌐 Opening HTML document")
        self._content = "<html><body>HTML Content</body></html>"
    
    def save(self, filename: str) -> None:
        print(f"💾 Saving HTML as {filename}.html")
    
    def close(self) -> None:
        print("Closing HTML document")
    
    def get_format(self) -> str:
        return "HTML"

# Creator
class DocumentCreator(ABC):
    @abstractmethod
    def create_document(self) -> Document:
        pass
    
    def process_document(self, title: str, content: str) -> None:
        doc = self.create_document()
        
        print(f"\n=== Processing {doc.get_format()} Document ===")
        doc.open()
        print(f'Writing content: "{content}"')
        doc.save(title)
        doc.close()

# Concrete creators
class PDFCreator(DocumentCreator):
    def create_document(self) -> Document:
        return PDFDocument()

class WordCreator(DocumentCreator):
    def create_document(self) -> Document:
        return WordDocument()

class HTMLCreator(DocumentCreator):
    def create_document(self) -> Document:
        return HTMLDocument()

# Usage
pdf_creator = PDFCreator()
pdf_creator.process_document("report", "Q4 Financial Report")

word_creator = WordCreator()
word_creator.process_document("letter", "Business Proposal")

html_creator = HTMLCreator()
html_creator.process_document("webpage", "Landing Page")

# ============================================
# Parameterized Factory Method
# ============================================

print("\n\n=== Parameterized Factory Method ===\n")

class Notification(ABC):
    @abstractmethod
    def send(self, recipient: str, message: str) -> None:
        pass
    
    @abstractmethod
    def get_channel(self) -> str:
        pass

class EmailNotification(Notification):
    def send(self, recipient: str, message: str) -> None:
        print(f"📧 Email to {recipient}: {message}")
    
    def get_channel(self) -> str:
        return "Email"

class SMSNotification(Notification):
    def send(self, recipient: str, message: str) -> None:
        print(f"📱 SMS to {recipient}: {message}")
    
    def get_channel(self) -> str:
        return "SMS"

class PushNotification(Notification):
    def send(self, recipient: str, message: str) -> None:
        print(f"🔔 Push to {recipient}: {message}")
    
    def get_channel(self) -> str:
        return "Push"

class NotificationFactory:
    @staticmethod
    def create_notification(notif_type: str) -> Notification:
        notif_type = notif_type.lower()
        if notif_type == 'email':
            return EmailNotification()
        elif notif_type == 'sms':
            return SMSNotification()
        elif notif_type == 'push':
            return PushNotification()
        else:
            raise ValueError(f"Unknown notification type: {notif_type}")
    
    @staticmethod
    def create_notification_for_user(user_preference: str, is_urgent: bool) -> Notification:
        if is_urgent:
            return SMSNotification()
        
        if user_preference == 'email':
            return EmailNotification()
        elif user_preference == 'push':
            return PushNotification()
        else:
            return EmailNotification()

# Usage
email = NotificationFactory.create_notification('email')
email.send('user@example.com', 'Welcome to our service!')

sms = NotificationFactory.create_notification('sms')
sms.send('+1234567890', 'Your code is 1234')

urgent_notif = NotificationFactory.create_notification_for_user('email', True)
urgent_notif.send('+9876543210', 'Security alert!')

print("\n\n=== Factory Method Summary ===")
print("\nWhen to use:")
print("  ✓ Don't know exact types of objects needed")
print("  ✓ Want to provide library/framework with extension points")
print("  ✓ Want to delegate instantiation to subclasses")

print("\nBenefits:")
print("  ✓ Avoids tight coupling between creator and products")
print("  ✓ Single Responsibility (creation logic separate)")
print("  ✓ Open/Closed (add new products without modifying code)")

print("\nDrawbacks:")
print("  ⚠ Can introduce many subclasses")
print("  ⚠ May be overkill for simple object creation")
```

</details>

---

### C. Abstract Factory Pattern

**Intent**: Provide an interface for creating families of related or dependent objects without specifying their concrete classes.

**Real-world analogy**: Think of a furniture store. When you buy a "Modern" set, you get a modern chair, modern table, and modern sofa that all match. When you buy a "Victorian" set, you get Victorian-style furniture that matches. The factory ensures all pieces belong to the same family.

**When to use**:
- System should be independent of how products are created
- System needs to work with multiple families of related products
- Family of related products is designed to be used together
- You want to provide a class library and reveal only interfaces, not implementations

**Pros**:
- Ensures products from a family are compatible
- Isolates concrete classes
- Easy to exchange product families
- Promotes consistency among products

**Cons**:
- Difficult to support new kinds of products (requires changing interface)
- Can increase complexity significantly

<details>
<summary><strong>View Abstract Factory Examples</strong></summary>

```typescript
// TypeScript - Abstract Factory Pattern

// ============================================
// Abstract Factory - UI Component Example
// ============================================

console.log("=== Abstract Factory: UI Components ===\n");

// Abstract products
interface Button {
  render(): void;
  onClick(callback: () => void): void;
}

interface Checkbox {
  render(): void;
  toggle(): void;
}

interface Input {
  render(): void;
  setValue(value: string): void;
}

// Concrete products - Windows style
class WindowsButton implements Button {
  render(): void {
    console.log("🪟 Rendering Windows-style button");
  }

  onClick(callback: () => void): void {
    console.log("   Windows button clicked");
    callback();
  }
}

class WindowsCheckbox implements Checkbox {
  private checked: boolean = false;

  render(): void {
    console.log("🪟 Rendering Windows-style checkbox");
  }

  toggle(): void {
    this.checked = !this.checked;
    console.log(`   Windows checkbox: ${this.checked ? '☑' : '☐'}`);
  }
}

class WindowsInput implements Input {
  private value: string = "";

  render(): void {
    console.log("🪟 Rendering Windows-style input field");
  }

  setValue(value: string): void {
    this.value = value;
    console.log(`   Windows input value: "${value}"`);
  }
}

// Concrete products - MacOS style
class MacOSButton implements Button {
  render(): void {
    console.log("🍎 Rendering MacOS-style button");
  }

  onClick(callback: () => void): void {
    console.log("   MacOS button clicked");
    callback();
  }
}

class MacOSCheckbox implements Checkbox {
  private checked: boolean = false;

  render(): void {
    console.log("🍎 Rendering MacOS-style checkbox");
  }

  toggle(): void {
    this.checked = !this.checked;
    console.log(`   MacOS checkbox: ${this.checked ? '✓' : '○'}`);
  }
}

class MacOSInput implements Input {
  private value: string = "";

  render(): void {
    console.log("🍎 Rendering MacOS-style input field");
  }

  setValue(value: string): void {
    this.value = value;
    console.log(`   MacOS input value: "${value}"`);
  }
}

// Concrete products - Linux style
class LinuxButton implements Button {
  render(): void {
    console.log("🐧 Rendering Linux-style button");
  }

  onClick(callback: () => void): void {
    console.log("   Linux button clicked");
    callback();
  }
}

class LinuxCheckbox implements Checkbox {
  private checked: boolean = false;

  render(): void {
    console.log("🐧 Rendering Linux-style checkbox");
  }

  toggle(): void {
    this.checked = !this.checked;
    console.log(`   Linux checkbox: ${this.checked ? '[X]' : '[ ]'}`);
  }
}

class LinuxInput implements Input {
  private value: string = "";

  render(): void {
    console.log("🐧 Rendering Linux-style input field");
  }

  setValue(value: string): void {
    this.value = value;
    console.log(`   Linux input value: "${value}"`);
  }
}

// Abstract Factory
interface GUIFactory {
  createButton(): Button;
  createCheckbox(): Checkbox;
  createInput(): Input;
}

// Concrete Factories
class WindowsFactory implements GUIFactory {
  createButton(): Button {
    return new WindowsButton();
  }

  createCheckbox(): Checkbox {
    return new WindowsCheckbox();
  }

  createInput(): Input {
    return new WindowsInput();
  }
}

class MacOSFactory implements GUIFactory {
  createButton(): Button {
    return new MacOSButton();
  }

  createCheckbox(): Checkbox {
    return new MacOSCheckbox();
  }

  createInput(): Input {
    return new MacOSInput();
  }
}

class LinuxFactory implements GUIFactory {
  createButton(): Button {
    return new LinuxButton();
  }

  createCheckbox(): Checkbox {
    return new LinuxCheckbox();
  }

  createInput(): Input {
    return new LinuxInput();
  }
}

// Client code that works with abstract factory
class Application {
  private button: Button;
  private checkbox: Checkbox;
  private input: Input;

  constructor(factory: GUIFactory) {
    this.button = factory.createButton();
    this.checkbox = factory.createCheckbox();
    this.input = factory.createInput();
  }

  renderUI(): void {
    console.log("\n--- Rendering Application UI ---");
    this.button.render();
    this.checkbox.render();
    this.input.render();
  }

  interact(): void {
    console.log("\n--- User Interactions ---");
    this.button.onClick(() => console.log("      Button action executed!"));
    this.checkbox.toggle();
    this.input.setValue("Hello World");
  }
}

// Usage - factory determined at runtime
function getFactory(os: string): GUIFactory {
  switch (os.toLowerCase()) {
    case 'windows':
      return new WindowsFactory();
    case 'macos':
      return new MacOSFactory();
    case 'linux':
      return new LinuxFactory();
    default:
      throw new Error(`Unknown OS: ${os}`);
  }
}

const os = 'windows'; // Could come from environment detection
const factory = getFactory(os);
const app = new Application(factory);

app.renderUI();
app.interact();

// Easy to switch to different OS
console.log("\n\n=== Switching to MacOS ===");
const macApp = new Application(new MacOSFactory());
macApp.renderUI();
macApp.interact();

console.log("\n\n=== Switching to Linux ===");
const linuxApp = new Application(new LinuxFactory());
linuxApp.renderUI();
linuxApp.interact();

// ============================================
// Real-World Example: Cloud Infrastructure
// ============================================

console.log("\n\n=== Real-World: Cloud Infrastructure ===\n");

// Abstract products
interface VirtualMachine {
  start(): void;
  stop(): void;
  getType(): string;
}

interface Storage {
  upload(file: string): void;
  download(file: string): void;
  getType(): string;
}

interface Database {
  connect(): void;
  query(sql: string): any[];
  getType(): string;
}

// AWS Products
class EC2Instance implements VirtualMachine {
  start(): void {
    console.log("☁️ Starting EC2 instance");
  }

  stop(): void {
    console.log("☁️ Stopping EC2 instance");
  }

  getType(): string {
    return "AWS EC2";
  }
}

class S3Storage implements Storage {
  upload(file: string): void {
    console.log(`☁️ Uploading ${file} to S3 bucket`);
  }

  download(file: string): void {
    console.log(`☁️ Downloading ${file} from S3`);
  }

  getType(): string {
    return "AWS S3";
  }
}

class RDSDatabase implements Database {
  connect(): void {
    console.log("☁️ Connecting to RDS database");
  }

  query(sql: string): any[] {
    console.log(`☁️ RDS Query: ${sql}`);
    return [];
  }

  getType(): string {
    return "AWS RDS";
  }
}

// Azure Products
class AzureVM implements VirtualMachine {
  start(): void {
    console.log("☁️ Starting Azure Virtual Machine");
  }

  stop(): void {
    console.log("☁️ Stopping Azure Virtual Machine");
  }

  getType(): string {
    return "Azure VM";
  }
}

class BlobStorage implements Storage {
  upload(file: string): void {
    console.log(`☁️ Uploading ${file} to Azure Blob Storage`);
  }

  download(file: string): void {
    console.log(`☁️ Downloading ${file} from Blob Storage`);
  }

  getType(): string {
    return "Azure Blob";
  }
}

class SQLDatabase implements Database {
  connect(): void {
    console.log("☁️ Connecting to Azure SQL Database");
  }

  query(sql: string): any[] {
    console.log(`☁️ Azure SQL Query: ${sql}`);
    return [];
  }

  getType(): string {
    return "Azure SQL";
  }
}

// GCP Products
class ComputeEngine implements VirtualMachine {
  start(): void {
    console.log("☁️ Starting Google Compute Engine instance");
  }

  stop(): void {
    console.log("☁️ Stopping Compute Engine instance");
  }

  getType(): string {
    return "Google Compute Engine";
  }
}

class CloudStorage implements Storage {
  upload(file: string): void {
    console.log(`☁️ Uploading ${file} to Google Cloud Storage`);
  }

  download(file: string): void {
    console.log(`☁️ Downloading ${file} from Cloud Storage`);
  }

  getType(): string {
    return "Google Cloud Storage";
  }
}

class CloudSQL implements Database {
  connect(): void {
    console.log("☁️ Connecting to Google Cloud SQL");
  }

  query(sql: string): any[] {
    console.log(`☁️ Cloud SQL Query: ${sql}`);
    return [];
  }

  getType(): string {
    return "Google Cloud SQL";
  }
}

// Abstract Factory
interface CloudProvider {
  createVM(): VirtualMachine;
  createStorage(): Storage;
  createDatabase(): Database;
}

// Concrete Factories
class AWSProvider implements CloudProvider {
  createVM(): VirtualMachine {
    return new EC2Instance();
  }

  createStorage(): Storage {
    return new S3Storage();
  }

  createDatabase(): Database {
    return new RDSDatabase();
  }
}

class AzureProvider implements CloudProvider {
  createVM(): VirtualMachine {
    return new AzureVM();
  }

  createStorage(): Storage {
    return new BlobStorage();
  }

  createDatabase(): Database {
    return new SQLDatabase();
  }
}

class GCPProvider implements CloudProvider {
  createVM(): VirtualMachine {
    return new ComputeEngine();
  }

  createStorage(): Storage {
    return new CloudStorage();
  }

  createDatabase(): Database {
    return new CloudSQL();
  }
}

// Client code
class CloudApplication {
  private vm: VirtualMachine;
  private storage: Storage;
  private database: Database;

  constructor(provider: CloudProvider) {
    console.log("\n--- Provisioning Cloud Resources ---");
    this.vm = provider.createVM();
    this.storage = provider.createStorage();
    this.database = provider.createDatabase();
  }

  deploy(): void {
    console.log("\n--- Deploying Application ---");
    this.vm.start();
    this.storage.upload("app.zip");
    this.database.connect();
    this.database.query("CREATE TABLE users");
    console.log("✓ Application deployed successfully");
  }

  getInfrastructure(): string {
    return `VM: ${this.vm.getType()}, Storage: ${this.storage.getType()}, DB: ${this.database.getType()}`;
  }
}

// Deploy to different cloud providers
console.log("=== Deploying to AWS ===");
const awsApp = new CloudApplication(new AWSProvider());
awsApp.deploy();
console.log(`Infrastructure: ${awsApp.getInfrastructure()}`);

console.log("\n\n=== Deploying to Azure ===");
const azureApp = new CloudApplication(new AzureProvider());
azureApp.deploy();
console.log(`Infrastructure: ${azureApp.getInfrastructure()}`);

console.log("\n\n=== Deploying to GCP ===");
const gcpApp = new CloudApplication(new GCPProvider());
gcpApp.deploy();
console.log(`Infrastructure: ${gcpApp.getInfrastructure()}`);

// ============================================
// Abstract Factory with Configuration
// ============================================

console.log("\n\n=== Abstract Factory with Configuration ===\n");

interface Theme {
  primaryColor: string;
  secondaryColor: string;
  fontSize: number;
}

interface Icon {
  render(): void;
}

interface Font {
  apply(text: string): string;
}

// Light theme products
class LightTheme implements Theme {
  primaryColor = "#FFFFFF";
  secondaryColor = "#000000";
  fontSize = 16;
}

class LightIcon implements Icon {
  render(): void {
    console.log("☀️ Rendering light theme icon");
  }
}

class LightFont implements Font {
  apply(text: string): string {
    return `<span style="color: #000">${text}</span>`;
  }
}

// Dark theme products
class DarkTheme implements Theme {
  primaryColor = "#1E1E1E";
  secondaryColor = "#FFFFFF";
  fontSize = 16;
}

class DarkIcon implements Icon {
  render(): void {
    console.log("🌙 Rendering dark theme icon");
  }
}

class DarkFont implements Font {
  apply(text: string): string {
    return `<span style="color: #FFF">${text}</span>`;
  }
}

// Abstract factory
interface ThemeFactory {
  createTheme(): Theme;
  createIcon(): Icon;
  createFont(): Font;
}

class LightThemeFactory implements ThemeFactory {
  createTheme(): Theme {
    return new LightTheme();
  }

  createIcon(): Icon {
    return new LightIcon();
  }

  createFont(): Font {
    return new LightFont();
  }
}

class DarkThemeFactory implements ThemeFactory {
  createTheme(): Theme {
    return new DarkTheme();
  }

  createIcon(): Icon {
    return new DarkIcon();
  }

  createFont(): Font {
    return new DarkFont();
  }
}

class ThemedUI {
  constructor(private factory: ThemeFactory) {}

  render(text: string): void {
    const theme = this.factory.createTheme();
    const icon = this.factory.createIcon();
    const font = this.factory.createFont();

    console.log(`\nTheme: Primary=${theme.primaryColor}, Secondary=${theme.secondaryColor}`);
    icon.render();
    console.log(`Styled text: ${font.apply(text)}`);
  }
}

const lightUI = new ThemedUI(new LightThemeFactory());
lightUI.render("Hello Light Mode");

const darkUI = new ThemedUI(new DarkThemeFactory());
darkUI.render("Hello Dark Mode");

// ============================================
// Key Takeaways
// ============================================

console.log("\n\n=== Abstract Factory Summary ===");
console.log("\nWhen to use:");
console.log("  ✓ System needs to work with multiple families of products");
console.log("  ✓ Products in a family must be used together");
console.log("  ✓ Want to provide product library without exposing implementations");
console.log("  ✓ Need to enforce consistency among related products");

console.log("\nBenefits:");
console.log("  ✓ Ensures product compatibility within families");
console.log("  ✓ Isolates concrete classes from client");
console.log("  ✓ Easy to exchange product families");
console.log("  ✓ Promotes consistency");

console.log("\nDrawbacks:");
console.log("  ⚠ Hard to add new product types (must change interface)");
console.log("  ⚠ Can significantly increase complexity");
console.log("  ⚠ More classes and interfaces to manage");

console.log("\nDifference from Factory Method:");
console.log("  • Factory Method: Creates ONE product");
console.log("  • Abstract Factory: Creates FAMILIES of related products");
```

```python
# Python - Abstract Factory Pattern

from abc import ABC, abstractmethod

# ============================================
# Abstract Factory - UI Component Example
# ============================================

print("=== Abstract Factory: UI Components ===\n")

# Abstract products
class Button(ABC):
    @abstractmethod
    def render(self) -> None:
        pass
    
    @abstractmethod
    def on_click(self, callback) -> None:
        pass

class Checkbox(ABC):
    @abstractmethod
    def render(self) -> None:
        pass
    
    @abstractmethod
    def toggle(self) -> None:
        pass

class Input(ABC):
    @abstractmethod
    def render(self) -> None:
        pass
    
    @abstractmethod
    def set_value(self, value: str) -> None:
        pass

# Windows products
class WindowsButton(Button):
    def render(self) -> None:
        print("🪟 Rendering Windows-style button")
    
    def on_click(self, callback) -> None:
        print("   Windows button clicked")
        callback()

class WindowsCheckbox(Checkbox):
    def __init__(self):
        self._checked = False
    
    def render(self) -> None:
        print("🪟 Rendering Windows-style checkbox")
    
    def toggle(self) -> None:
        self._checked = not self._checked
        print(f"   Windows checkbox: {'☑' if self._checked else '☐'}")

class WindowsInput(Input):
    def __init__(self):
        self._value = ""
    
    def render(self) -> None:
        print("🪟 Rendering Windows-style input field")
    
    def set_value(self, value: str) -> None:
        self._value = value
        print(f'   Windows input value: "{value}"')

# MacOS products
class MacOSButton(Button):
    def render(self) -> None:
        print("🍎 Rendering MacOS-style button")
    
    def on_click(self, callback) -> None:
        print("   MacOS button clicked")
        callback()

class MacOSCheckbox(Checkbox):
    def __init__(self):
        self._checked = False
    
    def render(self) -> None:
        print("🍎 Rendering MacOS-style checkbox")
    
    def toggle(self) -> None:
        self._checked = not self._checked
        print(f"   MacOS checkbox: {'✓' if self._checked else '○'}")

class MacOSInput(Input):
    def __init__(self):
        self._value = ""
    
    def render(self) -> None:
        print("🍎 Rendering MacOS-style input field")
    
    def set_value(self, value: str) -> None:
        self._value = value
        print(f'   MacOS input value: "{value}"')

# Linux products
class LinuxButton(Button):
    def render(self) -> None:
        print("🐧 Rendering Linux-style button")
    
    def on_click(self, callback) -> None:
        print("   Linux button clicked")
        callback()

class LinuxCheckbox(Checkbox):
    def __init__(self):
        self._checked = False
    
    def render(self) -> None:
        print("🐧 Rendering Linux-style checkbox")
    
    def toggle(self) -> None:
        self._checked = not self._checked
        print(f"   Linux checkbox: {'[X]' if self._checked else '[ ]'}")

class LinuxInput(Input):
    def __init__(self):
        self._value = ""
    
    def render(self) -> None:
        print("🐧 Rendering Linux-style input field")
    
    def set_value(self, value: str) -> None:
        self._value = value
        print(f'   Linux input value: "{value}"')

# Abstract Factory
class GUIFactory(ABC):
    @abstractmethod
    def create_button(self) -> Button:
        pass
    
    @abstractmethod
    def create_checkbox(self) -> Checkbox:
        pass
    
    @abstractmethod
    def create_input(self) -> Input:
        pass

# Concrete Factories
class WindowsFactory(GUIFactory):
    def create_button(self) -> Button:
        return WindowsButton()
    
    def create_checkbox(self) -> Checkbox:
        return WindowsCheckbox()
    
    def create_input(self) -> Input:
        return WindowsInput()

class MacOSFactory(GUIFactory):
    def create_button(self) -> Button:
        return MacOSButton()
    
    def create_checkbox(self) -> Checkbox:
        return MacOSCheckbox()
    
    def create_input(self) -> Input:
        return MacOSInput()

class LinuxFactory(GUIFactory):
    def create_button(self) -> Button:
        return LinuxButton()
    
    def create_checkbox(self) -> Checkbox:
        return LinuxCheckbox()
    
    def create_input(self) -> Input:
        return LinuxInput()

# Client code
class Application:
    def __init__(self, factory: GUIFactory):
        self._button = factory.create_button()
        self._checkbox = factory.create_checkbox()
        self._input = factory.create_input()
    
    def render_ui(self) -> None:
        print("\n--- Rendering Application UI ---")
        self._button.render()
        self._checkbox.render()
        self._input.render()
    
    def interact(self) -> None:
        print("\n--- User Interactions ---")
        self._button.on_click(lambda: print("      Button action executed!"))
        self._checkbox.toggle()
        self._input.set_value("Hello World")

# Usage
def get_factory(os: str) -> GUIFactory:
    os = os.lower()
    if os == 'windows':
        return WindowsFactory()
    elif os == 'macos':
        return MacOSFactory()
    elif os == 'linux':
        return LinuxFactory()
    else:
        raise ValueError(f"Unknown OS: {os}")

os_type = 'windows'
factory = get_factory(os_type)
app = Application(factory)

app.render_ui()
app.interact()

# Easy to switch
print("\n\n=== Switching to MacOS ===")
mac_app = Application(MacOSFactory())
mac_app.render_ui()
mac_app.interact()

print("\n\n=== Switching to Linux ===")
linux_app = Application(LinuxFactory())
linux_app.render_ui()
linux_app.interact()

# ============================================
# Real-World Example: Cloud Infrastructure
# ============================================

print("\n\n=== Real-World: Cloud Infrastructure ===\n")

# Abstract products
class VirtualMachine(ABC):
    @abstractmethod
    def start(self) -> None:
        pass
    
    @abstractmethod
    def stop(self) -> None:
        pass
    
    @abstractmethod
    def get_type(self) -> str:
        pass

class Storage(ABC):
    @abstractmethod
    def upload(self, file: str) -> None:
        pass
    
    @abstractmethod
    def download(self, file: str) -> None:
        pass
    
    @abstractmethod
    def get_type(self) -> str:
        pass

class Database(ABC):
    @abstractmethod
    def connect(self) -> None:
        pass
    
    @abstractmethod
    def query(self, sql: str) -> list:
        pass
    
    @abstractmethod
    def get_type(self) -> str:
        pass

# AWS Products
class EC2Instance(VirtualMachine):
    def start(self) -> None:
        print("☁️ Starting EC2 instance")
    
    def stop(self) -> None:
        print("☁️ Stopping EC2 instance")
    
    def get_type(self) -> str:
        return "AWS EC2"

class S3Storage(Storage):
    def upload(self, file: str) -> None:
        print(f"☁️ Uploading {file} to S3 bucket")
    
    def download(self, file: str) -> None:
        print(f"☁️ Downloading {file} from S3")
    
    def get_type(self) -> str:
        return "AWS S3"

class RDSDatabase(Database):
    def connect(self) -> None:
        print("☁️ Connecting to RDS database")
    
    def query(self, sql: str) -> list:
        print(f"☁️ RDS Query: {sql}")
        return []
    
    def get_type(self) -> str:
        return "AWS RDS"

# Azure Products (similar pattern)
class AzureVM(VirtualMachine):
    def start(self) -> None:
        print("☁️ Starting Azure Virtual Machine")
    
    def stop(self) -> None:
        print("☁️ Stopping Azure Virtual Machine")
    
    def get_type(self) -> str:
        return "Azure VM"

class BlobStorage(Storage):
    def upload(self, file: str) -> None:
        print(f"☁️ Uploading {file} to Azure Blob Storage")
    
    def download(self, file: str) -> None:
        print(f"☁️ Downloading {file} from Blob Storage")
    
    def get_type(self) -> str:
        return "Azure Blob"

class SQLDatabase(Database):
    def connect(self) -> None:
        print("☁️ Connecting to Azure SQL Database")
    
    def query(self, sql: str) -> list:
        print(f"☁️ Azure SQL Query: {sql}")
        return []
    
    def get_type(self) -> str:
        return "Azure SQL"

# Abstract Factory
class CloudProvider(ABC):
    @abstractmethod
    def create_vm(self) -> VirtualMachine:
        pass
    
    @abstractmethod
    def create_storage(self) -> Storage:
        pass
    
    @abstractmethod
    def create_database(self) -> Database:
        pass

# Concrete Factories
class AWSProvider(CloudProvider):
    def create_vm(self) -> VirtualMachine:
        return EC2Instance()
    
    def create_storage(self) -> Storage:
        return S3Storage()
    
    def create_database(self) -> Database:
        return RDSDatabase()

class AzureProvider(CloudProvider):
    def create_vm(self) -> VirtualMachine:
        return AzureVM()
    
    def create_storage(self) -> Storage:
        return BlobStorage()
    
    def create_database(self) -> Database:
        return SQLDatabase()

# Client code
class CloudApplication:
    def __init__(self, provider: CloudProvider):
        print("\n--- Provisioning Cloud Resources ---")
        self._vm = provider.create_vm()
        self._storage = provider.create_storage()
        self._database = provider.create_database()
    
    def deploy(self) -> None:
        print("\n--- Deploying Application ---")
        self._vm.start()
        self._storage.upload("app.zip")
        self._database.connect()
        self._database.query("CREATE TABLE users")
        print("✓ Application deployed successfully")
    
    def get_infrastructure(self) -> str:
        return f"VM: {self._vm.get_type()}, Storage: {self._storage.get_type()}, DB: {self._database.get_type()}"

# Deploy to different providers
print("=== Deploying to AWS ===")
aws_app = CloudApplication(AWSProvider())
aws_app.deploy()
print(f"Infrastructure: {aws_app.get_infrastructure()}")

print("\n\n=== Deploying to Azure ===")
azure_app = CloudApplication(AzureProvider())
azure_app.deploy()
print(f"Infrastructure: {azure_app.get_infrastructure()}")

print("\n\n=== Abstract Factory Summary ===")
print("\nWhen to use:")
print("  ✓ System needs to work with multiple families of products")
print("  ✓ Products in a family must be used together")
print("  ✓ Want to provide product library without exposing implementations")

print("\nBenefits:")
print("  ✓ Ensures product compatibility within families")
print("  ✓ Isolates concrete classes from client")
print("  ✓ Easy to exchange product families")

print("\nDrawbacks:")
print("  ⚠ Hard to add new product types (must change interface)")
print("  ⚠ Can significantly increase complexity")
```

</details>

---

### D. Builder Pattern

**Intent**: Separate the construction of a complex object from its representation, allowing the same construction process to create different representations.

**Real-world analogy**: Think of building a house. The construction process (foundation → walls → roof → interior) is the same, but you can build different types of houses (modern, Victorian, cottage) using the same steps. The builder knows the construction sequence; the director orchestrates it.

**When to use**:
- Object has many optional parameters (telescoping constructor problem)
- Construction process is complex with multiple steps
- Want different representations of the same object
- Need to construct composite objects step by step

**Pros**:
- Construct objects step-by-step
- Reuse construction code for different representations
- Single Responsibility: separate construction from business logic
- Avoids "telescoping constructors"

**Cons**:
- Overall complexity increases (new classes)
- Can be overkill for simple objects

<details>
<summary><strong>View Builder Examples</strong></summary>

```typescript
// TypeScript - Builder Pattern

// ============================================
// Basic Builder - Computer Example
// ============================================

console.log("=== Basic Builder: Computer ===\n");

// Product
class Computer {
  constructor(
    public cpu: string,
    public ram: string,
    public storage: string,
    public gpu?: string,
    public cooling?: string,
    public powerSupply?: string,
    public caseType?: string
  ) {}

  describe(): void {
    console.log("\n=== Computer Specifications ===");
    console.log(`CPU: ${this.cpu}`);
    console.log(`RAM: ${this.ram}`);
    console.log(`Storage: ${this.storage}`);
    if (this.gpu) console.log(`GPU: ${this.gpu}`);
    if (this.cooling) console.log(`Cooling: ${this.cooling}`);
    if (this.powerSupply) console.log(`Power Supply: ${this.powerSupply}`);
    if (this.caseType) console.log(`Case: ${this.caseType}`);
  }
}

// Builder
class ComputerBuilder {
  private cpu: string = "";
  private ram: string = "";
  private storage: string = "";
  private gpu?: string;
  private cooling?: string;
  private powerSupply?: string;
  private caseType?: string;

  setCPU(cpu: string): ComputerBuilder {
    this.cpu = cpu;
    console.log(`✓ CPU set: ${cpu}`);
    return this; // Return this for method chaining
  }

  setRAM(ram: string): ComputerBuilder {
    this.ram = ram;
    console.log(`✓ RAM set: ${ram}`);
    return this;
  }

  setStorage(storage: string): ComputerBuilder {
    this.storage = storage;
    console.log(`✓ Storage set: ${storage}`);
    return this;
  }

  setGPU(gpu: string): ComputerBuilder {
    this.gpu = gpu;
    console.log(`✓ GPU set: ${gpu}`);
    return this;
  }

  setCooling(cooling: string): ComputerBuilder {
    this.cooling = cooling;
    console.log(`✓ Cooling set: ${cooling}`);
    return this;
  }

  setPowerSupply(powerSupply: string): ComputerBuilder {
    this.powerSupply = powerSupply;
    console.log(`✓ Power Supply set: ${powerSupply}`);
    return this;
  }

  setCase(caseType: string): ComputerBuilder {
    this.caseType = caseType;
    console.log(`✓ Case set: ${caseType}`);
    return this;
  }

  build(): Computer {
    if (!this.cpu || !this.ram || !this.storage) {
      throw new Error("CPU, RAM, and Storage are required");
    }
    console.log("\n🔧 Building computer...");
    return new Computer(
      this.cpu,
      this.ram,
      this.storage,
      this.gpu,
      this.cooling,
      this.powerSupply,
      this.caseType
    );
  }

  reset(): void {
    this.cpu = "";
    this.ram = "";
    this.storage = "";
    this.gpu = undefined;
    this.cooling = undefined;
    this.powerSupply = undefined;
    this.caseType = undefined;
    console.log("\n♻️ Builder reset");
  }
}

// Usage - Method chaining
console.log("--- Building Gaming Computer ---");
const gamingPC = new ComputerBuilder()
  .setCPU("Intel i9-13900K")
  .setRAM("64GB DDR5")
  .setStorage("2TB NVMe SSD")
  .setGPU("NVIDIA RTX 4090")
  .setCooling("Liquid Cooling")
  .setPowerSupply("1000W 80+ Platinum")
  .setCase("Full Tower RGB")
  .build();

gamingPC.describe();

console.log("\n\n--- Building Office Computer ---");
const officePC = new ComputerBuilder()
  .setCPU("Intel i5-12400")
  .setRAM("16GB DDR4")
  .setStorage("512GB SSD")
  .setCase("Mini Tower")
  .build();

officePC.describe();

// ============================================
// Director Pattern - Predefined Configurations
// ============================================

console.log("\n\n=== Builder with Director ===\n");

class ComputerDirector {
  constructor(private builder: ComputerBuilder) {}

  buildGamingPC(): Computer {
    console.log("--- Director: Building Gaming PC ---");
    return this.builder
      .setCPU("AMD Ryzen 9 7950X")
      .setRAM("64GB DDR5")
      .setStorage("2TB NVMe SSD")
      .setGPU("AMD Radeon RX 7900 XTX")
      .setCooling("AIO Liquid Cooling")
      .setPowerSupply("1000W 80+ Gold")
      .setCase("Full Tower")
      .build();
  }

  buildWorkstationPC(): Computer {
    console.log("--- Director: Building Workstation PC ---");
    return this.builder
      .setCPU("Intel Xeon W-3375")
      .setRAM("128GB ECC DDR4")
      .setStorage("4TB NVMe SSD")
      .setGPU("NVIDIA RTX A6000")
      .setCooling("Tower Air Cooler")
      .setPowerSupply("1200W 80+ Platinum")
      .setCase("Workstation Case")
      .build();
  }

  buildBudgetPC(): Computer {
    console.log("--- Director: Building Budget PC ---");
    return this.builder
      .setCPU("AMD Ryzen 5 5600G")
      .setRAM("16GB DDR4")
      .setStorage("512GB SSD")
      .setCase("Mini Tower")
      .build();
  }
}

const builder = new ComputerBuilder();
const director = new ComputerDirector(builder);

const gaming = director.buildGamingPC();
gaming.describe();

builder.reset();

const workstation = director.buildWorkstationPC();
workstation.describe();

builder.reset();

const budget = director.buildBudgetPC();
budget.describe();

// ============================================
// Real-World Example: HTTP Request Builder
// ============================================

console.log("\n\n=== Real-World: HTTP Request Builder ===\n");

class HTTPRequest {
  constructor(
    public method: string,
    public url: string,
    public headers: Map<string, string>,
    public body?: string,
    public timeout?: number,
    public retries?: number
  ) {}

  execute(): void {
    console.log("\n🌐 Executing HTTP Request:");
    console.log(`${this.method} ${this.url}`);
    
    if (this.headers.size > 0) {
      console.log("\nHeaders:");
      this.headers.forEach((value, key) => {
        console.log(`  ${key}: ${value}`);
      });
    }

    if (this.body) {
      console.log(`\nBody: ${this.body}`);
    }

    if (this.timeout) {
      console.log(`Timeout: ${this.timeout}ms`);
    }

    if (this.retries) {
      console.log(`Max Retries: ${this.retries}`);
    }

    console.log("\n✓ Request sent successfully");
  }
}

class HTTPRequestBuilder {
  private method: string = "GET";
  private url: string = "";
  private headers: Map<string, string> = new Map();
  private body?: string;
  private timeout?: number;
  private retries?: number;

  setMethod(method: string): HTTPRequestBuilder {
    this.method = method.toUpperCase();
    return this;
  }

  setUrl(url: string): HTTPRequestBuilder {
    this.url = url;
    return this;
  }

  addHeader(key: string, value: string): HTTPRequestBuilder {
    this.headers.set(key, value);
    return this;
  }

  setHeaders(headers: Record<string, string>): HTTPRequestBuilder {
    Object.entries(headers).forEach(([key, value]) => {
      this.headers.set(key, value);
    });
    return this;
  }

  setBody(body: any): HTTPRequestBuilder {
    this.body = typeof body === 'string' ? body : JSON.stringify(body);
    return this;
  }

  setTimeout(timeout: number): HTTPRequestBuilder {
    this.timeout = timeout;
    return this;
  }

  setRetries(retries: number): HTTPRequestBuilder {
    this.retries = retries;
    return this;
  }

  build(): HTTPRequest {
    if (!this.url) {
      throw new Error("URL is required");
    }
    return new HTTPRequest(
      this.method,
      this.url,
      new Map(this.headers),
      this.body,
      this.timeout,
      this.retries
    );
  }
}

// Usage
console.log("--- Building GET Request ---");
const getRequest = new HTTPRequestBuilder()
  .setMethod("GET")
  .setUrl("https://api.example.com/users")
  .addHeader("Authorization", "Bearer token123")
  .addHeader("Accept", "application/json")
  .setTimeout(5000)
  .setRetries(3)
  .build();

getRequest.execute();

console.log("\n\n--- Building POST Request ---");
const postRequest = new HTTPRequestBuilder()
  .setMethod("POST")
  .setUrl("https://api.example.com/users")
  .setHeaders({
    "Content-Type": "application/json",
    "Authorization": "Bearer token123"
  })
  .setBody({ name: "Alice", email: "alice@example.com" })
  .setTimeout(10000)
  .build();

postRequest.execute();

// ============================================
// Real-World Example: SQL Query Builder
// ============================================

console.log("\n\n=== Real-World: SQL Query Builder ===\n");

class SQLQuery {
  constructor(
    public operation: string,
    public table: string,
    public columns: string[],
    public conditions: string[],
    public joins: string[],
    public orderBy?: string,
    public limit?: number,
    public offset?: number
  ) {}

  toString(): string {
    let query = "";

    if (this.operation === "SELECT") {
      query = `SELECT ${this.columns.join(", ")} FROM ${this.table}`;
    } else if (this.operation === "DELETE") {
      query = `DELETE FROM ${this.table}`;
    }

    if (this.joins.length > 0) {
      query += "\n" + this.joins.join("\n");
    }

    if (this.conditions.length > 0) {
      query += `\nWHERE ${this.conditions.join(" AND ")}`;
    }

    if (this.orderBy) {
      query += `\nORDER BY ${this.orderBy}`;
    }

    if (this.limit !== undefined) {
      query += `\nLIMIT ${this.limit}`;
    }

    if (this.offset !== undefined) {
      query += `\nOFFSET ${this.offset}`;
    }

    return query;
  }
}

class SQLQueryBuilder {
  private operation: string = "SELECT";
  private table: string = "";
  private columns: string[] = ["*"];
  private conditions: string[] = [];
  private joins: string[] = [];
  private orderBy?: string;
  private limit?: number;
  private offset?: number;

  select(...columns: string[]): SQLQueryBuilder {
    this.operation = "SELECT";
    this.columns = columns.length > 0 ? columns : ["*"];
    return this;
  }

  delete(): SQLQueryBuilder {
    this.operation = "DELETE";
    return this;
  }

  from(table: string): SQLQueryBuilder {
    this.table = table;
    return this;
  }

  where(condition: string): SQLQueryBuilder {
    this.conditions.push(condition);
    return this;
  }

  join(table: string, on: string): SQLQueryBuilder {
    this.joins.push(`JOIN ${table} ON ${on}`);
    return this;
  }

  leftJoin(table: string, on: string): SQLQueryBuilder {
    this.joins.push(`LEFT JOIN ${table} ON ${on}`);
    return this;
  }

  orderByAsc(column: string): SQLQueryBuilder {
    this.orderBy = `${column} ASC`;
    return this;
  }

  orderByDesc(column: string): SQLQueryBuilder {
    this.orderBy = `${column} DESC`;
    return this;
  }

  setLimit(limit: number): SQLQueryBuilder {
    this.limit = limit;
    return this;
  }

  setOffset(offset: number): SQLQueryBuilder {
    this.offset = offset;
    return this;
  }

  build(): SQLQuery {
    if (!this.table) {
      throw new Error("Table name is required");
    }
    return new SQLQuery(
      this.operation,
      this.table,
      [...this.columns],
      [...this.conditions],
      [...this.joins],
      this.orderBy,
      this.limit,
      this.offset
    );
  }
}

// Usage
console.log("--- Simple SELECT Query ---");
const simpleQuery = new SQLQueryBuilder()
  .select("id", "name", "email")
  .from("users")
  .where("age > 18")
  .orderByDesc("created_at")
  .setLimit(10)
  .build();

console.log(simpleQuery.toString());

console.log("\n\n--- Complex JOIN Query ---");
const complexQuery = new SQLQueryBuilder()
  .select("u.name", "u.email", "o.total", "o.created_at")
  .from("users u")
  .join("orders o", "u.id = o.user_id")
  .where("o.status = 'completed'")
  .where("o.total > 100")
  .orderByDesc("o.created_at")
  .setLimit(20)
  .setOffset(0)
  .build();

console.log(complexQuery.toString());

console.log("\n\n--- DELETE Query ---");
const deleteQuery = new SQLQueryBuilder()
  .delete()
  .from("sessions")
  .where("expires_at < NOW()")
  .build();

console.log(deleteQuery.toString());

// ============================================
// Key Takeaways
// ============================================

console.log("\n\n=== Builder Pattern Summary ===");
console.log("\nWhen to use:");
console.log("  ✓ Object has many optional parameters");
console.log("  ✓ Construction process is complex/multi-step");
console.log("  ✓ Need different representations of same object");
console.log("  ✓ Want to avoid telescoping constructors");

console.log("\nBenefits:");
console.log("  ✓ Construct objects step-by-step");
console.log("  ✓ Reuse construction code");
console.log("  ✓ Single Responsibility Principle");
console.log("  ✓ Method chaining improves readability");
console.log("  ✓ Immutable product possible");

console.log("\nDrawbacks:");
console.log("  ⚠ Increases overall complexity");
console.log("  ⚠ Can be overkill for simple objects");

console.log("\nCommon Use Cases:");
console.log("  • Database query builders (SQL, MongoDB)");
console.log("  • HTTP request builders");
console.log("  • Configuration objects");
console.log("  • Document/report generators");
console.log("  • Test data builders");
```

```python
# Python - Builder Pattern

from typing import Optional, List, Dict

# ============================================
# Basic Builder - Computer Example
# ============================================

print("=== Basic Builder: Computer ===\n")

# Product
class Computer:
    def __init__(self, cpu: str, ram: str, storage: str,
                 gpu: Optional[str] = None,
                 cooling: Optional[str] = None,
                 power_supply: Optional[str] = None,
                 case_type: Optional[str] = None):
        self.cpu = cpu
        self.ram = ram
        self.storage = storage
        self.gpu = gpu
        self.cooling = cooling
        self.power_supply = power_supply
        self.case_type = case_type
    
    def describe(self) -> None:
        print("\n=== Computer Specifications ===")
        print(f"CPU: {self.cpu}")
        print(f"RAM: {self.ram}")
        print(f"Storage: {self.storage}")
        if self.gpu:
            print(f"GPU: {self.gpu}")
        if self.cooling:
            print(f"Cooling: {self.cooling}")
        if self.power_supply:
            print(f"Power Supply: {self.power_supply}")
        if self.case_type:
            print(f"Case: {self.case_type}")

# Builder
class ComputerBuilder:
    def __init__(self):
        self._cpu: str = ""
        self._ram: str = ""
        self._storage: str = ""
        self._gpu: Optional[str] = None
        self._cooling: Optional[str] = None
        self._power_supply: Optional[str] = None
        self._case_type: Optional[str] = None
    
    def set_cpu(self, cpu: str) -> 'ComputerBuilder':
        self._cpu = cpu
        print(f"✓ CPU set: {cpu}")
        return self
    
    def set_ram(self, ram: str) -> 'ComputerBuilder':
        self._ram = ram
        print(f"✓ RAM set: {ram}")
        return self
    
    def set_storage(self, storage: str) -> 'ComputerBuilder':
        self._storage = storage
        print(f"✓ Storage set: {storage}")
        return self
    
    def set_gpu(self, gpu: str) -> 'ComputerBuilder':
        self._gpu = gpu
        print(f"✓ GPU set: {gpu}")
        return self
    
    def set_cooling(self, cooling: str) -> 'ComputerBuilder':
        self._cooling = cooling
        print(f"✓ Cooling set: {cooling}")
        return self
    
    def set_power_supply(self, power_supply: str) -> 'ComputerBuilder':
        self._power_supply = power_supply
        print(f"✓ Power Supply set: {power_supply}")
        return self
    
    def set_case(self, case_type: str) -> 'ComputerBuilder':
        self._case_type = case_type
        print(f"✓ Case set: {case_type}")
        return self
    
    def build(self) -> Computer:
        if not self._cpu or not self._ram or not self._storage:
            raise ValueError("CPU, RAM, and Storage are required")
        print("\n🔧 Building computer...")
        return Computer(
            self._cpu,
            self._ram,
            self._storage,
            self._gpu,
            self._cooling,
            self._power_supply,
            self._case_type
        )
    
    def reset(self) -> None:
        self._cpu = ""
        self._ram = ""
        self._storage = ""
        self._gpu = None
        self._cooling = None
        self._power_supply = None
        self._case_type = None
        print("\n♻️ Builder reset")

# Usage - Method chaining
print("--- Building Gaming Computer ---")
gaming_pc = (ComputerBuilder()
    .set_cpu("Intel i9-13900K")
    .set_ram("64GB DDR5")
    .set_storage("2TB NVMe SSD")
    .set_gpu("NVIDIA RTX 4090")
    .set_cooling("Liquid Cooling")
    .set_power_supply("1000W 80+ Platinum")
    .set_case("Full Tower RGB")
    .build())

gaming_pc.describe()

print("\n\n--- Building Office Computer ---")
office_pc = (ComputerBuilder()
    .set_cpu("Intel i5-12400")
    .set_ram("16GB DDR4")
    .set_storage("512GB SSD")
    .set_case("Mini Tower")
    .build())

office_pc.describe()

# ============================================
# Director Pattern
# ============================================

print("\n\n=== Builder with Director ===\n")

class ComputerDirector:
    def __init__(self, builder: ComputerBuilder):
        self._builder = builder
    
    def build_gaming_pc(self) -> Computer:
        print("--- Director: Building Gaming PC ---")
        return (self._builder
            .set_cpu("AMD Ryzen 9 7950X")
            .set_ram("64GB DDR5")
            .set_storage("2TB NVMe SSD")
            .set_gpu("AMD Radeon RX 7900 XTX")
            .set_cooling("AIO Liquid Cooling")
            .set_power_supply("1000W 80+ Gold")
            .set_case("Full Tower")
            .build())
    
    def build_workstation_pc(self) -> Computer:
        print("--- Director: Building Workstation PC ---")
        return (self._builder
            .set_cpu("Intel Xeon W-3375")
            .set_ram("128GB ECC DDR4")
            .set_storage("4TB NVMe SSD")
            .set_gpu("NVIDIA RTX A6000")
            .set_cooling("Tower Air Cooler")
            .set_power_supply("1200W 80+ Platinum")
            .set_case("Workstation Case")
            .build())
    
    def build_budget_pc(self) -> Computer:
        print("--- Director: Building Budget PC ---")
        return (self._builder
            .set_cpu("AMD Ryzen 5 5600G")
            .set_ram("16GB DDR4")
            .set_storage("512GB SSD")
            .set_case("Mini Tower")
            .build())

builder = ComputerBuilder()
director = ComputerDirector(builder)

gaming = director.build_gaming_pc()
gaming.describe()

builder.reset()

workstation = director.build_workstation_pc()
workstation.describe()

# ============================================
# Real-World Example: SQL Query Builder
# ============================================

print("\n\n=== Real-World: SQL Query Builder ===\n")

class SQLQuery:
    def __init__(self, operation: str, table: str, columns: List[str],
                 conditions: List[str], joins: List[str],
                 order_by: Optional[str] = None,
                 limit: Optional[int] = None,
                 offset: Optional[int] = None):
        self.operation = operation
        self.table = table
        self.columns = columns
        self.conditions = conditions
        self.joins = joins
        self.order_by = order_by
        self.limit = limit
        self.offset = offset
    
    def __str__(self) -> str:
        query = ""
        
        if self.operation == "SELECT":
            query = f"SELECT {', '.join(self.columns)} FROM {self.table}"
        elif self.operation == "DELETE":
            query = f"DELETE FROM {self.table}"
        
        if self.joins:
            query += "\n" + "\n".join(self.joins)
        
        if self.conditions:
            query += f"\nWHERE {' AND '.join(self.conditions)}"
        
        if self.order_by:
            query += f"\nORDER BY {self.order_by}"
        
        if self.limit is not None:
            query += f"\nLIMIT {self.limit}"
        
        if self.offset is not None:
            query += f"\nOFFSET {self.offset}"
        
        return query

class SQLQueryBuilder:
    def __init__(self):
        self._operation = "SELECT"
        self._table = ""
        self._columns = ["*"]
        self._conditions = []
        self._joins = []
        self._order_by = None
        self._limit = None
        self._offset = None
    
    def select(self, *columns: str) -> 'SQLQueryBuilder':
        self._operation = "SELECT"
        self._columns = list(columns) if columns else ["*"]
        return self
    
    def delete(self) -> 'SQLQueryBuilder':
        self._operation = "DELETE"
        return self
    
    def from_table(self, table: str) -> 'SQLQueryBuilder':
        self._table = table
        return self
    
    def where(self, condition: str) -> 'SQLQueryBuilder':
        self._conditions.append(condition)
        return self
    
    def join(self, table: str, on: str) -> 'SQLQueryBuilder':
        self._joins.append(f"JOIN {table} ON {on}")
        return self
    
    def left_join(self, table: str, on: str) -> 'SQLQueryBuilder':
        self._joins.append(f"LEFT JOIN {table} ON {on}")
        return self
    
    def order_by_asc(self, column: str) -> 'SQLQueryBuilder':
        self._order_by = f"{column} ASC"
        return self
    
    def order_by_desc(self, column: str) -> 'SQLQueryBuilder':
        self._order_by = f"{column} DESC"
        return self
    
    def set_limit(self, limit: int) -> 'SQLQueryBuilder':
        self._limit = limit
        return self
    
    def set_offset(self, offset: int) -> 'SQLQueryBuilder':
        self._offset = offset
        return self
    
    def build(self) -> SQLQuery:
        if not self._table:
            raise ValueError("Table name is required")
        return SQLQuery(
            self._operation,
            self._table,
            self._columns.copy(),
            self._conditions.copy(),
            self._joins.copy(),
            self._order_by,
            self._limit,
            self._offset
        )

# Usage
print("--- Simple SELECT Query ---")
simple_query = (SQLQueryBuilder()
    .select("id", "name", "email")
    .from_table("users")
    .where("age > 18")
    .order_by_desc("created_at")
    .set_limit(10)
    .build())

print(simple_query)

print("\n\n--- Complex JOIN Query ---")
complex_query = (SQLQueryBuilder()
    .select("u.name", "u.email", "o.total", "o.created_at")
    .from_table("users u")
    .join("orders o", "u.id = o.user_id")
    .where("o.status = 'completed'")
    .where("o.total > 100")
    .order_by_desc("o.created_at")
    .set_limit(20)
    .set_offset(0)
    .build())

print(complex_query)

print("\n\n=== Builder Pattern Summary ===")
print("\nWhen to use:")
print("  ✓ Object has many optional parameters")
print("  ✓ Construction process is complex/multi-step")
print("  ✓ Need different representations of same object")

print("\nBenefits:")
print("  ✓ Construct objects step-by-step")
print("  ✓ Reuse construction code")
print("  ✓ Single Responsibility Principle")
print("  ✓ Method chaining improves readability")

print("\nDrawbacks:")
print("  ⚠ Increases overall complexity")
print("  ⚠ Can be overkill for simple objects")
```

</details>

---

### E. Prototype Pattern

**Intent**: Create new objects by copying an existing object (prototype) rather than creating new instances from scratch. Specify the kinds of objects to create using a prototypical instance.

**Real-world analogy**: Think of cell division (mitosis). When a cell divides, it creates an exact copy of itself. Similarly, when you photocopy a document, you create a clone without rebuilding the document from scratch.

**When to use**:
- Object creation is expensive (resource-intensive)
- Want to avoid subclasses of an object creator
- Need to hide complexity of creating new instances
- Objects have only a few different combinations of state
- Want to reduce the number of classes

**Pros**:
- Clone objects without coupling to concrete classes
- Avoid repeated initialization code
- Produce complex objects more conveniently
- Alternative to inheritance for handling presets/configurations

**Cons**:
- Cloning complex objects with circular references can be tricky
- Deep copy vs shallow copy considerations

<details>
<summary><strong>View Prototype Examples</strong></summary>

```typescript
// TypeScript - Prototype Pattern

// ============================================
// Basic Prototype - Shape Example
// ============================================

console.log("=== Basic Prototype: Shapes ===\n");

// Prototype interface
interface Prototype {
  clone(): Prototype;
}

// Concrete prototype
class Rectangle implements Prototype {
  constructor(
    public width: number,
    public height: number,
    public color: string,
    public borderWidth: number = 1
  ) {}

  clone(): Rectangle {
    // Create a new instance with same values
    console.log(`Cloning rectangle: ${this.width}x${this.height}, ${this.color}`);
    return new Rectangle(this.width, this.height, this.color, this.borderWidth);
  }

  draw(): void {
    console.log(`Drawing ${this.color} rectangle: ${this.width}x${this.height} (border: ${this.borderWidth}px)`);
  }

  setDimensions(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }
}

class Circle implements Prototype {
  constructor(
    public radius: number,
    public color: string,
    public borderWidth: number = 1
  ) {}

  clone(): Circle {
    console.log(`Cloning circle: radius ${this.radius}, ${this.color}`);
    return new Circle(this.radius, this.color, this.borderWidth);
  }

  draw(): void {
    console.log(`Drawing ${this.color} circle: radius ${this.radius} (border: ${this.borderWidth}px)`);
  }

  setRadius(radius: number): void {
    this.radius = radius;
  }
}

// Usage
console.log("--- Creating original shapes ---");
const redRectangle = new Rectangle(100, 50, "red", 2);
const blueCircle = new Circle(30, "blue", 3);

redRectangle.draw();
blueCircle.draw();

console.log("\n--- Cloning shapes ---");
const anotherRedRectangle = redRectangle.clone();
anotherRedRectangle.setDimensions(150, 75);
anotherRedRectangle.draw();

const anotherBlueCircle = blueCircle.clone();
anotherBlueCircle.setRadius(50);
anotherBlueCircle.draw();

console.log("\n--- Original shapes unchanged ---");
redRectangle.draw();
blueCircle.draw();

// ============================================
// Prototype Registry - Centralized Prototypes
// ============================================

console.log("\n\n=== Prototype Registry ===\n");

class ShapeRegistry {
  private prototypes: Map<string, Prototype> = new Map();

  registerPrototype(key: string, prototype: Prototype): void {
    this.prototypes.set(key, prototype);
    console.log(`✓ Registered prototype: ${key}`);
  }

  getPrototype(key: string): Prototype | undefined {
    const prototype = this.prototypes.get(key);
    if (!prototype) {
      console.log(`❌ Prototype not found: ${key}`);
      return undefined;
    }
    console.log(`Retrieving prototype: ${key}`);
    return prototype.clone();
  }

  listPrototypes(): void {
    console.log("\nAvailable prototypes:");
    this.prototypes.forEach((_, key) => {
      console.log(`  - ${key}`);
    });
  }
}

// Create registry and register common prototypes
const registry = new ShapeRegistry();

registry.registerPrototype("large-red-rectangle", new Rectangle(200, 100, "red", 3));
registry.registerPrototype("small-blue-circle", new Circle(20, "blue", 1));
registry.registerPrototype("medium-green-rectangle", new Rectangle(150, 80, "green", 2));

registry.listPrototypes();

// Clone from registry
console.log("\n--- Cloning from registry ---");
const shape1 = registry.getPrototype("large-red-rectangle");
const shape2 = registry.getPrototype("small-blue-circle");

if (shape1 instanceof Rectangle) {
  shape1.draw();
}
if (shape2 instanceof Circle) {
  shape2.draw();
}

// ============================================
// Real-World Example: Document Templates
// ============================================

console.log("\n\n=== Real-World: Document Templates ===\n");

class Document implements Prototype {
  constructor(
    public title: string,
    public content: string,
    public author: string,
    public metadata: Map<string, string>,
    public sections: Section[]
  ) {}

  clone(): Document {
    console.log(`Cloning document: "${this.title}"`);
    
    // Deep clone: create new map and array
    const clonedMetadata = new Map(this.metadata);
    const clonedSections = this.sections.map(section => section.clone());
    
    return new Document(
      this.title,
      this.content,
      this.author,
      clonedMetadata,
      clonedSections
    );
  }

  display(): void {
    console.log(`\n=== Document: ${this.title} ===`);
    console.log(`Author: ${this.author}`);
    console.log(`Content: ${this.content}`);
    console.log(`Sections: ${this.sections.length}`);
    this.sections.forEach((section, index) => {
      console.log(`  ${index + 1}. ${section.heading}`);
    });
    console.log(`Metadata:`);
    this.metadata.forEach((value, key) => {
      console.log(`  ${key}: ${value}`);
    });
  }
}

class Section implements Prototype {
  constructor(
    public heading: string,
    public text: string
  ) {}

  clone(): Section {
    return new Section(this.heading, this.text);
  }
}

// Create document templates
console.log("--- Creating document templates ---");

const reportTemplate = new Document(
  "Quarterly Report Template",
  "This is a template for quarterly reports",
  "Template System",
  new Map([
    ["type", "report"],
    ["version", "1.0"],
    ["department", ""]
  ]),
  [
    new Section("Executive Summary", "..."),
    new Section("Financial Overview", "..."),
    new Section("Key Metrics", "..."),
    new Section("Recommendations", "...")
  ]
);

const proposalTemplate = new Document(
  "Business Proposal Template",
  "This is a template for business proposals",
  "Template System",
  new Map([
    ["type", "proposal"],
    ["version", "1.0"],
    ["client", ""]
  ]),
  [
    new Section("Introduction", "..."),
    new Section("Problem Statement", "..."),
    new Section("Proposed Solution", "..."),
    new Section("Timeline and Budget", "...")
  ]
);

// Use templates to create actual documents
console.log("\n--- Creating documents from templates ---");

const q1Report = reportTemplate.clone();
q1Report.title = "Q1 2024 Financial Report";
q1Report.author = "Finance Team";
q1Report.metadata.set("department", "Finance");
q1Report.content = "Q1 showed strong growth...";
q1Report.display();

const clientProposal = proposalTemplate.clone();
clientProposal.title = "Project Phoenix Proposal";
clientProposal.author = "Sales Team";
clientProposal.metadata.set("client", "Acme Corp");
clientProposal.content = "We propose to build...";
clientProposal.display();

// ============================================
// Real-World Example: Game Character Presets
// ============================================

console.log("\n\n=== Real-World: Game Character Presets ===\n");

interface Equipment {
  name: string;
  damage?: number;
  defense?: number;
}

class Character implements Prototype {
  constructor(
    public name: string,
    public level: number,
    public health: number,
    public mana: number,
    public strength: number,
    public intelligence: number,
    public equipment: Equipment[]
  ) {}

  clone(): Character {
    console.log(`Cloning character preset: ${this.name}`);
    
    // Deep clone equipment
    const clonedEquipment = this.equipment.map(item => ({ ...item }));
    
    return new Character(
      this.name,
      this.level,
      this.health,
      this.mana,
      this.strength,
      this.intelligence,
      clonedEquipment
    );
  }

  displayStats(): void {
    console.log(`\n=== ${this.name} (Level ${this.level}) ===`);
    console.log(`Health: ${this.health} | Mana: ${this.mana}`);
    console.log(`Strength: ${this.strength} | Intelligence: ${this.intelligence}`);
    console.log(`Equipment:`);
    this.equipment.forEach(item => {
      let stats = "";
      if (item.damage) stats += ` [Damage: ${item.damage}]`;
      if (item.defense) stats += ` [Defense: ${item.defense}]`;
      console.log(`  - ${item.name}${stats}`);
    });
  }
}

// Create character presets
console.log("--- Creating character presets ---");

const warriorPreset = new Character(
  "Warrior Preset",
  1,
  150,
  30,
  20,
  5,
  [
    { name: "Iron Sword", damage: 15 },
    { name: "Iron Armor", defense: 20 },
    { name: "Iron Shield", defense: 10 }
  ]
);

const magePreset = new Character(
  "Mage Preset",
  1,
  80,
  150,
  5,
  20,
  [
    { name: "Wooden Staff", damage: 8 },
    { name: "Cloth Robe", defense: 5 },
    { name: "Magic Amulet" }
  ]
);

const roguePreset = new Character(
  "Rogue Preset",
  1,
  100,
  50,
  15,
  10,
  [
    { name: "Twin Daggers", damage: 12 },
    { name: "Leather Armor", defense: 12 },
    { name: "Smoke Bombs" }
  ]
);

// Players create characters from presets
console.log("\n--- Players creating characters ---");

const player1Character = warriorPreset.clone();
player1Character.name = "Thorin the Brave";
player1Character.displayStats();

const player2Character = magePreset.clone();
player2Character.name = "Gandalf the Wise";
player2Character.level = 5;
player2Character.mana = 200;
player2Character.displayStats();

const player3Character = roguePreset.clone();
player3Character.name = "Shadow";
player3Character.displayStats();

// ============================================
// Deep Copy vs Shallow Copy
// ============================================

console.log("\n\n=== Deep Copy vs Shallow Copy ===\n");

class Person implements Prototype {
  constructor(
    public name: string,
    public age: number,
    public address: { street: string; city: string }
  ) {}

  // Shallow copy - shares address reference
  shallowClone(): Person {
    console.log(`Shallow cloning: ${this.name}`);
    return new Person(this.name, this.age, this.address);
  }

  // Deep copy - creates new address object
  clone(): Person {
    console.log(`Deep cloning: ${this.name}`);
    return new Person(
      this.name,
      this.age,
      { ...this.address } // Create new object
    );
  }

  display(): void {
    console.log(`${this.name} (${this.age}) lives at ${this.address.street}, ${this.address.city}`);
  }
}

console.log("--- Demonstrating shallow copy problem ---");
const original = new Person("Alice", 30, { street: "123 Main St", city: "New York" });
const shallowCopy = original.shallowClone();

console.log("\nOriginal:");
original.display();
console.log("Shallow copy:");
shallowCopy.display();

console.log("\n--- Modifying shallow copy's address ---");
shallowCopy.address.city = "Los Angeles"; // This modifies original too!

console.log("\nOriginal (affected!):");
original.display();
console.log("Shallow copy:");
shallowCopy.display();

console.log("\n\n--- Demonstrating deep copy solution ---");
const original2 = new Person("Bob", 25, { street: "456 Oak Ave", city: "Chicago" });
const deepCopy = original2.clone();

console.log("\nOriginal:");
original2.display();
console.log("Deep copy:");
deepCopy.display();

console.log("\n--- Modifying deep copy's address ---");
deepCopy.address.city = "Boston"; // Only affects the copy

console.log("\nOriginal (unchanged!):");
original2.display();
console.log("Deep copy:");
deepCopy.display();

// ============================================
// Prototype with JSON (Serialization)
// ============================================

console.log("\n\n=== Prototype using JSON Serialization ===\n");

class Configuration implements Prototype {
  constructor(
    public database: {
      host: string;
      port: number;
      credentials: { username: string; password: string };
    },
    public cache: {
      enabled: boolean;
      ttl: number;
    },
    public features: string[]
  ) {}

  // Easy deep clone using JSON
  clone(): Configuration {
    console.log("Cloning configuration using JSON serialization");
    const json = JSON.stringify(this);
    const cloned = JSON.parse(json);
    
    // Reconstruct as Configuration object
    return new Configuration(
      cloned.database,
      cloned.cache,
      cloned.features
    );
  }

  display(): void {
    console.log("\nConfiguration:");
    console.log(`  Database: ${this.database.host}:${this.database.port}`);
    console.log(`  Cache: ${this.cache.enabled ? 'Enabled' : 'Disabled'} (TTL: ${this.cache.ttl}s)`);
    console.log(`  Features: ${this.features.join(', ')}`);
  }
}

const prodConfig = new Configuration(
  { host: "prod.db.com", port: 5432, credentials: { username: "admin", password: "secret" } },
  { enabled: true, ttl: 3600 },
  ["feature-a", "feature-b", "feature-c"]
);

const devConfig = prodConfig.clone();
devConfig.database.host = "localhost";
devConfig.database.port = 5433;
devConfig.cache.ttl = 60;
devConfig.features.push("debug-mode");

console.log("--- Production Config ---");
prodConfig.display();

console.log("\n--- Development Config (cloned and modified) ---");
devConfig.display();

// ============================================
// Key Takeaways
// ============================================

console.log("\n\n=== Prototype Pattern Summary ===");
console.log("\nWhen to use:");
console.log("  ✓ Object creation is expensive/complex");
console.log("  ✓ Need to avoid subclasses of object creator");
console.log("  ✓ Objects have few variations of state");
console.log("  ✓ Want to provide preset configurations");

console.log("\nBenefits:");
console.log("  ✓ Clone objects without coupling to classes");
console.log("  ✓ Avoid repeated initialization");
console.log("  ✓ Produce complex objects conveniently");
console.log("  ✓ Alternative to inheritance for presets");

console.log("\nDrawbacks:");
console.log("  ⚠ Cloning complex objects with circular references tricky");
console.log("  ⚠ Must implement clone() for each class");
console.log("  ⚠ Deep copy vs shallow copy considerations");

console.log("\nCommon Use Cases:");
console.log("  • Document/report templates");
console.log("  • Game character presets");
console.log("  • Configuration management");
console.log("  • UI component libraries");
console.log("  • Database object pools");
```

```python
# Python - Prototype Pattern

from copy import copy, deepcopy
from typing import List, Dict
import json

# ============================================
# Basic Prototype - Shape Example
# ============================================

print("=== Basic Prototype: Shapes ===\n")

from abc import ABC, abstractmethod

class Prototype(ABC):
    @abstractmethod
    def clone(self) -> 'Prototype':
        pass

class Rectangle(Prototype):
    def __init__(self, width: int, height: int, color: str, border_width: int = 1):
        self.width = width
        self.height = height
        self.color = color
        self.border_width = border_width
    
    def clone(self) -> 'Rectangle':
        print(f"Cloning rectangle: {self.width}x{self.height}, {self.color}")
        return Rectangle(self.width, self.height, self.color, self.border_width)
    
    def draw(self) -> None:
        print(f"Drawing {self.color} rectangle: {self.width}x{self.height} (border: {self.border_width}px)")
    
    def set_dimensions(self, width: int, height: int) -> None:
        self.width = width
        self.height = height

class Circle(Prototype):
    def __init__(self, radius: int, color: str, border_width: int = 1):
        self.radius = radius
        self.color = color
        self.border_width = border_width
    
    def clone(self) -> 'Circle':
        print(f"Cloning circle: radius {self.radius}, {self.color}")
        return Circle(self.radius, self.color, self.border_width)
    
    def draw(self) -> None:
        print(f"Drawing {self.color} circle: radius {self.radius} (border: {self.border_width}px)")
    
    def set_radius(self, radius: int) -> None:
        self.radius = radius

# Usage
print("--- Creating original shapes ---")
red_rectangle = Rectangle(100, 50, "red", 2)
blue_circle = Circle(30, "blue", 3)

red_rectangle.draw()
blue_circle.draw()

print("\n--- Cloning shapes ---")
another_red_rectangle = red_rectangle.clone()
another_red_rectangle.set_dimensions(150, 75)
another_red_rectangle.draw()

another_blue_circle = blue_circle.clone()
another_blue_circle.set_radius(50)
another_blue_circle.draw()

print("\n--- Original shapes unchanged ---")
red_rectangle.draw()
blue_circle.draw()

# ============================================
# Prototype Registry
# ============================================

print("\n\n=== Prototype Registry ===\n")

class ShapeRegistry:
    def __init__(self):
        self._prototypes: Dict[str, Prototype] = {}
    
    def register_prototype(self, key: str, prototype: Prototype) -> None:
        self._prototypes[key] = prototype
        print(f"✓ Registered prototype: {key}")
    
    def get_prototype(self, key: str) -> Prototype:
        prototype = self._prototypes.get(key)
        if not prototype:
            print(f"❌ Prototype not found: {key}")
            return None
        print(f"Retrieving prototype: {key}")
        return prototype.clone()
    
    def list_prototypes(self) -> None:
        print("\nAvailable prototypes:")
        for key in self._prototypes:
            print(f"  - {key}")

# Create registry
registry = ShapeRegistry()

registry.register_prototype("large-red-rectangle", Rectangle(200, 100, "red", 3))
registry.register_prototype("small-blue-circle", Circle(20, "blue", 1))
registry.register_prototype("medium-green-rectangle", Rectangle(150, 80, "green", 2))

registry.list_prototypes()

# Clone from registry
print("\n--- Cloning from registry ---")
shape1 = registry.get_prototype("large-red-rectangle")
shape2 = registry.get_prototype("small-blue-circle")

if shape1:
    shape1.draw()
if shape2:
    shape2.draw()

# ============================================
# Real-World Example: Document Templates
# ============================================

print("\n\n=== Real-World: Document Templates ===\n")

class Section(Prototype):
    def __init__(self, heading: str, text: str):
        self.heading = heading
        self.text = text
    
    def clone(self) -> 'Section':
        return Section(self.heading, self.text)

class Document(Prototype):
    def __init__(self, title: str, content: str, author: str,
                 metadata: Dict[str, str], sections: List[Section]):
        self.title = title
        self.content = content
        self.author = author
        self.metadata = metadata
        self.sections = sections
    
    def clone(self) -> 'Document':
        print(f'Cloning document: "{self.title}"')
        
        # Deep clone using deepcopy
        return Document(
            self.title,
            self.content,
            self.author,
            self.metadata.copy(),
            [section.clone() for section in self.sections]
        )
    
    def display(self) -> None:
        print(f"\n=== Document: {self.title} ===")
        print(f"Author: {self.author}")
        print(f"Content: {self.content}")
        print(f"Sections: {len(self.sections)}")
        for i, section in enumerate(self.sections, 1):
            print(f"  {i}. {section.heading}")
        print("Metadata:")
        for key, value in self.metadata.items():
            print(f"  {key}: {value}")

# Create templates
print("--- Creating document templates ---")

report_template = Document(
    "Quarterly Report Template",
    "This is a template for quarterly reports",
    "Template System",
    {
        "type": "report",
        "version": "1.0",
        "department": ""
    },
    [
        Section("Executive Summary", "..."),
        Section("Financial Overview", "..."),
        Section("Key Metrics", "..."),
        Section("Recommendations", "...")
    ]
)

# Use template to create documents
print("\n--- Creating documents from templates ---")

q1_report = report_template.clone()
q1_report.title = "Q1 2024 Financial Report"
q1_report.author = "Finance Team"
q1_report.metadata["department"] = "Finance"
q1_report.content = "Q1 showed strong growth..."
q1_report.display()

# ============================================
# Deep Copy vs Shallow Copy
# ============================================

print("\n\n=== Deep Copy vs Shallow Copy ===\n")

class Person(Prototype):
    def __init__(self, name: str, age: int, address: Dict[str, str]):
        self.name = name
        self.age = age
        self.address = address
    
    def shallow_clone(self) -> 'Person':
        print(f"Shallow cloning: {self.name}")
        return copy(self)  # Shallow copy
    
    def clone(self) -> 'Person':
        print(f"Deep cloning: {self.name}")
        return deepcopy(self)  # Deep copy
    
    def display(self) -> None:
        print(f"{self.name} ({self.age}) lives at {self.address['street']}, {self.address['city']}")

print("--- Demonstrating shallow copy problem ---")
original = Person("Alice", 30, {"street": "123 Main St", "city": "New York"})
shallow_copy = original.shallow_clone()

print("\nOriginal:")
original.display()
print("Shallow copy:")
shallow_copy.display()

print("\n--- Modifying shallow copy's address ---")
shallow_copy.address["city"] = "Los Angeles"

print("\nOriginal (affected!):")
original.display()
print("Shallow copy:")
shallow_copy.display()

print("\n\n--- Demonstrating deep copy solution ---")
original2 = Person("Bob", 25, {"street": "456 Oak Ave", "city": "Chicago"})
deep_copy = original2.clone()

print("\nOriginal:")
original2.display()
print("Deep copy:")
deep_copy.display()

print("\n--- Modifying deep copy's address ---")
deep_copy.address["city"] = "Boston"

print("\nOriginal (unchanged!):")
original2.display()
print("Deep copy:")
deep_copy.display()

# ============================================
# Prototype using JSON
# ============================================

print("\n\n=== Prototype using JSON Serialization ===\n")

class Configuration(Prototype):
    def __init__(self, database: dict, cache: dict, features: list):
        self.database = database
        self.cache = cache
        self.features = features
    
    def clone(self) -> 'Configuration':
        print("Cloning configuration using JSON serialization")
        json_str = json.dumps(self.__dict__)
        cloned_dict = json.loads(json_str)
        
        return Configuration(
            cloned_dict['database'],
            cloned_dict['cache'],
            cloned_dict['features']
        )
    
    def display(self) -> None:
        print("\nConfiguration:")
        print(f"  Database: {self.database['host']}:{self.database['port']}")
        print(f"  Cache: {'Enabled' if self.cache['enabled'] else 'Disabled'} (TTL: {self.cache['ttl']}s)")
        print(f"  Features: {', '.join(self.features)}")

prod_config = Configuration(
    {"host": "prod.db.com", "port": 5432, "credentials": {"username": "admin", "password": "secret"}},
    {"enabled": True, "ttl": 3600},
    ["feature-a", "feature-b", "feature-c"]
)

dev_config = prod_config.clone()
dev_config.database["host"] = "localhost"
dev_config.database["port"] = 5433
dev_config.cache["ttl"] = 60
dev_config.features.append("debug-mode")

print("--- Production Config ---")
prod_config.display()

print("\n--- Development Config (cloned and modified) ---")
dev_config.display()

print("\n\n=== Prototype Pattern Summary ===")
print("\nWhen to use:")
print("  ✓ Object creation is expensive/complex")
print("  ✓ Need to avoid subclasses of object creator")
print("  ✓ Objects have few variations of state")
print("  ✓ Want to provide preset configurations")

print("\nBenefits:")
print("  ✓ Clone objects without coupling to classes")
print("  ✓ Avoid repeated initialization")
print("  ✓ Produce complex objects conveniently")

print("\nDrawbacks:")
print("  ⚠ Cloning complex objects with circular references tricky")
print("  ⚠ Must implement clone() for each class")
print("  ⚠ Deep copy vs shallow copy considerations")
```

</details>

---

## Summary - Creational Patterns

This completes all five Creational Patterns:

1. **Singleton**: Ensure only one instance exists (database connection, config manager)
2. **Factory Method**: Create objects without specifying exact class (transport factory)
3. **Abstract Factory**: Create families of related objects (UI components for different OS)
4. **Builder**: Construct complex objects step-by-step (computer builder, query builder)
5. **Prototype**: Clone existing objects instead of creating new ones (document templates, presets)

**Key Principle**: All creational patterns solve problems related to object creation while hiding the creation logic from the client.

---

## Practice Questions - Creational Patterns

<details>
<summary><strong>View Questions</strong></summary>

### Fill in the Blanks

1. The __________ pattern ensures a class has only one instance, while the __________ pattern creates objects by cloning existing instances.

2. Builder pattern solves the __________ constructor problem by allowing step-by-step construction.

3. Abstract Factory creates __________ of related objects, while Factory Method creates __________ product.

4. Prototype pattern uses __________ copy to create independent clones and __________ copy when references should be shared.

<details>
<summary><strong>View Answers</strong></summary>

1. **Singleton**, **Prototype** - Singleton controls instance count (only one). Prototype creates new objects by copying prototypes rather than constructing from scratch.

2. **telescoping** - When a class has many optional parameters, you'd need many constructors (telescoping). Builder solves this with method chaining: `new Builder().setA().setB().build()`.

3. **families**, **one** - Abstract Factory creates multiple related products (Windows Button + Windows Checkbox). Factory Method creates one product type per factory.

4. **deep**, **shallow** - Deep copy creates independent copies (changes don't affect original). Shallow copy shares references (modifying copy affects original).

</details>

---

### True/False

1. ⬜ Singleton pattern violates the Single Responsibility Principle because it manages both its instance lifecycle and business logic.

2. ⬜ Factory Method and Abstract Factory are the same pattern.

3. ⬜ Builder pattern is useful when an object has many required parameters.

4. ⬜ Prototype pattern is best when object creation is inexpensive and simple.

5. ⬜ In Abstract Factory, adding a new product type to the family requires modifying all concrete factories.

<details>
<summary><strong>View Answers</strong></summary>

1. **True** - Singleton has two responsibilities: (1) ensuring single instance, and (2) its actual business logic. This violates SRP. Alternative: use DI container with singleton lifetime.

2. **False** - Factory Method creates ONE product. Abstract Factory creates FAMILIES of related products. Factory Method uses inheritance (subclasses create products). Abstract Factory uses composition (factory object creates family).

3. **False** - Builder is useful when object has many OPTIONAL parameters, not required. For many required parameters, just use constructor with all params. Builder shines with: `new Builder().setOptional1().setOptional2().build()`.

4. **False** - Prototype is best when object creation is EXPENSIVE. If creation is cheap/simple, just use `new Object()`. Prototype saves cost by cloning instead of reconstructing from scratch.

5. **True** - This is a major drawback of Abstract Factory. To add a new product type (e.g., adding Scrollbar to UI factory), you must modify the abstract factory interface AND all concrete implementations (WindowsFactory, MacOSFactory, LinuxFactory).

</details>

---

### Multiple Choice

1. **Which pattern would you use for a logging system where only one instance should exist?**
   - A) Factory Method
   - B) Singleton
   - C) Builder
   - D) Prototype

2. **Which pattern is best for creating UI components that must match a specific style (all Windows or all Mac)?**
   - A) Factory Method
   - B) Singleton
   - C) Abstract Factory
   - D) Builder

3. **What's the main difference between Factory Method and Abstract Factory?**
   - A) Factory Method is simpler
   - B) Factory Method creates one product, Abstract Factory creates families
   - C) They're the same pattern
   - D) Abstract Factory is faster

4. **When should you use Builder pattern?**
   - A) Object has many optional parameters
   - B) Need exactly one instance
   - C) Need to create object families
   - D) Object creation is expensive

<details>
<summary><strong>View Answers</strong></summary>

1. **B** - Singleton ensures only one instance exists globally. Perfect for loggers, configuration managers, database connection pools. Other patterns don't control instance count.

2. **C** - Abstract Factory ensures all products belong to same family. WindowsFactory creates WindowsButton + WindowsCheckbox (matching style). MacOSFactory creates MacOSButton + MacOSCheckbox (matching style).

3. **B** - Factory Method: `LogisticsFactory.createTransport()` → creates ONE product (Truck OR Ship). Abstract Factory: `GUIFactory.createButton() + createCheckbox() + createInput()` → creates FAMILY of products (all Windows or all Mac).

4. **A** - Builder solves telescoping constructor problem. Instead of `new Computer(cpu, ram, storage, gpu, cooling, power, case)` with many optionals, use: `new ComputerBuilder().setCPU().setRAM().build()`. Much cleaner for many optionals.

</details>

</details>

---

## 3. Structural Patterns

Structural patterns deal with object composition - how classes and objects are composed to form larger structures. They help ensure that when one part changes, the entire structure doesn't need to change.

---

### A. Adapter Pattern

**Intent**: Convert the interface of a class into another interface that clients expect. Adapter lets classes work together that couldn't otherwise because of incompatible interfaces.

**Real-world analogy**: Think of a power adapter when traveling internationally. Your US laptop charger (client) expects 110V outlets, but European outlets provide 220V. A power adapter (adapter) converts the European interface to work with your charger.

**When to use**:
- Want to use an existing class but its interface doesn't match what you need
- Need to create a reusable class that cooperates with unrelated classes
- Need to use several existing subclasses but it's impractical to adapt their interface by subclassing

**Pros**:
- Single Responsibility: separate interface conversion from business logic
- Open/Closed: introduce new adapters without breaking existing code
- Reuse existing classes even with incompatible interfaces

**Cons**:
- Overall complexity increases (new classes)
- Sometimes simpler to just change the service class

<details>
<summary><strong>View Adapter Examples</strong></summary>

```typescript
// TypeScript - Adapter Pattern

// ============================================
// Basic Adapter - Payment Processing
// ============================================

console.log("=== Basic Adapter: Payment Processing ===\n");

// Target interface (what our application expects)
interface PaymentProcessor {
  processPayment(amount: number): boolean;
  refund(transactionId: string, amount: number): boolean;
}

// Our existing payment system (uses PaymentProcessor)
class PaymentService {
  constructor(private processor: PaymentProcessor) {}

  checkout(orderId: string, amount: number): void {
    console.log(`\nProcessing order ${orderId}...`);
    const success = this.processor.processPayment(amount);
    if (success) {
      console.log(`✓ Order ${orderId} completed`);
    } else {
      console.log(`✗ Order ${orderId} failed`);
    }
  }
}

// Adaptee 1 - Third-party Stripe library (incompatible interface)
class StripeAPI {
  makeCharge(amountInCents: number, currency: string): { success: boolean; chargeId: string } {
    console.log(`Stripe: Charging ${amountInCents} cents in ${currency}`);
    return { success: true, chargeId: "ch_" + Math.random().toString(36).substring(7) };
  }

  createRefund(chargeId: string, amountInCents: number): boolean {
    console.log(`Stripe: Refunding ${amountInCents} cents for charge ${chargeId}`);
    return true;
  }
}

// Adapter 1 - Makes Stripe compatible with our PaymentProcessor interface
class StripeAdapter implements PaymentProcessor {
  private stripe: StripeAPI;

  constructor() {
    this.stripe = new StripeAPI();
  }

  processPayment(amount: number): boolean {
    // Convert dollars to cents and call Stripe's API
    const amountInCents = Math.round(amount * 100);
    const result = this.stripe.makeCharge(amountInCents, "USD");
    return result.success;
  }

  refund(transactionId: string, amount: number): boolean {
    const amountInCents = Math.round(amount * 100);
    return this.stripe.createRefund(transactionId, amountInCents);
  }
}

// Adaptee 2 - Third-party PayPal library (different incompatible interface)
class PayPalAPI {
  sendPayment(paymentData: { amount: string; currency: string }): string {
    console.log(`PayPal: Processing payment of ${paymentData.currency} ${paymentData.amount}`);
    return "PAYID-" + Math.random().toString(36).substring(7);
  }

  refundTransaction(paymentId: string, refundAmount: string): boolean {
    console.log(`PayPal: Refunding ${refundAmount} for payment ${paymentId}`);
    return true;
  }
}

// Adapter 2 - Makes PayPal compatible with our PaymentProcessor interface
class PayPalAdapter implements PaymentProcessor {
  private paypal: PayPalAPI;

  constructor() {
    this.paypal = new PayPalAPI();
  }

  processPayment(amount: number): boolean {
    const paymentData = {
      amount: amount.toFixed(2),
      currency: "USD"
    };
    const paymentId = this.paypal.sendPayment(paymentData);
    return !!paymentId;
  }

  refund(transactionId: string, amount: number): boolean {
    return this.paypal.refundTransaction(transactionId, amount.toFixed(2));
  }
}

// Client code - works with any payment processor through the adapter
console.log("--- Using Stripe via Adapter ---");
const stripePayment = new PaymentService(new StripeAdapter());
stripePayment.checkout("ORD001", 99.99);

console.log("\n--- Using PayPal via Adapter ---");
const paypalPayment = new PaymentService(new PayPalAdapter());
paypalPayment.checkout("ORD002", 149.99);

// ============================================
// Real-World Example: Legacy Database Adapter
// ============================================

console.log("\n\n=== Real-World: Legacy Database Adapter ===\n");

// Target interface (modern ORM-style interface)
interface Database {
  connect(): Promise<void>;
  query(sql: string, params?: any[]): Promise<any[]>;
  disconnect(): Promise<void>;
}

// Adaptee - Old legacy database library (different interface)
class LegacyMySQLDriver {
  private connected: boolean = false;

  open(host: string, port: number, credentials: { user: string; pass: string }): void {
    console.log(`Legacy driver: Opening connection to ${host}:${port}`);
    this.connected = true;
  }

  executeSQL(sqlString: string): any[] {
    if (!this.connected) {
      throw new Error("Not connected");
    }
    console.log(`Legacy driver: Executing SQL: ${sqlString}`);
    return [{ id: 1, name: "Sample" }];
  }

  close(): void {
    console.log("Legacy driver: Closing connection");
    this.connected = false;
  }

  isConnected(): boolean {
    return this.connected;
  }
}

// Adapter - Makes legacy driver compatible with modern interface
class LegacyDatabaseAdapter implements Database {
  private legacyDriver: LegacyMySQLDriver;
  private host: string;
  private port: number;
  private credentials: { user: string; pass: string };

  constructor(host: string, port: number, user: string, password: string) {
    this.legacyDriver = new LegacyMySQLDriver();
    this.host = host;
    this.port = port;
    this.credentials = { user, pass: password };
  }

  async connect(): Promise<void> {
    console.log("Adapter: Connecting to database...");
    this.legacyDriver.open(this.host, this.port, this.credentials);
  }

  async query(sql: string, params?: any[]): Promise<any[]> {
    console.log("Adapter: Executing query with modern interface...");
    
    // Convert parameterized query to legacy format if needed
    let finalSQL = sql;
    if (params) {
      params.forEach((param, index) => {
        finalSQL = finalSQL.replace(`$${index + 1}`, `'${param}'`);
      });
    }

    return this.legacyDriver.executeSQL(finalSQL);
  }

  async disconnect(): Promise<void> {
    console.log("Adapter: Disconnecting from database...");
    this.legacyDriver.close();
  }
}

// Modern application code using the adapter
class UserRepository {
  constructor(private db: Database) {}

  async findUserById(id: number): Promise<any> {
    await this.db.connect();
    const results = await this.db.query("SELECT * FROM users WHERE id = $1", [id]);
    await this.db.disconnect();
    return results[0];
  }
}

// Usage
(async () => {
  console.log("--- Using Legacy Database via Adapter ---");
  const legacyDB = new LegacyDatabaseAdapter("localhost", 3306, "root", "password");
  const userRepo = new UserRepository(legacyDB);
  
  const user = await userRepo.findUserById(1);
  console.log("User found:", user);
})();

// ============================================
// Real-World Example: API Response Adapter
// ============================================

console.log("\n\n=== Real-World: API Response Adapter ===\n");

// Target interface (what our app expects)
interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: Date;
}

// Adaptee 1 - External API v1 (old format)
class ExternalAPIv1 {
  fetchUser(userId: string): any {
    console.log(`API v1: Fetching user ${userId}`);
    return {
      user_id: userId,
      full_name: "John Doe",
      email_address: "john@example.com",
      profile_picture_url: "https://example.com/john.jpg",
      registration_timestamp: "2023-01-15T10:30:00Z"
    };
  }
}

// Adapter 1 - Converts API v1 format to our app format
class APIv1Adapter {
  private api: ExternalAPIv1;

  constructor() {
    this.api = new ExternalAPIv1();
  }

  getUser(userId: string): User {
    console.log("Adapter v1: Converting API response...");
    const apiResponse = this.api.fetchUser(userId);
    
    // Convert from API v1 format to our app format
    return {
      id: apiResponse.user_id,
      name: apiResponse.full_name,
      email: apiResponse.email_address,
      avatar: apiResponse.profile_picture_url,
      createdAt: new Date(apiResponse.registration_timestamp)
    };
  }
}

// Adaptee 2 - External API v2 (new format)
class ExternalAPIv2 {
  getUser(id: string): any {
    console.log(`API v2: Getting user ${id}`);
    return {
      userId: id,
      displayName: "Jane Smith",
      contact: {
        email: "jane@example.com"
      },
      media: {
        avatarURL: "https://example.com/jane.jpg"
      },
      metadata: {
        signupDate: "2024-03-20T14:45:00Z"
      }
    };
  }
}

// Adapter 2 - Converts API v2 format to our app format
class APIv2Adapter {
  private api: ExternalAPIv2;

  constructor() {
    this.api = new ExternalAPIv2();
  }

  getUser(userId: string): User {
    console.log("Adapter v2: Converting API response...");
    const apiResponse = this.api.getUser(userId);
    
    // Convert from API v2 format to our app format
    return {
      id: apiResponse.userId,
      name: apiResponse.displayName,
      email: apiResponse.contact.email,
      avatar: apiResponse.media.avatarURL,
      createdAt: new Date(apiResponse.metadata.signupDate)
    };
  }
}

// Application code - works with either API version through adapters
class UserService {
  constructor(private userSource: APIv1Adapter | APIv2Adapter) {}

  displayUser(userId: string): void {
    const user = this.userSource.getUser(userId);
    console.log("\n=== User Profile ===");
    console.log(`ID: ${user.id}`);
    console.log(`Name: ${user.name}`);
    console.log(`Email: ${user.email}`);
    console.log(`Avatar: ${user.avatar}`);
    console.log(`Member since: ${user.createdAt.toLocaleDateString()}`);
  }
}

// Usage with API v1
console.log("--- Using API v1 via Adapter ---");
const userServiceV1 = new UserService(new APIv1Adapter());
userServiceV1.displayUser("123");

// Usage with API v2
console.log("\n--- Using API v2 via Adapter ---");
const userServiceV2 = new UserService(new APIv2Adapter());
userServiceV2.displayUser("456");

// ============================================
// Object Adapter vs Class Adapter
// ============================================

console.log("\n\n=== Object Adapter vs Class Adapter ===\n");

// Object Adapter (composition - recommended)
class ObjectAdapter implements PaymentProcessor {
  constructor(private adaptee: StripeAPI) {} // Composition

  processPayment(amount: number): boolean {
    const result = this.adaptee.makeCharge(Math.round(amount * 100), "USD");
    return result.success;
  }

  refund(transactionId: string, amount: number): boolean {
    return this.adaptee.createRefund(transactionId, Math.round(amount * 100));
  }
}

// Class Adapter (inheritance - only in languages supporting multiple inheritance)
// Note: TypeScript/JavaScript doesn't support true multiple inheritance
// This is conceptual demonstration

interface ClassAdapterExample extends PaymentProcessor {
  // Would extend both StripeAPI and implement PaymentProcessor
  // Not possible in TypeScript, but possible in C++, Python
}

console.log("Object Adapter (Composition):");
console.log("  ✓ More flexible - can adapt multiple adaptees");
console.log("  ✓ Follows composition over inheritance");
console.log("  ✓ Can adapt entire class hierarchy");

console.log("\nClass Adapter (Inheritance):");
console.log("  ✓ Can override adaptee behavior");
console.log("  ✓ Less code (no forwarding methods)");
console.log("  ⚠ Only works with single adaptee");
console.log("  ⚠ Requires multiple inheritance");

// ============================================
// Two-Way Adapter
// ============================================

console.log("\n\n=== Two-Way Adapter ===\n");

interface MetricSystem {
  getDistanceInKilometers(): number;
  getWeightInKilograms(): number;
}

interface ImperialSystem {
  getDistanceInMiles(): number;
  getWeightInPounds(): number;
}

class TwoWayAdapter implements MetricSystem, ImperialSystem {
  private distanceKm: number = 0;
  private weightKg: number = 0;

  // Metric setters
  setDistanceKm(km: number): void {
    this.distanceKm = km;
    console.log(`Set distance: ${km} km`);
  }

  setWeightKg(kg: number): void {
    this.weightKg = kg;
    console.log(`Set weight: ${kg} kg`);
  }

  // Metric getters
  getDistanceInKilometers(): number {
    return this.distanceKm;
  }

  getWeightInKilograms(): number {
    return this.weightKg;
  }

  // Imperial setters
  setDistanceMiles(miles: number): void {
    this.distanceKm = miles * 1.60934;
    console.log(`Set distance: ${miles} miles (${this.distanceKm.toFixed(2)} km)`);
  }

  setWeightPounds(pounds: number): void {
    this.weightKg = pounds * 0.453592;
    console.log(`Set weight: ${pounds} lbs (${this.weightKg.toFixed(2)} kg)`);
  }

  // Imperial getters
  getDistanceInMiles(): number {
    return this.distanceKm / 1.60934;
  }

  getWeightInPounds(): number {
    return this.weightKg / 0.453592;
  }
}

const measurement = new TwoWayAdapter();

console.log("--- Setting values in metric ---");
measurement.setDistanceKm(100);
measurement.setWeightKg(75);

console.log("\n--- Reading in imperial ---");
console.log(`Distance: ${measurement.getDistanceInMiles().toFixed(2)} miles`);
console.log(`Weight: ${measurement.getWeightInPounds().toFixed(2)} pounds`);

console.log("\n--- Setting values in imperial ---");
measurement.setDistanceMiles(50);
measurement.setWeightPounds(165);

console.log("\n--- Reading in metric ---");
console.log(`Distance: ${measurement.getDistanceInKilometers().toFixed(2)} km`);
console.log(`Weight: ${measurement.getWeightInKilograms().toFixed(2)} kg`);

// ============================================
// Key Takeaways
// ============================================

console.log("\n\n=== Adapter Pattern Summary ===");
console.log("\nWhen to use:");
console.log("  ✓ Incompatible interfaces between classes");
console.log("  ✓ Want to reuse existing class with incompatible interface");
console.log("  ✓ Need to work with third-party libraries");
console.log("  ✓ Legacy code integration");

console.log("\nBenefits:");
console.log("  ✓ Single Responsibility (interface conversion separate)");
console.log("  ✓ Open/Closed (add new adapters without changing code)");
console.log("  ✓ Reuse existing incompatible classes");

console.log("\nDrawbacks:");
console.log("  ⚠ Increases code complexity");
console.log("  ⚠ Sometimes easier to just change the service class");

console.log("\nCommon Use Cases:");
console.log("  • Third-party API integration");
console.log("  • Legacy system integration");
console.log("  • Database driver compatibility");
console.log("  • Payment gateway integration");
console.log("  • Data format conversion");
```

```python
# Python - Adapter Pattern

from abc import ABC, abstractmethod
from typing import List, Dict
from datetime import datetime

# ============================================
# Basic Adapter - Payment Processing
# ============================================

print("=== Basic Adapter: Payment Processing ===\n")

# Target interface
class PaymentProcessor(ABC):
    @abstractmethod
    def process_payment(self, amount: float) -> bool:
        pass
    
    @abstractmethod
    def refund(self, transaction_id: str, amount: float) -> bool:
        pass

# Our application
class PaymentService:
    def __init__(self, processor: PaymentProcessor):
        self._processor = processor
    
    def checkout(self, order_id: str, amount: float) -> None:
        print(f"\nProcessing order {order_id}...")
        success = self._processor.process_payment(amount)
        if success:
            print(f"✓ Order {order_id} completed")
        else:
            print(f"✗ Order {order_id} failed")

# Adaptee 1 - Stripe
class StripeAPI:
    def make_charge(self, amount_in_cents: int, currency: str) -> Dict:
        print(f"Stripe: Charging {amount_in_cents} cents in {currency}")
        import random
        return {'success': True, 'charge_id': f"ch_{random.randint(1000, 9999)}"}
    
    def create_refund(self, charge_id: str, amount_in_cents: int) -> bool:
        print(f"Stripe: Refunding {amount_in_cents} cents for charge {charge_id}")
        return True

# Adapter 1
class StripeAdapter(PaymentProcessor):
    def __init__(self):
        self._stripe = StripeAPI()
    
    def process_payment(self, amount: float) -> bool:
        amount_in_cents = round(amount * 100)
        result = self._stripe.make_charge(amount_in_cents, "USD")
        return result['success']
    
    def refund(self, transaction_id: str, amount: float) -> bool:
        amount_in_cents = round(amount * 100)
        return self._stripe.create_refund(transaction_id, amount_in_cents)

# Adaptee 2 - PayPal
class PayPalAPI:
    def send_payment(self, payment_data: Dict) -> str:
        print(f"PayPal: Processing payment of {payment_data['currency']} {payment_data['amount']}")
        import random
        return f"PAYID-{random.randint(1000, 9999)}"
    
    def refund_transaction(self, payment_id: str, refund_amount: str) -> bool:
        print(f"PayPal: Refunding {refund_amount} for payment {payment_id}")
        return True

# Adapter 2
class PayPalAdapter(PaymentProcessor):
    def __init__(self):
        self._paypal = PayPalAPI()
    
    def process_payment(self, amount: float) -> bool:
        payment_data = {
            'amount': f"{amount:.2f}",
            'currency': 'USD'
        }
        payment_id = self._paypal.send_payment(payment_data)
        return bool(payment_id)
    
    def refund(self, transaction_id: str, amount: float) -> bool:
        return self._paypal.refund_transaction(transaction_id, f"{amount:.2f}")

# Usage
print("--- Using Stripe via Adapter ---")
stripe_payment = PaymentService(StripeAdapter())
stripe_payment.checkout("ORD001", 99.99)

print("\n--- Using PayPal via Adapter ---")
paypal_payment = PaymentService(PayPalAdapter())
paypal_payment.checkout("ORD002", 149.99)

# ============================================
# Real-World Example: API Response Adapter
# ============================================

print("\n\n=== Real-World: API Response Adapter ===\n")

# Target interface
class User:
    def __init__(self, user_id: str, name: str, email: str, avatar: str, created_at: datetime):
        self.id = user_id
        self.name = name
        self.email = email
        self.avatar = avatar
        self.created_at = created_at

# Adaptee 1
class ExternalAPIv1:
    def fetch_user(self, user_id: str) -> Dict:
        print(f"API v1: Fetching user {user_id}")
        return {
            'user_id': user_id,
            'full_name': 'John Doe',
            'email_address': 'john@example.com',
            'profile_picture_url': 'https://example.com/john.jpg',
            'registration_timestamp': '2023-01-15T10:30:00Z'
        }

# Adapter 1
class APIv1Adapter:
    def __init__(self):
        self._api = ExternalAPIv1()
    
    def get_user(self, user_id: str) -> User:
        print("Adapter v1: Converting API response...")
        api_response = self._api.fetch_user(user_id)
        
        return User(
            user_id=api_response['user_id'],
            name=api_response['full_name'],
            email=api_response['email_address'],
            avatar=api_response['profile_picture_url'],
            created_at=datetime.fromisoformat(api_response['registration_timestamp'].replace('Z', '+00:00'))
        )

# Adaptee 2
class ExternalAPIv2:
    def get_user(self, user_id: str) -> Dict:
        print(f"API v2: Getting user {user_id}")
        return {
            'userId': user_id,
            'displayName': 'Jane Smith',
            'contact': {
                'email': 'jane@example.com'
            },
            'media': {
                'avatarURL': 'https://example.com/jane.jpg'
            },
            'metadata': {
                'signupDate': '2024-03-20T14:45:00Z'
            }
        }

# Adapter 2
class APIv2Adapter:
    def __init__(self):
        self._api = ExternalAPIv2()
    
    def get_user(self, user_id: str) -> User:
        print("Adapter v2: Converting API response...")
        api_response = self._api.get_user(user_id)
        
        return User(
            user_id=api_response['userId'],
            name=api_response['displayName'],
            email=api_response['contact']['email'],
            avatar=api_response['media']['avatarURL'],
            created_at=datetime.fromisoformat(api_response['metadata']['signupDate'].replace('Z', '+00:00'))
        )

# Application code
class UserService:
    def __init__(self, user_source):
        self._user_source = user_source
    
    def display_user(self, user_id: str) -> None:
        user = self._user_source.get_user(user_id)
        print("\n=== User Profile ===")
        print(f"ID: {user.id}")
        print(f"Name: {user.name}")
        print(f"Email: {user.email}")
        print(f"Avatar: {user.avatar}")
        print(f"Member since: {user.created_at.strftime('%Y-%m-%d')}")

# Usage
print("--- Using API v1 via Adapter ---")
user_service_v1 = UserService(APIv1Adapter())
user_service_v1.display_user("123")

print("\n--- Using API v2 via Adapter ---")
user_service_v2 = UserService(APIv2Adapter())
user_service_v2.display_user("456")

# ============================================
# Two-Way Adapter
# ============================================

print("\n\n=== Two-Way Adapter ===\n")

class MetricSystem(ABC):
    @abstractmethod
    def get_distance_in_kilometers(self) -> float:
        pass
    
    @abstractmethod
    def get_weight_in_kilograms(self) -> float:
        pass

class ImperialSystem(ABC):
    @abstractmethod
    def get_distance_in_miles(self) -> float:
        pass
    
    @abstractmethod
    def get_weight_in_pounds(self) -> float:
        pass

class TwoWayAdapter(MetricSystem, ImperialSystem):
    def __init__(self):
        self._distance_km = 0.0
        self._weight_kg = 0.0
    
    # Metric setters
    def set_distance_km(self, km: float) -> None:
        self._distance_km = km
        print(f"Set distance: {km} km")
    
    def set_weight_kg(self, kg: float) -> None:
        self._weight_kg = kg
        print(f"Set weight: {kg} kg")
    
    # Metric getters
    def get_distance_in_kilometers(self) -> float:
        return self._distance_km
    
    def get_weight_in_kilograms(self) -> float:
        return self._weight_kg
    
    # Imperial setters
    def set_distance_miles(self, miles: float) -> None:
        self._distance_km = miles * 1.60934
        print(f"Set distance: {miles} miles ({self._distance_km:.2f} km)")
    
    def set_weight_pounds(self, pounds: float) -> None:
        self._weight_kg = pounds * 0.453592
        print(f"Set weight: {pounds} lbs ({self._weight_kg:.2f} kg)")
    
    # Imperial getters
    def get_distance_in_miles(self) -> float:
        return self._distance_km / 1.60934
    
    def get_weight_in_pounds(self) -> float:
        return self._weight_kg / 0.453592

measurement = TwoWayAdapter()

print("--- Setting values in metric ---")
measurement.set_distance_km(100)
measurement.set_weight_kg(75)

print("\n--- Reading in imperial ---")
print(f"Distance: {measurement.get_distance_in_miles():.2f} miles")
print(f"Weight: {measurement.get_weight_in_pounds():.2f} pounds")

print("\n--- Setting values in imperial ---")
measurement.set_distance_miles(50)
measurement.set_weight_pounds(165)

print("\n--- Reading in metric ---")
print(f"Distance: {measurement.get_distance_in_kilometers():.2f} km")
print(f"Weight: {measurement.get_weight_in_kilograms():.2f} kg")

print("\n\n=== Adapter Pattern Summary ===")
print("\nWhen to use:")
print("  ✓ Incompatible interfaces between classes")
print("  ✓ Want to reuse existing class with incompatible interface")
print("  ✓ Need to work with third-party libraries")
print("  ✓ Legacy code integration")

print("\nBenefits:")
print("  ✓ Single Responsibility (interface conversion separate)")
print("  ✓ Open/Closed (add new adapters without changing code)")
print("  ✓ Reuse existing incompatible classes")

print("\nDrawbacks:")
print("  ⚠ Increases code complexity")
print("  ⚠ Sometimes easier to just change the service class")
```

</details>

---

### B. Decorator Pattern

**Intent**: Attach additional responsibilities to an object dynamically. Decorators provide a flexible alternative to subclassing for extending functionality.

**Real-world analogy**: Think of a coffee shop. You start with plain coffee (base object). You can add milk (decorator), then add sugar (another decorator), then add vanilla (another decorator). Each addition wraps the previous one, adding new behavior without changing the coffee itself.

**When to use**:
- Add responsibilities to individual objects dynamically and transparently
- Responsibilities can be withdrawn
- Extension by subclassing is impractical (too many combinations)
- Want to add features without modifying existing code

**Pros**:
- More flexible than static inheritance
- Responsibilities can be added/removed at runtime
- Avoids feature-laden classes high in the hierarchy
- Single Responsibility: divide functionality between classes

**Cons**:
- Many small objects (complexity)
- Hard to remove a specific wrapper from the stack
- Hard to implement decorator that doesn't depend on order

<details>
<summary><strong>View Decorator Examples</strong></summary>

```typescript
// TypeScript - Decorator Pattern

// ============================================
// Basic Decorator - Coffee Shop
// ============================================

console.log("=== Basic Decorator: Coffee Shop ===\n");

// Component interface
interface Coffee {
  getCost(): number;
  getDescription(): string;
}

// Concrete component
class SimpleCoffee implements Coffee {
  getCost(): number {
    return 2.0;
  }

  getDescription(): string {
    return "Simple coffee";
  }
}

// Base decorator
abstract class CoffeeDecorator implements Coffee {
  constructor(protected coffee: Coffee) {}

  abstract getCost(): number;
  abstract getDescription(): string;
}

// Concrete decorators
class MilkDecorator extends CoffeeDecorator {
  getCost(): number {
    return this.coffee.getCost() + 0.5;
  }

  getDescription(): string {
    return this.coffee.getDescription() + ", milk";
  }
}

class SugarDecorator extends CoffeeDecorator {
  getCost(): number {
    return this.coffee.getCost() + 0.2;
  }

  getDescription(): string {
    return this.coffee.getDescription() + ", sugar";
  }
}

class VanillaDecorator extends CoffeeDecorator {
  getCost(): number {
    return this.coffee.getCost() + 0.7;
  }

  getDescription(): string {
    return this.coffee.getDescription() + ", vanilla";
  }
}

class WhippedCreamDecorator extends CoffeeDecorator {
  getCost(): number {
    return this.coffee.getCost() + 0.8;
  }

  getDescription(): string {
    return this.coffee.getDescription() + ", whipped cream";
  }
}

// Usage
console.log("--- Building Custom Coffee ---");

let coffee: Coffee = new SimpleCoffee();
console.log(`${coffee.getDescription()} - $${coffee.getCost().toFixed(2)}`);

coffee = new MilkDecorator(coffee);
console.log(`${coffee.getDescription()} - $${coffee.getCost().toFixed(2)}`);

coffee = new SugarDecorator(coffee);
console.log(`${coffee.getDescription()} - $${coffee.getCost().toFixed(2)}`);

coffee = new VanillaDecorator(coffee);
console.log(`${coffee.getDescription()} - $${coffee.getCost().toFixed(2)}`);

coffee = new WhippedCreamDecorator(coffee);
console.log(`${coffee.getDescription()} - $${coffee.getCost().toFixed(2)}`);

// Different combination
console.log("\n--- Different Combination ---");
let espresso: Coffee = new SimpleCoffee();
espresso = new VanillaDecorator(espresso);
espresso = new WhippedCreamDecorator(espresso);
console.log(`${espresso.getDescription()} - $${espresso.getCost().toFixed(2)}`);

// ============================================
// Real-World Example: Text Formatting
// ============================================

console.log("\n\n=== Real-World: Text Formatting ===\n");

// Component
interface TextComponent {
  render(): string;
}

// Concrete component
class PlainText implements TextComponent {
  constructor(private text: string) {}

  render(): string {
    return this.text;
  }
}

// Base decorator
abstract class TextDecorator implements TextComponent {
  constructor(protected component: TextComponent) {}

  abstract render(): string;
}

// Concrete decorators
class BoldDecorator extends TextDecorator {
  render(): string {
    return `<strong>${this.component.render()}</strong>`;
  }
}

class ItalicDecorator extends TextDecorator {
  render(): string {
    return `<em>${this.component.render()}</em>`;
  }
}

class UnderlineDecorator extends TextDecorator {
  render(): string {
    return `<u>${this.component.render()}</u>`;
  }
}

class ColorDecorator extends TextDecorator {
  constructor(component: TextComponent, private color: string) {
    super(component);
  }

  render(): string {
    return `<span style="color: ${this.color}">${this.component.render()}</span>`;
  }
}

class LinkDecorator extends TextDecorator {
  constructor(component: TextComponent, private url: string) {
    super(component);
  }

  render(): string {
    return `<a href="${this.url}">${this.component.render()}</a>`;
  }
}

// Usage
console.log("--- Formatting Text ---");

let text: TextComponent = new PlainText("Hello World");
console.log(`Plain: ${text.render()}`);

text = new BoldDecorator(text);
console.log(`Bold: ${text.render()}`);

text = new ItalicDecorator(text);
console.log(`Italic: ${text.render()}`);

text = new ColorDecorator(text, "red");
console.log(`Color: ${text.render()}`);

console.log("\n--- Different Formatting ---");
let link: TextComponent = new PlainText("Click Here");
link = new BoldDecorator(link);
link = new LinkDecorator(link, "https://example.com");
console.log(link.render());

// ============================================
// Real-World Example: Data Stream Processing
// ============================================

console.log("\n\n=== Real-World: Data Stream Processing ===\n");

// Component
interface DataSource {
  writeData(data: string): void;
  readData(): string;
}

// Concrete component
class FileDataSource implements DataSource {
  private data: string = "";
  constructor(private filename: string) {}

  writeData(data: string): void {
    console.log(`Writing to file ${this.filename}: ${data}`);
    this.data = data;
  }

  readData(): string {
    console.log(`Reading from file ${this.filename}`);
    return this.data;
  }
}

// Base decorator
abstract class DataSourceDecorator implements DataSource {
  constructor(protected wrappee: DataSource) {}

  writeData(data: string): void {
    this.wrappee.writeData(data);
  }

  readData(): string {
    return this.wrappee.readData();
  }
}

// Compression decorator
class CompressionDecorator extends DataSourceDecorator {
  writeData(data: string): void {
    const compressed = this.compress(data);
    console.log(`Compressing data: ${data.length} -> ${compressed.length} bytes`);
    super.writeData(compressed);
  }

  readData(): string {
    const data = super.readData();
    const decompressed = this.decompress(data);
    console.log(`Decompressing data: ${data.length} -> ${decompressed.length} bytes`);
    return decompressed;
  }

  private compress(data: string): string {
    // Simulated compression
    return `compressed(${data})`;
  }

  private decompress(data: string): string {
    // Simulated decompression
    return data.replace(/^compressed\(/, '').replace(/\)$/, '');
  }
}

// Encryption decorator
class EncryptionDecorator extends DataSourceDecorator {
  writeData(data: string): void {
    const encrypted = this.encrypt(data);
    console.log(`Encrypting data: ${data}`);
    super.writeData(encrypted);
  }

  readData(): string {
    const data = super.readData();
    const decrypted = this.decrypt(data);
    console.log(`Decrypting data`);
    return decrypted;
  }

  private encrypt(data: string): string {
    // Simulated encryption
    return Buffer.from(data).toString('base64');
  }

  private decrypt(data: string): string {
    // Simulated decryption
    return Buffer.from(data, 'base64').toString('utf-8');
  }
}

// Logging decorator
class LoggingDecorator extends DataSourceDecorator {
  writeData(data: string): void {
    console.log(`[LOG] Writing data at ${new Date().toISOString()}`);
    super.writeData(data);
    console.log(`[LOG] Write completed`);
  }

  readData(): string {
    console.log(`[LOG] Reading data at ${new Date().toISOString()}`);
    const data = super.readData();
    console.log(`[LOG] Read completed`);
    return data;
  }
}

// Usage
console.log("--- Plain File Writing ---");
let source: DataSource = new FileDataSource("data.txt");
source.writeData("Hello World");
console.log(`Read: ${source.readData()}`);

console.log("\n--- With Compression ---");
source = new FileDataSource("data.txt");
source = new CompressionDecorator(source);
source.writeData("Hello World");
console.log(`Read: ${source.readData()}`);

console.log("\n--- With Compression + Encryption ---");
source = new FileDataSource("data.txt");
source = new CompressionDecorator(source);
source = new EncryptionDecorator(source);
source.writeData("Sensitive Data");
console.log(`Read: ${source.readData()}`);

console.log("\n--- With All Features (Logging + Compression + Encryption) ---");
source = new FileDataSource("secure.txt");
source = new LoggingDecorator(source);
source = new CompressionDecorator(source);
source = new EncryptionDecorator(source);
source.writeData("Top Secret Information");
console.log(`Read: ${source.readData()}`);

// ============================================
// Real-World Example: Notification System
// ============================================

console.log("\n\n=== Real-World: Notification System ===\n");

// Component
interface Notifier {
  send(message: string): void;
}

// Concrete component
class EmailNotifier implements Notifier {
  constructor(private email: string) {}

  send(message: string): void {
    console.log(`📧 Sending email to ${this.email}: ${message}`);
  }
}

// Base decorator
abstract class NotifierDecorator implements Notifier {
  constructor(protected notifier: Notifier) {}

  send(message: string): void {
    this.notifier.send(message);
  }
}

// Concrete decorators
class SMSDecorator extends NotifierDecorator {
  constructor(notifier: Notifier, private phone: string) {
    super(notifier);
  }

  send(message: string): void {
    super.send(message); // Send via wrapped notifier first
    this.sendSMS(message);
  }

  private sendSMS(message: string): void {
    console.log(`📱 Sending SMS to ${this.phone}: ${message}`);
  }
}

class SlackDecorator extends NotifierDecorator {
  constructor(notifier: Notifier, private channel: string) {
    super(notifier);
  }

  send(message: string): void {
    super.send(message);
    this.sendSlack(message);
  }

  private sendSlack(message: string): void {
    console.log(`💬 Sending Slack message to ${this.channel}: ${message}`);
  }
}

class FacebookDecorator extends NotifierDecorator {
  constructor(notifier: Notifier, private username: string) {
    super(notifier);
  }

  send(message: string): void {
    super.send(message);
    this.sendFacebook(message);
  }

  private sendFacebook(message: string): void {
    console.log(`📘 Posting to Facebook for ${this.username}: ${message}`);
  }
}

// Usage
console.log("--- Email Only ---");
let notifier: Notifier = new EmailNotifier("user@example.com");
notifier.send("Server is down!");

console.log("\n--- Email + SMS ---");
notifier = new EmailNotifier("user@example.com");
notifier = new SMSDecorator(notifier, "+1234567890");
notifier.send("Critical alert!");

console.log("\n--- Email + SMS + Slack + Facebook ---");
notifier = new EmailNotifier("admin@example.com");
notifier = new SMSDecorator(notifier, "+1234567890");
notifier = new SlackDecorator(notifier, "#alerts");
notifier = new FacebookDecorator(notifier, "admin");
notifier.send("Emergency: Server outage detected!");

// ============================================
// Decorator with Functional Approach
// ============================================

console.log("\n\n=== Functional Decorator Approach ===\n");

type PriceCalculator = (basePrice: number) => number;

const noDiscount: PriceCalculator = (price) => price;

const percentageDiscount = (percentage: number) => 
  (calculator: PriceCalculator): PriceCalculator =>
    (price) => calculator(price) * (1 - percentage / 100);

const fixedDiscount = (amount: number) =>
  (calculator: PriceCalculator): PriceCalculator =>
    (price) => Math.max(0, calculator(price) - amount);

const tax = (taxRate: number) =>
  (calculator: PriceCalculator): PriceCalculator =>
    (price) => calculator(price) * (1 + taxRate / 100);

// Usage
const basePrice = 100;

console.log(`Base price: $${basePrice}`);

const withDiscount = percentageDiscount(10)(noDiscount);
console.log(`With 10% discount: $${withDiscount(basePrice).toFixed(2)}`);

const withDiscountAndTax = tax(8)(percentageDiscount(10)(noDiscount));
console.log(`With 10% discount + 8% tax: $${withDiscountAndTax(basePrice).toFixed(2)}`);

const fullCalculation = tax(8)(fixedDiscount(5)(percentageDiscount(15)(noDiscount)));
console.log(`With 15% discount, $5 off, + 8% tax: $${fullCalculation(basePrice).toFixed(2)}`);

// ============================================
// Key Takeaways
// ============================================

console.log("\n\n=== Decorator Pattern Summary ===");
console.log("\nWhen to use:");
console.log("  ✓ Add responsibilities to objects dynamically");
console.log("  ✓ Responsibilities can be withdrawn");
console.log("  ✓ Too many feature combinations for subclassing");
console.log("  ✓ Can't modify class (third-party library)");

console.log("\nBenefits:");
console.log("  ✓ More flexible than inheritance");
console.log("  ✓ Add/remove responsibilities at runtime");
console.log("  ✓ Combine behaviors in different ways");
console.log("  ✓ Single Responsibility Principle");
console.log("  ✓ Open/Closed Principle");

console.log("\nDrawbacks:");
console.log("  ⚠ Many small objects (complexity)");
console.log("  ⚠ Hard to remove specific wrapper");
console.log("  ⚠ Order-dependent decorators can be confusing");
console.log("  ⚠ Initial configuration can be complex");

console.log("\nCommon Use Cases:");
console.log("  • I/O streams (compression, encryption)");
console.log("  • UI components (borders, scrollbars)");
console.log("  • Notification systems (multi-channel)");
console.log("  • Logging and monitoring");
console.log("  • Caching layers");
```

```python
# Python - Decorator Pattern

from abc import ABC, abstractmethod
from datetime import datetime
import base64

# ============================================
# Basic Decorator - Coffee Shop
# ============================================

print("=== Basic Decorator: Coffee Shop ===\n")

# Component interface
class Coffee(ABC):
    @abstractmethod
    def get_cost(self) -> float:
        pass
    
    @abstractmethod
    def get_description(self) -> str:
        pass

# Concrete component
class SimpleCoffee(Coffee):
    def get_cost(self) -> float:
        return 2.0
    
    def get_description(self) -> str:
        return "Simple coffee"

# Base decorator
class CoffeeDecorator(Coffee):
    def __init__(self, coffee: Coffee):
        self._coffee = coffee
    
    @abstractmethod
    def get_cost(self) -> float:
        pass
    
    @abstractmethod
    def get_description(self) -> str:
        pass

# Concrete decorators
class MilkDecorator(CoffeeDecorator):
    def get_cost(self) -> float:
        return self._coffee.get_cost() + 0.5
    
    def get_description(self) -> str:
        return self._coffee.get_description() + ", milk"

class SugarDecorator(CoffeeDecorator):
    def get_cost(self) -> float:
        return self._coffee.get_cost() + 0.2
    
    def get_description(self) -> str:
        return self._coffee.get_description() + ", sugar"

class VanillaDecorator(CoffeeDecorator):
    def get_cost(self) -> float:
        return self._coffee.get_cost() + 0.7
    
    def get_description(self) -> str:
        return self._coffee.get_description() + ", vanilla"

class WhippedCreamDecorator(CoffeeDecorator):
    def get_cost(self) -> float:
        return self._coffee.get_cost() + 0.8
    
    def get_description(self) -> str:
        return self._coffee.get_description() + ", whipped cream"

# Usage
print("--- Building Custom Coffee ---")

coffee = SimpleCoffee()
print(f"{coffee.get_description()} - ${coffee.get_cost():.2f}")

coffee = MilkDecorator(coffee)
print(f"{coffee.get_description()} - ${coffee.get_cost():.2f}")

coffee = SugarDecorator(coffee)
print(f"{coffee.get_description()} - ${coffee.get_cost():.2f}")

coffee = VanillaDecorator(coffee)
print(f"{coffee.get_description()} - ${coffee.get_cost():.2f}")

coffee = WhippedCreamDecorator(coffee)
print(f"{coffee.get_description()} - ${coffee.get_cost():.2f}")

# Different combination
print("\n--- Different Combination ---")
espresso = SimpleCoffee()
espresso = VanillaDecorator(espresso)
espresso = WhippedCreamDecorator(espresso)
print(f"{espresso.get_description()} - ${espresso.get_cost():.2f}")

# ============================================
# Real-World Example: Text Formatting
# ============================================

print("\n\n=== Real-World: Text Formatting ===\n")

class TextComponent(ABC):
    @abstractmethod
    def render(self) -> str:
        pass

class PlainText(TextComponent):
    def __init__(self, text: str):
        self._text = text
    
    def render(self) -> str:
        return self._text

class TextDecorator(TextComponent):
    def __init__(self, component: TextComponent):
        self._component = component
    
    @abstractmethod
    def render(self) -> str:
        pass

class BoldDecorator(TextDecorator):
    def render(self) -> str:
        return f"<strong>{self._component.render()}</strong>"

class ItalicDecorator(TextDecorator):
    def render(self) -> str:
        return f"<em>{self._component.render()}</em>"

class UnderlineDecorator(TextDecorator):
    def render(self) -> str:
        return f"<u>{self._component.render()}</u>"

class ColorDecorator(TextDecorator):
    def __init__(self, component: TextComponent, color: str):
        super().__init__(component)
        self._color = color
    
    def render(self) -> str:
        return f'<span style="color: {self._color}">{self._component.render()}</span>'

class LinkDecorator(TextDecorator):
    def __init__(self, component: TextComponent, url: str):
        super().__init__(component)
        self._url = url
    
    def render(self) -> str:
        return f'<a href="{self._url}">{self._component.render()}</a>'

# Usage
print("--- Formatting Text ---")

text = PlainText("Hello World")
print(f"Plain: {text.render()}")

text = BoldDecorator(text)
print(f"Bold: {text.render()}")

text = ItalicDecorator(text)
print(f"Italic: {text.render()}")

text = ColorDecorator(text, "red")
print(f"Color: {text.render()}")

print("\n--- Different Formatting ---")
link = PlainText("Click Here")
link = BoldDecorator(link)
link = LinkDecorator(link, "https://example.com")
print(link.render())

# ============================================
# Real-World Example: Data Stream Processing
# ============================================

print("\n\n=== Real-World: Data Stream Processing ===\n")

class DataSource(ABC):
    @abstractmethod
    def write_data(self, data: str) -> None:
        pass
    
    @abstractmethod
    def read_data(self) -> str:
        pass

class FileDataSource(DataSource):
    def __init__(self, filename: str):
        self._filename = filename
        self._data = ""
    
    def write_data(self, data: str) -> None:
        print(f"Writing to file {self._filename}: {data}")
        self._data = data
    
    def read_data(self) -> str:
        print(f"Reading from file {self._filename}")
        return self._data

class DataSourceDecorator(DataSource):
    def __init__(self, wrappee: DataSource):
        self._wrappee = wrappee
    
    def write_data(self, data: str) -> None:
        self._wrappee.write_data(data)
    
    def read_data(self) -> str:
        return self._wrappee.read_data()

class CompressionDecorator(DataSourceDecorator):
    def write_data(self, data: str) -> None:
        compressed = self._compress(data)
        print(f"Compressing data: {len(data)} -> {len(compressed)} bytes")
        super().write_data(compressed)
    
    def read_data(self) -> str:
        data = super().read_data()
        decompressed = self._decompress(data)
        print(f"Decompressing data: {len(data)} -> {len(decompressed)} bytes")
        return decompressed
    
    def _compress(self, data: str) -> str:
        return f"compressed({data})"
    
    def _decompress(self, data: str) -> str:
        return data.replace("compressed(", "").rstrip(")")

class EncryptionDecorator(DataSourceDecorator):
    def write_data(self, data: str) -> None:
        encrypted = self._encrypt(data)
        print(f"Encrypting data: {data}")
        super().write_data(encrypted)
    
    def read_data(self) -> str:
        data = super().read_data()
        decrypted = self._decrypt(data)
        print("Decrypting data")
        return decrypted
    
    def _encrypt(self, data: str) -> str:
        return base64.b64encode(data.encode()).decode()
    
    def _decrypt(self, data: str) -> str:
        return base64.b64decode(data.encode()).decode()

class LoggingDecorator(DataSourceDecorator):
    def write_data(self, data: str) -> None:
        print(f"[LOG] Writing data at {datetime.now().isoformat()}")
        super().write_data(data)
        print("[LOG] Write completed")
    
    def read_data(self) -> str:
        print(f"[LOG] Reading data at {datetime.now().isoformat()}")
        data = super().read_data()
        print("[LOG] Read completed")
        return data

# Usage
print("--- Plain File Writing ---")
source = FileDataSource("data.txt")
source.write_data("Hello World")
print(f"Read: {source.read_data()}")

print("\n--- With Compression ---")
source = FileDataSource("data.txt")
source = CompressionDecorator(source)
source.write_data("Hello World")
print(f"Read: {source.read_data()}")

print("\n--- With Compression + Encryption ---")
source = FileDataSource("data.txt")
source = CompressionDecorator(source)
source = EncryptionDecorator(source)
source.write_data("Sensitive Data")
print(f"Read: {source.read_data()}")

print("\n--- With All Features ---")
source = FileDataSource("secure.txt")
source = LoggingDecorator(source)
source = CompressionDecorator(source)
source = EncryptionDecorator(source)
source.write_data("Top Secret Information")
print(f"Read: {source.read_data()}")

# ============================================
# Real-World Example: Notification System
# ============================================

print("\n\n=== Real-World: Notification System ===\n")

class Notifier(ABC):
    @abstractmethod
    def send(self, message: str) -> None:
        pass

class EmailNotifier(Notifier):
    def __init__(self, email: str):
        self._email = email
    
    def send(self, message: str) -> None:
        print(f"📧 Sending email to {self._email}: {message}")

class NotifierDecorator(Notifier):
    def __init__(self, notifier: Notifier):
        self._notifier = notifier
    
    def send(self, message: str) -> None:
        self._notifier.send(message)

class SMSDecorator(NotifierDecorator):
    def __init__(self, notifier: Notifier, phone: str):
        super().__init__(notifier)
        self._phone = phone
    
    def send(self, message: str) -> None:
        super().send(message)
        self._send_sms(message)
    
    def _send_sms(self, message: str) -> None:
        print(f"📱 Sending SMS to {self._phone}: {message}")

class SlackDecorator(NotifierDecorator):
    def __init__(self, notifier: Notifier, channel: str):
        super().__init__(notifier)
        self._channel = channel
    
    def send(self, message: str) -> None:
        super().send(message)
        self._send_slack(message)
    
    def _send_slack(self, message: str) -> None:
        print(f"💬 Sending Slack message to {self._channel}: {message}")

class FacebookDecorator(NotifierDecorator):
    def __init__(self, notifier: Notifier, username: str):
        super().__init__(notifier)
        self._username = username
    
    def send(self, message: str) -> None:
        super().send(message)
        self._send_facebook(message)
    
    def _send_facebook(self, message: str) -> None:
        print(f"📘 Posting to Facebook for {self._username}: {message}")

# Usage
print("--- Email Only ---")
notifier = EmailNotifier("user@example.com")
notifier.send("Server is down!")

print("\n--- Email + SMS ---")
notifier = EmailNotifier("user@example.com")
notifier = SMSDecorator(notifier, "+1234567890")
notifier.send("Critical alert!")

print("\n--- Email + SMS + Slack + Facebook ---")
notifier = EmailNotifier("admin@example.com")
notifier = SMSDecorator(notifier, "+1234567890")
notifier = SlackDecorator(notifier, "#alerts")
notifier = FacebookDecorator(notifier, "admin")
notifier.send("Emergency: Server outage detected!")

print("\n\n=== Decorator Pattern Summary ===")
print("\nWhen to use:")
print("  ✓ Add responsibilities to objects dynamically")
print("  ✓ Responsibilities can be withdrawn")
print("  ✓ Too many feature combinations for subclassing")

print("\nBenefits:")
print("  ✓ More flexible than inheritance")
print("  ✓ Add/remove responsibilities at runtime")
print("  ✓ Combine behaviors in different ways")
print("  ✓ Single Responsibility Principle")

print("\nDrawbacks:")
print("  ⚠ Many small objects (complexity)")
print("  ⚠ Hard to remove specific wrapper")
print("  ⚠ Order-dependent decorators can be confusing")
```

</details>

---

### C. Facade Pattern

**Intent**: Provide a unified interface to a set of interfaces in a subsystem. Facade defines a higher-level interface that makes the subsystem easier to use.

**Real-world analogy**: Think of a home theater system. Instead of manually turning on the amplifier, setting the input, turning on the DVD player, adjusting the projector, dimming the lights, etc., you have a single remote with a "Watch Movie" button that does all of this for you. The remote is the facade.

**When to use**:
- Want to provide a simple interface to a complex subsystem
- Many dependencies between clients and implementation classes
- Want to layer your subsystems
- Reduce coupling between subsystem and clients

**Pros**:
- Isolates clients from subsystem components
- Promotes weak coupling
- Easier to use, understand, and test
- Can provide a default view for most clients

**Cons**:
- Facade can become a god object coupled to all classes
- May limit access to advanced features

<details>
<summary><strong>View Facade Examples</strong></summary>

```typescript
// TypeScript - Facade Pattern

// ============================================
// Basic Facade - Home Theater
// ============================================

console.log("=== Basic Facade: Home Theater ===\n");

// Complex subsystem classes
class Amplifier {
  on(): void {
    console.log("Amplifier on");
  }

  setVolume(level: number): void {
    console.log(`Setting volume to ${level}`);
  }

  setSurroundSound(): void {
    console.log("Setting surround sound mode");
  }

  off(): void {
    console.log("Amplifier off");
  }
}

class DVDPlayer {
  on(): void {
    console.log("DVD Player on");
  }

  play(movie: string): void {
    console.log(`Playing "${movie}"`);
  }

  stop(): void {
    console.log("Stopping DVD");
  }

  off(): void {
    console.log("DVD Player off");
  }
}

class Projector {
  on(): void {
    console.log("Projector on");
  }

  setWideScreenMode(): void {
    console.log("Projector in widescreen mode");
  }

  off(): void {
    console.log("Projector off");
  }
}

class Lights {
  dim(level: number): void {
    console.log(`Dimming lights to ${level}%`);
  }

  on(): void {
    console.log("Lights on");
  }
}

class Screen {
  down(): void {
    console.log("Screen going down");
  }

  up(): void {
    console.log("Screen going up");
  }
}

// Facade - Simplified interface
class HomeTheaterFacade {
  constructor(
    private amplifier: Amplifier,
    private dvdPlayer: DVDPlayer,
    private projector: Projector,
    private lights: Lights,
    private screen: Screen
  ) {}

  watchMovie(movie: string): void {
    console.log("\n🎬 Get ready to watch a movie...\n");
    this.lights.dim(10);
    this.screen.down();
    this.projector.on();
    this.projector.setWideScreenMode();
    this.amplifier.on();
    this.amplifier.setVolume(5);
    this.amplifier.setSurroundSound();
    this.dvdPlayer.on();
    this.dvdPlayer.play(movie);
    console.log("\n✓ Movie started!\n");
  }

  endMovie(): void {
    console.log("\n🛑 Shutting down theater...\n");
    this.dvdPlayer.stop();
    this.dvdPlayer.off();
    this.amplifier.off();
    this.projector.off();
    this.screen.up();
    this.lights.on();
    console.log("\n✓ Theater shutdown complete\n");
  }
}

// Client code - Simple usage
const amp = new Amplifier();
const dvd = new DVDPlayer();
const projector = new Projector();
const lights = new Lights();
const screen = new Screen();

const homeTheater = new HomeTheaterFacade(amp, dvd, projector, lights, screen);

// Simple interface instead of managing all components
homeTheater.watchMovie("The Matrix");
homeTheater.endMovie();

// ============================================
// Real-World Example: Order Processing System
// ============================================

console.log("\n\n=== Real-World: Order Processing System ===\n");

// Complex subsystems
class InventorySystem {
  checkStock(productId: string, quantity: number): boolean {
    console.log(`[Inventory] Checking stock for ${productId} (qty: ${quantity})`);
    return true; // Simplified
  }

  reserveStock(productId: string, quantity: number): void {
    console.log(`[Inventory] Reserved ${quantity} units of ${productId}`);
  }

  releaseStock(productId: string, quantity: number): void {
    console.log(`[Inventory] Released ${quantity} units of ${productId}`);
  }
}

class PaymentSystem {
  validatePayment(paymentDetails: any): boolean {
    console.log(`[Payment] Validating payment method`);
    return true;
  }

  chargePayment(amount: number): string {
    console.log(`[Payment] Charging $${amount}`);
    return `TXN-${Math.random().toString(36).substring(7)}`;
  }

  refundPayment(transactionId: string): void {
    console.log(`[Payment] Refunding transaction ${transactionId}`);
  }
}

class ShippingSystem {
  calculateShipping(address: string): number {
    console.log(`[Shipping] Calculating shipping to ${address}`);
    return 9.99;
  }

  createShipment(orderId: string, address: string): string {
    console.log(`[Shipping] Creating shipment for order ${orderId}`);
    return `SHIP-${Math.random().toString(36).substring(7)}`;
  }
}

class NotificationSystem {
  sendOrderConfirmation(email: string, orderId: string): void {
    console.log(`[Notification] Sending order confirmation to ${email}`);
  }

  sendShippingNotification(email: string, trackingNumber: string): void {
    console.log(`[Notification] Sending tracking number ${trackingNumber} to ${email}`);
  }
}

class LoggingSystem {
  logOrderCreated(orderId: string): void {
    console.log(`[Log] Order created: ${orderId}`);
  }

  logPaymentProcessed(transactionId: string): void {
    console.log(`[Log] Payment processed: ${transactionId}`);
  }

  logOrderShipped(shipmentId: string): void {
    console.log(`[Log] Order shipped: ${shipmentId}`);
  }
}

// Facade - Simple interface to complex order processing
class OrderFacade {
  constructor(
    private inventory: InventorySystem,
    private payment: PaymentSystem,
    private shipping: ShippingSystem,
    private notification: NotificationSystem,
    private logging: LoggingSystem
  ) {}

  placeOrder(orderData: {
    orderId: string;
    productId: string;
    quantity: number;
    customerEmail: string;
    shippingAddress: string;
    paymentDetails: any;
  }): boolean {
    console.log(`\n📦 Processing order ${orderData.orderId}...\n`);

    try {
      // Check inventory
      if (!this.inventory.checkStock(orderData.productId, orderData.quantity)) {
        console.log("❌ Insufficient stock");
        return false;
      }

      // Reserve inventory
      this.inventory.reserveStock(orderData.productId, orderData.quantity);

      // Calculate total
      const shippingCost = this.shipping.calculateShipping(orderData.shippingAddress);
      const total = (orderData.quantity * 29.99) + shippingCost; // Simplified

      // Process payment
      if (!this.payment.validatePayment(orderData.paymentDetails)) {
        this.inventory.releaseStock(orderData.productId, orderData.quantity);
        console.log("❌ Payment validation failed");
        return false;
      }

      const transactionId = this.payment.chargePayment(total);
      this.logging.logPaymentProcessed(transactionId);

      // Create shipment
      const shipmentId = this.shipping.createShipment(
        orderData.orderId,
        orderData.shippingAddress
      );
      this.logging.logOrderShipped(shipmentId);

      // Send notifications
      this.notification.sendOrderConfirmation(orderData.customerEmail, orderData.orderId);
      this.notification.sendShippingNotification(orderData.customerEmail, shipmentId);

      // Log order
      this.logging.logOrderCreated(orderData.orderId);

      console.log(`\n✓ Order ${orderData.orderId} completed successfully!\n`);
      return true;

    } catch (error) {
      console.log(`\n❌ Order processing failed: ${error}\n`);
      // Rollback would happen here
      return false;
    }
  }
}

// Client code - Simple usage
const orderFacade = new OrderFacade(
  new InventorySystem(),
  new PaymentSystem(),
  new ShippingSystem(),
  new NotificationSystem(),
  new LoggingSystem()
);

// Complex order processing made simple
orderFacade.placeOrder({
  orderId: "ORD-001",
  productId: "PROD-123",
  quantity: 2,
  customerEmail: "customer@example.com",
  shippingAddress: "123 Main St, City, State",
  paymentDetails: { cardNumber: "****1234" }
});

// ============================================
// Real-World Example: Computer Builder
// ============================================

console.log("\n\n=== Real-World: Computer Builder ===\n");

// Complex subsystems
class CPU {
  install(model: string): void {
    console.log(`Installing CPU: ${model}`);
  }

  test(): boolean {
    console.log("Testing CPU... OK");
    return true;
  }
}

class Memory {
  install(size: string): void {
    console.log(`Installing RAM: ${size}`);
  }

  test(): boolean {
    console.log("Testing RAM... OK");
    return true;
  }
}

class Storage {
  install(capacity: string): void {
    console.log(`Installing Storage: ${capacity}`);
  }

  format(): void {
    console.log("Formatting storage...");
  }
}

class GPU {
  install(model: string): void {
    console.log(`Installing GPU: ${model}`);
  }
}

class OperatingSystem {
  install(os: string): void {
    console.log(`Installing OS: ${os}`);
  }

  configure(): void {
    console.log("Configuring OS settings...");
  }

  installDrivers(): void {
    console.log("Installing device drivers...");
  }
}

class BIOS {
  configure(): void {
    console.log("Configuring BIOS settings...");
  }

  setBootOrder(): void {
    console.log("Setting boot order...");
  }
}

// Facade
class ComputerBuilderFacade {
  constructor(
    private cpu: CPU,
    private memory: Memory,
    private storage: Storage,
    private gpu: GPU,
    private os: OperatingSystem,
    private bios: BIOS
  ) {}

  buildGamingPC(): void {
    console.log("\n🎮 Building Gaming PC...\n");
    
    this.cpu.install("Intel i9-13900K");
    this.memory.install("64GB DDR5");
    this.storage.install("2TB NVMe SSD");
    this.gpu.install("NVIDIA RTX 4090");
    
    console.log("\nTesting components...");
    this.cpu.test();
    this.memory.test();
    
    this.storage.format();
    this.bios.configure();
    this.bios.setBootOrder();
    
    this.os.install("Windows 11 Pro");
    this.os.configure();
    this.os.installDrivers();
    
    console.log("\n✓ Gaming PC build complete!\n");
  }

  buildOfficePC(): void {
    console.log("\n💼 Building Office PC...\n");
    
    this.cpu.install("Intel i5-12400");
    this.memory.install("16GB DDR4");
    this.storage.install("512GB SSD");
    
    console.log("\nTesting components...");
    this.cpu.test();
    this.memory.test();
    
    this.storage.format();
    this.bios.configure();
    this.bios.setBootOrder();
    
    this.os.install("Windows 11 Home");
    this.os.configure();
    this.os.installDrivers();
    
    console.log("\n✓ Office PC build complete!\n");
  }

  buildServerPC(): void {
    console.log("\n🖥️ Building Server...\n");
    
    this.cpu.install("AMD EPYC 7763");
    this.memory.install("256GB ECC DDR4");
    this.storage.install("8TB RAID Array");
    
    console.log("\nTesting components...");
    this.cpu.test();
    this.memory.test();
    
    this.storage.format();
    this.bios.configure();
    this.bios.setBootOrder();
    
    this.os.install("Ubuntu Server 22.04");
    this.os.configure();
    this.os.installDrivers();
    
    console.log("\n✓ Server build complete!\n");
  }
}

// Usage
const computerBuilder = new ComputerBuilderFacade(
  new CPU(),
  new Memory(),
  new Storage(),
  new GPU(),
  new OperatingSystem(),
  new BIOS()
);

computerBuilder.buildGamingPC();
computerBuilder.buildOfficePC();

// ============================================
// Real-World Example: API Facade
// ============================================

console.log("\n\n=== Real-World: API Facade ===\n");

// Complex third-party APIs
class WeatherAPI {
  fetchWeather(city: string): any {
    console.log(`[Weather API] Fetching weather for ${city}`);
    return { temp: 72, condition: "Sunny" };
  }
}

class NewsAPI {
  fetchHeadlines(category: string): any[] {
    console.log(`[News API] Fetching ${category} headlines`);
    return [
      { title: "Breaking News 1" },
      { title: "Breaking News 2" }
    ];
  }
}

class StockAPI {
  fetchStockPrice(symbol: string): any {
    console.log(`[Stock API] Fetching price for ${symbol}`);
    return { symbol, price: 150.25, change: +2.5 };
  }
}

class CurrencyAPI {
  convertCurrency(amount: number, from: string, to: string): number {
    console.log(`[Currency API] Converting ${amount} ${from} to ${to}`);
    return amount * 1.12; // Simplified
  }
}

// Facade - Unified dashboard API
class DashboardFacade {
  constructor(
    private weather: WeatherAPI,
    private news: NewsAPI,
    private stock: StockAPI,
    private currency: CurrencyAPI
  ) {}

  getUserDashboard(userId: string, preferences: any): any {
    console.log(`\n📊 Loading dashboard for user ${userId}...\n`);

    const dashboard = {
      weather: null as any,
      news: [] as any[],
      stocks: [] as any[],
      currency: null as any
    };

    // Fetch weather
    if (preferences.showWeather) {
      dashboard.weather = this.weather.fetchWeather(preferences.city);
      console.log(`  Weather: ${dashboard.weather.temp}°F, ${dashboard.weather.condition}`);
    }

    // Fetch news
    if (preferences.showNews) {
      dashboard.news = this.news.fetchHeadlines(preferences.newsCategory);
      console.log(`  News: ${dashboard.news.length} headlines loaded`);
    }

    // Fetch stocks
    if (preferences.watchlist) {
      dashboard.stocks = preferences.watchlist.map((symbol: string) => 
        this.stock.fetchStockPrice(symbol)
      );
      console.log(`  Stocks: ${dashboard.stocks.length} symbols tracked`);
    }

    // Convert currency
    if (preferences.convertCurrency) {
      dashboard.currency = this.currency.convertCurrency(
        100,
        "USD",
        preferences.targetCurrency
      );
      console.log(`  Currency: $100 = ${dashboard.currency} ${preferences.targetCurrency}`);
    }

    console.log("\n✓ Dashboard loaded!\n");
    return dashboard;
  }
}

// Usage
const dashboardAPI = new DashboardFacade(
  new WeatherAPI(),
  new NewsAPI(),
  new StockAPI(),
  new CurrencyAPI()
);

const userDashboard = dashboardAPI.getUserDashboard("user123", {
  showWeather: true,
  city: "San Francisco",
  showNews: true,
  newsCategory: "technology",
  watchlist: ["AAPL", "GOOGL", "MSFT"],
  convertCurrency: true,
  targetCurrency: "EUR"
});

// ============================================
// Key Takeaways
// ============================================

console.log("\n\n=== Facade Pattern Summary ===");
console.log("\nWhen to use:");
console.log("  ✓ Complex subsystem with many components");
console.log("  ✓ Want to provide simple interface to complex system");
console.log("  ✓ Want to layer subsystems");
console.log("  ✓ Many dependencies between clients and implementation");

console.log("\nBenefits:");
console.log("  ✓ Simplifies complex subsystems");
console.log("  ✓ Reduces dependencies on subsystem");
console.log("  ✓ Makes subsystem easier to use");
console.log("  ✓ Promotes loose coupling");

console.log("\nDrawbacks:");
console.log("  ⚠ Facade can become god object");
console.log("  ⚠ May limit access to advanced features");
console.log("  ⚠ Can add extra layer of abstraction");

console.log("\nCommon Use Cases:");
console.log("  • Complex library interfaces");
console.log("  • Legacy system integration");
console.log("  • Order processing systems");
console.log("  • Multi-API dashboards");
console.log("  • System initialization");
```

```python
# Python - Facade Pattern

from typing import List, Dict, Any

# ============================================
# Basic Facade - Home Theater
# ============================================

print("=== Basic Facade: Home Theater ===\n")

# Complex subsystem classes
class Amplifier:
    def on(self) -> None:
        print("Amplifier on")
    
    def set_volume(self, level: int) -> None:
        print(f"Setting volume to {level}")
    
    def set_surround_sound(self) -> None:
        print("Setting surround sound mode")
    
    def off(self) -> None:
        print("Amplifier off")

class DVDPlayer:
    def on(self) -> None:
        print("DVD Player on")
    
    def play(self, movie: str) -> None:
        print(f'Playing "{movie}"')
    
    def stop(self) -> None:
        print("Stopping DVD")
    
    def off(self) -> None:
        print("DVD Player off")

class Projector:
    def on(self) -> None:
        print("Projector on")
    
    def set_wide_screen_mode(self) -> None:
        print("Projector in widescreen mode")
    
    def off(self) -> None:
        print("Projector off")

class Lights:
    def dim(self, level: int) -> None:
        print(f"Dimming lights to {level}%")
    
    def on(self) -> None:
        print("Lights on")

class Screen:
    def down(self) -> None:
        print("Screen going down")
    
    def up(self) -> None:
        print("Screen going up")

# Facade
class HomeTheaterFacade:
    def __init__(self, amplifier: Amplifier, dvd_player: DVDPlayer,
                 projector: Projector, lights: Lights, screen: Screen):
        self._amplifier = amplifier
        self._dvd_player = dvd_player
        self._projector = projector
        self._lights = lights
        self._screen = screen
    
    def watch_movie(self, movie: str) -> None:
        print("\n🎬 Get ready to watch a movie...\n")
        self._lights.dim(10)
        self._screen.down()
        self._projector.on()
        self._projector.set_wide_screen_mode()
        self._amplifier.on()
        self._amplifier.set_volume(5)
        self._amplifier.set_surround_sound()
        self._dvd_player.on()
        self._dvd_player.play(movie)
        print("\n✓ Movie started!\n")
    
    def end_movie(self) -> None:
        print("\n🛑 Shutting down theater...\n")
        self._dvd_player.stop()
        self._dvd_player.off()
        self._amplifier.off()
        self._projector.off()
        self._screen.up()
        self._lights.on()
        print("\n✓ Theater shutdown complete\n")

# Client code
amp = Amplifier()
dvd = DVDPlayer()
projector = Projector()
lights = Lights()
screen = Screen()

home_theater = HomeTheaterFacade(amp, dvd, projector, lights, screen)

home_theater.watch_movie("The Matrix")
home_theater.end_movie()

# ============================================
# Real-World Example: Order Processing
# ============================================

print("\n\n=== Real-World: Order Processing System ===\n")

class InventorySystem:
    def check_stock(self, product_id: str, quantity: int) -> bool:
        print(f"[Inventory] Checking stock for {product_id} (qty: {quantity})")
        return True
    
    def reserve_stock(self, product_id: str, quantity: int) -> None:
        print(f"[Inventory] Reserved {quantity} units of {product_id}")
    
    def release_stock(self, product_id: str, quantity: int) -> None:
        print(f"[Inventory] Released {quantity} units of {product_id}")

class PaymentSystem:
    def validate_payment(self, payment_details: Any) -> bool:
        print("[Payment] Validating payment method")
        return True
    
    def charge_payment(self, amount: float) -> str:
        print(f"[Payment] Charging ${amount}")
        import random
        return f"TXN-{random.randint(1000, 9999)}"
    
    def refund_payment(self, transaction_id: str) -> None:
        print(f"[Payment] Refunding transaction {transaction_id}")

class ShippingSystem:
    def calculate_shipping(self, address: str) -> float:
        print(f"[Shipping] Calculating shipping to {address}")
        return 9.99
    
    def create_shipment(self, order_id: str, address: str) -> str:
        print(f"[Shipping] Creating shipment for order {order_id}")
        import random
        return f"SHIP-{random.randint(1000, 9999)}"

class NotificationSystem:
    def send_order_confirmation(self, email: str, order_id: str) -> None:
        print(f"[Notification] Sending order confirmation to {email}")
    
    def send_shipping_notification(self, email: str, tracking_number: str) -> None:
        print(f"[Notification] Sending tracking number {tracking_number} to {email}")

class LoggingSystem:
    def log_order_created(self, order_id: str) -> None:
        print(f"[Log] Order created: {order_id}")
    
    def log_payment_processed(self, transaction_id: str) -> None:
        print(f"[Log] Payment processed: {transaction_id}")
    
    def log_order_shipped(self, shipment_id: str) -> None:
        print(f"[Log] Order shipped: {shipment_id}")

# Facade
class OrderFacade:
    def __init__(self, inventory: InventorySystem, payment: PaymentSystem,
                 shipping: ShippingSystem, notification: NotificationSystem,
                 logging: LoggingSystem):
        self._inventory = inventory
        self._payment = payment
        self._shipping = shipping
        self._notification = notification
        self._logging = logging
    
    def place_order(self, order_data: Dict[str, Any]) -> bool:
        print(f"\n📦 Processing order {order_data['orderId']}...\n")
        
        try:
            # Check inventory
            if not self._inventory.check_stock(order_data['productId'], order_data['quantity']):
                print("❌ Insufficient stock")
                return False
            
            # Reserve inventory
            self._inventory.reserve_stock(order_data['productId'], order_data['quantity'])
            
            # Calculate total
            shipping_cost = self._shipping.calculate_shipping(order_data['shippingAddress'])
            total = (order_data['quantity'] * 29.99) + shipping_cost
            
            # Process payment
            if not self._payment.validate_payment(order_data['paymentDetails']):
                self._inventory.release_stock(order_data['productId'], order_data['quantity'])
                print("❌ Payment validation failed")
                return False
            
            transaction_id = self._payment.charge_payment(total)
            self._logging.log_payment_processed(transaction_id)
            
            # Create shipment
            shipment_id = self._shipping.create_shipment(
                order_data['orderId'],
                order_data['shippingAddress']
            )
            self._logging.log_order_shipped(shipment_id)
            
            # Send notifications
            self._notification.send_order_confirmation(
                order_data['customerEmail'],
                order_data['orderId']
            )
            self._notification.send_shipping_notification(
                order_data['customerEmail'],
                shipment_id
            )
            
            # Log order
            self._logging.log_order_created(order_data['orderId'])
            
            print(f"\n✓ Order {order_data['orderId']} completed successfully!\n")
            return True
            
        except Exception as error:
            print(f"\n❌ Order processing failed: {error}\n")
            return False

# Usage
order_facade = OrderFacade(
    InventorySystem(),
    PaymentSystem(),
    ShippingSystem(),
    NotificationSystem(),
    LoggingSystem()
)

order_facade.place_order({
    'orderId': 'ORD-001',
    'productId': 'PROD-123',
    'quantity': 2,
    'customerEmail': 'customer@example.com',
    'shippingAddress': '123 Main St, City, State',
    'paymentDetails': {'cardNumber': '****1234'}
})

print("\n\n=== Facade Pattern Summary ===")
print("\nWhen to use:")
print("  ✓ Complex subsystem with many components")
print("  ✓ Want to provide simple interface to complex system")
print("  ✓ Want to layer subsystems")

print("\nBenefits:")
print("  ✓ Simplifies complex subsystems")
print("  ✓ Reduces dependencies on subsystem")
print("  ✓ Makes subsystem easier to use")
print("  ✓ Promotes loose coupling")

print("\nDrawbacks:")
print("  ⚠ Facade can become god object")
print("  ⚠ May limit access to advanced features")
```

</details>

---

### D. Proxy Pattern

**Intent**: Provide a surrogate or placeholder for another object to control access to it.

**Real-world analogy**: Think of a credit card as a proxy for cash in your bank account. The credit card controls access to your actual money - it adds authorization checks, tracks spending, provides credit limits, etc., without you needing to carry cash everywhere.

**When to use**:
- Control access to an object (protection proxy)
- Delay expensive object creation (virtual proxy)
- Represent remote object locally (remote proxy)
- Add logging, caching, or lazy initialization

**Types of Proxies**:
1. **Virtual Proxy**: Delays creation of expensive objects until needed
2. **Protection Proxy**: Controls access based on permissions
3. **Remote Proxy**: Represents object in different address space
4. **Caching Proxy**: Caches results to improve performance
5. **Smart Reference**: Adds additional actions when object is accessed

**Pros**:
- Controls access to service object
- Manages lifecycle of service object
- Works even when service object isn't ready
- Open/Closed Principle: introduce new proxies without changing service

**Cons**:
- Increased complexity
- Response delay possible
- Code becomes more complicated

<details>
<summary><strong>View Proxy Examples</strong></summary>

```typescript
// TypeScript - Proxy Pattern

// ============================================
// Virtual Proxy - Lazy Loading
// ============================================

console.log("=== Virtual Proxy: Lazy Loading ===\n");

// Subject interface
interface Image {
  display(): void;
  getSize(): number;
}

// Real subject - expensive to create
class RealImage implements Image {
  private filename: string;
  private imageData: string;

  constructor(filename: string) {
    this.filename = filename;
    this.loadFromDisk();
  }

  private loadFromDisk(): void {
    console.log(`Loading ${this.filename} from disk... (expensive operation)`);
    // Simulate expensive loading
    this.imageData = `[Image data of ${this.filename}]`;
  }

  display(): void {
    console.log(`Displaying ${this.filename}`);
  }

  getSize(): number {
    return this.imageData.length;
  }
}

// Virtual Proxy - delays creation until needed
class ImageProxy implements Image {
  private realImage: RealImage | null = null;
  private filename: string;

  constructor(filename: string) {
    this.filename = filename;
    console.log(`ImageProxy created for ${filename} (no loading yet)`);
  }

  display(): void {
    // Create real object only when needed (lazy loading)
    if (!this.realImage) {
      console.log("First access - loading real image...");
      this.realImage = new RealImage(this.filename);
    }
    this.realImage.display();
  }

  getSize(): number {
    if (!this.realImage) {
      return 0; // Return estimate without loading
    }
    return this.realImage.getSize();
  }
}

// Client code
console.log("--- Creating image proxies ---");
const image1: Image = new ImageProxy("photo1.jpg");
const image2: Image = new ImageProxy("photo2.jpg");
const image3: Image = new ImageProxy("photo3.jpg");

console.log("\n--- Displaying only one image ---");
image1.display(); // Only image1 is actually loaded

console.log("\n--- Displaying another image ---");
image2.display(); // Only now image2 is loaded

console.log("\n--- Displaying first image again ---");
image1.display(); // Already loaded, no reload

// ============================================
// Protection Proxy - Access Control
// ============================================

console.log("\n\n=== Protection Proxy: Access Control ===\n");

// Subject interface
interface Document {
  read(): string;
  write(content: string): void;
  delete(): void;
}

// Real subject
class SecretDocument implements Document {
  private content: string = "Confidential data";

  read(): string {
    console.log("Reading document content");
    return this.content;
  }

  write(content: string): void {
    console.log(`Writing: ${content}`);
    this.content = content;
  }

  delete(): void {
    console.log("Document deleted");
    this.content = "";
  }
}

// Protection Proxy - controls access
class DocumentProxy implements Document {
  private document: SecretDocument;
  private userRole: string;

  constructor(userRole: string) {
    this.document = new SecretDocument();
    this.userRole = userRole;
  }

  read(): string {
    console.log(`[Proxy] Checking read permission for ${this.userRole}...`);
    
    if (this.hasReadPermission()) {
      console.log("[Proxy] ✓ Access granted");
      return this.document.read();
    } else {
      console.log("[Proxy] ✗ Access denied");
      throw new Error("Permission denied: Cannot read document");
    }
  }

  write(content: string): void {
    console.log(`[Proxy] Checking write permission for ${this.userRole}...`);
    
    if (this.hasWritePermission()) {
      console.log("[Proxy] ✓ Access granted");
      this.document.write(content);
    } else {
      console.log("[Proxy] ✗ Access denied");
      throw new Error("Permission denied: Cannot write to document");
    }
  }

  delete(): void {
    console.log(`[Proxy] Checking delete permission for ${this.userRole}...`);
    
    if (this.hasDeletePermission()) {
      console.log("[Proxy] ✓ Access granted");
      this.document.delete();
    } else {
      console.log("[Proxy] ✗ Access denied");
      throw new Error("Permission denied: Cannot delete document");
    }
  }

  private hasReadPermission(): boolean {
    return ["admin", "manager", "employee"].includes(this.userRole);
  }

  private hasWritePermission(): boolean {
    return ["admin", "manager"].includes(this.userRole);
  }

  private hasDeletePermission(): boolean {
    return ["admin"].includes(this.userRole);
  }
}

// Usage
console.log("--- Admin User ---");
const adminDoc = new DocumentProxy("admin");
adminDoc.read();
adminDoc.write("Updated confidential data");
adminDoc.delete();

console.log("\n--- Manager User ---");
const managerDoc = new DocumentProxy("manager");
managerDoc.read();
managerDoc.write("Manager's update");
try {
  managerDoc.delete(); // Will fail
} catch (e) {
  console.log(`Error: ${e.message}`);
}

console.log("\n--- Employee User ---");
const employeeDoc = new DocumentProxy("employee");
employeeDoc.read();
try {
  employeeDoc.write("Unauthorized edit"); // Will fail
} catch (e) {
  console.log(`Error: ${e.message}`);
}

// ============================================
// Caching Proxy
// ============================================

console.log("\n\n=== Caching Proxy ===\n");

// Subject interface
interface DataService {
  fetchData(key: string): any;
}

// Real subject - expensive database calls
class DatabaseService implements DataService {
  fetchData(key: string): any {
    console.log(`[Database] Querying database for key: ${key}... (slow operation)`);
    // Simulate expensive operation
    return { key, data: `Data for ${key}`, timestamp: Date.now() };
  }
}

// Caching Proxy
class CachingProxy implements DataService {
  private database: DatabaseService;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTTL: number = 5000; // 5 seconds

  constructor() {
    this.database = new DatabaseService();
  }

  fetchData(key: string): any {
    console.log(`[Cache Proxy] Checking cache for key: ${key}`);

    // Check if cached and not expired
    if (this.cache.has(key)) {
      const cached = this.cache.get(key)!;
      const age = Date.now() - cached.timestamp;

      if (age < this.cacheTTL) {
        console.log(`[Cache Proxy] ✓ Cache hit! (age: ${age}ms)`);
        return cached.data;
      } else {
        console.log(`[Cache Proxy] Cache expired (age: ${age}ms)`);
        this.cache.delete(key);
      }
    } else {
      console.log("[Cache Proxy] Cache miss");
    }

    // Fetch from database and cache
    const data = this.database.fetchData(key);
    this.cache.set(key, { data, timestamp: Date.now() });
    console.log("[Cache Proxy] Data cached");
    
    return data;
  }

  clearCache(): void {
    console.log("[Cache Proxy] Cache cleared");
    this.cache.clear();
  }
}

// Usage
const dataService: DataService = new CachingProxy();

console.log("--- First fetch (cache miss) ---");
dataService.fetchData("user:123");

console.log("\n--- Second fetch (cache hit) ---");
dataService.fetchData("user:123");

console.log("\n--- Fetch different key (cache miss) ---");
dataService.fetchData("user:456");

console.log("\n--- Fetch first key again (cache hit) ---");
dataService.fetchData("user:123");

// ============================================
// Remote Proxy - API Client
// ============================================

console.log("\n\n=== Remote Proxy: API Client ===\n");

// Subject interface
interface UserService {
  getUser(id: string): any;
  updateUser(id: string, data: any): boolean;
}

// Real subject - remote server
class RemoteUserService implements UserService {
  private apiUrl: string = "https://api.example.com";

  getUser(id: string): any {
    console.log(`[Remote] Sending HTTP GET to ${this.apiUrl}/users/${id}`);
    // Simulate network call
    return { id, name: `User ${id}`, email: `user${id}@example.com` };
  }

  updateUser(id: string, data: any): boolean {
    console.log(`[Remote] Sending HTTP PUT to ${this.apiUrl}/users/${id}`);
    console.log(`[Remote] Payload:`, data);
    return true;
  }
}

// Remote Proxy - adds logging, error handling, retry logic
class UserServiceProxy implements UserService {
  private remoteService: RemoteUserService;
  private requestCount: number = 0;

  constructor() {
    this.remoteService = new RemoteUserService();
  }

  getUser(id: string): any {
    this.requestCount++;
    console.log(`[Proxy] Request #${this.requestCount}`);
    console.log(`[Proxy] Validating user ID: ${id}`);

    if (!id || id.trim() === "") {
      console.log("[Proxy] ✗ Invalid user ID");
      throw new Error("Invalid user ID");
    }

    console.log("[Proxy] ✓ Validation passed");
    console.log("[Proxy] Forwarding request to remote service...");

    try {
      const result = this.remoteService.getUser(id);
      console.log("[Proxy] ✓ Request successful");
      return result;
    } catch (error) {
      console.log("[Proxy] ✗ Request failed, retrying...");
      // Could implement retry logic here
      throw error;
    }
  }

  updateUser(id: string, data: any): boolean {
    this.requestCount++;
    console.log(`[Proxy] Request #${this.requestCount}`);
    console.log("[Proxy] Logging update operation...");
    console.log(`[Proxy] User ${id} data will be updated`);
    
    const result = this.remoteService.updateUser(id, data);
    
    if (result) {
      console.log("[Proxy] ✓ Update logged successfully");
    }
    
    return result;
  }

  getRequestCount(): number {
    return this.requestCount;
  }
}

// Usage
const userService: UserService = new UserServiceProxy();

console.log("--- Get User ---");
const user = userService.getUser("123");
console.log("User data:", user);

console.log("\n--- Update User ---");
userService.updateUser("123", { name: "Updated Name" });

console.log("\n--- Invalid Request ---");
try {
  userService.getUser("");
} catch (e) {
  console.log(`Caught error: ${e.message}`);
}

if (userService instanceof UserServiceProxy) {
  console.log(`\nTotal requests made: ${userService.getRequestCount()}`);
}

// ============================================
// Smart Reference Proxy - Logging & Monitoring
// ============================================

console.log("\n\n=== Smart Reference Proxy ===\n");

// Subject interface
interface BankAccount {
  deposit(amount: number): void;
  withdraw(amount: number): boolean;
  getBalance(): number;
}

// Real subject
class RealBankAccount implements BankAccount {
  private balance: number = 0;

  deposit(amount: number): void {
    this.balance += amount;
  }

  withdraw(amount: number): boolean {
    if (amount > this.balance) {
      return false;
    }
    this.balance -= amount;
    return true;
  }

  getBalance(): number {
    return this.balance;
  }
}

// Smart Reference Proxy - adds logging, monitoring, validation
class BankAccountProxy implements BankAccount {
  private account: RealBankAccount;
  private accountId: string;
  private transactionLog: string[] = [];

  constructor(accountId: string) {
    this.accountId = accountId;
    this.account = new RealBankAccount();
    console.log(`[Proxy] Bank account ${accountId} initialized`);
  }

  deposit(amount: number): void {
    console.log(`[Proxy] Processing deposit: $${amount}`);
    
    // Validation
    if (amount <= 0) {
      console.log("[Proxy] ✗ Invalid deposit amount");
      throw new Error("Deposit amount must be positive");
    }

    // Log before operation
    const timestamp = new Date().toISOString();
    this.transactionLog.push(`${timestamp} - DEPOSIT: $${amount}`);

    // Perform operation
    this.account.deposit(amount);

    // Log after operation
    console.log(`[Proxy] ✓ Deposit successful. New balance: $${this.account.getBalance()}`);
    this.notifyLargeTransaction(amount, "DEPOSIT");
  }

  withdraw(amount: number): boolean {
    console.log(`[Proxy] Processing withdrawal: $${amount}`);

    // Validation
    if (amount <= 0) {
      console.log("[Proxy] ✗ Invalid withdrawal amount");
      throw new Error("Withdrawal amount must be positive");
    }

    // Check for suspicious activity
    if (amount > 10000) {
      console.log("[Proxy] ⚠ Large withdrawal detected - additional verification required");
    }

    // Log before operation
    const timestamp = new Date().toISOString();
    this.transactionLog.push(`${timestamp} - WITHDRAWAL: $${amount}`);

    // Perform operation
    const success = this.account.withdraw(amount);

    if (success) {
      console.log(`[Proxy] ✓ Withdrawal successful. New balance: $${this.account.getBalance()}`);
      this.notifyLargeTransaction(amount, "WITHDRAWAL");
    } else {
      console.log("[Proxy] ✗ Insufficient funds");
    }

    return success;
  }

  getBalance(): number {
    console.log("[Proxy] Balance inquiry");
    return this.account.getBalance();
  }

  getTransactionHistory(): string[] {
    console.log("[Proxy] Retrieving transaction history");
    return [...this.transactionLog];
  }

  private notifyLargeTransaction(amount: number, type: string): void {
    if (amount >= 5000) {
      console.log(`[Proxy] 🔔 Alert: Large ${type} of $${amount} on account ${this.accountId}`);
    }
  }
}

// Usage
const account: BankAccount = new BankAccountProxy("ACC-123");

console.log("\n--- Deposit ---");
account.deposit(1000);

console.log("\n--- Withdraw ---");
account.withdraw(300);

console.log("\n--- Large Deposit ---");
account.deposit(6000);

console.log("\n--- Balance ---");
console.log(`Current balance: $${account.getBalance()}`);

if (account instanceof BankAccountProxy) {
  console.log("\n--- Transaction History ---");
  account.getTransactionHistory().forEach(log => console.log(log));
}

// ============================================
// Key Takeaways
// ============================================

console.log("\n\n=== Proxy Pattern Summary ===");
console.log("\nTypes of Proxies:");
console.log("  • Virtual Proxy: Lazy loading of expensive objects");
console.log("  • Protection Proxy: Access control and permissions");
console.log("  • Caching Proxy: Cache results for performance");
console.log("  • Remote Proxy: Represent remote objects locally");
console.log("  • Smart Reference: Additional functionality (logging, counting)");

console.log("\nWhen to use:");
console.log("  ✓ Control access to an object");
console.log("  ✓ Delay expensive object creation");
console.log("  ✓ Add logging, caching, or validation");
console.log("  ✓ Implement lazy initialization");

console.log("\nBenefits:");
console.log("  ✓ Controls access to service object");
console.log("  ✓ Manages lifecycle of service object");
console.log("  ✓ Works even when service isn't ready");
console.log("  ✓ Open/Closed Principle");

console.log("\nDrawbacks:");
console.log("  ⚠ Increased complexity");
console.log("  ⚠ Possible response delay");
console.log("  ⚠ More code to maintain");

console.log("\nCommon Use Cases:");
console.log("  • Lazy loading images/resources");
console.log("  • Access control/security");
console.log("  • Caching database queries");
console.log("  • API client wrappers");
console.log("  • Transaction logging");
```

```python
# Python - Proxy Pattern

from abc import ABC, abstractmethod
from typing import Dict, List, Any, Optional
from datetime import datetime

# ============================================
# Virtual Proxy - Lazy Loading
# ============================================

print("=== Virtual Proxy: Lazy Loading ===\n")

class Image(ABC):
    @abstractmethod
    def display(self) -> None:
        pass
    
    @abstractmethod
    def get_size(self) -> int:
        pass

class RealImage(Image):
    def __init__(self, filename: str):
        self._filename = filename
        self._load_from_disk()
    
    def _load_from_disk(self) -> None:
        print(f"Loading {self._filename} from disk... (expensive operation)")
        self._image_data = f"[Image data of {self._filename}]"
    
    def display(self) -> None:
        print(f"Displaying {self._filename}")
    
    def get_size(self) -> int:
        return len(self._image_data)

class ImageProxy(Image):
    def __init__(self, filename: str):
        self._filename = filename
        self._real_image: Optional[RealImage] = None
        print(f"ImageProxy created for {filename} (no loading yet)")
    
    def display(self) -> None:
        if not self._real_image:
            print("First access - loading real image...")
            self._real_image = RealImage(self._filename)
        self._real_image.display()
    
    def get_size(self) -> int:
        if not self._real_image:
            return 0
        return self._real_image.get_size()

# Usage
print("--- Creating image proxies ---")
image1 = ImageProxy("photo1.jpg")
image2 = ImageProxy("photo2.jpg")

print("\n--- Displaying only one image ---")
image1.display()

print("\n--- Displaying another image ---")
image2.display()

print("\n--- Displaying first image again ---")
image1.display()

# ============================================
# Protection Proxy - Access Control
# ============================================

print("\n\n=== Protection Proxy: Access Control ===\n")

class Document(ABC):
    @abstractmethod
    def read(self) -> str:
        pass
    
    @abstractmethod
    def write(self, content: str) -> None:
        pass
    
    @abstractmethod
    def delete(self) -> None:
        pass

class SecretDocument(Document):
    def __init__(self):
        self._content = "Confidential data"
    
    def read(self) -> str:
        print("Reading document content")
        return self._content
    
    def write(self, content: str) -> None:
        print(f"Writing: {content}")
        self._content = content
    
    def delete(self) -> None:
        print("Document deleted")
        self._content = ""

class DocumentProxy(Document):
    def __init__(self, user_role: str):
        self._document = SecretDocument()
        self._user_role = user_role
    
    def read(self) -> str:
        print(f"[Proxy] Checking read permission for {self._user_role}...")
        
        if self._has_read_permission():
            print("[Proxy] ✓ Access granted")
            return self._document.read()
        else:
            print("[Proxy] ✗ Access denied")
            raise PermissionError("Cannot read document")
    
    def write(self, content: str) -> None:
        print(f"[Proxy] Checking write permission for {self._user_role}...")
        
        if self._has_write_permission():
            print("[Proxy] ✓ Access granted")
            self._document.write(content)
        else:
            print("[Proxy] ✗ Access denied")
            raise PermissionError("Cannot write to document")
    
    def delete(self) -> None:
        print(f"[Proxy] Checking delete permission for {self._user_role}...")
        
        if self._has_delete_permission():
            print("[Proxy] ✓ Access granted")
            self._document.delete()
        else:
            print("[Proxy] ✗ Access denied")
            raise PermissionError("Cannot delete document")
    
    def _has_read_permission(self) -> bool:
        return self._user_role in ["admin", "manager", "employee"]
    
    def _has_write_permission(self) -> bool:
        return self._user_role in ["admin", "manager"]
    
    def _has_delete_permission(self) -> bool:
        return self._user_role == "admin"

# Usage
print("--- Admin User ---")
admin_doc = DocumentProxy("admin")
admin_doc.read()
admin_doc.write("Updated confidential data")
admin_doc.delete()

print("\n--- Manager User ---")
manager_doc = DocumentProxy("manager")
manager_doc.read()
manager_doc.write("Manager's update")
try:
    manager_doc.delete()
except PermissionError as e:
    print(f"Error: {e}")

print("\n--- Employee User ---")
employee_doc = DocumentProxy("employee")
employee_doc.read()
try:
    employee_doc.write("Unauthorized edit")
except PermissionError as e:
    print(f"Error: {e}")

# ============================================
# Caching Proxy
# ============================================

print("\n\n=== Caching Proxy ===\n")

class DataService(ABC):
    @abstractmethod
    def fetch_data(self, key: str) -> Any:
        pass

class DatabaseService(DataService):
    def fetch_data(self, key: str) -> Any:
        print(f"[Database] Querying database for key: {key}... (slow operation)")
        import time
        return {'key': key, 'data': f'Data for {key}', 'timestamp': time.time()}

class CachingProxy(DataService):
    def __init__(self):
        self._database = DatabaseService()
        self._cache: Dict[str, Dict] = {}
        self._cache_ttl = 5  # seconds
    
    def fetch_data(self, key: str) -> Any:
        print(f"[Cache Proxy] Checking cache for key: {key}")
        
        if key in self._cache:
            cached = self._cache[key]
            import time
            age = time.time() - cached['timestamp']
            
            if age < self._cache_ttl:
                print(f"[Cache Proxy] ✓ Cache hit! (age: {age:.2f}s)")
                return cached['data']
            else:
                print(f"[Cache Proxy] Cache expired (age: {age:.2f}s)")
                del self._cache[key]
        else:
            print("[Cache Proxy] Cache miss")
        
        # Fetch and cache
        import time
        data = self._database.fetch_data(key)
        self._cache[key] = {'data': data, 'timestamp': time.time()}
        print("[Cache Proxy] Data cached")
        
        return data

# Usage
data_service = CachingProxy()

print("--- First fetch (cache miss) ---")
data_service.fetch_data("user:123")

print("\n--- Second fetch (cache hit) ---")
data_service.fetch_data("user:123")

print("\n--- Fetch different key (cache miss) ---")
data_service.fetch_data("user:456")

# ============================================
# Smart Reference Proxy
# ============================================

print("\n\n=== Smart Reference Proxy ===\n")

class BankAccount(ABC):
    @abstractmethod
    def deposit(self, amount: float) -> None:
        pass
    
    @abstractmethod
    def withdraw(self, amount: float) -> bool:
        pass
    
    @abstractmethod
    def get_balance(self) -> float:
        pass

class RealBankAccount(BankAccount):
    def __init__(self):
        self._balance = 0.0
    
    def deposit(self, amount: float) -> None:
        self._balance += amount
    
    def withdraw(self, amount: float) -> bool:
        if amount > self._balance:
            return False
        self._balance -= amount
        return True
    
    def get_balance(self) -> float:
        return self._balance

class BankAccountProxy(BankAccount):
    def __init__(self, account_id: str):
        self._account = RealBankAccount()
        self._account_id = account_id
        self._transaction_log: List[str] = []
        print(f"[Proxy] Bank account {account_id} initialized")
    
    def deposit(self, amount: float) -> None:
        print(f"[Proxy] Processing deposit: ${amount}")
        
        if amount <= 0:
            print("[Proxy] ✗ Invalid deposit amount")
            raise ValueError("Deposit amount must be positive")
        
        timestamp = datetime.now().isoformat()
        self._transaction_log.append(f"{timestamp} - DEPOSIT: ${amount}")
        
        self._account.deposit(amount)
        
        print(f"[Proxy] ✓ Deposit successful. New balance: ${self._account.get_balance()}")
        self._notify_large_transaction(amount, "DEPOSIT")
    
    def withdraw(self, amount: float) -> bool:
        print(f"[Proxy] Processing withdrawal: ${amount}")
        
        if amount <= 0:
            print("[Proxy] ✗ Invalid withdrawal amount")
            raise ValueError("Withdrawal amount must be positive")
        
        if amount > 10000:
            print("[Proxy] ⚠ Large withdrawal detected - additional verification required")
        
        timestamp = datetime.now().isoformat()
        self._transaction_log.append(f"{timestamp} - WITHDRAWAL: ${amount}")
        
        success = self._account.withdraw(amount)
        
        if success:
            print(f"[Proxy] ✓ Withdrawal successful. New balance: ${self._account.get_balance()}")
            self._notify_large_transaction(amount, "WITHDRAWAL")
        else:
            print("[Proxy] ✗ Insufficient funds")
        
        return success
    
    def get_balance(self) -> float:
        print("[Proxy] Balance inquiry")
        return self._account.get_balance()
    
    def get_transaction_history(self) -> List[str]:
        print("[Proxy] Retrieving transaction history")
        return self._transaction_log.copy()
    
    def _notify_large_transaction(self, amount: float, trans_type: str) -> None:
        if amount >= 5000:
            print(f"[Proxy] 🔔 Alert: Large {trans_type} of ${amount} on account {self._account_id}")

# Usage
account = BankAccountProxy("ACC-123")

print("\n--- Deposit ---")
account.deposit(1000)

print("\n--- Withdraw ---")
account.withdraw(300)

print("\n--- Large Deposit ---")
account.deposit(6000)

print("\n--- Balance ---")
print(f"Current balance: ${account.get_balance()}")

print("\n--- Transaction History ---")
for log in account.get_transaction_history():
    print(log)

print("\n\n=== Proxy Pattern Summary ===")
print("\nTypes of Proxies:")
print("  • Virtual Proxy: Lazy loading of expensive objects")
print("  • Protection Proxy: Access control and permissions")
print("  • Caching Proxy: Cache results for performance")
print("  • Remote Proxy: Represent remote objects locally")
print("  • Smart Reference: Additional functionality")

print("\nWhen to use:")
print("  ✓ Control access to an object")
print("  ✓ Delay expensive object creation")
print("  ✓ Add logging, caching, or validation")

print("\nBenefits:")
print("  ✓ Controls access to service object")
print("  ✓ Manages lifecycle of service object")
print("  ✓ Open/Closed Principle")

print("\nDrawbacks:")
print("  ⚠ Increased complexity")
print("  ⚠ Possible response delay")
```

</details>

---

### E. Composite Pattern

**Intent**: Compose objects into tree structures to represent part-whole hierarchies. Composite lets clients treat individual objects and compositions of objects uniformly.

**Real-world analogy**: Think of a file system. A folder can contain files OR other folders. Whether you're working with a single file or a folder containing hundreds of files and subfolders, you perform the same operations (open, delete, move, calculate size). The folder is a composite of files and other folders.

**When to use**:
- Represent part-whole hierarchies of objects
- Want clients to ignore difference between compositions and individual objects
- Have tree-like structure
- Need to treat individual objects and groups uniformly

**Pros**:
- Simplifies client code (treats everything uniformly)
- Easy to add new component types
- Follows Open/Closed Principle

**Cons**:
- Can make design overly general
- Hard to restrict components of a composite
- Type safety can be difficult

<details>
<summary><strong>View Composite Examples</strong></summary>

```typescript
// TypeScript - Composite Pattern

// ============================================
// Basic Composite - File System
// ============================================

console.log("=== Basic Composite: File System ===\n");

// Component interface
interface FileSystemComponent {
  getName(): string;
  getSize(): number;
  display(indent?: string): void;
}

// Leaf - File
class File implements FileSystemComponent {
  constructor(
    private name: string,
    private size: number
  ) {}

  getName(): string {
    return this.name;
  }

  getSize(): number {
    return this.size;
  }

  display(indent: string = ""): void {
    console.log(`${indent}📄 ${this.name} (${this.size} KB)`);
  }
}

// Composite - Folder
class Folder implements FileSystemComponent {
  private children: FileSystemComponent[] = [];

  constructor(private name: string) {}

  add(component: FileSystemComponent): void {
    this.children.push(component);
  }

  remove(component: FileSystemComponent): void {
    const index = this.children.indexOf(component);
    if (index !== -1) {
      this.children.splice(index, 1);
    }
  }

  getName(): string {
    return this.name;
  }

  getSize(): number {
    // Sum of all children's sizes
    return this.children.reduce((total, child) => total + child.getSize(), 0);
  }

  display(indent: string = ""): void {
    console.log(`${indent}📁 ${this.name} (${this.getSize()} KB)`);
    this.children.forEach(child => child.display(indent + "  "));
  }

  getChildren(): FileSystemComponent[] {
    return this.children;
  }
}

// Build file system structure
console.log("--- Building File System ---\n");

const root = new Folder("root");

const documents = new Folder("documents");
documents.add(new File("resume.pdf", 150));
documents.add(new File("cover-letter.docx", 50));

const photos = new Folder("photos");
photos.add(new File("vacation1.jpg", 2000));
photos.add(new File("vacation2.jpg", 2500));
photos.add(new File("family.jpg", 1800));

const work = new Folder("work");
const projects = new Folder("projects");
projects.add(new File("project1.zip", 5000));
projects.add(new File("project2.zip", 4500));
work.add(projects);
work.add(new File("meeting-notes.txt", 25));

root.add(documents);
root.add(photos);
root.add(work);

// Display entire tree
root.display();

console.log(`\nTotal size: ${root.getSize()} KB`);

// ============================================
// Real-World Example: Organization Hierarchy
// ============================================

console.log("\n\n=== Real-World: Organization Hierarchy ===\n");

// Component
interface Employee {
  getName(): string;
  getSalary(): number;
  getRole(): string;
  display(indent?: string): void;
}

// Leaf - Individual Employee
class IndividualEmployee implements Employee {
  constructor(
    private name: string,
    private role: string,
    private salary: number
  ) {}

  getName(): string {
    return this.name;
  }

  getSalary(): number {
    return this.salary;
  }

  getRole(): string {
    return this.role;
  }

  display(indent: string = ""): void {
    console.log(`${indent}👤 ${this.name} - ${this.role} ($${this.salary.toLocaleString()})`);
  }
}

// Composite - Manager (has subordinates)
class Manager implements Employee {
  private subordinates: Employee[] = [];

  constructor(
    private name: string,
    private role: string,
    private salary: number
  ) {}

  add(employee: Employee): void {
    this.subordinates.push(employee);
    console.log(`✓ ${employee.getName()} reports to ${this.name}`);
  }

  remove(employee: Employee): void {
    const index = this.subordinates.indexOf(employee);
    if (index !== -1) {
      this.subordinates.splice(index, 1);
    }
  }

  getName(): string {
    return this.name;
  }

  getSalary(): number {
    // Manager's salary plus all subordinates
    const totalSubordinateSalary = this.subordinates.reduce(
      (total, emp) => total + emp.getSalary(),
      0
    );
    return this.salary + totalSubordinateSalary;
  }

  getRole(): string {
    return this.role;
  }

  display(indent: string = ""): void {
    console.log(`${indent}👔 ${this.name} - ${this.role} ($${this.salary.toLocaleString()})`);
    console.log(`${indent}   Team size: ${this.subordinates.length}, Total budget: $${this.getSalary().toLocaleString()}`);
    this.subordinates.forEach(emp => emp.display(indent + "  "));
  }

  getTeamSize(): number {
    return this.subordinates.reduce(
      (total, emp) => {
        if (emp instanceof Manager) {
          return total + 1 + emp.getTeamSize();
        }
        return total + 1;
      },
      0
    );
  }
}

// Build organization
console.log("--- Building Organization ---\n");

const ceo = new Manager("Alice Johnson", "CEO", 200000);

const cto = new Manager("Bob Smith", "CTO", 150000);
const dev1 = new IndividualEmployee("Charlie Brown", "Senior Developer", 100000);
const dev2 = new IndividualEmployee("Diana Prince", "Junior Developer", 70000);
cto.add(dev1);
cto.add(dev2);

const cfo = new Manager("Eve Wilson", "CFO", 150000);
const accountant1 = new IndividualEmployee("Frank Miller", "Senior Accountant", 80000);
const accountant2 = new IndividualEmployee("Grace Lee", "Accountant", 60000);
cfo.add(accountant1);
cfo.add(accountant2);

const hr = new Manager("Henry Davis", "HR Director", 120000);
const recruiter = new IndividualEmployee("Ivy Chen", "Recruiter", 65000);
hr.add(recruiter);

ceo.add(cto);
ceo.add(cfo);
ceo.add(hr);

console.log("\n--- Organization Chart ---\n");
ceo.display();

console.log(`\n--- Statistics ---`);
console.log(`Total team size: ${ceo.getTeamSize()} employees`);
console.log(`Total payroll: $${ceo.getSalary().toLocaleString()}`);

// ============================================
// Real-World Example: UI Components
// ============================================

console.log("\n\n=== Real-World: UI Components ===\n");

// Component
interface UIComponent {
  render(): void;
  enable(): void;
  disable(): void;
}

// Leaf - Button
class Button implements UIComponent {
  private enabled: boolean = true;

  constructor(private label: string) {}

  render(): void {
    const state = this.enabled ? "enabled" : "disabled";
    console.log(`  [Button: ${this.label}] (${state})`);
  }

  enable(): void {
    this.enabled = true;
  }

  disable(): void {
    this.enabled = false;
  }
}

// Leaf - TextBox
class TextBox implements UIComponent {
  private enabled: boolean = true;

  constructor(private placeholder: string) {}

  render(): void {
    const state = this.enabled ? "enabled" : "disabled";
    console.log(`  [TextBox: "${this.placeholder}"] (${state})`);
  }

  enable(): void {
    this.enabled = true;
  }

  disable(): void {
    this.enabled = false;
  }
}

// Leaf - Label
class Label implements UIComponent {
  constructor(private text: string) {}

  render(): void {
    console.log(`  [Label: "${this.text}"]`);
  }

  enable(): void {
    // Labels don't have enabled/disabled state
  }

  disable(): void {
    // Labels don't have enabled/disabled state
  }
}

// Composite - Panel
class Panel implements UIComponent {
  private components: UIComponent[] = [];

  constructor(private name: string) {}

  add(component: UIComponent): void {
    this.components.push(component);
  }

  remove(component: UIComponent): void {
    const index = this.components.indexOf(component);
    if (index !== -1) {
      this.components.splice(index, 1);
    }
  }

  render(): void {
    console.log(`\n📦 ${this.name}`);
    this.components.forEach(comp => comp.render());
  }

  enable(): void {
    console.log(`Enabling all components in ${this.name}`);
    this.components.forEach(comp => comp.enable());
  }

  disable(): void {
    console.log(`Disabling all components in ${this.name}`);
    this.components.forEach(comp => comp.disable());
  }
}

// Build UI
console.log("--- Building UI ---");

const mainPanel = new Panel("Main Window");

const loginPanel = new Panel("Login Panel");
loginPanel.add(new Label("Username:"));
loginPanel.add(new TextBox("Enter username"));
loginPanel.add(new Label("Password:"));
loginPanel.add(new TextBox("Enter password"));
loginPanel.add(new Button("Login"));
loginPanel.add(new Button("Cancel"));

const settingsPanel = new Panel("Settings Panel");
settingsPanel.add(new Label("Notifications:"));
settingsPanel.add(new Button("Enable Notifications"));
settingsPanel.add(new Label("Theme:"));
settingsPanel.add(new Button("Dark Mode"));
settingsPanel.add(new Button("Light Mode"));

mainPanel.add(loginPanel);
mainPanel.add(settingsPanel);

console.log("\n--- Rendering UI ---");
mainPanel.render();

console.log("\n--- Disabling Login Panel ---");
loginPanel.disable();
loginPanel.render();

console.log("\n--- Re-enabling Login Panel ---");
loginPanel.enable();
loginPanel.render();

// ============================================
// Real-World Example: Menu System
// ============================================

console.log("\n\n=== Real-World: Menu System ===\n");

// Component
interface MenuComponent {
  getName(): string;
  getPrice(): number;
  print(): void;
}

// Leaf - MenuItem
class MenuItem implements MenuComponent {
  constructor(
    private name: string,
    private description: string,
    private price: number,
    private vegetarian: boolean = false
  ) {}

  getName(): string {
    return this.name;
  }

  getPrice(): number {
    return this.price;
  }

  print(): void {
    const vegLabel = this.vegetarian ? "(v)" : "";
    console.log(`  ${this.name} ${vegLabel} - $${this.price.toFixed(2)}`);
    console.log(`    ${this.description}`);
  }
}

// Composite - Menu
class Menu implements MenuComponent {
  private items: MenuComponent[] = [];

  constructor(
    private name: string,
    private description: string
  ) {}

  add(component: MenuComponent): void {
    this.items.push(component);
  }

  remove(component: MenuComponent): void {
    const index = this.items.indexOf(component);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }

  getName(): string {
    return this.name;
  }

  getPrice(): number {
    // Sum of all items
    return this.items.reduce((total, item) => total + item.getPrice(), 0);
  }

  print(): void {
    console.log(`\n${this.name.toUpperCase()}`);
    console.log(this.description);
    console.log("─".repeat(50));
    this.items.forEach(item => item.print());
  }
}

// Build restaurant menu
console.log("--- Building Restaurant Menu ---");

const restaurantMenu = new Menu("Main Menu", "Welcome to Our Restaurant");

const breakfastMenu = new Menu("Breakfast Menu", "Served until 11 AM");
breakfastMenu.add(new MenuItem("Pancakes", "Stack of 3 fluffy pancakes", 8.99, true));
breakfastMenu.add(new MenuItem("Eggs Benedict", "Poached eggs on English muffin", 12.99));
breakfastMenu.add(new MenuItem("Oatmeal", "Steel-cut oats with berries", 6.99, true));

const lunchMenu = new Menu("Lunch Menu", "Served 11 AM - 3 PM");
lunchMenu.add(new MenuItem("Caesar Salad", "Romaine lettuce with parmesan", 9.99, true));
lunchMenu.add(new MenuItem("Club Sandwich", "Triple-decker with fries", 11.99));
lunchMenu.add(new MenuItem("Soup & Salad Combo", "Chef's soup and garden salad", 10.99, true));

const dinnerMenu = new Menu("Dinner Menu", "Served after 5 PM");
dinnerMenu.add(new MenuItem("Grilled Salmon", "Atlantic salmon with vegetables", 22.99));
dinnerMenu.add(new MenuItem("Ribeye Steak", "16oz ribeye with mashed potatoes", 28.99));
dinnerMenu.add(new MenuItem("Vegetarian Pasta", "Pasta primavera", 16.99, true));

const dessertMenu = new Menu("Dessert Menu", "Sweet Endings");
dessertMenu.add(new MenuItem("Chocolate Cake", "Rich chocolate layer cake", 7.99, true));
dessertMenu.add(new MenuItem("Cheesecake", "New York style cheesecake", 8.99, true));

restaurantMenu.add(breakfastMenu);
restaurantMenu.add(lunchMenu);
restaurantMenu.add(dinnerMenu);
restaurantMenu.add(dessertMenu);

console.log("\n--- Printing Menu ---");
restaurantMenu.print();

console.log("\n--- Printing Just Breakfast ---");
breakfastMenu.print();

// ============================================
// Composite with Iterator
// ============================================

console.log("\n\n=== Composite with Iterator ===\n");

class FileSystemIterator {
  private stack: FileSystemComponent[] = [];

  constructor(root: FileSystemComponent) {
    this.stack.push(root);
  }

  hasNext(): boolean {
    return this.stack.length > 0;
  }

  next(): FileSystemComponent | null {
    if (!this.hasNext()) {
      return null;
    }

    const current = this.stack.pop()!;

    // If it's a folder, add its children to stack
    if (current instanceof Folder) {
      const children = current.getChildren();
      // Add in reverse order so they're processed in correct order
      for (let i = children.length - 1; i >= 0; i--) {
        this.stack.push(children[i]);
      }
    }

    return current;
  }
}

// Iterate through file system
console.log("--- Iterating Through File System ---\n");
const iterator = new FileSystemIterator(root);

while (iterator.hasNext()) {
  const component = iterator.next();
  if (component) {
    console.log(`${component.getName()}: ${component.getSize()} KB`);
  }
}

// ============================================
// Key Takeaways
// ============================================

console.log("\n\n=== Composite Pattern Summary ===");
console.log("\nWhen to use:");
console.log("  ✓ Represent part-whole hierarchies (tree structures)");
console.log("  ✓ Want clients to treat individual and composite objects uniformly");
console.log("  ✓ Need recursive composition");
console.log("  ✓ Objects form a tree-like structure");

console.log("\nBenefits:");
console.log("  ✓ Simplifies client code (treats everything uniformly)");
console.log("  ✓ Easy to add new component types");
console.log("  ✓ Open/Closed Principle");
console.log("  ✓ Single Responsibility Principle");

console.log("\nDrawbacks:");
console.log("  ⚠ Can make design overly general");
console.log("  ⚠ Hard to restrict components");
console.log("  ⚠ May complicate type safety");

console.log("\nCommon Use Cases:");
console.log("  • File systems (folders and files)");
console.log("  • Organization charts (managers and employees)");
console.log("  • UI component trees (panels and widgets)");
console.log("  • Menu systems (menus and menu items)");
console.log("  • Graphics systems (shapes and groups)");
```

```python
# Python - Composite Pattern

from abc import ABC, abstractmethod
from typing import List

# ============================================
# Basic Composite - File System
# ============================================

print("=== Basic Composite: File System ===\n")

class FileSystemComponent(ABC):
    @abstractmethod
    def get_name(self) -> str:
        pass
    
    @abstractmethod
    def get_size(self) -> int:
        pass
    
    @abstractmethod
    def display(self, indent: str = "") -> None:
        pass

# Leaf - File
class File(FileSystemComponent):
    def __init__(self, name: str, size: int):
        self._name = name
        self._size = size
    
    def get_name(self) -> str:
        return self._name
    
    def get_size(self) -> int:
        return self._size
    
    def display(self, indent: str = "") -> None:
        print(f"{indent}📄 {self._name} ({self._size} KB)")

# Composite - Folder
class Folder(FileSystemComponent):
    def __init__(self, name: str):
        self._name = name
        self._children: List[FileSystemComponent] = []
    
    def add(self, component: FileSystemComponent) -> None:
        self._children.append(component)
    
    def remove(self, component: FileSystemComponent) -> None:
        if component in self._children:
            self._children.remove(component)
    
    def get_name(self) -> str:
        return self._name
    
    def get_size(self) -> int:
        return sum(child.get_size() for child in self._children)
    
    def display(self, indent: str = "") -> None:
        print(f"{indent}📁 {self._name} ({self.get_size()} KB)")
        for child in self._children:
            child.display(indent + "  ")
    
    def get_children(self) -> List[FileSystemComponent]:
        return self._children

# Build file system
print("--- Building File System ---\n")

root = Folder("root")

documents = Folder("documents")
documents.add(File("resume.pdf", 150))
documents.add(File("cover-letter.docx", 50))

photos = Folder("photos")
photos.add(File("vacation1.jpg", 2000))
photos.add(File("vacation2.jpg", 2500))
photos.add(File("family.jpg", 1800))

work = Folder("work")
projects = Folder("projects")
projects.add(File("project1.zip", 5000))
projects.add(File("project2.zip", 4500))
work.add(projects)
work.add(File("meeting-notes.txt", 25))

root.add(documents)
root.add(photos)
root.add(work)

root.display()
print(f"\nTotal size: {root.get_size()} KB")

# ============================================
# Real-World Example: Organization
# ============================================

print("\n\n=== Real-World: Organization Hierarchy ===\n")

class Employee(ABC):
    @abstractmethod
    def get_name(self) -> str:
        pass
    
    @abstractmethod
    def get_salary(self) -> int:
        pass
    
    @abstractmethod
    def get_role(self) -> str:
        pass
    
    @abstractmethod
    def display(self, indent: str = "") -> None:
        pass

class IndividualEmployee(Employee):
    def __init__(self, name: str, role: str, salary: int):
        self._name = name
        self._role = role
        self._salary = salary
    
    def get_name(self) -> str:
        return self._name
    
    def get_salary(self) -> int:
        return self._salary
    
    def get_role(self) -> str:
        return self._role
    
    def display(self, indent: str = "") -> None:
        print(f"{indent}👤 {self._name} - {self._role} (${self._salary:,})")

class Manager(Employee):
    def __init__(self, name: str, role: str, salary: int):
        self._name = name
        self._role = role
        self._salary = salary
        self._subordinates: List[Employee] = []
    
    def add(self, employee: Employee) -> None:
        self._subordinates.append(employee)
        print(f"✓ {employee.get_name()} reports to {self._name}")
    
    def remove(self, employee: Employee) -> None:
        if employee in self._subordinates:
            self._subordinates.remove(employee)
    
    def get_name(self) -> str:
        return self._name
    
    def get_salary(self) -> int:
        total = self._salary
        for emp in self._subordinates:
            total += emp.get_salary()
        return total
    
    def get_role(self) -> str:
        return self._role
    
    def display(self, indent: str = "") -> None:
        print(f"{indent}👔 {self._name} - {self._role} (${self._salary:,})")
        print(f"{indent}   Team size: {len(self._subordinates)}, Total budget: ${self.get_salary():,}")
        for emp in self._subordinates:
            emp.display(indent + "  ")
    
    def get_team_size(self) -> int:
        total = 0
        for emp in self._subordinates:
            total += 1
            if isinstance(emp, Manager):
                total += emp.get_team_size()
        return total

# Build organization
print("--- Building Organization ---\n")

ceo = Manager("Alice Johnson", "CEO", 200000)

cto = Manager("Bob Smith", "CTO", 150000)
dev1 = IndividualEmployee("Charlie Brown", "Senior Developer", 100000)
dev2 = IndividualEmployee("Diana Prince", "Junior Developer", 70000)
cto.add(dev1)
cto.add(dev2)

cfo = Manager("Eve Wilson", "CFO", 150000)
accountant1 = IndividualEmployee("Frank Miller", "Senior Accountant", 80000)
accountant2 = IndividualEmployee("Grace Lee", "Accountant", 60000)
cfo.add(accountant1)
cfo.add(accountant2)

ceo.add(cto)
ceo.add(cfo)

print("\n--- Organization Chart ---\n")
ceo.display()

print(f"\n--- Statistics ---")
print(f"Total team size: {ceo.get_team_size()} employees")
print(f"Total payroll: ${ceo.get_salary():,}")

# ============================================
# Real-World Example: UI Components
# ============================================

print("\n\n=== Real-World: UI Components ===\n")

class UIComponent(ABC):
    @abstractmethod
    def render(self) -> None:
        pass
    
    @abstractmethod
    def enable(self) -> None:
        pass
    
    @abstractmethod
    def disable(self) -> None:
        pass

class Button(UIComponent):
    def __init__(self, label: str):
        self._label = label
        self._enabled = True
    
    def render(self) -> None:
        state = "enabled" if self._enabled else "disabled"
        print(f"  [Button: {self._label}] ({state})")
    
    def enable(self) -> None:
        self._enabled = True
    
    def disable(self) -> None:
        self._enabled = False

class TextBox(UIComponent):
    def __init__(self, placeholder: str):
        self._placeholder = placeholder
        self._enabled = True
    
    def render(self) -> None:
        state = "enabled" if self._enabled else "disabled"
        print(f'  [TextBox: "{self._placeholder}"] ({state})')
    
    def enable(self) -> None:
        self._enabled = True
    
    def disable(self) -> None:
        self._enabled = False

class Panel(UIComponent):
    def __init__(self, name: str):
        self._name = name
        self._components: List[UIComponent] = []
    
    def add(self, component: UIComponent) -> None:
        self._components.append(component)
    
    def remove(self, component: UIComponent) -> None:
        if component in self._components:
            self._components.remove(component)
    
    def render(self) -> None:
        print(f"\n📦 {self._name}")
        for comp in self._components:
            comp.render()
    
    def enable(self) -> None:
        print(f"Enabling all components in {self._name}")
        for comp in self._components:
            comp.enable()
    
    def disable(self) -> None:
        print(f"Disabling all components in {self._name}")
        for comp in self._components:
            comp.disable()

# Build UI
print("--- Building UI ---")

main_panel = Panel("Main Window")

login_panel = Panel("Login Panel")
login_panel.add(TextBox("Enter username"))
login_panel.add(TextBox("Enter password"))
login_panel.add(Button("Login"))
login_panel.add(Button("Cancel"))

main_panel.add(login_panel)

print("\n--- Rendering UI ---")
main_panel.render()

print("\n--- Disabling Login Panel ---")
login_panel.disable()
login_panel.render()

print("\n--- Re-enabling Login Panel ---")
login_panel.enable()
login_panel.render()

print("\n\n=== Composite Pattern Summary ===")
print("\nWhen to use:")
print("  ✓ Represent part-whole hierarchies (tree structures)")
print("  ✓ Want clients to treat individual and composite objects uniformly")
print("  ✓ Need recursive composition")

print("\nBenefits:")
print("  ✓ Simplifies client code")
print("  ✓ Easy to add new component types")
print("  ✓ Open/Closed Principle")

print("\nDrawbacks:")
print("  ⚠ Can make design overly general")
print("  ⚠ Hard to restrict components")
```

</details>

---

### F. Bridge Pattern

**Intent**: Decouple an abstraction from its implementation so that the two can vary independently.

**Real-world analogy**: Think of a universal remote control. The remote (abstraction) works with any brand of TV (implementation) - Sony, Samsung, LG. You can change the remote design without changing how TVs work, and you can add new TV brands without changing the remote. The remote is "bridged" to the TV.

**When to use**:
- Avoid permanent binding between abstraction and implementation
- Both abstractions and implementations should be extensible through subclassing
- Changes in implementation shouldn't affect clients
- Want to share implementation among multiple objects (reference counting)
- Have proliferation of classes from coupled interface/implementation

**Pros**:
- Decouples interface from implementation
- Improved extensibility (extend both independently)
- Hides implementation details from client
- Single Responsibility and Open/Closed principles

**Cons**:
- Increased complexity
- More classes to manage

<details>
<summary><strong>View Bridge Examples</strong></summary>

```typescript
// TypeScript - Bridge Pattern

// ============================================
// Basic Bridge - Remote Control & Device
// ============================================

console.log("=== Basic Bridge: Remote Control & Device ===\n");

// Implementation interface (what can be controlled)
interface Device {
  isEnabled(): boolean;
  enable(): void;
  disable(): void;
  getVolume(): number;
  setVolume(percent: number): void;
  getChannel(): number;
  setChannel(channel: number): void;
}

// Concrete Implementation 1 - TV
class TV implements Device {
  private on: boolean = false;
  private volume: number = 30;
  private channel: number = 1;

  isEnabled(): boolean {
    return this.on;
  }

  enable(): void {
    this.on = true;
    console.log("TV: Turned on");
  }

  disable(): void {
    this.on = false;
    console.log("TV: Turned off");
  }

  getVolume(): number {
    return this.volume;
  }

  setVolume(percent: number): void {
    this.volume = Math.max(0, Math.min(100, percent));
    console.log(`TV: Volume set to ${this.volume}%`);
  }

  getChannel(): number {
    return this.channel;
  }

  setChannel(channel: number): void {
    this.channel = channel;
    console.log(`TV: Channel set to ${this.channel}`);
  }
}

// Concrete Implementation 2 - Radio
class Radio implements Device {
  private on: boolean = false;
  private volume: number = 50;
  private channel: number = 101; // FM frequency

  isEnabled(): boolean {
    return this.on;
  }

  enable(): void {
    this.on = true;
    console.log("Radio: Turned on");
  }

  disable(): void {
    this.on = false;
    console.log("Radio: Turned off");
  }

  getVolume(): number {
    return this.volume;
  }

  setVolume(percent: number): void {
    this.volume = Math.max(0, Math.min(100, percent));
    console.log(`Radio: Volume set to ${this.volume}%`);
  }

  getChannel(): number {
    return this.channel;
  }

  setChannel(channel: number): void {
    this.channel = channel;
    console.log(`Radio: Station set to ${this.channel} FM`);
  }
}

// Abstraction (Remote Control)
class RemoteControl {
  constructor(protected device: Device) {}

  togglePower(): void {
    console.log("RemoteControl: Toggling power");
    if (this.device.isEnabled()) {
      this.device.disable();
    } else {
      this.device.enable();
    }
  }

  volumeUp(): void {
    console.log("RemoteControl: Volume up");
    this.device.setVolume(this.device.getVolume() + 10);
  }

  volumeDown(): void {
    console.log("RemoteControl: Volume down");
    this.device.setVolume(this.device.getVolume() - 10);
  }

  channelUp(): void {
    console.log("RemoteControl: Channel up");
    this.device.setChannel(this.device.getChannel() + 1);
  }

  channelDown(): void {
    console.log("RemoteControl: Channel down");
    this.device.setChannel(this.device.getChannel() - 1);
  }
}

// Refined Abstraction - Advanced Remote
class AdvancedRemoteControl extends RemoteControl {
  mute(): void {
    console.log("AdvancedRemote: Muting");
    this.device.setVolume(0);
  }

  setFavoriteChannel(channel: number): void {
    console.log(`AdvancedRemote: Setting favorite channel ${channel}`);
    this.device.setChannel(channel);
  }
}

// Usage
console.log("--- TV with Basic Remote ---");
const tv = new TV();
const tvRemote = new RemoteControl(tv);
tvRemote.togglePower();
tvRemote.volumeUp();
tvRemote.channelUp();

console.log("\n--- Radio with Advanced Remote ---");
const radio = new Radio();
const radioRemote = new AdvancedRemoteControl(radio);
radioRemote.togglePower();
radioRemote.setFavoriteChannel(105);
radioRemote.mute();

console.log("\n--- Same Advanced Remote, Different Device (TV) ---");
const tvAdvanced = new AdvancedRemoteControl(tv);
tvAdvanced.togglePower(); // TV is already on
tvAdvanced.setFavoriteChannel(7);

// ============================================
// Real-World Example: Drawing Shapes with Renderers
// ============================================

console.log("\n\n=== Real-World: Drawing Shapes ===\n");

// Implementation - How to render
interface Renderer {
  renderCircle(radius: number, x: number, y: number): void;
  renderRectangle(width: number, height: number, x: number, y: number): void;
}

// Concrete Implementation 1 - Vector Renderer
class VectorRenderer implements Renderer {
  renderCircle(radius: number, x: number, y: number): void {
    console.log(`[Vector] Drawing circle: radius=${radius} at (${x}, ${y})`);
    console.log(`  SVG: <circle cx="${x}" cy="${y}" r="${radius}" />`);
  }

  renderRectangle(width: number, height: number, x: number, y: number): void {
    console.log(`[Vector] Drawing rectangle: ${width}x${height} at (${x}, ${y})`);
    console.log(`  SVG: <rect x="${x}" y="${y}" width="${width}" height="${height}" />`);
  }
}

// Concrete Implementation 2 - Raster Renderer
class RasterRenderer implements Renderer {
  renderCircle(radius: number, x: number, y: number): void {
    console.log(`[Raster] Drawing circle: radius=${radius} at (${x}, ${y})`);
    console.log(`  Pixels: Filling circle with algorithm`);
  }

  renderRectangle(width: number, height: number, x: number, y: number): void {
    console.log(`[Raster] Drawing rectangle: ${width}x${height} at (${x}, ${y})`);
    console.log(`  Pixels: Filling ${width * height} pixels`);
  }
}

// Concrete Implementation 3 - ASCII Renderer
class ASCIIRenderer implements Renderer {
  renderCircle(radius: number, x: number, y: number): void {
    console.log(`[ASCII] Drawing circle: radius=${radius} at (${x}, ${y})`);
    console.log(`  ASCII: Using 'O' characters`);
  }

  renderRectangle(width: number, height: number, x: number, y: number): void {
    console.log(`[ASCII] Drawing rectangle: ${width}x${height} at (${x}, ${y})`);
    console.log(`  ASCII: Using '#' characters`);
  }
}

// Abstraction - Shape
abstract class Shape {
  constructor(protected renderer: Renderer) {}
  
  abstract draw(): void;
  abstract resize(factor: number): void;
}

// Refined Abstraction 1 - Circle
class Circle extends Shape {
  constructor(
    renderer: Renderer,
    private radius: number,
    private x: number,
    private y: number
  ) {
    super(renderer);
  }

  draw(): void {
    this.renderer.renderCircle(this.radius, this.x, this.y);
  }

  resize(factor: number): void {
    this.radius *= factor;
    console.log(`Circle resized to radius ${this.radius}`);
  }
}

// Refined Abstraction 2 - Rectangle
class Rectangle extends Shape {
  constructor(
    renderer: Renderer,
    private width: number,
    private height: number,
    private x: number,
    private y: number
  ) {
    super(renderer);
  }

  draw(): void {
    this.renderer.renderRectangle(this.width, this.height, this.x, this.y);
  }

  resize(factor: number): void {
    this.width *= factor;
    this.height *= factor;
    console.log(`Rectangle resized to ${this.width}x${this.height}`);
  }
}

// Usage
console.log("--- Circle with Vector Renderer ---");
const vectorCircle = new Circle(new VectorRenderer(), 5, 10, 10);
vectorCircle.draw();

console.log("\n--- Rectangle with Raster Renderer ---");
const rasterRect = new Rectangle(new RasterRenderer(), 20, 10, 5, 5);
rasterRect.draw();

console.log("\n--- Circle with ASCII Renderer ---");
const asciiCircle = new Circle(new ASCIIRenderer(), 7, 15, 15);
asciiCircle.draw();

console.log("\n--- Same Shape, Different Renderer ---");
const circle = new Circle(new VectorRenderer(), 10, 0, 0);
console.log("Drawing with Vector:");
circle.draw();

// Change implementation at runtime
const rasterRenderer = new RasterRenderer();
const rasterCircle2 = new Circle(rasterRenderer, 10, 0, 0);
console.log("\nSame circle with Raster:");
rasterCircle2.draw();

// ============================================
// Real-World Example: Message Sending
// ============================================

console.log("\n\n=== Real-World: Message Sending ===\n");

// Implementation - How to send
interface MessageSender {
  sendMessage(recipient: string, message: string): void;
}

// Concrete Implementations
class EmailSender implements MessageSender {
  sendMessage(recipient: string, message: string): void {
    console.log(`📧 Sending email to ${recipient}`);
    console.log(`   Subject: Message from system`);
    console.log(`   Body: ${message}`);
  }
}

class SMSSender implements MessageSender {
  sendMessage(recipient: string, message: string): void {
    console.log(`📱 Sending SMS to ${recipient}`);
    console.log(`   Text: ${message}`);
  }
}

class PushNotificationSender implements MessageSender {
  sendMessage(recipient: string, message: string): void {
    console.log(`🔔 Sending push notification to ${recipient}`);
    console.log(`   Notification: ${message}`);
  }
}

// Abstraction - Message
abstract class Message {
  constructor(protected sender: MessageSender) {}
  
  abstract send(recipient: string): void;
}

// Refined Abstractions
class TextMessage extends Message {
  constructor(sender: MessageSender, private content: string) {
    super(sender);
  }

  send(recipient: string): void {
    console.log("\n[Text Message]");
    this.sender.sendMessage(recipient, this.content);
  }
}

class UrgentMessage extends Message {
  constructor(sender: MessageSender, private content: string) {
    super(sender);
  }

  send(recipient: string): void {
    console.log("\n[URGENT Message]");
    const urgentContent = `⚠️ URGENT: ${this.content}`;
    this.sender.sendMessage(recipient, urgentContent);
  }
}

class ScheduledMessage extends Message {
  constructor(
    sender: MessageSender,
    private content: string,
    private scheduleTime: Date
  ) {
    super(sender);
  }

  send(recipient: string): void {
    console.log("\n[Scheduled Message]");
    console.log(`Scheduled for: ${this.scheduleTime.toLocaleString()}`);
    this.sender.sendMessage(recipient, this.content);
  }
}

// Usage
console.log("--- Text Message via Email ---");
const emailText = new TextMessage(new EmailSender(), "Hello from the bridge pattern!");
emailText.send("user@example.com");

console.log("\n--- Urgent Message via SMS ---");
const urgentSMS = new UrgentMessage(new SMSSender(), "Server is down!");
urgentSMS.send("+1234567890");

console.log("\n--- Scheduled Message via Push ---");
const scheduledPush = new ScheduledMessage(
  new PushNotificationSender(),
  "Meeting in 15 minutes",
  new Date(Date.now() + 15 * 60 * 1000)
);
scheduledPush.send("device_token_123");

console.log("\n--- Same Message Type, Different Senders ---");
const content = "Important update";
new TextMessage(new EmailSender(), content).send("email@example.com");
new TextMessage(new SMSSender(), content).send("+9876543210");
new TextMessage(new PushNotificationSender(), content).send("device_456");

// ============================================
// Real-World Example: Database Abstraction
// ============================================

console.log("\n\n=== Real-World: Database Abstraction ===\n");

// Implementation - Database drivers
interface DatabaseDriver {
  connect(): void;
  executeQuery(sql: string): any[];
  disconnect(): void;
}

class MySQLDriver implements DatabaseDriver {
  connect(): void {
    console.log("[MySQL] Connecting to MySQL database...");
  }

  executeQuery(sql: string): any[] {
    console.log(`[MySQL] Executing: ${sql}`);
    return [{ id: 1, name: "MySQL Result" }];
  }

  disconnect(): void {
    console.log("[MySQL] Disconnecting...");
  }
}

class PostgreSQLDriver implements DatabaseDriver {
  connect(): void {
    console.log("[PostgreSQL] Connecting to PostgreSQL database...");
  }

  executeQuery(sql: string): any[] {
    console.log(`[PostgreSQL] Executing: ${sql}`);
    return [{ id: 1, name: "PostgreSQL Result" }];
  }

  disconnect(): void {
    console.log("[PostgreSQL] Disconnecting...");
  }
}

class MongoDBDriver implements DatabaseDriver {
  connect(): void {
    console.log("[MongoDB] Connecting to MongoDB database...");
  }

  executeQuery(query: string): any[] {
    console.log(`[MongoDB] Executing: ${query}`);
    return [{ _id: "1", name: "MongoDB Result" }];
  }

  disconnect(): void {
    console.log("[MongoDB] Disconnecting...");
  }
}

// Abstraction - Repository
abstract class Repository {
  constructor(protected driver: DatabaseDriver) {}
  
  abstract findAll(): any[];
  abstract findById(id: string): any;
}

// Refined Abstraction - User Repository
class UserRepository extends Repository {
  findAll(): any[] {
    console.log("\n[UserRepository] Finding all users");
    this.driver.connect();
    const results = this.driver.executeQuery("SELECT * FROM users");
    this.driver.disconnect();
    return results;
  }

  findById(id: string): any {
    console.log(`\n[UserRepository] Finding user ${id}`);
    this.driver.connect();
    const results = this.driver.executeQuery(`SELECT * FROM users WHERE id = ${id}`);
    this.driver.disconnect();
    return results[0];
  }
}

// Refined Abstraction - Product Repository
class ProductRepository extends Repository {
  findAll(): any[] {
    console.log("\n[ProductRepository] Finding all products");
    this.driver.connect();
    const results = this.driver.executeQuery("SELECT * FROM products");
    this.driver.disconnect();
    return results;
  }

  findById(id: string): any {
    console.log(`\n[ProductRepository] Finding product ${id}`);
    this.driver.connect();
    const results = this.driver.executeQuery(`SELECT * FROM products WHERE id = ${id}`);
    this.driver.disconnect();
    return results[0];
  }

  findByCategory(category: string): any[] {
    console.log(`\n[ProductRepository] Finding products in ${category}`);
    this.driver.connect();
    const results = this.driver.executeQuery(
      `SELECT * FROM products WHERE category = '${category}'`
    );
    this.driver.disconnect();
    return results;
  }
}

// Usage
console.log("--- User Repository with MySQL ---");
const mysqlUserRepo = new UserRepository(new MySQLDriver());
mysqlUserRepo.findAll();

console.log("\n--- Product Repository with PostgreSQL ---");
const postgresProductRepo = new ProductRepository(new PostgreSQLDriver());
postgresProductRepo.findByCategory("Electronics");

console.log("\n--- Same Repository, Different Database ---");
const mongoUserRepo = new UserRepository(new MongoDBDriver());
mongoUserRepo.findById("123");

// ============================================
// Key Takeaways
// ============================================

console.log("\n\n=== Bridge Pattern Summary ===");
console.log("\nWhen to use:");
console.log("  ✓ Want to avoid permanent binding between abstraction and implementation");
console.log("  ✓ Both abstractions and implementations need to extend independently");
console.log("  ✓ Changes in implementation shouldn't affect clients");
console.log("  ✓ Have class explosion from coupled hierarchy");

console.log("\nBenefits:");
console.log("  ✓ Decouples interface from implementation");
console.log("  ✓ Improved extensibility (extend both independently)");
console.log("  ✓ Hides implementation details from clients");
console.log("  ✓ Single Responsibility Principle");
console.log("  ✓ Open/Closed Principle");

console.log("\nDrawbacks:");
console.log("  ⚠ Increased complexity");
console.log("  ⚠ More classes to manage");
console.log("  ⚠ Can be overkill for simple scenarios");

console.log("\nBridge vs Adapter:");
console.log("  • Bridge: Designed upfront to let abstraction and implementation vary independently");
console.log("  • Adapter: Applied after to make incompatible interfaces work together");

console.log("\nCommon Use Cases:");
console.log("  • UI frameworks (abstraction) + rendering engines (implementation)");
console.log("  • Remote controls (abstraction) + devices (implementation)");
console.log("  • Database abstraction (abstraction) + drivers (implementation)");
console.log("  • Cross-platform applications");
console.log("  • Graphics rendering systems");
```

```python
# Python - Bridge Pattern

from abc import ABC, abstractmethod
from typing import List, Any
from datetime import datetime, timedelta

# ============================================
# Basic Bridge - Remote Control & Device
# ============================================

print("=== Basic Bridge: Remote Control & Device ===\n")

# Implementation
class Device(ABC):
    @abstractmethod
    def is_enabled(self) -> bool:
        pass
    
    @abstractmethod
    def enable(self) -> None:
        pass
    
    @abstractmethod
    def disable(self) -> None:
        pass
    
    @abstractmethod
    def get_volume(self) -> int:
        pass
    
    @abstractmethod
    def set_volume(self, percent: int) -> None:
        pass
    
    @abstractmethod
    def get_channel(self) -> int:
        pass
    
    @abstractmethod
    def set_channel(self, channel: int) -> None:
        pass

# Concrete Implementation 1
class TV(Device):
    def __init__(self):
        self._on = False
        self._volume = 30
        self._channel = 1
    
    def is_enabled(self) -> bool:
        return self._on
    
    def enable(self) -> None:
        self._on = True
        print("TV: Turned on")
    
    def disable(self) -> None:
        self._on = False
        print("TV: Turned off")
    
    def get_volume(self) -> int:
        return self._volume
    
    def set_volume(self, percent: int) -> None:
        self._volume = max(0, min(100, percent))
        print(f"TV: Volume set to {self._volume}%")
    
    def get_channel(self) -> int:
        return self._channel
    
    def set_channel(self, channel: int) -> None:
        self._channel = channel
        print(f"TV: Channel set to {self._channel}")

# Concrete Implementation 2
class Radio(Device):
    def __init__(self):
        self._on = False
        self._volume = 50
        self._channel = 101
    
    def is_enabled(self) -> bool:
        return self._on
    
    def enable(self) -> None:
        self._on = True
        print("Radio: Turned on")
    
    def disable(self) -> None:
        self._on = False
        print("Radio: Turned off")
    
    def get_volume(self) -> int:
        return self._volume
    
    def set_volume(self, percent: int) -> None:
        self._volume = max(0, min(100, percent))
        print(f"Radio: Volume set to {self._volume}%")
    
    def get_channel(self) -> int:
        return self._channel
    
    def set_channel(self, channel: int) -> None:
        self._channel = channel
        print(f"Radio: Station set to {self._channel} FM")

# Abstraction
class RemoteControl:
    def __init__(self, device: Device):
        self._device = device
    
    def toggle_power(self) -> None:
        print("RemoteControl: Toggling power")
        if self._device.is_enabled():
            self._device.disable()
        else:
            self._device.enable()
    
    def volume_up(self) -> None:
        print("RemoteControl: Volume up")
        self._device.set_volume(self._device.get_volume() + 10)
    
    def volume_down(self) -> None:
        print("RemoteControl: Volume down")
        self._device.set_volume(self._device.get_volume() - 10)
    
    def channel_up(self) -> None:
        print("RemoteControl: Channel up")
        self._device.set_channel(self._device.get_channel() + 1)
    
    def channel_down(self) -> None:
        print("RemoteControl: Channel down")
        self._device.set_channel(self._device.get_channel() - 1)

# Refined Abstraction
class AdvancedRemoteControl(RemoteControl):
    def mute(self) -> None:
        print("AdvancedRemote: Muting")
        self._device.set_volume(0)
    
    def set_favorite_channel(self, channel: int) -> None:
        print(f"AdvancedRemote: Setting favorite channel {channel}")
        self._device.set_channel(channel)

# Usage
print("--- TV with Basic Remote ---")
tv = TV()
tv_remote = RemoteControl(tv)
tv_remote.toggle_power()
tv_remote.volume_up()
tv_remote.channel_up()

print("\n--- Radio with Advanced Remote ---")
radio = Radio()
radio_remote = AdvancedRemoteControl(radio)
radio_remote.toggle_power()
radio_remote.set_favorite_channel(105)
radio_remote.mute()

# ============================================
# Real-World Example: Drawing Shapes
# ============================================

print("\n\n=== Real-World: Drawing Shapes ===\n")

# Implementation
class Renderer(ABC):
    @abstractmethod
    def render_circle(self, radius: float, x: float, y: float) -> None:
        pass
    
    @abstractmethod
    def render_rectangle(self, width: float, height: float, x: float, y: float) -> None:
        pass

class VectorRenderer(Renderer):
    def render_circle(self, radius: float, x: float, y: float) -> None:
        print(f"[Vector] Drawing circle: radius={radius} at ({x}, {y})")
        print(f'  SVG: <circle cx="{x}" cy="{y}" r="{radius}" />')
    
    def render_rectangle(self, width: float, height: float, x: float, y: float) -> None:
        print(f"[Vector] Drawing rectangle: {width}x{height} at ({x}, {y})")
        print(f'  SVG: <rect x="{x}" y="{y}" width="{width}" height="{height}" />')

class RasterRenderer(Renderer):
    def render_circle(self, radius: float, x: float, y: float) -> None:
        print(f"[Raster] Drawing circle: radius={radius} at ({x}, {y})")
        print("  Pixels: Filling circle with algorithm")
    
    def render_rectangle(self, width: float, height: float, x: float, y: float) -> None:
        print(f"[Raster] Drawing rectangle: {width}x{height} at ({x}, {y})")
        print(f"  Pixels: Filling {int(width * height)} pixels")

# Abstraction
class Shape(ABC):
    def __init__(self, renderer: Renderer):
        self._renderer = renderer
    
    @abstractmethod
    def draw(self) -> None:
        pass
    
    @abstractmethod
    def resize(self, factor: float) -> None:
        pass

# Refined Abstractions
class Circle(Shape):
    def __init__(self, renderer: Renderer, radius: float, x: float, y: float):
        super().__init__(renderer)
        self._radius = radius
        self._x = x
        self._y = y
    
    def draw(self) -> None:
        self._renderer.render_circle(self._radius, self._x, self._y)
    
    def resize(self, factor: float) -> None:
        self._radius *= factor
        print(f"Circle resized to radius {self._radius}")

class Rectangle(Shape):
    def __init__(self, renderer: Renderer, width: float, height: float, x: float, y: float):
        super().__init__(renderer)
        self._width = width
        self._height = height
        self._x = x
        self._y = y
    
    def draw(self) -> None:
        self._renderer.render_rectangle(self._width, self._height, self._x, self._y)
    
    def resize(self, factor: float) -> None:
        self._width *= factor
        self._height *= factor
        print(f"Rectangle resized to {self._width}x{self._height}")

# Usage
print("--- Circle with Vector Renderer ---")
vector_circle = Circle(VectorRenderer(), 5, 10, 10)
vector_circle.draw()

print("\n--- Rectangle with Raster Renderer ---")
raster_rect = Rectangle(RasterRenderer(), 20, 10, 5, 5)
raster_rect.draw()

print("\n--- Same Shape, Different Renderer ---")
circle = Circle(VectorRenderer(), 10, 0, 0)
print("Drawing with Vector:")
circle.draw()

raster_circle = Circle(RasterRenderer(), 10, 0, 0)
print("\nSame circle with Raster:")
raster_circle.draw()

# ============================================
# Real-World Example: Message Sending
# ============================================

print("\n\n=== Real-World: Message Sending ===\n")

# Implementation
class MessageSender(ABC):
    @abstractmethod
    def send_message(self, recipient: str, message: str) -> None:
        pass

class EmailSender(MessageSender):
    def send_message(self, recipient: str, message: str) -> None:
        print(f"📧 Sending email to {recipient}")
        print(f"   Subject: Message from system")
        print(f"   Body: {message}")

class SMSSender(MessageSender):
    def send_message(self, recipient: str, message: str) -> None:
        print(f"📱 Sending SMS to {recipient}")
        print(f"   Text: {message}")

class PushNotificationSender(MessageSender):
    def send_message(self, recipient: str, message: str) -> None:
        print(f"🔔 Sending push notification to {recipient}")
        print(f"   Notification: {message}")

# Abstraction
class Message(ABC):
    def __init__(self, sender: MessageSender):
        self._sender = sender
    
    @abstractmethod
    def send(self, recipient: str) -> None:
        pass

# Refined Abstractions
class TextMessage(Message):
    def __init__(self, sender: MessageSender, content: str):
        super().__init__(sender)
        self._content = content
    
    def send(self, recipient: str) -> None:
        print("\n[Text Message]")
        self._sender.send_message(recipient, self._content)

class UrgentMessage(Message):
    def __init__(self, sender: MessageSender, content: str):
        super().__init__(sender)
        self._content = content
    
    def send(self, recipient: str) -> None:
        print("\n[URGENT Message]")
        urgent_content = f"⚠️ URGENT: {self._content}"
        self._sender.send_message(recipient, urgent_content)

# Usage
print("--- Text Message via Email ---")
email_text = TextMessage(EmailSender(), "Hello from the bridge pattern!")
email_text.send("user@example.com")

print("\n--- Urgent Message via SMS ---")
urgent_sms = UrgentMessage(SMSSender(), "Server is down!")
urgent_sms.send("+1234567890")

print("\n--- Same Message Type, Different Senders ---")
content = "Important update"
TextMessage(EmailSender(), content).send("email@example.com")
TextMessage(SMSSender(), content).send("+9876543210")

print("\n\n=== Bridge Pattern Summary ===")
print("\nWhen to use:")
print("  ✓ Avoid permanent binding between abstraction and implementation")
print("  ✓ Both need to extend independently")
print("  ✓ Changes in implementation shouldn't affect clients")

print("\nBenefits:")
print("  ✓ Decouples interface from implementation")
print("  ✓ Improved extensibility")
print("  ✓ Hides implementation details")
print("  ✓ Single Responsibility and Open/Closed Principles")

print("\nDrawbacks:")
print("  ⚠ Increased complexity")
print("  ⚠ More classes to manage")
```

</details>

---

# Chapter 7: Design Patterns (Continued)

### G. Flyweight Pattern

**Intent**: Use sharing to support large numbers of fine-grained objects efficiently. Minimize memory usage by sharing data among similar objects.

**Real-world analogy**: Think of a text editor. Instead of storing font, size, and color information for each character separately, the editor stores this information once and references it from each character. If you have 10,000 characters in Arial 12pt, you don't store "Arial 12pt" 10,000 times - you store it once and all characters point to it.

**When to use**:
- Application uses large number of objects
- Storage costs are high due to sheer quantity of objects
- Most object state can be made extrinsic (moved outside)
- Many groups of objects can be replaced by few shared objects
- Application doesn't depend on object identity

**Key Concepts**:
- **Intrinsic state**: Shared state stored in flyweight (context-independent, immutable)
- **Extrinsic state**: Varies with context, passed to flyweight methods (not stored)

**Pros**:
- Saves memory when dealing with many similar objects
- Can improve performance (less memory allocation)

**Cons**:
- Trades RAM for CPU (extracting extrinsic state)
- Code becomes more complicated
- May introduce additional overhead for managing flyweights

<details>
<summary><strong>View Flyweight Examples</strong></summary>

```typescript
// TypeScript - Flyweight Pattern

// ============================================
// Basic Flyweight - Text Editor Characters
// ============================================

console.log("=== Basic Flyweight: Text Editor ===\n");

// Flyweight - Stores intrinsic state (shared)
class CharacterStyle {
  constructor(
    public font: string,
    public size: number,
    public color: string
  ) {
    console.log(`  Creating new style: ${font} ${size}pt ${color}`);
  }

  display(): string {
    return `${this.font} ${this.size}pt ${this.color}`;
  }
}

// Flyweight Factory - Manages shared flyweights
class StyleFactory {
  private styles: Map<string, CharacterStyle> = new Map();

  getStyle(font: string, size: number, color: string): CharacterStyle {
    const key = `${font}-${size}-${color}`;
    
    if (!this.styles.has(key)) {
      console.log(`Creating new shared style: ${key}`);
      this.styles.set(key, new CharacterStyle(font, size, color));
    } else {
      console.log(`Reusing existing style: ${key}`);
    }
    
    return this.styles.get(key)!;
  }

  getStyleCount(): number {
    return this.styles.size;
  }
}

// Context - Stores extrinsic state (unique per object)
class Character {
  constructor(
    private char: string,
    private style: CharacterStyle,
    private position: number
  ) {}

  display(): void {
    console.log(
      `Character '${this.char}' at position ${this.position}: ${this.style.display()}`
    );
  }
}

// Client
class TextEditor {
  private characters: Character[] = [];
  private styleFactory: StyleFactory = new StyleFactory();

  addCharacter(char: string, font: string, size: number, color: string): void {
    const style = this.styleFactory.getStyle(font, size, color);
    const position = this.characters.length;
    this.characters.push(new Character(char, style, position));
  }

  displayDocument(): void {
    console.log("\n--- Document Content ---");
    this.characters.forEach(char => char.display());
  }

  getMemoryUsage(): void {
    console.log("\n--- Memory Usage Statistics ---");
    console.log(`Total characters: ${this.characters.length}`);
    console.log(`Unique styles (flyweights): ${this.styleFactory.getStyleCount()}`);
    console.log(
      `Memory saved: Without flyweight would need ${this.characters.length} style objects, ` +
      `now using only ${this.styleFactory.getStyleCount()}`
    );
  }
}

// Usage
console.log("--- Creating Document ---");
const editor = new TextEditor();

// Add characters with same style - will reuse flyweight
editor.addCharacter('H', 'Arial', 12, 'black');
editor.addCharacter('e', 'Arial', 12, 'black');
editor.addCharacter('l', 'Arial', 12, 'black');
editor.addCharacter('l', 'Arial', 12, 'black');
editor.addCharacter('o', 'Arial', 12, 'black');

// Add characters with different style
editor.addCharacter(' ', 'Arial', 12, 'black');
editor.addCharacter('W', 'Arial', 16, 'red');
editor.addCharacter('o', 'Arial', 16, 'red');
editor.addCharacter('r', 'Arial', 16, 'red');
editor.addCharacter('l', 'Arial', 16, 'red');
editor.addCharacter('d', 'Arial', 16, 'red');

editor.displayDocument();
editor.getMemoryUsage();

// ============================================
// Real-World Example: Particle System
// ============================================

console.log("\n\n=== Real-World: Particle System ===\n");

// Flyweight - Intrinsic state (shared among particles)
class ParticleType {
  constructor(
    public sprite: string,
    public color: string,
    public mass: number
  ) {
    console.log(`  Loading particle type: ${sprite} (${color}, mass: ${mass})`);
  }

  render(x: number, y: number, velocityX: number, velocityY: number): void {
    console.log(
      `Rendering ${this.sprite} at (${x}, ${y}) velocity: (${velocityX}, ${velocityY})`
    );
  }
}

// Flyweight Factory
class ParticleTypeFactory {
  private types: Map<string, ParticleType> = new Map();

  getParticleType(sprite: string, color: string, mass: number): ParticleType {
    const key = `${sprite}-${color}-${mass}`;
    
    if (!this.types.has(key)) {
      this.types.set(key, new ParticleType(sprite, color, mass));
    }
    
    return this.types.get(key)!;
  }

  getTypeCount(): number {
    return this.types.size;
  }
}

// Context - Extrinsic state (unique per particle)
class Particle {
  constructor(
    public x: number,
    public y: number,
    public velocityX: number,
    public velocityY: number,
    private type: ParticleType
  ) {}

  update(deltaTime: number): void {
    this.x += this.velocityX * deltaTime;
    this.y += this.velocityY * deltaTime;
  }

  render(): void {
    this.type.render(this.x, this.y, this.velocityX, this.velocityY);
  }
}

// Client
class ParticleSystem {
  private particles: Particle[] = [];
  private typeFactory: ParticleTypeFactory = new ParticleTypeFactory();

  createParticle(
    x: number,
    y: number,
    velocityX: number,
    velocityY: number,
    sprite: string,
    color: string,
    mass: number
  ): void {
    const type = this.typeFactory.getParticleType(sprite, color, mass);
    this.particles.push(new Particle(x, y, velocityX, velocityY, type));
  }

  update(deltaTime: number): void {
    this.particles.forEach(p => p.update(deltaTime));
  }

  render(): void {
    console.log(`\n--- Rendering ${this.particles.length} particles ---`);
    this.particles.slice(0, 3).forEach(p => p.render()); // Show first 3
    if (this.particles.length > 3) {
      console.log(`... and ${this.particles.length - 3} more particles`);
    }
  }

  getStats(): void {
    console.log("\n--- Particle System Statistics ---");
    console.log(`Total particles: ${this.particles.length}`);
    console.log(`Particle types (flyweights): ${this.typeFactory.getTypeCount()}`);
    const memoryWithout = this.particles.length * 3; // sprite, color, mass per particle
    const memoryWith = this.typeFactory.getTypeCount() * 3;
    console.log(`Memory units: ${memoryWith} (vs ${memoryWithout} without flyweight)`);
    console.log(`Saved: ${((1 - memoryWith/memoryWithout) * 100).toFixed(1)}%`);
  }
}

// Usage
console.log("--- Creating Particle Effects ---");
const particleSystem = new ParticleSystem();

// Create explosion effect - many particles of same type
console.log("\nCreating explosion particles...");
for (let i = 0; i < 50; i++) {
  particleSystem.createParticle(
    100, 100,
    Math.random() * 10 - 5,
    Math.random() * 10 - 5,
    'spark',
    'orange',
    0.1
  );
}

// Create smoke effect
console.log("\nCreating smoke particles...");
for (let i = 0; i < 30; i++) {
  particleSystem.createParticle(
    150, 150,
    Math.random() * 2 - 1,
    -Math.random() * 3,
    'cloud',
    'gray',
    0.05
  );
}

// Create stars
console.log("\nCreating star particles...");
for (let i = 0; i < 20; i++) {
  particleSystem.createParticle(
    200, 200,
    Math.random() * 4 - 2,
    Math.random() * 4 - 2,
    'star',
    'yellow',
    0.01
  );
}

particleSystem.update(0.016); // Update with ~60fps delta
particleSystem.render();
particleSystem.getStats();

// ============================================
// Real-World Example: Forest Simulation
// ============================================

console.log("\n\n=== Real-World: Forest Simulation ===\n");

// Flyweight - Tree type (intrinsic state)
class TreeType {
  constructor(
    public name: string,
    public color: string,
    public texture: string
  ) {
    console.log(`  Loading tree type: ${name} (${color}, ${texture})`);
  }

  display(x: number, y: number, height: number): void {
    console.log(
      `Drawing ${this.name} tree at (${x}, ${y}) height: ${height}m - ${this.color}, ${this.texture}`
    );
  }
}

// Flyweight Factory
class TreeFactory {
  private treeTypes: Map<string, TreeType> = new Map();

  getTreeType(name: string, color: string, texture: string): TreeType {
    const key = `${name}-${color}-${texture}`;
    
    if (!this.treeTypes.has(key)) {
      this.treeTypes.set(key, new TreeType(name, color, texture));
    }
    
    return this.treeTypes.get(key)!;
  }

  getTypeCount(): number {
    return this.treeTypes.size;
  }
}

// Context - Individual tree (extrinsic state)
class Tree {
  constructor(
    public x: number,
    public y: number,
    public height: number,
    private type: TreeType
  ) {}

  draw(): void {
    this.type.display(this.x, this.y, this.height);
  }
}

// Client
class Forest {
  private trees: Tree[] = [];
  private treeFactory: TreeFactory = new TreeFactory();

  plantTree(
    x: number,
    y: number,
    height: number,
    name: string,
    color: string,
    texture: string
  ): void {
    const type = this.treeFactory.getTreeType(name, color, texture);
    this.trees.push(new Tree(x, y, height, type));
  }

  draw(): void {
    console.log(`\n--- Drawing Forest (${this.trees.length} trees) ---`);
    this.trees.slice(0, 5).forEach(tree => tree.draw());
    if (this.trees.length > 5) {
      console.log(`... and ${this.trees.length - 5} more trees`);
    }
  }

  getStats(): void {
    console.log("\n--- Forest Statistics ---");
    console.log(`Total trees: ${this.trees.length}`);
    console.log(`Tree types (flyweights): ${this.treeFactory.getTypeCount()}`);
    
    // Estimate memory savings
    const bytesPerTreeType = 100; // name, color, texture
    const bytesPerTreeLocation = 12; // x, y, height
    
    const withFlyweight = 
      (this.treeFactory.getTypeCount() * bytesPerTreeType) + 
      (this.trees.length * bytesPerTreeLocation);
    
    const withoutFlyweight = 
      this.trees.length * (bytesPerTreeType + bytesPerTreeLocation);
    
    console.log(`Memory with flyweight: ~${withFlyweight} bytes`);
    console.log(`Memory without flyweight: ~${withoutFlyweight} bytes`);
    console.log(`Saved: ~${withoutFlyweight - withFlyweight} bytes (${((1 - withFlyweight/withoutFlyweight) * 100).toFixed(1)}%)`);
  }
}

// Usage
console.log("--- Planting Forest ---");
const forest = new Forest();

// Plant many oak trees
console.log("\nPlanting oak trees...");
for (let i = 0; i < 100; i++) {
  forest.plantTree(
    Math.random() * 1000,
    Math.random() * 1000,
    15 + Math.random() * 10,
    'Oak',
    'Dark Green',
    'Rough Bark'
  );
}

// Plant pine trees
console.log("\nPlanting pine trees...");
for (let i = 0; i < 50; i++) {
  forest.plantTree(
    Math.random() * 1000,
    Math.random() * 1000,
    20 + Math.random() * 15,
    'Pine',
    'Green',
    'Scaly Bark'
  );
}

// Plant birch trees
console.log("\nPlanting birch trees...");
for (let i = 0; i < 30; i++) {
  forest.plantTree(
    Math.random() * 1000,
    Math.random() * 1000,
    10 + Math.random() * 8,
    'Birch',
    'Light Green',
    'White Bark'
  );
}

forest.draw();
forest.getStats();

// ============================================
// Real-World Example: Icon Cache
// ============================================

console.log("\n\n=== Real-World: Icon Cache System ===\n");

// Flyweight
class Icon {
  private imageData: string;

  constructor(public name: string, public path: string) {
    console.log(`  Loading icon from disk: ${path}`);
    // Simulate loading large image data
    this.imageData = `[Binary data for ${name}]`;
  }

  render(x: number, y: number, scale: number): void {
    console.log(`Rendering ${this.name} at (${x}, ${y}) scale: ${scale}x`);
  }

  getSize(): number {
    return this.imageData.length;
  }
}

// Flyweight Factory
class IconCache {
  private icons: Map<string, Icon> = new Map();
  private cacheHits: number = 0;
  private cacheMisses: number = 0;

  getIcon(name: string, path: string): Icon {
    if (!this.icons.has(name)) {
      console.log(`Cache miss for: ${name}`);
      this.icons.set(name, new Icon(name, path));
      this.cacheMisses++;
    } else {
      console.log(`Cache hit for: ${name}`);
      this.cacheHits++;
    }
    
    return this.icons.get(name)!;
  }

  getCacheStats(): void {
    console.log("\n--- Icon Cache Statistics ---");
    console.log(`Total unique icons: ${this.icons.size}`);
    console.log(`Cache hits: ${this.cacheHits}`);
    console.log(`Cache misses: ${this.cacheMisses}`);
    console.log(`Hit rate: ${((this.cacheHits / (this.cacheHits + this.cacheMisses)) * 100).toFixed(1)}%`);
  }
}

// Context - Icon instance with position and scale
class IconInstance {
  constructor(
    private icon: Icon,
    private x: number,
    private y: number,
    private scale: number
  ) {}

  draw(): void {
    this.icon.render(this.x, this.y, this.scale);
  }
}

// Client - File Explorer
class FileExplorer {
  private iconCache: IconCache = new IconCache();
  private iconInstances: IconInstance[] = [];

  addFile(name: string, x: number, y: number, scale: number = 1): void {
    let iconPath: string;
    
    if (name.endsWith('.pdf')) {
      iconPath = '/icons/pdf.png';
    } else if (name.endsWith('.jpg') || name.endsWith('.png')) {
      iconPath = '/icons/image.png';
    } else if (name.endsWith('.txt')) {
      iconPath = '/icons/text.png';
    } else if (name.endsWith('.zip')) {
      iconPath = '/icons/archive.png';
    } else {
      iconPath = '/icons/file.png';
    }

    const icon = this.iconCache.getIcon(iconPath, iconPath);
    this.iconInstances.push(new IconInstance(icon, x, y, scale));
  }

  render(): void {
    console.log(`\n--- Rendering File Explorer (${this.iconInstances.length} files) ---`);
    this.iconInstances.slice(0, 3).forEach(instance => instance.draw());
    if (this.iconInstances.length > 3) {
      console.log(`... and ${this.iconInstances.length - 3} more files`);
    }
  }

  showStats(): void {
    this.iconCache.getCacheStats();
  }
}

// Usage
console.log("--- Loading Files in Explorer ---\n");
const explorer = new FileExplorer();

// Add many files - icons will be reused
explorer.addFile('document1.pdf', 10, 10);
explorer.addFile('document2.pdf', 10, 50);
explorer.addFile('document3.pdf', 10, 90);
explorer.addFile('photo1.jpg', 100, 10);
explorer.addFile('photo2.jpg', 100, 50);
explorer.addFile('photo3.png', 100, 90);
explorer.addFile('notes.txt', 200, 10);
explorer.addFile('readme.txt', 200, 50);
explorer.addFile('archive.zip', 300, 10);
explorer.addFile('backup.zip', 300, 50);

explorer.render();
explorer.showStats();

// ============================================
// Key Takeaways
// ============================================

console.log("\n\n=== Flyweight Pattern Summary ===");
console.log("\nWhen to use:");
console.log("  ✓ Application uses large number of similar objects");
console.log("  ✓ Storage costs are high due to object quantity");
console.log("  ✓ Most object state can be made extrinsic");
console.log("  ✓ Application doesn't depend on object identity");

console.log("\nKey Concepts:");
console.log("  • Intrinsic state: Shared, context-independent, immutable");
console.log("  • Extrinsic state: Varies with context, passed to methods");
console.log("  • Flyweight Factory: Manages and caches shared flyweights");

console.log("\nBenefits:");
console.log("  ✓ Saves memory when dealing with many similar objects");
console.log("  ✓ Can improve performance (less memory allocation)");
console.log("  ✓ Centralizes state management");

console.log("\nDrawbacks:");
console.log("  ⚠ Trades RAM for CPU (extracting extrinsic state)");
console.log("  ⚠ Code becomes more complicated");
console.log("  ⚠ Management overhead");

console.log("\nCommon Use Cases:");
console.log("  • Text editors (character formatting)");
console.log("  • Game particle systems");
console.log("  • UI icon caches");
console.log("  • Large-scale simulations (forest, city)");
console.log("  • String interning");
```

```python
# Python - Flyweight Pattern

from typing import Dict
import random

# ============================================
# Basic Flyweight - Text Editor
# ============================================

print("=== Basic Flyweight: Text Editor ===\n")

# Flyweight
class CharacterStyle:
    def __init__(self, font: str, size: int, color: str):
        self.font = font
        self.size = size
        self.color = color
        print(f"  Creating new style: {font} {size}pt {color}")
    
    def display(self) -> str:
        return f"{self.font} {self.size}pt {self.color}"

# Flyweight Factory
class StyleFactory:
    def __init__(self):
        self._styles: Dict[str, CharacterStyle] = {}
    
    def get_style(self, font: str, size: int, color: str) -> CharacterStyle:
        key = f"{font}-{size}-{color}"
        
        if key not in self._styles:
            print(f"Creating new shared style: {key}")
            self._styles[key] = CharacterStyle(font, size, color)
        else:
            print(f"Reusing existing style: {key}")
        
        return self._styles[key]
    
    def get_style_count(self) -> int:
        return len(self._styles)

# Context
class Character:
    def __init__(self, char: str, style: CharacterStyle, position: int):
        self._char = char
        self._style = style
        self._position = position
    
    def display(self) -> None:
        print(f"Character '{self._char}' at position {self._position}: {self._style.display()}")

# Client
class TextEditor:
    def __init__(self):
        self._characters = []
        self._style_factory = StyleFactory()
    
    def add_character(self, char: str, font: str, size: int, color: str) -> None:
        style = self._style_factory.get_style(font, size, color)
        position = len(self._characters)
        self._characters.append(Character(char, style, position))
    
    def display_document(self) -> None:
        print("\n--- Document Content ---")
        for char in self._characters:
            char.display()
    
    def get_memory_usage(self) -> None:
        print("\n--- Memory Usage Statistics ---")
        print(f"Total characters: {len(self._characters)}")
        print(f"Unique styles (flyweights): {self._style_factory.get_style_count()}")
        print(f"Memory saved: Without flyweight would need {len(self._characters)} style objects, "
              f"now using only {self._style_factory.get_style_count()}")

# Usage
print("--- Creating Document ---")
editor = TextEditor()

# Add characters with same style
editor.add_character('H', 'Arial', 12, 'black')
editor.add_character('e', 'Arial', 12, 'black')
editor.add_character('l', 'Arial', 12, 'black')
editor.add_character('l', 'Arial', 12, 'black')
editor.add_character('o', 'Arial', 12, 'black')

# Add characters with different style
editor.add_character(' ', 'Arial', 12, 'black')
editor.add_character('W', 'Arial', 16, 'red')
editor.add_character('o', 'Arial', 16, 'red')
editor.add_character('r', 'Arial', 16, 'red')
editor.add_character('l', 'Arial', 16, 'red')
editor.add_character('d', 'Arial', 16, 'red')

editor.display_document()
editor.get_memory_usage()

# ============================================
# Real-World Example: Particle System
# ============================================

print("\n\n=== Real-World: Particle System ===\n")

# Flyweight
class ParticleType:
    def __init__(self, sprite: str, color: str, mass: float):
        self.sprite = sprite
        self.color = color
        self.mass = mass
        print(f"  Loading particle type: {sprite} ({color}, mass: {mass})")
    
    def render(self, x: float, y: float, velocity_x: float, velocity_y: float) -> None:
        print(f"Rendering {self.sprite} at ({x:.1f}, {y:.1f}) velocity: ({velocity_x:.1f}, {velocity_y:.1f})")

# Flyweight Factory
class ParticleTypeFactory:
    def __init__(self):
        self._types: Dict[str, ParticleType] = {}
    
    def get_particle_type(self, sprite: str, color: str, mass: float) -> ParticleType:
        key = f"{sprite}-{color}-{mass}"
        
        if key not in self._types:
            self._types[key] = ParticleType(sprite, color, mass)
        
        return self._types[key]
    
    def get_type_count(self) -> int:
        return len(self._types)

# Context
class Particle:
    def __init__(self, x: float, y: float, velocity_x: float, velocity_y: float, 
                 particle_type: ParticleType):
        self.x = x
        self.y = y
        self.velocity_x = velocity_x
        self.velocity_y = velocity_y
        self._type = particle_type
    
    def update(self, delta_time: float) -> None:
        self.x += self.velocity_x * delta_time
        self.y += self.velocity_y * delta_time
    
    def render(self) -> None:
        self._type.render(self.x, self.y, self.velocity_x, self.velocity_y)

# Client
class ParticleSystem:
    def __init__(self):
        self._particles = []
        self._type_factory = ParticleTypeFactory()
    
    def create_particle(self, x: float, y: float, velocity_x: float, velocity_y: float,
                       sprite: str, color: str, mass: float) -> None:
        particle_type = self._type_factory.get_particle_type(sprite, color, mass)
        self._particles.append(Particle(x, y, velocity_x, velocity_y, particle_type))
    
    def update(self, delta_time: float) -> None:
        for particle in self._particles:
            particle.update(delta_time)
    
    def render(self) -> None:
        print(f"\n--- Rendering {len(self._particles)} particles ---")
        for particle in self._particles[:3]:  # Show first 3
            particle.render()
        if len(self._particles) > 3:
            print(f"... and {len(self._particles) - 3} more particles")
    
    def get_stats(self) -> None:
        print("\n--- Particle System Statistics ---")
        print(f"Total particles: {len(self._particles)}")
        print(f"Particle types (flyweights): {self._type_factory.get_type_count()}")
        memory_without = len(self._particles) * 3
        memory_with = self._type_factory.get_type_count() * 3
        print(f"Memory units: {memory_with} (vs {memory_without} without flyweight)")
        print(f"Saved: {((1 - memory_with/memory_without) * 100):.1f}%")

# Usage
print("--- Creating Particle Effects ---")
particle_system = ParticleSystem()

print("\nCreating explosion particles...")
for i in range(50):
    particle_system.create_particle(
        100, 100,
        random.random() * 10 - 5,
        random.random() * 10 - 5,
        'spark', 'orange', 0.1
    )

print("\nCreating smoke particles...")
for i in range(30):
    particle_system.create_particle(
        150, 150,
        random.random() * 2 - 1,
        -random.random() * 3,
        'cloud', 'gray', 0.05
    )

print("\nCreating star particles...")
for i in range(20):
    particle_system.create_particle(
        200, 200,
        random.random() * 4 - 2,
        random.random() * 4 - 2,
        'star', 'yellow', 0.01
    )

particle_system.update(0.016)
particle_system.render()
particle_system.get_stats()

# ============================================
# Real-World Example: Forest Simulation
# ============================================

print("\n\n=== Real-World: Forest Simulation ===\n")

# Flyweight
class TreeType:
    def __init__(self, name: str, color: str, texture: str):
        self.name = name
        self.color = color
        self.texture = texture
        print(f"  Loading tree type: {name} ({color}, {texture})")
    
    def display(self, x: float, y: float, height: float) -> None:
        print(f"Drawing {self.name} tree at ({x:.1f}, {y:.1f}) height: {height:.1f}m - "
              f"{self.color}, {self.texture}")

# Flyweight Factory
class TreeFactory:
    def __init__(self):
        self._tree_types: Dict[str, TreeType] = {}
    
    def get_tree_type(self, name: str, color: str, texture: str) -> TreeType:
        key = f"{name}-{color}-{texture}"
        
        if key not in self._tree_types:
            self._tree_types[key] = TreeType(name, color, texture)
        
        return self._tree_types[key]
    
    def get_type_count(self) -> int:
        return len(self._tree_types)

# Context
class Tree:
    def __init__(self, x: float, y: float, height: float, tree_type: TreeType):
        self.x = x
        self.y = y
        self.height = height
        self._type = tree_type
    
    def draw(self) -> None:
        self._type.display(self.x, self.y, self.height)

# Client
class Forest:
    def __init__(self):
        self._trees = []
        self._tree_factory = TreeFactory()
    
    def plant_tree(self, x: float, y: float, height: float, 
                   name: str, color: str, texture: str) -> None:
        tree_type = self._tree_factory.get_tree_type(name, color, texture)
        self._trees.append(Tree(x, y, height, tree_type))
    
    def draw(self) -> None:
        print(f"\n--- Drawing Forest ({len(self._trees)} trees) ---")
        for tree in self._trees[:5]:
            tree.draw()
        if len(self._trees) > 5:
            print(f"... and {len(self._trees) - 5} more trees")
    
    def get_stats(self) -> None:
        print("\n--- Forest Statistics ---")
        print(f"Total trees: {len(self._trees)}")
        print(f"Tree types (flyweights): {self._tree_factory.get_type_count()}")
        
        bytes_per_tree_type = 100
        bytes_per_tree_location = 12
        
        with_flyweight = (self._tree_factory.get_type_count() * bytes_per_tree_type +
                         len(self._trees) * bytes_per_tree_location)
        without_flyweight = len(self._trees) * (bytes_per_tree_type + bytes_per_tree_location)
        
        print(f"Memory with flyweight: ~{with_flyweight} bytes")
        print(f"Memory without flyweight: ~{without_flyweight} bytes")
        print(f"Saved: ~{without_flyweight - with_flyweight} bytes "
              f"({((1 - with_flyweight/without_flyweight) * 100):.1f}%)")

# Usage
print("--- Planting Forest ---")
forest = Forest()

print("\nPlanting oak trees...")
for i in range(100):
    forest.plant_tree(
        random.random() * 1000,
        random.random() * 1000,
        15 + random.random() * 10,
        'Oak', 'Dark Green', 'Rough Bark'
    )

print("\nPlanting pine trees...")
for i in range(50):
    forest.plant_tree(
        random.random() * 1000,
        random.random() * 1000,
        20 + random.random() * 15,
        'Pine', 'Green', 'Scaly Bark'
    )

print("\nPlanting birch trees...")
for i in range(30):
    forest.plant_tree(
        random.random() * 1000,
        random.random() * 1000,
        10 + random.random() * 8,
        'Birch', 'Light Green', 'White Bark'
    )

forest.draw()
forest.get_stats()

print("\n\n=== Flyweight Pattern Summary ===")
print("\nWhen to use:")
print("  ✓ Application uses large number of similar objects")
print("  ✓ Storage costs are high due to object quantity")
print("  ✓ Most object state can be made extrinsic")

print("\nKey Concepts:")
print("  • Intrinsic state: Shared, context-independent")
print("  • Extrinsic state: Varies with context, passed to methods")
print("  • Flyweight Factory: Manages shared flyweights")

print("\nBenefits:")
print("  ✓ Saves memory with many similar objects")
print("  ✓ Can improve performance")

print("\nDrawbacks:")
print("  ⚠ Trades RAM for CPU")
print("  ⚠ Code becomes more complicated")
```

</details>

---

## Summary - Structural Patterns

This completes all seven Structural Patterns:

1. **Adapter**: Convert interface of a class into another interface clients expect (payment gateways, API adapters)
2. **Decorator**: Add responsibilities to objects dynamically (I/O streams, notifications, text formatting)
3. **Facade**: Provide unified interface to complex subsystem (order processing, home theater, API dashboards)
4. **Proxy**: Control access to another object (virtual, protection, caching, remote proxies)
5. **Composite**: Compose objects into tree structures (file systems, organizations, UI components)
6. **Bridge**: Decouple abstraction from implementation (remotes/devices, shapes/renderers, messages/senders)
7. **Flyweight**: Share common state among many objects to save memory (particles, forests, text formatting)

**Key Principle**: Structural patterns focus on how classes and objects are composed to form larger structures while keeping them flexible and efficient.

---

## Practice Questions - Structural Patterns

<details>
<summary><strong>View Questions</strong></summary>

### Fill in the Blanks

1. The __________ pattern converts the interface of a class into another interface clients expect, while the __________ pattern provides a simplified interface to a complex subsystem.

2. In the Decorator pattern, decorators __________ the component interface and add behavior __________ or __________ the call to the wrapped component.

3. The Proxy pattern has five main types: __________ proxy delays object creation, __________ proxy controls access based on permissions, __________ proxy stores results for reuse, __________ proxy represents remote objects, and __________ reference adds additional actions.

4. The Composite pattern treats individual objects and __________ of objects uniformly through a common __________.

5. In the Bridge pattern, the __________ is the high-level control layer that delegates work to the __________ layer.

6. The Flyweight pattern separates object state into __________ state (shared, immutable) and __________ state (unique, passed to methods).

<details>
<summary><strong>View Answers</strong></summary>

1. **Adapter**, **Facade** - Adapter makes incompatible interfaces work together (wraps one object). Facade simplifies complex subsystems (wraps many objects). Adapter focuses on interface compatibility, Facade on simplification.

2. **implement**, **before**, **after** - Decorators implement the same interface as the component they wrap. They can add behavior before calling the wrapped object (logging, validation), after (cleanup, notifications), or both.

3. **Virtual**, **Protection**, **Caching**, **Remote**, **Smart** - Virtual: lazy loading (ImageProxy loads image only when displayed). Protection: access control (DocumentProxy checks permissions). Caching: store results (CachingProxy avoids repeated database calls). Remote: local representative of remote object (API client). Smart reference: additional actions like reference counting or logging.

4. **compositions**, **interface** - Composite treats leaves (File) and composites (Folder) uniformly. Both implement FileSystemComponent interface. Client doesn't care if working with single object or tree of objects.

5. **abstraction**, **implementation** - Abstraction (RemoteControl) is what client uses. Implementation (Device - TV, Radio) is how it's done. Bridge decouples them so both can vary independently. You can change remote design without changing TV, and add new TVs without changing remote.

6. **intrinsic**, **extrinsic** - Intrinsic: shared among many objects (TreeType with color, texture - same for all oak trees). Extrinsic: unique per object, passed to methods (Tree position x, y - different for each tree). Flyweight stores intrinsic, clients pass extrinsic.

</details>

---

### True/False

1. ⬜ Adapter and Decorator both wrap objects, but Adapter changes the interface while Decorator adds responsibilities.

2. ⬜ In Facade pattern, clients can still access subsystem classes directly if needed.

3. ⬜ Virtual Proxy and Lazy Initialization are the same concept.

4. ⬜ Composite pattern violates the Single Responsibility Principle because composite objects manage children AND perform business logic.

5. ⬜ Bridge pattern is applied after system is designed, while Adapter is designed upfront.

6. ⬜ Flyweight pattern always improves performance by reducing memory usage.

7. ⬜ Decorator pattern can add unlimited layers of decorators to an object at runtime.

8. ⬜ In Proxy pattern, the proxy and real subject must implement the same interface.

<details>
<summary><strong>View Answers</strong></summary>

1. **True** - Adapter changes interface to make incompatible classes work together (StripeAPI → PaymentProcessor). Decorator keeps same interface but adds behavior (logging, compression, encryption to DataSource). Both wrap, different purposes.

2. **True** - Facade doesn't encapsulate subsystem, just provides simpler interface. Clients can bypass facade and access subsystem directly if they need advanced features. Facade is about convenience, not restriction.

3. **True** - Virtual Proxy implements lazy initialization. Instead of creating expensive object immediately (new RealImage() loads from disk), proxy delays creation until first use. When client calls display(), proxy creates real object then.

4. **True** - This is an acceptable trade-off. Composite manages children (add, remove, getChildren) AND performs operations (getSize sums children's sizes). The pattern's benefits (uniform treatment of individual/composite objects) outweigh SRP violation.

5. **False** - **Opposite!** Bridge is designed upfront to let abstraction and implementation vary independently (RemoteControl + Device designed together). Adapter is applied after to make existing incompatible classes work together (legacy API → new interface).

6. **False** - Flyweight trades RAM for CPU. Saves memory (one TreeType for 100 oaks instead of 100 copies) but costs CPU time (extracting/passing extrinsic state). For small numbers of objects, overhead may exceed benefits. Use when you have MANY similar objects.

7. **True** - You can wrap unlimited times: `new LoggingDecorator(new CompressionDecorator(new EncryptionDecorator(new FileDataSource())))`. Each decorator wraps previous. This is powerful but can create deep call stacks and complexity.

8. **True** - Proxy and real subject implement same interface so they're interchangeable. Client works with interface, doesn't know if using proxy or real object. ImageProxy and RealImage both implement Image interface.

</details>

---

### Multiple Choice

1. **Which pattern would you use to make a legacy PayPal API work with your PaymentProcessor interface?**
   - A) Decorator
   - B) Facade
   - C) Adapter
   - D) Bridge

2. **You want to add logging, compression, and encryption to file operations without modifying the File class. Which pattern?**
   - A) Proxy
   - B) Decorator
   - C) Adapter
   - D) Composite

3. **Your e-commerce system has 10+ subsystems (inventory, payment, shipping, notifications). You want a simple placeOrder() method. Which pattern?**
   - A) Adapter
   - B) Proxy
   - C) Facade
   - D) Bridge

4. **You need to delay loading large images until they're displayed. Which pattern?**
   - A) Virtual Proxy
   - B) Protection Proxy
   - C) Decorator
   - D) Flyweight

5. **You're building a file system where folders can contain files OR other folders. Which pattern?**
   - A) Bridge
   - B) Composite
   - C) Decorator
   - D) Flyweight

6. **You have 100,000 tree objects in a forest simulation. Each tree has type (oak, pine) and position. Which pattern saves memory?**
   - A) Proxy
   - B) Decorator
   - C) Composite
   - D) Flyweight

7. **You want shapes (Circle, Rectangle) to work with different renderers (Vector, Raster) independently. Which pattern?**
   - A) Adapter
   - B) Bridge
   - C) Decorator
   - D) Composite

8. **What's the main difference between Adapter and Bridge?**
   - A) Adapter adds behavior, Bridge changes interface
   - B) Adapter is structural, Bridge is creational
   - C) Adapter fixes incompatibility after, Bridge designs for independence upfront
   - D) They're the same pattern

<details>
<summary><strong>View Answers</strong></summary>

1. **C - Adapter** - You have incompatible interface (PayPal's sendPayment) that needs to work with your interface (PaymentProcessor). Adapter wraps PayPal and translates calls: when client calls processPayment(), adapter calls PayPal's sendPayment().

2. **B - Decorator** - You want to add responsibilities (logging, compression, encryption) dynamically without modifying File class. Stack decorators: `new LoggingDecorator(new CompressionDecorator(new EncryptionDecorator(new File())))`. Each adds behavior, all implement same interface.

3. **C - Facade** - Many complex subsystems need simple interface. OrderFacade.placeOrder() orchestrates all subsystems internally: check inventory, process payment, create shipment, send notifications. Client just calls one method.

4. **A - Virtual Proxy** - Virtual Proxy delays expensive object creation. ImageProxy created immediately (cheap), but RealImage loaded from disk only when display() called. Protection Proxy is for access control, not lazy loading.

5. **B - Composite** - Tree structure where containers (Folder) and leaves (File) treated uniformly. Folder can contain Files OR other Folders. Both implement FileSystemComponent so client code is same: `component.getSize()` works for both.

6. **D - Flyweight** - Many similar objects (100,000 trees). Extract shared state (TreeType: oak/pine with color, texture) into flyweight, share it. Store unique state (x, y position) per tree. Instead of 100,000 complete tree objects, have 2-3 TreeTypes + 100,000 positions.

7. **B - Bridge** - Two hierarchies that vary independently. Shapes (abstraction): Circle, Rectangle. Renderers (implementation): Vector, Raster. Bridge connects them. Can add new shapes without changing renderers, add new renderers without changing shapes. Any shape works with any renderer.

8. **C** - Adapter is **remedial** (fix incompatibility after the fact, make existing classes work together). Bridge is **proactive** (design upfront so abstraction and implementation can vary independently). Adapter about compatibility, Bridge about independent variation.

</details>

---

### Scenario-Based Questions

**Question 1**: You're building a graphics editor. Users can draw shapes (circles, rectangles, triangles) and export to different formats (PNG, SVG, PDF). New shapes and formats are added frequently. Which pattern(s) would you use and why?

<details>
<summary><strong>View Answer</strong></summary>

**Answer: Bridge Pattern**

**Why Bridge?**
- Two dimensions of variation: shapes (Circle, Rectangle, Triangle) and renderers (PNG, SVG, PDF)
- Both need to extend independently
- Any shape should work with any renderer
- Avoids combinatorial explosion (9 classes for 3 shapes × 3 formats)

**Implementation:**
```typescript
// Abstraction
abstract class Shape {
  constructor(protected renderer: Renderer) {}
  abstract draw(): void;
}

// Refined Abstractions
class Circle extends Shape { /* ... */ }
class Rectangle extends Shape { /* ... */ }

// Implementation
interface Renderer {
  renderCircle(...): void;
  renderRectangle(...): void;
}

// Concrete Implementations
class PNGRenderer implements Renderer { /* ... */ }
class SVGRenderer implements Renderer { /* ... */ }
class PDFRenderer implements Renderer { /* ... */ }
```

**Benefits:**
- Add new shape: extend Shape (doesn't affect renderers)
- Add new format: implement Renderer (doesn't affect shapes)
- Any shape works with any renderer: `new Circle(new SVGRenderer())`

**Alternative considered:** Decorator - No, doesn't fit. Decorator adds behavior to existing objects, doesn't solve independent variation problem.

</details>

---

**Question 2**: You're building a document editor. Documents can be plain text, have bold formatting, have italic formatting, have underlines, and have colored text. Users can combine these in any way. Which pattern would you use?

<details>
<summary><strong>View Answer</strong></summary>

**Answer: Decorator Pattern**

**Why Decorator?**
- Need to add responsibilities (formatting) dynamically
- Combinations are flexible: bold, italic, bold+italic, bold+italic+underline+color
- Can't use inheritance (would need class for every combination: 2^4 = 16 classes)
- Features can be added/removed at runtime

**Implementation:**
```typescript
// Component
interface Text {
  render(): string;
}

// Concrete Component
class PlainText implements Text {
  render() { return this.content; }
}

// Decorators
class BoldDecorator extends TextDecorator {
  render() { return `<b>${this.text.render()}</b>`; }
}

class ItalicDecorator extends TextDecorator {
  render() { return `<i>${this.text.render()}</i>`; }
}

// Usage
let text = new PlainText("Hello");
text = new BoldDecorator(text);
text = new ItalicDecorator(text);
text = new ColorDecorator(text, "red");
// Result: <span style="color:red"><i><b>Hello</b></i></span>
```

**Benefits:**
- Add formatting dynamically at runtime
- Combine features flexibly
- Add new formatters without modifying existing code (Open/Closed)

**Why not other patterns:**
- Not Bridge: No two independent hierarchies
- Not Composite: Not tree structure
- Not Flyweight: Not about memory optimization

</details>

---

**Question 3**: You're building an online game with 50,000 soldier units. Each soldier has type (archer, swordsman, cavalry), position (x, y), health, and owner. Memory usage is critical. Which pattern and how?

<details>
<summary><strong>View Answer</strong></summary>

**Answer: Flyweight Pattern**

**Analysis:**
- 50,000 similar objects (high memory usage)
- Shared state: soldier type (sprite, animations, stats) - maybe only 3-5 types
- Unique state: position, health, owner - different for each soldier

**Implementation:**
```typescript
// Flyweight - Intrinsic state (shared)
class SoldierType {
  constructor(
    public sprite: string,
    public attackPower: number,
    public maxHealth: number
  ) {}
  
  render(x, y, currentHealth) {
    // Use shared data + extrinsic state
  }
}

// Context - Extrinsic state (unique)
class Soldier {
  constructor(
    public x: number,
    public y: number,
    public health: number,
    public owner: string,
    private type: SoldierType  // Reference to shared flyweight
  ) {}
}

// Flyweight Factory
class SoldierFactory {
  private types = new Map<string, SoldierType>();
  
  getSoldierType(name: string): SoldierType {
    if (!this.types.has(name)) {
      this.types.set(name, new SoldierType(...));
    }
    return this.types.get(name)!;
  }
}

// Usage
const factory = new SoldierFactory();
const archerType = factory.getSoldierType("archer");

// Create 20,000 archers - all share same archerType
for (let i = 0; i < 20000; i++) {
  soldiers.push(new Soldier(x, y, 100, "player1", archerType));
}
```

**Memory Savings:**
- **Without Flyweight**: 50,000 soldiers × (sprite + stats + position + health + owner)
  - ~50,000 × 200 bytes = ~10 MB
- **With Flyweight**: 5 SoldierTypes × 150 bytes + 50,000 soldiers × 50 bytes
  - ~750 bytes + 2.5 MB = ~2.5 MB
- **Saved**: ~75% memory reduction

**Why not other patterns:**
- Not Proxy: Not about access control or lazy loading
- Not Composite: Not tree structure
- Not Decorator: Not adding behavior

</details>

---

**Question 4**: Your app needs to access user data from a database. Requirements: (1) Expensive to create database connection, (2) Only admins can delete users, (3) Need to cache frequent queries. Which pattern(s)?

<details>
<summary><strong>View Answer</strong></summary>

**Answer: Multiple Proxies (Composite Proxy Chain)**

Use three proxy types together:

**1. Virtual Proxy - Lazy Loading**
```typescript
class LazyDatabaseProxy implements Database {
  private realDB: RealDatabase | null = null;
  
  query(sql: string) {
    if (!this.realDB) {
      this.realDB = new RealDatabase(); // Expensive creation
    }
    return this.realDB.query(sql);
  }
}
```
**Purpose**: Don't create expensive database connection until first query.

**2. Protection Proxy - Access Control**
```typescript
class ProtectedDatabaseProxy implements Database {
  constructor(private db: Database, private userRole: string) {}
  
  deleteUser(id: string) {
    if (this.userRole !== "admin") {
      throw new Error("Access denied");
    }
    return this.db.deleteUser(id);
  }
}
```
**Purpose**: Check permissions before allowing operations.

**3. Caching Proxy - Performance**
```typescript
class CachingDatabaseProxy implements Database {
  private cache = new Map();
  
  query(sql: string) {
    if (this.cache.has(sql)) {
      return this.cache.get(sql); // Return cached result
    }
    const result = this.db.query(sql);
    this.cache.set(sql, result);
    return result;
  }
}
```
**Purpose**: Store query results to avoid repeated database calls.

**Combining Them:**
```typescript
let db: Database = new RealDatabase();
db = new LazyDatabaseProxy(db);           // Lazy loading
db = new CachingDatabaseProxy(db);        // Caching
db = new ProtectedDatabaseProxy(db, role); // Access control

// Now db has all three behaviors!
```

**Order matters:**
- Protection check first (no point querying if denied)
- Then caching (avoid DB if cached)
- Then lazy loading (create DB only if needed)

**Why Proxy (not Decorator)?**
- Could use Decorator, but Proxy better semantic fit
- Proxy controls access to resource (database)
- Not adding new behavior, controlling access to existing behavior
- However, implementation is very similar to Decorator!

</details>

---

**Question 5**: You're building a file explorer UI. Files and folders are displayed as icons. You have 10,000+ files but only ~20 unique icon types (.pdf, .jpg, .txt, etc.). Icons are loaded from disk (expensive). Which pattern(s)?

<details>
<summary><strong>View Answer</strong></summary>

**Answer: Flyweight + Virtual Proxy (or just Flyweight)**

**Two concerns:**
1. Many files share same icon type (memory concern) → **Flyweight**
2. Loading icons from disk is expensive (lazy loading concern) → **Virtual Proxy**

**Flyweight for Icon Sharing:**
```typescript
// Flyweight - Icon type (intrinsic, shared)
class Icon {
  constructor(
    public name: string,
    private imageData: string  // Loaded once, shared
  ) {}
}

// Flyweight Factory
class IconCache {
  private icons = new Map<string, Icon>();
  
  getIcon(extension: string): Icon {
    if (!this.icons.has(extension)) {
      // Load icon from disk - expensive but only once per type
      this.icons.set(extension, new Icon(extension, loadFromDisk(extension)));
    }
    return this.icons.get(extension)!;
  }
}

// Context - File instance (extrinsic, unique)
class FileItem {
  constructor(
    public name: string,
    public x: number,
    public y: number,
    private icon: Icon  // Shared flyweight
  ) {}
}
```

**Optional: Add Virtual Proxy for Lazy Icon Loading:**
```typescript
class LazyIcon {
  private realIcon: Icon | null = null;
  
  constructor(private iconPath: string) {}
  
  render() {
    if (!this.realIcon) {
      this.realIcon = loadIconFromDisk(this.iconPath);
    }
    this.realIcon.render();
  }
}
```

**Memory Analysis:**
- **Without Flyweight**: 10,000 files × icon data (~50 KB each) = ~500 MB
- **With Flyweight**: 20 icon types × 50 KB + 10,000 file refs = ~1 MB + small overhead
- **Saved**: ~99% memory

**Usage:**
```typescript
const iconCache = new IconCache();

// Creating 1000 PDF files - all share same icon
for (let i = 0; i < 1000; i++) {
  const icon = iconCache.getIcon('.pdf');  // Reused!
  files.push(new FileItem(`doc${i}.pdf`, x, y, icon));
}
```

**Why these patterns:**
- **Flyweight**: Many files, few icon types, memory critical
- **Virtual Proxy**: Optional, for lazy icon loading
- **Not Composite**: Files/folders could use Composite for tree structure, but question focuses on icons
- **Not Decorator**: Not adding behavior to icons

</details>

</details>

---

