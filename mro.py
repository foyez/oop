# Method Resolution Order(MRO)
class A:
  def do_something(self):
    print('Method Defined In: A')

class B(A):
  def do_something(self):
    print('Method Defined In: B')

class C(A):
  def do_something(self):
    print('Method Defined In: C')

class D(B, C):
  def do_something(self):
    print('Method Defined In: D')
    super().do_something()


    #       A
    #      /  \
    #     B    C
    #      \  /
    #        D

    # D, B, C, A, Object

thing = D()
thing.do_something()

# print(D.__mro__)
# print(D.mro())
# print(help(D))