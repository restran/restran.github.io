---
title: CentOS 7 Minimal 安装 Gitlab 8.9
layout: post
category : [Git]
tagline: 
tags : [Gitlab, Git]
---

之前整理过一份 CentOS 6.5 Minimal 系统环境下，用源代码的方式安装 Gitlab 7.5 的[文档](https://www.restran.net/2015/04/09/gilab-centos-installation-note/)，后面因为要将 Gitlab 升级到 8.9 的版本，操作系统也升级到了 CentOS 7，因此重新整理了一份。

## Software stack

GitLab is a Ruby on Rails application that runs on the following software:
Ubuntu/Debian/CentOS/RHEL
Ruby (MRI) 2.1
Git 2.7.4+
Redis 2.8+
MySQL or PostgreSQL


**全部命令都是在 root 用户下执行**

----------

## 1. Installing the operating system (CentOS 7 Minimal)

先配置好网卡和DNS，保证网络没问题。

## Updating and adding basic software and services

先安装 wget

	yum install wget
	
### 安装EPEL源

[可以参考](http://www.cyberciti.biz/faq/installing-rhel-epel-repo-on-centos-redhat-7-x/)

输入命令
    
    yum install epel-release

	# wget -O /etc/pki/rpm-gpg/RPM-GPG-KEY-EPEL-6 https://www.fedoraproject.org/static/0608B895.txt
	# rpm --import /etc/pki/rpm-gpg/RPM-GPG-KEY-EPEL-6


### Add Remi's RPM repository
	
Remi's RPM Repository is unofficial repository for Centos/RHEL that provides latest versions of some software. We take advantage of Remi's RPM repository to obtain up-to-date version of Redis.
Download the GPG key for Remi's repository and install it on your system:

	wget -O /etc/pki/rpm-gpg/RPM-GPG-KEY-remi http://rpms.famillecollet.com/RPM-GPG-KEY-remi
	rpm --import /etc/pki/rpm-gpg/RPM-GPG-KEY-remi
	
Verify that the key got installed successfully:
	
	rpm -qa gpg*
	# 查看输出是否包含
	# gpg-pubkey-00f97f56-467e318a
	
Now install the remi-release-7 package, which will enable remi-safe repository on your system:

	rpm -Uvh http://rpms.famillecollet.com/enterprise/remi-release-7.rpm


Verify that the EPEL and PUIAS Computational repositories are enabled as shown below:

    yum repolist
    
如果出现错误 Error: Cannot retrieve metalink for repository: epel. Please verify its path and try again

    vim /etc/yum.repos.d/epel.repo，把基础的恢复，镜像的地址注释掉

    #baseurl
    mirrorlist
    
改成

    baseurl
    # mirrorlist

    repo id                 repo name                                                status
    PUIAS_6_computational   PUIAS computational Base 6 - x86_64                      2,018
    base                    CentOS-6 - Base                                          4,802
    epel                    Extra Packages for Enterprise Linux 6 - x86_64           7,879
    extras                  CentOS-6 - Extras                                           12
    updates                 CentOS-6 - Updates                                         814
    repolist: 15,525

If you can't see them listed, use the folowing command (from `yum-utils` package) to enable them:

    先安装yum-utils，才能使用yum-config-manager，否则会出现commond not found
    
    yum -y install yum-utils
    yum-config-manager --enable epel --enable PUIAS_6_computational


最后，更新源缓存

    yum clean all && yum makecache

### Install the required tools for GitLab

    yum -y update
    yum -y groupinstall 'Development Tools'
    yum -y install readline readline-devel ncurses-devel gdbm-devel glibc-devel tcl-devel openssl-devel curl-devel expat-devel db4-devel byacc sqlite-devel libyaml libyaml-devel libffi libffi-devel libxml2 libxml2-devel libxslt libxslt-devel libicu libicu-devel system-config-firewall-tui redis sudo wget crontabs logwatch logrotate perl-Time-HiRes git cmake libcom_err-devel.i686 libcom_err-devel.x86_64 ntp nodejs python-docutils

gitlab 8.0 之后的版本需要依赖 nodejs，不然安装 gitlab-shell 的时候会出现没有javascript runtime

### 安装vim

    yum -y install vim-enhanced
    update-alternatives --set editor /usr/bin/vim.basic

### 设置NTP时间同步

修正时区

	 # 删除当前默认时区
    rm -rf /etc/localtime    
    # 复制替换默认时区为上海
    ln -s /usr/share/zoneinfo/Asia/Shanghai /etc/localtime 
   
SSH执行以上命令，将时区修改为中国上海的时区，当然，也可以设置中国香港或北京的时间。
    
手动修正时间

    date -s '09:16:00 2013-01-21' 
    
使用“date”命令，修改时间和日期为2013年1月21日，时间是上午9点16分0秒。
    
时间自动同步和校正

    yum install -y ntp        # 安装时间同步服务（组件）
    ntpdate us.pool.ntp.org   # 设置同步服务器
    date                      # 查看当前时间
    
部分系统已经安装了NTP服务，系统会根据当前记录的时区（第一步操作）自动连接ntp服务器校正时间。

### Install mail server

In order to receive mail notifications, make sure to install a
mail server. The recommended one is postfix and you can install it with:

    yum -y install postfix

To use and configure sendmail instead of postfix see [Advanced Email Configurations](e-mail/configure_email.md).

### 配置默认编辑器

You can choose between editors such as nano, vi, vim, etc.
In this case we will use vim as the default editor for consistency.

    ln -s /usr/bin/vim /usr/bin/editor

To remove this alias in the future:
以后删除别名的时候用这条命令
    
    rm -i /usr/bin/editor

### 从源代码安装 Git

因为 Git 版本要求 2.7.4+，通过 yum install 的版本是 1.8.3，需要从源代码安装。

先删除旧版本的 git

    yum -y remove git

Install the pre-requisite files for Git compilation:

    yum install zlib-devel perl-CPAN gettext curl-devel expat-devel gettext-devel openssl-devel

Download and extract it:

    mkdir /tmp/git && cd /tmp/git
    curl --progress https://www.kernel.org/pub/software/scm/git/git-2.8.4.tar.gz | tar xz
    cd git-2.8.4/
    ./configure
    make
    make prefix=/usr/local install

Make sure Git is in your `$PATH`:

    which git

You might have to logout and login again for the `$PATH` to take effect.
**Note:** When editing `config/gitlab.yml` (step 6), change the git `bin_path` to `/usr/local/bin/git`.

----------

## 2. Ruby

GitLab 需要 2.1 以上版本的 Ruby，但是当前不兼容 2.2 和 2.3，先删除旧的

    yum remove ruby

Remove any other Ruby build if it is still present:

    cd <your-ruby-source-path>
    make uninstall
    
如果没有安装ruby，上述删除的步骤可以跳过

Download Ruby and compile it:

    mkdir /tmp/ruby && cd /tmp/ruby
    
从网上下载

    curl --progress ftp://ftp.ruby-lang.org/pub/ruby/2.1/ruby-2.1.8.tar.gz | tar xz

如果已经下载好，手动上传到服务器，可以先解压缩
    
    tar -xzf ruby-2.1.8.tar.gz
    
进入目录

    cd ruby-2.1.8
    ./configure --disable-install-rdoc
    
如果出现错误

    make: Warning: File 'common.mk' has modification time 1386501635 s in the future
    
是由于系统的时间错误导致，可以重新配置一下系统时间，以及NTP自动同步时间
    
编译安装

    make
    make prefix=/usr/local install

### Install the Bundler Gem:

由于 AWS 被墙无法使用，修改 ruby 的源

    gem sources --remove https://rubygems.org/
    gem sources -a https://ruby.taobao.org/
    gem sources -l

    gem install bundler --no-doc

Logout and login again for the `$PATH` to take effect. Check that ruby is properly
installed with:

    which ruby
    # /usr/local/bin/ruby
    ruby -v


## 安装 go （gitlab 8.0 以后的版本需要go语言的支持）

    mkdir /tmp/go && cd /tmp/go

下载

    URL='https://storage.googleapis.com/golang/' && wget -c `curl -s $URL|xmllint --format - |awk -PF'[><]' '{if ($3~/linux/ && $3!~/(beta|rc)[0-9]+|armv6l|386/)a=$3}END{print "'$URL'"a}'`
    
解压缩

    tar xf go*.linux-amd64.tar.gz -C /usr/local/ 
    echo "PATH=/usr/local/go/bin:\$PATH" >/etc/profile.d/go.sh
    . /etc/profile.d/go.sh
    go version

## 3. System Users

Create a `git` user for Gitlab:

    adduser --system --shell /bin/bash --comment 'GitLab' --create-home --home-dir /home/git/ git

**Important:** In order to include `/usr/local/bin` to git user's PATH, one way is to edit the sudoers file. As root run:

    visudo

Then search for this line:

    Defaults    secure_path = /sbin:/bin:/usr/sbin:/usr/bin

and append `/usr/local/bin` like so:

    Defaults    secure_path = /sbin:/bin:/usr/sbin:/usr/bin:/usr/local/bin

Save and exit.

----------

## 4. Database

### 4.2 MySQL

CentOS 7 版本将 MySQL 数据库软件从默认的程序列表中移除，用 Mariadb 代替了

    yum install -y mariadb mariadb-server mariadb-devel

    systemctl enable mariadb  #设置开机启动
    systemctl start mariadb #启动MariaDB
    
    
mariadb数据库的相关命令是：

```
systemctl start mariadb  #启动MariaDB
systemctl stop mariadb  #停止MariaDB
systemctl restart mariadb  #重启MariaDB
systemctl enable mariadb  #设置开机启动
```

Ensure you have MySQL version 5.5.14 or later:

    mysql --version

设置数据库 root 用户密码，并设置相关的安全配置

    mysql_secure_installation
    
因为是刚安装完数据库，因此没有 root 账户的密码，按回车后，会开始让设置密码。设置完密码后，会问是否删除匿名用户（不需要密码就能登录），选择 y。

登录 MySQL (输入数据库 root 用户的密码):

    mysql -u root -p

Create a user for GitLab (change $password in the command below to a real password you pick):

**修改$password为自己的密码**

    CREATE USER 'git'@'localhost' IDENTIFIED BY '$password';

Ensure you can use the InnoDB engine which is necessary to support long indexes.
If this fails, check your MySQL config files (e.g. `/etc/mysql/*.cnf`, `/etc/mysql/conf.d/*`) for the setting "innodb = off".

    SET storage_engine=INNODB;

Create the GitLab production database:

    CREATE DATABASE IF NOT EXISTS `gitlabhq_production` DEFAULT CHARACTER SET `utf8` COLLATE `utf8_unicode_ci`;

Grant the GitLab user necessary permissions on the table:

    GRANT SELECT, LOCK TABLES, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER ON `gitlabhq_production`.* TO 'git'@'localhost';

Quit the database session:

    \q

Try connecting to the new database with the new user:

    sudo -u git -H mysql -u git -p -D gitlabhq_production

使用上面在MySQL中创建的git用户的密码
    
Type the password you replaced $password with earlier.
Quit the database session:

    \q
    
配置 MySQL max_allowed_packet 的大小，避免POST太大的内容导致出现 500 错误，例如 GitLab 发出 MergeRequest 的时候返回 500 错误。

    vim /etc/my.cnf

在 mysqld 中添加 max_allowed_packet，调整值，加大为一个合适的数字即可。

    [mysqld]
    max_allowed_packet=512M

然后 reload 下 mysql 的服务即可。

    systemctl restart mariadb

----------

## 5. Redis

Make sure redis is started on boot:

    chkconfig redis on

Configure redis to use sockets:

    cp /etc/redis.conf /etc/redis.conf.orig

Disable Redis listening on TCP by setting 'port' to 0:

    sed 's/^port .*/port 0/' /etc/redis.conf.orig | sudo tee /etc/redis.conf

Enable Redis socket for default CentOS path:

    echo 'unixsocket /var/run/redis/redis.sock' | sudo tee -a /etc/redis.conf
    echo -e 'unixsocketperm 0775' | sudo tee -a /etc/redis.conf

Activate the changes to redis.conf:

    service redis restart

Add git to the redis group:

    usermod -aG redis git

------

## 6. GitLab

    # We'll install GitLab into home directory of the user "git"
    cd /home/git

### Clone the Source

	# 先切换到git账户
	su - git
	# 再clone代码
	git clone https://github.com/gitlabhq/gitlabhq.git -b 8-8-stable gitlab

或者中文翻译版

	git clone https://gitlab.com/larryli/gitlab.git -b 8-8-zh gitlab
	
    # 退出git用户操作命令，使用root用户操作
    logout

### Configure it

    # Go to GitLab installation folder
    cd /home/git/gitlab
    
为了方便添加 git 用户拥有 root 权限，sudoers文件默认没有写权限需要强制保存:wq!

    vi /etc/sudoers
    
最后添加

```
git     ALL=(ALL)       ALL
```

Copy the example GitLab config

    sudo -u git -H cp config/gitlab.yml.example config/gitlab.yml

Update GitLab config file, follow the directions at top of file

    sudo -u git -H vim config/gitlab.yml
    
配置如下信息

```
host: 192.168.137.142
port: 8008
email_from: gitlab@example.com
default_theme: 1
```

确保 GitLab 可以写 log/ and tmp/ 目录

    chown -R git log/
    chown -R git tmp/
    chmod -R u+rwX log/
    chmod -R u+rwX tmp/

Create directory for satellites

    sudo -u git -H mkdir /home/git/gitlab-satellites
    chmod u+rwx,g=rx,o-rwx /home/git/gitlab-satellites

Make sure GitLab can write to the tmp/pids/ and tmp/sockets/ directories

    chmod -R u+rwX tmp/pids/
    chmod -R u+rwX tmp/sockets/

Make sure GitLab can write to the public/uploads/ directory
    
    sudo -u git mkdir /home/git/gitlab/public/uploads
    chmod -R u+rwX  /home/git/gitlab/public/uploads

Copy the example Unicorn config
    
    sudo -u git -H cp config/unicorn.rb.example config/unicorn.rb

Find number of cores
    
    nproc

    # Enable cluster mode if you expect to have a high load instance
    # Ex. change amount of workers to 3 for 2GB RAM server
    # Set the number of workers to at least the number of cores
    sudo -u git -H vim config/unicorn.rb
    
> 特别注意：比较差配置的机器，注意将unicorn.rb中的timeout设置大一点，因为第一次启动的时候Gitlab需要初始化，如果timeout太小，由于需要执行较长时间，导致无法正常启动，出现502错误**

Copy the example Rack attack config

    sudo -u git -H cp config/initializers/rack_attack.rb.example config/initializers/rack_attack.rb

Configure Git global settings for git user, useful when editing via web.

Edit user.email according to what is set in gitlab.yml

    sudo -u git -H git config --global user.name "GitLab"
    sudo -u git -H git config --global user.email "gitlab@example.com"
    sudo -u git -H git config --global core.autocrlf input

    # Configure Redis connection settings
    sudo -u git -H cp config/resque.yml.example config/resque.yml

如果不使用Redis的默认端口，则需要配置，Change the Redis socket path if you are not using the default CentOS configuration

    sudo -u git -H vim config/resque.yml

**Important Note:** Make sure to edit both `gitlab.yml` and `unicorn.rb` to match your setup.

**Note:** If you want to use HTTPS, see [Using HTTPS][https] for the additional steps.

配置一下权限

	sudo chmod 700 /home/git/gitlab/public/uploads
	sudo chmod -R ug+rwX,o-rwx /home/git/repositories/
	sudo chmod -R ug-s /home/git/repositories/
	sudo find /home/git/repositories/ -type d -print0 | sudo xargs -0 chmod g+s

### Configure GitLab DB settings

    sudo -u git cp config/database.yml.mysql config/database.yml

配置数据库的密码，修改为正确的用户名和密码，分别修改git用户和root用户

    sudo -u git -H vim config/database.yml
    
Make config/database.yml readable to git only
    
    sudo -u git -H chmod o-rwx config/database.yml

### Install Gems

**Note:** As of bundler 1.5.2, you can invoke `bundle install -jN`
(where `N` the number of your processor cores) and enjoy the parallel gems installation with measurable
difference in completion time (~60% faster). Check the number of your cores with `nproc`.
For more information check this [post](http://robots.thoughtbot.com/parallel-gem-installing-using-bundler).
First make sure you have bundler >= 1.5.2 (run `bundle -v`) as it addresses some [issues](https://devcenter.heroku.com/changelog-items/411)
that were [fixed](https://github.com/bundler/bundler/pull/2817) in 1.5.2.

    cd /home/git/gitlab

修改为淘宝的ruby源

    vi Gemfile
    
修改为

```
source "https://ruby.taobao.org/"
```

    sudo -u git -H bundle install --deployment --without development test postgres aws

这一步的时间会等很久
    
### Install GitLab shell

GitLab Shell is an SSH access and repository management software developed specially for GitLab.

Run the installation task for gitlab-shell (replace `REDIS_URL` if needed):

    su - git
    cd /home/git/gitlab
    bundle exec rake gitlab:shell:install[v$(cat GITLAB_SHELL_VERSION)] REDIS_URL=unix:/var/run/redis/redis.sock RAILS_ENV=production
    
    logout

如果出现错误

```
Errno::ENOENT: No such file or directory - /usr/bin/git
```

找一下 git 所在的位置

    which git
    
例如我是在/usr/local/bin/git，因此建立软连接

    ln -s /usr/local/bin/git /usr/bin/git

By default, the gitlab-shell config is generated from your main GitLab config. You can review (and modify) the gitlab-shell config as follows:

    sudo -u git -H editor /home/git/gitlab-shell/config.yml

    # Ensure the correct SELinux contexts are set
    # Read http://wiki.centos.org/HowTos/Network/SecuringSSH
    restorecon -Rv /home/git/.ssh
    
### 安装 gitlab-workhorse

    su - git
    cd /home/git/
    git clone https://gitlab.com/gitlab-org/gitlab-workhorse.git  
    logout
    
    cd /home/git/gitlab-workhorse  

编译安装

    sudo -u git -H make

如果出现错误

```
/bin/sh: go: 未找到命令
```

找一下 go 所在的位置

    which go
    
例如我是在 /usr/local/go/bin/go，因此建立软连接

    ln -s /usr/local/go/bin/go /usr/bin/go
    
然后重新编译安装一下

**Note:** If you want to use HTTPS, see [Using HTTPS](#using-https) for the additional steps.

### 初始化数据并且激活高级特性

    cd /home/git/gitlab/
    sudo -u git -H bundle exec rake gitlab:setup RAILS_ENV=production

Type **yes** to create the database.
When done you see **Administrator account created:**.

**Note:** You can set the Administrator password by supplying it in environmental variable `GITLAB_ROOT_PASSWORD`, eg.:

### Install Init Script

Download the init script (will be /etc/init.d/gitlab):

    sudo cp /home/git/gitlab/lib/support/init.d/gitlab /etc/init.d/gitlab
    chmod +x /etc/init.d/gitlab
    chkconfig --add gitlab

Make GitLab start on boot:

    chkconfig gitlab on

### Set up logrotate

    cp lib/support/logrotate/gitlab /etc/logrotate.d/gitlab

### Check Application Status

Check if GitLab and its environment are configured correctly:

    sudo -u git -H bundle exec rake gitlab:env:info RAILS_ENV=production

### Compile assets

    sudo -u git -H bundle exec rake assets:precompile RAILS_ENV=production

### Start your GitLab instance

    service gitlab start

## 7. Configure the web server

Use either Nginx or Apache, not both. Official installation guide recommends nginx.

### Nginx

You will need a new version of nginx otherwise you might encounter an issue like [this][issue-nginx].
To do so, follow the instructions provided by the [nginx wiki][nginx-centos] and then install nginx with:

    yum update
    yum -y install nginx
    chkconfig nginx on

使用SSl
    
    cp lib/support/nginx/gitlab-ssl /etc/nginx/conf.d/gitlab.conf
    
不使用SSL

    cp lib/support/nginx/gitlab /etc/nginx/conf.d/gitlab.conf

Edit `/etc/nginx/conf.d/gitlab.conf` and replace `git.example.com` with your FQDN. Make sure to read the comments in order to properly set up SSL.

    vi /etc/nginx/conf.d/gitlab.conf
    
去掉listen后面的default_server，修改为正确的端口号
去掉 listen [::]:
修改server_name 为本机的IP地址
    
修改`client_max_body_size 256m;` 否则当推送较多数据到 gitlab 上时，会由于数据过大，而出现错误
    fatal: The remote end hung up unexpectedly fatal: The remote end hung up unexpectedly error: RPC failed; result=22, HTTP code = 413
    
Add `nginx` user to `git` group:

    usermod -a -G git nginx
    chmod g+rx /home/git/
    
    //chmod -R g+rx /home/git/gitlab/
    
    # 修改权限
    //chmod o+x /home/git

将selinux关闭，否则会出现 nginx 访问错误 (13: Permission denied)，HTTP显示502

    setenforce 0 # 只是临时关闭，重启后问题仍然出现
    
Finally start nginx with:

    service nginx start
    
出现错误
nginx: [emerg] bind() to 0.0.0.0:8080 failed (13: Permission denied)

 [将selinux关闭就可以][1]
 
**注意：开启selinux情况下正常使用nginx，需要修改selinux的策略**
 
将selinux关闭就可以

查看SELinux状态：
1、/usr/sbin/sestatus -v      ##如果SELinux status参数为enabled即为开启状态

    SELinux status:                 enabled

2、getenforce                 ##也可以用这个命令检查

关闭SELinux：
1、临时关闭（不用重启机器）：

    setenforce 0    ##设置SELinux 成为permissive模式
    ##setenforce 1 设置SELinux 成为enforcing模式

2、修改配置文件需要重启机器：
修改/etc/selinux/config 文件

    vi /etc/selinux/config

将`SELINUX=enforcing` 改为 `SELINUX=disabled`,重启机器即可

    shutdown -r now
    service gitlab restart

#### Test Configuration

Validate your `gitlab` or `gitlab-ssl` Nginx config file with the following command:

    nginx -t

You should receive `syntax is okay` and `test is successful` messages. If you receive errors check your `gitlab` or `gitlab-ssl` Nginx config file for typos, etc. as indiciated in the error message given.

    //vi /home/git/gitlab-shell/config.yml
    //修改gitlab_url为nginx中配置的相应端口
    //gitlab_url: http://192.168.137.142:8083/
    
## 8. Configure the firewall

    systemctl stop firewalld
    systemctl mask firewalld

设置开放端口到服务器外访问，这里以8081为例子，需要替换为真实的端口

    /sbin/iptables -I INPUT -p tcp --dport 8081 -j ACCEPT 

Restart the service for the changes to take effect:

    service iptables restart

## Done!

### Double-check Application Status

To make sure you didn't miss anything run a more thorough check with:

    cd /home/git/gitlab
    sudo -u git -H bundle exec rake gitlab:check RAILS_ENV=production

如果都是绿色的，表示安装成功。

## Initial Login

默认的用户名是 root，一开始会要求重新设置密码

    root
    5iveL!fe

## 代码更新

**修改Github上的代码，然后更新到服务器上**

    cd /home/git/gitlab/
    
    git fetch origin
    git merge origin/7-5-zh

    # 重启 gitlab
    service gitlab restart

## Gitlab 备份

官网的备份说明

https://gitlab.com/gitlab-org/gitlab-ce/blob/master/doc/raketasks/backup_restore.md

### 查看备份设置

    vim /home/git/gitlab/config/gitlab.yml

检查Backup Settings设置项
默认情况下，备份文件是存放在/home/git/gitlab/tmp/backups/

### 执行备份

    sudo service gitlab stop # 先停止Gitlab，可以不暂停
    cd /home/git/gitlab/
    sudo -u git -H bundle exec rake gitlab:backup:create RAILS_ENV=production
    
执行完成后，会在/home/git/gitlab/tmp/backups/目录下创建一个备份俄文件，以时间戳_gitlab_backup命名如 1417040627_gitlab_backup.tar

### 重新启动
    
    sudo service gitlab start
    sudo service nginx restart
    
### 还原

需要给其他用户配置读写执行的权限

    chmod o+wrx /home/git/.ssh/authorized_keys.lock

否则会出现如下错误，是由于没有权限
/home/git/gitlab-shell/lib/gitlab_keys.rb:101:in `initialize': Permission denied @ rb_sysopen - /home/git/.ssh/authorized_keys.lock (Errno::EACCES)

需要使用 git 用户来执行，否则会没有权限操作 git 目录下的文件，`timestamp_of_backup`为时间戳如 1417040627

    sudo service gitlab stop
    cd /home/git/gitlab/ 
    sudo -u git -H bundle exec rake gitlab:backup:restore BACKUP=timestamp_of_backup RAILS_ENV=production

如果是从全新部署的 gitlab 还原，需要执行这一步

    sudo -u git -H bundle exec rake gitlab:satellites:create RAILS_ENV=production

重启 gitlab

    sudo service gitlab start
    sudo service nginx restart
    
    sudo -u git -H bundle exec rake gitlab:check RAILS_ENV=production

### 设置自动备份

    sudo service gitlab stop;
    cd /home/git/gitlab;
    sudo -u git -H editor config/gitlab.yml; 
    # Enable keep_time in the backup section to automatically delete old backups

keep_time参数默认是604800（单位是秒），因此会保留最近7天内的备份

    sudo -u git crontab -e # Edit the crontab for the git user

将如下内容添加到文件末尾

    # Create a full backup of the GitLab repositories and SQL database every day at 2am
    0 2 * * * cd /home/git/gitlab && PATH=/usr/local/bin:/usr/bin:/bin bundle exec rake gitlab:backup:create RAILS_ENV=production CRON=1

每天凌晨2点自动备份

The CRON=1 environment setting tells the backup script to suppress all progress output if there are no errors. This is recommended to reduce cron spam.

**重新启动**

    sudo service gitlab start;
    sudo service nginx restart;
    sudo -u git -H bundle exec rake gitlab:check RAILS_ENV=production;


## 忘记管理员密码


可以参考[这篇文章](https://www.nitrohsu.com/gitlab-reset-administrator-password.html "")

Gitlab 服务器上使用

```
# Gitlab 安装路径
cd /home/git/gitlab
# 进入Rails控制台
sudo -u git -H bundle exec rails console production
```

ominbus上使用

```
sudo gitlab-rails console
# 或者
sudo gitlab-rake rails console
```

进入控制台，如果知道需要修改用户的邮箱，使用如下，直接修改

```
user = User.find_by(email: 'admin@example.com')
user.password = 'secret_password'
user.password_confirmation = 'secret_password'
user.save
```

如果不知道具体邮箱，可以通过find来查找邮箱

```
user = User.find(1)
```


## 参考文档

- https://gitlab.com/gitlab-org/gitlab-recipes/tree/master/install/centos
- https://www.dwhd.org/20160406_094416.html

[https]: https://gitlab.com/gitlab-org/gitlab-ce/blob/master/doc/install/installation.md#using-https
[EPEL]: https://fedoraproject.org/wiki/EPEL
[PUIAS]: https://puias.math.ias.edu/wiki/YumRepositories6#Computational
[SDL]: https://puias.math.ias.edu
[PU]: http://www.princeton.edu/
[IAS]: http://www.ias.edu/
[keys]: https://fedoraproject.org/keys
[issue-nginx]: https://github.com/gitlabhq/gitlabhq/issues/5774
[nginx-centos]: http://wiki.nginx.org/Install#Official_Red_Hat.2FCentOS_packages
[psql-doc-auth]: http://www.postgresql.org/docs/9.3/static/auth-methods.html
[tips]: https://gitlab.com/gitlab-org/gitlab-ce/blob/master/doc/install/installation.md#advanced-setup-tips


  [1]: http://www.tlanyan.me/nginx-open-failed-permission-denied/




