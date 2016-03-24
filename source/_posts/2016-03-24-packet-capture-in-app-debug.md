---
title: App 开发中的抓包工具
layout: post
toc_number: false
category: [工具]
tagline: 
tags: [抓包]
---

在开发 App 的时候，大多数都需要请求服务端的 API 完成数据的交互，于是调式 API 或者分析 App 的时候就经常需要抓包。我现在用的抓包方式有两种，一种是通过代理连接到电脑上的抓包软件，另外一种是直接在手机上进行抓包。

**第一种方式**

在 Windows 环境下，我使用 [Fiddler](http://www.telerik.com/fiddler)。首先得有一个网络环境，我使用猎豹免费 WiFi 构建一个 WiFi 网络，如果已经有 WiFi 并且能互联互通的就忽略。然后将手机连到这个 WiFi，并且设置代理为电脑上的 Fiddler 监听端口。已经有很多教程就不详细介绍了，可以参考：

- [抓包工具Fidder详解(主要来抓取Android中app的请求)](http://blog.csdn.net/jiangwei0910410003/article/details/19806999)
- [FIDDLER 教程](http://www.cnphp6.com/archives/97865)

Fiddler 是可以抓取 HTTPS 包的，利用的就是中间人攻击，安装一个根证书。

![fiddler.jpg](/uploads/post_img/2016/03/fiddler.jpg "")

**第二种方式**

在手机上直接抓包是最为便捷的，随时随地都能进行。使用方法也很简单，只需正常使用需要抓包的软件，然后再回头看看抓包软件里面的情况。

iOS 可以使用[Replica](https://itunes.apple.com/cn/app/replica-web-developer-tool/id1068196306?mt=8)，免费版一次只能抓取20个请求。 

![replica.jpg](/uploads/post_img/2016/03/replica.jpg "")

Android 可以使用[Packet Capture](https://play.google.com/store/apps/details?id=app.greyshirts.sslcapture)，而且可以抓取 HTTPS 的包，但是需要信任安装的根证书，安装完后 Android 会提示网络受到监听。

![packet_capture.jpg](/uploads/post_img/2016/03/packet_capture.jpg "")

这两个软件的原理都一样，都是在手机本地建立一个虚拟的 VPN，然后所有的流量都进入到了这个软件中。利用这些抓包工具就可以一探究竟，手机中的 App 到底在做些什么。

