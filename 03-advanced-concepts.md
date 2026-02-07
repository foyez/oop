# Chapter 3: Advanced Class Concepts

This chapter explores advanced features that give you more control and flexibility in designing class hierarchies.

---

## Table of Contents

- [1. Abstract Classes](#1-abstract-classes)
- [2. Interfaces](#2-interfaces)
- [3. Abstract Classes vs Interfaces](#3-abstract-classes-vs-interfaces)
- [4. Multiple Inheritance and Mixins](#4-multiple-inheritance-and-mixins)
- [5. The Diamond Problem](#5-the-diamond-problem)

---

## 1. Abstract Classes

**Abstract classes** are classes that cannot be instantiated directly and are designed to be inherited. They serve as templates for other classes and can contain both implemented methods and abstract methods (methods without implementation that must be implemented by child classes).

**Real-world analogy:** Think of a "Vehicle" blueprint at a car manufacturer. The blueprint defines that all vehicles must have an engine, wheels, and brakes, but it doesn't specify *how* each vehicle type implements these. You can't build a generic "Vehicle" - you build a Car, Truck, or Motorcycle based on the Vehicle blueprint.

### Key Characteristics:

- **Cannot be instantiated** directly
- **Can contain abstract methods** (no implementation)
- **Can contain concrete methods** (with implementation)
- **Forces child classes** to implement abstract methods
- **Provides shared functionality** through concrete methods

### When to Use Abstract Classes:

- When classes share common behavior but some details must differ
- When you want to enforce a contract while providing partial implementation
- When you need to use access modifiers (private, protected)
- When you want to share state (properties) among subclasses

<details>
<summary><strong>View Examples</strong></summary>

```typescript
// TypeScript - Content Management System

abstract class ContentItem {
  protected id: string;
  protected title: string;
  protected author: string;
  protected createdAt: Date;
  protected status: "draft" | "published" | "archived";
  protected views: number;

  constructor(id: string, title: string, author: string) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.createdAt = new Date();
    this.status = "draft";
    this.views = 0;
  }

  // Abstract methods - MUST be implemented by child classes
  abstract validate(): boolean;
  abstract render(): string;
  abstract getContentType(): string;
  abstract calculateReadTime(): number;

  // Concrete methods - shared by all content types
  public publish(): boolean {
    if (!this.validate()) {
      console.log("Validation failed. Cannot publish.");
      return false;
    }

    this.status = "published";
    console.log(`${this.getContentType()} "${this.title}" published successfully`);
    return true;
  }

  public archive(): void {
    this.status = "archived";
    console.log(`${this.getContentType()} "${this.title}" archived`);
  }

  public incrementViews(): void {
    this.views++;
  }

  public getMetadata(): object {
    return {
      id: this.id,
      title: this.title,
      author: this.author,
      createdAt: this.createdAt,
      status: this.status,
      views: this.views,
      type: this.getContentType(),
      readTime: this.calculateReadTime()
    };
  }

  protected isPublished(): boolean {
    return this.status === "published";
  }
}

// Concrete class 1: Article
class Article extends ContentItem {
  private content: string;
  private category: string;
  private tags: string[];

  constructor(id: string, title: string, author: string, content: string, category: string) {
    super(id, title, author);
    this.content = content;
    this.category = category;
    this.tags = [];
  }

  validate(): boolean {
    // Articles must have title, content, and category
    if (!this.title || this.title.length < 5) {
      console.log("Title must be at least 5 characters");
      return false;
    }

    if (!this.content || this.content.length < 100) {
      console.log("Content must be at least 100 characters");
      return false;
    }

    if (!this.category) {
      console.log("Category is required");
      return false;
    }

    return true;
  }

  render(): string {
    return `
      <article>
        <h1>${this.title}</h1>
        <p class="meta">By ${this.author} | ${this.category} | ${this.calculateReadTime()} min read</p>
        <div class="content">${this.content}</div>
        <div class="tags">${this.tags.join(", ")}</div>
      </article>
    `;
  }

  getContentType(): string {
    return "Article";
  }

  calculateReadTime(): number {
    // Average reading speed: 200 words per minute
    const wordCount = this.content.split(/\s+/).length;
    return Math.ceil(wordCount / 200);
  }

  addTag(tag: string): void {
    this.tags.push(tag);
  }
}

// Concrete class 2: Video
class Video extends ContentItem {
  private videoUrl: string;
  private duration: number; // in seconds
  private thumbnailUrl: string;
  private resolution: string;

  constructor(
    id: string,
    title: string,
    author: string,
    videoUrl: string,
    duration: number,
    thumbnailUrl: string,
    resolution: string
  ) {
    super(id, title, author);
    this.videoUrl = videoUrl;
    this.duration = duration;
    this.thumbnailUrl = thumbnailUrl;
    this.resolution = resolution;
  }

  validate(): boolean {
    if (!this.title || this.title.length < 3) {
      console.log("Title must be at least 3 characters");
      return false;
    }

    if (!this.videoUrl) {
      console.log("Video URL is required");
      return false;
    }

    if (this.duration <= 0) {
      console.log("Duration must be positive");
      return false;
    }

    return true;
  }

  render(): string {
    const readTime = this.calculateReadTime();
    return `
      <div class="video">
        <h1>${this.title}</h1>
        <p class="meta">By ${this.author} | ${readTime} min | ${this.resolution}</p>
        <video src="${this.videoUrl}" poster="${this.thumbnailUrl}" controls></video>
      </div>
    `;
  }

  getContentType(): string {
    return "Video";
  }

  calculateReadTime(): number {
    // Videos: duration in minutes
    return Math.ceil(this.duration / 60);
  }

  getDuration(): number {
    return this.duration;
  }
}

// Concrete class 3: Podcast
class Podcast extends ContentItem {
  private audioUrl: string;
  private duration: number; // in seconds
  private episodeNumber: number;
  private seriesName: string;
  private transcript?: string;

  constructor(
    id: string,
    title: string,
    author: string,
    audioUrl: string,
    duration: number,
    episodeNumber: number,
    seriesName: string
  ) {
    super(id, title, author);
    this.audioUrl = audioUrl;
    this.duration = duration;
    this.episodeNumber = episodeNumber;
    this.seriesName = seriesName;
  }

  validate(): boolean {
    if (!this.title || this.title.length < 3) {
      console.log("Title must be at least 3 characters");
      return false;
    }

    if (!this.audioUrl) {
      console.log("Audio URL is required");
      return false;
    }

    if (this.episodeNumber <= 0) {
      console.log("Episode number must be positive");
      return false;
    }

    return true;
  }

  render(): string {
    const readTime = this.calculateReadTime();
    return `
      <div class="podcast">
        <h1>${this.seriesName} - Episode ${this.episodeNumber}: ${this.title}</h1>
        <p class="meta">By ${this.author} | ${readTime} min</p>
        <audio src="${this.audioUrl}" controls></audio>
        ${this.transcript ? `<div class="transcript">${this.transcript}</div>` : ''}
      </div>
    `;
  }

  getContentType(): string {
    return "Podcast";
  }

  calculateReadTime(): number {
    return Math.ceil(this.duration / 60);
  }

  addTranscript(transcript: string): void {
    this.transcript = transcript;
  }
}

// ContentManager works with any ContentItem
class ContentManager {
  private content: ContentItem[] = [];

  addContent(item: ContentItem): void {
    this.content.push(item);
    console.log(`Added ${item.getContentType()}: ${item.getMetadata()["title"]}`);
  }

  publishAll(): void {
    console.log("\n=== Publishing all content ===");
    this.content.forEach(item => {
      item.publish();
    });
  }

  getContentReport(): void {
    console.log("\n=== Content Report ===");
    this.content.forEach(item => {
      const metadata = item.getMetadata();
      console.log(`\n${metadata["type"]}: ${metadata["title"]}`);
      console.log(`  Author: ${metadata["author"]}`);
      console.log(`  Status: ${metadata["status"]}`);
      console.log(`  Views: ${metadata["views"]}`);
      console.log(`  Read Time: ${metadata["readTime"]} minutes`);
    });
  }
}

// Usage
const cms = new ContentManager();

const article = new Article(
  "ART001",
  "Understanding TypeScript Abstract Classes",
  "John Doe",
  "Abstract classes are powerful features... ".repeat(50),
  "Programming"
);
article.addTag("TypeScript");
article.addTag("OOP");

const video = new Video(
  "VID001",
  "TypeScript Tutorial for Beginners",
  "Jane Smith",
  "https://example.com/video.mp4",
  1800, // 30 minutes
  "https://example.com/thumb.jpg",
  "1080p"
);

const podcast = new Podcast(
  "POD001",
  "The Future of Web Development",
  "Tech Talk Team",
  "https://example.com/podcast.mp3",
  2400, // 40 minutes
  15,
  "Developer Insights"
);

cms.addContent(article);
cms.addContent(video);
cms.addContent(podcast);

cms.publishAll();
cms.getContentReport();

// Cannot instantiate abstract class
// const content = new ContentItem("ID", "Title", "Author"); // ❌ Error
```

```python
# Python - Content Management System
from abc import ABC, abstractmethod
from datetime import datetime
from typing import List, Dict, Any

class ContentItem(ABC):
    def __init__(self, item_id: str, title: str, author: str):
        self._id = item_id
        self._title = title
        self._author = author
        self._created_at = datetime.now()
        self._status = "draft"
        self._views = 0
    
    # Abstract methods - MUST be implemented by child classes
    @abstractmethod
    def validate(self) -> bool:
        pass
    
    @abstractmethod
    def render(self) -> str:
        pass
    
    @abstractmethod
    def get_content_type(self) -> str:
        pass
    
    @abstractmethod
    def calculate_read_time(self) -> int:
        pass
    
    # Concrete methods - shared by all content types
    def publish(self) -> bool:
        if not self.validate():
            print("Validation failed. Cannot publish.")
            return False
        
        self._status = "published"
        print(f'{self.get_content_type()} "{self._title}" published successfully')
        return True
    
    def archive(self) -> None:
        self._status = "archived"
        print(f'{self.get_content_type()} "{self._title}" archived')
    
    def increment_views(self) -> None:
        self._views += 1
    
    def get_metadata(self) -> Dict[str, Any]:
        return {
            'id': self._id,
            'title': self._title,
            'author': self._author,
            'created_at': self._created_at,
            'status': self._status,
            'views': self._views,
            'type': self.get_content_type(),
            'read_time': self.calculate_read_time()
        }
    
    def _is_published(self) -> bool:
        return self._status == "published"

# Concrete class 1: Article
class Article(ContentItem):
    def __init__(self, item_id: str, title: str, author: str, content: str, category: str):
        super().__init__(item_id, title, author)
        self.__content = content
        self.__category = category
        self.__tags = []
    
    def validate(self) -> bool:
        if not self._title or len(self._title) < 5:
            print("Title must be at least 5 characters")
            return False
        
        if not self.__content or len(self.__content) < 100:
            print("Content must be at least 100 characters")
            return False
        
        if not self.__category:
            print("Category is required")
            return False
        
        return True
    
    def render(self) -> str:
        return f"""
      <article>
        <h1>{self._title}</h1>
        <p class="meta">By {self._author} | {self.__category} | {self.calculate_read_time()} min read</p>
        <div class="content">{self.__content}</div>
        <div class="tags">{', '.join(self.__tags)}</div>
      </article>
    """
    
    def get_content_type(self) -> str:
        return "Article"
    
    def calculate_read_time(self) -> int:
        word_count = len(self.__content.split())
        return max(1, word_count // 200)
    
    def add_tag(self, tag: str) -> None:
        self.__tags.append(tag)

# Concrete class 2: Video
class Video(ContentItem):
    def __init__(self, item_id: str, title: str, author: str, video_url: str,
                 duration: int, thumbnail_url: str, resolution: str):
        super().__init__(item_id, title, author)
        self.__video_url = video_url
        self.__duration = duration
        self.__thumbnail_url = thumbnail_url
        self.__resolution = resolution
    
    def validate(self) -> bool:
        if not self._title or len(self._title) < 3:
            print("Title must be at least 3 characters")
            return False
        
        if not self.__video_url:
            print("Video URL is required")
            return False
        
        if self.__duration <= 0:
            print("Duration must be positive")
            return False
        
        return True
    
    def render(self) -> str:
        read_time = self.calculate_read_time()
        return f"""
      <div class="video">
        <h1>{self._title}</h1>
        <p class="meta">By {self._author} | {read_time} min | {self.__resolution}</p>
        <video src="{self.__video_url}" poster="{self.__thumbnail_url}" controls></video>
      </div>
    """
    
    def get_content_type(self) -> str:
        return "Video"
    
    def calculate_read_time(self) -> int:
        return max(1, self.__duration // 60)
    
    def get_duration(self) -> int:
        return self.__duration

# Concrete class 3: Podcast
class Podcast(ContentItem):
    def __init__(self, item_id: str, title: str, author: str, audio_url: str,
                 duration: int, episode_number: int, series_name: str):
        super().__init__(item_id, title, author)
        self.__audio_url = audio_url
        self.__duration = duration
        self.__episode_number = episode_number
        self.__series_name = series_name
        self.__transcript = None
    
    def validate(self) -> bool:
        if not self._title or len(self._title) < 3:
            print("Title must be at least 3 characters")
            return False
        
        if not self.__audio_url:
            print("Audio URL is required")
            return False
        
        if self.__episode_number <= 0:
            print("Episode number must be positive")
            return False
        
        return True
    
    def render(self) -> str:
        read_time = self.calculate_read_time()
        transcript_html = f'<div class="transcript">{self.__transcript}</div>' if self.__transcript else ''
        return f"""
      <div class="podcast">
        <h1>{self.__series_name} - Episode {self.__episode_number}: {self._title}</h1>
        <p class="meta">By {self._author} | {read_time} min</p>
        <audio src="{self.__audio_url}" controls></audio>
        {transcript_html}
      </div>
    """
    
    def get_content_type(self) -> str:
        return "Podcast"
    
    def calculate_read_time(self) -> int:
        return max(1, self.__duration // 60)
    
    def add_transcript(self, transcript: str) -> None:
        self.__transcript = transcript

# ContentManager works with any ContentItem
class ContentManager:
    def __init__(self):
        self.__content: List[ContentItem] = []
    
    def add_content(self, item: ContentItem) -> None:
        self.__content.append(item)
        print(f"Added {item.get_content_type()}: {item.get_metadata()['title']}")
    
    def publish_all(self) -> None:
        print("\n=== Publishing all content ===")
        for item in self.__content:
            item.publish()
    
    def get_content_report(self) -> None:
        print("\n=== Content Report ===")
        for item in self.__content:
            metadata = item.get_metadata()
            print(f"\n{metadata['type']}: {metadata['title']}")
            print(f"  Author: {metadata['author']}")
            print(f"  Status: {metadata['status']}")
            print(f"  Views: {metadata['views']}")
            print(f"  Read Time: {metadata['read_time']} minutes")

# Usage
cms = ContentManager()

article = Article(
    "ART001",
    "Understanding Python Abstract Classes",
    "John Doe",
    "Abstract classes are powerful features... " * 50,
    "Programming"
)
article.add_tag("Python")
article.add_tag("OOP")

video = Video(
    "VID001",
    "Python Tutorial for Beginners",
    "Jane Smith",
    "https://example.com/video.mp4",
    1800,
    "https://example.com/thumb.jpg",
    "1080p"
)

podcast = Podcast(
    "POD001",
    "The Future of Web Development",
    "Tech Talk Team",
    "https://example.com/podcast.mp3",
    2400,
    15,
    "Developer Insights"
)

cms.add_content(article)
cms.add_content(video)
cms.add_content(podcast)

cms.publish_all()
cms.get_content_report()

# Cannot instantiate abstract class
# content = ContentItem("ID", "Title", "Author")  # ❌ TypeError
```

</details>

---

## 2. Interfaces

**Interfaces** define a contract - a set of method signatures that a class must implement - without providing any implementation. They describe **what** a class should do, not **how** it should do it.

**Real-world analogy:** Think of electrical outlets. Different devices (phone chargers, laptops, lamps) all "implement" the outlet interface - they have compatible plugs. The outlet doesn't care what device you plug in, as long as it follows the interface contract.

### Key Characteristics:

- **Pure contract** - no implementation (TypeScript allows some flexibility)
- **Multiple interfaces** can be implemented by a single class
- **No state** - only method signatures (in pure interfaces)
- **Loose coupling** - depend on interfaces, not concrete classes

### TypeScript vs Python:

- **TypeScript**: Has first-class `interface` keyword
- **Python**: Uses abstract base classes with all abstract methods (Protocol for duck typing)

<details>
<summary><strong>View Examples</strong></summary>

```typescript
// TypeScript - Payment Gateway Integration

// Interface definitions
interface PaymentGateway {
  processPayment(amount: number, currency: string): Promise<PaymentResult>;
  refundPayment(transactionId: string, amount: number): Promise<RefundResult>;
  getTransactionStatus(transactionId: string): Promise<TransactionStatus>;
  validateCredentials(): boolean;
}

interface PaymentResult {
  success: boolean;
  transactionId: string;
  message: string;
  timestamp: Date;
}

interface RefundResult {
  success: boolean;
  refundId: string;
  message: string;
}

interface TransactionStatus {
  transactionId: string;
  status: "pending" | "completed" | "failed" | "refunded";
  amount: number;
  currency: string;
}

// Concrete implementation 1: Stripe
class StripeGateway implements PaymentGateway {
  private apiKey: string;
  private apiVersion: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.apiVersion = "2023-10-16";
  }

  async processPayment(amount: number, currency: string): Promise<PaymentResult> {
    console.log(`[Stripe] Processing payment: ${amount} ${currency}`);
    
    // Simulate API call
    const transactionId = `stripe_${Date.now()}`;
    
    return {
      success: true,
      transactionId,
      message: "Payment processed via Stripe",
      timestamp: new Date()
    };
  }

  async refundPayment(transactionId: string, amount: number): Promise<RefundResult> {
    console.log(`[Stripe] Refunding transaction ${transactionId}: ${amount}`);
    
    return {
      success: true,
      refundId: `refund_${Date.now()}`,
      message: "Refund processed via Stripe"
    };
  }

  async getTransactionStatus(transactionId: string): Promise<TransactionStatus> {
    console.log(`[Stripe] Checking status for ${transactionId}`);
    
    return {
      transactionId,
      status: "completed",
      amount: 100,
      currency: "USD"
    };
  }

  validateCredentials(): boolean {
    return this.apiKey.startsWith("sk_");
  }
}

// Concrete implementation 2: PayPal
class PayPalGateway implements PaymentGateway {
  private clientId: string;
  private clientSecret: string;
  private sandbox: boolean;

  constructor(clientId: string, clientSecret: string, sandbox: boolean = false) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.sandbox = sandbox;
  }

  async processPayment(amount: number, currency: string): Promise<PaymentResult> {
    const env = this.sandbox ? "sandbox" : "live";
    console.log(`[PayPal ${env}] Processing payment: ${amount} ${currency}`);
    
    const transactionId = `paypal_${Date.now()}`;
    
    return {
      success: true,
      transactionId,
      message: "Payment processed via PayPal",
      timestamp: new Date()
    };
  }

  async refundPayment(transactionId: string, amount: number): Promise<RefundResult> {
    console.log(`[PayPal] Refunding transaction ${transactionId}: ${amount}`);
    
    return {
      success: true,
      refundId: `refund_${Date.now()}`,
      message: "Refund processed via PayPal"
    };
  }

  async getTransactionStatus(transactionId: string): Promise<TransactionStatus> {
    console.log(`[PayPal] Checking status for ${transactionId}`);
    
    return {
      transactionId,
      status: "completed",
      amount: 100,
      currency: "USD"
    };
  }

  validateCredentials(): boolean {
    return this.clientId.length > 0 && this.clientSecret.length > 0;
  }
}

// Concrete implementation 3: Square
class SquareGateway implements PaymentGateway {
  private accessToken: string;
  private locationId: string;

  constructor(accessToken: string, locationId: string) {
    this.accessToken = accessToken;
    this.locationId = locationId;
  }

  async processPayment(amount: number, currency: string): Promise<PaymentResult> {
    console.log(`[Square] Processing payment at location ${this.locationId}: ${amount} ${currency}`);
    
    const transactionId = `square_${Date.now()}`;
    
    return {
      success: true,
      transactionId,
      message: "Payment processed via Square",
      timestamp: new Date()
    };
  }

  async refundPayment(transactionId: string, amount: number): Promise<RefundResult> {
    console.log(`[Square] Refunding transaction ${transactionId}: ${amount}`);
    
    return {
      success: true,
      refundId: `refund_${Date.now()}`,
      message: "Refund processed via Square"
    };
  }

  async getTransactionStatus(transactionId: string): Promise<TransactionStatus> {
    console.log(`[Square] Checking status for ${transactionId}`);
    
    return {
      transactionId,
      status: "completed",
      amount: 100,
      currency: "USD"
    };
  }

  validateCredentials(): boolean {
    return this.accessToken.length > 0;
  }
}

// Additional interfaces for extended functionality
interface RecurringPayment {
  setupSubscription(customerId: string, planId: string): Promise<string>;
  cancelSubscription(subscriptionId: string): Promise<boolean>;
}

interface FraudDetection {
  analyzeTransaction(amount: number, customerId: string): Promise<FraudScore>;
}

interface FraudScore {
  score: number; // 0-100
  riskLevel: "low" | "medium" | "high";
  requiresReview: boolean;
}

// Class implementing multiple interfaces
class EnhancedStripeGateway extends StripeGateway implements RecurringPayment, FraudDetection {
  async setupSubscription(customerId: string, planId: string): Promise<string> {
    console.log(`[Stripe] Setting up subscription for ${customerId} on plan ${planId}`);
    return `sub_${Date.now()}`;
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    console.log(`[Stripe] Canceling subscription ${subscriptionId}`);
    return true;
  }

  async analyzeTransaction(amount: number, customerId: string): Promise<FraudScore> {
    console.log(`[Stripe Radar] Analyzing transaction for ${customerId}: $${amount}`);
    
    // Simulate fraud detection
    const score = Math.random() * 100;
    
    return {
      score,
      riskLevel: score > 70 ? "high" : score > 40 ? "medium" : "low",
      requiresReview: score > 70
    };
  }
}

// Payment processor that works with any PaymentGateway
class PaymentProcessor {
  private gateway: PaymentGateway;

  constructor(gateway: PaymentGateway) {
    this.gateway = gateway;
  }

  // Can switch gateways at runtime
  setGateway(gateway: PaymentGateway): void {
    this.gateway = gateway;
  }

  async processOrder(orderId: string, amount: number, currency: string): Promise<void> {
    console.log(`\n=== Processing order ${orderId} ===`);

    if (!this.gateway.validateCredentials()) {
      console.log("❌ Invalid gateway credentials");
      return;
    }

    const result = await this.gateway.processPayment(amount, currency);
    
    if (result.success) {
      console.log(`✓ Order ${orderId} processed successfully`);
      console.log(`  Transaction ID: ${result.transactionId}`);
      console.log(`  Timestamp: ${result.timestamp}`);
    } else {
      console.log(`❌ Order ${orderId} failed: ${result.message}`);
    }
  }

  async processRefund(transactionId: string, amount: number): Promise<void> {
    console.log(`\n=== Processing refund ===`);
    const result = await this.gateway.refundPayment(transactionId, amount);
    
    if (result.success) {
      console.log(`✓ Refund processed successfully`);
      console.log(`  Refund ID: ${result.refundId}`);
    } else {
      console.log(`❌ Refund failed: ${result.message}`);
    }
  }
}

// Usage - same code works with any gateway
(async () => {
  const processor = new PaymentProcessor(
    new StripeGateway("sk_test_abc123")
  );

  await processor.processOrder("ORD001", 299.99, "USD");

  // Switch to PayPal
  processor.setGateway(new PayPalGateway("client_id", "client_secret", true));
  await processor.processOrder("ORD002", 149.99, "USD");

  // Switch to Square
  processor.setGateway(new SquareGateway("access_token", "location_123"));
  await processor.processOrder("ORD003", 89.99, "USD");

  // Using enhanced gateway with multiple interfaces
  const enhancedGateway = new EnhancedStripeGateway("sk_test_enhanced");
  const fraudScore = await enhancedGateway.analyzeTransaction(1000, "CUST001");
  console.log(`\nFraud Score: ${fraudScore.score.toFixed(2)} (${fraudScore.riskLevel} risk)`);
})();
```

```python
# Python - Payment Gateway Integration
from abc import ABC, abstractmethod
from datetime import datetime
from typing import Dict, Any
import asyncio

# Interface definitions using ABC
class PaymentGateway(ABC):
    @abstractmethod
    async def process_payment(self, amount: float, currency: str) -> Dict[str, Any]:
        pass
    
    @abstractmethod
    async def refund_payment(self, transaction_id: str, amount: float) -> Dict[str, Any]:
        pass
    
    @abstractmethod
    async def get_transaction_status(self, transaction_id: str) -> Dict[str, Any]:
        pass
    
    @abstractmethod
    def validate_credentials(self) -> bool:
        pass

# Concrete implementation 1: Stripe
class StripeGateway(PaymentGateway):
    def __init__(self, api_key: str):
        self._api_key = api_key
        self._api_version = "2023-10-16"
    
    async def process_payment(self, amount: float, currency: str) -> Dict[str, Any]:
        print(f"[Stripe] Processing payment: {amount} {currency}")
        
        transaction_id = f"stripe_{int(datetime.now().timestamp())}"
        
        return {
            'success': True,
            'transaction_id': transaction_id,
            'message': "Payment processed via Stripe",
            'timestamp': datetime.now()
        }
    
    async def refund_payment(self, transaction_id: str, amount: float) -> Dict[str, Any]:
        print(f"[Stripe] Refunding transaction {transaction_id}: {amount}")
        
        return {
            'success': True,
            'refund_id': f"refund_{int(datetime.now().timestamp())}",
            'message': "Refund processed via Stripe"
        }
    
    async def get_transaction_status(self, transaction_id: str) -> Dict[str, Any]:
        print(f"[Stripe] Checking status for {transaction_id}")
        
        return {
            'transaction_id': transaction_id,
            'status': "completed",
            'amount': 100,
            'currency': "USD"
        }
    
    def validate_credentials(self) -> bool:
        return self._api_key.startswith("sk_")

# Concrete implementation 2: PayPal
class PayPalGateway(PaymentGateway):
    def __init__(self, client_id: str, client_secret: str, sandbox: bool = False):
        self._client_id = client_id
        self._client_secret = client_secret
        self._sandbox = sandbox
    
    async def process_payment(self, amount: float, currency: str) -> Dict[str, Any]:
        env = "sandbox" if self._sandbox else "live"
        print(f"[PayPal {env}] Processing payment: {amount} {currency}")
        
        transaction_id = f"paypal_{int(datetime.now().timestamp())}"
        
        return {
            'success': True,
            'transaction_id': transaction_id,
            'message': "Payment processed via PayPal",
            'timestamp': datetime.now()
        }
    
    async def refund_payment(self, transaction_id: str, amount: float) -> Dict[str, Any]:
        print(f"[PayPal] Refunding transaction {transaction_id}: {amount}")
        
        return {
            'success': True,
            'refund_id': f"refund_{int(datetime.now().timestamp())}",
            'message': "Refund processed via PayPal"
        }
    
    async def get_transaction_status(self, transaction_id: str) -> Dict[str, Any]:
        print(f"[PayPal] Checking status for {transaction_id}")
        
        return {
            'transaction_id': transaction_id,
            'status': "completed",
            'amount': 100,
            'currency': "USD"
        }
    
    def validate_credentials(self) -> bool:
        return len(self._client_id) > 0 and len(self._client_secret) > 0

# Concrete implementation 3: Square
class SquareGateway(PaymentGateway):
    def __init__(self, access_token: str, location_id: str):
        self._access_token = access_token
        self._location_id = location_id
    
    async def process_payment(self, amount: float, currency: str) -> Dict[str, Any]:
        print(f"[Square] Processing payment at location {self._location_id}: {amount} {currency}")
        
        transaction_id = f"square_{int(datetime.now().timestamp())}"
        
        return {
            'success': True,
            'transaction_id': transaction_id,
            'message': "Payment processed via Square",
            'timestamp': datetime.now()
        }
    
    async def refund_payment(self, transaction_id: str, amount: float) -> Dict[str, Any]:
        print(f"[Square] Refunding transaction {transaction_id}: {amount}")
        
        return {
            'success': True,
            'refund_id': f"refund_{int(datetime.now().timestamp())}",
            'message': "Refund processed via Square"
        }
    
    async def get_transaction_status(self, transaction_id: str) -> Dict[str, Any]:
        print(f"[Square] Checking status for {transaction_id}")
        
        return {
            'transaction_id': transaction_id,
            'status': "completed",
            'amount': 100,
            'currency': "USD"
        }
    
    def validate_credentials(self) -> bool:
        return len(self._access_token) > 0

# Additional interfaces
class RecurringPayment(ABC):
    @abstractmethod
    async def setup_subscription(self, customer_id: str, plan_id: str) -> str:
        pass
    
    @abstractmethod
    async def cancel_subscription(self, subscription_id: str) -> bool:
        pass

class FraudDetection(ABC):
    @abstractmethod
    async def analyze_transaction(self, amount: float, customer_id: str) -> Dict[str, Any]:
        pass

# Class implementing multiple interfaces
class EnhancedStripeGateway(StripeGateway, RecurringPayment, FraudDetection):
    async def setup_subscription(self, customer_id: str, plan_id: str) -> str:
        print(f"[Stripe] Setting up subscription for {customer_id} on plan {plan_id}")
        return f"sub_{int(datetime.now().timestamp())}"
    
    async def cancel_subscription(self, subscription_id: str) -> bool:
        print(f"[Stripe] Canceling subscription {subscription_id}")
        return True
    
    async def analyze_transaction(self, amount: float, customer_id: str) -> Dict[str, Any]:
        print(f"[Stripe Radar] Analyzing transaction for {customer_id}: ${amount}")
        
        import random
        score = random.random() * 100
        
        return {
            'score': score,
            'risk_level': "high" if score > 70 else "medium" if score > 40 else "low",
            'requires_review': score > 70
        }

# Payment processor
class PaymentProcessor:
    def __init__(self, gateway: PaymentGateway):
        self._gateway = gateway
    
    def set_gateway(self, gateway: PaymentGateway) -> None:
        self._gateway = gateway
    
    async def process_order(self, order_id: str, amount: float, currency: str) -> None:
        print(f"\n=== Processing order {order_id} ===")
        
        if not self._gateway.validate_credentials():
            print("❌ Invalid gateway credentials")
            return
        
        result = await self._gateway.process_payment(amount, currency)
        
        if result['success']:
            print(f"✓ Order {order_id} processed successfully")
            print(f"  Transaction ID: {result['transaction_id']}")
            print(f"  Timestamp: {result['timestamp']}")
        else:
            print(f"❌ Order {order_id} failed: {result['message']}")
    
    async def process_refund(self, transaction_id: str, amount: float) -> None:
        print(f"\n=== Processing refund ===")
        result = await self._gateway.refund_payment(transaction_id, amount)
        
        if result['success']:
            print(f"✓ Refund processed successfully")
            print(f"  Refund ID: {result['refund_id']}")
        else:
            print(f"❌ Refund failed: {result['message']}")

# Usage
async def main():
    processor = PaymentProcessor(StripeGateway("sk_test_abc123"))
    
    await processor.process_order("ORD001", 299.99, "USD")
    
    # Switch to PayPal
    processor.set_gateway(PayPalGateway("client_id", "client_secret", True))
    await processor.process_order("ORD002", 149.99, "USD")
    
    # Switch to Square
    processor.set_gateway(SquareGateway("access_token", "location_123"))
    await processor.process_order("ORD003", 89.99, "USD")
    
    # Using enhanced gateway
    enhanced_gateway = EnhancedStripeGateway("sk_test_enhanced")
    fraud_score = await enhanced_gateway.analyze_transaction(1000, "CUST001")
    print(f"\nFraud Score: {fraud_score['score']:.2f} ({fraud_score['risk_level']} risk)")

asyncio.run(main())
```

</details>

---

## Practice Questions - Part 1

<details>
<summary><strong>View Questions</strong></summary>

### Fill in the Blanks

1. __________ classes cannot be instantiated and are designed to be inherited by other classes.

2. An __________ defines a contract of methods that a class must implement without providing any implementation.

3. Abstract classes can contain both __________ methods (with implementation) and __________ methods (without implementation).

4. In TypeScript, a class can extend __________ abstract class(es) but can implement __________ interface(s).

5. The main difference between abstract classes and interfaces is that abstract classes can have __________ and __________, while interfaces only define __________.

<details>
<summary><strong>View Answers</strong></summary>

1. **Abstract** - They serve as templates/blueprints for other classes. You cannot create instances of abstract classes directly.

2. **interface** - Interfaces are pure contracts that specify what methods a class must have, without dictating how those methods work internally.

3. **concrete**, **abstract** - Abstract classes provide a mix: concrete methods for shared behavior and abstract methods that force children to implement specific functionality.

4. **one**, **multiple** - TypeScript supports single inheritance (one parent class) but multiple interface implementation, allowing flexible contracts without the diamond problem.

5. **implementation**, **state (properties)**, **method signatures (contracts)** - Abstract classes can provide partial implementation and store data, while interfaces are purely structural contracts.

</details>

---

### True/False

1. ⬜ You can create an instance of an abstract class directly.

2. ⬜ All methods in an abstract class must be abstract.

3. ⬜ In TypeScript, interfaces can contain method implementations.

4. ⬜ A class implementing an interface must provide implementations for all methods defined in that interface.

5. ⬜ Abstract classes are useful when you want to share both behavior and enforce certain methods in child classes.

6. ⬜ Interfaces are better than abstract classes in all situations.

<details>
<summary><strong>View Answers</strong></summary>

1. **False** - Abstract classes cannot be instantiated. They exist only to be inherited. Trying `new AbstractClass()` causes an error in TypeScript and Python.

2. **False** - Abstract classes can mix abstract methods (no implementation) with concrete methods (with implementation). This is their key advantage over interfaces - providing shared functionality while enforcing contracts.

3. **False** - In pure OOP, interfaces contain no implementation. TypeScript allows default implementations in interfaces but this is a language-specific feature. Generally, think of interfaces as pure contracts.

4. **True** - This is the contract guarantee. If a class says `implements PaymentGateway`, it MUST provide implementations for all methods in that interface, or it won't compile.

5. **True** - This is the perfect use case: when you have common behavior (concrete methods) that all subclasses share, but also want to enforce that each subclass implements certain specific methods (abstract methods).

6. **False** - Neither is universally better. Use abstract classes when you need to share implementation/state. Use interfaces when you only need to define contracts, especially when a class might need to implement multiple contracts.

</details>

---

### Multiple Choice

1. **When should you use an abstract class instead of an interface?**
   - A) When you need multiple inheritance
   - B) When you want to provide shared implementation along with enforcing contracts
   - C) When you need maximum flexibility
   - D) Always, abstract classes are superior

2. **What is the primary purpose of interfaces?**
   - A) To provide code reuse through inheritance
   - B) To store data
   - C) To define contracts that classes must fulfill
   - D) To improve performance

