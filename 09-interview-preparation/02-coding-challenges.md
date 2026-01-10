# 9.2 OOP Coding Challenges

[← Back to FAQ](01-faq.md) | [Next: System Design →](03-system-design.md) | [↑ Back to README](../README.md)

---

## Challenge 1: Design a Parking Lot System

### Requirements
- Multiple levels
- Different vehicle types (Car, Motorcycle, Bus)
- Different spot sizes (Compact, Regular, Large)
- Track available spots

<details>
<summary><strong>View Solution</strong></summary>

```python
from abc import ABC, abstractmethod
from enum import Enum

class VehicleType(Enum):
    MOTORCYCLE = 1
    CAR = 2
    BUS = 3

class SpotSize(Enum):
    COMPACT = 1
    REGULAR = 2
    LARGE = 3

class Vehicle(ABC):
    def __init__(self, license_plate):
        self.license_plate = license_plate
        self.spot = None
    
    @abstractmethod
    def get_size(self):
        pass

class Motorcycle(Vehicle):
    def get_size(self):
        return SpotSize.COMPACT

class Car(Vehicle):
    def get_size(self):
        return SpotSize.REGULAR

class Bus(Vehicle):
    def get_size(self):
        return SpotSize.LARGE

class ParkingSpot:
    def __init__(self, spot_id, size):
        self.spot_id = spot_id
        self.size = size
        self.vehicle = None
    
    def is_available(self):
        return self.vehicle is None
    
    def can_fit(self, vehicle):
        return self.is_available() and vehicle.get_size().value <= self.size.value
    
    def park(self, vehicle):
        if self.can_fit(vehicle):
            self.vehicle = vehicle
            vehicle.spot = self
            return True
        return False
    
    def remove_vehicle(self):
        if self.vehicle:
            vehicle = self.vehicle
            self.vehicle = None
            vehicle.spot = None
            return vehicle
        return None

class ParkingLevel:
    def __init__(self, level_number, num_spots):
        self.level_number = level_number
        self.spots = []
        self._initialize_spots(num_spots)
    
    def _initialize_spots(self, num_spots):
        # 50% regular, 30% compact, 20% large
        for i in range(num_spots):
            if i < num_spots * 0.5:
                size = SpotSize.REGULAR
            elif i < num_spots * 0.8:
                size = SpotSize.COMPACT
            else:
                size = SpotSize.LARGE
            self.spots.append(ParkingSpot(f"L{self.level_number}-{i}", size))
    
    def park_vehicle(self, vehicle):
        for spot in self.spots:
            if spot.can_fit(vehicle):
                spot.park(vehicle)
                return True
        return False
    
    def get_available_spots(self):
        return sum(1 for spot in self.spots if spot.is_available())

class ParkingLot:
    def __init__(self, num_levels, spots_per_level):
        self.levels = [ParkingLevel(i, spots_per_level) for i in range(num_levels)]
    
    def park_vehicle(self, vehicle):
        for level in self.levels:
            if level.park_vehicle(vehicle):
                return True
        return False
    
    def remove_vehicle(self, vehicle):
        if vehicle.spot:
            return vehicle.spot.remove_vehicle()
        return None
    
    def get_available_spots(self):
        return sum(level.get_available_spots() for level in self.levels)

# Usage
parking_lot = ParkingLot(num_levels=3, spots_per_level=10)

car = Car("ABC123")
motorcycle = Motorcycle("XYZ789")

parking_lot.park_vehicle(car)
parking_lot.park_vehicle(motorcycle)

print(f"Available spots: {parking_lot.get_available_spots()}")
```

</details>

---

## Challenge 2: Design a Deck of Cards

### Requirements
- Standard 52-card deck
- Support multiple games (Poker, Blackjack)
- Shuffle functionality
- Deal cards

<details>
<summary><strong>View Solution</strong></summary>

