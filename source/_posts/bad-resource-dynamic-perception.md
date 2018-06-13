---
title: 页面损坏资源动态感知
author: tyk
date: 2018-06-13 16:13:08
tags:
- addEventListener
- useCapture
---

## 页面损坏资源动态感知

网页中会存在某些资源加载失败的情况，如404。如果请求的是我们自己的资源服务器，当资源不存在时服务器端就能记录到。但如资源不在我们服务器或者资源在响应过程中被截断，我们就可以通过下面方法在客户端捕获到加载失败的资源然后上报。

``` javascript
document.addEventListener('error', function (e) {
    var target = e.target;
    if (target.tagName === 'IMG' && -1 !== target.src.indexOf('bad-resource.example.com/report')) return;

    // 上报
    var img = document.createElement('img');
    img.src = 'http://bad-resource.example.com/report?tag=' + target.tagName + '&href=' + encodeURIComponent(target.src || target.href);
    img.width = 0;
    img.height = 0;
    document.getElementsByTagName('body')[0].appendChild(img);
}, true);
```

除了捕获加载失败的资源，我们还可以捕获页面加载了哪些资源。例如检查页面有没有被注入脚本。
``` javascript
document.addEventListener('load', function (e) {
    console.log('document-load: ', e.target.tagName, e.target.src || e.target.href);
}, true);
```
> 对于页面被注入恶意脚本这种情况，我们使用[Content Security Policy](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP)添加资源加载白名单更方便。下图为微信使用的内容安全策略：
![微信 Content Security Policy](/images/wechat-content-security-policy.png)

### 参考
- [EventTarget.addEventListener()](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener)
- [window.onload vs document.onload](https://stackoverflow.com/a/38517365/4942848)
- [addEventListener的第三個參數](http://hax.iteye.com/blog/162718)
- [内容安全策略( CSP )](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP)