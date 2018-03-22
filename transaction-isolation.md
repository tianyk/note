## 事物隔离级别

#### 数据库事务特性（ACID）
- 原子性（Atomicity）
    
    事务作为一个整体被执行，包含在其中的对数据库的操作要么全部被执行，要么都不执行。

- 一致性（Consistency）

    事务应确保数据库的状态从一个一致状态转变为另一个一致状态。一致状态的含义是数据库中的数据应满足完整性约束。

- 隔离性（Isolation）：

    多个事务并发执行时，一个事务的执行不应影响其他事务的执行。
    
- 持久性（Durability）：

    已被提交的事务对数据库的修改应该永久保存在数据库中。
        


|     隔离级别     | 脏读（Dirty Read） | 不可重复读（NonRepeatable Read） | 幻读（Phantom Read） |
| ---------------- | :----------------: | :------------------------------: | :------------------: |
| READ-UNCOMMITTED |        可能        |               可能               |         可能         |
| READ-COMMITTED   |       不可能       |               可能               |         可能         |
| REPEATABLE-READ  |       不可能       |              不可能              |         可能         |
| SERIALIZABLE     |       不可能       |              不可能              |        不可能        |


### 参考
- [Transaction Isolation Levels](https://dev.mysql.com/doc/refman/5.7/en/innodb-transaction-isolation-levels.html)
