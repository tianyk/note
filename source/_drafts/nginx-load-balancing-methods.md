---
title: Nginx负载均衡算法
author: tyk
date: 2018-05-23 14:29:42
tags: 
- nginx
- 负载均衡
- 一致性Hash
---

## Nginx负载均衡算法

- round-robin 

默认的算法，循环平均分配到每台机器。

``` nginx 
http {
    upstream myapp1 {
        server srv1.example.com;
        server srv2.example.com;
        server srv3.example.com;
    }

    server {
        listen 80;

        location / {
            proxy_pass http://myapp1;
        }
    }
}
```

- least-connected

分配到连接最少的机器。

``` nginx 
upstream myapp1 {
    least_conn;
    server srv1.example.com;
    server srv2.example.com;
    server srv3.example.com;
}
```

- ip-hash 

根据ip算Hash，同一个ip的请求会被分发到同一个节点。

``` nginx 
upstream myapp1 {
    ip_hash;
    server srv1.example.com;
    server srv2.example.com;
    server srv3.example.com;
}
```

- consistent_hash

会有少量连接会备份发的新节点。

``` nginx 
upstream myapp1 {
    hash $request_uri consistent;
    server srv1.example.com;
    server srv2.example.com;
    server srv3.example.com;
}
```

> 测试随着新节点的添加，老节点上部分请求会被重新分发到新节点。

``` javascript
// server.js
const http = require('http');
const argv = process.argv;
const PORT = argv[2];

const server = http.createServer((req, res) => {
    console.log(`${PORT}-${req.url}`);
    res.end();
});
server.listen(PORT, () => {
    console.log(`Server running at port ${port}`);
});
```

``` javascript
// client.js
const http = require('http');
const URL = require('url').URL;

async function request(url) {
    let options = new URL(url);
    return new Promise((resolve, reject) => {
        let req = http.request(options, (res) => {
            res.on('end', resolve);
            res.on('data', () => {});
        });
        
        req.on('error', reject);
        req.on('close', () => {});
        req.end();
    });
}

async function batchRequest () {
    for (let i = 0; i < 100; i++) 
        await request(`http://127.0.0.1:8080/hash/r-${i}`);
}

batchRequest()
    .then(console.log)
    .catch(console.error);
```

### 参考
- [Using nginx as HTTP load balancer](http://nginx.org/en/docs/http/load_balancing.html)
- [Module ngx_http_upstream_module](http://nginx.org/en/docs/http/ngx_http_upstream_module.html)