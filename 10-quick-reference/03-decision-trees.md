# 10.3 Decision Trees

[← Back to Memory Aids](02-memory-aids.md) | [Next: Glossary →](04-glossary.md) | [↑ Back to README](../README.md)

---

## 1. Inheritance vs Composition

```
Do you need code reuse?
│
├─ YES → Is there a true IS-A relationship?
│        │
│        ├─ YES → Is the hierarchy shallow (2-3 levels)?
│        │        │
│        │        ├─ YES → Use INHERITANCE ✅
│        │        │        Example: Dog IS-A Animal
│        │        │
│        │        └─ NO → Use COMPOSITION ✅
│        │                 (Deep hierarchies are fragile)
│        │
│        └─ NO → Use COMPOSITION ✅
│                 Example: Car HAS-A Engine (not IS-A Engine)
│
└─ NO → Need flexibility at runtime?
         │
         ├─ YES → Use COMPOSITION ✅
         │
         └─ NO → Simple case, either works
```

**Quick Rule:** When in doubt, favor COMPOSITION

---

## 2. Abstract Class vs Interface

```
Need to define a contract for classes?
│
├─ Do you need to share implementation code?
│  │
│  ├─ YES → Use ABSTRACT CLASS ✅
│  │        Example: Shape with shared area calculation logic
│  │
│  └─ NO → Do you need state (fields)?
│           │
│           ├─ YES → Use ABSTRACT CLASS ✅
│           │
│           └─ NO → Do you need multiple inheritance?
│                    │
│                    ├─ YES → Use INTERFACE ✅
│                    │        Example: Drawable, Clickable
│                    │
│                    └─ NO → Either works
│                             (prefer Interface for pure contracts)
```

**Quick Rule:**
- Abstract Class = Shared code + state
- Interface = Pure contract, no code

---

## 3. Which Design Pattern to Use?

```
What problem are you solving?
│
├─ OBJECT CREATION
│  │
│  ├─ Need exactly ONE instance?
│  │  └─ SINGLETON ✅
│  │
│  ├─ Don't know type until runtime?
│  │  └─ FACTORY ✅
│  │
│  └─ Complex object with many parameters?
│     └─ BUILDER ✅
│
├─ OBJECT STRUCTURE
│  │
│  ├─ Make incompatible interfaces work?
│  │  └─ ADAPTER ✅
│  │
│  ├─ Add behavior dynamically?
│  │  └─ DECORATOR ✅
│  │
│  └─ Simplify complex subsystem?
│     └─ FACADE ✅
│
└─ OBJECT BEHAVIOR
   │
   ├─ Multiple algorithms for same task?
   │  └─ STRATEGY ✅
   │
   ├─ One object notifies many?
   │  └─ OBSERVER ✅
   │
   └─ Encapsulate request as object?
      └─ COMMAND ✅
```

---

## 4. How to Handle Dependencies?

```
Class needs another class to function?
│
├─ Should it work without that class?
│  │
│  ├─ NO → Required dependency
│  │      │
│  │      └─ Inject via CONSTRUCTOR ✅
│  │         class UserService:
│  │             def __init__(self, db):
│  │                 self.db = db
│  │
│  └─ YES → Optional dependency
│           │
│           └─ Inject via SETTER or METHOD ✅
│              class Logger:
│                  def set_handler(self, handler):
│                      self.handler = handler
│
└─ Is it a configuration value?
   │
   └─ YES → Use DEPENDENCY INJECTION + CONFIG ✅
            config = Config.from_env()
```

**Quick Rule:** Inject dependencies, don't create them

---

## 5. When to Apply SOLID Principles?

```
Writing a new class?
│
├─ Does it have more than one reason to change?
│  └─ YES → Violates SRP
│           Split into multiple classes ✅
│
├─ Will you need to add new types/behaviors?
│  └─ YES → Follow OCP
│           Design for extension ✅
│           Use interfaces/abstract classes
│
├─ Can child class break parent's contract?
│  └─ YES → Violates LSP
│           Redesign hierarchy ✅
│
├─ Do clients use only part of interface?
│  └─ YES → Violates ISP
│           Split into smaller interfaces ✅
│
└─ Does it depend on concrete classes?
   └─ YES → Violates DIP
            Depend on abstractions ✅
```

---

## 6. Error Handling Strategy

```
Method might fail?
│
├─ Is it expected behavior?
│  │
│  ├─ YES → Return None or special value ✅
│  │        def find_user(id):
│  │            return user or None
│  │
│  └─ NO → Is it recoverable?
│           │
│           ├─ YES → Raise exception ✅
│           │        raise ValueError("Invalid email")
│           │
│           └─ NO → Log and crash ✅
│                    (critical system errors)
│
└─ Can caller handle the error?
   │
   ├─ YES → Raise specific exception ✅
   │        raise InsufficientFundsError()
   │
   └─ NO → Catch and log ✅
            try:
                ...
            except Exception as e:
                logger.error(e)
```

---

## 7. Testing Strategy

