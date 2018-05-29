---
title: nginx开机启动
date: 2016-08-29 14:27:00
tags: nginx
---
### 开机启动Nginx
新建nginx开机启动配置文件
```
vim /etc/init.d/nginx
```

启动脚本
> nginxd、nginx_config等根据实际位置需要修改

``` bash
#! /bin/sh
# chkconfig:         2345 80 20
# description:       Starts and stops a single nginx instance on this system
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: starts the nginx web server

PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
DESC="nginx daemon"
NAME=nginx
DAEMON=/usr/local/nginx/sbin/$NAME
CONFIGFILE=/usr/local/nginx/conf/$NAME.conf
PIDFILE=/usr/local/nginx/logs/$NAME.pid
SCRIPTNAME=/etc/init.d/$NAME

set -e
[ -x "$DAEMON" ] || exit 0

do_start() {
     $DAEMON -c $CONFIGFILE || echo -n "nginx already running"
}

do_stop() {
     kill -INT `cat $PIDFILE` || echo -n "nginx not running"
}

do_reload() {
     kill -HUP `cat $PIDFILE` || echo -n "nginx can't reload"
}

case "$1" in
    start)
        echo -n "Starting $DESC: $NAME"
        do_start
        echo "."
        ;;
    stop)
        echo -n "Stopping $DESC: $NAME"
        do_stop
        echo "."
        ;;
    reload|graceful)
        echo -n "Reloading $DESC configuration..."
        do_reload
        echo "."
        ;;
    restart)
        echo -n "Restarting $DESC: $NAME"
        do_stop
        do_start
        echo "."
        ;;
    *)
        echo "Usage: $SCRIPTNAME {start|stop|reload|restart}" >&2
        exit 3
        ;;
esac

exit 0
```

注册开机启动服务
```
chmod a+x /etc/init.d/nginx

chkconfig --add nginx
chkconfig --level 2345 nginx on
```

### 注意事项
有时间运行chkconfig --add 时会报`服务不支持 chkconfig`错误，这种情况下需要在脚本上面添加下面俩个配置
```
# chkconfig:         2345 80 20
# description:       Starts and stops a single nginx instance on this system
```

### 参考
- [nginx开机自动启动脚本](http://blog.csdn.net/gebitan505/article/details/17606735)
- [Linux下的Nginx安装(开机自启动)](http://www.cnblogs.com/meteoric_cry/archive/2011/01/27/1945882.html) 
- [服务不支持 chkconfig　的解决方法](http://blog.csdn.net/blueman2012/article/details/6706572)
