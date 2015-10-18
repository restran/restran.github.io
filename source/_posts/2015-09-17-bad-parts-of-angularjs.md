---
title: AngularJS 的缺点是什么
layout: post
category : [前端]
tagline: 
tags : [AngularJS]
---

今天被问到这个问题，事后才想起来，最大的缺点就是 `SEO` 啊。

AngularJS 是一个 MVVM 的框架，也可以理解成一个浏览器端的 HTML 模板引擎。由于 HTML 的内容是通过数据绑定和 HTML 模板在浏览器端生成的，那么搜索引擎在爬取这个页面的时候，读到的只是我们写的 template，无法知道页面真实的样子，因为不会去执行一遍 JS 脚本。那搜索引擎就不能很好的收录我们的网站，用户就没法找到我们的网站了。

**那怎么解决**

请看[这篇文章](http://angularjs.cn/A05v "")，还有[这篇](http://stoneydream.com/2015/05/31/angularjs%E5%A6%82%E4%BD%95%E5%81%9Aseo/ "")，基本思路就是区分对待：

> 对于正常用户的访问，服务器响应AngularJS应用框架；对于搜索引擎的访问，则响应专门针对SEO的HTML页面（而不是AngularJS应用）。也就是说，SEO还是像普通网站那样，在服务器端处理的。

Github 上有个 [Angular-SEO](https://github.com/steeve/angular-seo "") 的项目，采用的就是这种原理。


