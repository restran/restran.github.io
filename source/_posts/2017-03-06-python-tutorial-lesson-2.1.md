---
title: Python 入门教程 Lesson 2.1 - Python 知识进阶
layout: post
category : [技术]
tagline: 
tags : [Python]
---


以下只简单列举一些知识点，其他方面的知识，可以去阅读详细的教程，或者在遇到问题时再去翻阅

## Python 代码的执行

当我们运行一个 Python 文件，可以在命令行上输入 

    python run_demo.py

run_demo.py 的文件内容

```py
# -*- coding: utf-8 -*-

"""
演示Python代码的执行，请记住一句话 Python 的一切都是对象
"""

# 这句话是为了兼容 Python2，让 Python2 的字符串默认为 Unicode，并使用绝对导入
from __future__ import unicode_literals, absolute_import

# Python 的代码是从上往下运行的
# 这里的 def func() 是创建一个函数
# 只有执行了这段代码，函数才会创建
def func():
    print('hello func')


# 这段代码是开始创建MyClass这个类的对象
class MyClass(object):
    # 这里是创建类的类成员变量，因此当执行这个模块的时候
    # 这里的代码需要直接执行，才能正确的创建这个类的对象
    class_field = 'test'
    print('MyClass object created')

    def func(self):
        print('class func')


# 因此我们这里 import time，实际上是做了两件事
# 1. 执行 time 这个模块里面的代码，并创建对应的函数、类等对象
# 2. 在当前模块创建一个新的变量 time，这个变量指向 time 这个模块
import time

# 这里有个 print 语句，当该模块被别的模块 import 的时候就会打印
# 但只有在程序第一次 import 该模块的时候才会打印，
# 因为 python 模块被执行后，是生成一个模块对象，以后再 import 时，
# 就直接使用该对象，不再执行模块里面的代码来生成模块对象
# 可以运行 test2来验证
print('run_demo 模块被执行')


def main():
    # python 中一切都是对象，每个对象都有一个内置的 __name__ 属性
    print(main.__name__)
    func()


# 当前运行的 .py 文件是一个模块，模块也是对象，也会有 __name__
# 如果程序是从当前模块运行的，那么 __name__ 为 __main__
if __name__ == '__main__':
    # 如果模块是被 import 进来的，则 __name__ 则为文件名
    print(time.__name__)
    # 如果是运行该模块，则会执行 main() 函数
    # 如果是被别的模块 import 则不会执行 main() 函数
    # 因此 main() 函数可以用来做一些函数的测试等
    main()
```

test1.py 文件内容

```py
# -*- coding: utf-8 -*-
import run_demo

print('test1 模块被执行')
```

test2.py 文件内容

```py
# -*- coding: utf-8 -*-
import run_demo
import test1

"""
当运行该模块的时候，会发现只输出一个 run_demo 模块被执行
"""

print('test2 模块被执行')
```

