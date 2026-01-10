# 2.2 Abstraction

[← Back to Encapsulation](01-encapsulation.md) | [Next: Inheritance →](03-inheritance.md) | [↑ Back to README](../README.md)

---

## What is Abstraction? 🎭

**Abstraction** is the practice of **hiding implementation details** and showing only **essential features** to the user.

### Core Concept

**Think of it like this:**
- You drive a car using the steering wheel, pedals, and gear shift
- You don't need to know how the engine, transmission, or fuel injection works
- The car provides a **simple interface** (steering wheel) that hides **complex mechanisms** (engine internals)

### Key Principle

**"Show WHAT an object does, not HOW it does it"**

---

## Why Abstraction?

### 1. Reduces Complexity
Users don't need to understand internal workings

```python
# Without abstraction - user needs to know implementation
def send_email_raw(smtp_server, port, username, password, to, subject, body):
    import smtplib
    server = smtplib.SMTP(smtp_server, port)
    server.starttls()
    server.login(username, password)
    message = f"Subject: {subject}\n\n{body}"
    server.sendmail(username, to, message)
    server.quit()

# With abstraction - simple interface
class EmailService:
    def send(self, to, subject, body):
        # Complex details hidden
        pass

email = EmailService()
email.send("user@example.com", "Hello", "Message")  # Simple!
```

### 2. Flexibility
Change implementation without affecting users

```python
from abc import ABC, abstractmethod

# Abstract interface
class Database(ABC):
    @abstractmethod
    def save(self, data):
        pass
    
    @abstractmethod
    def fetch(self, id):
        pass

# Implementation 1: SQL
class MySQLDatabase(Database):
    def save(self, data):
        # MySQL-specific code
        return "Saved to MySQL"
    
    def fetch(self, id):
        # MySQL-specific code
        return f"Fetched {id} from MySQL"

# Implementation 2: NoSQL
class MongoDatabase(Database):
    def save(self, data):
        # MongoDB-specific code
        return "Saved to MongoDB"
    
    def fetch(self, id):
        # MongoDB-specific code
        return f"Fetched {id} from MongoDB"

# User code doesn't care about implementation
def process_data(db: Database, data):
    db.save(data)  # Works with any database!

# Can switch databases without changing process_data
process_data(MySQLDatabase(), {"name": "Alice"})
process_data(MongoDatabase(), {"name": "Bob"})
```

### 3. Focus on Interface
Define what must be implemented, not how

---

## Real-World Analogy

### TV Remote Control

**What you see (Abstract Interface)**:
- Power button
- Volume up/down
- Channel up/down
- Number pad

**What's hidden (Implementation)**:
- Infrared signal encoding
- Battery management circuitry
- Microcontroller programming
- Signal transmission protocols

You press "Volume Up" without knowing:
- How infrared signals work
- How the TV decodes signals
- How the TV adjusts speaker voltage
- Digital signal processing algorithms

```python
# Abstract interface
class RemoteControl(ABC):
    @abstractmethod
    def power_on(self):
        pass
    
    @abstractmethod
    def volume_up(self):
        pass
    
    @abstractmethod
    def change_channel(self, channel):
        pass

# Concrete implementation - details hidden
class SamsungRemote(RemoteControl):
    def power_on(self):
        # Complex infrared encoding hidden
        self._send_ir_signal(0x40BF)
        return "TV powered on"
    
    def volume_up(self):
        # Digital signal processing hidden
        self._send_ir_signal(0x48B7)
        return "Volume increased"
    
    def change_channel(self, channel):
        # Channel encoding hidden
        self._encode_and_send(channel)
        return f"Changed to channel {channel}"
    
    def _send_ir_signal(self, code):
        # Private method - implementation detail
        pass
    
    def _encode_and_send(self, data):
        # Private method - implementation detail
        pass
```

---

## Abstract Classes vs Interfaces

### Abstract Classes (Python)

Use when you want to:
- Define a contract (what methods must exist)
- Provide some shared implementation
- Share state (attributes) among subclasses

