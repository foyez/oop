# Chapter 2: The Four Pillars of OOP

The four pillars of OOP are fundamental principles that make code more organized, reusable, and maintainable. These aren't just theoretical concepts—they solve real-world software engineering problems.

---

## Table of Contents

- [1. Encapsulation](#1-encapsulation)
- [2. Abstraction](#2-abstraction)
- [3. Inheritance](#3-inheritance)
- [4. Polymorphism](#4-polymorphism)

---

## 1. Encapsulation

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

### Why Encapsulation?

**1. Data Protection**

Prevents external code from directly modifying internal state

<details>
<summary><strong>View Examples</strong></summary>

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

</details>

**2. Controlled Access**

Provide specific ways to interact with data

<details>
<summary><strong>View Examples</strong></summary>

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

</details>

**3. Prevents Accidental Modification**

Internal implementation can change without affecting external code

**4. Flexibility**

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

<details>
<summary><strong>View Examples</strong></summary>

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

</details>

---

### Key Techniques:

1. **Private fields** with **public methods** (getters/setters)
2. **Validation in setters** to maintain data integrity
3. **Hiding complexity** behind simple interfaces

<details>
<summary><strong>View Examples</strong></summary>

```typescript
// TypeScript - Banking System with Encapsulation
class BankAccount {
  private accountNumber: string;
  private accountHolder: string;
  private balance: number;
  private transactionHistory: Array<{ type: string; amount: number; date: Date; balance: number }>;
  private readonly MIN_BALANCE = 100;
  private readonly DAILY_WITHDRAWAL_LIMIT = 5000;
  private dailyWithdrawalAmount: number;
  private lastWithdrawalDate: Date;

  constructor(accountNumber: string, accountHolder: string, initialDeposit: number) {
    if (initialDeposit < this.MIN_BALANCE) {
      throw new Error(`Initial deposit must be at least $${this.MIN_BALANCE}`);
    }
    this.accountNumber = accountNumber;
    this.accountHolder = accountHolder;
    this.balance = initialDeposit;
    this.transactionHistory = [];
    this.dailyWithdrawalAmount = 0;
    this.lastWithdrawalDate = new Date();
    this.recordTransaction("Opening Deposit", initialDeposit);
  }

  // Public interface - users interact through these methods
  public deposit(amount: number): boolean {
    if (!this.validateAmount(amount)) {
      return false;
    }
    
    this.balance += amount;
    this.recordTransaction("Deposit", amount);
    console.log(`Deposited $${amount}. New balance: $${this.balance}`);
    return true;
  }

  public withdraw(amount: number): boolean {
    if (!this.validateAmount(amount)) {
      return false;
    }

    if (!this.checkDailyLimit(amount)) {
      console.log(`Daily withdrawal limit of $${this.DAILY_WITHDRAWAL_LIMIT} exceeded`);
      return false;
    }

    if (!this.hasSufficientBalance(amount)) {
      console.log("Insufficient funds");
      return false;
    }

    this.balance -= amount;
    this.updateDailyWithdrawal(amount);
    this.recordTransaction("Withdrawal", amount);
    console.log(`Withdrawn $${amount}. Remaining balance: $${this.balance}`);
    return true;
  }

  public transfer(targetAccount: BankAccount, amount: number): boolean {
    if (this.withdraw(amount)) {
      targetAccount.deposit(amount);
      console.log(`Transferred $${amount} to account ${targetAccount.getAccountNumber()}`);
      return true;
    }
    return false;
  }

  // Controlled read access
  public getBalance(): number {
    return this.balance;
  }

  public getAccountNumber(): string {
    // Return masked account number for security
    return this.accountNumber.slice(-4).padStart(this.accountNumber.length, '*');
  }

  public getTransactionHistory(): Array<{ type: string; amount: number; date: string }> {
    // Return a copy to prevent external modification
    return this.transactionHistory.map(t => ({
      type: t.type,
      amount: t.amount,
      date: t.date.toISOString()
    }));
  }

  public getAccountStatement(): string {
    const statement = [
      `Account Statement`,
      `Account Holder: ${this.accountHolder}`,
      `Account Number: ${this.getAccountNumber()}`,
      `Current Balance: $${this.balance}`,
      `\nRecent Transactions:`
    ];

    this.transactionHistory.slice(-5).forEach(t => {
      statement.push(`  ${t.date.toLocaleDateString()} - ${t.type}: $${t.amount} (Balance: $${t.balance})`);
    });

    return statement.join('\n');
  }

  // Private helper methods - encapsulated implementation details
  private validateAmount(amount: number): boolean {
    if (amount <= 0) {
      console.log("Amount must be positive");
      return false;
    }
    if (!Number.isFinite(amount)) {
      console.log("Invalid amount");
      return false;
    }
    return true;
  }

  private hasSufficientBalance(amount: number): boolean {
    return (this.balance - amount) >= this.MIN_BALANCE;
  }

  private checkDailyLimit(amount: number): boolean {
    this.resetDailyLimitIfNeeded();
    return (this.dailyWithdrawalAmount + amount) <= this.DAILY_WITHDRAWAL_LIMIT;
  }

  private resetDailyLimitIfNeeded(): void {
    const today = new Date();
    if (today.toDateString() !== this.lastWithdrawalDate.toDateString()) {
      this.dailyWithdrawalAmount = 0;
      this.lastWithdrawalDate = today;
    }
  }

  private updateDailyWithdrawal(amount: number): void {
    this.dailyWithdrawalAmount += amount;
  }

  private recordTransaction(type: string, amount: number): void {
    this.transactionHistory.push({
      type,
      amount,
      date: new Date(),
      balance: this.balance
    });
  }
}

// Usage
const account1 = new BankAccount("ACC001234", "Alice Johnson", 5000);
const account2 = new BankAccount("ACC005678", "Bob Smith", 3000);

account1.deposit(1000);              // Deposited $1000. New balance: $6000
account1.withdraw(500);              // Withdrawn $500. Remaining balance: $5500
account1.transfer(account2, 1000);   // Transferred $1000 to account ****5678

console.log(account1.getAccountStatement());
// Cannot directly access or modify balance
// account1.balance = 1000000; // ❌ Error: Property 'balance' is private
```

```python
# Python - Banking System with Encapsulation
from datetime import datetime, date
from typing import List, Dict

class BankAccount:
    MIN_BALANCE = 100
    DAILY_WITHDRAWAL_LIMIT = 5000
    
    def __init__(self, account_number: str, account_holder: str, initial_deposit: float):
        if initial_deposit < self.MIN_BALANCE:
            raise ValueError(f"Initial deposit must be at least ${self.MIN_BALANCE}")
        
        self.__account_number = account_number
        self.__account_holder = account_holder
        self.__balance = initial_deposit
        self.__transaction_history = []
        self.__daily_withdrawal_amount = 0
        self.__last_withdrawal_date = date.today()
        self.__record_transaction("Opening Deposit", initial_deposit)
    
    # Public interface
    def deposit(self, amount: float) -> bool:
        if not self.__validate_amount(amount):
            return False
        
        self.__balance += amount
        self.__record_transaction("Deposit", amount)
        print(f"Deposited ${amount}. New balance: ${self.__balance}")
        return True
    
    def withdraw(self, amount: float) -> bool:
        if not self.__validate_amount(amount):
            return False
        
        if not self.__check_daily_limit(amount):
            print(f"Daily withdrawal limit of ${self.DAILY_WITHDRAWAL_LIMIT} exceeded")
            return False
        
        if not self.__has_sufficient_balance(amount):
            print("Insufficient funds")
            return False
        
        self.__balance -= amount
        self.__update_daily_withdrawal(amount)
        self.__record_transaction("Withdrawal", amount)
        print(f"Withdrawn ${amount}. Remaining balance: ${self.__balance}")
        return True
    
    def transfer(self, target_account: 'BankAccount', amount: float) -> bool:
        if self.withdraw(amount):
            target_account.deposit(amount)
            print(f"Transferred ${amount} to account {target_account.get_account_number()}")
            return True
        return False
    
    # Controlled read access
    def get_balance(self) -> float:
        return self.__balance
    
    def get_account_number(self) -> str:
        # Return masked account number for security
        return self.__account_number[-4:].rjust(len(self.__account_number), '*')
    
    def get_transaction_history(self) -> List[Dict]:
        # Return a copy to prevent external modification
        return [
            {
                'type': t['type'],
                'amount': t['amount'],
                'date': t['date'].isoformat()
            }
            for t in self.__transaction_history
        ]
    
    def get_account_statement(self) -> str:
        statement = [
            "Account Statement",
            f"Account Holder: {self.__account_holder}",
            f"Account Number: {self.get_account_number()}",
            f"Current Balance: ${self.__balance}",
            "\nRecent Transactions:"
        ]
        
        for t in self.__transaction_history[-5:]:
            statement.append(
                f"  {t['date'].strftime('%Y-%m-%d')} - {t['type']}: ${t['amount']} (Balance: ${t['balance']})"
            )
        
        return '\n'.join(statement)
    
    # Private helper methods
    def __validate_amount(self, amount: float) -> bool:
        if amount <= 0:
            print("Amount must be positive")
            return False
        if not isinstance(amount, (int, float)):
            print("Invalid amount")
            return False
        return True
    
    def __has_sufficient_balance(self, amount: float) -> bool:
        return (self.__balance - amount) >= self.MIN_BALANCE
    
    def __check_daily_limit(self, amount: float) -> bool:
        self.__reset_daily_limit_if_needed()
        return (self.__daily_withdrawal_amount + amount) <= self.DAILY_WITHDRAWAL_LIMIT
    
    def __reset_daily_limit_if_needed(self) -> None:
        today = date.today()
        if today != self.__last_withdrawal_date:
            self.__daily_withdrawal_amount = 0
            self.__last_withdrawal_date = today
    
    def __update_daily_withdrawal(self, amount: float) -> None:
        self.__daily_withdrawal_amount += amount
    
    def __record_transaction(self, transaction_type: str, amount: float) -> None:
        self.__transaction_history.append({
            'type': transaction_type,
            'amount': amount,
            'date': datetime.now(),
            'balance': self.__balance
        })

# Usage
account1 = BankAccount("ACC001234", "Alice Johnson", 5000)
account2 = BankAccount("ACC005678", "Bob Smith", 3000)

account1.deposit(1000)              # Deposited $1000. New balance: $6000
account1.withdraw(500)              # Withdrawn $500. Remaining balance: $5500
account1.transfer(account2, 1000)   # Transferred $1000 to account ****5678

print(account1.get_account_statement())
# Cannot directly access or modify balance
# account1.__balance = 1000000  # ❌ AttributeError (name mangling protection)
```

</details>

---

## 2. Abstraction

**Abstraction** means hiding complex implementation details and showing only the essential features of an object. It focuses on **what** an object does rather than **how** it does it.

**Real-world analogy:** When you send an email, you click "Send" - you don't need to know about SMTP protocols, DNS lookups, TCP/IP connections, or server routing. The complexity is abstracted away.

### Why Abstraction?

**1. Reduces Complexity**

Users don't need to understand internal workings

<details>
<summary><strong>View Examples</strong></summary>

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

</details>

**2. Flexibility**

Change implementation without affecting users

<details>
<summary><strong>View Examples</strong></summary>

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

</details>

**3. Focus on Interface**

Define what must be implemented, not how

---

### Abstraction vs Encapsulation

- **Encapsulation:** Hiding data (implementation hiding through access control)
- **Abstraction:** Hiding complexity (conceptual hiding through interfaces/abstract classes)

They often work together but serve different purposes.

<details>
<summary><strong>View Examples</strong></summary>

```typescript
// TypeScript - Payment Processing System with Abstraction

// Abstract class defines WHAT a payment processor should do
abstract class PaymentProcessor {
  protected transactionId: string;
  protected amount: number;
  protected currency: string;

  constructor(amount: number, currency: string = "USD") {
    this.transactionId = this.generateTransactionId();
    this.amount = amount;
    this.currency = currency;
  }

  // Template method - defines the process flow
  public processPayment(): boolean {
    console.log(`\n=== Processing ${this.getPaymentMethod()} Payment ===`);
    
    if (!this.validatePayment()) {
      console.log("Payment validation failed");
      return false;
    }

    if (!this.authenticate()) {
      console.log("Authentication failed");
      return false;
    }

    if (!this.executeTransaction()) {
      console.log("Transaction execution failed");
      return false;
    }

    this.sendConfirmation();
    console.log("Payment processed successfully");
    return true;
  }

  // Abstract methods - subclasses MUST implement these
  protected abstract validatePayment(): boolean;
  protected abstract authenticate(): boolean;
  protected abstract executeTransaction(): boolean;
  protected abstract getPaymentMethod(): string;

  // Common implementation - all payment methods use this
  protected sendConfirmation(): void {
    console.log(`Confirmation sent for transaction ${this.transactionId}`);
  }

  private generateTransactionId(): string {
    return `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  public getTransactionId(): string {
    return this.transactionId;
  }
}

// Concrete implementation 1: Credit Card
class CreditCardPayment extends PaymentProcessor {
  private cardNumber: string;
  private cvv: string;
  private expiryDate: string;

  constructor(amount: number, cardNumber: string, cvv: string, expiryDate: string) {
    super(amount);
    this.cardNumber = cardNumber;
    this.cvv = cvv;
    this.expiryDate = expiryDate;
  }

  protected validatePayment(): boolean {
    console.log("Validating credit card details...");
    // Check card number format, expiry date, CVV
    return this.cardNumber.length === 16 && this.cvv.length === 3;
  }

  protected authenticate(): boolean {
    console.log("Authenticating with card issuer (3D Secure)...");
    // Simulate 3D Secure authentication
    return true;
  }

  protected executeTransaction(): boolean {
    console.log(`Charging $${this.amount} to card ending in ${this.cardNumber.slice(-4)}...`);
    // Complex logic: connect to payment gateway, handle response codes, etc.
    return true;
  }

  protected getPaymentMethod(): string {
    return "Credit Card";
  }
}

// Concrete implementation 2: PayPal
class PayPalPayment extends PaymentProcessor {
  private email: string;
  private paypalToken: string;

  constructor(amount: number, email: string, paypalToken: string) {
    super(amount);
    this.email = email;
    this.paypalToken = paypalToken;
  }

  protected validatePayment(): boolean {
    console.log("Validating PayPal account...");
    return this.email.includes("@") && this.paypalToken.length > 0;
  }

  protected authenticate(): boolean {
    console.log("Authenticating with PayPal OAuth...");
    // OAuth flow, token validation
    return true;
  }

  protected executeTransaction(): boolean {
    console.log(`Processing $${this.amount} via PayPal for ${this.email}...`);
    // PayPal API calls, handle PayPal-specific response codes
    return true;
  }

  protected getPaymentMethod(): string {
    return "PayPal";
  }
}

// Concrete implementation 3: Cryptocurrency
class CryptoPayment extends PaymentProcessor {
  private walletAddress: string;
  private cryptoType: string;

  constructor(amount: number, walletAddress: string, cryptoType: string = "BTC") {
    super(amount, cryptoType);
    this.walletAddress = walletAddress;
    this.cryptoType = cryptoType;
  }

  protected validatePayment(): boolean {
    console.log("Validating wallet address and blockchain...");
    return this.walletAddress.length === 42; // Simplified
  }

  protected authenticate(): boolean {
    console.log("Verifying wallet signature...");
    // Blockchain signature verification
    return true;
  }

  protected executeTransaction(): boolean {
    console.log(`Transferring ${this.amount} ${this.cryptoType} to ${this.walletAddress}...`);
    // Blockchain transaction, gas fees calculation, confirmation waiting
    return true;
  }

  protected getPaymentMethod(): string {
    return `Cryptocurrency (${this.cryptoType})`;
  }
}

// High-level code doesn't need to know HOW each payment method works
class CheckoutService {
  public checkout(paymentProcessor: PaymentProcessor): void {
    // Abstraction in action: we only know WHAT it does (processPayment)
    // We don't know HOW each payment method implements it
    const success = paymentProcessor.processPayment();
    
    if (success) {
      console.log(`\nOrder confirmed! Transaction ID: ${paymentProcessor.getTransactionId()}`);
    } else {
      console.log("\nOrder failed. Please try again.");
    }
  }
}

// Usage - same interface, different implementations
const checkout = new CheckoutService();

const creditCard = new CreditCardPayment(299.99, "4532123456789012", "123", "12/25");
checkout.checkout(creditCard);

const paypal = new PayPalPayment(149.99, "user@example.com", "PAYPAL_TOKEN_ABC123");
checkout.checkout(paypal);

const crypto = new CryptoPayment(0.005, "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb", "ETH");
checkout.checkout(crypto);
```

```python
# Python - Payment Processing System with Abstraction
from abc import ABC, abstractmethod
import time
import random
import string

# Abstract base class defines WHAT a payment processor should do
class PaymentProcessor(ABC):
    def __init__(self, amount: float, currency: str = "USD"):
        self._transaction_id = self._generate_transaction_id()
        self._amount = amount
        self._currency = currency
    
    # Template method - defines the process flow
    def process_payment(self) -> bool:
        print(f"\n=== Processing {self.get_payment_method()} Payment ===")
        
        if not self.validate_payment():
            print("Payment validation failed")
            return False
        
        if not self.authenticate():
            print("Authentication failed")
            return False
        
        if not self.execute_transaction():
            print("Transaction execution failed")
            return False
        
        self._send_confirmation()
        print("Payment processed successfully")
        return True
    
    # Abstract methods - subclasses MUST implement these
    @abstractmethod
    def validate_payment(self) -> bool:
        pass
    
    @abstractmethod
    def authenticate(self) -> bool:
        pass
    
    @abstractmethod
    def execute_transaction(self) -> bool:
        pass
    
    @abstractmethod
    def get_payment_method(self) -> str:
        pass
    
    # Common implementation
    def _send_confirmation(self) -> None:
        print(f"Confirmation sent for transaction {self._transaction_id}")
    
    def _generate_transaction_id(self) -> str:
        random_str = ''.join(random.choices(string.ascii_lowercase + string.digits, k=9))
        return f"TXN_{int(time.time())}_{random_str}"
    
    def get_transaction_id(self) -> str:
        return self._transaction_id

# Concrete implementation 1: Credit Card
class CreditCardPayment(PaymentProcessor):
    def __init__(self, amount: float, card_number: str, cvv: str, expiry_date: str):
        super().__init__(amount)
        self.__card_number = card_number
        self.__cvv = cvv
        self.__expiry_date = expiry_date
    
    def validate_payment(self) -> bool:
        print("Validating credit card details...")
        return len(self.__card_number) == 16 and len(self.__cvv) == 3
    
    def authenticate(self) -> bool:
        print("Authenticating with card issuer (3D Secure)...")
        return True
    
    def execute_transaction(self) -> bool:
        print(f"Charging ${self._amount} to card ending in {self.__card_number[-4:]}...")
        return True
    
    def get_payment_method(self) -> str:
        return "Credit Card"

# Concrete implementation 2: PayPal
class PayPalPayment(PaymentProcessor):
    def __init__(self, amount: float, email: str, paypal_token: str):
        super().__init__(amount)
        self.__email = email
        self.__paypal_token = paypal_token
    
    def validate_payment(self) -> bool:
        print("Validating PayPal account...")
        return "@" in self.__email and len(self.__paypal_token) > 0
    
    def authenticate(self) -> bool:
        print("Authenticating with PayPal OAuth...")
        return True
    
    def execute_transaction(self) -> bool:
        print(f"Processing ${self._amount} via PayPal for {self.__email}...")
        return True
    
    def get_payment_method(self) -> str:
        return "PayPal"

# Concrete implementation 3: Cryptocurrency
class CryptoPayment(PaymentProcessor):
    def __init__(self, amount: float, wallet_address: str, crypto_type: str = "BTC"):
        super().__init__(amount, crypto_type)
        self.__wallet_address = wallet_address
        self.__crypto_type = crypto_type
    
    def validate_payment(self) -> bool:
        print("Validating wallet address and blockchain...")
        return len(self.__wallet_address) == 42
    
    def authenticate(self) -> bool:
        print("Verifying wallet signature...")
        return True
    
    def execute_transaction(self) -> bool:
        print(f"Transferring {self._amount} {self.__crypto_type} to {self.__wallet_address}...")
        return True
    
    def get_payment_method(self) -> str:
        return f"Cryptocurrency ({self.__crypto_type})"

# High-level code using abstraction
class CheckoutService:
    def checkout(self, payment_processor: PaymentProcessor) -> None:
        success = payment_processor.process_payment()
        
        if success:
            print(f"\nOrder confirmed! Transaction ID: {payment_processor.get_transaction_id()}")
        else:
            print("\nOrder failed. Please try again.")

# Usage
checkout = CheckoutService()

credit_card = CreditCardPayment(299.99, "4532123456789012", "123", "12/25")
checkout.checkout(credit_card)

paypal = PayPalPayment(149.99, "user@example.com", "PAYPAL_TOKEN_ABC123")
checkout.checkout(paypal)

crypto = CryptoPayment(0.005, "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb", "ETH")
checkout.checkout(crypto)
```

</details>

---

## Practice Questions

<details>
<summary><strong>View Questions</strong></summary>

### Fill in the Blanks

1. __________ bundles data and methods together while hiding internal implementation details from outside access.

2. __________ focuses on hiding complexity and showing only essential features, defining WHAT an object does rather than HOW.

3. In encapsulation, we use __________ fields with __________ methods to control access to data.

4. The main difference between encapsulation and abstraction is that encapsulation hides __________ while abstraction hides __________.

<details>
<summary><strong>View Answers</strong></summary>

1. **Encapsulation** - It's the practice of bundling related data and methods into a single unit (class) and restricting direct access to internal data.

2. **Abstraction** - It simplifies complex systems by exposing only relevant details and hiding implementation specifics.

3. **private**, **public** (or getters/setters) - This is a common pattern: keep data private and provide controlled public access through methods.

4. **implementation details/data**, **complexity** - Encapsulation uses access modifiers to hide data; abstraction uses abstract classes/interfaces to hide how things work internally.

</details>

---

### True/False

1. ⬜ Encapsulation and abstraction are the same concept with different names.

2. ⬜ Using private fields with getter methods is an example of encapsulation.

3. ⬜ Abstract classes can be instantiated directly in both TypeScript and Python.

4. ⬜ Abstraction allows us to change implementation details without affecting code that uses the abstraction.

5. ⬜ Encapsulation is only about making all fields private.

<details>
<summary><strong>View Answers</strong></summary>

1. **False** - They're related but distinct. Encapsulation hides data/implementation using access modifiers; abstraction hides complexity using abstract classes/interfaces. They work together but serve different purposes.

2. **True** - This is a classic encapsulation pattern: hide the data (private field) and provide controlled access (getter method). This protects data integrity.

3. **False** - Abstract classes cannot be instantiated. In TypeScript, trying to `new AbstractClass()` causes an error. In Python, classes inheriting from `ABC` with abstract methods cannot be instantiated. They exist only to be inherited.

4. **True** - This is the key benefit of abstraction. As long as the public interface (method signatures) remains the same, internal implementation can change freely. Example: You can switch from CreditCardPayment to PayPalPayment without changing the checkout code.

5. **False** - Encapsulation is about bundling data with methods AND controlling access. It includes validation, business logic enforcement, and providing appropriate interfaces - not just making everything private.

</details>

---

### Multiple Choice

1. **Which scenario best demonstrates encapsulation?**
   - A) Creating an abstract class with abstract methods
   - B) A BankAccount class with private balance and public deposit/withdraw methods
   - C) Using inheritance to reuse code
   - D) Polymorphic behavior in different classes

2. **What is the primary purpose of abstraction?**
   - A) To make all methods private
   - B) To create multiple instances of a class
   - C) To hide complexity and show only essential features
   - D) To prevent inheritance

3. **In the payment processing example, why is PaymentProcessor abstract?**
   - A) To prevent creating payment processors
   - B) To define a common interface while allowing different implementations
   - C) To make the code run faster
   - D) To reduce memory usage

<details>
<summary><strong>View Answers</strong></summary>

1. **B** - This is textbook encapsulation: private data (balance) protected from direct access, with public methods (deposit/withdraw) that enforce business rules and validation. The internal state is hidden and can only be modified through controlled methods.

2. **C** - Abstraction is about managing complexity by hiding implementation details and exposing only what's necessary. Users interact with a simple interface without needing to understand the complex internals.

3. **B** - Abstract classes define contracts (what methods must exist) while allowing subclasses to provide specific implementations (how they work). This enables polymorphism - CheckoutService can work with any PaymentProcessor without knowing the specific type.

</details>

</details>

---

## 3. Inheritance

**Inheritance** is a mechanism where a new class (child/derived/subclass) is created from an existing class (parent/base/superclass), inheriting its properties and methods while adding or overriding functionality.

**Real-world analogy:** Think of biological inheritance. You inherit traits from your parents (eye color, height genes) but you're still a unique individual with your own characteristics and behaviors.

### Why Inheritance?

- **Code Reuse:** Don't repeat common functionality
- **Hierarchical Organization:** Model real-world "is-a" relationships
- **Extensibility:** Add new features without modifying existing code
- **Polymorphism:** Treat different types uniformly through a common interface

### Key Concepts:

- **IS-A relationship:** A Car IS-A Vehicle (inheritance makes sense)
- **Method Overriding:** Child class provides specific implementation
- **Super keyword:** Access parent class members
- **Constructor chaining:** Child constructor calls parent constructor

<details>
<summary><strong>View Examples</strong></summary>

```typescript
// TypeScript - E-commerce Product Hierarchy

// Base class
class Product {
  protected productId: string;
  protected name: string;
  protected basePrice: number;
  protected category: string;
  protected stock: number;

  constructor(productId: string, name: string, basePrice: number, category: string, stock: number) {
    this.productId = productId;
    this.name = name;
    this.basePrice = basePrice;
    this.category = category;
    this.stock = stock;
  }

  // Common behavior for all products
  public getProductInfo(): string {
    return `${this.name} (${this.productId}) - ${this.category}`;
  }

  public updateStock(quantity: number): void {
    this.stock += quantity;
    console.log(`Stock updated for ${this.name}. Current stock: ${this.stock}`);
  }

  public isInStock(): boolean {
    return this.stock > 0;
  }

  // Base implementation - can be overridden
  public calculatePrice(): number {
    return this.basePrice;
  }

  public getShippingCost(): number {
    return 10; // Default shipping
  }
}

// Derived class 1: Electronics
class Electronics extends Product {
  private warrantyPeriod: number; // in months
  private powerRating: number; // in watts

  constructor(
    productId: string,
    name: string,
    basePrice: number,
    stock: number,
    warrantyPeriod: number,
    powerRating: number
  ) {
    // Call parent constructor
    super(productId, name, basePrice, "Electronics", stock);
    this.warrantyPeriod = warrantyPeriod;
    this.powerRating = powerRating;
  }

  // Override: Electronics have environmental fees
  public calculatePrice(): number {
    const basePrice = super.calculatePrice(); // Call parent method
    const environmentalFee = basePrice * 0.05; // 5% environmental fee
    return basePrice + environmentalFee;
  }

  // Override: Fragile items cost more to ship
  public getShippingCost(): number {
    const baseShipping = super.getShippingCost();
    return baseShipping + 15; // Extra $15 for fragile handling
  }

  // New method specific to Electronics
  public getWarrantyInfo(): string {
    return `${this.warrantyPeriod} months warranty included`;
  }

  public getPowerConsumption(): string {
    return `Power rating: ${this.powerRating}W`;
  }

  // Override parent method and extend it
  public getProductInfo(): string {
    const baseInfo = super.getProductInfo();
    return `${baseInfo} | ${this.getWarrantyInfo()} | ${this.getPowerConsumption()}`;
  }
}

// Derived class 2: Clothing
class Clothing extends Product {
  private size: string;
  private material: string;
  private color: string;

  constructor(
    productId: string,
    name: string,
    basePrice: number,
    stock: number,
    size: string,
    material: string,
    color: string
  ) {
    super(productId, name, basePrice, "Clothing", stock);
    this.size = size;
    this.material = material;
    this.color = color;
  }

  // Override: Clothing has seasonal pricing
  public calculatePrice(): number {
    const basePrice = super.calculatePrice();
    const season = new Date().getMonth();
    
    // Summer clearance (June-August)
    if (season >= 5 && season <= 7) {
      return basePrice * 0.7; // 30% off
    }
    return basePrice;
  }

  // Override: Lightweight items have cheaper shipping
  public getShippingCost(): number {
    return 5; // Flat $5 for clothing
  }

  public getSizeInfo(): string {
    return `Size: ${this.size}, Material: ${this.material}, Color: ${this.color}`;
  }

  public getProductInfo(): string {
    const baseInfo = super.getProductInfo();
    return `${baseInfo} | ${this.getSizeInfo()}`;
  }
}

// Derived class 3: Books
class Book extends Product {
  private author: string;
  private isbn: string;
  private pageCount: number;
  private publisher: string;

  constructor(
    productId: string,
    name: string,
    basePrice: number,
    stock: number,
    author: string,
    isbn: string,
    pageCount: number,
    publisher: string
  ) {
    super(productId, name, basePrice, "Books", stock);
    this.author = author;
    this.isbn = isbn;
    this.pageCount = pageCount;
    this.publisher = publisher;
  }

  // Override: Books have volume discount
  public calculatePrice(): number {
    const basePrice = super.calculatePrice();
    // Thick books cost slightly more
    if (this.pageCount > 500) {
      return basePrice * 1.1;
    }
    return basePrice;
  }

  // Override: Books have special shipping (Media Mail)
  public getShippingCost(): number {
    return 3; // Cheap media mail shipping
  }

  public getBookDetails(): string {
    return `by ${this.author} | ISBN: ${this.isbn} | ${this.pageCount} pages | ${this.publisher}`;
  }

  public getProductInfo(): string {
    const baseInfo = super.getProductInfo();
    return `${baseInfo} | ${this.getBookDetails()}`;
  }
}

// Usage - polymorphism in action
const products: Product[] = [
  new Electronics("ELEC001", "Dell XPS 15", 1500, 10, 12, 130),
  new Clothing("CLO001", "Cotton T-Shirt", 25, 50, "L", "Cotton", "Blue"),
  new Book("BOOK001", "Clean Code", 45, 30, "Robert Martin", "978-0132350884", 464, "Prentice Hall")
];

console.log("=== Product Catalog ===");
products.forEach(product => {
  console.log(`\n${product.getProductInfo()}`);
  console.log(`Price: $${product.calculatePrice().toFixed(2)}`);
  console.log(`Shipping: $${product.getShippingCost()}`);
  console.log(`In Stock: ${product.isInStock() ? "Yes" : "No"}`);
});
```

```python
# Python - E-commerce Product Hierarchy

# Base class
class Product:
    def __init__(self, product_id: str, name: str, base_price: float, category: str, stock: int):
        self._product_id = product_id
        self._name = name
        self._base_price = base_price
        self._category = category
        self._stock = stock
    
    def get_product_info(self) -> str:
        return f"{self._name} ({self._product_id}) - {self._category}"
    
    def update_stock(self, quantity: int) -> None:
        self._stock += quantity
        print(f"Stock updated for {self._name}. Current stock: {self._stock}")
    
    def is_in_stock(self) -> bool:
        return self._stock > 0
    
    def calculate_price(self) -> float:
        return self._base_price
    
    def get_shipping_cost(self) -> float:
        return 10.0  # Default shipping

# Derived class 1: Electronics
class Electronics(Product):
    def __init__(self, product_id: str, name: str, base_price: float, stock: int,
                 warranty_period: int, power_rating: int):
        super().__init__(product_id, name, base_price, "Electronics", stock)
        self.__warranty_period = warranty_period
        self.__power_rating = power_rating
    
    def calculate_price(self) -> float:
        base_price = super().calculate_price()
        environmental_fee = base_price * 0.05
        return base_price + environmental_fee
    
    def get_shipping_cost(self) -> float:
        base_shipping = super().get_shipping_cost()
        return base_shipping + 15
    
    def get_warranty_info(self) -> str:
        return f"{self.__warranty_period} months warranty included"
    
    def get_power_consumption(self) -> str:
        return f"Power rating: {self.__power_rating}W"
    
    def get_product_info(self) -> str:
        base_info = super().get_product_info()
        return f"{base_info} | {self.get_warranty_info()} | {self.get_power_consumption()}"

# Derived class 2: Clothing
class Clothing(Product):
    def __init__(self, product_id: str, name: str, base_price: float, stock: int,
                 size: str, material: str, color: str):
        super().__init__(product_id, name, base_price, "Clothing", stock)
        self.__size = size
        self.__material = material
        self.__color = color
    
    def calculate_price(self) -> float:
        from datetime import datetime
        base_price = super().calculate_price()
        month = datetime.now().month
        
        # Summer clearance
        if 6 <= month <= 8:
            return base_price * 0.7
        return base_price
    
    def get_shipping_cost(self) -> float:
        return 5.0
    
    def get_size_info(self) -> str:
        return f"Size: {self.__size}, Material: {self.__material}, Color: {self.__color}"
    
    def get_product_info(self) -> str:
        base_info = super().get_product_info()
        return f"{base_info} | {self.get_size_info()}"

# Derived class 3: Books
class Book(Product):
    def __init__(self, product_id: str, name: str, base_price: float, stock: int,
                 author: str, isbn: str, page_count: int, publisher: str):
        super().__init__(product_id, name, base_price, "Books", stock)
        self.__author = author
        self.__isbn = isbn
        self.__page_count = page_count
        self.__publisher = publisher
    
    def calculate_price(self) -> float:
        base_price = super().calculate_price()
        if self.__page_count > 500:
            return base_price * 1.1
        return base_price
    
    def get_shipping_cost(self) -> float:
        return 3.0
    
    def get_book_details(self) -> str:
        return f"by {self.__author} | ISBN: {self.__isbn} | {self.__page_count} pages | {self.__publisher}"
    
    def get_product_info(self) -> str:
        base_info = super().get_product_info()
        return f"{base_info} | {self.get_book_details()}"

# Usage
products = [
    Electronics("ELEC001", "Dell XPS 15", 1500, 10, 12, 130),
    Clothing("CLO001", "Cotton T-Shirt", 25, 50, "L", "Cotton", "Blue"),
    Book("BOOK001", "Clean Code", 45, 30, "Robert Martin", "978-0132350884", 464, "Prentice Hall")
]

print("=== Product Catalog ===")
for product in products:
    print(f"\n{product.get_product_info()}")
    print(f"Price: ${product.calculate_price():.2f}")
    print(f"Shipping: ${product.get_shipping_cost()}")
    print(f"In Stock: {'Yes' if product.is_in_stock() else 'No'}")
```

</details>

---

## 4. Polymorphism

**Polymorphism** means "many forms" - the ability of different classes to be treated as instances of the same class through a common interface, with each class providing its own implementation.

**Real-world analogy:** Think of a universal remote control. The "power" button works with your TV, sound system, and cable box - same button, same action, but each device responds differently. The remote doesn't need to know the internal workings of each device.

### Types of Polymorphism:

1. **Compile-time (Static):** Method overloading, Operator Overloading
2. **Runtime (Dynamic):** Method overriding + inheritance

### Why Polymorphism?

- **Flexibility:** Write code that works with multiple types
- **Extensibility:** Add new types without changing existing code
- **Maintainability:** Change behavior by swapping implementations
- **Clean Interfaces:** Single interface, multiple implementations

<details>
<summary><strong>View Examples</strong></summary>

```typescript
// TypeScript - Notification System with Polymorphism

// Base interface for all notifications
interface Notification {
  send(recipient: string, message: string): boolean;
  getDeliveryStatus(): string;
  getCost(): number;
}

// Email notification
class EmailNotification implements Notification {
  private smtpServer: string;
  private fromAddress: string;
  private deliveryStatus: string;

  constructor(smtpServer: string, fromAddress: string) {
    this.smtpServer = smtpServer;
    this.fromAddress = fromAddress;
    this.deliveryStatus = "Pending";
  }

  send(recipient: string, message: string): boolean {
    console.log(`Sending email to ${recipient}`);
    console.log(`From: ${this.fromAddress}`);
    console.log(`Via SMTP: ${this.smtpServer}`);
    console.log(`Content: ${message}`);
    
    // Simulate email sending
    this.deliveryStatus = "Delivered";
    console.log("✓ Email sent successfully");
    return true;
  }

  getDeliveryStatus(): string {
    return `Email status: ${this.deliveryStatus}`;
  }

  getCost(): number {
    return 0.01; // $0.01 per email
  }
}

// SMS notification
class SMSNotification implements Notification {
  private apiKey: string;
  private provider: string;
  private deliveryStatus: string;

  constructor(apiKey: string, provider: string) {
    this.apiKey = apiKey;
    this.provider = provider;
    this.deliveryStatus = "Pending";
  }

  send(recipient: string, message: string): boolean {
    console.log(`Sending SMS to ${recipient}`);
    console.log(`Provider: ${this.provider}`);
    console.log(`Content: ${message.substring(0, 160)}`); // SMS limit
    
    // Simulate SMS sending
    if (message.length > 160) {
      console.log(`⚠ Message truncated to 160 characters`);
    }
    this.deliveryStatus = "Delivered";
    console.log("✓ SMS sent successfully");
    return true;
  }

  getDeliveryStatus(): string {
    return `SMS status: ${this.deliveryStatus}`;
  }

  getCost(): number {
    return 0.05; // $0.05 per SMS
  }
}

// Push notification
class PushNotification implements Notification {
  private platform: string;
  private deviceToken: string;
  private deliveryStatus: string;

  constructor(platform: string, deviceToken: string) {
    this.platform = platform;
    this.deviceToken = deviceToken;
    this.deliveryStatus = "Pending";
  }

  send(recipient: string, message: string): boolean {
    console.log(`Sending push notification to ${recipient}`);
    console.log(`Platform: ${this.platform}`);
    console.log(`Device Token: ${this.deviceToken.substring(0, 10)}...`);
    console.log(`Content: ${message}`);
    
    // Simulate push notification
    this.deliveryStatus = "Delivered";
    console.log("✓ Push notification sent successfully");
    return true;
  }

  getDeliveryStatus(): string {
    return `Push status: ${this.deliveryStatus}`;
  }

  getCost(): number {
    return 0.001; // $0.001 per push
  }
}

// Slack notification
class SlackNotification implements Notification {
  private webhookUrl: string;
  private channel: string;
  private deliveryStatus: string;

  constructor(webhookUrl: string, channel: string) {
    this.webhookUrl = webhookUrl;
    this.channel = channel;
    this.deliveryStatus = "Pending";
  }

  send(recipient: string, message: string): boolean {
    console.log(`Posting to Slack channel: ${this.channel}`);
    console.log(`Webhook: ${this.webhookUrl.substring(0, 30)}...`);
    console.log(`@${recipient}: ${message}`);
    
    // Simulate Slack API call
    this.deliveryStatus = "Posted";
    console.log("✓ Slack message posted successfully");
    return true;
  }

  getDeliveryStatus(): string {
    return `Slack status: ${this.deliveryStatus}`;
  }

  getCost(): number {
    return 0; // Free
  }
}

// Notification service that uses polymorphism
class NotificationService {
  private notifications: Notification[] = [];

  // Add any type of notification
  public addNotificationChannel(notification: Notification): void {
    this.notifications.push(notification);
  }

  // Send through all channels - polymorphism in action
  public sendToAll(recipient: string, message: string): void {
    console.log(`\n=== Broadcasting message to ${this.notifications.length} channels ===\n`);
    
    let totalCost = 0;
    this.notifications.forEach((notification, index) => {
      console.log(`--- Channel ${index + 1} ---`);
      notification.send(recipient, message);
      totalCost += notification.getCost();
      console.log(notification.getDeliveryStatus());
      console.log();
    });

    console.log(`Total cost: $${totalCost.toFixed(3)}`);
  }

  // Get status from all channels
  public getStatusReport(): void {
    console.log("\n=== Notification Status Report ===");
    this.notifications.forEach((notification, index) => {
      console.log(`${index + 1}. ${notification.getDeliveryStatus()}`);
    });
  }

  // Send based on priority (example of runtime polymorphism)
  public sendWithPriority(recipient: string, message: string, priority: "high" | "medium" | "low"): void {
    let selectedNotifications: Notification[] = [];

    switch (priority) {
      case "high":
        // Send via all channels
        selectedNotifications = this.notifications;
        break;
      case "medium":
        // Send via email and push
        selectedNotifications = this.notifications.filter(
          n => n instanceof EmailNotification || n instanceof PushNotification
        );
        break;
      case "low":
        // Send via cheapest method
        selectedNotifications = [
          this.notifications.reduce((prev, curr) => 
            curr.getCost() < prev.getCost() ? curr : prev
          )
        ];
        break;
    }

    console.log(`\n=== Sending ${priority} priority message ===\n`);
    selectedNotifications.forEach(notification => {
      notification.send(recipient, message);
    });
  }
}

// Usage - polymorphism allows treating different types uniformly
const notificationService = new NotificationService();

// Add different notification types
notificationService.addNotificationChannel(
  new EmailNotification("smtp.gmail.com", "alerts@company.com")
);
notificationService.addNotificationChannel(
  new SMSNotification("API_KEY_123", "Twilio")
);
notificationService.addNotificationChannel(
  new PushNotification("iOS", "DEVICE_TOKEN_ABC")
);
notificationService.addNotificationChannel(
  new SlackNotification("https://hooks.slack.com/services/XXX", "#alerts")
);

// Same method works with all notification types!
notificationService.sendToAll("john.doe@example.com", "Your order #12345 has been shipped!");

notificationService.getStatusReport();

// Send based on priority
notificationService.sendWithPriority(
  "jane.smith@example.com",
  "Server CPU usage exceeded 90%",
  "high"
);
```

```python
# Python - Notification System with Polymorphism
from abc import ABC, abstractmethod

# Base class with abstract methods
class Notification(ABC):
    @abstractmethod
    def send(self, recipient: str, message: str) -> bool:
        pass
    
    @abstractmethod
    def get_delivery_status(self) -> str:
        pass
    
    @abstractmethod
    def get_cost(self) -> float:
        pass

# Email notification
class EmailNotification(Notification):
    def __init__(self, smtp_server: str, from_address: str):
        self.__smtp_server = smtp_server
        self.__from_address = from_address
        self.__delivery_status = "Pending"
    
    def send(self, recipient: str, message: str) -> bool:
        print(f"Sending email to {recipient}")
        print(f"From: {self.__from_address}")
        print(f"Via SMTP: {self.__smtp_server}")
        print(f"Content: {message}")
        
        self.__delivery_status = "Delivered"
        print("✓ Email sent successfully")
        return True
    
    def get_delivery_status(self) -> str:
        return f"Email status: {self.__delivery_status}"
    
    def get_cost(self) -> float:
        return 0.01

# SMS notification
class SMSNotification(Notification):
    def __init__(self, api_key: str, provider: str):
        self.__api_key = api_key
        self.__provider = provider
        self.__delivery_status = "Pending"
    
    def send(self, recipient: str, message: str) -> bool:
        print(f"Sending SMS to {recipient}")
        print(f"Provider: {self.__provider}")
        print(f"Content: {message[:160]}")
        
        if len(message) > 160:
            print("⚠ Message truncated to 160 characters")
        self.__delivery_status = "Delivered"
        print("✓ SMS sent successfully")
        return True
    
    def get_delivery_status(self) -> str:
        return f"SMS status: {self.__delivery_status}"
    
    def get_cost(self) -> float:
        return 0.05

# Push notification
class PushNotification(Notification):
    def __init__(self, platform: str, device_token: str):
        self.__platform = platform
        self.__device_token = device_token
        self.__delivery_status = "Pending"
    
    def send(self, recipient: str, message: str) -> bool:
        print(f"Sending push notification to {recipient}")
        print(f"Platform: {self.__platform}")
        print(f"Device Token: {self.__device_token[:10]}...")
        print(f"Content: {message}")
        
        self.__delivery_status = "Delivered"
        print("✓ Push notification sent successfully")
        return True
    
    def get_delivery_status(self) -> str:
        return f"Push status: {self.__delivery_status}"
    
    def get_cost(self) -> float:
        return 0.001

# Slack notification
class SlackNotification(Notification):
    def __init__(self, webhook_url: str, channel: str):
        self.__webhook_url = webhook_url
        self.__channel = channel
        self.__delivery_status = "Pending"
    
    def send(self, recipient: str, message: str) -> bool:
        print(f"Posting to Slack channel: {self.__channel}")
        print(f"Webhook: {self.__webhook_url[:30]}...")
        print(f"@{recipient}: {message}")
        
        self.__delivery_status = "Posted"
        print("✓ Slack message posted successfully")
        return True
    
    def get_delivery_status(self) -> str:
        return f"Slack status: {self.__delivery_status}"
    
    def get_cost(self) -> float:
        return 0

# Notification service using polymorphism
class NotificationService:
    def __init__(self):
        self.__notifications = []
    
    def add_notification_channel(self, notification: Notification) -> None:
        self.__notifications.append(notification)
    
    def send_to_all(self, recipient: str, message: str) -> None:
        print(f"\n=== Broadcasting message to {len(self.__notifications)} channels ===\n")
        
        total_cost = 0
        for index, notification in enumerate(self.__notifications, 1):
            print(f"--- Channel {index} ---")
            notification.send(recipient, message)
            total_cost += notification.get_cost()
            print(notification.get_delivery_status())
            print()
        
        print(f"Total cost: ${total_cost:.3f}")
    
    def get_status_report(self) -> None:
        print("\n=== Notification Status Report ===")
        for index, notification in enumerate(self.__notifications, 1):
            print(f"{index}. {notification.get_delivery_status()}")
    
    def send_with_priority(self, recipient: str, message: str, priority: str) -> None:
        selected_notifications = []
        
        if priority == "high":
            selected_notifications = self.__notifications
        elif priority == "medium":
            selected_notifications = [
                n for n in self.__notifications 
                if isinstance(n, (EmailNotification, PushNotification))
            ]
        elif priority == "low":
            selected_notifications = [
                min(self.__notifications, key=lambda n: n.get_cost())
            ]
        
        print(f"\n=== Sending {priority} priority message ===\n")
        for notification in selected_notifications:
            notification.send(recipient, message)

# Usage
notification_service = NotificationService()

notification_service.add_notification_channel(
    EmailNotification("smtp.gmail.com", "alerts@company.com")
)
notification_service.add_notification_channel(
    SMSNotification("API_KEY_123", "Twilio")
)
notification_service.add_notification_channel(
    PushNotification("iOS", "DEVICE_TOKEN_ABC")
)
notification_service.add_notification_channel(
    SlackNotification("https://hooks.slack.com/services/XXX", "#alerts")
)

notification_service.send_to_all("john.doe@example.com", "Your order #12345 has been shipped!")
notification_service.get_status_report()
notification_service.send_with_priority("jane.smith@example.com", "Server CPU usage exceeded 90%", "high")
```

</details>

---

## Practice Questions

<details>
<summary><strong>View Questions</strong></summary>

### Fill in the Blanks

1. __________ is a mechanism where a child class acquires properties and methods from a parent class.

2. The __________ keyword in TypeScript (or __________ in Python) is used to call the parent class constructor.

3. __________ allows different classes to be treated through a common interface while each provides its own implementation.

4. When a child class provides a specific implementation of a method already defined in its parent class, this is called __________.

5. Inheritance models an __________ relationship, while composition models a __________ relationship.

<details>
<summary><strong>View Answers</strong></summary>

1. **Inheritance** - Allows code reuse and creates hierarchical relationships between classes.

2. **super**, **super()** - Calls the parent class constructor to properly initialize inherited properties before adding child-specific initialization.

3. **Polymorphism** - "Many forms" - objects of different types can be accessed through the same interface, with each type responding appropriately.

4. **method overriding** (or **overriding**) - Child class replaces parent's method implementation while keeping the same method signature.

5. **IS-A**, **HAS-A** - A Car IS-A Vehicle (inheritance); a Car HAS-AN Engine (composition). Inheritance represents specialization, composition represents containment.

</details>

---

### True/False

1. ⬜ A child class can access private members of its parent class.

2. ⬜ Polymorphism requires inheritance to work.

3. ⬜ When overriding a method, you must call the parent's version using `super`.

4. ⬜ In TypeScript, a class can extend multiple parent classes directly.

5. ⬜ Method overriding happens at runtime, while method overloading happens at compile-time.

6. ⬜ Protected members are accessible in child classes but not outside the class hierarchy.

<details>
<summary><strong>View Answers</strong></summary>

1. **False** - Private members are only accessible within the class that defines them, not in child classes. Child classes can access protected and public members. This is why we use `protected` for members that should be accessible to subclasses.

2. **False** - While inheritance is one way to achieve polymorphism, you can also use interfaces (TypeScript) or duck typing (Python) for polymorphic behavior. Interface-based polymorphism doesn't require inheritance.

3. **False** - Calling `super.method()` is optional. You only call it if you want to include the parent's behavior alongside your custom implementation. Complete replacement doesn't require calling super.

4. **False** - TypeScript (and most OOP languages) only supports single inheritance. A class can extend only one parent class. However, a class can implement multiple interfaces. Python does support multiple inheritance but it's generally discouraged except in specific patterns.

5. **True** - Method overloading (same method name, different parameters) is resolved at compile-time. Method overriding (child replacing parent method) is resolved at runtime based on the actual object type.

6. **True** - Protected members (`protected` in TypeScript, `_member` convention in Python) are designed specifically for this: accessible within the class and its subclasses, but not from outside the inheritance hierarchy.

</details>

---

### Multiple Choice

1. **Which statement best describes the relationship in: `class Manager extends Employee`?**
   - A) Manager HAS-AN Employee
   - B) Manager IS-AN Employee
   - C) Employee IS-A Manager
   - D) They are unrelated

2. **What is the main benefit of polymorphism?**
   - A) Faster code execution
   - B) Reduced memory usage
   - C) Ability to write code that works with multiple types through a common interface
   - D) Automatic error handling

3. **In the notification example, why can NotificationService work with all notification types?**
   - A) Because all notifications inherit from the same base class
   - B) Because they all implement the same interface (Notification)
   - C) Because TypeScript allows any type
   - D) Because they're all in the same file

4. **When should you use inheritance?**
   - A) Whenever you want to reuse code
   - B) When there's a clear IS-A relationship and shared behavior
   - C) Always, for better organization
   - D) Never, composition is always better

5. **What happens when you override a method without calling `super.method()`?**
   - A) Compilation error
   - B) The parent's implementation is completely replaced
   - C) Both implementations run
   - D) Runtime error

<details>
<summary><strong>View Answers</strong></summary>

1. **B** - This shows inheritance: a Manager IS-A type of Employee. Managers are employees with additional responsibilities. The inheritance relationship models specialization.

2. **C** - Polymorphism's key benefit is flexibility. You can write functions like `sendNotification(notification: Notification)` that work with EmailNotification, SMSNotification, etc., without knowing the specific type. This makes code extensible and maintainable.

3. **B** - They all implement the `Notification` interface with methods `send()`, `getDeliveryStatus()`, and `getCost()`. The service depends on the interface, not specific implementations - this is polymorphism through interfaces.

4. **B** - Use inheritance when there's a genuine IS-A relationship AND significant shared behavior. Don't use it just for code reuse (use composition instead) or for convenience. Improper inheritance creates rigid, hard-to-maintain hierarchies.

5. **B** - When you override without calling super, you completely replace the parent's implementation. This is intentional - you're providing a new implementation. Calling super is only necessary when you want to extend (not replace) the parent's behavior.

</details>

---

### Code Challenge

**Challenge: Create a Logger System**

Create a logging system with the following requirements:

1. **Base `Logger` class** with:
   - Protected property: `logLevel` (string)
   - Method: `log(level: string, message: string)` - only logs if level matches logLevel
   - Method: `getLogLevel()` - returns current log level

2. **Three derived classes:**
   - `ConsoleLogger` - logs to console with timestamp
   - `FileLogger` - simulates logging to a file (just print "Written to file: ...")
   - `DatabaseLogger` - simulates logging to database (just print "Saved to DB: ...")

3. **LoggingService class** that:
   - Can hold multiple loggers
   - Has method `logToAll(level: string, message: string)` that sends to all loggers
   - Demonstrates polymorphism

<details>
<summary><strong>View Solution</strong></summary>

```typescript
// TypeScript Solution
abstract class Logger {
  protected logLevel: string;

  constructor(logLevel: string = "INFO") {
    this.logLevel = logLevel;
  }

  public log(level: string, message: string): void {
    if (this.shouldLog(level)) {
      this.writeLog(level, message);
    }
  }

  protected abstract writeLog(level: string, message: string): void;

  protected shouldLog(level: string): boolean {
    const levels = ["DEBUG", "INFO", "WARN", "ERROR"];
    const messageLevel = levels.indexOf(level);
    const currentLevel = levels.indexOf(this.logLevel);
    return messageLevel >= currentLevel;
  }

  public getLogLevel(): string {
    return this.logLevel;
  }
}

class ConsoleLogger extends Logger {
  protected writeLog(level: string, message: string): void {
    const timestamp = new Date().toISOString();
    console.log(`[CONSOLE] ${timestamp} [${level}] ${message}`);
  }
}

class FileLogger extends Logger {
  private filename: string;

  constructor(logLevel: string, filename: string) {
    super(logLevel);
    this.filename = filename;
  }

  protected writeLog(level: string, message: string): void {
    const timestamp = new Date().toISOString();
    console.log(`[FILE] Written to ${this.filename}: ${timestamp} [${level}] ${message}`);
  }
}

class DatabaseLogger extends Logger {
  private tableName: string;

  constructor(logLevel: string, tableName: string) {
    super(logLevel);
    this.tableName = tableName;
  }

  protected writeLog(level: string, message: string): void {
    const timestamp = new Date().toISOString();
    console.log(`[DATABASE] Saved to ${this.tableName}: ${timestamp} [${level}] ${message}`);
  }
}

class LoggingService {
  private loggers: Logger[] = [];

  public addLogger(logger: Logger): void {
    this.loggers.push(logger);
  }

  public logToAll(level: string, message: string): void {
    console.log(`\n=== Broadcasting ${level} log to ${this.loggers.length} loggers ===`);
    this.loggers.forEach(logger => {
      logger.log(level, message);
    });
  }
}

// Usage
const loggingService = new LoggingService();
loggingService.addLogger(new ConsoleLogger("DEBUG"));
loggingService.addLogger(new FileLogger("INFO", "app.log"));
loggingService.addLogger(new DatabaseLogger("ERROR", "logs_table"));

loggingService.logToAll("DEBUG", "Application started");
loggingService.logToAll("INFO", "User logged in");
loggingService.logToAll("ERROR", "Database connection failed");
```

```python
# Python Solution
from abc import ABC, abstractmethod
from datetime import datetime

class Logger(ABC):
    def __init__(self, log_level: str = "INFO"):
        self._log_level = log_level
    
    def log(self, level: str, message: str) -> None:
        if self._should_log(level):
            self._write_log(level, message)
    
    @abstractmethod
    def _write_log(self, level: str, message: str) -> None:
        pass
    
    def _should_log(self, level: str) -> bool:
        levels = ["DEBUG", "INFO", "WARN", "ERROR"]
        message_level = levels.index(level)
        current_level = levels.index(self._log_level)
        return message_level >= current_level
    
    def get_log_level(self) -> str:
        return self._log_level

class ConsoleLogger(Logger):
    def _write_log(self, level: str, message: str) -> None:
        timestamp = datetime.now().isoformat()
        print(f"[CONSOLE] {timestamp} [{level}] {message}")

class FileLogger(Logger):
    def __init__(self, log_level: str, filename: str):
        super().__init__(log_level)
        self.__filename = filename
    
    def _write_log(self, level: str, message: str) -> None:
        timestamp = datetime.now().isoformat()
        print(f"[FILE] Written to {self.__filename}: {timestamp} [{level}] {message}")

class DatabaseLogger(Logger):
    def __init__(self, log_level: str, table_name: str):
        super().__init__(log_level)
        self.__table_name = table_name
    
    def _write_log(self, level: str, message: str) -> None:
        timestamp = datetime.now().isoformat()
        print(f"[DATABASE] Saved to {self.__table_name}: {timestamp} [{level}] {message}")

class LoggingService:
    def __init__(self):
        self.__loggers = []
    
    def add_logger(self, logger: Logger) -> None:
        self.__loggers.append(logger)
    
    def log_to_all(self, level: str, message: str) -> None:
        print(f"\n=== Broadcasting {level} log to {len(self.__loggers)} loggers ===")
        for logger in self.__loggers:
            logger.log(level, message)

# Usage
logging_service = LoggingService()
logging_service.add_logger(ConsoleLogger("DEBUG"))
logging_service.add_logger(FileLogger("INFO", "app.log"))
logging_service.add_logger(DatabaseLogger("ERROR", "logs_table"))

logging_service.log_to_all("DEBUG", "Application started")
logging_service.log_to_all("INFO", "User logged in")
logging_service.log_to_all("ERROR", "Database connection failed")
```

</details>

</details>

---

## Summary

The Four Pillars of OOP work together to create robust, maintainable software:

1. **Encapsulation**: Bundle data and methods, hide implementation details
2. **Abstraction**: Hide complexity, expose only essential features
3. **Inheritance**: Model IS-A relationships, enable code reuse
4. **Polymorphism**: Same interface, different implementations

These principles aren't just academic concepts—they solve real problems in software development: reducing duplication, managing complexity, and making code flexible and maintainable.
