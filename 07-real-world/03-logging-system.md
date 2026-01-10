# 7.3 Logging System Design

[← Back to Banking System](02-banking-system.md) | [Next: Game Characters →](04-game-characters.md) | [↑ Back to README](../README.md)

---

## System Overview

Design a **flexible logging system** with multiple outputs, log levels, and formatting.

### Core Requirements

**Features:**
- Multiple log levels (DEBUG, INFO, WARNING, ERROR, CRITICAL)
- Multiple output destinations (Console, File, Database, Network)
- Configurable formatting
- Thread-safe operations
- Performance (async logging)

---

## Complete Implementation

```python
from abc import ABC, abstractmethod
from datetime import datetime
from enum import IntEnum
import threading
from queue import Queue
import json

class LogLevel(IntEnum):
    """Log severity levels"""
    DEBUG = 10
    INFO = 20
    WARNING = 30
    ERROR = 40
    CRITICAL = 50

class LogRecord:
    """Immutable log record"""
    def __init__(self, level, message, logger_name, **kwargs):
        self.level = level
        self.message = message
        self.logger_name = logger_name
        self.timestamp = datetime.now()
        self.thread_id = threading.get_ident()
        self.extra = kwargs
    
    def __str__(self):
        return f"[{self.timestamp}] {self.level.name} - {self.message}"

# Strategy Pattern - Different Formatters
class Formatter(ABC):
    @abstractmethod
    def format(self, record: LogRecord) -> str:
        pass

class SimpleFormatter(Formatter):
    def format(self, record: LogRecord) -> str:
        return f"[{record.level.name}] {record.message}"

class DetailedFormatter(Formatter):
    def format(self, record: LogRecord) -> str:
        return (f"{record.timestamp.strftime('%Y-%m-%d %H:%M:%S')} | "
                f"{record.level.name:8} | "
                f"{record.logger_name:20} | "
                f"Thread-{record.thread_id} | "
                f"{record.message}")

class JsonFormatter(Formatter):
    def format(self, record: LogRecord) -> str:
        data = {
            "timestamp": record.timestamp.isoformat(),
            "level": record.level.name,
            "logger": record.logger_name,
            "thread": record.thread_id,
            "message": record.message,
            **record.extra
        }
        return json.dumps(data)

# Strategy Pattern - Different Handlers
class Handler(ABC):
    def __init__(self, level=LogLevel.DEBUG, formatter=None):
        self.level = level
        self.formatter = formatter or SimpleFormatter()
    
    def should_handle(self, record: LogRecord) -> bool:
        return record.level >= self.level
    
    def handle(self, record: LogRecord):
        if self.should_handle(record):
            formatted = self.formatter.format(record)
            self.emit(formatted)
    
    @abstractmethod
    def emit(self, message: str):
        pass

class ConsoleHandler(Handler):
    def emit(self, message: str):
        print(message)

class FileHandler(Handler):
    def __init__(self, filename, level=LogLevel.DEBUG, formatter=None):
        super().__init__(level, formatter)
        self.filename = filename
        self.file = open(filename, 'a')
    
    def emit(self, message: str):
        self.file.write(message + '\n')
        self.file.flush()
    
    def close(self):
        self.file.close()

class RotatingFileHandler(Handler):
    """File handler with size-based rotation"""
    def __init__(self, filename, max_bytes=1048576, backup_count=5, 
                 level=LogLevel.DEBUG, formatter=None):
        super().__init__(level, formatter)
        self.base_filename = filename
        self.max_bytes = max_bytes
        self.backup_count = backup_count
        self.file = open(filename, 'a')
    
    def emit(self, message: str):
        self.file.write(message + '\n')
        self.file.flush()
        
        if self.file.tell() >= self.max_bytes:
            self._rotate()
    
    def _rotate(self):
        self.file.close()
        
        # Rotate existing backups
        for i in range(self.backup_count - 1, 0, -1):
            src = f"{self.base_filename}.{i}"
            dst = f"{self.base_filename}.{i + 1}"
            try:
                import os
                if os.path.exists(src):
                    os.rename(src, dst)
            except:
                pass
        
        # Rename current file
        import os
        if os.path.exists(self.base_filename):
            os.rename(self.base_filename, f"{self.base_filename}.1")
        
        # Open new file
        self.file = open(self.base_filename, 'a')

class Logger:
    """Main logger class"""
    def __init__(self, name, level=LogLevel.DEBUG):
        self.name = name
        self.level = level
        self.handlers = []
        self._lock = threading.Lock()
    
    def add_handler(self, handler: Handler):
        with self._lock:
            self.handlers.append(handler)
    
    def _log(self, level: LogLevel, message: str, **kwargs):
        if level >= self.level:
            record = LogRecord(level, message, self.name, **kwargs)
            
            with self._lock:
                for handler in self.handlers:
                    handler.handle(record)
    
    def debug(self, message, **kwargs):
        self._log(LogLevel.DEBUG, message, **kwargs)
    
    def info(self, message, **kwargs):
        self._log(LogLevel.INFO, message, **kwargs)
    
    def warning(self, message, **kwargs):
        self._log(LogLevel.WARNING, message, **kwargs)
    
    def error(self, message, **kwargs):
        self._log(LogLevel.ERROR, message, **kwargs)
    
    def critical(self, message, **kwargs):
        self._log(LogLevel.CRITICAL, message, **kwargs)

# Singleton Pattern - Logger Factory
class LoggerFactory:
    _instance = None
    _lock = threading.Lock()
    
    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
                    cls._instance.loggers = {}
        return cls._instance
    
    def get_logger(self, name, level=LogLevel.DEBUG):
        if name not in self.loggers:
            logger = Logger(name, level)
            self.loggers[name] = logger
        return self.loggers[name]

# Usage Example
def main():
    factory = LoggerFactory()
    
    # Create logger
    logger = factory.get_logger("MyApp")
    
    # Add handlers
    console_handler = ConsoleHandler(
        level=LogLevel.INFO,
        formatter=SimpleFormatter()
    )
    logger.add_handler(console_handler)
    
    file_handler = FileHandler(
        "app.log",
        level=LogLevel.DEBUG,
        formatter=DetailedFormatter()
    )
    logger.add_handler(file_handler)
    
    # Log messages
    logger.debug("This is debug")
    logger.info("Application started")
    logger.warning("This is a warning")
    logger.error("An error occurred", user_id=123, action="login")
    logger.critical("Critical failure!")

if __name__ == "__main__":
    main()
```

---

## Design Patterns Used

1. **Strategy Pattern** - Formatters and Handlers
2. **Singleton Pattern** - LoggerFactory
3. **Factory Pattern** - LoggerFactory.get_logger()
4. **Template Method** - Handler base class

---

[← Back to Banking System](02-banking-system.md) | [Next: Game Characters →](04-game-characters.md) | [↑ Back to README](../README.md)