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

### 配置参数
- innodb_flush_log_at_trx_commit 

    - 1：默认值，表示事务提交时必须将该事务的所有日志写入到磁盘。
    - 0：事务提交时并不强制一定要写入到重做日志，这个操作仅在master thread中进行完成，每1秒做一次fsync操作。数据库宕机时，可能会发生最后一秒内事务丢失的情况。
    - 2：事务提交时将重做日志写入到重做日志文件，但仅写入到文件系统的缓存中，不进行fsync操作。数据库宕机宕机时不会丢失数据，操作系统宕机时会丢失未从文件系统缓存刷新到重做日志文件那部分的数据。
    
- innodb_log_buffer_size

- innodb_log_files_in_group

    日志每组数量，默认是2。

- innodb_log_file_size

    单个日志大小，默认是5M。

- innodb_fast_shutdown

    - 0：表示在innodb关闭的时候，需要purge all, merge insert buffer,flush dirty pages。这是最慢的一种关闭方式，但是restart的时候也是最快的。后面将介绍purge all,merge insert buffer,flush dirty pages这三者的含义。
    - 1：表示在innodb关闭的时候，它不需要purge all，merge insert buffer，只需要flush dirty page。
    - 2：表示在innodb关闭的时候，它不需要purge all，merge insert buffer，也不进行flush dirty page，只将log buffer里面的日志flush到log files。因此等下次启动的时候它是最耗时的。



### 参考
- [MySQL内核：InnoDB存储引擎 卷1](https://book.douban.com/subject/25872763/)
- [MySQL技术内幕](https://book.douban.com/subject/24708143/)
- [高性能MySQL（第二版）](https://book.douban.com/subject/4241826/)
- <https://kylinyu.win/rdbms_mysql_tuning/>