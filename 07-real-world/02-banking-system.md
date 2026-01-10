# 7.2 Banking System Design

[← Back to E-Commerce System](01-e-commerce-system.md) | [Next: Logging System →](03-logging-system.md) | [↑ Back to README](../README.md)

---

## System Overview

Design a **banking system** with accounts, transactions, and security features.

### Core Requirements

**Features:**
- Account management (Savings, Checking, Credit)
- Transactions (Deposit, Withdrawal, Transfer)
- Transaction history
- Interest calculation
- Security and authentication
- ATM operations

**Design Goals:**
- ✅ Secure
- ✅ ACID compliant (atomic transactions)
- ✅ Audit trail
- ✅ Extensible

---

## Class Design

### 1. Account Hierarchy

```python
from abc import ABC, abstractmethod
from datetime import datetime
from decimal import Decimal
from enum import Enum

class AccountType(Enum):
    SAVINGS = "savings"
    CHECKING = "checking"
    CREDIT = "credit"

class TransactionType(Enum):
    DEPOSIT = "deposit"
    WITHDRAWAL = "withdrawal"
    TRANSFER = "transfer"
    INTEREST = "interest"
    FEE = "fee"

class Account(ABC):
    """Base account class"""
    account_counter = 1000000
    
    def __init__(self, account_holder, initial_balance=Decimal('0')):
        Account.account_counter += 1
        self.account_number = f"ACC{Account.account_counter}"
        self.account_holder = account_holder
        self._balance = Decimal(str(initial_balance))
        self.transactions = []
        self.created_at = datetime.now()
        self.is_active = True
    
    def get_balance(self):
        """Read-only balance access"""
        return self._balance
    
    @abstractmethod
    def deposit(self, amount, description="Deposit"):
        pass
    
    @abstractmethod
    def withdraw(self, amount, description="Withdrawal"):
        pass
    
    @abstractmethod
    def calculate_interest(self):
        pass
    
    def add_transaction(self, transaction):
        self.transactions.append(transaction)
    
    def get_transaction_history(self, days=30):
        cutoff = datetime.now().timestamp() - (days * 24 * 60 * 60)
        return [t for t in self.transactions 
                if t.timestamp.timestamp() >= cutoff]
    
    def __str__(self):
        return f"Account {self.account_number}: ${self._balance:.2f}"

class SavingsAccount(Account):
    """Savings account with interest"""
    def __init__(self, account_holder, initial_balance=Decimal('0'), 
                 interest_rate=Decimal('0.02')):
        super().__init__(account_holder, initial_balance)
        self.interest_rate = interest_rate  # 2% annual
        self.withdrawal_limit = 6  # Per month (Regulation D)
        self.monthly_withdrawals = 0
    
    def deposit(self, amount, description="Deposit"):
        if amount <= 0:
            raise ValueError("Deposit amount must be positive")
        
        self._balance += Decimal(str(amount))
        
        transaction = Transaction(
            self.account_number,
            TransactionType.DEPOSIT,
            amount,
            self._balance,
            description
        )
        self.add_transaction(transaction)
        return transaction
    
    def withdraw(self, amount, description="Withdrawal"):
        if amount <= 0:
            raise ValueError("Withdrawal amount must be positive")
        
        if self._balance < amount:
            raise ValueError("Insufficient funds")
        
        if self.monthly_withdrawals >= self.withdrawal_limit:
            raise ValueError(f"Monthly withdrawal limit ({self.withdrawal_limit}) exceeded")
        
        self._balance -= Decimal(str(amount))
        self.monthly_withdrawals += 1
        
        transaction = Transaction(
            self.account_number,
            TransactionType.WITHDRAWAL,
            -amount,
            self._balance,
            description
        )
        self.add_transaction(transaction)
        return transaction
    
    def calculate_interest(self):
        """Calculate and apply monthly interest"""
        interest = self._balance * (self.interest_rate / 12)
        self._balance += interest
        
        transaction = Transaction(
            self.account_number,
            TransactionType.INTEREST,
            interest,
            self._balance,
            f"Monthly interest at {self.interest_rate * 100}%"
        )
        self.add_transaction(transaction)
        return interest
    
    def reset_monthly_withdrawals(self):
        """Called at start of each month"""
        self.monthly_withdrawals = 0

class CheckingAccount(Account):
    """Checking account with overdraft protection"""
    def __init__(self, account_holder, initial_balance=Decimal('0'),
                 overdraft_limit=Decimal('500')):
        super().__init__(account_holder, initial_balance)
        self.overdraft_limit = overdraft_limit
        self.monthly_fee = Decimal('10')
    
    def deposit(self, amount, description="Deposit"):
        if amount <= 0:
            raise ValueError("Deposit amount must be positive")
        
        self._balance += Decimal(str(amount))
        
        transaction = Transaction(
            self.account_number,
            TransactionType.DEPOSIT,
            amount,
            self._balance,
            description
        )
        self.add_transaction(transaction)
        return transaction
    
    def withdraw(self, amount, description="Withdrawal"):
        if amount <= 0:
            raise ValueError("Withdrawal amount must be positive")
        
        # Check overdraft limit
        if self._balance - amount < -self.overdraft_limit:
            raise ValueError(f"Exceeds overdraft limit of ${self.overdraft_limit}")
        
        self._balance -= Decimal(str(amount))
        
        transaction = Transaction(
            self.account_number,
            TransactionType.WITHDRAWAL,
            -amount,
            self._balance,
            description
        )
        self.add_transaction(transaction)
        return transaction
    
    def calculate_interest(self):
        """Checking accounts typically don't earn interest"""
        return Decimal('0')
    
    def apply_monthly_fee(self):
        """Apply monthly maintenance fee"""
        self._balance -= self.monthly_fee
        
        transaction = Transaction(
            self.account_number,
            TransactionType.FEE,
            -self.monthly_fee,
            self._balance,
            "Monthly maintenance fee"
        )
        self.add_transaction(transaction)

class CreditAccount(Account):
    """Credit account (negative balance is credit used)"""
    def __init__(self, account_holder, credit_limit=Decimal('5000'),
                 apr=Decimal('0.18')):
        super().__init__(account_holder, Decimal('0'))
        self.credit_limit = credit_limit
        self.apr = apr  # Annual Percentage Rate
        self._balance = Decimal('0')  # Negative = debt
    
    def deposit(self, amount, description="Payment"):
        """Payment towards credit card"""
        if amount <= 0:
            raise ValueError("Payment amount must be positive")
        
        self._balance += Decimal(str(amount))
        
        transaction = Transaction(
            self.account_number,
            TransactionType.DEPOSIT,
            amount,
            self._balance,
            description
        )
        self.add_transaction(transaction)
        return transaction
    
    def withdraw(self, amount, description="Charge"):
        """Charge on credit card"""
        if amount <= 0:
            raise ValueError("Charge amount must be positive")
        
        # Check credit limit
        if abs(self._balance - amount) > self.credit_limit:
            raise ValueError(f"Exceeds credit limit of ${self.credit_limit}")
        
        self._balance -= Decimal(str(amount))
        
        transaction = Transaction(
            self.account_number,
            TransactionType.WITHDRAWAL,
            -amount,
            self._balance,
            description
        )
        self.add_transaction(transaction)
        return transaction
    
    def get_available_credit(self):
        return self.credit_limit - abs(min(self._balance, Decimal('0')))
    
    def calculate_interest(self):
        """Calculate monthly interest on balance"""
        if self._balance < 0:  # Only charge interest on debt
            interest = abs(self._balance) * (self.apr / 12)
            self._balance -= interest
            
            transaction = Transaction(
                self.account_number,
                TransactionType.INTEREST,
                -interest,
                self._balance,
                f"Interest charge at {self.apr * 100}% APR"
            )
            self.add_transaction(transaction)
            return interest
        return Decimal('0')
```

