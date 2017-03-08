---
title: Python 入门教程 Lesson 2.2 - Web 开发入门
layout: post
category : [技术]
tagline: 
tags : [Python]
---

在浏览器的地址栏上输入 URL ，并按下回车后发生了什么？

- [在浏览器地址栏输入一个URL后回车，背后会进行哪些技术步骤？](https://www.zhihu.com/question/34873227)
- [从输入 URL 到页面加载完成的过程中都发生了什么事情？](http://fex.baidu.com/blog/2014/05/what-happen/)
- [前端经典面试题: 从输入 URL 到页面加载发生了什么？](https://gold.xitu.io/entry/57f10284da2f60004f5f2e5e)
- [当···时发生了什么？](https://github.com/skyline75489/what-happens-when-zh_CN)

## HTTP 协议

- [关于HTTP协议，一篇就够了](http://www.jianshu.com/p/80e25cb1d81a)
- [HTTP 协议入门](http://www.ruanyifeng.com/blog/2016/08/http.html)
- [HTTP协议详解](http://www.cnblogs.com/li0803/archive/2008/11/03/1324746.html)


HTTP 协议主要包括这几项内容

- 请求和响应
- 无状态
- URL
- 端口
- 方法
- 状态码 
- Header
- Body
- Cookie

### HTTP 方法

常见的有这几种方法

- GET 一般做获取的操作，Body为空
- POST 一般做提交的操作，数据放在Body中
- HEAD 等同于GET，但是只返回头部
- PUT 上传数据 （不常用）
- DELETE 删除数据 （不常用）
- OPTIONS 查看支持哪些方法

### HTTP 状态码

状态码是由3位数组成，第一个数字定义了响应的类别

- 1xx：指示信息，表示请求已接收，继续处理
- 2xx：成功，表示请求已被成功接收、理解、接受
- 3xx：重定向，要完成请求必须进行更进一步的操作
- 4xx：客户端错误，请求有语法错误或请求无法实现
- 5xx：服务器端错误，服务器未能实现合法的请求

可以自定义状态码，常见的有这几种

- 200 成功
- 404 请求的资源不存在
- 301 永久重定向，让浏览器记住，下次就直接访问那个地址
- 302 临时重定向
- 401 没有权限，会弹出一个框让客户端登录
- 403 禁止访问
- 500 服务端错误
- 502 服务端使用了代理但是代理请求的服务无法访问 

## Web API 是什么？

- API 是应用程序接口的意思
- Web API 是使用 Web 作为数据传输媒介的应用程序接口

可以把 Web API 想象成一个函数，调用 Web API 就是在调用这个函数。只是这个函数部署在服务端，在调用的时候需要使用 HTTP 协议来传输函数的参数和返回值

```py
def my_api(params1, params2):
    print('do someting')
    data = ['foo', 'bar']
    return data
```

## JSON

- Web API 通过 HTTP 协议来传输参数和返回值
- 传输的数据，需要使用约定的格式

JSON （JavaScript Simple Object Notation），JSON 的数据类型只有四种：

- 数字
- 字符串
- 列表
- 字典

这是一个 JSON 的例子，可以发现跟 Python 的数据类型和表示方式是一样的，因此 Python 原生就很适合处理 JSON 数据

```json
data = [
    {
        'name': 'jack',
        'age': 28,
        'tax': 120.12
    }
]
```

## Web 框架

做 Web 开发，需要一个 Web 框架，用框架的原因在于简化开发。

- [Django](https://www.djangoproject.com/) 大而全的框架
- [Tornado](http://www.tornadoweb.org/en/stable/) 异步的框架
- [Flask](http://flask.pocoo.org/) 微框架

这三个框架都有一个优点就是文档很详细

- [Django 中文文档](https://wizardforcel.gitbooks.io/django-chinese-docs-18/content/)
- [Tornado 中文文档](https://tornado-zh.readthedocs.io/zh/latest/)
- [Flask 中文文档](http://docs.jinkan.org/docs/flask/)


