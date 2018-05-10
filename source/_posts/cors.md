---
title: 跨域资源共享 CORS
date: 2017-03-03 10:27:33
tags: 
- cors
- ajax
---


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

### 参考
[【1】](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS)
