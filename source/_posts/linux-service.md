---
title: Linux服务
date: 2018-02-24 12:39:20
tags: 
---
## Linux服务
Linux服务脚本位于`/etc/rc.d/init.d`，它是一个特殊的shell脚本。

### 标准结构
```shell
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

> `chkconfig: 2345 20 80` (这里作一下特殊说明: `20` 是该程序开机的启动优先级，值越小越优先；`80`是关机时的优先级，值越小越先关闭；这里就可以设定linux值的开关机顺序了）。如果某服务缺省不在任何运行级启动，那么使用 `-` 代替运行级。

### Linux 进程运行的7个等级
```
运行级别0：系统停机状态，系统默认运行级别不能设为0，否则不能正常启动
运行级别1：单用户工作状态，root权限，用于系统维护，禁止远程登陆
运行级别2：多用户状态(没有NFS)
运行级别3：完全的多用户状态(有NFS)，登陆后进入控制台命令行模式
运行级别4：系统未使用，保留
运行级别5：X11控制台，登陆后进入图形GUI模式
运行级别6：系统正常关闭并重启，默认运行级别不能设为6，否则不能正常启动
```

### 常用命令
#### 注册服务
> 需要给予脚本执行权限`chmod +x myservice`
```
chkconfig --add myservice
```

#### 删除服务 
```
chkconfig --del myservice
```

#### 设置启动等级
```
chkconfig [--level <1-6>] myservice [on/off/reset]
# e.g.
chkconfig --level 35 mysqld on
```

#### 服务列表
```
chkconfig --list [name]
```

### 示例
``` shell
#!/bin/sh

# chkconfig: 345 90 90 
# description: ss server

start() {
    echo -ne "Starting ss server\n"
    # 后台运行
    /usr/local/bin/ss > /dev/null 2>&1 &
}

stop() {
    echo -ne "Stop ss server\n"
    # 根据端口号杀死进程
    fuser -k 1080/tcp
}

restart() {
    stop
    start
}

status() {
    fuser 1080/tcp
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
        echo 'Usage: service ss {start|stop|restart|status}'
        ;;
esac 
```

### 参考
- [Linux进程启动脚本编写](http://blog.fudenglong.site/2017/03/24/Linux%E8%BF%9B%E7%A8%8B%E5%90%AF%E5%8A%A8%E8%84%9A%E6%9C%AC%E7%BC%96%E5%86%99/)
- [Linux下编写自己的service](https://my.oschina.net/itblog/blog/532889)
- [linux shell编写系统服务脚本](http://blog.51cto.com/huanglianfeng/1363488)
- [Linux下chkconfig命令详解](https://www.cnblogs.com/panjun-Donet/archive/2010/08/10/1796873.html)