3. **In the payment gateway example, why are interfaces used?**
   - A) To make the code faster
   - B) To allow PaymentProcessor to work with any gateway implementation
   - C) To reduce memory usage
   - D) Because TypeScript requires them

4. **What happens if a class implements an interface but doesn't provide all required methods?**
   - A) The missing methods are automatically generated
   - B) Compilation/type-check error
   - C) Runtime error only
   - D) The code works but with warnings

<details>
<summary><strong>View Answers</strong></summary>

1. **B** - Abstract classes shine when you need to provide common functionality (concrete methods) while enforcing certain contracts (abstract methods). Example: ContentItem provides `publish()` but forces children to implement `validate()`.

2. **C** - Interfaces define "what" without "how". They're contracts that guarantee a class has certain methods, enabling polymorphism and loose coupling.

3. **B** - The interface allows PaymentProcessor to work with Stripe, PayPal, Square, or any future gateway - as long as they implement the PaymentGateway interface. This is dependency on abstraction, not concrete implementations.

4. **B** - TypeScript will show a compile-time error. Python will raise TypeError when you try to instantiate the class. This compile-time checking is valuable - it catches errors before runtime.

</details>

</details>

---

## 3. Abstract Classes vs Interfaces

This is one of the most common interview questions. Understanding when to use each is crucial for good design.

