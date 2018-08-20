---
title: HTTPS
date: 2016-08-23 09:48:39
updated: 2018-06-28 18:37:31
tags: 
- http
- https
---
## [TODO]HTTPS

### 原理
![](/images/QQ20160825-1@2x.jpg)

### 部署

<https://mozilla.github.io/server-side-tls/ssl-config-generator/>
<https://cipherli.st/>
<https://weakdh.org/sysadmin.html>

#### Nginx配置
``` nginx
server {
    listen 443 ssl;
    server_name YOUR_DOMAINNAME_HERE;

    ssl_certificate        /etc/ssl/kekek.cc/chained.pem;   // 公钥
    ssl_certificate_key    /etc/ssl/kekek.cc/domain.key;	// 私钥		
    ssl_session_timeout    1d;
    ssl_session_cache      shared:SSL:50m;
    ssl_session_tickets    off;
}
```

#### Node.js配置
``` javascript
var server = http.createServer(app);
var httpsServer = https.createServer({
    key: fs.readFileSync('/etc/ssl/kekek.cc/domain.key'),
    cert: fs.readFileSync('/etc/ssl/kekek.cc/chained.pem')
}, app);

server.listen(80);
server.on('error', onError);
server.on('listening', onListening);

httpsServer.listen(443);
httpsServer.on('error', onError);
httpsServer.on('listening', onListening);
```

### 参考
- [图解HTTP 第七章](https://book.douban.com/subject/25863515/)
- [深入揭秘HTTPS安全问题&连接建立全过程](https://zhuanlan.zhihu.com/p/22142170)
- [HTTPS工作原理](https://blog.csdn.net/sean_cd/article/details/6966130)