---
title: 使用 Fabric 自动化部署 Python 项目
layout: post
category : [Python]
tagline: 
keywords: [python, fabric, linux, 部署, 服务器, 自动化]
tags : [Python, Fabric, Linux]
---

[Fabric](http://www.fabfile.org/) 是使用 Python 开发的一个自动化运维和部署项目的一个好工具，可以通过 SSH 的方式与远程服务器进行自动化交互，例如将本地文件传到服务器，在服务器上执行shell 命令。

下面给出一个自动化部署 Django 项目的例子

```py
# -*- coding: utf-8 -*-
# 文件名要保存为 fabfile.py

from __future__ import unicode_literals
from fabric.api import *

# 登录用户和主机名：
env.user = 'root'
# 如果没有设置，在需要登录的时候，fabric 会提示输入
env.password = 'youpassword'
# 如果有多个主机，fabric会自动依次部署
env.hosts = ['www.example.com']

TAR_FILE_NAME = 'deploy.tar.gz'

def pack():
    """
    定义一个pack任务, 打一个tar包
    :return:
    """
    tar_files = ['*.py', 'static/*', 'templates/*', 'vue_app/', '*/*.py', 'requirements.txt']
    exclude_files = ['fabfile.py', 'deploy/*', '*.tar.gz', '.DS_Store', '*/.DS_Store',
                     '*/.*.py', '__pycache__/*']
    exclude_files = ['--exclude=\'%s\'' % t for t in exclude_files]
    local('rm -f %s' % TAR_FILE_NAME)
 
    local('tar -czvf %s %s %s' % (TAR_FILE_NAME, ' '.join(exclude_files), ' '.join(tar_files)))
    print('在当前目录创建一个打包文件: %s' % TAR_FILE_NAME)


def deploy():
    """
    定义一个部署任务
    :return:
    """
    # 先进行打包
    pack()

    # 远程服务器的临时文件
    remote_tmp_tar = '/tmp/%s' % TAR_FILE_NAME
    run('rm -f %s' % remote_tmp_tar)
    # 上传tar文件至远程服务器, local_path, remote_path
    put(TAR_FILE_NAME, remote_tmp_tar)
    # 解压
    remote_dist_base_dir = '/home/python/django_app'
    # 如果不存在, 则创建文件夹
    run('mkdir -p %s' % remote_dist_dir)

	 # cd 命令将远程主机的工作目录切换到指定目录 
    with cd(remote_dist_dir):
        print('解压文件到到目录: %s' % remote_dist_dir)
        run('tar -xzvf %s' % remote_tmp_tar)
        print('安装 requirements.txt 中的依赖包')
        # 我使用的是 python3 来开发
        run('pip3 install -r requirements.txt')
        remote_settings_file = '%s/django_app/settings.py' % remote_dist_dir
        settings_file = 'deploy/settings.py' % name
        print('上传 settings.py 文件 %s' % settings_file)
        put(settings_file, remote_settings_file)

        nginx_file = 'deploy/django_app.conf'
        remote_nginx_file = '/etc/nginx/conf.d/django_app.conf'
        print('上传 nginx 配置文件 %s' % nginx_file)
        put(nginx_file, remote_nginx_file)
	
	 # 在当前目录的子目录 deploy 中的 supervisor 配置文件上传至服务器
    supervisor_file = 'deploy/django_app.ini'
    remote_supervisor_file = '/etc/supervisord.d/django_app.ini'
    print('上传 supervisor 配置文件 %s' % supervisor_file)
    put(supervisor_file, remote_supervisor_file)
	 
	 # 重新加载 nginx 的配置文件
    run('nginx -s reload')
    run('nginx -t')
    # 删除本地的打包文件
    local('rm -f %s' % TAR_FILE_NAME)
    # 载入最新的配置文件，停止原有进程并按新的配置启动所有进程
    run('supervisorctl reload')
    # 执行 restart all，start 或者 stop fabric 都会提示错误，然后中止运行
    # 但是服务器上查看日志，supervisor 有重启
    # run('supervisorctl restart all')
```

执行 pack 任务

	fab pack

执行 deploy 任务	
	
	fab deploy