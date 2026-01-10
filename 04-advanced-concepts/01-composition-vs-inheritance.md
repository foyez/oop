# 4.1 Composition vs Inheritance

[← Back to DIP](../03-solid-principles/05-dip.md) | [Next: Dependency Injection →](02-dependency-injection.md) | [↑ Back to README](../README.md)

---

## The Big Question

**When should you use inheritance, and when should you use composition?**

### Golden Rule

**"Favor Composition over Inheritance"**

But this doesn't mean "never use inheritance"!

---

## Inheritance (IS-A Relationship)

### When to Use

✅ Clear, stable IS-A relationship
✅ Shallow hierarchy (2-3 levels max)
✅ Child truly IS a specialized version of parent
✅ Need polymorphic behavior

### Example

```python
class Animal:
    def breathe(self):
        return "Breathing"

class Dog(Animal):  # Dog IS-A Animal ✅
    def bark(self):
        return "Woof"
```

---

## Composition (HAS-A Relationship)

### When to Use

✅ HAS-A relationship
✅ Need runtime flexibility
✅ Want to combine behaviors from multiple sources
✅ Avoiding deep hierarchies

### Example

```python
class Engine:
    def start(self):
        return "Engine started"

class Car:  # Car HAS-AN Engine ✅
    def __init__(self):
        self.engine = Engine()
    
    def start(self):
        return self.engine.start()
```

---

## Comparison Examples

### ❌ Bad Inheritance

```python
# Using inheritance for code reuse (wrong reason!)
class ArrayList:
    def add(self, item): pass
    def remove(self, item): pass
    def size(self): pass

class Stack(ArrayList):  # Stack IS-A ArrayList? No!
    def push(self, item):
        self.add(item)
    
    def pop(self):
        item = self[-1]
        self.remove(item)
        return item
```

Problems:
- Stack exposes ArrayList methods (add, remove)
- Stack IS-A ArrayList is conceptually wrong
- Tight coupling

### ✅ Good Composition

```python
class Stack:
    def __init__(self):
        self._items = []  # HAS-A list
    
    def push(self, item):
        self._items.append(item)
    
    def pop(self):
        return self._items.pop()
    
    def size(self):
        return len(self._items)
```

Benefits:
- Only exposes Stack interface
- Can change internal storage
- Loose coupling

---

## Real-World Example: Game Characters

### ❌ Inheritance Hell

```python
class Character:
    def move(self): pass

class Warrior(Character):
    def swing_sword(self): pass

class Mage(Character):
    def cast_spell(self): pass

# What if we want a character that can both fight and cast spells?
class WarriorMage(Warrior, Mage):  # Multiple inheritance mess!
    pass
```

### ✅ Composition Solution

```python
# Components
class Movement:
    def move(self):
        return "Moving"

class SwordCombat:
    def attack(self):
        return "Sword swing!"

class MagicCombat:
    def attack(self):
        return "Cast fireball!"

class Healing:
    def heal(self):
        return "Healing"

# Compose characters
class Character:
    def __init__(self, movement, combat, special=None):
        self.movement = movement
        self.combat = combat
        self.special = special
    
    def move(self):
        return self.movement.move()
    
    def attack(self):
        return self.combat.attack()

# Easy to create any combination!
warrior = Character(Movement(), SwordCombat())
mage = Character(Movement(), MagicCombat())
paladin = Character(Movement(), SwordCombat(), Healing())
battle_mage = Character(Movement(), MagicCombat(), SwordCombat())
```

---

## Decision Matrix

| Question | Use This |
|----------|----------|
| IS-A relationship? | Inheritance |
| HAS-A relationship? | Composition |
| Need runtime flexibility? | Composition |
| Deep hierarchy (3+ levels)? | Composition |
| Multiple inheritance needed? | Composition |
| Just sharing code? | Composition |

---

## Practice Questions

<details>
<summary><strong>View Questions</strong></summary>

### Fill in the Gaps

