---
title: Python 中 logging 日志模块在多进程环境下的使用
layout: post
category : [Python]
tagline: 
keywords: [python, 日志, logging, 多进程, cloghandler]
tags : [Python, 日志]
---

使用 Python 来写后台任务时，时常需要使用输出日志来记录程序运行的状态，并在发生错误时将错误的详细信息保存下来，以别调试和分析。Python 的 logging 模块就是这种情况下的好帮手。

logging 模块可以指定日志的级别，DEBUG、INFO、WARNING、ERROR、CRITICAL，例如可以在开发和调试时，把 DEBUG 以上级别的日志都输出，而在生产环境下，只输出 INFO 级别。（如果不特别指定，默认级别是 warning）  

logging 还可以指定输出到命令行或者文件，还可以按时间或大小分割日志文件。


关于 logging 的详细使用，这里就不再细说，可以参考[官方文档](https://docs.python.org/2/library/logging.html "")，或者[这里](https://chareice.com/articles/2014/11/24/python-logging%E5%BA%93%E8%AF%A6%E8%A7%A3.html "")的介绍。

## logging 的配置

通常情况下，我们需要将日志保存到文件中，并期望能自动分割文件，避免日志文件太大。下面给出了一个 logging 的配置例子。

```python
import logging.config

logging.config.dictConfig({
    'version': 1,
    'disable_existing_loggers': True,
    'formatters': {
        'verbose': {
            'format': "[%(asctime)s] %(levelname)s [%(name)s:%(lineno)s] %(message)s",
            'datefmt': "%Y-%m-%d %H:%M:%S"
        },
        'simple': {
            'format': '%(levelname)s %(message)s'
        },
    },
    'handlers': {
        'null': {
            'level': 'DEBUG',
            'class': 'logging.NullHandler',
        },
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose'
        },
        'file': {
            'level': 'DEBUG',
            'class': 'logging.handlers.RotatingFileHandler',
            # 当达到10MB时分割日志
            'maxBytes': 1024 * 1024 * 10,
            # 最多保留50份文件
            'backupCount': 50,
            # If delay is true,
            # then file opening is deferred until the first call to emit().
            'delay': True,
            'filename': 'logs/mysite.log',
            'formatter': 'verbose'
        }
    },
    'loggers': {
        '': {
            'handlers': ['file'],
            'level': 'INFO',
        },
    }
})
```

我们在一个模块内，就可以这么使用来记录日志

```python
import logging
logger = logging.getLogger(__name__)

if __name__ == '__main__':
    logger.info('log info')
```

## 多进程环境下的使用

按照[官方文档](https://docs.python.org/2/library/logging.html#thread-safety "")的介绍，logging 是线程安全的，也就是说，在一个进程内的多个线程同时往同一个文件写日志是安全的。但是（对，这里有个但是）多个进程往同一个文件写日志不是安全的。官方的说法是这样的：

> Because there is no standard way to serialize access to a single file across multiple processes in Python. If you need to log to a single file from multiple processes, one way of doing this is to have all the processes log to a SocketHandler, and have a separate process which implements a socket server which reads from the socket and logs to file. (If you prefer, you can dedicate one thread in one of the existing processes to perform this function.)

有的人会说，那我不用多进程不就可以了。但是 Python 有一个 GIL 的大锁（关于 GIL 的纠葛可以看[这里](http://zhuoqiang.me/python-thread-gil-and-ctypes.html "")），使用多线程是没法利用到多核 CPU 的，大部分情况下会改用多进程来利用多核 CPU，因此我们还是绕不开不开多进程下日志的问题。

为了解决这个问题，可以使用 [ConcurrentLogHandler](https://pypi.python.org/pypi/ConcurrentLogHandler/0.9.1 "")，ConcurrentLogHandler 可以在多进程环境下安全的将日志写入到同一个文件，并且可以在日志文件达到特定大小时，分割日志文件。在默认的 logging 模块中，有个 [TimedRotatingFileHandler](https://docs.python.org/2/library/logging.handlers.html#timedrotatingfilehandler "") 类，可以按时间分割日志文件，可惜 ConcurrentLogHandler 不支持这种按时间分割日志文件的方式。

重新修改下 handlers 中的 class。

```python
logging.config.dictConfig({
    ...
    'handlers': {
        'file': {
            'level': 'DEBUG',
            # 如果没有使用并发的日志处理类，在多实例的情况下日志会出现缺失
            'class': 'cloghandler.ConcurrentRotatingFileHandler',
            # 当达到10MB时分割日志
            'maxBytes': 1024 * 1024 * 10,
            # 最多保留50份文件
            'backupCount': 50,
            # If delay is true,
            # then file opening is deferred until the first call to emit().
            'delay': True,
            'filename': 'logs/mysite.log',
            'formatter': 'verbose'
        }
    },
    ...
})
```

运行后可以发现，会自动创建一个.lock文件，通过锁的方式来安全的写日志文件。


