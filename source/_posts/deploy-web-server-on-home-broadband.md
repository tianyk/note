---
title: 在家庭宽带部署Web服务器
author: tyk
date: 2018-09-10 17:35:57
tags:
---


## 在家庭宽带部署Web服务器

### 端口映射
局域网到公网要经过一层net地址转换，在路由器中有一张表记录着：

| 内网端口  |   服务器IP     | 服务器端口  |  
| -------- | ------------ | ---------- |  
| 80       | 192.168.1.10 | 80         |  

我们要搭建Web服务器就需要把80端口配置到这张表中，

> 注意：北京地区家庭宽带80端口被封，可以使用HTTPS443端口。

随着这些年宽带提速以及各种直播类的需求现在家庭宽带上行速度已经不是问题。

### 动态域名解析

家庭宽带有个特点不是固定IP，每次重新拨号就会分配一个新的IP。这就要使用动态域名解析服务了，像花生壳之类的软件。我们也可以基于阿里云提供的[DNS API](https://help.aliyun.com/document_detail/29739.html)自己来实现这个功能：

{% include_code ddns.js %}

缺陷：DNS是有缓存的，更新了新的解析后不能立即生效。这样网站会在一段时间内不可用。

> 缓存的问题可以通过购买DNSvip服务实现最低1秒的缓存。

### 设备
旧电脑或者树莓派
