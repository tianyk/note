---
title: seo
date: 2017-05-04 19:09:42
tags:
---
## SEO 

### Robots
爬虫协议。规定为小写的`robots.txt`，放在网站根目录。用于告诉爬虫此网站中的哪些内容是不应被搜索引擎的爬虫获取的，哪些是可以被爬虫获取的。

`Robots`主要包含以下几大部分

- User-agent

    对特定机器人进行配置。常见的有`Baiduspider`、`Googlebot`、`Bingbot`、`360Spider`、`Sogouspider`。可以设置为`*`代表所有。[淘宝](https://www.taobao.com/robots.txt)、[OSChina](https://www.oschina.net/robots.txt)

- Disallow

    指定那些目录下是不可以被抓取的。
    
- Allow 

    指定那些目录下是可以被抓取的。
    > 一些爬虫支持一项Allow指令，可以先写多个Disallow最后写Allow指令。

- Sitemap 

    站点地图。方便爬虫进行抓取，里面是站内网站的地址。

- Crawl-delay

    抓取间隔。`Crawl-delay: 10`指在爬虫两次进入站点时间隔为`10`秒。*部分搜索引擎会忽略*

本站的`robots.txt`：
```
User-agent: *
Disallow: /search
Allow: /
Sitemap: https://kekek.cc/sitemap.xml
```
次规则适用于所有爬虫，`/search`下的内容不可以被抓去，其它所有网址都可以被抓去。站点地图地址为`https://kekek.cc/sitemap.xml`。

### sitemap 
站点地图。有txt、xml多种格式。里面包含站内网页的连接。

主要属性：
- lastmod
    
    页面最后修改时间

- loc 

    页面永久链接地址

- priority

    相对于其他页面的优先权

示例：
``` xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  
  <url>
    <loc>https://kekek.cc/baidu_verify_V1VRvzkxVm.html</loc>
    <lastmod>2018-05-04T10:38:47.003Z</lastmod>
  </url>

  <url>
    <loc>https://kekek.cc/2017/03/23/bitwise-permission/</loc>
    <lastmod>2018-05-03T12:53:55.729Z</lastmod>
  </url>
</urlset>
```

### Google
访问<https://www.google.com/webmasters/tools/home?hl=zh-CN>添加站点。

![](/images/WX20180504-191101@2x.png)

### Baidu 
访问<https://ziyuan.baidu.com/linksubmit/index>添加站点。