### 2. Transaction Class

```python
class Transaction:
    """Immutable transaction record"""
    transaction_counter = 1000000
    
    def __init__(self, account_number, transaction_type, amount, balance_after, description):
        Transaction.transaction_counter += 1
        self.transaction_id = f"TXN{Transaction.transaction_counter}"
        self.account_number = account_number
        self.transaction_type = transaction_type
        self.amount = Decimal(str(amount))
        self.balance_after = Decimal(str(balance_after))
        self.description = description
        self.timestamp = datetime.now()
    
    def __str__(self):
        sign = "+" if self.amount >= 0 else ""
        return (f"{self.timestamp.strftime('%Y-%m-%d %H:%M:%S')} | "
                f"{self.transaction_type.value:12} | "
                f"{sign}${self.amount:>10.2f} | "
                f"Balance: ${self.balance_after:>10.2f} | "
                f"{self.description}")
```

### 3. Customer Class

```python
class Customer:
    """Bank customer"""
    customer_counter = 100000
    
    def __init__(self, name, email, phone, address):
        Customer.customer_counter += 1
        self.customer_id = f"CUST{Customer.customer_counter}"
        self.name = name
        self.email = email
        self.phone = phone
        self.address = address
        self.accounts = []
        self.created_at = datetime.now()
    
    def add_account(self, account):
        self.accounts.append(account)
    
    def get_total_balance(self):
        """Total balance across all accounts"""
        return sum(acc.get_balance() for acc in self.accounts)
    
    def __str__(self):
        return f"Customer {self.customer_id}: {self.name}"
```