### Comparison Table

| Feature | Abstract Class | Interface |
|---------|---------------|-----------|
| **Can have implementation** | ✅ Yes (concrete methods) | ❌ No (pure contract)* |
| **Can have state (properties)** | ✅ Yes | ❌ No |
| **Can have constructors** | ✅ Yes | ❌ No |
| **Multiple inheritance** | ❌ No (single parent) | ✅ Yes (multiple interfaces) |
| **Access modifiers** | ✅ Yes (public/private/protected) | ❌ No (all public) |
| **When to use** | Share implementation + enforce contract | Pure contract only |
| **Relationship type** | IS-A (specialization) | CAN-DO (capability) |

*TypeScript allows default implementations in interfaces, but this is not standard OOP

### Decision Guide

**Use Abstract Classes when:**
- You have shared behavior across subclasses
- You need to maintain state (properties)
- You want to use access modifiers (private, protected)
- There's a clear IS-A relationship
- Example: `Animal` → `Dog`, `Cat` (all animals eat, sleep)

**Use Interfaces when:**
- You only need to define a contract
- You need multiple inheritance
- You want maximum flexibility
- Different classes with different purposes need the same capability
- Example: `Flyable` → `Bird`, `Airplane`, `Drone` (unrelated things that can fly)

<details>
<summary><strong>View Examples</strong></summary>

