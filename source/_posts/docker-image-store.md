---
title: Docker的镜像存放目录修改与迁移
date: 2016-11-08 14:44:04
tags: docker
---
### Docker的镜像存放目录修改与迁移
Docker镜像默认存放在`/var/lib/docker`，有些情况下由于系统盘空间不够需要将镜像迁移到其他磁盘。

#### 软连接形式
1. 停止服务  
```
service docker stop
```
2. 移动`/var/lib/docker`到新目录`/data/`下  
```
mv /var/lib/docker /data/
```
3. 重新将`/var/lib/docker`链接到`/data/docker`   
```
ln -s /data/docker /var/lib/docker
```
4. 重启服务   
```
service docker start
```

#### 设置`DOCKER_PATH`环境变量方式
参考[《Docker的镜像存放目录修改与迁移》](https://my.oschina.net/u/2306127/blog/653569)
