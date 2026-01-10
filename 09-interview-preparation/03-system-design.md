# 9.3 System Design Questions

[← Back to Coding Challenges](02-coding-challenges.md) | [Next: Common Mistakes →](04-common-mistakes.md) | [↑ Back to README](../README.md)

---

## Question 1: Design a URL Shortener (like bit.ly)

### Requirements
- Shorten long URLs to short codes
- Redirect short URLs to original URLs
- Track click statistics
- Handle high traffic

### Solution Approach

```python
from abc import ABC, abstractmethod
import hashlib
import string
import random
from datetime import datetime

class URLShortener:
    def __init__(self):
        self.url_map = {}  # short_code -> URLEntry
        self.reverse_map = {}  # long_url -> short_code
        self.base_url = "https://short.ly/"
        self.code_length = 7
    
    def shorten(self, long_url):
        # Check if URL already shortened
        if long_url in self.reverse_map:
            return self.base_url + self.reverse_map[long_url]
        
        # Generate unique short code
        short_code = self._generate_code()
        while short_code in self.url_map:
            short_code = self._generate_code()
        
        # Store mapping
        entry = URLEntry(long_url, short_code)
        self.url_map[short_code] = entry
        self.reverse_map[long_url] = short_code
        
        return self.base_url + short_code
    
    def expand(self, short_url):
        short_code = short_url.replace(self.base_url, "")
        
        if short_code in self.url_map:
            entry = self.url_map[short_code]
            entry.increment_clicks()
            return entry.long_url
        
        return None
    
    def get_stats(self, short_url):
        short_code = short_url.replace(self.base_url, "")
        
        if short_code in self.url_map:
            return self.url_map[short_code].get_stats()
        
        return None
    
    def _generate_code(self):
        # Base62 encoding: a-z, A-Z, 0-9
        chars = string.ascii_letters + string.digits
        return ''.join(random.choice(chars) for _ in range(self.code_length))

class URLEntry:
    def __init__(self, long_url, short_code):
        self.long_url = long_url
        self.short_code = short_code
        self.created_at = datetime.now()
        self.click_count = 0
        self.last_accessed = None
    
    def increment_clicks(self):
        self.click_count += 1
        self.last_accessed = datetime.now()
    
    def get_stats(self):
        return {
            "long_url": self.long_url,
            "short_code": self.short_code,
            "clicks": self.click_count,
            "created": self.created_at,
            "last_accessed": self.last_accessed
        }

# Usage
shortener = URLShortener()

# Shorten URL
long_url = "https://www.example.com/very/long/url/path?param=value"
short_url = shortener.shorten(long_url)
print(f"Short URL: {short_url}")

# Expand URL
original = shortener.expand(short_url)
print(f"Original URL: {original}")

# Get statistics
stats = shortener.get_stats(short_url)
print(f"Stats: {stats}")
```

### Design Considerations

**Scalability:**
- Use distributed hash table for storage
- Database sharding by short_code
- Caching layer (Redis) for popular URLs

**OOP Principles:**
- Single Responsibility: URLShortener handles shortening, URLEntry handles stats
- Open/Closed: Easy to add new code generation strategies

---

## Question 2: Design a Rate Limiter

### Requirements
- Limit requests per user/IP
- Different limits for different endpoints
- Handle distributed systems

### Solution Approach

