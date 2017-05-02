---
title: 移动端 Web 开发前端知识整理
layout: post
category : [知识整理]
tagline: 
keywords: [web, 前端, 知识整理]
tags : [Web, 前端]
---

最近整理的移动端 Web 开发前端知识，不定期更新。

## HTML5 可以做什么

1. 拍照
2. 获取地理位置
3. 手势
4. canvas 绘图和动画(硬件加速)
5. localstorage，本地缓存

HTML5 动画效果 demo 

http://fff.cmiscm.com/#!/main

**CSS3 动画**

http://isux.tencent.com/css3/index.html

http://beiyuu.com/css3-animation/

[CSS3 实现的 Loading（加载）动画效果](http://www.cnblogs.com/lhb25/p/loading-spinners-animated-with-css3.html
 "")
 

**基本的 HTML 文件结构**

```html
<!DOCTYPE HTML>
<html>
<head lang="zh-CN">
    <meta charset="UTF-8">
    <title>标题</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <!-- 设置初始缩放比例为1.0，使用设备宽度  -->
    <meta name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0,user-scalable=no">
    <!-- 在iOS下开启全屏模式  -->
    <meta name="apple-mobile-web-app-capable" content="yes">
    <!-- 隐藏 Sarafi 状态栏  -->
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <link href="/static/css/your_css.css" rel="stylesheet"/>
</head>
<body>

<script src="/static/js/your_js.js"></script>
</body>
</html>
```

## DOM 操作库

