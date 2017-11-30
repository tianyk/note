### 简介
Zookeeper 是Apache软件基金会的一个软件项目，它主要是用来解决分布式应用中经常遇到的一些数据管理问题，如：统一命名服务、状态同步服务、集群管理、分布式应用配置项的管理等。

### 安装与配置
Zookeeper 有三种不同的运行环境：单机模式、伪集群模式、集群模式。在测试环境中资源有限我们常常使用单机模式或者伪集群模式，生产环境中使用集群模式。

#### 安装
1. 下载
    去 Zookeeper [官网](https://zookeeper.apache.org/) 选着合适的版本下载即可。
    ``` bash
    wget http://mirror.bit.edu.cn/apache/zookeeper/zookeeper-3.4.10/zookeeper-3.4.10.tar.gz
    ```
2. 解压安装
    下载完成直接解压就行了
    ``` bash
    tar -zxvf zookeeper-3.4.10.tar.gz -C /usr/local
    ```

3. 启动与停止
    在解压完的 bin 目录下会有 zkServer[.sh|.bat] 脚本文件，运行脚本文件指定命令和配置文件即可。
    ``` bash
    # 启动
    ./bin/zkServer.sh start /etc/zookeeper/zoo.cfg
    ```

    ``` bash
    # 停止
    ./bin/zkServer.sh stop /etc/zookeeper/zoo.cfg
    ```

4. 建立连接
    ```
    # 连接单机
    ./bin/zkCli.sh -server 127.0.0.1:2181


    # 连接集群
    ./bin/zkCli.sh -server 127.0.0.1:2181,127.0.0.1:2182,127.0.0.1:2183
    ```

#### 单机模式配置
单机模式就是在一台机器上启动一个 Zookeeper 服务。    

1. 复制配置文件
    ```
    cp /usr/local/zookeeper/conf/zoo_sample.cfg /etc/zookeeper/zoo.cfg
    ```
2. 修改配置
    vim /etc/zookeeper/zoo.cfg
    ```
    dataDir=/data/zookeeper/data
    dataLogDir=/data/zookeeper/logs
    clientPort=2181
    tickTime=2000
    initLimit=5
    syncLimit=2
    ```
> 配置说明：    
dataDir：数据目录    
dataLogDir：日志目录    
clientPort：客户端连接端口    
tickTime：Zookeeper 服务器之间或客户端与服务器之间维持心跳的时间间隔，也就是每个 tickTime 时间就会发送一个心跳。    
initLimit：Zookeeper的Leader 接受客户端（Follower）初始化连接时最长能忍受多少个心跳时间间隔数。当已经超过 5个心跳的时间（也就是tickTime）长度后 Zookeeper 服务器还没有收到客户端的返回信息，那么表明这个客户端连接失败。总的时间长度就是 5*2000=10 秒    
syncLimit：表示 Leader 与 Follower 之间发送消息时请求和应答时间长度，最长不能超过多少个tickTime 的时间长度，总的时间长度就是 2*2000=4 秒。    

3. 启动服务
    ```
    ./bin/zkServer.sh start /etc/zookeeper/zoo.cfg
    ```

#### 伪集群模式配置
伪集群模式就是在一台机器上面启动多个 Zookeeper 服务。    

| myid	| Data目录 |	Client	| Server	| Leader	| 配置文件 |
| ----  | ---- | ---- | ---- | ---- | ---- |
| 1	 | /data/zookeeper/cluster/zoo1/data |	2181 |	2222 |	2223 |	/etc/zookeeper/cluster/zoo1.cfg |
| 2	 | /data/zookeeper/cluster/zoo2/data |	2182 |	3333 |	3334 |	/etc/zookeeper/cluster/zoo2.cfg |
| 3	 | /data/zookeeper/cluster/zoo3/data |	2183 |	4444 |	4445 |	/etc/zookeeper/cluster/zoo3.cfg |

1. 创建多份配置文件初始化数据目录
    ```
    mkdir /etc/zookeeper/cluster
    cp /usr/local/zookeeper/conf/zoo_sample.cfg /etc/zookeeper/cluster/zoo1.cfg
    cp /usr/local/zookeeper/conf/zoo_sample.cfg /etc/zookeeper/cluster/zoo2.cfg
    cp /usr/local/zookeeper/conf/zoo_sample.cfg /etc/zookeeper/cluster/zoo3.cfg


    mkdir -p /data/zookeeper/cluster/zoo1/data /data/zookeeper/cluster/zoo1/logs
    mkdir -p /data/zookeeper/cluster/zoo2/data /data/zookeeper/cluster/zoo2/logs
    mkdir -p /data/zookeeper/cluster/zoo2/data /data/zookeeper/cluster/zoo2/logs
    ```

2. 修改配置文件
    vim /etc/zookeeper/cluster/zoo1.cfg
    ```
    dataDir=/data/zookeeper/cluster/zoo1/data
    dataLogDir=/data/zookeeper/cluster/zoo1/logs
    clientPort=2181
    tickTime=2000
    initLimit=5
    syncLimit=2

    # 集群配置
    server.1=127.0.0.1:2222:2225  
    server.2=127.0.0.1:3333:3335  
    server.3=127.0.0.1:4444:4445
    ```

    集群配置格式`server.A=B:C:D`其中 A 是一个数字，表示这个是第几号服务器（在数据目录的 myid 中的值和它一样）；B 是这个服务器的 ip 地址；C 表示的是这个服务器与集群中的 Leader 服务器交换信息的端口；D 表示的是万一集群中的 Leader 服务器挂了，需要一个端口来重新进行选举，选出一个新的 Leader，而这个端口就是用来执行选举时服务器相互通信的端口。如果是伪集群的配置方式，由于 B 都是一样，所以不同的 Zookeeper 实例通信端口号不能一样，所以要给它们分配不同的端口号。

    在每个数据存储目录新建 myid 文件，写入服务器 ID。
    ```
    touch /data/zookeeper/cluster/zoo1/data/myid /data/zookeeper/cluster/zoo2/data/myid /data/zookeeper/cluster/zoo3/data/myid

    echo 1 > /data/zookeeper/cluster/zoo1/data/myid
    echo 2 > /data/zookeeper/cluster/zoo2/data/myid
    echo 3 > /data/zookeeper/cluster/zoo3/data/myid
    ```

    > 服务器交互端口不需要单独配置，只需要集群配置中写好就行了。
    > 在伪集配置中，注意 clientPort 不要冲突，每个服务有单独的数据目录。

3. 启动服务
    ```
    ./bin/zkServer.sh start /etc/zookeeper/cluster/zoo1.cfg
    ./bin/zkServer.sh start /etc/zookeeper/cluster/zoo2.cfg
    ./bin/zkServer.sh start /etc/zookeeper/cluster/zoo3.cfg
    ```

#### 集群模式配置
集群模式就是在不同的机器部署多个 Zookeeper 服务，组成一个集群。这种配置可用性更高。

集群配置和伪集群配置基本一样，但是集群配置中由于不同的机器，使用资源不会冲突。配置文件中可以使用同样的端口，数据文件目录。

1. 在每台机器上创建配置文件
    ```
    cp /usr/local/zookeeper/conf/zoo_sample.cfg /etc/zookeeper/zoo.cfg
    ```

2. 修改配置文件
    vim /etc/zookeeper/zoo.cfg
    ```
    dataDir=/data/zookeeper/data
    dataLogDir=/data/zookeeper/logs
    clientPort=2181
    tickTime=2000
    initLimit=5
    syncLimit=2

    # 集群配置
    server.1=10.0.1.11:2222:2225  
    server.2=10.0.1.12:2222:2225  
    server.3=10.0.1.13:2222:2225
    ```

    在各个机器的数据目录中写入响应的 myid 文件。例如 `10.0.1.11` 机器
    ```
    touch /data/zookeeper/data/myid
    echo 1 > /data/zookeeper/data/myid
    ```

3. 在各个机器中启动 Zookeeper 服务
    ```
    ./bin/zkServer.sh start /etc/zookeeper/zoo.cfg
    ```

### 客户端命令

#### 链接到 Zookeeper
```
$ bin/zkCli.sh -server 127.0.0.1:2181,127.0.0.1:2182,127.0.0.1:2183
```

#### Zookeeper 目录树操作
Zookeeper，内部是一个分层的文件系统目录树结构，每一个节点对应一个Znode。[参考](https://zookeeper.apache.org/doc/trunk/zookeeperStarted.html)

查看根目录
```
[zkshell: 8] ls /
[zookeeper]
```

创建一个新的Znode
```
[zkshell: 9] create /zk_test my_data
Created /zk_test
```

再次查看就能看到新创建的Znode了
```
[zkshell: 11] ls /
[zookeeper, zk_test]
```

读取内容
```
[zkshell: 12] get /zk_test
my_data
cZxid = 5
ctime = Fri Jun 05 13:57:06 PDT 2009
mZxid = 5
mtime = Fri Jun 05 13:57:06 PDT 2009
pZxid = 5
cversion = 0
dataVersion = 0
aclVersion = 0
ephemeralOwner = 0
dataLength = 7
numChildren = 0
```

重新设置值
```
[zkshell: 14] set /zk_test junk
cZxid = 5
ctime = Fri Jun 05 13:57:06 PDT 2009
mZxid = 6
mtime = Fri Jun 05 14:01:52 PDT 2009
pZxid = 5
cversion = 0
dataVersion = 1
aclVersion = 0
ephemeralOwner = 0
dataLength = 4
numChildren = 0
[zkshell: 15] get /zk_test
junk
cZxid = 5
ctime = Fri Jun 05 13:57:06 PDT 2009
mZxid = 6
mtime = Fri Jun 05 14:01:52 PDT 2009
pZxid = 5
cversion = 0
dataVersion = 1
aclVersion = 0
ephemeralOwner = 0
dataLength = 4
numChildren = 0
```

删除Znode
```
[zkshell: 16] delete /zk_test
[zkshell: 17] ls /
[zookeeper]
[zkshell: 18]

```


### 使用场景分析

### Hadoop

### Kafka

### Dubbo
![](images/zk-dubbo2.jpg)
```
dubbo://10.0.1.3:20880/cc.kekek.dubbo.demo.DemoService?anyhost=true&application=demo-provider&dubbo=2.5.7&generic=false&interface=cc.kekek.dubbo.demo.DemoService&methods=sayHello,sayName&pid=54299&side=provider&timestamp=1511263842858
```

### 参考
[【1】](https://taoistwar.gitbooks.io/spark-operationand-maintenance-management/content/spark_relate_software/zookeeper_install.html) [【2】](http://www.jianshu.com/p/0ba61bf7149f) [【3】](https://my.oschina.net/jackieyeah/blog/709130)
