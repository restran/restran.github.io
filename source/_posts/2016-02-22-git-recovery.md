---
title: Git 代码版本还原方法
layout: post
category: [工具]
tagline: 
keywords: [git, 还原, 恢复, 教程, 版本还原, tortoise git]
tags: [Git]
---

在使用 Git 管理自己的代码和资料时，难免会遇到意料之外的事。比如误操作，将当前的分支删除；或者重置到某个版本，然后发现自己想要的代码找不到了；又或者需要还原到之前提交的某个版本，但是那个版本已经被重置过，在历史中找不到了。

忙活了大半天，发现辛苦换来的成果都没了，遇到这种情况几乎是要崩溃的，不过幸好我们还有 Git。

一般情况下，如果在版本的分支历史上，还可以找到想要的那个版本，那通常比较简单，只要选择重置到该版本就可以了。

![git_0.png](/uploads/post_img/2016/02/git_0.png "")

重置类型有三种模式可供选择，soft、mixed 和 hard 的区别如下：

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

---

如果比较悲剧，分支历史上已经找不到想要的那个版本的代码了，但是别急，只要是有提交的代码，Git 都能找回来。

### 命令行操作

查看引用记录

	git reflog

会输出类似如下的内容，所有的提交记录都能看到

```
22d3349 HEAD@{0}: checkout: moving from develop to master
22d3349 HEAD@{1}: rebase -i (finish): returning to refs/heads/develop
22d3349 HEAD@{2}: rebase -i (start): checkout 22d3349
f671986 HEAD@{3}: checkout: moving from master to develop
22d3349 HEAD@{4}: checkout: moving from develop to master
f671986 HEAD@{5}: checkout: moving from master to develop
22d3349 HEAD@{6}: checkout: moving from rctf to master
f671986 HEAD@{7}: commit: Revert
f4d0f6d HEAD@{8}: commit: Flag
22d3349 HEAD@{9}: checkout: moving from master to rctf
22d3349 HEAD@{10}: commit (initial): Initial Commit
```

还原到指定版本

	git reset --hard  f4d0f6d
	
### ORIG_HEAD

在 `.git` 目录里除了 HEAD 档案之外，还有另一个叫做ORIG_HEAD的档案，当你在做一些比较危险的操作（例如像merge，rebase 或 reset之类的），Git 就会把HEAD的状态存放在这里，让你随时可以跳回危险动作之前的状态。

虽然 `git reflog` 指令也可以查到相关资讯，但 reflog 的资料比较杂一点，这个 ORIG_HEAD 会更方便的找到最近一次危险动作之前的SHA-1值。用下面这个命令可以查看危险操作日志，`-p` 参数后面，`-1` 表示上一条，`-2` 表示上两条

	git log ORIG_HEAD -p -100

输出类似如下的内容

```
commit f671986f9aaa4fc49d8f3eba916d7947dc9f7e46
Author: xxxx <xxx@example.com>
Date: Sun May 13 12:55:31 2018 +0800
    Revert
diff --git a/flag.txt b/flag.txt
deleted file mode 100644
index 82a7a33..0000000
--- a/flag.txt
+++ /dev/null
@@ -1 +0,0 @@
-xxx{12345}
```

### 可视化界面操作

我在 Windows 下使用 TortoiseGit，只要右键找到`显示引用记录`，就能找到所有的操作记录，然后选择想要的版本，重置过去就可以了。即便是现在这一步的重置操作选错了版本也没事，因为这个操作也被记录下来，你还是可以重置到正确的版本。

![git_0.png](/uploads/post_img/2016/02/git_1.png "")

看到这张图，是不是一股暖流涌上心头，终于找回来了。

![git_0.png](/uploads/post_img/2016/02/git_2.png "")

曾经尝试过用命令来操作，但是试了很久都没成功，只好放弃，改用 TortoiseGit 来操作。TortoiseGit 在 Windows 下几乎是最好用的 Git GUI 工具了。

自从使用了 Git，只要有 `commit` 过的代码，再也不担心会丢了，尽情的 `commit` 吧。