```python
from abc import ABC, abstractmethod

class Animal(ABC):
    def __init__(self, name, age):
        self.name = name  # Shared state
        self.age = age
    
    @abstractmethod
    def make_sound(self):
        """Subclasses MUST implement this"""
        pass
    
    @abstractmethod
    def move(self):
        """Subclasses MUST implement this"""
        pass
    
    # Concrete method - shared implementation
    def sleep(self):
        return f"{self.name} is sleeping..."
    
    def get_info(self):
        return f"{self.name} is {self.age} years old"

class Dog(Animal):
    def make_sound(self):
        return "Woof! Woof!"
    
    def move(self):
        return "Running on four legs"

class Bird(Animal):
    def make_sound(self):
        return "Tweet! Tweet!"
    
    def move(self):
        return "Flying in the sky"

# Cannot instantiate abstract class
# animal = Animal("Generic", 5)  # ❌ TypeError

# Can instantiate concrete classes
dog = Dog("Buddy", 3)
print(dog.make_sound())  # Woof! Woof!
print(dog.sleep())       # Buddy is sleeping... (inherited)
print(dog.get_info())    # Buddy is 3 years old (inherited)
```

### Interfaces (Python Protocol)

Use when you only want to define a contract (no shared implementation or state):

```python
from typing import Protocol

class Drawable(Protocol):
    """Interface - only defines what methods must exist"""
    def draw(self) -> str:
        ...
    
    def get_color(self) -> str:
        ...

# No inheritance needed - duck typing!
class Circle:
    def __init__(self, radius, color):
        self.radius = radius
        self.color = color
    
    def draw(self) -> str:
        return f"Drawing a circle with radius {self.radius}"
    
    def get_color(self) -> str:
        return self.color

class Rectangle:
    def __init__(self, width, height, color):
        self.width = width
        self.height = height
        self.color = color
    
    def draw(self) -> str:
        return f"Drawing a rectangle {self.width}x{self.height}"
    
    def get_color(self) -> str:
        return self.color

# Function accepts anything with draw() and get_color()
def render(shape: Drawable):
    print(shape.draw())
    print(f"Color: {shape.get_color()}")

circle = Circle(5, "red")
rectangle = Rectangle(10, 5, "blue")

render(circle)     # Works!
render(rectangle)  # Works!
```

### TypeScript - True Interfaces

```typescript
// Interface - pure contract
interface PaymentProcessor {
    processPayment(amount: number): string;
    refund(amount: number): string;
}

// Multiple classes can implement the same interface
class CreditCardProcessor implements PaymentProcessor {
    processPayment(amount: number): string {
        return `Processing $${amount} via credit card`;
    }
    
    refund(amount: number): string {
        return `Refunding $${amount} to credit card`;
    }
}

class PayPalProcessor implements PaymentProcessor {
    processPayment(amount: number): string {
        return `Processing $${amount} via PayPal`;
    }
    
    refund(amount: number): string {
        return `Refunding $${amount} to PayPal`;
    }
}

// Function accepts any PaymentProcessor
function checkout(processor: PaymentProcessor, amount: number): void {
    console.log(processor.processPayment(amount));
}

checkout(new CreditCardProcessor(), 100);
checkout(new PayPalProcessor(), 50);
```

---

## Levels of Abstraction

### Level 1: Low-Level (No Abstraction)

```python
# User needs to know all details
import socket

def send_http_request():
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.connect(("example.com", 80))
    request = b"GET / HTTP/1.1\r\nHost: example.com\r\n\r\n"
    sock.send(request)
    response = sock.recv(4096)
    sock.close()
    return response
```

### Level 2: Medium Abstraction

```python
# Some details hidden
import requests

def send_http_request():
    response = requests.get("http://example.com")
    return response.text
```

### Level 3: High-Level Abstraction

