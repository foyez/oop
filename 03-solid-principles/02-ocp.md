# 3.2 Open/Closed Principle (OCP)

[← Back to SRP](01-srp.md) | [Next: Liskov Substitution →](03-lsp.md) | [↑ Back to README](../README.md)

---

## What is OCP?

**"Software entities should be OPEN for extension but CLOSED for modification"**

### Core Concept

- **OPEN for extension**: You can add new functionality
- **CLOSED for modification**: Without changing existing code

### Real-World Analogy

**Smartphone:**
- ✅ OPEN: Install new apps (extend functionality)
- ✅ CLOSED: Don't modify phone's hardware/OS

**Power outlet:**
- ✅ OPEN: Plug in different devices
- ✅ CLOSED: Don't rewire the outlet

---

## Why OCP?

### 1. Stability
Existing code remains untouched and stable

### 2. Reduced Risk
No chance of breaking working code

### 3. Easier Testing
New features tested independently

### 4. Scalability
Easy to add new features

---

## Violation Example

```python
# ❌ BAD - Must modify class for every new discount type
class DiscountCalculator:
    def calculate_discount(self, customer_type, amount):
        if customer_type == "regular":
            return amount * 0.0  # No discount
        elif customer_type == "silver":
            return amount * 0.10
        elif customer_type == "gold":
            return amount * 0.20
        elif customer_type == "platinum":
            return amount * 0.30
        # Need to modify this method for every new customer type!
        # What if we add "diamond" tier?
```

**Problems:**
1. Must modify existing code
2. Risk breaking existing discounts
3. Violates OCP

---

## OCP Applied

```python
from abc import ABC, abstractmethod

# ✅ GOOD - Open for extension, closed for modification
class DiscountStrategy(ABC):
    @abstractmethod
    def calculate_discount(self, amount):
        pass

class NoDiscount(DiscountStrategy):
    def calculate_discount(self, amount):
        return 0

class SilverDiscount(DiscountStrategy):
    def calculate_discount(self, amount):
        return amount * 0.10

class GoldDiscount(DiscountStrategy):
    def calculate_discount(self, amount):
        return amount * 0.20

class PlatinumDiscount(DiscountStrategy):
    def calculate_discount(self, amount):
        return amount * 0.30

# Add new discount WITHOUT modifying existing code
class DiamondDiscount(DiscountStrategy):
    def calculate_discount(self, amount):
        return amount * 0.40

class DiscountCalculator:
    def __init__(self, strategy: DiscountStrategy):
        self.strategy = strategy
    
    def calculate(self, amount):
        return self.strategy.calculate_discount(amount)

# Usage
calc = DiscountCalculator(SilverDiscount())
print(f"Discount: ${calc.calculate(100)}")

# Easy to switch strategies
calc.strategy = DiamondDiscount()
print(f"Discount: ${calc.calculate(100)}")
```

---

## Real-World Example: Payment Processing

### ❌ Violation

```python
class PaymentProcessor:
    def process_payment(self, payment_type, amount):
        if payment_type == "credit_card":
            print(f"Processing ${amount} via Credit Card")
            # Credit card logic
        elif payment_type == "paypal":
            print(f"Processing ${amount} via PayPal")
            # PayPal logic
        elif payment_type == "bitcoin":
            print(f"Processing ${amount} via Bitcoin")
            # Bitcoin logic
        # Must modify for every new payment method!
```

### ✅ OCP Applied

```python
from abc import ABC, abstractmethod

class PaymentMethod(ABC):
    @abstractmethod
    def process(self, amount):
        pass

class CreditCardPayment(PaymentMethod):
    def process(self, amount):
        print(f"Processing ${amount} via Credit Card")
        return {"status": "success", "method": "credit_card"}

class PayPalPayment(PaymentMethod):
    def process(self, amount):
        print(f"Processing ${amount} via PayPal")
        return {"status": "success", "method": "paypal"}

class BitcoinPayment(PaymentMethod):
    def process(self, amount):
        print(f"Processing ${amount} via Bitcoin")
        return {"status": "success", "method": "bitcoin"}

# Add new payment method WITHOUT modifying existing code
class ApplePayPayment(PaymentMethod):
    def process(self, amount):
        print(f"Processing ${amount} via Apple Pay")
        return {"status": "success", "method": "apple_pay"}

class PaymentProcessor:
    def __init__(self, payment_method: PaymentMethod):
        self.payment_method = payment_method
    
    def process_payment(self, amount):
        return self.payment_method.process(amount)

# Usage - easy to add new methods
processor = PaymentProcessor(CreditCardPayment())
processor.process_payment(100)

processor.payment_method = ApplePayPayment()
processor.process_payment(50)
```

---

## Practice Questions

<details>
<summary><strong>View Questions</strong></summary>

### Fill in the Gaps

1. OCP states that software should be __________ for extension but __________ for modification.
2. Following OCP reduces __________ because existing code remains untouched.
3. The __________ pattern is commonly used to implement OCP.
4. When adding new features requires modifying existing code, you are __________ OCP.
5. OCP makes systems more __________ because new functionality can be added easily.

<details>
<summary><strong>View Answers</strong></summary>

1. OPEN (or open), CLOSED (or closed)
2. risk
3. Strategy
4. violating
5. scalable (or extensible/maintainable)

</details>

### True/False

1. OCP means you should never modify existing code under any circumstances.
2. Adding a new class that implements an interface follows OCP.
3. Using if-else chains for different behaviors typically violates OCP.
4. OCP and the Strategy pattern are closely related.
5. Following OCP usually results in fewer classes.

<details>
<summary><strong>View Answers</strong></summary>

1. False - OCP means you shouldn't need to modify existing code when adding new features. Bug fixes are acceptable.
2. True - This extends functionality without modifying existing code.
3. True - Long if-else chains for behaviors usually indicate OCP violation.
4. True - Strategy pattern is a common way to implement OCP.
5. False - OCP usually increases the number of classes but makes the system more extensible.

</details>

### Multiple Choice Questions

1. Which violates OCP?
   - A) Adding a new class that implements an interface
   - B) Modifying an existing class to add a new feature
   - C) Creating a new subclass
   - D) Injecting a new dependency

2. What's the main benefit of OCP?
   - A) Less code
   - B) Faster execution
   - C) Can add features without breaking existing code
   - D) Fewer classes

3. Which pattern best demonstrates OCP?
   - A) Singleton
   - B) Strategy
   - C) Factory
   - D) Observer

<details>
<summary><strong>View Answers</strong></summary>

1. B) Modifying an existing class to add a new feature
2. C) Can add features without breaking existing code
3. B) Strategy - Allows adding new behaviors by adding new classes

</details>

</details>

---

[← Back to SRP](01-srp.md) | [Next: Liskov Substitution →](03-lsp.md) | [↑ Back to README](../README.md)