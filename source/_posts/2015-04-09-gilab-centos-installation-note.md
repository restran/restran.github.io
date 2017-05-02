---
title: CentOS 6.5 环境下 Gitlab 7.5 安装和维护笔记
layout: post
category : [Git]
tagline: 
keywords: [gitlab, git, 源码安装, centos, 社区版, 部署, 维护, 指南]
tags : [Gitlab, Git]
---

在 CentOS 6.5 Minimal 系统环境下，用源代码的方式安装 Gitlab 7.5 的过程中，遇到了不少问题，现把笔记整理出来。

    Distribution      : CentOS 6.5 Minimal
    GitLab version    : 7.0 - 7.4
    Web Server        : Apache, Nginx
    Init system       : sysvinit
    Database          : MySQL, PostgreSQL
    Contributors      : @nielsbasjes, @axilleas, @mairin, @ponsjuh, @yorn, @psftw, @etcet, @mdirkse, @nszceta, @herkalurk
    Additional Notes  : In order to get a proper Ruby setup we build it from source


## Overview

Please read [requirements.md](https://gitlab.com/gitlab-org/gitlab-ce/blob/master/doc/install/requirements.md) for hardware and platform requirements.

### Important Notes

The following steps have been known to work and should be followed from up to bottom.
If you deviate from this guide, do it with caution and make sure you don't violate
any assumptions GitLab makes about its environment. We have also tried this on
RHEL 6.3 and found that there are subtle differences which are documented in part.
Look for the **RHEL Notes** note.

**全部命令都是在 root 用户下执行**

#### If you find a bug

If you find a bug/error in this guide please submit an issue or a Merge Request
following the contribution guide (see [CONTRIBUTING.md](https://gitlab.com/gitlab-org/gitlab-recipes/blob/master/CONTRIBUTING.md)).

#### Security

Many setup guides of Linux software simply state: "disable selinux and firewall".
This guide does not disable any of them, we simply configure them as they were intended.
[Stop disabling SELinux](http://stopdisablingselinux.com/).

- - -

The GitLab installation consists of setting up the following components:

1. Install the base operating system (CentOS 6.5 Minimal) and Packages / Dependencies
2. Ruby
3. System Users
4. Database
5. Redis
6. GitLab
7. Web server
8. Firewall

----------

## 1. Installing the operating system (CentOS 6.5 Minimal)

We start with a completely clean CentOS 6.5 "minimal" installation which can be
accomplished by downloading the appropriate installation iso file. Just boot the
system of the iso file and install the system.

**配置网络**

Note that during the installation you use the *"Configure Network"* option (it's a
button in the same screen where you specify the hostname) to enable the *"Connect automatically"*
option for the network interface and hand (usually eth0).

**If you forget this option the network will NOT start at boot.**

The end result is a bare minimum CentOS installation that effectively only has
network connectivity and (almost) no services at all.

## Updating and adding basic software and services

### Add EPEL repository

**安装 wget**

    yum -y install wget


[EPEL][] is a volunteer-based community effort from the Fedora project to create
a repository of high-quality add-on packages that complement the Fedora-based
Red Hat Enterprise Linux (RHEL) and its compatible spinoffs, such as CentOS and Scientific Linux.

As part of the Fedora packaging community, EPEL packages are 100% free/libre open source software (FLOSS).

Download the GPG key for EPEL repository from [fedoraproject][keys] and install it on your system:

    wget -O /etc/pki/rpm-gpg/RPM-GPG-KEY-EPEL-6 https://www.fedoraproject.org/static/0608B895.txt --no-check-certificate
    rpm --import /etc/pki/rpm-gpg/RPM-GPG-KEY-EPEL-6

Verify that the key got installed successfully:

    rpm -qa gpg*
    结果应显示
    gpg-pubkey-0608b895-4bd22942

Now install the `epel-release-6-8.noarch` package, which will enable EPEL repository on your system:

    rpm -Uvh http://dl.fedoraproject.org/pub/epel/6/x86_64/epel-release-6-8.noarch.rpm

**Note:** Don't mind the `x86_64`, if you install on a i686 system you can use the same commands.

### Add PUIAS Computational repository

The [PUIAS Computational][PUIAS] repository is a part of [PUIAS/Springdale Linux][SDL],
a custom Red Hat&reg; distribution maintained by [Princeton University][PU] and the
[Institute for Advanced Study][IAS].  We take advantage of the PUIAS
Computational repository to obtain a git v1.8.x package since the base CentOS
repositories only provide v1.7.1 which is not compatible with GitLab.
Although the PUIAS offers an RPM to install the repo, it requires the
other PUIAS repos as a dependency, so you'll have to add it manually.
Otherwise you can install git from source (instructions below).

Download PUIAS repo:

    wget -O /etc/yum.repos.d/PUIAS_6_computational.repo https://gitlab.com/gitlab-org/gitlab-recipes/raw/master/install/centos/PUIAS_6_computational.repo --no-check-certificate

Next download and install the gpg key:

    wget -O /etc/pki/rpm-gpg/RPM-GPG-KEY-puias http://springdale.math.ias.edu/data/puias/6/x86_64/os/RPM-GPG-KEY-puias
    rpm --import /etc/pki/rpm-gpg/RPM-GPG-KEY-puias

Verify that the key got installed successfully:

    rpm -qa gpg*
    结果应显示
    gpg-pubkey-41a40948-4ce19266

Verify that the EPEL and PUIAS Computational repositories are enabled as shown below:

    yum repolist
    
如果出现错误 Error: Cannot retrieve metalink for repository: epel. Please verify its path and try again

    vim /etc/yum.repos.d/epel.repo，把基础的恢复，镜像的地址注释掉

    #baseurl
    mirrorlist
    
改成

    baseurl
    #mirrorlist

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

### Install the required tools for GitLab

    yum -y update
    yum -y groupinstall 'Development Tools'
    yum -y install readline readline-devel ncurses-devel gdbm-devel glibc-devel tcl-devel openssl-devel curl-devel expat-devel db4-devel byacc sqlite-devel libyaml libyaml-devel libffi libffi-devel libxml2 libxml2-devel libxslt libxslt-devel libicu libicu-devel system-config-firewall-tui redis sudo wget crontabs logwatch logrotate perl-Time-HiRes git cmake libcom_err-devel.i686 libcom_err-devel.x86_64

**RHEL Notes**

If some packages (eg. gdbm-devel, libffi-devel and libicu-devel) are NOT installed,
add the rhel6 optional packages repo to your server to get those packages:

    yum-config-manager --enable rhel-6-server-optional-rpms
    


Tip taken from [here](https://github.com/gitlabhq/gitlab-recipes/issues/62).

**Note:**
During this installation some files will need to be edited manually.
If you are familiar with vim set it as default editor with the commands below.
If you are not familiar with vim please skip this and keep using the default editor.

    # Install vim and set as default editor
    yum -y install vim-enhanced
    update-alternatives --set editor /usr/bin/vim.basic

    # For reStructuredText markup language support, install required package:
    yum -y install python-docutils

### Install mail server

In order to receive mail notifications, make sure to install a
mail server. The recommended one is postfix and you can install it with:

    yum -y install postfix

To use and configure sendmail instead of postfix see [Advanced Email Configurations](e-mail/configure_email.md).

### Configure the default editor

You can choose between editors such as nano, vi, vim, etc.
In this case we will use vim as the default editor for consistency.

    ln -s /usr/bin/vim /usr/bin/editor

To remove this alias in the future:
以后删除别名的时候用这条命令
    
    rm -i /usr/bin/editor


### Install Git from Source (optional)

Make sure Git is version 1.7.10 or higher, for example 1.7.12 or 1.8.4

    git --version
    
如果有安装git，这一步就可以跳过，直接跳到Ruby

If not, install it from source. First remove the system Git:

    yum -y remove git

Install the pre-requisite files for Git compilation:

    yum install zlib-devel perl-CPAN gettext curl-devel expat-devel gettext-devel openssl-devel

Download and extract it:

    mkdir /tmp/git && cd /tmp/git
    curl --progress https://www.kernel.org/pub/software/scm/git/git-2.1.3.tar.gz | tar xz
    cd git-2.1.3/
    ./configure
    make
    make prefix=/usr/local install

Make sure Git is in your `$PATH`:

    which git

You might have to logout and login again for the `$PATH` to take effect.
**Note:** When editing `config/gitlab.yml` (step 6), change the git `bin_path` to `/usr/local/bin/git`.

----------

## 2. Ruby

The use of ruby version managers such as [RVM](http://rvm.io/), [rbenv](https://github.com/sstephenson/rbenv) or [chruby](https://github.com/postmodern/chruby) with GitLab in production frequently leads to hard to diagnose problems. Version managers are not supported and we strongly advise everyone to follow the instructions below to use a system ruby.

Remove the old Ruby 1.8 package if present. GitLab only supports the Ruby 2.0+ release series:

    yum remove ruby

Remove any other Ruby build if it is still present:

    cd <your-ruby-source-path>
    make uninstall
    
如果没有安装ruby，上述删除的步骤可以跳过

Download Ruby and compile it:

    mkdir /tmp/ruby && cd /tmp/ruby
    curl --progress ftp://ftp.ruby-lang.org/pub/ruby/2.1/ruby-2.1.2.tar.gz | tar xz
    
    cd ruby-2.1.2
    ./configure --disable-install-rdoc
    
如果出现错误
    make: Warning: File 'common.mk' has modification time 1386501635 s in the future
    是由于系统的时间错误导致
    
一、修正时区

    rm -rf /etc/localtime    # 删除当前默认时区www.kwx.gd
    ln -s /usr/share/zoneinfo/Asia/Shanghai /etc/localtime 
    # 复制替换默认时区为上海
    SSH执行以上命令，将时区修改为中国上海的时区，当然，也可以设置中国香港或北京的时间。
    
 二、手动修正时间
 
    date -s '09:16:00 2013-01-21' 
    
使用“date”命令，修改时间和日期为2013年1月21日，时间是上午9点16分0秒。
    
三、时间自动同步和校正

    yum install -y ntp        #安装时间同步服务（组件）
    ntpdate us.pool.ntp.org   #设置同步服务器
    date                      #查看当前时间www.kwx.gd
    
部分系统已经安装了NTP服务，系统会根据当前记录的时区（第一步操作）自动连接ntp服务器校正时间。
    
    
    make
    make prefix=/usr/local install

Install the Bundler Gem:

由于AWS被墙无法使用，修改ruby的源

    gem sources --remove https://rubygems.org/
    gem sources -a https://ruby.taobao.org/
    gem sources -l

    gem install bundler --no-doc

Logout and login again for the `$PATH` to take effect. Check that ruby is properly
installed with:

    which ruby
    # /usr/local/bin/ruby
    ruby -v
    # ruby 2.1.2p95 (2014-05-08 revision 45877) [x86_64-linux]

----------

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

Install `mysql` and enable the `mysqld` service to start on boot:
    
    使用这条命令默认安装的是5.1.37版本
    yum install -y mysql-server mysql-devel
    
    使用这些命令安装5.5.41版本
    rpm -Uvh http://dl.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm
    rpm -Uvh http://rpms.famillecollet.com/enterprise/remi-release-6.rpm
    yum --enablerepo=remi,remi-test install mysql mysql-server mysql-devel
    

    chkconfig mysqld on
    service mysqld start

Ensure you have MySQL version 5.5.14 or later:

    mysql --version

Secure your installation:

    mysql_secure_installation

Login to MySQL (type the database root password):

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

Quit the database session:

    \q
    
    
配置MySQL max_allowed_packet的大小，避免POST太大的内容导致出现500错误，例如GitLab 发出MergeRequest的时候返回500错误。

    vim /etc/my.cnf

在mysqld中添加max_allowed_packet，调整值，加大为一个合适的数字即可。

    [mysqld]
    max_allowed_packet=512M

然后reload下mysql的服务即可。

    service mysqld restart

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

   // vi /home/git/.bash_profile
   // 添加如下，不验证SSL
   // export GIT_SSL_NO_VERIFY=1
    
    否则 git clone 时会出现错误 Peer certificate cannot be authenticated with known CA certificates
    
    # Clone GitLab repository
    sudo -u git -H git clone https://gitlab.com/gitlab-org/gitlab-ce.git -b 7-4-stable gitlab

**Gitlab 中文翻译版**

不知道为什么，使用sudo -u git -H git clone..还会出现证书错误，但是使用下面的就可以
    su - git
    先进入git用户，然后git config，才可以，不然还是会出现证书问题
    git config --global http.sslverify "false"
    
    git clone https://gitlab.com/larryli/gitlab.git -b 7-5-zh gitlab
    
    # 自己的修改版，修改部分翻译
    git clone https://github.com/restran/gitlabhq.git -b 7-5-zh gitlab
    
    退出git用户操作命令，使用root用户操作
    logout
    
**Note:** You can change `7-4-stable` to `master` if you want the *bleeding edge* version, but do so with caution!

### Configure it

    # Go to GitLab installation folder
    cd /home/git/gitlab
    
为了方便添加git用户拥有root权限 [sudoers文件默认没有写权限需要强制保存:wq!]
使用root用户执行下述命令
    
    vi /etc/sudoers
    
最后添加
    
    git     ALL=(ALL)       ALL

Copy the example GitLab config

    sudo -u git -H cp config/gitlab.yml.example config/gitlab.yml

Update GitLab config file, follow the directions at top of file

    sudo -u git -H editor config/gitlab.yml
    
配置 

```
host: 192.168.137.142
port: 8008
email_from: gitlab@example.com
email_enabled: false
default_theme: 1
```

Make sure GitLab can write to the log/ and tmp/ directories

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

    chmod -R u+rwX  /home/git/gitlab/public/uploads

Copy the example Unicorn config

    sudo -u git -H cp config/unicorn.rb.example config/unicorn.rb

查看CPU的核心数量

    nproc

    # Enable cluster mode if you expect to have a high load instance
    # Ex. change amount of workers to 3 for 2GB RAM server
    # Set the number of workers to at least the number of cores
    sudo -u git -H editor config/unicorn.rb
    
**特别注意：比较差配置的机器，注意将unicorn.rb中的timeout设置大一点，因为第一次启动的时候Gitlab需要初始化，如果timeout太小，由于需要执行较长时间，导致无法正常启动，出现502错误**

    # Copy the example Rack attack config
    sudo -u git -H cp config/initializers/rack_attack.rb.example config/initializers/rack_attack.rb

Configure Git global settings for git user, useful when editing via web. Edit user.email according to what is set in gitlab.yml

    sudo -u git -H git config --global user.name "GitLab"
    sudo -u git -H git config --global user.email "gitlab@example.com"
    sudo -u git -H git config --global core.autocrlf input

Configure Redis connection settings

    sudo -u git -H cp config/resque.yml.example config/resque.yml

如果不使用默认的端口，则需要配置，Change the Redis socket path if you are not using the default CentOS configuration

    sudo -u git -H editor config/resque.yml
    
**Important Note:** Make sure to edit both `gitlab.yml` and `unicorn.rb` to match your setup.

**Note:** If you want to use HTTPS, see [Using HTTPS][https] for the additional steps.

### Configure GitLab DB settings

    # MySQL only:
    sudo -u git cp config/database.yml.mysql config/database.yml

    # MySQL and remote PostgreSQL only:
    # Update username/password in config/database.yml.
    # You only need to adapt the production settings (first part).
    # If you followed the database guide then please do as follows:
    # Change 'secure password' with the value you have given to $password
    # You can keep the double quotes around the password
    sudo -u git -H editor config/database.yml
    修改为正确的用户名和密码
    分别修改git用户和root用户

    # PostgreSQL and MySQL:
    # Make config/database.yml readable to git only
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

    # Run the installation task for gitlab-shell (replace `REDIS_URL` if needed):
    sudo -u git -H bundle exec rake gitlab:shell:install[v2.2.0] REDIS_URL=unix:/var/run/redis/redis.sock RAILS_ENV=production
    
执行上述命令如果有SSL证书问题，改用下述命令

    su - git
    cd /home/git/gitlab
    bundle exec rake gitlab:shell:install[v2.2.0] REDIS_URL=unix:/var/run/redis/redis.sock RAILS_ENV=production
    
    logout

By default, the gitlab-shell config is generated from your main GitLab config. You can review (and modify) the gitlab-shell config as follows:

    sudo -u git -H editor /home/git/gitlab-shell/config.yml

Ensure the correct SELinux contexts are set. Read http://wiki.centos.org/HowTos/Network/SecuringSSH

    restorecon -Rv /home/git/.ssh
    

**Note:** If you want to use HTTPS, see [Using HTTPS](#using-https) for the additional steps.

### Initialize Database and Activate Advanced Features

初始化数据库

    cd /home/git/gitlab/
    sudo -u git -H bundle exec rake gitlab:setup RAILS_ENV=production

Type **yes** to create the database.
When done you see **Administrator account created:**.

**Note:** You can set the Administrator password by supplying it in environmental variable `GITLAB_ROOT_PASSWORD`, eg.:

如果要修改gitlab管理员的密码，则执行这一句，否则执行上一句

    sudo -u git -H bundle exec rake gitlab:setup RAILS_ENV=production GITLAB_ROOT_PASSWORD=newpassword

### Install Init Script

Download the init script (will be /etc/init.d/gitlab):

    sudo cp /home/git/gitlab/lib/support/init.d/gitlab /etc/init.d/gitlab

    # wget -O /etc/init.d/gitlab https://gitlab.com/gitlab-org/gitlab-recipes/raw/master/init/sysvinit/centos/gitlab-unicorn --no-check-certificate
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
    # wget -O /etc/nginx/conf.d/gitlab.conf https://gitlab.com/gitlab-org/gitlab-ce/raw/master/lib/support/nginx/gitlab-ssl --no-check-certificate
    
不使用SSL

    cp lib/support/nginx/gitlab /etc/nginx/conf.d/gitlab.conf
    
    # wget -O /etc/nginx/conf.d/gitlab.conf https://gitlab.com/gitlab-org/gitlab-ce/raw/master/lib/support/nginx/gitlab --no-check-certificate
最后加上--no-check-certificate不检查证书

Edit `/etc/nginx/conf.d/gitlab.conf` and replace `git.example.com` with your FQDN. Make sure to read the comments in order to properly set up SSL.

    vi /etc/nginx/conf.d/gitlab.conf
    去掉listen后面的default_server，修改为正确的端口号
    去掉 listen [::]:
    修改server_name 为本机的IP地址
    
    修改client_max_body_size 256m;
    否则当推送较多数据到 gitlab 上时，会由于数据过大，而出现错误
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

Poke an iptables hole so users can access the web server (http and https ports) and ssh.

    lokkit -s http -s https -s ssh
    
添加防火墙允许的端口

    vi /etc/sysconfig/iptables
    
添加，端口为nginx中为gitlab设置的端口

    -A INPUT -m state --state NEW -m tcp -p tcp --dport 8083 -j ACCEPT

Restart the service for the changes to take effect:

    service iptables restart

## Done!

### Double-check Application Status

To make sure you didn't miss anything run a more thorough check with:

    cd /home/git/gitlab
    sudo -u git -H bundle exec rake gitlab:check RAILS_ENV=production

Now, the output will complain that your init script is not up-to-date as follows:

    Init script up-to-date? ... no
      Try fixing it:
      Redownload the init script
      For more information see:
      doc/install/installation.md in section "Install Init Script"
      Please fix the error above and rerun the checks.

Do not mind about that error if you are sure that you have downloaded the up-to-date file from https://gitlab.com/gitlab-org/gitlab-recipes/raw/master/init/sysvinit/centos/gitlab-unicorn and saved it to `/etc/init.d/gitlab`.

    wget https://gitlab.com/gitlab-org/gitlab-recipes/raw/master/init/sysvinit/centos/gitlab-unicorn
    mv gitlab-unicorn gitlab
    cp -f gitlab /etc/init.d/gitlab
    rm gitlab

复制完后，要删除/etc/init.d/gitlab.swap文件

If all other items are green, then congratulations on successfully installing GitLab!

**NOTE:** Supply `SANITIZE=true` environment variable to `gitlab:check` to omit project names from the output of the check command.


升级Gitlab Shell，安装的时候版本是2.1.0，需要升级到2.2.0才可以使用，否则会出现502错误

Upgrade GitLab Shell
GitLab Shell might be outdated, running the commands below ensures you're using a compatible version:

    su - git
    cd /home/git/gitlab-shell
    git fetch
    git checkout v`cat /home/git/gitlab/GITLAB_SHELL_VERSION`

One line upgrade command
You've read through the entire guide and probably already did all the steps one by one.

Here is a one line command with step 1 to 5 for the next time you upgrade:

    cd /home/git/gitlab; \
    sudo -u git -H bundle exec rake gitlab:backup:create RAILS_ENV=production; \
    sudo service gitlab stop; \
    if [ -f bin/upgrade.rb ]; then sudo -u git -H ruby bin/upgrade.rb -y; else sudo -u git -H ruby script/upgrade.rb -y; fi; \
    cd /home/git/gitlab-shell; \
    sudo -u git -H git fetch; \
    sudo -u git -H git checkout v`cat /home/git/gitlab/GITLAB_SHELL_VERSION`; \
    cd /home/git/gitlab; \
    exit; \
    sudo service gitlab start; \
    sudo service nginx restart; sudo -u git -H bundle exec rake gitlab:check RAILS_ENV=production
  
  
  
## Initial Login

Visit YOUR_SERVER in your web browser for your first GitLab login.
The setup has created an admin account for you. You can use it to log in:

    root
    5iveL!fe

**Important Note:**
Please go over to your profile page and immediately change the password, so
nobody can access your GitLab by using this login information later on.

**Enjoy!**

You can also check some [Advanced Setup Tips][tips].

## Links used in this guide

- [EPEL information](http://www.thegeekstuff.com/2012/06/enable-epel-repository/)
- [SELinux booleans](http://wiki.centos.org/TipsAndTricks/SelinuxBooleans)


## 代码更新

**修改Github上的代码，然后更新到服务器上**

    cd /home/git/gitlab/
    
    git fetch origin
    git merge origin/7-5-zh

    重启 gitlab
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
    sudo service gitlab start
    sudo service nginx restart
    sudo -u git -H bundle exec rake gitlab:check RAILS_ENV=production

### 设置自动备份

    sudo service gitlab stop;
    cd /home/git/gitlab;
    sudo -u git -H editor config/gitlab.yml; # Enable keep_time in the backup section to automatically delete old backups

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