```
What to test?
│
├─ Public methods?
│  └─ YES → Write unit tests ✅
│
├─ Private methods?
│  └─ NO → Test through public methods ✅
│           (Don't test implementation details)
│
├─ Integration between classes?
│  └─ YES → Write integration tests ✅
│
└─ User workflows?
   └─ YES → Write end-to-end tests ✅
```

**Test Pyramid:**
```
      /\
     /E2E\      ← Few (Slow, expensive)
    /------\
   /Integr.\   ← Some (Medium speed)
  /----------\
 /   Unit     \ ← Many (Fast, cheap)
/--------------\
```

---

## 8. Code Review Checklist

```
Reviewing code?
│
├─ SOLID Principles
│  ├─ ☐ Each class has single responsibility?
│  ├─ ☐ Open for extension, closed for modification?
│  ├─ ☐ Subtypes work where parent types work?
│  ├─ ☐ No fat interfaces?
│  └─ ☐ Depends on abstractions?
│
├─ Design Patterns
│  ├─ ☐ Used appropriately?
│  ├─ ☐ Not over-engineered?
│  └─ ☐ Clear benefit from pattern?
│
├─ Code Quality
│  ├─ ☐ Meaningful names?
│  ├─ ☐ No duplication?
│  ├─ ☐ Proper error handling?
│  ├─ ☐ Comments where needed?
│  └─ ☐ No magic numbers?
│
├─ Testing
│  ├─ ☐ Tests written?
│  ├─ ☐ Edge cases covered?
│  └─ ☐ Tests pass?
│
└─ Anti-Patterns
   ├─ ☐ No God objects?
   ├─ ☐ No tight coupling?
   ├─ ☐ Proper encapsulation?
   └─ ☐ No premature optimization?
```

---

## 9. Refactoring Decision

```
Should I refactor this code?
│
├─ Does it have bugs?
│  └─ YES → Fix bugs first, then refactor ✅
│
├─ Is it hard to understand?
│  └─ YES → Refactor ✅
│           Extract methods, rename variables
│
├─ Is it duplicated?
│  └─ YES → Refactor ✅
│           Apply DRY principle
│
├─ Does it violate SOLID?
│  └─ YES → Refactor ✅
│
├─ Will you touch it soon?
│  │
│  ├─ YES → Refactor now ✅
│  │
│  └─ NO → Is it causing problems?
│           │
│           ├─ YES → Refactor ✅
│           │
│           └─ NO → Leave it ⚠️
│                    (If it works and won't change)
```

**Boy Scout Rule:** Leave code cleaner than you found it

---

## 10. Performance Optimization Decision

```
Code is slow?
│
├─ Have you profiled it?
│  │
│  ├─ NO → PROFILE FIRST! ⚠️
│  │       Don't guess where bottleneck is
│  │
│  └─ YES → Is this the bottleneck?
│           │
│           ├─ NO → Profile more ⚠️
│           │
│           └─ YES → Will optimization help users?
│                    │
│                    ├─ NO → Don't optimize ✅
│                    │       (Negligible impact)
│                    │
│                    └─ YES → Optimize ✅
│                             Then measure again
```

**Optimization Steps:**
1. ✅ Make it work (correctness)
2. ✅ Make it right (clean code)
3. ✅ Measure performance
4. ✅ Make it fast (if needed)

---

## 11. Access Modifier Decision

```
Creating a class member?
│
├─ Should other classes access it directly?
│  │
│  ├─ NO → Is it used by subclasses?
│  │      │
│  │      ├─ YES → PROTECTED ✅
│  │      │        (C++, TypeScript: protected)
│  │      │        (Python: _protected)
│  │      │
│  │      └─ NO → PRIVATE ✅
│  │               (C++, TypeScript: private)
│  │               (Python: __private or _private)
│  │
│  └─ YES → PUBLIC ✅
│           But consider:
│           - Provide methods instead?
│           - Use properties?
│           - Really needs public access?
```

**Default Rule:** Start PRIVATE, make PUBLIC only if needed

---

## 12. Class Size Decision

```
Class getting large?
│
├─ More than 500 lines?
│  └─ YES → Split it ✅
│
├─ More than 10 methods?
│  └─ YES → Check if following SRP
│           Different responsibilities? → Split ✅
│
├─ Hard to name specifically?
│  └─ YES → Too many responsibilities
│           Split it ✅
│
└─ Need "and" in description?
   └─ YES → "Handles users AND orders"
            Split it ✅
```

**Good class size:**
- 50-300 lines (typical)
- 5-10 methods (typical)
- Can be described with one sentence

---

## Quick Decision Summary

| Question | Answer |
|----------|--------|
| Inheritance or Composition? | **Composition** (unless true IS-A) |
| Abstract Class or Interface? | **Interface** (unless need shared code) |
| Public or Private? | **Private** (make public only if needed) |
| Optimize now? | **NO** (profile first) |
| Refactor now? | **YES** (if touching code) |
| Add design pattern? | **ONLY** if solves real problem |
| Write test? | **YES** (always) |
| Split class? | **YES** (if >500 lines or violates SRP) |

---

[← Back to Memory Aids](02-memory-aids.md) | [Next: Glossary →](04-glossary.md) | [↑ Back to README](../README.md)