```python
# Most details hidden
class WebScraper:
    def fetch(self, url):
        # All HTTP details hidden
        pass
    
    def parse(self, html):
        # Parsing complexity hidden
        pass

scraper = WebScraper()
data = scraper.fetch("http://example.com")
```

---

## Real-World Examples

### Example 1: Payment Processing System

```python
from abc import ABC, abstractmethod
from datetime import datetime

class PaymentMethod(ABC):
    """Abstract payment interface"""
    
    @abstractmethod
    def authorize(self, amount: float) -> bool:
        """Check if payment can be processed"""
        pass
    
    @abstractmethod
    def charge(self, amount: float) -> str:
        """Process the payment"""
        pass
    
    @abstractmethod
    def refund(self, transaction_id: str, amount: float) -> str:
        """Refund a payment"""
        pass

class CreditCard(PaymentMethod):
    def __init__(self, card_number, cvv, expiry):
        self._card_number = card_number[-4:]  # Store only last 4 digits
        self._cvv = cvv
        self._expiry = expiry
    
    def authorize(self, amount: float) -> bool:
        # Complex credit check hidden
        print(f"Authorizing ${amount} on card ****{self._card_number}")
        return True
    
    def charge(self, amount: float) -> str:
        # Complex payment gateway communication hidden
        if self.authorize(amount):
            transaction_id = f"CC_{datetime.now().timestamp()}"
            return f"Charged ${amount}. Transaction ID: {transaction_id}"
        return "Authorization failed"
    
    def refund(self, transaction_id: str, amount: float) -> str:
        # Complex refund process hidden
        return f"Refunded ${amount} for transaction {transaction_id}"

class BankTransfer(PaymentMethod):
    def __init__(self, account_number, routing_number):
        self._account = account_number[-4:]
        self._routing = routing_number
    
    def authorize(self, amount: float) -> bool:
        # Bank verification hidden
        print(f"Authorizing ${amount} from account ****{self._account}")
        return True
    
    def charge(self, amount: float) -> str:
        # ACH processing hidden
        if self.authorize(amount):
            transaction_id = f"ACH_{datetime.now().timestamp()}"
            return f"Transferred ${amount}. Transaction ID: {transaction_id}"
        return "Authorization failed"
    
    def refund(self, transaction_id: str, amount: float) -> str:
        # Reversal process hidden
        return f"Reversed ${amount} for transaction {transaction_id}"

class DigitalWallet(PaymentMethod):
    def __init__(self, wallet_id, provider):
        self._wallet_id = wallet_id
        self._provider = provider  # "PayPal", "Venmo", etc.
    
    def authorize(self, amount: float) -> bool:
        # Wallet API call hidden
        print(f"Authorizing ${amount} via {self._provider}")
        return True
    
    def charge(self, amount: float) -> str:
        # Digital wallet API hidden
        if self.authorize(amount):
            transaction_id = f"{self._provider}_{datetime.now().timestamp()}"
            return f"Paid ${amount} via {self._provider}. ID: {transaction_id}"
        return "Authorization failed"
    
    def refund(self, transaction_id: str, amount: float) -> str:
        # Wallet refund API hidden
        return f"Refunded ${amount} to {self._provider} wallet"

# High-level abstraction - checkout process
class ShoppingCart:
    def __init__(self):
        self.items = []
    
    def add_item(self, item, price):
        self.items.append({'item': item, 'price': price})
    
    def get_total(self):
        return sum(item['price'] for item in self.items)
    
    def checkout(self, payment_method: PaymentMethod):
        """Works with ANY payment method - abstraction!"""
        total = self.get_total()
        print(f"\nProcessing payment of ${total}")
        result = payment_method.charge(total)
        print(result)
        return result

# Usage - same interface, different implementations
cart = ShoppingCart()
cart.add_item("Laptop", 1000)
cart.add_item("Mouse", 50)

# Try different payment methods - all work the same way
print("=== Credit Card Payment ===")
cc = CreditCard("1234-5678-9012-3456", "123", "12/25")
cart.checkout(cc)

print("\n=== Bank Transfer ===")
bank = BankTransfer("9876543210", "021000021")
cart.checkout(bank)

print("\n=== Digital Wallet ===")
wallet = DigitalWallet("user@email.com", "PayPal")
cart.checkout(wallet)
```

