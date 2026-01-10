# 5.3 Behavioral Design Patterns

[← Back to Structural Patterns](02-structural-patterns.md) | [Next: Common Anti-Patterns →](../06-best-practices/01-anti-patterns.md) | [↑ Back to README](../README.md)

---

## What Are Behavioral Patterns?

**Behavioral patterns** deal with **communication between objects** and how responsibilities are distributed.

### Problem They Solve
- How objects interact and communicate
- How to distribute responsibilities
- How to manage algorithms and workflows

### Core Idea
**"Control HOW objects interact and communicate"**

---

## 1. Strategy Pattern 🎯

### What Problem Does It Solve?

**Problem:** Need different algorithms/behaviors for the same task, and want to switch between them easily.

**Real-world analogy:** Navigation apps
- Driving route (fastest)
- Walking route (shortest)
- Public transit route (cheapest)
- Same destination, different strategies

### When to Use

✅ Multiple algorithms for the same task  
✅ Need to switch algorithms at runtime  
✅ Avoid multiple conditional statements  
✅ Encapsulate algorithm variations

### Implementation

```python
from abc import ABC, abstractmethod

# Strategy interface
class PaymentStrategy(ABC):
    @abstractmethod
    def pay(self, amount):
        pass

# Concrete strategies
class CreditCardStrategy(PaymentStrategy):
    def __init__(self, card_number, cvv):
        self.card_number = card_number
        self.cvv = cvv
    
    def pay(self, amount):
        return f"Paid ${amount} using Credit Card ending in {self.card_number[-4:]}"

class PayPalStrategy(PaymentStrategy):
    def __init__(self, email):
        self.email = email
    
    def pay(self, amount):
        return f"Paid ${amount} using PayPal account {self.email}"

class CryptoStrategy(PaymentStrategy):
    def __init__(self, wallet_address):
        self.wallet_address = wallet_address
    
    def pay(self, amount):
        return f"Paid ${amount} using Crypto wallet {self.wallet_address[:8]}..."

# Context
class ShoppingCart:
    def __init__(self):
        self.items = []
        self.payment_strategy = None
    
    def add_item(self, item, price):
        self.items.append({"item": item, "price": price})
    
    def set_payment_strategy(self, strategy: PaymentStrategy):
        self.payment_strategy = strategy
    
    def get_total(self):
        return sum(item["price"] for item in self.items)
    
    def checkout(self):
        if not self.payment_strategy:
            return "Please select a payment method"
        
        total = self.get_total()
        return self.payment_strategy.pay(total)

# Usage - switch strategies easily
cart = ShoppingCart()
cart.add_item("Laptop", 1000)
cart.add_item("Mouse", 50)

# Pay with credit card
cart.set_payment_strategy(CreditCardStrategy("1234-5678-9012-3456", "123"))
print(cart.checkout())
# Paid $1050 using Credit Card ending in 3456

# Change mind, pay with PayPal
cart.set_payment_strategy(PayPalStrategy("user@example.com"))
print(cart.checkout())
# Paid $1050 using PayPal account user@example.com
```

### Real-World Example: Sorting Algorithms

```python
from abc import ABC, abstractmethod

# Strategy interface
class SortStrategy(ABC):
    @abstractmethod
    def sort(self, data):
        pass

# Concrete strategies
class QuickSort(SortStrategy):
    def sort(self, data):
        if len(data) <= 1:
            return data
        pivot = data[len(data) // 2]
        left = [x for x in data if x < pivot]
        middle = [x for x in data if x == pivot]
        right = [x for x in data if x > pivot]
        return self.sort(left) + middle + self.sort(right)

class BubbleSort(SortStrategy):
    def sort(self, data):
        arr = data.copy()
        n = len(arr)
        for i in range(n):
            for j in range(0, n - i - 1):
                if arr[j] > arr[j + 1]:
                    arr[j], arr[j + 1] = arr[j + 1], arr[j]
        return arr

class MergeSort(SortStrategy):
    def sort(self, data):
        if len(data) <= 1:
            return data
        
        mid = len(data) // 2
        left = self.sort(data[:mid])
        right = self.sort(data[mid:])
        
        return self._merge(left, right)
    
    def _merge(self, left, right):
        result = []
        i = j = 0
        
        while i < len(left) and j < len(right):
            if left[i] <= right[j]:
                result.append(left[i])
                i += 1
            else:
                result.append(right[j])
                j += 1
        
        result.extend(left[i:])
        result.extend(right[j:])
        return result

# Context
class DataSorter:
    def __init__(self, strategy: SortStrategy):
        self.strategy = strategy
    
    def set_strategy(self, strategy: SortStrategy):
        self.strategy = strategy
    
    def sort(self, data):
        return self.strategy.sort(data)

# Usage
data = [64, 34, 25, 12, 22, 11, 90]

# Use QuickSort
sorter = DataSorter(QuickSort())
print(f"QuickSort: {sorter.sort(data)}")

# Switch to BubbleSort
sorter.set_strategy(BubbleSort())
print(f"BubbleSort: {sorter.sort(data)}")

# Switch to MergeSort
sorter.set_strategy(MergeSort())
print(f"MergeSort: {sorter.sort(data)}")
```

