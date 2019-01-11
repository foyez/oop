# Object Oriented Programming

## What is OOP?
Object oriented programming is a method of programming that attempts to model some process or thing in the world as a **class** or **object**.

### Class
**Class:** - A blueprint for objects. Classes can contain methods (functions) and attributes (simmilar to keys in a dict).

### Instance
**Instance:** - Objects that are constructed from a class blueprint that contain their class's methods and properties.

#### Creating a Class

```py
# vehicle.py

class Vehicle:
  def __init__(self, make, model, year):
    self.make = make
    self.model = model
    self.year = year

# Classes in Python can have a special __init__ method, which gets called every time you create an instance of the class (instantiate).
```

## Why OOP?
With object oriented programming, the goal is to *encapsulate* your code into **logical, hierarchical groupings using classes** so that you can reason about your code at higher level.

## 4 fundamental concepts of OOP
1. Encapsulation
2. Abstraction
3. Inheritance
4. Polymorphism

## 1. Encapsulation
**Encapsulation** - the grouping of public and private attributes and methods into a programmatic class, making abstraction possible.

**Example:** 
* Let designing a Deck class, we make cards a private attribute (a list)
* The length of the cards should be accessed via a public method called count() --i.e. Deck.count()

## 2. Abstraction
**Abstraction:** - Exposing only "relevant" data in a class interface, hiding private attributes and methods (aka the "inner workings") from users.