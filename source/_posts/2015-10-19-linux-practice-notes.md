---
title: Linux 踩坑记
layout: post
category : [Linux]
tagline: 
tags : [Linux, 错误解决]
---


这篇文章是用来记录我使用 Linux 操作系统时常用的一些命令、一些笔记、以及遇到的一些问题的解决方法。Linux 在这里指代 CentOS 和 Ubuntu，因为我目前只使用这两个发行版。 

不保证以下操作方法是最佳实践，也不保证内容完整，我将会不定期更新。

## 文件操作相关 

### 查找指定的文件名

```
# 全盘查找
find / -name your_file_name
    
# 当前目录下查找
find . -name your_file_name

# 按模式匹配查找
find / -name "*.log"
```

### 移动文件

    mv file_path new_file_path
    # 例如
    mv file_a /home/file_a
    
### 复制文件

    cp file_a file_b


### 输出文件内容

    cat /path/to/file/name


    
### zip unzip


把 mydata.zi p解压到 mydatabak 目录里面

    unzip mydata.zip -d mydatabak
    

### 修改文件的拥有者和权限

修改文件的拥有者
    
    chown [用户名] [文件名] 

修改文件夹的拥有者

    chown -R [用户名] [文件夹] 
    chown -R user /tmp/folder

## 查看硬盘及内存空间

```sh
# 查看内存及swap大小
free -m
    
# 查看当前文件夹下所有文件大小（包括子文件夹）
du -sh

# 查看指定文件夹下所有文件大小（包括子文件夹）
du -h ftp

# 查看指定文件夹大小
du -hs ftp

# 查看磁盘剩余空间
df -hl

# 查看每个根路径的分区大小
df -h

# 返回该目录的大小
du -sh [目录名]

# 返回该文件夹总M数
du -sm [文件夹] 
```

## 端口相关

查看端口占用情况

    netstat -ntlp

## 进程相关

查询指定端口的进程id，如8108

    sudo netstat -ap | grep 8108

杀死指定进程

    sudo kill xxx


进程 pid 对应的程序文件路径

http://os.51cto.com/art/201003/186841.htm

进入/proc目录

    cd /proc

ps查看所有符合./cmd的进程，找出其对应的进程号

用 ll 命令： ll 进程号

如下显示一个示例：

```
[root@Cluster1 proc]# ll 22401  
total 0  
-r--r--r-- 1 zhouys zhouys 0 Dec 11 11:10 cmdline  
-r--r--r-- 1 zhouys zhouys 0 Dec 11 11:10 cpu  
lrwxrwxrwx 1 zhouys zhouys 0 Dec 11 11:10 cwd -> /home/zhouys/sbs/bin  
-r-------- 1 zhouys zhouys 0 Dec 11 11:10 environ  
lrwxrwxrwx 1 zhouys zhouys 0 Dec 11 11:10 exe -> /home/zhouys/sbs/bin/cbs (deleted)  
dr-x------ 2 zhouys zhouys 0 Dec 11 11:10 fd  
-r-------- 1 zhouys zhouys 0 Dec 11 11:10 maps  
-rw------- 1 zhouys zhouys 0 Dec 11 11:10 mem  
-r--r--r-- 1 zhouys zhouys 0 Dec 11 11:10 mounts  
lrwxrwxrwx 1 zhouys zhouys 0 Dec 11 11:10 root -> /  
-r--r--r-- 1 zhouys zhouys 0 Dec 11 11:10 stat  
-r--r--r-- 1 zhouys zhouys 0 Dec 11 11:10 statm  
-r--r--r-- 1 zhouys zhouys 0 Dec 11 11:10 status 
```

/proc文件系统下的 进程号目录 下面的文件镜像了进程的当前运行信息，

从中可以看到：

```
cwd符号链接的就是进程22401的运行目录；
exe符号连接就是执行程序的绝对路径；
cmdline就是程序运行时输入的命令行命令；本例为：./cbs
cpu记录了进程可能运行在其上的cpu；显示虚拟的cpu信息
environ记录了进程运行时的环境变量
fd目录下是进程打开或使用的文件的符号连接
```

