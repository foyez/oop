// Class syntax or syntactical sugar
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
  // Persont.enrolledPerson()
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

// Person - Super Class
// Creating objects or instances from classes
const myPerson = new Person('Farah', 'Islam', 12, ['Teaching', 'Biking'])
// console.log(myPerson)
console.log(myPerson.getBio())
// myPerson.setName('Zayan Ahmed')
// console.log(myPerson)

// Employee - Subclass
const employee = new Employee('Foyez', 'Ahmed', 26, 'Cricketer', ['Teaching', 'Biking'])
// console.log(employee)
console.log(employee.getBio()) // Employee's getBio()
employee.fullName = 'Zayan Ahmed' // Person's setName()
console.log(employee.getBio()) // Employee's getBio()
console.log(employee.getYearsLeft()) 

// Student - Subclass
const student = new Student('Rafeh', 'Siddique', 15, 80)
console.log(student.getBio())
student.updateGrade(-20)
console.log(student.getBio())