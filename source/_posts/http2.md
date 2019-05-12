---
title: HTTP2
date: 2017-07-05 11:43:41
updated: 2018-06-27 23:58:14
tags: 
- http
- http2
---
## HTTP2

重要概念：

- 流

    流是连接中的一个虚拟信道，可以承载双向的消息。可以认为一个流代表着一个请求-响应的数据。

- 消息

    与逻辑消息对应的完整的一系列数据帧。

- 帧

    HTTP 2.0 通信的最小单位，每个帧包含帧首部，至少也会标识出当前帧所属的流。

### Server Push

响应头
```
Link: </css/styles.css>; rel=preload; as=style, </js/main.js;>; rel=preload; as=script
```

nginx > 1.13.9 & **[最新版openssl](https://www.openssl.org/source/)**

``` nginx
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
location ^~ /backend {
    ...
    proxy_pass http://upstream;
    http2_push_preload on;
    ...
}
```

![](/images/http2-server-push.png)

> macOS/10.13.4 Chrome/66.0.3359.181 nginx/1.13.12 中测试发现最多支持10个Server Push。

### 协议帧
帧的类型有HEADERS帧、DATA帧、SETTINGS帧、PRIORITY帧等等。

![](/images/http2-binary-framing.png)

帧的头部
```
+-----------------------------------------------+
|                 Length (24)                   |
+---------------+---------------+---------------+
|   Type (8)    |   Flags (8)   |
+-+-------------+---------------+-------------------------------+
|R|                 Stream Identifier (31)                      |
+=+=============================================================+
|                   Frame Payload (0...)                      ...
+---------------------------------------------------------------+
```

- Length： 24 bits
    
    帧的载荷（不包括头部的9 bytes）。除非`SETTINGS_MAX_FRAME_SIZE`设置有更大值，否则不能大于2^14（16,384）16kb。

- Type： 8 bits

    帧类型，未知类型会被丢弃。

- Flags：8 bits

    具体帧的标识，默认值0x00。（查看后面例子中的SETTINGS帧的flags）

- R：1 bits

    预留。

- Stream Identifier：31 bits

    流ID。


使用[nghttp](https://nghttp2.org/)调试：
> 本例中我们服务器端会使用ServerPUSH推送`/css/index.css`

``` shell 
$ nghttp -nvu  https://h2.kekek.cc/
[  0.012] Connected
The negotiated protocol: h2                                                 -- 协议升级到h2
[  0.019] recv SETTINGS frame <length=18, flags=0x00, stream_id=0>          -- 设置帧 此处为服务器端的设置参数，给客户端时使用。
          (niv=3)                                                           -- 设置帧被应用于整个连接，而不是一个单独的流。SETTINGS帧的流标识必须是0。
          [SETTINGS_MAX_CONCURRENT_STREAMS(0x03):128]                       -- 允许打开流的最大值。
          [SETTINGS_INITIAL_WINDOW_SIZE(0x04):65536]                        -- 流量控制的初始窗口大小。默认2^16-1 (65,535)字节
          [SETTINGS_MAX_FRAME_SIZE(0x05):16777215]                          -- 单帧最大值。
                                                                            -- 默认为2^14（16384）个字节，值区间为2^14（16384）-2^24-1(16777215)。 
[  0.019] recv WINDOW_UPDATE frame <length=4, flags=0x00, stream_id=0>      -- 流量控制帧，作用于单个流以及整个连接，但只能影响两个端点之间传输的DATA数据帧。
          (window_size_increment=2147418112)                                -- 流标识符为0，影响整个连接，非单个流。
[  0.019] send SETTINGS frame <length=12, flags=0x00, stream_id=0>          -- 设置帧 此处为客户端的设置参数，给服务器使用。
          (niv=2)
          [SETTINGS_MAX_CONCURRENT_STREAMS(0x03):100]
          [SETTINGS_INITIAL_WINDOW_SIZE(0x04):65535]
[  0.019] send SETTINGS frame <length=0, flags=0x01, stream_id=0>           -- ACK (0x1)：设置这个标志位表明当前帧确认接收和应用了对端的SETTINGS帧。
          ; ACK
          (niv=0)
[  0.019] send PRIORITY frame <length=5, flags=0x00, stream_id=3>            -- 优先级帧 stream_id为0x00时返回PROTOCOL_ERROR。
          (dep_stream_id=0, weight=201, exclusive=0)                         -- dep_stream_id 依赖的流  weight 权重
[  0.019] send PRIORITY frame <length=5, flags=0x00, stream_id=5>
          (dep_stream_id=0, weight=101, exclusive=0)
[  0.019] send PRIORITY frame <length=5, flags=0x00, stream_id=7>
          (dep_stream_id=0, weight=1, exclusive=0)
[  0.019] send PRIORITY frame <length=5, flags=0x00, stream_id=9>
          (dep_stream_id=7, weight=1, exclusive=0)
[  0.019] send PRIORITY frame <length=5, flags=0x00, stream_id=11>
          (dep_stream_id=3, weight=1, exclusive=0)
[  0.019] send HEADERS frame <length=43, flags=0x25, stream_id=13>           -- 报头帧 请求头或响应头，同时也用于打开一个流。
          ; END_STREAM | END_HEADERS | PRIORITY       
          (padlen=0, dep_stream_id=11, weight=16, exclusive=0)
          ; Open new stream
          :method: GET
          :path: /
          :scheme: https
          :authority: h2.kekek.cc
          accept: */*
          accept-encoding: gzip, deflate
          user-agent: nghttp2/1.32.0
[  0.020] recv SETTINGS frame <length=0, flags=0x01, stream_id=0>
          ; ACK
          (niv=0)
[  0.020] recv (stream_id=13) :method: GET
[  0.021] recv (stream_id=13) :path: /css/index.css
[  0.021] recv (stream_id=13) :scheme: https
[  0.021] recv (stream_id=13) :authority: h2.kekek.cc
[  0.021] recv (stream_id=13) accept-encoding: gzip, deflate
[  0.021] recv (stream_id=13) user-agent: nghttp2/1.32.0
[  0.021] recv PUSH_PROMISE frame <length=71, flags=0x04, stream_id=13>       -- 承诺推送帧
          ; END_HEADERS
          (padlen=0, promised_stream_id=2)
[  0.021] recv (stream_id=13) :status: 200
[  0.021] recv (stream_id=13) server: nginx/1.13.12
[  0.021] recv (stream_id=13) date: Thu, 31 May 2018 06:17:14 GMT
[  0.021] recv (stream_id=13) content-type: text/html
[  0.021] recv (stream_id=13) last-modified: Thu, 24 May 2018 07:28:34 GMT
[  0.021] recv (stream_id=13) etag: W/"5b0669a2-67c"
[  0.021] recv (stream_id=13) content-encoding: gzip
[  0.021] recv HEADERS frame <length=107, flags=0x04, stream_id=13>
          ; END_HEADERS
          (padlen=0)
          ; First response header
[  0.021] recv DATA frame <length=638, flags=0x01, stream_id=13>              -- DATA 数据帧，用来携带HTTP请求或响应
          ; END_STREAM                                                        -- END_STREAM 0x01用来表示当前帧是当前流的最后一帧
[  0.021] recv (stream_id=2) :status: 200
[  0.021] recv (stream_id=2) server: nginx/1.13.12
[  0.021] recv (stream_id=2) date: Thu, 31 May 2018 06:17:14 GMT
[  0.021] recv (stream_id=2) content-type: text/css
[  0.021] recv (stream_id=2) last-modified: Thu, 24 May 2018 07:28:32 GMT
[  0.021] recv (stream_id=2) etag: W/"5b0669a0-1bcd"
[  0.021] recv (stream_id=2) content-encoding: gzip
[  0.021] recv HEADERS frame <length=106, flags=0x04, stream_id=2>
          ; END_HEADERS
          (padlen=0)
          ; First push response header
[  0.021] recv DATA frame <length=1857, flags=0x01, stream_id=2>
          ; END_STREAM
[  0.021] send GOAWAY frame <length=8, flags=0x00, stream_id=0>
          (last_stream_id=2, error_code=NO_ERROR(0x00), opaque_data(0)=[])
```

### 多路复用
HTTP1.x一个连接只能处理一个请求，开启`keep-alive`后可以复用连接（前一个处理完后复用），HTTP2可以一个连接同时处理多个请求响应。对于每个域名浏览器打开一个连接就能同时处理多个请求响应，这将突破http/1.1协议下浏览器对于同一个域名最大连接数的限制。客户端和服务器可以将 HTTP 消息分解为互不依赖的帧，然后交错发送，最后再在另一端把它们重新组装起来。

![](/images/http2-multiplexing.png)

下面我们做一个测试，在`http/1.1`模式和`http2`协议下分别访问下面页面：
``` html
<body>
    <img src="img.png?_=1" alt="img_1" width="10"/>
    <img src="img.png?_=2" alt="img_2" width="10"/>
    ...
    <!-- 共加载100张图片 -->
    <img src="img.png?_=100" alt="img_100" width="10"/>
</body>
```

我们查看服务器连接，可以看到443端口（http2）只有1个连接，而80端口（http/1.1）有6（Chrome下）个连接。

![](/images/http2-connections.png)

> 测试时发现http/1.1下多个连接比http2的多路复用更稳定，http2测试过程中没有能加载出来100张全部图片。

** HTTP1.1 vs HTTP2 **
![](/images/http1vshttp2.jpg)

### 参考
- [HTTP/2 资料汇总](https://imququ.com/post/http2-resource.html)
- [nginx配置http2无效不起作用](https://www.phpsong.com/2818.html)
- [HTTP/2 简介](https://developers.google.com/web/fundamentals/performance/http2/?hl=zh-cn)
- [HTTP2简介和基于HTTP2的Web优化](https://github.com/creeperyang/blog/issues/23)
- [借助 HTTP/2 打造更迅捷的 Web 体验](https://w3ctech.com/topic/862)
- [HTTP2特性预览和抓包分析](http://www.cnblogs.com/etoah/p/5891285.html)
- [HTTP2.0关于多路复用的研究](https://www.nihaoshijie.com.cn/index.php/archives/698/)
- [Hypertext Transfer Protocol Version 2 (HTTP/2)](https://httpwg.org/specs/rfc7540.html)
- [Web性能权威指南](https://book.douban.com/subject/25856314/)
