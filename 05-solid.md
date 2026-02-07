# Chapter 5: SOLID Principles

SOLID is an acronym for five design principles that make software designs more understandable, flexible, and maintainable. These principles were introduced by Robert C. Martin (Uncle Bob) and are fundamental to object-oriented design.

**SOLID stands for:**
- **S**ingle Responsibility Principle
- **O**pen/Closed Principle
- **L**iskov Substitution Principle
- **I**nterface Segregation Principle
- **D**ependency Inversion Principle

---

## Table of Contents

- [How SOLID Principles Work Together](#how-solid-principles-work-together)
- [Single Responsibility Principle (SRP)](#1-single-responsibility-principle-srp)
- [Open/Closed Principle (OCP)](#2-openclosed-principle-ocp)
- [Liskov Substitution Principle (LSP)](#3-liskov-substitution-principle-lsp)
- [Interface Segregation Principle (ISP)]()
- [Dependency Inversion Principle (DIP)]()

---

## How SOLID Principles Work Together

Think of SOLID principles as a **toolbox** - each tool serves a specific purpose:

### 🔧 Single Responsibility Principle (SRP)
**"One class, one job"**

Keeps classes focused and manageable.

```python
# Each class has ONE reason to change
class User: pass              # Changes when user data structure changes
class UserRepository: pass    # Changes when database changes
class EmailService: pass      # Changes when email provider changes
```

### 🔧 Open/Closed Principle (OCP)
**"Open for extension, closed for modification"**

Add new features without changing existing code.

```python
# Add new payment methods without modifying existing code
class PaymentProcessor:
    def process(self, payment_method, amount):
        return payment_method.pay(amount)

# Just add new class - no modifications needed
class BitcoinPayment(PaymentMethod):
    def pay(self, amount):
        return f"Paying {amount} via Bitcoin"
```

### 🔧 Liskov Substitution Principle (LSP)
**"Subtypes must work where parent types work"**

Ensures inheritance is used correctly.

```python
# Any Bird should work where Bird is expected
def make_bird_fly(bird: Bird):
    bird.fly()

make_bird_fly(Sparrow())  # ✅ Works
make_bird_fly(Eagle())    # ✅ Works
make_bird_fly(Penguin())  # ❌ Breaks! Penguins can't fly
```

### 🔧 Interface Segregation Principle (ISP)
**"Many small interfaces > one big interface"**

Clients shouldn't depend on methods they don't use.

```python
# Instead of one fat interface:
class Worker:
    def work(self): pass
    def eat(self): pass
    def sleep(self): pass

# Better: Multiple small interfaces
class Workable:
    def work(self): pass

class Eatable:
    def eat(self): pass

class Human(Workable, Eatable): pass
class Robot(Workable): pass  # Robots don't eat
```

### 🔧 Dependency Inversion Principle (DIP)
**"Depend on abstractions (interfaces, abstract classes, etc), not on concretions (specific implementations)"**

High-level modules shouldn't depend on low-level modules.

```python
# Depend on abstraction (Database), not concrete implementation (MySQL)
class UserService:
    def __init__(self, database: Database):  # Abstract interface
        self.db = database
    
    def save_user(self, user):
        self.db.save(user)

# Easy to swap implementations
service = UserService(PostgreSQLDatabase())  # or
service = UserService(MongoDBDatabase())     # or
service = UserService(InMemoryDatabase())    # All work!
```

---

## 1. Single Responsibility Principle (SRP)

**Definition**: A class should have only one reason to change, meaning it should have only one job or responsibility.

**Real-world analogy**: Think of a restaurant. The chef cooks, the waiter serves, the cashier handles payments. Each person has one clear responsibility. You wouldn't want the chef to also handle money and serve tables - that would be confusing and error-prone.

### Why SRP Matters:

- **Easier to understand**: Clear, focused classes
- **Easier to test**: Single responsibility = simpler tests
- **Easier to maintain**: Changes affect only one area
- **Reduces coupling**: Classes don't depend on unrelated functionality

### Identifying Violations:

Ask: "What is the responsibility of this class?" If you use "and" in your answer, you likely have multiple responsibilities.

<details>
<summary><strong>View Examples</strong></summary>

```typescript
// TypeScript - Single Responsibility Principle

// ============================================
// BAD Example: Multiple Responsibilities
// ============================================

class UserBad {
  constructor(
    public userId: string,
    public username: string,
    public email: string,
    public password: string
  ) {}

  // Responsibility 1: User data management
  updateEmail(newEmail: string): void {
    this.email = newEmail;
  }

  // Responsibility 2: Password validation
  validatePassword(password: string): boolean {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const isLongEnough = password.length >= 8;
    return hasUpperCase && hasLowerCase && hasNumber && isLongEnough;
  }

  // Responsibility 3: Password hashing
  hashPassword(password: string): string {
    // Simplified - in reality use bcrypt
    return `hashed_${password}`;
  }

  // Responsibility 4: Database operations
  save(): void {
    console.log(`Saving user ${this.username} to database...`);
    // Database logic here
  }

  // Responsibility 5: Email sending
  sendWelcomeEmail(): void {
    console.log(`Sending welcome email to ${this.email}...`);
    // Email sending logic here
  }

  // Responsibility 6: Logging
  logActivity(activity: string): void {
    console.log(`[${new Date().toISOString()}] User ${this.username}: ${activity}`);
  }
}

// Problems:
// 1. Changes to email system affect User class
// 2. Changes to database affect User class
// 3. Changes to password validation affect User class
// 4. Hard to test individual responsibilities
// 5. User class knows too much

// ============================================
// GOOD Example: Single Responsibility
// ============================================

// Responsibility 1: User data only
class User {
  constructor(
    public userId: string,
    public username: string,
    public email: string,
    private passwordHash: string
  ) {}

  updateEmail(newEmail: string): void {
    this.email = newEmail;
  }

  getPasswordHash(): string {
    return this.passwordHash;
  }

  setPasswordHash(hash: string): void {
    this.passwordHash = hash;
  }
}

// Responsibility 2: Password operations
class PasswordService {
  validate(password: string): boolean {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const isLongEnough = password.length >= 8;
    
    return hasUpperCase && hasLowerCase && hasNumber && isLongEnough;
  }

  hash(password: string): string {
    // In reality, use bcrypt or similar
    return `hashed_${password}`;
  }

  verify(password: string, hash: string): boolean {
    return this.hash(password) === hash;
  }
}

// Responsibility 3: Database operations
class UserRepository {
  private users: Map<string, User> = new Map();

  save(user: User): void {
    this.users.set(user.userId, user);
    console.log(`User ${user.username} saved to database`);
  }

  findById(userId: string): User | undefined {
    return this.users.get(userId);
  }

  findByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find(u => u.email === email);
  }

  delete(userId: string): void {
    this.users.delete(userId);
    console.log(`User ${userId} deleted from database`);
  }
}

// Responsibility 4: Email operations
class EmailService {
  sendWelcomeEmail(email: string, username: string): void {
    console.log(`\n📧 Sending welcome email to ${email}`);
    console.log(`Subject: Welcome ${username}!`);
    console.log(`Body: Thanks for joining our platform...`);
  }

  sendPasswordResetEmail(email: string, resetToken: string): void {
    console.log(`\n📧 Sending password reset email to ${email}`);
    console.log(`Reset token: ${resetToken}`);
  }

  sendNotification(email: string, message: string): void {
    console.log(`\n📧 Notification to ${email}: ${message}`);
  }
}

// Responsibility 5: Logging operations
class Logger {
  log(level: string, message: string): void {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level}] ${message}`);
  }

  info(message: string): void {
    this.log("INFO", message);
  }

  error(message: string): void {
    this.log("ERROR", message);
  }

  warn(message: string): void {
    this.log("WARN", message);
  }
}

// Coordinating service (this is allowed - its responsibility IS coordination)
class UserService {
  constructor(
    private userRepository: UserRepository,
    private passwordService: PasswordService,
    private emailService: EmailService,
    private logger: Logger
  ) {}

  registerUser(username: string, email: string, password: string): User | null {
    this.logger.info(`Attempting to register user: ${username}`);

    // Validate password
    if (!this.passwordService.validate(password)) {
      this.logger.error("Password validation failed");
      console.log("❌ Password does not meet requirements");
      return null;
    }

    // Hash password
    const passwordHash = this.passwordService.hash(password);

    // Create user
    const user = new User(
      `USER_${Date.now()}`,
      username,
      email,
      passwordHash
    );

    // Save to database
    this.userRepository.save(user);

    // Send welcome email
    this.emailService.sendWelcomeEmail(email, username);

    this.logger.info(`User ${username} registered successfully`);
    return user;
  }

  changePassword(userId: string, oldPassword: string, newPassword: string): boolean {
    const user = this.userRepository.findById(userId);
    if (!user) {
      this.logger.error(`User ${userId} not found`);
      return false;
    }

    // Verify old password
    if (!this.passwordService.verify(oldPassword, user.getPasswordHash())) {
      this.logger.warn(`Invalid password attempt for user ${userId}`);
      return false;
    }

    // Validate new password
    if (!this.passwordService.validate(newPassword)) {
      this.logger.error("New password validation failed");
      return false;
    }

    // Update password
    const newHash = this.passwordService.hash(newPassword);
    user.setPasswordHash(newHash);
    this.userRepository.save(user);

    this.logger.info(`Password changed for user ${userId}`);
    return true;
  }
}

// Usage
console.log("=== Single Responsibility Principle ===\n");

const userRepo = new UserRepository();
const passwordService = new PasswordService();
const emailService = new EmailService();
const logger = new Logger();

const userService = new UserService(userRepo, passwordService, emailService, logger);

// Register a user
const user = userService.registerUser("john_doe", "john@example.com", "SecurePass123");

if (user) {
  console.log(`\n✓ User created: ${user.username} (${user.email})`);
  
  // Change password
  console.log("\n--- Changing password ---");
  userService.changePassword(user.userId, "SecurePass123", "NewSecure456");
}

// ============================================
// Real-World Example: E-commerce Order
// ============================================

// BAD: Order class with too many responsibilities
class OrderBad {
  calculateTotal(): number { /* ... */ return 0; }
  applyDiscount(): void { /* ... */ }
  saveToDatabase(): void { /* ... */ }
  sendConfirmationEmail(): void { /* ... */ }
  generateInvoicePDF(): void { /* ... */ }
  chargePaymentMethod(): boolean { /* ... */ return false; }
  updateInventory(): void { /* ... */ }
  calculateShipping(): number { /* ... */ return 0; }
}

// GOOD: Separated responsibilities

class Order {
  constructor(
    public orderId: string,
    public customerId: string,
    public items: OrderItem[],
    public status: string
  ) {}

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}

class OrderItem {
  constructor(
    public productId: string,
    public name: string,
    public price: number,
    public quantity: number
  ) {}
}

class OrderRepository {
  save(order: Order): void {
    console.log(`Saving order ${order.orderId} to database`);
  }

  findById(orderId: string): Order | undefined {
    return undefined;
  }
}

class DiscountService {
  applyDiscount(order: Order, discountCode: string): number {
    console.log(`Applying discount code: ${discountCode}`);
    // Discount logic
    return order.getTotal() * 0.9; // 10% off
  }
}

class PaymentProcessor {
  processPayment(order: Order, paymentMethod: string): boolean {
    console.log(`Processing payment for order ${order.orderId}`);
    // Payment processing logic
    return true;
  }
}

class InventoryService {
  updateStock(order: Order): void {
    console.log(`Updating inventory for order ${order.orderId}`);
    order.items.forEach(item => {
      console.log(`  - Reducing stock for ${item.name} by ${item.quantity}`);
    });
  }
}

class OrderNotificationService {
  sendConfirmation(order: Order, customerEmail: string): void {
    console.log(`📧 Sending order confirmation to ${customerEmail}`);
    console.log(`Order ${order.orderId} - Total: $${order.getTotal()}`);
  }
}

class InvoiceGenerator {
  generatePDF(order: Order): string {
    console.log(`Generating invoice PDF for order ${order.orderId}`);
    return `invoice_${order.orderId}.pdf`;
  }
}

class ShippingCalculator {
  calculateShipping(order: Order, destination: string): number {
    console.log(`Calculating shipping to ${destination}`);
    // Shipping calculation logic
    return 10.00;
  }
}

// Orchestrator
class OrderProcessingService {
  constructor(
    private orderRepo: OrderRepository,
    private discountService: DiscountService,
    private paymentProcessor: PaymentProcessor,
    private inventoryService: InventoryService,
    private notificationService: OrderNotificationService,
    private invoiceGenerator: InvoiceGenerator
  ) {}

  processOrder(order: Order, customerEmail: string, discountCode?: string): boolean {
    console.log(`\n=== Processing Order ${order.orderId} ===`);

    // Apply discount
    let total = order.getTotal();
    if (discountCode) {
      total = this.discountService.applyDiscount(order, discountCode);
    }

    // Process payment
    if (!this.paymentProcessor.processPayment(order, "credit_card")) {
      console.log("❌ Payment failed");
      return false;
    }

    // Update inventory
    this.inventoryService.updateStock(order);

    // Save order
    this.orderRepo.save(order);

    // Send notification
    this.notificationService.sendConfirmation(order, customerEmail);

    // Generate invoice
    this.invoiceGenerator.generatePDF(order);

    console.log("✓ Order processed successfully");
    return true;
  }
}

// Usage
console.log("\n=== E-commerce Order Processing ===");

const order = new Order(
  "ORD001",
  "CUST123",
  [
    new OrderItem("PROD001", "Laptop", 999.99, 1),
    new OrderItem("PROD002", "Mouse", 29.99, 2)
  ],
  "pending"
);

const orderProcessing = new OrderProcessingService(
  new OrderRepository(),
  new DiscountService(),
  new PaymentProcessor(),
  new InventoryService(),
  new OrderNotificationService(),
  new InvoiceGenerator()
);

orderProcessing.processOrder(order, "customer@example.com", "SAVE10");
```

```python
# Python - Single Responsibility Principle

from typing import Optional, Dict, List
from datetime import datetime

# ============================================
# BAD Example: Multiple Responsibilities
# ============================================

class UserBad:
    def __init__(self, user_id: str, username: str, email: str, password: str):
        self.user_id = user_id
        self.username = username
        self.email = email
        self.password = password
    
    # Multiple responsibilities in one class - BAD!
    def update_email(self, new_email: str) -> None:
        self.email = new_email
    
    def validate_password(self, password: str) -> bool:
        # Password validation logic
        return len(password) >= 8
    
    def hash_password(self, password: str) -> str:
        return f"hashed_{password}"
    
    def save(self) -> None:
        print(f"Saving user {self.username} to database...")
    
    def send_welcome_email(self) -> None:
        print(f"Sending welcome email to {self.email}...")
    
    def log_activity(self, activity: str) -> None:
        print(f"[{datetime.now().isoformat()}] User {self.username}: {activity}")

# ============================================
# GOOD Example: Single Responsibility
# ============================================

class User:
    """Responsibility: User data only"""
    
    def __init__(self, user_id: str, username: str, email: str, password_hash: str):
        self.user_id = user_id
        self.username = username
        self.email = email
        self._password_hash = password_hash
    
    def update_email(self, new_email: str) -> None:
        self.email = new_email
    
    def get_password_hash(self) -> str:
        return self._password_hash
    
    def set_password_hash(self, hash: str) -> None:
        self._password_hash = hash

class PasswordService:
    """Responsibility: Password operations"""
    
    def validate(self, password: str) -> bool:
        has_upper = any(c.isupper() for c in password)
        has_lower = any(c.islower() for c in password)
        has_digit = any(c.isdigit() for c in password)
        is_long_enough = len(password) >= 8
        
        return has_upper and has_lower and has_digit and is_long_enough
    
    def hash(self, password: str) -> str:
        # In reality, use bcrypt
        return f"hashed_{password}"
    
    def verify(self, password: str, hash: str) -> bool:
        return self.hash(password) == hash

class UserRepository:
    """Responsibility: Database operations"""
    
    def __init__(self):
        self._users: Dict[str, User] = {}
    
    def save(self, user: User) -> None:
        self._users[user.user_id] = user
        print(f"User {user.username} saved to database")
    
    def find_by_id(self, user_id: str) -> Optional[User]:
        return self._users.get(user_id)
    
    def find_by_email(self, email: str) -> Optional[User]:
        for user in self._users.values():
            if user.email == email:
                return user
        return None
    
    def delete(self, user_id: str) -> None:
        if user_id in self._users:
            del self._users[user_id]
            print(f"User {user_id} deleted from database")

class EmailService:
    """Responsibility: Email operations"""
    
    def send_welcome_email(self, email: str, username: str) -> None:
        print(f"\n📧 Sending welcome email to {email}")
        print(f"Subject: Welcome {username}!")
        print("Body: Thanks for joining our platform...")
    
    def send_password_reset_email(self, email: str, reset_token: str) -> None:
        print(f"\n📧 Sending password reset email to {email}")
        print(f"Reset token: {reset_token}")
    
    def send_notification(self, email: str, message: str) -> None:
        print(f"\n📧 Notification to {email}: {message}")

class Logger:
    """Responsibility: Logging operations"""
    
    def log(self, level: str, message: str) -> None:
        timestamp = datetime.now().isoformat()
        print(f"[{timestamp}] [{level}] {message}")
    
    def info(self, message: str) -> None:
        self.log("INFO", message)
    
    def error(self, message: str) -> None:
        self.log("ERROR", message)
    
    def warn(self, message: str) -> None:
        self.log("WARN", message)

class UserService:
    """Responsibility: Coordinating user operations"""
    
    def __init__(self, user_repo: UserRepository, password_service: PasswordService,
                 email_service: EmailService, logger: Logger):
        self._user_repo = user_repo
        self._password_service = password_service
        self._email_service = email_service
        self._logger = logger
    
    def register_user(self, username: str, email: str, password: str) -> Optional[User]:
        self._logger.info(f"Attempting to register user: {username}")
        
        # Validate password
        if not self._password_service.validate(password):
            self._logger.error("Password validation failed")
            print("❌ Password does not meet requirements")
            return None
        
        # Hash password
        password_hash = self._password_service.hash(password)
        
        # Create user
        user = User(f"USER_{int(datetime.now().timestamp())}", username, email, password_hash)
        
        # Save to database
        self._user_repo.save(user)
        
        # Send welcome email
        self._email_service.send_welcome_email(email, username)
        
        self._logger.info(f"User {username} registered successfully")
        return user
    
    def change_password(self, user_id: str, old_password: str, new_password: str) -> bool:
        user = self._user_repo.find_by_id(user_id)
        if not user:
            self._logger.error(f"User {user_id} not found")
            return False
        
        # Verify old password
        if not self._password_service.verify(old_password, user.get_password_hash()):
            self._logger.warn(f"Invalid password attempt for user {user_id}")
            return False
        
        # Validate new password
        if not self._password_service.validate(new_password):
            self._logger.error("New password validation failed")
            return False
        
        # Update password
        new_hash = self._password_service.hash(new_password)
        user.set_password_hash(new_hash)
        self._user_repo.save(user)
        
        self._logger.info(f"Password changed for user {user_id}")
        return True

# Usage
print("=== Single Responsibility Principle ===\n")

user_repo = UserRepository()
password_service = PasswordService()
email_service = EmailService()
logger = Logger()

user_service = UserService(user_repo, password_service, email_service, logger)

# Register a user
user = user_service.register_user("john_doe", "john@example.com", "SecurePass123")

if user:
    print(f"\n✓ User created: {user.username} ({user.email})")
    
    # Change password
    print("\n--- Changing password ---")
    user_service.change_password(user.user_id, "SecurePass123", "NewSecure456")

# ============================================
# Real-World Example: E-commerce Order
# ============================================

class Order:
    """Responsibility: Order data"""
    
    def __init__(self, order_id: str, customer_id: str, items: List['OrderItem'], status: str):
        self.order_id = order_id
        self.customer_id = customer_id
        self.items = items
        self.status = status
    
    def get_total(self) -> float:
        return sum(item.price * item.quantity for item in self.items)

class OrderItem:
    def __init__(self, product_id: str, name: str, price: float, quantity: int):
        self.product_id = product_id
        self.name = name
        self.price = price
        self.quantity = quantity

class OrderRepository:
    """Responsibility: Database operations"""
    
    def save(self, order: Order) -> None:
        print(f"Saving order {order.order_id} to database")

class DiscountService:
    """Responsibility: Discount calculations"""
    
    def apply_discount(self, order: Order, discount_code: str) -> float:
        print(f"Applying discount code: {discount_code}")
        return order.get_total() * 0.9  # 10% off

class PaymentProcessor:
    """Responsibility: Payment processing"""
    
    def process_payment(self, order: Order, payment_method: str) -> bool:
        print(f"Processing payment for order {order.order_id}")
        return True

class InventoryService:
    """Responsibility: Inventory management"""
    
    def update_stock(self, order: Order) -> None:
        print(f"Updating inventory for order {order.order_id}")
        for item in order.items:
            print(f"  - Reducing stock for {item.name} by {item.quantity}")

class OrderNotificationService:
    """Responsibility: Order notifications"""
    
    def send_confirmation(self, order: Order, customer_email: str) -> None:
        print(f"📧 Sending order confirmation to {customer_email}")
        print(f"Order {order.order_id} - Total: ${order.get_total()}")

class InvoiceGenerator:
    """Responsibility: Invoice generation"""
    
    def generate_pdf(self, order: Order) -> str:
        print(f"Generating invoice PDF for order {order.order_id}")
        return f"invoice_{order.order_id}.pdf"

class OrderProcessingService:
    """Responsibility: Orchestrating order processing"""
    
    def __init__(self, order_repo: OrderRepository, discount_service: DiscountService,
                 payment_processor: PaymentProcessor, inventory_service: InventoryService,
                 notification_service: OrderNotificationService, invoice_generator: InvoiceGenerator):
        self._order_repo = order_repo
        self._discount_service = discount_service
        self._payment_processor = payment_processor
        self._inventory_service = inventory_service
        self._notification_service = notification_service
        self._invoice_generator = invoice_generator
    
    def process_order(self, order: Order, customer_email: str, discount_code: Optional[str] = None) -> bool:
        print(f"\n=== Processing Order {order.order_id} ===")
        
        # Apply discount
        total = order.get_total()
        if discount_code:
            total = self._discount_service.apply_discount(order, discount_code)
        
        # Process payment
        if not self._payment_processor.process_payment(order, "credit_card"):
            print("❌ Payment failed")
            return False
        
        # Update inventory
        self._inventory_service.update_stock(order)
        
        # Save order
        self._order_repo.save(order)
        
        # Send notification
        self._notification_service.send_confirmation(order, customer_email)
        
        # Generate invoice
        self._invoice_generator.generate_pdf(order)
        
        print("✓ Order processed successfully")
        return True

# Usage
print("\n=== E-commerce Order Processing ===")

order = Order(
    "ORD001",
    "CUST123",
    [
        OrderItem("PROD001", "Laptop", 999.99, 1),
        OrderItem("PROD002", "Mouse", 29.99, 2)
    ],
    "pending"
)

order_processing = OrderProcessingService(
    OrderRepository(),
    DiscountService(),
    PaymentProcessor(),
    InventoryService(),
    OrderNotificationService(),
    InvoiceGenerator()
)

order_processing.process_order(order, "customer@example.com", "SAVE10")
```

</details>

---

## Practice Questions - Part 1

<details>
<summary><strong>View Questions</strong></summary>

### Fill in the Blanks

1. The Single Responsibility Principle states that a class should have only one __________ to change.

2. If you can use the word "and" when describing what a class does, it likely violates __________.

3. SRP makes classes easier to __________, __________, and __________.

4. A class that handles user data, validates passwords, sends emails, and saves to database has __________ responsibilities.

<details>
<summary><strong>View Answers</strong></summary>

1. **reason** - A class should have only one reason to change, meaning only one responsibility or job. If database logic changes, only the repository should change, not the User class.

2. **SRP (Single Responsibility Principle)** - "This class manages users AND sends emails AND validates passwords" = too many responsibilities.

3. **understand**, **test**, **maintain** (any order) - Single responsibility = focused, clear code that's simple to comprehend, easy to write tests for, and straightforward to modify.

4. **four** (or **multiple**) - User data management, password validation, email sending, and database operations are four distinct responsibilities that should be separated.

</details>

---

### True/False

1. ⬜ A class with 1000 lines of code automatically violates SRP.

2. ⬜ Orchestrator classes that coordinate multiple services violate SRP.

3. ⬜ SRP means each class should have exactly one method.

4. ⬜ Separating responsibilities into different classes increases coupling.

5. ⬜ A UserService that coordinates UserRepository, PasswordService, and EmailService violates SRP.

<details>
<summary><strong>View Answers</strong></summary>

1. **False** - SRP is about responsibility, not lines of code. A class with 1000 lines that does ONE thing well doesn't violate SRP. However, large classes often DO have multiple responsibilities and should be examined carefully.

2. **False** - Orchestrator/coordinator classes are fine - their single responsibility IS coordination. UserService's job is coordinating user operations. That's one responsibility. It delegates specific tasks to specialized services.

3. **False** - SRP is about having one responsibility, not one method. A User class can have getters, setters, and business logic methods - as long as they all relate to user data management.

4. **False** - SRP actually reduces coupling. Each class depends only on what it needs. Changes to email logic don't affect database code because they're separate classes.

5. **False** - UserService's single responsibility is orchestrating user-related operations. It correctly delegates specific tasks (password hashing, email sending, data persistence) to specialized services.

</details>

---

### Multiple Choice

1. **Which class violates SRP?**
   - A) A User class with properties and getters/setters
   - B) A UserRepository that saves and loads users from database
   - C) A User class that validates passwords, sends emails, and saves to database
   - D) A PasswordService that validates and hashes passwords

2. **What is the main benefit of SRP?**
   - A) Faster code execution
   - B) Less memory usage
   - C) Easier to change one aspect without affecting others
   - D) Fewer total classes

3. **Which statement about SRP is correct?**
   - A) Every class should have exactly one public method
   - B) A class should have multiple small responsibilities rather than one large one
   - C) A class should have only one reason to change
   - D) SRP only applies to large projects

<details>
<summary><strong>View Answers</strong></summary>

1. **C** - This User class has three distinct responsibilities: password validation (security concern), email sending (notification concern), and database operations (persistence concern). Each should be a separate class. A and D have single responsibilities, B's repository pattern is a single responsibility (data access).

2. **C** - SRP's main benefit is localized change. When email logic changes, only EmailService changes. When password rules change, only PasswordService changes. Changes don't ripple through the codebase.

3. **C** - This is the definition of SRP. A class should have only one reason to change = one responsibility. It can have multiple methods as long as they all serve that single responsibility.

</details>

</details>

---

## 2. Open/Closed Principle (OCP)

**Definition**: Software entities (classes, modules, functions) should be **open for extension** but **closed for modification**.

**Real-world analogy**: Think of a smartphone. You can extend its functionality by installing new apps (open for extension), but you don't need to modify the phone's core operating system to add features (closed for modification). The plugin architecture allows new capabilities without changing existing code.

### What This Means:

- **Open for extension**: You can add new functionality
- **Closed for modification**: You don't change existing, working code
- **How**: Use abstraction (interfaces, abstract classes) and polymorphism

### Why OCP Matters:

- **Reduces bugs**: Don't touch working code
- **Easier testing**: New features don't require retesting old code
- **Better maintainability**: Changes are isolated
- **Promotes loose coupling**: Code depends on abstractions

### Common Approaches:

1. **Strategy Pattern**: Different algorithms behind a common interface
2. **Template Method**: Define skeleton, let subclasses fill in details
3. **Plugins/Extensions**: Load new functionality dynamically

<details>
<summary><strong>View Examples</strong></summary>

```typescript
// TypeScript - Open/Closed Principle

// ============================================
// BAD Example: Violating OCP
// ============================================

class AreaCalculatorBad {
  calculateArea(shapes: any[]): number {
    let totalArea = 0;

    for (const shape of shapes) {
      // Every time we add a new shape, we must MODIFY this class
      if (shape.type === "circle") {
        totalArea += Math.PI * shape.radius * shape.radius;
      } else if (shape.type === "rectangle") {
        totalArea += shape.width * shape.height;
      } else if (shape.type === "triangle") {
        totalArea += (shape.base * shape.height) / 2;
      }
      // What if we add pentagon, hexagon, etc.? We keep modifying this code!
    }

    return totalArea;
  }
}

// Problems:
// 1. Adding new shape requires modifying AreaCalculator
// 2. Risk of breaking existing functionality
// 3. Violates Open/Closed Principle

// ============================================
// GOOD Example: Following OCP
// ============================================

// Abstract interface - shapes must implement this
interface Shape {
  calculateArea(): number;
  getShapeInfo(): string;
}

// Each shape knows how to calculate its own area
class Circle implements Shape {
  constructor(private radius: number) {}

  calculateArea(): number {
    return Math.PI * this.radius * this.radius;
  }

  getShapeInfo(): string {
    return `Circle with radius ${this.radius}`;
  }
}

class Rectangle implements Shape {
  constructor(private width: number, private height: number) {}

  calculateArea(): number {
    return this.width * this.height;
  }

  getShapeInfo(): string {
    return `Rectangle ${this.width}x${this.height}`;
  }
}

class Triangle implements Shape {
  constructor(private base: number, private height: number) {}

  calculateArea(): number {
    return (this.base * this.height) / 2;
  }

  getShapeInfo(): string {
    return `Triangle with base ${this.base} and height ${this.height}`;
  }
}

// NEW shape - just add it, don't modify AreaCalculator!
class Pentagon implements Shape {
  constructor(private sideLength: number) {
    // Pentagon with equal sides
  }

  calculateArea(): number {
    // Formula for regular pentagon
    return (5 * this.sideLength * this.sideLength) / (4 * Math.tan(Math.PI / 5));
  }

  getShapeInfo(): string {
    return `Pentagon with side length ${this.sideLength}`;
  }
}

// This class is CLOSED for modification
class AreaCalculator {
  calculateTotalArea(shapes: Shape[]): number {
    return shapes.reduce((total, shape) => total + shape.calculateArea(), 0);
  }

  displayAreas(shapes: Shape[]): void {
    console.log("\n=== Shape Areas ===");
    shapes.forEach(shape => {
      console.log(`${shape.getShapeInfo()}: ${shape.calculateArea().toFixed(2)} sq units`);
    });
    console.log(`Total Area: ${this.calculateTotalArea(shapes).toFixed(2)} sq units`);
  }
}

// Usage
console.log("=== Open/Closed Principle - Shapes ===");

const shapes: Shape[] = [
  new Circle(5),
  new Rectangle(4, 6),
  new Triangle(3, 8),
  new Pentagon(4)  // New shape added without modifying AreaCalculator!
];

const calculator = new AreaCalculator();
calculator.displayAreas(shapes);

// ============================================
// Real-World Example: Report Generator
// ============================================

// BAD: Violates OCP
class ReportGeneratorBad {
  generate(data: any, format: string): string {
    // Every new format requires modifying this method
    if (format === "pdf") {
      return this.generatePDF(data);
    } else if (format === "html") {
      return this.generateHTML(data);
    } else if (format === "json") {
      return this.generateJSON(data);
    } else if (format === "xml") {
      return this.generateXML(data);
    }
    // Adding CSV, Excel, Markdown... keeps modifying this code
    return "";
  }

  private generatePDF(data: any): string { return "PDF content"; }
  private generateHTML(data: any): string { return "HTML content"; }
  private generateJSON(data: any): string { return "JSON content"; }
  private generateXML(data: any): string { return "XML content"; }
}

// GOOD: Follows OCP
interface ReportFormatter {
  format(data: ReportData): string;
  getFileExtension(): string;
}

class ReportData {
  constructor(
    public title: string,
    public author: string,
    public date: Date,
    public content: string,
    public sections: Array<{ heading: string; text: string }>
  ) {}
}

class PDFFormatter implements ReportFormatter {
  format(data: ReportData): string {
    let pdf = `%PDF-1.4\n`;
    pdf += `Title: ${data.title}\n`;
    pdf += `Author: ${data.author}\n`;
    pdf += `Date: ${data.date.toLocaleDateString()}\n\n`;
    pdf += `${data.content}\n\n`;
    data.sections.forEach(section => {
      pdf += `## ${section.heading}\n${section.text}\n\n`;
    });
    return pdf;
  }

  getFileExtension(): string {
    return "pdf";
  }
}

class HTMLFormatter implements ReportFormatter {
  format(data: ReportData): string {
    let html = `<!DOCTYPE html>\n<html>\n<head>\n`;
    html += `  <title>${data.title}</title>\n`;
    html += `</head>\n<body>\n`;
    html += `  <h1>${data.title}</h1>\n`;
    html += `  <p><strong>Author:</strong> ${data.author}</p>\n`;
    html += `  <p><strong>Date:</strong> ${data.date.toLocaleDateString()}</p>\n`;
    html += `  <p>${data.content}</p>\n`;
    data.sections.forEach(section => {
      html += `  <h2>${section.heading}</h2>\n`;
      html += `  <p>${section.text}</p>\n`;
    });
    html += `</body>\n</html>`;
    return html;
  }

  getFileExtension(): string {
    return "html";
  }
}

class JSONFormatter implements ReportFormatter {
  format(data: ReportData): string {
    return JSON.stringify({
      title: data.title,
      author: data.author,
      date: data.date.toISOString(),
      content: data.content,
      sections: data.sections
    }, null, 2);
  }

  getFileExtension(): string {
    return "json";
  }
}

class MarkdownFormatter implements ReportFormatter {
  format(data: ReportData): string {
    let md = `# ${data.title}\n\n`;
    md += `**Author:** ${data.author}\n\n`;
    md += `**Date:** ${data.date.toLocaleDateString()}\n\n`;
    md += `${data.content}\n\n`;
    data.sections.forEach(section => {
      md += `## ${section.heading}\n\n`;
      md += `${section.text}\n\n`;
    });
    return md;
  }

  getFileExtension(): string {
    return "md";
  }
}

// Report generator is CLOSED for modification
class ReportGenerator {
  generateReport(data: ReportData, formatter: ReportFormatter): string {
    console.log(`\nGenerating ${formatter.getFileExtension().toUpperCase()} report...`);
    const formatted = formatter.format(data);
    console.log(`Report generated: report.${formatter.getFileExtension()}`);
    return formatted;
  }

  // Can save to different formats without modifying this class
  saveReport(data: ReportData, formatter: ReportFormatter, filename: string): void {
    const content = this.generateReport(data, formatter);
    const fullFilename = `${filename}.${formatter.getFileExtension()}`;
    console.log(`Saving report as ${fullFilename}`);
    // In real app: save to file system
  }
}

// Usage
console.log("\n=== Open/Closed Principle - Report Generator ===");

const reportData = new ReportData(
  "Q4 Financial Report",
  "Finance Team",
  new Date(),
  "This report summarizes our Q4 financial performance.",
  [
    { heading: "Revenue", text: "Revenue increased by 15% compared to Q3." },
    { heading: "Expenses", text: "Operating expenses decreased by 5%." },
    { heading: "Profit", text: "Net profit margin improved to 22%." }
  ]
);

const generator = new ReportGenerator();

// Generate in different formats - no modification needed!
generator.saveReport(reportData, new PDFFormatter(), "q4_report");
generator.saveReport(reportData, new HTMLFormatter(), "q4_report");
generator.saveReport(reportData, new JSONFormatter(), "q4_report");
generator.saveReport(reportData, new MarkdownFormatter(), "q4_report");

// Adding new format is easy - just create new formatter class!

// ============================================
// Real-World Example: Discount System
// ============================================

interface DiscountStrategy {
  calculateDiscount(originalPrice: number): number;
  getDescription(): string;
}

class NoDiscount implements DiscountStrategy {
  calculateDiscount(originalPrice: number): number {
    return originalPrice;
  }

  getDescription(): string {
    return "No discount";
  }
}

class PercentageDiscount implements DiscountStrategy {
  constructor(private percentage: number) {}

  calculateDiscount(originalPrice: number): number {
    return originalPrice * (1 - this.percentage / 100);
  }

  getDescription(): string {
    return `${this.percentage}% off`;
  }
}

class FixedAmountDiscount implements DiscountStrategy {
  constructor(private amount: number) {}

  calculateDiscount(originalPrice: number): number {
    return Math.max(0, originalPrice - this.amount);
  }

  getDescription(): string {
    return `$${this.amount} off`;
  }
}

class BuyOneGetOneDiscount implements DiscountStrategy {
  calculateDiscount(originalPrice: number): number {
    return originalPrice / 2; // 50% off for BOGO
  }

  getDescription(): string {
    return "Buy One Get One Free";
  }
}

// NEW: Seasonal discount - added without modifying existing code
class SeasonalDiscount implements DiscountStrategy {
  constructor(private season: string, private percentage: number) {}

  calculateDiscount(originalPrice: number): number {
    const currentMonth = new Date().getMonth();
    
    // Only apply discount during specific season
    if (this.season === "summer" && currentMonth >= 5 && currentMonth <= 7) {
      return originalPrice * (1 - this.percentage / 100);
    } else if (this.season === "winter" && (currentMonth >= 11 || currentMonth <= 1)) {
      return originalPrice * (1 - this.percentage / 100);
    }
    
    return originalPrice;
  }

  getDescription(): string {
    return `${this.season} sale: ${this.percentage}% off`;
  }
}

// Pricing engine is CLOSED for modification
class PricingEngine {
  calculateFinalPrice(originalPrice: number, discount: DiscountStrategy): number {
    return discount.calculateDiscount(originalPrice);
  }

  displayPrice(productName: string, originalPrice: number, discount: DiscountStrategy): void {
    const finalPrice = this.calculateFinalPrice(originalPrice, discount);
    const savings = originalPrice - finalPrice;
    
    console.log(`\n${productName}:`);
    console.log(`  Original: $${originalPrice.toFixed(2)}`);
    console.log(`  Discount: ${discount.getDescription()}`);
    console.log(`  Final Price: $${finalPrice.toFixed(2)}`);
    if (savings > 0) {
      console.log(`  You save: $${savings.toFixed(2)}`);
    }
  }
}

// Usage
console.log("\n=== Open/Closed Principle - Pricing Engine ===");

const pricing = new PricingEngine();

pricing.displayPrice("Laptop", 999.99, new PercentageDiscount(15));
pricing.displayPrice("Headphones", 199.99, new FixedAmountDiscount(50));
pricing.displayPrice("Mouse", 29.99, new BuyOneGetOneDiscount());
pricing.displayPrice("Keyboard", 79.99, new SeasonalDiscount("summer", 20));
pricing.displayPrice("Monitor", 399.99, new NoDiscount());

// ============================================
// Key Takeaway
// ============================================

console.log("\n=== Key Takeaway ===");
console.log("Open/Closed Principle enables:");
console.log("  ✓ Adding new shapes without modifying AreaCalculator");
console.log("  ✓ Adding new report formats without modifying ReportGenerator");
console.log("  ✓ Adding new discount types without modifying PricingEngine");
console.log("\nBenefits:");
console.log("  ✓ Existing code remains stable and tested");
console.log("  ✓ New features isolated in new classes");
console.log("  ✓ Reduced risk of introducing bugs");
```

```python
# Python - Open/Closed Principle

from abc import ABC, abstractmethod
from typing import List
from datetime import datetime
import json
import math

# ============================================
# BAD Example: Violating OCP
# ============================================

class AreaCalculatorBad:
    def calculate_area(self, shapes: List[dict]) -> float:
        total_area = 0
        
        for shape in shapes:
            # Must modify this code for every new shape type
            if shape['type'] == 'circle':
                total_area += math.pi * shape['radius'] ** 2
            elif shape['type'] == 'rectangle':
                total_area += shape['width'] * shape['height']
            elif shape['type'] == 'triangle':
                total_area += (shape['base'] * shape['height']) / 2
            # Adding pentagon, hexagon... requires modifying this code
        
        return total_area

# ============================================
# GOOD Example: Following OCP
# ============================================

class Shape(ABC):
    @abstractmethod
    def calculate_area(self) -> float:
        pass
    
    @abstractmethod
    def get_shape_info(self) -> str:
        pass

class Circle(Shape):
    def __init__(self, radius: float):
        self._radius = radius
    
    def calculate_area(self) -> float:
        return math.pi * self._radius ** 2
    
    def get_shape_info(self) -> str:
        return f"Circle with radius {self._radius}"

class Rectangle(Shape):
    def __init__(self, width: float, height: float):
        self._width = width
        self._height = height
    
    def calculate_area(self) -> float:
        return self._width * self._height
    
    def get_shape_info(self) -> str:
        return f"Rectangle {self._width}x{self._height}"

class Triangle(Shape):
    def __init__(self, base: float, height: float):
        self._base = base
        self._height = height
    
    def calculate_area(self) -> float:
        return (self._base * self._height) / 2
    
    def get_shape_info(self) -> str:
        return f"Triangle with base {self._base} and height {self._height}"

class Pentagon(Shape):
    def __init__(self, side_length: float):
        self._side_length = side_length
    
    def calculate_area(self) -> float:
        return (5 * self._side_length ** 2) / (4 * math.tan(math.pi / 5))
    
    def get_shape_info(self) -> str:
        return f"Pentagon with side length {self._side_length}"

# This class is CLOSED for modification
class AreaCalculator:
    def calculate_total_area(self, shapes: List[Shape]) -> float:
        return sum(shape.calculate_area() for shape in shapes)
    
    def display_areas(self, shapes: List[Shape]) -> None:
        print("\n=== Shape Areas ===")
        for shape in shapes:
            print(f"{shape.get_shape_info()}: {shape.calculate_area():.2f} sq units")
        print(f"Total Area: {self.calculate_total_area(shapes):.2f} sq units")

# Usage
print("=== Open/Closed Principle - Shapes ===")

shapes = [
    Circle(5),
    Rectangle(4, 6),
    Triangle(3, 8),
    Pentagon(4)  # New shape added without modifying AreaCalculator!
]

calculator = AreaCalculator()
calculator.display_areas(shapes)

# ============================================
# Real-World Example: Report Generator
# ============================================

class ReportData:
    def __init__(self, title: str, author: str, date: datetime, content: str, 
                 sections: List[dict]):
        self.title = title
        self.author = author
        self.date = date
        self.content = content
        self.sections = sections

class ReportFormatter(ABC):
    @abstractmethod
    def format(self, data: ReportData) -> str:
        pass
    
    @abstractmethod
    def get_file_extension(self) -> str:
        pass

class PDFFormatter(ReportFormatter):
    def format(self, data: ReportData) -> str:
        pdf = "%PDF-1.4\n"
        pdf += f"Title: {data.title}\n"
        pdf += f"Author: {data.author}\n"
        pdf += f"Date: {data.date.strftime('%Y-%m-%d')}\n\n"
        pdf += f"{data.content}\n\n"
        for section in data.sections:
            pdf += f"## {section['heading']}\n{section['text']}\n\n"
        return pdf
    
    def get_file_extension(self) -> str:
        return "pdf"

class HTMLFormatter(ReportFormatter):
    def format(self, data: ReportData) -> str:
        html = "<!DOCTYPE html>\n<html>\n<head>\n"
        html += f"  <title>{data.title}</title>\n"
        html += "</head>\n<body>\n"
        html += f"  <h1>{data.title}</h1>\n"
        html += f"  <p><strong>Author:</strong> {data.author}</p>\n"
        html += f"  <p><strong>Date:</strong> {data.date.strftime('%Y-%m-%d')}</p>\n"
        html += f"  <p>{data.content}</p>\n"
        for section in data.sections:
            html += f"  <h2>{section['heading']}</h2>\n"
            html += f"  <p>{section['text']}</p>\n"
        html += "</body>\n</html>"
        return html
    
    def get_file_extension(self) -> str:
        return "html"

class JSONFormatter(ReportFormatter):
    def format(self, data: ReportData) -> str:
        return json.dumps({
            'title': data.title,
            'author': data.author,
            'date': data.date.isoformat(),
            'content': data.content,
            'sections': data.sections
        }, indent=2)
    
    def get_file_extension(self) -> str:
        return "json"

class MarkdownFormatter(ReportFormatter):
    def format(self, data: ReportData) -> str:
        md = f"# {data.title}\n\n"
        md += f"**Author:** {data.author}\n\n"
        md += f"**Date:** {data.date.strftime('%Y-%m-%d')}\n\n"
        md += f"{data.content}\n\n"
        for section in data.sections:
            md += f"## {section['heading']}\n\n"
            md += f"{section['text']}\n\n"
        return md
    
    def get_file_extension(self) -> str:
        return "md"

# Report generator is CLOSED for modification
class ReportGenerator:
    def generate_report(self, data: ReportData, formatter: ReportFormatter) -> str:
        print(f"\nGenerating {formatter.get_file_extension().upper()} report...")
        formatted = formatter.format(data)
        print(f"Report generated: report.{formatter.get_file_extension()}")
        return formatted
    
    def save_report(self, data: ReportData, formatter: ReportFormatter, filename: str) -> None:
        content = self.generate_report(data, formatter)
        full_filename = f"{filename}.{formatter.get_file_extension()}"
        print(f"Saving report as {full_filename}")

# Usage
print("\n=== Open/Closed Principle - Report Generator ===")

report_data = ReportData(
    "Q4 Financial Report",
    "Finance Team",
    datetime.now(),
    "This report summarizes our Q4 financial performance.",
    [
        {'heading': 'Revenue', 'text': 'Revenue increased by 15% compared to Q3.'},
        {'heading': 'Expenses', 'text': 'Operating expenses decreased by 5%.'},
        {'heading': 'Profit', 'text': 'Net profit margin improved to 22%.'}
    ]
)

generator = ReportGenerator()

generator.save_report(report_data, PDFFormatter(), "q4_report")
generator.save_report(report_data, HTMLFormatter(), "q4_report")
generator.save_report(report_data, JSONFormatter(), "q4_report")
generator.save_report(report_data, MarkdownFormatter(), "q4_report")

# ============================================
# Real-World Example: Discount System
# ============================================

class DiscountStrategy(ABC):
    @abstractmethod
    def calculate_discount(self, original_price: float) -> float:
        pass
    
    @abstractmethod
    def get_description(self) -> str:
        pass

class NoDiscount(DiscountStrategy):
    def calculate_discount(self, original_price: float) -> float:
        return original_price
    
    def get_description(self) -> str:
        return "No discount"

class PercentageDiscount(DiscountStrategy):
    def __init__(self, percentage: float):
        self._percentage = percentage
    
    def calculate_discount(self, original_price: float) -> float:
        return original_price * (1 - self._percentage / 100)
    
    def get_description(self) -> str:
        return f"{self._percentage}% off"

class FixedAmountDiscount(DiscountStrategy):
    def __init__(self, amount: float):
        self._amount = amount
    
    def calculate_discount(self, original_price: float) -> float:
        return max(0, original_price - self._amount)
    
    def get_description(self) -> str:
        return f"${self._amount} off"

class BuyOneGetOneDiscount(DiscountStrategy):
    def calculate_discount(self, original_price: float) -> float:
        return original_price / 2
    
    def get_description(self) -> str:
        return "Buy One Get One Free"

class SeasonalDiscount(DiscountStrategy):
    def __init__(self, season: str, percentage: float):
        self._season = season
        self._percentage = percentage
    
    def calculate_discount(self, original_price: float) -> float:
        current_month = datetime.now().month
        
        if self._season == "summer" and 5 <= current_month <= 7:
            return original_price * (1 - self._percentage / 100)
        elif self._season == "winter" and (current_month >= 11 or current_month <= 1):
            return original_price * (1 - self._percentage / 100)
        
        return original_price
    
    def get_description(self) -> str:
        return f"{self._season} sale: {self._percentage}% off"

class PricingEngine:
    def calculate_final_price(self, original_price: float, discount: DiscountStrategy) -> float:
        return discount.calculate_discount(original_price)
    
    def display_price(self, product_name: str, original_price: float, discount: DiscountStrategy) -> None:
        final_price = self.calculate_final_price(original_price, discount)
        savings = original_price - final_price
        
        print(f"\n{product_name}:")
        print(f"  Original: ${original_price:.2f}")
        print(f"  Discount: {discount.get_description()}")
        print(f"  Final Price: ${final_price:.2f}")
        if savings > 0:
            print(f"  You save: ${savings:.2f}")

# Usage
print("\n=== Open/Closed Principle - Pricing Engine ===")

pricing = PricingEngine()

pricing.display_price("Laptop", 999.99, PercentageDiscount(15))
pricing.display_price("Headphones", 199.99, FixedAmountDiscount(50))
pricing.display_price("Mouse", 29.99, BuyOneGetOneDiscount())
pricing.display_price("Keyboard", 79.99, SeasonalDiscount("summer", 20))
pricing.display_price("Monitor", 399.99, NoDiscount())

# ============================================
# Key Takeaway
# ============================================

print("\n=== Key Takeaway ===")
print("Open/Closed Principle enables:")
print("  ✓ Adding new shapes without modifying AreaCalculator")
print("  ✓ Adding new report formats without modifying ReportGenerator")
print("  ✓ Adding new discount types without modifying PricingEngine")
print("\nBenefits:")
print("  ✓ Existing code remains stable and tested")
print("  ✓ New features isolated in new classes")
print("  ✓ Reduced risk of introducing bugs")
```

</details>

---

## Practice Questions - Part 2

<details>
<summary><strong>View Questions</strong></summary>

### Fill in the Blanks

1. The Open/Closed Principle states that software entities should be open for __________ but closed for __________.

2. OCP is typically achieved through __________ and __________.

3. When adding a new shape to AreaCalculator, following OCP means you __________ create a new class but you __________ modify the calculator.

4. The main benefit of OCP is that you can add new __________ without changing existing, tested __________.

<details>
<summary><strong>View Answers</strong></summary>

1. **extension**, **modification** - You can add new functionality (extend) without changing existing code (modify). Example: Add new Shape implementations without touching AreaCalculator.

2. **abstraction**, **polymorphism** (or **interfaces/abstract classes**) - Use abstract interfaces (Shape) and polymorphism so new implementations (Pentagon) work automatically.

3. **do**, **don't** - Create Pentagon class implementing Shape interface. Don't modify AreaCalculator's calculateTotalArea method.

4. **functionality**, **code** - Add new ReportFormatters, DiscountStrategies, or Shapes without modifying the generators/calculators that use them.

</details>

---

### True/False

1. ⬜ OCP means you should never modify existing classes.

2. ⬜ Using if-else or switch statements to handle different types typically violates OCP.

3. ⬜ OCP only applies to large enterprise applications.

4. ⬜ Following OCP always requires creating an interface or abstract class.

5. ⬜ The Strategy pattern is a common way to implement OCP.

<details>
<summary><strong>View Answers</strong></summary>

1. **False** - OCP means code should be closed for modification when EXTENDING functionality, not that it can never change. Bug fixes, refactoring, and requirement changes may require modifications. The goal is to extend without modifying.

2. **True** - Code like `if (type === "pdf")... else if (type === "html")...` requires modification for each new type. Better: use polymorphism with ReportFormatter interface where each type is a class.

3. **False** - OCP applies to projects of all sizes. Even small applications benefit from being able to add features without modifying existing code. It prevents regression bugs and makes code more maintainable.

4. **False** - While abstraction is the most common approach, OCP can also be achieved through other means like callbacks, plugins, or configuration. However, interfaces/abstract classes are the most robust solution in OOP.

5. **True** - Strategy pattern perfectly implements OCP. You can add new strategies (PercentageDiscount, FixedAmountDiscount) without modifying the context (PricingEngine). Each strategy is a separate class implementing a common interface.

</details>

---

### Multiple Choice

1. **Which code example violates OCP?**
   - A) Interface with multiple implementations
   - B) Class with if-else checking object types
   - C) Abstract class with concrete subclasses
   - D) Strategy pattern implementation

2. **What is the main advantage of following OCP?**
   - A) Faster execution speed
   - B) Fewer total lines of code
   - C) Can add features without modifying tested code
   - D) Automatic documentation

3. **In the Shape example, what makes AreaCalculator follow OCP?**
   - A) It's a very small class
   - B) It works with Shape interface, not specific types
   - C) It uses loops instead of recursion
   - D) It has comprehensive error handling

4. **When adding a new discount type, what do you need to modify if you follow OCP?**
   - A) The PricingEngine class
   - B) All existing discount classes
   - C) Nothing - just create a new DiscountStrategy implementation
   - D) The main application file

<details>
<summary><strong>View Answers</strong></summary>

1. **B** - Type-checking with if-else requires modifying the code for each new type. A, C, and D all use abstraction to support extension without modification.

2. **C** - OCP's key benefit: add new Shapes, ReportFormatters, or DiscountStrategies without touching working code. This prevents bugs and simplifies testing (you only test the new class).

3. **B** - AreaCalculator depends on Shape abstraction, not Circle, Rectangle, etc. It calls `shape.calculateArea()` without knowing the concrete type. This allows adding Pentagon without touching AreaCalculator.

4. **C** - Just create a new class implementing DiscountStrategy. PricingEngine doesn't change because it depends on the interface. This is OCP in action: extension without modification.

</details>

---

### Code Challenge

**Challenge: Create an extensible notification system**

Create a notification system following OCP with these requirements:

1. **NotificationSender interface** with a `send()` method
2. **Three implementations**: EmailNotification, SMSNotification, PushNotification
3. **NotificationService** that can send through any sender
4. **Demonstrate** that you can add a new notification type (SlackNotification) without modifying NotificationService

<details>
<summary><strong>View Solution</strong></summary>

```typescript
// TypeScript Solution

interface NotificationSender {
  send(recipient: string, message: string): boolean;
  getChannelName(): string;
}

class EmailNotification implements NotificationSender {
  constructor(private smtpServer: string) {}

  send(recipient: string, message: string): boolean {
    console.log(`📧 Sending email via ${this.smtpServer}`);
    console.log(`   To: ${recipient}`);
    console.log(`   Message: ${message}`);
    return true;
  }

  getChannelName(): string {
    return "Email";
  }
}

class SMSNotification implements NotificationSender {
  constructor(private provider: string) {}

  send(recipient: string, message: string): boolean {
    console.log(`📱 Sending SMS via ${this.provider}`);
    console.log(`   To: ${recipient}`);
    console.log(`   Message: ${message.substring(0, 160)}`);
    return true;
  }

  getChannelName(): string {
    return "SMS";
  }
}

class PushNotification implements NotificationSender {
  constructor(private appId: string) {}

  send(recipient: string, message: string): boolean {
    console.log(`🔔 Sending push notification (App: ${this.appId})`);
    console.log(`   To: ${recipient}`);
    console.log(`   Message: ${message}`);
    return true;
  }

  getChannelName(): string {
    return "Push";
  }
}

// NEW: Added without modifying NotificationService!
class SlackNotification implements NotificationSender {
  constructor(private webhookUrl: string) {}

  send(recipient: string, message: string): boolean {
    console.log(`💬 Sending Slack message`);
    console.log(`   Channel: ${recipient}`);
    console.log(`   Message: ${message}`);
    console.log(`   Webhook: ${this.webhookUrl.substring(0, 30)}...`);
    return true;
  }

  getChannelName(): string {
    return "Slack";
  }
}

// This class is CLOSED for modification
class NotificationService {
  private senders: NotificationSender[] = [];

  addChannel(sender: NotificationSender): void {
    this.senders.push(sender);
    console.log(`✓ ${sender.getChannelName()} channel added`);
  }

  sendNotification(recipient: string, message: string, channelName?: string): void {
    const sendersToUse = channelName
      ? this.senders.filter(s => s.getChannelName() === channelName)
      : this.senders;

    if (sendersToUse.length === 0) {
      console.log("❌ No notification channels available");
      return;
    }

    console.log(`\n=== Sending Notification ===`);
    sendersToUse.forEach(sender => {
      sender.send(recipient, message);
    });
  }

  broadcastToAll(message: string, recipients: string[]): void {
    console.log(`\n=== Broadcasting to ${recipients.length} recipients ===`);
    recipients.forEach(recipient => {
      this.senders.forEach(sender => {
        sender.send(recipient, message);
      });
    });
  }
}

// Usage
console.log("=== OCP Challenge - Notification System ===\n");

const notificationService = new NotificationService();

// Add channels
notificationService.addChannel(new EmailNotification("smtp.gmail.com"));
notificationService.addChannel(new SMSNotification("Twilio"));
notificationService.addChannel(new PushNotification("com.example.app"));

// Send via all channels
notificationService.sendNotification(
  "user@example.com",
  "Your order has been shipped!"
);

// Add new channel WITHOUT modifying NotificationService
console.log("\n--- Adding Slack Channel ---");
notificationService.addChannel(new SlackNotification("https://hooks.slack.com/services/XXX"));

// Send via specific channel
notificationService.sendNotification(
  "#general",
  "Deployment successful!",
  "Slack"
);
```

```python
# Python Solution

from abc import ABC, abstractmethod
from typing import List, Optional

class NotificationSender(ABC):
    @abstractmethod
    def send(self, recipient: str, message: str) -> bool:
        pass
    
    @abstractmethod
    def get_channel_name(self) -> str:
        pass

class EmailNotification(NotificationSender):
    def __init__(self, smtp_server: str):
        self._smtp_server = smtp_server
    
    def send(self, recipient: str, message: str) -> bool:
        print(f"📧 Sending email via {self._smtp_server}")
        print(f"   To: {recipient}")
        print(f"   Message: {message}")
        return True
    
    def get_channel_name(self) -> str:
        return "Email"

class SMSNotification(NotificationSender):
    def __init__(self, provider: str):
        self._provider = provider
    
    def send(self, recipient: str, message: str) -> bool:
        print(f"📱 Sending SMS via {self._provider}")
        print(f"   To: {recipient}")
        print(f"   Message: {message[:160]}")
        return True
    
    def get_channel_name(self) -> str:
        return "SMS"

class PushNotification(NotificationSender):
    def __init__(self, app_id: str):
        self._app_id = app_id
    
    def send(self, recipient: str, message: str) -> bool:
        print(f"🔔 Sending push notification (App: {self._app_id})")
        print(f"   To: {recipient}")
        print(f"   Message: {message}")
        return True
    
    def get_channel_name(self) -> str:
        return "Push"

class SlackNotification(NotificationSender):
    def __init__(self, webhook_url: str):
        self._webhook_url = webhook_url
    
    def send(self, recipient: str, message: str) -> bool:
        print("💬 Sending Slack message")
        print(f"   Channel: {recipient}")
        print(f"   Message: {message}")
        print(f"   Webhook: {self._webhook_url[:30]}...")
        return True
    
    def get_channel_name(self) -> str:
        return "Slack"

class NotificationService:
    def __init__(self):
        self._senders: List[NotificationSender] = []
    
    def add_channel(self, sender: NotificationSender) -> None:
        self._senders.append(sender)
        print(f"✓ {sender.get_channel_name()} channel added")
    
    def send_notification(self, recipient: str, message: str, channel_name: Optional[str] = None) -> None:
        senders_to_use = [s for s in self._senders if s.get_channel_name() == channel_name] if channel_name else self._senders
        
        if not senders_to_use:
            print("❌ No notification channels available")
            return
        
        print("\n=== Sending Notification ===")
        for sender in senders_to_use:
            sender.send(recipient, message)
    
    def broadcast_to_all(self, message: str, recipients: List[str]) -> None:
        print(f"\n=== Broadcasting to {len(recipients)} recipients ===")
        for recipient in recipients:
            for sender in self._senders:
                sender.send(recipient, message)

# Usage
print("=== OCP Challenge - Notification System ===\n")

notification_service = NotificationService()

notification_service.add_channel(EmailNotification("smtp.gmail.com"))
notification_service.add_channel(SMSNotification("Twilio"))
notification_service.add_channel(PushNotification("com.example.app"))

notification_service.send_notification("user@example.com", "Your order has been shipped!")

print("\n--- Adding Slack Channel ---")
notification_service.add_channel(SlackNotification("https://hooks.slack.com/services/XXX"))

notification_service.send_notification("#general", "Deployment successful!", "Slack")
```

</details>

</details>

---

## 3. Liskov Substitution Principle (LSP)

**Definition**: Objects of a superclass should be replaceable with objects of a subclass without breaking the application. In other words, derived classes must be substitutable for their base classes.

**Formal definition by Barbara Liskov**: "If S is a subtype of T, then objects of type T may be replaced with objects of type S without altering any of the desirable properties of the program."

**Real-world analogy**: Think of car rental. You reserve a "sedan" but the rental company can give you any sedan (Honda Accord, Toyota Camry, etc.) and you can still drive it. All sedans follow the same interface - they all have steering wheels, pedals, and gear shifts in the same places. If they gave you a forklift instead, it would violate LSP because you couldn't use it the same way.

### What This Means:

- **Subclasses must honor the contract** of the parent class
- **No surprises**: Subclass shouldn't change expected behavior
- **Preconditions cannot be strengthened**: If parent accepts any string, child can't require specific format
- **Postconditions cannot be weakened**: If parent guarantees non-null return, child must too
- **Invariants must be preserved**: Class constraints must remain true

### Common Violations:

1. **Throwing exceptions** not thrown by parent
2. **Strengthening preconditions** (requiring more than parent)
3. **Weakening postconditions** (guaranteeing less than parent)
4. **Changing expected behavior** in surprising ways

<details>
<summary><strong>View Examples</strong></summary>

```typescript
// TypeScript - Liskov Substitution Principle

// ============================================
// BAD Example: Violating LSP - Classic Rectangle/Square Problem
// ============================================

class Rectangle {
  constructor(protected width: number, protected height: number) {}

  setWidth(width: number): void {
    this.width = width;
  }

  setHeight(height: number): void {
    this.height = height;
  }

  getArea(): number {
    return this.width * this.height;
  }

  getInfo(): string {
    return `Rectangle: ${this.width}x${this.height}`;
  }
}

// Square IS-A Rectangle mathematically, but this violates LSP!
class SquareBad extends Rectangle {
  constructor(size: number) {
    super(size, size);
  }

  // Violates LSP: Changes behavior unexpectedly
  setWidth(width: number): void {
    this.width = width;
    this.height = width; // Forces square constraint
  }

  setHeight(height: number): void {
    this.width = height;
    this.height = height; // Forces square constraint
  }
}

// This function expects Rectangle behavior
function resizeRectangle(rectangle: Rectangle): void {
  rectangle.setWidth(5);
  rectangle.setHeight(10);
  
  console.log(`Expected area: 50 (5 x 10)`);
  console.log(`Actual area: ${rectangle.getArea()}`);
  
  // This assertion holds for Rectangle but fails for Square!
  if (rectangle.getArea() !== 50) {
    console.log("❌ LSP VIOLATED: Square breaks Rectangle's contract!");
  }
}

console.log("=== LSP Violation - Rectangle/Square ===\n");
const rect = new Rectangle(3, 4);
resizeRectangle(rect); // Works as expected: area = 50

const square = new SquareBad(3);
resizeRectangle(square); // Breaks: area = 100, not 50!

// ============================================
// GOOD Example: Following LSP - Proper Design
// ============================================

// Abstract base for all shapes
abstract class Shape {
  abstract getArea(): number;
  abstract getInfo(): string;
}

class RectangleGood extends Shape {
  constructor(private width: number, private height: number) {
    super();
  }

  setWidth(width: number): void {
    this.width = width;
  }

  setHeight(height: number): void {
    this.height = height;
  }

  getArea(): number {
    return this.width * this.height;
  }

  getInfo(): string {
    return `Rectangle: ${this.width}x${this.height}`;
  }
}

class SquareGood extends Shape {
  constructor(private size: number) {
    super();
  }

  setSize(size: number): void {
    this.size = size;
  }

  getArea(): number {
    return this.size * this.size;
  }

  getInfo(): string {
    return `Square: ${this.size}x${this.size}`;
  }
}

// Function works with any Shape - no violations
function displayShapeInfo(shape: Shape): void {
  console.log(`${shape.getInfo()} - Area: ${shape.getArea()}`);
}

console.log("\n=== LSP Compliant - Proper Hierarchy ===");
displayShapeInfo(new RectangleGood(5, 10)); // Works
displayShapeInfo(new SquareGood(7));        // Works

// ============================================
// Real-World Example: Bird Hierarchy (Violation)
// ============================================

class Bird {
  constructor(public name: string) {}

  fly(): void {
    console.log(`${this.name} is flying`);
  }

  eat(): void {
    console.log(`${this.name} is eating`);
  }
}

class Sparrow extends Bird {
  fly(): void {
    console.log(`${this.name} flies with small wings`);
  }
}

// VIOLATION: Penguin can't fly, but inherits fly() method
class PenguinBad extends Bird {
  fly(): void {
    // Violates LSP: Changes expected behavior
    throw new Error("Penguins can't fly!");
  }

  swim(): void {
    console.log(`${this.name} is swimming`);
  }
}

function makeBirdFly(bird: Bird): void {
  bird.fly(); // Expects this to work for all birds!
}

console.log("\n=== LSP Violation - Bird Hierarchy ===");
makeBirdFly(new Sparrow("Tweety")); // ✓ Works

try {
  makeBirdFly(new PenguinBad("Pingu")); // ❌ Throws exception - LSP violation!
} catch (e) {
  console.log(`Error: ${e.message}`);
}

// ============================================
// GOOD Example: Proper Bird Hierarchy
// ============================================

abstract class Animal {
  constructor(public name: string) {}
  
  abstract eat(): void;
  abstract move(): void;
}

class FlyingBird extends Animal {
  eat(): void {
    console.log(`${this.name} is eating seeds`);
  }

  move(): void {
    this.fly();
  }

  fly(): void {
    console.log(`${this.name} is flying`);
  }
}

class SwimmingBird extends Animal {
  eat(): void {
    console.log(`${this.name} is eating fish`);
  }

  move(): void {
    this.swim();
  }

  swim(): void {
    console.log(`${this.name} is swimming`);
  }
}

class SparrowGood extends FlyingBird {
  fly(): void {
    console.log(`${this.name} flies with small wings`);
  }
}

class PenguinGood extends SwimmingBird {
  swim(): void {
    console.log(`${this.name} swims gracefully`);
  }
}

function makeAnimalMove(animal: Animal): void {
  animal.move(); // Works for all animals, each moves appropriately
}

console.log("\n=== LSP Compliant - Proper Bird Hierarchy ===");
makeAnimalMove(new SparrowGood("Tweety"));  // Flies
makeAnimalMove(new PenguinGood("Pingu"));   // Swims

// ============================================
// Real-World Example: Account Hierarchy
// ============================================

// BAD: Violates LSP
class BankAccountBad {
  constructor(protected balance: number) {}

  deposit(amount: number): void {
    this.balance += amount;
    console.log(`Deposited $${amount}. Balance: $${this.balance}`);
  }

  withdraw(amount: number): boolean {
    if (amount > this.balance) {
      console.log("Insufficient funds");
      return false;
    }
    this.balance -= amount;
    console.log(`Withdrew $${amount}. Balance: $${this.balance}`);
    return true;
  }

  getBalance(): number {
    return this.balance;
  }
}

// VIOLATION: Strengthens preconditions (monthly withdrawal limit)
class SavingsAccountBad extends BankAccountBad {
  private withdrawalsThisMonth: number = 0;
  private readonly MAX_MONTHLY_WITHDRAWALS = 3;

  withdraw(amount: number): boolean {
    // Adds NEW constraint not in parent - violates LSP!
    if (this.withdrawalsThisMonth >= this.MAX_MONTHLY_WITHDRAWALS) {
      console.log("Monthly withdrawal limit reached!");
      return false;
    }

    const success = super.withdraw(amount);
    if (success) {
      this.withdrawalsThisMonth++;
    }
    return success;
  }
}

function processWithdrawals(account: BankAccountBad): void {
  // Works fine with regular account
  for (let i = 1; i <= 5; i++) {
    console.log(`\nWithdrawal ${i}:`);
    account.withdraw(10);
  }
}

console.log("\n=== LSP Violation - Account Hierarchy ===");
console.log("--- Regular Account (5 withdrawals) ---");
processWithdrawals(new BankAccountBad(100));

console.log("\n--- Savings Account (5 withdrawals) ---");
processWithdrawals(new SavingsAccountBad(100)); // Breaks after 3!

// ============================================
// GOOD Example: Proper Account Hierarchy
// ============================================

interface Account {
  deposit(amount: number): void;
  canWithdraw(amount: number): boolean;
  withdraw(amount: number): boolean;
  getBalance(): number;
}

class CheckingAccount implements Account {
  constructor(private balance: number) {}

  deposit(amount: number): void {
    this.balance += amount;
    console.log(`Deposited $${amount}. Balance: $${this.balance}`);
  }

  canWithdraw(amount: number): boolean {
    return amount <= this.balance;
  }

  withdraw(amount: number): boolean {
    if (!this.canWithdraw(amount)) {
      console.log("Insufficient funds");
      return false;
    }
    this.balance -= amount;
    console.log(`Withdrew $${amount}. Balance: $${this.balance}`);
    return true;
  }

  getBalance(): number {
    return this.balance;
  }
}

class SavingsAccountGood implements Account {
  private withdrawalsThisMonth: number = 0;
  private readonly MAX_MONTHLY_WITHDRAWALS = 3;

  constructor(private balance: number) {}

  deposit(amount: number): void {
    this.balance += amount;
    console.log(`Deposited $${amount}. Balance: $${this.balance}`);
  }

  // Clearly communicates constraint through the interface
  canWithdraw(amount: number): boolean {
    return amount <= this.balance && 
           this.withdrawalsThisMonth < this.MAX_MONTHLY_WITHDRAWALS;
  }

  withdraw(amount: number): boolean {
    if (!this.canWithdraw(amount)) {
      if (this.withdrawalsThisMonth >= this.MAX_MONTHLY_WITHDRAWALS) {
        console.log("Monthly withdrawal limit reached!");
      } else {
        console.log("Insufficient funds");
      }
      return false;
    }

    this.balance -= amount;
    this.withdrawalsThisMonth++;
    console.log(`Withdrew $${amount}. Balance: $${this.balance}`);
    return true;
  }

  getBalance(): number {
    return this.balance;
  }
}

// Properly handles any Account implementation
function smartWithdrawal(account: Account, amount: number): void {
  if (account.canWithdraw(amount)) {
    account.withdraw(amount);
  } else {
    console.log("Cannot withdraw - check constraints");
  }
}

console.log("\n=== LSP Compliant - Account Hierarchy ===");
const checking = new CheckingAccount(100);
const savings = new SavingsAccountGood(100);

console.log("--- Checking Account ---");
for (let i = 1; i <= 5; i++) {
  console.log(`\nAttempt ${i}:`);
  smartWithdrawal(checking, 10);
}

console.log("\n--- Savings Account ---");
for (let i = 1; i <= 5; i++) {
  console.log(`\nAttempt ${i}:`);
  smartWithdrawal(savings, 10);
}

// ============================================
// Key Takeaways
// ============================================

console.log("\n=== LSP Key Takeaways ===");
console.log("Violations occur when:");
console.log("  ❌ Subclass throws unexpected exceptions");
console.log("  ❌ Subclass strengthens preconditions (requires more)");
console.log("  ❌ Subclass weakens postconditions (guarantees less)");
console.log("  ❌ Subclass changes expected behavior");
console.log("\nTo follow LSP:");
console.log("  ✓ Design 'IS-A' relationships carefully");
console.log("  ✓ Use composition over inheritance when appropriate");
console.log("  ✓ Make constraints explicit in interfaces");
console.log("  ✓ Ensure substitutability through proper contracts");
```

```python
# Python - Liskov Substitution Principle

from abc import ABC, abstractmethod
from typing import Protocol

# ============================================
# BAD Example: Violating LSP - Rectangle/Square
# ============================================

class Rectangle:
    def __init__(self, width: float, height: float):
        self._width = width
        self._height = height
    
    def set_width(self, width: float) -> None:
        self._width = width
    
    def set_height(self, height: float) -> None:
        self._height = height
    
    def get_area(self) -> float:
        return self._width * self._height
    
    def get_info(self) -> str:
        return f"Rectangle: {self._width}x{self._height}"

class SquareBad(Rectangle):
    def __init__(self, size: float):
        super().__init__(size, size)
    
    def set_width(self, width: float) -> None:
        self._width = width
        self._height = width  # Violates LSP
    
    def set_height(self, height: float) -> None:
        self._width = height
        self._height = height  # Violates LSP

def resize_rectangle(rectangle: Rectangle) -> None:
    rectangle.set_width(5)
    rectangle.set_height(10)
    
    print(f"Expected area: 50 (5 x 10)")
    print(f"Actual area: {rectangle.get_area()}")
    
    if rectangle.get_area() != 50:
        print("❌ LSP VIOLATED: Square breaks Rectangle's contract!")

print("=== LSP Violation - Rectangle/Square ===\n")
rect = Rectangle(3, 4)
resize_rectangle(rect)  # Works: area = 50

print()
square = SquareBad(3)
resize_rectangle(square)  # Breaks: area = 100!

# ============================================
# GOOD Example: Following LSP
# ============================================

class Shape(ABC):
    @abstractmethod
    def get_area(self) -> float:
        pass
    
    @abstractmethod
    def get_info(self) -> str:
        pass

class RectangleGood(Shape):
    def __init__(self, width: float, height: float):
        self._width = width
        self._height = height
    
    def set_width(self, width: float) -> None:
        self._width = width
    
    def set_height(self, height: float) -> None:
        self._height = height
    
    def get_area(self) -> float:
        return self._width * self._height
    
    def get_info(self) -> str:
        return f"Rectangle: {self._width}x{self._height}"

class SquareGood(Shape):
    def __init__(self, size: float):
        self._size = size
    
    def set_size(self, size: float) -> None:
        self._size = size
    
    def get_area(self) -> float:
        return self._size ** 2
    
    def get_info(self) -> str:
        return f"Square: {self._size}x{self._size}"

def display_shape_info(shape: Shape) -> None:
    print(f"{shape.get_info()} - Area: {shape.get_area()}")

print("\n=== LSP Compliant - Proper Hierarchy ===")
display_shape_info(RectangleGood(5, 10))
display_shape_info(SquareGood(7))

# ============================================
# Real-World Example: Bird Hierarchy
# ============================================

# BAD: Violates LSP
class Bird:
    def __init__(self, name: str):
        self.name = name
    
    def fly(self) -> None:
        print(f"{self.name} is flying")
    
    def eat(self) -> None:
        print(f"{self.name} is eating")

class Sparrow(Bird):
    def fly(self) -> None:
        print(f"{self.name} flies with small wings")

class PenguinBad(Bird):
    def fly(self) -> None:
        raise Exception("Penguins can't fly!")  # Violates LSP
    
    def swim(self) -> None:
        print(f"{self.name} is swimming")

def make_bird_fly(bird: Bird) -> None:
    bird.fly()

print("\n=== LSP Violation - Bird Hierarchy ===")
make_bird_fly(Sparrow("Tweety"))  # ✓ Works

try:
    make_bird_fly(PenguinBad("Pingu"))  # ❌ Throws exception
except Exception as e:
    print(f"Error: {e}")

# GOOD: Proper hierarchy
class Animal(ABC):
    def __init__(self, name: str):
        self.name = name
    
    @abstractmethod
    def eat(self) -> None:
        pass
    
    @abstractmethod
    def move(self) -> None:
        pass

class FlyingBird(Animal):
    def eat(self) -> None:
        print(f"{self.name} is eating seeds")
    
    def move(self) -> None:
        self.fly()
    
    def fly(self) -> None:
        print(f"{self.name} is flying")

class SwimmingBird(Animal):
    def eat(self) -> None:
        print(f"{self.name} is eating fish")
    
    def move(self) -> None:
        self.swim()
    
    def swim(self) -> None:
        print(f"{self.name} is swimming")

class SparrowGood(FlyingBird):
    def fly(self) -> None:
        print(f"{self.name} flies with small wings")

class PenguinGood(SwimmingBird):
    def swim(self) -> None:
        print(f"{self.name} swims gracefully")

def make_animal_move(animal: Animal) -> None:
    animal.move()

print("\n=== LSP Compliant - Proper Bird Hierarchy ===")
make_animal_move(SparrowGood("Tweety"))
make_animal_move(PenguinGood("Pingu"))

# ============================================
# Real-World Example: Account Hierarchy
# ============================================

# BAD: Violates LSP
class BankAccountBad:
    def __init__(self, balance: float):
        self._balance = balance
    
    def deposit(self, amount: float) -> None:
        self._balance += amount
        print(f"Deposited ${amount}. Balance: ${self._balance}")
    
    def withdraw(self, amount: float) -> bool:
        if amount > self._balance:
            print("Insufficient funds")
            return False
        self._balance -= amount
        print(f"Withdrew ${amount}. Balance: ${self._balance}")
        return True
    
    def get_balance(self) -> float:
        return self._balance

class SavingsAccountBad(BankAccountBad):
    MAX_MONTHLY_WITHDRAWALS = 3
    
    def __init__(self, balance: float):
        super().__init__(balance)
        self._withdrawals_this_month = 0
    
    def withdraw(self, amount: float) -> bool:
        # Strengthens preconditions - violates LSP
        if self._withdrawals_this_month >= self.MAX_MONTHLY_WITHDRAWALS:
            print("Monthly withdrawal limit reached!")
            return False
        
        success = super().withdraw(amount)
        if success:
            self._withdrawals_this_month += 1
        return success

def process_withdrawals(account: BankAccountBad) -> None:
    for i in range(1, 6):
        print(f"\nWithdrawal {i}:")
        account.withdraw(10)

print("\n=== LSP Violation - Account Hierarchy ===")
print("--- Regular Account (5 withdrawals) ---")
process_withdrawals(BankAccountBad(100))

print("\n--- Savings Account (5 withdrawals) ---")
process_withdrawals(SavingsAccountBad(100))  # Breaks after 3!

# GOOD: Proper hierarchy with explicit interface
class Account(Protocol):
    def deposit(self, amount: float) -> None: ...
    def can_withdraw(self, amount: float) -> bool: ...
    def withdraw(self, amount: float) -> bool: ...
    def get_balance(self) -> float: ...

class CheckingAccount:
    def __init__(self, balance: float):
        self._balance = balance
    
    def deposit(self, amount: float) -> None:
        self._balance += amount
        print(f"Deposited ${amount}. Balance: ${self._balance}")
    
    def can_withdraw(self, amount: float) -> bool:
        return amount <= self._balance
    
    def withdraw(self, amount: float) -> bool:
        if not self.can_withdraw(amount):
            print("Insufficient funds")
            return False
        self._balance -= amount
        print(f"Withdrew ${amount}. Balance: ${self._balance}")
        return True
    
    def get_balance(self) -> float:
        return self._balance

class SavingsAccountGood:
    MAX_MONTHLY_WITHDRAWALS = 3
    
    def __init__(self, balance: float):
        self._balance = balance
        self._withdrawals_this_month = 0
    
    def deposit(self, amount: float) -> None:
        self._balance += amount
        print(f"Deposited ${amount}. Balance: ${self._balance}")
    
    def can_withdraw(self, amount: float) -> bool:
        return (amount <= self._balance and 
                self._withdrawals_this_month < self.MAX_MONTHLY_WITHDRAWALS)
    
    def withdraw(self, amount: float) -> bool:
        if not self.can_withdraw(amount):
            if self._withdrawals_this_month >= self.MAX_MONTHLY_WITHDRAWALS:
                print("Monthly withdrawal limit reached!")
            else:
                print("Insufficient funds")
            return False
        
        self._balance -= amount
        self._withdrawals_this_month += 1
        print(f"Withdrew ${amount}. Balance: ${self._balance}")
        return True
    
    def get_balance(self) -> float:
        return self._balance

def smart_withdrawal(account: Account, amount: float) -> None:
    if account.can_withdraw(amount):
        account.withdraw(amount)
    else:
        print("Cannot withdraw - check constraints")

print("\n=== LSP Compliant - Account Hierarchy ===")
checking = CheckingAccount(100)
savings = SavingsAccountGood(100)

print("--- Checking Account ---")
for i in range(1, 6):
    print(f"\nAttempt {i}:")
    smart_withdrawal(checking, 10)

print("\n--- Savings Account ---")
for i in range(1, 6):
    print(f"\nAttempt {i}:")
    smart_withdrawal(savings, 10)

# ============================================
# Key Takeaways
# ============================================

print("\n=== LSP Key Takeaways ===")
print("Violations occur when:")
print("  ❌ Subclass throws unexpected exceptions")
print("  ❌ Subclass strengthens preconditions (requires more)")
print("  ❌ Subclass weakens postconditions (guarantees less)")
print("  ❌ Subclass changes expected behavior")
print("\nTo follow LSP:")
print("  ✓ Design 'IS-A' relationships carefully")
print("  ✓ Use composition over inheritance when appropriate")
print("  ✓ Make constraints explicit in interfaces")
print("  ✓ Ensure substitutability through proper contracts")
```

</details>

---

## Practice Questions - Part 3

<details>
<summary><strong>View Questions</strong></summary>

### Fill in the Blanks

1. The Liskov Substitution Principle states that objects of a __________ should be replaceable with objects of a __________ without breaking the application.

2. If a subclass throws an exception that the parent class doesn't throw, it __________ LSP.

3. LSP violations often occur when using __________ when __________ would be more appropriate.

4. The classic Rectangle/Square problem violates LSP because Square changes the __________ behavior of Rectangle's setter methods.

<details>
<summary><strong>View Answers</strong></summary>

1. **superclass**, **subclass** - Derived classes must be substitutable for their base classes. Any code working with BankAccount should work with SavingsAccount.

2. **violates** - If parent's method doesn't throw exceptions, child shouldn't either. Penguin throwing exception in fly() method violates LSP because Bird.fly() doesn't throw.

3. **inheritance**, **composition** - Many LSP violations indicate the relationship isn't truly IS-A and composition would be better. Penguin IS-NOT-A FlyingBird.

4. **expected** - Square's setWidth() unexpectedly changes both dimensions, violating Rectangle's contract where setWidth() only changes width.

</details>

---

### True/False

1. ⬜ If mathematically Square IS-A Rectangle, then Square should inherit from Rectangle in code.

2. ⬜ A subclass can add new constraints not present in the parent class without violating LSP.

3. ⬜ LSP is about behavioral substitutability, not just type compatibility.

4. ⬜ Using composition instead of inheritance always prevents LSP violations.

5. ⬜ If code needs to check the type of an object before using it, LSP is likely being violated.

<details>
<summary><strong>View Answers</strong></summary>

1. **False** - Mathematical relationships don't always map to OOP inheritance. Square/Rectangle works mathematically but violates LSP in code because Square can't maintain Rectangle's behavior contract. Use composition or separate hierarchies instead.

2. **False** - Adding constraints violates LSP. SavingsAccount adding monthly withdrawal limit strengthens preconditions beyond what BankAccount requires. Code expecting BankAccount behavior breaks with SavingsAccount.

3. **True** - LSP is fundamentally about behavior. Even if types match, if behavior differs unexpectedly (Penguin throwing exception, Square changing both dimensions), LSP is violated.

4. **False** - While composition often helps avoid LSP issues, it doesn't guarantee LSP compliance. LSP only applies to inheritance hierarchies. Composition avoids the issue by not using inheritance.

5. **True** - If you need `if (account instanceof SavingsAccount)` checks, you're not treating all Accounts uniformly. This suggests LSP violation - proper design shouldn't require type checking.

</details>

---

### Multiple Choice

1. **Which violates LSP?**
   - A) Subclass adds a new method not in parent
   - B) Subclass throws exception parent doesn't throw
   - C) Subclass provides optimized implementation of parent's method
   - D) Subclass calls super.method()

2. **Why does PenguinBad violate LSP in the Bird example?**
   - A) It adds a swim() method
   - B) It throws an exception in fly() while Bird.fly() doesn't
   - C) It has a different name
   - D) It doesn't call super.fly()

3. **What's the best solution for the Rectangle/Square LSP violation?**
   - A) Make Square's setters private
   - B) Don't let Square inherit from Rectangle
   - C) Add type checking in functions
   - D) Document the constraint

4. **Which indicates an LSP violation?**
   - A) Child class has more methods than parent
   - B) Child class requires stronger preconditions than parent
   - C) Child class is in a different file than parent
   - D) Child class has better performance than parent

<details>
<summary><strong>View Answers</strong></summary>

1. **B** - Throwing new exceptions violates the parent's contract. Code calling the method doesn't expect exceptions and will break. A is fine (extending behavior), C is fine (optimization doesn't change contract), D is common pattern.

2. **B** - Bird.fly() has a contract: "birds can fly, this method makes them fly". Penguin.fly() throws an exception, breaking this contract. Code calling bird.fly() doesn't expect exceptions. The swim() method is fine - adding new capabilities doesn't violate LSP.

3. **B** - Don't use inheritance. Square and Rectangle should both inherit from Shape, or Square should compose a Rectangle. Inheritance should only model true IS-A relationships where behavior is preserved.

4. **B** - Strengthening preconditions violates LSP. If parent accepts any positive number, child can't require number > 100. The parent's constraints are the contract; children can't be stricter. A, C, D don't affect substitutability.

</details>

</details>

---

## 4. Interface Segregation Principle (ISP)

**Definition**: No client should be forced to depend on methods it does not use. Instead of one large interface, create smaller, more specific interfaces so that clients only need to know about the methods that are relevant to them.

**Real-world analogy**: Think of a Swiss Army knife vs. specialized tools. A woodworker doesn't need a knife with a can opener, scissors, and screwdriver - they need specialized woodworking tools. Similarly, classes shouldn't be forced to implement methods they don't need.

### What This Means:

- **Many small interfaces** are better than one large interface
- **Clients shouldn't depend on unused methods**: Avoid "fat" interfaces
- **Interfaces should be role-specific**: Each interface represents one capability
- **Better than empty implementations**: Don't force NotImplementedError

### Why ISP Matters:

- **Reduces coupling**: Classes only depend on what they use
- **Easier to understand**: Small, focused interfaces are clearer
- **More flexible**: Easy to implement multiple small interfaces
- **Prevents breaking changes**: Changes to unused methods don't affect clients

### Common Violations:

1. **Fat interfaces**: One interface with many unrelated methods
2. **Empty implementations**: Implementing methods with no-ops or exceptions
3. **Forcing unnecessary dependencies**: Class depends on methods it never calls

<details>
<summary><strong>View Examples</strong></summary>

```typescript
// TypeScript - Interface Segregation Principle

// ============================================
// BAD Example: Violating ISP - Fat Interface
// ============================================

// One giant interface with everything
interface WorkerBad {
  work(): void;
  eat(): void;
  sleep(): void;
  attendMeeting(): void;
  submitReport(): void;
  writeCode(): void;
  designUI(): void;
}

// Human worker implements all methods
class HumanWorker implements WorkerBad {
  work(): void {
    console.log("Human working...");
  }

  eat(): void {
    console.log("Human eating lunch...");
  }

  sleep(): void {
    console.log("Human sleeping...");
  }

  attendMeeting(): void {
    console.log("Human attending meeting...");
  }

  submitReport(): void {
    console.log("Human submitting report...");
  }

  writeCode(): void {
    console.log("Human writing code...");
  }

  designUI(): void {
    console.log("Human designing UI...");
  }
}

// Robot worker is FORCED to implement methods it doesn't need
class RobotWorker implements WorkerBad {
  work(): void {
    console.log("Robot working 24/7...");
  }

  // Robots don't eat or sleep - forced to implement anyway!
  eat(): void {
    throw new Error("Robots don't eat!");
  }

  sleep(): void {
    throw new Error("Robots don't sleep!");
  }

  // Robot doesn't attend meetings
  attendMeeting(): void {
    throw new Error("Robots don't attend meetings!");
  }

  submitReport(): void {
    console.log("Robot generating automated report...");
  }

  writeCode(): void {
    console.log("Robot writing code...");
  }

  designUI(): void {
    throw new Error("Robots can't design UI!");
  }
}

console.log("=== ISP Violation - Fat Interface ===\n");

function makeWorkerEat(worker: WorkerBad): void {
  worker.eat(); // Will crash for RobotWorker!
}

makeWorkerEat(new HumanWorker()); // Works
try {
  makeWorkerEat(new RobotWorker()); // Crashes!
} catch (e) {
  console.log(`Error: ${e.message}`);
}

// ============================================
// GOOD Example: Following ISP - Segregated Interfaces
// ============================================

// Small, focused interfaces
interface Workable {
  work(): void;
}

interface Eatable {
  eat(): void;
}

interface Sleepable {
  sleep(): void;
}

interface MeetingAttendable {
  attendMeeting(): void;
}

interface Reportable {
  submitReport(): void;
}

interface Codeable {
  writeCode(): void;
}

interface UIDesignable {
  designUI(): void;
}

// Human implements all relevant interfaces
class HumanWorkerGood implements 
  Workable, Eatable, Sleepable, MeetingAttendable, Reportable, Codeable, UIDesignable {
  
  work(): void {
    console.log("Human working...");
  }

  eat(): void {
    console.log("Human eating lunch...");
  }

  sleep(): void {
    console.log("Human sleeping...");
  }

  attendMeeting(): void {
    console.log("Human attending meeting...");
  }

  submitReport(): void {
    console.log("Human submitting report...");
  }

  writeCode(): void {
    console.log("Human writing code...");
  }

  designUI(): void {
    console.log("Human designing UI...");
  }
}

// Robot only implements what it can do
class RobotWorkerGood implements Workable, Reportable, Codeable {
  work(): void {
    console.log("Robot working 24/7...");
  }

  submitReport(): void {
    console.log("Robot generating automated report...");
  }

  writeCode(): void {
    console.log("Robot writing code...");
  }
}

// Manager only needs to attend meetings and submit reports
class Manager implements MeetingAttendable, Reportable {
  attendMeeting(): void {
    console.log("Manager attending meeting...");
  }

  submitReport(): void {
    console.log("Manager submitting strategic report...");
  }
}

// Functions depend only on what they need
function makeWorkableWork(worker: Workable): void {
  worker.work(); // Works with any Workable
}

function feedWorker(worker: Eatable): void {
  worker.eat(); // Only accepts Eatable workers
}

function organizeManagement(person: MeetingAttendable & Reportable): void {
  person.attendMeeting();
  person.submitReport();
}

console.log("\n=== ISP Compliant - Segregated Interfaces ===\n");

const human = new HumanWorkerGood();
const robot = new RobotWorkerGood();
const manager = new Manager();

makeWorkableWork(human);  // ✓
makeWorkableWork(robot);  // ✓

feedWorker(human);        // ✓
// feedWorker(robot);     // ✗ Compile error - robot is not Eatable

organizeManagement(human);    // ✓
organizeManagement(manager);  // ✓
// organizeManagement(robot); // ✗ Compile error

// ============================================
// Real-World Example: Document Processing
// ============================================

// BAD: Fat interface
interface DocumentBad {
  open(): void;
  save(): void;
  print(): void;
  fax(): void;
  scan(): void;
  email(): void;
  encrypt(): void;
  compress(): void;
}

// Modern document - doesn't fax!
class ModernDocument implements DocumentBad {
  open(): void { console.log("Opening document..."); }
  save(): void { console.log("Saving document..."); }
  print(): void { console.log("Printing document..."); }
  
  fax(): void {
    throw new Error("Fax is obsolete!"); // Forced to implement
  }
  
  scan(): void { console.log("Scanning document..."); }
  email(): void { console.log("Emailing document..."); }
  encrypt(): void { console.log("Encrypting document..."); }
  compress(): void { console.log("Compressing document..."); }
}

// GOOD: Segregated interfaces
interface Openable {
  open(): void;
}

interface Saveable {
  save(): void;
}

interface Printable {
  print(): void;
}

interface Faxable {
  fax(): void;
}

interface Scannable {
  scan(): void;
}

interface Emailable {
  email(): void;
}

interface Encryptable {
  encrypt(): void;
}

interface Compressible {
  compress(): void;
}

// Modern document implements only what it needs
class ModernDocumentGood implements 
  Openable, Saveable, Printable, Scannable, Emailable, Encryptable, Compressible {
  
  open(): void { console.log("Opening document..."); }
  save(): void { console.log("Saving document..."); }
  print(): void { console.log("Printing document..."); }
  scan(): void { console.log("Scanning document..."); }
  email(): void { console.log("Emailing document..."); }
  encrypt(): void { console.log("Encrypting document..."); }
  compress(): void { console.log("Compressing document..."); }
}

// Legacy document supports fax
class LegacyDocument implements Openable, Saveable, Printable, Faxable {
  open(): void { console.log("Opening legacy document..."); }
  save(): void { console.log("Saving to disk..."); }
  print(): void { console.log("Printing..."); }
  fax(): void { console.log("Sending fax..."); }
}

// Read-only document - no save
class ReadOnlyDocument implements Openable, Printable {
  open(): void { console.log("Opening read-only document..."); }
  print(): void { console.log("Printing..."); }
}

// Functions depend on specific capabilities
function printDocument(doc: Printable): void {
  doc.print();
}

function secureAndSend(doc: Encryptable & Emailable): void {
  doc.encrypt();
  doc.email();
}

console.log("\n=== ISP Document Processing ===\n");

const modernDoc = new ModernDocumentGood();
const legacyDoc = new LegacyDocument();
const readOnlyDoc = new ReadOnlyDocument();

printDocument(modernDoc);   // ✓
printDocument(legacyDoc);   // ✓
printDocument(readOnlyDoc); // ✓

secureAndSend(modernDoc);   // ✓
// secureAndSend(legacyDoc); // ✗ Compile error - no encrypt/email
// secureAndSend(readOnlyDoc); // ✗ Compile error

// ============================================
// Real-World Example: Database Operations
// ============================================

// BAD: One interface for all database operations
interface DatabaseBad {
  connect(): void;
  disconnect(): void;
  executeQuery(query: string): any[];
  executeUpdate(query: string): number;
  beginTransaction(): void;
  commit(): void;
  rollback(): void;
  backup(): void;
  restore(): void;
  optimize(): void;
  vacuum(): void;
  analyze(): void;
}

// Read-only connection forced to implement write operations!
class ReadOnlyConnection implements DatabaseBad {
  connect(): void { console.log("Connected (read-only)"); }
  disconnect(): void { console.log("Disconnected"); }
  executeQuery(query: string): any[] { 
    console.log(`Executing: ${query}`);
    return []; 
  }
  
  // Forced to implement these even though read-only!
  executeUpdate(query: string): number {
    throw new Error("Cannot update in read-only mode!");
  }
  beginTransaction(): void {
    throw new Error("Cannot start transaction in read-only mode!");
  }
  commit(): void {
    throw new Error("Cannot commit in read-only mode!");
  }
  rollback(): void {
    throw new Error("Cannot rollback in read-only mode!");
  }
  backup(): void {
    throw new Error("Cannot backup in read-only mode!");
  }
  restore(): void {
    throw new Error("Cannot restore in read-only mode!");
  }
  optimize(): void {
    throw new Error("Cannot optimize in read-only mode!");
  }
  vacuum(): void {
    throw new Error("Cannot vacuum in read-only mode!");
  }
  analyze(): void { 
    console.log("Analyzing query performance...");
  }
}

// GOOD: Segregated database interfaces
interface Connectable {
  connect(): void;
  disconnect(): void;
}

interface Queryable {
  executeQuery(query: string): any[];
}

interface Updatable {
  executeUpdate(query: string): number;
}

interface Transactional {
  beginTransaction(): void;
  commit(): void;
  rollback(): void;
}

interface Backupable {
  backup(): void;
  restore(): void;
}

interface Optimizable {
  optimize(): void;
  vacuum(): void;
  analyze(): void;
}

// Read-only connection implements only what it needs
class ReadOnlyConnectionGood implements Connectable, Queryable, Optimizable {
  connect(): void {
    console.log("Connected (read-only)");
  }

  disconnect(): void {
    console.log("Disconnected");
  }

  executeQuery(query: string): any[] {
    console.log(`Executing read query: ${query}`);
    return [];
  }

  optimize(): void {
    console.log("Optimizing queries...");
  }

  vacuum(): void {
    console.log("Analyzing query performance...");
  }

  analyze(): void {
    console.log("Running analysis...");
  }
}

// Full connection implements everything
class FullDatabaseConnection implements 
  Connectable, Queryable, Updatable, Transactional, Backupable, Optimizable {
  
  connect(): void { console.log("Connected (full access)"); }
  disconnect(): void { console.log("Disconnected"); }
  executeQuery(query: string): any[] { 
    console.log(`Executing query: ${query}`);
    return []; 
  }
  executeUpdate(query: string): number { 
    console.log(`Executing update: ${query}`);
    return 1; 
  }
  beginTransaction(): void { console.log("Transaction started"); }
  commit(): void { console.log("Transaction committed"); }
  rollback(): void { console.log("Transaction rolled back"); }
  backup(): void { console.log("Backing up database..."); }
  restore(): void { console.log("Restoring database..."); }
  optimize(): void { console.log("Optimizing database..."); }
  vacuum(): void { console.log("Vacuuming database..."); }
  analyze(): void { console.log("Analyzing database..."); }
}

// Analytics connection - only reads and analyzes
class AnalyticsConnection implements Connectable, Queryable, Optimizable {
  connect(): void { console.log("Connected (analytics)"); }
  disconnect(): void { console.log("Disconnected"); }
  executeQuery(query: string): any[] {
    console.log(`Executing analytics query: ${query}`);
    return [];
  }
  optimize(): void { console.log("Optimizing for analytics..."); }
  vacuum(): void { console.log("Cleaning analytics cache..."); }
  analyze(): void { console.log("Running statistical analysis..."); }
}

// Functions use only required interfaces
function runReports(db: Queryable): void {
  const results = db.executeQuery("SELECT * FROM reports");
  console.log("Reports generated");
}

function performMaintenance(db: Backupable & Optimizable): void {
  db.backup();
  db.optimize();
}

function safeUpdate(db: Transactional & Updatable): void {
  db.beginTransaction();
  try {
    db.executeUpdate("UPDATE users SET active = 1");
    db.commit();
  } catch (e) {
    db.rollback();
  }
}

console.log("\n=== ISP Database Operations ===\n");

const readOnly = new ReadOnlyConnectionGood();
const fullDb = new FullDatabaseConnection();
const analytics = new AnalyticsConnection();

runReports(readOnly);    // ✓
runReports(fullDb);      // ✓
runReports(analytics);   // ✓

performMaintenance(fullDb);     // ✓
// performMaintenance(readOnly); // ✗ No backup capability

safeUpdate(fullDb);      // ✓
// safeUpdate(readOnly); // ✗ No update/transaction capability
// safeUpdate(analytics); // ✗ No update/transaction capability

// ============================================
// Key Takeaways
// ============================================

console.log("\n=== ISP Key Takeaways ===");
console.log("Problems with fat interfaces:");
console.log("  ❌ Classes forced to implement unused methods");
console.log("  ❌ Empty implementations or throwing exceptions");
console.log("  ❌ Tight coupling to irrelevant functionality");
console.log("  ❌ Changes to unused methods still affect clients");
console.log("\nBenefits of segregated interfaces:");
console.log("  ✓ Classes implement only what they need");
console.log("  ✓ Loose coupling - depend on minimal interface");
console.log("  ✓ Easy to understand - small, focused contracts");
console.log("  ✓ Flexible - combine interfaces as needed");
console.log("  ✓ Changes isolated to relevant clients");
```

```python
# Python - Interface Segregation Principle

from abc import ABC, abstractmethod
from typing import Protocol, List, Any

# ============================================
# BAD Example: Violating ISP - Fat Interface
# ============================================

class WorkerBad(ABC):
    @abstractmethod
    def work(self) -> None:
        pass
    
    @abstractmethod
    def eat(self) -> None:
        pass
    
    @abstractmethod
    def sleep(self) -> None:
        pass
    
    @abstractmethod
    def attend_meeting(self) -> None:
        pass
    
    @abstractmethod
    def submit_report(self) -> None:
        pass
    
    @abstractmethod
    def write_code(self) -> None:
        pass
    
    @abstractmethod
    def design_ui(self) -> None:
        pass

class HumanWorker(WorkerBad):
    def work(self) -> None:
        print("Human working...")
    
    def eat(self) -> None:
        print("Human eating lunch...")
    
    def sleep(self) -> None:
        print("Human sleeping...")
    
    def attend_meeting(self) -> None:
        print("Human attending meeting...")
    
    def submit_report(self) -> None:
        print("Human submitting report...")
    
    def write_code(self) -> None:
        print("Human writing code...")
    
    def design_ui(self) -> None:
        print("Human designing UI...")

class RobotWorker(WorkerBad):
    def work(self) -> None:
        print("Robot working 24/7...")
    
    def eat(self) -> None:
        raise NotImplementedError("Robots don't eat!")
    
    def sleep(self) -> None:
        raise NotImplementedError("Robots don't sleep!")
    
    def attend_meeting(self) -> None:
        raise NotImplementedError("Robots don't attend meetings!")
    
    def submit_report(self) -> None:
        print("Robot generating automated report...")
    
    def write_code(self) -> None:
        print("Robot writing code...")
    
    def design_ui(self) -> None:
        raise NotImplementedError("Robots can't design UI!")

print("=== ISP Violation - Fat Interface ===\n")

def make_worker_eat(worker: WorkerBad) -> None:
    worker.eat()

make_worker_eat(HumanWorker())  # Works

try:
    make_worker_eat(RobotWorker())  # Crashes!
except NotImplementedError as e:
    print(f"Error: {e}")

# ============================================
# GOOD Example: Following ISP
# ============================================

class Workable(Protocol):
    def work(self) -> None: ...

class Eatable(Protocol):
    def eat(self) -> None: ...

class Sleepable(Protocol):
    def sleep(self) -> None: ...

class MeetingAttendable(Protocol):
    def attend_meeting(self) -> None: ...

class Reportable(Protocol):
    def submit_report(self) -> None: ...

class Codeable(Protocol):
    def write_code(self) -> None: ...

class UIDesignable(Protocol):
    def design_ui(self) -> None: ...

class HumanWorkerGood:
    def work(self) -> None:
        print("Human working...")
    
    def eat(self) -> None:
        print("Human eating lunch...")
    
    def sleep(self) -> None:
        print("Human sleeping...")
    
    def attend_meeting(self) -> None:
        print("Human attending meeting...")
    
    def submit_report(self) -> None:
        print("Human submitting report...")
    
    def write_code(self) -> None:
        print("Human writing code...")
    
    def design_ui(self) -> None:
        print("Human designing UI...")

class RobotWorkerGood:
    def work(self) -> None:
        print("Robot working 24/7...")
    
    def submit_report(self) -> None:
        print("Robot generating automated report...")
    
    def write_code(self) -> None:
        print("Robot writing code...")

class Manager:
    def attend_meeting(self) -> None:
        print("Manager attending meeting...")
    
    def submit_report(self) -> None:
        print("Manager submitting strategic report...")

def make_workable_work(worker: Workable) -> None:
    worker.work()

def feed_worker(worker: Eatable) -> None:
    worker.eat()

def organize_management(person: MeetingAttendable) -> None:
    if hasattr(person, 'submit_report'):
        person.attend_meeting()
        person.submit_report()

print("\n=== ISP Compliant - Segregated Interfaces ===\n")

human = HumanWorkerGood()
robot = RobotWorkerGood()
manager = Manager()

make_workable_work(human)
make_workable_work(robot)

feed_worker(human)
# feed_worker(robot)  # Would fail - robot doesn't implement Eatable

organize_management(human)
organize_management(manager)

# ============================================
# Real-World Example: Document Processing
# ============================================

# BAD: Fat interface
class DocumentBad(ABC):
    @abstractmethod
    def open(self) -> None: pass
    
    @abstractmethod
    def save(self) -> None: pass
    
    @abstractmethod
    def print(self) -> None: pass
    
    @abstractmethod
    def fax(self) -> None: pass
    
    @abstractmethod
    def scan(self) -> None: pass
    
    @abstractmethod
    def email(self) -> None: pass
    
    @abstractmethod
    def encrypt(self) -> None: pass
    
    @abstractmethod
    def compress(self) -> None: pass

# GOOD: Segregated interfaces
class Openable(Protocol):
    def open(self) -> None: ...

class Saveable(Protocol):
    def save(self) -> None: ...

class Printable(Protocol):
    def print(self) -> None: ...

class Faxable(Protocol):
    def fax(self) -> None: ...

class Scannable(Protocol):
    def scan(self) -> None: ...

class Emailable(Protocol):
    def email(self) -> None: ...

class Encryptable(Protocol):
    def encrypt(self) -> None: ...

class Compressible(Protocol):
    def compress(self) -> None: ...

class ModernDocumentGood:
    def open(self) -> None:
        print("Opening document...")
    
    def save(self) -> None:
        print("Saving document...")
    
    def print(self) -> None:
        print("Printing document...")
    
    def scan(self) -> None:
        print("Scanning document...")
    
    def email(self) -> None:
        print("Emailing document...")
    
    def encrypt(self) -> None:
        print("Encrypting document...")
    
    def compress(self) -> None:
        print("Compressing document...")

class LegacyDocument:
    def open(self) -> None:
        print("Opening legacy document...")
    
    def save(self) -> None:
        print("Saving to disk...")
    
    def print(self) -> None:
        print("Printing...")
    
    def fax(self) -> None:
        print("Sending fax...")

class ReadOnlyDocument:
    def open(self) -> None:
        print("Opening read-only document...")
    
    def print(self) -> None:
        print("Printing...")

def print_document(doc: Printable) -> None:
    doc.print()

def secure_and_send(doc: Encryptable) -> None:
    if hasattr(doc, 'email'):
        doc.encrypt()
        doc.email()

print("\n=== ISP Document Processing ===\n")

modern_doc = ModernDocumentGood()
legacy_doc = LegacyDocument()
readonly_doc = ReadOnlyDocument()

print_document(modern_doc)
print_document(legacy_doc)
print_document(readonly_doc)

secure_and_send(modern_doc)

# ============================================
# Real-World Example: Database Operations
# ============================================

class Connectable(Protocol):
    def connect(self) -> None: ...
    def disconnect(self) -> None: ...

class Queryable(Protocol):
    def execute_query(self, query: str) -> List[Any]: ...

class Updatable(Protocol):
    def execute_update(self, query: str) -> int: ...

class Transactional(Protocol):
    def begin_transaction(self) -> None: ...
    def commit(self) -> None: ...
    def rollback(self) -> None: ...

class Backupable(Protocol):
    def backup(self) -> None: ...
    def restore(self) -> None: ...

class Optimizable(Protocol):
    def optimize(self) -> None: ...
    def vacuum(self) -> None: ...
    def analyze(self) -> None: ...

class ReadOnlyConnectionGood:
    def connect(self) -> None:
        print("Connected (read-only)")
    
    def disconnect(self) -> None:
        print("Disconnected")
    
    def execute_query(self, query: str) -> List[Any]:
        print(f"Executing read query: {query}")
        return []
    
    def optimize(self) -> None:
        print("Optimizing queries...")
    
    def vacuum(self) -> None:
        print("Analyzing query performance...")
    
    def analyze(self) -> None:
        print("Running analysis...")

class FullDatabaseConnection:
    def connect(self) -> None:
        print("Connected (full access)")
    
    def disconnect(self) -> None:
        print("Disconnected")
    
    def execute_query(self, query: str) -> List[Any]:
        print(f"Executing query: {query}")
        return []
    
    def execute_update(self, query: str) -> int:
        print(f"Executing update: {query}")
        return 1
    
    def begin_transaction(self) -> None:
        print("Transaction started")
    
    def commit(self) -> None:
        print("Transaction committed")
    
    def rollback(self) -> None:
        print("Transaction rolled back")
    
    def backup(self) -> None:
        print("Backing up database...")
    
    def restore(self) -> None:
        print("Restoring database...")
    
    def optimize(self) -> None:
        print("Optimizing database...")
    
    def vacuum(self) -> None:
        print("Vacuuming database...")
    
    def analyze(self) -> None:
        print("Analyzing database...")

def run_reports(db: Queryable) -> None:
    results = db.execute_query("SELECT * FROM reports")
    print("Reports generated")

def perform_maintenance(db: Backupable) -> None:
    if hasattr(db, 'optimize'):
        db.backup()
        db.optimize()

def safe_update(db: Transactional) -> None:
    if hasattr(db, 'execute_update'):
        db.begin_transaction()
        try:
            db.execute_update("UPDATE users SET active = 1")
            db.commit()
        except Exception:
            db.rollback()

print("\n=== ISP Database Operations ===\n")

read_only = ReadOnlyConnectionGood()
full_db = FullDatabaseConnection()

run_reports(read_only)
run_reports(full_db)

perform_maintenance(full_db)

safe_update(full_db)

print("\n=== ISP Key Takeaways ===")
print("Problems with fat interfaces:")
print("  ❌ Classes forced to implement unused methods")
print("  ❌ Empty implementations or throwing exceptions")
print("  ❌ Tight coupling to irrelevant functionality")
print("\nBenefits of segregated interfaces:")
print("  ✓ Classes implement only what they need")
print("  ✓ Loose coupling - depend on minimal interface")
print("  ✓ Easy to understand - small, focused contracts")
print("  ✓ Flexible - combine interfaces as needed")
```

</details>

---

