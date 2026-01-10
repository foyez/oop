# 1.1 Introduction to OOP

[← Back to README](../README.md) | [Next: Encapsulation →](../02-core-pillars/01-encapsulation.md)

---

## What is OOP?

**Object-Oriented Programming (OOP)** is a programming paradigm that organizes code around **objects** rather than functions and logic.

### Core Concept

Think of programming approaches as different ways to build a house:

**Procedural Programming** (Traditional):
```
1. Buy bricks
2. Mix cement
3. Lay foundation
4. Build walls
5. Add roof
```
→ Step-by-step instructions (like a recipe)

**Object-Oriented Programming**:
```
House = {
    foundation: Foundation object
    walls: Wall objects
    roof: Roof object
    
    Methods:
        build()
        renovate()
        maintain()
}
```
→ Reusable components that interact (like LEGO blocks)

### What is an Object?

An **object** is a self-contained unit that:
- Holds **data** → *attributes* (what it knows)
- Performs **actions** → *methods* (what it does)

### Real-Life Example: A Car

**Data (Attributes)**:
```python
brand = "Tesla"
color = "Red"
speed = 0
fuel = 100
```

**Actions (Methods)**:
```python
def start():
    print("Engine started")

def accelerate():
    speed += 10

def brake():
    speed -= 10
```

### Class vs Object

| Concept | Analogy | Programming |
|---------|---------|-------------|
| **Class** | Blueprint of a house | Template/Definition |
| **Object** | Actual house built | Instance created from class |

**Example**:
```python
# Class = Blueprint
class Car:
    def __init__(self, brand, color):
        self.brand = brand
        self.color = color
    
    def drive(self):
        return f"The {self.color} {self.brand} is driving"

# Objects = Actual cars built from blueprint
my_car = Car("Tesla", "Red")      # Object 1
your_car = Car("BMW", "Blue")     # Object 2

print(my_car.drive())   # The Red Tesla is driving
print(your_car.drive()) # The Blue BMW is driving
```

**Real-World Analogy**:
- **Class**: Cookie cutter
- **Object**: Actual cookies made from that cutter

---

## Why Use OOP?

### 1. 🧩 Modularity
**Code is organized into self-contained objects**

```python
# Without OOP - everything mixed together
user_name = "Alice"
user_email = "alice@email.com"
user_age = 25

def send_email(email):
    print(f"Sending email to {email}")

def validate_age(age):
    return age >= 18

# With OOP - organized into objects
class User:
    def __init__(self, name, email, age):
        self.name = name
        self.email = email
        self.age = age
    
    def send_email(self):
        print(f"Sending email to {self.email}")
    
    def is_adult(self):
        return self.age >= 18

user = User("Alice", "alice@email.com", 25)
```

### 2. ♻️ Reusability
**Write once, use many times**

```python
class EmailService:
    def send(self, to, message):
        print(f"Email sent to {to}: {message}")

# Reuse in multiple places
registration_service = EmailService()
notification_service = EmailService()
marketing_service = EmailService()
```

### 3. 🔧 Maintainability
**Easier to fix and update**

```python
# Change in one place affects all objects
class Database:
    def connect(self):
        return "Connected to database"

# If connection logic changes, update once in the class
# All instances automatically use the new logic
```

### 4. 📈 Scalability
**Easier to expand your application**

```python
# Easy to add new features
class Animal:
    def speak(self):
        pass

# Add new animals without changing existing code
class Dog(Animal):
    def speak(self):
        return "Woof!"

class Cat(Animal):
    def speak(self):
        return "Meow!"
```

### 5. 🌍 Real-world Modeling
**Mirrors how we think about the world**

```
Real World          →    Code
-----------              ----
Bank Account       →    BankAccount class
Customer           →    Customer class
Transaction        →    Transaction class
ATM                →    ATM class
```

---

## OOP vs Procedural Programming

### Procedural Approach

