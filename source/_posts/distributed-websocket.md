---
title: WebSocket服务集群
author: tyk
tags:
  - websocket
  - distributed
date: 2018-05-11 17:07:08
---


## WebSocket服务集群

网络套接字只能在内存中维护，多实例时就会遇到一个问题。如果A和B发消息，如果AB在一台机器。找到B的套接字就可以发送消息了，如果AB不在同一台机器就需要消息转发。我们要记录AB分别在哪台机器，当A要给B发消息时先查到B所在的机器，直接将此消息转发给B所在的机器，然后有它给B发消息。

如果消息大规模的需要内部转发，系统就会变得比较复杂并且因为有转发的过程效率将不会很高。我们应该尽可能的让要发消息的两个人尽量在一台机器，减少转发的几率。

一般情况下，我们会给要互发消息的用户维护一个虚拟的房间。例如A发消息给B时消息直接发给此房间，此房间将消息转发给B。

我们使用的WebSocket协议是在HTTP/1.1协议上升级而成的，这里我们能拿到URL，如果将虚拟房间号添加到URL中。前置负载根据URL进行负载，那么我们就能将同一个房间的两个人分配到一台机器上。

这里面有一个问题，默认情况下我们将同一个房间的用户都会分派到一台机器。但是如果我们添加机器时原来的机器顺序就会被打乱，可能会将房间的新用户分配到另外一台机器。这时我们就需要[一致性Hash](/2017/10/16/consistent-hashing/)，虽然是一致性Hash但是还是会有少数的用户被分配到其它服务器上去。但是现在已经大大减少内部消息转发，只有部分特别的情况下需要做少量消息的转发。

![](/images/distributed-websocket.jpg)

```nginx
http {
    map $http_upgrade $connection_upgrade {
        default upgrade;
        ''      close;
    }

    upstream websocket {
        server 127.0.0.1:8081;
        server 127.0.0.1:8082;

        # 一致性Hash
        hash $request_uri consistent;
        # hash_method crc32;
    }

    server {
        listen       8080;
        ...
        location ^~ /ws {
            proxy_pass http://websocket;
            proxy_read_timeout 1d;

            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection $connection_upgrade;
        }
    }
}
```

### 参考
- [WebSocket proxying](http://nginx.org/en/docs/http/websocket.html)
- [Module ngx_http_upstream_module](http://nginx.org/en/docs/http/ngx_http_upstream_module.html#hash)