```python
from abc import ABC, abstractmethod
from datetime import datetime, timedelta
from collections import deque

class RateLimitStrategy(ABC):
    @abstractmethod
    def is_allowed(self, user_id):
        pass

class FixedWindowCounter(RateLimitStrategy):
    """Fixed time window (e.g., 100 requests per hour)"""
    def __init__(self, max_requests, window_seconds):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.counters = {}  # user_id -> (count, window_start)
    
    def is_allowed(self, user_id):
        now = datetime.now()
        
        if user_id not in self.counters:
            self.counters[user_id] = (1, now)
            return True
        
        count, window_start = self.counters[user_id]
        
        # Check if window expired
        if (now - window_start).total_seconds() >= self.window_seconds:
            self.counters[user_id] = (1, now)
            return True
        
        # Within window
        if count < self.max_requests:
            self.counters[user_id] = (count + 1, window_start)
            return True
        
        return False

class SlidingWindowLog(RateLimitStrategy):
    """Sliding window using request timestamps"""
    def __init__(self, max_requests, window_seconds):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.request_logs = {}  # user_id -> deque of timestamps
    
    def is_allowed(self, user_id):
        now = datetime.now()
        
        if user_id not in self.request_logs:
            self.request_logs[user_id] = deque()
        
        log = self.request_logs[user_id]
        
        # Remove old requests
        cutoff = now - timedelta(seconds=self.window_seconds)
        while log and log[0] < cutoff:
            log.popleft()
        
        # Check limit
        if len(log) < self.max_requests:
            log.append(now)
            return True
        
        return False

class TokenBucket(RateLimitStrategy):
    """Token bucket algorithm"""
    def __init__(self, capacity, refill_rate):
        self.capacity = capacity
        self.refill_rate = refill_rate  # tokens per second
        self.buckets = {}  # user_id -> (tokens, last_refill)
    
    def is_allowed(self, user_id):
        now = datetime.now()
        
        if user_id not in self.buckets:
            self.buckets[user_id] = (self.capacity - 1, now)
            return True
        
        tokens, last_refill = self.buckets[user_id]
        
        # Refill tokens
        time_passed = (now - last_refill).total_seconds()
        tokens = min(self.capacity, tokens + time_passed * self.refill_rate)
        
        # Try to consume token
        if tokens >= 1:
            self.buckets[user_id] = (tokens - 1, now)
            return True
        
        self.buckets[user_id] = (tokens, now)
        return False

class RateLimiter:
    """Main rate limiter with different strategies"""
    def __init__(self, strategy: RateLimitStrategy):
        self.strategy = strategy
    
    def allow_request(self, user_id):
        return self.strategy.is_allowed(user_id)

# Usage Examples

# Fixed window: 10 requests per minute
limiter1 = RateLimiter(FixedWindowCounter(max_requests=10, window_seconds=60))

# Sliding window: 100 requests per hour
limiter2 = RateLimiter(SlidingWindowLog(max_requests=100, window_seconds=3600))

# Token bucket: 50 capacity, refill 10/second
limiter3 = RateLimiter(TokenBucket(capacity=50, refill_rate=10))

# Test
user_id = "user123"
for i in range(15):
    allowed = limiter1.allow_request(user_id)
    print(f"Request {i+1}: {'✅ Allowed' if allowed else '❌ Rate limited'}")
```

### Design Considerations

**OOP Principles:**
- Strategy Pattern: Different rate limiting algorithms
- Single Responsibility: Each strategy handles one algorithm
- Open/Closed: Easy to add new strategies

**Scalability:**
- Use Redis for distributed rate limiting
- Store counters in memory cache
- Use sorted sets for sliding window

---

## Question 3: Design a Cache System (LRU Cache)

### Requirements
- Fixed capacity
- Get and Put operations in O(1)
- Evict least recently used when full

### Solution Approach

