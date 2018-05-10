---
title: http2
date: 2017-07-05 11:43:41
tags: http
---
## HTTP2

### Server Push

响应头
```
Link: </css/styles.css>; rel=preload; as=style, </js/main.js;>; rel=preload; as=script
```

nginx > 1.13.9 
``` 
# nginx自己处理
location / {
    ...
    http2_push /css/style.css;
    http2_push /js/main.js;
    ...
}

# 后端实现
location = /api {
        proxy_pass http://upstream;
        http2_push_preload on;
}
```

### 头压缩

### 参考
- [HTTP/2 资料汇总](https://imququ.com/post/http2-resource.html)
