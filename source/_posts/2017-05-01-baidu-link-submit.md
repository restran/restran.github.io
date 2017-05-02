---
title: 百度站长平台链接主动推送的 Python 脚本
layout: post
category: [技术]
tagline: 
keywords: 百度,站长平台,链接推送,主动推送,python,hexo,脚本
tags: [Python]
---

如果自己的网站需要被百度收录，可以在搜索结果中找到，就需要将网站的链接提交给百度。依靠百度的爬虫可能无法检索到网站所有的内容，因此可以主动将链接提交给百度。

在百度的[站长平台](http://zhanzhang.baidu.com/)上介绍了链接提交方法，目前有这四种：

1. 主动推送：最快的提交方式，推荐将站点当天新产出链接立即通过此方式推送给百度，以保证新链接可以及时被百度收录。
2. 自动推送：最为便捷的提交方式，将自动推送的JS代码部署在站点的每一个页面源代码中，部署代码的页面在每次被浏览时，链接会被自动推送给百度。可以与主动推送配合使用。
3. sitemap：将网站链接放到sitemap中，然后将sitemap的地址提交给百度。百度会周期性的抓取检查您提交的sitemap，对其中的链接进行处理，但收录速度慢于主动推送。
4. 手动提交：操作起来麻烦。

为了让网站最新的内容更加及时的提交给百度，使用主动推送就很必要，百度给的例子中没有 Python 的。

![链接提交](/uploads/post_img/2017/05/baidu_link_submit.jpg)

我的博客使用 Hexo 搭建，使用 `hexo-generator-sitemap` 可以自动为网站生成 sitemap.xml，然后就写了这个脚本自动解析该 xml 将链接推送给百度。

以下脚本使用 Python3，未在 Python2 环境下测试过。

```python
# -*- coding: utf-8 -*-
# Created by restran on 2017/4/26
from __future__ import unicode_literals, absolute_import
import requests
import xmltodict

"""
主动推送站点链接到百度，读取 sitemap.xml
"""


class BaiduLinkSubmit(object):
    def __init__(self, site_domain, sitemap_url, baidu_token):
        self.site_domain = site_domain
        self.sitemap_url = sitemap_url
        self.baidu_token = baidu_token
        self.url_list = []

    def parse_sitemap(self):
        print('开始抓取sitemap')
        print('访问 %s' % self.sitemap_url)
        r = requests.get(self.sitemap_url)
        data = xmltodict.parse(r.text)
        self.url_list = [t['loc'] for t in data['urlset']['url']]
        print('抓取到%s项URL链接' % len(self.url_list))

    def submit(self):
        url = 'http://data.zz.baidu.com/urls?site=%s&token=%s' % (self.site_domain, self.baidu_token)
        headers = {
            'Content-Type': 'text/plain'
        }
        data = '\n'.join(self.url_list)
        r = requests.post(url, headers=headers, data=data)
        data = r.json()
        print('成功推送的url条数: %s' % data.get('success', 0))
        print('当天剩余的可推送url条数: %s' % data.get('remain', 0))
        not_same_site = data.get('not_same_site', [])
        not_valid = data.get('not_valid', [])
        if len(not_same_site) > 0:
            print('由于不是本站url而未处理的url列表')
            for t in not_same_site:
                print(t)

        if len(not_valid) > 0:
            print('不合法的url列表')
            for t in not_valid:
                print(t)


def main():
    # 需要修改为自己的域名 
    site_domain = 'www.restran.net'
    # sitemap.xml 的地址
    sitemap_url = 'http://www.restran.net/sitemap.xml'
    # 在站长平台申请的推送用的准入密钥
    # 在百度站长平台可以查找到
    baidu_token = 'your_baidu_token'
    app = BaiduLinkSubmit(site_domain, sitemap_url, baidu_token)
    app.parse_sitemap()
    app.submit()


if __name__ == '__main__':
    main()
```

这是另外一个版本，读取本地生成的 `sitemap.txt` 文件，也可以根据需要自行修改。

```python
# -*- coding: utf-8 -*-
# Created by restran on 2017/4/26
from __future__ import unicode_literals, absolute_import
import requests
import xmltodict

"""
主动推送站点链接到百度，读取 sitemap.txt 文件，每行一个 url
"""


class BaiduLinkSubmit(object):
    def __init__(self, site_domain, sitemap_file, baidu_token):
        self.site_domain = site_domain
        self.sitemap_file = sitemap_file
        self.baidu_token = baidu_token
        self.url_list = []

    def read_sitemap(self):
        print('开始读取sitemap文件')
        with open(self.sitemap_file, 'r') as f:
        self.url_list = [line.strip() for line in f if line.strip() != '']
        print('抓取到%s项URL链接' % len(self.url_list))

    def submit(self):
        url = 'http://data.zz.baidu.com/urls?site=%s&token=%s' % (self.site_domain, self.baidu_token)
        headers = {
            'Content-Type': 'text/plain'
        }
        data = '\n'.join(self.url_list)
        r = requests.post(url, headers=headers, data=data)
        data = r.json()
        print('成功推送的url条数: %s' % data.get('success', 0))
        print('当天剩余的可推送url条数: %s' % data.get('remain', 0))
        not_same_site = data.get('not_same_site', [])
        not_valid = data.get('not_valid', [])
        if len(not_same_site) > 0:
            print('由于不是本站url而未处理的url列表')
            for t in not_same_site:
                print(t)

        if len(not_valid) > 0:
            print('不合法的url列表')
            for t in not_valid:
                print(t)


def main():
    # 需要修改为自己的域名 
    site_domain = 'www.restran.net'
    # sitemap.txt 的文件路径
    sitemap_file = 'sitemap.txt'
    # 在站长平台申请的推送用的准入密钥
    # 在百度站长平台可以查找到
    baidu_token = 'your_baidu_token'
    app = BaiduLinkSubmit(site_domain, sitemap_file, baidu_token)
    app.read_sitemap()
    app.submit()


if __name__ == '__main__':
    main()
```