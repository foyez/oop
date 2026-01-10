# 2.1 Encapsulation

[← Back to Introduction](../01-fundamentals/01-introduction.md) | [Next: Abstraction →](02-abstraction.md) | [↑ Back to README](../README.md)

---

## What is Encapsulation? 🔒

**Encapsulation** is the practice of **bundling data and methods** that operate on that data within a single unit (class), and **controlling access** to that data.

### Core Concept

**Think of it like a capsule:**
- Medicine inside (data) is protected
- You can't access the medicine directly
- You take the whole capsule (controlled access)

### Two Main Aspects

1. **Bundling**: Group related data and methods together
2. **Data Hiding**: Make data private, provide public methods for access

---

## Why Encapsulation?

### 1. Data Protection
Prevents external code from directly modifying internal state

```python
# ❌ Without encapsulation
balance = 1000
balance = -500  # Oops! Negative balance allowed

# ✅ With encapsulation
class BankAccount:
    def __init__(self):
        self.__balance = 1000  # Private
    
    def withdraw(self, amount):
        if self.__balance >= amount:
            self.__balance -= amount
        else:
            print("Insufficient funds")

account = BankAccount()
account.withdraw(1500)  # Safely rejected
```

### 2. Controlled Access
Provide specific ways to interact with data

```python
class Temperature:
    def __init__(self):
        self.__celsius = 0
    
    # Getter - controlled read access
    def get_celsius(self):
        return self.__celsius
    
    # Setter - controlled write access with validation
    def set_celsius(self, value):
        if value < -273.15:  # Absolute zero check
            print("Temperature cannot be below absolute zero")
        else:
            self.__celsius = value
    
    # Computed property
    def get_fahrenheit(self):
        return (self.__celsius * 9/5) + 32

temp = Temperature()
temp.set_celsius(-300)  # Rejected
temp.set_celsius(25)    # Accepted
print(temp.get_fahrenheit())  # 77.0
```

### 3. Prevents Accidental Modification
Internal implementation can change without affecting external code

---

## Real-World Analogy

### ATM Machine

**What you CAN do** (Public Interface):
- Check balance
- Deposit money
- Withdraw money
- Print receipt

**What you CANNOT do** (Private/Hidden):
- Directly access bank database
- Change account numbers
- Modify transaction logs
- Access internal circuitry

```python
class ATM:
    def __init__(self, account_holder):
        self.account_holder = account_holder  # Public
        self.__balance = 0                    # Private
        self.__transaction_log = []           # Private
    
    # Public methods - controlled access
    def check_balance(self):
        return f"Balance: ${self.__balance}"
    
    def deposit(self, amount):
        if amount > 0:
            self.__balance += amount
            self.__log_transaction(f"Deposit: ${amount}")
            return f"Deposited ${amount}"
        return "Invalid amount"
    
    def withdraw(self, amount):
        if 0 < amount <= self.__balance:
            self.__balance -= amount
            self.__log_transaction(f"Withdrawal: ${amount}")
            return f"Withdrew ${amount}"
        return "Insufficient funds"
    
    # Private method - internal use only
    def __log_transaction(self, transaction):
        self.__transaction_log.append(transaction)

# Usage
atm = ATM("Alice")
print(atm.deposit(1000))        # ✅ Works
print(atm.withdraw(500))        # ✅ Works
# atm.__balance = 999999        # ❌ Doesn't work (name mangling)
# atm.__log_transaction("Hack") # ❌ Error - private method
```

---

## Access Modifiers in Different Languages

### Python - Convention-Based

Python doesn't have true private variables, but uses naming conventions:

```python
class MyClass:
    def __init__(self):
        self.public = "I'm public"           # Public
        self._protected = "I'm protected"    # Protected (convention)
        self.__private = "I'm private"       # Private (name mangling)
    
    def public_method(self):
        return "Anyone can call me"
    
    def _protected_method(self):
        return "Internal use (convention)"
    
    def __private_method(self):
        return "Only accessible within class"

obj = MyClass()
print(obj.public)           # ✅ Works
print(obj._protected)       # ✅ Works (but shouldn't access)
# print(obj.__private)      # ❌ AttributeError

# Name mangling - still accessible but discouraged
print(obj._MyClass__private)  # ✅ Works (backdoor access)
```

