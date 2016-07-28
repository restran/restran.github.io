---
title: MacBook Pro 一月使用体验
layout: post
category: [工具]
tagline: 
tags: [MBP, 苹果]
---

从 2013 年开始，就特别想买 MBP，终于在 2015 年的尾巴用上了 MBPR。原本是要在使用一周后写一份使用体验的，但因为懒，现在拖到一个月了，刚好现在也是 2016 年的一月，就把标题改成一月使用体验。

Mac 以前是叫 Macintosh，最早是在 1985 年由苹果推出，那部经典的 1985 的宣传片就是为了推介这款产品。MBP 是苹果的笔记本电脑系列，第一代在 2006 年推出，MBPR 指的是带有 Retina 显示屏的 MBP。

## 赞赏篇

使用上 MBP 还是让我很惊艳的，先来说说让我觉得爽的地方。

### Retina 显示屏

高清的 Retina 显示屏带来的显示体验绝对让人眼前一亮，因为高分辨率，显示效果非常细腻，给人一种很亮很清晰的感觉。比起我的联想笔记本真的好太多。

以前的笔记本显示屏有很明显的偏色问题，在使用 PS 的时候，对颜色就很难把握得准，在手机上看到的颜色和在笔记本上看到的，会有明显的差别。我有专门买了一台 Dell 的 IPS 显示器，显示效果相对笔记本就好很多，但对于 MBP 来说还是差了一个档次。对设计师来说，光是 Retina 显示屏就值得入手 MBPR。

### 续航长

苹果的续航时间通常都是比较强悍的，不接电源用上6~7个小时无压力，对比一下我旧的笔记本，不到2个小时就会自动关机。由于 MBP 是金属外壳，接通电源的时候，可以明显感觉到电流，所以我通常都是充好电后，就拔掉电源，然后可以用上半天。

### 不需要关机

MBP 睡眠的时候耗电很低，我现在都是直接合上电脑，几乎不会去关机，这点很好，打开电脑就可以随时恢复工作现场。因为是固态硬盘，速度很快。

### 轻巧美观

不得不说，MBP 真的很薄很轻，带出门完全无压力。最重要的是充电线很轻很小，一直搞不懂，为什么 PC 系列的笔记本这么多年了，都不把笨重的充电线优化一下，非常的笨重，又很占空间。

外观漂亮就不说了，键盘手感还很好，自带键盘背光，打字体验是非常棒。而且触摸屏还支持多点触摸，两个手指同时触摸的时候，上下滑可以滚动页面，左右滑可以上一页和下一页，按下相当于鼠标右键。

### Unix-Like

