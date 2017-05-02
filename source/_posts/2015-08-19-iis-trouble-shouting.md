---
title: 使用 IIS 过程中遇到的一些问题 
layout: post
category : [错误解决]
tagline: 
keywords: [iis, mime, 错误解决, 404, otf, woff, svg]
tags : [IIS, 错误解决]
---

由于我最近开发的 Web 程序多是采用 Python 为主，因此大部分都是部署在 Linux 下的，自然在 Web 服务器上就选择了 Nginx，不过一些纯静态文件的 Web 应用会放在 IIS 下面。说完前提，就来介绍下我在使用 IIS 中遇到的一些问题。

## .otf, .svg, .woff 和 .woff2 等字体文件返回 404

有使用 Bootstrap、FontAwsome，Semantic UI 的朋友对这些应该不会陌生，这些前端框架使用了这种字体图标。在 Nginx 下面这些都是正常返回的，但是在 IIS 下面提示却会返回 404，找不到。原因是 IIS 没有配置这种文件的 MIME 类型。

添加 MIME 类型

```
woff: application/x-font-woff
woff2: application/font-woff2
svg: image/svg+xml
otf: font/otf
```

![IIS MIME 类型设置](/uploads/post_img/2015/08/img2015061238.png "")

![IIS MIME 类型设置](/uploads/post_img/2015/08/img2015061240.png "")


如果翻一翻 Nginx 的配置文件 nginx.conf，可以看到有个默认的 `default_type` 为 `application/octet-stream`，那么理论上不管什么类型的文件，Nginx 都不会出现 IIS 这种问题。

```nginx
http {
    include       mime.types;
    default_type  application/octet-stream;
    ...
}
```

## 路径有 . 号

如果你的项目路径，有 . 号，比如 `/path/1.2.1/a.css`，那么也会返回 404。这是我在使用 [FrozenUI](http://frozenui.github.io/ "") 中遇到的悲剧问题。由于我在本地开发一直都是使用 Windows 版的 Nginx，也一直没有问题，但是到了线上使用 IIS，结果就悲剧了。


## 参考文献

http://ideasof.andersaberg.com/development/quick-fix-iis-woff-font-file-404-not-found-in-aspnet-mvc/
