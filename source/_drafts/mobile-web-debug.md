---
title: 移动端网页调试
author: tyk
date: 2019-05-12 22:15:36
tags: debug 
---
## 移动端网页调试

### Fiddler & Charles

代理软件，我们可以看到所有的请求响应。

map 

### Eruda

[Eruda](https://github.com/liriliri/eruda) 是一个专为**移动端**设计的调试面板，类似`Chrome DevTools`。

1. 直接引用
``` js
<script src="//lib.baomitu.com/eruda/1.5.4/eruda.min.js"></script>
<script>eruda.init();</script>
```

2. 根据环境加载
``` js 
;(function () {
    var src = 'https://lib.baomitu.com/eruda/1.5.4/eruda.min.js';
    if (!/eruda=true/.test(window.location) && localStorage.getItem('active-eruda') != 'true') return;
    document.write('<scr' + 'ipt src="' + src + '"></scr' + 'ipt>');
    document.write('<scr' + 'ipt>eruda.init();</scr' + 'ipt>');
})();
```

### debug 
用[debug](https://www.npmjs.com/package/debug)取代`console.log`。

debug.js 
``` js 
function noop() {};

let debug = () => noop(); 
if (process.env.NODE_ENV !== 'production') {
    debug = require('debug');
}

module.export = debug;
```

demo.js 
```js
const debug = require('./debug.js')('ut:demo');
debug('foo: %s', 'bar');
```

``` js 
localStorage.debug = 'ut:*'
```

### Safari 调试

---------------

1. 引入githook + eslint 
2. 引入单元测试 
3. 统一的错误处理，错误追踪
    ```
    errorHandler 
    requestId 
    ```
4. 日志
5. 容错的缓存
    ``` js 
    getIgnoredError()
    setIgnoredError()
    ```
6. 统一参数校验
7. 报警机制
    ```
    wechat alarm
    ```
8. 系统健壮性 心跳检测
    /_monitoring
    /_heartbeat
9. jwt 
