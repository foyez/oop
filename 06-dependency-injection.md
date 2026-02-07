# Chapter 6: Dependency Injection

Dependency Injection (DI) is a design pattern and technique for implementing Dependency Inversion Principle (DIP). It's a fundamental concept in modern software development that promotes loose coupling and testability.

---

## Table of Contents

- [1. What is Dependency Injection?](#1-what-is-dependency-injection)
- [2. Types of Dependency Injection (Constructor, Setter, Interface)](#2-types-of-dependency-injection)
- [3. DI Containers and Frameworks](#3-di-containers-and-frameworks)
- [4. Benefits and Trade-offs](#4-benefits-and-trade-offs)

---

## 1. What is Dependency Injection?

**Definition**: Dependency Injection is a technique where an object receives its dependencies from external sources rather than creating them itself.

**Real-world analogy**: Think of a coffee shop. Instead of each barista owning their own espresso machine, coffee grinder, and milk frother (creating dependencies), the shop provides these tools to the barista (injects dependencies). The barista can focus on making coffee, and the shop can easily upgrade equipment without affecting how baristas work.

### The Problem Without DI

```typescript
// Without DI - tight coupling
class EmailService {
  send(to: string, message: string): void {
    console.log(`Sending email to ${to}: ${message}`);
  }
}

class UserService {
  private emailService: EmailService;

  constructor() {
    // ❌ Creates its own dependency
    this.emailService = new EmailService();
  }

  registerUser(email: string, name: string): void {
    console.log(`Registering ${name}`);
    this.emailService.send(email, `Welcome ${name}!`);
  }
}

// Problems:
// 1. UserService is tightly coupled to EmailService
// 2. Can't swap EmailService for SMSService
// 3. Hard to test - can't mock EmailService
// 4. UserService controls EmailService lifecycle
```

### The Solution With DI

```typescript
// With DI - loose coupling
interface NotificationService {
  send(to: string, message: string): void;
}

class EmailService implements NotificationService {
  send(to: string, message: string): void {
    console.log(`Sending email to ${to}: ${message}`);
  }
}

class UserService {
  // ✓ Dependency injected from outside
  constructor(private notificationService: NotificationService) {}

  registerUser(contact: string, name: string): void {
    console.log(`Registering ${name}`);
    this.notificationService.send(contact, `Welcome ${name}!`);
  }
}

// Benefits:
// 1. UserService doesn't know about concrete EmailService
// 2. Easy to swap implementations
// 3. Easy to test with mocks
// 4. External control of dependencies
```

### Core Concepts

**Dependency**: An object that another object needs to function
**Injection**: Passing the dependency to the dependent object from outside
**Inversion of Control (IoC)**: External code controls object creation and lifecycle

<details>
<summary><strong>View Examples</strong></summary>

```typescript
// TypeScript - Dependency Injection Fundamentals

// ============================================
// Example 1: Basic DI Comparison
// ============================================

console.log("=== Without Dependency Injection ===\n");

class DatabaseConnectionBad {
  connect(): void {
    console.log("Connected to MySQL at localhost:3306");
  }
}

class UserRepositoryBad {
  private db: DatabaseConnectionBad;

  constructor() {
    this.db = new DatabaseConnectionBad(); // ❌ Hard-coded dependency
  }

  getUser(id: number): void {
    this.db.connect();
    console.log(`Fetching user ${id}`);
  }
}

const repoBad = new UserRepositoryBad();
repoBad.getUser(1);

// Problems demonstrated:
// - Can't test without real database
// - Can't switch to PostgreSQL
// - Can't use connection pooling
// - Can't control connection lifecycle

console.log("\n=== With Dependency Injection ===\n");

interface DatabaseConnection {
  connect(): void;
}

class MySQLConnection implements DatabaseConnection {
  connect(): void {
    console.log("Connected to MySQL at localhost:3306");
  }
}

class PostgreSQLConnection implements DatabaseConnection {
  connect(): void {
    console.log("Connected to PostgreSQL at localhost:5432");
  }
}

class MockConnection implements DatabaseConnection {
  connect(): void {
    console.log("Mock connection - no real database");
  }
}

class UserRepository {
  // ✓ Dependency injected via constructor
  constructor(private db: DatabaseConnection) {}

  getUser(id: number): void {
    this.db.connect();
    console.log(`Fetching user ${id}`);
  }
}

// Easy to use different implementations
const mysqlRepo = new UserRepository(new MySQLConnection());
mysqlRepo.getUser(1);

const postgresRepo = new UserRepository(new PostgreSQLConnection());
postgresRepo.getUser(2);

const testRepo = new UserRepository(new MockConnection());
testRepo.getUser(3);

// ============================================
// Example 2: Real-World E-commerce System
// ============================================

console.log("\n=== E-commerce Order Processing ===\n");

// Abstractions
interface PaymentProcessor {
  processPayment(amount: number): boolean;
}

interface InventoryService {
  checkStock(productId: string): boolean;
  reduceStock(productId: string, quantity: number): void;
}

interface NotificationService {
  notify(userId: string, message: string): void;
}

interface Logger {
  log(message: string): void;
  error(message: string): void;
}

// Implementations
class StripePaymentProcessor implements PaymentProcessor {
  processPayment(amount: number): boolean {
    console.log(`Processing $${amount} via Stripe`);
    return true;
  }
}

class WarehouseInventoryService implements InventoryService {
  private stock: Map<string, number> = new Map([
    ["PROD001", 100],
    ["PROD002", 50]
  ]);

  checkStock(productId: string): boolean {
    const available = this.stock.get(productId) || 0;
    console.log(`Checking stock for ${productId}: ${available} available`);
    return available > 0;
  }

  reduceStock(productId: string, quantity: number): void {
    const current = this.stock.get(productId) || 0;
    this.stock.set(productId, current - quantity);
    console.log(`Reduced stock for ${productId} by ${quantity}`);
  }
}

class EmailNotificationService implements NotificationService {
  notify(userId: string, message: string): void {
    console.log(`📧 Sending email to user ${userId}: ${message}`);
  }
}

class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(`[LOG] ${message}`);
  }

  error(message: string): void {
    console.error(`[ERROR] ${message}`);
  }
}

// High-level service with multiple dependencies
class OrderService {
  constructor(
    private paymentProcessor: PaymentProcessor,
    private inventoryService: InventoryService,
    private notificationService: NotificationService,
    private logger: Logger
  ) {
    this.logger.log("OrderService initialized");
  }

  placeOrder(
    orderId: string,
    userId: string,
    productId: string,
    quantity: number,
    amount: number
  ): boolean {
    this.logger.log(`Processing order ${orderId}`);

    // Check inventory
    if (!this.inventoryService.checkStock(productId)) {
      this.logger.error(`Product ${productId} out of stock`);
      this.notificationService.notify(userId, "Product out of stock");
      return false;
    }

    // Process payment
    if (!this.paymentProcessor.processPayment(amount)) {
      this.logger.error(`Payment failed for order ${orderId}`);
      this.notificationService.notify(userId, "Payment failed");
      return false;
    }

    // Update inventory
    this.inventoryService.reduceStock(productId, quantity);

    // Notify customer
    this.notificationService.notify(userId, `Order ${orderId} confirmed!`);

    this.logger.log(`Order ${orderId} completed successfully`);
    return true;
  }
}

// Inject all dependencies
const orderService = new OrderService(
  new StripePaymentProcessor(),
  new WarehouseInventoryService(),
  new EmailNotificationService(),
  new ConsoleLogger()
);

orderService.placeOrder("ORD001", "USER123", "PROD001", 2, 99.99);

// ============================================
// Example 3: Testing with DI
// ============================================

console.log("\n=== Testing with Mock Dependencies ===\n");

// Mock implementations for testing
class MockPaymentProcessor implements PaymentProcessor {
  public paymentsCalled: number = 0;

  processPayment(amount: number): boolean {
    this.paymentsCalled++;
    console.log(`[MOCK] Payment processed: $${amount}`);
    return true;
  }
}

class MockInventoryService implements InventoryService {
  public stockChecks: number = 0;
  public stockReductions: number = 0;

  checkStock(productId: string): boolean {
    this.stockChecks++;
    console.log(`[MOCK] Stock check for ${productId}`);
    return true;
  }

  reduceStock(productId: string, quantity: number): void {
    this.stockReductions++;
    console.log(`[MOCK] Reduced stock: ${productId} by ${quantity}`);
  }
}

class MockNotificationService implements NotificationService {
  public notifications: string[] = [];

  notify(userId: string, message: string): void {
    this.notifications.push(message);
    console.log(`[MOCK] Notification to ${userId}: ${message}`);
  }
}

class MockLogger implements Logger {
  public logs: string[] = [];
  public errors: string[] = [];

  log(message: string): void {
    this.logs.push(message);
    console.log(`[MOCK LOG] ${message}`);
  }

  error(message: string): void {
    this.errors.push(message);
    console.log(`[MOCK ERROR] ${message}`);
  }
}

// Test with mocks
const mockPayment = new MockPaymentProcessor();
const mockInventory = new MockInventoryService();
const mockNotification = new MockNotificationService();
const mockLogger = new MockLogger();

const testOrderService = new OrderService(
  mockPayment,
  mockInventory,
  mockNotification,
  mockLogger
);

testOrderService.placeOrder("TEST001", "TESTUSER", "TESTPROD", 1, 49.99);

// Verify test results
console.log("\n--- Test Verification ---");
console.log(`Payments processed: ${mockPayment.paymentsCalled}`);
console.log(`Stock checks: ${mockInventory.stockChecks}`);
console.log(`Stock reductions: ${mockInventory.stockReductions}`);
console.log(`Notifications sent: ${mockNotification.notifications.length}`);
console.log(`Logs recorded: ${mockLogger.logs.length}`);
console.log(`Errors recorded: ${mockLogger.errors.length}`);

// ============================================
// Key Benefits Demonstrated
// ============================================

console.log("\n=== Key Benefits of DI ===");
console.log("✓ Loose Coupling: OrderService doesn't know about Stripe, Email, etc.");
console.log("✓ Flexibility: Easy to swap Stripe for PayPal");
console.log("✓ Testability: Can inject mocks for testing");
console.log("✓ Maintainability: Changes to dependencies don't affect OrderService");
console.log("✓ Reusability: OrderService works with any implementation");
```

```python
# Python - Dependency Injection Fundamentals

from abc import ABC, abstractmethod
from typing import List

# ============================================
# Example 1: Basic DI Comparison
# ============================================

print("=== Without Dependency Injection ===\n")

class DatabaseConnectionBad:
    def connect(self) -> None:
        print("Connected to MySQL at localhost:3306")

class UserRepositoryBad:
    def __init__(self):
        self.db = DatabaseConnectionBad()  # ❌ Hard-coded dependency
    
    def get_user(self, user_id: int) -> None:
        self.db.connect()
        print(f"Fetching user {user_id}")

repo_bad = UserRepositoryBad()
repo_bad.get_user(1)

print("\n=== With Dependency Injection ===\n")

class DatabaseConnection(ABC):
    @abstractmethod
    def connect(self) -> None:
        pass

class MySQLConnection(DatabaseConnection):
    def connect(self) -> None:
        print("Connected to MySQL at localhost:3306")

class PostgreSQLConnection(DatabaseConnection):
    def connect(self) -> None:
        print("Connected to PostgreSQL at localhost:5432")

class MockConnection(DatabaseConnection):
    def connect(self) -> None:
        print("Mock connection - no real database")

class UserRepository:
    def __init__(self, db: DatabaseConnection):
        self._db = db  # ✓ Dependency injected
    
    def get_user(self, user_id: int) -> None:
        self._db.connect()
        print(f"Fetching user {user_id}")

# Easy to use different implementations
mysql_repo = UserRepository(MySQLConnection())
mysql_repo.get_user(1)

postgres_repo = UserRepository(PostgreSQLConnection())
postgres_repo.get_user(2)

test_repo = UserRepository(MockConnection())
test_repo.get_user(3)

# ============================================
# Example 2: Real-World E-commerce System
# ============================================

print("\n=== E-commerce Order Processing ===\n")

class PaymentProcessor(ABC):
    @abstractmethod
    def process_payment(self, amount: float) -> bool:
        pass

class InventoryService(ABC):
    @abstractmethod
    def check_stock(self, product_id: str) -> bool:
        pass
    
    @abstractmethod
    def reduce_stock(self, product_id: str, quantity: int) -> None:
        pass

class NotificationService(ABC):
    @abstractmethod
    def notify(self, user_id: str, message: str) -> None:
        pass

class Logger(ABC):
    @abstractmethod
    def log(self, message: str) -> None:
        pass
    
    @abstractmethod
    def error(self, message: str) -> None:
        pass

# Implementations
class StripePaymentProcessor(PaymentProcessor):
    def process_payment(self, amount: float) -> bool:
        print(f"Processing ${amount} via Stripe")
        return True

class WarehouseInventoryService(InventoryService):
    def __init__(self):
        self._stock = {"PROD001": 100, "PROD002": 50}
    
    def check_stock(self, product_id: str) -> bool:
        available = self._stock.get(product_id, 0)
        print(f"Checking stock for {product_id}: {available} available")
        return available > 0
    
    def reduce_stock(self, product_id: str, quantity: int) -> None:
        current = self._stock.get(product_id, 0)
        self._stock[product_id] = current - quantity
        print(f"Reduced stock for {product_id} by {quantity}")

class EmailNotificationService(NotificationService):
    def notify(self, user_id: str, message: str) -> None:
        print(f"📧 Sending email to user {user_id}: {message}")

class ConsoleLogger(Logger):
    def log(self, message: str) -> None:
        print(f"[LOG] {message}")
    
    def error(self, message: str) -> None:
        print(f"[ERROR] {message}")

# High-level service with multiple dependencies
class OrderService:
    def __init__(self, payment_processor: PaymentProcessor,
                 inventory_service: InventoryService,
                 notification_service: NotificationService,
                 logger: Logger):
        self._payment_processor = payment_processor
        self._inventory_service = inventory_service
        self._notification_service = notification_service
        self._logger = logger
        self._logger.log("OrderService initialized")
    
    def place_order(self, order_id: str, user_id: str, product_id: str,
                    quantity: int, amount: float) -> bool:
        self._logger.log(f"Processing order {order_id}")
        
        # Check inventory
        if not self._inventory_service.check_stock(product_id):
            self._logger.error(f"Product {product_id} out of stock")
            self._notification_service.notify(user_id, "Product out of stock")
            return False
        
        # Process payment
        if not self._payment_processor.process_payment(amount):
            self._logger.error(f"Payment failed for order {order_id}")
            self._notification_service.notify(user_id, "Payment failed")
            return False
        
        # Update inventory
        self._inventory_service.reduce_stock(product_id, quantity)
        
        # Notify customer
        self._notification_service.notify(user_id, f"Order {order_id} confirmed!")
        
        self._logger.log(f"Order {order_id} completed successfully")
        return True

# Inject all dependencies
order_service = OrderService(
    StripePaymentProcessor(),
    WarehouseInventoryService(),
    EmailNotificationService(),
    ConsoleLogger()
)

order_service.place_order("ORD001", "USER123", "PROD001", 2, 99.99)

# ============================================
# Example 3: Testing with DI
# ============================================

print("\n=== Testing with Mock Dependencies ===\n")

class MockPaymentProcessor(PaymentProcessor):
    def __init__(self):
        self.payments_called = 0
    
    def process_payment(self, amount: float) -> bool:
        self.payments_called += 1
        print(f"[MOCK] Payment processed: ${amount}")
        return True

class MockInventoryService(InventoryService):
    def __init__(self):
        self.stock_checks = 0
        self.stock_reductions = 0
    
    def check_stock(self, product_id: str) -> bool:
        self.stock_checks += 1
        print(f"[MOCK] Stock check for {product_id}")
        return True
    
    def reduce_stock(self, product_id: str, quantity: int) -> None:
        self.stock_reductions += 1
        print(f"[MOCK] Reduced stock: {product_id} by {quantity}")

class MockNotificationService(NotificationService):
    def __init__(self):
        self.notifications: List[str] = []
    
    def notify(self, user_id: str, message: str) -> None:
        self.notifications.append(message)
        print(f"[MOCK] Notification to {user_id}: {message}")

class MockLogger(Logger):
    def __init__(self):
        self.logs: List[str] = []
        self.errors: List[str] = []
    
    def log(self, message: str) -> None:
        self.logs.append(message)
        print(f"[MOCK LOG] {message}")
    
    def error(self, message: str) -> None:
        self.errors.append(message)
        print(f"[MOCK ERROR] {message}")

# Test with mocks
mock_payment = MockPaymentProcessor()
mock_inventory = MockInventoryService()
mock_notification = MockNotificationService()
mock_logger = MockLogger()

test_order_service = OrderService(
    mock_payment,
    mock_inventory,
    mock_notification,
    mock_logger
)

test_order_service.place_order("TEST001", "TESTUSER", "TESTPROD", 1, 49.99)

# Verify test results
print("\n--- Test Verification ---")
print(f"Payments processed: {mock_payment.payments_called}")
print(f"Stock checks: {mock_inventory.stock_checks}")
print(f"Stock reductions: {mock_inventory.stock_reductions}")
print(f"Notifications sent: {len(mock_notification.notifications)}")
print(f"Logs recorded: {len(mock_logger.logs)}")
print(f"Errors recorded: {len(mock_logger.errors)}")

print("\n=== Key Benefits of DI ===")
print("✓ Loose Coupling: OrderService doesn't know about Stripe, Email, etc.")
print("✓ Flexibility: Easy to swap Stripe for PayPal")
print("✓ Testability: Can inject mocks for testing")
print("✓ Maintainability: Changes to dependencies don't affect OrderService")
print("✓ Reusability: OrderService works with any implementation")
```

</details>

---

## 2. Types of Dependency Injection

There are three main types of dependency injection, each with different characteristics and use cases.

### A. Constructor Injection

**Definition**: Dependencies are provided through the class constructor.

**Characteristics**:
- Dependencies are **required** and **immutable** after construction
- Most common and recommended approach
- Makes dependencies explicit and visible
- Ensures object is fully initialized

**When to use**:
- Dependencies are required for the class to function
- Dependencies don't change during object lifetime
- You want to enforce immutability

### B. Setter Injection (Property Injection)

**Definition**: Dependencies are provided through setter methods or public properties after object creation.

**Characteristics**:
- Dependencies are **optional** or **changeable**
- Object can exist without all dependencies initially
- Dependencies can be swapped at runtime
- Less explicit than constructor injection

**When to use**:
- Dependencies are optional
- Dependencies may change during object lifetime
- Constructor has too many parameters (code smell!)
- Framework requires parameterless constructor

### C. Interface Injection

**Definition**: Dependencies provide an injector method that will inject the dependency into any client passed to it.

**Characteristics**:
- Least common approach
- Client implements an interface that exposes a setter
- Dependency provider uses interface to inject itself

**When to use**:
- Rarely used in modern applications
- Framework-level concerns
- When you need to control how injection happens

<details>
<summary><strong>View Examples</strong></summary>

```typescript
// TypeScript - Types of Dependency Injection

// ============================================
// 1. Constructor Injection (Most Common)
// ============================================

console.log("=== Constructor Injection ===\n");

interface Logger {
  log(message: string): void;
}

interface Database {
  query(sql: string): any[];
}

class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(`[LOG] ${message}`);
  }
}

class MySQLDatabase implements Database {
  query(sql: string): any[] {
    console.log(`Executing: ${sql}`);
    return [{ id: 1, name: "Sample" }];
  }
}

// Constructor Injection - dependencies required and immutable
class UserService {
  // Dependencies injected via constructor
  constructor(
    private readonly logger: Logger,    // readonly ensures immutability
    private readonly database: Database
  ) {
    this.logger.log("UserService initialized");
  }

  createUser(name: string): void {
    this.logger.log(`Creating user: ${name}`);
    this.database.query(`INSERT INTO users (name) VALUES ('${name}')`);
    this.logger.log("User created successfully");
  }

  getUser(id: number): any {
    this.logger.log(`Fetching user ${id}`);
    return this.database.query(`SELECT * FROM users WHERE id = ${id}`)[0];
  }
}

// Usage: All dependencies provided at construction
const logger = new ConsoleLogger();
const database = new MySQLDatabase();
const userService = new UserService(logger, database);

userService.createUser("Alice");
userService.getUser(1);

// Benefits of Constructor Injection:
console.log("\n✓ Dependencies are explicit and visible");
console.log("✓ Object is fully initialized and ready to use");
console.log("✓ Dependencies are immutable (can't be changed)");
console.log("✓ Easy to test - just pass mock dependencies");

// ============================================
// 2. Setter Injection (Property Injection)
// ============================================

console.log("\n\n=== Setter Injection ===\n");

interface Cache {
  get(key: string): any;
  set(key: string, value: any): void;
}

class MemoryCache implements Cache {
  private storage: Map<string, any> = new Map();

  get(key: string): any {
    console.log(`Cache hit for: ${key}`);
    return this.storage.get(key);
  }

  set(key: string, value: any): void {
    console.log(`Caching: ${key}`);
    this.storage.set(key, value);
  }
}

class RedisCache implements Cache {
  get(key: string): any {
    console.log(`Redis cache hit for: ${key}`);
    return null; // Simulated
  }

  set(key: string, value: any): void {
    console.log(`Redis caching: ${key}`);
  }
}

// Setter Injection - optional dependency that can be changed
class ProductService {
  private logger: Logger;
  private database: Database;
  private cache?: Cache; // Optional dependency

  // Required dependencies via constructor
  constructor(logger: Logger, database: Database) {
    this.logger = logger;
    this.database = database;
  }

  // Optional dependency via setter
  setCache(cache: Cache): void {
    this.cache = cache;
    this.logger.log("Cache configured");
  }

  // Can also swap cache at runtime
  switchCache(newCache: Cache): void {
    this.cache = newCache;
    this.logger.log("Cache switched");
  }

  getProduct(id: number): any {
    const cacheKey = `product:${id}`;

    // Use cache if available
    if (this.cache) {
      const cached = this.cache.get(cacheKey);
      if (cached) {
        return cached;
      }
    }

    // Fetch from database
    this.logger.log(`Fetching product ${id} from database`);
    const product = this.database.query(`SELECT * FROM products WHERE id = ${id}`)[0];

    // Cache if available
    if (this.cache) {
      this.cache.set(cacheKey, product);
    }

    return product;
  }
}

// Usage: Object works without cache
const productService = new ProductService(new ConsoleLogger(), new MySQLDatabase());
productService.getProduct(1); // Works without cache

// Add cache later
console.log("\n--- Adding cache ---");
productService.setCache(new MemoryCache());
productService.getProduct(2);

// Switch cache at runtime
console.log("\n--- Switching to Redis cache ---");
productService.switchCache(new RedisCache());
productService.getProduct(3);

console.log("\n✓ Dependencies can be optional");
console.log("✓ Dependencies can be changed at runtime");
console.log("✓ Useful for optional features like caching");
console.log("⚠ Less explicit than constructor injection");
console.log("⚠ Object might not be fully configured");

// ============================================
// 3. Method Injection (Dependency per Call)
// ============================================

console.log("\n\n=== Method Injection ===\n");

interface Validator {
  validate(data: any): boolean;
}

class EmailValidator implements Validator {
  validate(data: any): boolean {
    console.log(`Validating email: ${data.email}`);
    return data.email && data.email.includes("@");
  }
}

class PhoneValidator implements Validator {
  validate(data: any): boolean {
    console.log(`Validating phone: ${data.phone}`);
    return data.phone && data.phone.length >= 10;
  }
}

// Method Injection - dependency passed per method call
class RegistrationService {
  constructor(private logger: Logger) {}

  // Validator injected per method call
  register(userData: any, validator: Validator): boolean {
    this.logger.log("Starting registration");

    if (!validator.validate(userData)) {
      this.logger.log("Validation failed");
      return false;
    }

    this.logger.log("User registered successfully");
    return true;
  }
}

const regService = new RegistrationService(new ConsoleLogger());

// Different validator for each call
regService.register(
  { name: "Alice", email: "alice@example.com" },
  new EmailValidator()
);

regService.register(
  { name: "Bob", phone: "1234567890" },
  new PhoneValidator()
);

console.log("\n✓ Different dependency for each method call");
console.log("✓ Flexible - behavior varies per invocation");
console.log("✓ Useful when dependency is contextual");

// ============================================
// 4. Real-World Example: Notification System
// ============================================

console.log("\n\n=== Real-World: Notification System ===\n");

interface NotificationChannel {
  send(to: string, message: string): void;
}

class EmailChannel implements NotificationChannel {
  send(to: string, message: string): void {
    console.log(`📧 Email to ${to}: ${message}`);
  }
}

class SMSChannel implements NotificationChannel {
  send(to: string, message: string): void {
    console.log(`📱 SMS to ${to}: ${message}`);
  }
}

class PushChannel implements NotificationChannel {
  send(to: string, message: string): void {
    console.log(`🔔 Push to ${to}: ${message}`);
  }
}

interface Analytics {
  track(event: string): void;
}

class GoogleAnalytics implements Analytics {
  track(event: string): void {
    console.log(`📊 Google Analytics: ${event}`);
  }
}

class NotificationService {
  private analytics?: Analytics; // Optional via setter

  // Required: default channel via constructor
  constructor(private defaultChannel: NotificationChannel) {}

  // Optional: analytics via setter
  setAnalytics(analytics: Analytics): void {
    this.analytics = analytics;
  }

  // Method injection: channel can be overridden per call
  notify(to: string, message: string, channel?: NotificationChannel): void {
    const selectedChannel = channel || this.defaultChannel;

    selectedChannel.send(to, message);

    if (this.analytics) {
      this.analytics.track("notification_sent");
    }
  }

  // Batch notification with different channels
  notifyBatch(notifications: Array<{ to: string; message: string; channel: NotificationChannel }>): void {
    notifications.forEach(({ to, message, channel }) => {
      this.notify(to, message, channel);
    });
  }
}

// Constructor injection: default channel
const notificationService = new NotificationService(new EmailChannel());

// Use default channel
notificationService.notify("user@example.com", "Welcome!");

// Setter injection: add analytics
notificationService.setAnalytics(new GoogleAnalytics());

// Method injection: override channel per call
console.log("\n--- Override channel per notification ---");
notificationService.notify("+1234567890", "Code: 1234", new SMSChannel());
notificationService.notify("device_token", "New message", new PushChannel());

// Batch with different channels
console.log("\n--- Batch notifications ---");
notificationService.notifyBatch([
  { to: "user1@example.com", message: "Email 1", channel: new EmailChannel() },
  { to: "+1234567890", message: "SMS 1", channel: new SMSChannel() },
  { to: "device_token", message: "Push 1", channel: new PushChannel() }
]);

// ============================================
// 5. Comparing All Three Types
// ============================================

console.log("\n\n=== Comparison Table ===\n");

interface PaymentGateway {
  charge(amount: number): void;
}

class StripeGateway implements PaymentGateway {
  charge(amount: number): void {
    console.log(`Charging $${amount} via Stripe`);
  }
}

class PayPalGateway implements PaymentGateway {
  charge(amount: number): void {
    console.log(`Charging $${amount} via PayPal`);
  }
}

interface TaxCalculator {
  calculate(amount: number): number;
}

class USTaxCalculator implements TaxCalculator {
  calculate(amount: number): number {
    return amount * 0.08;
  }
}

class EUTaxCalculator implements TaxCalculator {
  calculate(amount: number): number {
    return amount * 0.20;
  }
}

class OrderProcessor {
  private taxCalculator?: TaxCalculator; // Setter injection (optional)

  // Constructor injection (required)
  constructor(
    private logger: Logger,
    private paymentGateway: PaymentGateway
  ) {}

  // Setter injection
  setTaxCalculator(calculator: TaxCalculator): void {
    this.taxCalculator = calculator;
  }

  // Method injection (contextual)
  processOrder(amount: number, auditLogger?: Logger): void {
    const loggerToUse = auditLogger || this.logger;

    loggerToUse.log(`Processing order for $${amount}`);

    let total = amount;
    if (this.taxCalculator) {
      const tax = this.taxCalculator.calculate(amount);
      total += tax;
      loggerToUse.log(`Tax: $${tax.toFixed(2)}`);
    }

    this.paymentGateway.charge(total);
    loggerToUse.log(`Order processed: $${total.toFixed(2)}`);
  }
}

console.log("--- Without optional dependencies ---");
const processor1 = new OrderProcessor(new ConsoleLogger(), new StripeGateway());
processor1.processOrder(100);

console.log("\n--- With tax calculator (setter) ---");
const processor2 = new OrderProcessor(new ConsoleLogger(), new PayPalGateway());
processor2.setTaxCalculator(new USTaxCalculator());
processor2.processOrder(100);

console.log("\n--- With custom logger (method) ---");
class AuditLogger implements Logger {
  log(message: string): void {
    console.log(`[AUDIT] ${message}`);
  }
}

processor2.processOrder(100, new AuditLogger());

// ============================================
// Summary
// ============================================

console.log("\n\n=== DI Types Summary ===");
console.log("\n1. Constructor Injection:");
console.log("   ✓ Use for required dependencies");
console.log("   ✓ Makes dependencies explicit");
console.log("   ✓ Ensures object is fully initialized");
console.log("   ✓ Most recommended approach");

console.log("\n2. Setter Injection:");
console.log("   ✓ Use for optional dependencies");
console.log("   ✓ Allows runtime changes");
console.log("   ⚠ Object might not be fully configured");
console.log("   ⚠ Less explicit");

console.log("\n3. Method Injection:");
console.log("   ✓ Use for contextual dependencies");
console.log("   ✓ Different dependency per call");
console.log("   ✓ Flexible for varying behavior");
```

```python
# Python - Types of Dependency Injection

from abc import ABC, abstractmethod
from typing import Optional, List, Dict

# ============================================
# 1. Constructor Injection (Most Common)
# ============================================

print("=== Constructor Injection ===\n")

class Logger(ABC):
    @abstractmethod
    def log(self, message: str) -> None:
        pass

class Database(ABC):
    @abstractmethod
    def query(self, sql: str) -> List[Dict]:
        pass

class ConsoleLogger(Logger):
    def log(self, message: str) -> None:
        print(f"[LOG] {message}")

class MySQLDatabase(Database):
    def query(self, sql: str) -> List[Dict]:
        print(f"Executing: {sql}")
        return [{'id': 1, 'name': 'Sample'}]

class UserService:
    """Constructor Injection - dependencies required and immutable"""
    
    def __init__(self, logger: Logger, database: Database):
        self._logger = logger
        self._database = database
        self._logger.log("UserService initialized")
    
    def create_user(self, name: str) -> None:
        self._logger.log(f"Creating user: {name}")
        self._database.query(f"INSERT INTO users (name) VALUES ('{name}')")
        self._logger.log("User created successfully")
    
    def get_user(self, user_id: int) -> Dict:
        self._logger.log(f"Fetching user {user_id}")
        return self._database.query(f"SELECT * FROM users WHERE id = {user_id}")[0]

# Usage: All dependencies provided at construction
logger = ConsoleLogger()
database = MySQLDatabase()
user_service = UserService(logger, database)

user_service.create_user("Alice")
user_service.get_user(1)

print("\n✓ Dependencies are explicit and visible")
print("✓ Object is fully initialized and ready to use")
print("✓ Dependencies are immutable")
print("✓ Easy to test - just pass mock dependencies")

# ============================================
# 2. Setter Injection (Property Injection)
# ============================================

print("\n\n=== Setter Injection ===\n")

class Cache(ABC):
    @abstractmethod
    def get(self, key: str):
        pass
    
    @abstractmethod
    def set(self, key: str, value) -> None:
        pass

class MemoryCache(Cache):
    def __init__(self):
        self._storage: Dict = {}
    
    def get(self, key: str):
        print(f"Cache hit for: {key}")
        return self._storage.get(key)
    
    def set(self, key: str, value) -> None:
        print(f"Caching: {key}")
        self._storage[key] = value

class RedisCache(Cache):
    def get(self, key: str):
        print(f"Redis cache hit for: {key}")
        return None
    
    def set(self, key: str, value) -> None:
        print(f"Redis caching: {key}")

class ProductService:
    """Setter Injection - optional dependency that can be changed"""
    
    def __init__(self, logger: Logger, database: Database):
        self._logger = logger
        self._database = database
        self._cache: Optional[Cache] = None
    
    def set_cache(self, cache: Cache) -> None:
        """Optional dependency via setter"""
        self._cache = cache
        self._logger.log("Cache configured")
    
    def switch_cache(self, new_cache: Cache) -> None:
        """Can swap cache at runtime"""
        self._cache = new_cache
        self._logger.log("Cache switched")
    
    def get_product(self, product_id: int) -> Dict:
        cache_key = f"product:{product_id}"
        
        # Use cache if available
        if self._cache:
            cached = self._cache.get(cache_key)
            if cached:
                return cached
        
        # Fetch from database
        self._logger.log(f"Fetching product {product_id} from database")
        product = self._database.query(f"SELECT * FROM products WHERE id = {product_id}")[0]
        
        # Cache if available
        if self._cache:
            self._cache.set(cache_key, product)
        
        return product

# Usage: Object works without cache
product_service = ProductService(ConsoleLogger(), MySQLDatabase())
product_service.get_product(1)

# Add cache later
print("\n--- Adding cache ---")
product_service.set_cache(MemoryCache())
product_service.get_product(2)

# Switch cache at runtime
print("\n--- Switching to Redis cache ---")
product_service.switch_cache(RedisCache())
product_service.get_product(3)

print("\n✓ Dependencies can be optional")
print("✓ Dependencies can be changed at runtime")
print("✓ Useful for optional features like caching")
print("⚠ Less explicit than constructor injection")
print("⚠ Object might not be fully configured")

# ============================================
# 3. Method Injection
# ============================================

print("\n\n=== Method Injection ===\n")

class Validator(ABC):
    @abstractmethod
    def validate(self, data: Dict) -> bool:
        pass

class EmailValidator(Validator):
    def validate(self, data: Dict) -> bool:
        print(f"Validating email: {data.get('email')}")
        return 'email' in data and '@' in data['email']

class PhoneValidator(Validator):
    def validate(self, data: Dict) -> bool:
        print(f"Validating phone: {data.get('phone')}")
        return 'phone' in data and len(data['phone']) >= 10

class RegistrationService:
    """Method Injection - dependency passed per method call"""
    
    def __init__(self, logger: Logger):
        self._logger = logger
    
    def register(self, user_data: Dict, validator: Validator) -> bool:
        """Validator injected per method call"""
        self._logger.log("Starting registration")
        
        if not validator.validate(user_data):
            self._logger.log("Validation failed")
            return False
        
        self._logger.log("User registered successfully")
        return True

reg_service = RegistrationService(ConsoleLogger())

# Different validator for each call
reg_service.register(
    {'name': 'Alice', 'email': 'alice@example.com'},
    EmailValidator()
)

reg_service.register(
    {'name': 'Bob', 'phone': '1234567890'},
    PhoneValidator()
)

print("\n✓ Different dependency for each method call")
print("✓ Flexible - behavior varies per invocation")
print("✓ Useful when dependency is contextual")

# ============================================
# 4. Real-World Example: Notification System
# ============================================

print("\n\n=== Real-World: Notification System ===\n")

class NotificationChannel(ABC):
    @abstractmethod
    def send(self, to: str, message: str) -> None:
        pass

class EmailChannel(NotificationChannel):
    def send(self, to: str, message: str) -> None:
        print(f"📧 Email to {to}: {message}")

class SMSChannel(NotificationChannel):
    def send(self, to: str, message: str) -> None:
        print(f"📱 SMS to {to}: {message}")

class PushChannel(NotificationChannel):
    def send(self, to: str, message: str) -> None:
        print(f"🔔 Push to {to}: {message}")

class Analytics(ABC):
    @abstractmethod
    def track(self, event: str) -> None:
        pass

class GoogleAnalytics(Analytics):
    def track(self, event: str) -> None:
        print(f"📊 Google Analytics: {event}")

class NotificationService:
    def __init__(self, default_channel: NotificationChannel):
        self._default_channel = default_channel
        self._analytics: Optional[Analytics] = None
    
    def set_analytics(self, analytics: Analytics) -> None:
        """Optional: analytics via setter"""
        self._analytics = analytics
    
    def notify(self, to: str, message: str, channel: Optional[NotificationChannel] = None) -> None:
        """Method injection: channel can be overridden per call"""
        selected_channel = channel or self._default_channel
        
        selected_channel.send(to, message)
        
        if self._analytics:
            self._analytics.track("notification_sent")
    
    def notify_batch(self, notifications: List[Dict]) -> None:
        for notif in notifications:
            self.notify(notif['to'], notif['message'], notif['channel'])

# Constructor injection: default channel
notification_service = NotificationService(EmailChannel())

# Use default channel
notification_service.notify("user@example.com", "Welcome!")

# Setter injection: add analytics
notification_service.set_analytics(GoogleAnalytics())

# Method injection: override channel per call
print("\n--- Override channel per notification ---")
notification_service.notify("+1234567890", "Code: 1234", SMSChannel())
notification_service.notify("device_token", "New message", PushChannel())

# Batch with different channels
print("\n--- Batch notifications ---")
notification_service.notify_batch([
    {'to': 'user1@example.com', 'message': 'Email 1', 'channel': EmailChannel()},
    {'to': '+1234567890', 'message': 'SMS 1', 'channel': SMSChannel()},
    {'to': 'device_token', 'message': 'Push 1', 'channel': PushChannel()}
])

print("\n\n=== DI Types Summary ===")
print("\n1. Constructor Injection:")
print("   ✓ Use for required dependencies")
print("   ✓ Makes dependencies explicit")
print("   ✓ Ensures object is fully initialized")
print("   ✓ Most recommended approach")

print("\n2. Setter Injection:")
print("   ✓ Use for optional dependencies")
print("   ✓ Allows runtime changes")
print("   ⚠ Object might not be fully configured")
print("   ⚠ Less explicit")

print("\n3. Method Injection:")
print("   ✓ Use for contextual dependencies")
print("   ✓ Different dependency per call")
print("   ✓ Flexible for varying behavior")
```

</details>

---

## 3. DI Containers and Frameworks

As applications grow, manually creating and wiring dependencies becomes tedious and error-prone. **DI Containers** (also called IoC Containers - Inversion of Control Containers) automate dependency management.

### What is a DI Container?

**Definition**: A DI Container is a framework that automatically creates objects and injects their dependencies based on configuration.

**Real-world analogy**: Think of a DI Container like a restaurant kitchen manager. Instead of each chef gathering their own ingredients (dependencies), the kitchen manager knows what each dish needs and provides the right ingredients to each chef automatically.

### How DI Containers Work

1. **Registration**: Tell the container which implementations to use for which interfaces
2. **Resolution**: Ask the container for an object, it creates it with all dependencies
3. **Lifetime Management**: Container controls when objects are created and destroyed

### Container Lifecycles

- **Transient**: New instance every time
- **Singleton**: One instance for the entire application
- **Scoped**: One instance per scope (e.g., per HTTP request)

<details>
<summary><strong>View Examples</strong></summary>

```typescript
// TypeScript - DI Container Implementation

// ============================================
// Building a Simple DI Container
// ============================================

console.log("=== Simple DI Container ===\n");

// Enum for dependency lifetimes
enum Lifetime {
  Transient,  // New instance every time
  Singleton,  // Single instance for entire app
  Scoped      // Single instance per scope
}

// Container class
class DIContainer {
  private services: Map<string, ServiceDescriptor> = new Map();
  private singletons: Map<string, any> = new Map();
  private scopes: Map<string, Map<string, any>> = new Map();
  private currentScope?: string;

  // Register a service
  register<T>(
    name: string,
    factory: () => T,
    lifetime: Lifetime = Lifetime.Transient
  ): void {
    this.services.set(name, { factory, lifetime });
    console.log(`Registered: ${name} (${Lifetime[lifetime]})`);
  }

  // Register with class constructor
  registerClass<T>(
    name: string,
    constructor: new (...args: any[]) => T,
    dependencies: string[] = [],
    lifetime: Lifetime = Lifetime.Transient
  ): void {
    const factory = () => {
      const deps = dependencies.map(dep => this.resolve(dep));
      return new constructor(...deps);
    };
    this.register(name, factory, lifetime);
  }

  // Resolve (get) a service
  resolve<T>(name: string): T {
    const descriptor = this.services.get(name);
    if (!descriptor) {
      throw new Error(`Service '${name}' not registered`);
    }

    switch (descriptor.lifetime) {
      case Lifetime.Singleton:
        return this.resolveSingleton(name, descriptor);
      
      case Lifetime.Scoped:
        return this.resolveScoped(name, descriptor);
      
      case Lifetime.Transient:
      default:
        return descriptor.factory();
    }
  }

  private resolveSingleton<T>(name: string, descriptor: ServiceDescriptor): T {
    if (!this.singletons.has(name)) {
      console.log(`Creating singleton: ${name}`);
      this.singletons.set(name, descriptor.factory());
    } else {
      console.log(`Reusing singleton: ${name}`);
    }
    return this.singletons.get(name);
  }

  private resolveScoped<T>(name: string, descriptor: ServiceDescriptor): T {
    if (!this.currentScope) {
      throw new Error("No active scope");
    }

    let scopeCache = this.scopes.get(this.currentScope);
    if (!scopeCache) {
      scopeCache = new Map();
      this.scopes.set(this.currentScope, scopeCache);
    }

    if (!scopeCache.has(name)) {
      console.log(`Creating scoped instance: ${name} (scope: ${this.currentScope})`);
      scopeCache.set(name, descriptor.factory());
    } else {
      console.log(`Reusing scoped instance: ${name}`);
    }
    return scopeCache.get(name);
  }

  // Create a scope
  createScope(scopeId: string): void {
    this.currentScope = scopeId;
    console.log(`\n--- Scope created: ${scopeId} ---`);
  }

  // End scope
  endScope(): void {
    if (this.currentScope) {
      console.log(`--- Scope ended: ${this.currentScope} ---\n`);
      this.scopes.delete(this.currentScope);
      this.currentScope = undefined;
    }
  }
}

interface ServiceDescriptor {
  factory: () => any;
  lifetime: Lifetime;
}

// ============================================
// Example Services
// ============================================

interface Logger {
  log(message: string): void;
}

interface Database {
  query(sql: string): any[];
}

interface EmailService {
  send(to: string, message: string): void;
}

class ConsoleLogger implements Logger {
  private instanceId: string;

  constructor() {
    this.instanceId = Math.random().toString(36).substring(7);
    console.log(`  [ConsoleLogger created: ${this.instanceId}]`);
  }

  log(message: string): void {
    console.log(`[${this.instanceId}] ${message}`);
  }
}

class MySQLDatabase implements Database {
  private instanceId: string;

  constructor(private logger: Logger) {
    this.instanceId = Math.random().toString(36).substring(7);
    console.log(`  [MySQLDatabase created: ${this.instanceId}]`);
    this.logger.log("Database initialized");
  }

  query(sql: string): any[] {
    this.logger.log(`Executing: ${sql}`);
    return [{ id: 1 }];
  }
}

class EmailServiceImpl implements EmailService {
  private instanceId: string;

  constructor(private logger: Logger) {
    this.instanceId = Math.random().toString(36).substring(7);
    console.log(`  [EmailService created: ${this.instanceId}]`);
  }

  send(to: string, message: string): void {
    this.logger.log(`Sending email to ${to}: ${message}`);
  }
}

class UserService {
  private instanceId: string;

  constructor(
    private logger: Logger,
    private database: Database,
    private emailService: EmailService
  ) {
    this.instanceId = Math.random().toString(36).substring(7);
    console.log(`  [UserService created: ${this.instanceId}]`);
  }

  registerUser(name: string, email: string): void {
    this.logger.log(`Registering user: ${name}`);
    this.database.query(`INSERT INTO users (name, email) VALUES ('${name}', '${email}')`);
    this.emailService.send(email, `Welcome ${name}!`);
  }
}

// ============================================
// Container Usage - Different Lifetimes
// ============================================

const container = new DIContainer();

// Register services with different lifetimes
console.log("=== Service Registration ===\n");

// Singleton: One instance for entire app
container.registerClass(
  "Logger",
  ConsoleLogger,
  [],
  Lifetime.Singleton
);

// Scoped: One instance per scope (e.g., per HTTP request)
container.registerClass(
  "Database",
  MySQLDatabase,
  ["Logger"],
  Lifetime.Scoped
);

// Transient: New instance every time
container.registerClass(
  "EmailService",
  EmailServiceImpl,
  ["Logger"],
  Lifetime.Transient
);

container.registerClass(
  "UserService",
  UserService,
  ["Logger", "Database", "EmailService"],
  Lifetime.Transient
);

// ============================================
// Demonstrating Lifetimes
// ============================================

console.log("\n=== Demonstrating Lifetimes ===\n");

// Scope 1 - simulating first HTTP request
container.createScope("request-1");

console.log("\nResolving UserService (first time):");
const userService1 = container.resolve<UserService>("UserService");

console.log("\nResolving UserService (second time in same scope):");
const userService2 = container.resolve<UserService>("UserService");

container.endScope();

// Scope 2 - simulating second HTTP request
container.createScope("request-2");

console.log("\nResolving UserService (in new scope):");
const userService3 = container.resolve<UserService>("UserService");

container.endScope();

// Observations:
console.log("\n=== Lifetime Observations ===");
console.log("✓ Singleton (Logger): Same instance across all scopes");
console.log("✓ Scoped (Database): Same instance within scope, new per scope");
console.log("✓ Transient (EmailService, UserService): New instance every time");

// ============================================
// Real-World Example: Web Application
// ============================================

console.log("\n\n=== Real-World: Web Application ===\n");

// Simulate HTTP requests
interface Request {
  userId: string;
  path: string;
}

interface Response {
  status: number;
  body: any;
}

// Request-scoped context
class RequestContext {
  constructor(public requestId: string, public userId: string) {
    console.log(`  [RequestContext created: ${requestId}]`);
  }
}

// Application-wide configuration (singleton)
class AppConfig {
  constructor() {
    console.log(`  [AppConfig created (singleton)]`);
  }

  getDatabaseUrl(): string {
    return "mysql://localhost:3306/myapp";
  }

  getApiKey(): string {
    return "secret-api-key";
  }
}

// Request handler
class UserController {
  constructor(
    private config: AppConfig,
    private userService: UserService,
    private context: RequestContext
  ) {
    console.log(`  [UserController created]`);
  }

  handleRequest(req: Request): Response {
    console.log(`\nHandling request: ${req.path} for user ${this.context.userId}`);
    this.userService.registerUser("John Doe", "john@example.com");
    
    return {
      status: 200,
      body: { message: "User registered" }
    };
  }
}

// Setup container for web app
const webContainer = new DIContainer();

webContainer.registerClass("AppConfig", AppConfig, [], Lifetime.Singleton);
webContainer.registerClass("Logger", ConsoleLogger, [], Lifetime.Singleton);
webContainer.registerClass("Database", MySQLDatabase, ["Logger"], Lifetime.Scoped);
webContainer.registerClass("EmailService", EmailServiceImpl, ["Logger"], Lifetime.Scoped);
webContainer.registerClass("UserService", UserService, ["Logger", "Database", "EmailService"], Lifetime.Scoped);

// Register request context as scoped
webContainer.register(
  "RequestContext",
  () => {
    throw new Error("RequestContext must be set per request");
  },
  Lifetime.Scoped
);

webContainer.registerClass(
  "UserController",
  UserController,
  ["AppConfig", "UserService", "RequestContext"],
  Lifetime.Scoped
);

// Simulate handling requests
function handleHttpRequest(req: Request): Response {
  const requestId = Math.random().toString(36).substring(7);
  
  // Create scope for this request
  webContainer.createScope(requestId);
  
  // Register request-specific context
  webContainer.register(
    "RequestContext",
    () => new RequestContext(requestId, req.userId),
    Lifetime.Scoped
  );
  
  console.log(`\n=== HTTP Request: ${req.path} ===`);
  
  // Resolve controller - all dependencies injected automatically
  const controller = webContainer.resolve<UserController>("UserController");
  const response = controller.handleRequest(req);
  
  webContainer.endScope();
  
  return response;
}

// Simulate multiple HTTP requests
handleHttpRequest({ userId: "user1", path: "/api/users/register" });
handleHttpRequest({ userId: "user2", path: "/api/users/register" });
handleHttpRequest({ userId: "user3", path: "/api/users/register" });

// ============================================
// Advanced: Auto-wiring
// ============================================

console.log("\n\n=== Advanced: Auto-wiring ===\n");

// Decorator for auto-registration
function Injectable(lifetime: Lifetime = Lifetime.Transient) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    // In a real framework, this would register with a global container
    console.log(`@Injectable decorator applied to ${constructor.name}`);
    return constructor;
  };
}

// Usage with decorators
@Injectable(Lifetime.Singleton)
class ConfigService {
  getConfig(key: string): string {
    return `value-for-${key}`;
  }
}

@Injectable(Lifetime.Scoped)
class DataService {
  constructor(private config: ConfigService, private logger: Logger) {}
  
  fetchData(): any[] {
    this.logger.log("Fetching data");
    return [];
  }
}

console.log("✓ Decorators enable auto-registration");
console.log("✓ Framework can scan and register decorated classes");
console.log("✓ Similar to Angular, NestJS, InversifyJS");

// ============================================
// Popular DI Frameworks
// ============================================

console.log("\n\n=== Popular DI Frameworks ===\n");

console.log("TypeScript/JavaScript:");
console.log("  • InversifyJS - Powerful IoC container");
console.log("  • TSyringe - Microsoft's lightweight DI");
console.log("  • TypeDI - Decorator-based DI");
console.log("  • Awilix - Fast, flexible container");
console.log("  • NestJS - Full framework with built-in DI");

console.log("\nPython:");
console.log("  • dependency-injector - Comprehensive DI framework");
console.log("  • injector - Pythonic dependency injection");
console.log("  • pinject - Google's DI library");

console.log("\nOther Languages:");
console.log("  • Spring (Java) - Enterprise DI framework");
console.log("  • .NET Core DI - Built into ASP.NET Core");
console.log("  • Dagger (Java/Kotlin) - Compile-time DI");

// ============================================
// Key Takeaways
// ============================================

console.log("\n\n=== DI Container Benefits ===");
console.log("✓ Automatic dependency resolution");
console.log("✓ Centralized configuration");
console.log("✓ Lifetime management (singleton, scoped, transient)");
console.log("✓ Reduces boilerplate code");
console.log("✓ Enforces dependency patterns");

console.log("\n=== When to Use DI Containers ===");
console.log("✓ Large applications with many dependencies");
console.log("✓ When you need lifetime management");
console.log("✓ Team projects with dependency conventions");
console.log("✓ When using frameworks that provide DI");

console.log("\n=== When NOT to Use DI Containers ===");
console.log("⚠ Small, simple applications");
console.log("⚠ When manual wiring is clearer");
console.log("⚠ When team isn't familiar with DI");
console.log("⚠ Over-engineering simple problems");
```

```python
# Python - DI Container Implementation

from abc import ABC, abstractmethod
from typing import Dict, Any, Callable, Optional, Type
from enum import Enum
import random
import string

# ============================================
# Building a Simple DI Container
# ============================================

print("=== Simple DI Container ===\n")

class Lifetime(Enum):
    TRANSIENT = "transient"  # New instance every time
    SINGLETON = "singleton"  # Single instance for entire app
    SCOPED = "scoped"        # Single instance per scope

class ServiceDescriptor:
    def __init__(self, factory: Callable, lifetime: Lifetime):
        self.factory = factory
        self.lifetime = lifetime

class DIContainer:
    def __init__(self):
        self._services: Dict[str, ServiceDescriptor] = {}
        self._singletons: Dict[str, Any] = {}
        self._scopes: Dict[str, Dict[str, Any]] = {}
        self._current_scope: Optional[str] = None
    
    def register(self, name: str, factory: Callable, lifetime: Lifetime = Lifetime.TRANSIENT) -> None:
        """Register a service"""
        self._services[name] = ServiceDescriptor(factory, lifetime)
        print(f"Registered: {name} ({lifetime.value})")
    
    def register_class(self, name: str, cls: Type, dependencies: list = None, 
                      lifetime: Lifetime = Lifetime.TRANSIENT) -> None:
        """Register with class constructor"""
        deps = dependencies or []
        
        def factory():
            resolved_deps = [self.resolve(dep) for dep in deps]
            return cls(*resolved_deps)
        
        self.register(name, factory, lifetime)
    
    def resolve(self, name: str) -> Any:
        """Resolve (get) a service"""
        if name not in self._services:
            raise ValueError(f"Service '{name}' not registered")
        
        descriptor = self._services[name]
        
        if descriptor.lifetime == Lifetime.SINGLETON:
            return self._resolve_singleton(name, descriptor)
        elif descriptor.lifetime == Lifetime.SCOPED:
            return self._resolve_scoped(name, descriptor)
        else:  # TRANSIENT
            return descriptor.factory()
    
    def _resolve_singleton(self, name: str, descriptor: ServiceDescriptor) -> Any:
        if name not in self._singletons:
            print(f"Creating singleton: {name}")
            self._singletons[name] = descriptor.factory()
        else:
            print(f"Reusing singleton: {name}")
        return self._singletons[name]
    
    def _resolve_scoped(self, name: str, descriptor: ServiceDescriptor) -> Any:
        if not self._current_scope:
            raise RuntimeError("No active scope")
        
        if self._current_scope not in self._scopes:
            self._scopes[self._current_scope] = {}
        
        scope_cache = self._scopes[self._current_scope]
        
        if name not in scope_cache:
            print(f"Creating scoped instance: {name} (scope: {self._current_scope})")
            scope_cache[name] = descriptor.factory()
        else:
            print(f"Reusing scoped instance: {name}")
        return scope_cache[name]
    
    def create_scope(self, scope_id: str) -> None:
        """Create a scope"""
        self._current_scope = scope_id
        print(f"\n--- Scope created: {scope_id} ---")
    
    def end_scope(self) -> None:
        """End scope"""
        if self._current_scope:
            print(f"--- Scope ended: {self._current_scope} ---\n")
            if self._current_scope in self._scopes:
                del self._scopes[self._current_scope]
            self._current_scope = None

# ============================================
# Example Services
# ============================================

class Logger(ABC):
    @abstractmethod
    def log(self, message: str) -> None:
        pass

class Database(ABC):
    @abstractmethod
    def query(self, sql: str) -> list:
        pass

class EmailService(ABC):
    @abstractmethod
    def send(self, to: str, message: str) -> None:
        pass

class ConsoleLogger(Logger):
    def __init__(self):
        self._instance_id = ''.join(random.choices(string.ascii_lowercase, k=6))
        print(f"  [ConsoleLogger created: {self._instance_id}]")
    
    def log(self, message: str) -> None:
        print(f"[{self._instance_id}] {message}")

class MySQLDatabase(Database):
    def __init__(self, logger: Logger):
        self._logger = logger
        self._instance_id = ''.join(random.choices(string.ascii_lowercase, k=6))
        print(f"  [MySQLDatabase created: {self._instance_id}]")
        self._logger.log("Database initialized")
    
    def query(self, sql: str) -> list:
        self._logger.log(f"Executing: {sql}")
        return [{'id': 1}]

class EmailServiceImpl(EmailService):
    def __init__(self, logger: Logger):
        self._logger = logger
        self._instance_id = ''.join(random.choices(string.ascii_lowercase, k=6))
        print(f"  [EmailService created: {self._instance_id}]")
    
    def send(self, to: str, message: str) -> None:
        self._logger.log(f"Sending email to {to}: {message}")

class UserService:
    def __init__(self, logger: Logger, database: Database, email_service: EmailService):
        self._logger = logger
        self._database = database
        self._email_service = email_service
        self._instance_id = ''.join(random.choices(string.ascii_lowercase, k=6))
        print(f"  [UserService created: {self._instance_id}]")
    
    def register_user(self, name: str, email: str) -> None:
        self._logger.log(f"Registering user: {name}")
        self._database.query(f"INSERT INTO users (name, email) VALUES ('{name}', '{email}')")
        self._email_service.send(email, f"Welcome {name}!")

# ============================================
# Container Usage - Different Lifetimes
# ============================================

container = DIContainer()

print("=== Service Registration ===\n")

# Singleton: One instance for entire app
container.register_class("Logger", ConsoleLogger, [], Lifetime.SINGLETON)

# Scoped: One instance per scope
container.register_class("Database", MySQLDatabase, ["Logger"], Lifetime.SCOPED)

# Transient: New instance every time
container.register_class("EmailService", EmailServiceImpl, ["Logger"], Lifetime.TRANSIENT)

container.register_class("UserService", UserService, 
                        ["Logger", "Database", "EmailService"], 
                        Lifetime.TRANSIENT)

# ============================================
# Demonstrating Lifetimes
# ============================================

print("\n=== Demonstrating Lifetimes ===\n")

# Scope 1
container.create_scope("request-1")

print("\nResolving UserService (first time):")
user_service1 = container.resolve("UserService")

print("\nResolving UserService (second time in same scope):")
user_service2 = container.resolve("UserService")

container.end_scope()

# Scope 2
container.create_scope("request-2")

print("\nResolving UserService (in new scope):")
user_service3 = container.resolve("UserService")

container.end_scope()

print("\n=== Lifetime Observations ===")
print("✓ Singleton (Logger): Same instance across all scopes")
print("✓ Scoped (Database): Same instance within scope, new per scope")
print("✓ Transient (EmailService, UserService): New instance every time")

# ============================================
# Real-World Example: Web Application
# ============================================

print("\n\n=== Real-World: Web Application ===\n")

class RequestContext:
    def __init__(self, request_id: str, user_id: str):
        self.request_id = request_id
        self.user_id = user_id
        print(f"  [RequestContext created: {request_id}]")

class AppConfig:
    def __init__(self):
        print(f"  [AppConfig created (singleton)]")
    
    def get_database_url(self) -> str:
        return "mysql://localhost:3306/myapp"
    
    def get_api_key(self) -> str:
        return "secret-api-key"

class UserController:
    def __init__(self, config: AppConfig, user_service: UserService, context: RequestContext):
        self._config = config
        self._user_service = user_service
        self._context = context
        print(f"  [UserController created]")
    
    def handle_request(self, req: dict) -> dict:
        print(f"\nHandling request: {req['path']} for user {self._context.user_id}")
        self._user_service.register_user("John Doe", "john@example.com")
        
        return {'status': 200, 'body': {'message': 'User registered'}}

# Setup container
web_container = DIContainer()

web_container.register_class("AppConfig", AppConfig, [], Lifetime.SINGLETON)
web_container.register_class("Logger", ConsoleLogger, [], Lifetime.SINGLETON)
web_container.register_class("Database", MySQLDatabase, ["Logger"], Lifetime.SCOPED)
web_container.register_class("EmailService", EmailServiceImpl, ["Logger"], Lifetime.SCOPED)
web_container.register_class("UserService", UserService, 
                            ["Logger", "Database", "EmailService"], Lifetime.SCOPED)

web_container.register("RequestContext", 
                      lambda: None,  # Will be set per request
                      Lifetime.SCOPED)

web_container.register_class("UserController", UserController,
                            ["AppConfig", "UserService", "RequestContext"],
                            Lifetime.SCOPED)

def handle_http_request(req: dict) -> dict:
    request_id = ''.join(random.choices(string.ascii_lowercase, k=6))
    
    # Create scope
    web_container.create_scope(request_id)
    
    # Register request context
    web_container.register("RequestContext",
                          lambda: RequestContext(request_id, req['userId']),
                          Lifetime.SCOPED)
    
    print(f"\n=== HTTP Request: {req['path']} ===")
    
    # Resolve controller
    controller = web_container.resolve("UserController")
    response = controller.handle_request(req)
    
    web_container.end_scope()
    
    return response

# Simulate requests
handle_http_request({'userId': 'user1', 'path': '/api/users/register'})
handle_http_request({'userId': 'user2', 'path': '/api/users/register'})
handle_http_request({'userId': 'user3', 'path': '/api/users/register'})

# ============================================
# Popular Python DI Frameworks
# ============================================

print("\n\n=== Popular DI Frameworks ===\n")

print("Python:")
print("  • dependency-injector - Comprehensive DI framework")
print("  • injector - Pythonic dependency injection")
print("  • pinject - Google's DI library")

print("\n=== DI Container Benefits ===")
print("✓ Automatic dependency resolution")
print("✓ Centralized configuration")
print("✓ Lifetime management (singleton, scoped, transient)")
print("✓ Reduces boilerplate code")
print("✓ Enforces dependency patterns")

print("\n=== When to Use DI Containers ===")
print("✓ Large applications with many dependencies")
print("✓ When you need lifetime management")
print("✓ Team projects with dependency conventions")
print("✓ When using frameworks that provide DI")

print("\n=== When NOT to Use DI Containers ===")
print("⚠ Small, simple applications")
print("⚠ When manual wiring is clearer")
print("⚠ When team isn't familiar with DI")
print("⚠ Over-engineering simple problems")
```

</details>

---

## 4. Benefits and Trade-offs

### Benefits of Dependency Injection

✅ **Loose Coupling**
- Classes depend on abstractions, not concrete implementations
- Easy to swap implementations without changing client code
- Changes isolated to specific components

✅ **Testability**
- Easy to inject mock/stub dependencies for testing
- No need for complex test setup or frameworks
- Fast, isolated unit tests

✅ **Maintainability**
- Dependencies are explicit and visible
- Changes to dependencies don't affect clients
- Clear separation of concerns

✅ **Flexibility**
- Swap implementations at runtime
- Configure different implementations for different environments
- Support multiple implementations simultaneously

✅ **Reusability**
- Components work with any compatible implementation
- Easy to use in different contexts
- Promotes interface-based design

### Trade-offs and Challenges

⚠️ **Complexity**
- Additional abstraction layer
- More files and interfaces to manage
- Steeper learning curve for beginners

⚠️ **Runtime Errors**
- Misconfigured dependencies may only fail at runtime
- Harder to trace dependency graphs
- Container configuration errors

⚠️ **Over-engineering**
- Easy to create too many abstractions
- Can be overkill for simple applications
- "Premature abstraction" anti-pattern

⚠️ **Performance Overhead**
- Container resolution has slight overhead
- Reflection-based containers can be slower
- More object creation and memory usage

⚠️ **Debugging Difficulty**
- Stack traces can be deeper
- Container magic can hide what's happening
- Harder to understand object creation flow

### When to Use DI

**Use DI when:**
- Application has complex dependencies
- You need to support multiple implementations
- Testing is important
- Working in a team with conventions
- Building long-lived, maintainable systems

**Avoid DI when:**
- Building simple scripts or utilities
- Dependencies are simple and stable
- Team unfamiliar with the pattern
- Over-complicating straightforward code

### Best Practices

1. **Prefer constructor injection** for required dependencies
2. **Use interfaces/abstractions** for all dependencies
3. **Keep constructors simple** - just assignment
4. **Avoid service locator pattern** - inject, don't locate
5. **Register at startup** - fail fast on misconfiguration
6. **Use containers judiciously** - don't overuse
7. **Document dependencies** - make them explicit
8. **Consider factory patterns** for complex construction

---

## Practice Questions - Dependency Injection

<details>
<summary><strong>View Questions</strong></summary>

### Fill in the Blanks

1. __________ injection passes dependencies through the class constructor and is the most recommended approach.

2. In a DI container, __________ lifetime creates a new instance every time, while __________ lifetime creates one instance for the entire application.

3. The main benefit of dependency injection is __________ coupling between components.

4. Setter injection is useful when dependencies are __________ or may need to change at __________.

<details>
<summary><strong>View Answers</strong></summary>

1. **Constructor** - Constructor injection makes dependencies required, immutable, and explicit. It's preferred over setter or method injection for core dependencies.

2. **Transient**, **Singleton** - Transient creates new instances each time (no sharing). Singleton creates one shared instance. Scoped creates one per scope (e.g., per HTTP request).

3. **loose** - DI promotes loose coupling by depending on abstractions. High-level modules don't know about concrete implementations, making them easier to change and test.

4. **optional**, **runtime** - Setter injection works for optional dependencies like caching. Dependencies can be added after construction and swapped at runtime without recreating the object.

</details>

---

### True/False

1. ⬜ Constructor injection ensures an object is fully initialized and ready to use.

2. ⬜ DI containers are necessary for all applications that use dependency injection.

3. ⬜ Singleton lifetime means a new instance is created for each scope.

4. ⬜ Dependency injection makes testing harder because you can't control dependencies.

5. ⬜ It's better to use setter injection for all dependencies to maintain flexibility.

<details>
<summary><strong>View Answers</strong></summary>

1. **True** - Constructor injection requires all dependencies at construction time. Object cannot exist in invalid state. If UserService needs Database, it can't be created without one.

2. **False** - DI containers are helpful for large apps but not required. You can manually inject dependencies (new UserService(new MySQLDatabase())). Containers automate this but add complexity.

3. **False** - Singleton means ONE instance for the ENTIRE application lifetime. Scoped means one per scope. Transient means new instance each time.

4. **False** - DI makes testing MUCH easier. You can inject mock dependencies during tests. Without DI, classes create their own dependencies (hard to mock). With DI, you control what's injected.

5. **False** - Constructor injection is preferred for required dependencies. It makes requirements explicit and ensures initialization. Use setter injection only for truly optional dependencies that may change at runtime.

</details>

---

### Multiple Choice

1. **Which DI type is best for required dependencies?**
   - A) Setter injection
   - B) Constructor injection
   - C) Method injection
   - D) Interface injection

