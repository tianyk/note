---
title: 四层网络代理
author: tyk
date: 2018-08-15 18:35:46
tags:
---

## 四层网络代理
![](/images/osi.gif)

### HAProxy
安装
``` shell 
$ wget http://www.haproxy.org/download/1.8/src/haproxy-1.8.13.tar.gz
$ tar -zxvf haproxy-1.8.13.tar.gz
$ cd haproxy-1.8.13
$ make TARGET=linux26
$ make install 
```

> TARGET 表示内核，可以通过`uname -a`查看。

注册服务
```
$ cd /etc/init.d
$ touch haproxy
$ vim haproxy
#!/bin/bash

# chkconfig: 2345 20 80
# description: Customized service

start() {
    echo 'This is my service, start command'
    echo ''
}

stop() {
    echo 'This is my service, stop command'
    echo ''
}

restart() {
    echo 'This is my service, restart command'
    echo ''
}

status() {
    echo 'This is my service, status command'
    echo ''
}

case "$1" in 
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    status)
        status
        ;;
    *)
        echo 'Usage: service myservice {start|status|stop|restart}'
        ;;
esac
```


### LVS

### Nginx


### 参考
- [HAProxy从零开始到掌握](https://www.jianshu.com/p/c9f6d55288c0)