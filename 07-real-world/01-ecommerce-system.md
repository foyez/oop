# 7.1 E-Commerce System Design

[← Back to Best Practices](../06-best-practices/02-best-practices.md) | [Next: Banking System →](02-banking-system.md) | [↑ Back to README](../README.md)

---

## System Overview

Design an **e-commerce platform** like Amazon or eBay using OOP principles.

### Core Requirements

**Features:**
- Product catalog
- Shopping cart
- Order processing
- Payment processing
- User management
- Inventory management

**Design Goals:**
- ✅ Scalable
- ✅ Maintainable
- ✅ Extensible
- ✅ Testable

---

## Class Design

### 1. Product Hierarchy

```python
from abc import ABC, abstractmethod
from enum import Enum
from datetime import datetime

class ProductCategory(Enum):
    ELECTRONICS = "electronics"
    CLOTHING = "clothing"
    BOOKS = "books"
    HOME = "home"
    FOOD = "food"

class Product(ABC):
    """Base product class"""
    def __init__(self, product_id, name, price, description):
        self.product_id = product_id
        self.name = name
        self.price = price
        self.description = description
        self.category = None
        self.reviews = []
    
    @abstractmethod
    def get_shipping_cost(self, destination):
        """Different products may have different shipping costs"""
        pass
    
    def add_review(self, review):
        self.reviews.append(review)
    
    def get_average_rating(self):
        if not self.reviews:
            return 0
        return sum(r.rating for r in self.reviews) / len(self.reviews)
    
    def __str__(self):
        return f"{self.name} - ${self.price}"

class PhysicalProduct(Product):
    """Physical products that need shipping"""
    def __init__(self, product_id, name, price, description, weight, dimensions):
        super().__init__(product_id, name, price, description)
        self.weight = weight  # in kg
        self.dimensions = dimensions  # (length, width, height) in cm
    
    def get_shipping_cost(self, destination):
        # Calculate based on weight and dimensions
        base_cost = 5.0
        weight_cost = self.weight * 2.0
        
        # Dimensional weight
        dim_weight = (self.dimensions[0] * self.dimensions[1] * self.dimensions[2]) / 5000
        
        return base_cost + max(weight_cost, dim_weight * 2.0)

class DigitalProduct(Product):
    """Digital products (ebooks, software, etc.)"""
    def __init__(self, product_id, name, price, description, file_size, download_link):
        super().__init__(product_id, name, price, description)
        self.file_size = file_size  # in MB
        self.download_link = download_link
    
    def get_shipping_cost(self, destination):
        return 0  # No shipping for digital products
    
    def get_download_link(self):
        # Could add authentication, expiry, etc.
        return self.download_link

class PerishableProduct(PhysicalProduct):
    """Perishable products (food, flowers, etc.)"""
    def __init__(self, product_id, name, price, description, weight, dimensions, expiry_date):
        super().__init__(product_id, name, price, description, weight, dimensions)
        self.expiry_date = expiry_date
    
    def is_expired(self):
        return datetime.now() > self.expiry_date
    
    def get_shipping_cost(self, destination):
        # Expedited shipping for perishables
        base_cost = super().get_shipping_cost(destination)
        return base_cost * 1.5  # 50% premium for fast delivery
```

### 2. Shopping Cart

```python
class CartItem:
    """Individual item in cart"""
    def __init__(self, product, quantity):
        self.product = product
        self.quantity = quantity
    
    def get_subtotal(self):
        return self.product.price * self.quantity
    
    def __str__(self):
        return f"{self.product.name} x {self.quantity} = ${self.get_subtotal()}"

class ShoppingCart:
    """Shopping cart with items"""
    def __init__(self):
        self.items = []
    
    def add_item(self, product, quantity=1):
        # Check if product already in cart
        for item in self.items:
            if item.product.product_id == product.product_id:
                item.quantity += quantity
                return
        
        # Add new item
        self.items.append(CartItem(product, quantity))
    
    def remove_item(self, product_id):
        self.items = [item for item in self.items if item.product.product_id != product_id]
    
    def update_quantity(self, product_id, quantity):
        for item in self.items:
            if item.product.product_id == product_id:
                if quantity <= 0:
                    self.remove_item(product_id)
                else:
                    item.quantity = quantity
                return
    
    def get_subtotal(self):
        return sum(item.get_subtotal() for item in self.items)
    
    def get_shipping_cost(self, destination):
        return sum(item.product.get_shipping_cost(destination) * item.quantity 
                  for item in self.items)
    
    def get_total(self, destination):
        return self.get_subtotal() + self.get_shipping_cost(destination)
    
    def clear(self):
        self.items = []
    
    def __str__(self):
        if not self.items:
            return "Cart is empty"
        
        result = "Shopping Cart:\n"
        for item in self.items:
            result += f"  {item}\n"
        result += f"Subtotal: ${self.get_subtotal()}"
        return result
```

