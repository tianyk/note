---
title: 移动端网页调试
author: tyk
date: 2019-05-12 22:15:36
tags: debug 
---
## 移动端网页调试

### Fiddler & Charles

代理软件，我们可以看到所有的请求响应。

Map Local 
将服务器器上的一个文件映射到本地，常用于调试线上问题。
![Map Local](/images/charles-map-local.png)

Rewrite
可以用来重写请求、响应等。
![Map Local](/images/charles-write.png)

### Eruda

[Eruda](https://github.com/liriliri/eruda) 是一个专为**移动端**设计的调试面板，类似`Chrome DevTools`。

![](/images/eruda.png)

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

使用[debug](https://www.npmjs.com/package/debug)取代`console.log`。只有开启时才能看到，避免控制台出现大量调试信息。日志很多时可以根据模块筛选，只打印想要关注的日志。

![](/images/debug-module.png)

### 使用 Safari/Chrome 调试 Webview

> Webview 需要开启调试模式

![](/images/safari-debug.png)

[在安卓设备上使用 Chrome 远程调试功能](https://wiki.jikexueyuan.com/project/chrome-devtools/remote-debugging-on-android.html)


## 服务器端

1. 引入 githook + eslint 

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

    <http://vcs.51talk.com/ccs/ccs-ng/blob/master/middleware/error_handler.js>

    controller、service层都不处理错误，所有错误往上层抛。统一处理，错误只打印一遍。使用 `requestId` 用来追踪错误。

    ![](/images/error-requestId.png)

4. 日志

    <http://vcs.51talk.com/ccs/ccs-ng/blob/master/utils/log.js>

5. 容错的缓存

    <http://vcs.51talk.com/ccs/ccs-ng/blob/master/service/redis.js#L90>

    ``` js 
    getIgnoredError()
    setIgnoredError()
    ```

6. 统一参数校验

    数据校验是一个系统必不可少的一部分。router层统一做数据校验及清洗。

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

        // ...

        fatal(...args) {
            alarm({ subject: 'Fatal Error', msg: args.join('\r\n') });
            this.logger.fatal(...args);
        }
    }
    ```

8. 系统健壮性 心跳检测

    - /_heartbeat
        
        检查数据库、Redis等核心服务是否存活。

        ``` js  
        exports.heartbeat = (req, res, next) => {
            (async () => {
                try {
                    const { cache, db } = await heartbeat();
                    if (_.has(req.query, '_v')) {
                        res.json({ cache, db });
                    } else {
                        res.end('healthy');
                    }
                } catch (err) {
                    res.status(500).end('unhealthy');
                }
            })().catch(next);
        };
        ```

    - /_monitoring

        查看服务器状态，方便确定线上信息。

        ``` shell 
        curl http://api.ccs.51talk.com/_monitoring
        ```

        ``` json 
        {
            "workspace": "/data/apps/ccs",
            "now": 1559109003360,
            "version": "v10.13.0",
            "versions": {
                "http_parser": "2.8.0",
                "node": "10.13.0",
                "v8": "6.8.275.32-node.36",
                "uv": "1.23.2",
                "zlib": "1.2.11",
                "ares": "1.14.0",
                "modules": "64",
                "nghttp2": "1.34.0",
                "napi": "3",
                "openssl": "1.1.0i",
                "icu": "62.1",
                "unicode": "11.0",
                "cldr": "33.1",
                "tz": "2018e"
            },
            "uptime": 2875.074,
            "memoryUsage": {
                "rss": "73.21MB",
                "heapTotal": "50.76MB",
                "heapUsed": "44.73MB",
                "external": "590.34KB"
            },
            "pid": 14457,
            "osPlatform": "linux",
            "osRelease": "3.10.0-693.2.2.el7.x86_64",
            "hostname": "courseware-training-bjaly-23",
            "cpuUsage": {
                "user": 15256521,
                "system": 1494771
            },
            "nodeEnv": "production",
            "nodeAppInstance": 0,
            "pkg": {
                "name": "ccs-ng",
                "version": "1.0.19"
            }
        }
        ```

9. jwt 

    [jwt](https://jwt.io/)

    对各种语言都有很好的支持，方便不同系统间对接。
