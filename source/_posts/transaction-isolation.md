---
title: 事物隔离级别
date: 2018-03-22 18:30:16
tags: 
---
## 事物隔离级别

事物的隔离级别是数据库处理的基础之一。隔离级别就是`ACID`缩写中的`I`。隔离级别的微调在性能和可靠性以及在多个事物同时修改或查询时结果一致性和重复性方面获得一个平衡。

|     隔离级别     | 脏读（Dirty Read） | 不可重复读（NonRepeatable Read） | 幻读（Phantom Read） |
| ---------------- | :----------------: | :------------------------------: | :------------------: |
| READ-UNCOMMITTED |        可能        |               可能               |         可能         |
| READ-COMMITTED   |       不可能       |               可能               |         可能         |
| REPEATABLE-READ  |       不可能       |              不可能              |         可能         |
| SERIALIZABLE     |       不可能       |              不可能              |        不可能        |


### 数据库事务特性（ACID）
- 原子性（Atomicity）
    
    事务作为一个整体被执行，包含在其中的对数据库的操作要么全部被执行，要么都不执行。

- 一致性（Consistency）

    事务应确保数据库的状态从一个一致状态转变为另一个一致状态。一致状态的含义是数据库中的数据应满足完整性约束。

- 隔离性（Isolation）：

    多个事务并发执行时，一个事务的执行不应影响其他事务的执行。
    
- 持久性（Durability）：

    已被提交的事务对数据库的修改应该永久保存在数据库中。
        
### MySQL 中的事物隔离级别
MySQL中默认的事物隔离界别是`REPEATABLE-READ`，四种隔离界中我们常用的还有`READ-COMMITTED`。

``` sql 
delete from t where t.id = 10;
```

|   索引情况   |                              REPEATABLE-READ                               |                                    READ-COMMITTED                                    |
| ------------ | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| ID主键       | 匹配记录X锁                                                                | 匹配记录X锁                                                                          |
| ID唯一索引   | 索引对应的记录加X锁，聚簇索引上对应的记录加X锁                             | 索引对应的记录加X锁，聚簇索引上对应的记录加X锁                                       |
| ID非唯一索引 | 索引对应的记录加X锁，聚簇索引对应的记录加X锁，索引间隙加间隙锁（包括两端） | 索引对应的记录都加X锁，聚簇索引对应的记录都加X锁                                     |
| 无索引       | 所有记录加X锁，聚簇索引所有间隙加间隙锁                                    | 聚簇索引上所有记录加X锁（MySQL Server层面会进行过滤，提前释放掉不符合条件的记录X锁） |

下面的例子我们将讲一下两者的区别。
```sql
CREATE TABLE t (a INT NOT NULL, b INT) ENGINE = InnoDB;
INSERT INTO t VALUES (1,2),(2,3),(3,2),(4,3),(5,2);
COMMIT;
```

我们执行一条更新语句
```sql 
# Session A
START TRANSACTION;
UPDATE t SET b = 5 WHERE b = 3;
```

紧接着执行第二条更新语句
```sql
# Session B
UPDATE t SET b = 4 WHERE b = 2;
```

当隔离级别是`REPEATABLE-READ`时，第一条语句会首先获取所有行的`x-lock`，并一直持有。
```
x-lock(1,2); retain x-lock
x-lock(2,3); update(2,3) to (2,5); retain x-lock
x-lock(3,2); retain x-lock
x-lock(4,3); update(4,3) to (4,5); retain x-lock
x-lock(5,2); retain x-lock
```
此时第二条语句回去尝试获得锁，直到第一条语句提交释放锁。
```
x-lock(1,2); block and wait for first UPDATE to commit or roll back
```