### 3. Payment Processing (Strategy Pattern)

```python
from abc import ABC, abstractmethod

class PaymentStrategy(ABC):
    """Payment strategy interface"""
    @abstractmethod
    def process_payment(self, amount):
        pass
    
    @abstractmethod
    def refund(self, transaction_id, amount):
        pass

class CreditCardPayment(PaymentStrategy):
    def __init__(self, card_number, cvv, expiry_date, name):
        self.card_number = card_number
        self.cvv = cvv
        self.expiry_date = expiry_date
        self.name = name
    
    def process_payment(self, amount):
        # Validate card
        if not self._validate_card():
            raise ValueError("Invalid card details")
        
        # Process payment (simplified)
        print(f"Processing ${amount} via Credit Card ending in {self.card_number[-4:]}")
        
        return {
            "success": True,
            "transaction_id": f"CC_{datetime.now().timestamp()}",
            "amount": amount,
            "method": "credit_card"
        }
    
    def _validate_card(self):
        # Simplified validation
        return len(self.card_number) == 16 and len(self.cvv) == 3
    
    def refund(self, transaction_id, amount):
        print(f"Refunding ${amount} to card ending in {self.card_number[-4:]}")
        return {
            "success": True,
            "refund_id": f"REF_{datetime.now().timestamp()}",
            "amount": amount
        }

class PayPalPayment(PaymentStrategy):
    def __init__(self, email, password):
        self.email = email
        self.password = password
    
    def process_payment(self, amount):
        print(f"Processing ${amount} via PayPal account {self.email}")
        
        return {
            "success": True,
            "transaction_id": f"PP_{datetime.now().timestamp()}",
            "amount": amount,
            "method": "paypal"
        }
    
    def refund(self, transaction_id, amount):
        print(f"Refunding ${amount} to PayPal account {self.email}")
        return {
            "success": True,
            "refund_id": f"REF_{datetime.now().timestamp()}",
            "amount": amount
        }

class CryptoPayment(PaymentStrategy):
    def __init__(self, wallet_address):
        self.wallet_address = wallet_address
    
    def process_payment(self, amount):
        print(f"Processing ${amount} via Cryptocurrency")
        
        return {
            "success": True,
            "transaction_id": f"CRYPTO_{datetime.now().timestamp()}",
            "amount": amount,
            "method": "crypto"
        }
    
    def refund(self, transaction_id, amount):
        print(f"Refunding ${amount} to wallet {self.wallet_address[:8]}...")
        return {
            "success": True,
            "refund_id": f"REF_{datetime.now().timestamp()}",
            "amount": amount
        }
```

### 4. Order Management