```python
# Global variables
balance = 1000
account_holder = "Alice"

# Functions operating on global data
def deposit(amount):
    global balance
    balance += amount
    print(f"Deposited: ${amount}. New balance: ${balance}")

def withdraw(amount):
    global balance
    if amount <= balance:
        balance -= amount
        print(f"Withdrew: ${amount}. Remaining: ${balance}")
    else:
        print("Insufficient funds")

# Usage
deposit(500)
withdraw(200)
```

**Problems**:
- ❌ Global variables can be modified anywhere
- ❌ No data protection
- ❌ Hard to manage multiple accounts
- ❌ Functions not tied to data

### OOP Approach

```python
class BankAccount:
    def __init__(self, account_holder, balance=0):
        self.account_holder = account_holder
        self.__balance = balance  # Private
    
    def deposit(self, amount):
        if amount > 0:
            self.__balance += amount
            return f"Deposited: ${amount}. New balance: ${self.__balance}"
        return "Invalid amount"
    
    def withdraw(self, amount):
        if 0 < amount <= self.__balance:
            self.__balance -= amount
            return f"Withdrew: ${amount}. Remaining: ${self.__balance}"
        return "Insufficient funds"
    
    def get_balance(self):
        return self.__balance

# Usage - multiple accounts easily managed
alice_account = BankAccount("Alice", 1000)
bob_account = BankAccount("Bob", 500)

print(alice_account.deposit(500))
print(bob_account.withdraw(200))
```

**Benefits**:
- ✅ Data encapsulated within objects
- ✅ Each object manages its own state
- ✅ Easy to create multiple instances
- ✅ Methods tied to data they operate on

### Comparison Table

| Aspect | Procedural | OOP |
|--------|------------|-----|
| **Focus** | Functions and logic | Objects and interactions |
| **Data** | Global/passed variables | Encapsulated in objects |
| **Reusability** | Functions | Classes and inheritance |
| **State Management** | Manual | Automatic (per object) |
| **Real-world Modeling** | Difficult | Natural |
| **Scalability** | Harder | Easier |
| **Best For** | Simple scripts, algorithms | Large applications, complex systems |

---

## OOP Terminology

### Essential Terms

| Term | Definition | Example |
|------|------------|---------|
| **Class** | Blueprint for creating objects | `class Car` |
| **Object** | Instance of a class | `my_car = Car()` |
| **Attribute** | Variable belonging to object | `car.color = "Red"` |
| **Method** | Function belonging to object | `car.drive()` |
| **Constructor** | Special method to initialize object | `__init__()` in Python |
| **Instance** | Specific object created from class | `car1`, `car2` |
| **Self** | Reference to current object | `self.name` |

### Code Example with All Terms

```python
class Student:  # Class definition
    # Constructor - initializes the object
    def __init__(self, name, age):
        self.name = name    # Attribute
        self.age = age      # Attribute
        self.grades = []    # Attribute
    
    # Method - function belonging to the object
    def add_grade(self, grade):
        self.grades.append(grade)
    
    # Method - using self to access object's data
    def get_average(self):
        if self.grades:
            return sum(self.grades) / len(self.grades)
        return 0

# Creating objects (instances) from the class
student1 = Student("Alice", 20)  # Object/Instance 1
student2 = Student("Bob", 21)    # Object/Instance 2

# Using methods on objects
student1.add_grade(85)
student1.add_grade(90)

student2.add_grade(75)
student2.add_grade(80)

# Each object maintains its own state
print(f"{student1.name}'s average: {student1.get_average()}")  # 87.5
print(f"{student2.name}'s average: {student2.get_average()}")  # 77.5
```

---

## Real-World Examples

### Example 1: Library System

