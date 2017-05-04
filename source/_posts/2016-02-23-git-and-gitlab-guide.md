---
title: Git & Gitlab 使用指南
layout: post
toc_number: false
category: [工具]
tagline: 
show_reward: true
keywords: [Git, Gitlab, 教程, 教学, 指南, 入门]
tags: [Git]
---

去年小组在从 SVN 和 TFS 迁移到 Git 的过程中整理了这份文档，面向的用户是对 Git 和 SVN 可能都不是很了解的人。看到自己写了这么多，于是就拿出来分享下，有些东西可能写得比较浅，有错误还请指正。

## 1. 关于 Git 你应该知道的东西

Git 是一个分布式版本控制系统。分布式的意思是，每个人电脑上都是一份完整的代码库，包含了所有的代码提交历史。
由于 Git 分布式的特点，在没有网络的情况下，依然可以自由地将代码提交的本地的代码库中，等网络恢复后再推送到服务器，开发更加灵活和自由。

**重要概念：**本地一个代码库，对本地文件的所有操作，最后都是提交到这个代码库中。同时可以设置多个远程（remote，默认的remote通常用origin表示），当你要将代码更新到服务器上时（称作push），就通过设置的remote，更新到指定的服务器。

> 关于多个remote：例如需要同时将代码同步到多个代码管理仓库，例如 Github 和自己公司中内网的 Gitlab。那么可以将默认remote 设置为公司自己的源码管理服务器，同时设置另外一个remote为 Github。这样即可以将代码提交到自己公司的 Gitlab，同时也可以提交到 Github。

### 1.1 一些术语

