# 6.1 Anti-Patterns

[← Back to Design Patterns](../05-design-patterns/03-behavioral-patterns.md) | [Next: Best Practices →](02-best-practices.md) | [↑ Back to README](../README.md)

---

## What are Anti-Patterns?

**Anti-patterns** are common solutions to recurring problems that appear helpful but actually make things worse.

### Key Concept

**"A pattern that looks like a solution but creates more problems than it solves"**

Think of it as **"what NOT to do"** in software design.

### Real-World Analogy

**Using duct tape to fix everything:**
- Seems quick and easy
- Works temporarily
- Creates bigger problems later
- Hard to maintain

---

## 1. God Object / God Class 👑

### The Problem

**A single class that knows too much or does too much.**

### Why It's Bad

❌ Violates Single Responsibility Principle  
❌ Hard to test  
❌ Hard to maintain  
❌ Hard to understand  
❌ Creates tight coupling

### Example

```python
# ❌ BAD - God Object
class Application:
    def __init__(self):
        self.users = []
        self.products = []
        self.orders = []
        self.db_connection = None
    
    # User management
    def create_user(self, name, email):
        # Validation logic
        if not email or '@' not in email:
            raise ValueError("Invalid email")
        # Database logic
        self.db_connection.execute("INSERT INTO users...")
        # Email logic
        self.send_welcome_email(email)
    
    def send_welcome_email(self, email):
        # Email sending logic
        pass
    
    # Product management
    def add_product(self, name, price):
        # Validation
        # Database
        # Inventory update
        pass
    
    # Order processing
    def create_order(self, user_id, product_ids):
        # Order validation
        # Payment processing
        # Email notification
        # Inventory update
        # Database operations
        pass
    
    # Database operations
    def connect_to_database(self): pass
    def execute_query(self, query): pass
    
    # Email operations
    def send_email(self, to, subject, body): pass
    
    # Payment processing
    def process_payment(self, amount): pass
    
    # Reporting
    def generate_report(self): pass
    
    # Logging
    def log(self, message): pass
    
    # ... 50 more methods!
```

### ✅ Solution: Split Responsibilities

```python
# ✅ GOOD - Separate responsibilities

class User:
    def __init__(self, name, email):
        self.name = name
        self.email = email

class UserRepository:
    def __init__(self, db):
        self.db = db
    
    def save(self, user):
        self.db.execute("INSERT INTO users...")

class UserValidator:
    @staticmethod
    def validate_email(email):
        if not email or '@' not in email:
            raise ValueError("Invalid email")

class EmailService:
    def send_welcome_email(self, email):
        # Email sending logic
        pass

class UserService:
    def __init__(self, repository, validator, email_service):
        self.repository = repository
        self.validator = validator
        self.email_service = email_service
    
    def create_user(self, name, email):
        self.validator.validate_email(email)
        user = User(name, email)
        self.repository.save(user)
        self.email_service.send_welcome_email(email)
        return user

# Similarly split Product, Order, etc.
```

### How to Identify

🚩 **Warning signs:**
- Class has more than 500-1000 lines
- Class has more than 10-15 methods
- Class name is too generic (Manager, Handler, Util, Helper)
- Multiple "and" when describing class purpose
- Difficult to name the class specifically

---

## 2. Spaghetti Code 🍝

### The Problem

**Code with complex, tangled control structures that are hard to follow.**

### Why It's Bad

❌ Hard to understand  
❌ Hard to debug  
❌ Hard to modify  
❌ High coupling  
❌ No clear structure

### Example

```python
# ❌ BAD - Spaghetti Code
def process_order(order_data):
    if order_data:
        if 'user_id' in order_data:
            user = get_user(order_data['user_id'])
            if user:
                if user.is_active:
                    if 'items' in order_data:
                        total = 0
                        for item in order_data['items']:
                            if item['quantity'] > 0:
                                product = get_product(item['product_id'])
                                if product:
                                    if product.stock >= item['quantity']:
                                        total += product.price * item['quantity']
                                        product.stock -= item['quantity']
                                        save_product(product)
                                    else:
                                        return {"error": "Not enough stock"}
                                else:
                                    return {"error": "Product not found"}
                            else:
                                return {"error": "Invalid quantity"}
                        
                        if total > 0:
                            if user.balance >= total:
                                user.balance -= total
                                save_user(user)
                                order = create_order(user.id, order_data['items'], total)
                                send_email(user.email, "Order confirmation")
                                return {"success": True, "order_id": order.id}
                            else:
                                return {"error": "Insufficient balance"}
                        else:
                            return {"error": "Empty order"}
                    else:
                        return {"error": "No items"}
                else:
                    return {"error": "User not active"}
            else:
                return {"error": "User not found"}
        else:
            return {"error": "Missing user_id"}
    else:
        return {"error": "No data"}
```

