---
title: Docker
date: 2016-07-26 11:45:34
updated: 2018-11-01 16:30:42
tags: docker
---
## Docker

### 安装
官方建议内核版本最好在3.1以上（可以通过`uname -r`命令查看内核版本，通过`cat /etc/issue`查看发行版），必须是64位操作系统。

<https://docs.docker.com/install/linux/docker-ce/centos/>

### 常用命令
1. 查看docker信息
    
    ```
    docker info
    ```

2. 拉取一个镜像。名字是node,版本是4
    
    ```
    docker pull node:4
    ```

3. 查看本地镜像

    ```
    docker images [name:tag]
    ```

4. 删除镜像/容器

    ```
    docker rm [name:id] 删除容器
    docker rmi [id] 删除镜像
    ```

5. 列出所有正在运行的镜像

    ```
    docker ps
    -a 列出当前系统中所有容器
    -l 列出最后一次使用的容器
    ```

6. 重新启动容器

    ```
    docker start [name|id]
    ```

7. 停止容器

    ```
    docker stop [name|id]
    ```

8. 附着到容器上

    ```
    docker attach [name|id]
    ```

9. 查看容器内进程

    ```
    docker top [name|id]
    ```

10. docker run [OPTIONS] IMAGE[:TAG] [COMMAND] [ARG...]

    ```
    --name 容器名字
    --restart=[always|on-failure:5] 自动重启
    -d 后台运行
    -v 共享文件系统 e.g, -v /home/doog/app:/root/app
    -i -t 进入交互式环境
    --link 连接到另外一个容器。e.g, --link redis-name:redis_alias
    --rm 运行完删除
    -m 内存大小
    -c cpu优先级和调度周期
    -e 环境变量 e.g, -e "deep=purple"
    -h hostname
    -u 指定用户，默认root
    -w 工作目录，默认/
    -p 绑定端口 e.g, -p 50122:22 主机的50122端口映射到容器的22端口
    ```

11. 获取容器信息

    ```
    docker inspect [name:id]
    -f | --format '{{ .key1.key1 }}' 类似获取json对象值的方式来获取值
    ```

12. 查看端口绑定信息

    ```
    docker port [name:id]
    ``` 

13. 在容器内执行命令

    ```
    docker exec [-it] [name:id] [COMMAND]

    docker exec -it c5c696316553 /bin/sh
    ```

14. 构建镜像

    ```
    docker build -t [name:tag] . 
    ```

### Docker镜像操作
``` shell
docker save doog/node:0.0.1 | gzip -c > node-001.tar.gz    # 导出镜像
gunzip -c node-001.tar.gz | docker load                    # 导入镜像
```

### Docker容器操作
```
docker export [name|id] > ./doog-node.tar.gz                  # 导出容器
```

### 注意事项
1. `WORKDIR`默认为`/`。
2. `ADD`命令：如果<src>是一个本地的压缩包且<dest>是以“/”结尾的目录，则会调用“tar -x”命令解压缩，如果<dest>有同名文件则覆盖，但<src>是一个url时不会执行解压缩。
3. `ADD`比`COPY`多了2个功能, 下载URL和解压。
4. `VOLUME` 与 `-v`的使用场景。

    很多时候，这两项表象差不多，不同的场景使用不同的配置。不需要本地持久化的目录可以使用`VOLUME`，可以在多个容器间可以共享。
    
    1. 没有指定VOLUME也没有指定-v，这种是普通文件夹。
    2. 指定了VOLUME没有指定-v，这种文件夹可以在不同容器之间共享，但是无法在本地修改。
    3. 指定了-v的文件夹，这种文件夹可以在不同容器之间共享，且可以在本地修改。


### 参考
[【1】](https://segmentfault.com/q/1010000004107293)