### Example 2: File Storage Abstraction

```python
from abc import ABC, abstractmethod
import json
import csv

class FileStorage(ABC):
    """Abstract file storage interface"""
    
    @abstractmethod
    def save(self, data, filename):
        """Save data to file"""
        pass
    
    @abstractmethod
    def load(self, filename):
        """Load data from file"""
        pass
    
    @abstractmethod
    def exists(self, filename):
        """Check if file exists"""
        pass

class JSONStorage(FileStorage):
    def save(self, data, filename):
        # JSON serialization details hidden
        with open(f"{filename}.json", 'w') as f:
            json.dump(data, f, indent=2)
        return f"Data saved to {filename}.json"
    
    def load(self, filename):
        # JSON parsing details hidden
        with open(f"{filename}.json", 'r') as f:
            return json.load(f)
    
    def exists(self, filename):
        import os
        return os.path.exists(f"{filename}.json")

class CSVStorage(FileStorage):
    def save(self, data, filename):
        # CSV formatting details hidden
        if not data:
            return "No data to save"
        
        keys = data[0].keys()
        with open(f"{filename}.csv", 'w', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=keys)
            writer.writeheader()
            writer.writerows(data)
        return f"Data saved to {filename}.csv"
    
    def load(self, filename):
        # CSV parsing details hidden
        with open(f"{filename}.csv", 'r') as f:
            reader = csv.DictReader(f)
            return list(reader)
    
    def exists(self, filename):
        import os
        return os.path.exists(f"{filename}.csv")

class TextStorage(FileStorage):
    def save(self, data, filename):
        # Text formatting hidden
        with open(f"{filename}.txt", 'w') as f:
            if isinstance(data, list):
                f.write('\n'.join(str(item) for item in data))
            else:
                f.write(str(data))
        return f"Data saved to {filename}.txt"
    
    def load(self, filename):
        # Text parsing hidden
        with open(f"{filename}.txt", 'r') as f:
            return f.read().split('\n')
    
    def exists(self, filename):
        import os
        return os.path.exists(f"{filename}.txt")

# Application code - works with any storage type
class DataManager:
    def __init__(self, storage: FileStorage):
        self.storage = storage
    
    def save_user_data(self, users, filename):
        """Save users - don't care about format!"""
        return self.storage.save(users, filename)
    
    def load_user_data(self, filename):
        """Load users - don't care about format!"""
        if self.storage.exists(filename):
            return self.storage.load(filename)
        return []

# Same code works with different storage formats
users = [
    {"name": "Alice", "age": 25, "email": "alice@example.com"},
    {"name": "Bob", "age": 30, "email": "bob@example.com"}
]

# Save as JSON
json_manager = DataManager(JSONStorage())
print(json_manager.save_user_data(users, "users"))

# Save as CSV
csv_manager = DataManager(CSVStorage())
print(csv_manager.save_user_data(users, "users"))

# Load from JSON
loaded_users = json_manager.load_user_data("users")
print(f"Loaded from JSON: {loaded_users}")
```

### Example 3: Notification System

