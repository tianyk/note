---
title: http2
date: 2017-07-05 11:43:41
updated: 2018-05-29 21:20:15
tags: 
- http
- http2
---
## HTTP2

### Server Push

响应头
```
Link: </css/styles.css>; rel=preload; as=style, </js/main.js;>; rel=preload; as=script
```

nginx > 1.13.9 & **[最新版openssl](https://www.openssl.org/source/)**

``` 
# nginx自己处理
location / {
    ...
    http2_push /css/style.css;
    http2_push /js/main.js;
    ...
}
```

``` nginx 
# 后端实现
location = /api {
    ...
    proxy_pass http://upstream;
    http2_push_preload on;
    ...
}
```

![](/images/http2-server-push.png)

> macOS/10.13.4 Chrome/66.0.3359.181 nginx/1.13.12 中测试发现最多支持10个Server Push。

### 协议帧
![](/images/http2-binary-framing.png)

### 多路复用
HTTP1.x一个连接只能处理一个请求，开启`keep-alive`后可以复用连接（前一个处理完后复用）。HTTP2可以一个连接同时处理多个请求响应（最大的一个目标是在用户和网站间只用一个连接），客户端和服务器可以将 HTTP 消息分解为互不依赖的帧，然后交错发送，最后再在另一端把它们重新组装起来。

![](/images/http2-multi-plexing.png)

### 参考
- [HTTP/2 资料汇总](https://imququ.com/post/http2-resource.html)
- [nginx配置http2无效不起作用](https://www.phpsong.com/2818.html)
- [HTTP/2 简介](https://developers.google.com/web/fundamentals/performance/http2/?hl=zh-cn)
- [HTTP2简介和基于HTTP2的Web优化](https://github.com/creeperyang/blog/issues/23)
- [借助 HTTP/2 打造更迅捷的 Web 体验](https://w3ctech.com/topic/862)
- [HTTP2.0关于多路复用的研究](https://www.nihaoshijie.com.cn/index.php/archives/698/)
