---
title: InnoDB重做日志
author: tyk
date: 2018-08-21 16:07:45
tags: 
- innodb
- redo
---
## InnoDB重做日志

```
# innodb 
innodb_buffer_pool_size=1G
innodb_log_buffer_size=128M
# innodb_fast_shutdown=0
innodb_flush_log_at_trx_commit=2 
innodb_log_files_in_group=3
innodb_log_file_size=256M

transaction-isolation=READ-COMMITTED
innodb_flush_method=O_DIRECT

innodb_thread_concurrency=8
```

重做日志（redo log）用来实现事务的持久性，即事务ACID中的D。重做日志由两部分组成：一是内存中的重做日志缓冲（redo log buffer），其是易失的；二是重做日志文件（redo log file），其是持久的。

InnoDB是事物的存储引擎，其通过`force log at commit`机制实现事务的持久性。当事务commit（提交）时，必须先将该事务的所有日志写入到重做日志文件进行持久化，待完成后事务commit操作才算完成，而这里的日志是指重做日志。重做日志会先写入系统缓存，然后进行一次fsync操作后才能写入磁盘。由于fsync的效率取决于磁盘的性能，因此磁盘的性能决定了事务提交的性能，也就是数据库的性能。

参数`innodb_flush_log_at_trx_commit`用来控制重做日志刷新到磁盘的策略，详细配置查看[配置参数](#配置参数)部分。虽然用户可以通过设置参数`innodb_flush_log_at_trx_commit`为0或者2来提高事务提交的性能，但是需要牢记的是，这种设置方法丧失了事务的ACID特性。

重做日志记录的是对于每个页的修改，它事务进行中不断地被写入。

### 物理日志

### LSN

LSN是log sequence number的缩写，代表的是日志序列号。LSN的特点是单调递增，代表每个重做日志的编号，LSN表示事务写入到重做日志的字节总量。检查点存在于多个对象中，表示的含义各不相同：

- 重做日志。
- 检查点。
- 页。

通过`SHOW [ENGINE] INNODB STATUS`语句可以看到InnoDB存储引擎信息，其中LOG部分就是各LSN的信息。

```
...
---
LOG
---
Log sequence number 30694072983
Log flushed up to   30694072983
Pages flushed up to 30694072983
Last checkpoint at  30694072983
0 pending log writes, 0 pending chkp writes
6150725 log i/o's done, 0.00 log i/o's/second
----------------------
...
```

- Log sequence number 
    
    表示在重做日志缓冲中已经写入的LSN值。

- Log flushed up to  

    表示刷新到重做日志文件的LSN值。

- Pages flushed up to 

- Last checkpoint at 

    表示最新一次页刷新到磁盘时，其LSN的值为多少。

### 检查点
首先将重做日志写入到文件，实际**数据页**刷新到磁盘的操作由检查点（checkpoint）负责。为了确保每次日志都写入重做日志文件，在每次将重做日志缓冲写入重做日志文件后，InnoDB存储引擎都需要调用一次fsync操作。

事务提交仅仅是把事务操作所涉及页的重做日志都写入到磁盘。页的刷新是异步的，当前数据库通常使用检查点技术。检查点所做的操作就是将缓冲池中的页刷新到磁盘，最终达到外存和内存中的页的数据一致。检查点的作用是缩短当数据库发生宕机时数据库恢复所需要的时间。

InnoDB存储引擎中的检查点：
- sharp checkpoint

    在正常关闭数据库时使用，会将所有脏页刷回磁盘。

- fuzzy checkpoint

    在运行时使用，用于部分脏页的刷新。

redo log 的生命周期：
![](/images/checkpoint-lsn.png)
1. 创建阶段 (log sequence number, LSN1)：事务创建一条日志，当前系统 LSN 最大值，新的事务日志 LSN 将在此基础上生成，也就是 LSN1+新日志的大小；

2. 日志刷盘 (log flushed up to, LSN2)：当前已经写入日志文件做持久化的 LSN；

3. 数据刷盘 (oldest modified data log, LSN3)：当前最旧的脏页数据对应的 LSN，写 Checkpoint 的时候直接将此 LSN 写入到日志文件；

4. 写CKP (last checkpoint at, LSN4)：当前已经写入 Checkpoint 的 LSN，也就是上次的写入；

### 重做日志块
在InnoDB存储引擎中，重做日志都是以512字节进行存储的。若一个页中产生的重做日志数量大于512字节，那么需要分割为多个重做日志快进行存储。一个重做日志文件中保存的不全是重做日志块，每个重做日志文件的前2048 bytes保存的是头信息。

**InnoDB redo log file header format**

```
 0                                 512
+-------------------------------------+
|          log file header            |
+-------------------------------------+
|            checkpoint1              |
+-------------------------------------+
|              <NULL>                 |
+-------------------------------------+
|            checkpoint2              |
+-------------------------------------+
|            log block                |
+-------------------------------------+
|            log block                |
+-------------------------------------+
|            log block                |
+-------------------------------------+
|                ...                  |
+-------------------------------------+
```

|    存储内容     | 大小 （字节） |
| --------------- | ------------- |
| log file header | 512           |
| checkpoint1     | 512           |
| 空              | 512           |
| checkpoint2     | 512           |


**InonoDB redo log block format**

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                            hard_no                            |
+---------------------------------------------------------------+
|            data_len           |    first_rec_group            |
+-------------------------------+-------------------------------+
|                         checkpoint_no                         |
+---------------------------------------------------------------+
|                 data part (496 bytes)                         :
+---------------------------------------------------------------+
:                 data part continued ...                       |
+---------------------------------------------------------------+
|                            checksum                           |
+---------------------------------------------------------------+
```
|  名称            | 大小（字节） | 说明           | 
| --------------- | ---------- | -------------- | 
| head_no         | 4          | 表示这是第几个block。第一位用来判断是否是flush bit，所以最大值是2G 。     | 
| data_len        | 2          | 表示该block中已经有多少个字节被使用，当呗写满时该值为0x200表示使用全部log block空间。|
| first_rec_group | 2          | 表示改block中第一个日志的偏移量。 | 
| checkpoint_no   | 4          |                |

`first_rec_group`表示`log block`中第一个日志所在的偏移量，若该值和`data_len`相同则表示当前`log block`中不含有新的日志。这个值主要是为了处理一个块中包含两条日志的情况，当上一个事物日志大于496字节时就会出现占用多个块的情况。

{% include_code parse_redo_log.js %}

### 组提交


### 配置参数
- innodb_flush_log_at_trx_commit 

    - 1：默认值，表示事务提交时必须将该事务的所有日志写入到磁盘。
    - 0：事务提交时并不强制一定要写入到重做日志，这个操作仅在master thread中进行完成，每1秒做一次fsync操作。数据库宕机时，可能会发生最后一秒内事务丢失的情况。
    - 2：事务提交时将重做日志写入到重做日志文件，但仅写入到文件系统的缓存中，不进行fsync操作。数据库宕机宕机时不会丢失数据，操作系统宕机时会丢失未从文件系统缓存刷新到重做日志文件那部分的数据。

- innodb_log_group_home_dir

    重做日志存放目录，默认为数据目录。文件名前缀为`ib_logfile`

- innodb_log_buffer_size

    重做日志缓存，默认1MB。

- innodb_log_files_in_group

    日志每组数量，默认是2。还有一个参是`innodb_mirrored_log_groups`用来指定重做日志镜像的数量，用来提高重做日志的可用性，默认是1，表示不启用镜像功能。实际上也不允许设置除了1以外的值，因为现实中我们可能其它手段（RAID）来保证数据库的可用性。

- innodb_log_file_size

    单个日志大小，默认是5M。

- innodb_log_archive 

    用来设置是否开启归档日志功能。因为重做日志是循环使用的，为了避免覆盖而可能丢失，可以开启此功能。`innodb_log_arch_dir`用来设置归档日志的春芳目录，默认和重做日志目录相同，文件前缀为`ib_arch_log_`。

- innodb_fast_shutdown

    - 0：表示在innodb关闭的时候，需要purge all, merge insert buffer,flush dirty pages。这是最慢的一种关闭方式，但是restart的时候也是最快的。后面将介绍purge all,merge insert buffer,flush dirty pages这三者的含义。
    - 1：表示在innodb关闭的时候，它不需要purge all，merge insert buffer，只需要flush dirty page。
    - 2：表示在innodb关闭的时候，它不需要purge all，merge insert buffer，也不进行flush dirty page，只将log buffer里面的日志flush到log files。因此等下次启动的时候它是最耗时的。

### 参考
- [MySQL内核：InnoDB存储引擎 卷1](https://book.douban.com/subject/25872763/)
- [MySQL技术内幕](https://book.douban.com/subject/24708143/)
- [高性能MySQL（第二版）](https://book.douban.com/subject/4241826/)
- [InnoDB原生Checkpoint策略及各版本优化详解](http://hedengcheng.com/?p=88)
- <https://kylinyu.win/rdbms_mysql_tuning/>
- [InnoDB Checkpoint](https://jin-yang.github.io/post/mysql-innodb-checkpoint.html)
- [MySQL · 源码分析 · Innodb 引擎Redo日志存储格式简介](http://mysql.taobao.org/monthly/2017/09/07/)
- [Format of redo log](https://dev.mysql.com/doc/dev/mysql-server/8.0.11/PAGE_INNODB_REDO_LOG_FORMAT.html)