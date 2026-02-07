# Chapter 4: Object Relationships

Understanding how objects relate to each other is crucial for designing well-structured systems. This chapter covers the different ways objects can interact and be composed.

---

## Table of Content

- [1. Association](#1-association)
- [2. Aggregation](#2-aggregation)
- [3. Composition](#3-composition)
- [4. Composition vs Inheritance](#4-composition-vs-inheritance)

---

## 1. Association

**Association** represents a relationship where objects are aware of each other and can interact, but neither object owns the other. It's the most general form of relationship.

**Real-world analogy:** A teacher and a student have an association. The teacher teaches students, and students learn from teachers, but neither owns the other. They exist independently - a teacher can exist without students and vice versa.

### Characteristics:

- **Independent lifecycles**: Objects can exist without each other
- **Bi-directional or uni-directional**: Can be one-way or two-way relationships
- **Loose coupling**: Objects are aware of each other but not tightly bound
- **"Uses-a" or "Knows-about" relationship**

### Types of Association:

1. **One-to-One**: One object associated with exactly one other object
2. **One-to-Many**: One object associated with multiple objects
3. **Many-to-Many**: Multiple objects associated with multiple other objects

<details>
<summary><strong>View Examples</strong></summary>

```typescript
// TypeScript - Association Examples

// ============================================
// Example 1: Doctor-Patient Association (Many-to-Many)
// ============================================

class Patient {
  private doctors: Set<Doctor> = new Set();

  constructor(
    public patientId: string,
    public name: string,
    public medicalHistory: string[]
  ) {}

  assignDoctor(doctor: Doctor): void {
    this.doctors.add(doctor);
    doctor.addPatient(this); // Bi-directional
    console.log(`Patient ${this.name} assigned to Dr. ${doctor.name}`);
  }

  removeDoctor(doctor: Doctor): void {
    this.doctors.delete(doctor);
    doctor.removePatient(this);
    console.log(`Patient ${this.name} removed from Dr. ${doctor.name}`);
  }

  getDoctors(): Doctor[] {
    return Array.from(this.doctors);
  }

  getPatientInfo(): string {
    const doctorNames = Array.from(this.doctors).map(d => d.name).join(", ");
    return `${this.name} (ID: ${this.patientId}) - Doctors: ${doctorNames || "None"}`;
  }
}

class Doctor {
  private patients: Set<Patient> = new Set();

  constructor(
    public doctorId: string,
    public name: string,
    public specialization: string
  ) {}

  addPatient(patient: Patient): void {
    this.patients.add(patient);
  }

  removePatient(patient: Patient): void {
    this.patients.delete(patient);
  }

  getPatients(): Patient[] {
    return Array.from(this.patients);
  }

  getDoctorInfo(): string {
    return `Dr. ${this.name} (${this.specialization}) - ${this.patients.size} patients`;
  }

  consultPatient(patient: Patient, diagnosis: string): void {
    if (this.patients.has(patient)) {
      console.log(`Dr. ${this.name} consulting ${patient.name}: ${diagnosis}`);
      patient.medicalHistory.push(`${new Date().toISOString()}: ${diagnosis} - Dr. ${this.name}`);
    } else {
      console.log(`${patient.name} is not a patient of Dr. ${this.name}`);
    }
  }
}

// Usage
console.log("=== Doctor-Patient Association ===");
const doctor1 = new Doctor("D001", "Smith", "Cardiology");
const doctor2 = new Doctor("D002", "Johnson", "Neurology");

const patient1 = new Patient("P001", "Alice", []);
const patient2 = new Patient("P002", "Bob", []);

// Create associations
patient1.assignDoctor(doctor1);
patient1.assignDoctor(doctor2); // Patient can have multiple doctors
patient2.assignDoctor(doctor1);

console.log("\n" + doctor1.getDoctorInfo());
console.log(doctor2.getDoctorInfo());
console.log(patient1.getPatientInfo());

doctor1.consultPatient(patient1, "Regular checkup - heart healthy");
doctor2.consultPatient(patient1, "Neurological assessment - all normal");

console.log(`\nAlice's Medical History:`);
patient1.medicalHistory.forEach(entry => console.log(`  ${entry}`));

// ============================================
// Example 2: Library-Member Association (One-to-Many)
// ============================================

class LibraryMember {
  private borrowedBooks: Book[] = [];

  constructor(
    public memberId: string,
    public name: string,
    public membershipType: "regular" | "premium"
  ) {}

  borrowBook(book: Book): boolean {
    const maxBooks = this.membershipType === "premium" ? 10 : 5;
    
    if (this.borrowedBooks.length >= maxBooks) {
      console.log(`${this.name} has reached borrowing limit (${maxBooks} books)`);
      return false;
    }

    if (book.borrow(this)) {
      this.borrowedBooks.push(book);
      return true;
    }
    return false;
  }

  returnBook(book: Book): void {
    const index = this.borrowedBooks.indexOf(book);
    if (index > -1) {
      this.borrowedBooks.splice(index, 1);
      book.returnBook();
      console.log(`${this.name} returned "${book.title}"`);
    }
  }

  getBorrowedBooks(): Book[] {
    return [...this.borrowedBooks];
  }

  getMemberInfo(): string {
    return `${this.name} (${this.membershipType}) - ${this.borrowedBooks.length} books borrowed`;
  }
}

class Book {
  private currentBorrower: LibraryMember | null = null;
  private borrowHistory: Array<{ member: string; date: Date }> = [];

  constructor(
    public bookId: string,
    public title: string,
    public author: string,
    public isbn: string
  ) {}

  borrow(member: LibraryMember): boolean {
    if (this.currentBorrower) {
      console.log(`"${this.title}" is already borrowed by ${this.currentBorrower.name}`);
      return false;
    }

    this.currentBorrower = member;
    this.borrowHistory.push({ member: member.name, date: new Date() });
    console.log(`${member.name} borrowed "${this.title}"`);
    return true;
  }

  returnBook(): void {
    this.currentBorrower = null;
  }

  isAvailable(): boolean {
    return this.currentBorrower === null;
  }

  getBookInfo(): string {
    const status = this.isAvailable() 
      ? "Available" 
      : `Borrowed by ${this.currentBorrower!.name}`;
    return `"${this.title}" by ${this.author} - ${status}`;
  }

  getBorrowHistory(): string[] {
    return this.borrowHistory.map(entry => 
      `${entry.date.toLocaleDateString()}: ${entry.member}`
    );
  }
}

// Usage
console.log("\n=== Library-Member Association ===");
const member1 = new LibraryMember("M001", "Charlie", "premium");
const member2 = new LibraryMember("M002", "Diana", "regular");

const book1 = new Book("B001", "Clean Code", "Robert Martin", "978-0132350884");
const book2 = new Book("B002", "Design Patterns", "Gang of Four", "978-0201633612");
const book3 = new Book("B003", "Refactoring", "Martin Fowler", "978-0134757599");

member1.borrowBook(book1);
member1.borrowBook(book2);
member2.borrowBook(book3);

console.log("\n" + member1.getMemberInfo());
console.log(member2.getMemberInfo());

console.log("\n" + book1.getBookInfo());
console.log(book2.getBookInfo());

member1.returnBook(book1);
member2.borrowBook(book1); // Now Diana can borrow it

console.log("\nBorrow history for Clean Code:");
book1.getBorrowHistory().forEach(entry => console.log(`  ${entry}`));

// ============================================
// Example 3: Uni-directional Association (Student-Course)
// ============================================

class Course {
  constructor(
    public courseId: string,
    public courseName: string,
    public credits: number,
    public instructor: string
  ) {}

  getCourseInfo(): string {
    return `${this.courseName} (${this.credits} credits) - ${this.instructor}`;
  }
}

class Student {
  private enrolledCourses: Course[] = [];

  constructor(
    public studentId: string,
    public name: string,
    public major: string
  ) {}

  enrollInCourse(course: Course): void {
    if (!this.enrolledCourses.includes(course)) {
      this.enrolledCourses.push(course);
      console.log(`${this.name} enrolled in ${course.courseName}`);
    } else {
      console.log(`${this.name} is already enrolled in ${course.courseName}`);
    }
  }

  dropCourse(course: Course): void {
    const index = this.enrolledCourses.indexOf(course);
    if (index > -1) {
      this.enrolledCourses.splice(index, 1);
      console.log(`${this.name} dropped ${course.courseName}`);
    }
  }

  getCourses(): Course[] {
    return [...this.enrolledCourses];
  }

  getTotalCredits(): number {
    return this.enrolledCourses.reduce((sum, course) => sum + course.credits, 0);
  }

  getStudentInfo(): string {
    return `${this.name} (${this.major}) - ${this.enrolledCourses.length} courses, ${this.getTotalCredits()} credits`;
  }
}

// Usage
console.log("\n=== Student-Course Association (Uni-directional) ===");
const course1 = new Course("CS101", "Intro to Programming", 3, "Prof. Anderson");
const course2 = new Course("CS201", "Data Structures", 4, "Prof. Baker");
const course3 = new Course("MATH101", "Calculus I", 4, "Prof. Chen");

const student = new Student("S001", "Eve", "Computer Science");

student.enrollInCourse(course1);
student.enrollInCourse(course2);
student.enrollInCourse(course3);

console.log("\n" + student.getStudentInfo());
console.log("\nEnrolled courses:");
student.getCourses().forEach(course => {
  console.log(`  - ${course.getCourseInfo()}`);
});

student.dropCourse(course3);
console.log("\n" + student.getStudentInfo());
```

```python
# Python - Association Examples

from typing import Set, List, Optional
from datetime import datetime

# ============================================
# Example 1: Doctor-Patient Association (Many-to-Many)
# ============================================

class Patient:
    def __init__(self, patient_id: str, name: str, medical_history: List[str] = None):
        self.patient_id = patient_id
        self.name = name
        self.medical_history = medical_history or []
        self._doctors: Set['Doctor'] = set()
    
    def assign_doctor(self, doctor: 'Doctor') -> None:
        self._doctors.add(doctor)
        doctor.add_patient(self)
        print(f"Patient {self.name} assigned to Dr. {doctor.name}")
    
    def remove_doctor(self, doctor: 'Doctor') -> None:
        self._doctors.discard(doctor)
        doctor.remove_patient(self)
        print(f"Patient {self.name} removed from Dr. {doctor.name}")
    
    def get_doctors(self) -> List['Doctor']:
        return list(self._doctors)
    
    def get_patient_info(self) -> str:
        doctor_names = ", ".join(d.name for d in self._doctors) or "None"
        return f"{self.name} (ID: {self.patient_id}) - Doctors: {doctor_names}"

class Doctor:
    def __init__(self, doctor_id: str, name: str, specialization: str):
        self.doctor_id = doctor_id
        self.name = name
        self.specialization = specialization
        self._patients: Set[Patient] = set()
    
    def add_patient(self, patient: Patient) -> None:
        self._patients.add(patient)
    
    def remove_patient(self, patient: Patient) -> None:
        self._patients.discard(patient)
    
    def get_patients(self) -> List[Patient]:
        return list(self._patients)
    
    def get_doctor_info(self) -> str:
        return f"Dr. {self.name} ({self.specialization}) - {len(self._patients)} patients"
    
    def consult_patient(self, patient: Patient, diagnosis: str) -> None:
        if patient in self._patients:
            print(f"Dr. {self.name} consulting {patient.name}: {diagnosis}")
            entry = f"{datetime.now().isoformat()}: {diagnosis} - Dr. {self.name}"
            patient.medical_history.append(entry)
        else:
            print(f"{patient.name} is not a patient of Dr. {self.name}")

# Usage
print("=== Doctor-Patient Association ===")
doctor1 = Doctor("D001", "Smith", "Cardiology")
doctor2 = Doctor("D002", "Johnson", "Neurology")

patient1 = Patient("P001", "Alice", [])
patient2 = Patient("P002", "Bob", [])

patient1.assign_doctor(doctor1)
patient1.assign_doctor(doctor2)
patient2.assign_doctor(doctor1)

print(f"\n{doctor1.get_doctor_info()}")
print(doctor2.get_doctor_info())
print(patient1.get_patient_info())

doctor1.consult_patient(patient1, "Regular checkup - heart healthy")
doctor2.consult_patient(patient1, "Neurological assessment - all normal")

print("\nAlice's Medical History:")
for entry in patient1.medical_history:
    print(f"  {entry}")

# ============================================
# Example 2: Library-Member Association
# ============================================

class LibraryMember:
    def __init__(self, member_id: str, name: str, membership_type: str):
        self.member_id = member_id
        self.name = name
        self.membership_type = membership_type  # "regular" or "premium"
        self._borrowed_books: List['Book'] = []
    
    def borrow_book(self, book: 'Book') -> bool:
        max_books = 10 if self.membership_type == "premium" else 5
        
        if len(self._borrowed_books) >= max_books:
            print(f"{self.name} has reached borrowing limit ({max_books} books)")
            return False
        
        if book.borrow(self):
            self._borrowed_books.append(book)
            return True
        return False
    
    def return_book(self, book: 'Book') -> None:
        if book in self._borrowed_books:
            self._borrowed_books.remove(book)
            book.return_book()
            print(f'{self.name} returned "{book.title}"')
    
    def get_borrowed_books(self) -> List['Book']:
        return self._borrowed_books.copy()
    
    def get_member_info(self) -> str:
        return f"{self.name} ({self.membership_type}) - {len(self._borrowed_books)} books borrowed"

class Book:
    def __init__(self, book_id: str, title: str, author: str, isbn: str):
        self.book_id = book_id
        self.title = title
        self.author = author
        self.isbn = isbn
        self._current_borrower: Optional[LibraryMember] = None
        self._borrow_history: List[dict] = []
    
    def borrow(self, member: LibraryMember) -> bool:
        if self._current_borrower:
            print(f'"{self.title}" is already borrowed by {self._current_borrower.name}')
            return False
        
        self._current_borrower = member
        self._borrow_history.append({'member': member.name, 'date': datetime.now()})
        print(f'{member.name} borrowed "{self.title}"')
        return True
    
    def return_book(self) -> None:
        self._current_borrower = None
    
    def is_available(self) -> bool:
        return self._current_borrower is None
    
    def get_book_info(self) -> str:
        status = "Available" if self.is_available() else f"Borrowed by {self._current_borrower.name}"
        return f'"{self.title}" by {self.author} - {status}'
    
    def get_borrow_history(self) -> List[str]:
        return [
            f"{entry['date'].strftime('%Y-%m-%d')}: {entry['member']}"
            for entry in self._borrow_history
        ]

# Usage
print("\n=== Library-Member Association ===")
member1 = LibraryMember("M001", "Charlie", "premium")
member2 = LibraryMember("M002", "Diana", "regular")

book1 = Book("B001", "Clean Code", "Robert Martin", "978-0132350884")
book2 = Book("B002", "Design Patterns", "Gang of Four", "978-0201633612")
book3 = Book("B003", "Refactoring", "Martin Fowler", "978-0134757599")

member1.borrow_book(book1)
member1.borrow_book(book2)
member2.borrow_book(book3)

print(f"\n{member1.get_member_info()}")
print(member2.get_member_info())

print(f"\n{book1.get_book_info()}")
print(book2.get_book_info())

member1.return_book(book1)
member2.borrow_book(book1)

print("\nBorrow history for Clean Code:")
for entry in book1.get_borrow_history():
    print(f"  {entry}")

# ============================================
# Example 3: Uni-directional Association
# ============================================

class Course:
    def __init__(self, course_id: str, course_name: str, credits: int, instructor: str):
        self.course_id = course_id
        self.course_name = course_name
        self.credits = credits
        self.instructor = instructor
    
    def get_course_info(self) -> str:
        return f"{self.course_name} ({self.credits} credits) - {self.instructor}"

class Student:
    def __init__(self, student_id: str, name: str, major: str):
        self.student_id = student_id
        self.name = name
        self.major = major
        self._enrolled_courses: List[Course] = []
    
    def enroll_in_course(self, course: Course) -> None:
        if course not in self._enrolled_courses:
            self._enrolled_courses.append(course)
            print(f"{self.name} enrolled in {course.course_name}")
        else:
            print(f"{self.name} is already enrolled in {course.course_name}")
    
    def drop_course(self, course: Course) -> None:
        if course in self._enrolled_courses:
            self._enrolled_courses.remove(course)
            print(f"{self.name} dropped {course.course_name}")
    
    def get_courses(self) -> List[Course]:
        return self._enrolled_courses.copy()
    
    def get_total_credits(self) -> int:
        return sum(course.credits for course in self._enrolled_courses)
    
    def get_student_info(self) -> str:
        return f"{self.name} ({self.major}) - {len(self._enrolled_courses)} courses, {self.get_total_credits()} credits"

# Usage
print("\n=== Student-Course Association (Uni-directional) ===")
course1 = Course("CS101", "Intro to Programming", 3, "Prof. Anderson")
course2 = Course("CS201", "Data Structures", 4, "Prof. Baker")
course3 = Course("MATH101", "Calculus I", 4, "Prof. Chen")

student = Student("S001", "Eve", "Computer Science")

student.enroll_in_course(course1)
student.enroll_in_course(course2)
student.enroll_in_course(course3)

print(f"\n{student.get_student_info()}")
print("\nEnrolled courses:")
for course in student.get_courses():
    print(f"  - {course.get_course_info()}")

student.drop_course(course3)
print(f"\n{student.get_student_info()}")
```

</details>

---

## 2. Aggregation

**Aggregation** is a specialized form of association representing a "has-a" relationship where the contained object can exist independently of the container. It's a **weak ownership** relationship.

**Real-world analogy:** A department has employees. The department is an aggregation of employees, but employees can exist without the department. If the department is dissolved, the employees continue to exist - they might join other departments or leave the company.

### Characteristics:

- **"Has-a" relationship** with weak ownership
- **Independent lifecycle**: Child can exist without parent
- **Shared ownership possible**: Child can belong to multiple parents
- **Represented by hollow diamond** in UML diagrams

### Aggregation vs Association:

- **Association**: General relationship (uses, knows about)
- **Aggregation**: Specific "has-a" relationship with container/contained dynamic

<details>
<summary><strong>View Examples</strong></summary>

```typescript
// TypeScript - Aggregation Examples

// ============================================
// Example 1: Department-Employee Aggregation
// ============================================

class Employee {
  constructor(
    public employeeId: string,
    public name: string,
    public position: string,
    public salary: number
  ) {}

  getEmployeeInfo(): string {
    return `${this.name} - ${this.position} ($${this.salary})`;
  }

  work(): void {
    console.log(`${this.name} is working on ${this.position} tasks`);
  }
}

class Department {
  private employees: Employee[] = [];

  constructor(
    public departmentId: string,
    public departmentName: string,
    public budget: number
  ) {}

  // Add existing employee to department
  addEmployee(employee: Employee): void {
    if (!this.employees.includes(employee)) {
      this.employees.push(employee);
      console.log(`${employee.name} added to ${this.departmentName}`);
    }
  }

  removeEmployee(employee: Employee): void {
    const index = this.employees.indexOf(employee);
    if (index > -1) {
      this.employees.splice(index, 1);
      console.log(`${employee.name} removed from ${this.departmentName}`);
      // Employee still exists, just not in this department
    }
  }

  getEmployees(): Employee[] {
    return [...this.employees];
  }

  getDepartmentInfo(): string {
    const totalSalaries = this.employees.reduce((sum, emp) => sum + emp.salary, 0);
    return `${this.departmentName} - ${this.employees.length} employees, Total salaries: $${totalSalaries}`;
  }

  calculateUtilization(): number {
    const totalSalaries = this.employees.reduce((sum, emp) => sum + emp.salary, 0);
    return (totalSalaries / this.budget) * 100;
  }
}

// Usage
console.log("=== Department-Employee Aggregation ===");

// Employees exist independently
const emp1 = new Employee("E001", "Alice Johnson", "Software Engineer", 95000);
const emp2 = new Employee("E002", "Bob Smith", "Product Manager", 110000);
const emp3 = new Employee("E003", "Charlie Brown", "Designer", 85000);

// Departments aggregate employees
const engineering = new Department("D001", "Engineering", 500000);
const product = new Department("D002", "Product", 300000);

engineering.addEmployee(emp1);
engineering.addEmployee(emp3);
product.addEmployee(emp2);

console.log("\n" + engineering.getDepartmentInfo());
console.log(product.getDepartmentInfo());

// Employee can move to another department (independent lifecycle)
engineering.removeEmployee(emp3);
product.addEmployee(emp3);

console.log("\n" + engineering.getDepartmentInfo());
console.log(product.getDepartmentInfo());

// If department is deleted, employees still exist
const engineeringEmployees = engineering.getEmployees();
// delete engineering; // Department gone
// emp1, emp3 still exist and can join other departments

// ============================================
// Example 2: Team-Player Aggregation (Sports)
// ============================================

class Player {
  constructor(
    public playerId: string,
    public name: string,
    public position: string,
    public jerseyNumber: number
  ) {}

  getPlayerInfo(): string {
    return `#${this.jerseyNumber} ${this.name} (${this.position})`;
  }

  play(): void {
    console.log(`${this.name} is playing ${this.position}`);
  }
}

class Team {
  private players: Set<Player> = new Set();
  private captain: Player | null = null;

  constructor(
    public teamId: string,
    public teamName: string,
    public sport: string
  ) {}

  addPlayer(player: Player): boolean {
    if (this.players.size >= 11) { // Soccer team limit
      console.log(`${this.teamName} roster is full`);
      return false;
    }

    this.players.add(player);
    console.log(`${player.name} joined ${this.teamName}`);
    return true;
  }

  removePlayer(player: Player): void {
    this.players.delete(player);
    if (this.captain === player) {
      this.captain = null;
    }
    console.log(`${player.name} left ${this.teamName}`);
    // Player still exists, can join another team
  }

  setCaptain(player: Player): boolean {
    if (this.players.has(player)) {
      this.captain = player;
      console.log(`${player.name} is now captain of ${this.teamName}`);
      return true;
    }
    console.log(`${player.name} is not on the team`);
    return false;
  }

  getPlayers(): Player[] {
    return Array.from(this.players);
  }

  getTeamInfo(): string {
    const captainInfo = this.captain ? ` - Captain: ${this.captain.name}` : "";
    return `${this.teamName} (${this.sport}) - ${this.players.size} players${captainInfo}`;
  }

  getRoster(): void {
    console.log(`\n${this.teamName} Roster:`);
    this.players.forEach(player => {
      const isCaptain = player === this.captain ? " (C)" : "";
      console.log(`  ${player.getPlayerInfo()}${isCaptain}`);
    });
  }
}

// Usage
console.log("\n=== Team-Player Aggregation ===");

// Players exist independently
const player1 = new Player("P001", "Lionel Messi", "Forward", 10);
const player2 = new Player("P002", "Cristiano Ronaldo", "Forward", 7);
const player3 = new Player("P003", "Sergio Ramos", "Defender", 4);

// Teams aggregate players
const teamA = new Team("T001", "Barcelona", "Soccer");
const teamB = new Team("T002", "Real Madrid", "Soccer");

teamA.addPlayer(player1);
teamA.addPlayer(player3);
teamA.setCaptain(player1);

teamB.addPlayer(player2);

console.log("\n" + teamA.getTeamInfo());
console.log(teamB.getTeamInfo());

teamA.getRoster();

// Player can transfer teams
teamA.removePlayer(player3);
teamB.addPlayer(player3);

console.log("\nAfter transfer:");
console.log(teamA.getTeamInfo());
console.log(teamB.getTeamInfo());

// ============================================
// Example 3: Playlist-Song Aggregation
// ============================================

class Song {
  constructor(
    public songId: string,
    public title: string,
    public artist: string,
    public duration: number, // in seconds
    public genre: string
  ) {}

  getSongInfo(): string {
    const minutes = Math.floor(this.duration / 60);
    const seconds = this.duration % 60;
    return `"${this.title}" by ${this.artist} (${minutes}:${seconds.toString().padStart(2, '0')})`;
  }

  play(): void {
    console.log(`♪ Now playing: ${this.title} by ${this.artist}`);
  }
}

class Playlist {
  private songs: Song[] = [];

  constructor(
    public playlistId: string,
    public name: string,
    public creator: string
  ) {}

  addSong(song: Song, position?: number): void {
    if (position !== undefined && position >= 0 && position <= this.songs.length) {
      this.songs.splice(position, 0, song);
      console.log(`Added "${song.title}" to ${this.name} at position ${position + 1}`);
    } else {
      this.songs.push(song);
      console.log(`Added "${song.title}" to ${this.name}`);
    }
  }

  removeSong(song: Song): void {
    const index = this.songs.indexOf(song);
    if (index > -1) {
      this.songs.splice(index, 1);
      console.log(`Removed "${song.title}" from ${this.name}`);
    }
  }

  getSongs(): Song[] {
    return [...this.songs];
  }

  getTotalDuration(): number {
    return this.songs.reduce((total, song) => total + song.duration, 0);
  }

  getPlaylistInfo(): string {
    const totalSeconds = this.getTotalDuration();
    const minutes = Math.floor(totalSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    return `"${this.name}" by ${this.creator} - ${this.songs.length} songs, ${hours}h ${remainingMinutes}m`;
  }

  shuffle(): void {
    for (let i = this.songs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.songs[i], this.songs[j]] = [this.songs[j], this.songs[i]];
    }
    console.log(`Shuffled ${this.name}`);
  }

  displayPlaylist(): void {
    console.log(`\nPlaylist: ${this.name}`);
    this.songs.forEach((song, index) => {
      console.log(`  ${index + 1}. ${song.getSongInfo()}`);
    });
    console.log(`Total: ${this.getPlaylistInfo()}`);
  }
}

// Usage
console.log("\n=== Playlist-Song Aggregation ===");

// Songs exist independently
const song1 = new Song("S001", "Bohemian Rhapsody", "Queen", 354, "Rock");
const song2 = new Song("S002", "Imagine", "John Lennon", 183, "Pop");
const song3 = new Song("S003", "Billie Jean", "Michael Jackson", 294, "Pop");
const song4 = new Song("S004", "Smells Like Teen Spirit", "Nirvana", 301, "Rock");

// Playlists aggregate songs (same song can be in multiple playlists)
const rockPlaylist = new Playlist("PL001", "Classic Rock Hits", "MusicFan123");
const partyMix = new Playlist("PL002", "Party Mix 2024", "DJ_Cool");

rockPlaylist.addSong(song1);
rockPlaylist.addSong(song4);

partyMix.addSong(song2);
partyMix.addSong(song3);
partyMix.addSong(song1); // Same song in different playlist

console.log("\n" + rockPlaylist.getPlaylistInfo());
console.log(partyMix.getPlaylistInfo());

rockPlaylist.displayPlaylist();
partyMix.displayPlaylist();

// Song can be removed from one playlist but still exist in others
partyMix.removeSong(song1);
console.log("\nAfter removing Bohemian Rhapsody from Party Mix:");
console.log(rockPlaylist.getPlaylistInfo()); // Still has the song
console.log(partyMix.getPlaylistInfo());
```

```python
# Python - Aggregation Examples

from typing import List, Set, Optional

# ============================================
# Example 1: Department-Employee Aggregation
# ============================================

class Employee:
    def __init__(self, employee_id: str, name: str, position: str, salary: float):
        self.employee_id = employee_id
        self.name = name
        self.position = position
        self.salary = salary
    
    def get_employee_info(self) -> str:
        return f"{self.name} - {self.position} (${self.salary})"
    
    def work(self) -> None:
        print(f"{self.name} is working on {self.position} tasks")

class Department:
    def __init__(self, department_id: str, department_name: str, budget: float):
        self.department_id = department_id
        self.department_name = department_name
        self.budget = budget
        self._employees: List[Employee] = []
    
    def add_employee(self, employee: Employee) -> None:
        if employee not in self._employees:
            self._employees.append(employee)
            print(f"{employee.name} added to {self.department_name}")
    
    def remove_employee(self, employee: Employee) -> None:
        if employee in self._employees:
            self._employees.remove(employee)
            print(f"{employee.name} removed from {self.department_name}")
    
    def get_employees(self) -> List[Employee]:
        return self._employees.copy()
    
    def get_department_info(self) -> str:
        total_salaries = sum(emp.salary for emp in self._employees)
        return f"{self.department_name} - {len(self._employees)} employees, Total salaries: ${total_salaries}"
    
    def calculate_utilization(self) -> float:
        total_salaries = sum(emp.salary for emp in self._employees)
        return (total_salaries / self.budget) * 100

# Usage
print("=== Department-Employee Aggregation ===")

emp1 = Employee("E001", "Alice Johnson", "Software Engineer", 95000)
emp2 = Employee("E002", "Bob Smith", "Product Manager", 110000)
emp3 = Employee("E003", "Charlie Brown", "Designer", 85000)

engineering = Department("D001", "Engineering", 500000)
product = Department("D002", "Product", 300000)

engineering.add_employee(emp1)
engineering.add_employee(emp3)
product.add_employee(emp2)

print(f"\n{engineering.get_department_info()}")
print(product.get_department_info())

engineering.remove_employee(emp3)
product.add_employee(emp3)

print(f"\n{engineering.get_department_info()}")
print(product.get_department_info())

# ============================================
# Example 2: Team-Player Aggregation
# ============================================

class Player:
    def __init__(self, player_id: str, name: str, position: str, jersey_number: int):
        self.player_id = player_id
        self.name = name
        self.position = position
        self.jersey_number = jersey_number
    
    def get_player_info(self) -> str:
        return f"#{self.jersey_number} {self.name} ({self.position})"
    
    def play(self) -> None:
        print(f"{self.name} is playing {self.position}")

class Team:
    def __init__(self, team_id: str, team_name: str, sport: str):
        self.team_id = team_id
        self.team_name = team_name
        self.sport = sport
        self._players: Set[Player] = set()
        self._captain: Optional[Player] = None
    
    def add_player(self, player: Player) -> bool:
        if len(self._players) >= 11:
            print(f"{self.team_name} roster is full")
            return False
        
        self._players.add(player)
        print(f"{player.name} joined {self.team_name}")
        return True
    
    def remove_player(self, player: Player) -> None:
        self._players.discard(player)
        if self._captain == player:
            self._captain = None
        print(f"{player.name} left {self.team_name}")
    
    def set_captain(self, player: Player) -> bool:
        if player in self._players:
            self._captain = player
            print(f"{player.name} is now captain of {self.team_name}")
            return True
        print(f"{player.name} is not on the team")
        return False
    
    def get_players(self) -> List[Player]:
        return list(self._players)
    
    def get_team_info(self) -> str:
        captain_info = f" - Captain: {self._captain.name}" if self._captain else ""
        return f"{self.team_name} ({self.sport}) - {len(self._players)} players{captain_info}"
    
    def get_roster(self) -> None:
        print(f"\n{self.team_name} Roster:")
        for player in self._players:
            is_captain = " (C)" if player == self._captain else ""
            print(f"  {player.get_player_info()}{is_captain}")

# Usage
print("\n=== Team-Player Aggregation ===")

player1 = Player("P001", "Lionel Messi", "Forward", 10)
player2 = Player("P002", "Cristiano Ronaldo", "Forward", 7)
player3 = Player("P003", "Sergio Ramos", "Defender", 4)

team_a = Team("T001", "Barcelona", "Soccer")
team_b = Team("T002", "Real Madrid", "Soccer")

team_a.add_player(player1)
team_a.add_player(player3)
team_a.set_captain(player1)

team_b.add_player(player2)

print(f"\n{team_a.get_team_info()}")
print(team_b.get_team_info())

team_a.get_roster()

team_a.remove_player(player3)
team_b.add_player(player3)

print("\nAfter transfer:")
print(team_a.get_team_info())
print(team_b.get_team_info())

# ============================================
# Example 3: Playlist-Song Aggregation
# ============================================

class Song:
    def __init__(self, song_id: str, title: str, artist: str, duration: int, genre: str):
        self.song_id = song_id
        self.title = title
        self.artist = artist
        self.duration = duration
        self.genre = genre
    
    def get_song_info(self) -> str:
        minutes = self.duration // 60
        seconds = self.duration % 60
        return f'"{self.title}" by {self.artist} ({minutes}:{seconds:02d})'
    
    def play(self) -> None:
        print(f"♪ Now playing: {self.title} by {self.artist}")

class Playlist:
    def __init__(self, playlist_id: str, name: str, creator: str):
        self.playlist_id = playlist_id
        self.name = name
        self.creator = creator
        self._songs: List[Song] = []
    
    def add_song(self, song: Song, position: Optional[int] = None) -> None:
        if position is not None and 0 <= position <= len(self._songs):
            self._songs.insert(position, song)
            print(f'Added "{song.title}" to {self.name} at position {position + 1}')
        else:
            self._songs.append(song)
            print(f'Added "{song.title}" to {self.name}')
    
    def remove_song(self, song: Song) -> None:
        if song in self._songs:
            self._songs.remove(song)
            print(f'Removed "{song.title}" from {self.name}')
    
    def get_songs(self) -> List[Song]:
        return self._songs.copy()
    
    def get_total_duration(self) -> int:
        return sum(song.duration for song in self._songs)
    
    def get_playlist_info(self) -> str:
        total_seconds = self.get_total_duration()
        minutes = total_seconds // 60
        hours = minutes // 60
        remaining_minutes = minutes % 60
        
        return f'"{self.name}" by {self.creator} - {len(self._songs)} songs, {hours}h {remaining_minutes}m'
    
    def shuffle(self) -> None:
        import random
        random.shuffle(self._songs)
        print(f"Shuffled {self.name}")
    
    def display_playlist(self) -> None:
        print(f"\nPlaylist: {self.name}")
        for index, song in enumerate(self._songs, 1):
            print(f"  {index}. {song.get_song_info()}")
        print(f"Total: {self.get_playlist_info()}")

# Usage
print("\n=== Playlist-Song Aggregation ===")

song1 = Song("S001", "Bohemian Rhapsody", "Queen", 354, "Rock")
song2 = Song("S002", "Imagine", "John Lennon", 183, "Pop")
song3 = Song("S003", "Billie Jean", "Michael Jackson", 294, "Pop")
song4 = Song("S004", "Smells Like Teen Spirit", "Nirvana", 301, "Rock")

rock_playlist = Playlist("PL001", "Classic Rock Hits", "MusicFan123")
party_mix = Playlist("PL002", "Party Mix 2024", "DJ_Cool")

rock_playlist.add_song(song1)
rock_playlist.add_song(song4)

party_mix.add_song(song2)
party_mix.add_song(song3)
party_mix.add_song(song1)

print(f"\n{rock_playlist.get_playlist_info()}")
print(party_mix.get_playlist_info())

rock_playlist.display_playlist()
party_mix.display_playlist()

party_mix.remove_song(song1)
print("\nAfter removing Bohemian Rhapsody from Party Mix:")
print(rock_playlist.get_playlist_info())
print(party_mix.get_playlist_info())
```

</details>

---

## 3. Composition

**Composition** is a strong "has-a" relationship where the contained object cannot exist independently of the container. It represents **strong ownership** - when the container is destroyed, the contained objects are also destroyed.

**Real-world analogy:** A house and its rooms. Rooms are part of the house - they cannot exist without the house. If you demolish the house, the rooms cease to exist as well. The rooms are composed as integral parts of the house.

### Characteristics:

- **Strong ownership**: Parent owns the child completely
- **Dependent lifecycle**: Child cannot exist without parent
- **Exclusive ownership**: Child belongs to exactly one parent
- **"Part-of" relationship**
- **Represented by filled diamond** in UML diagrams

### Composition vs Aggregation:

| Feature | Aggregation | Composition |
|---------|-------------|-------------|
| **Ownership** | Weak (shared) | Strong (exclusive) |
| **Lifecycle** | Independent | Dependent |
| **Example** | Department has Employees | Car has Engine |
| **When parent dies** | Children survive | Children destroyed |
| **UML Diamond** | Hollow ◇ | Filled ◆ |

<details>
<summary><strong>View Examples</strong></summary>

```typescript
// TypeScript - Composition Examples

// ============================================
// Example 1: House-Room Composition
// ============================================

class Room {
  private furniture: string[] = [];

  constructor(
    public roomType: string,
    public area: number, // in sq ft
    public hasWindow: boolean
  ) {}

  addFurniture(item: string): void {
    this.furniture.push(item);
    console.log(`Added ${item} to ${this.roomType}`);
  }

  getRoomInfo(): string {
    return `${this.roomType} (${this.area} sq ft) - ${this.furniture.length} furniture items`;
  }

  getFurniture(): string[] {
    return [...this.furniture];
  }
}

class House {
  private rooms: Room[] = [];
  private address: string;

  constructor(address: string) {
    this.address = address;
    console.log(`House created at ${address}`);
  }

  // Composition: House creates and owns rooms
  addRoom(roomType: string, area: number, hasWindow: boolean): Room {
    const room = new Room(roomType, area, hasWindow);
    this.rooms.push(room);
    console.log(`${roomType} added to house`);
    return room;
  }

  getRoom(roomType: string): Room | undefined {
    return this.rooms.find(r => r.roomType === roomType);
  }

  getRooms(): Room[] {
    return [...this.rooms];
  }

  getTotalArea(): number {
    return this.rooms.reduce((total, room) => total + room.area, 0);
  }

  getHouseInfo(): string {
    return `House at ${this.address} - ${this.rooms.length} rooms, ${this.getTotalArea()} sq ft total`;
  }

  displayFloorPlan(): void {
    console.log(`\n=== Floor Plan: ${this.address} ===`);
    this.rooms.forEach((room, index) => {
      console.log(`${index + 1}. ${room.getRoomInfo()}`);
    });
    console.log(`Total Area: ${this.getTotalArea()} sq ft`);
  }

  // When house is destroyed, all rooms are destroyed too
  demolish(): void {
    console.log(`\nDemolishing house at ${this.address}...`);
    console.log(`Destroying ${this.rooms.length} rooms...`);
    this.rooms = []; // Rooms no longer exist
    console.log("House demolished");
  }
}

// Usage
console.log("=== House-Room Composition ===");
const myHouse = new House("123 Main Street");

// House creates and owns rooms (composition)
const livingRoom = myHouse.addRoom("Living Room", 300, true);
const kitchen = myHouse.addRoom("Kitchen", 200, true);
const bedroom = myHouse.addRoom("Bedroom", 250, true);

livingRoom.addFurniture("Sofa");
livingRoom.addFurniture("TV");
kitchen.addFurniture("Refrigerator");

console.log("\n" + myHouse.getHouseInfo());
myHouse.displayFloorPlan();

// If house is demolished, rooms cease to exist
myHouse.demolish();
// livingRoom, kitchen, bedroom are no longer accessible/meaningful

// ============================================
// Example 2: Car-Engine Composition
// ============================================

class Engine {
  private currentRPM: number = 0;
  private isRunning: boolean = false;

  constructor(
    public engineType: string,
    public horsepower: number,
    public cylinders: number,
    public fuelType: string
  ) {}

  start(): boolean {
    if (!this.isRunning) {
      this.isRunning = true;
      this.currentRPM = 800; // Idle RPM
      console.log(`Engine started (${this.engineType})`);
      return true;
    }
    console.log("Engine already running");
    return false;
  }

  stop(): void {
    if (this.isRunning) {
      this.isRunning = false;
      this.currentRPM = 0;
      console.log("Engine stopped");
    }
  }

  accelerate(amount: number): void {
    if (this.isRunning) {
      this.currentRPM = Math.min(this.currentRPM + amount, 7000);
      console.log(`Engine RPM: ${this.currentRPM}`);
    } else {
      console.log("Cannot accelerate - engine not running");
    }
  }

  getEngineInfo(): string {
    const status = this.isRunning ? `Running at ${this.currentRPM} RPM` : "Off";
    return `${this.engineType} - ${this.horsepower}hp, ${this.cylinders} cylinders (${this.fuelType}) - ${status}`;
  }
}

class Transmission {
  private currentGear: number = 0; // 0 = Park, 1-6 = gears

  constructor(
    public transmissionType: string,
    public numberOfGears: number
  ) {}

  shiftUp(): boolean {
    if (this.currentGear < this.numberOfGears) {
      this.currentGear++;
      console.log(`Shifted to gear ${this.currentGear}`);
      return true;
    }
    console.log("Already in highest gear");
    return false;
  }

  shiftDown(): boolean {
    if (this.currentGear > 0) {
      this.currentGear--;
      console.log(`Shifted to gear ${this.currentGear}`);
      return true;
    }
    return false;
  }

  getCurrentGear(): number {
    return this.currentGear;
  }

  getTransmissionInfo(): string {
    const gearName = this.currentGear === 0 ? "Park" : `Gear ${this.currentGear}`;
    return `${this.transmissionType} (${this.numberOfGears}-speed) - ${gearName}`;
  }
}

class Car {
  private engine: Engine;
  private transmission: Transmission;

  constructor(
    public make: string,
    public model: string,
    public year: number,
    engineType: string,
    horsepower: number,
    cylinders: number,
    fuelType: string,
    transmissionType: string,
    numberOfGears: number
  ) {
    // Composition: Car creates and owns its engine and transmission
    this.engine = new Engine(engineType, horsepower, cylinders, fuelType);
    this.transmission = new Transmission(transmissionType, numberOfGears);
    console.log(`${year} ${make} ${model} manufactured`);
  }

  startCar(): void {
    console.log(`\nStarting ${this.make} ${this.model}...`);
    this.engine.start();
  }

  drive(): void {
    console.log(`\nDriving ${this.make} ${this.model}...`);
    if (this.transmission.getCurrentGear() === 0) {
      this.transmission.shiftUp(); // Out of park
    }
    this.engine.accelerate(1500);
    this.transmission.shiftUp();
    this.engine.accelerate(1000);
  }

  stopCar(): void {
    console.log(`\nStopping ${this.make} ${this.model}...`);
    while (this.transmission.getCurrentGear() > 0) {
      this.transmission.shiftDown();
    }
    this.engine.stop();
  }

  getCarInfo(): string {
    return `${this.year} ${this.make} ${this.model}\n  ${this.engine.getEngineInfo()}\n  ${this.transmission.getTransmissionInfo()}`;
  }

  // When car is destroyed, engine and transmission are destroyed too
  scrap(): void {
    console.log(`\n${this.make} ${this.model} is being scrapped...`);
    this.engine.stop();
    console.log("Engine removed and destroyed");
    console.log("Transmission removed and destroyed");
    // Engine and transmission no longer exist independently
  }
}

// Usage
console.log("\n=== Car-Engine Composition ===");
const myCar = new Car(
  "Toyota",
  "Camry",
  2023,
  "V6",
  301,
  6,
  "Gasoline",
  "Automatic",
  8
);

console.log("\n" + myCar.getCarInfo());

myCar.startCar();
myCar.drive();
console.log("\n" + myCar.getCarInfo());

myCar.stopCar();

// If car is scrapped, engine and transmission are destroyed
myCar.scrap();

// ============================================
// Example 3: Order-OrderItem Composition (E-commerce)
// ============================================

class OrderItem {
  constructor(
    public productId: string,
    public productName: string,
    public quantity: number,
    public unitPrice: number
  ) {}

  getSubtotal(): number {
    return this.quantity * this.unitPrice;
  }

  getItemInfo(): string {
    return `${this.productName} x${this.quantity} @ $${this.unitPrice} = $${this.getSubtotal()}`;
  }

  updateQuantity(newQuantity: number): void {
    this.quantity = newQuantity;
    console.log(`Updated ${this.productName} quantity to ${newQuantity}`);
  }
}

class ShippingAddress {
  constructor(
    public street: string,
    public city: string,
    public state: string,
    public zipCode: string,
    public country: string
  ) {}

  getFullAddress(): string {
    return `${this.street}, ${this.city}, ${this.state} ${this.zipCode}, ${this.country}`;
  }
}

class Order {
  private items: OrderItem[] = [];
  private shippingAddress: ShippingAddress;
  private orderDate: Date;
  private status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";

  constructor(
    public orderId: string,
    public customerId: string,
    street: string,
    city: string,
    state: string,
    zipCode: string,
    country: string
  ) {
    // Composition: Order creates and owns OrderItems and ShippingAddress
    this.shippingAddress = new ShippingAddress(street, city, state, zipCode, country);
    this.orderDate = new Date();
    this.status = "pending";
    console.log(`Order ${orderId} created for customer ${customerId}`);
  }

  addItem(productId: string, productName: string, quantity: number, unitPrice: number): OrderItem {
    // Order creates and owns the order items
    const item = new OrderItem(productId, productName, quantity, unitPrice);
    this.items.push(item);
    console.log(`Added ${productName} to order`);
    return item;
  }

  removeItem(item: OrderItem): void {
    const index = this.items.indexOf(item);
    if (index > -1) {
      this.items.splice(index, 1);
      console.log(`Removed ${item.productName} from order`);
      // OrderItem is destroyed when removed from order
    }
  }

  getItems(): OrderItem[] {
    return [...this.items];
  }

  getSubtotal(): number {
    return this.items.reduce((total, item) => total + item.getSubtotal(), 0);
  }

  getTax(): number {
    return this.getSubtotal() * 0.08; // 8% tax
  }

  getShipping(): number {
    return this.items.length > 0 ? 10 : 0;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getTax() + this.getShipping();
  }

  updateStatus(newStatus: typeof this.status): void {
    this.status = newStatus;
    console.log(`Order ${this.orderId} status updated to: ${newStatus}`);
  }

  getOrderSummary(): string {
    return `Order ${this.orderId} - ${this.status}\n` +
           `Customer: ${this.customerId}\n` +
           `Date: ${this.orderDate.toLocaleDateString()}\n` +
           `Items: ${this.items.length}\n` +
           `Subtotal: $${this.getSubtotal().toFixed(2)}\n` +
           `Tax: $${this.getTax().toFixed(2)}\n` +
           `Shipping: $${this.getShipping().toFixed(2)}\n` +
           `Total: $${this.getTotal().toFixed(2)}\n` +
           `Ship to: ${this.shippingAddress.getFullAddress()}`;
  }

  displayOrderDetails(): void {
    console.log(`\n=== Order Details ===`);
    console.log(`Order ID: ${this.orderId}`);
    console.log(`Status: ${this.status}`);
    console.log(`\nItems:`);
    this.items.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.getItemInfo()}`);
    });
    console.log(`\nSubtotal: $${this.getSubtotal().toFixed(2)}`);
    console.log(`Tax: $${this.getTax().toFixed(2)}`);
    console.log(`Shipping: $${this.getShipping().toFixed(2)}`);
    console.log(`Total: $${this.getTotal().toFixed(2)}`);
    console.log(`\nShip to: ${this.shippingAddress.getFullAddress()}`);
  }

  // When order is cancelled, all order items are destroyed
  cancel(): void {
    console.log(`\nCancelling order ${this.orderId}...`);
    this.status = "cancelled";
    console.log(`Removing ${this.items.length} items...`);
    this.items = []; // Items no longer exist
    console.log("Order cancelled");
  }
}

// Usage
console.log("\n=== Order-OrderItem Composition ===");
const order = new Order(
  "ORD001",
  "CUST12345",
  "456 Oak Avenue",
  "San Francisco",
  "CA",
  "94102",
  "USA"
);

// Order creates and owns its items
const item1 = order.addItem("PROD001", "Laptop", 1, 1299.99);
const item2 = order.addItem("PROD002", "Mouse", 2, 29.99);
const item3 = order.addItem("PROD003", "Keyboard", 1, 89.99);

order.displayOrderDetails();

order.updateStatus("processing");
order.updateStatus("shipped");

// If order is cancelled, all items are destroyed
order.cancel();
```

```python
# Python - Composition Examples

from typing import List, Optional
from datetime import datetime

# ============================================
# Example 1: House-Room Composition
# ============================================

class Room:
    def __init__(self, room_type: str, area: float, has_window: bool):
        self.room_type = room_type
        self.area = area
        self.has_window = has_window
        self._furniture: List[str] = []
    
    def add_furniture(self, item: str) -> None:
        self._furniture.append(item)
        print(f"Added {item} to {self.room_type}")
    
    def get_room_info(self) -> str:
        return f"{self.room_type} ({self.area} sq ft) - {len(self._furniture)} furniture items"
    
    def get_furniture(self) -> List[str]:
        return self._furniture.copy()

class House:
    def __init__(self, address: str):
        self._address = address
        self._rooms: List[Room] = []
        print(f"House created at {address}")
    
    def add_room(self, room_type: str, area: float, has_window: bool) -> Room:
        """Composition: House creates and owns rooms"""
        room = Room(room_type, area, has_window)
        self._rooms.append(room)
        print(f"{room_type} added to house")
        return room
    
    def get_room(self, room_type: str) -> Optional[Room]:
        for room in self._rooms:
            if room.room_type == room_type:
                return room
        return None
    
    def get_rooms(self) -> List[Room]:
        return self._rooms.copy()
    
    def get_total_area(self) -> float:
        return sum(room.area for room in self._rooms)
    
    def get_house_info(self) -> str:
        return f"House at {self._address} - {len(self._rooms)} rooms, {self.get_total_area()} sq ft total"
    
    def display_floor_plan(self) -> None:
        print(f"\n=== Floor Plan: {self._address} ===")
        for index, room in enumerate(self._rooms, 1):
            print(f"{index}. {room.get_room_info()}")
        print(f"Total Area: {self.get_total_area()} sq ft")
    
    def demolish(self) -> None:
        """When house is destroyed, all rooms are destroyed too"""
        print(f"\nDemolishing house at {self._address}...")
        print(f"Destroying {len(self._rooms)} rooms...")
        self._rooms = []
        print("House demolished")

# Usage
print("=== House-Room Composition ===")
my_house = House("123 Main Street")

living_room = my_house.add_room("Living Room", 300, True)
kitchen = my_house.add_room("Kitchen", 200, True)
bedroom = my_house.add_room("Bedroom", 250, True)

living_room.add_furniture("Sofa")
living_room.add_furniture("TV")
kitchen.add_furniture("Refrigerator")

print(f"\n{my_house.get_house_info()}")
my_house.display_floor_plan()

my_house.demolish()

# ============================================
# Example 2: Car-Engine Composition
# ============================================

class Engine:
    def __init__(self, engine_type: str, horsepower: int, cylinders: int, fuel_type: str):
        self.engine_type = engine_type
        self.horsepower = horsepower
        self.cylinders = cylinders
        self.fuel_type = fuel_type
        self._current_rpm = 0
        self._is_running = False
    
    def start(self) -> bool:
        if not self._is_running:
            self._is_running = True
            self._current_rpm = 800
            print(f"Engine started ({self.engine_type})")
            return True
        print("Engine already running")
        return False
    
    def stop(self) -> None:
        if self._is_running:
            self._is_running = False
            self._current_rpm = 0
            print("Engine stopped")
    
    def accelerate(self, amount: int) -> None:
        if self._is_running:
            self._current_rpm = min(self._current_rpm + amount, 7000)
            print(f"Engine RPM: {self._current_rpm}")
        else:
            print("Cannot accelerate - engine not running")
    
    def get_engine_info(self) -> str:
        status = f"Running at {self._current_rpm} RPM" if self._is_running else "Off"
        return f"{self.engine_type} - {self.horsepower}hp, {self.cylinders} cylinders ({self.fuel_type}) - {status}"

class Transmission:
    def __init__(self, transmission_type: str, number_of_gears: int):
        self.transmission_type = transmission_type
        self.number_of_gears = number_of_gears
        self._current_gear = 0
    
    def shift_up(self) -> bool:
        if self._current_gear < self.number_of_gears:
            self._current_gear += 1
            print(f"Shifted to gear {self._current_gear}")
            return True
        print("Already in highest gear")
        return False
    
    def shift_down(self) -> bool:
        if self._current_gear > 0:
            self._current_gear -= 1
            print(f"Shifted to gear {self._current_gear}")
            return True
        return False
    
    def get_current_gear(self) -> int:
        return self._current_gear
    
    def get_transmission_info(self) -> str:
        gear_name = "Park" if self._current_gear == 0 else f"Gear {self._current_gear}"
        return f"{self.transmission_type} ({self.number_of_gears}-speed) - {gear_name}"

class Car:
    def __init__(self, make: str, model: str, year: int,
                 engine_type: str, horsepower: int, cylinders: int, fuel_type: str,
                 transmission_type: str, number_of_gears: int):
        self.make = make
        self.model = model
        self.year = year
        # Composition: Car creates and owns its engine and transmission
        self._engine = Engine(engine_type, horsepower, cylinders, fuel_type)
        self._transmission = Transmission(transmission_type, number_of_gears)
        print(f"{year} {make} {model} manufactured")
    
    def start_car(self) -> None:
        print(f"\nStarting {self.make} {self.model}...")
        self._engine.start()
    
    def drive(self) -> None:
        print(f"\nDriving {self.make} {self.model}...")
        if self._transmission.get_current_gear() == 0:
            self._transmission.shift_up()
        self._engine.accelerate(1500)
        self._transmission.shift_up()
        self._engine.accelerate(1000)
    
    def stop_car(self) -> None:
        print(f"\nStopping {self.make} {self.model}...")
        while self._transmission.get_current_gear() > 0:
            self._transmission.shift_down()
        self._engine.stop()
    
    def get_car_info(self) -> str:
        return f"{self.year} {self.make} {self.model}\n  {self._engine.get_engine_info()}\n  {self._transmission.get_transmission_info()}"
    
    def scrap(self) -> None:
        """When car is destroyed, engine and transmission are destroyed too"""
        print(f"\n{self.make} {self.model} is being scrapped...")
        self._engine.stop()
        print("Engine removed and destroyed")
        print("Transmission removed and destroyed")

# Usage
print("\n=== Car-Engine Composition ===")
my_car = Car("Toyota", "Camry", 2023, "V6", 301, 6, "Gasoline", "Automatic", 8)

print(f"\n{my_car.get_car_info()}")

my_car.start_car()
my_car.drive()
print(f"\n{my_car.get_car_info()}")

my_car.stop_car()
my_car.scrap()

# ============================================
# Example 3: Order-OrderItem Composition
# ============================================

class OrderItem:
    def __init__(self, product_id: str, product_name: str, quantity: int, unit_price: float):
        self.product_id = product_id
        self.product_name = product_name
        self.quantity = quantity
        self.unit_price = unit_price
    
    def get_subtotal(self) -> float:
        return self.quantity * self.unit_price
    
    def get_item_info(self) -> str:
        return f"{self.product_name} x{self.quantity} @ ${self.unit_price} = ${self.get_subtotal()}"
    
    def update_quantity(self, new_quantity: int) -> None:
        self.quantity = new_quantity
        print(f"Updated {self.product_name} quantity to {new_quantity}")

class ShippingAddress:
    def __init__(self, street: str, city: str, state: str, zip_code: str, country: str):
        self.street = street
        self.city = city
        self.state = state
        self.zip_code = zip_code
        self.country = country
    
    def get_full_address(self) -> str:
        return f"{self.street}, {self.city}, {self.state} {self.zip_code}, {self.country}"

class Order:
    def __init__(self, order_id: str, customer_id: str,
                 street: str, city: str, state: str, zip_code: str, country: str):
        self.order_id = order_id
        self.customer_id = customer_id
        # Composition: Order creates and owns items and address
        self._items: List[OrderItem] = []
        self._shipping_address = ShippingAddress(street, city, state, zip_code, country)
        self._order_date = datetime.now()
        self._status = "pending"
        print(f"Order {order_id} created for customer {customer_id}")
    
    def add_item(self, product_id: str, product_name: str, quantity: int, unit_price: float) -> OrderItem:
        item = OrderItem(product_id, product_name, quantity, unit_price)
        self._items.append(item)
        print(f"Added {product_name} to order")
        return item
    
    def remove_item(self, item: OrderItem) -> None:
        if item in self._items:
            self._items.remove(item)
            print(f"Removed {item.product_name} from order")
    
    def get_items(self) -> List[OrderItem]:
        return self._items.copy()
    
    def get_subtotal(self) -> float:
        return sum(item.get_subtotal() for item in self._items)
    
    def get_tax(self) -> float:
        return self.get_subtotal() * 0.08
    
    def get_shipping(self) -> float:
        return 10 if self._items else 0
    
    def get_total(self) -> float:
        return self.get_subtotal() + self.get_tax() + self.get_shipping()
    
    def update_status(self, new_status: str) -> None:
        self._status = new_status
        print(f"Order {self.order_id} status updated to: {new_status}")
    
    def display_order_details(self) -> None:
        print("\n=== Order Details ===")
        print(f"Order ID: {self.order_id}")
        print(f"Status: {self._status}")
        print("\nItems:")
        for index, item in enumerate(self._items, 1):
            print(f"  {index}. {item.get_item_info()}")
        print(f"\nSubtotal: ${self.get_subtotal():.2f}")
        print(f"Tax: ${self.get_tax():.2f}")
        print(f"Shipping: ${self.get_shipping():.2f}")
        print(f"Total: ${self.get_total():.2f}")
        print(f"\nShip to: {self._shipping_address.get_full_address()}")
    
    def cancel(self) -> None:
        """When order is cancelled, all items are destroyed"""
        print(f"\nCancelling order {self.order_id}...")
        self._status = "cancelled"
        print(f"Removing {len(self._items)} items...")
        self._items = []
        print("Order cancelled")

# Usage
print("\n=== Order-OrderItem Composition ===")
order = Order("ORD001", "CUST12345", "456 Oak Avenue", "San Francisco", "CA", "94102", "USA")

item1 = order.add_item("PROD001", "Laptop", 1, 1299.99)
item2 = order.add_item("PROD002", "Mouse", 2, 29.99)
item3 = order.add_item("PROD003", "Keyboard", 1, 89.99)

order.display_order_details()

order.update_status("processing")
order.update_status("shipped")

order.cancel()
```

</details>

---

## 4. Composition vs Inheritance

This is one of the most important design decisions in OOP. The principle "**Favor composition over inheritance**" is a fundamental guideline in software design.

### The Problem with Inheritance

While inheritance is powerful, it has significant drawbacks:

1. **Tight coupling**: Child classes depend heavily on parent implementation
2. **Fragile base class problem**: Changes to parent break children
3. **Deep hierarchies**: Hard to understand and maintain
4. **Inflexibility**: Can't change inheritance at runtime
5. **Forced "is-a" relationships**: Not always natural

### When to Use Each

**Use Inheritance when:**
- There's a clear, natural IS-A relationship
- You need to use polymorphism extensively
- The relationship is stable and won't change
- Example: `Dog IS-A Animal`

**Use Composition when:**
- You need HAS-A relationships
- You want runtime flexibility
- You want to avoid deep hierarchies
- You need to reuse behavior across unrelated classes
- Example: `Car HAS-AN Engine`

### The Design Principle

**"Favor composition over inheritance"** means:
- Default to composition
- Use inheritance sparingly and only when it makes sense
- Prefer "has-a" over "is-a" when there's a choice

<details>
<summary><strong>View Examples</strong></summary>

```typescript
// TypeScript - Composition vs Inheritance

// ============================================
// BAD Example: Inheritance Abuse
// ============================================

// Using inheritance where composition would be better

class Animal {
  constructor(public name: string) {}
  
  eat(): void {
    console.log(`${this.name} is eating`);
  }
  
  sleep(): void {
    console.log(`${this.name} is sleeping`);
  }
}

class Dog extends Animal {
  bark(): void {
    console.log(`${this.name} says: Woof!`);
  }
}

class Bird extends Animal {
  fly(): void {
    console.log(`${this.name} is flying`);
  }
}

// Problem: What about a robot dog? It's not an Animal, but shares Dog behavior
// Problem: What about a penguin? It's a Bird but can't fly
// Problem: Deep hierarchies become fragile

// ============================================
// GOOD Example: Using Composition
// ============================================

// Separate behaviors into composable components

interface Eatable {
  eat(): void;
}

interface Sleepable {
  sleep(): void;
}

interface Barkable {
  bark(): void;
}

interface Flyable {
  fly(): void;
}

// Behavior implementations
class EatingBehavior implements Eatable {
  constructor(private name: string) {}
  
  eat(): void {
    console.log(`${this.name} is eating`);
  }
}

class SleepingBehavior implements Sleepable {
  constructor(private name: string) {}
  
  sleep(): void {
    console.log(`${this.name} is sleeping`);
  }
}

class BarkingBehavior implements Barkable {
  constructor(private name: string) {}
  
  bark(): void {
    console.log(`${this.name} says: Woof!`);
  }
}

class FlyingBehavior implements Flyable {
  constructor(private name: string) {}
  
  fly(): void {
    console.log(`${this.name} is flying`);
  }
}

// Compose behaviors as needed
class ComposedDog {
  private eatingBehavior: EatingBehavior;
  private sleepingBehavior: SleepingBehavior;
  private barkingBehavior: BarkingBehavior;

  constructor(public name: string) {
    // Compose behaviors
    this.eatingBehavior = new EatingBehavior(name);
    this.sleepingBehavior = new SleepingBehavior(name);
    this.barkingBehavior = new BarkingBehavior(name);
  }

  eat(): void {
    this.eatingBehavior.eat();
  }

  sleep(): void {
    this.sleepingBehavior.sleep();
  }

  bark(): void {
    this.barkingBehavior.bark();
  }
}

class RobotDog {
  private barkingBehavior: BarkingBehavior;

  constructor(public name: string) {
    // Robot dog doesn't eat or sleep, only barks
    this.barkingBehavior = new BarkingBehavior(name);
  }

  bark(): void {
    this.barkingBehavior.bark();
  }

  charge(): void {
    console.log(`${this.name} is charging`);
  }
}

class Penguin {
  private eatingBehavior: EatingBehavior;
  private sleepingBehavior: SleepingBehavior;
  // No flying behavior - penguins can't fly!

  constructor(public name: string) {
    this.eatingBehavior = new EatingBehavior(name);
    this.sleepingBehavior = new SleepingBehavior(name);
  }

  eat(): void {
    this.eatingBehavior.eat();
  }

  sleep(): void {
    this.sleepingBehavior.sleep();
  }

  swim(): void {
    console.log(`${this.name} is swimming`);
  }
}

// Usage
console.log("=== Composition Over Inheritance ===");
const realDog = new ComposedDog("Rex");
realDog.eat();
realDog.bark();

const robotDog = new RobotDog("Robo");
robotDog.bark();
robotDog.charge();

const penguin = new Penguin("Pingu");
penguin.eat();
penguin.swim();
// penguin.fly(); // Doesn't exist - correct!

// ============================================
// Real-World Example: Payment Processing
// ============================================

// Strategy pattern using composition

interface PaymentStrategy {
  processPayment(amount: number): boolean;
  refund(transactionId: string): boolean;
}

class CreditCardStrategy implements PaymentStrategy {
  constructor(private cardNumber: string, private cvv: string) {}

  processPayment(amount: number): boolean {
    console.log(`Processing $${amount} via credit card ending in ${this.cardNumber.slice(-4)}`);
    // Credit card processing logic
    return true;
  }

  refund(transactionId: string): boolean {
    console.log(`Refunding transaction ${transactionId} to credit card`);
    return true;
  }
}

class PayPalStrategy implements PaymentStrategy {
  constructor(private email: string) {}

  processPayment(amount: number): boolean {
    console.log(`Processing $${amount} via PayPal account ${this.email}`);
    // PayPal processing logic
    return true;
  }

  refund(transactionId: string): boolean {
    console.log(`Refunding transaction ${transactionId} to PayPal account`);
    return true;
  }
}

class CryptoStrategy implements PaymentStrategy {
  constructor(private walletAddress: string) {}

  processPayment(amount: number): boolean {
    console.log(`Processing $${amount} to crypto wallet ${this.walletAddress.slice(0, 10)}...`);
    // Cryptocurrency processing logic
    return true;
  }

  refund(transactionId: string): boolean {
    console.log(`Refunding transaction ${transactionId} to crypto wallet`);
    return true;
  }
}

// Composition: PaymentProcessor HAS-A PaymentStrategy
class PaymentProcessor {
  private strategy: PaymentStrategy;

  constructor(strategy: PaymentStrategy) {
    this.strategy = strategy;
  }

  // Can change strategy at runtime!
  setStrategy(strategy: PaymentStrategy): void {
    this.strategy = strategy;
    console.log("Payment strategy changed");
  }

  checkout(amount: number): boolean {
    console.log(`\n=== Processing checkout for $${amount} ===`);
    return this.strategy.processPayment(amount);
  }

  refundTransaction(transactionId: string): boolean {
    return this.strategy.refund(transactionId);
  }
}

// Usage - flexible at runtime
console.log("\n=== Payment Processing with Composition ===");
const processor = new PaymentProcessor(
  new CreditCardStrategy("1234567890123456", "123")
);

processor.checkout(99.99);

// Change payment method at runtime
processor.setStrategy(new PayPalStrategy("user@example.com"));
processor.checkout(49.99);

processor.setStrategy(new CryptoStrategy("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"));
processor.checkout(199.99);

// ============================================
// Another Example: Logger System
// ============================================

// BAD: Inheritance approach
class BaseLogger {
  log(message: string): void {
    console.log(message);
  }
}

class FileLogger extends BaseLogger {
  log(message: string): void {
    console.log(`[FILE] ${message}`);
  }
}

// What if we want both console AND file logging?
// We'd need multiple inheritance or duplicated code

// GOOD: Composition approach
interface LogDestination {
  write(message: string): void;
}

class ConsoleDestination implements LogDestination {
  write(message: string): void {
    console.log(`[CONSOLE] ${message}`);
  }
}

class FileDestination implements LogDestination {
  constructor(private filename: string) {}

  write(message: string): void {
    console.log(`[FILE:${this.filename}] ${message}`);
    // In real app: write to actual file
  }
}

class DatabaseDestination implements LogDestination {
  write(message: string): void {
    console.log(`[DATABASE] ${message}`);
    // In real app: write to database
  }
}

class Logger {
  private destinations: LogDestination[] = [];

  addDestination(destination: LogDestination): void {
    this.destinations.push(destination);
  }

  log(message: string): void {
    const timestamp = new Date().toISOString();
    const formattedMessage = `${timestamp} - ${message}`;
    
    // Log to all destinations
    this.destinations.forEach(dest => dest.write(formattedMessage));
  }
}

// Usage - can log to multiple destinations
console.log("\n=== Flexible Logger with Composition ===");
const logger = new Logger();
logger.addDestination(new ConsoleDestination());
logger.addDestination(new FileDestination("app.log"));
logger.addDestination(new DatabaseDestination());

logger.log("Application started");
logger.log("User logged in");
logger.log("Error occurred");

// ============================================
// Key Takeaway Example
// ============================================

console.log("\n=== Key Takeaway ===");
console.log("Inheritance: 'A Bird IS-AN Animal' - rigid hierarchy");
console.log("Composition: 'A Bird HAS flying behavior' - flexible components");
console.log("\nComposition allows:");
console.log("  ✓ Runtime flexibility (change behaviors on the fly)");
console.log("  ✓ Multiple behaviors (can have many components)");
console.log("  ✓ No fragile hierarchies (changes don't cascade)");
console.log("  ✓ Better testability (can mock individual components)");
```

```python
# Python - Composition vs Inheritance

from abc import ABC, abstractmethod
from typing import List

# ============================================
# BAD Example: Inheritance Abuse
# ============================================

class Animal:
    def __init__(self, name: str):
        self.name = name
    
    def eat(self) -> None:
        print(f"{self.name} is eating")
    
    def sleep(self) -> None:
        print(f"{self.name} is sleeping")

class Dog(Animal):
    def bark(self) -> None:
        print(f"{self.name} says: Woof!")

class Bird(Animal):
    def fly(self) -> None:
        print(f"{self.name} is flying")

# Problems with this approach are the same as in TypeScript

# ============================================
# GOOD Example: Using Composition
# ============================================

class EatingBehavior:
    def __init__(self, name: str):
        self._name = name
    
    def eat(self) -> None:
        print(f"{self._name} is eating")

class SleepingBehavior:
    def __init__(self, name: str):
        self._name = name
    
    def sleep(self) -> None:
        print(f"{self._name} is sleeping")

class BarkingBehavior:
    def __init__(self, name: str):
        self._name = name
    
    def bark(self) -> None:
        print(f"{self._name} says: Woof!")

class FlyingBehavior:
    def __init__(self, name: str):
        self._name = name
    
    def fly(self) -> None:
        print(f"{self._name} is flying")

# Compose behaviors as needed
class ComposedDog:
    def __init__(self, name: str):
        self.name = name
        self._eating = EatingBehavior(name)
        self._sleeping = SleepingBehavior(name)
        self._barking = BarkingBehavior(name)
    
    def eat(self) -> None:
        self._eating.eat()
    
    def sleep(self) -> None:
        self._sleeping.sleep()
    
    def bark(self) -> None:
        self._barking.bark()

class RobotDog:
    def __init__(self, name: str):
        self.name = name
        self._barking = BarkingBehavior(name)
    
    def bark(self) -> None:
        self._barking.bark()
    
    def charge(self) -> None:
        print(f"{self.name} is charging")

class Penguin:
    def __init__(self, name: str):
        self.name = name
        self._eating = EatingBehavior(name)
        self._sleeping = SleepingBehavior(name)
    
    def eat(self) -> None:
        self._eating.eat()
    
    def sleep(self) -> None:
        self._sleeping.sleep()
    
    def swim(self) -> None:
        print(f"{self.name} is swimming")

# Usage
print("=== Composition Over Inheritance ===")
real_dog = ComposedDog("Rex")
real_dog.eat()
real_dog.bark()

robot_dog = RobotDog("Robo")
robot_dog.bark()
robot_dog.charge()

penguin = Penguin("Pingu")
penguin.eat()
penguin.swim()

# ============================================
# Real-World Example: Payment Processing
# ============================================

class PaymentStrategy(ABC):
    @abstractmethod
    def process_payment(self, amount: float) -> bool:
        pass
    
    @abstractmethod
    def refund(self, transaction_id: str) -> bool:
        pass

class CreditCardStrategy(PaymentStrategy):
    def __init__(self, card_number: str, cvv: str):
        self._card_number = card_number
        self._cvv = cvv
    
    def process_payment(self, amount: float) -> bool:
        print(f"Processing ${amount} via credit card ending in {self._card_number[-4:]}")
        return True
    
    def refund(self, transaction_id: str) -> bool:
        print(f"Refunding transaction {transaction_id} to credit card")
        return True

class PayPalStrategy(PaymentStrategy):
    def __init__(self, email: str):
        self._email = email
    
    def process_payment(self, amount: float) -> bool:
        print(f"Processing ${amount} via PayPal account {self._email}")
        return True
    
    def refund(self, transaction_id: str) -> bool:
        print(f"Refunding transaction {transaction_id} to PayPal account")
        return True

class CryptoStrategy(PaymentStrategy):
    def __init__(self, wallet_address: str):
        self._wallet_address = wallet_address
    
    def process_payment(self, amount: float) -> bool:
        print(f"Processing ${amount} to crypto wallet {self._wallet_address[:10]}...")
        return True
    
    def refund(self, transaction_id: str) -> bool:
        print(f"Refunding transaction {transaction_id} to crypto wallet")
        return True

class PaymentProcessor:
    def __init__(self, strategy: PaymentStrategy):
        self._strategy = strategy
    
    def set_strategy(self, strategy: PaymentStrategy) -> None:
        self._strategy = strategy
        print("Payment strategy changed")
    
    def checkout(self, amount: float) -> bool:
        print(f"\n=== Processing checkout for ${amount} ===")
        return self._strategy.process_payment(amount)
    
    def refund_transaction(self, transaction_id: str) -> bool:
        return self._strategy.refund(transaction_id)

# Usage
print("\n=== Payment Processing with Composition ===")
processor = PaymentProcessor(CreditCardStrategy("1234567890123456", "123"))
processor.checkout(99.99)

processor.set_strategy(PayPalStrategy("user@example.com"))
processor.checkout(49.99)

processor.set_strategy(CryptoStrategy("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"))
processor.checkout(199.99)

# ============================================
# Another Example: Logger System
# ============================================

class LogDestination(ABC):
    @abstractmethod
    def write(self, message: str) -> None:
        pass

class ConsoleDestination(LogDestination):
    def write(self, message: str) -> None:
        print(f"[CONSOLE] {message}")

class FileDestination(LogDestination):
    def __init__(self, filename: str):
        self._filename = filename
    
    def write(self, message: str) -> None:
        print(f"[FILE:{self._filename}] {message}")

class DatabaseDestination(LogDestination):
    def write(self, message: str) -> None:
        print(f"[DATABASE] {message}")

class Logger:
    def __init__(self):
        self._destinations: List[LogDestination] = []
    
    def add_destination(self, destination: LogDestination) -> None:
        self._destinations.append(destination)
    
    def log(self, message: str) -> None:
        from datetime import datetime
        timestamp = datetime.now().isoformat()
        formatted_message = f"{timestamp} - {message}"
        
        for dest in self._destinations:
            dest.write(formatted_message)

# Usage
print("\n=== Flexible Logger with Composition ===")
logger = Logger()
logger.add_destination(ConsoleDestination())
logger.add_destination(FileDestination("app.log"))
logger.add_destination(DatabaseDestination())

logger.log("Application started")
logger.log("User logged in")
logger.log("Error occurred")

# ============================================
# Key Takeaway
# ============================================

print("\n=== Key Takeaway ===")
print("Inheritance: 'A Bird IS-AN Animal' - rigid hierarchy")
print("Composition: 'A Bird HAS flying behavior' - flexible components")
print("\nComposition allows:")
print("  ✓ Runtime flexibility (change behaviors on the fly)")
print("  ✓ Multiple behaviors (can have many components)")
print("  ✓ No fragile hierarchies (changes don't cascade)")
print("  ✓ Better testability (can mock individual components)")
```

</details>

---

## Practice Questions

<details>
<summary><strong>View Questions</strong></summary>

### Fill in the Blanks

1. __________ represents a weak "has-a" relationship where the contained object can exist independently of the container.

2. __________ represents a strong "has-a" relationship where the contained object's lifecycle is dependent on the container.

3. In __________, when the parent object is destroyed, the child objects are also destroyed.

4. The principle "__________ over __________" suggests preferring flexible object relationships over rigid hierarchies.

5. In aggregation, objects have __________ lifecycles, while in composition they have __________ lifecycles.

<details>
<summary><strong>View Answers</strong></summary>

1. **Aggregation** - Example: Department has Employees. Employees exist independently; if department closes, employees still exist.

2. **Composition** - Example: House has Rooms. Rooms cannot exist without the house.

3. **Composition** - This is the defining characteristic: strong ownership with dependent lifecycle.

4. **Favor composition**, **inheritance** - This fundamental design principle helps avoid tight coupling and inflexible hierarchies.

5. **independent**, **dependent** - Aggregation: child survives parent's destruction. Composition: child is destroyed with parent.

</details>

---

### True/False

1. ⬜ In aggregation, the contained object can belong to multiple containers simultaneously.

2. ⬜ Composition and aggregation are the same thing with different names.

3. ⬜ When using composition, you can change component behavior at runtime.

4. ⬜ Inheritance is always better than composition because it provides code reuse.

5. ⬜ In the car-engine relationship, the engine is typically composed within the car.

6. ⬜ Association is a more general relationship than both aggregation and composition.

<details>
<summary><strong>View Answers</strong></summary>

1. **True** - In aggregation (weak ownership), a child can belong to multiple parents. Example: A player can be on multiple teams (tournament team, practice team). In composition, ownership is exclusive.

2. **False** - They differ fundamentally in lifecycle dependency. Aggregation: weak ownership, independent lifecycle. Composition: strong ownership, dependent lifecycle. Example: Playlist-Songs (aggregation) vs House-Rooms (composition).

3. **True** - Composition is more flexible than inheritance. You can swap components at runtime. Example: PaymentProcessor can change its strategy from CreditCard to PayPal at runtime. You can't change your parent class at runtime.

4. **False** - Inheritance creates tight coupling and fragile hierarchies. Composition provides better flexibility, testability, and maintainability. "Favor composition over inheritance" is a key design principle. Inheritance should only be used for true IS-A relationships.

5. **True** - A car's engine is an integral part that cannot exist meaningfully without the car (in this context). When the car is scrapped, the engine is destroyed with it - this is composition.

6. **True** - Association is the most general relationship (objects know about each other). Aggregation is a special type of association (has-a with weak ownership). Composition is the strongest form (has-a with strong ownership). Association ⊃ Aggregation ⊃ Composition.

</details>

---

### Multiple Choice

1. **Which represents a composition relationship?**
   - A) Student enrolls in Course
   - B) Library has Books
   - C) Order has OrderItems
   - D) Teacher teaches Students

2. **What is the main advantage of composition over inheritance?**
   - A) Better performance
   - B) Less code
   - C) Runtime flexibility and loose coupling
   - D) Automatic memory management