```python
from abc import ABC, abstractmethod

class NotificationChannel(ABC):
    """Abstract notification interface"""
    
    @abstractmethod
    def send(self, recipient, message):
        pass
    
    @abstractmethod
    def verify_recipient(self, recipient):
        pass

class EmailNotification(NotificationChannel):
    def verify_recipient(self, recipient):
        # Email validation hidden
        return '@' in recipient and '.' in recipient
    
    def send(self, recipient, message):
        # SMTP details hidden
        if not self.verify_recipient(recipient):
            return f"Invalid email: {recipient}"
        
        print(f"[EMAIL] To: {recipient}")
        print(f"[EMAIL] Message: {message}")
        return f"Email sent to {recipient}"

class SMSNotification(NotificationChannel):
    def verify_recipient(self, recipient):
        # Phone number validation hidden
        return recipient.replace('-', '').replace(' ', '').isdigit()
    
    def send(self, recipient, message):
        # SMS gateway details hidden
        if not self.verify_recipient(recipient):
            return f"Invalid phone: {recipient}"
        
        # Truncate message for SMS (hidden complexity)
        sms_message = message[:160]
        print(f"[SMS] To: {recipient}")
        print(f"[SMS] Message: {sms_message}")
        return f"SMS sent to {recipient}"

class PushNotification(NotificationChannel):
    def verify_recipient(self, recipient):
        # Device token validation hidden
        return len(recipient) > 10
    
    def send(self, recipient, message):
        # Push notification service details hidden
        if not self.verify_recipient(recipient):
            return f"Invalid device token: {recipient}"
        
        print(f"[PUSH] To device: {recipient[:10]}...")
        print(f"[PUSH] Message: {message}")
        return f"Push notification sent to device"

# High-level abstraction
class NotificationService:
    def __init__(self):
        self.channels = []
    
    def add_channel(self, channel: NotificationChannel):
        self.channels.append(channel)
    
    def notify_all(self, recipients, message):
        """Send via all configured channels"""
        results = []
        for channel in self.channels:
            for recipient in recipients:
                result = channel.send(recipient, message)
                results.append(result)
        return results

# Usage - simple interface hides complexity
service = NotificationService()
service.add_channel(EmailNotification())
service.add_channel(SMSNotification())
service.add_channel(PushNotification())

recipients = {
    'email': 'user@example.com',
    'sms': '555-1234',
    'push': 'device_token_12345'
}

results = service.notify_all(
    [recipients['email'], recipients['sms'], recipients['push']],
    "Your order has been shipped!"
)

for result in results:
    print(f"✓ {result}")
```

---

## Abstraction vs Encapsulation

### Key Differences

| Aspect | Abstraction | Encapsulation |
|--------|-------------|---------------|
| **Focus** | WHAT an object does | HOW data is accessed |
| **Purpose** | Hide complexity | Protect data |
| **Achieved by** | Abstract classes, interfaces | Access modifiers, properties |
| **Level** | Design level | Implementation level |
| **Example** | TV remote (simple buttons) | TV circuit board (hidden internals) |

### Visual Comparison

```python
# ENCAPSULATION - protecting data
class BankAccount:
    def __init__(self):
        self.__balance = 0  # Hidden (encapsulated)
    
    @property
    def balance(self):  # Controlled access
        return self.__balance

# ABSTRACTION - hiding complexity
class PaymentProcessor(ABC):
    @abstractmethod
    def process(self, amount):  # What, not how
        pass

# BOTH TOGETHER
class SecurePaymentProcessor(ABC):
    def __init__(self):
        self.__api_key = "secret"  # Encapsulation
    
    @abstractmethod
    def process(self, amount):  # Abstraction
        pass
```

### Real-World Example: Car

