---
title: 快速关闭 Windows 445 端口的方法
layout: post
category: [技术]
tagline: 
show_reward: false
keywords: [windows,勒索软件,445,关闭端口]
tags: [Windows, 445]
---

> 漏洞的收尾工作会被勒索软件完美解决。by 余弦

Windows 默认会开启局域网内文件和打印机共享服务，该服务使用了 445 端口。最近在全球爆发了 Windows 的勒索蠕虫病毒 [WannaCry 想哭](https://zh.wikipedia.org/zh-hans/WannaCry)，利用了基于 445 端口传播扩散的 SMB 漏洞 MS17-010，该漏洞原名叫 “永恒之蓝”（Eternal Blue），来自之前 Equation Group 泄露的漏洞利用工具。虽然微软已经出了该漏洞的补丁，但是应该有很多人没有更新。

如果使用的是 Windows 10，并有自动更新的话，就不必担心。这时候可以稍微感慨下以前关机时苦苦等待 Windows 更新补丁真没白等了。

首先自检一下，可以在命令行中输入如下命令，检查是否有开启该端口 

	netstat -an | findstr :445

如果看到这些信息表示 445 端口有开启，那么就是可能有风险的。

![](/uploads/post_img/2017/05/445_3.jpg)

目前可以做的几个紧急解决方法有：

1. 使用 Windows 防火墙配置规则来禁止其他机器访问本机的 445 端口；
2. 关闭 Windows 的共享服务，关闭 445 端口，缓解一下情绪；
3. 更新补丁 [MS17-010](https://technet.microsoft.com/en-us/library/security/ms17-010.aspx)。

这里介绍快速关闭 445 端口的方法，在 Windows 7 上验证过。把下面脚本保存为 `.bat` 文件，例如 `stop_445.bat`，然后右键以管理员方式运行。

```bat
sc config Browser start= disabled
sc stop Browser

sc config LanmanServer start= disabled
sc stop LanmanServer
```

![](/uploads/post_img/2017/05/445_1.jpg)

该脚本一共关闭了两项服务：

- LanmanServer，显示名称为 Server，Windows 共享服务
- Browser，显示名称为 Computer Browser，依赖 LanmanServer 服务，该服务会维护网络上计算机的列表，并展示在资源管理器左侧的网络项目内。

这时候重启一下电脑，然后在 cmd.exe 中输入这条命令验证一下

	netstat -an | findstr :445
	
![](/uploads/post_img/2017/05/445_2.jpg)

如果发现看不到任何东西，就证明已经成功关闭了服务，关闭了 445 端口。关闭之后，就无法在资源管理器中，通过 `\\192.168.1.1` 的形式来访问共享的文件和打印机了。

如果打好补丁后，以后要重新开启相关服务，可以用这个脚本，依然是保存为 `.bat` 文件，然后右键以管理员运行。

```bat
sc config Browser start= auto
sc start Browser

sc config LanmanServer start= auto
sc start LanmanServer
```

