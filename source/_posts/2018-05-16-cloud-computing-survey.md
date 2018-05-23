---
title: 云计算产品调研
layout: post
category: [技术]
tagline: 
show_reward: true
tags: [云计算]
---

![cloud-computing.jpg](/uploads/post_img/2018/05/cloud-computing.jpg "")

## 云计算

目前主流云计算服务厂商，都从单纯的提供云主机等产品，扩展到提供行业的解决方案，建立起一站式的解决方案服务。

### 云计算产品

- 计算能力，云主机、GPU主机、物理服务器
- 数据库，MySQL、SQL Server、MongoDB
- 缓存，Redis、Memcached
- 云安全，DDoS防护
- 网络，负载均衡、NAT网关、私有网络
- 存储与分发，云硬盘、对象存储、消息队列、CDN、海外加速
- 大数据能力，流计算、数据计算服务
- 人工智能，深度学习平台、图像识别、语音识别、自然语言处理
- 域名服务，域名注册、域名备案
- 运维管理，云监控、云拨测
- 视频服务，直播、点播
- 容器云
- 实时数据库

### 解决方案

- 通用解决方案，网站
- 行业解决方案，零售、制造、游戏、金融、政务
- 大数据解决方案，智能配送、智能旅游、路况预测
- 区块链解决方案

## 云计算厂商

仅列举了一些云计算厂商。

### 国内云厂商

- [阿里云](https://www.aliyun.com/)
- [腾讯云](https://cloud.tencent.com/)
- [美团云](https://www.mtyun.com)
- [京东云](https://www.jdcloud.com)
- [华为云](https://www.huaweicloud.com/)
- [青云](https://www.qingcloud.com)

专注某一领域的云产品

- [DaoCloud](http://www.daocloud.io)，容器云
- [七牛](https://www.qiniu.com/)，云存储、直播
- [又拍云](https://www.upyun.com/)，云存储、CDN、直播

### 国外云厂商

- [Amazon Web Services](https://aws.amazon.com/cn/)
- [Azure](https://azure.microsoft.com/)
- [Google Cloud Computing](https://cloud.google.com/)

## 一些新产品和架构

### Serverless

Serverless（无服务器）架构，如同许多新的概念一样，目前还没有一个普遍公认的权威的定义。最新的一个定义是这样描述的：“无服务器架构是基于互联网的系统，其中应用开发不使用常规的服务进程。相反，它们仅依赖于第三方服务（例如AWS Lambda服务），客户端逻辑和服务托管远程过程调用的组合。”

这项技术的目标并不是为了实现真正意义上的“无服务器”，而是指由第三方云计算供应商负责后端基础结构的维护，以服务的方式为开发者提供所需功能，例如数据库、消息，以及身份验证等。

### AWS Lambda

AWS Lambda 是一项计算服务，可以无需预配置或管理服务器即可运行代码。AWS Lambda 支持使用 Node.js、Java、C#、Go 和 Python 编写一段代码，通过 REST API 方式调用执行这段代码。

### Google Cloud Functions (BETA)

事件驱动型无服务器计算平台，与 AWS Lambda 类似的产品。

### Baas 产品

BaaS（Backend as a Service）是一种新型的云服务，旨在为移动和Web应用提供后端云服务，包括云端数据/文件存储、账户管理、消息推送、社交媒体整合等。BaaS是垂直领域的云服务，随着移动互联网的持续火热，BaaS也受到越来越多的开发者的亲睐。它作为应用开发的新模型，可以降低开发者成本，让开发者只需专注于具体的开发工作。

虽然BaaS属于PaaS的范畴，但两者也有区别。在BaaS平台中，开发者只需要定义数据模型，平台就会自动生成对应的接口，这可以让开发者更加专注具体的客户端代码。

- [Google Firebase](https://firebase.google.com)
- [LeanCloud](https://leancloud.cn/)
- [野狗](https://www.wilddog.com/)

### Kubernetes Engine

Kubernetes Engine 是一个可用于部署容器化应用的托管式环境。它融合了提高开发效率、有效利用资源、自动化运维和开源灵活性方面的最新创新成果，能够加速进入市场以及迭代的时间。

### 人工智能服务

大多数的云厂商都提供了人工智能服务，提供了自然语言处理、图像识别、语音识别等API。

## 参考文献

- http://www.infoq.com/cn/articles/the-definition-development-and-future-of-baas-services
