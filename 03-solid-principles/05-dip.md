# 3.5 Dependency Inversion Principle (DIP)

[← Back to ISP](04-isp.md) | [Next: Advanced Concepts →](../04-advanced-concepts/01-composition-vs-inheritance.md) | [↑ Back to README](../README.md)

---

## What is DIP?

**"Depend on abstractions (interfaces, abstract classes, etc), not on concretions (specific implementations)"**

### Simple example (non-code)

**Abstraction:**

> “Payment method”

**Concretions:**

* Credit card
* PayPal
* Bank transfer

If your system depends on *“payment method”* instead of *“PayPal specifically”*, you can swap payment methods without rewriting everything.

### Code example

**Abstraction**

```java
interface PaymentService {
    void pay(double amount);
}
```

**Concretions**

```java
class PayPalPayment implements PaymentService {
    public void pay(double amount) { ... }
}

class CreditCardPayment implements PaymentService {
    public void pay(double amount) { ... }
}
```

**Depending on the abstraction**

```java
class OrderService {
    private PaymentService paymentService;

    OrderService(PaymentService paymentService) {
        this.paymentService = paymentService;
    }
}
```

Here, `OrderService` doesn’t care *which* payment method it gets — just that it follows the **PaymentService abstraction**.

### Why this matters

Depending on abstractions makes your code:

* ✅ Easier to change
* ✅ Easier to test (mock implementations)
* ✅ Less fragile
* ✅ More flexible and scalable

### Two key points:
1. High-level modules should not depend on low-level modules. Both should depend on abstractions.
2. Abstractions should not depend on details. Details should depend on abstractions.

### Core Concept

Classes should depend on interfaces/abstract classes, not concrete implementations.

### Real-World Analogy

**Power Outlet:**
- ❌ Device hardwired to specific power plant
- ✅ Device plugs into standard outlet (abstraction)

**USB Port:**
- ❌ Computer built for one specific device
- ✅ USB standard works with any USB device

---

## Violation Example

```python
# ❌ BAD - Depends on concrete class
class MySQLDatabase:
    def connect(self):
        return "Connected to MySQL"

class UserService:
    def __init__(self):
        self.database = MySQLDatabase()  # Tight coupling!
    
    def get_user(self):
        connection = self.database.connect()
        return f"{connection}, fetching user"

# Problem: Can't easily switch to PostgreSQL
```

---

## DIP Applied

```python
# ✅ GOOD - Depends on abstraction
from abc import ABC, abstractmethod

class Database(ABC):
    @abstractmethod
    def connect(self):
        pass

class MySQLDatabase(Database):
    def connect(self):
        return "Connected to MySQL"

class PostgreSQLDatabase(Database):
    def connect(self):
        return "Connected to PostgreSQL"

class UserService:
    def __init__(self, database: Database):  # Depends on abstraction!
        self.database = database
    
    def get_user(self):
        connection = self.database.connect()
        return f"{connection}, fetching user"

# Easy to switch databases
service = UserService(MySQLDatabase())
service = UserService(PostgreSQLDatabase())
```

---

## Practice Questions

<details>
<summary><strong>View Questions</strong></summary>

### Fill in the Gaps

1. DIP states that we should depend on __________, not on __________.
2. High-level modules should not depend on __________ modules.
3. DIP promotes __________ coupling between modules.
4. Dependency __________ is a technique to implement DIP.

<details>
<summary><strong>View Answers</strong></summary>

1. abstractions, concretions (or concrete classes/implementations)
2. low-level
3. loose
4. Injection (or injection)

</details>

</details>

---

[← Back to ISP](04-isp.md) | [Next: Advanced Concepts →](../04-advanced-concepts/01-composition-vs-inheritance.md) | [↑ Back to README](../README.md)