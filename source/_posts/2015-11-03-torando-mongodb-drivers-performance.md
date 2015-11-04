---
title: Tornado 中 PyMongo Motor MongoEngine 的性能测试
layout: post
category: [Python]
tagline: 
tags: [Python, MongoDB, Tornado]
---

最近在使用 Tornado 开发 API，数据库选择了 MongoDB，因为想使用 Geo 搜索的特性。Python 可供选择的 MongoDB Drivers 可以在[官网查找](https://docs.mongodb.org/ecosystem/drivers/python/)。

在这些 Drivers 中，GitHub 上 Star 数最多的有 3 个：

- [PyMongo](https://api.mongodb.org/python/current/)
- [Motor](https://motor.readthedocs.org/en/stable/) （适用于 Tornado 的异步 driver）
- [MongoEngine](http://mongoengine.org/) （ORM-like Layers）

Motor 和 MongoEngine 都是基于 PyMongo，Motor 的最新版是基于 Pymongo 2.8，Motor 的优势就在于异步，而 PyMongo 在 2.2 以后的版本，就开始支持 gevent。

MongoEngine 借鉴了 Django 的 ORM，提供了一个 [ORM-like layer](http://api.mongodb.org/python/current/tools.html?&_ga=1.36608928.1014949497.1445330034#orm-like-layers)，官方称作 Document-Object Mapper，可以像使用 Django 的 ORM 一样，简单的操作和处理数据。 

面对这么多选择，就想探究这些选择都有哪些特点，性能如何，所以有了这篇文章。你可以在这里找到所有的测试代码和测试数据

https://github.com/restran/tornado-mongodb-performance-test

## HTTP 性能测试工具

HTTP 性能测试工具可以选择：

- [pylot](http://www.pylot.org/) （由 Python 开发）
- [ab - Apache HTTP server benchmarking tool](http://httpd.apache.org/docs/current/programs/ab.html)

这里的测试使用 ab，安装方法

    sudo apt-get install apache2-utils

## 测试配置

测试的配置如下

- Tornado 程序位于一台 Ubuntu 14.04 x86_64 的虚拟机，2 GB 内存，2 核心 CPU，2.59 GHz。
- MongoDB 3.06 x86_64 Windows 版，在一台 Windows 2008 R2 的虚拟机，4 GB 内存，2 核心 CPU，2.39 GHz。
- MongoDB 数据库中已经预先插入 100W 条数据，以下所有的实验都是测试从数据库中读数据的性能。
- Tornado 使用最新的 4.2.1 版。

数据库中的数据是这个样子的

```json
{
    "_id": {
        "$oid": "5630cd05f7732b28a81f57fa"
    }, 
    "title": "Post title", 
    "created": {
        "$date": "2015-10-28T21:26:29.271+0000"
    }
}
```

Tornado 中查询数据的 Handler 是这个样子的，以 PyMongo 3.0 为例。

```py
class QueryHandler(APIHandler):
    def get(self):
        cursor = self.database.post.find(limit=30)
        json_data = []
        for t in cursor:
            j = {
               '_id': text_type(t['_id']),
               'title': t['title'],
               'created': t['created'].strftime('%Y-%m-%d %H:%M:%S') 
               if t['created'] else None
            }
            json_data.append(j)

        self.success(json_data)
```

## 测试说明

在实际测试的时候，发现在 PyMongo 2.8 的环境下，PyMongo 2.8 和 MongoEngine 性能都很差，因此设置了两组测试。

### 测试 1

总共 10000 个请求，每次并发 100 个（同时发送 100 个），使用如下命令

    ab -n 10000 -c 100 http://127.0.0.1:8500/api/posts/query/
    
实验对象：

- Motor（Mortor 最新版是基于 PyMongo 2.8）
- PyMongo 3.0
- PyMongo 3.0 + gevent（PyMongo 支持 gevent）
- MongoEngine + PyMongo 3.0

PyMongo 开启 gevent 的方法，可以参考
https://api.mongodb.org/python/current/examples/gevent.html

### 测试 2

总共 100 个请求，每次并发 10 个（同时发送 10 个），使用如下命令

    ab -n 100 -c 10 http://127.0.0.1:8500/api/posts/query/
    
实验对象：

- PyMongo 2.8
- PyMongo 2.8 + gevent
- MongoEngine + PyMongo 2.8

## Virtualenv

由于要使用不同版本的 PyMongo，因此使用了 [Virtualenv](https://virtualenv.readthedocs.org/) 来创建不同的环境。

> Windows 环境下的 virtualenv，命令会有些不一样，这里的命令适用于 Linux。

安装

    sudo pip install virtualenv
    
创建一个虚拟的 Python 环境

    virtualenv env_name
    
创建测试需要的两个环境

    virtualenv pymongo2.8
    virtualenv pymongo3.0
    
激活虚拟环境，安装相应的包

    cd pymongo2.8
    source bin/activate
    pip install pymongo==2.8.0 tornado mongoengine motor gevent

对虚拟环境 pymongo3.0 执行相应的操作

    cd pymongo3.0
    source bin/activate
    pip install pymongo==3.0.6 tornado mongoengine gevent

用虚拟环境中的 Python 启动 Tornado 程序

    /path/to/pymongo2.8/bin/python pymongo2.8_app.py

## 测试结果

先给出两组测试结果的数据：完成所有请求的耗时，吞吐量（每秒处理的请求数）

![mongodb_tornaod_1](/uploads/post_img/2015/11/mongodb_tornaod_1.png "")

![mongodb_tornaod_2](/uploads/post_img/2015/11/mongodb_tornaod_2.png "")

从测试的结果来看，Motor 的性能确实很好，gevent 几乎没有性能提升，PyMongo 2.8 的性能很差，MongoEngine 是在 PyMongo 的基础上有封装了一层，但是两者性能相差不大。

Tornado 的单线程的，同步的数据库 Driver 会将 Tornado 阻塞住，导致无法处理其他的请求。

最后给出一组数据，百分比请求的最大响应时间。下面两张图，左边坐标的单位是毫秒。例如 Motor 有 50% 的请求是在 376 毫秒内完成的。

![mongodb_tornaod_3](/uploads/post_img/2015/11/mongodb_tornaod_3.png "")

PyMongo 2.8，PyMongo 2.8 + gevent，MongoEngine + PyMongo 2.8 三条线重叠在了一起，它们之间的性能相当。