1. The golden rule states: "Favor __________ over __________"
2. Inheritance represents a __________ relationship, while composition represents a __________ relationship.
3. Inheritance creates __________ coupling, while composition creates __________ coupling.
4. Composition allows changing behavior at __________, while inheritance is fixed at __________.
5. It's recommended to keep inheritance hierarchies __________ (maximum 2-3 levels).

<details>
<summary><strong>View Answers</strong></summary>

1. Composition, Inheritance
2. IS-A, HAS-A
3. tight (or strong), loose (or weak)
4. runtime, compile-time
5. shallow

</details>

### True/False

1. You should never use inheritance according to best practices.
2. Dog IS-A Animal is a good use case for inheritance.
3. Composition is more flexible than inheritance because you can change behavior at runtime.
4. Multiple inheritance problems can often be solved better with composition.
5. Inheritance is always faster than composition.
6. Stack IS-A ArrayList is a good inheritance relationship.

<details>
<summary><strong>View Answers</strong></summary>

1. False - Use inheritance for clear IS-A relationships with shallow hierarchies
2. True - This is a genuine IS-A relationship
3. True - Composition allows swapping components at runtime
4. True - Composition avoids diamond problem and complexity
5. False - Performance difference is negligible; flexibility matters more
6. False - This is a classic example of misusing inheritance for code reuse

</details>

### Multiple Choice Questions

1. Which is a good use case for inheritance?
   - A) Car HAS-AN Engine
   - B) Dog IS-A Animal
   - C) Stack HAS-A List
   - D) Player USES Weapon

2. What's the main problem with deep inheritance hierarchies?
   - A) They're too fast
   - B) They're fragile and hard to maintain
   - C) They use less memory
   - D) They're easier to test

3. Composition is preferred when:
   - A) You need an IS-A relationship
   - B) You want runtime flexibility
   - C) Hierarchy is stable
   - D) You have only 2 levels

<details>
<summary><strong>View Answers</strong></summary>

1. B) Dog IS-A Animal - Clear IS-A relationship
2. B) They're fragile and hard to maintain
3. B) You want runtime flexibility

</details>

### Code Challenge

Refactor this inheritance-based design to use composition:

```python
class Vehicle:
    def start_engine(self):
        return "Engine started"

class FlyingVehicle(Vehicle):
    def fly(self):
        return "Flying"

class WaterVehicle(Vehicle):
    def sail(self):
        return "Sailing"

# Problem: What if we need a flying water vehicle?
```

<details>
<summary><strong>View Solution</strong></summary>

```python
# Components
class Engine:
    def start(self):
        return "Engine started"

class FlightCapability:
    def fly(self):
        return "Flying"

class WaterCapability:
    def sail(self):
        return "Sailing"

class LandCapability:
    def drive(self):
        return "Driving"

# Compose vehicles
class Vehicle:
    def __init__(self, engine, *capabilities):
        self.engine = engine
        self.capabilities = capabilities
    
    def start(self):
        return self.engine.start()

# Create any combination!
airplane = Vehicle(Engine(), FlightCapability())
boat = Vehicle(Engine(), WaterCapability())
car = Vehicle(Engine(), LandCapability())
seaplane = Vehicle(Engine(), FlightCapability(), WaterCapability())

# Easy to add capabilities at runtime
amphibious_car = Vehicle(Engine(), LandCapability(), WaterCapability())
```

</details>

</details>

---

## Summary

### Key Takeaways

1. **Favor composition** - More flexible and maintainable
2. **Use inheritance** - Only for clear IS-A relationships
3. **Keep hierarchies shallow** - Maximum 2-3 levels
4. **Composition** - Better for HAS-A, runtime flexibility
5. **Test**: If you can't substitute child for parent, use composition

---

[← Back to DIP](../03-solid-principles/05-dip.md) | [Next: Dependency Injection →](02-dependency-injection.md) | [↑ Back to README](../README.md)