### Benefits

✅ **Open/Closed** - Add new strategies without modifying context  
✅ **Single Responsibility** - Each strategy has one algorithm  
✅ **Runtime switching** - Change behavior dynamically  
✅ **Eliminates conditionals** - No if/else chains

---

## 2. Observer Pattern 👀

### What Problem Does It Solve?

**Problem:** One object's state changes, and multiple dependent objects need to be notified.

**Real-world analogy:** YouTube channel
- Creator uploads video (subject)
- All subscribers get notified (observers)
- Subscribers can subscribe/unsubscribe anytime

### When to Use

✅ One-to-many dependency between objects  
✅ Object state change needs to notify others  
✅ Don't know how many objects need notification  
✅ Loose coupling between subject and observers

### Implementation

```python
from abc import ABC, abstractmethod

# Observer interface
class Observer(ABC):
    @abstractmethod
    def update(self, message):
        pass

# Subject (Observable)
class Subject:
    def __init__(self):
        self._observers = []
    
    def attach(self, observer: Observer):
        if observer not in self._observers:
            self._observers.append(observer)
            print(f"{observer.__class__.__name__} subscribed")
    
    def detach(self, observer: Observer):
        if observer in self._observers:
            self._observers.remove(observer)
            print(f"{observer.__class__.__name__} unsubscribed")
    
    def notify(self, message):
        print(f"\nNotifying {len(self._observers)} observers...")
        for observer in self._observers:
            observer.update(message)

# Concrete observers
class EmailObserver(Observer):
    def __init__(self, email):
        self.email = email
    
    def update(self, message):
        print(f"[EMAIL to {self.email}] {message}")

class SMSObserver(Observer):
    def __init__(self, phone):
        self.phone = phone
    
    def update(self, message):
        print(f"[SMS to {phone}] {message}")

class PushObserver(Observer):
    def __init__(self, device):
        self.device = device
    
    def update(self, message):
        print(f"[PUSH to {self.device}] {message}")

# Concrete subject
class NewsPublisher(Subject):
    def __init__(self, name):
        super().__init__()
        self.name = name
    
    def publish_news(self, headline):
        print(f"\n{self.name} publishing: '{headline}'")
        self.notify(headline)

# Usage
publisher = NewsPublisher("Tech News")

# Create observers
email_sub = EmailObserver("user@example.com")
sms_sub = SMSObserver("+1234567890")
push_sub = PushObserver("iPhone")

# Subscribe observers
publisher.attach(email_sub)
publisher.attach(sms_sub)
publisher.attach(push_sub)

# Publish news - all observers notified
publisher.publish_news("Python 4.0 Released!")

# Unsubscribe one observer
publisher.detach(sms_sub)

# Publish again - only 2 observers notified
publisher.publish_news("New AI Breakthrough!")
```

### Real-World Example: Stock Market

```python
from abc import ABC, abstractmethod

# Observer
class Investor(ABC):
    def __init__(self, name):
        self.name = name
    
    @abstractmethod
    def update(self, stock, price):
        pass

# Concrete observers
class AggressiveInvestor(Investor):
    def update(self, stock, price):
        print(f"[{self.name}] {stock} is now ${price}. Buy more!")

class ConservativeInvestor(Investor):
    def __init__(self, name, threshold):
        super().__init__(name)
        self.threshold = threshold
    
    def update(self, stock, price):
        if price < self.threshold:
            print(f"[{self.name}] {stock} dropped to ${price}. Good time to buy!")
        else:
            print(f"[{self.name}] {stock} at ${price}. Hold position.")

# Subject
class Stock:
    def __init__(self, symbol, price):
        self.symbol = symbol
        self._price = price
        self._investors = []
    
    @property
    def price(self):
        return self._price
    
    @price.setter
    def price(self, value):
        print(f"\n{self.symbol} price changing: ${self._price} → ${value}")
        self._price = value
        self._notify_investors()
    
    def attach_investor(self, investor):
        self._investors.append(investor)
        print(f"{investor.name} is now watching {self.symbol}")
    
    def detach_investor(self, investor):
        self._investors.remove(investor)
        print(f"{investor.name} stopped watching {self.symbol}")
    
    def _notify_investors(self):
        for investor in self._investors:
            investor.update(self.symbol, self._price)

# Usage
tesla = Stock("TSLA", 250)

# Create investors
investor1 = AggressiveInvestor("Alice")
investor2 = ConservativeInvestor("Bob", threshold=200)

# Attach investors
tesla.attach_investor(investor1)
tesla.attach_investor(investor2)

# Price changes - investors notified automatically
tesla.price = 270
tesla.price = 190
tesla.price = 210
```

