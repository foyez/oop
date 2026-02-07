# Chapter 7: Design Patterns

Design patterns are reusable solutions to commonly occurring problems in software design. They represent best practices refined over time and provide a shared vocabulary for developers.

---

## Table of Contents

1. Introduction to Design Patterns
2. Creational Patterns (Singleton, Factory, Builder, Prototype)
3. Structural Patterns (Adapter, Decorator, Facade, Proxy)
4. Behavioral Patterns (Strategy, Observer, Command, Template Method)
5. Anti-Patterns to Avoid

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

