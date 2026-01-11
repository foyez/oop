# 3.1 Single Responsibility Principle (SRP)

[← Back to Inroduction](00-introduction.md) | [Next: Open/Closed Principle →](02-ocp.md) | [↑ Back to README](../README.md)

---

## What is SRP?

**"A class should have only ONE reason to change"**

Also stated as: **"A class should have only ONE job/responsibility"**

### Core Concept

Each class should focus on doing ONE thing well, rather than trying to handle multiple unrelated responsibilities.

### Real-World Analogy

**Restaurant Staff:**
- 👨‍🍳 Chef - Cooks food (ONE job)
- 🧑‍💼 Waiter - Serves customers (ONE job)
- 💰 Cashier - Handles payments (ONE job)

❌ **Bad**: One person cooks, serves, AND handles payments
✅ **Good**: Each person has ONE specific role

---

## Why SRP?

### 1. Easier to Understand
One purpose per class makes code clearer

### 2. Easier to Maintain
Changes to one responsibility don't affect others

### 3. Easier to Test
Each class has one thing to test

### 4. Easier to Reuse
Single-purpose classes can be reused in different contexts

---

## Identifying Violations

### Questions to Ask:
1. Does this class have more than one reason to change?
2. If I describe the class, do I use "AND"?
3. Are there unrelated methods in this class?

### Example of Violation

```python
# ❌ BAD - Multiple responsibilities
class User:
    def __init__(self, name, email):
        self.name = name
        self.email = email
    
    def save_to_database(self):
        # Database responsibility
        print(f"Saving {self.name} to database...")
    
    def send_email(self):
        # Email responsibility
        print(f"Sending email to {self.email}...")
    
    def generate_report(self):
        # Reporting responsibility
        print(f"Generating report for {self.name}...")
    
    def validate_email(self):
        # Validation responsibility
        return '@' in self.email

# Reasons to change:
# 1. User data structure changes
# 2. Database changes
# 3. Email service changes
# 4. Report format changes
# 5. Validation rules change
```

---

## Applying SRP

### ✅ Fixed Example

```python
class User:
    """Single responsibility: Hold user data"""
    def __init__(self, name, email):
        self.name = name
        self.email = email

class UserRepository:
    """Single responsibility: Database operations"""
    def save(self, user):
        print(f"Saving {user.name} to database...")
        return True

class EmailService:
    """Single responsibility: Sending emails"""
    def send_email(self, user, message):
        print(f"Sending email to {user.email}: {message}")
        return True

class ReportGenerator:
    """Single responsibility: Generate reports"""
    def generate_user_report(self, user):
        print(f"Generating report for {user.name}...")
        return f"Report for {user.name}"

class EmailValidator:
    """Single responsibility: Email validation"""
    @staticmethod
    def is_valid(email):
        return '@' in email and '.' in email

# Usage
user = User("Alice", "alice@example.com")

if EmailValidator.is_valid(user.email):
    repo = UserRepository()
    repo.save(user)
    
    email_service = EmailService()
    email_service.send_email(user, "Welcome!")
    
    report_gen = ReportGenerator()
    report_gen.generate_user_report(user)
```

Now each class has ONE reason to change!

---

## Real-World Example: Order Processing

### ❌ Violation

```python
class Order:
    def __init__(self, items):
        self.items = items
        self.total = 0
    
    def calculate_total(self):
        """Business logic"""
        self.total = sum(item['price'] * item['quantity'] for item in self.items)
    
    def save_to_database(self):
        """Database operation"""
        print(f"Saving order with total ${self.total}")
    
    def send_confirmation_email(self, email):
        """Email operation"""
        print(f"Sending confirmation to {email}")
    
    def generate_invoice(self):
        """Invoice generation"""
        print("Generating PDF invoice...")
    
    def process_payment(self, card_number):
        """Payment processing"""
        print(f"Processing payment of ${self.total}")
    
    def update_inventory(self):
        """Inventory management"""
        for item in self.items:
            print(f"Reducing stock for {item['name']}")

# Too many responsibilities!
```

### ✅ SRP Applied

