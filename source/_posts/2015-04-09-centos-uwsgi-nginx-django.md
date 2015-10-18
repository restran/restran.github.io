---
title: CentOS 环境下基于 Nginx uwsgi 搭建 Django 站点
layout: post
category : [服务器]
tagline: 
tags : [Centos, Nginx, uwsgi, Django]
---

以下用一个网站 ocean_monitor 举例

## MySQL 安装与配置

### 安装 

MariaDB is shipped in the CentOS repo as of CentOS 7 instead of mysql.
if you still want to install mysql you need to add mysql rpm dependency into your yum repo.

    sudo yum -y install mariadb-server mariadb-devel mariadb
    sudo systemctl start mariadb.service
    sudo systemctl enable mariadb.service

### 配置

登录

    mysql -u root -p

创建用户

    CREATE USER ocean_monitor IDENTIFIED BY 'ocean_monitor_pwd';

上面建立的用户可以在任何地方登陆。如果要限制在固定地址登陆，比如 localhost 登陆：

    CREATE USER ocean_monitor@localhost IDENTIFIED BY 'ocean_monitor_pwd';

创建数据库

    # 使用utf8编码，否则中文会有问题
    CREATE DATABASE ocean_monitor character set utf8;

授权 ocean_monitor 用户拥有 ocean_monitor 数据库的所有权限

    grant all on ocean_monitor.* to ocean_monitor identified by 'ocean_monitor_pwd';

如果是限制在 localhost 登录的，则使用

    grant all on ocean_monitor.* to ocean_monitor@localhost identified by 'ocean_monitor_pwd';

## 使用 PIP 安装依赖

为mysql-python安装依赖，这样才能编译安装
如果是Ubuntu用户

    sudo apt-get install build-essential python-dev libmysqlclient-dev python-mysqldb

如果是Centos用户

    yum install gcc python-devel 

安装所有的依赖

    # requirements.txt 是 django 项目目录下，填写的依赖包信息
    pip install -r requirements.txt

## 测试 uWSGU

创建一个测试文件

```python
# test.py
def application(env, start_response):
    start_response('200 OK', [('Content-Type','text/html')])
    return ["Hello World"] # python2
    #return [b"Hello World"] # python3
```

然后，Run uWSGI:

    uwsgi --http :8000 --wsgi-file test.py

如果出现错误，!!! no internal routing support, rebuild with pcre support !!!

    sudo apt-get install libpcre3 libpcre3-dev
    sudo pip uninstall uwsgi
    sudo apt-get remove uwsgi
    sudo pip install uwsgi

打开下面url，浏览器上应该显示hello world

    http://example.com:8000

如果显示正确，说明下面3个环节是通畅的：

    the web client <-> uWSGI <-> Python

测试Django

我看[别人][1]用的是 --module mysite.wsgi，但是建 Django项目时，并没有生成这个文件，这里十分奇怪。因此，使用 Django 生成的 wsgi.py 

    uwsgi --http :8000 --wsgi-file wsgi.py

如果显示正确，说明下面3个环节是通畅的：

    the web client <-> uWSGI <-> Django

## Nginx 安装与配置   

Nginx 安装

http://cantgis.blog.51cto.com/5788192/1540004

配置站点

    vim /etc/nginx/conf.d/ocean_monitor.conf

添加配置信息

```
# ocean_monitor.conf

# the upstream component nginx needs to connect to
upstream django_ocean_monitor {
    # server unix:///path/to/your/mysite/mysite.sock; # for a file socket
    # for a web port socket (we'll use this first)
    server 127.0.0.1:8108;
}

# configuration of the server
server {
    # the port your site will be served on
    listen      8008;
    # the domain name it will serve for
    # substitute your machine's IP address or FQDN
    # Django 的 settings.py 文件中的 ALLOWED_HOSTS 要加上这里设置的 server_name
    server_name localhost;
    charset     utf-8;

    gzip on;
    gzip_min_length 1000;
    gzip_buffers 4 16k;
    gzip_http_version 1.1;
    gzip_comp_level 3;
    gzip_vary on;
    # 禁用对 IE 6 使用 gzip 压缩
    gzip_disable "MSIE [1-6]\.";
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml application/xml+rss application/json;

    ## Individual nginx logs
    access_log  /var/log/nginx/ocean_monitor_access.log;
    error_log   /var/log/nginx/ocean_monitor_error.log;

    # max upload size
    client_max_body_size 8M;   # adjust to taste

    # Django media
    location /media  {
        # your Django project's media files - amend as required
        alias /home/python/ocean_monitor/media;  
    }

    location /static {
        # your Django project's static files - amend as required
        alias /home/python/ocean_monitor/static; 
    }

    # Finally, send all non-media requests to the Django server.
    location / {
        uwsgi_pass  django_ocean_monitor;
        # the uwsgi_params file you installed
        #  增加 nginx 配置， uwsgi_params 文件在 /etc/nginx/ 目录下
        include     /etc/nginx/uwsgi_params; 
    }
}
```

测试 nginx 的配置文件的语法是否正确

    sudo nginx -t

重启 nginx

    service nginx restart

## Django 配置

### settings.py 配置

**设置 ALLOWED_HOSTS**

Django gives Bad Request (400) when DEBUG = False
The ALLOWED_HOSTS list should contain fully qualified host names, not urls. Leave of the port and the protocol. If you are using 127.0.0.1, I'd add localhost to the list too