```python
class Book:
    def __init__(self, title, author, isbn):
        self.title = title
        self.author = author
        self.isbn = isbn
        self.is_available = True
    
    def borrow(self):
        if self.is_available:
            self.is_available = False
            return f"'{self.title}' borrowed successfully"
        return f"'{self.title}' is not available"
    
    def return_book(self):
        self.is_available = True
        return f"'{self.title}' returned successfully"

class Library:
    def __init__(self, name):
        self.name = name
        self.books = []
    
    def add_book(self, book):
        self.books.append(book)
        return f"'{book.title}' added to {self.name}"
    
    def find_book(self, isbn):
        for book in self.books:
            if book.isbn == isbn:
                return book
        return None

# Usage
library = Library("City Library")

book1 = Book("Python Crash Course", "Eric Matthes", "978-1593276034")
book2 = Book("Clean Code", "Robert Martin", "978-0132350884")

library.add_book(book1)
library.add_book(book2)

print(book1.borrow())  # 'Python Crash Course' borrowed successfully
print(book1.borrow())  # 'Python Crash Course' is not available
print(book1.return_book())  # 'Python Crash Course' returned successfully
```

### Example 2: Online Shopping Cart

```python
class Product:
    def __init__(self, name, price, category):
        self.name = name
        self.price = price
        self.category = category
    
    def get_discounted_price(self, discount_percent):
        return self.price * (1 - discount_percent / 100)

class ShoppingCart:
    def __init__(self):
        self.items = []
    
    def add_item(self, product, quantity=1):
        self.items.append({
            'product': product,
            'quantity': quantity
        })
        return f"Added {quantity}x {product.name} to cart"
    
    def remove_item(self, product_name):
        self.items = [item for item in self.items 
                      if item['product'].name != product_name]
        return f"Removed {product_name} from cart"
    
    def get_total(self):
        total = 0
        for item in self.items:
            total += item['product'].price * item['quantity']
        return total
    
    def display_cart(self):
        if not self.items:
            return "Cart is empty"
        
        result = "Shopping Cart:\n"
        for item in self.items:
            product = item['product']
            quantity = item['quantity']
            subtotal = product.price * quantity
            result += f"  {product.name} x{quantity} = ${subtotal}\n"
        result += f"Total: ${self.get_total()}"
        return result

# Usage
laptop = Product("Laptop", 1200, "Electronics")
mouse = Product("Mouse", 25, "Accessories")
keyboard = Product("Keyboard", 75, "Accessories")

cart = ShoppingCart()
print(cart.add_item(laptop, 1))
print(cart.add_item(mouse, 2))
print(cart.add_item(keyboard, 1))

print("\n" + cart.display_cart())
print(f"\nDiscounted laptop price: ${laptop.get_discounted_price(10)}")
```

---

## Practice Questions

<details>
<summary><strong>View Questions</strong></summary>

### Fill in the Gaps

1. A __________ is a blueprint for creating objects, while an __________ is an actual instance created from that blueprint.
2. An object has two main components: __________ (data it holds) and __________ (actions it can perform).
3. In Python, the __________ method is called automatically when an object is created, and it uses the __________ parameter to refer to the current object.
4. OOP provides better __________ compared to procedural programming because code is organized into self-contained units.
5. The real-world modeling advantage of OOP means that real entities like "Bank Account" or "Customer" can be directly represented as __________ in code.

### Answers

<details>
<summary><strong>View Answers</strong></summary>

1. Class, Object (or Instance)
2. Attributes (or Properties), Methods (or Functions)
3. `__init__`, `self`
4. Modularity (or Organization, Encapsulation)
5. Classes (or Objects)

</details>

### True or False (TF)

1. In OOP, you can create multiple objects from the same class, and each object will have its own independent state.
2. Procedural programming is always better than OOP for large-scale applications.
3. In Python, a class can only have one method.
4. The `self` parameter in Python methods is used to reference the class itself, not the instance.
5. OOP makes code more reusable because you can create classes once and use them multiple times.
6. In OOP, attributes must always be public and accessible from outside the class.
7. A class and an object are the same thing in programming.

### Answers

<details>
<summary><strong>View Answers</strong></summary>

