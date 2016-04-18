---
title: Python cx_Oracle 安装小记
layout: post
category : [Python]
tagline: 
tags : [Python, Oracle, SQLAlchemy]
---

[SQLAlchemy](http://www.sqlalchemy.org/ "") 是 Python 中用来操作数据库的一个利器，支持 MySQL、Oracle、PostgreSQL、SQLite。使用 SQLAlchemy 来管理 Oracle 的数据需要安装依赖 [cx_Oracle](http://cx-oracle.sourceforge.net/ "")。在这过程中遇到不少问题，记录如下。

cx_Oracle 可以到这里下载：http://cx-oracle.sourceforge.net/
旧版本的下载地址：http://sourceforge.net/projects/cx-oracle/files/

现在也可以通过 `pip install cx_Oracle` 安装

## Windows 

安装 cx_Oracle 正确版本，需要区分 10g，11g，安装 instantclient_11_2（请到 Oracle 官网下载）

### 问题 

```
ImportError: DLL load failed: 找不到指定的模块。
```

将 instantclient_11_2 所在的目录添加到环境变量，但是环境变量有时没有立即生效
，可以复制 oci.dll（版本也要正确）到 \Python27\Lib\site-packages 目录下

这时又出现问题

```
Unable to acquire Oracle environment handle
```

复制 oci.dll 依赖的 dll，oraociei11.dll，ocijdbc11.dll 到 \Python27\Lib\site-packages 目录下。如果不清楚就将 instantclient_11_2 目录下的 dll 都复制到 \Python27\Lib\site-packages 目录下

详细信息还可以参考[这里](http://docs.oracle.com/cd/B12037_01/appdev.101/b10779/oci01int.htm#423364)。

```
# UNIX
libclnstsh.so.10.1
libnnz10.so
libociei.so

# Windows
oci.dll
oraociei10.dll
orannzsbb10.dll
```

## Linux

```sh
# 先安装 rpm
yum install rpm
```

```sh
# oracle-instantclient-basic-10.2.0.3-1.x86_64.rpm 请到 Oracle 官网下载
rpm -ivh oracle-instantclient-basic-10.2.0.3-1.x86_64.rpm
rpm -ivh cx_Oracle-5.1.2-10g-py27-1.x86_64.rpm 
# 有这个文件表示安装成功，根据 python 的位置，也可能在其他地方
ls /usr/lib/python2.7/site-packages/cx_Oracle.so 
```

### 问题 1

```py
import cx_Oracle
   Traceback (most recent call last):
     File "<stdin>", line 1, in <module>
   ImportError: libclntsh.so.10.1: cannot open shared object file: No such file or directory
```

> The problem is that the just installed libraries of the Oracle Instant Client aren’t part of the default library path of your CentOS installation. Either you have to extend the LD_LIBRARY_PATH Bash variable of your current user or you have to add the lib directory of the Instant Client installation to the system-wide library path if all users should be allowed to use the Oracle Instant Client. To do so you have to create a new file, e.g. oracle.conf, in the /etc/ld.so.conf.d directory with the following content:

    vim /etc/ld.so.conf.d/oracle.conf
    
添加

    /usr/lib/oracle/10.2.0.3/client64/lib/
    
This tells ldconfig to also look for libraries in the lib folder of the Instant Client installation. To update the library cache just call ldconfig without any parameter. This will take a while since ldconfig will re-read every configured library folder and add its content to the library cache. The new oracle.conf file has to be owned by the root user as well as ldconfig has to be called as the root user. Afterwards so should be able to use the cx_Oracle module in your Python shell:

这样做之后，有时仍然出现问题。参照[这里](http://blog.csdn.net/kongxx/article/details/7107683 "")的方法，需要`设置环境变量`：

**方法1：**
export PATH
在/etc/profile文件中添加变量，该变量将会对Linux下所有用户有效，并且是“永久的”。

    vi /etc/profile

在文件末尾添加

```sh
LD_LIBRARY_PATH=${LD_LIBRARY_PATH}:/usr/lib/oracle/10.2.0.3/client64/lib
export LD_LIBRARY_PATH
```

要是刚才的修改马上生效，需要执行以下代码

    source /etc/profile

这时再查看系统环境变量，就能看见刚才加的东西已经生效了

    echo $LD_LIBRARY_PATH


**方法2：** 直接运行export命令定义变量，只对当前shell（BASH）有效（临时的）

```sh
export LD_LIBRARY_PATH=${LD_LIBRARY_PATH}:/usr/lib/oracle/10.2.0.3/client64/lib
```

### 问题 2

```
import cx_Oracle
ImportError: No module named cx_Oracle
```

如果安装的 python 64 位，需要把cx_Oracle文件复制到 /usr/lib64/python2.7/site-packages/ 目录下

```sh
cd /usr/lib/python2.7/site-packages/
cp cx_Oracle.so /usr/lib64/python2.7/site-packages/cx_Oracle.so
cp cx_Oracle-5.1.2-py2.7.egg-info /usr/lib64/python2.7/site-packages/cx_Oracle-5.1.2-py2.7.egg-info
```

**如果是 Ubuntu 系统则需要注意**

> For Debian and derivatives, this sys.path is augmented with directories for packages distributed within the distribution. Local addons go into /usr/local/lib/python/dist-packages, Debian addons install into /usr/{lib,share}/python/dist-packages. /usr/lib/python/site-packages is not used.

```sh
cd /usr/lib/python2.7
sudo mv site-packages/cx_Oracle* dist-packages/
sudo rmdir site-packages/
sudo ln -s dist-packages site-packages
sudo ldconfig
    
# Thanks to http://bayo.opadeyi.net/2011/07/setting-up-cxoracle-on-ubuntu-1104.html
```

## SQLAlchemy Oracle 的中文问题

你需要设置 `NLS_LANG` 环境变量，否则你读取出来的中文可能是乱码，或者当 insert 的数据有中文时会导致 Unicode 编码错误。

你可以在 Python 代码中这么设置环境变量

```py
# 设置编码，否则：
# 1. Oracle 查询出来的中文是乱码
# 2. 插入数据时有中文，会导致
# UnicodeEncodeError: 'ascii' codec can't encode characters in position 1-7: ordinal not in range(128)
os.environ['NLS_LANG'] = 'SIMPLIFIED CHINESE_CHINA.UTF8'
```