```typescript
// TypeScript - When to Use Abstract Class vs Interface

// ============================================
// Example 1: Use ABSTRACT CLASS
// Reason: Shared behavior + state + enforce contract
// ============================================

abstract class DatabaseConnection {
  protected connectionString: string;
  protected isConnected: boolean = false;
  protected maxRetries: number = 3;

  constructor(connectionString: string) {
    this.connectionString = connectionString;
  }

  // Shared concrete method - all databases need this
  public connect(): boolean {
    console.log(`Connecting to ${this.getDbType()}...`);
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      if (this.attemptConnection()) {
        this.isConnected = true;
        console.log(`✓ Connected to ${this.getDbType()}`);
        return true;
      }
      console.log(`Attempt ${attempt} failed, retrying...`);
    }
    
    console.log(`❌ Failed to connect to ${this.getDbType()}`);
    return false;
  }

  public disconnect(): void {
    if (this.isConnected) {
      this.performDisconnect();
      this.isConnected = false;
      console.log(`Disconnected from ${this.getDbType()}`);
    }
  }

  // Abstract methods - each DB implements differently
  protected abstract attemptConnection(): boolean;
  protected abstract performDisconnect(): void;
  protected abstract getDbType(): string;
  
  // Each DB type implements these differently
  public abstract executeQuery(query: string): Promise<any[]>;
  public abstract executeCommand(command: string): Promise<boolean>;
}

class PostgreSQLConnection extends DatabaseConnection {
  protected attemptConnection(): boolean {
    console.log("  PostgreSQL: Establishing TCP connection...");
    return true;
  }

  protected performDisconnect(): void {
    console.log("  PostgreSQL: Closing connection pool");
  }

  protected getDbType(): string {
    return "PostgreSQL";
  }

  public async executeQuery(query: string): Promise<any[]> {
    console.log(`PostgreSQL: Executing query: ${query}`);
    return [{ id: 1, name: "Result" }];
  }

  public async executeCommand(command: string): Promise<boolean> {
    console.log(`PostgreSQL: Executing command: ${command}`);
    return true;
  }
}

class MongoDBConnection extends DatabaseConnection {
  protected attemptConnection(): boolean {
    console.log("  MongoDB: Connecting to replica set...");
    return true;
  }

  protected performDisconnect(): void {
    console.log("  MongoDB: Closing all cursors");
  }

  protected getDbType(): string {
    return "MongoDB";
  }

  public async executeQuery(query: string): Promise<any[]> {
    console.log(`MongoDB: Executing find: ${query}`);
    return [{ _id: "abc", data: "Result" }];
  }

  public async executeCommand(command: string): Promise<boolean> {
    console.log(`MongoDB: Executing command: ${command}`);
    return true;
  }
}

// ============================================
// Example 2: Use INTERFACE
// Reason: Multiple unrelated classes need same capability
// ============================================

// Interfaces for capabilities
interface Serializable {
  serialize(): string;
  deserialize(data: string): void;
}

interface Cacheable {
  getCacheKey(): string;
  getCacheDuration(): number; // seconds
}

interface Searchable {
  getSearchableFields(): string[];
  matchesSearch(query: string): boolean;
}

// Unrelated classes can implement same interfaces
class User implements Serializable, Cacheable, Searchable {
  constructor(
    public id: string,
    public username: string,
    public email: string
  ) {}

  serialize(): string {
    return JSON.stringify({
      id: this.id,
      username: this.username,
      email: this.email
    });
  }

  deserialize(data: string): void {
    const obj = JSON.parse(data);
    this.id = obj.id;
    this.username = obj.username;
    this.email = obj.email;
  }

  getCacheKey(): string {
    return `user:${this.id}`;
  }

  getCacheDuration(): number {
    return 3600; // 1 hour
  }

  getSearchableFields(): string[] {
    return ["username", "email"];
  }

  matchesSearch(query: string): boolean {
    const lowerQuery = query.toLowerCase();
    return this.username.toLowerCase().includes(lowerQuery) ||
           this.email.toLowerCase().includes(lowerQuery);
  }
}

class Product implements Serializable, Cacheable, Searchable {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public price: number
  ) {}

  serialize(): string {
    return JSON.stringify({
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price
    });
  }

  deserialize(data: string): void {
    const obj = JSON.parse(data);
    this.id = obj.id;
    this.name = obj.name;
    this.description = obj.description;
    this.price = obj.price;
  }

  getCacheKey(): string {
    return `product:${this.id}`;
  }

  getCacheDuration(): number {
    return 7200; // 2 hours
  }

  getSearchableFields(): string[] {
    return ["name", "description"];
  }

  matchesSearch(query: string): boolean {
    const lowerQuery = query.toLowerCase();
    return this.name.toLowerCase().includes(lowerQuery) ||
           this.description.toLowerCase().includes(lowerQuery);
  }
}

// Generic services work with interfaces
class CacheService {
  private cache: Map<string, { data: string, expiry: number }> = new Map();

  store<T extends Cacheable & Serializable>(item: T): void {
    const key = item.getCacheKey();
    const data = item.serialize();
    const expiry = Date.now() + (item.getCacheDuration() * 1000);
    
    this.cache.set(key, { data, expiry });
    console.log(`Cached: ${key} (expires in ${item.getCacheDuration()}s)`);
  }

  retrieve(key: string): string | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() > cached.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }
}

class SearchService {
  search<T extends Searchable>(items: T[], query: string): T[] {
    console.log(`Searching for: "${query}"`);
    return items.filter(item => item.matchesSearch(query));
  }
}

// Usage
console.log("=== Abstract Class Example ===");
const postgres = new PostgreSQLConnection("postgresql://localhost:5432/mydb");
postgres.connect();
await postgres.executeQuery("SELECT * FROM users");
postgres.disconnect();

console.log("\n=== Interface Example ===");
const cacheService = new CacheService();
const user = new User("1", "john_doe", "john@example.com");
const product = new Product("101", "Laptop", "High-performance laptop", 1299.99);

cacheService.store(user);
cacheService.store(product);

const searchService = new SearchService();
const users = [
  new User("1", "john_doe", "john@example.com"),
  new User("2", "jane_smith", "jane@example.com")
];
const results = searchService.search(users, "john");
console.log(`Found ${results.length} users matching "john"`);
```