**Encapsulation** (Data Protection):
- Engine is sealed (can't touch directly)
- Need to use oil cap to add oil
- Dashboard shows speed but you can't modify it directly

**Abstraction** (Hiding Complexity):
- Steering wheel (simple) hides complex steering mechanism
- Gas pedal (simple) hides fuel injection, throttle control
- You don't need to know how the engine works to drive

```python
class Car:
    def __init__(self):
        # Encapsulation - hidden data
        self.__fuel_level = 100
        self.__speed = 0
        self.__engine_state = "off"
    
    # Abstraction - simple interface
    def start(self):
        """User doesn't need to know ignition details"""
        self.__engine_state = "on"
        self.__ignite_engine()
        self.__engage_starter_motor()
        return "Car started"
    
    def accelerate(self):
        """User doesn't need to know fuel injection"""
        if self.__engine_state == "on":
            self.__adjust_throttle()
            self.__inject_fuel()
            self.__speed += 10
            return f"Speed: {self.__speed} mph"
        return "Start the car first"
    
    # Private methods - implementation details (abstraction)
    def __ignite_engine(self):
        """Hidden complexity"""
        pass
    
    def __engage_starter_motor(self):
        """Hidden complexity"""
        pass
    
    def __adjust_throttle(self):
        """Hidden complexity"""
        pass
    
    def __inject_fuel(self):
        """Hidden complexity"""
        self.__fuel_level -= 1

# User sees simple interface
car = Car()
print(car.start())       # Don't know how it works
print(car.accelerate())  # Don't know the mechanics
```

---

## Practice Questions

<details>
<summary><strong>View Questions</strong></summary>

### Fill in the Gaps

1. Abstraction focuses on __________ an object does, while hiding __________ it does it.
2. An __________ class cannot be instantiated and may contain __________ methods that subclasses must implement.
3. In Python, the __________ module provides support for creating abstract classes using the __________ decorator.
4. The main difference between abstraction and encapsulation is that abstraction hides __________ while encapsulation hides __________.
5. A __________ in Python 3.8+ defines a contract without requiring inheritance, supporting duck typing.

---

<details>
<summary><strong>View Answers</strong></summary>

1. WHAT, HOW
2. abstract, abstract
3. abc, @abstractmethod
4. complexity (or implementation details), data (or internal state)
5. Protocol

</details>

### True/False

1. Abstract classes in Python can have both abstract methods and concrete methods.
2. In Python, you can create an instance of an abstract class if it has at least one concrete method.
3. Abstraction and encapsulation are exactly the same concept with different names.
4. A class implementing an abstract class must provide implementations for all abstract methods.
5. Protocols in Python require classes to inherit from them to work.
6. Abstraction helps reduce complexity by hiding implementation details from the user.
7. You can have an abstract class with no abstract methods in Python.

---

<details>
<summary><strong>View Answers</strong></summary>

1. True - Abstract classes can contain both abstract methods (must be implemented) and concrete methods (shared implementation).
2. False - You cannot instantiate an abstract class in Python, even if it has concrete methods. All abstract methods must be implemented in a subclass first.
3. False - Abstraction hides complexity (WHAT vs HOW), while encapsulation hides data (bundling + access control).
4. True - Any class inheriting from an abstract class must implement all abstract methods, or it will also be considered abstract.
5. False - Protocols use structural typing (duck typing). Classes don't need to inherit from Protocol; they just need to have the required methods.
6. True - Abstraction provides a simple interface while hiding complex implementation details.
7. True - An abstract class can have zero abstract methods. It's abstract if it inherits from ABC, even without @abstractmethod decorators.

</details>

### Multiple Choice Questions

1. What is the primary purpose of abstraction in OOP?
   - A) To make code run faster
   - B) To hide complexity and show only essential features
   - C) To protect data from being accessed
   - D) To create multiple copies of objects

2. Which Python decorator is used to define an abstract method?
   - A) @property
   - B) @staticmethod
   - C) @abstractmethod
   - D) @classmethod

3. What happens when you try to instantiate an abstract class in Python?
   - A) It works normally
   - B) It creates an instance with None values
   - C) TypeError is raised
   - D) It creates an instance but methods don't work

4. Which of the following best describes the relationship between a TV remote and a TV?
   - A) The remote demonstrates encapsulation
   - B) The remote demonstrates abstraction
   - C) The remote demonstrates inheritance
   - D) The remote demonstrates polymorphism

5. In the context of abstraction, what does "interface" mean?
   - A) A graphical user interface
   - B) The set of methods and properties available to users
   - C) A network connection
   - D) A type of class in Java

6. What is the main difference between an abstract class and a Protocol in Python?
   - A) Abstract classes are faster
   - B) Protocols require inheritance; abstract classes don't
   - C) Abstract classes require inheritance; Protocols support duck typing
   - D) There is no difference

