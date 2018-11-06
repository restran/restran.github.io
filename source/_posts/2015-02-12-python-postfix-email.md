---
title: Python 使用 Postfix 发送邮件
layout: post
category : [Python]
tagline: 
keywords: [python, email, posifx, 发邮件, 代码, 教程]
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

```py
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

最后把使用SMTP登录邮箱发送邮件的方法也附上

```py
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

如果要发送附件

```py
# -*- coding: utf-8 -*-
# created by restran on 2016/07/02
from __future__ import unicode_literals, absolute_import, print_function

import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import COMMASPACE, formatdate
from future.utils import PY2, PY3

class EmailHandler(object):
    def __init__(self, mail_from, password, smtp_server, smtp_port=25):
        """
        :param mail_from: 发件人
        :param password: 发件人密码
        :param smtp_server: SMTP服务器地址
        :param smtp_port: SMTP服务器端口，SSL 方式是 465
        :return:
        """
        
        self.mail_from = mail_from
        self.password = password
        self.smtp_server = smtp_server
        self.smtp_port = smtp_port

    def send_mail_ssl(self, mail_to_list, subject, content, file_name_list):
        self.do_send_mail(True, mail_to_list, subject, content, file_name_list)

    def send_mail(self, mail_to_list, subject, content, file_name_list):
        self.do_send_mail(False, mail_to_list, subject, content, file_name_list)

    def do_send_mail(self, is_ssl, mail_to_list, subject, content, file_name_list):
        """
        发送邮件
        :param is_ssl: 使用SSL的方式发生
        :param mail_to_list: 收件人列表
        :param subject: 邮件主题
        :param content: 邮件正文
        :param file_name_list: 附近的文件路径列表
        :return:
        """
        if is_ssl:
            smtp = smtplib.SMTP_SSL(self.smtp_server, self.smtp_port)
        else:
            smtp = smtplib.SMTP(self.smtp_server, self.smtp_port)

        smtp.ehlo(name='foxmail')
        # 调用login时，如果没有调用过 echlo 会自动调用该方法，但是默认使用的name为计算机名
        # 如果计算机名有中文，就会返回503方法未实现的异常
        smtp.login(self.mail_from, self.password)

        msg = MIMEMultipart()
        msg['From'] = self.mail_from
        msg['To'] = COMMASPACE.join(mail_to_list)
        msg['Date'] = formatdate(localtime=True)
        msg['Subject'] = subject

        # 如果 content 是 html，则需要设置 _subtype='html'
        # 默认情况下 _subtype='plain'，即纯文本
        msg.attach(MIMEText(content, _charset='utf-8'))

        for fn in file_name_list:
            part = MIMEText(open(fn, 'rb').read(), 'base64', 'utf-8')
            part["Content-Type"] = 'application/octet-stream'
            basename = os.path.basename(fn)
            if PY2:
                basename = basename.encode('gb2312')

            # 文件名使用 gb2312 编码，否则会没有附件
            part.add_header('Content-Disposition', 'attachment', filename=('gb2312', '', basename))
            msg.attach(part)

        smtp.sendmail(self.mail_from, mail_to_list, msg.as_string())
        smtp.close()

def main():
    handler = EmailHandler('mail_from@example.com', 'password', 'smtp.example.com', 465)
    mail_to_list = ['example@test.com']
    subject = 'Python 发送邮件测试'
    content = '这是用 Python 自动发送的邮件，请勿回复'
    # 附件存放在当前文件夹
    file_name_list = ['test.rar']
    handler.send_mail_ssl(mail_to_list, subject, content, file_name_list)
    print('邮件发送成功')

if __name__ == '__main__':
    main()
```


  [1]: http://www.postfix.org/
  [2]: /uploads/post_img/2014/10/img2014103024.png
  [3]: /uploads/post_img/2014/10/img2014103025.png
  [4]: http://www.masnun.com/2010/01/01/sending-mail-via-postfix-a-perfect-python-example.html