```python
class Node:
    """Doubly linked list node"""
    def __init__(self, key, value):
        self.key = key
        self.value = value
        self.prev = None
        self.next = None

class LRUCache:
    """LRU Cache using HashMap + Doubly Linked List"""
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = {}  # key -> Node
        
        # Dummy head and tail for easy manipulation
        self.head = Node(0, 0)
        self.tail = Node(0, 0)
        self.head.next = self.tail
        self.tail.prev = self.head
    
    def get(self, key):
        """Get value and mark as recently used"""
        if key in self.cache:
            node = self.cache[key]
            self._remove(node)
            self._add_to_front(node)
            return node.value
        return -1
    
    def put(self, key, value):
        """Put key-value pair"""
        if key in self.cache:
            # Update existing
            node = self.cache[key]
            node.value = value
            self._remove(node)
            self._add_to_front(node)
        else:
            # Add new
            if len(self.cache) >= self.capacity:
                # Evict LRU (tail.prev)
                lru = self.tail.prev
                self._remove(lru)
                del self.cache[lru.key]
            
            node = Node(key, value)
            self._add_to_front(node)
            self.cache[key] = node
    
    def _remove(self, node):
        """Remove node from linked list"""
        prev_node = node.prev
        next_node = node.next
        prev_node.next = next_node
        next_node.prev = prev_node
    
    def _add_to_front(self, node):
        """Add node right after head (most recently used)"""
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node
    
    def display(self):
        """Display cache contents (for debugging)"""
        current = self.head.next
        items = []
        while current != self.tail:
            items.append(f"{current.key}:{current.value}")
            current = current.next
        print(f"Cache: [{' -> '.join(items)}]")

# Usage
cache = LRUCache(capacity=3)

cache.put(1, "one")
cache.put(2, "two")
cache.put(3, "three")
cache.display()  # [3:three -> 2:two -> 1:one]

print(cache.get(1))  # "one" - moves 1 to front
cache.display()  # [1:one -> 3:three -> 2:two]

cache.put(4, "four")  # Evicts 2 (LRU)
cache.display()  # [4:four -> 1:one -> 3:three]

print(cache.get(2))  # -1 (not found)
```

### Design Considerations

**Time Complexity:**
- Get: O(1)
- Put: O(1)
- Both operations use HashMap for lookup and linked list for ordering

**OOP Principles:**
- Encapsulation: Internal data structure hidden
- Single Responsibility: Node handles data, LRUCache handles caching logic

**Extensions:**
- Add TTL (Time To Live) for entries
- Thread-safe version with locks
- Different eviction policies (LFU, FIFO)

---

## Question 4: Design a Notification System

### Requirements
- Multiple notification types (Email, SMS, Push)
- Priority levels
- Retry mechanism for failures
- User preferences

### Solution Approach

