---
title: 网站变更历史
author: tyk
date: 2018-05-03 19:52:52
updated: 2018-06-07 16:35:56
tags:
---
## 网站变更历史

### 2019-06-07
1. 准备

    - 新建仓库[tianyk/tianyk.github.io](https://github.com/tianyk/tianyk.github.io)
    > GitHub支持两种方式GitHub Page：
    > 1. 仓库名为`YOUR_NAME.github.io`，此方式访问地址为`YOUR_NAME.github.io`
    > 2. master分支、master分支的`/docs`目录、`gh-pages`分支，这种方式访问地址为`YOUR_NAME.github.io/REPOSITORY_NAME`

1. 迁移网站到GitHub Page

    1. [配置](https://hexo.io/zh-cn/docs/deployment.html#Git)`git`方式部署

2. 修改`CNAME`为`tianyk.github.io`

    ```
    $ dig kekek.cc A 

    ;; ANSWER SECTION:
    kekek.cc.           10      IN   CNAME    tianyk.github.io.
    tianyk.github.io.   3600    IN   A        185.199.110.153
    tianyk.github.io.   3600    IN   A        185.199.109.153
    tianyk.github.io.   3600    IN   A        185.199.108.153
    tianyk.github.io.   3600    IN   A        185.199.111.153
    ```

### 2018-11-15
1. ❤点击记录

    ```
    source/js/main.js
    ```

### 2018-08-25
1. include_code 标签支持从网络加载代码
    ```
    scripts/include_code.js
    ```

### 2018-08-24
1. 停用AMP
    ```
    _config.yml
    ```

2. 修改下载目录为`downloads`

### 2018-07-16
1. 配置`skip_render`

    ```
    _config.yml
    ```

### 2018-07-04

1. footer对齐

    ```
    cactus/source/css/_partial/footer.styl
    ```

### 2018-07-03
1. footer部分❤点击

    ```
    cactus/layout/_partial/footer.ejs
    cactus/source/css/_partial/footer.styl
    cactus/source/js/main.js
    ```

参考：
- [How Did They Do That? The Twitter “Like” Animation](https://medium.com/@chrismabry/how-did-they-do-that-the-twitter-like-animation-2a473b658e43)
- [css | twitter heart animation](https://codepen.io/mindstorm/pen/aZZvKq)
- [重新创建Twitter点赞动效](http://www.w3cplus.com/animation/recreating-the-twitter-heart-animation.html)
- [Twitter heart button animation](https://codepen.io/yisi/pen/LpXVJb)
- [Twitter’s Heart Animation in Full CSS](https://blog.prototypr.io/twitter-s-heart-animation-in-full-css-b1c00ca5b774)

### 2018-06-14
1. 添加创作许可

    选择许可证<https://creativecommons.org/choose/>

2. 网站变更开始添加版本

    以后均采用日期作为版本，本次版本为[20180614]

### 2018-06-12
1. 添加[标签](/tags/)和[分类](/categories/)页面

    1. 添加新的页面 `layout/tags.ejs`
    2. 通过[`site.tags`](https://hexo.io/zh-cn/docs/variables.html#网站变量)获取所有标签
    3. 创建一个新的`hexo new page "tags"`
    4. 添加`layout: tags`到`source/tags/index.md`的front-matter。

    > 参考`layout/archive.ejs`

    ``` ejs
    <!-- https://github.com/probberechts/hexo-theme-cactus/issues/35 -->
    <div id="tags">
        <ul class="post-list">
        <% site.tags.each(function(tag) { %>
            <h2><%= tag.name %></h2>
            <% tag.posts.each(function(post) { %>
                <li class="post-item">
                    <%- partial('_partial/post/date', { post: post, class_name: 'meta' }) %>
                    <span><%- partial('_partial/post/title', { post: post, index: true, class_name: '' }) %></span>
                </li>
            <% }); %>
        <% }); %>
        </ul>
    </div>
    ```

2. i18n

    `themes/cactus/languages/[default|zh-CN].yml`

3. robots.txt

    添加`Disallow: /categories`

### 2018-05-03 
本站使用[hexo](https://hexo.io/)搭建，使用[cactus](https://github.com/probberechts/hexo-theme-cactus)模板。使用[Openresty](https://openresty.org)作为Web服务器。网站证书使用[Let's Encrypt](https://letsencrypt.org/)。本站托管在[Vultr](https://www.vultr.com/?ref=7274958)。