1. True
**Explanation**: Each object (instance) created from a class maintains its own copy of attributes. For example, `car1` and `car2` created from the `Car` class can have different colors and speeds.
2. False
**Explanation**: OOP is generally better for large-scale applications because it provides better organization, modularity, and maintainability. Procedural programming is better suited for simple scripts and algorithms.
3. False
**Explanation**: A class can have as many methods as needed. Methods are functions that belong to the class and operate on its data.
4. False
**Explanation**: `self` refers to the current instance (object) of the class, not the class itself. It allows you to access the instance's attributes and methods.
5. True
**Explanation**: Classes act as templates that can be instantiated multiple times. You can also extend classes through inheritance, further promoting code reuse.
6. False
**Explanation**: OOP supports encapsulation, which allows attributes to be private (hidden) and accessed only through controlled methods (getters/setters).
7. False
**Explanation**: A class is a blueprint/template, while an object is an actual instance created from that blueprint. The class defines the structure, and objects are concrete realizations of that structure.

</details>

### Multiple Choice Questions (MCQ)

1. What is the primary purpose of the `__init__` method in Python?

    - A) To delete an object  
    - B) To initialize an object's attributes  
    - C) To print object information  
    - D) To create a class

2. Which analogy best describes the relationship between a class and an object?

    - A) Recipe and ingredients  
    - B) Cookie cutter and cookies  
    - C) Book and pages  
    - D) Computer and keyboard 

3. Which of the following is NOT a benefit of OOP?

    - A) Modularity  
    - B) Reusability  
    - C) Simpler syntax than procedural  
    - D) Real-world modeling  

4. In the following code, what does `car1` represent?

```python
class Car:
    def __init__(self, brand):
        self.brand = brand

car1 = Car("Tesla")
```

    - A) A class  
    - B) A method  
    - C) An object/instance  
    - D) An attribute  

5. What is the main difference between procedural and object-oriented programming?

    - A) OOP uses functions, procedural doesn't  
    - B) Procedural focuses on functions and logic, OOP focuses on objects and data  
    - C) OOP can't use variables  
    - D) Procedural is only for databases  

6. Which component of an object represents "what it knows"?

    - A) Methods  
    - B) Functions  
    - C) Attributes  
    - D) Classes  

7. How many objects can you create from a single class?

    - A) Only one  
    - B) Maximum of 10  
    - C) Only two  
    - D) As many as needed  

8. What happens when you create two objects from the same class and change an attribute in one object?

    - A) Both objects change  
    - B) Only that specific object changes  
    - C) The class changes  
    - D) An error occurs  

### Answers

<details>
<summary><strong>View Answers</strong></summary>
</details>

1. B) **To initialize an object's attributes** (The `__init__` method is a constructor that runs automatically when an object is created. It's used to set initial values for the object's attributes.)

2. B) **Cookie cutter and cookies** (A class is like a cookie cutter (blueprint/template), and objects are like the actual cookies made from that cutter. Each cookie has the same shape but can have different toppings, sizes, etc.)

3. C) **Simpler syntax than procedural** (OOP often has more complex syntax than procedural programming. The benefits of OOP lie in organization, reusability, and maintainability, not simplicity of syntax.)

4. C) **An object/instance** (`car1` is an object (instance) created from the `Car` class. It's a specific car with the brand "Tesla".)

5. B) **Procedural focuses on functions and logic, OOP focuses on objects and data** (Procedural programming organizes code around functions that operate on data, while OOP organizes code around objects that encapsulate both data and the functions that operate on that data.)

6.  C) **Attributes** (Attributes (also called properties or fields) represent the data an object holds - what it "knows". Methods represent what an object can "do".)

7. D) **As many as needed** (A class is a template, and you can create unlimited objects (instances) from it. Each object will have its own independent state.)

