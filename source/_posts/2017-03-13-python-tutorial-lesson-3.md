---
title: Python 入门教程 Lesson 3 - Web 开发进阶和 Oracle 环境
layout: post
category : [技术]
tagline: 
tags : [Python]
---

## Web API 测试工具

在测试 API 上，[Postman](https://www.getpostman.com/) 是目前最好用的。提供 Chrome 插件和独立安装包的方式。在 Windows 下，还需要先安装 .NET 4.5。

- [Postman使用手册](http://www.jianshu.com/p/13c8017bb5c8)
- [Postman 使用详解](https://juejin.im/entry/57597a62a341310061337885)

## Python Oracle 环境

### Oracle 客户端

可以选择 Oracle Instant Client，体积小，又是绿色版。可以去 [Oracle 的官网](http://www.oracle.com/technetwork/database/features/instant-client/index-097480.html)下载，注意选择是 32 位还是 64 位。

### cx_Oracle 

Windows 可以去 [pypi](https://pypi.python.org/pypi/cx_Oracle/) 下载 exe 文件来安装。如果安装的 Python 是 64 位的，那么应该选择 64 位的，而且对应的 Oracle Instant Client 也需要是 64 位的。

如果安装的 Python 是 64 位的，但是操作系统的环境变量 PATH 配置的是 32 位的 Oracle Instant Client，例如需要使用 32 位的 PL/SQL Developer。可以在 Python 程序中，手动设置环境变量，将 64 位的 Oracle Instant Client 所在路径放在环境变量的第1个位置，覆盖掉操作系统的配置。

```py
import os
os.environ['PATH'] = 'D:\Program Files\Oracle\instantclient_11_2;' + os.environ['PATH']
```

安装成功后，可以在命令行下输入 `python`，进入 Python 的交互式命令窗口，然后输入 

    import cx_Oracle

来验证是否安装成功


### 安装 SQLAlchemy

    pip install SQLAlchemy
    
## SQLAlchemy

[SQLAlchemy](https://www.sqlalchemy.org/) 是 Python 中用来处理数据库连接的工具包，支持多种数据库，SQLite、MySQL、MSSQL、Oracle，支持使用 ORM 和 原始 SQL 的方式对数据库进行操作。

- ORM 对象关系映射，按操作类的方式来处理数据库中的数据
- RAW SQL

如果是使用 Django Web 框架的话，其自带的 Django ORM 就十分强大，这里不介绍 ORM 的相关知识，可以自己查阅文档。

## Records

如果是使用 RAW SQL 的方式，可以使用 [records](https://github.com/kennethreitz/records)。records 基于 SQLAlchemy，并做了一些封装，可以更简单地用写 SQL 的方式来处理数据库的数据。

records 使用举例

```py
import records

db = records.Database('oracle://...')
rows = db.query('select * from active_users')
for r in rows:
    print(r.name)
```

## SQL 和存储过程的使用方法

以下是使用 Tornado 框架做的 API，使用了 records。APIHandler 为封装好的 API 处理基类，详细内容不展开介绍，主要介绍 SQL 和存储过程的使用方法。 

```py
class APIHandler(RequestHandler):
    def __init__(self, app, request, **kwargs):
        super(APIHandler, self).__init__(app, request, **kwargs)
        # 这里的参数 app 就是 runserver 中创建的 app
        # 把数据库的连接设置过来
        self.db = app.db
        # 因为 records 没有实现调用存储过程的方法
        # 因此直接使用 sqlalchemy 调用存储过程的方法
        self.db.callproc = self.db.db.connection.cursor().callproc
        # 这是游标，当存储过程有返回游标时，需要作为参数传入
        self.db.cursor = self.db.db.connection.cursor

        self.post_data = {}
        self.init_post_data()
        self.set_header("Content-Type", "application/json; charset=utf-8")

...

```

SQL 和存储过程的使用方法

```py
# -*- coding: utf-8 -*-
# Created by restran on 2017/3/7
from __future__ import unicode_literals, absolute_import
from handlers import APIHandler

import logging

logger = logging.getLogger(__name__)


class QueryHandler(APIHandler):
    def get(self):
        """
        从数据库中查询数据
        :return:
        """
        # 这里 SQL 使用了参数绑定，防止注入
        sql = 'select * from TEST_EMP t where t.salary > :salary'
        # get_query_argument 获取 GET 的 query 查询
        # 'salary' 是参数名，后面的值是默认值，就是当参数不存在时使用
        salary = self.get_query_argument('salary', 1000)
        params = {
            'salary': salary
        }
        # **params 以字典的方式传入参数
        # 返回的是一个列表
        rows = self.db.query(sql, **params)
        # 直接将返回列表中的数据项转换为字典
        data = rows.as_dict()
        return self.success(data, msg='获取数据成功')

    def post(self):
        sql = 'select * from TEST_EMP t where t.salary > :salary'
        # 从 POST 数据中获取参数
        salary = self.post_data.get('salary', 1000)
        params = {
            'salary': salary
        }
        rows = self.db.query(sql, **params)
        # 手动创建列表中的字典
        data = [{
                    'name': r.name,
                    'salary': r.salary
                } for r in rows]
        return self.success(data, msg='获取数据成功')


class InsertHandler(APIHandler):
    def post(self):
        logger.debug(self.post_data)
        sql = 'insert into TEST_EMP (EMP_NO, NAME, JOB, SALARY) values(:emp_no, :name, :job, :salary)'
        params = {
            'emp_no': self.post_data.get('emp_no', 0),
            'name': self.post_data.get('name', 'no name'),
            'job': self.post_data.get('job', 'no job'),
            'salary': self.post_data.get('salary', 1000)
        }
        self.db.query(sql, **params)
        return self.success(params, msg='插入数据成功')


class TransactionHandler(APIHandler):
    """
    带有事务的操作
    """

    def post(self):
        logger.debug(self.post_data)
        t = self.db.transaction()
        sql = 'insert into TEST_EMP (EMP_NO, NAME, JOB, SALARY) values(:emp_no, :name, :job, :salary)'
        params = {
            'emp_no': self.post_data.get('emp_no', 0),
            'name': self.post_data.get('name', 'no name'),
            'job': self.post_data.get('job', 'no job'),
            'salary': self.post_data.get('salary', 1000)
        }
        self.db.query(sql, **params)
        if self.post_data.get('rollback'):
            # 回滚，不会插入数据
            t.rollback()
        else:
            # 提交
            t.commit()

        return self.success(params, msg='事务执行成功')


class ProcedureHandler(APIHandler):
    """
    使用存储过程
    create or replace procedure sp_update_salary
    (
     uEmpNo in int, -- 员工编号
     uSalary in int -- 将工资更新为多少
    )
    as
    begin
        update TEST_EMP set salary = uSalary where emp_no = uEmpNo;
        commit;
    end sp_update_salary;
    """

    def post(self):
        logger.debug(self.post_data)
        # 存储过程名称
        sp_name = 'sp_update_salary'
        params = [
            self.post_data.get('emp_no', 0),
            self.post_data.get('salary', 1000)
        ]

        # 传入的参数必须是列表
        self.db.callproc(sp_name, params)
        return self.success(params, msg='存储过程执行成功')


class ProcedureReturnHandler(APIHandler):
    """
    使用存储过程，带有返回值
    存储过程
    create or replace procedure sp_add_salary
    (
     uOldSalary in int, -- 小于该工资的需要增加
     uSalary in int, -- 加多少工资
     uCount out number -- 更新了多少个
    )
    as
    begin
        select count(*) into uCount from TEST_EMP where salary <= uOldSalary;
        update TEST_EMP set salary = salary + uSalary where salary <= uOldSalary;
        commit;
    end sp_update_salary;
    """

    def post(self):
        logger.debug(self.post_data)
        # 存储过程名称
        sp_name = 'sp_add_salary'
        params = [
            self.post_data.get('old_salary', 1000),
            self.post_data.get('salary', 1000),
            0 # 虽然这个参数是返回值，但是也需要与存储过程中定义的类型相同
        ]

        # 传入的参数必须是列表，返回值为列表，是传入的三个参数
        ret = self.db.callproc(sp_name, params)
        # ret 是传入的三个参数，第三个参数为 out
        # 这种类型的返回值通过这种方式获取
        logger.info('更新了多少数据项：%s' % ret[2])
        return self.success(params, msg='存储过程执行成功')


class ProcedureReturnCursorHandler(APIHandler):
    """
    使用存储过程，返回值使用游标
    存储过程
    create or replace procedure sp_query_salary
    (
     uSalary in int, -- 小于多少工资
     rcursor out sys_refcursor -- 返回的游标
    )
    as
    begin
        open rcursor for select emp_no, name, salary from TEST_EMP where salary <= uSalary;
    end sp_query_salary;
    """

    def post(self):
        logger.debug(self.post_data)
        # 存储过程名称
        sp_name = 'sp_query_salary'
        # 因为第二个参数返回的是游标，所以传入的参数也必须是游标
        params = [
            self.post_data.get('salary', 1000),
            self.db.cursor()
        ]

        # 传入的参数必须是列表，返回值为列表，是传入的三个参数
        ret = self.db.callproc(sp_name, params)
        # 第二个参数是返回的游标
        rows = ret[1]
        data = [{
                    'emp_no': t[0],
                    'name': t[1],
                    'salary': t[2]
                } for t in rows]
        return self.success(data, msg='存储过程执行成功')
```

## PyCharm 类型注释
因为 Python 是动态类型的，因此在 PyCharm 经常遇到对应的变量没有自动完成的提示，原因在于 PyCharm 不知道该变量是什么类型。

```py
# 可以在参数上设置类型提示，但是只支持 Python 3.5 以上
# 这里注释 param1 为 int 类型，该函数返回 list 类型
def func(param1: int, param2) -> list: 
    # 这里有个变量 db，在注释中设置类型
    p = param2.db # type: list
    return p
    
# 因为前面有注释返回类型为 list，PyCharm 就会知道 a 是 list 类型
a = func(p1, p2)
```

PyCharm 也支持在文档字符串中设置类型注释

```py
def func(param1, param2):
    """
    :type app: int
    :rtype: list
    """
    p = param1.db # type: list
```

也可以参考[这里](https://www.jetbrains.com/help/pycharm/2016.3/type-hinting-in-pycharm.html)

类型注释并不会做类型检查，但是可以让 PyCharm 知道该变量是什么类型，并做智能的代码完成提示。

## 开发协作和 Git 的使用

版本管理工具提供了这几项功能

- 对当前的状态进行快照，并且可以还原到历史快照中
- 可以比较快照间的差异
- 可以对不同的快照进行合并

目前最流行的版本管理工具是 Git，关于 Git 的使用可以查看这篇文章 [Git & Gitlab 使用指南](http://www.restran.net/2016/02/23/git-and-gitlab-guide/#more)。如果还在使用 SVN，建议可以尝试一下 Git。
