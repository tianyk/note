---
title: Kafka 快速开始
date: 2017-04-28 18:40:03
tags: 
---
### 安装与配置
从[官网](http://kafka.apache.org/)下载最新的二进制包。
```
wget http://mirror.bit.edu.cn/apache/kafka/0.10.2.0/kafka_2.10-0.10.2.0.tgz
```
解压
```
tar -zxvf kafka_2.10-0.10.2.0.tgz -C /usr/local
```

> Kafka 依赖 Zookeeper，首先要安装 Zookeeper。使用说明参考[Zookeeper快速开始](/2017/04/28/zookeeper/)

[Kafka 数据在 Zookeeper 中的存储结构](https://cwiki.apache.org/confluence/display/KAFKA/Kafka+data+structures+in+Zookeeper)

新旧版本的存储结构不同，主要在于 Consumer offset 的保存，旧版保存在 Zookeeper 中，新版保存在 kafka 中。

0.8 等早期版本在 Zookeeper 中的存储结构
![](/images/hW6hL.png)

### 名词解释
- Broker    
    Kafka集群包含一个或多个服务器，这种服务器被称为broker

- Topic    
    每条发布到 Kafka 集群的消息都有一个类别，这个类别被称为 Topic 。（物理上不同 Topic 的消息分开存储，逻辑上一个topic的消息虽然保存于一个或多个broker上但用户只需指定消息的 Topic 即可生产或消费数据而不必关心数据存于何处）

- Partition    
    Partition 是物理上的概念，每个 Topic 包含一个或多个 Partition ，创建 Topic 时可指定 Partition 数量。每个 Partition 对应于一个文件夹，该文件夹下存储该 Partition 的数据和索引文件

- Producer    
    负责发布消息到Kafka broker

- Consumer    
    消费消息。每个 Consumer 属于一个特定的 Consumer group（可为每个 Consumer 指定 group name，若不指定 group name 则属于默认的 group ）。使用 consumer high level API 时，同一 Topic 的一条消息只能被同一个 consumer group 内的一个 consumer 消费，但多个 consumer group 可同时消费这一消息。


### 监控

#### KafkaOffsetMonitor
> GitHub 项目主页 README 示例有错误。最新版未发布release，需要自己下载源码编译。

1. 下载编译
    ```
    git ccone https://github.com/quantifind/KafkaOffsetMonitor.git
    cd KafkaOffsetMonitor
    sbt assembly
    ```
    > brew install sbt     
    > 编译完在target目录中

2. 运行
    ```
    java -cp KafkaOffsetMonitor-assembly-0.3.0-SNAPSHOT.jar \
        com.quantifind.kafka.offsetapp.OffsetGetterWeb \
        --offsetStorage kafka \
        --zk 127.0.0.1:2181 \
        --port 8989 \
        --refresh 10.seconds \
        --retain 2.days
    ```

    - offsetStorage offset 存储的位置，支持 zookeeper、kafka、storm。从 kafka 0.10.x 默认偏移量建议存储到 kafka 中。consumer 以 `zookeeper.connect` 方式连接到 kafka 的 offset 存储在 zookeeper 中，以 `bootstrap.servers` 方式连接到 kafka 的 offset 存储在 kafka `__consumer_offsets` topic 中。
    - zk kafka 连接的 zookeeper 地址 （无论使用哪一种类型的 offsetStorage ，这里都是 zookeeper 的地址。

    - offsetStorage valid options are ''zookeeper'', ''kafka'' or ''storm''. Anything else falls back to ''zookeeper''
    - zk the ZooKeeper hosts
    - port on what port will the app be available
    - refresh how often should the app refresh and store a point in the DB
    - retain how long should points be kept in the DB
    - dbName where to store the history (default 'offsetapp')
    - kafkaOffsetForceFromStart only applies to ''kafka'' format. Force KafkaOffsetMonitor to scan the commit messages from start (see notes below)
    - stormZKOffsetBase only applies to ''storm'' format. Change the offset storage base in zookeeper, default to ''/stormconsumers'' (see notes below)
    - pluginsArgs additional arguments used by extensions (see below)

> 监控图表参数说明
- Topic：创建Topic名称
- Partition：分区编号
- Offset：表示该Parition已经消费了多少Message
- LogSize：表示该Partition生产了多少Message
- Lag：表示有多少条Message未被消费
- Owner：表示消费者
- Created：表示该Partition创建时间
- Last Seen：表示消费状态刷新最新时间

正常的情况下 LogSize = Offset + Lag。LogSize 和 Offset 线重合表示消费完毕。Lag 斜率持续比 Offset 大，需要此时应该考虑添加 consumer 。


### Kafka 命令行工具

#### Topic 相关
1. 创建 Topic
    ```
    bin/kafka-topics.sh --create --zookeeper zk01.example.com:2181 --replication-factor 1 --partitions 3 --topic your_topic_name
    ```
    - replication-factor 副本数量
    - partitions Partition 数量
2. 列出所有的 Topic
    ```
    bin/kafka-topics.sh --zookeeper zk01.example.com:2181 --list
    ```

3. 删除 Topic
    ```
    bin/kafka-topics.sh --delete --zookeeper zk01.example.com:2181 --topic your_topic_name
    ```
    > 需要在 `server.properties` 中设置 `delete.topic.enable=true`
    > 另外需要注意：如果当前 Topic 没有传输过信息是彻底删除。如果已经传输过数据，只是将此 Topic 标记为删除。


#### Producer 相关
1. 生产消息
    ```
    bin/kafka-console-producer.sh --broker-list broker1:9092 --topic your_topic_name
    ```
    或者直接从文件中读
    ```
    bin/kafka-console-producer.sh --broker-list broker1:9092 --topic streams-file-input < file-input.txt
    ```
    > 通过 `--producer.config` 参数指定 Producer 配置文件。[配置参考](https://kafka.apache.org/documentation/#producerconfigs)

#### Consumer 相关
1. 消费消息
    ```
    bin/kafka-console-consumer.sh  --bootstrap-server broker1:9092 --topic your_topic_name --from-beginning
    ```
    - --from-beginning 设置消费者偏置位为最开始（默认为末尾）。

    > Consumer 其它配置信息可以通过 `--consumer-property` 参数配置，或者使用 `--consumer.config` 指定配置文件路径。e.g. `--consumer-property group.id=print` [配置参数](https://kafka.apache.org/documentation/#consumerconfigs)


#### Consumer Group
1. 列出所有的 Consumer Group
    ```
    bin/kafka-consumer-groups.sh --bootstrap-server broker1:9092 --list
    ```

2. 列出来消费者的 offset
    ```
    bin/kafka-consumer-groups.sh --bootstrap-server broker1:9092 --describe --group test-consumer-group
    ```
    > 这里只显示客户端直接链接到 Kafka 集群上面的消费者信息，通过 zookeeper 连接的需要使用 `--zookeeper` 参数来代替 `--bootstrap-server`。
    ```
    TOPIC      PARTITION  CURRENT-OFFSET  LOG-END-OFFSET  LAG      CONSUMER-ID     HOST     CLIENT-ID
    tp         1          38192           38192           0        -               -        -
    tp         0          37775           37775           0        -               -        -
    tp         2          37927           37927           0        -               -        -
    ```
    CURRENT-OFFSET：当前消费到的位置
    LOG-END-OFFSET：队列最后的位置
    LAG：未被消费的个数

3. 删除 Consumer Group
    ```
    bin/kafka-consumer-groups.sh --bootstrap-server broker1:9092 --delete --group <group-name>
    ```


### 参考
[【1】](https://kafka.apache.org/documentation/)[【2】](https://mos.meituan.com/library/32/how-to-install-kafka-on-centos7/) [【3】](http://blog.csdn.net/suifeng3051/article/details/38321043)
