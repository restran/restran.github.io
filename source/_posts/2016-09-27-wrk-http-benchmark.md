---
title: 使用 wrk 来测试 HTTP 性能
layout: post
category : [技术]
tagline: 
tags : [Web]
---

[wrk](https://github.com/wg/wrk/) 是轻量级的 HTTP 性能测试工具，但是不支持 Windows。相比于 Apache ab 功能更强大，支持 HTTP 1.1，而且可以用 Lua 写脚本支持更复杂的测试场景。

## 安装

### Mac

    brew install wrk

### Ubuntu

先安装 luajit

```
sudo apt-get install build-essential libssl-dev git
git clone http://luajit.org/git/luajit-2.0.git
cd luajit
make && sudo make install
```

然后用源码安装 wrk

```
git clone https://github.com/wg/wrk.git
cd wrk
```

在上一步下载的 luajit 代码中，有一个 jit 文件夹，需要复制到 wrk 目录下，否则 make 的时候会出现错误

```
luajit: unknown luaJIT command or jit.* modules not installed
```

然后开始 make

```
make
# move the executable to somewhere in your PATH
sudo cp wrk /usr/local/bin
```

## 使用方法

简单的例子

    wrk -t4 -c1000 -d30s -T30s --latency http://www.douban.com

上面这条命令的意思是用4个线程来模拟10个并发连接，整个测试持续30秒，连接超时30秒，打印出请求的延迟统计信息。

需要注意的是 wrk 使用异步非阻塞的 io，并不是用线程去模拟并发连接，因此不需要设置很多的线程，一般根据 CPU 的核心数量设置即可。另外 -c 参数设置的值必须大于 -t 参数的值。

输出的结果如下

```
Running 30s test @ http://www.douban.com
  4 threads and 1000 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    18.50s   854.51ms  20.38s    66.21%
    Req/Sec    18.88     20.80    67.00     80.00%
  Latency Distribution
     50%   18.52s 
     75%   19.06s 
     90%   19.79s 
     99%   20.35s 
  367 requests in 30.09s, 167.73KB read
  Socket errors: connect 0, read 380, write 0, timeout 0
Requests/sec:     12.20 
Transfer/sec:      5.57KB
```

主要关注的几个数据是 

- `Socket errors` socket 错误的数量
- `Requests/sec` 每秒请求数量，也就是并发能力
- `Latency` 延迟情况及其分布

如果遇到 -c 参数设置得太大，导致出现 `Too many open files`，可以查看一下系统的配置

    cat /proc/sys/fs/file-max

wrk 的使用方法也可以查看帮助信息

```
Usage: wrk <options> <url>                            
  Options:                                            
    -c, --connections <N>  Connections to keep open   
    -d, --duration    <T>  Duration of test           
    -t, --threads     <N>  Number of threads to use   
                                                      
    -s, --script      <S>  Load Lua script file       
    -H, --header      <H>  Add header to request      
        --latency          Print latency statistics   
        --timeout     <T>  Socket/request timeout     
    -v, --version          Print version details      
                                                      
  Numeric arguments may include a SI unit (1k, 1M, 1G)
  Time arguments may include a time unit (2s, 2m, 2h)
```

wrk 支持使用 lua 来写脚本，wrk 的代码中 scripts 文件夹中就给出了不少例子，例如 post.lua，可以根据需要来修改。

```lua
-- example HTTP POST script which demonstrates setting the
-- HTTP method, body, and adding a header

wrk.method = "POST"
wrk.body   = "foo=bar&baz=quux"
wrk.headers["Content-Type"] = "application/x-www-form-urlencoded"
```

可以这样来调用 script

```
wrk -t4 -c100 -d30s -T30s --script=post.lua --latency http://www.douban.com  
```

## 用 lua 脚本测试复杂场景

wrk 提供了几个 hook 函数，可以用 lua 来编写一些复杂场景下的测试： 

**setup**

这个函数在目标 IP 地址已经解析完，并且所有 thread 已经生成，但是还没有开始时被调用，每个线程执行一次这个函数。可以通过 `thread:get(name)`，  `thread:set(name, value)` 设置线程级别的变量。 

**init**

每次请求发送之前被调用。可以接受 wrk 命令行的额外参数，通过 -- 指定。 

**delay**

这个函数返回一个数值，在这次请求执行完以后延迟多长时间执行下一个请求，可以对应 thinking time 的场景。

**request**

通过这个函数可以每次请求之前修改本次请求的属性，返回一个字符串，这个函数要慎用， 会影响测试端性能。

**response**

每次请求返回以后被调用，可以根据响应内容做特殊处理，比如遇到特殊响应停止执行测试，或输出到控制台等等。

可以查看 scripts 文件夹下的例子，例如 delay.lua，实现的是每个请求前会有随机的延迟。

```lua
-- example script that demonstrates adding a random
-- 10-50ms delay before each request

function delay()
   return math.random(10, 50)
end
```

关于 wrk 更多使用上的技巧，可以参考[这里](http://zjumty.iteye.com/blog/2221040)。