3. **In which scenario should you use inheritance instead of composition?**
   - A) When you want runtime flexibility
   - B) When there's a genuine IS-A relationship and shared behavior
   - C) When you need multiple behaviors
   - D) Always, inheritance is superior

4. **What happens to OrderItems when an Order is cancelled (composition)?**
   - A) They survive and can be reused
   - B) They are destroyed with the order
   - C) They become independent objects
   - D) They are moved to another order

5. **Which is an example of aggregation, not composition?**
   - A) Car has Engine
   - B) House has Rooms
   - C) University has Students
   - D) Order has ShippingAddress

<details>
<summary><strong>View Answers</strong></summary>

1. **C** - Order and OrderItems have a composition relationship. OrderItems exist only within the context of an order; if you cancel the order, the items are destroyed. They cannot exist independently. A and D are associations, B is aggregation (books exist independently of the library).

2. **C** - Composition's key advantage is flexibility. You can change components at runtime (switch payment strategies), have multiple components (multiple log destinations), and avoid fragile hierarchies. Inheritance locks you into a rigid structure at compile time.

3. **B** - Use inheritance only for genuine IS-A relationships where polymorphism is needed and the relationship is stable. Example: Dog IS-A Animal makes sense and won't change. But Payment HAS-A Strategy is better than Payment IS-A CreditCardPayment.

