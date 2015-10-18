---
title: Nginx 是前端工程师的好帮手
layout: post
category : [前端]
tagline: 
tags : [Nginx]
---

[Nginx](http://nginx.org/en/ "") [engine x] 是俄罗斯的 Igor Sysoev 编写的一个 强大的 HTTP 和反向代理服务器，而且也推出了 Windows 版本。Windows 版本使用 select 模型，仅供测试，不推荐在生产环境中使用。

Nginx 强大的反向代理能力，使它成为前端工程师不折不扣的好帮手，关于 Nginx 助力前端开发上的一些使用，可以看看[这篇文章](http://www.benben.cc/blog/?p=393 "")，这里说说我的一些使用。

我的前端开发环境是这样的：

    1. 我们正式的网站在最外层是一个反向代理，可以代理访问后端部署的一个个子网站。
    2. 数据是通过接口提供的，接口与子网站是分开部署的，端口或IP是不同的。
    3. 开发的时候，网站是在本机发布和调试的。
    4. 请求数据需要通过 ajax 调用接口，接口是部署在另外一台服务器上的。

很明显，我这里遇到的就是跨越的问题 （关于跨域，请看看[这里](http://segmentfault.com/a/1190000000718840 "")）。 由于最外层反向代理的存在，子网站与接口对外是表现为一个网站，因此没有跨域问题。但是在我的开发机这里，就存在跨域问题了。为了解决它，可以引入一个反向代理，让我开发机上的网站和接口表现为一个网站，就跟我们最外层的反向代理是一样的。

在 Nginx 中可以这么配置

```nginx
server {
  listen  *:5000;
  access_log  logs/mysite_access.log;
  error_log   logs/mysite_error.log;

  # 为了调试方便，我不缓存
  expires 0;
  
  # 开启 gzip，跟真实环境一样
  gzip on;
  
  # 网站的路径 
  location / {
    root  "D:/path/to/mysite/html";
    index  index.html index.htm;
  }
  
  # 静态文件的路径 
  location /static {
    alias "D:/path/to/mysite/static"; 
  } 
  
  # 我们的 api 接口会使用特殊前缀 @ 来区分
  # 把所有 uri 以 /@api_some_data 开头的转发到接口服务器
  location /@api_some_data {
    # 看情况，是否需要重写 uri
    # rewrite /@api_some_data/(.*) /$1  break;
    # 转发到接口服务器的地址
    proxy_pass http://192.168.1.2:8000;
    proxy_set_header Cookie $http_cookie;
  }
}
```

在 js 中 就可以这么写 ajax

```js
$.ajax({
    url: '/@api_some_data/get_data/',
    type: 'POST',
    cache: false,
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    data: JSON.stringify(post_data),
    success: function (response) {
        // handle success
    },
    error: function () {
        // handle error
    }
});
```

就这样，借助 Nginx 强大的反向代理功能，我就在开发机上轻松的模拟出了真实环境，并且可以愉快的开发和调试了。


