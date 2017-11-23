---
title: HTTP 协议与前端开发的性能优化史
layout: post
category: [技术]
tagline: 
show_reward: false
tags: [HTTP, 前端]
---

## keep-alive 复用 TCP 连接

HTTP 1.0 对每个请求都打开一个新 TCP 连接严重影响性能。HTTP 1.1 通过在 response 的 header 中添加一个 

	Connection: keep-alive 

可以让后续的请求共用一个 TCP 连接。在 HTTP 2.0 时代，所有的的请求都在一个 TCP 连接上。

## 资源合并减少请求

通过多个 js 或 css 合并成一个文件，多张小图片拼合成 Sprite 图，可以让多个 HTTP 请求减少为一个，减少额外的协议开销，而提升性能

“资源合并减少请求”的优化手段对于 HTTP 2.0 来说是没有效果的，只会增大无用的工作量而已，因为所有的请求都是在一个TCP连接上的。

## 多个静态资源域名

因为 HTTP1.x 上如果一个只用一个持久连接，请求只能一个一个顺序请求，为了高效地并行下载资源，浏览器允许我们打开多个TCP会话，但是一个域名下限制6个链接。为了突破这些限制，我们可以域名分区，提高并行下载资源能力….. 最长用的就是将静态资源分散到这些 cdn1.example.com, cdn2.example.com, cdn3.example.com 的域名下。

## base64 内嵌图片

当浏览器请求一个 html，服务器其实大概知道你是接下来要请求资源了，而不需要等待浏览器得到 html 后解析页面再发送资源请求。我们常用的内嵌图片也可以理解为一种强制的服务器推送：请求的 html 内嵌了张图片。
 
有了 HTTP 2.0 的服务器推送，HTTP 1.x 时代的内嵌资源的优化手段也变得没有意义了。

HTTP 2.0 新增的一个强大的新功能，就是服务器可以对一个客户端请求发送多个响应。除了对最初请求的响应外，服务器还可以额外向客户端推送资源，而无需客户端明确地请求。

## 内容压缩（gzip、deflate、sdch）

HTTP 请求等头部会发送一个 `Accept-Encoding` 的 Header 向服务器表明自己能够处理哪些压缩编码的数据。

	Accept-Encoding:gzip, deflate, sdch

服务器响应的数据，则通过 `Content-Encoding` 来告诉客户端，当前的内容采用的是什么编码。

	Content-Encoding:gzip

## HTTP 2.0 首部压缩

HTTP 2.0 在客户端和服务器端使用“首部表”来跟踪和存储之前发送的键-值对，对于相同的数据，不再通过每次请求和响应发送;通信期间几乎不会改变的通用键-值对(用户代理、可接受的媒体类型,等等)只 需发送一次。