关于 Python 运行的一些原理，上面只做了简要介绍，详细可以查看[这篇文章](http://www.restran.net/2015/10/22/how-python-code-run/#more)

## 列表/字典解析

```py
products = [
    {
    'name': 'news',
        'id': 1,
        'year': '2010',
        'status': 'up'
    }, 
    {
    'name': 'search',
        'id': 2,
        'year': '2000',
        'status': 'up'
    }, 
    {
        'name': 'wave',
        'id': 3,
        'year': '2009',
        'status': 'down'
    }
]

# 列表解析，通过遍历一个迭代器，生成一个新的列表
# 比 for 循环速度快，也更简洁
new_products = [{'name': t['name']} for t in products]
# 字典解析，通过遍历一个迭代器，生成一个新的字典
new_product_dict = {t['name'] : t for t in products}
```

## 列表分片

```py
# 列表分片，索引从0开始
# 生成测试数据
data = range(10)
# 从第一个（含）开始的所有
data = data[1:]
# 到倒数第一个（不含）前的所有
data = data[:-1]
# 从第一个（含）到倒数第一个（不含）
data = data[1:-1]
```

### 读写文件

文件的读写模式有

| 模式        | 描述   |
| --------   | -----  |
| r     | 只读 | 
| r+     | 可读可写，文件指针在文件开头 | 
| rb     |  以二进制模式读取 | 
| rb+     |  以二进制模式读取，文件指针在文件开头 | 
| w     |  只写，如果文件已存在则覆盖，不存在，则新建 | 
| w+     |  等同 w 但是可读，需要注意文件指针的位置 | 
| wb     |  等同 w 但是以二进制模式处理数据 | 
| wb+   | 等同 wb 但是可读，不过一开始打开的文件是新文件，里面没有内容 | 
| a     |  以追加内容的方式写入，如果文件不存在，则新建文件 | 
| a+    |  等同 a 但是可读 | 
| ab     |  等同 a 但是以二进制模式处理数据 | 
| ab+    |  等同 ab 但是可读，需要注意文件指针的位置 | 

也可以参考[这里](http://www.cnblogs.com/feeland/p/4477535.html)

```py
# 使用 with 语句，自动处理文件关闭
# 文件可以像列表一样遍历，即便是读取超大文件，依然效率很高
# 一行一行的读数据
with open('test.txt', 'r') as f:
    # 只读模式，不能写文件
    for line in f:
        print(line)

# 二进制模式读，适合于读一些二进制文件，如图片
with open('test.txt', 'rb') as f:
    # 将文件的所有内容读取出来
    data = f.read()
        
# 写模式，文件旧内容将会删除，并存储为新的内容
with open('test.txt', 'w') as f:
    f.write('test content')

# 追加写模式，文件旧内容会保留，并增加新内容
with open('test.txt', 'a') as f:
    f.write('test content')
```

## 装饰器

```py
# -*- coding: utf-8 -*-
from __future__ import unicode_literals, absolute_import

"""
装饰器的例子
"""

import time
import random
from functools import wraps


# 装饰器的本质，是把函数作为参数传给装饰器函数
# 装饰器实际上是闭包

def log(func):
    """
    打印函数运行日志的装饰器
    :param func:
    :return:
    """

    # wraps 这个装饰器会将 func 的 doc 和 __name__ 复制过来
    # 否则在 wrapper 中调用 func.__name__ 输出的就是 wrapper
    @wraps(func)
    def wrapper(*args, **kwargs):
        print('decorator log is running')
        print('before call %s' % func.__name__)
        ret = func(*args, **kwargs)
        print('after call %s' % func.__name__)
        return ret

    return wrapper


def log_with_message(message):
    """
    打印函数运行日志的装饰器，可以再给装饰器传参数
    :param message:
    :return:
    """

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            print('decorator log_with_message is running, %s' % message)
            ret = func(*args, **kwargs)
            return ret

        return wrapper

    return decorator


def time_elapsed(func):
    """
    记录函数运行耗时的生成器
    :param func:
    :return:
    """

    @wraps(func)
    def wrapper(*args, **kwargs):
        print('decorator time_elapsed is running')
        timestamp = time.time() * 1000
        ret = func(*args, **kwargs)
        now_ts = time.time() * 1000
        elapsed = now_ts - timestamp
        print('%s costs time: %.2fms' % (func.__name__, elapsed))
        return ret

    return wrapper


# 这段代码实际上是，将这个函数变成另外一个函数
# new_func = log(test_func1)
# 当我们调用 test_func1(foo=666) 时
# 实际上调用的是 new_func(666)

@log
def test_func1(foo=123):
    print('test_func1 is running')
    print(foo)


# 装饰器还可以再嵌套装饰器，这段代码实际上是
# new_func = time_elapsed(log(test_func1))
# 当我们调用 test_func2() 时
# 实际上调用的是 new_func()

@time_elapsed
@log
def test_func2():
    print('test_func2 is running')
    # 随机休眠1～2秒
    # time.sleep 函数传的是以秒为单位的数
    time.sleep(random.randrange(100, 200) / 100)


# 装饰器还可以再嵌套装饰器，这段代码实际上是
# new_func = log_with_message('my message')(test_func1)
# 当我们调用 test_func3() 时
# 实际上调用的是 new_func()
@log_with_message('my message')
def test_func3():
    print('test_func3 is running')


def main():
    test_func1(foo=666)
    print('-------------')
    test_func2()
    print('-------------')
    test_func3()


def main2():
    """
    揭示装饰器本质的例子，可以看到这里的代码和main()中执行的结果是一样的
    """
    print('---------------')
    print('揭示装饰器本质的例子')
    # 装饰器本质是变成执行这样的代码
    # 只是有个语法糖@，让其语法变得简单
    new_func = log(test_func1)
    new_func(foo=666)
    print('-------------')
    new_func = time_elapsed(log(test_func2))
    new_func()
    print('-------------')
    new_func = log_with_message('my message')(test_func3)
    new_func()
    print('-------------')


if __name__ == '__main__':
    main()
    main2()
```

