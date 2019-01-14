class User:
  active_users = 0

  def __init__(self, first, last, age):
    self.first = first
    self.last = last
    self.age = age
    self._secret = 'hi'
    self.__msg = 'I like turtles!'
    User.active_users += 1

  def __repr__(self):
    return f"{self.first} is {self.age}"

  @classmethod
  def display_active_users(cls):
    return f"There are currently {cls.active_users} active users"

  @classmethod
  def from_string(cls, data_str):
    first, last, age = data_str.split(',')
    return cls(first, last, int(age))

  def full_name(self):
    return f"{self.first} {self.last}"

  def initials(self):
    return f"{self.first[0]}.{self.last[0]}."

  def likes(self, thing):
    return f"{self.first} likes {thing}"

  def is_senior(self):
    return self.age >= 65

  def birthday(self):
    self.age += 1
    return f"Happy {self.age}th, {self.first}"

  def logout(self):
    User.active_users -= 1
    return f"{self.first} has logged out"

class Moderator(User):
  total_mods = 0

  def __init__(self, first, last, age, community):
    super().__init__(first, last, age)
    self.community = community
    Moderator.total_mods += 1

  @classmethod
  def display_active_mods(cls):
    return f"There are currently {cls.total_mods} active moderators"

  def remove_post(self):
    return f"{self.full_name()} removed a post from the {self.community} community"

u1 = User('Tom', 'Garcia', 35)
jasmine = Moderator('Jasmine', "O'conner", 61, 'Piano')
print(jasmine.remove_post())
print(User.display_active_users())
print(Moderator.display_active_users())
print(Moderator.display_active_mods())






# u1 = User('Foyez', 'Ahmed', 27)
# u2 = User('Manam', 'Ahmed', 23)

# print(u1.first, u1.last)

# print(u1._secret)
# print(u1._User__msg)

# print(u1.full_name())
# print(u2.full_name())
# print(u1.initials())

# print(u1.likes('Potato'))

# print(u1.is_senior())
# print(u1.birthday())

# print(User.active_users)
# print(u1.logout())
# print(User.active_users)

# print(User.display_active_users())

# tom = User.from_string('Tom,Jones,89')
# print(tom.last)
# print(tom.full_name())
# print(tom.birthday())
# print(tom)

# j = User('Apple', 'Khan', 19)
# print(j)