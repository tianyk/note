1.	使用全局变量

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

2.	全局临时目录`.temp` & `WORKSPACE`

3.	`pm2.yml`配置

	```yml
	# pm2.yml
	apps:
	  - script   : './app.js'
	    name     : 'farm'
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
	    error_file: './logs/pm2_farm_err.log'
	    out_file: './logs/pm2_farm_out.log'
	    autorestart: true

	# pm2 start pm2.yml --env production
	```

4.	二级缓存

	lru-cache + redis

5.	co-catch-next | promise.catch-next
	```javascript
	co(function* () {

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

6.	异常处理 catch-next & `uncaughtException`

	``` javascript
	app.use(function(err, req, req, next) {
		console.error(err);
		res.send('HTTP-Internal Server Error');
	});
	```

	```javascript
	process.on('uncaughtException', (err) => {
	    console.error(err);
		// db.close();
	    process.exit(1);
	});
	```

7. 退出程序

	```javascript
    process.on('SIGTERM', () => {
		// db.close();
		process.exit(0);
    });
	```
