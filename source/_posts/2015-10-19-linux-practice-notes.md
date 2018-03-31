---
title: Linux 踩坑记
layout: post
category : [Linux]
tagline: 
keywords: [linux, 使用帮助, 文件管理, 命令, 进程管理, centos]
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

### 查看隐藏文件

以`.`开头的文件或文件夹是隐藏文件，默认不显示

```
# 显示所有文件（包含隐藏文件）
ls -a
# 列表方式查看，可以查看文件权限
ls -l
ls -al
# 只显示隐藏文件
l.
# 或者
ls -d .*
```

必须有文件的`执行`权限，用 ls 命令的时候才能看见文件。如果是 Ubuntu，按 Ctrl+H 就可以显示隐藏文件，再按一次则隐藏。

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
    
### 批量删除 .DS_Store 文件

删除指定目录下所有的 .DS_Store 文件

```
sudo find /home/path -name ".DS_Store" -type f -delete
```

### 修改文件的拥有者和权限

修改文件的拥有者
    
    chown [用户名] [文件名] 

如果是修改所属的用户组使用 `chgrp`

修改文件夹的拥有者

    chown -R [用户名] [文件夹] 
    chown -R user /tmp/folder

## 查看硬盘及内存空间

```bash
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

## 用户相关

Linux查看当前系统登录用户、登录日志、登录错误日志
查看当前系统的登录用户

    w
    who

查看成功登录历史记录

    last

查看尝试登录失败的历史记录

    lastb

显示每个用户最近一次登录成功的信息

    lastlog

Ubuntu 切换到 root

    sudo su

Ubuntu 修改 root 密码

    sudo passwd root

修改完毕以后，执行 su root 命令时，输入新的 root 密码即可

在 root 下，可以切换到其他用户

    su - usernmae

### 用户创建和删除

创建用户（useradd/adduser）：

    useradd [所要创建的用户名] -p [加密后的密码]
    # 会自动创建目录，会提示设置密码
    adduser [所要创建的用户名] 
    
删除用户

    userdel [-r] [要删除的用户的名称]

修改用户密码

    passwd [用户名]

创建用户，但是不创建 home 目录

    sudo useradd -M username

### 用户组管理

添加用户到组里面

	usermod -a -G apache username
	
创建用户组

	groupadd developers

### Ubuntu Home 目录加密问题

如果在安装 Ubuntu 的时候，选择加密 home 目录，在重启的时候，可能会遇到需要解密 home 目录的问题，这时在 home 目录下的用户名文件夹中，只能看到两个文件。提示要运行 `ecryptfs-mount-private` 来解密文件

```
Access-Your-Private-Data.desktop  README.txt
```

使用方法如下

    ecryptfs-mount-private /home/.ecryptfs/your_username/.Private

执行的时候需要输入用户密码，然后文件就会解密了

## 日志相关

实时显示日志文件，如果日志文件有更新，会自动滚动到文件最后，并实时显示
    
    # 默认查看最新的10行
    tail -f /var/log/nginx/access.log
    # 查看20行
    tail -n 20 -f /var/log/nginx/access.log

清除登录痕迹

```
# 清除登录系统失败的记录
echo "" > /var/log/btmp
# 清除登录系统成功的记录
echo "" >/var/log/wtmp
# 清除历史执行命令
history -c
```

## 网络相关

nslookup 指定 DNS 服务器

    nslookup example.com 8.8.8.8

查看端口占用情况

    netstat -ntlp
    
网卡配置
    
    # 查看网卡信息
    ifconfig 
    
    # 查看网卡配置
    vi /etc/sysconfig/network-scripts/ifcfg-eth0
    
## 进程相关

查询指定端口的进程id，如 8108

grep 是搜索，`|` 是管道，下面命令的意思是将 netstat -ap 的结果作为下一个命令的输入

    sudo netstat -ap | grep 8108

或者 

    sudo ps -aux | grep 8108

杀死指定进程

    sudo kill xxx

查看指定用户名启动的进程

    ps -u username

指定用户来运行某个程序，当前必须要是 root

    sudo -u username ./run.sh

查看当前进程信息，显示完整的命令

    ps -ef
    
使用 ax 和 aux 可以查看详细信息

    ps ax | grep uwsgi
    ps aux | grep uwsgi
    
### 强制杀死进程

pid_num 是进程号

    kill -s 9 pid_num
    pkill -9 pid_num
    
### 强制杀死所有 uwsgi 进程

[参考这里](http://serverfault.com/questions/565903/how-to-stop-uwsgi-when-no-pidfile-in-config)

    sudo pkill -f uwsgi -9
    
### 查看进程 pid 对应的程序文件路径

http://os.51cto.com/art/201003/186841.htm

进入/proc目录

    cd /proc

ps查看所有符合./cmd的进程，找出其对应的进程号

用 ll 命令： ll 进程号

如下显示一个示例：

```
[root@Cluster1 proc]# ll 22401  
total 0  
-r--r--r-- 1 jack jack 0 Dec 11 11:10 cmdline  
-r--r--r-- 1 jack jack 0 Dec 11 11:10 cpu  
lrwxrwxrwx 1 jack jack 0 Dec 11 11:10 cwd -> /home/jack/sbs/bin  
-r-------- 1 jack jack 0 Dec 11 11:10 environ  
lrwxrwxrwx 1 jack jack 0 Dec 11 11:10 exe -> /home/jack/sbs/bin/cbs (deleted)  
dr-x------ 2 jack jack 0 Dec 11 11:10 fd  
-r-------- 1 jack jack 0 Dec 11 11:10 maps  
-rw------- 1 jack jack 0 Dec 11 11:10 mem  
-r--r--r-- 1 jack jack 0 Dec 11 11:10 mounts  
lrwxrwxrwx 1 jack jack 0 Dec 11 11:10 root -> /  
-r--r--r-- 1 jack jack 0 Dec 11 11:10 stat  
-r--r--r-- 1 jack jack 0 Dec 11 11:10 statm  
-r--r--r-- 1 jack jack 0 Dec 11 11:10 status 
```

/proc文件系统下的进程号目录下面的文件镜像了进程的当前运行信息，从中可以看到：

```
cwd符号链接的就是进程22401的运行目录；
exe符号连接就是执行程序的绝对路径；
cmdline就是程序运行时输入的命令行命令；本例为：./cbs
cpu记录了进程可能运行在其上的cpu；显示虚拟的cpu信息
environ记录了进程运行时的环境变量
fd目录下是进程打开或使用的文件的符号连接
```

通过cwd直接进入进程运行目录，通过查看相关信息就可以定位此目录对应那个端口号，以及定位是那个应用才使用此服务程序。这样就获得了Linux进程文件路径了。


## 查看CPU和内存占用

```
# CPU占用最多的前10个进程： 
ps auxw|head -1;ps auxw|sort -rn -k3|head -10 
# 内存消耗最多的前10个进程 
ps auxw|head -1;ps auxw|sort -rn -k4|head -10 
# 虚拟内存使用最多的前10个进程 
ps auxw|head -1;ps auxw|sort -rn -k5|head -10
```

```
# 按内存占用对进程排序
ps auxw --sort=rss
# 按CPU占用对进程排序
ps auxw --sort=%cpu
```

## supervisord 使用问题

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

## SSH 相关
    
生成 SSH 密钥

    ssh-keygen -t rsa -C "your_email@example.com"

在服务器上用 SSH 登录另外一台服务

    # -p 后面跟的是端口
    ssh 192.168.1.102 -l root -p 22

## 关机与重启命令

重启命令

```
1、reboot
2、shutdown -r now 立刻重启(root用户使用)
3、shutdown -r 10 过10分钟自动重启(root用户使用) 
4、shutdown -r 20:35 在时间为20:35时候重启(root用户使用)
如果是通过shutdown命令设置重启的话，可以用shutdown -c命令取消重启
```

关机命令

```
1、halt   立刻关机
2、poweroff  立刻关机
3、shutdown -h now 立刻关机(root用户使用)
4、shutdown -h 10 10分钟后自动关机
如果是通过shutdown命令设置关机的话，可以用shutdown -c命令取消重启
```

## Curl

```
# 强制指定本地端口
curl --local-port 51 http://web.example.com