```python
class Order:
    """Responsibility: Hold order data"""
    def __init__(self, items):
        self.items = items
        self.total = 0
    
    def calculate_total(self):
        self.total = sum(item['price'] * item['quantity'] for item in self.items)
        return self.total

class OrderRepository:
    """Responsibility: Database operations"""
    def save(self, order):
        print(f"Saving order with total ${order.total} to database")
        return True
    
    def find_by_id(self, order_id):
        print(f"Finding order {order_id}")
        return None

class EmailNotificationService:
    """Responsibility: Email notifications"""
    def send_order_confirmation(self, order, customer_email):
        print(f"Sending confirmation to {customer_email}")
        print(f"Order total: ${order.total}")
        return True

class InvoiceGenerator:
    """Responsibility: Generate invoices"""
    def generate(self, order):
        print("Generating PDF invoice...")
        return f"Invoice for order total: ${order.total}"

class PaymentProcessor:
    """Responsibility: Process payments"""
    def process(self, amount, card_number):
        print(f"Processing payment of ${amount}")
        # Simulate payment processing
        return {"status": "success", "transaction_id": "TXN123"}

class InventoryManager:
    """Responsibility: Manage inventory"""
    def reduce_stock(self, items):
        for item in items:
            print(f"Reducing stock for {item['name']} by {item['quantity']}")
        return True

# Usage - orchestration
items = [
    {"name": "Laptop", "price": 1000, "quantity": 1},
    {"name": "Mouse", "price": 25, "quantity": 2}
]

order = Order(items)
order.calculate_total()

# Each service has one job
repo = OrderRepository()
repo.save(order)

email_service = EmailNotificationService()
email_service.send_order_confirmation(order, "customer@example.com")

invoice_gen = InvoiceGenerator()
invoice_gen.generate(order)

payment_proc = PaymentProcessor()
payment_proc.process(order.total, "1234-5678-9012-3456")

inventory = InventoryManager()
inventory.reduce_stock(order.items)
```

---

## Common SRP Violations

### 1. God Objects

```python
# ❌ BAD - Does everything
class ApplicationManager:
    def manage_users(self): pass
    def process_payments(self): pass
    def send_emails(self): pass
    def generate_reports(self): pass
    def handle_logging(self): pass
    def manage_cache(self): pass
    # ... 50 more methods

# ✅ GOOD - Separate concerns
class UserManager: pass
class PaymentProcessor: pass
class EmailService: pass
class ReportGenerator: pass
class Logger: pass
class CacheManager: pass
```

### 2. Mixed Concerns

```python
# ❌ BAD - Business logic + presentation
class Employee:
    def calculate_salary(self):
        # Business logic
        return self.hours * self.rate
    
    def display_payslip(self):
        # Presentation logic
        print("=" * 30)
        print(f"Employee: {self.name}")
        print(f"Salary: ${self.calculate_salary()}")
        print("=" * 30)

# ✅ GOOD - Separate concerns
class Employee:
    def calculate_salary(self):
        return self.hours * self.rate

class PayslipPrinter:
    def print_payslip(self, employee):
        print("=" * 30)
        print(f"Employee: {employee.name}")
        print(f"Salary: ${employee.calculate_salary()}")
        print("=" * 30)
```

### 3. Data + Persistence

```python
# ❌ BAD - Data model knows about database
class Product:
    def __init__(self, name, price):
        self.name = name
        self.price = price
    
    def save(self):
        # Database logic in data model
        import sqlite3
        conn = sqlite3.connect('products.db')
        # ...

# ✅ GOOD - Separate data from persistence
class Product:
    def __init__(self, name, price):
        self.name = name
        self.price = price

class ProductRepository:
    def save(self, product):
        import sqlite3
        conn = sqlite3.connect('products.db')
        # ...
```

---

## Practice Questions

<details>
<summary><strong>View Questions</strong></summary>

### Fill in the Gaps

1. The Single Responsibility Principle states that a class should have only __________ reason to change.
2. SRP helps make code easier to __________, __________, and __________.
3. A class that has multiple responsibilities is often called a __________ object.
4. If you describe a class using the word "________", it likely violates SRP.
5. SRP is about separating __________ so that each class has one specific purpose.

<details>
<summary><strong>View Answers</strong></summary>

1. ONE (or one)
2. understand, maintain, test (any order)
3. God
4. AND
5. concerns (or responsibilities)

</details>

### True/False

1. A class should do only one thing and do it well according to SRP.
2. Having multiple methods in a class always violates SRP.
3. SRP makes testing easier because each class has a focused responsibility.
4. It's acceptable for a User class to handle database operations if users need to be saved.
5. SRP is only applicable to classes, not to functions or modules.
6. Following SRP typically results in more classes but each is simpler.