4. **B** - In composition, the child's lifecycle depends on the parent. When the order is cancelled/destroyed, all its items are destroyed. This is the defining characteristic of composition vs aggregation. The items have no independent meaning outside the order.

5. **C** - University has Students is aggregation. Students exist independently - they can transfer universities, graduate, or leave. If the university closes, students still exist. Compare to A (engine destroyed with car), B (rooms destroyed with house), D (shipping address is part of the order).

</details>

---

### Code Challenge

**Challenge: Design a Document Management System**

Create a document management system that demonstrates both aggregation and composition:

**Requirements:**
1. **Composition**: A `Document` class that HAS `Paragraph` objects (composition - paragraphs don't exist without the document)
2. **Aggregation**: A `Folder` class that HAS `Document` objects (aggregation - documents can exist independently and be moved between folders)
3. **Methods**:
   - Document: add/remove paragraphs, get word count
   - Folder: add/remove documents, list documents
4. Demonstrate that:
   - When a document is deleted, its paragraphs are destroyed
   - When a folder is deleted, its documents survive

<details>
<summary><strong>View Solution</strong></summary>

```typescript
// TypeScript Solution

class Paragraph {
  constructor(public content: string) {}

  getWordCount(): number {
    return this.content.split(/\s+/).filter(w => w.length > 0).length;
  }

  getContent(): string {
    return this.content;
  }
}

class Document {
  private paragraphs: Paragraph[] = [];

  constructor(
    public documentId: string,
    public title: string,
    public author: string
  ) {
    console.log(`Document created: "${title}"`);
  }

  // Composition: Document creates and owns paragraphs
  addParagraph(content: string): Paragraph {
    const paragraph = new Paragraph(content);
    this.paragraphs.push(paragraph);
    console.log(`Paragraph added to "${this.title}"`);
    return paragraph;
  }

  removeParagraph(paragraph: Paragraph): void {
    const index = this.paragraphs.indexOf(paragraph);
    if (index > -1) {
      this.paragraphs.splice(index, 1);
      console.log(`Paragraph removed from "${this.title}"`);
      // Paragraph is destroyed
    }
  }

  getParagraphs(): Paragraph[] {
    return [...this.paragraphs];
  }

  getWordCount(): number {
    return this.paragraphs.reduce((total, p) => total + p.getWordCount(), 0);
  }

  getDocumentInfo(): string {
    return `"${this.title}" by ${this.author} - ${this.paragraphs.length} paragraphs, ${this.getWordCount()} words`;
  }

  displayContent(): void {
    console.log(`\n=== ${this.title} ===`);
    console.log(`Author: ${this.author}`);
    console.log();
    this.paragraphs.forEach((p, i) => {
      console.log(`Paragraph ${i + 1}: ${p.getContent()}`);
    });
  }

  // When document is deleted, paragraphs are destroyed
  delete(): void {
    console.log(`\nDeleting document "${this.title}"...`);
    console.log(`Destroying ${this.paragraphs.length} paragraphs...`);
    this.paragraphs = [];
    console.log("Document deleted");
  }
}

class Folder {
  private documents: Document[] = [];

  constructor(
    public folderId: string,
    public folderName: string
  ) {
    console.log(`Folder created: "${folderName}"`);
  }

  // Aggregation: Folder holds references to existing documents
  addDocument(document: Document): void {
    if (!this.documents.includes(document)) {
      this.documents.push(document);
      console.log(`Document "${document.title}" added to folder "${this.folderName}"`);
    }
  }

  removeDocument(document: Document): void {
    const index = this.documents.indexOf(document);
    if (index > -1) {
      this.documents.splice(index, 1);
      console.log(`Document "${document.title}" removed from folder "${this.folderName}"`);
      // Document still exists, just not in this folder
    }
  }

  getDocuments(): Document[] {
    return [...this.documents];
  }

  listDocuments(): void {
    console.log(`\nFolder: "${this.folderName}" (${this.documents.length} documents)`);
    this.documents.forEach((doc, i) => {
      console.log(`  ${i + 1}. ${doc.getDocumentInfo()}`);
    });
  }

  getTotalWordCount(): number {
    return this.documents.reduce((total, doc) => total + doc.getWordCount(), 0);
  }

  // When folder is deleted, documents survive
  delete(): void {
    console.log(`\nDeleting folder "${this.folderName}"...`);
    console.log(`Releasing ${this.documents.length} documents...`);
    const survivingDocs = [...this.documents];
    this.documents = [];
    console.log("Folder deleted");
    console.log(`${survivingDocs.length} documents still exist and can be moved to other folders`);
    return survivingDocs;
  }
}

// Usage - Demonstrating Composition and Aggregation
console.log("=== Document Management System ===\n");

// Create documents (they exist independently)
const doc1 = new Document("DOC001", "OOP Guide", "Alice");
doc1.addParagraph("Object-oriented programming is a programming paradigm.");
doc1.addParagraph("It organizes code around objects rather than functions.");
doc1.addParagraph("The four pillars are encapsulation, abstraction, inheritance, and polymorphism.");

const doc2 = new Document("DOC002", "Design Patterns", "Bob");
doc2.addParagraph("Design patterns are reusable solutions to common problems.");
doc2.addParagraph("They provide best practices for software design.");

console.log("\n" + doc1.getDocumentInfo());
console.log(doc2.getDocumentInfo());

// Create folders and add documents (aggregation)
const workFolder = new Folder("F001", "Work Documents");
const archiveFolder = new Folder("F002", "Archive");

workFolder.addDocument(doc1);
workFolder.addDocument(doc2);

workFolder.listDocuments();

// Move document between folders (documents exist independently)
console.log("\n--- Moving document ---");
workFolder.removeDocument(doc1);
archiveFolder.addDocument(doc1);

workFolder.listDocuments();
archiveFolder.listDocuments();

// Delete document - paragraphs are destroyed (composition)
console.log("\n--- Demonstrating Composition ---");
doc2.delete();
// Paragraphs of doc2 no longer exist

// Delete folder - documents survive (aggregation)
console.log("\n--- Demonstrating Aggregation ---");
archiveFolder.delete();
// doc1 still exists
console.log("\nDoc1 info after folder deletion: " + doc1.getDocumentInfo());
doc1.displayContent();
```

```python
# Python Solution

from typing import List

class Paragraph:
    def __init__(self, content: str):
        self.content = content
    
    def get_word_count(self) -> int:
        return len([w for w in self.content.split() if w])
    
    def get_content(self) -> str:
        return self.content

class Document:
    def __init__(self, document_id: str, title: str, author: str):
        self.document_id = document_id
        self.title = title
        self.author = author
        self._paragraphs: List[Paragraph] = []
        print(f'Document created: "{title}"')
    
    def add_paragraph(self, content: str) -> Paragraph:
        """Composition: Document creates and owns paragraphs"""
        paragraph = Paragraph(content)
        self._paragraphs.append(paragraph)
        print(f'Paragraph added to "{self.title}"')
        return paragraph
    
    def remove_paragraph(self, paragraph: Paragraph) -> None:
        if paragraph in self._paragraphs:
            self._paragraphs.remove(paragraph)
            print(f'Paragraph removed from "{self.title}"')
    
    def get_paragraphs(self) -> List[Paragraph]:
        return self._paragraphs.copy()
    
    def get_word_count(self) -> int:
        return sum(p.get_word_count() for p in self._paragraphs)
    
    def get_document_info(self) -> str:
        return f'"{self.title}" by {self.author} - {len(self._paragraphs)} paragraphs, {self.get_word_count()} words'
    
    def display_content(self) -> None:
        print(f'\n=== {self.title} ===')
        print(f'Author: {self.author}\n')
        for i, p in enumerate(self._paragraphs, 1):
            print(f'Paragraph {i}: {p.get_content()}')
    
    def delete(self) -> None:
        """When document is deleted, paragraphs are destroyed"""
        print(f'\nDeleting document "{self.title}"...')
        print(f'Destroying {len(self._paragraphs)} paragraphs...')
        self._paragraphs = []
        print("Document deleted")

class Folder:
    def __init__(self, folder_id: str, folder_name: str):
        self.folder_id = folder_id
        self.folder_name = folder_name
        self._documents: List[Document] = []
        print(f'Folder created: "{folder_name}"')
    
    def add_document(self, document: Document) -> None:
        """Aggregation: Folder holds references to existing documents"""
        if document not in self._documents:
            self._documents.append(document)
            print(f'Document "{document.title}" added to folder "{self.folder_name}"')
    
    def remove_document(self, document: Document) -> None:
        if document in self._documents:
            self._documents.remove(document)
            print(f'Document "{document.title}" removed from folder "{self.folder_name}"')
    
    def get_documents(self) -> List[Document]:
        return self._documents.copy()
    
    def list_documents(self) -> None:
        print(f'\nFolder: "{self.folder_name}" ({len(self._documents)} documents)')
        for i, doc in enumerate(self._documents, 1):
            print(f'  {i}. {doc.get_document_info()}')
    
    def get_total_word_count(self) -> int:
        return sum(doc.get_word_count() for doc in self._documents)
    
    def delete(self) -> List[Document]:
        """When folder is deleted, documents survive"""
        print(f'\nDeleting folder "{self.folder_name}"...')
        print(f'Releasing {len(self._documents)} documents...')
        surviving_docs = self._documents.copy()
        self._documents = []
        print("Folder deleted")
        print(f'{len(surviving_docs)} documents still exist and can be moved to other folders')
        return surviving_docs

# Usage
print("=== Document Management System ===\n")

doc1 = Document("DOC001", "OOP Guide", "Alice")
doc1.add_paragraph("Object-oriented programming is a programming paradigm.")
doc1.add_paragraph("It organizes code around objects rather than functions.")
doc1.add_paragraph("The four pillars are encapsulation, abstraction, inheritance, and polymorphism.")

doc2 = Document("DOC002", "Design Patterns", "Bob")
doc2.add_paragraph("Design patterns are reusable solutions to common problems.")
doc2.add_paragraph("They provide best practices for software design.")

print(f'\n{doc1.get_document_info()}')
print(doc2.get_document_info())

work_folder = Folder("F001", "Work Documents")
archive_folder = Folder("F002", "Archive")

work_folder.add_document(doc1)
work_folder.add_document(doc2)

work_folder.list_documents()

print("\n--- Moving document ---")
work_folder.remove_document(doc1)
archive_folder.add_document(doc1)

work_folder.list_documents()
archive_folder.list_documents()

print("\n--- Demonstrating Composition ---")
doc2.delete()

print("\n--- Demonstrating Aggregation ---")
archive_folder.delete()
print(f'\nDoc1 info after folder deletion: {doc1.get_document_info()}')
doc1.display_content()
```

</details>

</details>

---

## Summary

Object relationships are fundamental to OOP design:

1. **Association**: General relationship - objects know about each other
2. **Aggregation**: Weak "has-a" - child can exist independently
3. **Composition**: Strong "has-a" - child's lifecycle depends on parent
4. **Composition vs Inheritance**: Favor composition for flexibility and maintainability

**Key principle**: "Favor composition over inheritance" - it leads to more flexible, testable, and maintainable code.
