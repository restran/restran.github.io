---
title: Bootstrap 星型评分插件
layout: post
category: [技术]
tagline: 
keywords: bootstrap,插件,评分,rate
tags: [前端]
---

最近帮人实现一个打分的功能，发现[bootstrap-rating-input][1]是个简单又好用的星型打分，我对其做了些定制，添加了分值说明，并修改了样式，毕竟 bootstrap 自身的黑色五角星还是不够好看。

**效果是这样的**

![打分][2]

样式的修改主要是将原版的 bootstrap-rating-input.js 中的样式 glyphicon-star-empty 和 glyphicon-star 分别修改为 empty-star 和 full-star，只要修改这两个就可以自定义了。

**以下是样式**

```css
/*空心五星*/
.empty-star {
    overflow: hidden; width: 19px; height: 19px; 
    background-image: url(empty_star.png);
    display: inline-block;
    line-height: inherit;
    vertical-align: top;
    margin-top: 2px;
}
/*实心五星*/
.full-star {
    overflow: hidden; width: 19px; height: 19px;
    background-image: url(full_star.png); 
    display: inline-block;
    vertical-align: top;
    margin-top: 2px;
}
/*分值说明*/
.rating-caption {
    margin-left: 10px;
    line-height: 25px;
    width: 50px;
    display: inline-block;
    color: #EB6425;
    font-size: 16px;
    font-weight: 800;
}
```

**使用方法**

跟原版一样，就是多了个 `data-caption="['很差', '较差', '还行', '推荐', '力荐']"`

```html
<input type="number" name="your_awesome_parameter" 
    id="some_id" class="rating" 
    data-caption="['很差', '较差', '还行', '推荐', '力荐']" 
    value="" data-min="1" data-max="5" />
```

**完整的代码在**[这里][3]


  [1]: https://github.com/javiertoledo/bootstrap-rating-input
  [2]: /uploads/post_img/2014/05/se201405110.png
  [3]: https://github.com/restran/bootstrap-rating-input