7. Which statement is true about abstract methods?
   - A) They must have an implementation in the abstract class
   - B) They cannot have any code in them
   - C) They define a contract that subclasses must fulfill
   - D) They are optional to implement in subclasses

8. Abstraction is most similar to which real-world concept?
   - A) A safe protecting valuables
   - B) A user manual showing how to use a device without explaining internals
   - C) A family tree showing relationships
   - D) A factory producing different products

---

<details>
<summary><strong>View Answers</strong></summary>

1. B) To hide complexity and show only essential features
2. C) @abstractmethod
3. C) TypeError is raised - Python prevents instantiation of abstract classes
4. B) The remote demonstrates abstraction - it provides a simple interface (buttons) that hides complex TV internals
5. B) The set of methods and properties available to users - the "contract" or API that users interact with
6. C) Abstract classes require inheritance; Protocols support duck typing - Protocols check if methods exist without requiring inheritance
7. C) They define a contract that subclasses must fulfill - abstract methods must be implemented by concrete subclasses
8. B) A user manual showing how to use a device without explaining internals - shows WHAT to do, not HOW it works internally

</details>

### Code Challenges

**Challenge 1: Create a Shape Hierarchy**

Create an abstract `Shape` class with:
- Abstract method `area()` that returns the area
- Abstract method `perimeter()` that returns the perimeter
- Concrete method `describe()` that returns shape info

Then create concrete classes:
- `Circle` (radius)
- `Rectangle` (width, height)
- `Triangle` (side1, side2, side3)

<details>
<summary><strong>View Solution</strong></summary>

```python
from abc import ABC, abstractmethod
import math

class Shape(ABC):
    """Abstract base class for shapes"""
    
    @abstractmethod
    def area(self):
        """Calculate area - must be implemented by subclasses"""
        pass
    
    @abstractmethod
    def perimeter(self):
        """Calculate perimeter - must be implemented by subclasses"""
        pass
    
    def describe(self):
        """Concrete method - shared implementation"""
        return f"{self.__class__.__name__}: Area = {self.area():.2f}, Perimeter = {self.perimeter():.2f}"

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius
    
    def area(self):
        return math.pi * self.radius ** 2
    
    def perimeter(self):
        return 2 * math.pi * self.radius

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height
    
    def area(self):
        return self.width * self.height
    
    def perimeter(self):
        return 2 * (self.width + self.height)

class Triangle(Shape):
    def __init__(self, side1, side2, side3):
        self.side1 = side1
        self.side2 = side2
        self.side3 = side3
    
    def area(self):
        # Using Heron's formula
        s = self.perimeter() / 2
        return math.sqrt(s * (s - self.side1) * (s - self.side2) * (s - self.side3))
    
    def perimeter(self):
        return self.side1 + self.side2 + self.side3

# Test
shapes = [
    Circle(5),
    Rectangle(4, 6),
    Triangle(3, 4, 5)
]

for shape in shapes:
    print(shape.describe())
```

</details>

**Challenge 2: Build a Database Abstraction Layer**

Create an abstract `Database` class with methods:
- `connect()` - establish connection
- `execute(query)` - run a query
- `close()` - close connection

Implement for:
- `SQLiteDatabase`
- `MySQLDatabase`
- `PostgreSQLDatabase`