[zepto.js](http://zeptojs.com/ "")

[jQuery](https://jquery.com/ "")

> 1. jQuery 的目标是兼容所有主流浏览器，这就意味着它的大量代码对移动端的浏览器是无用或者低效的
    
> 2. Zepto是一个轻量级的针对现代高级浏览器的JavaScript库，只针对移动端浏览器编写，因此体积更小、效率更高，更重要的是，它的 API 完全仿照 jQuery，如果你会用jquery，那么你也会用zepto。
    
> 3. Zepto的设计目的是提供 jQuery 的类似的API，但并不是100%覆盖 jQuery 。Zepto设计的目的是有一个5-10k的通用库（目前最新版，gzip 压缩后只有 9.1k）、下载并快速执行、有一个熟悉通用的API，所以你能把你主要的精力放到应用开发上。
    

**todo：zepto 与 jQuery 冲突问题**

很多插件是基于jQuery 的，如果想要使用这些插件，又引入了 jQuery 将引起冲突，而且这时候 zepto 就没有引入的意义，但是有些框架又是基于 zepto，例如 frozenui。


## UI 框架

[frozenui（腾讯开源）](http://frozenui.github.io/ "") 腾讯手 Q 风格

[Amaze ~ 妹子 UI（国内开源）](http://amazeui.org/ "") 

[jQuery.mmenu](http://mmenu.frebsite.nl/examples.html "") iOS 风格的菜单

[bootstrap](http://www.bootcss.com/ "")

- [bootstrap UI 组件](http://wrapbootstrap.com/preview/WB0L06586 "")

[semantic-ui](http://www.semantic-ui.cn/ "")

[ratchet](http://goratchet.com/ "")

[jquery mobile](http://demos.jquerymobile.com/ "")

## 字体图标

[Font Awesome](http://fortawesome.github.io/Font-Awesome/ "")

矢量，颜色大小可以自定义


**自定义图标字体**

http://fontello.com/

有时只需要使用到一部分的图标，可以通过自定义的方式来减小图标字体文件的大小。

## HTML 模板引擎

### AngularJS（Google 开源）


场景，需要要动态创建列表数据的时候

没有 AngularJS 之前，用 js 拼接出 HTML 字符串

```js
function render_order_data(data) {
    var obj_item_list = $('#item-list');
    for (var i = 0; i < data.length; i++) {
        var arr = [];
        var d = data[i];
        arr.push('<li class="ui-border-t">');
        arr.push('<div class="item"><div><div>工单流水号</div><div>');
        arr.push(d['id']);
        arr.push('</div></div><div><div>工单标题</div><div>');
        arr.push(d['title']);
        arr.push('</div></div><div><div>申请时间</div><div>');
        arr.push(d['createtime']);
        arr.push('</div></div><div><div>商铺关键字</div><div>');
        arr.push(d['shop_name']);
        arr.push('</div></div><div><div>覆盖范围</div><div>');
        arr.push(d['shop_lengths']);
        arr.push('</div></li>');
        obj_item_list.append(arr.join(''));
    }
}
```

有了 AngularJS 之后，利用 AngularJS 的数据绑定，直接写 HTML 模板，清晰易懂

```html
<tr ng-repeat="entry in entries">
    <td ng-bind="page_info.offset + $index+1"></td>
    <td ng-bind="entry.status"></td>
    <td ng-bind="entry.elapsed + 'ms'"></td>
    <td ng-bind="entry.code"></td>
    <td ng-bind="entry.time"></td>
    <td>
        <span ng-bind="entry.result ? 'Success' : 'Failure'"
              class="label {{ entry.result ? 'label-success' : 'label-danger' }}">Success</span>
    </td>
</tr>
```

**AngularJS 学习资源**

- 幕客网
- http://angularjs.cn/T008
- http://checkcheckzz.gitbooks.io/angularjs-learning-notes/content/index.html


## 表单验证


HTML5 表单验证已经很强大，但是目前在 iOS 8 上面的浏览器仍然是不支持的，Android要 4.4 以上才支持。


**boostrap 表单验证**

Bootstrap Validator

http://1000hz.github.io/bootstrap-validator/

**HAPPY.JS**

Lightweight form validation for jQuery or Zepto.js

http://happyjs.com/

**jQuery Form Validator**

https://github.com/victorjonsson/jQuery-Form-Validator


AngularJS 本身有提供表单验证的功能

**jquery-validation**

[jquery-validation](https://github.com/jzaefferer/jquery-validation "")

semantic-ui 自带表单验证


## 开发模式

前后端分离，接口开发与 HTML，CSS，JS 这些前端开发分离。


## 相关工具

### IDE

[Sublime Text](http://www.sublimetext.com/ "")

> Sublime Text is a sophisticated text editor for code, markup and prose. 
> You'll love the slick user interface, extraordinary features and amazing performance.

[Jetbrains WebStorm](https://www.jetbrains.com/webstorm/ "")（The smartest JavaScript IDE）

> WebStorm is a lightweight yet powerful IDE, perfectly equipped for complex client-side development and server-side development with Node.js.

### 前端工具

**静态文件缓存问题（重要）**

由于默认情况下（服务器没有设置 expire header 为 -1 或 0） WebView 会缓存静态文件，如果没有更新静态文件的版本，会导致网站做了更新，而用户实际上仍在使用旧的文件。

静态资源版本更新与缓存

http://www.infoq.com/cn/articles/front-end-engineering-and-performance-optimization-part1

**使用 FIS 工具解决**

FIS （百度开源）

http://fis.baidu.com/

FIS是专为解决前端开发中自动化工具、性能优化、模块化框架、开发规范、代码部署、开发流程等问题的工具框架。可以实现静态文件压缩、合并、为文件名添加版本 md5 Hash。

### 调试工具

Chrome （Android iOS 都是 Webkit 内核）

Fiddler（抓包工具，需要借助 wi-fi 热点分享）


### HTTP 服务器 Nginx

Nginx是一款面向性能设计的HTTP服务器，相较于Apache、lighttpd具有占有内存少，稳定性高等优势。

在前端开发中，经常作为反向代理服务器，用来在自己的开发电脑上，模拟生产环境，通过资源重定向和反向代理，可以同时访问部署在其他服务器上的接口或网站，以及自己电脑上正在开发的网页。

http://nginx.org/en/download.html


nginx 配置的一个例子

```nginx
server {
  listen  *:5005;
  access_log  logs/my_site_access.log;
  error_log   logs/my_site_error.log;

  # 不缓存
  expires      0;
  # add_header   Cache-Control private;

  #location ~* \.html$ {
  #  expires -1;
  #}

  location / {
    ssi on;
    autoindex on;
    # / 前缀的请求，定位到html目录下
    root  "D:/WebStorm/my_site/html";
    index  index.html index.htm;
  }
 
 # /static 前缀的 uri 请求，定位到这个目录 
 location /static {
    alias "D:/WebStorm/my_site/static"; 
  } 

  # /@api_my_site 前缀的 uri，反向代理到 http://192.168.14.93:9999
  # /@api_my_site 前缀的 uri 是 api_my_site 接口请求地址
  location /@api_my_site {
    # 重写 uri，原本的 uri 是 /@api_my_site/... 
    # 可以去掉前缀 /@api_my_site/
    # rewrite /@api_my_site/(.*) /$1  break;
    
    proxy_pass http://192.168.14.93:9999;
    proxy_set_header Cookie $http_cookie;
  }
}

```


### 在线工具

**jsfiddle**

Test and share JavaScript, CSS, HTML or CoffeeScript online.

在线即时展现 Html、JS、CSS 的编辑工具，可以有效的帮助 web 前端开发人员来有效分享和演示前端效果。

https://jsfiddle.net/

**CSS3 HTML5 兼容性查询**

查询 HTML5 和 CSS3 语法兼容性

http://caniuse.com/
http://mobilehtml5.org/


**CSS 语法手册**

http://tympanus.net/codrops/css_reference/

## 书

CSS设计指南（第3版）（文字版）

## 在线学习资源

[慕课网](http://www.imooc.com/course/list?c=fe "")

[codeschool](https://www.codeschool.com/ "")

[codeacademy](http://www.codecademy.com/zh/ "")


## JS 模块化加载

[前端模块化开发的价值](https://github.com/seajs/seajs/issues/547 "")

[Requirejs ](http://requirejs.org/ "")

[Seajs （淘宝开源）](http://seajs.org/docs/ "")


## 常用组件

回到页首


## 性能优化

1. 移动网络的环境比较复杂，在调试的时候可以用 Chrome 模拟不同的网络环境，关注页面加载的数据量，和加载时间。

![http://oxygen.qiniudn.com/img2015051433.png][1]


2. 使用 CDN，常用的库一般会有 CDN 地址，也可以将自己的一些静态文件放在七牛上，七牛有免费的额度。
3. 小图片转成 base64，减少 HTTP 请求
4. css，js 文件压缩，启用GZip（HTTP服务器已开启 gzip）
5. 服务器开启静态文件缓存，发布新版本时，需要对文件名加md5戳，使用 fis 工具（html 文件强制不缓存）。
6. 大量的图片显示，可以使用 Canvas 画图，而不用 img 标签，Canvas 有硬件加速
7. 无阻塞，写在HTML头部的JavaScript（无异步），和写在HTML标签中的Style会阻塞页面的渲染，因此CSS放在页面头部并使用Link方式引入，避免在HTML标签中写Style，JavaScript放在页面尾。
8. 网页的渲染不支持硬件加速，dom很多很大的时候会很卡，Facebook 曾经就是因为这个原因放弃了html5，但现在又推出了一个 react js
9. javascript 单线程，不要执行太复杂的任务，否则会导致页面卡住。
10. 动画优化，尽量使用CSS3动画

11. HTML5 的 Manifest 和 localstorage，在本地缓存文件和数据。


## 前端知识库


腾讯移动Web前端知识库 Mars

https://github.com/AlloyTeam/Mars

alloyteam 移动开发规范概述

http://alloyteam.github.io/Spirit/modules/Standard/index.html#overview

移动H5前端性能优化指南

http://isux.tencent.com/h5-performance.html

静态资源管理与模板框架

http://www.infoq.com/cn/articles/front-end-engineering-and-performance-optimization-part2

HTML5中40个最重要的技术点

http://www.techug.com/40-important-html-5-interview-questions-with-answers

Webkit WebApp 开发技术要点总结

http://www.cnblogs.com/pifoo/archive/2011/05/28/webkit-webapp.html



  [1]: http://oxygen.qiniudn.com/img2015051433.png