# 查看连接的详细信息
# --trace-time 跟踪/详细输出时，添加时间戳
curl -Sv --trace-time http://web.example.com
```

## 服务相关

Ubuntu 设置开机启动的服务

	sudo systemctl enable nginx

## 最小化安装完 CentOS 7 之后出现的问题

### 使用 `yum install xx` 出现错误 cannot find a valid base url for repo

    cd /etc/sysconfig/network-scripts 
    dmesg | grep eth0

在输出结果的最后一行，发现 `eth0` 重命名为 `eno16777736`，修改这个eth文件

    vi /etc/sysconfig/network-scripts/ifcfg-eno16777736

最后一行，设置 `onboot=yes`，

配置 DNS

    vi /etc/resolve.conf
    
添加

```
nameserver 114.114.114.114
nameserver 8.8.8.8
```

然后重启网络服务
 
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
    
## Nginx

## 安装最新版的 Nginx

可以参考[这里](http://www.lnmp.cn/installing-php7-mysql57-nginx18-under-centos7.html)

    rpm -Uvh http://nginx.org/packages/centos/7/noarch/RPMS/nginx-release-centos-7-0.el7.ngx.noarch.rpm

通过 yum 安装

    yum install nginx

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
    
## MySQL

### 安装 MySQL 5.7

    rpm -Uvh http://dev.mysql.com/get/mysql57-community-release-el7-7.noarch.rpm
    # 安装
    yum install mysql-community-server mysql-community-devel
    #启动
    systemctl start mysqld

    # MySQL 5.7 会给 root 分配临时密码，可以通过该方法查看
    grep 'temporary password' /var/log/mysqld.log

### MySQL 操作

mysql命令用户连接数据库。

    mysql -h 主机地址 -u 用户名 －p 用户密码 -P port -D database
    # 连接本机的数据库
    mysql -u root -p
 
修改数据库的表编码

    ALTER TABLE test_table CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;

    # For each database:
    ALTER DATABASE database_name CHARACTER SET = utf8 COLLATE = utf8_general_ci;
    # For each table:
    ALTER TABLE table_name CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
    # For each column:
    ALTER TABLE table_name CHANGE column_name column_name VARCHAR(191) CHARACTER SET utf8 COLLATE utf8_general_ci;

修改密码

    # MySQL 5.7 版本对密码的安全性要求很严格，必须至少包含1个大写字母、1个小写字母、1个数字和1个特殊字符，长度不得小于8个字符。
    ALTER USER 'root'@'localhost' IDENTIFIED BY 'p@ssw0rd';

## 配置 SNMP 服务

Solarwinds 可以使用 SNMP 协议监控服务器的状态。

```
# 安装
yum install net-snmp
# 可选安装 net-snmp 的工具，可以使用 snmpwalk 命令
yum install net-snmp-utils
 
