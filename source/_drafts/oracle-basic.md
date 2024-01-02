---
title: Oracle入门
author: tyk
date: 2022-10-13 18:42:00
tags:
---



## Oracle入门


0. Oracle数据库和Oracle实例

Oracle数据库指数据文件，Oracle实例指Oracle进程，对外提供数据增删改查等服务。

0. Oracle Docker

    https://hub.docker.com/r/jaspeen/oracle-11g

    ```
    docker run -d --name oracle11g -p 1521:1521 -v <install_folder>:/install -v <local_dpdump>:/opt/oracle/dpdump jaspeen/oracle-11g

    docker run --name=oracle11g \
        -d \
        --net=host \
        --restart=always \
        oracle11g-installed:latest
    ```

    docker run --name=ogg \
        -d \
        --net=host \
        --restart=always \
        oraclelinux:8

0. database/schema/table

    ![](https://docs.oracle.com/cd/B13789_01/server.101/b10743/cncpt041.gif)

    
    **一个用户一般对应一个schema,该用户的schema名等于用户名，并作为该用户缺省schema。**这也就是我们在企业管理器的方案下看到schema名都为数据库用户名的原因。Oracle数据库中不能新创建一个schema，要想创建一个schema，只能通过创建一个用户的方法解决(Oracle中虽然有create schema语句，但是它并不是用来创建一个schema的)，在创建一个用户的同时为这个用户创建一个与用户名同名的schem并作为该用户的缺省shcema。即schema的个数同user的个数相同，而且schema名字同user名字一一 对应并且相同，所有我们可以称schema为user的别名，虽然这样说并不准确，但是更容易理解一些。

    一个用户有一个缺省的schema，其schema名就等于用户名，**当然一个用户还可以使用其他的schema**。如果我们访问一个表时，没有指明该表属于哪一个schema中的，系统就会自动给我们在表上加上缺省的sheman名。比如我们在访问数据库时，访问scott用户下的emp表，通过select * from emp; 其实，这sql语句的完整写法为select * from scott.emp。在数据库中一个对象的完整名称为schema.object，而不属user.object。类似如果我们在创建对象时不指定该对象的schema，在该对象的schema为用户的缺省schema。这就像一个用户有一个缺省的表空间，但是该用户还可以使用其他的表空间，如果我们在创建对象时不指定表空间，则对象存储在缺省表空间中，要想让对象存储在其他表空间中，我们需要在创建对象时指定该对象的表空间。


0. 配置plsqld登陆

    ![oracle-client-config](/images/oracle-client-config.png)

    ```
    ORCL=
    (DESCRIPTION =
        (ADDRESS_LIST =
            (ADDRESS = (PROTOCOL = TCP)(HOST = IP地址) (PORT = 端口))
        )
        (CONNECT_DATA =
            (SID = 实例IDORCL)
        )
    )
    ```

1. 修改密码

    ```
    ALTER USER user_name IDENTIFIED BY "newpass";
    ```

2. 创建用户并授予角色

    ```
    create user user_name identified by admin_password;
    grant connect,dba,resource to zhangsan;

    grant sysdba to user_name;
    ```

    1. DBA:该角色具有数据库所有的权限。
    2. CONNECT:该角色具有连接数据库的权限，和create session的权限一样。
    3. RESOURCE:该角色是应用程序开发角色，具有如下权限

3. 查询**当前**用户权限
   
    ```
    SELECT * FROM user_sys_privs; 
    ```

4. 查询**当前**用户角色

    ```
    SELECT * FROM USER_ROLE_PRIVS;
    ```

5. 创建表

    ```sql
    -- 定义表
    create table users (
        id number(10) primary key,
        username varchar2(100) not null,
        birthday DATE not null
    );

    -- 主键序列
    create sequence users_pk_seq
    minvalue 1
    nomaxvalue 
    increment by 1
    start with 1000 nocache;

    -- 触发器
    CREATE OR REPLACE TRIGGER user_pk_seq_trg
    BEFORE INSERT ON users
    FOR EACH ROW
    -- 保留原ID
    -- WHEN (new.id IS NULL)
    BEGIN
        SELECT users_pk_seq.NEXTVAL INTO :new.id FROM DUAL;
    END;
    ```

6. 打开归档日志

    以DBA角色登陆
    ```
    sqlplus /nolog
        CONNECT sys/password AS SYSDBA
    ```

    查看归档日志是否开启。`Database log mode`为`Archive Mode`表示开启。
    ```
    archive log list;
    ```

    开启归档日志。如果目录没有创建，需要先创建。
    ```
    alter system set db_recovery_file_dest_size = 1G;
    alter system set db_recovery_file_dest = '/opt/oracle/oradata/recovery_area' scope=spfile;
    shutdown immediate;
    startup mount;
    alter database archivelog;
    alter database open;
    ```

7. Oracle 附加日志(supplemental log)

     附加日志（supplemental log）可以指示数据库在日志中添加额外信息到日志流中，以支持基于日志的工具，如逻辑standby、streams、GoldenGate、LogMiner。可以在数据库和表上设置。

8. ogg静默安装

    ```
    runInstaller -silent -responseFile {YOUR_OGG_INSTALL_FILE_PATH}/response/oggcore.rsp
    ```

    [Oracle GoldenGate Downloads](https://www.oracle.com/middleware/technologies/goldengate-downloads.html)
    [Mysql 8.0 OGG21C 安装使用](https://icode.best/i/94950344653310)
    [Mysql 8.0 OGG21C 安装使用](https://www.dounaite.com/article/625487933351efabace5b751.html)
    [基于OGG实现Oracle 11G双主同步](https://www.modb.pro/db/518157)
    http://blog.itpub.net/637517/viewspace-2894440/
    https://ora-base.com/2022/08/18/how-to-install-goldengate-21c-in-silent-mode/
    http://www.dbaglobe.com/2021/08/oracle-21c-on-linux-silent-installation.html
    https://www.dbasolved.com/2022/04/silent-install-for-oracle-goldengate-21c-big-data-microservices-edition-step-1-of-2/
    https://blog.csdn.net/weixin_45694422/article/details/121792891
    https://www.cnblogs.com/margiex/p/15192860.html
    https://www.oracle-scn.com/oracle-goldengate-21c-new-feature-oracle-database-unified-build-support/
    https://zhuanlan.zhihu.com/p/573068284
    https://www.modb.pro/db/414869
    https://juejin.cn/post/7151775075161620511
    https://blog.csdn.net/m0_60311330/article/details/118992153
    https://help.aliyun.com/apsara/enterprise/v_3_12_0_20200630/datahub/enterprise-ascm-user-guide/oracle-golden-gate.html
    https://www.cnblogs.com/andy6/p/6505403.html
    https://geekpeach.org/zh-hant/oracle-golden-gate-ggsci-%E5%91%BD%E4%BB%A4%E5%BF%AB%E9%80%9F%E5%8F%83%E8%80%83%EF%BC%88%E5%82%99%E5%BF%98%E5%96%AE%EF%BC%89
    https://oracle-base.com/articles/21c/oracle-db-21c-installation-on-oracle-linux-8#Installation
    [OGG参数PURGEOLDEXTRACTS](https://www.cnblogs.com/lvcha001/p/14871273.html)
    https://cloud.tencent.com/developer/article/1663624


### 参考

- [Oracle 权限（grant、revoke）](https://www.cnblogs.com/chenmh/p/6001977.html)
- [OGG](https://help.aliyun.com/document_detail/193506.html)
- [ogg](https://blog.csdn.net/qq_28356739/article/details/88585561)
- [gg](https://dongkelun.com/2018/05/23/oggOracle2Kafka/)