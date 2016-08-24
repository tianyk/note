### 原理
![](images/QQ20160825-1@2x.jpg)

### 部署
#### Nginx
```
server {
	server_name YOUR_DOMAINNAME_HERE;
    listen 443;
    ssl on; # 开启https
    ssl_certificate  /usr/local/nginx/conf/server.crt; // 公钥
    ssl_certificate_key  /usr/local/nginx/conf/server_nopwd.key; // 私钥
}
```

#### Node Server
``` javascript
var server = http.createServer(app);
var httpsServer = https.createServer({
    key: fs.readFileSync('cert/yunshipei.com.key'),
    cert: fs.readFileSync('cert/yunshipei.com.crt')
}, app);

server.listen(80);
server.on('error', onError);
server.on('listening', onListening);

httpsServer.listen(443);
httpsServer.on('error', onError);
httpsServer.on('listening', onListening);
```

### 参考
【图解HTTPS 第七章】[【1】](http://blog.csdn.net/sean_cd/article/details/6966130) [【2】](https://zhuanlan.zhihu.com/p/22142170)
