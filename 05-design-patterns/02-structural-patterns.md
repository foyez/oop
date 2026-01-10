# 5.2 Structural Design Patterns

[← Back to Creational Patterns](01-creational-patterns.md) | [Next: Behavioral Patterns →](03-behavioral-patterns.md) | [↑ Back to README](../README.md)

---

## What Are Structural Patterns?

**Structural patterns** deal with **object composition** and relationships between entities.

### Problem They Solve
- How to organize classes and objects
- How to make incompatible interfaces work together
- How to add functionality without inheritance

### Core Idea
**"Control HOW objects are composed and relate to each other"**

---

## 1. Adapter Pattern 🔌

### What Problem Does It Solve?

**Problem:** You have two incompatible interfaces that need to work together.

**Real-world analogy:** Power adapter
- US device (110V plug)
- European outlet (220V socket)
- Adapter makes them compatible
- Device doesn't know about the adapter

### When to Use

✅ Need to use existing class with incompatible interface  
✅ Want to create reusable class that works with unrelated classes  
✅ Legacy code integration  
✅ Third-party library with different interface

### Implementation

```python
# Target interface (what client expects)
class MediaPlayer:
    def play(self, audio_type, filename):
        pass

# Adaptee (existing incompatible interface)
class VLCPlayer:
    def play_vlc(self, filename):
        print(f"Playing VLC file: {filename}")

class MP4Player:
    def play_mp4(self, filename):
        print(f"Playing MP4 file: {filename}")

# Adapter
class MediaAdapter(MediaPlayer):
    def __init__(self, audio_type):
        if audio_type == "vlc":
            self.player = VLCPlayer()
        elif audio_type == "mp4":
            self.player = MP4Player()
    
    def play(self, audio_type, filename):
        if audio_type == "vlc":
            self.player.play_vlc(filename)
        elif audio_type == "mp4":
            self.player.play_mp4(filename)

# Concrete implementation
class AudioPlayer(MediaPlayer):
    def play(self, audio_type, filename):
        # Built-in support for mp3
        if audio_type == "mp3":
            print(f"Playing MP3 file: {filename}")
        
        # Use adapter for other formats
        elif audio_type in ["vlc", "mp4"]:
            adapter = MediaAdapter(audio_type)
            adapter.play(audio_type, filename)
        
        else:
            print(f"Invalid format: {audio_type}")

# Usage
player = AudioPlayer()
player.play("mp3", "song.mp3")
player.play("vlc", "movie.vlc")
player.play("mp4", "video.mp4")
```

### Real-World Example: Payment Gateway Integration

```python
# Your application's interface
class PaymentProcessor:
    def process_payment(self, amount):
        pass

# Third-party payment service (incompatible interface)
class StripeAPI:
    def charge_card(self, cents):
        print(f"Stripe: Charging {cents} cents")
        return {"status": "success", "id": "stripe_123"}

class PayPalAPI:
    def make_payment(self, dollars):
        print(f"PayPal: Processing ${dollars}")
        return {"success": True, "transaction_id": "pp_456"}

# Adapters for each service
class StripeAdapter(PaymentProcessor):
    def __init__(self):
        self.stripe = StripeAPI()
    
    def process_payment(self, amount):
        # Convert dollars to cents
        cents = int(amount * 100)
        result = self.stripe.charge_card(cents)
        return {
            "success": result["status"] == "success",
            "transaction_id": result["id"]
        }

class PayPalAdapter(PaymentProcessor):
    def __init__(self):
        self.paypal = PayPalAPI()
    
    def process_payment(self, amount):
        result = self.paypal.make_payment(amount)
        return {
            "success": result["success"],
            "transaction_id": result["transaction_id"]
        }

# Your application code (doesn't change!)
def checkout(payment_processor: PaymentProcessor, amount):
    result = payment_processor.process_payment(amount)
    if result["success"]:
        print(f"Payment successful! ID: {result['transaction_id']}")

# Easy to switch payment providers
checkout(StripeAdapter(), 99.99)
checkout(PayPalAdapter(), 149.99)
```

### Benefits

✅ **Single Responsibility** - Adapter handles conversion  
✅ **Open/Closed** - Add new adapters without changing client  
✅ **Reusability** - Use existing classes without modification

