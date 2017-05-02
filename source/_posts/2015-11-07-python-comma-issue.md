---
title: Python 中一个逗号引发的悲剧
layout: post
category: [Python]
tagline: 
keywords: [python, 语法, 错误解决, 逗号]
tags: [Python]
---

遇到一个 Python 字符串的坑，记录一下，看看下面这些代码


```py
>>> a = [
...     'foo'
...     'bar',
...     'tree'
... ]
>>>
>>> b = 'foo' 'bar'
>>>
>>> print a
['foobar', 'tree']
>>> print b
foobar
>>>
```

注意列表 `a` 的第1个元素后面漏掉了一个 `,` 这很容易看走眼吧。而且最最关键的竟然是没有语法错误，而且 PyCharm 也没有提示有错误。

查了一下原来这是一个 Feature

> 只要把两个字符串放在一起，中间有空白或者没有空白，两个字符串自动连接为一个字符串。

也就是说 `'foo' + 'bar'` 等价于 `'foo' 'bar'`


再来看另外一个例子，注意第二行后面的逗号

```py
>>> a = {'foo': 'bar'}
>>> b = a.get('foo'),
>>> c = a.get('foo')
>>> print(b)
('bar',)
>>> print(c)
bar
>>>
```

本来 `b` 应该是一个字符串，结果硬是变成了元组。

