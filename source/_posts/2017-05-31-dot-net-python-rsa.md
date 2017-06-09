---
title: Python 与 C# 的 RSA 加解密数据交互
layout: post
category: [技术]
tagline: 
show_reward: true
keywords: [Python, RSA, C#, 加解密]
tags: [Python, C#, RSA]
---

最近在做一个东西，服务端是用 Python 写的 API，客户端是其他语言写的，比如 C#。客户端与服务端之间有个数据通信的需求是通过 RSA 做加解密。例如客户端 C# 使用公钥加密数据，服务端 Python 使用私钥解密数据。因此需要让不同语言的 RSA 加密后的数据兼容，能够互相解密。

在 C# 中 RSA 的私钥和公钥文件是使用 XML 格式存储的，而 Python 的 pycrypto 是使用 PEM 格式，第一个要解决的问题是密钥文件的一致性问题。使用 openssl 生成的 RSA 密钥文件，C# 无法读取。研究了很久 C# 读取 PEM 的方法，但是没有找到简单高效的方法，最后的妥协方法是使用 C# 生成 RSA 的密钥，然后再转成 PEM 格式。

## 生成 xml 格式的 RSA 密钥

使用如下代码，用 C# 生成 RSA 的密钥

```csharp
public void GenerateRSAKey()
{
    using (var rsa = new RSACryptoServiceProvider(2048))
    {
        // 输出私钥
        Console.WriteLine(rsa.ToXmlString(true));
        // 输出公钥
        Console.WriteLine(rsa.ToXmlString(false));
    }
}
```

## 将 RSA 密钥由 xml 转成 pem 格式

可以使用[这个在线工具](https://superdry.apphb.com/tools/online-rsa-key-converter)，但是在线工具毕竟有数据泄露的风险，最后参考了[这篇文章](http://www.platanus.cz/blog/converting-rsa-xml-key-to-pem)，代码在这里 [XMLSec2PEM.java](/uploads/attachment/2017/05/XMLSec2PEM.java.txt)。

编译代码

    javac XMLSec2PEM.java

转换 XML 到 PEM

    java XMLSec2PEM your_key.xml

将上述输出的内容保存到 rsa_key.pem。在 Python 中调用会提示`不支持的 RSA Key 格式`，需要进一步做转换

    openssl pkcs8 -topk8 -in rsa_key.pem -nocrypt -out rsa.key
    
最后得到可用的 rsa.key，使用 openssl 提取出公钥

    openssl rsa -in rsa.key -pubout -out rsa_pub.key

## 不同语言兼容的 RSA 加解密

要做到 C# 和 Python 相互兼容的 RSA 加解密还是有很多细节问题的，例如 C# 默认会做随机的填充，因此每次加密得到的数据都不同，以及 Unicode 和 UTF8的编码问题等。

关于 C# 和 Python 之间相互加解密，可以参考[这篇文章](http://brantsteen.com/blog/rsa-encrypt-using-python-decrypt-using-c-sharp/)，[代码在这](https://github.com/Brant/EncryptionExample)。以下代码经过测试，C# 加密的数据，Python 可以正确解密，反之亦然。

### Python 版的完整代码

需要先安装依赖 

    pip install pycrypto

```python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals, absolute_import
import sys
import base64
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_v1_5

PY2 = sys.version_info[0] == 2
PY3 = sys.version_info[0] == 3

if PY3:
    text_type = str
    binary_type = bytes
else:
    text_type = unicode
    binary_type = str


def utf8(value):
    if not isinstance(value, binary_type) and not isinstance(value, text_type):
        value = binary_type(value)
    if isinstance(value, text_type):
        return value.encode('utf-8')
    else:
        return value


_TO_UNICODE_TYPES = (text_type, type(None))


def to_unicode(value):
    if isinstance(value, _TO_UNICODE_TYPES):
        return value
    if not isinstance(value, bytes):
        raise TypeError(
            "Expected bytes, unicode, or None; got %r" % type(value)
        )
    return value.decode("utf-8")


def read_file(file_path):
    with open(file_path, 'r') as f:
        return f.read()


rsa_key_content = read_file('rsa.key')
rsa_pub_key_content = read_file('rsa_pub.key')


class RSAHelper(object):
    @classmethod
    def decrypt(cls, enc_data, key_content=rsa_key_content, passphrase=''):
        rsa = RSA.importKey(key_content, passphrase=passphrase)
        # Generate a cypher using the PKCS1.5 standard
        cipher = PKCS1_v1_5.new(rsa)
        return cipher.decrypt(enc_data, '')

    @classmethod
    def encrypt(cls, plain_data, key_content=rsa_pub_key_content, passphrase=''):
        rsa = RSA.importKey(key_content, passphrase=passphrase)
        # Generate a cypher using the PKCS1.5 standard
        cipher = PKCS1_v1_5.new(rsa)
        return cipher.encrypt(utf8(plain_data))

    @classmethod
    def encrypt_b64(cls, plain_data, key_content=rsa_pub_key_content, passphrase=''):
        data = cls.encrypt(plain_data, key_content, passphrase)
        data = to_unicode(base64.b64encode(utf8(data)))
        return data

    @classmethod
    def decrypt_b64(cls, enc_data, key_content=rsa_key_content, passphrase=''):
        enc_data = base64.b64decode(utf8(enc_data))
        data = cls.decrypt(enc_data, key_content, passphrase)
        data = to_unicode(data)
        return data


if __name__ == '__main__':
    enc = RSAHelper.encrypt_b64('123456中文')
    print(enc)
    plain = RSAHelper.decrypt_b64(enc)
    print(plain)
```

### C# 版的完整代码

```csharp
using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;

namespace TestConsoleApplication
{
    public class RSAHelper
    {
        public static void Test()
        {
            try
            {
                var privateKey = ReadKeyFile("rsa.xml");
                var publicKey = ReadKeyFile("rsa_pub.xml");
                var dataToEncrypt = "123456中文";
                var encryptedData = EncryptBase64(dataToEncrypt, publicKey);
                Console.WriteLine("加密后:\n{0}", encryptedData);
                var decryptedData = DecryptBase64(encryptedData, privateKey);
                Console.WriteLine("解密后:\n{0}", decryptedData);
            }
            catch (ArgumentNullException)
            {
                Console.WriteLine("Encryption failed.");
            }

            Console.ReadLine();
        }

        public static string ReadKeyFile(string filePath)
        {
            using (var fs = new FileStream(filePath, FileMode.Open))
            {
                var certBytes = new byte[fs.Length];
                fs.Read(certBytes, 0, (int)fs.Length);
                return Encoding.UTF8.GetString(certBytes);
            }
        }

        public static string EncryptBase64(string dataToEncrypt, string keyContent, bool doOAEPPadding = false)
        {
            var byteConverter = new UTF8Encoding();
            var bytesToEncrypt = byteConverter.GetBytes(dataToEncrypt);
            var data = Encrypt(bytesToEncrypt, keyContent, doOAEPPadding);
            if (data == null)
            {
                return null;
            }

            var b64Data = Convert.ToBase64String(data);
            return b64Data;
        }

        public static string DecryptBase64(string dataToDecrypt, string keyContent, bool doOAEPPadding = false)
        {
            var bytesToEncrypt = Convert.FromBase64String(dataToDecrypt);
            var data = Decrypt(bytesToEncrypt, keyContent, doOAEPPadding);
            var byteConverter = new UTF8Encoding();
            return byteConverter.GetString(data);
        }

        public static byte[] Encrypt(byte[] dataToEncrypt, string keyContent, bool doOAEPPadding = false)
        {
            try
            {
                byte[] encryptedData;
                using (var rsa = new RSACryptoServiceProvider())
                {
                    rsa.FromXmlString(keyContent);
                    encryptedData = rsa.Encrypt(dataToEncrypt, doOAEPPadding);
                }
                return encryptedData;
            }
            catch (CryptographicException e)
            {
                Console.WriteLine(e.Message);
                return null;
            }
        }

        public static byte[] Decrypt(byte[] dataToDecrypt, string keyContent, bool doOAEPPadding = false)
        {
            try
            {
                byte[] decryptedData;
                using (var rsa = new RSACryptoServiceProvider())
                {
                    rsa.FromXmlString(keyContent);
                    decryptedData = rsa.Decrypt(dataToDecrypt, doOAEPPadding);
                }
                return decryptedData;
            }
            catch (CryptographicException e)
            {
                Console.WriteLine(e.ToString());
                return null;
            }
        }
    }

    class Program
    {
        static void Main(string[] args)
        {
            RSAHelper.Test();
        }
    }
}
```