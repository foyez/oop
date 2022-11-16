# Object Oriented Programming

## What is OOP?
Object oriented programming is a method of programming that attempts to model some process or thing in the world as a **class** or **object**.

## Class

<details>
<summary>View contents</summary>

**Class:** - A blueprint for objects. Classes can contain methods (functions) and attributes (simmilar to keys in a object or dict).

### Instance

**Instance:** - Objects that are constructed from a class blueprint that contain their class's methods and properties.

**Instantiating:** Creating an object that is an instance of a class is called instantiating a class.

### Creating a Class

**In Python:**

```py

# vehicle.py
# _name - private variable or private property or method
# __name - 

class Vehicle:
  def __init__(self, make, model, year):
    self.make = make
    self.model = model
    self.year = year

car = Vehicle('Audi', '45d', 2018)

```

`Classes in Python can have a special __init__ method, which gets called every time you create an instance of the class (instantiate). The self keyword refers to the current class instance.`

**In Javascript:**

```js

class Vehicle {
  constructor(make, model, year) {
    this.make = make
    this.model = model
    this.year = year
  }
}

car = new Vehicle('Audi', '45d', 2018)

```
  
</details>

## Why OOP?

With object oriented programming, the goal is to *encapsulate* your code into **logical, hierarchical groupings using classes** so that you can reason about your code at higher level.

## 4 fundamental concepts of OOP

1. Abstraction
2. Encapsulation
3. Inheritance
4. Polymorphism

## 1. Abstraction

<details>
<summary>View contents</summary>

**Abstraction:** - Abstraction captures the essential attributes and behavior based on the context, while ignores the irrelvent information.

For example, the essential attributes and behavior for a student from the perspective of academic:

Attributes: (Course Name, Grade, Student ID, etc.)
Behavior: (Studying, Doing Assignments, Attending Lectures, etc.)

But the hobby of a student or the favorite sports of a student is not important here.
  
</details>

## 2. Encapsulation

<details>
<summary>View contents</summary>

**Encapsulation** - Encapsulation means a sort capsule that contains something inside, some of which can be accessed from outside and some of which cannot. In programming, encapsulation means the practice of keeping fields within a class private, then providing access to those fields via public methods (e.g. getter and setter methods).

**Example:** 
* Let designing a Deck class, we make cards a private attribute (a list)
* The length of the cards should be accessed via a public method called count() --i.e. Deck.count()
  
</details>

## 3. Inheritance

<details>
<summary>View contents</summary>

**Inheritance:** A key feature of OOP is the ability to define a class which inherits from another class (a "base" or "parent" class).

**Example:**

**In Python:**

```py
class User:
    active_users = 0

    def __init__(self, first_name: str, last_name: str, age: int = 18):
        self._first_name = first_name  # instance variable
        self._last_name = last_name  # instance variable
        self.__age = age

    def __repr__(self):
        return f"{self._first_name} is {self.__age}."
        
    # def __str__(self):
    #     return f"{self._first_name} is {self.__age}."

    @property
    def full_name(self):
        return f"{self._first_name} {self._last_name}"

    @full_name.setter
    def full_name(self, name):
        self._first_name, self._last_name = name.split(' ')

    @classmethod
    def display_active_users(cls):
        return f"There are currently {cls.active_users} active users"

    def description(self):
        return f"{self._first_name} is a general user."

    def birthday(self):
        self.__age += 1
        return f"Happy {self.__age}th, {self._first_name}"

    def login(self):
        User.active_users += 1

    def logout(self):
        User.active_users -= 1
        return f"{self._first_name} has logged out"


class Moderator(User):
    def __init__(self, first_name, last_name, community):
        super().__init__(first_name, last_name)
        self.__community = community

    # override method
    def description(self):
        return f"{self._first_name} is a moderator."

    def remove_post(self):
        return f"{self.full_name} removed a post from the {self.__community} community"


generalUser = User('Foyez', 'Ahmed')
moderator = Moderator('Sohel', 'Mahmud', 'cricket')

print(generalUser)

print(generalUser.__dict__)
print(moderator.__dict__)
print()

print(generalUser.full_name)

generalUser.full_name = 'Manam Ahmed'
print(generalUser.full_name)
print()

print(generalUser.description())
print(moderator.description())
print()

generalUser.login()
print(User.display_active_users())

print(moderator.remove_post())
```

**In Javascript:**

```js
// Class syntax or syntactical sugar
// myPerson --> Person.prototype --> Object.prototype --> null

const activeUsers = Symbol('activeUsers')

class User {
  constructor(firstName, lastName, age = 18) {
    User[activeUsers] = 0
    this._firstName = firstName // instance variable
    this._lastName = lastName
    this._age = age
  }

  get fullName() {
    return `${this._firstName} ${this._lastName}`
  }

  set fullName(name) {
    ;[this._firstName, this._lastName] = name.split(' ')
  }

  static display_active_users() {
    return `There are currently ${User[activeUsers]} active users`
  }

  description() {
    return `${this._firstName} is a general user.`
  }

  birthday() {
    this._age += 1
    return `Happy ${this._age}th, ${this._firstName}`
  }

  login() {
    User[activeUsers] += 1
  }

  logout() {
    User[activeUsers] -= 1
    return `${this._firstName} has logged out`
  }
}

class Moderator extends User {
  // js isn't strict about arity
  constructor(firstName, community) {
    super(firstName)
    this._community = community
  }

  // override method
  description() {
    return `${this._firstName} is a moderator.`
  }

  remove_post() {
    return `${this.fullName} removed a post from the ${this._community} community`
  }
}

generalUser = new User('Foyez', 'Ahmed', 20)
moderator = new Moderator('Sohel', 'cricket')

console.log(generalUser.fullName)

generalUser.fullName = 'Manam Ahmed'
console.log(generalUser.fullName)
console.log()

console.log(generalUser.description())
console.log(moderator.description())
console.log()

console.log(generalUser.birthday())
console.log(moderator.birthday())
console.log()

generalUser.login()
console.log(User.display_active_users())

console.log(moderator.remove_post())
```

</details>

## 4. Polymorphism

<details>
<summary>View contents</summary>

**Polymorphism:** A key principle in OOP is the idea of polymorphism - an object can take on many (poly) forms (morph).

**Example 1: The same class method works in a similar way for different classes**
```py
Cat.speak() # meow
Dog.speak() # woof
Human.speak() # yo
```

**Example 2: The operation works for different kinds of objects**
```py
sample_list = [1, 2, 3]
sample_tuple = (1, 2, 3)
sample_string = 'awesome'

len(sample_list)
len(sample_tuple)
len(sample_string)
```

## Polymorphism & Inheritance

**1. The same class method works in a similar way for different classes**
A common implementation of this is to have a method in a base (or parent) class that is overriden by a subclass. This is called method **overridening**.

* Each subclass will have a different implementation of the method.
* If the method is not implemented in the subclass, the version in the parent class is called instead.

```py
class Animal():
  def speak(self):
    raise NotImplementedError('Subclass needs to implement this method')

class Dog(Animal):
  def speak(self):
    return 'woof'

class Cat(Animal):
  def speak(self):
    return 'meow'

class Fish(Animal):
  pass

d = Dog()
print(d.speak())

f = Fish()
print(f.speak())
```

**2. (Polymorphism) The same operation works for different kinds of objects**

```py
8 + 2 # 10
'8' + '2' # 82
```
  
</details>

## References

1. [What Are OOP Concepts?](https://stackify.com/oops-concepts-in-java/)