```python
# Python - When to Use Abstract Class vs Interface
from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
import json
import time

# ============================================
# Example 1: Use ABSTRACT CLASS
# ============================================

class DatabaseConnection(ABC):
    def __init__(self, connection_string: str):
        self._connection_string = connection_string
        self._is_connected = False
        self._max_retries = 3
    
    def connect(self) -> bool:
        print(f"Connecting to {self.get_db_type()}...")
        
        for attempt in range(1, self._max_retries + 1):
            if self._attempt_connection():
                self._is_connected = True
                print(f"✓ Connected to {self.get_db_type()}")
                return True
            print(f"Attempt {attempt} failed, retrying...")
        
        print(f"❌ Failed to connect to {self.get_db_type()}")
        return False
    
    def disconnect(self) -> None:
        if self._is_connected:
            self._perform_disconnect()
            self._is_connected = False
            print(f"Disconnected from {self.get_db_type()}")
    
    @abstractmethod
    def _attempt_connection(self) -> bool:
        pass
    
    @abstractmethod
    def _perform_disconnect(self) -> None:
        pass
    
    @abstractmethod
    def get_db_type(self) -> str:
        pass
    
    @abstractmethod
    async def execute_query(self, query: str) -> List[Dict]:
        pass
    
    @abstractmethod
    async def execute_command(self, command: str) -> bool:
        pass

class PostgreSQLConnection(DatabaseConnection):
    def _attempt_connection(self) -> bool:
        print("  PostgreSQL: Establishing TCP connection...")
        return True
    
    def _perform_disconnect(self) -> None:
        print("  PostgreSQL: Closing connection pool")
    
    def get_db_type(self) -> str:
        return "PostgreSQL"
    
    async def execute_query(self, query: str) -> List[Dict]:
        print(f"PostgreSQL: Executing query: {query}")
        return [{"id": 1, "name": "Result"}]
    
    async def execute_command(self, command: str) -> bool:
        print(f"PostgreSQL: Executing command: {command}")
        return True

class MongoDBConnection(DatabaseConnection):
    def _attempt_connection(self) -> bool:
        print("  MongoDB: Connecting to replica set...")
        return True
    
    def _perform_disconnect(self) -> None:
        print("  MongoDB: Closing all cursors")
    
    def get_db_type(self) -> str:
        return "MongoDB"
    
    async def execute_query(self, query: str) -> List[Dict]:
        print(f"MongoDB: Executing find: {query}")
        return [{"_id": "abc", "data": "Result"}]
    
    async def execute_command(self, command: str) -> bool:
        print(f"MongoDB: Executing command: {command}")
        return True

# ============================================
# Example 2: Use INTERFACE (ABC)
# ============================================

class Serializable(ABC):
    @abstractmethod
    def serialize(self) -> str:
        pass
    
    @abstractmethod
    def deserialize(self, data: str) -> None:
        pass

class Cacheable(ABC):
    @abstractmethod
    def get_cache_key(self) -> str:
        pass
    
    @abstractmethod
    def get_cache_duration(self) -> int:
        pass

class Searchable(ABC):
    @abstractmethod
    def get_searchable_fields(self) -> List[str]:
        pass
    
    @abstractmethod
    def matches_search(self, query: str) -> bool:
        pass

# Unrelated classes implementing same interfaces
class User(Serializable, Cacheable, Searchable):
    def __init__(self, user_id: str, username: str, email: str):
        self.id = user_id
        self.username = username
        self.email = email
    
    def serialize(self) -> str:
        return json.dumps({
            'id': self.id,
            'username': self.username,
            'email': self.email
        })
    
    def deserialize(self, data: str) -> None:
        obj = json.loads(data)
        self.id = obj['id']
        self.username = obj['username']
        self.email = obj['email']
    
    def get_cache_key(self) -> str:
        return f"user:{self.id}"
    
    def get_cache_duration(self) -> int:
        return 3600
    
    def get_searchable_fields(self) -> List[str]:
        return ["username", "email"]
    
    def matches_search(self, query: str) -> bool:
        lower_query = query.lower()
        return lower_query in self.username.lower() or lower_query in self.email.lower()

class Product(Serializable, Cacheable, Searchable):
    def __init__(self, product_id: str, name: str, description: str, price: float):
        self.id = product_id
        self.name = name
        self.description = description
        self.price = price
    
    def serialize(self) -> str:
        return json.dumps({
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': self.price
        })
    
    def deserialize(self, data: str) -> None:
        obj = json.loads(data)
        self.id = obj['id']
        self.name = obj['name']
        self.description = obj['description']
        self.price = obj['price']
    
    def get_cache_key(self) -> str:
        return f"product:{self.id}"
    
    def get_cache_duration(self) -> int:
        return 7200
    
    def get_searchable_fields(self) -> List[str]:
        return ["name", "description"]
    
    def matches_search(self, query: str) -> bool:
        lower_query = query.lower()
        return lower_query in self.name.lower() or lower_query in self.description.lower()

# Generic services using interfaces
class CacheService:
    def __init__(self):
        self._cache: Dict[str, Dict[str, Any]] = {}
    
    def store(self, item: Any) -> None:  # item must be Cacheable & Serializable
        if not isinstance(item, (Cacheable, Serializable)):
            raise TypeError("Item must be Cacheable and Serializable")
        
        key = item.get_cache_key()
        data = item.serialize()
        expiry = time.time() + item.get_cache_duration()
        
        self._cache[key] = {'data': data, 'expiry': expiry}
        print(f"Cached: {key} (expires in {item.get_cache_duration()}s)")
    
    def retrieve(self, key: str) -> Optional[str]:
        cached = self._cache.get(key)
        if not cached:
            return None
        
        if time.time() > cached['expiry']:
            del self._cache[key]
            return None
        
        return cached['data']

class SearchService:
    def search(self, items: List[Searchable], query: str) -> List[Searchable]:
        print(f'Searching for: "{query}"')
        return [item for item in items if item.matches_search(query)]

# Usage
print("=== Abstract Class Example ===")
postgres = PostgreSQLConnection("postgresql://localhost:5432/mydb")
postgres.connect()
# await postgres.execute_query("SELECT * FROM users")
postgres.disconnect()

print("\n=== Interface Example ===")
cache_service = CacheService()
user = User("1", "john_doe", "john@example.com")
product = Product("101", "Laptop", "High-performance laptop", 1299.99)

cache_service.store(user)
cache_service.store(product)

search_service = SearchService()
users = [
    User("1", "john_doe", "john@example.com"),
    User("2", "jane_smith", "jane@example.com")
]
results = search_service.search(users, "john")
print(f'Found {len(results)} users matching "john"')
```

</details>

---

## 4. Multiple Inheritance and Mixins

**Multiple inheritance** allows a class to inherit from more than one parent class. While powerful, it introduces complexity and is handled differently across languages.

**Real-world analogy:** Think of a smartphone. It inherits features from a phone (make calls), a camera (take photos), a computer (run apps), and a music player (play audio). It combines capabilities from multiple "parent" devices.

### Language Support:

- **TypeScript**: Does NOT support multiple class inheritance, but supports multiple interface implementation
- **Python**: DOES support multiple inheritance
- **Solution in TypeScript**: Use **mixins** (composition pattern)

### Mixins

**Mixins** are a pattern to add functionality to classes without using inheritance. They're reusable chunks of behavior that can be "mixed into" classes.

**When to use:**
- When you need multiple capabilities that don't fit a single inheritance hierarchy
- When features are orthogonal (independent of each other)
- When you want to avoid deep inheritance chains

<details>
<summary><strong>View Examples</strong></summary>

```typescript
// TypeScript - Mixins Pattern (since TS doesn't support multiple inheritance)

// ============================================
// Mixin Pattern Implementation
// ============================================

// Mixin type definition
type Constructor<T = {}> = new (...args: any[]) => T;

// Mixin 1: Timestampable - adds created/updated timestamps
function Timestampable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    createdAt: Date = new Date();
    updatedAt: Date = new Date();

    updateTimestamp(): void {
      this.updatedAt = new Date();
      console.log(`Updated timestamp: ${this.updatedAt.toISOString()}`);
    }

    getAge(): number {
      return Date.now() - this.createdAt.getTime();
    }
  };
}

// Mixin 2: Activatable - adds active/inactive state
function Activatable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    isActive: boolean = true;

    activate(): void {
      this.isActive = true;
      console.log("Activated");
    }

    deactivate(): void {
      this.isActive = false;
      console.log("Deactivated");
    }

    toggleActive(): void {
      this.isActive = !this.isActive;
      console.log(`Now ${this.isActive ? "active" : "inactive"}`);
    }
  };
}

// Mixin 3: Taggable - adds tag management
function Taggable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    private tags: Set<string> = new Set();

    addTag(tag: string): void {
      this.tags.add(tag);
      console.log(`Added tag: ${tag}`);
    }

    removeTag(tag: string): void {
      this.tags.delete(tag);
      console.log(`Removed tag: ${tag}`);
    }

    hasTag(tag: string): boolean {
      return this.tags.has(tag);
    }

    getTags(): string[] {
      return Array.from(this.tags);
    }

    clearTags(): void {
      this.tags.clear();
      console.log("Cleared all tags");
    }
  };
}

// Mixin 4: Auditable - adds audit trail
function Auditable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    private auditLog: Array<{ action: string; timestamp: Date; user: string }> = [];

    logAction(action: string, user: string): void {
      this.auditLog.push({
        action,
        timestamp: new Date(),
        user
      });
      console.log(`[AUDIT] ${user}: ${action}`);
    }

    getAuditTrail(): Array<{ action: string; timestamp: Date; user: string }> {
      return [...this.auditLog];
    }

    getLastAction(): { action: string; timestamp: Date; user: string } | null {
      return this.auditLog.length > 0 
        ? this.auditLog[this.auditLog.length - 1] 
        : null;
    }
  };
}

// ============================================
// Real-world Example: Blog Post System
// ============================================

// Base class
class BlogPost {
  constructor(
    public id: string,
    public title: string,
    public content: string,
    public author: string
  ) {}

  getInfo(): string {
    return `"${this.title}" by ${this.author}`;
  }
}

// Apply multiple mixins to create a rich BlogPost
const EnhancedBlogPost = Auditable(Taggable(Activatable(Timestampable(BlogPost))));

// Now BlogPost has all mixin capabilities
const post = new EnhancedBlogPost("POST001", "Understanding Mixins", "Mixins are...", "John Doe");

// Use Timestampable features
console.log(`Created: ${post.createdAt.toISOString()}`);
post.updateTimestamp();

// Use Activatable features
post.activate();
post.deactivate();

// Use Taggable features
post.addTag("TypeScript");
post.addTag("OOP");
post.addTag("Design Patterns");
console.log(`Tags: ${post.getTags().join(", ")}`);

// Use Auditable features
post.logAction("Created post", "John Doe");
post.logAction("Added tags", "John Doe");
post.logAction("Published post", "Editor");
console.log("\nAudit Trail:");
post.getAuditTrail().forEach(entry => {
  console.log(`  ${entry.timestamp.toISOString()} - ${entry.user}: ${entry.action}`);
});

// ============================================
// Real-world Example: E-commerce Product
// ============================================

class Product {
  constructor(
    public productId: string,
    public name: string,
    public price: number
  ) {}

  getDetails(): string {
    return `${this.name} - $${this.price}`;
  }
}

// Mixin for discount functionality
function Discountable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    private discountPercentage: number = 0;

    applyDiscount(percentage: number): void {
      if (percentage < 0 || percentage > 100) {
        throw new Error("Discount must be between 0 and 100");
      }
      this.discountPercentage = percentage;
      console.log(`Applied ${percentage}% discount`);
    }

    getDiscountedPrice(originalPrice: number): number {
      return originalPrice * (1 - this.discountPercentage / 100);
    }

    clearDiscount(): void {
      this.discountPercentage = 0;
      console.log("Discount cleared");
    }
  };
}

// Mixin for inventory management
function Inventoried<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    private stock: number = 0;
    private lowStockThreshold: number = 10;

    setStock(quantity: number): void {
      this.stock = quantity;
      if (this.stock <= this.lowStockThreshold) {
        console.log(`⚠ Low stock alert: ${this.stock} units remaining`);
      }
    }

    addStock(quantity: number): void {
      this.stock += quantity;
      console.log(`Added ${quantity} units. Total stock: ${this.stock}`);
    }

    removeStock(quantity: number): boolean {
      if (quantity > this.stock) {
        console.log("Insufficient stock");
        return false;
      }
      this.stock -= quantity;
      console.log(`Removed ${quantity} units. Remaining stock: ${this.stock}`);
      return true;
    }

    getStock(): number {
      return this.stock;
    }

    isLowStock(): boolean {
      return this.stock <= this.lowStockThreshold;
    }
  };
}

// Create enhanced product with multiple capabilities
const EnhancedProduct = Inventoried(Discountable(Timestampable(Activatable(Product))));

const product = new EnhancedProduct("PROD001", "Laptop", 1500);

// Use all mixed-in features
product.setStock(100);
product.applyDiscount(15);
console.log(`Discounted price: $${product.getDiscountedPrice(1500)}`);
product.activate();
product.addTag("electronics");
product.removeStock(5);

console.log(`\nProduct Info: ${product.getDetails()}`);
console.log(`Stock: ${product.getStock()}`);
console.log(`Active: ${product.isActive}`);
console.log(`Age: ${product.getAge()}ms`);

// ============================================
// Alternative Pattern: Utility Mixins
// ============================================

// Sometimes you want mixins as standalone utilities
class EventEmitter {
  private listeners: Map<string, Function[]> = new Map();

  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  emit(event: string, data?: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  off(event: string, callback: Function): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }
}

// Mixin that adds event emitter functionality
function WithEvents<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    private eventEmitter = new EventEmitter();

    on(event: string, callback: Function): void {
      this.eventEmitter.on(event, callback);
    }

    emit(event: string, data?: any): void {
      this.eventEmitter.emit(event, data);
    }

    off(event: string, callback: Function): void {
      this.eventEmitter.off(event, callback);
    }
  };
}

class Order {
  constructor(public orderId: string, public total: number) {}
}

const EventfulOrder = WithEvents(Order);
const order = new EventfulOrder("ORD001", 299.99);

// Use event functionality
order.on("statusChanged", (status: string) => {
  console.log(`Order status changed to: ${status}`);
});

order.on("paymentReceived", (amount: number) => {
  console.log(`Payment received: $${amount}`);
});

order.emit("statusChanged", "Processing");
order.emit("paymentReceived", 299.99);
order.emit("statusChanged", "Shipped");
```