### 4. Bank Service

```python
class BankService:
    """Main banking operations"""
    def __init__(self):
        self.customers = {}
        self.accounts = {}
    
    def create_customer(self, name, email, phone, address):
        customer = Customer(name, email, phone, address)
        self.customers[customer.customer_id] = customer
        return customer
    
    def open_account(self, customer, account_type, **kwargs):
        """Open new account"""
        if account_type == AccountType.SAVINGS:
            account = SavingsAccount(customer, **kwargs)
        elif account_type == AccountType.CHECKING:
            account = CheckingAccount(customer, **kwargs)
        elif account_type == AccountType.CREDIT:
            account = CreditAccount(customer, **kwargs)
        else:
            raise ValueError(f"Unknown account type: {account_type}")
        
        customer.add_account(account)
        self.accounts[account.account_number] = account
        return account
    
    def transfer(self, from_account, to_account, amount, description="Transfer"):
        """Transfer money between accounts (atomic)"""
        if amount <= 0:
            raise ValueError("Transfer amount must be positive")
        
        # Atomic operation
        try:
            # Withdraw from source
            from_account.withdraw(amount, f"Transfer to {to_account.account_number}")
            
            # Deposit to destination
            to_account.deposit(amount, f"Transfer from {from_account.account_number}")
            
            return True
        except Exception as e:
            # Rollback would happen here in production
            raise ValueError(f"Transfer failed: {e}")
    
    def apply_monthly_maintenance(self):
        """Apply monthly fees and interest"""
        for account in self.accounts.values():
            # Calculate interest
            account.calculate_interest()
            
            # Apply fees
            if isinstance(account, CheckingAccount):
                account.apply_monthly_fee()
            
            # Reset limits
            if isinstance(account, SavingsAccount):
                account.reset_monthly_withdrawals()
```

### 5. ATM Operations

