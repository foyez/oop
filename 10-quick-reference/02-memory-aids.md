# 10.2 Memory Aids & Mnemonics

[← Back to Cheat Sheet](01-cheat-sheet.md) | [Next: Decision Trees →](03-decision-trees.md) | [↑ Back to README](../README.md)

---

## SOLID Principles

### Mnemonic: "SOLID"

**S** - **S**ingle Responsibility  
*"One class, one job"*

**O** - **O**pen/Closed  
*"Open for extension, Closed for modification"*

**L** - **L**iskov Substitution  
*"Child must work where parent works"*

**I** - **I**nterface Segregation  
*"Many small interfaces > one big interface"*

**D** - **D**ependency Inversion  
*"Depend on abstractions, not concretions"*

---

## Four Pillars of OOP

### Mnemonic: "A PIE"

**A** - **A**bstraction  
*"Hide complexity, show essentials"*

**P** - **P**olymorphism  
*"Many forms, same interface"*

**I** - **I**nheritance  
*"Parent traits to children"*

**E** - **E**ncapsulation  
*"Bundle data with methods, hide details"*

---

## Design Pattern Categories

### Mnemonic: "CSB"

**C** - **C**reational  
*"How objects are created"*  
Examples: Factory, Singleton, Builder

**S** - **S**tructural  
*"How objects are composed"*  
Examples: Adapter, Decorator, Facade

**B** - **B**ehavioral  
*"How objects interact"*  
Examples: Strategy, Observer, Command

---

## Composition vs Inheritance

### Remember: "HIS-A"

**H** - **H**AS-A → Use Composition  
*Car HAS-A Engine*

**IS** - **IS**-A → Use Inheritance  
*Dog IS-A Animal*

---

## Common Anti-Patterns

### Mnemonic: "GHOST"

**G** - **G**od Object  
**H** - **H**ard Coding  
**O** - **O**ver-engineering  
**S** - **S**paghetti Code  
**T** - **T**ight Coupling

---

## Best Practices

### Mnemonic: "KISS DRY"

**KISS** - **K**eep **I**t **S**imple, **S**tupid  
**DRY** - **D**on't **R**epeat **Y**ourself

### Additional: "YAGNI"
**Y**ou **A**ren't **G**onna **N**eed **I**t

---

## Method Resolution Order (Python)

### Remember: "DLR"

**D** - **D**epth-first  
**L** - **L**eft-to-right  
**R** - **R**emove duplicates

---

## When to Use Design Patterns

### Factory Pattern
**Remember:** "Type Unknown"  
Use when you don't know the exact type until runtime

### Singleton Pattern
**Remember:** "One Instance"  
Use when you need exactly ONE instance

### Strategy Pattern
**Remember:** "Algorithm Switch"  
Use when you need to switch algorithms at runtime

### Observer Pattern
**Remember:** "One-to-Many Notify"  
Use when one object needs to notify many objects

---

## Quick Decision Trees

### Inheritance vs Composition?
```
IS-A relationship? → Inheritance
HAS-A relationship? → Composition
Need flexibility? → Composition
```

### Abstract Class vs Interface?
```
Need shared code? → Abstract Class
Just a contract? → Interface
Need state? → Abstract Class
Multiple inheritance? → Interface
```

---

[← Back to Cheat Sheet](01-cheat-sheet.md) | [Next: Decision Trees →](03-decision-trees.md) | [↑ Back to README](../README.md)