```python
# Python - Multiple Inheritance and Mixins

# ============================================
# Python supports TRUE multiple inheritance
# ============================================

from datetime import datetime
from typing import List, Set, Dict, Any, Optional

# ============================================
# Mixin 1: Timestampable
# ============================================
class TimestampableMixin:
    """Adds created/updated timestamp tracking"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
    
    def update_timestamp(self) -> None:
        self.updated_at = datetime.now()
        print(f"Updated timestamp: {self.updated_at.isoformat()}")
    
    def get_age(self) -> float:
        """Returns age in seconds"""
        return (datetime.now() - self.created_at).total_seconds()

# ============================================
# Mixin 2: Activatable
# ============================================
class ActivatableMixin:
    """Adds active/inactive state management"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.is_active = True
    
    def activate(self) -> None:
        self.is_active = True
        print("Activated")
    
    def deactivate(self) -> None:
        self.is_active = False
        print("Deactivated")
    
    def toggle_active(self) -> None:
        self.is_active = not self.is_active
        print(f"Now {'active' if self.is_active else 'inactive'}")

# ============================================
# Mixin 3: Taggable
# ============================================
class TaggableMixin:
    """Adds tag management"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._tags: Set[str] = set()
    
    def add_tag(self, tag: str) -> None:
        self._tags.add(tag)
        print(f"Added tag: {tag}")
    
    def remove_tag(self, tag: str) -> None:
        self._tags.discard(tag)
        print(f"Removed tag: {tag}")
    
    def has_tag(self, tag: str) -> bool:
        return tag in self._tags
    
    def get_tags(self) -> List[str]:
        return list(self._tags)
    
    def clear_tags(self) -> None:
        self._tags.clear()
        print("Cleared all tags")

# ============================================
# Mixin 4: Auditable
# ============================================
class AuditableMixin:
    """Adds audit trail functionality"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._audit_log: List[Dict[str, Any]] = []
    
    def log_action(self, action: str, user: str) -> None:
        self._audit_log.append({
            'action': action,
            'timestamp': datetime.now(),
            'user': user
        })
        print(f"[AUDIT] {user}: {action}")
    
    def get_audit_trail(self) -> List[Dict[str, Any]]:
        return self._audit_log.copy()
    
    def get_last_action(self) -> Optional[Dict[str, Any]]:
        return self._audit_log[-1] if self._audit_log else None

# ============================================
# Real-world Example: Blog Post System
# ============================================

class BlogPost:
    """Base blog post class"""
    
    def __init__(self, post_id: str, title: str, content: str, author: str):
        self.id = post_id
        self.title = title
        self.content = content
        self.author = author
    
    def get_info(self) -> str:
        return f'"{self.title}" by {self.author}'

# Multiple inheritance - inheriting from multiple mixins
class EnhancedBlogPost(AuditableMixin, TaggableMixin, ActivatableMixin, 
                       TimestampableMixin, BlogPost):
    """
    BlogPost with all mixin capabilities.
    Note: Order matters! Python uses MRO (Method Resolution Order)
    """
    
    def __init__(self, post_id: str, title: str, content: str, author: str):
        # Important: call super().__init__() to initialize all mixins
        super().__init__(post_id, title, content, author)

# Usage
print("=== Enhanced Blog Post ===")
post = EnhancedBlogPost("POST001", "Understanding Mixins", "Mixins are...", "John Doe")

# Use Timestampable features
print(f"Created: {post.created_at.isoformat()}")
post.update_timestamp()

# Use Activatable features
post.activate()
post.deactivate()

# Use Taggable features
post.add_tag("Python")
post.add_tag("OOP")
post.add_tag("Design Patterns")
print(f"Tags: {', '.join(post.get_tags())}")

# Use Auditable features
post.log_action("Created post", "John Doe")
post.log_action("Added tags", "John Doe")
post.log_action("Published post", "Editor")
print("\nAudit Trail:")
for entry in post.get_audit_trail():
    print(f"  {entry['timestamp'].isoformat()} - {entry['user']}: {entry['action']}")

# Check MRO (Method Resolution Order)
print(f"\nMRO: {[cls.__name__ for cls in EnhancedBlogPost.__mro__]}")

# ============================================
# Real-world Example: E-commerce Product
# ============================================

class Product:
    def __init__(self, product_id: str, name: str, price: float):
        self.product_id = product_id
        self.name = name
        self.price = price
    
    def get_details(self) -> str:
        return f"{self.name} - ${self.price}"

class DiscountableMixin:
    """Adds discount functionality"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._discount_percentage = 0
    
    def apply_discount(self, percentage: float) -> None:
        if percentage < 0 or percentage > 100:
            raise ValueError("Discount must be between 0 and 100")
        self._discount_percentage = percentage
        print(f"Applied {percentage}% discount")
    
    def get_discounted_price(self, original_price: float) -> float:
        return original_price * (1 - self._discount_percentage / 100)
    
    def clear_discount(self) -> None:
        self._discount_percentage = 0
        print("Discount cleared")

class InventoriedMixin:
    """Adds inventory management"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._stock = 0
        self._low_stock_threshold = 10
    
    def set_stock(self, quantity: int) -> None:
        self._stock = quantity
        if self._stock <= self._low_stock_threshold:
            print(f"⚠ Low stock alert: {self._stock} units remaining")
    
    def add_stock(self, quantity: int) -> None:
        self._stock += quantity
        print(f"Added {quantity} units. Total stock: {self._stock}")
    
    def remove_stock(self, quantity: int) -> bool:
        if quantity > self._stock:
            print("Insufficient stock")
            return False
        self._stock -= quantity
        print(f"Removed {quantity} units. Remaining stock: {self._stock}")
        return True
    
    def get_stock(self) -> int:
        return self._stock
    
    def is_low_stock(self) -> bool:
        return self._stock <= self._low_stock_threshold

# Create enhanced product with multiple capabilities
class EnhancedProduct(InventoriedMixin, DiscountableMixin, TimestampableMixin, 
                      ActivatableMixin, TaggableMixin, Product):
    def __init__(self, product_id: str, name: str, price: float):
        super().__init__(product_id, name, price)

# Usage
print("\n=== Enhanced Product ===")
product = EnhancedProduct("PROD001", "Laptop", 1500)

# Use all mixed-in features
product.set_stock(100)
product.apply_discount(15)
print(f"Discounted price: ${product.get_discounted_price(1500):.2f}")
product.activate()
product.add_tag("electronics")
product.remove_stock(5)

print(f"\nProduct Info: {product.get_details()}")
print(f"Stock: {product.get_stock()}")
print(f"Active: {product.is_active}")
print(f"Age: {product.get_age():.2f}s")

# ============================================
# Advanced: Mixin with Parameters
# ============================================

class CacheableMixin:
    """Mixin with configurable cache duration"""
    
    def __init__(self, *args, cache_duration: int = 3600, **kwargs):
        super().__init__(*args, **kwargs)
        self._cache_duration = cache_duration
        self._cached_data: Optional[Dict[str, Any]] = None
        self._cache_timestamp: Optional[datetime] = None
    
    def cache_data(self, data: Dict[str, Any]) -> None:
        self._cached_data = data
        self._cache_timestamp = datetime.now()
        print(f"Data cached (expires in {self._cache_duration}s)")
    
    def get_cached_data(self) -> Optional[Dict[str, Any]]:
        if not self._cached_data or not self._cache_timestamp:
            return None
        
        age = (datetime.now() - self._cache_timestamp).total_seconds()
        if age > self._cache_duration:
            print("Cache expired")
            self._cached_data = None
            return None
        
        return self._cached_data
    
    def clear_cache(self) -> None:
        self._cached_data = None
        self._cache_timestamp = None
        print("Cache cleared")

class ApiResponse(CacheableMixin, TimestampableMixin):
    def __init__(self, response_id: str, data: Dict[str, Any], cache_duration: int = 3600):
        super().__init__(cache_duration=cache_duration)
        self.response_id = response_id
        self.data = data

# Usage
response = ApiResponse("RESP001", {"users": [1, 2, 3]}, cache_duration=60)
response.cache_data({"processed": True})
print(f"Cached: {response.get_cached_data()}")
```

</details>

---

## 5. The Diamond Problem

The **Diamond Problem** occurs in multiple inheritance when a class inherits from two classes that both inherit from the same base class, creating an ambiguous inheritance path shaped like a diamond.

**The Problem:**
```
      A
     / \
    B   C
     \ /
      D
```

If class D inherits from both B and C, and both B and C inherit from A, which version of A's methods does D use?

### How Languages Handle It:

- **TypeScript**: Avoids the problem entirely (no multiple class inheritance)
- **Python**: Uses **MRO (Method Resolution Order)** - C3 linearization algorithm
- **C++**: Requires explicit resolution using virtual inheritance

<details>
<summary><strong>View Examples</strong></summary>

