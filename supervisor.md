### supervisor

supervisor就是用Python开发的一套通用的进程管理程序，能将一个普通的命令行进程变为后台daemon，并监控进程状态，异常退出时能自动重启。

#### 安装

```
sudo pip install supervisor
```

#### 配置

生成配置文件

```
echo_supervisord_conf > /etc/supervisor/supervisord.conf
```

> 修改 supervisord.conf的文件[include]配置，可以用来指包含所有的配置文件[include] files = /etc/supervisor/conf.d/* .conf

启动supervisord

```
supervisord -c /etc/supervisor/supervisord.conf
```

program 配置 在`/etc/supervisor/`目录下新建一个文件www.conf

```
[program:express]
directory = /home/node/projects/express ; 项目目录启动目录
command = node bin/www  ; 启动命令，可以看出与手动在命令行启动的命令是一样的
autostart = true     ; 在 supervisord 启动的时候也自动启动
startsecs = 5        ; 启动 5 秒后没有异常退出，就当作已经正常启动了
autorestart = true   ; 程序异常退出后自动重启
startretries = 5     ; 启动失败自动重试次数，默认是 3
user = node          ; 用哪个用户启动
redirect_stderr = true  ; 把 stderr 重定向到 stdout，默认 false
stdout_logfile_maxbytes = 100MB  ; stdout 日志文件大小，默认 50MB
stdout_logfile_backups = 20     ; stdout 日志文件备份数
; stdout 日志文件，需要注意当指定目录不存在时无法正常启动，所以需要手动创建目录（supervisord 会自动创建日志文件）
stdout_logfile = /var/log/express_stdout.log
environment=NODE_ENV=production
```

使用 supervisorctl  
> Supervisorctl 是 supervisord 的一个命令行客户端工具，启动时需要指定与 supervisord 使用同一份配置文件

```
supervisorctl -c /etc/supervisor/supervisord.conf
```

启动后会进入一个交互环境  
* status ; 获得所有程序状态  
* stop express; 停止express这个项目  
* start express; 启动express这个项目  
* shutdown ; 关闭所有项目  
* reread ; 读取有更新（增加）的配置文件，不会启动新添加的程序* update ; 重启配置文件修改过的程序

### 参考

[【1】](http://www.ttlsa.com/linux/using-supervisor-control-program/) [【2】](http://www.liaoxuefeng.com/article/0013738926914703df5e93589a14c19807f0e285194fe84000)