### TypeScript - True Private

```typescript
class BankAccount {
    public accountHolder: string;      // Accessible everywhere
    private balance: number;           // Only within class
    protected accountType: string;     // Within class and subclasses
    
    constructor(holder: string) {
        this.accountHolder = holder;
        this.balance = 0;
        this.accountType = "Savings";
    }
    
    public deposit(amount: number): string {
        if (amount > 0) {
            this.balance += amount;
            return `Deposited $${amount}`;
        }
        return "Invalid amount";
    }
    
    public getBalance(): number {
        return this.balance;  // Controlled access
    }
    
    private logTransaction(message: string): void {
        console.log(`[INTERNAL] ${message}`);
    }
}

const account = new BankAccount("Alice");
console.log(account.accountHolder);  // ✅ Public
console.log(account.deposit(1000));  // ✅ Public method
// console.log(account.balance);     // ❌ Error: private
// account.logTransaction("Test");   // ❌ Error: private
```

### C++ - Strict Enforcement

```cpp
class BankAccount {
private:
    double balance;           // Only accessible within class
    std::string accountNumber;
    
    void logTransaction(std::string msg) {
        // Private helper method
    }

protected:
    std::string accountType;  // Accessible in derived classes

public:
    std::string accountHolder;
    
    BankAccount(std::string holder) {
        accountHolder = holder;
        balance = 0.0;
    }
    
    void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
        }
    }
    
    double getBalance() {
        return balance;
    }
};

int main() {
    BankAccount account("Alice");
    account.accountHolder = "Alice";  // ✅ Public
    account.deposit(1000);            // ✅ Public
    // account.balance = 999;         // ❌ Error: private
    return 0;
}
```

### Comparison Table

| Feature | Python | TypeScript | C++ |
|---------|--------|-----------|-----|
| **Public** | Default | `public` keyword | `public:` section |
| **Protected** | `_name` (convention) | `protected` keyword | `protected:` section |
| **Private** | `__name` (name mangling) | `private` keyword | `private:` section |
| **Enforcement** | Convention-based | Compile-time | Compile-time |
| **Backdoor Access** | Yes (via name mangling) | No | No |

---

## Getters and Setters

### Why Use Them?

1. **Validation**: Check data before setting
2. **Computed Properties**: Calculate values on-the-fly
3. **Backwards Compatibility**: Change internal representation without breaking code
4. **Side Effects**: Log, notify, or trigger actions when data changes

### Python Property Decorators

```python
class Circle:
    def __init__(self, radius):
        self.__radius = radius
    
    @property
    def radius(self):
        """Getter - read access"""
        return self.__radius
    
    @radius.setter
    def radius(self, value):
        """Setter - write access with validation"""
        if value <= 0:
            raise ValueError("Radius must be positive")
        self.__radius = value
    
    @property
    def area(self):
        """Computed property - no setter needed"""
        return 3.14159 * self.__radius ** 2
    
    @property
    def circumference(self):
        """Another computed property"""
        return 2 * 3.14159 * self.__radius

# Usage - looks like direct attribute access!
circle = Circle(5)
print(circle.radius)        # 5 (calls getter)
print(circle.area)          # 78.53975 (computed)

circle.radius = 10          # Calls setter with validation
print(circle.area)          # 314.159 (automatically updated)

# circle.radius = -5        # ❌ ValueError: Radius must be positive
```

### TypeScript Getters/Setters