通过cwd直接进入进程运行目录，通过查看相关信息就可以定位此目录对应那个端口号，以及定位是那个应用才使用此服务程序。这样就获得了Linux进程文件路径了。


### supervisord 使用问题

运行 supervisord 命令出现 unix:///tmp/supervisor.sock no such file

可以选择 结束 supervisord 进程，然后重启；重启后会自动重启 supervisord 管理的进程

    # 查看所有运行的进程
    ps -A

找到 supervisord 进程，并杀死

    kill pid

重启 

    supervisord
    
### 开机自动启动 Supervisord
    
    vim /etc/rc.local
    
    # 添加以下内容
    /usr/bin/supervisord -c /etc/supervisord.conf
    
    # 将文件设置为可执行，/etc/rc.local 实际上链接到 /etc/rc.d/rc.local
    chmod +x /etc/rc.d/rc.local

```
以下命令均在/home目录下操作
cd /home #进入/home目录
1、把/home目录下面的mydata目录压缩为mydata.zip
zip -r mydata.zip mydata #压缩mydata目录
2、把/home目录下面的mydata.zip解压到mydatabak目录里面
unzip mydata.zip -d mydatabak
3、把/home目录下面的abc文件夹和123.txt压缩成为abc123.zip
zip -r abc123.zip abc 123.txt
4、把/home目录下面的wwwroot.zip直接解压到/home目录里面
unzip wwwroot.zip
5、把/home目录下面的abc12.zip、abc23.zip、abc34.zip同时解压到/home目录里面
unzip abc\*.zip
6、查看把/home目录下面的wwwroot.zip里面的内容
unzip -v wwwroot.zip
7、验证/home目录下面的wwwroot.zip是否完整
unzip -t wwwroot.zip
8、把/home目录下面wwwroot.zip里面的所有文件解压到第一级目录
unzip -j wwwroot.zip
系统运维 温馨提醒：qihang01原创内容版权所有,转载请注明出处及原文链接
```


## 用户创建和删除

创建用户（useradd/adduser）：

（1）用useradd命令创建用户创建用户：

语法： useradd [所要创建的用户名] -p [密码]

删除用户（userdel命令）

语法：userdel  [-r]  [要删除的用户的名称]

修改用户密码：passwd [用户名]



## 在服务器上用 SSH 登录另外一台服务
    
    # -p 后面跟的是端口
    ssh 192.168.1.102 -l root -p 22

## 关机与重启命令

```
重启命令：
1、reboot
2、shutdown -r now 立刻重启(root用户使用)
3、shutdown -r 10 过10分钟自动重启(root用户使用) 
4、shutdown -r 20:35 在时间为20:35时候重启(root用户使用)
如果是通过shutdown命令设置重启的话，可以用shutdown -c命令取消重启
```

```
关机命令：
1、halt   立刻关机
2、poweroff  立刻关机
3、shutdown -h now 立刻关机(root用户使用)
4、shutdown -h 10 10分钟后自动关机
如果是通过shutdown命令设置关机的话，可以用shutdown -c命令取消重启
```

## 最小化安装完 CentOS 7 之后出现的问题

### 使用 `yum install xx` 出现错误 cannot find a valid base url for repo

    cd /etc/sysconfig/network-scripts 
    dmesg | grep eth0

在输出结果的最后一行，发现 `eth0` 重命名为 `eno16777736`，修改这个eth文件

    vi /etc/sysconfig/network-scripts/ifcfg-eno16777736

最后一行，设置 `onboot=yes`，然后重启网络服务
 
    sudo service network restart

### 没有ifconfig命令的解决办法

如果没有安装桌面环境，那么 minimal 版本没有 ifconfig 命令，找出哪个包提供了ifconfig命令

    yum provides ifconfig

输出中可以看到 net-tools 包提供了 ifconfig 命令

    yum install net-tools
    

