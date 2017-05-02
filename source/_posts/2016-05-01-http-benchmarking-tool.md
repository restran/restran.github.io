---
title: HTTP 性能测试工具
layout: post
category : [工具]
tagline: 
keywords: [性能测试, http, web, wrk, ab, benchmark, performance]
tags : [工具, 性能测试, HTTP]
---

推荐两个用来测试 HTTP 应用性能的工具：

- [ab - Apache HTTP server benchmarking tool](https://httpd.apache.org/docs/2.4/programs/ab.html)
- [wrk - a HTTP benchmarking tool](https://github.com/wg/wrk)

## ab

### 安装方法

Ubuntu

	sudo apt-get install apache2-utils
	
Mac

	brew insatll apache
	
### 使用方法

总共10000个请求，并发100个

	ab -n 10000 -c 100 http://127.0.0.1:8000/
	
并发100个请求，持续30秒

	ab -t 30 -c 100 http://127.0.0.1:8000/
	
详细的命令使用信息可以参考[文档](https://httpd.apache.org/docs/2.4/programs/ab.html)。

测试完的输出结果是这样的：

```
Server Software:        TornadoServer/4.3
Server Hostname:        127.0.0.1
Server Port:            8001

Document Path:          /resource
Document Length:        3 bytes

Concurrency Level:      100
Time taken for tests:   31.115 seconds
Complete requests:      16337
Failed requests:        0
Total transferred:      3300074 bytes
HTML transferred:       49011 bytes
Requests per second:    525.06 [#/sec] (mean)
Time per request:       190.456 [ms] (mean)
Time per request:       1.905 [ms] (mean, across all concurrent requests)
Transfer rate:          103.58 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   1.5      0     180
Processing:     1  109  24.9    108     290
Waiting:        1  109  24.9    108     290
Total:          1  109  24.9    108     291

Percentage of the requests served within a certain time (ms)
  50%    108
  66%    110
  75%    112
  80%    114
  90%    120
  95%    133
  98%    181
  99%    254
 100%    291 (longest request)
```

## wrk

### 安装方法

Ubuntu

请查看官方的[安装方法文档](https://github.com/wg/wrk/wiki/Installing-Wrk-on-Linux)。

Mac

	brew insatll wrk
	
### 使用方法

使用12个线程，并发100个请求，持续30秒

	wrk -t12 -c100 -d30s http://127.0.0.1:8000/
	
测试完的输出结果是这样的：

```
Running 30s test @ http://127.0.0.1:8080/remote
  12 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   243.55ms   31.89ms 468.30ms   92.22%
    Req/Sec    33.33     17.53    70.00     67.50%
  11796 requests in 30.08s, 2.19MB read
Requests/sec:    392.15
Transfer/sec:     74.68KB
```