```typescript
class Rectangle {
    private _width: number;
    private _height: number;
    
    constructor(width: number, height: number) {
        this._width = width;
        this._height = height;
    }
    
    // Getter
    get width(): number {
        return this._width;
    }
    
    // Setter with validation
    set width(value: number) {
        if (value <= 0) {
            throw new Error("Width must be positive");
        }
        this._width = value;
    }
    
    get height(): number {
        return this._height;
    }
    
    set height(value: number) {
        if (value <= 0) {
            throw new Error("Height must be positive");
        }
        this._height = value;
    }
    
    // Computed property
    get area(): number {
        return this._width * this._height;
    }
    
    get perimeter(): number {
        return 2 * (this._width + this._height);
    }
}

// Usage
const rect = new Rectangle(5, 10);
console.log(rect.width);      // 5
console.log(rect.area);       // 50

rect.width = 8;               // Uses setter
console.log(rect.area);       // 80 (automatically updated)
```

---

## Real-World Examples

### Example 1: Email Validator

```python
import re

class User:
    def __init__(self, name, email):
        self.name = name
        self.__email = None
        self.email = email  # Uses setter for validation
    
    @property
    def email(self):
        return self.__email
    
    @email.setter
    def email(self, value):
        # Email validation
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(pattern, value):
            raise ValueError("Invalid email format")
        self.__email = value
    
    @property
    def email_domain(self):
        """Computed property - extract domain"""
        return self.__email.split('@')[1]

# Usage
user = User("Alice", "alice@example.com")
print(user.email)         # alice@example.com
print(user.email_domain)  # example.com

# user.email = "invalid"  # ❌ ValueError: Invalid email format
user.email = "alice@newdomain.com"  # ✅ Valid
print(user.email_domain)  # newdomain.com
```

### Example 2: Temperature Converter

```python
class Temperature:
    def __init__(self, celsius=0):
        self.__celsius = celsius
    
    @property
    def celsius(self):
        return self.__celsius
    
    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("Temperature below absolute zero!")
        self.__celsius = value
    
    @property
    def fahrenheit(self):
        """Computed - convert celsius to fahrenheit"""
        return (self.__celsius * 9/5) + 32
    
    @fahrenheit.setter
    def fahrenheit(self, value):
        """Allow setting temperature in fahrenheit"""
        celsius_value = (value - 32) * 5/9
        if celsius_value < -273.15:
            raise ValueError("Temperature below absolute zero!")
        self.__celsius = celsius_value
    
    @property
    def kelvin(self):
        """Computed - convert celsius to kelvin"""
        return self.__celsius + 273.15
    
    @kelvin.setter
    def kelvin(self, value):
        """Allow setting temperature in kelvin"""
        if value < 0:
            raise ValueError("Kelvin cannot be negative!")
        self.__celsius = value - 273.15

# Usage
temp = Temperature(25)
print(f"Celsius: {temp.celsius}°C")        # 25°C
print(f"Fahrenheit: {temp.fahrenheit}°F")  # 77.0°F
print(f"Kelvin: {temp.kelvin}K")           # 298.15K

# Set using fahrenheit
temp.fahrenheit = 32
print(f"Celsius: {temp.celsius}°C")        # 0°C

# Set using kelvin
temp.kelvin = 300
print(f"Celsius: {temp.celsius}°C")        # 26.85°C
```

### Example 3: Bank Account with Transaction Limits