```python
class ATM:
    """ATM machine"""
    def __init__(self, atm_id, location, bank_service):
        self.atm_id = atm_id
        self.location = location
        self.bank_service = bank_service
        self.current_session = None
    
    def authenticate(self, account_number, pin):
        """Simplified authentication"""
        if account_number in self.bank_service.accounts:
            account = self.bank_service.accounts[account_number]
            # In production: verify PIN against secure storage
            self.current_session = ATMSession(self, account)
            return self.current_session
        raise ValueError("Invalid account or PIN")
    
    def end_session(self):
        self.current_session = None

class ATMSession:
    """ATM session for a customer"""
    def __init__(self, atm, account):
        self.atm = atm
        self.account = account
        self.start_time = datetime.now()
    
    def check_balance(self):
        return self.account.get_balance()
    
    def withdraw_cash(self, amount):
        """Withdraw cash from ATM"""
        # ATM-specific limits
        if amount > 500:
            raise ValueError("ATM daily limit: $500")
        
        if amount % 20 != 0:
            raise ValueError("ATM dispenses $20 bills only")
        
        return self.account.withdraw(amount, f"ATM withdrawal at {self.atm.location}")
    
    def deposit_cash(self, amount):
        return self.account.deposit(amount, f"ATM deposit at {self.atm.location}")
    
    def print_statement(self, days=30):
        transactions = self.account.get_transaction_history(days)
        print(f"\n{'='*80}")
        print(f"Account Statement - {self.account.account_number}")
        print(f"Account Holder: {self.account.account_holder.name}")
        print(f"{'='*80}")
        for txn in transactions:
            print(txn)
        print(f"{'='*80}")
        print(f"Current Balance: ${self.account.get_balance():.2f}")
        print(f"{'='*80}\n")
```

---

## Complete Usage Example

```python
def main():
    # Initialize bank
    bank = BankService()
    
    # Create customer
    customer = bank.create_customer(
        "Alice Johnson",
        "alice@example.com",
        "555-0123",
        "123 Main St, City, State"
    )
    
    print(f"Created {customer}\n")
    
    # Open accounts
    savings = bank.open_account(
        customer, 
        AccountType.SAVINGS,
        initial_balance=Decimal('10000'),
        interest_rate=Decimal('0.03')
    )
    
    checking = bank.open_account(
        customer,
        AccountType.CHECKING,
        initial_balance=Decimal('5000'),
        overdraft_limit=Decimal('1000')
    )
    
    credit = bank.open_account(
        customer,
        AccountType.CREDIT,
        credit_limit=Decimal('10000'),
        apr=Decimal('0.18')
    )
    
    print(f"Opened savings: {savings}")
    print(f"Opened checking: {checking}")
    print(f"Opened credit: {credit}")
    print(f"Available credit: ${credit.get_available_credit():.2f}\n")
    
    # Perform transactions
    print("=== Transactions ===")
    savings.deposit(1000, "Direct deposit")
    print(f"After deposit: {savings}")
    
    savings.withdraw(200, "ATM withdrawal")
    print(f"After withdrawal: {savings}")
    
    # Transfer between accounts
    bank.transfer(savings, checking, 500, "Transfer to checking")
    print(f"Savings after transfer: {savings}")
    print(f"Checking after transfer: {checking}")
    
    # Credit card purchase
    credit.withdraw(150, "Amazon purchase")
    print(f"Credit after purchase: {credit}")
    print(f"Available credit: ${credit.get_available_credit():.2f}\n")
    
    # ATM operations
    print("=== ATM Operations ===")
    atm = ATM("ATM001", "Downtown Branch", bank)
    session = atm.authenticate(checking.account_number, "1234")
    
    print(f"Balance: ${session.check_balance():.2f}")
    session.withdraw_cash(100)
    print(f"After ATM withdrawal: ${session.check_balance():.2f}")
    
    # Print statement
    session.print_statement(days=30)
    
    atm.end_session()
    
    # Monthly maintenance
    print("=== Monthly Maintenance ===")
    bank.apply_monthly_maintenance()
    
    print(f"Savings after interest: {savings}")
    print(f"Checking after fees: {checking}")
    print(f"Credit after interest: {credit}")
    
    # Total balance
    print(f"\nTotal balance: ${customer.get_total_balance():.2f}")

if __name__ == "__main__":
    main()
```

---

## Design Patterns Used

### 1. **Template Method**
- Account base class with abstract methods
- Subclasses implement specific behavior

