---
title: PHP 学习笔记和安全漏洞
layout: post
category : [技术]
tagline: 
tags : [PHP, 安全]
---

## 系统变量

```php
$_POST // 获取 post 数据，是一个字典
$_GET // 获取 get 数据，是一个字典
```

## 错误控制运算符

PHP 支持一个错误控制运算符：@。当将其放置在一个PHP 表达式之前，该表达式可能产生的任何错误信息都被忽略掉。

## 变量默认值

当定义一个变量，如果没有设置值，默认为0

## strcmp

strcmp 函数的输出含义如下:

> 如果 str1 小于 str2 返回 < 0； 如果 str1 大于 str2 返回 > 0；如果两者相等，返回 0。

- 5.2 中是将两个参数先转换成string类型。
- 5.3.3以后，当比较数组和字符串的时候，返回是0。
- 5.5 中如果参数不是string类型，直接return了

```php
<?php
    $password=$_GET['password'];
    if (strcmp('xd',$password)) {
     echo 'NO!';
    } else{
        echo 'YES!';
    }
?>
```

## $_GET 和 $_POST

    http://ctf4.shiyanbar.com/web/false.php?name[]=a&password[]=b

如果 GET 参数中设置 `name[]=a`，那么 `$_GET['name'] = [a]`，php 会把 `[]=a` 当成数组传入， `$_GET` 会自动对参数调用 `urldecode`。

`$_POST` 同样存在此漏洞，提交的表单数据，`user[]=admin`，`$_POST['user']` 得到的是 `['admin']` 是一个数组。

## sha1 和 md5 函数

md5 和 sha1 无法处理数组，但是 php 没有抛出异常，直接返回 fasle

```php
sha1([]) === false
md5([]) === false
```

## is_numeric

PHP提供了is_numeric函数，用来变量判断是否为数字。但是函数的范围比较广泛，不仅仅是十进制的数字。

```php
<?php
echo is_numeric(233333);       # 1
echo is_numeric('233333');    # 1
echo is_numeric(0x233333);    # 1
echo is_numeric('0x233333');   # 1
echo is_numeric('233333abc');  # 0
?>
```

## preg_match

如果在进行正则表达式匹配的时候，没有限制字符串的开始和结束(`^` 和 `$`)，则可以存在绕过的问题

```php
$ip = '1.1.1.1 abcd'; // 可以绕过
if(!preg_match("/(\d+)\.(\d+)\.(\d+)\.(\d+)/",$ip)) {
  die('error');
} else {
  // echo('key...')
}
```

## 变量覆盖

### extract 

extract() 函数从数组中把变量导入到当前的符号表中。对于数组中的每个元素，键名用于变量名，键值用于变量值。

```php
<?php  
    $auth = '0';  
    // 这里可以覆盖$auth的变量值
    extract($_GET); 
    if($auth == 1){  
        echo "private!";  
    } else{  
        echo "public!";  
    }  
?>  
```

### parse_str

与 parse_str() 类似的函数还有 mb_parse_str()，parse_str 将字符串解析成多个变量，如果参数str是URL传递入的查询字符串（query string），则将它解析为变量并设置到当前作用域。

```php
//var.php?var=new  
$var='init';  
parse_str($_SERVER['QUERY_STRING']);  
print $var;  
```

## 字符串比较

`==` 是弱类型的比较，以下比较都为 true

```php
// 0x 开头会被当成16进制54975581388的16进制为 0xccccccccc
// 十六进制与整数，被转换为同一进制比较
'0xccccccccc' == '54975581388' 
// 字符串在与数字比较前会自动转换为数字，如果不能转换为数字会变成0
1 == '1'
1 == '01'
10 == '1e1'
100 == '1e2' 
0 == 'a' // a 转换为数字为 0
// 十六进制数与带空格十六进制数，被转换为十六进制整数
'0xABCdef' == '     0xABCdef'
'0010e2' == '1e3'
// 0e 开头会被当成数字，又是等于 0*10^xxx=0
// 如果 md5 是以 0e 开头，在做比较的时候，可以用这种方法绕过
'0e509367213418206700842008763514' == '0e481036490867661113260034900752'
'0e481036490867661113260034900752' == '0' 

var_dump(md5('240610708') == md5('QNKCDZO'));
var_dump(md5('aabg7XSs') == md5('aabC9RqS'));
var_dump(sha1('aaroZmOk') == sha1('aaK1STfY'));
var_dump(sha1('aaO8zKZF') == sha1('aa3OFF9m'));
```

使用 `===` 比较符则可以避免这种隐式转换，除了检查值还检查类型。


## unset

`unset($bar);` 用来销毁指定的变量，如果变量 `$bar` 包含在请求参数中，可能出现销毁一些变量而实现程序逻辑绕过。

## 变量本身的 key

如果把变量本身的 key 也当变量，就可能存在问题。

```php
$_ = '_POST';
// $$_ 是等于 $_POST 
```

```php
// http://127.0.0.1/index.php?_CONFIG=123
$_CONFIG['extraSecure'] = true;

foreach(array('_GET','_POST') as $method) {
    foreach($$method as $key=>$value) {
      // $key == _CONFIG
      // $$key == $_CONFIG
      // 这个函数会把 $_CONFIG 变量销毁
      unset($$key);
    }
}

if ($_CONFIG['extraSecure'] == false) {
    echo 'flag {****}';
}
```


