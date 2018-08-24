---
title: HTTP代理服务器
author: tyk
tags:
  - http
  - proxy
date: 2018-08-24 16:22:30
---


## HTTP代理服务器

科学上网和调试网站时经常会用到代理服务器，那么代理服务器是怎么实现的呢？代理服务器和web服务器本身没有太多差别，如果是走代理请求浏览器会把请求发送到代理服务器，并且请求报文中使用**完整URI**（参考下图中a/b）。

![](/images/http-proxy.png)

使用telnet模拟普通请求
```
$ telnet css.kekek.cc 80
Trying 47.94.202.145...
Connected to css.kekek.cc.
Escape character is '^]'.
GET / HTTP/1.0
host: css.kekek.cc

HTTP/1.1 200 OK
Server: openresty
Date: Fri, 24 Aug 2018 08:48:31 GMT
Content-Type: text/html; charset=UTF-8
Content-Length: 3876
Last-Modified: Thu, 03 May 2018 13:28:06 GMT
Connection: close
ETag: "5aeb0e66-f24"
Accept-Ranges: bytes

<!DOCTYPE html>
<html lang="en">
...
```

使用telnet模拟显示代理请求
```
$ telnet proxy.kekek.cc 1337
Trying 39.106.12.213...
Connected to proxy.kekek.cc.
Escape character is '^]'.
GET http://css.kekek.cc/ HTTP/1.0
host: css.kekek.cc

HTTP/1.1 200 OK
server: openresty
date: Fri, 24 Aug 2018 08:50:21 GMT
content-type: text/html; charset=UTF-8
content-length: 3876
last-modified: Thu, 03 May 2018 13:28:06 GMT
connection: close
etag: "5aeb0e66-f24"
accept-ranges: bytes

<!DOCTYPE html>
<html lang="en">
...
```

HTTPS模式下的代理和HTTP方式会有所不同，因为我们无法解析HTTPS请求。针对这种情况只能使用透传的方式，在tcp层直接将请求转发到目标服务器即可。

### PAC 
现代浏览器几乎都支持 Proxy Auto-Configuration （PAC），这个可以让我们更灵活的使用代理。比如公司网站使用代理其它网站不走代理，有了PAC这都可以做到。PAC是一个JavaScript文件，MIME为`application/x-ns-proxy-autoconfig`。每个PAC文件必须有一个名为`FindProxyForURL(url,host)`的函数，用来计算访问URI时使用的代理服务器。函数返回值格式如下表：

| FindProxyForURL的返回值 |           描　　述           |
| ----------------------- | ---------------------------- |
| DIRECT                  | 不经过任何代理，直接进行连接 |
| PROXY host:port         | 应该使用指定的代理           |
| SOCKS host:port         | 应该使用指定的 SOCKS 服务器  |

示例：
``` javascript
// Proxy Auto-Configuration (PAC) file
var proxy = "PROXY proxy.kekek.cc:1337; DIRECT;";
var direct = 'DIRECT;';

function FindProxyForURL(url, host){
    if (/\.google\.com$/.test(host)) {
        return proxy;
    } else {
        return direct;
    }
}
```

可以使用[pacparser](https://github.com/manugarg/pacparser)来测试我们的PAC文件。
```
brew install pacparser
```

### 代码实现
[GitHub](https://github.com/tianyk/http-proxy)
{% include_code https://raw.githubusercontent.com/tianyk/http-proxy/master/proxy.js %}


### 代码实现

### 参考
- [HTTP权威指南-第六章 代理](https://book.douban.com/subject/10746113/)
- [Proxy Auto-Configuration (PAC) file](https://developer.mozilla.org/en-US/docs/Web/HTTP/Proxy_servers_and_tunneling/Proxy_Auto-Configuration_(PAC)_file)