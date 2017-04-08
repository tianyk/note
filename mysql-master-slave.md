### 简介
MySQL 主从同步是在 MySQL 主从复制(Master-Slave Replication)基础上实现的，通过设置在Master MySQL上 的 binlog (使其处于打开状态)，Slave MySQL 上通过一个 I/O 线程从 Master MySQL 上读取 binlog，然后传输到 Slave MySQL 的中继日志中，然后 Slave MySQL 的 SQL 线程从中继日志中读取中继日志，然后应用到 Slave MySQL 的数据库中。这样实现了主从数据同步功能。

### 配置主从同步

#### 配置主库

1. 开启主数据库的 binlog（二进制日志功能），并设置 server-id

    修改配置文件
    ```
    [mysqld]

    server-id = 1  
    log-bin = mysql-bin   
    binlog-format = row
    ```

2. 创建用于同步数据的账号 slave   

    ```
    grant replication slave on *.* to 'slave'@'%' identified by 'slave2017';

    flush privileges;   
    ```

3. 锁表并查看当前日志名称和位置(pos)    

    锁表
    ```
    flush table with read lock;
    ```
    > 5.1版本的MySQL版本的锁表语句是flush tables with read lock; 5.5版本的MySQL的锁表语句是flush table with read lock;

    查看位置
    ```
    mysql> show master status;  
    +------------------+----------+--------------+------------------+  
    | File             | Position | Binlog_Do_DB | Binlog_Ignore_DB |  
    +------------------+----------+--------------+------------------+  
    | mysql-bin.000009 |      196 |              |                  |  
    +------------------+----------+--------------+------------------+  
    1 row in set  
    ```

4. 备份当前主数据库的全部数据（全备）
    ```
    mysqldump -uroot -ppassword -S /var/lib/mysql/mysql.sock  -B curder --events --master-data=2 > rep.sql
    ```
    > 也可以直接将导出结果导入从库
    ```
    mysqldump -uroot -ppassword -S /var/lib/mysql/mysql.sock  -B curder --events --master-data=2 | mysql -uroot -paaaaaa -h10.0.1.4
    ```

5. 解锁数据库
    ```
    unlock tables;
    ```

#### 配置从库
1. 配置 server-id

    ```
    [mysqld]

    server-id = 2
    ```

2. 将全备导入到数据库

    ```
    mysql -uroot -paaaaaa -S /var/lib/mysql/mysql.sock < ~/rep.sql
    ```

3. 执行同步命令

    ```
    > change master to master_host='10.0.1.11',master_user='slave',master_password='slave2017',master_log_file='mysql-bin.000009',master_log_pos=196;  
    ```
    > 这里的 `master_log_file` 和 `master_log_pos` 就是主表锁表后执行`show master status;` 输出的。

    开启同步
    ```
    start slave;
    ```

4. 查看同步状态

    ```
    show slave status\G
    ```

    > Slave_IO_Running: Yes # 从库IO进程(从master服务器取log的线程)    
    > Slave_SQL_Running: Yes # 从库SQL进程(读取relaylog 写数据)    
    > Seconds_Behind_Master: 0 # 落后主库的秒数    

### 参考
[【1】](http://wangwei007.blog.51cto.com/68019/965575)[【2】](http://blog.csdn.net/mycwq/article/details/17136001) [【3】](https://www.kancloud.cn/curder/mysql/71977)[【4】](http://www.cnblogs.com/martinzhang/p/3454386.html)
