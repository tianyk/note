---
title: Oracle入门
author: tyk
date: 2022-10-13 18:42:00
tags:
---

## Oracle入门

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
