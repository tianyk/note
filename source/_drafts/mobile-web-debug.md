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

    [husky](https://github.com/typicode/husky)

    ``` json 
    {
        "hooks": {
        "pre-commit": "npm run lint && npm test"
        }
    }
    ```

2. 引入单元测试 

    极大的减少bug。长期看能提高效率。有些时候需要造假数据，可能跑几次就不能跑了。

3. 统一的错误处理，错误追踪
    ```
    errorHandler 
    requestId 
    ```

    controller、service层都不处理错误，所有错误往上层抛。统一处理。错误统一打印，底层不需要重复打印错误。

    requestId 用来追踪错误。

4. 日志

5. 容错的缓存

    ``` js 
    getIgnoredError()
    setIgnoredError()
    ```

6. 统一参数校验

    数据校验是一个系统必不可少的一部分。router层面统一做数据校验。

    [express-validator](https://github.com/express-validator/express-validator)

    [validator.js](https://github.com/chriso/validator.js)

    ``` js 
    router.post('/templates', [
        auth(),
        body('name').isLength({ min: 1, max: 30 }).withMessage('模板名称最少1个最多30个字符。'),
        body('cover').not().isEmpty().withMessage('封面不能为空。').isURL().withMessage('封面不能合法。'),
        body('tags').not().isEmpty().isArray().withMessage('标签不能为空'),
        body('types').not().isEmpty().isArray().withMessage('模板类型不能为空'),
        body('categories').not().isEmpty().isArray().withMessage('适用类型不能为空。'),
        body('devices').not().isEmpty().isArray().withMessage('适用设备不能为空'),
        body('standard').not().isEmpty().withMessage('模板标准不能为空。').isIn(TEMPLATE_STANDARD).withMessage('不支持的模板标准。'),
        checkError,
        sanitizeBody('repository').customSanitizer(repository => gitUrlParse(repository).toString('ssh'))
    ], TemplateController.create);
    ```

7. 报警机制

    ```
    wechat alarm
    ```

    ``` js 
    class Log {
        constructor(category) {
            this.logger = log4js.getLogger(category);
            this._debug = require('debug')(category);
        }

        trace(...args) {
            this.logger.trace(...args);
        }

        debug(...args) {
            this._debug(...['[DEBUG]', ...args]);
        }

        info(...args) {
            this.logger.info(...args);
        }

        warn(...args) {
            this.logger.warn(...args);
        }

        error(...args) {
            this.logger.error(...args);
        }

        fatal(...args) {
            alarm({ subject: 'Fatal Error', msg: args.join('\r\n') });
            this.logger.fatal(...args);
        }
    }
    ```

8. 系统健壮性 心跳检测

    /_monitoring
    /_heartbeat

9. jwt 

    [jwt](https://jwt.io/)

    统一的开放接口。
