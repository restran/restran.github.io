---
title: Python 入门教程 Lesson 1 - 初识 Python
layout: post
category : [技术]
tagline: 
keywords: [python, 教程, 入门, 开发环境, ide, 推荐, sublimetext, ipyhton, jupyter, pycharm]
tags : [Python]
---

## Python 是什么

Python是一种面相对象、函数式、动态类型、解释型的计算机程序语言。目前在 Web 开发、爬虫、安全研究、云计算、数据科学、人工智能等领域得到广泛应用，其设计哲学是“优雅”，“明确”，“简单”。

## Python 能做什么

- Web 和 API开发，Django，Tornado 等 Web 框架
- 云计算，OpenStack
- 人工智能，TensorFlow，PyTorch
- 大数据，NumPy，Pandas，dpark
- 爬虫，scrapy

## 案例演示

网站和API平台

- API监控
- Web应用网关
- 数据可视化 [matplotlib](http://matplotlib.org/gallery.html)
- [发送邮件](http://www.restran.net/2015/02/12/python-postfix-email/)
- 爬虫

## 哪些公司在用

国内

- 知乎
- 豆瓣
- 果壳
- 还有各大公司


国外

- Google
- Dropbox
- Microsoft
- NASA，火星探险车上有很多代码是 Python 生成的

## Python 的设计哲学

在任何一个 Python 交互解释器中输入 `import this`，就会出现 Python 的一个彩蛋，描述了一系列 Python 的设计原则。

简要来说，其设计哲学是“优雅”，“明确”，“简单”。这些设计哲学体现在了语法特点上

### 语法特点

跟其他语言相比，最显著的不同就是没有大括号，没有分号（简洁），将缩进作为语法的一部分（为了让代码格式好看和统一，用语法的方式强制约束）。

## Python 版本的选择

学习 Python，很多人在问的一个问题就是我要选择 2 还是 3。目前的情况是：

1. 很多大公司目前生产环境上使用的是 Python2，例如 Google，Dropbox 等公司。
2. Python2 官方在 2020 年以后就不再维护，意味着有 bug 或者 安全问题，不会有补丁。但是 Python2 在很长一个时间内，仍然会在许多公司内应用。
3. Python2 因为设计上存在一些缺陷，比如字符串编码问题，所以才会重写推出 Python3。但是 Python3 与 Python2 不完全兼容，有些代码需要改造才能在 Python3 下运行。
4. 目前很多主流的框架都做到了 2 和 3 同时兼容。
5. Python 3 的一些语法在最新的 Python 2.7 中也已经可以使用，在 Python 2.7 中写同时兼容 3 语法的代码，也很普遍。
6. 从长远来看，Python3 是未来。

对于初学者来说，我建议选择 Python3，可以避免很多问题，比如字符串编码的问题。

最新的稳定版本 [Python 3.5.3](https://www.python.org/downloads/)

## Python 2 和 3 的主要区别

其实只要了解了 Python 2 和 3 的区别，借助一些工具包，在使用上完成可以做到 2 和 3 同时兼容。但是对于新的项目，完全可以只考虑兼容 3 即可。

1. print 从语句变成了函数
2. urlib 等内置库的位置发生变更
3. 字符串默认为 Unicode 编码
4. xrange 重命名为 range，同时还有一系列内置函数及方法，都返回迭代器对象，而不是列表或者元组，比如 filter，map，dict.items 等
5. ...

一些用来帮助实现 2 和 3 同时兼容的包

- six
- future

扩展阅读

- [Python 2.7.x 和 Python 3.x 的主要区别](https://segmentfault.com/a/1190000000618286)
- [Python 2 和 Python 3 有哪些主要区别](https://www.zhihu.com/question/19698598)

## IDE 选择和开发环境的搭建

- 一个文本编辑器作为辅助，[Sublime Text](https://www.sublimetext.com/)
- 一个功能强大的交互式编辑器作为辅助，[iPython](https://ipython.org/)
- 一个主力编辑器，带有功能强大的调试功能，[PyCharm](https://www.jetbrains.com/pycharm/)

### Submile Text 3

安装时，记得勾选添加到 Windows 资源管理器上下文菜单，以后可以直接右键打开文件

在 Preferences->Settings 中，记得配置 `translate_tabs_to_spaces` 为 true，将所有的 tab 都转换成空格。

```
"translate_tabs_to_spaces": true,
```

因为 Python 中缩进是语法的一部分，如果缩进不同，例如混用 tab 和 空格，很容易导致语法错误。而且我们在 PyCharm 中，会倾向于设置显示空格，避免语法错误。而 `Tab` 显示出来视觉效果不好。


#### 安装 Package Control

按下组合键

```
ctrl + `
```

在弹出的控制台中输入如下代码，并按回车运行

```py
import urllib.request,os,hashlib; h = 'df21e130d211cfc94d9b0905775a7c0f' + '1e3d39e33b79698005270310898eea76'; pf = 'Package Control.sublime-package'; ipp = sublime.installed_packages_path(); urllib.request.install_opener( urllib.request.build_opener( urllib.request.ProxyHandler()) ); by = urllib.request.urlopen( 'http://packagecontrol.io/' + pf.replace(' ', '%20')).read(); dh = hashlib.sha256(by).hexdigest(); print('Error validating download (got %s instead of %s), please try manual install' % (dh, h)) if dh != h else open(os.path.join( ipp, pf), 'wb' ).write(by)
```

#### 安装插件

安装好后，按下组合键 `Ctrl+Shift+P` 输入 `pcip` 选择第一项 `Package Control Install Package`，然后再输入插件名称即可查找和安装

必装的插件

- BracketHighlighter 高亮显示匹配的括号、引号和标签
- IME Support 支持中文输入法
- Jedi Python 代码自动提示
- ConvertToUTF8 文件编码转换

### iPython

有代码完成提示，可以用来做一些代码测试

安装

    pip3 install jupyter

打开 Notebook

    jupyter notebook

### PyCharm

有免费的社区版和收费的专业版，社区版可以满足基本需求

专业版有专门对 Django 做了一些支持，可以使用[该地址](http://idea.lanyus.com/)提供的序列号注册。


### 字体

等宽字体

- Miscroft Yahei Mono

## Python 的基础语法

### 怎么写注释

```py
# 这是注释

"""
这是字符串，但是也常用来作为文档型注释，放在文件或函数的开头用来作为文档
"""
```

### 核心数据类型

```py
# 数值
foo = 1
foo = 1.1

## 字符串
bar = 'this is a string'
bar = "this is a string"
bar = """this is a string"""

# 列表
foo = [1, 'a', 'b']
# 按序号取值 f[0], f[1]

# 字典，key-value 型
bar = {
    1: 123,
    'a': 'a string'
}

# bar[1], bar['a']，按 key 取值
```

- [Python核心数据类型——元组](http://www.cnblogs.com/restran/archive/2011/11/27/2265127.html)
- [Python核心数据类型——文件](http://www.cnblogs.com/restran/archive/2011/11/27/2265133.html)
- [Python核心数据类型——字典](http://www.cnblogs.com/restran/archive/2011/11/27/2265109.html)
- [Python核心数据类型——列表](http://www.cnblogs.com/restran/archive/2011/11/27/2264893.html)
- [Python核心数据类型——字符串](http://www.cnblogs.com/restran/archive/2011/11/22/2259407.html)
- [Python核心数据类型——数字](http://www.cnblogs.com/restran/archive/2011/11/22/2259401.html)

### 可变类型和不可变类型

不可变意味着不能对其修改，常用来作为只读常量之类的

- 数字、字符串和元组是不可变的
- 列表和字典是可变的

### 循环和条件表达式

```py
x = 'apple'

if x == 'milk':
    print('color: white')
elif x == 'orange':
    print('color: yellow')
else:
    print('color: unknow')
```

```py
# for 循环
sum_value = 0
# 循环100次，i 是序号
for i in range(100):
    sum_value += i

list_data = [1, 'a', 'b']
# 遍历列表
for v in list_data:
    print(v)
# 遍历列表，同时给出当前的序号
for i, v in enumerate(list_data):
    # i 为序号
    print('%s: %s' % (i, v))

# while 循环
x = 1
while True:
    if x == 10:
        break
    else:
        x += 1
```

### 函数

```py
def func(v1, v2):
    pass
```


### 函数的参数传递

```
# v1 为必传的参数
# v2 为带有默认值，可以省略的参数
# args 为列表型参数，参数传递的实际上是一个元组
# kwargs 为字典型参数，传递的实际上是一个字典
def func(v1, v2=123, *args, **kwargs):
    print(v1)
    print(v2)
    print(args)
    print(kwargs)

# 调用方法
func('123')
func('123', 456)
func('123', v2=456)
# 后面的1，2，3为args的参数
func('123', 456, 1, 2)
# 后面的1，2，3为args的参数
func('123', 456, 1, 2, v3='v3', v4='v4')
```

#### 常犯的错误

默认参数不能用可变类型，否则这个可变类型的参数会跟着函数调用而变化

```py
def func(v1, v2=[]):
    v2.append(v1)
    print(v2)
    
func('1')
func('2')
```

### 函数的返回值

```
def func(v1, v2=123, *args, **kwargs):
    return v1, v2, ['a', 'b']
    
v1, v2, v3, v4 = func(1, 456)
# 用 _ 来表示不想对其命名的变量
v1, v2, _, _ = func(1, 456)
# 返回的实际上是一个元组
ret = func(1, 456)
print(ret)
```

### 类

```py
class MyClasss(object):
    def __init__(self, v1, v2=1, *args, **kwargs):
        pass
        
    def method1(self, v1):
        pass
    
    @classmethod
    def class_method(cls, v1, *args, **kwargs):
        """类方法"""
        pass

    @staticmethod
    def class_method(v1, *args, **kwargs):
        """静态方法"""
        pass
```

### is 和 == 

```py
is 比较的是对象的引用是相同
== 比较的是值是否相同
```

### 全局变量的写法

没有正确使用全局变量的例子

```py
foo = ['123', '456']

def func():
    foo = ['123']

func()
print(foo)
```

正确使用全局变量的例子

```py
foo = ['123', '456']

def func():
    global foo
    foo = ['123']

func()
print(foo)
```

## 命名空间

命名空间的意义，就是用来确定一个变量符号到底对应什么对象。命名空间可以一个套一个地形成一条命名空间链。

### 变量和对象的概念

[变量](http://wilburding.github.io/blog/2013/05/05/what-is-a-variable/)是什么呢？

按照[维基百科]("https://en.wikipedia.org/wiki/Variable_(computer_science") 的解释

> 变量是一个存储位置和一个关联的符号名字，这个存储位置包含了一些已知或未知的量或者信息。

变量实际上是一个字符串的符号，用来关联一个存储在内存中的对象。在 Python 中，会使用 dict（就是 Python 的 dict 对象）来存储变量符号（字符串）与一个对象的映射。

### 模块和包的概念

块和包是用来做变量命名空间的隔离。

- 模块，.py 文件
- 包， 含有 __init__.py 文件的文件夹

使用方法

```
from datetime import datetime
import json
```

### 作用域

Python 使用 LEGB 的顺序来查找一个符号对应的对象

> locals -> enclosing function -> globals -> builtins

**locals**，当前所在命名空间（如函数、模块），函数的参数也属于命名空间内的变量

**enclosing**，外部嵌套函数的命名空间（闭包中常见）

```py
def fun1(a):
    def fun2():
        # a 位于外部嵌套函数的命名空间
        print(a)
```

**globals**，全局变量，函数定义所在模块的命名空间

```py
a = 1
def fun():
    # 需要通过 global 指令来声明全局变量
    global a
    # 修改全局变量，而不是创建一个新的 local 变量
    a = 2
```

**builtins**，内置模块的命名空间。Python 在启动的时候会自动为我们载入很多内置的函数、类，比如 dict，list，type，print，这些都位于 `__builtins__` 模块中，可以使用 `dir(__builtins__)` 来查看。这也是为什么我们在没有 import 任何模块的情况下，就能使用这么多丰富的函数和功能了

### 常犯的错误

- 覆盖系统的包，如 当前文件夹有个 `json.py`，然后 `import json`，导入的是当前文件夹的

## 内置属性 `__name__`

现在到了解释 `if __name__ == '__main__'` 这行代码的时候了。当 Python 程序启动后，Python 会自动为每个模块设置一个属性 `__name__` 通常使用的是模块的名字，也就是文件名，但唯一的例外是主模块，主模块将会被设置为 `__main__`。利用这一特性，就可以做一些特别的事。比如当该模块以主模块来运行的时候，可以运行测试用例。而当被其他模块 import 时，则只是乖乖的，提供函数和功能就好。

## 开发规范

Python 有一份 [PEP8](https://www.python.org/dev/peps/pep-0008/) 说明了代码的编写规范，[中文地址](https://my.oschina.net/u/1433482/blog/464444)

- 变量名、函数名、模块名（文件名称）使用小写，多个单词用下划线，类名使用首字母大写
- 缩进使用4个空格，而不是 TAB

使用 PyCharm 的话，会自动有 PEP8 开发规范的提示，只要按照提示修改即可，不用刻意去记 PEP8。

## 依赖管理 pip

Python 的依赖包是存放在 [pypi](https://pypi.python.org/) 上，可以直接去上面下载安装

安装依赖包

    pip install django

依赖说明文件，requirements.txt

```txt
django==1.9.2
tornado>=4.0
requests
```

批量安装依赖

    pip install -r requirements.txt

安装 wheel 格式的依赖包

    pip install numpy-1.12.0-cp35-none-win_amd64.whl 

搜索某个依赖包

    pip search package_name

删除

    pip uninstall package_name
     
下载源码安装
    
    # 进入源码目录，如果存在 setup.py 则可以进行源码安装，使用该命令
    python setup.py install

### 常见问题

源码安装，但是没有 C++ 的编译环境

```
error: Microsoft Visual C++ 14.0 is required. Get it with "Microsoft Visual
C++ Build Tools": http://landinghub.visualstudio.com/visual-cpp-build-tools
```

- 如果是 Python 27 可以安装 [Microsoft Visual C++ Compiler for Python 2.7
](https://www.microsoft.com/en-us/download/details.aspx?id=44266)
- 如果是 Python 3 可以安装 [Visual C++ 2015 Build Tools](http://landinghub.visualstudio.com/visual-cpp-build-tools)
- 或者使用下载编译好的 exe 文件
- 或者使用 whl 格式的包

## 代码模板

```py
# -*- coding: utf-8 -*-
# 如果是使用 Python 2，请加上下面这一句
from __future__ import unicode_literals
import json

a = [1, 'python']
a = 'a string'
my_list = ['1', '2', 'apple']
my_dict = {}

def func():
    a = 1
    b = 257
    print(a + b)
    # 这里没有使用 global，实际上是创建一个新的对象
    # 而不是使用最上面全局的那个对象
    # 如果要使用全局变量要先声明 global my_list
    my_list = ['orange', 'milk']
    for i, v in enumerate(my_list):
        print('%s: %s' % (i, v))

    my_dict['key'] = my_list
    print(json.dumps(my_dict, indent=2))

class MyClasss(object):
    def __init__(self, v1, v2=1, *args, **kwargs):
        self.v1 = v1
        self.v2 = v2
        if len(args) > 0:
            self.v3 = args[0] 
        self.v4 = kwargs.get('v4', None)

        print(args)
        print(kwargs)

    def print_data(self):
        print('v1: %s' % self.v1)
        print('v2: %s' % self.v2)
        print('v3: %s' % self.v3)
        print('v4: %s' % self.v4)

    @classmethod
    def class_method(cls, v1, *args, **kwargs):
        print('class_method')

    @staticmethod
    def static_method(v1, *args, **kwargs):
        print('static_method')

def main():
    print(a)
    func()
    my_class = MyClasss('v1', 'v2', 'v3', v4='v4')
    my_class.print_data()
    my_class.class_method('123')
    my_class.static_method('456')
    MyClasss.class_method('123')
    MyClasss.static_method('456')

if __name__ == '__main__':
    main()
```

## 扩展阅读

### Python 项目收集

- [awesome-python](https://github.com/vinta/awesome-python)
- [Python资源大全中文版](https://github.com/jobbole/awesome-python-cn)

### 一些有趣的例子

- [一行Python代码能实现什么功能](https://www.zhihu.com/question/37046157)

### Python 教程和资料

- [廖雪峰 Python3 教程](http://www.liaoxuefeng.com/wiki/0014316089557264a6b348958f449949df42a6d3a2e542c000)
- [零基础学 Python](https://github.com/qiwsir/ITArticles/tree/master/BasicPython)
- [老齐的技术资料](https://github.com/qiwsir/ITArticles/tree/master/Python)
- [awesome-python-books](https://github.com/jobbole/awesome-python-books)

### Python 历史故事

- [历史故事](https://github.com/looly/python-basic/blob/master/001.md)

### Python 之禅

- [Python 哲学理念及设计思想](http://suyuening.com/archives/502.html)
- [Python 哲学漫画](http://codingpy.com/article/zen-of-python-illustrated/)


### 其他

- [为什么Python的字符串是不可变对象](http://hgoldfish.com/blogs/article/61/)
- [用Python生成词云](https://github.com/amueller/word_cloud)
- [6 种 Python 数据可视化工具](http://python.jobbole.com/85601/)
- [Sublime Text](http://9iphp.com/web/html/1260.html)
- [为什么文件名要小写](http://www.ruanyifeng.com/blog/2017/02/filename-should-be-lowercase.html)