```python
from abc import ABC, abstractmethod
from enum import Enum
from queue import PriorityQueue
from datetime import datetime

class NotificationType(Enum):
    EMAIL = "email"
    SMS = "sms"
    PUSH = "push"

class Priority(Enum):
    LOW = 3
    MEDIUM = 2
    HIGH = 1
    CRITICAL = 0

class Notification:
    """Notification entity"""
    def __init__(self, user_id, notification_type, message, priority=Priority.MEDIUM):
        self.notification_id = id(self)
        self.user_id = user_id
        self.type = notification_type
        self.message = message
        self.priority = priority
        self.created_at = datetime.now()
        self.retry_count = 0
        self.max_retries = 3
    
    def __lt__(self, other):
        # For priority queue
        return self.priority.value < other.priority.value

class NotificationChannel(ABC):
    """Strategy pattern for different channels"""
    @abstractmethod
    def send(self, user, message):
        pass

class EmailChannel(NotificationChannel):
    def send(self, user, message):
        print(f"📧 Sending email to {user.email}: {message}")
        # Actual email sending logic
        return True

class SMSChannel(NotificationChannel):
    def send(self, user, message):
        print(f"📱 Sending SMS to {user.phone}: {message}")
        # Actual SMS sending logic
        return True

class PushChannel(NotificationChannel):
    def send(self, user, message):
        print(f"🔔 Sending push to {user.device_id}: {message}")
        # Actual push notification logic
        return True

class User:
    def __init__(self, user_id, name, email, phone, device_id):
        self.user_id = user_id
        self.name = name
        self.email = email
        self.phone = phone
        self.device_id = device_id
        self.preferences = {
            NotificationType.EMAIL: True,
            NotificationType.SMS: True,
            NotificationType.PUSH: True
        }
    
    def set_preference(self, notification_type, enabled):
        self.preferences[notification_type] = enabled

class NotificationService:
    """Main notification service"""
    def __init__(self):
        self.channels = {
            NotificationType.EMAIL: EmailChannel(),
            NotificationType.SMS: SMSChannel(),
            NotificationType.PUSH: PushChannel()
        }
        self.queue = PriorityQueue()
        self.users = {}
        self.failed_notifications = []
    
    def register_user(self, user):
        self.users[user.user_id] = user
    
    def send_notification(self, notification):
        """Add notification to priority queue"""
        self.queue.put(notification)
    
    def process_notifications(self):
        """Process notifications from queue"""
        while not self.queue.empty():
            notification = self.queue.get()
            self._send(notification)
    
    def _send(self, notification):
        user = self.users.get(notification.user_id)
        if not user:
            print(f"❌ User {notification.user_id} not found")
            return
        
        # Check user preferences
        if not user.preferences.get(notification.type, False):
            print(f"⚠️ User {user.name} disabled {notification.type.value} notifications")
            return
        
        # Send notification
        channel = self.channels[notification.type]
        try:
            success = channel.send(user, notification.message)
            if success:
                print(f"✅ Notification {notification.notification_id} sent successfully")
            else:
                self._handle_failure(notification)
        except Exception as e:
            print(f"❌ Error sending notification: {e}")
            self._handle_failure(notification)
    
    def _handle_failure(self, notification):
        """Retry logic"""
        notification.retry_count += 1
        
        if notification.retry_count < notification.max_retries:
            print(f"🔄 Retrying notification {notification.notification_id} (attempt {notification.retry_count})")
            self.queue.put(notification)
        else:
            print(f"❌ Notification {notification.notification_id} failed after {notification.max_retries} retries")
            self.failed_notifications.append(notification)

# Usage
service = NotificationService()

# Register users
user1 = User("u1", "Alice", "alice@example.com", "+1234567890", "device123")
user2 = User("u2", "Bob", "bob@example.com", "+0987654321", "device456")

service.register_user(user1)
service.register_user(user2)

# User preferences
user2.set_preference(NotificationType.SMS, False)

# Send notifications with different priorities
service.send_notification(Notification("u1", NotificationType.EMAIL, "Low priority alert", Priority.LOW))
service.send_notification(Notification("u1", NotificationType.PUSH, "CRITICAL: System down!", Priority.CRITICAL))
service.send_notification(Notification("u2", NotificationType.SMS, "Medium priority", Priority.MEDIUM))
service.send_notification(Notification("u2", NotificationType.EMAIL, "High priority", Priority.HIGH))

# Process all notifications (CRITICAL processed first)
service.process_notifications()
```

### Design Patterns Used

1. **Strategy Pattern** - Different notification channels
2. **Priority Queue** - Handle priority levels
3. **Observer Pattern** - Could extend for event-driven notifications

---

## Interview Tips for System Design

### 1. Clarify Requirements
- Ask about scale (users, requests per second)
- Clarify functional requirements
- Ask about non-functional requirements (latency, availability)

### 2. Start with High-Level Design
- Draw major components
- Explain data flow
- Identify bottlenecks

### 3. Apply OOP Principles
- Use design patterns where appropriate
- Follow SOLID principles
- Show extensibility

### 4. Discuss Trade-offs
- Performance vs Complexity
- Consistency vs Availability (CAP theorem)
- Read vs Write optimization

### 5. Consider Scalability
- Horizontal vs Vertical scaling
- Caching strategies
- Load balancing
- Database sharding

---

## Common System Design Patterns

| Pattern | Use Case | Example |
|---------|----------|---------|
| **Load Balancer** | Distribute traffic | Nginx, HAProxy |
| **Cache** | Reduce latency | Redis, Memcached |
| **Message Queue** | Async processing | RabbitMQ, Kafka |
| **Database Sharding** | Scale reads/writes | User ID hash sharding |
| **CDN** | Static content delivery | CloudFlare, Akamai |
| **Rate Limiting** | Prevent abuse | Token bucket, Sliding window |

---

[← Back to Coding Challenges](02-coding-challenges.md) | [Next: Common Mistakes →](04-common-mistakes.md) | [↑ Back to README](../README.md)