# 设置开机启动
chkconfig snmpd on

# 启动
service snmpd start
 
# 查看当前版本
snmpd -v
```

[snmap 配置](http://blog.csdn.net/jacky0922/article/details/6952152)

为了让 Solarwinds 监控服务器的状态，需要配置这几个东西

```
# 打开配置文件
vim /etc/snmp/snmpd.conf
```

修改 community

```
####
# First, map the community name "public" into a "security name"

#       sec.name  source          community
# com2sec notConfigUser  default       public
# 修改最后的 public 为指定的名称
com2sec notConfigUser  default       public
```

配置可以查看主机CPU和内存等设备的数据，添加一行数据

```
# Third, create a view for us to let the group have rights to:

# Make at least  snmpwalk -v 1 localhost -c public system fast again.
#       name           incl/excl     subtree         mask(optional)
# 添加这条数据，表示可以查看.1节点下的所有设备信息
view    systemview    included   .1

view    systemview    included   .1.3.6.1.2.1.1
view    systemview    included   .1.3.6.1.2.1.25.1.1
```

修改disk checks配置

```
# disk PATH [MIN=100000]
# Check the / partition and make sure it contains at least 10 megs.

# "#" 号去掉，取消注释。
disk / 10000
```

## 其他

### 修改 hostname

    hostname your_hostname

## yum update 之后出现的问题

### django-celery

使用 Supervisord 来管理 django-celery 的 beat 和 worker 进程，使用了 MySQL 数据库。但是在执行 yum update 之后，在 beat 的日志中出现异常，导致所有的 task 都无法正确执行。应该是由于 yum update 更新了 MySQL，才会出现该问题，而且 beat 进程仍然在运行，只是不停的出现该异常。

```
OperationalError: (2006, 'MySQL server has gone away')
```

重新启动进程后解决

    supervisorctl restart all


### gitlab-ci-runner

如果 gitlab-ci-runner 有更新或者 docker 有更新，会出现无法连接到 gitlab 进行 clone 代码
 
```
fatal: unable to access 'http://gitlab-ci-token:xxxxxx@your_gitlab/webport/fomalhaut.git/': Failed to connect to your_gitlab port 80: Operation timed out
```

需要重启 docker

    service docker restart
   
或者重启 gitlab-ci-runnner

    gitlab-ci-runner restart
    