如果这个隔离级别是`READ-COMMITTED`，情况会有所不同。首先第一条语句同样会获取所有行的`x-lock`，然后它会去检查`where`条件，如果不匹配会立即释放掉这条记录的`x-lock`。
```
x-lock(1,2); unlock(1,2) releases those for rows that it does not modify
x-lock(2,3); update(2,3) to (2,5); retain x-lock
x-lock(3,2); unlock(3,2)
x-lock(4,3); update(4,3) to (4,5); retain x-lock
x-lock(5,2); unlock(5,2)
```
第二条查询语句会先读取每条记录的一个最新的快照，然后去检查`where`条件是否匹配。
```
x-lock(1,2); update(1,2) to (1,4); retain x-lock
x-lock(2,3); unlock(2,3)
x-lock(3,2); update(3,2) to (3,4); retain x-lock
x-lock(4,3); unlock(4,3)
x-lock(5,2); update(5,2) to (5,4); retain x-lock
```

### 死锁示例

``` sql 
create table question (
	id int not null auto_increment,
	source varchar(20), 
	sid int,
	create_at bigint,
	primary key (`id`),
	KEY `idx_source_sid` (`source`,`sid`)
)ENGINE=InnoDB;

insert into question(source, sid, create_at) values ('us', 100, unix_timestamp(now()));
insert into question(source, sid, create_at) values ('us', 101, unix_timestamp(now()));
insert into question(source, sid, create_at) values ('us', 102, unix_timestamp(now()));
```

|                                        Session A                                        |                             Session B                              |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| start transaction;                                                                      | start transaction;                                                 |
| delete from question where source = 'us' and sid = 100;                                 | delete from question where source = 'us' and sid = 101;            |
| insert into question(source, sid, create_at) values ('us', 100, unix_timestamp(now())); |                                                                    |
|                                                                                         | insert into question(source, sid, create_at) values ('us', 101, unix_timestamp(now())) |
|                                                                                         | DEADLOCK                                                           |
| commit                                                                                  | commit                                                             |

### 常用命令

1. 查看事务隔离级别

    ``` sql 
    SELECT @@global.tx_isolation;
    SELECT @@session.tx_isolation;
    SELECT @@tx_isolation;
    ```


2. 设置隔离级别

    SET [SESSION | GLOBAL] TRANSACTION ISOLATION LEVEL {READ UNCOMMITTED | READ COMMITTED | REPEATABLE READ | SERIALIZABLE}
    例如：set session transaction isolation level read uncommitted;

3. 查看auto_increment机制模式

    ```sql 
    show variables like 'innodb_autoinc_lock_mode';
    ```

4. 查看表状态

    ``` sql 
    show table status like 'plan_branch'\G;
    show table status from test like 'plan_branch'\G;
    ```

5. 查看SQL性能

    ``` sql 
    show profiles
    show profile for query 1;
    ```

6. 查看当前最新事务ID

    每开启一个新事务，记录当前最新事务的id，可用于后续死锁分析。 
    ```sql 
    show engine innodb status\G;
    ```

7. 查看事务锁等待状态情况

    ```sql 
    # 所有innodb正在等待的锁，和被等待的锁
    select * from information_schema.innodb_locks;
    # 查看等待锁的事务
    select * from information_schema.innodb_lock_waits;
    select * from information_schema.innodb_trx;
    ```

8. 查看innodb状态(包含最近的死锁日志)

    ``` sql 
    show engine innodb status;
    ```

9. 查看所有连接

    ``` sql 
    show full processlist;
    ```
    

### 参考
- [Transaction Isolation Levels](https://dev.mysql.com/doc/refman/5.7/en/innodb-transaction-isolation-levels.html)
- [A History of Transaction Histories](https://ristret.com/s/f643zk/history_transaction_histories)
- [MySQL 加锁处理分析](http://hedengcheng.com/?p=771)
- [MySQL加锁分析](http://www.fanyilun.me/2017/04/20/MySQL%E5%8A%A0%E9%94%81%E5%88%86%E6%9E%90)
- [mysql insert锁机制](http://yeshaoting.cn/article/database/mysql%20insert%E9%94%81%E6%9C%BA%E5%88%B6/)