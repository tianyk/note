---
title: Systemd
author: tyk
tags: systemctl
date: 2018-09-10 13:34:06
---


## Systemd

### 创建服务
vim /lib/systemd/system/nginx.service

```
[Unit]
Description=The NGINX HTTP and reverse proxy server
After=syslog.target network.target remote-fs.target nss-lookup.target

[Service]
Type=forking
PIDFile=/var/run/nginx.pid
ExecStartPre=/usr/sbin/nginx -t
ExecStart=/usr/sbin/nginx
ExecReload=/usr/sbin/nginx -s reload
ExecStop=/bin/kill -s QUIT $MAINPID
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

### 初始化时自动启动服务
```
ln -s /lib/systemd/system/nginx.service  /etc/systemd/system/multi-user.target.wants/nginx.service
```
或者 
```
systemctl enable nginx
```

### 刷新配置
```
systemctl daemon-reload
```

### 启动、重启、停止

1. 启动nginx
    ```
    $ systemctl start nginx
    ```

2. 重启nginx
    ```
    $ systemctl restart nginx
    ```

3. 停止nginx
    ```
    $ systemctl stop nginx
    ```

### 开机启动

```
systemctl enable nginx
```

### 查看状态

```
systemctl status nginx
```

### 参考
- [systemctl管理Redis启动、停止、开机启动](https://blog.csdn.net/chwshuang/article/details/68489968)
- [NGINX systemd service file](https://www.nginx.com/resources/wiki/start/topics/examples/systemd/)