---
title: .NET 反编译
layout: post
category : [技术]
tagline: 
tags : [.NET]
---

常用的 .NET 反编译工具有两个 [ILSpy](http://ilspy.net/) 和 [Reflector](http://www.red-gate.com/products/dotnet-development/reflector/)，ILSpy 开源而 Reflector 收费。不同的反编译工具得到的代码可能会不一样，甚至会出现无法反编译的情况，有时需要同时使用两个工具对照着看。这里介绍 Reflector 的使用方法。

## Reflector 的使用

这里以一个 `TestWinFrom` 项目为例，使用 Reflector 打开 .NET 的可执行文件后，反编译后的窗口如下，可以看到里面的具体代码。

![](/uploads/post_img/2016/09/dot_net_1.png "")

## 反编译到 VS 工程

在一些情况下，需要对反编译后的代码进行调试，这就需要将代码反编译到VS的工程项目。

第一步，导出源代码

![](/uploads/post_img/2016/09/dot_net_2.png "")

导出后的文件如下

![](/uploads/post_img/2016/09/dot_net_3.png "")

第二步，还原资源文件

使用 VS 自带的工具 resgen，可以用 Everything 搜索一下

```
# 将这里的资源文件还原为 Form1.resx
"C:\Program Files (x86)\Microsoft SDKs\Windows\v10.0A\bin\NETFX 4.6 Tools/ResGen.exe" TestWinFrom.Form1.resources Form1.resx
```

第三步，打开工程

双击 TestWinFrom.csproj 打开工程，并删掉 `TestWinFrom.Form1.resources` 和 `TestWinFrom.Properties.Resources.resources` 这两个文件

运行代码的时候遇到错误，需要移除对于.NET 4.0重复声明，注释对应的代码

![](/uploads/post_img/2016/09/dot_net_4.png "")

这时就可以正常的调试和运行了