有很多服务端的程序，需要借助 Linux 或 Unix 的某些特性才能发挥强大的性能，而有些则不支持 Windows，比如基于 Tornado 的异步非阻塞的 MongoDB Driver [Motor](https://motor.readthedocs.org/en/stable/index.html)。

由于 Unix-Like 的特性，如果你的程序是要跑在 Linux 服务器上，那作为开发机来使用就非常有优势。有人会说干嘛不直接用 Linux，我觉得装在虚拟机里面也是不错的。

还有美观且强大的终端，可以定制各种配色，Github 上有个 [mac-os-x-terminal-themes](https://github.com/lysyi3m/osx-terminal-themes) 的项目收集了很多终端的配色。
 
### Mac 才有的软件

有些好用的软件只有 Mac 版，比如：

- [Sketch](https://www.sketchapp.com/) 原型设计
- [MWeb](http://zh.mweb.im/) Markdown 写作工具
- [Dash](https://kapeli.com/dash) API 文档浏览器
- Keynote 苹果自家的 PPT 工具
- XCode 开发 iOS 应用必备的工具

## 一些经验

### 推荐的常用软件

- [Homebrew](http://brew.sh/) 包管理
- [SourceTree](https://www.sourcetreeapp.com/) Git GUI 工具
- [Alfred](https://www.alfredapp.com/) 类似 Everytingh 的搜索神器 
- [Mounty](http://enjoygineering.com/mounty/) 将文件写入到 NTFS 格式硬盘中的工具

### 快捷键

[Mac 键盘快捷键](https://support.apple.com/zh-cn/HT201236
) ，我自己常用的快捷键有这些：

- Command(⌘)-F3 回到桌面
- Command(⌘)-C 复制
- Command(⌘)-V 粘贴
- Command(⌘)-Option-V 移动文件（Move to here，也就是剪切粘贴）
- Command(⌘)-A 全选
- Command(⌘)-Shift-F Chrome 中进入和退出全屏
- Command(⌘)-空格键 显示或隐藏 Spotlight
- Command(⌘)-上箭头 前往上层文件夹
- Command(⌘)-Option-H 除了当前窗口外，其他窗口全部最小化
- Ctrl-C 在终端中结束程序

屏幕截图，文件保存在桌面

- Command(⌘)-Shift-3 对整个屏幕拍摄屏幕快照
- Command(⌘)-Shift-4 对屏幕的某个部分拍摄屏幕快照，可以选择截图区域
- Command(⌘)-Shift-4-空格键 对某个窗口拍摄屏幕快照

屏幕截图，文件保存在剪贴板

- Command(⌘)-Ctrl-Shift-4 对选定区域进行截屏

### 显示隐藏文件和文件夹

默认情况下 Finder 会隐藏文件和文件夹，可以参考[这里](http://sspai.com/26273)的方法来显示。

在终端中输入

	defaults write com.apple.finder AppleShowAllFiles -boolean true ; killall Finder
	
现在就可以在 Finder 窗口中看到那些隐藏的文件和文件夹了。如果要恢复隐藏，在终端中输入

	defaults write com.apple.finder AppleShowAllFiles -boolean false ; killall Finder

### 右键打开终端

> http://apple.stackexchange.com/a/42450/40485 

系统偏好设置 -> 键盘 -> 快捷键 -> 服务，勾选「新建位于文件夹位置的终端窗口」（后面的键盘快捷键可以不选），然后在 Finder 里面选中文件夹右键菜单的「服务」下面就会有「新建位于文件夹位置的终端窗口」这一子菜单了。

但是不能像 Ubuntu 一样，直接在空白处右键打开终端，必须要选择文件夹，然后打开终端。

### 锁屏后恢复需要输密码

按住 Ctrl-Shift-Power 可以进入锁屏模式，但是默认情况下，屏幕只是变黑，需要过一段时间才会要求输入密码。在偏好设置-安全与隐私-通用-进入睡眠或开始屏幕后立即要求输入密码。

### 修改计算机名

如果你想改计算机名的话，直接去"系统设置"->"共享"里改计算机名(Computer Name)就好了

### 默认拼音输入法中英切换

当为默认的拼音输入法的时候，按下 CapsLock，可以变成英文输入，并且CapsLock键会变成英文


### El Capitan 系统文件完整性保护

> 使用 pip install 的时候，有时会出现问题，OSX El Capitan: sudo pip install OSError: [Errno: 1] Operation not permitted

> http://stackoverflow.com/questions/33004708/osx-el-capitan-sudo-pip-install-oserror-errno-1-operation-not-permitted

这是由于 El Capitan 有系统文件完整性保护，在安装 ipython 时，会在系统文件处创建文件，将会被拒绝，应该使用 virtualenv 来安装

> https://packaging.python.org/en/latest/installing/

	cd ~  # Go to home directory
	virtualenv my-venv
	source my-venv/bin/activate
	pip install IPython

### 使用 Mac 和 Windows 协作使用 Git 时出现的问题

一些文件在 Windows 或 Mac 中提示已经修改，但是比较文件却查看不到修改内容，其实是由于 Linux/Unix 和 Windows 的行结束符不一样导致的。Unix，Linux 和 OS X 使用一个字符 LF 来表示行结束符，但是 Windows 使用两个字符 CRLF。

解决方法 

> https://help.github.com/articles/dealing-with-line-endings/#platform-mac

```
# 在 OS X or Linux 上输入如下命令
git config --global core.autocrlf input
# Configure Git on OS X or Linux to properly handle line endings

# 在 Windows 中输入如下命令
git config --global core.autocrlf true
# Configure Git on Windows to properly handle line endings
```

处理完之后，在不同的操作系统中需要使用 Git Clone 出来的文件，不能直接将 Windows 中的文件拷贝到 Mac 中，不然文件的行结束符还是不一样的。

## 配置终端使用代理

	vi ~/.curlrc

输入

	socks5 = 127.0.0.1:1080
	proxy = 127.0.0.1:1080

## 吐槽篇

我之前一直都是使用 Windows，虽然也有一些 Linux 使用的经验，但是面对基于 Unix 系统的 Mac OS 还是有很多不习惯的地方。

### 文件和文件夹管理

最不适应的就是 Finder，Windows 下叫资源管理器。

- 找文件不容易了，没有了 Windows 中查找文件的利器 Everything ，因为是基于 NTFS，所以 Mac 没有。有时候我不得不在终端中，用 open 命令来打开一个文件夹。
- 右键菜单中的`复制`是直接复制一份文件，而这里的`拷贝`才是对应 Windows 下面复制。
- 只能从 NTFS 的硬盘中读文件，不能写文件，FAT32 是读写都可以，需要转换硬盘的格式，做到 Windows 和 Mac 兼容，或者通过第三方软件来读写，例如 [Mounty ](http://enjoygineering.com/mounty/) 。
- 文件夹的路径没有像 Windows 一样全部显示出来，返回上一个文件夹也不容易，虽然有快捷键 Command(⌘)-上箭头，来前往上层文件夹。一种解决方法是可以调整文件夹显示方式为分栏展示。

### 外接显示器

我买了一个雷电转 VGA 的转接器，然后接到我的 23 寸 DEll 显示器上，才发现[文字会发虚](https://www.v2ex.com/t/109983)。查了才发现原来 [Mac 的字体渲染](http://blog.jobbole.com/50061/) 跟 Windows 不一样，这下我的大屏显示器完全没法用了。苹果自己有出[显示器](http://www.apple.com/cn/displays/)，但是很贵。VGA 是模拟的，显示效果比较差，我后来又买了一个雷电转 DP 的转接器，显示效果就好很多了，终于又可以欢快的使用 DELL 显示器了。

## 总结

Mac 给我的感觉总体来说还是惊艳的，轻巧且性能强悍，作为开发机非常合适。我现在正逐步迁移到 Mac 上，以后将作为主力开发机 ^_^

如果让我推荐选购的话，我会说一定要选 250GB 硬盘以上的，内存是否要选 16GB 就看需求了，内存多可以开很多程序，特别是虚拟机。13 寸我感觉刚好，因为 15 寸的键盘与设备边缘的距离过大，我感觉不是很美观。

