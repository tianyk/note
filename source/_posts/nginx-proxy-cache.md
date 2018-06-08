---
title: Nginx缓存配置
date: 2017-10-31 19:17:15
tags: 
- nginx
- cache
---
## Nginx 缓存

> 默认情况下，NGINX需要考虑从原始服务器得到的Cache-Control标头。当在响应头部中Cache-Control被配置为Private，No-Cache，No-Store或者Set-Cookie，NGINX不进行缓存。NGINX仅仅缓存GET和HEAD客户端请求。


### proxy_cache_path
> proxy_cache_path用来设置缓存的路径和配置

**示例**
```
proxy_cache_path /usr/local/openresty/nginx/proxy_cache/ levels=1:2 keys_zone=my_cache:5m max_size=1g inactive=7d;
```

| 参数 | 说明 |
|----|----|
| `/usr/local/openresty/nginx/proxy_cache/` |  表示缓存文件目录。 |
| `levels=1:2` | 将大量的文件放置在单个目录中会导致文件访问缓慢。这里指定缓存空间有两层hash目录，第一层目录为1个字母，第二层为2个字母，保存的文件名会类似 `/usr/local/openresty/nginx/proxy_cache/`**c**`/`**29**`/01524fae79697630d0454ba3fabd9`**29c**。 |
| `keys_zone=my_cache:5m` | 设置一个共享内存区，该内存区用于存储缓存键和元数据，有些类似计时器的用途。将键的拷贝放入内存可以使NGINX在不检索磁盘的情况下快速决定一个请求是`HIT`还是`MISS`，这样大大提高了检索速度。一个1MB的内存空间可以存储大约8000个key。|
| `max_size=1g` | 设置了缓存的上限。 | 
| `inactive=7d` | inactive 指定了项目在不被访问的情况下能够在内存中保持的时间。在上面的例子中，如果一个文件在7天之内没有被请求，则缓存管理将会自动将其在内存中删除，不管该文件是否过期。该参数默认值为10分钟（10m）。注意，非活动内容有别于过期内容。NGINX不会自动删除由缓存控制头部指定的过期内容（本例中Cache-Control:max-age=120）。过期内容只有在`inactive`指定时间内没有被访问的情况下才会被删除。如果过期内容被访问了，那么NGINX就会将其从原服务器上刷新，并更新对应的`inactive`计时器。 |


### proxy_cache
> 配置在location中，用来启用缓存
`proxy_cache`的值是上面proxy_cache_path配置中`keys_zone`缓存的名字。

```
location / {
    ...
    proxy_cache my_cache;
}
```

### proxy_cache_methods
该指令用于设置缓存哪些HTTP方法，默认缓存HTTP GET/HEAD方法，不缓存HTTP POST方法。
```
location / {
    ...
    proxy_cache_methods GET HEAD;
}
```

### proxy_cache_min_uses
是指同一个url，不管时间间隔多长，是否在一个缓存周期外，只要总次数到达`proxy_cache_min_uses`次数，就会触发缓存功能。后续缓存失效以后，只要访问一次，又会缓存。`proxy_cache_min_uses`默认值是`1`，当缓存不断被填满时，这项设置便十分有用。

```
location / {
    ...
    proxy_cache_min_uses 3;
}
```

### proxy_cache_use_stale
当无法从原始服务器获取最新的内容时，NGINX可以分发缓存中的陈旧内容。这种情况一般发生在关联缓存内容的原始服务器宕机或者繁忙时。比起对客户端传达错误信息，NGINX可发送在其内存中的陈旧的文件。NGINX的这种代理方式，为服务器提供额外级别的容错能力，并确保了在服务器故障或流量峰值的情况下的正常运行。

`proxy_cache_use_stale`还有个取值`updating`，它的意思在缓存过期时当第一个请求正在获取新资源的时候如果有其它请求过来，那么现在先给它们旧的资源。

```
location / {
    ...
    proxy_cache_use_stale error timeout http_500 http_502 http_503 http_504;
}
```

### proxy_cache_lock
当`proxy_cache_lock`被启用时，当多个客户端请求一个缓存中不存在的文件（或称之为一个`MISS`），只有这些请求中的第一个被允许发送至服务器。其他请求在第一个请求得到满意结果之后在缓存中得到文件。如果不启用`proxy_cache_lock`，则所有在缓存中找不到文件的请求都会直接与服务器通信。

这和`proxy_cache_use_stale`取`updating`不太一样，`proxy_cache_use_stale`取`updating`时后续的请求不会等待，而是直接先使用过期的资源。

```
location / {
    ...
    proxy_cache_lock on;
}
```

### proxy_cache_revalidate
缓存再验证，使用HTTP的304机制。文件过期不代表文件真的有变化。

```
location / {
    ...
    proxy_cache_revalidate on;
}
```

### proxy_cache_valid 
该指令用于对不同返回状态码的URL设置不同的缓存时间。

```
location / {
    ...
    proxy_cache_valid 200 302 10m;
    proxy_cache_valid 301 1h;
    proxy_cache_valid any 1m;
}
```

### proxy_ignore_headers
对于源站而言，Nginx也就是一个大的浏览器，源站告诉Nginx的Expires/Cache-Control指定了max-age值，按照规则是轮不到proxy_cache_valid的。那么如果一定要根据Nginx缓存时间为准怎么办呢？那就是忽略源站的Expires/Cache-Control控制。

location / {
    ...
    proxy_ignore_headers Cache-Control;
    proxy_ignore_headers Expires;
}

### ngx_cache_purge
如果要想更灵活点，我们可能还需要清理缓存功能。默认Nginx缓存模块没提供这个功能，我们需要使用一个第三方的模块来实现[ngx_cache_purge](https://github.com/FRiCKLE/ngx_cache_purge)


### 示例
```
http {
    ...
    proxy_cache_path /usr/local/openresty/nginx/proxy_cache/ levels=1:2 keys_zone=my_cache:5m max_size=1g inactive=7d;
    ...
}

location / {
    ...
    proxy_cache my_cache;
    proxy_cache_revalidate on;
    proxy_cache_use_stale error timeout http_500 http_502 http_503 http_504;
    proxy_cache_lock on;
    proxy_cache_valid any 1d; # 在源站没有设置缓存时间时生效
    ...
}

```

### 参考
- [NGINX缓存使用官方指南](http://www.jfh.com/jfperiodical/article/949)
- 实战Nginx：取代Apache的高性能Web服务器（第九章）
- [Nginx缓存详细配置](http://www.firefoxbug.com/index.php/archives/2089/)
- <http://nginx.org/en/docs/http/ngx_http_proxy_module.html?#proxy_ignore_headers>