```python
from datetime import datetime

class BankAccount:
    DAILY_WITHDRAWAL_LIMIT = 500
    
    def __init__(self, account_holder, initial_balance=0):
        self.account_holder = account_holder
        self.__balance = initial_balance
        self.__daily_withdrawn = 0
        self.__last_transaction_date = datetime.now().date()
        self.__transaction_history = []
    
    @property
    def balance(self):
        """Read-only balance"""
        return self.__balance
    
    def deposit(self, amount):
        if amount <= 0:
            return "Amount must be positive"
        
        self.__balance += amount
        self.__log_transaction("deposit", amount)
        return f"Deposited ${amount}. New balance: ${self.__balance}"
    
    def withdraw(self, amount):
        # Reset daily limit if new day
        self.__check_new_day()
        
        if amount <= 0:
            return "Amount must be positive"
        
        if amount > self.__balance:
            return "Insufficient funds"
        
        if self.__daily_withdrawn + amount > self.DAILY_WITHDRAWAL_LIMIT:
            remaining = self.DAILY_WITHDRAWAL_LIMIT - self.__daily_withdrawn
            return f"Daily limit exceeded. You can withdraw ${remaining} more today"
        
        self.__balance -= amount
        self.__daily_withdrawn += amount
        self.__log_transaction("withdrawal", amount)
        return f"Withdrew ${amount}. Balance: ${self.__balance}"
    
    def __check_new_day(self):
        """Private method - reset daily limit"""
        current_date = datetime.now().date()
        if current_date > self.__last_transaction_date:
            self.__daily_withdrawn = 0
            self.__last_transaction_date = current_date
    
    def __log_transaction(self, transaction_type, amount):
        """Private method - log transactions"""
        self.__transaction_history.append({
            'type': transaction_type,
            'amount': amount,
            'timestamp': datetime.now(),
            'balance_after': self.__balance
        })
    
    def get_transaction_history(self, limit=5):
        """Public method to view recent transactions"""
        recent = self.__transaction_history[-limit:]
        result = "Recent Transactions:\n"
        for t in recent:
            result += f"  {t['timestamp']}: {t['type'].title()} ${t['amount']}\n"
        return result

# Usage
account = BankAccount("Alice", 1000)
print(account.deposit(500))
print(account.withdraw(200))
print(account.withdraw(400))  # Will hit daily limit
print(f"\nCurrent balance: ${account.balance}")
print("\n" + account.get_transaction_history())
```

---

## Practice Questions


<details>
<summary><strong>View Question</strong></summary>

### Fill in the Gaps (FG)

1. Encapsulation combines two concepts: __________ (grouping data and methods together) and __________ (restricting direct access to data).
2. In Python, a variable named `__balance` uses __________ to make it pseudo-private, while `_balance` is a __________ indicating it should be treated as protected.
3. The `@property` decorator in Python creates a __________, while the `@variable.setter` decorator creates a __________.
4. In TypeScript and C++, the __________ access modifier makes members accessible only within the class, while __________ allows access in subclasses as well.
5. Encapsulation helps prevent __________ modification of internal state and provides __________ access through public methods.

### Answers

<details>
<summary><strong>View Answers</strong></summary>

1. Bundling, Data Hiding (or Information Hiding)
2. Name mangling, Convention
3. Getter, Setter
4. private, protected
5. Accidental (or Direct/Unauthorized), Controlled (or Safe/Validated)

</details>

### True or False (TF)

1. Python has true private variables that cannot be accessed from outside the class under any circumstances.
2. Getters and setters are only useful for validation; they serve no other purpose.
3. In TypeScript, private members are enforced at runtime and will cause errors if accessed from outside the class.
4. Encapsulation and data hiding are exactly the same thing.
5. Using properties instead of direct attribute access makes your code more maintainable because you can change the internal implementation without affecting external code.
6. Protected members (with single underscore in Python) are strictly enforced and cannot be accessed from outside the class.
7. Encapsulation helps prevent bugs by ensuring data can only be modified through controlled methods.

### Answers

<details>
<summary><strong>View Answers</strong></summary>

1. **False** (Python uses name mangling for variables starting with double underscores (like `__balance`), but they can still be accessed using `_ClassName__variable`. Python relies on conventions rather than strict enforcement.)
2. **False** (Getters and setters also enable: computed properties, backwards compatibility, logging, notifications, lazy loading, and maintaining invariants. Validation is just one of many uses.)
3. **False** (TypeScript's private modifier is a compile-time check only. Once compiled to JavaScript, the restrictions are removed and the members become accessible. However, the TypeScript compiler will prevent you from writing code that violates access modifiers.)
4. **False** (Data hiding is a component of encapsulation. Encapsulation includes both bundling data with methods AND hiding internal details, while data hiding specifically refers to restricting direct access to data.)
5. **True** (Properties provide an abstraction layer. You can change how data is stored internally (e.g., switching from Celsius to Kelvin) without changing the external interface, as long as the property interface remains the same.)
6. **False** (In Python, single underscore (`_variable`) is purely a convention indicating "internal use." It doesn't prevent access; it's a signal to other developers that the member is intended for internal use only.)
7. **True** (By forcing all modifications to go through methods (setters), you can add validation, logging, and maintain data integrity. This prevents invalid states and makes debugging easier.)

</details>

</details>

### Multiple Choice Questions (MCQ)


1. What happens when you try to access `obj.__private` in Python where `__private` is defined in the class?

    A) It works normally  
    B) AttributeError is raised  
    C) A warning is printed  
    D) It returns None  