### Benefits

✅ **Loose coupling** - Subject doesn't know concrete observers  
✅ **Dynamic relationships** - Add/remove observers at runtime  
✅ **Broadcast** - Notify multiple objects automatically  
✅ **Open/Closed** - Add new observers without modifying subject

---

## 3. Command Pattern 📋

### What Problem Does It Solve?

**Problem:** Need to encapsulate requests as objects, allowing parameterization and queuing of requests.

**Real-world analogy:** Restaurant orders
- Customer request written on paper (command object)
- Waiter doesn't cook, just delivers order
- Kitchen executes order
- Can queue, undo, or log orders

### When to Use

✅ Parameterize objects with operations  
✅ Queue operations  
✅ Support undo/redo  
✅ Log operations  
✅ Decouple sender from receiver

### Implementation

```python
from abc import ABC, abstractmethod

# Command interface
class Command(ABC):
    @abstractmethod
    def execute(self):
        pass
    
    @abstractmethod
    def undo(self):
        pass

# Receiver
class Light:
    def __init__(self, location):
        self.location = location
        self.is_on = False
    
    def turn_on(self):
        self.is_on = True
        print(f"{self.location} light is ON")
    
    def turn_off(self):
        self.is_on = False
        print(f"{self.location} light is OFF")

# Concrete commands
class LightOnCommand(Command):
    def __init__(self, light):
        self.light = light
    
    def execute(self):
        self.light.turn_on()
    
    def undo(self):
        self.light.turn_off()

class LightOffCommand(Command):
    def __init__(self, light):
        self.light = light
    
    def execute(self):
        self.light.turn_off()
    
    def undo(self):
        self.light.turn_on()

# Invoker
class RemoteControl:
    def __init__(self):
        self.command = None
        self.history = []
    
    def set_command(self, command):
        self.command = command
    
    def press_button(self):
        if self.command:
            self.command.execute()
            self.history.append(self.command)
    
    def press_undo(self):
        if self.history:
            last_command = self.history.pop()
            last_command.undo()

# Usage
living_room_light = Light("Living Room")
bedroom_light = Light("Bedroom")

# Create commands
living_on = LightOnCommand(living_room_light)
living_off = LightOffCommand(living_room_light)
bedroom_on = LightOnCommand(bedroom_light)

# Use remote
remote = RemoteControl()

remote.set_command(living_on)
remote.press_button()  # Living Room light is ON

remote.set_command(bedroom_on)
remote.press_button()  # Bedroom light is ON

remote.press_undo()    # Bedroom light is OFF (undo)
remote.press_undo()    # Living Room light is OFF (undo)
```

### Benefits

✅ **Decoupling** - Invoker separated from receiver  
✅ **Undo/Redo** - Easy to implement  
✅ **Queuing** - Commands can be queued  
✅ **Logging** - Can log all commands  
✅ **Composite** - Combine commands (macro)

---

## Interview Questions

<details>
<summary><strong>View Questions</strong></summary>

### Q1: When would you use Strategy over simple inheritance?

<details>
<summary><strong>View Answer</strong></summary>

**Use Strategy when:**

1. **Runtime switching needed**
```python
# Strategy - switch at runtime
cart.set_payment_strategy(CreditCardStrategy(...))
cart.checkout()
# Later...
cart.set_payment_strategy(PayPalStrategy(...))
cart.checkout()
```

2. **Many algorithms, avoid class explosion**
```python
# Inheritance - too many classes
class CreditCardCart(Cart): pass
class PayPalCart(Cart): pass
class CryptoCart(Cart): pass
# What if multiple payment options per cart?

# Strategy - flexible
class Cart:
    def set_payment(self, strategy):
        self.strategy = strategy
```

3. **Client chooses algorithm**
```python
# User selects payment method
payment = get_user_payment_choice()
cart.set_payment_strategy(payment)
```

**Use Inheritance when:**
- IS-A relationship
- Compile-time decision
- Behavior rarely changes
</details>

### Q2: How does Observer pattern differ from pub/sub?

<details>
<summary><strong>View Answer</strong></summary>

**Observer Pattern:**
- Direct connection (Subject knows observers)
- Synchronous notification
- Same process/application