```python
from enum import Enum

class OrderStatus(Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class Order:
    """Order entity"""
    order_counter = 1000
    
    def __init__(self, customer, items, shipping_address):
        Order.order_counter += 1
        self.order_id = f"ORD{Order.order_counter}"
        self.customer = customer
        self.items = items  # List of CartItem objects
        self.shipping_address = shipping_address
        self.status = OrderStatus.PENDING
        self.created_at = datetime.now()
        self.payment_info = None
        self.tracking_number = None
    
    def get_subtotal(self):
        return sum(item.get_subtotal() for item in self.items)
    
    def get_shipping_cost(self):
        return sum(item.product.get_shipping_cost(self.shipping_address) * item.quantity 
                  for item in self.items)
    
    def get_tax(self):
        # Simplified tax calculation (10%)
        return self.get_subtotal() * 0.10
    
    def get_total(self):
        return self.get_subtotal() + self.get_shipping_cost() + self.get_tax()
    
    def confirm(self, payment_result):
        if payment_result["success"]:
            self.status = OrderStatus.CONFIRMED
            self.payment_info = payment_result
            return True
        return False
    
    def ship(self, tracking_number):
        if self.status == OrderStatus.CONFIRMED:
            self.status = OrderStatus.SHIPPED
            self.tracking_number = tracking_number
            return True
        return False
    
    def deliver(self):
        if self.status == OrderStatus.SHIPPED:
            self.status = OrderStatus.DELIVERED
            return True
        return False
    
    def cancel(self):
        if self.status in [OrderStatus.PENDING, OrderStatus.CONFIRMED]:
            self.status = OrderStatus.CANCELLED
            return True
        return False
    
    def __str__(self):
        result = f"Order #{self.order_id}\n"
        result += f"Status: {self.status.value}\n"
        result += f"Customer: {self.customer.name}\n"
        result += f"Items:\n"
        for item in self.items:
            result += f"  - {item}\n"
        result += f"Subtotal: ${self.get_subtotal():.2f}\n"
        result += f"Shipping: ${self.get_shipping_cost():.2f}\n"
        result += f"Tax: ${self.get_tax():.2f}\n"
        result += f"Total: ${self.get_total():.2f}"
        return result
```

### 5. User Management

```python
class Address:
    def __init__(self, street, city, state, zip_code, country):
        self.street = street
        self.city = city
        self.state = state
        self.zip_code = zip_code
        self.country = country
    
    def __str__(self):
        return f"{self.street}, {self.city}, {self.state} {self.zip_code}, {self.country}"

class Customer:
    """Customer entity"""
    def __init__(self, customer_id, name, email):
        self.customer_id = customer_id
        self.name = name
        self.email = email
        self.addresses = []
        self.orders = []
        self.cart = ShoppingCart()
    
    def add_address(self, address):
        self.addresses.append(address)
    
    def place_order(self, shipping_address, payment_strategy):
        if not self.cart.items:
            raise ValueError("Cart is empty")
        
        # Create order from cart
        order = Order(self, self.cart.items.copy(), shipping_address)
        
        # Process payment
        total = order.get_total()
        payment_result = payment_strategy.process_payment(total)
        
        # Confirm order
        if order.confirm(payment_result):
            self.orders.append(order)
            self.cart.clear()
            return order
        else:
            raise ValueError("Payment failed")
    
    def get_order_history(self):
        return self.orders

class Guest:
    """Guest user (no account)"""
    def __init__(self, email):
        self.email = email
        self.cart = ShoppingCart()
    
    def checkout(self, shipping_address, payment_strategy):
        # Similar to customer but no order history
        if not self.cart.items:
            raise ValueError("Cart is empty")
        
        order = Order(self, self.cart.items.copy(), shipping_address)
        total = order.get_total()
        payment_result = payment_strategy.process_payment(total)
        
        if order.confirm(payment_result):
            self.cart.clear()
            return order
        else:
            raise ValueError("Payment failed")
```

### 6. Inventory Management

