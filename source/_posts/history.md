---
title: 网站变更历史
author: tyk
date: 2018-05-03 19:52:52
updated: 2018-06-07 16:35:56
tags:
---
## 网站变更历史

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