<details>
<summary><strong>View Answers</strong></summary>

1. True - This is the core principle of SRP.
2. False - Multiple methods are fine if they all relate to the same responsibility. It's about cohesion.
3. True - Testing is easier when each class has a single, well-defined purpose.
4. False - Database operations should be in a separate Repository class, not in the data model itself.
5. False - SRP applies to classes, functions, modules, and even microservices.
6. True - SRP often increases the number of classes but makes each one simpler and more focused.

</details>

### Multiple Choice Questions

1. Which class violates SRP?
   - A) `class User` with `name` and `email` attributes
   - B) `class EmailSender` with `send()` method
   - C) `class Product` with `save()` and `calculate_price()` methods
   - D) `class Logger` with `log()` method

2. What is the main benefit of SRP?
   - A) Fewer classes
   - B) Faster execution
   - C) Easier to maintain and modify
   - D) Less code to write

3. A "God Object" is:
   - A) A very important class
   - B) A class with too many responsibilities
   - C) A class that other classes inherit from
   - D) An abstract base class

4. Which is a valid reason for a `BankAccount` class to change?
   - A) Email service provider changes
   - B) Account data structure changes
   - C) Report format changes
   - D) Database schema changes

5. SRP states that a class should have how many reasons to change?
   - A) None
   - B) One
   - C) Two
   - D) As many as needed

<details>
<summary><strong>View Answers</strong></summary>

1. C) A Product class should not handle its own persistence (save method should be in a repository)
2. C) Easier to maintain and modify - Each change affects only one class
3. B) A class with too many responsibilities - violates SRP
4. B) Account data structure changes - This directly relates to BankAccount's responsibility
5. B) One - A class should have only ONE reason to change

</details>

### Code Challenges

**Challenge: Refactor to Follow SRP**

Refactor this class to follow SRP:

```python
class BlogPost:
    def __init__(self, title, content, author):
        self.title = title
        self.content = content
        self.author = author
    
    def save_to_database(self):
        print(f"Saving '{self.title}' to database")
    
    def send_notification(self):
        print(f"Notifying followers about '{self.title}'")
    
    def format_as_html(self):
        return f"<h1>{self.title}</h1><p>{self.content}</p>"
    
    def format_as_json(self):
        import json
        return json.dumps({
            "title": self.title,
            "content": self.content,
            "author": self.author
        })
```

<details>
<summary><strong>View Solution</strong></summary>

```python
# Data model - ONE responsibility: hold blog post data
class BlogPost:
    def __init__(self, title, content, author):
        self.title = title
        self.content = content
        self.author = author

# Repository - ONE responsibility: database operations
class BlogPostRepository:
    def save(self, post):
        print(f"Saving '{post.title}' to database")
        return True
    
    def find_by_id(self, post_id):
        print(f"Finding post {post_id}")
        return None

# Notification - ONE responsibility: notify followers
class NotificationService:
    def notify_new_post(self, post):
        print(f"Notifying followers about '{post.title}'")
        return True

# Formatters - ONE responsibility each: format data
class HTMLFormatter:
    def format(self, post):
        return f"<h1>{post.title}</h1><p>{post.content}</p><small>By {post.author}</small>"

class JSONFormatter:
    def format(self, post):
        import json
        return json.dumps({
            "title": post.title,
            "content": post.content,
            "author": post.author
        })

class MarkdownFormatter:
    def format(self, post):
        return f"# {post.title}\n\n{post.content}\n\n*By {post.author}*"

# Usage
post = BlogPost("SRP in Python", "Single Responsibility...", "Alice")

# Each service has one job
repo = BlogPostRepository()
repo.save(post)

notifier = NotificationService()
notifier.notify_new_post(post)

html_formatter = HTMLFormatter()
print(html_formatter.format(post))

json_formatter = JSONFormatter()
print(json_formatter.format(post))
```

</details>

</details>

---

## Summary

### Key Takeaways

1. **ONE responsibility per class**
2. **ONE reason to change**
3. **Easier** to understand, test, maintain
4. **Avoid** God objects
5. **Separate** concerns

### How to Apply SRP

1. Identify responsibilities in existing classes
2. Extract each responsibility into its own class
3. Keep classes focused and cohesive
4. Test each class independently

---

[← Back to Inroduction](00-introduction.md) | [Next: Open/Closed Principle →](02-ocp.md) | [↑ Back to README](../README.md)