### ✅ Solution: Extract Methods & Early Returns

```python
# ✅ GOOD - Clean, structured code

def process_order(order_data):
    # Validate input
    validation_error = validate_order_data(order_data)
    if validation_error:
        return {"error": validation_error}
    
    # Get user
    user = get_active_user(order_data['user_id'])
    if not user:
        return {"error": "Invalid or inactive user"}
    
    # Calculate total
    total, stock_error = calculate_order_total(order_data['items'])
    if stock_error:
        return {"error": stock_error}
    
    # Process payment
    payment_error = process_payment(user, total)
    if payment_error:
        return {"error": payment_error}
    
    # Create order
    order = create_order(user.id, order_data['items'], total)
    
    # Send notification
    send_order_confirmation(user.email, order)
    
    return {"success": True, "order_id": order.id}

def validate_order_data(data):
    if not data:
        return "No data provided"
    if 'user_id' not in data:
        return "Missing user_id"
    if 'items' not in data or not data['items']:
        return "No items in order"
    return None

def get_active_user(user_id):
    user = get_user(user_id)
    if user and user.is_active:
        return user
    return None

def calculate_order_total(items):
    total = 0
    for item in items:
        if item['quantity'] <= 0:
            return 0, "Invalid quantity"
        
        product = get_product(item['product_id'])
        if not product:
            return 0, f"Product {item['product_id']} not found"
        
        if product.stock < item['quantity']:
            return 0, f"Insufficient stock for {product.name}"
        
        total += product.price * item['quantity']
        update_product_stock(product, item['quantity'])
    
    return total, None

def process_payment(user, amount):
    if user.balance < amount:
        return "Insufficient balance"
    
    user.balance -= amount
    save_user(user)
    return None
```

### How to Identify

🚩 **Warning signs:**
- Deep nesting (more than 3-4 levels)
- Long methods (more than 50 lines)
- Many if-else chains
- Unclear variable names
- No clear flow

---

## 3. Copy-Paste Programming 📋

### The Problem

**Duplicating code instead of reusing it.**

### Why It's Bad

