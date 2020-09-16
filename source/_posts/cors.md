---
title: 跨域资源共享 CORS
date: 2017-03-03 10:27:33
updated: 2020-09-16 16:21:13
tags: 
- cors
- ajax
---
## CORS

Cross-Origin Resource Sharing（CORS）是HTTP在协议层对处理跨域问题给出的方案。在所有现代浏览器中都可以使用CORS来处理跨域，对于不支持的浏览器可以降级使用JSONP方案代替。

{% iframe https://caniuse.com/cors/embed/description&links 100% 350px %}

### 配置
<https://enable-cors.org/index.html>

### 携带Cookie

跨域ajax请求时默认是不会携带Cookie的，需要设置`withCredentials`为true。

``` javascript 
var invocation = new XMLHttpRequest();
var url = 'http://bar.other/resources/credentialed-content/';
    
function callOtherDomain(){
    if(invocation) {
        invocation.open('GET', url, true);
        invocation.withCredentials = true;
        invocation.onreadystatechange = handler;
        invocation.send(); 
    }
}
```

### 注意

1. preflight

    对于 [复杂请求](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS#%E7%AE%80%E5%8D%95%E8%AF%B7%E6%B1%82) 浏览器会发起预请求，我们可以设置 `Access-Control-Max-Age` 指定了 `preflight` 请求的结果能够被缓存多久。这里需要注意的是浏览器不是根据域名来做缓存的，是根绝URL。如果URL或者Query不一样，每次都会发起 `preflight`。

### 参考
- [HTTP访问控制（CORS）](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS)