8. B) **Only that specific object changes** (Each object maintains its own state independently. Changing an attribute in one object doesn't affect other objects created from the same class.)

</details>

</details>

### Code Challenges (CC)

<details>
<summary><strong>Challenge 1: Create a Simple Rectangle Class</strong></summary>

**Task**: Create a `Rectangle` class with:
- Attributes: `width` and `height`
- Methods:
  - `calculate_area()` - returns width × height
  - `calculate_perimeter()` - returns 2 × (width + height)
  - `is_square()` - returns True if width equals height

**Solution**:
```python
class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height
    
    def calculate_area(self):
        return self.width * self.height
    
    def calculate_perimeter(self):
        return 2 * (self.width + self.height)
    
    def is_square(self):
        return self.width == self.height

# Test
rect1 = Rectangle(5, 10)
print(f"Area: {rect1.calculate_area()}")           # 50
print(f"Perimeter: {rect1.calculate_perimeter()}") # 30
print(f"Is square: {rect1.is_square()}")           # False

rect2 = Rectangle(5, 5)
print(f"Is square: {rect2.is_square()}")           # True
```
</details>

<details>
<summary><strong>Challenge 2: Build a Simple Bank Account System</strong></summary>

**Task**: Create a `BankAccount` class with:
- Attributes: `account_holder` and `balance` (private)
- Methods:
  - `deposit(amount)` - add money (only positive amounts)
  - `withdraw(amount)` - remove money (check sufficient funds)
  - `get_balance()` - return current balance
  - `transfer(other_account, amount)` - transfer money to another account

**Solution**:
```python
class BankAccount:
    def __init__(self, account_holder, initial_balance=0):
        self.account_holder = account_holder
        self.__balance = initial_balance  # Private
    
    def deposit(self, amount):
        if amount > 0:
            self.__balance += amount
            return f"Deposited ${amount}. New balance: ${self.__balance}"
        return "Invalid amount. Must be positive."
    
    def withdraw(self, amount):
        if amount <= 0:
            return "Invalid amount. Must be positive."
        if amount > self.__balance:
            return "Insufficient funds."
        
        self.__balance -= amount
        return f"Withdrew ${amount}. Remaining balance: ${self.__balance}"
    
    def get_balance(self):
        return self.__balance
    
    def transfer(self, other_account, amount):
        if amount <= 0:
            return "Invalid amount. Must be positive."
        if amount > self.__balance:
            return "Insufficient funds for transfer."
        
        self.__balance -= amount
        other_account.__balance += amount
        return f"Transferred ${amount} to {other_account.account_holder}. " \
               f"Your balance: ${self.__balance}"

# Test
alice = BankAccount("Alice", 1000)
bob = BankAccount("Bob", 500)

print(alice.deposit(500))          # Deposited $500. New balance: $1500
print(alice.withdraw(200))         # Withdrew $200. Remaining balance: $1300
print(alice.transfer(bob, 300))    # Transferred $300 to Bob. Your balance: $1000
print(bob.get_balance())           # 800
```
</details>

<details>
<summary><strong>Challenge 3: Create a Student Grade Tracker</strong></summary>

**Task**: Create a `Student` class with:
- Attributes: `name`, `student_id`, and `grades` (list)
- Methods:
  - `add_grade(subject, grade)` - add a grade for a subject
  - `get_average()` - calculate and return average grade
  - `get_letter_grade()` - return letter grade based on average (A: 90+, B: 80-89, C: 70-79, D: 60-69, F: <60)
  - `display_grades()` - show all grades

**Solution**:
```python
class Student:
    def __init__(self, name, student_id):
        self.name = name
        self.student_id = student_id
        self.grades = {}
    
    def add_grade(self, subject, grade):
        if 0 <= grade <= 100:
            self.grades[subject] = grade
            return f"Added {grade} for {subject}"
        return "Invalid grade. Must be between 0 and 100."
    
    def get_average(self):
        if not self.grades:
            return 0
        return sum(self.grades.values()) / len(self.grades)
    
    def get_letter_grade(self):
        avg = self.get_average()
        if avg >= 90:
            return 'A'
        elif avg >= 80:
            return 'B'
        elif avg >= 70:
            return 'C'
        elif avg >= 60:
            return 'D'
        else:
            return 'F'
    
    def display_grades(self):
        if not self.grades:
            return "No grades recorded."
        
        result = f"Grades for {self.name} (ID: {self.student_id}):\n"
        for subject, grade in self.grades.items():
            result += f"  {subject}: {grade}\n"
        result += f"Average: {self.get_average():.2f}\n"
        result += f"Letter Grade: {self.get_letter_grade()}"
        return result

# Test
student = Student("Alice Johnson", "S12345")
student.add_grade("Math", 95)
student.add_grade("Science", 87)
student.add_grade("English", 92)
student.add_grade("History", 88)

print(student.display_grades())
# Output:
# Grades for Alice Johnson (ID: S12345):
#   Math: 95
#   Science: 87
#   English: 92
#   History: 88
# Average: 90.50
# Letter Grade: A
```
</details>

<details>
<summary><strong>Challenge 4: Inventory Management System</strong></summary>

**Task**: Create two classes:
1. `Product` with attributes: `name`, `price`, `quantity`
   - Method: `update_quantity(amount)` - add/remove stock
   
2. `Inventory` with:
   - Method: `add_product(product)` - add product to inventory
   - Method: `remove_product(product_name)` - remove product
   - Method: `find_product(name)` - find product by name
   - Method: `total_value()` - calculate total inventory value
   - Method: `low_stock(threshold)` - list products below threshold

**Solution**:
```python
class Product:
    def __init__(self, name, price, quantity):
        self.name = name
        self.price = price
        self.quantity = quantity
    
    def update_quantity(self, amount):
        new_quantity = self.quantity + amount
        if new_quantity < 0:
            return f"Cannot reduce quantity below 0. Current: {self.quantity}"
        
        self.quantity = new_quantity
        action = "Added" if amount > 0 else "Removed"
        return f"{action} {abs(amount)} units. New quantity: {self.quantity}"
    
    def get_value(self):
        return self.price * self.quantity

class Inventory:
    def __init__(self):
        self.products = []
    
    def add_product(self, product):
        self.products.append(product)
        return f"Added {product.name} to inventory"
    
    def remove_product(self, product_name):
        self.products = [p for p in self.products if p.name != product_name]
        return f"Removed {product_name} from inventory"
    
    def find_product(self, name):
        for product in self.products:
            if product.name.lower() == name.lower():
                return product
        return None
    
    def total_value(self):
        return sum(product.get_value() for product in self.products)
    
    def low_stock(self, threshold=10):
        low_items = [p for p in self.products if p.quantity < threshold]
        if not low_items:
            return "No low stock items."
        
        result = f"Low stock items (below {threshold}):\n"
        for product in low_items:
            result += f"  {product.name}: {product.quantity} units\n"
        return result.rstrip()

# Test
inventory = Inventory()

laptop = Product("Laptop", 1000, 15)
mouse = Product("Mouse", 25, 50)
keyboard = Product("Keyboard", 75, 8)

inventory.add_product(laptop)
inventory.add_product(mouse)
inventory.add_product(keyboard)

print(f"Total inventory value: ${inventory.total_value()}")
print("\n" + inventory.low_stock(10))

found = inventory.find_product("laptop")
if found:
    print(f"\nFound: {found.name} - ${found.price} - {found.quantity} units")
```
</details>

---

## Summary

### Key Takeaways

1. **OOP organizes code around objects** - self-contained units with data and behavior
2. **Classes are blueprints** - define structure; objects are instances
3. **Objects have attributes** (data) **and methods** (actions)
4. **OOP benefits**: Modularity, Reusability, Maintainability, Scalability, Real-world modeling
5. **Better than procedural** for large, complex applications

### Memory Aid

**"OOPP" - Object-Oriented Programming Properties**
- **O**rganization - code structured into objects
- **O**bjects - instances with state and behavior
- **P**rotection - encapsulation of data
- **P**olymorphism - flexibility (covered later)

### What's Next?

Now that you understand the fundamentals of OOP, we'll dive into the **Four Pillars of OOP**:

1. [**Encapsulation**](../02-core-pillars/01-encapsulation.md) - Data protection and hiding
2. **Abstraction** - Simplifying complexity
3. **Inheritance** - Code reuse through relationships
4. **Polymorphism** - One interface, many forms

---

[← Back to README](../README.md) | [Next: Encapsulation →](../02-core-pillars/01-encapsulation.md)