```python
ALLOWED_HOSTS = [
    # 加上本机的IP地址
    '192.168.137.146',
    '127.0.0.1', 
    'localhost'
]
```

You could also use * to match any host:

```python
ALLOWED_HOSTS = ['*']
```

**设置 DATABASES**

```
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'ocean_monitor',
        'USER': 'ocean_monitor',
        'PASSWORD': 'ocean_monitor_pwd',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

### 初始化数据库

    python manage.py syncdb
    
### 启动一下，测试 Django 有没有问题

    python manage.py runserver 0.0.0.0:8080

## uWSGI 配置文件

在 Django 项目的根目录添加 uwsgi.ini 文件

```
# uwsgi.ini file
[uwsgi]

# Django-related settings
# the base directory (full path)
chdir           = /home/python/ocean_monitor
# Django's wsgi file
wsgi-file       = /home/python/ocean_monitor/ocean_monitor/wsgi.py
# module       = index.wsgi:application
# the virtualenv (full path)
# home            = /path/to/virtualenv
daemonize   = /home/python/ocean_monitor/ocean_monitor.log
# process-related settings
# master
master          = true
pidfile     = /tmp/ocean_monitor_master.pid
# maximum number of worker processes
processes       = 3
# the socket (use the full path to be safe
# socket          = /home/python/ocean_monitor/ocean_monitor.sock
socket          = 127.0.0.1:8108
# ... with appropriate permissions - may be needed
chmod-socket    = 664
# clear environment on exit
vacuum          = true
```

### uwsgi 启动与结束

    # 启动
    uwsgi --ini uwsgi.ini
    # 重启
    uwsgi --reload /tmp/ocean_monitor_master.pid
    # 结束
    uwsgi --stop /tmp/ocean_monitor_master.pid
    
如果出现错误 signal_pidfile()/kill(): No such process [core/uwsgi.c line 1627]，是由于 ocean_monitor_master.pid 的进程ID不正确，修改/tmp/ocean_monitor_master.pid为正确的pid就可以。
    
使用如下命令，查询指定端口的进程id

    sudo netstat -ap | grep 8108
    
修改 /tmp/ocean_monitor_master.pid 的进程id值

    vim /tmp/ocean_monitor_master.pid
    
## 使用 supervisor 启动 celery-worker 及 celery-beat

## 安装 supervisor

**安装**

    pip install supervisor
    
安装方法请参考
    
http://www.iitshare.com/supervisord-manage-process.html

**生成配置文件**

安装好supervisor之后，默认是没有生成配置文件的。可以通过以下命令生成配置文件

    echo_supervisord_conf > /etc/supervisord.conf

**启动**

    supervisord -c /etc/supervisord.conf  # 到指定路径下去找配置文件


如果出现 
another program is already listening on a port that one of our HTTP servers is configured to use

    sudo unlink /etc/supervisor.sock

然后再次运行

    supervisord -c /etc/supervisord.conf

**supervisor 管理**

supervisor 安装完成后有两个可用的命令行 supervisor 和 supervisorctl，命令使用解释如下：

    supervisord，初始启动Supervisord，启动、管理配置中设置的进程。
    supervisorctl stop programxxx，停止某一个进程(programxxx)，programxxx为[program:chatdemon]里配置的值，这个示例就是chatdemon。
    supervisorctl start programxxx，启动某个进程
    supervisorctl restart programxxx，重启某个进程
    supervisorctl stop groupworker: ，重启所有属于名为groupworker这个分组的进程(start,restart同理)
    supervisorctl stop all，停止全部进程，注：start、restart、stop都不会载入最新的配置文件。
    supervisorctl reload，载入最新的配置文件，停止原有进程并按新的配置启动、管理所有进程。
    supervisorctl update，根据最新的配置文件，启动新配置或有改动的进程，配置没有改动的进程不会受影响而重启。

注意：显示用stop停止掉的进程，用reload或者update都不会自动重启。


## 设置配置文件

    vim /etc/supervisord.conf

在文件最后添加如下信息

```
[program:ocean_monitor_celery_worker]
process_name = ocean_monitor_celery_worker
command=python /home/python/ocean_monitor/manage.py celery worker --loglevel=info
directory=/home/python/ocean_monitor
autorestart=true
redirect_stderr=true
stdout_logfile = /var/log/supervisord/ocean_monitor_celery_worker.log
loglevel=info
```

```
[program:ocean_monitor_celery_beat]
process_name = ocean_monitor_celery_beat
command=python /home/python/ocean_monitor/manage.py celery beat --loglevel=info
directory=/home/python/ocean_monitor
autorestart=true
redirect_stderr=true
stdout_logfile = /var/log/supervisord/ocean_monitor_celery_beat.log
loglevel=info
```

用 supervisor 运行前，可以先在命令行下启动测试一下

    python manage.py celery beat --loglevel=info
    python manage.py celery worker --loglevel=info

启动

    # 根据最新的配置文件，启动新配置或有改动的进程
    # 配置没有改动的进程不会受影响而重启
    supervisorctl update

## 防火墙设置及 SELinux 问题
    
### 设置防火墙开放端口（iptables）

    /sbin/iptables -I INPUT -p tcp --dport 8008 -j ACCEPT 

### nginx permission denied 问题

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


  [1]: http://www.jianshu.com/p/e6ff4a28ab5a
  [2]: http://stackoverflow.com/questions/22586166/why-does-nginx-return-a-403-even-though-all-permissions-are-set-properly