```python
# Python - Diamond Problem Demonstration

# ============================================
# Example 1: The Diamond Problem
# ============================================

class Animal:
    def __init__(self):
        print("Animal.__init__ called")
        self.species = "Unknown"
    
    def make_sound(self):
        return "Some generic sound"
    
    def get_info(self):
        return f"I am an animal: {self.species}"

class Mammal(Animal):
    def __init__(self):
        print("Mammal.__init__ called")
        super().__init__()  # Calls Animal.__init__
        self.warm_blooded = True
    
    def make_sound(self):
        return "Mammal sound"
    
    def nurse_young(self):
        return "Nursing young with milk"

class WingedAnimal(Animal):
    def __init__(self):
        print("WingedAnimal.__init__ called")
        super().__init__()  # Calls Animal.__init__
        self.has_wings = True
    
    def make_sound(self):
        return "Winged animal sound"
    
    def fly(self):
        return "Flying in the sky"

# Diamond Problem: Bat inherits from both Mammal and WingedAnimal
class Bat(Mammal, WingedAnimal):
    def __init__(self):
        print("Bat.__init__ called")
        super().__init__()  # Which __init__ gets called? MRO decides!
        self.species = "Bat"
    
    def make_sound(self):
        return "Screech!"

# Creating a Bat
print("=== Creating a Bat (Diamond Problem) ===")
bat = Bat()
print(f"\nSpecies: {bat.species}")
print(f"Warm blooded: {bat.warm_blooded}")
print(f"Has wings: {bat.has_wings}")
print(f"Sound: {bat.make_sound()}")
print(f"Can nurse: {bat.nurse_young()}")
print(f"Can fly: {bat.fly()}")

# Check Method Resolution Order (MRO)
print(f"\nBat's MRO: {[cls.__name__ for cls in Bat.__mro__]}")
# Output: ['Bat', 'Mammal', 'WingedAnimal', 'Animal', 'object']
# This is the order Python searches for methods

# ============================================
# Example 2: Real-world Diamond - Payment Processing
# ============================================

class PaymentMethod:
    """Base payment method"""
    
    def __init__(self):
        print("PaymentMethod.__init__")
        self.transaction_fee = 0.0
    
    def process(self, amount: float) -> bool:
        print(f"Processing ${amount}")
        return True
    
    def get_fee(self, amount: float) -> float:
        return amount * self.transaction_fee

class OnlinePayment(PaymentMethod):
    """Online payment capability"""
    
    def __init__(self):
        print("OnlinePayment.__init__")
        super().__init__()
        self.requires_internet = True
        self.transaction_fee = 0.029  # 2.9%
    
    def process(self, amount: float) -> bool:
        if not self.check_connection():
            print("No internet connection")
            return False
        return super().process(amount)
    
    def check_connection(self) -> bool:
        print("Checking internet connection...")
        return True

class SecurePayment(PaymentMethod):
    """Secure payment capability"""
    
    def __init__(self):
        print("SecurePayment.__init__")
        super().__init__()
        self.encryption_enabled = True
        self.transaction_fee = 0.01  # Additional 1% for security
    
    def process(self, amount: float) -> bool:
        if not self.verify_security():
            print("Security verification failed")
            return False
        return super().process(amount)
    
    def verify_security(self) -> bool:
        print("Verifying security protocols...")
        return True

# Diamond: CreditCardPayment is both online AND secure
class CreditCardPayment(OnlinePayment, SecurePayment):
    """
    Diamond inheritance:
           PaymentMethod
              /    \
    OnlinePayment  SecurePayment
              \    /
         CreditCardPayment
    """
    
    def __init__(self, card_number: str):
        print("CreditCardPayment.__init__")
        super().__init__()  # MRO handles calling both parents correctly
        self.card_number = card_number
        # Note: transaction_fee from OnlinePayment takes precedence (MRO)
    
    def process(self, amount: float) -> bool:
        print(f"\n--- Processing Credit Card Payment ---")
        print(f"Card: ****{self.card_number[-4:]}")
        # MRO ensures both checks happen
        return super().process(amount)

print("\n=== Creating CreditCardPayment (Diamond) ===")
cc_payment = CreditCardPayment("1234567890123456")

print(f"\nRequires Internet: {cc_payment.requires_internet}")
print(f"Encryption Enabled: {cc_payment.encryption_enabled}")
print(f"Transaction Fee: {cc_payment.transaction_fee * 100}%")

cc_payment.process(100.00)

print(f"\nCreditCardPayment MRO: {[cls.__name__ for cls in CreditCardPayment.__mro__]}")
# ['CreditCardPayment', 'OnlinePayment', 'SecurePayment', 'PaymentMethod', 'object']

# ============================================
# Example 3: MRO Conflict Resolution
# ============================================

class A:
    def method(self):
        return "A's method"

class B(A):
    def method(self):
        return "B's method"

class C(A):
    def method(self):
        return "C's method"

# Which method() does D inherit?
class D(B, C):
    pass

d = D()
print(f"\n=== MRO Conflict Resolution ===")
print(f"d.method() returns: {d.method()}")  # Returns "B's method"
print(f"D's MRO: {[cls.__name__ for cls in D.__mro__]}")
# ['D', 'B', 'C', 'A', 'object']
# B comes before C, so B's method is used

# If we swap the order:
class E(C, B):
    pass

e = E()
print(f"e.method() returns: {e.method()}")  # Returns "C's method"
print(f"E's MRO: {[cls.__name__ for cls in E.__mro__]}")
# ['E', 'C', 'B', 'A', 'object']

# ============================================
# Example 4: Cooperative Multiple Inheritance
# ============================================
# Best practice: Always use super() and accept **kwargs

class LoggerMixin:
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        print("LoggerMixin initialized")
        self.log_enabled = True
    
    def log(self, message: str):
        if self.log_enabled:
            print(f"[LOG] {message}")

class ValidatorMixin:
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        print("ValidatorMixin initialized")
        self.validation_enabled = True
    
    def validate(self, data: any) -> bool:
        if self.validation_enabled:
            print(f"[VALIDATE] Checking {data}")
            return True
        return False

class CacheMixin:
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        print("CacheMixin initialized")
        self._cache = {}
    
    def get_from_cache(self, key: str):
        return self._cache.get(key)
    
    def add_to_cache(self, key: str, value: any):
        self._cache[key] = value

class DataService:
    def __init__(self, name: str, **kwargs):
        super().__init__(**kwargs)
        print(f"DataService '{name}' initialized")
        self.name = name

# Multiple inheritance with cooperative super()
class EnhancedDataService(LoggerMixin, ValidatorMixin, CacheMixin, DataService):
    def __init__(self, name: str):
        # **kwargs pattern allows MRO to work smoothly
        super().__init__(name=name)
        print("EnhancedDataService ready")
    
    def fetch_data(self, key: str):
        self.log(f"Fetching data for {key}")
        
        # Check cache first
        cached = self.get_from_cache(key)
        if cached:
            self.log("Data found in cache")
            return cached
        
        # Simulate fetching
        data = f"Data for {key}"
        
        # Validate
        if self.validate(data):
            # Cache it
            self.add_to_cache(key, data)
            self.log("Data cached")
            return data
        
        return None

print("\n=== Cooperative Multiple Inheritance ===")
service = EnhancedDataService("UserService")
print(f"\nMRO: {[cls.__name__ for cls in EnhancedDataService.__mro__]}")

print("\n--- Using the service ---")
result = service.fetch_data("user_123")
print(f"Result: {result}")

result2 = service.fetch_data("user_123")  # Should come from cache
print(f"Result: {result2}")
```

```typescript
// TypeScript - Diamond Problem (Prevented by Language Design)

// TypeScript doesn't allow multiple class inheritance,
// so the diamond problem cannot occur with classes.

// ============================================
// TypeScript's Solution: Interfaces + Mixins
// ============================================

// Instead of this (NOT ALLOWED in TypeScript):
// class Bat extends Mammal, WingedAnimal { }  // ❌ Error

// TypeScript uses interfaces and mixins:

interface Mammal {
  warmBlooded: boolean;
  nurseYoung(): string;
}

interface WingedAnimal {
  hasWings: boolean;
  fly(): string;
}

interface Animal {
  species: string;
  makeSound(): string;
}

// A class can implement multiple interfaces (no diamond problem)
class Bat implements Animal, Mammal, WingedAnimal {
  species: string = "Bat";
  warmBlooded: boolean = true;
  hasWings: boolean = true;

  makeSound(): string {
    return "Screech!";
  }

  nurseYoung(): string {
    return "Nursing young with milk";
  }

  fly(): string {
    return "Flying in the sky";
  }
}

const bat = new Bat();
console.log(bat.makeSound());
console.log(bat.nurseYoung());
console.log(bat.fly());

// ============================================
// Using Mixins to Achieve Multiple Inheritance Behavior
// ============================================

type Constructor<T = {}> = new (...args: any[]) => T;

// Base mixin
function AnimalMixin<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    species: string = "Unknown";
    
    makeSound(): string {
      return "Some generic sound";
    }
    
    getInfo(): string {
      return `I am an animal: ${this.species}`;
    }
  };
}

// Mammal mixin
function MammalMixin<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    warmBlooded: boolean = true;
    
    nurseYoung(): string {
      return "Nursing young with milk";
    }
  };
}

// Winged animal mixin
function WingedAnimalMixin<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    hasWings: boolean = true;
    
    fly(): string {
      return "Flying in the sky";
    }
  };
}

// Base class
class BaseAnimal {
  constructor() {
    console.log("BaseAnimal constructor");
  }
}

// Compose mixins - NO diamond problem because it's sequential composition
const BatBase = WingedAnimalMixin(MammalMixin(AnimalMixin(BaseAnimal)));

class BatClass extends BatBase {
  constructor() {
    super();
    this.species = "Bat";
  }
  
  makeSound(): string {
    return "Screech!";
  }
}

console.log("\n=== TypeScript Mixin Pattern ===");
const batInstance = new BatClass();
console.log(`Species: ${batInstance.species}`);
console.log(`Warm blooded: ${batInstance.warmBlooded}`);
console.log(`Has wings: ${batInstance.hasWings}`);
console.log(`Sound: ${batInstance.makeSound()}`);
console.log(`Can nurse: ${batInstance.nurseYoung()}`);
console.log(`Can fly: ${batInstance.fly()}`);

// ============================================
// Why TypeScript Avoided the Diamond Problem
// ============================================

/*
TypeScript's design choices:
1. Single class inheritance only
2. Multiple interface implementation (no state, no problem)
3. Mixins for composition (linear, not diamond-shaped)

This prevents ambiguity:
- Interfaces have no implementation → no conflict
- Mixins are applied sequentially → clear order
- Single inheritance → one parent at a time

Benefits:
✅ No ambiguity about which method gets called
✅ No need for complex resolution algorithms (like Python's MRO)
✅ Easier to understand and maintain
✅ Encourages composition over inheritance

Trade-off:
❌ Less flexible than Python's multiple inheritance
✅ But safer and more predictable
*/
```

</details>

---

## Practice Questions - Part 2

<details>
<summary><strong>View Questions</strong></summary>

### Fill in the Blanks

1. __________ allow a class to reuse functionality from multiple sources without using traditional inheritance.

2. The __________ problem occurs when a class inherits from two classes that both inherit from the same base class, creating an ambiguous inheritance path.

3. Python uses __________ (Method Resolution Order) to resolve the diamond problem by determining the order in which base classes are searched.

4. TypeScript avoids the diamond problem by not allowing __________ class inheritance, though it does allow implementing multiple __________.

5. In Python, the __________ function is crucial for cooperative multiple inheritance, ensuring all classes in the MRO are properly initialized.

<details>
<summary><strong>View Answers</strong></summary>

1. **Mixins** - Mixins are reusable components that add specific functionality to classes through composition or multiple inheritance patterns.