2. Which of the following is NOT a benefit of encapsulation?

    A) Data protection  
    B) Controlled access to data  
    C) Faster code execution  
    D) Easier maintenance  

3. In the following code, what is `balance`?

    ```python
    class Account:
        @property
        def balance(self):
            return self.__balance
    ```

    A) A method  
    B) A getter  
    C) A setter  
    D) An attribute  

4. What's the main difference between public and private access modifiers?

    A) Private members are slower  
    B) Public members can be accessed from anywhere; private members only within the class  
    C) Private members can't have methods  
    D) Public members can't be modified  

5. Why would you use a setter method instead of allowing direct attribute access?

    A) To make code slower  
    B) To add validation and control how values are set  
    C) Because it's required by Python  
    D) To make code more complex  

6. Which Python naming convention indicates a protected member?

    A) `__name`  
    B) `_name`  
    C) `name_`  
    D) `name__`  

7. What is a computed property?

    A) A property that is calculated from other data  
    B) A property that uses a computer  
    C) A property that is always changing  
    D) A property stored in a database  

8. In C++, which section contains members accessible to everyone?

    A) private  
    B) protected  
    C) public  
    D) internal  

### Answers

<details>
<summary><strong>View Answers</strong></summary>

1. B) AttributeError is raised

**Explanation**: Double underscore prefixes trigger name mangling in Python, changing `__private` to `_ClassName__private`. Accessing `obj.__private` directly causes an AttributeError, though you can still access it via `obj._ClassName__private`.

2. C) Faster code execution

**Explanation**: Encapsulation provides organization, protection, and maintainability benefits, but it doesn't inherently make code run faster. In fact, the additional method calls might add minimal overhead.

3. B) A getter

**Explanation**: The `@property` decorator converts the method into a getter, allowing you to access it like an attribute (`account.balance`) while maintaining encapsulation.

4. B) Public members can be accessed from anywhere; private members only within the class

**Explanation**: Access modifiers control visibility. Public members are accessible everywhere, while private members are restricted to the class itself (and subclasses for protected).

5. B) To add validation and control how values are set

**Explanation**: Setters allow you to validate input, maintain invariants, log changes, and control exactly how data is modified, preventing invalid states.

6. B) `_name`

**Explanation**: Single underscore prefix (`_name`) is a convention in Python indicating the member is intended for internal use. Double underscore (`__name`) triggers name mangling for pseudo-private members.

7. A) A property that is calculated from other data

**Explanation**: Computed properties (like `area` in a Circle class) are derived from other attributes rather than being stored separately. They're calculated on-the-fly when accessed.

8. C) public

**Explanation**: In C++, members declared in the `public:` section can be accessed from anywhere - inside the class, in derived classes, and from external code.

</details>

</details>

### Code Challenges (CC)

<details>
<summary><strong>Challenge 1: Create a Validated Person Class</strong></summary>

**Task**: Create a `Person` class with:
- Private attributes: `name`, `age`, `email`
- Properties with validation:
  - `name`: Must not be empty
  - `age`: Must be between 0 and 150
  - `email`: Must contain '@' and '.'
- Computed property: `is_adult` (age >= 18)