---

## 2. Decorator Pattern 🎁

### What Problem Does It Solve?

**Problem:** Need to add responsibilities to objects dynamically without affecting other objects.

**Real-world analogy:** Pizza toppings
- Start with plain pizza (base)
- Add cheese (decorator)
- Add pepperoni (decorator)
- Add mushrooms (decorator)
- Each addition wraps the previous

### When to Use

✅ Add responsibilities to individual objects dynamically  
✅ Responsibilities can be withdrawn  
✅ Extension by subclassing is impractical  
✅ Need multiple combinations of features

### Implementation

```python
from abc import ABC, abstractmethod

# Component interface
class Coffee(ABC):
    @abstractmethod
    def cost(self):
        pass
    
    @abstractmethod
    def description(self):
        pass

# Concrete component
class SimpleCoffee(Coffee):
    def cost(self):
        return 5
    
    def description(self):
        return "Simple Coffee"

# Base decorator
class CoffeeDecorator(Coffee):
    def __init__(self, coffee):
        self._coffee = coffee
    
    def cost(self):
        return self._coffee.cost()
    
    def description(self):
        return self._coffee.description()

# Concrete decorators
class Milk(CoffeeDecorator):
    def cost(self):
        return self._coffee.cost() + 1.5
    
    def description(self):
        return self._coffee.description() + ", Milk"

class Sugar(CoffeeDecorator):
    def cost(self):
        return self._coffee.cost() + 0.5
    
    def description(self):
        return self._coffee.description() + ", Sugar"

class WhippedCream(CoffeeDecorator):
    def cost(self):
        return self._coffee.cost() + 2
    
    def description(self):
        return self._coffee.description() + ", Whipped Cream"

class Vanilla(CoffeeDecorator):
    def cost(self):
        return self._coffee.cost() + 1
    
    def description(self):
        return self._coffee.description() + ", Vanilla"

# Usage - wrap decorators dynamically
coffee = SimpleCoffee()
print(f"{coffee.description()}: ${coffee.cost()}")
# Simple Coffee: $5

coffee = Milk(coffee)
print(f"{coffee.description()}: ${coffee.cost()}")
# Simple Coffee, Milk: $6.5

coffee = Sugar(coffee)
print(f"{coffee.description()}: ${coffee.cost()}")
# Simple Coffee, Milk, Sugar: $7.0

coffee = WhippedCream(coffee)
print(f"{coffee.description()}: ${coffee.cost()}")
# Simple Coffee, Milk, Sugar, Whipped Cream: $9.0

# Different combination
coffee2 = Vanilla(Sugar(SimpleCoffee()))
print(f"{coffee2.description()}: ${coffee2.cost()}")
# Simple Coffee, Sugar, Vanilla: $6.5
```

### Real-World Example: Text Formatting

```python
from abc import ABC, abstractmethod

# Component
class Text(ABC):
    @abstractmethod
    def render(self):
        pass

# Concrete component
class PlainText(Text):
    def __init__(self, content):
        self.content = content
    
    def render(self):
        return self.content

# Decorators
class BoldDecorator(Text):
    def __init__(self, text):
        self._text = text
    
    def render(self):
        return f"<b>{self._text.render()}</b>"

class ItalicDecorator(Text):
    def __init__(self, text):
        self._text = text
    
    def render(self):
        return f"<i>{self._text.render()}</i>"

class UnderlineDecorator(Text):
    def __init__(self, text):
        self._text = text
    
    def render(self):
        return f"<u>{self._text.render()}</u>"

class ColorDecorator(Text):
    def __init__(self, text, color):
        self._text = text
        self.color = color
    
    def render(self):
        return f'<span style="color:{self.color}">{self._text.render()}</span>'

# Usage
text = PlainText("Hello World")
print(text.render())
# Hello World

text = BoldDecorator(text)
print(text.render())
# <b>Hello World</b>

text = ItalicDecorator(text)
print(text.render())
# <i><b>Hello World</b></i>

text = ColorDecorator(text, "red")
print(text.render())
# <span style="color:red"><i><b>Hello World</b></i></span>

# Different combination
fancy_text = ColorDecorator(
    UnderlineDecorator(
        BoldDecorator(
            PlainText("Important!")
        )
    ),
    "blue"
)
print(fancy_text.render())
# <span style="color:blue"><u><b>Important!</b></u></span>
```

