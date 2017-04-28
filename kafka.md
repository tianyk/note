### 安装与配置

http://kafka.apache.org/

wget http://mirror.bit.edu.cn/apache/kafka/0.10.2.0/kafka_2.10-0.10.2.0.tgz


[Kafka 数据在 Zookeeper 中的存储结构](https://cwiki.apache.org/confluence/display/KAFKA/Kafka+data+structures+in+Zookeeper)
![](images/hW6hL.png)

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
        --zk 192.168.0.112:2181 \
        --port 8080 \
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


bin/kafka-console-consumer.sh --bootstrap-server 172.16.0.107:10011,172.16.0.107:10012,172.16.0.107:10013 --topic test --from-beginning --property group.id=print-test


bin/kafka-console-producer.sh --broker-list 172.16.0.107:10011,172.16.0.107:10012,172.16.0.107:10013 --topic test



### 参考
[【1】](https://mos.meituan.com/library/32/how-to-install-kafka-on-centos7/) [【2】](http://blog.csdn.net/suifeng3051/article/details/38321043)