**Solution**:
```python
class Person:
    def __init__(self, name, age, email):
        self.__name = None
        self.__age = None
        self.__email = None
        
        # Use setters for validation
        self.name = name
        self.age = age
        self.email = email
    
    @property
    def name(self):
        return self.__name
    
    @name.setter
    def name(self, value):
        if not value or not value.strip():
            raise ValueError("Name cannot be empty")
        self.__name = value.strip()
    
    @property
    def age(self):
        return self.__age
    
    @age.setter
    def age(self, value):
        if not isinstance(value, int) or value < 0 or value > 150:
            raise ValueError("Age must be between 0 and 150")
        self.__age = value
    
    @property
    def email(self):
        return self.__email
    
    @email.setter
    def email(self, value):
        if '@' not in value or '.' not in value:
            raise ValueError("Invalid email format")
        self.__email = value
    
    @property
    def is_adult(self):
        """Computed property"""
        return self.__age >= 18
    
    def __str__(self):
        return f"{self.__name} ({self.__age}) - {'Adult' if self.is_adult else 'Minor'}"

# Test
person = Person("Alice Smith", 25, "alice@example.com")
print(person)                # Alice Smith (25) - Adult
print(person.is_adult)       # True

person.age = 16
print(person)                # Alice Smith (16) - Minor

# person.age = 200           # ValueError: Age must be between 0 and 150
# person.email = "invalid"   # ValueError: Invalid email format
```
</details>

<details>
<summary><strong>Challenge 2: Build a Smart Thermostat</strong></summary>

**Task**: Create a `Thermostat` class with:
- Private attribute: `temperature` (in Celsius)
- Methods to get/set temperature with limits (10-30°C)
- Computed properties for Fahrenheit and Kelvin
- Mode setting: "heating", "cooling", or "off"
- Method to determine if heating/cooling is needed based on target temperature

**Solution**:
```python
class Thermostat:
    MIN_TEMP = 10
    MAX_TEMP = 30
    
    def __init__(self, target_celsius=20):
        self.__current_temp = 20
        self.__target_temp = None
        self.__mode = "off"
        
        # Use setter for validation
        self.target_temp = target_celsius
    
    @property
    def current_temp(self):
        return self.__current_temp
    
    @property
    def target_temp(self):
        return self.__target_temp
    
    @target_temp.setter
    def target_temp(self, value):
        if value < self.MIN_TEMP or value > self.MAX_TEMP:
            raise ValueError(f"Temperature must be between {self.MIN_TEMP} and {self.MAX_TEMP}")
        self.__target_temp = value
        self.__adjust_mode()
    
    @property
    def current_fahrenheit(self):
        return (self.__current_temp * 9/5) + 32
    
    @property
    def target_fahrenheit(self):
        return (self.__target_temp * 9/5) + 32
    
    @property
    def mode(self):
        return self.__mode
    
    def set_current_temp(self, temp):
        """Simulate temperature sensor reading"""
        self.__current_temp = temp
        self.__adjust_mode()
        return f"Current temperature set to {temp}°C"
    
    def __adjust_mode(self):
        """Private method - automatically adjust heating/cooling"""
        if self.__current_temp < self.__target_temp:
            self.__mode = "heating"
        elif self.__current_temp > self.__target_temp:
            self.__mode = "cooling"
        else:
            self.__mode = "off"
    
    def get_status(self):
        return f"""
Thermostat Status:
  Current: {self.__current_temp}°C ({self.current_fahrenheit:.1f}°F)
  Target:  {self.__target_temp}°C ({self.target_fahrenheit:.1f}°F)
  Mode:    {self.__mode.upper()}
  Action:  {'Warming up' if self.__mode == 'heating' else 'Cooling down' if self.__mode == 'cooling' else 'Maintaining temperature'}
"""

# Test
thermostat = Thermostat(22)
print(thermostat.get_status())

thermostat.set_current_temp(18)
print(thermostat.get_status())

thermostat.target_temp = 25
print(thermostat.get_status())

# thermostat.target_temp = 35  # ValueError: Temperature out of range
```
</details>

<details>
<summary><strong>Challenge 3: Implement a Secure Password Manager</strong></summary>