- Fetch（获取），从远程代码库更新数据到本地代码库。`注意`：Fetch 只是将代码更新到本地代码库，你需要检出（check out）或与当前工作分支合并（merge）才能在你的工作目录中看到代码的改变。
- Pull（拉取），从远程代码库更新数据到本地代码库，并与当前工作分支合并，等同于 Fetch + Merge。
- Push（推送），将本地代码库中已提交（commit）的数据推送到指定的 remote，没有 commit 的数据，不会push
- HEAD，指向你正在工作中的本地分支的指针
- Master 分支：主分支，所有提供给用户使用的正式版本，都在这个主分支上发布。[关于分支管理的扩展阅读](http://www.ruanyifeng.com/blog/2012/07/git.html)
- Tags（标签）：用来记录重要的版本历史，例如里程碑版本
- Origin：默认的 remote的名称
- Git clone（克隆版本库）：从服务端将项目的版本库克隆下来
- Git init（在本地初始化版本库）：在本地创建版本库的时候使用

### 1.2 工作流程

1. 对代码进行修改
2. 完成了某项功能，提交（commit，只是提交到本地代码库），1-2可以反复进行，直到觉得可以推送到服务器上时，执行3
3. 拉取（pull，或者用获取 fetch 然后再手动合并 merge）
4. 如果存在冲突，解决冲突
5. 推送（push），将数据提交到服务器上的代码库

###	1.3 Gitlab 可以做什么

Gitlab 是 Git 服务端的集成管理平台，提供了：

1. 代码托管服务
2. 访问权限控制
3. 问题跟踪，bug的记录、跟踪和讨论
4. Wiki，项目中一些相关的说明和文档
5. 代码审查，可以查看、评论代码

目前官方没有中文版，有个人汉化版本，一些地方对中文的支持较不好（详见后续章节），如果有需要中文翻译的地方，可以自己修改对应的代码。

怎么安装和维护 Gitlab，请看我另外的两篇博客 

- [CentOS 6.5 Minimal 安装 Gitlab 7.5](http://www.restran.net/2015/04/09/gilab-centos-installation-note/)
- [CentOS 7 Minimal 安装 Gitlab 8.9](http://www.restran.net/2016/07/06/gilab-source-install-in-centos7/)

---------

## 2. 安装与配置

需要安装以下工具：

- Git（Git 主程序） http://git-scm.com/

Git 图形界面操作工具

- SourceTree https://www.sourcetreeapp.com/
- TortoiseGit https://code.google.com/p/tortoisegit/wiki/Download?tm=2

TortoiseGit只有 Windows 版本，有32位和64位版本，请根据自己的电脑选择相应的版本，同时下载对应版本的中文语言包。

###	2.1 设置 TortoiseGit 中文语言

右键 -> TortoiseGit -> 设置

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/2_1_1.png" />

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/2_1_2.png" />

###	2.2 设置用户名和邮箱

点击 `Git` 选项，然后点击右侧的`全局`，最后输入用户名和邮箱即可。这里的用户名和邮箱，将作为以后提交数据到Git服务端的作者信息，请一定要设置。

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/2_2_1.png" />

### 2.3 设置保存密码

默认情况下，Git 客户端每次与服务器交互，都需要输入密码。但是我们可以配置保存密码，只需要输入一次，就不再需要输入密码。

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/2_3_1.png" />

选择`编辑全局.git/config`，在末尾添加

```
[credential] 
    helper = store
```

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/2_3_2.png" />

###	2.4 配置 SSH Key

Git 可以通过 HTTP 和 SSH 的方式连接，如果要使用SSH的方式连接，需要确保自己的 IP 有访问 Gitlab 服务器 22 端口的权限。

通过 SSH 的方式，可以不用每次与服务器进行交互时都需要输入用户名和密码。如果是 IDE 中的 Git 插件，则有保存密码的功能。

### 2.5 生成 SSH Key

#### 2.5.1 在 Git Bash 命令行下生成

鼠标右键 -> Git Bash

    ssh-keygen -t rsa -C "uasername@mail.com"

生成后的公钥会存放在

    C:/Users/You_User_Name/.ssh/id_rsa.pub
    
#### 2.5.2 在可视化工具下生成

> 注意：使用这种方法生成时，默认会用计算机名，作为生成的 SSH Key 的名称，如果计算机名包含中文，则会因编码问题而出错。这时候可以使用在 Git Bash 命令行下生成的方法。

鼠标右键 -> Git Gui

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/2_4_1.png" />

帮助 -> Show SSH Key

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/2_4_2.png" />

点击 Generate Key，弹出一个对话框，提示输入 passphrase（密码短语），需要输入两次。意思就是以后提交数据到服务端，只要输入这个密码短语就可以了。这里可以为空，直接点OK，这样，以后就不需要输入任何密码。但建议还是要输入密码短语。

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/2_4_3.png" />

复制 SSH Key 的公钥

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/2_4_4.png" />

### 2.6 在 Gitlab 上配置 SSH Key

配置好 SSH Key 以后提交代码，可以不用输入密码。点击右上角的资料设置 -> SSH 密钥 -> 增加 SSH 密钥

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/2_4_5.png" />

粘贴刚刚复制的 SSH Key 公钥，标题为可选，不写会自动生成

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/2_4_6.png" />

### 2.7 配置 Gitlab

#### 2.7.1 上传个人头像

请上传个人头像，主要是为了易于识别用户。

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/2_5_1.png" />

#### 2.7.2 设置邮件通知

如果不想收到邮件通知，可以设置关闭。但是建议开启邮件通知。

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/2_5_2.png" />

---------

## 3. Git 基本功能简介

### 3.1 我是项目的创建者，我要创建项目

#### 3.1.1 在 Gitlab 上执行创建新项目

1. 取一个恰当的名字。
2. 选择正确的命名空间。所有人都可以在自身用户名下建立新项目，但是群组命名空间下的项目只能由具有相应权限的人建立。
3. 填写详细的项目描述
4. 选择可见等级

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/3_1_1.png" />

项目创建完成后，需要初始化，请保留该页面，在必要时复制项目的 SSH 地址

> Git 同时支持 SSH 和 HTTP 的方式访问，SSH 可以不用输入密码。

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/3_1_2.png" />

#### 3.1.2 初始化项目

以下这些操作，需要在项目的目录下进行。请注意如果你的项目文件夹路径包含中文，请使用 TortoiseGit 工具来操作，不要使用 Git Gui，否则会出现错误。

#### 3.1.3 创建一份排除版本控制的文件类型清单

在项目中，实际上有很多文件是不需要版本控制的，例如编译过程中生成的中间文件 `.obj`，IDE 的配置文件（Intellj IDEA 的 `.idea` 文件夹），编译生成的文件（/out/ 和 /bin/ 文件夹），Python的.pyc文件，像这些类型的文件我们可以设置过滤，避免导致版本库很大。

我们只要在项目的目录下，放一个 `.gitignore` 文件就可以了。

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/3_1_3.png" />

这份 `.gitignore` 文件，排除了.idea/，out/，bin/ 文件夹，以及所有类型为 .pyc 的文件

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/3_1_4.png" />

Github 上面有一个 [.gitignore 模板的项目](https://github.com/github/gitignore)

如果后续开发中有新类型的文件要排除，可以在文件上

    右键 -> TortoisGit -> 删除并添加到忽略列表

#### 3.1.4 创建一份 README.md 文件

README.md 文件用来填写项目的描述和说明，会直接显示在 Gitlab 的项目文件页面，方便直接查看项目的描述信息。
.md 是 Markdown 格式的文件，关于 Markdown，可以查看[作业部落](https://www.zybuluo.com/mdeditor)

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/3_1_5.png" />

#### 3.1.5 在自己的电脑上创建版本库

在项目目录下

    右键 -> Git init here
    
这样就可以在当前文件夹创建一个 Git 版本控制的库，同时创建一个分支 master。

> 该操作会在这个文件夹下自动创建一个 `.git` 的隐藏文件夹，所有关于版本控制的信息都放在这个文件夹下面的文件中。

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/3_1_6.png" />

#### 3.1.6 提交代码到本地版本库

    右键 -> Git 提交

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/3_1_7.png" />

选择要提交的文件，并填写描述信息

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/3_1_8.png" />

#### 3.1.7 设置 remote

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/3_1_9.png" />

将项目的 SSH 地址复制过来，并将默认的 remote 名称设置为 origin

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/3_1_10.png" />

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/3_1_11.png" />

如果提示是否关闭获取标签，也选择 No

#### 3.1.8 推送到服务器上的版本库（push to remote）

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/3_1_12.png" />

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/3_1_13.png" />

如果提示该服务器主机是未知的，请选择是，添加到已知主机列表

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/3_1_14.png" />

> 到这一步项目的代码库已创建完成，可以去 Gitlab 上查看项目

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/3_1_15.png" />

#### 3.1.9 创建开发分支

默认情况下，master 分支在 Gitlab 中是保护分支。保护分支只允许 Master 级别以上的用户才能 push 和 delete。而普通的开发人员（Developer 级别）是无法提交代码到 master分支的。

> 这么设计的原因是：我们通常将 master 分支作为稳定版本发布的分支，在这个分支上的代码都是最新可用版本。而日常的开发，通常在开发分支 develop 上进行。等到功能稳定后，再由项目的管理员合并到 master 分支上。

请在 Gitlab 中操作

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/3_1_16.png" />

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/3_1_17.png" />

### 3.2	 我是开发人员，我要获取和提交代码

#### 3.2.1 克隆项目

在一个空白的项目文件夹下，右键 -> Git克隆。

> 如果你已配好了SSH Key，请输入项目的SSH地址，这样就可以不用再输入密码。Git 支持 SSH 和 HTTP 的方式访问，这里也可以使用 HTTP 地址。

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/3_2_1.png" />

如果提示该服务器主机是未知的，请选择`是`，添加到已知主机列表

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/3_2_2.png" />

#### 3.2.2 检出开发分支

Git 克隆默认会检出 master 分支，但是我们需要在开发分支中工作。

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/3_2_3.png" />

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/3_2_4.png" />

检查当前所在的分支

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/3_2_5.png" />

> 注意：切换分支的时候，如果有未提交的内容，需要先提交，否则无法切换分支。如果不想提交可以用贮藏（stash）

到这一步完成，你就可以在本地自由地做开发了

#### 3.2.3 从服务器的代码库更新数据

请注意，选择拉取功能，就不需要再执行合并。如果是获取，就需要再执行一次合并。两者的区别在于，拉取省略了合并的细节。

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/3_2_6.png" />

#### 3.2.4 冲突与解决

出现无法推送

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/3_2_7.png" />

试试拉取，但拉取的时候出现冲突，Merge conflict in test.html

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/3_2_8.png" />

这时候需要先解决冲突

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/3_2_9.png" />

> 解决方法有两种，一种是打开冲突的文件，手动删除冲突标记

上面那部分的内容是本地代码库，HEAD 所指向分支的代码，下面那部分的内容是服务器端代码库的内容

```
<<<<<<< HEAD
<pre>This is for test.</pre>
=======
<p><a>This is for test.</a></p>
>>>>>>> 5f065407ecf91415f109c882119291f0be37b07a
```

只需要决定最后的内容，然后删除冲突标记，例如，只剩下

```html
<pre>This is for test.</pre>
```

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/3_2_10.png" />

删除完冲突标记后，需要右键空白的地方，点击 Git Add all files now

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/3_2_11.png" />

> 另一种方法是使用 TorgoiseGit 的工具

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/3_2_12.png" />

双击冲突的文件

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/3_2_13.png" />

点击保存

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/3_2_14.png" />

> 不管使用哪种方法，最后都要执行的两步操作是`提交`和`推送`

提交

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/3_2_15.png" />

推送

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/3_2_16.png" />

> 当成功推送到服务器的代码库后，冲突才算真正解决

#### 3.2.5 提交和推送代码到服务器的版本库

请查看 3.2.3 和 3.2.5，注意选择正确的分支。

请注意：只有项目的 master 权限或者 owner 权限的人才能将代码推送到保护分支中，master 分支默认是保护分支。
假如自己没有推送到保护分支的权限时，你可以将代码提交到，如 develop 分支中（或者自己建立的分支中），等 develop 分支的代码稳定后，然后在 Gitlab 的项目地址中，发起一个 merge request 请求，系统会发送邮件通知对应的人执行合并操作。这样就可以将代码合并到保护分支中（如 master 分支）

发起合并请求

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/3_2_17.png" />

选择需要合并的分支，点击“比较分支”（需要先比较分支，可以查看到这两个分支的差异）

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/3_2_18.png" />

描述分支合并请求，然后指派给项目的管理员，项目管理员会收到合并请求的邮件

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/3_2_19.png" />

### 3.3	 分支与标签

#### 3.3.1 创建分支与标签

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/3_3_1.png" />

分支可以基于任意提交（commit）、已有分支、已有标签中创建。

> 当你要做实验，或者开发新功能，修正bug时，都可以通过创建分支来安全的处理。这样就不会影响正常的开发，当完成的时候，再合并回去。

创建完分支后，记得切换到正确的分支中去工作。

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/3_3_2.png" />

标签是只读的，通常只用来记录特定的历史时刻，如里程碑版本等，这是为了方便以后检出特定版本的代码。

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/3_3_3.png" />

#### 3.3.2 推送分支或标签到服务器的版本库

使用推送命令，可以将本地版本库中的分支推送到服务器的版本库中。如果要推送标签，请勾选`包含标签`。

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/3_3_4.png" />

#### 3.3.3 分支合并

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/3_3_5.png" />

选择要合并到当前工作分支中的分支，例如当前所在的分支是 master，选择 develop，则会将 develop 中的代码合并到 master 中。

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/3_3_6.png" />

> 合并分支有可能会出现冲突，解决冲突的方法请参见 3.3.4

------

## 4 Gitlab 基本功能

### 4.1 为项目写 WiKi

WiKi 可以放项目的相关说明文档，包括部署手册，使用手册等等。

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/4_1_1.png" />

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/4_1_2.png" />

Gitlab 的 Wiki 使用了 Markdown 格式（是一种轻量级标记语言，可以使用易读易写的纯文本格式编写出排版漂亮的文档）
简易入门请看[作业部落](https://www.zybuluo.com/mdeditor)

### 4.2 查看项目的标签信息

在仪表盘中，点击项目

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/4_2_1.png" />

## 5 高级功能

### 5.1 从SVN迁移到Git

Git 最为重要的特性之一是名为 `git svn` 的 Subversion 双向桥接工具。该工具把 Git 变成了 Subversion服务的客户端，从而可以将 SVN 的代码库迁移到 Git，同时保留提交日志。

使用 TortoiseGit 的 Git 克隆，选择从 SVN 版本库

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/5_1_1.png" />

将代码克隆下来后，再设置下 Git 代码库的 remote，然后推送过去就可以了。

### 5.2 从 TFS 迁移到 Git

需要使用工具 git-tfs，下载地址在这里

https://github.com/git-tfs/git-tfs/releases

请注意 v0.20.0 版本不支持 TFS 服务器是 2008 版本，如果是 TFS 2008，请选择 v0.19.2。

需要将 git-tfs 文件目录添加到环境变量。

还需要再安装 TFS Team Explorer。如果服务器是TFS 2008版本，必须确保自己的电脑上只能安装 TFS Team Explorer 2008，如果安装了 TFS Team Explorer 2013，则仍然会提示不支持 TFS 2008，无法正确使用 git-tfs。可以切换到虚拟机中，只安装 TFS 2008 中。

在 Git Bash 中输入如下命令

    git-tfs clone http://192.168.8.25:8080 $/test_project
    
test_project 为项目在 TFS 上的名称，http://192.168.8.25:8080 为 TFS 的服务器地址。

### 5.3 比较版本差异

右键，Tortoise Git -> 显示日志

按 Ctrl 鼠标左键选择两个版本，右键选择比较差异

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/5_3_1.png" />

右键选择要比较差异的文件，选择比较差异

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/5_3_2.png" />

TortoiseGit 可以比较 Word 文件的差异

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/5_3_3.png" />

文本文件的差异比较是这样的

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/5_3_4.png" />

### 5.4 删除分支

当我们将分支合并到主分支，或者放弃该分支的时候，可以对分支进行删除操作。

在 TortoiseGit 上进行分支删除操作非常简单，首先打开 "CheckOut/Switch" 对话框，通过 "Switch to Branch" 更多按钮打开分支列表,或者通过菜单 "Browser References" 打开分支列表（默认该菜单是隐藏的）。选择相应的分支，单击右键，选择删除。

注意：

1. 删除分支，既可以删除本地分支，也可以删除远程分支。
2. 如果删除远程分支，推送后，服务器上对应的分支会被删除。当其他开发者更新数据后，其对应的本地分支并不会删除。
3. 在删除远程分支的时候，本地分支并不会删除，这也说明了本地分支与远程分支并无从属关系。

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/5_4_1.png" />

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/5_4_2.png" />

### 5.5 重置代码到以前的版本

当我们发现当前的代码有问题，想回退到之前的版本时，可以使用重置版本。在项目目录下，

    右键 -> TorgoiseGit -> 显示日志
    
进入日志信息窗口，选择指定的版本

    右键 -> 重置到这个版本
    
<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/5_5_1.png" />
    
<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/5_5_2.png" />

#### 5.5.1 重置类型，soft, mixed, hard 的区别


**soft 不改动工作区和索引**

假设有一些 commits

    A - B - C (master)

HEAD 指向 C， 并且暂存区（stage，或称为 index）matches C.

当使用 `git reset --soft B` 时，master 和 HEAD 指向 B，但是依然保留了 C 添加跟踪的文件，此时会将这些文件放入暂存区中，显示为已缓存。同时工作区中修改的文件，显示为未缓存。

**mixed 保持工作区不变，重置索引**

当使用 `git reset --mixed B` 时，master 和 HEAD 指向 B，这时候 C 添加跟踪的文件仍然会在，但是会显示为未缓存（不是版本控制），而当前工作目录中的修改内容，仍然会在，显示未缓存的状态

（如果不知道怎么选，默认使用 mixed）

**hard 重置索引和工作区（丢弃所有本地变更）**

当使用 `git reset --hard B` 时，C 添加跟踪的文件，以及当前工作目录中的修改内容，都会丢失。

-----

## 6 Eclipse 中使用 EGit

### 6.1 检出项目

File/Import

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/5_6_1.png" />

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/5_6_2.png" />    

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/5_6_3.png" />

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/5_6_4.png" />    

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/5_6_5.png" />

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/5_6_6.png" />    

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/5_6_7.png" />

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/5_6_8.png" />    

### 6.2 更新和推送数据

#### 6.2.1 获取数据（fetch）

    项目右键 -> Team -> Remote -> Fetch From

Gerrit 是基于 Git 的代码审核软件

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/5_6_9.png" />

选择远程代码库

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/5_6_10.png" />

自定义选择要获取的远程分支，该图是远程仓库中的所有

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/5_6_11.png" />

fetch 只是把服务端的代码更新，放到本地的代码库中，还需要与本地分支合并，才能真正将代码更新到工作目录中。

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/5_6_12.png" />

分支的合并也是在这里操作，注意上图中，当前是 master，然后要把 origin/master 合并到 master 中

```
squash：不创建新的 commit
pull = fetch + merge
```

#### 6.2.2 推送（push）

如果要删除分支，也可以在这里操作，Add delete ref specification

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/5_6_13.png" />

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/5_6_14.png" />

#### 6.2.3 Fetch from Upstream, Push to Upstream

Git 可以同时设置多个远程分支，这里的 Upstream 可以简单的理解成是默认的远程分支，因为代码的版本历史，就像溪流不断向前，因此把代码源称为 Upstream（因为本地的代码 clone 自这里）。

### 6.3 解决冲突

    选择 Team -> Merge Tool

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/5_6_15.png" />

- 第一项是将GIT自动合并过的文件和服务器端文件进行对比
- 第二项是用本地最新版本的文件和服务器端文件进行对比，建议用此项

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/5_6_16.png" />

修改左边的本地数据，修改好后 `Ctrl+S` 保存文件就可以了。这时候再次查看文件，冲突标记已经自动去掉。

```
<<<<<<<  HEAD

=======

>>>>>>> remote
```

然后右键点击此冲突文件

    选择 Team -> Add to index 

再次将文件加入索引控制，此时文件已经不是冲突状态，并且可以进行提交并 push 到服务器端。一定要重新 commit，并 push 到服务端，才算真正解决冲突。

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/5_6_17.png" />

### 6.4 分支和标签

创建分支

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/5_6_18.png" />

创建标签

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/5_6_19.png" />

### 6.5 reset 到某个版本

<img data-original="/uploads/post_img/2016/02/git_and_gitlab_guide/5_6_20.png" />