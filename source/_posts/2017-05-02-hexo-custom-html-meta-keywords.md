---
title: Hexo 自定义 HTML Meta 标签的 Keywords
layout: post
category: [技术]
tagline: 
show_reward: true
keywords: [hexo,seo,keywords,html meta,搜索引擎,优化,使用文档]
tags: [Hexo]
---

[HTML Meta](https://segmentfault.com/a/1190000004279791) 标签定义了一些元数据，这些数据并不会显示在网页中，主要是面向浏览器和搜索引擎，让其更好的识别网页的内容，常见的一些元标签有：

```html
<!--用于告诉搜索引擎，网页的主要内容-->
<meta name="description" content="网站内容描述" />
<!--用于告诉搜索引擎，网页的关键字-->
<meta name="keywords" content="restran,博客">
<!--用于告诉浏览器，视口的尺寸及比例-->
<meta name="viewport" content="width=device-width, initial-scale=1">
```

目前的这个网站是使用 Hexo 搭建的，所用的主题基于 Next 进行了大量的修改。在使用过程中，发现生成的 HTML 中有个元标签 keywords 存在重复，看起来不够优美。

仔细探究了 Next 主题后发现 keywords 的生成在 `layout/_partials/head.swig` 文件中，Next 主题本身定义了这些标签，但是里面还有个 open_graph 函数，会生成 keywords 和 description，因此产生了重复。

```swig
{{ open_graph({
  twitter_id: theme.twitter,
  google_plus: theme.google_plus,
  fb_admins: theme.fb_admins,
  fb_app_id: theme.fb_app_id}) }}
```

这个函数位于 

	node_modules/hexo/lib/plugins/helper/open_graph.js

但是 open_graph 函数中 keywords 的生成是根据当前页面的 tags，但是有些页面没有 tags，而且有些作者可能只想把 tags 作为自己文章的分类，那么就不够完美。

为了让搜索引擎更懂你的网页，设置合理的 keywords 就很有必要，于是给 Hexo 提了一个 [Pull Request](https://github.com/hexojs/hexo/pull/2535)，该更新发布在了 [3.3.5](https://github.com/hexojs/hexo/releases/tag/3.3.5) 版本中。

每个页面 keywords 的选择顺序，是按照如下优先顺序进行

1. page 中定义的 keywords
2. page 中定义的 tags
3. _config.js 中定义的 keywords

这样就可以为根据需要为每个页面设置 keywords，如果没有设置，则使用默认的配置，更加灵活。例如我这篇文章中的配置如下

```yaml
title: Hexo 自定义 HTML Meta 标签的 Keywords
layout: post
category: [技术]
keywords: hexo,seo,keywords,html meta
tags: [Hexo]
```

如果没有配置 keywords，则会使用 tags

```yaml
tags: [Hexo]
```

在 _config.js 中配置一个默认值

```yaml
keywords: blog,hexo,site
```

也支持使用数组的方式

```yaml
keywords: [blog,hexo,site]
```

另一方面，Next 主题中，很多 swig 文件 都没有考虑默认进行 HTML 转义的问题，这里的 open_graph.js 也存在相同的问题。这种没有`缺省安全`的做法，其实是有些潜在的风险。

这些字符在 HTML 中是需要转义的

	' " <> & /

如果 keywords 中出现这些字符，可能会破坏 HTML 标签的正确性，尽管 Chrome 支持自动纠错，但严谨些总是没错。