❌ Violates DRY (Don't Repeat Yourself)  
❌ Bug fixes need multiple changes  
❌ Inconsistent behavior  
❌ Hard to maintain

### Example

```python
# ❌ BAD - Copy-Paste Programming

def send_welcome_email(user):
    subject = "Welcome!"
    body = f"Hello {user.name}, welcome to our platform!"
    
    smtp = smtplib.SMTP('smtp.gmail.com', 587)
    smtp.starttls()
    smtp.login('admin@example.com', 'password')
    
    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = 'admin@example.com'
    msg['To'] = user.email
    
    smtp.send_message(msg)
    smtp.quit()

def send_password_reset_email(user, token):
    subject = "Password Reset"
    body = f"Hello {user.name}, here's your reset token: {token}"
    
    smtp = smtplib.SMTP('smtp.gmail.com', 587)
    smtp.starttls()
    smtp.login('admin@example.com', 'password')
    
    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = 'admin@example.com'
    msg['To'] = user.email
    
    smtp.send_message(msg)
    smtp.quit()

def send_order_confirmation_email(user, order):
    subject = "Order Confirmation"
    body = f"Hello {user.name}, your order #{order.id} is confirmed!"
    
    smtp = smtplib.SMTP('smtp.gmail.com', 587)
    smtp.starttls()
    smtp.login('admin@example.com', 'password')
    
    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = 'admin@example.com'
    msg['To'] = user.email
    
    smtp.send_message(msg)
    smtp.quit()

# Same code copied 3 times!
```

### ✅ Solution: Extract Common Logic

```python
# ✅ GOOD - DRY (Don't Repeat Yourself)

class EmailService:
    def __init__(self, smtp_host, smtp_port, username, password):
        self.smtp_host = smtp_host
        self.smtp_port = smtp_port
        self.username = username
        self.password = password
    
    def send_email(self, to, subject, body):
        """Common email sending logic"""
        smtp = smtplib.SMTP(self.smtp_host, self.smtp_port)
        smtp.starttls()
        smtp.login(self.username, self.password)
        
        msg = MIMEText(body)
        msg['Subject'] = subject
        msg['From'] = self.username
        msg['To'] = to
        
        smtp.send_message(msg)
        smtp.quit()
    
    def send_welcome_email(self, user):
        subject = "Welcome!"
        body = f"Hello {user.name}, welcome to our platform!"
        self.send_email(user.email, subject, body)
    
    def send_password_reset_email(self, user, token):
        subject = "Password Reset"
        body = f"Hello {user.name}, here's your reset token: {token}"
        self.send_email(user.email, subject, body)
    
    def send_order_confirmation_email(self, user, order):
        subject = "Order Confirmation"
        body = f"Hello {user.name}, your order #{order.id} is confirmed!"
        self.send_email(user.email, subject, body)

# Usage
email_service = EmailService('smtp.gmail.com', 587, 'admin@example.com', 'password')
email_service.send_welcome_email(user)
```

### How to Identify

🚩 **Warning signs:**
- Same code appears multiple times
- Similar methods with slight variations
- Bug fix requires changes in multiple places
- Comments like "Same as above but..."

---

## 4. Hard Coding 🔨

### The Problem

**Embedding configuration values directly in code.**

### Why It's Bad

❌ Hard to change  
❌ Different values for different environments  
❌ No flexibility  
❌ Security risks

### Example

```python
# ❌ BAD - Hard coding

class DatabaseConnection:
    def connect(self):
        # Hard-coded values!
        host = "192.168.1.100"
        port = 5432
        database = "production_db"
        username = "admin"
        password = "super_secret_123"  # Security risk!
        
        return psycopg2.connect(
            host=host,
            port=port,
            database=database,
            user=username,
            password=password
        )

class EmailService:
    def send(self, to, message):
        # Hard-coded SMTP settings
        smtp = smtplib.SMTP('smtp.gmail.com', 587)
        smtp.login('hardcoded@email.com', 'hardcoded_password')
        # ...

class APIClient:
    def get_data(self):
        # Hard-coded API endpoint
        response = requests.get('https://api.example.com/v1/data')
        # ...
```

### ✅ Solution: Use Configuration

```python
# ✅ GOOD - Configuration-based

import os
from dataclasses import dataclass

@dataclass
class DatabaseConfig:
    host: str
    port: int
    database: str
    username: str
    password: str
    
    @classmethod
    def from_env(cls):
        return cls(
            host=os.getenv('DB_HOST', 'localhost'),
            port=int(os.getenv('DB_PORT', 5432)),
            database=os.getenv('DB_NAME', 'mydb'),
            username=os.getenv('DB_USER', 'user'),
            password=os.getenv('DB_PASSWORD', '')
        )

class DatabaseConnection:
    def __init__(self, config: DatabaseConfig):
        self.config = config
    
    def connect(self):
        return psycopg2.connect(
            host=self.config.host,
            port=self.config.port,
            database=self.config.database,
            user=self.config.username,
            password=self.config.password
        )

# Usage with environment variables
config = DatabaseConfig.from_env()
db = DatabaseConnection(config)
```

**Configuration file approach:**

```python
# config.py
import json

class Config:
    def __init__(self, config_file='config.json'):
        with open(config_file) as f:
            self._config = json.load(f)
    
    def get(self, key, default=None):
        return self._config.get(key, default)

# config.json
{
    "database": {
        "host": "localhost",
        "port": 5432,
        "name": "mydb"
    },
    "email": {
        "smtp_host": "smtp.gmail.com",
        "smtp_port": 587
    },
    "api": {
        "base_url": "https://api.example.com/v1"
    }
}

# Usage
config = Config()
db_host = config.get('database')['host']
```

### How to Identify

🚩 **Warning signs:**
- URLs, passwords, API keys in code
- Environment-specific values in code
- Magic numbers without explanation
- Configuration scattered throughout code

---

## 5. Premature Optimization 🏎️

### The Problem

**Optimizing code before knowing if it's a bottleneck.**

### Why It's Bad

❌ Wastes development time  
❌ Makes code complex  
❌ May not improve actual performance  
❌ Harder to maintain

**"Premature optimization is the root of all evil"** - Donald Knuth

### Example

```python
# ❌ BAD - Premature optimization

class UserCache:
    """Overly complex caching for no proven benefit"""
    def __init__(self):
        self._cache = {}
        self._access_count = {}
        self._last_access = {}
        self._cache_hits = 0
        self._cache_misses = 0
    
    def get_user(self, user_id):
        # Complex LRU cache implementation
        # When we don't even know if caching helps!
        if user_id in self._cache:
            self._cache_hits += 1
            self._access_count[user_id] += 1
            self._last_access[user_id] = time.time()
            return self._cache[user_id]
        
        self._cache_misses += 1
        user = self._fetch_from_db(user_id)
        
        # Evict least recently used if cache is full
        if len(self._cache) > 1000:
            lru_key = min(self._last_access, key=self._last_access.get)
            del self._cache[lru_key]
            del self._access_count[lru_key]
            del self._last_access[lru_key]
        
        self._cache[user_id] = user
        return user
```

### ✅ Solution: Start Simple, Optimize When Needed

```python
# ✅ GOOD - Start simple

class UserRepository:
    def __init__(self, db):
        self.db = db
    
    def get_user(self, user_id):
        # Simple, clear implementation
        return self.db.query("SELECT * FROM users WHERE id = ?", user_id)

# If profiling shows this is a bottleneck, THEN optimize:

from functools import lru_cache

class UserRepository:
    def __init__(self, db):
        self.db = db
    
    @lru_cache(maxsize=1000)
    def get_user(self, user_id):
        return self.db.query("SELECT * FROM users WHERE id = ?", user_id)

# Or use a proven caching library
from cachetools import TTLCache

class UserRepository:
    def __init__(self, db):
        self.db = db
        self.cache = TTLCache(maxsize=1000, ttl=300)
    
    def get_user(self, user_id):
        if user_id in self.cache:
            return self.cache[user_id]
        
        user = self.db.query("SELECT * FROM users WHERE id = ?", user_id)
        self.cache[user_id] = user
        return user
```

### The Right Approach

1. **Make it work** - Write clear, correct code
2. **Make it right** - Refactor for clean design
3. **Make it fast** - Optimize if profiling shows bottleneck

```python
# Good optimization workflow

# 1. Profile first
import cProfile
cProfile.run('slow_function()')

# 2. Identify bottleneck
# Found: Database query is slow

# 3. Optimize that specific part
# Add index to database

# 4. Measure improvement
# Before: 500ms
# After: 50ms ✅
```

### How to Identify

🚩 **Warning signs:**
- Micro-optimizations without profiling
- Complex algorithms for small datasets
- "This might be slow" without evidence
- Sacrificing readability for unproven performance

---

## Interview Questions

<details>
<summary><strong>View Questions</strong></summary>

### Q1: What is a God Object and why is it bad?

<details>
<summary><strong>View Answer</strong></summary>

**God Object** is a class that knows or does too much.

**Example:**
```python
class Application:
    # Handles users, products, orders, payments,
    # emails, database, logging, reporting...
    # Everything!
```

**Why it's bad:**

1. **Violates SRP** - Multiple responsibilities
2. **Hard to test** - Too many dependencies
3. **Hard to maintain** - Changes affect everything
4. **Tight coupling** - Everything depends on it
5. **Hard to understand** - Too complex

**Solution:**
```python
# Split into focused classes
class UserService: ...
class ProductService: ...
class OrderService: ...
class EmailService: ...
class PaymentService: ...
```

**How to identify:**
- 500+ lines of code
- 10+ methods
- Generic name (Manager, Handler, Util)
- Multiple "and" in description
</details>

### Q2: What's wrong with copy-paste programming?

<details>
<summary><strong>View Answer</strong></summary>

**Copy-Paste Programming** is duplicating code instead of reusing it.

**Problems:**

1. **Violates DRY** - Don't Repeat Yourself
2. **Bug multiplication** - Fix needed in multiple places
3. **Inconsistency** - Copies diverge over time
4. **Maintenance nightmare** - More code to maintain

**Example:**
```python
# ❌ Copied 3 times
def send_welcome_email(): ...
def send_reset_email(): ...  # Same SMTP code
def send_order_email(): ...  # Same SMTP code
```

**Solution:**
```python
# ✅ Extract common code
class EmailService:
    def send_email(self, to, subject, body):
        # SMTP code here (once!)
        pass
    
    def send_welcome(self, user): ...
    def send_reset(self, user): ...
```

**Remember:** If you find yourself copying code, extract it into a function or class!
</details>

### Q3: Why is premature optimization bad?

<details>
<summary><strong>View Answer</strong></summary>

**Premature Optimization** is optimizing before knowing what's slow.

**Problems:**

1. **Wasted time** - Optimizing wrong things
2. **Complex code** - Harder to understand
3. **May not help** - Optimizing non-bottlenecks
4. **Delayed features** - Time better spent elsewhere

**Quote:** *"Premature optimization is the root of all evil"* - Donald Knuth

**Right approach:**

1. **Make it work** - Correct implementation
2. **Profile** - Find actual bottlenecks
3. **Optimize** - Only the slow parts
4. **Measure** - Verify improvement

**Example:**
```python
# ❌ Don't do this without profiling
def calculate_total(items):
    # Ultra-optimized, complex algorithm
    # for 5 items... overkill!
    pass

# ✅ Start simple
def calculate_total(items):
    return sum(item.price for item in items)

# Only optimize if profiling shows it's slow
```

**Rule:** Optimize for readability first, performance second (when proven necessary).
</details>

</details>

---

## Practice Questions

<details>
<summary><strong>View Questions</strong></summary>

### Fill in the Gaps

1. A God Object violates the __________ Principle by having too many responsibilities.
2. Spaghetti code is characterized by complex, __________ control structures.
3. Copy-paste programming violates the __________ principle.
4. Hard coding makes code __________ to change across different environments.
5. __________ optimization is optimizing before knowing what's actually slow.

<details>
<summary><strong>View Answers</strong></summary>

1. Single Responsibility
2. tangled (or nested/complex)
3. DRY (Don't Repeat Yourself)
4. difficult (or hard/inflexible)
5. Premature

</details>

### True/False

1. A God Object is acceptable if it's well-documented.
2. Spaghetti code is easier to debug than well-structured code.
3. Copy-pasting code is faster than extracting common logic in the short term.
4. Hard coding configuration values is a security risk.
5. You should always optimize code for performance from the start.
6. Deep nesting (more than 3-4 levels) is a sign of spaghetti code.
7. The DRY principle states "Don't Repeat Yourself".

<details>
<summary><strong>View Answers</strong></summary>

1. False - God Objects are anti-patterns regardless of documentation
2. False - Spaghetti code is much harder to debug
3. True - But creates technical debt and maintenance issues
4. True - Passwords and secrets should never be in code
5. False - Only optimize after profiling shows bottlenecks
6. True - Deep nesting indicates poor structure
7. True - Avoid duplicating code

</details>

### Multiple Choice Questions

1. Which is a sign of a God Object?
   - A) Class with 50 lines of code
   - B) Class with 5 methods
   - C) Class with 50 methods handling multiple concerns
   - D) Class with good documentation

