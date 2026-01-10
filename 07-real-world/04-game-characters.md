# 7.4 Game Characters Design

[← Back to Logging System](03-logging-system.md) | [↑ Back to README](../README.md)

---

## System Overview

Design a **game character system** using composition over inheritance.

### Core Requirements

**Features:**
- Character attributes (health, mana, strength)
- Abilities system (attack, defend, cast spells)
- Equipment system
- Status effects
- Character classes (Warrior, Mage, Rogue)

---

## Implementation (Composition Pattern)

```python
from abc import ABC, abstractmethod
from typing import List

# Composition - Abilities as components
class Ability(ABC):
    def __init__(self, name, cooldown=0):
        self.name = name
        self.cooldown = cooldown
        self.current_cooldown = 0
    
    @abstractmethod
    def use(self, user, target):
        pass
    
    def is_ready(self):
        return self.current_cooldown == 0

class MeleeAttack(Ability):
    def __init__(self):
        super().__init__("Melee Attack")
    
    def use(self, user, target):
        damage = user.strength * 2
        target.take_damage(damage)
        return f"{user.name} attacks {target.name} for {damage} damage"

class Fireball(Ability):
    def __init__(self):
        super().__init__("Fireball", cooldown=3)
    
    def use(self, user, target):
        if user.mana < 20:
            return f"{user.name} doesn't have enough mana"
        
        user.mana -= 20
        damage = user.intelligence * 3
        target.take_damage(damage)
        self.current_cooldown = self.cooldown
        return f"{user.name} casts Fireball on {target.name} for {damage} damage"

class Heal(Ability):
    def __init__(self):
        super().__init__("Heal", cooldown=5)
    
    def use(self, user, target):
        if user.mana < 30:
            return f"{user.name} doesn't have enough mana"
        
        user.mana -= 30
        heal_amount = user.intelligence * 2
        target.heal(heal_amount)
        self.current_cooldown = self.cooldown
        return f"{user.name} heals {target.name} for {heal_amount} HP"

# Character class
class Character:
    def __init__(self, name, max_health=100, max_mana=50):
        self.name = name
        self.max_health = max_health
        self.health = max_health
        self.max_mana = max_mana
        self.mana = max_mana
        
        # Base attributes
        self.strength = 10
        self.intelligence = 10
        self.agility = 10
        
        # Composition - abilities
        self.abilities: List[Ability] = []
        
        # Equipment
        self.equipment = {}
    
    def add_ability(self, ability: Ability):
        self.abilities.append(ability)
    
    def use_ability(self, ability_index, target):
        if 0 <= ability_index < len(self.abilities):
            ability = self.abilities[ability_index]
            if ability.is_ready():
                return ability.use(self, target)
            return f"{ability.name} is on cooldown"
        return "Invalid ability"
    
    def take_damage(self, amount):
        self.health = max(0, self.health - amount)
        if self.health == 0:
            return f"{self.name} has been defeated!"
        return f"{self.name} has {self.health}/{self.max_health} HP"
    
    def heal(self, amount):
        self.health = min(self.max_health, self.health + amount)
        return f"{self.name} has {self.health}/{self.max_health} HP"
    
    def is_alive(self):
        return self.health > 0

# Character builder for different classes
class CharacterBuilder:
    @staticmethod
    def create_warrior(name):
        warrior = Character(name, max_health=150, max_mana=20)
        warrior.strength = 20
        warrior.intelligence = 5
        warrior.agility = 10
        
        warrior.add_ability(MeleeAttack())
        return warrior
    
    @staticmethod
    def create_mage(name):
        mage = Character(name, max_health=80, max_mana=100)
        mage.strength = 5
        mage.intelligence = 25
        mage.agility = 8
        
        mage.add_ability(Fireball())
        mage.add_ability(Heal())
        return mage
    
    @staticmethod
    def create_rogue(name):
        rogue = Character(name, max_health=90, max_mana=40)
        rogue.strength = 12
        rogue.intelligence = 10
        rogue.agility = 25
        
        rogue.add_ability(MeleeAttack())
        return rogue

# Usage
def main():
    warrior = CharacterBuilder.create_warrior("Conan")
    mage = CharacterBuilder.create_mage("Gandalf")
    
    print(f"Created {warrior.name} (Warrior)")
    print(f"Created {mage.name} (Mage)")
    
    # Combat
    print("\n=== Battle ===")
    print(warrior.use_ability(0, mage))  # Warrior attacks
    print(mage.use_ability(0, warrior))   # Mage casts fireball
    print(mage.use_ability(1, mage))      # Mage heals self

if __name__ == "__main__":
    main()
```

---

## Why Composition Over Inheritance

**❌ Inheritance approach:**
```python
class Character: pass
class Warrior(Character): pass
class Mage(Character): pass
class WarriorMage(Warrior, Mage): pass  # Diamond problem!
```

**✅ Composition approach:**
```python
warrior = Character("Conan")
warrior.add_ability(MeleeAttack())
warrior.add_ability(Fireball())  # Hybrid character!
```

---

[← Back to Logging System](03-logging-system.md) | [↑ Back to README](../README.md)