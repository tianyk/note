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
innodb_flush_method=O_DIRECT
innodb_log_files_in_group=3
innodb_log_file_size=256M
transaction-isolation=READ-COMMITTED

innodb_thread_concurrency=8
```

重做日志（redo log）用来实现事务的持久性，即事务ACID中的D。重做日志由两部分组成：一是内存中的重做日志缓冲（redo log buffer），其是易失的；二是重做日志文件（redo log file），其是持久的。

InnoDB是事物的存储引擎，其通过`force log at commit`机制实现事务的持久性。当事务commit（提交）时，必须先将该事务的所有日志写入到重做日志文件进行持久化，待完成后事务commit操作才算完成，而这里的日志是指重做日志。


### 参考
- [MySQL内核：InnoDB存储引擎 卷1](https://book.douban.com/subject/25872763/)
- [MySQL技术内幕](https://book.douban.com/subject/24708143/)
- [高性能MySQL（第二版）](https://book.douban.com/subject/4241826/)