### Python's Built-in Decorator

Python has decorator syntax using `@`:

```python
def bold(func):
    def wrapper():
        return f"<b>{func()}</b>"
    return wrapper

def italic(func):
    def wrapper():
        return f"<i>{func()}</i>"
    return wrapper

@bold
@italic
def greet():
    return "Hello"

print(greet())  # <b><i>Hello</i></b>
```

### Benefits

✅ **Flexible** - Add/remove responsibilities at runtime  
✅ **Open/Closed** - Extend without modifying original  
✅ **Single Responsibility** - Each decorator has one job  
✅ **Combination** - Mix and match decorators

---

## 3. Facade Pattern 🏛️

### What Problem Does It Solve?

**Problem:** Complex subsystem with many classes is difficult to use.

**Real-world analogy:** Restaurant ordering
- Customer says "Burger meal"
- Facade handles: kitchen, drinks, cashier, packaging
- Customer doesn't deal with each department

### When to Use

✅ Simplify complex subsystem  
✅ Provide simple interface to complex system  
✅ Decouple subsystem from clients  
✅ Layer your subsystems

### Implementation

```python
# Complex subsystem classes
class CPU:
    def freeze(self):
        print("CPU: Freezing")
    
    def jump(self, position):
        print(f"CPU: Jumping to {position}")
    
    def execute(self):
        print("CPU: Executing")

class Memory:
    def load(self, position, data):
        print(f"Memory: Loading {data} at {position}")

class HardDrive:
    def read(self, sector, size):
        print(f"HardDrive: Reading {size} bytes from sector {sector}")
        return "boot_data"

# Facade - simple interface to complex subsystem
class ComputerFacade:
    def __init__(self):
        self.cpu = CPU()
        self.memory = Memory()
        self.hard_drive = HardDrive()
    
    def start(self):
        """Simple method that coordinates complex operations"""
        print("Starting computer...\n")
        self.cpu.freeze()
        boot_data = self.hard_drive.read(0, 1024)
        self.memory.load(0, boot_data)
        self.cpu.jump(0)
        self.cpu.execute()
        print("\nComputer started!")

# Client code - simple!
computer = ComputerFacade()
computer.start()

# Without facade, client would need to:
# cpu.freeze()
# data = hard_drive.read(0, 1024)
# memory.load(0, data)
# cpu.jump(0)
# cpu.execute()
```

### Real-World Example: Home Theater

```python
class Amplifier:
    def on(self):
        print("Amplifier on")
    
    def set_volume(self, level):
        print(f"Amplifier volume set to {level}")
    
    def off(self):
        print("Amplifier off")

class DVDPlayer:
    def on(self):
        print("DVD Player on")
    
    def play(self, movie):
        print(f"Playing '{movie}'")
    
    def stop(self):
        print("DVD stopped")
    
    def off(self):
        print("DVD Player off")

class Projector:
    def on(self):
        print("Projector on")
    
    def wide_screen_mode(self):
        print("Projector in widescreen mode")
    
    def off(self):
        print("Projector off")

class Lights:
    def dim(self, level):
        print(f"Lights dimmed to {level}%")
    
    def on(self):
        print("Lights on")

# Facade
class HomeTheaterFacade:
    def __init__(self):
        self.amp = Amplifier()
        self.dvd = DVDPlayer()
        self.projector = Projector()
        self.lights = Lights()
    
    def watch_movie(self, movie):
        print("Get ready to watch a movie...\n")
        self.lights.dim(10)
        self.projector.on()
        self.projector.wide_screen_mode()
        self.amp.on()
        self.amp.set_volume(5)
        self.dvd.on()
        self.dvd.play(movie)
        print(f"\nEnjoy '{movie}'!")
    
    def end_movie(self):
        print("\nShutting down theater...\n")
        self.dvd.stop()
        self.dvd.off()
        self.amp.off()
        self.projector.off()
        self.lights.on()
        print("Theater shutdown complete!")

# Usage - simple!
theater = HomeTheaterFacade()
theater.watch_movie("The Matrix")
# ... watch movie ...
theater.end_movie()
```

