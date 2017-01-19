### Node.js最佳实践

#### 使用全局变量
```javascript
global.CONSTANTS = constants;
global.E = E;
global.PID = process.pid;
global.WORKSPACE = __dirname;
global.TEMP = path.join(__dirname, '.temp');
global.APP_ID = uuid.v4();
global.NOOP = _.noop;
```

```shell
node -r global test.js
```

#### 全局临时目录`.temp` & `WORKSPACE`  
```javascript
const mkdirp = require('mkdirp');
const path = require('path');

// init
(() => {
    mkdirp.sync(path.join(__dirname, '.temp'));
    mkdirp.sync(path.join(__dirname, 'logs'));
})();
```



#### 二级缓存
lru-cache + redis

#### co-catch-next | promise.catch-next
```javascript
co(function* () {
	// ...
}).catch(next);
```

```javascript
Q.fcall(promisedStep1)
	.then(promisedStep2)
	.then(promisedStep3)
	.then(promisedStep4)
	.then((value4) => {
	    // Do something with value4
	})
	.catch(next);
```

#### 异常处理 catch-next & `uncaughtException` & `domain`
``` javascript
app.use(function(err, req, req, next) {
	console.error(err);
	res.send('HTTP-Internal Server Error');
});
```

```javascript
process.on('uncaughtException', (err) => {
    console.error(err);
	db.stop(function(err) {
		process.exit(1);
	});
});
```

```javascript
var domain = require('domain');

module.exports = function (handler) {
    return function domainMiddleware(req, res, next) {
        var reqDomain = domain.create();

        res.on('close', function () {
            reqDomain.dispose();
        });

        reqDomain.on('error', function (err) {
            if (typeof handler === 'function') {
                handler(err, req, res, next);
            } else {
                next(err);
            }
        });

        reqDomain.run(next);
    };
};
```

#### 退出程序
```javascript
process.on('SIGINT', () => {
	db.stop((err) => {
        process.exit(err ? 1 : 0);
	});
});
```

#### `pm2.yml`配置
```yml
# pm2.yml
apps:
  - script   : './app.js'
      name     : 'app'
      exec_mode: 'cluster'
      instances: 'max'
      watch    : false
      env :
          NODE_ENV: local
      env_vps:
          NODE_ENV: vps
      env_production:
          NODE_ENV: production
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
      combine_logs: true
      merge_logs: true
      error_file: './logs/pm2_app_err.log'
      out_file: './logs/pm2_app_out.log'
      autorestart: true
      force: true

# pm2 start pm2.yml --env production
```

### 参考
[【1】](http://www.infoq.com/cn/articles/quit-scheme-of-node-uncaughtexception-emergence) [【2】](https://fengmk2.com/blog/2012/12/domain_module.html)
