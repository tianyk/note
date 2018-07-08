---
title: Nginx日志配置与切割
author: tyk
date: 2018-07-07 10:37:30
category: nginx 
tags: 
- nginx
- logrotate
- log 
---
## Nginx日志配置与切割

Nginx 日志配置非常简单，首先通过`log_format`指令配置一个格式。然后使用`access_log`指令开启即可。

``` nginx 
http {
    # 日志格式 第二个参数是格式名字，可以配置多个format。后面access_log指令使用哪个格式就写这个格式的名字。
    log_format main '$remote_addr - $remote_user [$time_local] '
                       '"$request" $status $bytes_sent '
                       '"$http_referer" "$http_user_agent"';

    access_log /var/log/nginx/access.log main;
}

# 或者每个虚拟主机配置单独的日志文件夹
server {
    access_log /var/log/nginx/$host/access.log main;
}
```

### 条件日志
我们有一个心跳检测的服务，定期会向服务器发请求。这个请求每天会发很多次，这个请求的日志也是非常多的。这个日志没什么意义，我们可以把它忽略掉。

第一种方法就是配置一个location匹配到这个心跳检测接口将日志关掉。
``` nginx 
location = /heartbeat {
    access_log off;
    proxy_pass http://myserver;
}
```

上面方法不是很灵活，我们要重复配置。有没有办法只配置一处就能做到呢？查看Nginx文档，发现有一个条件日志配置示例：

``` nginx 
http {
    map $uri $loggable {
        # 可以使用正则
        ~\.(jpg|png|gif|webp)$  0; # 不记录图片
        /heartbeat              0; # 不记录心跳检测
        default                 1;
    }

    access_log /var/log/nginx/access.log main if=$loggable;
}
```


### 日志切割

当Nginx接收到`USR1`时会重新打开日志文件。
``` shell
mv /var/log/nginx/access.log /var/log/nginx/access.log-20180706
kill -USR1 `cat /var/run/nginx.pid`
```
上面方案很不灵活，需要手动处理。我们可以使用crontab或者[logrotate](https://github.com/logrotate/logrotate)来做到自动化。

1. crontab 

    ``` shell 
    #!/bin/bash
    # 0 0 * * * 每天零点执行

    LOG_PATH=/var/log/nginx
    DATE=`date -d "yesterday" +%Y%m%d`
    PID=`cat /var/run/nginx.pid`

    cd $LOG_PATH

    mv access.log access.log-$DATE && zip -mq access.log-$DATE.zip access.log-$DATE
    kill -USR1 $PID
    ```

2. logrotate

    ```
    /var/log/nginx/*.log {
        daily
        dateext
        rotate 30
        compress
        delaycompress
        notifempty
        sharedscripts
        postrotate
            if [ -f /var/run/nginx.pid ]; then
                kill -USR1 `cat /var/run/nginx.pid`
            fi
        endscript
    }
    ```
    > - 第一行要处理的日志，可以使用通配符。后面`{}`包裹日志切割的配置项。
    > - daily：表示每天执行一次，类似的配置还有weekly,monthly每周和每月。
    > - dateext：文件后缀使用日期命名。
    > - rotate 30：保留最近30天的日志。
    > - compress：对日志进行压缩。
    > - delaycompress：延迟压缩，分割完成后延迟一天压缩此日志。
    > - notifempty：忽略空日志。
    > - sharedscripts：执行脚本。
    > - postrotate：日志被切割后执行的脚本，对应的`prerotate`表示在切割前执行的脚本。
    > - endscript：标记脚本结束。
    > - 测试一下脚本：`logrotate -d /etc/logrotate.d/nginx`。
    > - 执行后面的命令能立即看到效果：`logrotate -vf /etc/logrotate.d/nginx`。

### 参考
- [Module ngx_http_log_module](http://nginx.org/en/docs/http/ngx_http_log_module.html)
- [配置 logrotate 的终极指导](https://linux.cn/article-8227-1.html)