```python
class InventoryItem:
    """Inventory tracking for a product"""
    def __init__(self, product, quantity, reorder_level=10):
        self.product = product
        self.quantity = quantity
        self.reorder_level = reorder_level
    
    def is_in_stock(self):
        return self.quantity > 0
    
    def needs_reorder(self):
        return self.quantity <= self.reorder_level
    
    def reserve(self, quantity):
        """Reserve stock for an order"""
        if self.quantity >= quantity:
            self.quantity -= quantity
            return True
        return False
    
    def restock(self, quantity):
        self.quantity += quantity
    
    def __str__(self):
        status = "In Stock" if self.is_in_stock() else "Out of Stock"
        reorder = " (Needs Reorder)" if self.needs_reorder() else ""
        return f"{self.product.name}: {self.quantity} units {status}{reorder}"

class Inventory:
    """Inventory management system"""
    def __init__(self):
        self.items = {}  # product_id -> InventoryItem
    
    def add_product(self, product, quantity, reorder_level=10):
        self.items[product.product_id] = InventoryItem(product, quantity, reorder_level)
    
    def get_stock(self, product_id):
        if product_id in self.items:
            return self.items[product_id].quantity
        return 0
    
    def is_available(self, product_id, quantity):
        return self.get_stock(product_id) >= quantity
    
    def reserve_stock(self, cart_items):
        """Reserve stock for all items in cart"""
        # Check availability first
        for item in cart_items:
            if not self.is_available(item.product.product_id, item.quantity):
                raise ValueError(f"Insufficient stock for {item.product.name}")
        
        # Reserve all items
        for item in cart_items:
            self.items[item.product.product_id].reserve(item.quantity)
    
    def restock_product(self, product_id, quantity):
        if product_id in self.items:
            self.items[product_id].restock(quantity)
    
    def get_low_stock_items(self):
        return [item for item in self.items.values() if item.needs_reorder()]
```

---

## Complete Usage Example

```python
def main():
    # Create products
    laptop = PhysicalProduct(
        "P001", "Gaming Laptop", 1299.99, 
        "High-performance gaming laptop",
        2.5, (35, 25, 2)
    )
    
    ebook = DigitalProduct(
        "P002", "Python Programming", 29.99,
        "Learn Python programming",
        50, "https://download.example.com/python-book.pdf"
    )
    
    strawberries = PerishableProduct(
        "P003", "Fresh Strawberries", 4.99,
        "Organic strawberries",
        0.5, (15, 15, 10),
        datetime(2025, 1, 15)
    )
    
    # Setup inventory
    inventory = Inventory()
    inventory.add_product(laptop, 10)
    inventory.add_product(ebook, 1000)
    inventory.add_product(strawberries, 50)
    
    # Create customer
    customer = Customer("C001", "John Doe", "john@example.com")
    
    # Add shipping address
    address = Address(
        "123 Main St", "New York", "NY", "10001", "USA"
    )
    customer.add_address(address)
    
    # Add items to cart
    customer.cart.add_item(laptop, 1)
    customer.cart.add_item(ebook, 2)
    customer.cart.add_item(strawberries, 3)
    
    print(customer.cart)
    print(f"\nTotal: ${customer.cart.get_total(address):.2f}")
    
    # Reserve stock
    inventory.reserve_stock(customer.cart.items)
    
    # Create payment method
    payment = CreditCardPayment(
        "1234567890123456", "123", "12/25", "John Doe"
    )
    
    # Place order
    order = customer.place_order(address, payment)
    
    print(f"\n{order}")
    
    # Check inventory after order
    print("\n=== Inventory Status ===")
    for item in inventory.items.values():
        print(item)

if __name__ == "__main__":
    main()
```

---

## Design Patterns Used

### 1. **Strategy Pattern**
- Payment methods (CreditCard, PayPal, Crypto)
- Easy to add new payment types

### 2. **Template Method Pattern**
- Product base class with `get_shipping_cost()`
- Subclasses implement specific logic

### 3. **Factory Pattern** (Implied)
- Could add ProductFactory to create different product types

### 4. **Observer Pattern** (Could Add)
- Notify customers when order status changes
- Alert when low stock

---

## SOLID Principles Applied

### Single Responsibility
- ✅ `Product` - Product data
- ✅ `ShoppingCart` - Cart operations
- ✅ `Order` - Order management
- ✅ `Inventory` - Stock management

### Open/Closed
- ✅ Easy to add new product types (extend Product)
- ✅ Easy to add payment methods (extend PaymentStrategy)

### Liskov Substitution
- ✅ Any Product can be used interchangeably
- ✅ Any PaymentStrategy works with checkout

### Interface Segregation
- ✅ PaymentStrategy has only payment-related methods
- ✅ Product has only product-related methods

### Dependency Inversion
- ✅ Order depends on PaymentStrategy interface
- ✅ Not tied to specific payment implementation

---

## Interview Questions

<details>
<summary><strong>View Questions</strong></summary>