2. **Diamond** - Named after the diamond shape of the inheritance graph (A at top, B and C in middle, D at bottom).

3. **MRO** - Python's C3 linearization algorithm creates a consistent order for method lookup, preventing ambiguity.

4. **multiple**, **interfaces** - TypeScript allows single inheritance with classes but multiple implementation with interfaces (which have no state).

5. **super()** - In multiple inheritance, super() follows the MRO to call the next class in the chain, ensuring all parent initializers run exactly once.

</details>

---

### True/False

1. ⬜ TypeScript supports multiple class inheritance like Python does.

2. ⬜ Mixins in TypeScript are implemented using functions that return classes.

3. ⬜ In Python, the order of parent classes in a class definition affects the Method Resolution Order (MRO).

4. ⬜ The diamond problem only occurs when using abstract classes.

5. ⬜ In Python's multiple inheritance, super().__init__() might call a sibling class, not just a parent class.

6. ⬜ Mixins should generally avoid having their own __init__ methods to prevent conflicts.

<details>
<summary><strong>View Answers</strong></summary>

1. **False** - TypeScript only supports single class inheritance. It prevents the diamond problem by design. You can implement multiple interfaces but extend only one class.

2. **True** - TypeScript mixins are typically functions that take a base class and return a new class that extends it, adding new functionality. This is a composition pattern.

3. **True** - The order matters significantly. `class D(B, C)` has a different MRO than `class D(C, B)`. Python searches left-to-right, depth-first, removing duplicates.

4. **False** - The diamond problem can occur with any multiple inheritance where two parent classes share a common ancestor, whether abstract or concrete.

5. **True** - This is key to cooperative multiple inheritance. Due to MRO, super() in class B might call class C's __init__ if C comes next in the resolution order, even though C is not B's parent.

6. **False** - Mixins CAN have __init__ methods, but they should use `super().__init__(**kwargs)` to cooperate with other classes in the inheritance chain. This is the cooperative multiple inheritance pattern.

</details>

---

### Multiple Choice

1. **What is the primary advantage of using mixins over traditional inheritance?**
   - A) Better performance
   - B) Ability to add orthogonal functionality without creating deep inheritance hierarchies
   - C) Automatic error handling
   - D) Reduced memory usage

2. **In Python's MRO for `class D(B, C)`, if both B and C inherit from A, when is A's method called?**
   - A) Immediately when D is created
   - B) Before both B and C
   - C) After both B and C
   - D) Never, it's skipped

3. **Why doesn't TypeScript have the diamond problem?**
   - A) TypeScript is compiled to JavaScript
   - B) TypeScript only allows single class inheritance
   - C) TypeScript automatically resolves conflicts
   - D) TypeScript doesn't support inheritance

4. **What is cooperative multiple inheritance in Python?**
   - A) Classes that inherit from the same parent
   - B) Using super() to ensure all classes in the MRO are properly called
   - C) Avoiding multiple inheritance entirely
   - D) Using interfaces instead of classes

5. **In the Bat example, what happens when you call bat.make_sound()?**
   - A) Error due to ambiguity
   - B) Returns the first parent's implementation based on MRO
   - C) Returns all parents' implementations
   - D) Returns Bat's own implementation if overridden

<details>
<summary><strong>View Answers</strong></summary>

1. **B** - Mixins let you add independent capabilities (logging, caching, timestamps) without forcing everything into a single inheritance hierarchy. Example: A Product can be Taggable, Timestampable, and Inventoried without these being related in a hierarchy.

2. **C** - Python's C3 linearization ensures that parent classes are called before their parents. So: D → B → C → A. This prevents A's methods from being called twice and resolves the diamond properly.

3. **B** - TypeScript's language design choice: classes can only extend one parent. This completely eliminates the possibility of diamond inheritance. Multiple capabilities come from interfaces (pure contracts) or mixins (composition).

4. **B** - Cooperative inheritance means each class uses super() to pass control to the next class in the MRO, ensuring the entire chain is initialized. All __init__ methods accept **kwargs and pass them along.

5. **D** - If Bat overrides make_sound(), that implementation is used (normal inheritance). If Bat doesn't override it, Python follows the MRO to find the first implementation. The MRO for `class Bat(Mammal, WingedAnimal)` would check Mammal first.

</details>

---

### Code Challenge

**Challenge: Create a Multi-Featured User System**

Create a user management system using mixins with the following requirements:

**Python version:**
1. Create mixins for: Timestampable, Activatable, Notifiable (email/SMS methods)
2. Create a base User class with id, name, email
3. Create EnhancedUser that uses all three mixins
4. Demonstrate proper cooperative multiple inheritance with super()

**TypeScript version:**
1. Create the same mixin functions
2. Compose them to create an EnhancedUser class
3. Show that there's no diamond problem

<details>
<summary><strong>View Solution</strong></summary>

```python
# Python Solution
from datetime import datetime
from typing import List, Optional

class TimestampableMixin:
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
    
    def touch(self) -> None:
        """Update the timestamp"""
        self.updated_at = datetime.now()
        print(f"Timestamp updated: {self.updated_at}")

class ActivatableMixin:
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.is_active = True
        self.activation_history: List[dict] = []
    
    def activate(self) -> None:
        if not self.is_active:
            self.is_active = True
            self.activation_history.append({
                'action': 'activated',
                'timestamp': datetime.now()
            })
            print("User activated")
    
    def deactivate(self) -> None:
        if self.is_active:
            self.is_active = False
            self.activation_history.append({
                'action': 'deactivated',
                'timestamp': datetime.now()
            })
            print("User deactivated")

class NotifiableMixin:
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.notification_preferences = {
            'email': True,
            'sms': False
        }
    
    def send_email(self, subject: str, body: str) -> bool:
        if self.notification_preferences.get('email'):
            print(f"📧 Email sent to {self.email}")
            print(f"   Subject: {subject}")
            return True
        print("Email notifications disabled")
        return False
    
    def send_sms(self, message: str) -> bool:
        if self.notification_preferences.get('sms'):
            print(f"📱 SMS sent: {message}")
            return True
        print("SMS notifications disabled")
        return False
    
    def enable_notifications(self, channel: str) -> None:
        if channel in self.notification_preferences:
            self.notification_preferences[channel] = True
            print(f"{channel.upper()} notifications enabled")

class User:
    def __init__(self, user_id: str, name: str, email: str, **kwargs):
        super().__init__(**kwargs)
        self.user_id = user_id
        self.name = name
        self.email = email
        print(f"User created: {name}")
    
    def get_info(self) -> str:
        return f"{self.name} ({self.email})"

# Multiple inheritance - notice **kwargs pattern for cooperation
class EnhancedUser(NotifiableMixin, ActivatableMixin, TimestampableMixin, User):
    def __init__(self, user_id: str, name: str, email: str):
        # Pass all arguments through the MRO chain
        super().__init__(user_id=user_id, name=name, email=email)
        print("EnhancedUser ready")
    
    def get_full_status(self) -> dict:
        return {
            'info': self.get_info(),
            'active': self.is_active,
            'created': self.created_at,
            'notifications': self.notification_preferences
        }

# Demonstrate
print("=== Python Multiple Inheritance ===")
user = EnhancedUser("USR001", "Alice Johnson", "alice@example.com")

print(f"\nMRO: {[cls.__name__ for cls in EnhancedUser.__mro__]}")

print("\n--- Using Timestampable ---")
print(f"Created: {user.created_at}")
user.touch()

print("\n--- Using Activatable ---")
user.deactivate()
user.activate()

print("\n--- Using Notifiable ---")
user.send_email("Welcome", "Welcome to our platform!")
user.enable_notifications('sms')
user.send_sms("Your account is ready")

print("\n--- Full Status ---")
import json
print(json.dumps(user.get_full_status(), default=str, indent=2))
```

```typescript
// TypeScript Solution
type Constructor<T = {}> = new (...args: any[]) => T;

// Timestampable Mixin
function Timestampable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    createdAt: Date = new Date();
    updatedAt: Date = new Date();

    touch(): void {
      this.updatedAt = new Date();
      console.log(`Timestamp updated: ${this.updatedAt}`);
    }
  };
}

// Activatable Mixin
function Activatable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    isActive: boolean = true;
    activationHistory: Array<{ action: string; timestamp: Date }> = [];

    activate(): void {
      if (!this.isActive) {
        this.isActive = true;
        this.activationHistory.push({
          action: 'activated',
          timestamp: new Date()
        });
        console.log("User activated");
      }
    }

    deactivate(): void {
      if (this.isActive) {
        this.isActive = false;
        this.activationHistory.push({
          action: 'deactivated',
          timestamp: new Date()
        });
        console.log("User deactivated");
      }
    }
  };
}

// Notifiable Mixin
function Notifiable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    notificationPreferences = {
      email: true,
      sms: false
    };

    // Need to add email property check
    sendEmail(this: any, subject: string, body: string): boolean {
      if (this.notificationPreferences.email) {
        console.log(`📧 Email sent to ${this.email}`);
        console.log(`   Subject: ${subject}`);
        return true;
      }
      console.log("Email notifications disabled");
      return false;
    }

    sendSMS(message: string): boolean {
      if (this.notificationPreferences.sms) {
        console.log(`📱 SMS sent: ${message}`);
        return true;
      }
      console.log("SMS notifications disabled");
      return false;
    }

    enableNotifications(channel: 'email' | 'sms'): void {
      this.notificationPreferences[channel] = true;
      console.log(`${channel.toUpperCase()} notifications enabled`);
    }
  };
}

// Base User class
class User {
  constructor(
    public userId: string,
    public name: string,
    public email: string
  ) {
    console.log(`User created: ${name}`);
  }

  getInfo(): string {
    return `${this.name} (${this.email})`;
  }
}

// Compose mixins - NO diamond problem due to linear composition
const EnhancedUserBase = Notifiable(Activatable(Timestampable(User)));

class EnhancedUser extends EnhancedUserBase {
  constructor(userId: string, name: string, email: string) {
    super(userId, name, email);
    console.log("EnhancedUser ready");
  }

  getFullStatus(): object {
    return {
      info: this.getInfo(),
      active: this.isActive,
      created: this.createdAt,
      notifications: this.notificationPreferences
    };
  }
}

// Demonstrate
console.log("=== TypeScript Mixins ===");
const user = new EnhancedUser("USR001", "Alice Johnson", "alice@example.com");

console.log("\n--- Using Timestampable ---");
console.log(`Created: ${user.createdAt}`);
user.touch();

console.log("\n--- Using Activatable ---");
user.deactivate();
user.activate();

console.log("\n--- Using Notifiable ---");
user.sendEmail("Welcome", "Welcome to our platform!");
user.enableNotifications('sms');
user.sendSMS("Your account is ready");

console.log("\n--- Full Status ---");
console.log(JSON.stringify(user.getFullStatus(), null, 2));
```

</details>

</details>

---

## Summary

Advanced class concepts provide powerful tools for organizing and reusing code:

1. **Abstract Classes**: Enforce contracts while providing shared implementation
2. **Interfaces**: Define pure contracts without implementation
3. **Abstract Classes vs Interfaces**: Choose based on whether you need state/implementation
4. **Multiple Inheritance & Mixins**: Add orthogonal functionality without deep hierarchies
5. **Diamond Problem**: Understand how languages handle inheritance conflicts

These concepts are crucial for designing maintainable, flexible systems and are frequent interview topics.
