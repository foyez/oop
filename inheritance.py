class Person:
  def __init__(self, first, last, age, occupation):
    self.first = first
    self.last = last
    self._age = max([age, 0])
    self.occupation = occupation

  def __repr__(self):
    return f"{self.first} is a {self.occupation}"

  # def get_age(self):
  #   return self._age

  # def set_age(self, new_age):
  #   self._age = max([new_age, 0])

  @property
  def age(self):
    return self._age

  @age.setter
  def age(self, new_age):
    self._age = max([new_age, 0])

  @property
  def full_name(self):
    return f"{self.first} {self.last}"

  @full_name.setter
  def full_name(self, name):
    self.first, self.last = name.split(' ')

class Student(Person):
  def __init__(self, first, last, age, grade):
    super().__init__(first, last, age, occupation = 'Student')
    self.grade = grade

rafeh = Student('Rafeh', 'Siddique', 14, 'Eight')
print(rafeh)