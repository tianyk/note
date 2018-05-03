---
title: etag
date: 2016-08-29 14:27:00
tags: 
- http
- etag
---
### 背景
有一次查看浏览器控制台，发现好多响应码都是304。我们后台用的Express.js，一般响应的时候没有做什么特殊的操作。那默认情况下应该是200啊。  
查看express的源码

### 304 Not Modified
Not Modified 客户端有缓冲的文档并发出了一个条件性的请求（一般是提供If-Modified-Since头表示客户只想比指定日期更新的文档）。服务器告诉客户，原来缓冲的文档还可以继续使用。

### etag和304