2. **What does Scoped lifetime mean in a DI container?**
   - A) New instance every time
   - B) One instance for entire application
   - C) One instance per scope (e.g., per HTTP request)
   - D) No instances are created

3. **What is the main advantage of using a DI container?**
   - A) Faster code execution
   - B) Automatic dependency resolution and lifetime management
   - C) Smaller code files
   - D) Eliminates need for interfaces

4. **When should you avoid using dependency injection?**
   - A) Large enterprise applications
   - B) When testing is important
   - C) Simple scripts with no complex dependencies
   - D) Team projects

<details>
<summary><strong>View Answers</strong></summary>

1. **B** - Constructor injection is best for required dependencies. Makes requirements explicit, ensures object is fully initialized, and prevents invalid states. Setter injection is for optional deps.

2. **C** - Scoped lifetime creates one instance per scope. In web apps, typically one per HTTP request. Multiple resolves within same request get same instance. New request = new instance.

3. **B** - Containers automate dependency creation and management. You register services once, container resolves dependencies automatically. Also manages lifetimes (singleton, scoped, transient).

4. **C** - DI adds complexity that may not be worth it for simple scripts. If you have 3 classes and straightforward dependencies, manual wiring is clearer than DI container infrastructure.

</details>

</details>

---

## Summary

Dependency Injection is a powerful pattern for building maintainable, testable applications:

1. **Three Types**: Constructor (required), Setter (optional), Method (contextual)
2. **DI Containers**: Automate dependency creation and lifetime management
3. **Lifetimes**: Transient (always new), Singleton (one instance), Scoped (one per scope)
4. **Benefits**: Loose coupling, testability, flexibility, maintainability
5. **Trade-offs**: Added complexity, learning curve, potential over-engineering

**Key Principle**: Inject dependencies rather than creating them. Depend on abstractions, not concrete implementations.
