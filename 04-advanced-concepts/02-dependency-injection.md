# 4.2 Dependency Injection

[← Back to Composition vs Inheritance](01-composition-vs-inheritance.md) | [Next: Abstract vs Interface →](03-abstract-vs-interface.md) | [↑ Back to README](../README.md)

---

## What is Dependency Injection?

**Providing dependencies to a class instead of having the class create them itself.**

### Without DI

```python
class EmailService:
    def send(self, to, message):
        print(f"Email to {to}: {message}")

class UserService:
    def __init__(self):
        self.email = EmailService()  # Creates dependency!
    
    def register(self, user):
        self.email.send(user.email, "Welcome!")
```

### With DI

```python
class UserService:
    def __init__(self, email_service):
        self.email = email_service  # Receives dependency!
    
    def register(self, user):
        self.email.send(user.email, "Welcome!")

# Inject dependency
email = EmailService()
service = UserService(email)
```

---

## Benefits

### 1. Testability

```python
# Easy to inject mock for testing
class MockEmailService:
    def __init__(self):
        self.sent_emails = []
    
    def send(self, to, message):
        self.sent_emails.append((to, message))

# In tests
mock_email = MockEmailService()
service = UserService(mock_email)
service.register(User("test@example.com"))
assert len(mock_email.sent_emails) == 1
```

### 2. Flexibility

```python
# Easy to swap implementations
class SMSService:
    def send(self, to, message):
        print(f"SMS to {to}: {message}")

# Can switch from email to SMS
service = UserService(SMSService())
```

### 3. Loose Coupling

Classes don't know about concrete implementations.

---

## Types of DI

### 1. Constructor Injection (Recommended)

```python
class OrderService:
    def __init__(self, payment_processor, email_service):
        self.payment = payment_processor
        self.email = email_service
```

### 2. Setter Injection

```python
class OrderService:
    def set_payment_processor(self, processor):
        self.payment = processor
    
    def set_email_service(self, service):
        self.email = service
```

### 3. Method Injection

```python
class OrderService:
    def process_order(self, order, payment_processor):
        payment_processor.charge(order.total)
```

---

## Practice Questions

<details>
<summary><strong>View Questions</strong></summary>

### Fill in the Gaps

1. Dependency Injection means providing dependencies from __________ rather than creating them __________.
2. DI makes code more __________ because you can easily inject mock objects.
3. The recommended type of dependency injection is __________ injection.
4. DI promotes __________ coupling between classes.

<details>
<summary><strong>View Answers</strong></summary>

1. outside, inside
2. testable
3. constructor
4. loose

</details>

### True/False

1. Dependency Injection makes testing easier.
2. With DI, classes create their own dependencies.
3. DI allows you to swap implementations easily.
4. Constructor injection is the most common type of DI.

<details>
<summary><strong>View Answers</strong></summary>

1. True
2. False - Dependencies are injected from outside
3. True
4. True

</details>

</details>

---

[← Back to Composition vs Inheritance](01-composition-vs-inheritance.md) | [Next: Abstract vs Interface →](03-abstract-vs-interface.md) | [↑ Back to README](../README.md)