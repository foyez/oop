# Object Oriented Programming

## What is OOP?
Object oriented programming is a method of programming that attempts to model some process or thing in the world as a **class** or **object**.

### Class
**Class:** - A blueprint for objects. Classes can contain methods (functions) and attributes (simmilar to keys in a dict).

### Instance
**Instance:** - Objects that are constructed from a class blueprint that contain their class's methods and properties.

**Instantiating:** Creating an object that is an instance of a class is called instantiating a class.

#### Creating a Class

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

## 3. Inheritance
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

```js// Class syntax or syntactical sugar
// myPerson --> Person.prototype --> Object.prototype --> null

// Main Class or Supper Class
class Person {
  constructor(firstName, lastName, age, likes = []) {
    this.firstName = firstName
    this.lastName = lastName
    this.age = age
    this.likes = likes
  }

  // Instance Method
  getBio() {
    let bio = `${this.firstName} is ${this.age}.`
    this.likes.forEach(like => bio += ` he/she likes ${like}.`)
    return bio
  }

  set fullName(fullName) {
    const names = fullName.split(' ')
    this.firstName = names[0]
    this.lastName = names[1]
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`
  }

  // Class Method
  // Person.enrolledPerson()
  // Used to create utility functions
  static enrolledPerson() {
    return 'ENROLLING PERSONS!'
  }
}

// Subclass
class Employee extends Person {
  constructor(firstName, lastName, age, position, likes) {
    // need to use super() for using the properties of super class constructor
    super(firstName, lastName, age, likes)
    this.position = position
  }

  // Override on getBio()
  getBio() {
    return `${this.fullName} is a ${this.position}`
  }

  // subclass method
  getYearsLeft() {
    return 65 -this.age
  }
}

class Student extends Person {
  constructor(firstName, lastName, grade) {
    super(firstName, lastName)
    this.grade = grade
    this.tardies = 0
    this.scores = []
  }

  getBio() {
    const status =  (this.grade >= 70) ? 'passing' : 'failing'
    return `${this.firstName} is ${status} the class.`
  }

  updateGrade(change) {
    this.grade += change
  }

  markLate() {
    this.tardies += 1

    if(this.tardies >= 1) {
      return "YOU ARE EXPELLED!!!"
    }
    return `${this.firstName} ${this.lastName} has been late ${this.tardies} times`
  }

  addScore(score) {
    this.scores.push(score)
    return this.scores
  }
}

const jane = new Person('Foyez', 'Ahmed', 27)
console.log(Person.enrolledPerson())
```

## 4. Polymorphism
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
**1. The same class method works in a similar waay for different classes**
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
