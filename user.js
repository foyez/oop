class User {
  User.activeUsers = 0
  
  constructor(first, last, age) {
    this.first = first
    this.last = last
    this.age = age
    User.activeUsers += 1
  }

  static displayActiveUsers() {
    return `There are currently ${this.activeUsers} active users`
  }
}

const u1 = new User('Foyez', 'Ahmed', 27)
const u2 = new User('Foyez', 'Ahmed', 27)
console.log(User.displayActiveUsers())