### 安装第三方源（EPEL和RPMForge）

CentOS官方文档声称严重推荐EPEL，不推荐RPMForge，因为RPMForge已经不再被维护了。

EPEL官方网站
http://fedoraproject.org/wiki/EPEL

**方法1：**

EL7下载地址
http://download.fedoraproject.org/pub/epel/7/x86_64/repoview/epel-release.html

    rpm -ivh epel-release-7-5.noarch.rpm
   
EPEL的repo文件已经在目录/etc/yum.repos.d/下

**方法2：**

    sudo yum install epel-release


## 防火墙设置及 SELinux 问题
    
### 设置防火墙开放端口（iptables）

    /sbin/iptables -I INPUT -p tcp --dport 8008 -j ACCEPT 

linux 配置好iptables后，重启失效的解决方案

With RHEL 7 / CentOS 7, firewalld was introduced to manage iptables. IMHO, firewalld is more suited for workstations than for server environments.

It is possible to go back to a more classic iptables setup. First, stop and mask the firewalld service:

    systemctl stop firewalld
    systemctl mask firewalld
    
Then, install the iptables-services package:

    yum install iptables-services
    
Enable the service at boot-time:

    systemctl enable iptables

或者
    
    chkconfig iptables on 
    
Managing the service

    systemctl [stop|start|restart] iptables
    
Saving your firewall rules can be done as follows:

    service iptables save
or

    /usr/libexec/iptables/iptables.init save
    


### Nginx permission denied 问题

因为忘记了 selinux 的问题，导致 trouble shooting 耽误了不少时间。
由于[SELinux的问题][2]，会导致nginx nginx permission denied 的问题，需要将 selinux 关闭。

查看SELinux状态：

    # 如果SELinux status参数为enabled即为开启状态
    /usr/sbin/sestatus -v 

也可以用 getenforce 这个命令检查

关闭SELinux

    # 只是临时关闭（不用重启机器），重启后问题仍然出现
    # 设置SELinux 成为permissive模式
    setenforce 0 
    # setenforce 1 # 设置SELinux 成为enforcing模式

永久关闭，需要通过修改配置文件，但是需要重启机器： 

    vim /etc/selinux/config

将SELINUX=enforcing 改为 SELINUX=disabled，重启机器即可

    shutdown -r now

## Nginx 权限问题

静态文件没有权限，Nginx 报错 403 forbidden (13: Permission denied)

需要修改相应文件夹的权限，或者把nginx的启动用户由默认的nginx，改成网站拥有者的用户

### 上传文件问题

上传文件时，比较大的文件，文件数据会暂时存储在 `/var/lib/nginx/tmp/` 中，必须保证 nginx 的启动用户有该文件夹的权限。（如果不是以 nginx 用户启动的话）


## 网卡配置
    
    # 查看网卡信息
    ifconfig 
    
    # 查看网卡配置
    vi /etc/sysconfig/network-scripts/ifcfg-eth0
    
## MySQL

mysql命令用户连接数据库。

    mysql -h 主机地址 -u 用户名 －p 用户密码 -P port -D database
    
修改数据库的表编码

    ALTER TABLE test_table CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;

    # For each database:
    ALTER DATABASE database_name CHARACTER SET = utf8 COLLATE = utf8_general_ci;
    # For each table:
    ALTER TABLE table_name CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
    # For each column:
    ALTER TABLE table_name CHANGE column_name column_name VARCHAR(191) CHARACTER SET utf8 COLLATE utf8_general_ci;

## yum update 之后出现的问题

### django-celery

使用 Supervisord 来管理 django-celery 的 beat 和 worker 进程，使用了 MySQL 数据库。但是在执行 yum update 之后，在 beat 的日志中出现异常，导致所有的 task 都无法正确执行。应该是由于 yum update 更新了 MySQL，才会出现该问题，而且 beat 进程仍然在运行，只是不停的出现该异常。

```
OperationalError: (2006, 'MySQL server has gone away')
```

重新启动进程后解决

    supervisorctl restart all