### Benefits

✅ **Simplification** - Hide complexity  
✅ **Decoupling** - Clients don't depend on subsystem  
✅ **Flexibility** - Subsystem can change without affecting clients

---

## Interview Questions

<details>
<summary><strong>View Questions</strong></summary>

### Q1: What's the difference between Adapter and Facade?

<details>
<summary><strong>View Answer</strong></summary>

**Adapter Pattern:**
- **Purpose:** Make incompatible interfaces compatible
- **Focus:** Interface conversion
- **Classes:** Usually adapts one class
- **When:** Need existing class to work with incompatible interface

```python
# Adapter - makes one thing work with another
class StripeAdapter:
    def process_payment(self, amount):
        return self.stripe.charge_card(amount * 100)
```

**Facade Pattern:**
- **Purpose:** Simplify complex subsystem
- **Focus:** Simplification
- **Classes:** Simplifies multiple classes
- **When:** Complex subsystem needs simple interface

```python
# Facade - simplifies complex system
class HomeTheater:
    def watch_movie(self):
        self.lights.dim()
        self.projector.on()
        self.dvd.play()
        # Many operations hidden
```

**Key difference:**
- Adapter = **Convert** interface
- Facade = **Simplify** interface
</details>

### Q2: When would you use Decorator over inheritance?

<details>
<summary><strong>View Answer</strong></summary>

**Use Decorator when:**

1. **Runtime flexibility needed**
```python
# Decorator - add features at runtime
coffee = SimpleCoffee()
if user.wants_milk:
    coffee = Milk(coffee)
if user.wants_sugar:
    coffee = Sugar(coffee)
```

2. **Many combinations possible**
```python
# Inheritance - explosion of classes
class CoffeeWithMilk(Coffee): pass
class CoffeeWithSugar(Coffee): pass
class CoffeeWithMilkAndSugar(Coffee): pass
class CoffeeWithMilkSugarAndVanilla(Coffee): pass
# ... 100 more classes!

# Decorator - flexible combinations
Vanilla(Sugar(Milk(SimpleCoffee())))
```

3. **Features can be added/removed**
```python
# Easy to unwrap decorators
coffee = Milk(SimpleCoffee())
# If needed, can access original
original = coffee._coffee
```

**Use Inheritance when:**
- Clear IS-A relationship
- Compile-time decision
- Few variations

</details>

### Q3: How does Decorator pattern follow Open/Closed Principle?

<details>
<summary><strong>View Answer</strong></summary>

Decorator follows OCP because:

**Open for Extension:**
```python
# Add new decorator WITHOUT modifying existing code
class CaramelDecorator(CoffeeDecorator):
    def cost(self):
        return self._coffee.cost() + 2.5
    
    def description(self):
        return self._coffee.description() + ", Caramel"

# Can use immediately
coffee = CaramelDecorator(SimpleCoffee())
```

**Closed for Modification:**
```python
# SimpleCoffee and other decorators unchanged!
# No need to modify:
# - SimpleCoffee
# - Milk
# - Sugar
# They remain closed for modification
```

This is the essence of OCP: extend behavior by **adding** new code, not **changing** existing code.
</details>

</details>

---

## Practice Questions

<details>
<summary><strong>View Questions</strong></summary>

### Fill in the Gaps

1. Adapter pattern makes __________ interfaces compatible by converting one interface to another.
2. Decorator pattern adds __________ to objects dynamically without using inheritance.
3. Facade pattern provides a __________ interface to a complex subsystem.
4. The Decorator pattern follows the __________ Principle by allowing extension without modification.
5. Adapter is about interface __________, while Facade is about interface __________.

<details>
<summary><strong>View Answers</strong></summary>

1. incompatible
2. behavior (or functionality/responsibilities)
3. simplified (or simple/unified)
4. Open/Closed
5. conversion, simplification

</details>

### True/False

1. Adapter pattern converts one interface to another.
2. Decorator pattern modifies the original object directly.
3. Facade pattern simplifies interaction with complex subsystems.
4. You can stack multiple decorators on the same object.
5. Adapter and Facade solve the same problem.
6. Decorator pattern requires inheritance from the component being decorated.
7. Facade pattern hides the complexity of subsystem classes.

