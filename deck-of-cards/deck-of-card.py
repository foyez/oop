from random import shuffle

# Each instance of Card  should have a suit ("Hearts", "Diamonds", "Clubs", or "Spades").
# Each instance of Card  should have a value ("A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K").
# Card 's __repr__  method should return the card's value and suit (e.g. "A of Clubs", "J of Diamonds", etc.)

class Card:
  def __init__(self, value, suit):
    self.value = value
    self.suit = suit

  def __repr__(self):
    return f"{self.value} of {self.suit}"

c1 = Card('A', 'Hearts')
c2 = Card('10', 'Diamonds')
c3 = Card('A', 'Spades')

# Each instance of Deck  should have a cards attribute with all 52 possible instances of Card .
# Deck  should have an instance method called count  which returns a count of how many cards remain in the deck.
# Deck 's __repr__  method should return information on how many cards are in the deck (e.g. "Deck of 52 cards", "Deck of 12 cards", etc.)
# Deck  should have an instance method called _deal  which accepts a number and removes at most that many cards from the deck (it may need to remove fewer if you request more cards than are currently in the deck!). If there are no cards left, this method should return a ValueError  with the message "All cards have been dealt".
# Deck  should have an instance method called shuffle  which will shuffle a full deck of cards. If there are cards missing from the deck, this method should return a ValueError  with the message "Only full decks can be shuffled".  shuffle should return the shuffled deck.
# Deck  should have an instance method called deal_card  which uses the _deal  method to deal a single card from the deck and return that single card.
# Deck  should have an instance method called deal_hand  which accepts a number and uses the _deal  method to deal a list of cards from the deck and return that list of cards.

class Deck:
  def __init__(self):
    suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades']
    values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
    self.cards = [Card(value, suit) for suit in suits for value in values]

  def __repr__(self):
    return f"Deck of {self.count()} cards"

  def count(self):
    return len(self.cards)

  def _deal(self, num):
    count = self.count()
    actual = min([count, num])
    if count == 0:
      raise ValueError("All cards have been dealt")
    cards = self.cards[-actual:]
    self.cards = self.cards[:-actual]
    return cards

  def deal_card(self):
    return self._deal(1)[0]

  def deal_hand(self, hand_size):
    return self._deal(hand_size)

  def shuffle(self):
    if self.count() < 52:
      raise ValueError("Only full decks can be shuffled")

    shuffle(self.cards)
    return self

d = Deck()
d.shuffle()
card = d.deal_card()
print(card)
hand = d.deal_hand(5)
print(hand)
# print(d.cards)