```python
class Subject:
    def __init__(self):
        self._observers = []  # Direct reference
    
    def notify(self):
        for observer in self._observers:
            observer.update()  # Synchronous
```

**Pub/Sub Pattern:**
- Indirect connection (via message broker)
- Asynchronous notification
- Can be distributed systems

```python
# Publisher doesn't know subscribers
publisher.publish("topic", message)

# Message broker handles delivery
broker.route_to_subscribers("topic", message)
```

**Key differences:**
- Observer = Tight coupling
- Pub/Sub = Loose coupling (via broker)
</details>

### Q3: What's the benefit of Command pattern for undo/redo?

<details>
<summary><strong>View Answer</strong></summary>

Command pattern makes undo/redo trivial:

```python
class TextEditor:
    def __init__(self):
        self.text = ""
        self.history = []
        self.redo_stack = []
    
    def execute_command(self, command):
        command.execute()
        self.history.append(command)
        self.redo_stack.clear()
    
    def undo(self):
        if self.history:
            command = self.history.pop()
            command.undo()
            self.redo_stack.append(command)
    
    def redo(self):
        if self.redo_stack:
            command = self.redo_stack.pop()
            command.execute()
            self.history.append(command)

class InsertCommand(Command):
    def __init__(self, editor, text):
        self.editor = editor
        self.text = text
    
    def execute(self):
        self.editor.text += self.text
    
    def undo(self):
        self.editor.text = self.editor.text[:-len(self.text)]
```

**Benefits:**
- ✅ Each command knows how to undo itself
- ✅ History is just a list of commands
- ✅ Redo is executing saved commands
- ✅ Easy to add new undoable operations
</details>

</details>

---

## Practice Questions

<details>
<summary><strong>View Questions</strong></summary>

### Fill in the Gaps

1. Strategy pattern encapsulates __________ and makes them interchangeable.
2. Observer pattern implements a __________ mechanism where one object notifies multiple objects.
3. Command pattern encapsulates a __________ as an object.
4. In Strategy pattern, the context maintains a reference to a __________ object.
5. Observer pattern establishes a __________ relationship between objects.

<details>
<summary><strong>View Answers</strong></summary>

1. algorithms (or behaviors/strategies)
2. notification (or publish-subscribe/event)
3. request (or action/operation)
4. strategy
5. one-to-many

</details>

### True/False

1. Strategy pattern allows switching algorithms at runtime.
2. Observer pattern requires observers to poll for changes.
3. Command pattern makes implementing undo/redo easier.
4. In Observer pattern, the subject must know concrete observer types.
5. Strategy pattern eliminates conditional statements for algorithm selection.
6. Command pattern decouples the sender from the receiver.
7. Observer pattern observers are notified automatically when subject state changes.

<details>
<summary><strong>View Answers</strong></summary>

1. True - Can change strategy dynamically
2. False - Observers are notified automatically by subject
3. True - Each command knows how to undo itself
4. False - Subject works with Observer interface, not concrete types
5. True - No need for if/else chains to select algorithm
6. True - Invoker doesn't know receiver details
7. True - Subject notifies all registered observers

</details>

### Multiple Choice Questions

1. Which pattern would you use for a text editor's undo feature?
   - A) Strategy
   - B) Observer
   - C) Command
   - D) Adapter

2. What's the main benefit of Strategy pattern?
   - A) Notify multiple objects
   - B) Switch algorithms at runtime
   - C) Undo operations
   - D) Simplify complex code

3. Observer pattern is best described as:
   - A) Many algorithms for one task
   - B) Encapsulate requests
   - C) One-to-many dependency
   - D) Interface conversion

<details>
<summary><strong>View Answers</strong></summary>

1. C) Command - Perfect for undo/redo functionality
2. B) Switch algorithms at runtime - Core benefit of Strategy
3. C) One-to-many dependency - Subject notifies many observers

</details>

</details>

---

## Summary

### Key Takeaways

**Strategy Pattern:**
- Encapsulates algorithms
- Switch at runtime
- Eliminates conditionals
- Use for: Payment methods, sorting algorithms

**Observer Pattern:**
- One-to-many notification
- Automatic updates
- Loose coupling
- Use for: Event systems, notifications

**Command Pattern:**
- Encapsulates requests as objects
- Supports undo/redo
- Decouples sender/receiver
- Use for: Editors, remote controls

### For Interviews

Be ready to:
- ✅ Explain when to use each pattern
- ✅ Compare Strategy vs Inheritance
- ✅ Describe Observer notification flow
- ✅ Implement simple Command with undo
- ✅ Give real-world examples

---

[← Back to Structural Patterns](02-structural-patterns.md) | [Next: Common Anti-Patterns →](../06-best-practices/01-anti-patterns.md) | [↑ Back to README](../README.md)