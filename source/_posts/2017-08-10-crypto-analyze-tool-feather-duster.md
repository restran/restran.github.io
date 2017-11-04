---
title: 密码学分析和破解工具 FeatherDuster 使用说明
layout: post
category: [CTF]
tagline: 
show_reward: false
tags: [CTF, 密码学, Python]
---

[FeatherDuster](https://github.com/nccgroup/featherduster) 是一个 Python开发的用于分析密文和破解加密的框架，它试图让识别和利用弱密码系统尽可能的简单。不支持 Windows，而且需要 Python 2.x 环境。

## 安装

无法通过 pip 安装，需要先从 Github 上下载代码安装

安装依赖

    apt-get install python-crypto, libncurses-dev, libgmp3-dev

进入 featherduster 目录后，直接安装

    python setup.py install

## 使用方法

在命令行中输入 featherduster，就可以进入交互模式

```
FeatherDuster> 
Help:
        analyze - Analyze/decode samples
        autopwn - Analyze samples and run all attacks
        console - Opens an interactive prompt
         export - Export current results to file
         import - Import samples for analysis
        modules - Show all available modules
        options - Show the current option values
        results - Show the results from the last module run
            run - Run the currently selected module
        samples - Show samples
         search - Search module names and descriptions by keyword
            set - Set an option (i.e., "set num_answers=3"
          unset - Revert an option to its default value
            use - Select the module to use
```

在分析之前，需要先导入样本（也就是待分析和破解的密文），如果只有一个样本文件，可以直接 `featherduster sample.txt` 然后进入到交互模式，如果是较多的样本，则需要用 import 指令导入。

```
# 从文件中载入一个样本，输入后根据提示输入文件名
import singlefile
# 从文件中载入多个样本，每行一个样本，输入后根据提示输入文件名
import multifile
# 清除所有的样本
import clear
# 查看导入的样本
samples 
```

[alexctf-2017](https://github.com/ctfs/write-ups-2017/tree/master/alexctf-2017/cryptography/cr2-many-time-secrets-100) 有一题是用到了 Many Time Pad 流密码，可以使用 FeatherDuster 快速破解。

分析样本

    analyze

对 alexctf-2017 的这道题目，使用 analyze 后会给出很多的建议模块，根据题干，可以知道是使用 many_time_pad 进行破解。

```
[+] Suggested modules:
   alpha_shift          - A brute force attack against an alphabetic shift cipher. 
   base_n_solver        - A solver for silly base-N encoding obfuscation.          
   single_byte_xor      - A brute force attack against single-byte XOR encrypted ciphertext.
   multi_byte_xor       - A brute force attack against multi-byte XOR encrypted ciphertext.
   many_time_pad        - A statistical attack against keystream reuse in various stream ciphers, and the one-time pad.
   vigenere             - A module to break vigenere ciphers using index of coincidence for key length detection and frequency analysis.
```

根据分析的结果，载入指定的模块，进行破解

```
# use 命令可以载入指定模块，用 tab 键可以自动补全，这里是载入 many_time_pad
use many_time_pad
# 如果不记得模块的名称，可以使用 search 指令按名称或描述搜索
search your_keyword
```

使用上述指定的模块进行破解

    run

查看结果

```
# 查看结果
results 
# 导出结果到文件，输入后根据提示输入文件名
export
```

破解后的结果是这样的，但是这道题目的 flag 其实是 Many Time Pad 加密的 key，因此还需要手动处理一下。现在已经知道了密文对应的明文，只需要选择一行对密文和明文异或一下就能得到 key。

```
FeatherDuster> results 
Last results (long values may be truncated):
--------------------------------------------------------------------------------
0: 'Edvc Fri1nr, Tnie tome I u'                                
1: 'oercstoo0 {y mosbakc and u'                                
2: 'rds1One  i{e pgd6eneryptio'                                
3: 'o!drhemex _ hegrr tnat it '                                
4: 'hr7ehe o:lo eneroptoon met'                                
5: 'ins1thattie marhsmarically'                                
6: '!qe~ven  o6be hob ctacked '                                
7: 'dwrc if  hs ke\x7f \x7fs mept se'                          
8: 'btet, Le  [e khoa i` you a'                                
9: 'fsrt wit< {e ti cse&this e'                                
10: 'obehptio: echeke6alqays.'                  
```

使用异或还原出 Many Time Pad  的 key 

```py
# XORs two string
def str_xor(a, b):
    return b''.join([chr(ord(x) ^ ord(y)) for (x, y) in zip(a, b)])

key = str_xor(target_cipher.decode('hex'), target_plaintext)
```

如果没有什么思路，可以用暴力破解的方式。这个命令会自动分析样本，并用所有的攻击方式暴力破解。

    autopwn 