<details>
<summary><strong>View Answers</strong></summary>

1. True - Makes incompatible interfaces work together
2. False - Decorator wraps the object without modifying it
3. True - Provides simple interface to complex system
4. True - Decorators can be chained/stacked
5. False - Adapter converts interfaces, Facade simplifies
6. False - Decorator wraps via composition, not inheritance
7. True - Clients use facade instead of complex subsystem

</details>

### Multiple Choice Questions

1. Which pattern would you use to integrate a third-party library with incompatible interface?
   - A) Decorator
   - B) Adapter
   - C) Facade
   - D) Bridge

2. What's the main benefit of Decorator pattern?
   - A) Faster execution
   - B) Add behavior at runtime without inheritance
   - C) Reduce memory usage
   - D) Simplify complex code

3. Facade pattern is most useful when:
   - A) Need to convert interfaces
   - B) Want to add features dynamically
   - C) Have complex subsystem to simplify
   - D) Need single instance

<details>
<summary><strong>View Answers</strong></summary>

1. B) Adapter - Converts incompatible interface to expected one
2. B) Add behavior at runtime without inheritance
3. C) Have complex subsystem to simplify

</details>

### Code Challenge

**Challenge:** Create a decorator for a notification system that adds logging and retry functionality.

<details>
<summary><strong>View Solution</strong></summary>

```python
from abc import ABC, abstractmethod
import time

# Component
class Notification(ABC):
    @abstractmethod
    def send(self, message):
        pass

# Concrete component
class EmailNotification(Notification):
    def send(self, message):
        print(f"Sending email: {message}")
        return True

# Decorator base
class NotificationDecorator(Notification):
    def __init__(self, notification):
        self._notification = notification
    
    def send(self, message):
        return self._notification.send(message)

# Logging decorator
class LoggingDecorator(NotificationDecorator):
    def send(self, message):
        print(f"[LOG] Attempting to send: {message}")
        result = self._notification.send(message)
        print(f"[LOG] Send result: {result}")
        return result

# Retry decorator
class RetryDecorator(NotificationDecorator):
    def __init__(self, notification, max_retries=3):
        super().__init__(notification)
        self.max_retries = max_retries
    
    def send(self, message):
        for attempt in range(self.max_retries):
            try:
                print(f"[RETRY] Attempt {attempt + 1}/{self.max_retries}")
                result = self._notification.send(message)
                if result:
                    return True
            except Exception as e:
                print(f"[RETRY] Failed: {e}")
                if attempt < self.max_retries - 1:
                    time.sleep(1)
        return False

# Timestamp decorator
class TimestampDecorator(NotificationDecorator):
    def send(self, message):
        from datetime import datetime
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        timestamped_message = f"[{timestamp}] {message}"
        return self._notification.send(timestamped_message)

# Usage - stack decorators
notification = EmailNotification()
notification = LoggingDecorator(notification)
notification = RetryDecorator(notification, max_retries=3)
notification = TimestampDecorator(notification)

notification.send("Your order has shipped!")

# Output shows all decorators working:
# [RETRY] Attempt 1/3
# [LOG] Attempting to send: [2025-01-10 12:30:45] Your order has shipped!
# Sending email: [2025-01-10 12:30:45] Your order has shipped!
# [LOG] Send result: True
```

</details>

</details>

---

## Summary

### Key Takeaways

**Adapter Pattern:**
- Converts incompatible interfaces
- Use for: Legacy integration, third-party libraries
- Example: Payment gateway adapters

**Decorator Pattern:**
- Adds behavior dynamically
- Use for: Runtime feature addition, multiple combinations
- Example: Coffee with toppings, text formatting

**Facade Pattern:**
- Simplifies complex subsystem
- Use for: Complex API simplification
- Example: Home theater, computer startup

### For Interviews

Be ready to:
- ✅ Explain each pattern's purpose
- ✅ Compare Adapter vs Facade
- ✅ Explain Decorator vs Inheritance
- ✅ Give real-world examples
- ✅ Code simple implementations

---

[← Back to Creational Patterns](01-creational-patterns.md) | [Next: Behavioral Patterns →](03-behavioral-patterns.md) | [↑ Back to README](../README.md)