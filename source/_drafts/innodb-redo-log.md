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

参数`innodb_flush_log_at_trx_commit`用来控制重做日志刷新到磁盘的策略，这个参数有三个取值：

- 1：默认值，表示事务提交时必须将该事务的所有日志写入到磁盘。
- 0：事务提交时并不强制一定要写入到重做日志，这个操作仅在master thread中进行完成，每1秒做一次fsync操作。数据库宕机时，可能会发生最后一秒内事务丢失的情况。
- 2：事务提交时将重做日志写入到重做日志文件，但仅写入到文件系统的缓存中，不进行fsync操作。数据库宕机宕机时不会丢失数据，操作系统宕机时会丢失未从文件系统缓存刷新到重做日志文件那部分的数据。

摘录来自: 姜承尧. “MySQL内核:InnoDB存储引擎(卷1)。” iBooks. 


### 配置参数
- innodb_flush_log_at_trx_commit 
- innodb_log_buffer_size
- innodb_log_files_in_group
- innodb_log_file_size



### 参考
- [MySQL内核：InnoDB存储引擎 卷1](https://book.douban.com/subject/25872763/)
- [MySQL技术内幕](https://book.douban.com/subject/24708143/)
- [高性能MySQL（第二版）](https://book.douban.com/subject/4241826/)
- <https://kylinyu.win/rdbms_mysql_tuning/>