**Task**: Create a `PasswordManager` class with:
- Private storage for passwords (dictionary)
- Method to add password with requirements (min 8 chars, has uppercase, lowercase, digit)
- Method to get password (but don't reveal full password - show masked version)
- Method to verify password
- Private method for password validation

**Solution**:
```python
import hashlib

class PasswordManager:
    def __init__(self):
        self.__passwords = {}  # {service: hashed_password}
    
    def add_password(self, service, password):
        """Add a password for a service"""
        if not self.__validate_password(password):
            return "Password does not meet requirements: " \
                   "min 8 characters, uppercase, lowercase, and digit"
        
        # Store hashed password (security best practice)
        hashed = self.__hash_password(password)
        self.__passwords[service] = hashed
        return f"Password added for {service}"
    
    def verify_password(self, service, password):
        """Verify if the provided password matches stored password"""
        if service not in self.__passwords:
            return False
        
        hashed_input = self.__hash_password(password)
        return hashed_input == self.__passwords[service]
    
    def get_password_hint(self, service):
        """Get a masked version of the password length"""
        if service not in self.__passwords:
            return f"No password stored for {service}"
        
        # Don't reveal actual password!
        return f"Password for {service}: {'*' * 8}"
    
    def list_services(self):
        """List all services with stored passwords"""
        if not self.__passwords:
            return "No passwords stored"
        
        return "Services: " + ", ".join(self.__passwords.keys())
    
    def __validate_password(self, password):
        """Private method - validate password strength"""
        if len(password) < 8:
            return False
        
        has_upper = any(c.isupper() for c in password)
        has_lower = any(c.islower() for c in password)
        has_digit = any(c.isdigit() for c in password)
        
        return has_upper and has_lower and has_digit
    
    def __hash_password(self, password):
        """Private method - hash password for secure storage"""
        return hashlib.sha256(password.encode()).hexdigest()

# Test
pm = PasswordManager()

print(pm.add_password("Gmail", "Pass123"))        # ❌ Too weak
print(pm.add_password("Gmail", "MySecure123"))    # ✅ Added

print(pm.get_password_hint("Gmail"))              # Password for Gmail: ********
print(pm.verify_password("Gmail", "wrong"))       # False
print(pm.verify_password("Gmail", "MySecure123")) # True

pm.add_password("Facebook", "FbPass456")
print(pm.list_services())                         # Services: Gmail, Facebook
```
</details>

<details>
<summary><strong>Challenge 4: Create a Shopping Cart with Discount Rules</strong></summary>

**Task**: Create `Product` and `ShoppingCart` classes with:
- Product: name, base_price (private), category
- Property to get price with tax (7%)
- ShoppingCart: items list (private)
- Methods: add_item, remove_item, get_subtotal, get_total
- Private method to calculate discount based on rules:
  - 10% off if total > $100
  - 5% off electronics category
  - Free shipping if total > $50

**Solution**:
```python
class Product:
    TAX_RATE = 0.07  # 7%
    
    def __init__(self, name, base_price, category):
        self.name = name
        self.__base_price = base_price
        self.category = category
    
    @property
    def base_price(self):
        return self.__base_price
    
    @property
    def price_with_tax(self):
        """Computed property - price including tax"""
        return self.__base_price * (1 + self.TAX_RATE)

class ShoppingCart:
    DISCOUNT_THRESHOLD = 100
    DISCOUNT_RATE = 0.10
    ELECTRONICS_DISCOUNT = 0.05
    FREE_SHIPPING_THRESHOLD = 50
    SHIPPING_COST = 10
    
    def __init__(self):
        self.__items = []  # Private list of {product, quantity}
    
    def add_item(self, product, quantity=1):
        """Add product to cart"""
        # Check if product already in cart
        for item in self.__items:
            if item['product'].name == product.name:
                item['quantity'] += quantity
                return f"Updated {product.name} quantity to {item['quantity']}"
        
        # Add new item
        self.__items.append({'product': product, 'quantity': quantity})
        return f"Added {quantity}x {product.name} to cart"
    
    def remove_item(self, product_name):
        """Remove product from cart"""
        self.__items = [item for item in self.__items 
                        if item['product'].name != product_name]
        return f"Removed {product_name} from cart"
    
    def get_subtotal(self):
        """Calculate subtotal (before discounts and shipping)"""
        total = 0
        for item in self.__items:
            total += item['product'].price_with_tax * item['quantity']
        return total
    
    def get_total(self):
        """Calculate final total with discounts and shipping"""
        subtotal = self.get_subtotal()
        discount = self.__calculate_discount(subtotal)
        shipping = self.__calculate_shipping(subtotal)
        
        return {
            'subtotal': subtotal,
            'discount': discount,
            'shipping': shipping,
            'total': subtotal - discount + shipping
        }
    
    def __calculate_discount(self, subtotal):
        """Private method - calculate applicable discounts"""
        discount = 0
        
        # Bulk discount
        if subtotal > self.DISCOUNT_THRESHOLD:
            discount += subtotal * self.DISCOUNT_RATE
        
        # Category discount
        for item in self.__items:
            if item['product'].category.lower() == 'electronics':
                item_total = item['product'].price_with_tax * item['quantity']
                discount += item_total * self.ELECTRONICS_DISCOUNT
        
        return discount
    
    def __calculate_shipping(self, subtotal):
        """Private method - calculate shipping cost"""
        if subtotal >= self.FREE_SHIPPING_THRESHOLD:
            return 0
        return self.SHIPPING_COST
    
    def display_cart(self):
        """Show cart contents and totals"""
        if not self.__items:
            return "Cart is empty"
        
        result = "Shopping Cart:\n" + "=" * 50 + "\n"
        
        for item in self.__items:
            product = item['product']
            quantity = item['quantity']
            subtotal = product.price_with_tax * quantity
            result += f"{product.name} ({product.category})\n"
            result += f"  ${product.base_price:.2f} x {quantity} " \
                     f"(+tax) = ${subtotal:.2f}\n"
        
        totals = self.get_total()
        result += "=" * 50 + "\n"
        result += f"Subtotal:   ${totals['subtotal']:.2f}\n"
        result += f"Discount:  -${totals['discount']:.2f}\n"
        result += f"Shipping:   ${totals['shipping']:.2f}\n"
        result += f"Total:      ${totals['total']:.2f}\n"
        
        return result

# Test
cart = ShoppingCart()

laptop = Product("Laptop", 900, "Electronics")
mouse = Product("Mouse", 25, "Electronics")
book = Product("Python Book", 40, "Books")

cart.add_item(laptop, 1)
cart.add_item(mouse, 2)
cart.add_item(book, 1)

print(cart.display_cart())
```
</details>

---

## Summary

### Key Takeaways

1. **Encapsulation = Bundling + Data Hiding**
2. **Access modifiers** control visibility (public, private, protected)
3. **Python uses conventions** (`_protected`, `__private`) - not strict enforcement
4. **Getters/Setters** provide controlled access with validation
5. **Properties** (@property) make methods look like attributes
6. **Benefits**: Data protection, controlled access, easier maintenance

### Memory Aid

**"CAPSULE" for Encapsulation:**
- **C**ontrolled access
- **A**ttributes hidden
- **P**rotection of data
- **S**etters with validation
- **U**nified bundling
- **L**ess coupling
- **E**asier maintenance

### Interview Tips

**Common Questions:**
1. "What's the difference between encapsulation and abstraction?"
   - **Encapsulation**: HOW data is accessed (bundling + hiding)
   - **Abstraction**: WHAT is shown to users (hiding complexity)

2. "Why use getters/setters instead of public variables?"
   - Validation, computed properties, backwards compatibility, side effects

3. "Does Python have true private variables?"
   - No, uses name mangling and conventions. Philosophy: "We're all consenting adults here"

---

[← Back to Introduction](../01-fundamentals/01-introduction.md) | [Next: Abstraction →](02-abstraction.md) | [↑ Back to README](../README.md)