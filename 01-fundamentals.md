# Chapter 1: OOP Fundamentals

## Table of Contents

- [1. Introduction to OOP](#1-introduction-to-oop)
- [2. Classes and Objects](#2-classes-and-objects)
- [3. Properties and Methods](#3-properties-and-methods)
- [4. Constructors and Initialization](#4-constructors-and-initialization)
- [5. Access Modifiers (Public, Private, Protected)](#5-access-modifiers-public-private-protected)
- [6. Static Members](#6-static-members)
- [7. The this Keyword](#7-the-this-keyword)

---

## 1. Introduction to OOP

Object-Oriented Programming (OOP) is a programming paradigm that organizes code around **objects** rather than functions and logic. An object is a self-contained unit that combines data (properties) and behavior (methods).

### Why OOP?

**Real-world analogy:** Think of a banking system. Instead of having separate functions like `calculateInterest()`, `checkBalance()`, `withdrawMoney()`, OOP lets you create a `BankAccount` object that knows its own balance and can perform operations on itself.

### Key Benefits:
- **Modularity:** Code is organized into reusable objects
- **Maintainability:** Changes to one object don't affect others
- **Scalability:** Easy to add new features without breaking existing code
- **Reusability:** Objects can be reused across different parts of the application

---

## 2. Classes and Objects

A **class** is a blueprint for creating objects. An **object** is an instance of a class.

**Real-world analogy:** A class is like an architectural blueprint for a house. The actual houses built from that blueprint are objects.

<details>
<summary><strong>View Examples</strong></summary>

```typescript
// TypeScript
class BankAccount {
  accountNumber: string;
  accountHolder: string;
  balance: number;
  accountType: string;

  constructor(accountNumber: string, accountHolder: string, initialDeposit: number, accountType: string) {
    this.accountNumber = accountNumber;
    this.accountHolder = accountHolder;
    this.balance = initialDeposit;
    this.accountType = accountType;
  }

  deposit(amount: number): void {
    this.balance += amount;
    console.log(`Deposited $${amount}. New balance: $${this.balance}`);
  }

  withdraw(amount: number): boolean {
    if (amount > this.balance) {
      console.log("Insufficient funds");
      return false;
    }
    this.balance -= amount;
    console.log(`Withdrawn $${amount}. Remaining balance: $${this.balance}`);
    return true;
  }

  getBalance(): number {
    return this.balance;
  }
}

// Creating objects (instances)
const savingsAccount = new BankAccount("SA001", "Alice Johnson", 5000, "Savings");
const checkingAccount = new BankAccount("CH001", "Bob Smith", 2000, "Checking");

savingsAccount.deposit(1000);  // Deposited $1000. New balance: $6000
checkingAccount.withdraw(500); // Withdrawn $500. Remaining balance: $1500
```

```python
# Python
class BankAccount:
    def __init__(self, account_number: str, account_holder: str, initial_deposit: float, account_type: str):
        self.account_number = account_number
        self.account_holder = account_holder
        self.balance = initial_deposit
        self.account_type = account_type
    
    def deposit(self, amount: float) -> None:
        self.balance += amount
        print(f"Deposited ${amount}. New balance: ${self.balance}")
    
    def withdraw(self, amount: float) -> bool:
        if amount > self.balance:
            print("Insufficient funds")
            return False
        self.balance -= amount
        print(f"Withdrawn ${amount}. Remaining balance: ${self.balance}")
        return True
    
    def get_balance(self) -> float:
        return self.balance

# Creating objects (instances)
savings_account = BankAccount("SA001", "Alice Johnson", 5000, "Savings")
checking_account = BankAccount("CH001", "Bob Smith", 2000, "Checking")

savings_account.deposit(1000)   # Deposited $1000. New balance: $6000
checking_account.withdraw(500)  # Withdrawn $500. Remaining balance: $1500
```

</details>

---

## 3. Properties and Methods

**Properties** (also called attributes or fields) are variables that belong to an object. They represent the object's state.

**Methods** are functions that belong to an object. They represent the object's behavior.

<details>
<summary><strong>View Examples</strong></summary>

```typescript
// TypeScript - E-commerce Product Management
class Product {
  // Properties
  productId: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  discount: number;

  constructor(productId: string, name: string, price: number, stock: number, category: string) {
    this.productId = productId;
    this.name = name;
    this.price = price;
    this.stock = stock;
    this.category = category;
    this.discount = 0;
  }

  // Methods
  applyDiscount(percentage: number): void {
    this.discount = percentage;
    console.log(`${percentage}% discount applied to ${this.name}`);
  }

  getFinalPrice(): number {
    return this.price - (this.price * this.discount / 100);
  }

  updateStock(quantity: number): void {
    this.stock += quantity;
    console.log(`Stock updated. Current stock: ${this.stock}`);
  }

  isInStock(): boolean {
    return this.stock > 0;
  }

  getProductInfo(): string {
    return `${this.name} (${this.productId}) - $${this.getFinalPrice()} - Stock: ${this.stock}`;
  }
}

const laptop = new Product("PROD001", "Dell XPS 15", 1500, 25, "Electronics");
laptop.applyDiscount(10);  // 10% discount applied to Dell XPS 15
console.log(laptop.getFinalPrice());  // 1350
console.log(laptop.getProductInfo()); // Dell XPS 15 (PROD001) - $1350 - Stock: 25
```

```python
# Python - E-commerce Product Management
class Product:
    def __init__(self, product_id: str, name: str, price: float, stock: int, category: str):
        # Properties
        self.product_id = product_id
        self.name = name
        self.price = price
        self.stock = stock
        self.category = category
        self.discount = 0
    
    # Methods
    def apply_discount(self, percentage: float) -> None:
        self.discount = percentage
        print(f"{percentage}% discount applied to {self.name}")
    
    def get_final_price(self) -> float:
        return self.price - (self.price * self.discount / 100)
    
    def update_stock(self, quantity: int) -> None:
        self.stock += quantity
        print(f"Stock updated. Current stock: {self.stock}")
    
    def is_in_stock(self) -> bool:
        return self.stock > 0
    
    def get_product_info(self) -> str:
        return f"{self.name} ({self.product_id}) - ${self.get_final_price()} - Stock: {self.stock}"

laptop = Product("PROD001", "Dell XPS 15", 1500, 25, "Electronics")
laptop.apply_discount(10)  # 10% discount applied to Dell XPS 15
print(laptop.get_final_price())  # 1350.0
print(laptop.get_product_info()) # Dell XPS 15 (PROD001) - $1350.0 - Stock: 25
```

</details>

---

## 4. Constructors and Initialization

A **constructor** is a special method that initializes an object when it's created. It sets up the initial state of the object.

**Key points:**
- Called automatically when you create a new object
- Used to set initial values for properties
- Can accept parameters to customize initialization

<details>
<summary><strong>View Examples</strong></summary>

```typescript
// TypeScript - User Management System
class User {
  userId: string;
  username: string;
  email: string;
  createdAt: Date;
  isActive: boolean;
  role: string;

  // Constructor with default values
  constructor(username: string, email: string, role: string = "user") {
    this.userId = this.generateUserId();
    this.username = username;
    this.email = email;
    this.createdAt = new Date();
    this.isActive = true;
    this.role = role;
    console.log(`User ${username} created successfully`);
  }

  private generateUserId(): string {
    return `USER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getUserInfo(): string {
    return `${this.username} (${this.email}) - Role: ${this.role}`;
  }
}

// Different ways to create users
const user1 = new User("john_doe", "john@example.com");
const admin = new User("admin_jane", "jane@example.com", "admin");

console.log(user1.getUserInfo()); // john_doe (john@example.com) - Role: user
console.log(admin.getUserInfo()); // admin_jane (jane@example.com) - Role: admin
```

```python
# Python - User Management System
from datetime import datetime
import random
import string

class User:
    def __init__(self, username: str, email: str, role: str = "user"):
        """
        Constructor with default parameter for role
        """
        self.user_id = self._generate_user_id()
        self.username = username
        self.email = email
        self.created_at = datetime.now()
        self.is_active = True
        self.role = role
        print(f"User {username} created successfully")
    
    def _generate_user_id(self) -> str:
        random_str = ''.join(random.choices(string.ascii_lowercase + string.digits, k=9))
        return f"USER_{int(datetime.now().timestamp())}_{random_str}"
    
    def get_user_info(self) -> str:
        return f"{self.username} ({self.email}) - Role: {self.role}"

# Different ways to create users
user1 = User("john_doe", "john@example.com")
admin = User("admin_jane", "jane@example.com", "admin")

print(user1.get_user_info())  # john_doe (john@example.com) - Role: user
print(admin.get_user_info())  # admin_jane (jane@example.com) - Role: admin
```

**Advanced: Multiple Constructor Patterns (TypeScript)**

```typescript
// Factory methods pattern for alternative constructors
class Order {
  orderId: string;
  customerId: string;
  items: string[];
  totalAmount: number;
  orderDate: Date;

  private constructor(orderId: string, customerId: string, items: string[], totalAmount: number) {
    this.orderId = orderId;
    this.customerId = customerId;
    this.items = items;
    this.totalAmount = totalAmount;
    this.orderDate = new Date();
  }

  // Factory method for creating a new order
  static createNewOrder(customerId: string, items: string[], totalAmount: number): Order {
    const orderId = `ORD_${Date.now()}`;
    return new Order(orderId, customerId, items, totalAmount);
  }

  // Factory method for loading an existing order from database
  static loadFromDatabase(orderId: string, customerId: string, items: string[], totalAmount: number): Order {
    return new Order(orderId, customerId, items, totalAmount);
  }
}

const newOrder = Order.createNewOrder("CUST001", ["item1", "item2"], 299.99);
const existingOrder = Order.loadFromDatabase("ORD_12345", "CUST002", ["item3"], 149.99);
```

</details>

---

## 5. Access Modifiers (Public, Private, Protected)

Access modifiers control the visibility and accessibility of class members (properties and methods).

- **Public:** Accessible from anywhere
- **Private:** Accessible only within the class
- **Protected:** Accessible within the class and its subclasses

**Real-world analogy:** Think of a bank vault. Public information (like bank hours) is accessible to everyone. Private information (like the vault combination) is only known to specific bank employees. Protected information (like certain procedures) is known to employees and their trainees.

<details>
<summary><strong>View Examples</strong></summary>

```typescript
// TypeScript - Payment Processing System
class PaymentProcessor {
  public transactionId: string;           // Accessible everywhere
  private apiKey: string;                 // Only accessible within this class
  protected processingFee: number;        // Accessible in this class and subclasses

  constructor(transactionId: string, apiKey: string) {
    this.transactionId = transactionId;
    this.apiKey = apiKey;
    this.processingFee = 2.5; // 2.5% fee
  }

  // Public method - can be called from anywhere
  public processPayment(amount: number): boolean {
    if (this.validateApiKey()) {
      const total = this.calculateTotal(amount);
      console.log(`Processing payment: $${total}`);
      return true;
    }
    return false;
  }

  // Private method - only accessible within this class
  private validateApiKey(): boolean {
    // In real app, this would validate against a service
    return this.apiKey.length > 0;
  }

  // Protected method - accessible in this class and subclasses
  protected calculateTotal(amount: number): number {
    return amount + (amount * this.processingFee / 100);
  }

  // Public getter for private data
  public getTransactionId(): string {
    return this.transactionId;
  }
}

const payment = new PaymentProcessor("TXN001", "sk_test_abc123");
payment.processPayment(100);          // ✅ Works - public method
console.log(payment.transactionId);   // ✅ Works - public property
// console.log(payment.apiKey);       // ❌ Error - private property
// payment.validateApiKey();          // ❌ Error - private method
```

```python
# Python - Payment Processing System
class PaymentProcessor:
    def __init__(self, transaction_id: str, api_key: str):
        self.transaction_id = transaction_id      # Public (by convention)
        self.__api_key = api_key                  # Private (name mangling with __)
        self._processing_fee = 2.5                # Protected (by convention with _)
    
    # Public method
    def process_payment(self, amount: float) -> bool:
        if self.__validate_api_key():
            total = self._calculate_total(amount)
            print(f"Processing payment: ${total}")
            return True
        return False
    
    # Private method (name mangling)
    def __validate_api_key(self) -> bool:
        return len(self.__api_key) > 0
    
    # Protected method (by convention)
    def _calculate_total(self, amount: float) -> float:
        return amount + (amount * self._processing_fee / 100)
    
    # Public getter for private data
    def get_transaction_id(self) -> str:
        return self.transaction_id

payment = PaymentProcessor("TXN001", "sk_test_abc123")
payment.process_payment(100)           # ✅ Works - public method
print(payment.transaction_id)          # ✅ Works - public property
# print(payment.__api_key)             # ❌ AttributeError - private property
# payment.__validate_api_key()         # ❌ AttributeError - private method
```

**TypeScript - Using Property Accessors (Getters/Setters)**

```typescript
class Employee {
  private _salary: number;
  private _department: string;
  public employeeId: string;

  constructor(employeeId: string, salary: number, department: string) {
    this.employeeId = employeeId;
    this._salary = salary;
    this._department = department;
  }

  // Getter for salary
  get salary(): number {
    return this._salary;
  }

  // Setter with validation
  set salary(value: number) {
    if (value < 0) {
      throw new Error("Salary cannot be negative");
    }
    if (value > 1000000) {
      console.log("High salary - requires approval");
    }
    this._salary = value;
  }

  get department(): string {
    return this._department;
  }

  set department(value: string) {
    this._department = value;
    console.log(`Employee ${this.employeeId} transferred to ${value}`);
  }
}

const emp = new Employee("EMP001", 75000, "Engineering");
console.log(emp.salary);      // 75000 (using getter)
emp.salary = 85000;           // Using setter
emp.department = "Marketing"; // Employee EMP001 transferred to Marketing
```

</details>

---

## 6. Static Members

**Static members** belong to the class itself, not to instances of the class. They are shared across all instances.

**Real-world analogy:** Think of a car factory. Each car (instance) has its own color, model, and features. But the factory (class) has a counter showing how many cars have been produced - this counter is static, shared by all cars.

**Use cases:**
- Utility functions that don't need instance data
- Counters or shared configurations
- Factory methods
- Constants

<details>
<summary><strong>View Examples</strong></summary>

```typescript
// TypeScript - Database Connection Pool
class DatabaseConnection {
  private static instance: DatabaseConnection;
  private static activeConnections: number = 0;
  private static readonly MAX_CONNECTIONS: number = 100;
  
  private connectionId: string;
  private isConnected: boolean;

  private constructor() {
    this.connectionId = `CONN_${Date.now()}`;
    this.isConnected = false;
  }

  // Singleton pattern using static method
  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  // Static method for getting connection count
  public static getActiveConnections(): number {
    return DatabaseConnection.activeConnections;
  }

  // Static method for checking if we can create more connections
  public static canCreateConnection(): boolean {
    return DatabaseConnection.activeConnections < DatabaseConnection.MAX_CONNECTIONS;
  }

  public connect(): void {
    if (DatabaseConnection.canCreateConnection()) {
      this.isConnected = true;
      DatabaseConnection.activeConnections++;
      console.log(`Connected: ${this.connectionId}. Active connections: ${DatabaseConnection.activeConnections}`);
    } else {
      console.log("Connection pool exhausted");
    }
  }

  public disconnect(): void {
    if (this.isConnected) {
      this.isConnected = false;
      DatabaseConnection.activeConnections--;
      console.log(`Disconnected: ${this.connectionId}. Active connections: ${DatabaseConnection.activeConnections}`);
    }
  }
}

// Usage
const db1 = DatabaseConnection.getInstance();
db1.connect();  // Connected: CONN_xyz. Active connections: 1

console.log(DatabaseConnection.getActiveConnections());  // 1
console.log(DatabaseConnection.canCreateConnection());   // true
```

```python
# Python - Database Connection Pool
class DatabaseConnection:
    _instance = None
    _active_connections = 0
    MAX_CONNECTIONS = 100
    
    def __init__(self):
        if DatabaseConnection._instance is not None:
            raise Exception("Use getInstance() method")
        self.connection_id = f"CONN_{id(self)}"
        self.is_connected = False
    
    @classmethod
    def get_instance(cls):
        """Singleton pattern using class method"""
        if cls._instance is None:
            cls._instance = DatabaseConnection()
        return cls._instance
    
    @staticmethod
    def get_active_connections():
        """Static method for getting connection count"""
        return DatabaseConnection._active_connections
    
    @staticmethod
    def can_create_connection():
        """Static method for checking connection availability"""
        return DatabaseConnection._active_connections < DatabaseConnection.MAX_CONNECTIONS
    
    def connect(self):
        if DatabaseConnection.can_create_connection():
            self.is_connected = True
            DatabaseConnection._active_connections += 1
            print(f"Connected: {self.connection_id}. Active connections: {DatabaseConnection._active_connections}")
        else:
            print("Connection pool exhausted")
    
    def disconnect(self):
        if self.is_connected:
            self.is_connected = False
            DatabaseConnection._active_connections -= 1
            print(f"Disconnected: {self.connection_id}. Active connections: {DatabaseConnection._active_connections}")

# Usage
db1 = DatabaseConnection.get_instance()
db1.connect()  # Connected: CONN_xyz. Active connections: 1

print(DatabaseConnection.get_active_connections())  # 1
print(DatabaseConnection.can_create_connection())   # True
```

**Real-world Example: Configuration Manager**

```typescript
class AppConfig {
  private static config: Map<string, any> = new Map();
  
  // Static initializer
  static {
    AppConfig.config.set("apiUrl", "https://api.example.com");
    AppConfig.config.set("timeout", 5000);
    AppConfig.config.set("retryAttempts", 3);
  }

  // Static methods for configuration management
  public static get(key: string): any {
    return AppConfig.config.get(key);
  }

  public static set(key: string, value: any): void {
    AppConfig.config.set(key, value);
  }

  public static getAll(): object {
    return Object.fromEntries(AppConfig.config);
  }
}

// Usage - no need to create instances
console.log(AppConfig.get("apiUrl"));  // https://api.example.com
AppConfig.set("timeout", 10000);
console.log(AppConfig.getAll());
```

</details>

---

## 7. The `this` Keyword

The `this` keyword refers to the current instance of the class. It's used to access the object's own properties and methods.

**Key points:**
- `this` refers to the object that is currently being used
- Helps distinguish between parameters and instance properties
- Required when accessing instance members within methods

<details>
<summary><strong>View Examples</strong></summary>

```typescript
// TypeScript - Shopping Cart System
class ShoppingCart {
  private items: Map<string, { name: string; price: number; quantity: number }>;
  private customerId: string;
  private discountPercentage: number;

  constructor(customerId: string) {
    this.customerId = customerId;
    this.items = new Map();
    this.discountPercentage = 0;
  }

  addItem(productId: string, name: string, price: number, quantity: number): void {
    // 'this' refers to the current cart instance
    if (this.items.has(productId)) {
      const existing = this.items.get(productId)!;
      existing.quantity += quantity;
      console.log(`Updated ${name} quantity to ${existing.quantity}`);
    } else {
      this.items.set(productId, { name, price, quantity });
      console.log(`Added ${name} to cart`);
    }
  }

  removeItem(productId: string): void {
    if (this.items.has(productId)) {
      const item = this.items.get(productId)!;
      console.log(`Removed ${item.name} from cart`);
      this.items.delete(productId);
    }
  }

  applyDiscount(percentage: number): void {
    this.discountPercentage = percentage;
    console.log(`${percentage}% discount applied to cart`);
  }

  calculateSubtotal(): number {
    let subtotal = 0;
    // 'this.items' refers to the items in THIS cart
    this.items.forEach(item => {
      subtotal += item.price * item.quantity;
    });
    return subtotal;
  }

  calculateTotal(): number {
    const subtotal = this.calculateSubtotal();  // Calling another method using 'this'
    const discount = subtotal * (this.discountPercentage / 100);
    return subtotal - discount;
  }

  getCartSummary(): string {
    return `Cart for Customer ${this.customerId}: ${this.items.size} unique items, Total: $${this.calculateTotal().toFixed(2)}`;
  }

  // Method that returns 'this' for method chaining
  setCustomerId(customerId: string): this {
    this.customerId = customerId;
    return this;  // Returns the current instance
  }

  setDiscount(percentage: number): this {
    this.discountPercentage = percentage;
    return this;
  }
}

// Usage
const cart = new ShoppingCart("CUST001");
cart.addItem("P001", "Laptop", 999.99, 1);
cart.addItem("P002", "Mouse", 29.99, 2);
cart.applyDiscount(10);
console.log(cart.getCartSummary());
// Cart for Customer CUST001: 2 unique items, Total: $944.99

// Method chaining using 'this'
const cart2 = new ShoppingCart("CUST002")
  .setCustomerId("CUST003")
  .setDiscount(15);
```

```python
# Python - Shopping Cart System
class ShoppingCart:
    def __init__(self, customer_id: str):
        self.customer_id = customer_id
        self.items = {}
        self.discount_percentage = 0
    
    def add_item(self, product_id: str, name: str, price: float, quantity: int) -> None:
        # 'self' refers to the current cart instance
        if product_id in self.items:
            self.items[product_id]['quantity'] += quantity
            print(f"Updated {name} quantity to {self.items[product_id]['quantity']}")
        else:
            self.items[product_id] = {'name': name, 'price': price, 'quantity': quantity}
            print(f"Added {name} to cart")
    
    def remove_item(self, product_id: str) -> None:
        if product_id in self.items:
            item = self.items[product_id]
            print(f"Removed {item['name']} from cart")
            del self.items[product_id]
    
    def apply_discount(self, percentage: float) -> None:
        self.discount_percentage = percentage
        print(f"{percentage}% discount applied to cart")
    
    def calculate_subtotal(self) -> float:
        subtotal = 0
        # 'self.items' refers to the items in THIS cart
        for item in self.items.values():
            subtotal += item['price'] * item['quantity']
        return subtotal
    
    def calculate_total(self) -> float:
        subtotal = self.calculate_subtotal()  # Calling another method using 'self'
        discount = subtotal * (self.discount_percentage / 100)
        return subtotal - discount
    
    def get_cart_summary(self) -> str:
        return f"Cart for Customer {self.customer_id}: {len(self.items)} unique items, Total: ${self.calculate_total():.2f}"
    
    # Method that returns 'self' for method chaining
    def set_customer_id(self, customer_id: str):
        self.customer_id = customer_id
        return self  # Returns the current instance
    
    def set_discount(self, percentage: float):
        self.discount_percentage = percentage
        return self

# Usage
cart = ShoppingCart("CUST001")
cart.add_item("P001", "Laptop", 999.99, 1)
cart.add_item("P002", "Mouse", 29.99, 2)
cart.apply_discount(10)
print(cart.get_cart_summary())
# Cart for Customer CUST001: 2 unique items, Total: $944.99

# Method chaining using 'self'
cart2 = ShoppingCart("CUST002").set_customer_id("CUST003").set_discount(15)
```

**Common Pitfall: Losing 'this' Context**

```typescript
class EventLogger {
  private logCount: number = 0;

  logEvent(message: string): void {
    this.logCount++;
    console.log(`[Log #${this.logCount}] ${message}`);
  }

  // Problem: 'this' context lost when passed as callback
  setupEventListener(): void {
    const button = { addEventListener: (event: string, handler: Function) => handler() };
    
    // ❌ This will cause error - 'this' is undefined
    // button.addEventListener("click", this.logEvent);
    
    // ✅ Solution 1: Arrow function
    button.addEventListener("click", (msg: string) => this.logEvent(msg));
    
    // ✅ Solution 2: Bind
    button.addEventListener("click", this.logEvent.bind(this));
  }

  // ✅ Solution 3: Arrow function method (preserves 'this')
  logEventArrow = (message: string): void => {
    this.logCount++;
    console.log(`[Log #${this.logCount}] ${message}`);
  }
}
```

</details>

---

## Practice Questions

<details>
<summary><strong>View Questions</strong></summary>

### Fill in the Blanks

1. A __________ is a blueprint for creating objects, while an __________ is an instance of that blueprint.

2. The __________ modifier makes a property accessible only within the class itself, while __________ makes it accessible in subclasses too.

3. __________ members belong to the class itself and are shared across all instances.

4. The __________ keyword refers to the current instance of a class.

5. A __________ is a special method that runs automatically when an object is created.

6. Properties represent an object's __________, while methods represent an object's __________.

<details>
<summary><strong>View Answers</strong></summary>

1. **class**, **object** - A class defines the structure, an object is a concrete instance with actual data.

2. **private**, **protected** - Private members are class-only, protected members extend to inheritance hierarchies.

3. **Static** - Static members exist at the class level, not the instance level, useful for shared data or utility functions.

4. **this** (TypeScript) or **self** (Python) - Refers to the current object instance, allowing access to its properties and methods.

5. **constructor** (TypeScript) or **__init__** (Python) - Initializes object state when instantiated.

6. **state**, **behavior** - Properties store data (state), methods define actions (behavior).

</details>

---

### True/False

1. ⬜ Static methods can access instance properties directly.

2. ⬜ In TypeScript, properties are public by default if no access modifier is specified.

3. ⬜ Python enforces private access modifiers at the language level.

4. ⬜ Multiple objects created from the same class share the same property values.

5. ⬜ A constructor must always accept parameters.

6. ⬜ The `this` keyword can be used to return the current instance for method chaining.

<details>
<summary><strong>View Answers</strong></summary>

1. **False** - Static methods belong to the class, not instances, so they cannot access instance properties (which require `this`/`self`). They can only access static members.

2. **True** - In TypeScript, if you don't specify an access modifier, members are public by default. In Python, all members are effectively public by default (with naming conventions for private/protected).

3. **False** - Python uses naming conventions (`_protected`, `__private`) but doesn't enforce them. The access is by convention, not strict enforcement. You can still access `__private` members using name mangling.

4. **False** - Each object has its own separate copy of instance properties. Objects are independent; changing one doesn't affect others. Only static members are shared.

5. **False** - Constructors can have default parameters or no parameters at all. For example: `constructor(name: string = "Guest")` or `constructor()` are both valid.

6. **True** - Returning `this` from a method allows method chaining: `obj.setName("Alice").setAge(30).save()`. This is a common pattern in fluent interfaces.

</details>

---

### Multiple Choice

1. **Which of the following best describes the purpose of access modifiers?**
   - A) To improve code performance
   - B) To control visibility and access to class members
   - C) To define the data type of properties
   - D) To enable inheritance

2. **What is the primary use case for static methods?**
   - A) Accessing instance-specific data
   - B) Utility functions that don't depend on instance state
   - C) Modifying object properties
   - D) Creating multiple instances

3. **In the following code, what will happen?**
   ```typescript
   class Counter {
     private count: number = 0;
     increment() { this.count++; }
   }
   const c = new Counter();
   console.log(c.count);
   ```
   - A) Prints 0
   - B) Prints 1
   - C) Compilation/runtime error
   - D) Prints undefined

4. **What is a getter method primarily used for?**
   - A) To set the value of a private property
   - B) To provide controlled read access to private properties
   - C) To create new instances
   - D) To delete properties

5. **When should you use a static property?**
   - A) When each instance needs its own copy
   - B) When the value should be shared across all instances
   - C) When the property is private
   - D) When implementing inheritance

<details>
<summary><strong>View Answers</strong></summary>

1. **B** - Access modifiers (public, private, protected) control which parts of the code can access class members, implementing encapsulation and data hiding.

2. **B** - Static methods are ideal for utility functions, factory methods, and operations that don't require instance data. Examples: `Math.abs()`, `Array.from()`, or configuration managers.

3. **C** - The `count` property is private, so accessing it directly with `c.count` causes a compilation error in TypeScript (or should raise concerns in Python's convention-based system).

4. **B** - Getters provide controlled read access to private properties, often with additional logic like validation, formatting, or computed values. They look like property access but execute a method.

5. **B** - Static properties are shared across all instances. Common examples: counters tracking total instances created, shared configuration, constants, or singleton references.

</details>

---

### Code Challenges

**Challenge 1: Create a Library Book System**

Create a `Book` class with the following requirements:
- Properties: `isbn` (string), `title` (string), `author` (string), `available` (boolean)
- A static property `totalBooks` to track the total number of books created
- Constructor that initializes all properties and increments `totalBooks`
- Methods: 
  - `checkout()`: marks book as unavailable if available
  - `return()`: marks book as available
  - `getBookInfo()`: returns formatted string with book details
- A static method `getTotalBooks()` that returns the total count

<details>
<summary><strong>View Solution</strong></summary>

```typescript
// TypeScript Solution
class Book {
  private static totalBooks: number = 0;
  
  public isbn: string;
  public title: string;
  public author: string;
  private available: boolean;

  constructor(isbn: string, title: string, author: string) {
    this.isbn = isbn;
    this.title = title;
    this.author = author;
    this.available = true;
    Book.totalBooks++;
  }

  public checkout(): boolean {
    if (this.available) {
      this.available = false;
      console.log(`"${this.title}" has been checked out`);
      return true;
    }
    console.log(`"${this.title}" is not available`);
    return false;
  }

  public return(): void {
    this.available = true;
    console.log(`"${this.title}" has been returned`);
  }

  public getBookInfo(): string {
    const status = this.available ? "Available" : "Checked out";
    return `${this.title} by ${this.author} (ISBN: ${this.isbn}) - ${status}`;
  }

  public static getTotalBooks(): number {
    return Book.totalBooks;
  }

  public isAvailable(): boolean {
    return this.available;
  }
}

// Test the implementation
const book1 = new Book("978-0-13-468599-1", "Clean Code", "Robert Martin");
const book2 = new Book("978-0-13-235088-4", "Clean Architecture", "Robert Martin");

console.log(book1.getBookInfo());
book1.checkout();
console.log(book1.getBookInfo());
book1.return();
console.log(`Total books in library: ${Book.getTotalBooks()}`);
```

```python
# Python Solution
class Book:
    total_books = 0
    
    def __init__(self, isbn: str, title: str, author: str):
        self.isbn = isbn
        self.title = title
        self.author = author
        self.__available = True
        Book.total_books += 1
    
    def checkout(self) -> bool:
        if self.__available:
            self.__available = False
            print(f'"{self.title}" has been checked out')
            return True
        print(f'"{self.title}" is not available')
        return False
    
    def return_book(self) -> None:
        self.__available = True
        print(f'"{self.title}" has been returned')
    
    def get_book_info(self) -> str:
        status = "Available" if self.__available else "Checked out"
        return f"{self.title} by {self.author} (ISBN: {self.isbn}) - {status}"
    
    @staticmethod
    def get_total_books() -> int:
        return Book.total_books
    
    def is_available(self) -> bool:
        return self.__available

# Test the implementation
book1 = Book("978-0-13-468599-1", "Clean Code", "Robert Martin")
book2 = Book("978-0-13-235088-4", "Clean Architecture", "Robert Martin")

print(book1.get_book_info())
book1.checkout()
print(book1.get_book_info())
book1.return_book()
print(f"Total books in library: {Book.get_total_books()}")
```

</details>

---

**Challenge 2: Temperature Converter**

Create a `Temperature` class that:
- Has a private property `celsius`
- Constructor accepts temperature in Celsius
- Has getters for `fahrenheit` and `kelvin` (computed properties)
- Has a setter for `celsius` with validation (must be >= -273.15, absolute zero)
- Has a method `getTemperatureInfo()` that returns all three formats

<details>
<summary><strong>View Solution</strong></summary>

```typescript
// TypeScript Solution
class Temperature {
  private _celsius: number;
  private static readonly ABSOLUTE_ZERO = -273.15;

  constructor(celsius: number) {
    if (celsius < Temperature.ABSOLUTE_ZERO) {
      throw new Error(`Temperature cannot be below absolute zero (${Temperature.ABSOLUTE_ZERO}°C)`);
    }
    this._celsius = celsius;
  }

  get celsius(): number {
    return this._celsius;
  }

  set celsius(value: number) {
    if (value < Temperature.ABSOLUTE_ZERO) {
      throw new Error(`Temperature cannot be below absolute zero (${Temperature.ABSOLUTE_ZERO}°C)`);
    }
    this._celsius = value;
  }

  get fahrenheit(): number {
    return (this._celsius * 9/5) + 32;
  }

  get kelvin(): number {
    return this._celsius + 273.15;
  }

  getTemperatureInfo(): string {
    return `${this._celsius.toFixed(2)}°C = ${this.fahrenheit.toFixed(2)}°F = ${this.kelvin.toFixed(2)}K`;
  }
}

// Test
const temp = new Temperature(25);
console.log(temp.getTemperatureInfo()); // 25.00°C = 77.00°F = 298.15K
temp.celsius = 100;
console.log(temp.getTemperatureInfo()); // 100.00°C = 212.00°F = 373.15K
// temp.celsius = -300; // Error: Temperature cannot be below absolute zero
```

```python
# Python Solution
class Temperature:
    ABSOLUTE_ZERO = -273.15
    
    def __init__(self, celsius: float):
        if celsius < Temperature.ABSOLUTE_ZERO:
            raise ValueError(f"Temperature cannot be below absolute zero ({Temperature.ABSOLUTE_ZERO}°C)")
        self._celsius = celsius
    
    @property
    def celsius(self) -> float:
        return self._celsius
    
    @celsius.setter
    def celsius(self, value: float) -> None:
        if value < Temperature.ABSOLUTE_ZERO:
            raise ValueError(f"Temperature cannot be below absolute zero ({Temperature.ABSOLUTE_ZERO}°C)")
        self._celsius = value
    
    @property
    def fahrenheit(self) -> float:
        return (self._celsius * 9/5) + 32
    
    @property
    def kelvin(self) -> float:
        return self._celsius + 273.15
    
    def get_temperature_info(self) -> str:
        return f"{self._celsius:.2f}°C = {self.fahrenheit:.2f}°F = {self.kelvin:.2f}K"

# Test
temp = Temperature(25)
print(temp.get_temperature_info())  # 25.00°C = 77.00°F = 298.15K
temp.celsius = 100
print(temp.get_temperature_info())  # 100.00°C = 212.00°F = 373.15K
# temp.celsius = -300  # ValueError: Temperature cannot be below absolute zero
```

</details>

</details>

---

## Additional Resources

For deeper understanding of specific topics:

- **TypeScript Official Documentation:** [Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)
- **Python Official Documentation:** [Classes](https://docs.python.org/3/tutorial/classes.html)
- **Advanced Class Patterns:** [TypeScript Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)
- **Property Descriptors:** [MDN - Object.defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

---

This completes **Chapter 1: OOP Fundamentals**. You now understand classes, objects, properties, methods, constructors, access modifiers, static members, and the `this` keyword - the building blocks of object-oriented programming.