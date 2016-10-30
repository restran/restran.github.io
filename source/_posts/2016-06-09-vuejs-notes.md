---
title: Vue.js 学习笔记
layout: post
category : [前端]
tagline: 
tags : [Vue]
---


## 组件状态缓存 keep-alive

如果把切换出去的组件保留在内存中，可以保留它的状态或避免重新渲染。为此可以添加一个 keep-alive 指令参数：

```html
<component :is="currentView" keep-alive>
  <!-- 非活动组件将被缓存 -->
</component>
```

如果在单页应用中，想要保持页面切换前的状态，可以这样做：

```
<router-view keep-alive></router-view>
```


## 动态组件载入 lazy load

如果想按需加载组件资源，而不是在入口页就一次性加载全部的组件，可以参考 vue-router 文档中[动态组件载入](http://router.vuejs.org/zh-cn/lazy.html)章节。

Webpack 已经集成了代码分割功能。可以使用 AMD 风格的 require 来对你的代码标识代码分割点:

```js
require(['./MyComponent.vue'], function (MyComponent) {
  // code here runs after MyComponent.vue is asynchronously loaded.
})
```

和路由配合使用，如下：

```js
router.map({
  '/async': {
    component: function (resolve) {
      require(['./MyComponent.vue'], resolve)
    }
  }
})
```

现在，只有当 /async 需要被渲染时，MyComponent.vue组件，会自动加载它的依赖组件，并且异步的加载进来。

## Vue.util.extend

有时想要使用 Vue 内置的方法来进行拷贝对象，就像`Angular.copy`，Vue 也提供了这样一个方法，但是存在问题，[相关 Issue](https://github.com/vuejs/vue/issues/1849)。

	newItem = Vue.util.extend({}, item)

只能做浅拷贝，如果是多层的对象，仍然会存在旧对象的数据绑定关系。修改新对象内的数据时，会导致旧对象的数据绑定也被修改。例如 

```json
item = {
  data: {
    name: '',
    phone: ''
  }
}

// item.data.name 也会被修改
newItem.data.name = 'newName';
```

[官方推荐的方法](https://github.com/vuejs/vue/issues/158)是

	newItem ＝ JSON.parse(JSON.stringify(object))
	
## vue-resource 

当使用 JSON 与服务端进行交互时，在一些 Android 手机的微信中, 会出现没有将返回的数据转换成 JSON，而是仍然为字符串，这时需要手动转换

```js
Vue.http.post(
  postUrl, postData
).then(function (response) {
  var data = response.data;
  // 需要手动转换为 JSON
  if (typeof data == 'string') {
    try {
      data = JSON.parse(data);
    } catch (e) {
    }
  }
   // do something
}, function (response) {
  // 请求失败
});
```	
	