### Q1: How would you add a discount system?

<details>
<summary><strong>View Answer</strong></summary>

**Use Strategy or Decorator Pattern:**

```python
class DiscountStrategy(ABC):
    @abstractmethod
    def apply_discount(self, total):
        pass

class PercentageDiscount(DiscountStrategy):
    def __init__(self, percentage):
        self.percentage = percentage
    
    def apply_discount(self, total):
        return total * (1 - self.percentage / 100)

class FixedAmountDiscount(DiscountStrategy):
    def __init__(self, amount):
        self.amount = amount
    
    def apply_discount(self, total):
        return max(0, total - self.amount)

class Order:
    def __init__(self, customer, items, shipping_address, discount=None):
        # ... existing code ...
        self.discount = discount
    
    def get_total(self):
        total = self.get_subtotal() + self.get_shipping_cost() + self.get_tax()
        if self.discount:
            total = self.discount.apply_discount(total)
        return total
```

</details>

### Q2: How would you handle product variants (size, color)?

<details>
<summary><strong>View Answer</strong></summary>

**Add ProductVariant class:**

```python
class ProductVariant:
    def __init__(self, product, attributes, price_adjustment=0):
        self.product = product
        self.attributes = attributes  # {"size": "L", "color": "Red"}
        self.price_adjustment = price_adjustment
        self.sku = self._generate_sku()
    
    def _generate_sku(self):
        attrs = "_".join(f"{k}_{v}" for k, v in sorted(self.attributes.items()))
        return f"{self.product.product_id}_{attrs}"
    
    def get_price(self):
        return self.product.price + self.price_adjustment
    
    def __str__(self):
        attrs = ", ".join(f"{k}: {v}" for k, v in self.attributes.items())
        return f"{self.product.name} ({attrs}) - ${self.get_price()}"

# Usage
tshirt = PhysicalProduct("P004", "T-Shirt", 19.99, "Cotton t-shirt", 0.2, (30, 20, 1))

red_large = ProductVariant(tshirt, {"size": "L", "color": "Red"}, 0)
blue_small = ProductVariant(tshirt, {"size": "S", "color": "Blue"}, 0)
```

</details>

### Q3: How would you implement order tracking notifications?

<details>
<summary><strong>View Answer</strong></summary>

**Use Observer Pattern:**

```python
class OrderObserver(ABC):
    @abstractmethod
    def update(self, order, event):
        pass

class EmailNotifier(OrderObserver):
    def update(self, order, event):
        print(f"Sending email to {order.customer.email}: Order {event}")

class SMSNotifier(OrderObserver):
    def update(self, order, event):
        print(f"Sending SMS: Order {event}")

class Order:
    def __init__(self, customer, items, shipping_address):
        # ... existing code ...
        self.observers = []
    
    def attach(self, observer):
        self.observers.append(observer)
    
    def _notify(self, event):
        for observer in self.observers:
            observer.update(self, event)
    
    def confirm(self, payment_result):
        if payment_result["success"]:
            self.status = OrderStatus.CONFIRMED
            self._notify("confirmed")
            return True
        return False
    
    def ship(self, tracking_number):
        if self.status == OrderStatus.CONFIRMED:
            self.status = OrderStatus.SHIPPED
            self.tracking_number = tracking_number
            self._notify(f"shipped - Tracking: {tracking_number}")
            return True
        return False

# Usage
order = Order(customer, items, address)
order.attach(EmailNotifier())
order.attach(SMSNotifier())
```

</details>

</details>

---

## Summary

### Key Design Decisions

1. **Inheritance Hierarchy** - Product types with shared behavior
2. **Strategy Pattern** - Payment methods
3. **Composition** - Cart contains items
4. **Separation of Concerns** - Each class has one job
5. **Extensibility** - Easy to add products, payments, notifications

### Best Practices Used

- ✅ SOLID principles
- ✅ Design patterns
- ✅ Clear abstractions
- ✅ Testable code
- ✅ Maintainable structure

---

[← Back to Best Practices](../06-best-practices/02-best-practices.md) | [Next: Banking System →](02-banking-system.md) | [↑ Back to README](../README.md)