---
title: Web 开发技术分享
layout: post
category: [前端]
tagline: 
keywords: [Web, 前端, 新技术, Vuejs, 预处理]
tags: [Web]
---

在小组内做了 Web 开发技术的一些分享，内容主要集中在前端，整理如下

## 1. 最近几年前端技术爆发式发展

![前端菜名](/uploads/post_img/2016/02/web_develop_share_1.jpg "")

> 前端变化有多快？两年前，大家都用 Grunt 构建，去年用 Gulp + Browserify 构建，今年用 Webpack 构建，明年可能会使用纯ES6的构建工具。每变一次，前面的那些工具就全没用，都白学。要知道，这些工具每一个都是软件系统，单单Grunt就有4千个插件，然而全没用了。

### 1.1 有些技术我还没用就要过时了

1. CSS 预处理器 LESS 作者不维护了, Bootstrap 也从 LESS 转向 SASS
2. 模块加载工具 require.js， sea.js 即将过时，新兴的 Browserify 和 webpack 成为新时代模块化管理的潮流
3. npm scripts 出来，构建工具 Grunt 和 Gulp 都将过时

https://github.com/boxizen/boxizen.github.io/issues/9

### 1.2 新的技术不断出现

1. NodeJS 这两年火得一塌糊涂
2. [颠覆式前端UI开发框架：React](http://www.infoq.com/cn/articles/subversion-front-end-ui-development-framework-react)
3. AnglarJS1-> AngularJS2
4. [Meteor](https://www.meteor.com/)

https://segmentfault.com/a/1190000000361440

Meteor是什么？

> Meteor是新一代的开发即时web应用的开源框架，它能帮助你在最少的时间内完成开发。它的理念和AngularJS、BackboneJS等框架大不相同。当我们在backbone 和 angular 上工作时，客户端（Angular或Backbone）和REST后端通讯。我们可以用任何技术写 REST 后端，例如 Java、NodeJS、PHP。

> Meteor使用DDP（分布式数据协议）在客户端和服务器间传送数据。客户端JavaScript开发者需要解决的首要问题是：向后端的数据库发起查询，发送数据到客户端，当数据库变动时，推送变动到客户端。DDP是解决这一问题的标准做法。

> Meteor应用的后端基于Node和MongoDB。前端和后端的应用同时使用Meteor的API。未来开发者可以选择 MongoDB 之外的其他数据库。

## 2. 预处理

### 2.1 CSS 预处理

一般来说，CSS 预处理器基于 CSS 扩展了一套属于自己的 DSL，来解决我们书写 CSS 时难以解决的问题：

1. 语法不够强大，比如无法嵌套书写导致模块化开发中需要书写很多重复的选择器；
2. 没有变量和合理的样式复用机制，使得逻辑上相关的属性值必须以字面量的形式重复输出，导致难以维护。

**SASS** 2007年诞生，最早也是最成熟的CSS预处理器，拥有ruby社区的支持和compass这一最强大的css框架，目前受LESS影响，已经进化到了全面兼容CSS的SCSS。

**LESS** 2009年出现，受SASS的影响较大，但又使用CSS的语法，让大部分开发者和设计师更容易上手，在ruby社区之外支持者远超过SASS，其缺点是比起SASS来，可编程功能不够，不过优点是简单和兼容CSS，反过来也影响了SASS演变到了SCSS的时代。著名的Twitter Bootstrap 已经从 LESS 迁移到 SASS。

**Stylus** 2010年产生，来自Node.js社区，主要用来给Node项目进行CSS预处理支持。

[再谈 CSS 预处理器](http://efe.baidu.com/blog/revisiting-css-preprocessors/)

### 2.2 Javascript 预处理

#### 2.2.1 CoffeScript

http://coffeescript.org/

```coffee
# Assignment:
number   = 42
opposite = true

# Conditions:
number = -42 if opposite

# Functions:
square = (x) -> x * x

# Arrays:
list = [1, 2, 3, 4, 5]

# Objects:
math =
  root:   Math.sqrt
  square: square
  cube:   (x) -> x * square x

# Splats:
race = (winner, runners...) ->
  print winner, runners

# Existence:
alert "I knew it!" if elvis?

# Array comprehensions:
cubes = (math.cube num for num in list)
```

以上 CoffeeScript 代码编译后的 JavaScript 代码为

```js
var cubes, list, math, num, number, opposite, race, square,
  slice = [].slice;

number = 42;

opposite = true;

if (opposite) {
  number = -42;
}

square = function(x) {
  return x * x;
};

list = [1, 2, 3, 4, 5];

math = {
  root: Math.sqrt,
  square: square,
  cube: function(x) {
    return x * square(x);
  }
};

race = function() {
  var runners, winner;
  winner = arguments[0], runners = 2 <= arguments.length ? slice.call(arguments, 1) : [];
  return print(winner, runners);
};

if (typeof elvis !== "undefined" && elvis !== null) {
  alert("I knew it!");
}

cubes = (function() {
  var i, len, results;
  results = [];
  for (i = 0, len = list.length; i < len; i++) {
    num = list[i];
    results.push(math.cube(num));
  }
  return results;
})();
```

#### 2.2.2 TypeScript

TypeScript是由微软开发的一个能够在Node.js上运行的开源语言和编译器。这个语言是在ECMAScript6基础上演化并吸收了生成Javascript类别和接口的一些特性。Typescript 的编译器使用TypeScript语言编写，并且能够在任何兼容Javascript的程序内运行，同时它也是作为node.js的一个工具包发布的。所以该语言最终生成的仍然是Javascript脚本。

```ts
class Student {
    fullname : string;
    constructor(public firstname, public middleinitial, public lastname) {
        this.fullname = firstname + " " + middleinitial + " " + lastname;
    }
}

interface Person {
    firstname: string;
    lastname: string;
}

function greeter(person : Person) {
    return "Hello, " + person.firstname + " " + person.lastname;
}

var user = new Student("Jane", "M.", "User");

document.body.innerHTML = greeter(user);
```

## 3. SPA 

单页应用（Single Page Application, SPA）

单页应用的例子 [teambition](https://www.teambition.com/)

> 网页切换速度非常流畅，数据按需加载，没有重复刷新网页。在移动端的网页中，单页应用是优化体验的一个绝好方法。

单页应用的相关文章

https://github.com/xufei/blog/issues/5

> 在 WebView 中内嵌的应用，请尽量采用 SPA 模式来开发。

怎么开发单页应用

1. Angularjs, angular-router（Angularjs 体积庞大）
2. Vuejs, vue-router (轻量级，速度快，推荐移动端采用这种方案)
3. React

## 4. 构建工具

1. [FIS3](http://fex-team.github.io/fis3/index.html) 是面向前端的工程构建工具。解决前端工程中性能优化、资源加载（异步、同步、按需、预加载、依赖管理、合并、内嵌）、模块化开发、自动化工具、开发规范、代码部署等问题。
2. Grunt
3. Gulp
4. npm scripts 目前 npm scripts 将要替代 Grunt 和 Gulp 

https://segmentfault.com/a/1190000002491282

## 5. MVVM 框架 (Vuejs)

数据驱动的组件，为现代化的 Web 界面而生。跟 Angularjs 相似，入门简单，推荐在移动网页上采用。

## 6. 组件化

> 未来的趋势，需要大量的前置学习，Webpack

1. AngularJS 2
2. Vuejs
3. React

>  Think in component not template.

组件系统是 Vue.js 另一个重要概念，因为它提供了一种抽象，让我们可以用独立可复用的小组件来构建大型应用。如果我们考虑到这点，几乎任意类型的应用的界面都可以抽象为一个组件树：

所谓组件，即封装起来的具有独立功能的UI部件。React推荐以组件的方式去重新思考UI构成，将UI上每一个功能相对独立的模块定义成组件，然后将小的组件通过组合或者嵌套的方式构成大的组件，最终完成整体UI的构建。例如，Facebook的instagram.com整站都采用了React来开发，整个页面就是一个大的组件，其中包含了嵌套的大量其它组件，大家有兴趣可以看下它背后的代码。

如果说MVC的思想让你做到视图-数据-控制器的分离，那么组件化的思考方式则是带来了UI功能模块之间的分离。我们通过一个典型的Blog评论界面来看MVC和组件化开发思路的区别。

对于MVC开发模式来说，开发者将三者定义成不同的类，实现了表现，数据，控制的分离。开发者更多的是从技术的角度来对UI进行拆分，实现松耦合。

## 7. 前后端分离

### 7.1 REST API

1. [Heroku 平台 API 指引](https://github.com/Dreampie/http-api-design-ZH_CN)
2. [JSON风格指南](https://github.com/darcyliu/google-styleguide/blob/master/JSONStyleGuide.md)

## 8. JSON Web Token（JWT）

https://jwt.io/

JSON Web Token（JWT）是一个非常轻巧的规范。这个规范允许我们使用JWT在用户和服务器之间传递安全可靠的信息。

[JSON Web Token - 在Web应用间安全地传递信息](http://blog.leapoahead.com/2015/09/06/understanding-jwt/)

http://blog.leapoahead.com/2015/09/07/user-authentication-with-jwt/
