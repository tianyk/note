---
title: 四层网络代理
author: tyk
date: 2018-08-15 18:35:46
tags:
---

## 四层网络代理
![](/images/osi.gif)

### HAProxy
1. 安装

    ``` shell 
    wget http://www.haproxy.org/download/1.8/src/haproxy-1.8.13.tar.gz
    tar -zxvf haproxy-1.8.13.tar.gz
    cd haproxy-1.8.13
    make TARGET=linux26
    make install 
    ```

    > TARGET 表示内核，可以通过`uname -a`查看。

2. 注册为服务

    ``` shell
    touch /etc/init.d/haproxy
    vim haproxy
    ```

    ``` shell 
    #!/bin/bash

    # chkconfig: 2345 20 80
    # description: Customized service
    set -e

    PATH=/sbin:/bin:/usr/sbin:/usr/bin:/usr/local/sbin
    PROGNAME=haproxy
    DAEMON=/usr/local/sbin/haproxy
    CONFIG=/etc/haproxy.cfg
    PIDFILE=/var/run/haproxy.pid
    DESC="HAProxy daemon"
    SCRIPTNAME=/etc/init.d/haproxy

    # Gracefully exit if the package has been removed.
    test -x $DAEMON || exit 0

    start()
    {
        echo -e "Starting $DESC: $PROGNAME\n"
        $DAEMON -f $CONFIG
        echo "."
    }

    stop()
    {
        echo -e "Stopping $DESC: $PROGNAME\n"
        haproxy_pid="$(cat $PIDFILE)"
        kill $haproxy_pid
        echo "."
    }

    restart()
    {
        echo -e "Restarting $DESC: $PROGNAME\n"
        $DAEMON -f $CONFIG -p $PIDFILE -sf $(cat $PIDFILE)
        echo "."
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
    *)
        echo "Usage: $SCRIPTNAME {start|stop|restart}" >&2
        exit 1
        ;;
    esac

    exit 0
    ```

    ``` shell 
    chmod +x /etc/init.d/haproxy
    chkconfig --add haproxy
    ```

3. 配置

    HTTP模式：
    ``` haproxy
    global # 全局属性
        daemon  # 以daemon方式在后台运行
        maxconn 256  # 最大同时256连接
        pidfile /var/run/haproxy.pid  # 指定保存HAProxy进程号的文件

    defaults # 默认参数
        mode http  # http模式
        option http-keep-alive   # 使用keepAlive连接
        option forwardfor        # 记录客户端IP在X-Forwarded-For头域中
        option httpchk HEAD /heartbeat.html    # 定义默认的健康检查策略
        timeout connect 5000ms  # 连接server端超时5s
        timeout client 50000ms  # 客户端响应超时50s
        timeout server 50000ms  # server端响应超时50s

    frontend http-in # 入口 前端服务 http-in 
        bind *:8080  # 监听8080端口
        default_backend speed  # 请求转发至名为"speed"的后端服务

    backend speed # 后端服务 speed
        balance roundrobin
        # backend speed 中只有两个后端服务，名字叫 server10、server11，起在本机的 9099 端口，HAProxy 同时最多向这个服务发起32个连接
        # check 心跳检测 每1000ms检测一次 两次成功视为节点UP，三次失败视为节点DOWN
        server server10 10.0.1.10:9099 maxconn 32 check inter 1000ms rise 2 fall 3 
        server server11 10.0.1.11:9099 maxconn 32 check inter 1000ms rise 2 fall 3 
    ```

    TCP模式：

### LVS

### Nginx


### 参考
- [HAProxy从零开始到掌握](https://www.jianshu.com/p/c9f6d55288c0)