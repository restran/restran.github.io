---
title: Python 使用 Postfix 发送邮件
layout: post
category : [Python]
tagline: 
tags : [Python, Email, Postfix]
---

最近在做一个监控程序，需要用邮件发送告警。以前是使用注册的免费邮来发送，但是这样不免有很多限制，而且有时还会当作恶意登录，帐号异常等，还不让登录邮箱了。利用[Postfix][1]提供邮件SMTP服务，可以很自由的发送邮件，任意定义发送者的邮箱地址。感觉都可以用来恶作剧，用别人的邮箱来发邮件呢。

**安装 Postfix**

如果是 Ubuntu，请使用

    sudo apt-get install postfix

如果是 Centos，请使用
    
    yum install postfix
    
接下来需要进行一些配置

![选择Internet Site][2]
这里选择Internet Site

![设置FQDN][3]
然后让设置FQDN，但是使用默认的机器名即可，这里不是很确定。


**使用Python发送邮件**

使用[这里][4]给出的完美例子

```python
#! /usr/bin/env python
# -*- coding: utf-8 -*-

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email.mime.text import MIMEText
from email.utils import COMMASPACE, formatdate
from email import Encoders
import os

def send_mail(mail_to, mail_from, subject, text, files, server="localhost"):
    assert type(mail_to) == list
    assert type(files) == list

    msg = MIMEMultipart()
    msg['From'] = mail_from
    msg['To'] = COMMASPACE.join(mail_to)
    msg['Date'] = formatdate(localtime=True)
    msg['Subject'] = subject

    # 如果 text 是html，则需要设置 _subtype='html'
    # 默认情况下 _subtype='plain'，即纯文本
    # msg.attach(MIMEText(text, _subtype='html', _charset='utf-8'))
    msg.attach(MIMEText(text, _charset='utf-8'))

    for f in files:
        part = MIMEBase('application', "octet-stream")
        part.set_payload(open(f, "rb").read())
        Encoders.encode_base64(part)
        part.add_header('Content-Disposition', 'attachment; filename="%s"'
                        % os.path.basename(f))
        msg.attach(part)

    smtp = smtplib.SMTP(server)
    smtp.sendmail(mail_from, mail_to, msg.as_string())
    smtp.close()


if __name__ == '__main__':
    # Example:
    # 这里可以任意定制发送者的邮箱地址
    send_mail(['your_name <your_name@gmail.com>'], 'MonitorBase <notify@monitor.base>', 'Hello Python!', 'Say hello to Python! :)', [])
```


**最后把使用SMTP登录邮箱发送邮件的方法也附上**

```python
#! /usr/bin/env python
# -*- coding: utf-8 -*-

import smtplib
import time, traceback, sys, os
from email.mime.text import MIMEText

def send_mail(mail_from, password, mail_to, subject, content):

    handle = smtplib.SMTP('smtp.163.com', 25)
    handle.login(mail_from, password)
    time_str = time.strftime('%Y-%m-%d %X', time.localtime(time.time()))
    msg = '<html><body>' + content + "<br><br><span style='color:#999;font-size:"\
                        + "10px;font-family:Verdana;'>" \
                        + time_str + " by " + mail_from + "</span>"+'</body></html>'
    send_msg = MIMEText(msg, 'html', 'utf-8')
    send_msg['Subject'] = subject
    handle.sendmail(mail_from, mail_to, send_msg.as_string())
    handle.close()

if __name__ == '__main__':
    send_mail('your_name@163.com', 'your_password', 'Hello Python!', 'Say hello to Python! :)')
```

  [1]: http://www.postfix.org/
  [2]: http://oxygen.qiniudn.com/img2014103024.png
  [3]: http://oxygen.qiniudn.com/img2014103025.png
  [4]: http://www.masnun.com/2010/01/01/sending-mail-via-postfix-a-perfect-python-example.html