### 2. **Strategy Pattern** (Could Add)
- Different interest calculation strategies
- Different fee structures

### 3. **Facade Pattern**
- BankService simplifies complex operations
- Hides account management complexity

### 4. **Session Pattern**
- ATMSession manages stateful ATM interactions

---

## Security Considerations

### 1. **Encapsulation**
```python
class Account:
    def __init__(self):
        self._balance = Decimal('0')  # Private
    
    def get_balance(self):
        return self._balance  # Read-only access
```

### 2. **Immutable Transactions**
```python
class Transaction:
    # No setters - once created, cannot be modified
    pass
```

### 3. **Atomic Operations**
```python
def transfer(self, from_account, to_account, amount):
    try:
        from_account.withdraw(amount)
        to_account.deposit(amount)
    except:
        # Rollback logic here
        raise
```

---

## Interview Questions

<details>
<summary><strong>View Questions</strong></summary>

### Q1: How would you implement concurrent transaction handling?

<details>
<summary><strong>View Answer</strong></summary>

**Use Thread Locks:**

```python
import threading

class Account:
    def __init__(self, account_holder, initial_balance):
        # ... existing code ...
        self._lock = threading.Lock()
    
    def withdraw(self, amount, description="Withdrawal"):
        with self._lock:  # Acquire lock
            if self._balance < amount:
                raise ValueError("Insufficient funds")
            
            self._balance -= Decimal(str(amount))
            # ... rest of logic
        # Lock automatically released

# Multiple threads can safely access account
```

**Or use Database Transactions:**
- BEGIN TRANSACTION
- Perform operations
- COMMIT or ROLLBACK

</details>

### Q2: How would you add transaction limits and fraud detection?

<details>
<summary><strong>View Answer</strong></summary>

**Add FraudDetector class:**

```python
class FraudDetector:
    def __init__(self):
        self.daily_limit = Decimal('10000')
        self.transaction_limit = Decimal('5000')
    
    def check_transaction(self, account, amount):
        # Check single transaction limit
        if amount > self.transaction_limit:
            raise ValueError(f"Transaction exceeds limit of ${self.transaction_limit}")
        
        # Check daily limit
        today_total = self._get_today_total(account)
        if today_total + amount > self.daily_limit:
            raise ValueError(f"Daily limit of ${self.daily_limit} exceeded")
        
        # Check unusual patterns
        if self._is_unusual_pattern(account, amount):
            raise ValueError("Unusual activity detected - transaction blocked")
        
        return True
    
    def _get_today_total(self, account):
        today_txns = account.get_transaction_history(days=1)
        return sum(abs(t.amount) for t in today_txns 
                  if t.transaction_type == TransactionType.WITHDRAWAL)
    
    def _is_unusual_pattern(self, account, amount):
        # Check for unusual patterns
        # e.g., multiple large withdrawals, foreign transactions, etc.
        return False

class Account:
    def __init__(self, account_holder, initial_balance):
        # ... existing code ...
        self.fraud_detector = FraudDetector()
    
    def withdraw(self, amount, description="Withdrawal"):
        self.fraud_detector.check_transaction(self, amount)
        # ... rest of logic
```

</details>

</details>

---

## Summary

### Key Design Decisions

1. **Inheritance Hierarchy** - Different account types
2. **Encapsulation** - Private balance, public methods
3. **Immutability** - Transactions cannot be modified
4. **Atomic Operations** - Transfers are all-or-nothing
5. **Audit Trail** - Complete transaction history

### SOLID Principles

- ✅ **SRP** - Each class has one responsibility
- ✅ **OCP** - Easy to add new account types
- ✅ **LSP** - Any Account can be used interchangeably
- ✅ **ISP** - Focused interfaces
- ✅ **DIP** - Depend on Account abstraction

---

[← Back to E-Commerce System](01-e-commerce-system.md) | [Next: Logging System →](03-logging-system.md) | [↑ Back to README](../README.md)