```python
from enum import Enum
import random

class Suit(Enum):
    HEARTS = "♥"
    DIAMONDS = "♦"
    CLUBS = "♣"
    SPADES = "♠"

class Rank(Enum):
    TWO = (2, "2")
    THREE = (3, "3")
    FOUR = (4, "4")
    FIVE = (5, "5")
    SIX = (6, "6")
    SEVEN = (7, "7")
    EIGHT = (8, "8")
    NINE = (9, "9")
    TEN = (10, "10")
    JACK = (11, "J")
    QUEEN = (12, "Q")
    KING = (13, "K")
    ACE = (14, "A")
    
    def __init__(self, value, display):
        self.value = value
        self.display = display

class Card:
    def __init__(self, suit, rank):
        self.suit = suit
        self.rank = rank
    
    def __str__(self):
        return f"{self.rank.display}{self.suit.value}"
    
    def __repr__(self):
        return str(self)

class Deck:
    def __init__(self):
        self.cards = []
        self._initialize_deck()
    
    def _initialize_deck(self):
        self.cards = [Card(suit, rank) 
                     for suit in Suit 
                     for rank in Rank]
    
    def shuffle(self):
        random.shuffle(self.cards)
    
    def deal(self, num_cards=1):
        if num_cards > len(self.cards):
            raise ValueError("Not enough cards")
        
        dealt = self.cards[:num_cards]
        self.cards = self.cards[num_cards:]
        return dealt
    
    def remaining(self):
        return len(self.cards)

class Hand:
    def __init__(self):
        self.cards = []
    
    def add_card(self, card):
        self.cards.append(card)
    
    def __str__(self):
        return " ".join(str(card) for card in self.cards)

# Usage
deck = Deck()
deck.shuffle()

player1_hand = Hand()
player2_hand = Hand()

for _ in range(5):
    player1_hand.add_card(deck.deal()[0])
    player2_hand.add_card(deck.deal()[0])

print(f"Player 1: {player1_hand}")
print(f"Player 2: {player2_hand}")
print(f"Remaining cards: {deck.remaining()}")
```

</details>

---

## Challenge 3: Design a File System

### Requirements
- Files and Directories
- Hierarchy structure
- Size calculation
- Path navigation

<details>
<summary><strong>View Solution</strong></summary>

```python
from abc import ABC, abstractmethod
from datetime import datetime

class FileSystemNode(ABC):
    def __init__(self, name):
        self.name = name
        self.created_at = datetime.now()
    
    @abstractmethod
    def get_size(self):
        pass
    
    @abstractmethod
    def print_structure(self, indent=0):
        pass

class File(FileSystemNode):
    def __init__(self, name, size):
        super().__init__(name)
        self.size = size
    
    def get_size(self):
        return self.size
    
    def print_structure(self, indent=0):
        print("  " * indent + f"📄 {self.name} ({self.size} bytes)")

class Directory(FileSystemNode):
    def __init__(self, name):
        super().__init__(name)
        self.children = []
    
    def add(self, node):
        self.children.append(node)
    
    def remove(self, name):
        self.children = [c for c in self.children if c.name != name]
    
    def get_size(self):
        return sum(child.get_size() for child in self.children)
    
    def print_structure(self, indent=0):
        print("  " * indent + f"📁 {self.name}/")
        for child in self.children:
            child.print_structure(indent + 1)
    
    def find(self, name):
        if self.name == name:
            return self
        
        for child in self.children:
            if child.name == name:
                return child
            if isinstance(child, Directory):
                found = child.find(name)
                if found:
                    return found
        return None

# Usage
root = Directory("root")

home = Directory("home")
user = Directory("user")
documents = Directory("documents")

file1 = File("readme.txt", 1024)
file2 = File("photo.jpg", 2048000)
file3 = File("report.pdf", 512000)

documents.add(file3)
user.add(documents)
user.add(file1)
user.add(file2)
home.add(user)
root.add(home)

root.print_structure()
print(f"\nTotal size: {root.get_size()} bytes")
```

</details>

---

[← Back to FAQ](01-faq.md) | [Next: System Design →](03-system-design.md) | [↑ Back to README](../README.md)