2. What's the main problem with spaghetti code?
   - A) Too fast
   - B) Too simple
   - C) Complex and tangled structure
   - D) Uses too much memory

3. What does DRY stand for?
   - A) Do Repeat Yourself
   - B) Don't Repeat Yourself
   - C) Debug Regularly Yearly
   - D) Design Right Yesterday

4. Where should configuration values be stored?
   - A) Hard-coded in the code
   - B) In comments
   - C) Environment variables or config files
   - D) In variable names

5. When should you optimize code?
   - A) Always from the start
   - B) Never
   - C) After profiling shows bottlenecks
   - D) Only on Fridays

<details>
<summary><strong>View Answers</strong></summary>

1. C) Class with 50 methods handling multiple concerns - Clear God Object
2. C) Complex and tangled structure - Hard to follow and maintain
3. B) Don't Repeat Yourself - Core principle of clean code
4. C) Environment variables or config files - External configuration
5. C) After profiling shows bottlenecks - Evidence-based optimization

</details>

</details>

---

## Summary

### Key Anti-Patterns to Avoid

1. **God Object** - Split into focused classes
2. **Spaghetti Code** - Use early returns and extract methods
3. **Copy-Paste** - Follow DRY principle
4. **Hard Coding** - Use configuration
5. **Premature Optimization** - Profile first, then optimize

### Remember

✅ **DO:**
- Follow SOLID principles
- Extract repeated code
- Use configuration files
- Profile before optimizing
- Keep methods focused

❌ **DON'T:**
- Create God Objects
- Deep nesting
- Copy-paste code
- Hard code values
- Optimize prematurely

### For Interviews

Be ready to:
- ✅ Identify anti-patterns in code
- ✅ Explain why they're problematic
- ✅ Provide better alternatives
- ✅ Give real-world examples
- ✅ Discuss trade-offs

---

[← Back to Design Patterns](../05-design-patterns/03-behavioral-patterns.md) | [Next: Best Practices →](02-best-practices.md) | [↑ Back to README](../README.md)