(Use mock implementations - don't need real database connections)

<details>
<summary><strong>View Solution</strong></summary>

```python
from abc import ABC, abstractmethod
from datetime import datetime

class Database(ABC):
    """Abstract database interface"""
    
    def __init__(self, connection_string):
        self.connection_string = connection_string
        self.connected = False
    
    @abstractmethod
    def connect(self):
        """Establish database connection"""
        pass
    
    @abstractmethod
    def execute(self, query):
        """Execute a query"""
        pass
    
    @abstractmethod
    def close(self):
        """Close database connection"""
        pass
    
    def get_status(self):
        """Concrete method - shared implementation"""
        status = "Connected" if self.connected else "Disconnected"
        return f"{self.__class__.__name__}: {status}"

class SQLiteDatabase(Database):
    def connect(self):
        # Mock SQLite connection
        print(f"[SQLite] Connecting to {self.connection_string}")
        self.connected = True
        return "SQLite connection established"
    
    def execute(self, query):
        if not self.connected:
            return "Error: Not connected"
        
        # Mock query execution
        print(f"[SQLite] Executing: {query}")
        return f"SQLite query executed: {query}"
    
    def close(self):
        print("[SQLite] Closing connection")
        self.connected = False
        return "SQLite connection closed"

class MySQLDatabase(Database):
    def connect(self):
        # Mock MySQL connection
        print(f"[MySQL] Connecting to {self.connection_string}")
        self.connected = True
        return "MySQL connection established"
    
    def execute(self, query):
        if not self.connected:
            return "Error: Not connected"
        
        # Mock query execution with MySQL-specific features
        print(f"[MySQL] Executing: {query}")
        return f"MySQL query executed at {datetime.now()}"
    
    def close(self):
        print("[MySQL] Closing connection")
        self.connected = False
        return "MySQL connection closed"

class PostgreSQLDatabase(Database):
    def connect(self):
        # Mock PostgreSQL connection
        print(f"[PostgreSQL] Connecting to {self.connection_string}")
        self.connected = True
        return "PostgreSQL connection established"
    
    def execute(self, query):
        if not self.connected:
            return "Error: Not connected"
        
        # Mock query execution with PostgreSQL-specific features
        print(f"[PostgreSQL] Executing: {query}")
        return f"PostgreSQL query executed successfully"
    
    def close(self):
        print("[PostgreSQL] Closing connection")
        self.connected = False
        return "PostgreSQL connection closed"

# Application code - works with any database
class DataRepository:
    def __init__(self, database: Database):
        self.db = database
    
    def save_user(self, name, email):
        """Save user - database-agnostic"""
        self.db.connect()
        query = f"INSERT INTO users (name, email) VALUES ('{name}', '{email}')"
        result = self.db.execute(query)
        self.db.close()
        return result

# Test with different databases
print("=== SQLite ===")
sqlite_db = SQLiteDatabase("users.db")
repo = DataRepository(sqlite_db)
print(repo.save_user("Alice", "alice@example.com"))

print("\n=== MySQL ===")
mysql_db = MySQLDatabase("mysql://localhost:3306/mydb")
repo = DataRepository(mysql_db)
print(repo.save_user("Bob", "bob@example.com"))

print("\n=== PostgreSQL ===")
postgres_db = PostgreSQLDatabase("postgresql://localhost:5432/mydb")
repo = DataRepository(postgres_db)
print(repo.save_user("Charlie", "charlie@example.com"))
```

</details>

</details>

---

## Summary

### Key Takeaways

1. **Abstraction hides complexity** - Show WHAT, not HOW
2. **Abstract classes** define contracts with shared implementation
3. **Protocols** provide duck typing without inheritance
4. **Abstraction ≠ Encapsulation** - Different purposes, complementary
5. **Benefits**: Reduced complexity, flexibility, clear interfaces

### Memory Aid

**"ABSTRACT" for Abstraction:**
- **A**PI-focused (what's exposed)
- **B**ehavior definition (what it does)
- **S**implified interface (easy to use)
- **T**emplate for implementations (contract)
- **R**educed complexity (hidden details)
- **A**llow flexibility (swap implementations)
- **C**ontract enforcement (must implement)
- **T**ransparent to users (don't see internals)

### Interview Tips

**Q: "What's the difference between abstraction and encapsulation?"**

**A:** "Abstraction is about WHAT you show - hiding complexity through simple interfaces. Encapsulation is about HOW you protect data - bundling and restricting access. Example: A car's steering wheel is abstraction (simple interface), while the sealed engine is encapsulation (data protection)."

---

[← Back to Encapsulation](01-encapsulation.md) | [Next: Inheritance →](03-inheritance.md) | [↑ Back to README](../README.md)