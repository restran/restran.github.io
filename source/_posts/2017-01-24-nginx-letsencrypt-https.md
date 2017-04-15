---
title: Nginx 使用 Let's Encrypt 配置 HTTPS 和 HTTP2
layout: post
category : [技术]
tagline: 
tags : [Web]
---

HTTPS 目前已经逐渐成为标配，利用 [Lets Encrypt](https://letsencrypt.org/) 可以免费实现网站的 HTTPS，保证传输安全，以下环境使用 CentOS 7。

## letsencrypt 安装和配置

### 安装 letsencrypt

```
yum update
yum install letsencrypt
```

### 创建 Nginx 配置文件

```
server {
    listen 80;
    server_name www.example.com;
    root /var/www/html;
    location ~ /.well-known/acme-challenge {
        allow all;
    }
}
```

如果不存在 /var/www/html 文件夹则创建

	mkdir -p /var/www/html

重启 Nginx

    service nginx restart

### 验证域名所有权并申请证书

```
sudo letsencrypt certonly -a webroot --webroot-path=/var/www/html -d www.example.com
```

会自动创建一个文件，同时访问当前服务器的80端口，来验证域名的所有权

```
http://www.example.com/.well-known/acme-challenge/p1jaEziikiiKer311uQ9fh03_pJmiPSCG0vYahUtWVA
```

可以让多个域名使用相同的证书

```
sudo letsencrypt certonly -a webroot --webroot-path=/var/www/html -d www.example.com -d example.com
```

目前不支持通配符域名，*.sub.domain.com

### 生成强 Diffie-Hellman 组

To further increase security, you should also generate a strong Diffie-Hellman group. To generate a 2048-bit group, use this command:

```
sudo openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048
```

这一步需要花一些时间，完成后有一个强 DH 组在 /etc/ssl/certs/dhparam.pem


配置 nginx 代码段，来指向 SSL Key and Certificate

    sudo vim /etc/nginx/snippets/ssl-www.example.com.conf

文件内容

```
ssl_certificate /etc/letsencrypt/live/www.example.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/www.example.com/privkey.pem;
```

创建 Nginx 强加密配置的代码段

    sudo vim /etc/nginx/snippets/ssl-params.conf

文件内容

```
# from https://cipherli.st/
# and https://raymii.org/s/tutorials/Strong_SSL_Security_On_nginx.html
ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
ssl_prefer_server_ciphers on;
ssl_ciphers "EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH";
ssl_ecdh_curve secp384r1;
ssl_session_cache shared:SSL:10m;
ssl_session_tickets off;
ssl_stapling on;
ssl_stapling_verify on;
resolver 8.8.8.8 8.8.4.4 valid=300s;
resolver_timeout 5s;
# Disable preloading HSTS for now.  You can use the commented out header line that includes
# the "preload" directive if you understand the implications.
# add_header Strict-Transport-Security "max-age=63072000; includeSubdomains; preload";
add_header Strict-Transport-Security "max-age=63072000; includeSubdomains";
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
ssl_dhparam /etc/ssl/certs/dhparam.pem;
```

配置 Nginx 支持 HTTPS

```
server {
    listen 443 ssl http2 default_server;
    server_name www.example.com;
    root /var/www/html;
    include snippets/ssl-www.example.com.conf;
    include snippets/ssl-params.conf;
}
```

这里配置了 http2，要求 Nginx 版本要大于 1.9.5。[HTTP2](http://www.infoq.com/cn/news/2015/02/https-spdy-http2-comparison) 具有更快的 HTTPS 传输性能，非常值得开启。开启 HTTP2 的前提是要先开启 HTTPS.

重启 Nginx

    service nginx restart

证书有效期是3个月，三个月后需要刷新证书。由于执行更新操作的时候，只有当过期时间小于30天时，才会真的更新。因此一个实际的方式是每星期或者每天执行一次更新操作。

执行这个命令就会刷新

    sudo letsencrypt renew

添加 Ctrontab 任务

    sudo crontab -e
    
在 crontab 文件中添加以下任务

```
30 2 * * 1 /usr/bin/letsencrypt renew >> /var/log/le-renew.log
35 2 * * 1 /bin/systemctl reload nginx
```

每星期1的2点30分执行更新操作，2点35分执行Nginx 重启（这样新的证书就会启用），然后输出日志到 /var/log/le-renew.log

## 在其他服务器上验证域名所有权

也可以在另外一台服务器上执行 letsencrypt，来验证域名的所有权，这时用手动模式

    letsencrypt certonly --manual -d www.example.com

会要求去运行命令的服务器上创建一个验证文件，让 letsencrypt 去访问80端口来验证。验证文件还是放在 .well-known 目录下，具体根据提示。

如果需要部署HTTPS的服务器80端口被占用，或者防火墙那边不开放80端口，只能是采用这种手动的方式，先将域名指定到一台有80端口的服务器上，验证通过后，再将域名指定回来真正的服务器上面。

## 手动模式获取的证书，如何刷新证书

但是通过手动模式获取的 letsencrypt 证书是无法通过执行 /usr/bin/letsencrypt renew 来刷新，会出现如下问题

```
Could not choose appropriate plugin: The manual plugin is not working; there may be problems with your existing configuration.
The error was: PluginError('Running manual mode non-interactively is not supported',)
Attempting to renew cert from /etc/letsencrypt/renewal/example.com.conf produced an unexpected error: The manual plugin is not working; there may be problems with your existing configuration.
The error was: PluginError('Running manual mode non-interactively is not supported',). Skipping.
```

因为 letsencrypt 的 manual 插件不支持非交互形式，因此通过 manual 插件获取的证书，需要再次执行此前获取该证书时输入的命令，也就是

    letsencrypt certonly --manual -d www.example.com

这样的话，就没办法将这条命令放到 crontab 中去自动运行了。如果是在其他服务器上执行的，那么又得重新配置一次域名的IP。

## 安装最新的 openssl

如果 openssl 版本小于1.0.2，是无法启用 http2 的，查看 openssl 版本

    openssl version

openssl 在[大于1.1.0版本](https://www.openssl.org/news/changelog.html#x2)已经支持了对移动端更友好的 Google 的 [ChaCha20](https://blog.wilddog.com/?p=749) 加密方式（针对ARM的手机端进行优化，使其更快更省电），因此尽可能选择最新的版本。

编译安装

```
cd /usr/src
wget https://www.openssl.org/source/openssl-1.1.0e.tar.gz
tar -zxf openssl-1.1.0e.tar.gz
cd openssl-1.1.0e
./config
make
make test
make install

# 备份旧的openssl
mv /usr/bin/openssl /root/
ln -s /usr/local/ssl/bin/openssl /usr/bin/openssl
```

解决错误 ./openssl: error while loading shared libraries: libssl.so.1.1: cannot open shared object file: No such file or directory

```
ln -s /usr/local/lib64/libssl.so.1.1 /usr/lib64/libssl.so.1.1
ln -s /usr/local/lib64/libcrypto.so.1.1 /usr/lib64/libcrypto.so.1.1
```

创建新版本的符号链接

```
# 删除旧的符号链接
rm /bin/openssl
# 添加新的
ln -s /usr/local/bin/openssl /bin/openssl
```

查看 openssl 版本

    openssl version

重启一下 Nginx 就可以支持了，可以在 Chrome 中，网络那边，查看协议是否为 h2

查看 Nginx 版本信息

    nginx -V

如果看到是 openssl 1.01 的版本编译的，还需要重新编译 Nginx

## 平滑升级 Nginx 到最新的稳定版

下载 Nginx 最新稳定版

    cd /root
    wget http://nginx.org/download/nginx-1.10.3.tar.gz
    
解压源码

    tar zxvf nginx-1.10.3.tar.gz
    
进入源码目录

    cd nginx-1.10.3

使用 cloudflare 的 TLS nginx__dynamic_tls_records 补丁来优化 [TLS Record Size](http://fangpeishi.com/optimizing-tls-record-size.html)
    
下载

    wget https://raw.githubusercontent.com/cloudflare/sslconfig/master/patches/nginx__dynamic_tls_records.patch

打补丁

    patch -p1 < nginx__dynamic_tls_records.patch

如果提示 patch 命令找不到的话，则先安装 patch 

    yum install patch

加上所需参数开始编译

```
./configure \
--with-openssl=/usr/src/openssl-1.1.0e \
--prefix=/etc/nginx \
--sbin-path=/usr/sbin/nginx \
--modules-path=/usr/lib64/nginx/modules \
--conf-path=/etc/nginx/nginx.conf \
--error-log-path=/var/log/nginx/error.log \
--http-log-path=/var/log/nginx/access.log \
--pid-path=/var/run/nginx.pid \
--lock-path=/var/run/nginx.lock \
--http-client-body-temp-path=/var/cache/nginx/client_temp \
--http-proxy-temp-path=/var/cache/nginx/proxy_temp \
--http-fastcgi-temp-path=/var/cache/nginx/fastcgi_temp \
--http-uwsgi-temp-path=/var/cache/nginx/uwsgi_temp \
--http-scgi-temp-path=/var/cache/nginx/scgi_temp \
--user=nginx \
--group=nginx \
--with-file-aio \
--with-threads \
--with-ipv6 \
--with-http_addition_module \
--with-http_auth_request_module \
--with-http_dav_module \
--with-http_flv_module \
--with-http_gunzip_module \
--with-http_gzip_static_module \
--with-http_mp4_module \
--with-http_random_index_module \
--with-http_realip_module \
--with-http_secure_link_module \
--with-http_slice_module \
--with-http_ssl_module \
--with-http_stub_status_module \
--with-http_sub_module \
--with-http_v2_module \
--with-mail \
--with-mail_ssl_module \
--with-stream \
--with-stream_ssl_module \
--with-cc-opt='-O2 -g -pipe -Wall -Wp,-D_FORTIFY_SOURCE=2 -fexceptions -fstack-protector-strong --param=ssp-buffer-size=4 -grecord-gcc-switches -m64 -mtune=generic'
```

编译安装

```
# 执行 make 编译，但是不要执行 make install
make
# 重命名nginx旧版本二进制文件，即sbin目录下的nginx（期间nginx并不会停止服务）
mv /sbin/nginx /sbin/nginx.old
# 然后拷贝一份新编译的二进制文件
cp objs/nginx /sbin/
# 在源码目录执行make upgrade开始升级
make upgrade
```

升级后 Nginx 会自动重启，这时在 Chrome 中查看，验证是否支持 H2，具体在开发者工具，网络中选择显示协议。

## 参考资料

- https://blog.fazero.me/2017/01/06/upgrate-nginx-and-use-http2/
- https://blog.kuoruan.com/107.html
- https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-16-04

