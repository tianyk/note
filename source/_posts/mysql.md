---
title: MySQL
date: 2016-12-28 17:50:36
tags: 
---
## MySQL

### chang常用命令

1.	数据库复制

```shell
mysqldump db_1 -uroot -ppassword -h10.0.1.4 --add-drop-table | mysql db_2 -uroot -ppassword -h10.0.1.4
```
> --add-drop-table 先删除后创建表    
> --skip-add-drop-table 直接创建表    
> --skip-extended-insert 如果记录存在则不插入（每条数据一个insert语句）  
> --no-create-info 不创建表，只导入   
> --lock-tables=false 不锁表
> --set-gtid-purged=OFF 全局事物

import 
> -f skip-errors

``` 
mysqldump -u [user] -p [db_name] | gzip > [filename_to_compress.sql.gz]
gunzip < [compressed_filename.sql.gz]  | mysql -u [user] -p[password] [databasename]
```

2. 修改MySQL用户密码安全等级
[参考](http://www.cnblogs.com/ivictor/p/5142809.html)

### 安装的MySQL

[参考](https://dev.mysql.com/doc/refman/5.7/en/linux-installation-yum-repo.html) [MySQL创建用户与授权](http://www.jianshu.com/p/d7b9c468f20d)

1. Adding the MySQL Yum Repository

    * Go to the Download MySQL Yum Repository page (http://dev.mysql.com/downloads/repo/yum/) in the MySQL Developer Zone.

    * Select and download the release package for your platform.
    ``` bash
    wget https://repo.mysql.com/mysql57-community-release-el6-11.noarch.rpm
    ```

    * Install the downloaded release package with the following command
    ``` bash
    yum localinstall mysql57-community-release-el6-11.noarch.rpm
    ```

    ```
    # 查看那些 repository 是启用状态
    yum repolist enabled | grep "mysql.*-community.*"
    ```

2. Selecting a Release Series

    ```
    yum repolist all | grep mysql
    ```

    ```
    # 启用 repository
    sudo yum-config-manager --disable mysql57-community
    sudo yum-config-manager --enable mysql56-community
    ```

3. Installing MySQL

    ```
    sudo yum install mysql-community-server
    ```

4. Starting the MySQL Server

    * Start the MySQL server
    ```
    sudo service mysqld start
    ```

    * Check the status of the MySQL
    ```
    sudo service mysqld status
    ```

    * Find password for the superuser
    ```
    sudo grep 'temporary password' /var/log/mysqld.log
    ```

    * Login & set a custom password
    ```
    mysql -uroot -p
    ```

    ```
    ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPass4!';
    # OR
    SET PASSWORD FOR 'bob'@'%.loc.gov' = PASSWORD('newpass');
    ```

    ```
    # 创建用户并授权
    CREATE USER 'username'@'host' IDENTIFIED BY 'password';
    GRANT privileges ON databasename.tablename TO 'username'@'host'

    e.g.
    CREATE USER 'pig'@'%' IDENTIFIED BY 'pig2017';
    GRANT ALL ON *.* TO 'pig'@'%' WITH GRANT OPTION;
    flush privileges;   
    ```

    > 权限列表：select、delete、update、create、drop、all privileges 

    ```
    # 安全检查，主要包括密码检查、匿名用户、test库、root远程登录
    mysql_secure_installation
    ```


> MySQL编译安装常用编译选项    
-DCMAKE_INSTALL_PREFIX=/usr/local/mysql　　　　　　　　　　　　[MySQL安装的根目录]    
-DMYSQL_DATADIR=/mydata/mysql/data　　　　　　　　　　　　　　　[MySQL数据库文件存放目录]    
-DSYSCONFDIR=/etc　　　　　　　　　　　　　　　　　　　　　　　　[MySQL配置文件所在目录]    
-DMYSQL_USER=mysql　　　　　　　　　　　　　　　　　　　　　　　[MySQL用户名]          
-DWITH_MYISAM_STORAGE_ENGINE=1　　　　　　　　　　　　　　　　　[MySQL的数据库引擎]    
-DWITH_INNOBASE_STORAGE_ENGINE=1　　　　　　　　　　　　　　　　[MySQL的数据库引擎]    
-DWITH_ARCHIVE_STORAGE_ENGINE=1　　　　　　　　　　　　　　　　[MySQL的数据库引擎]    
-DWITH_MEMORY_STORAGE_ENGINE=1　　　　　　　　　　　　　　　　　[MySQL的数据库引擎]    
-DWITH_READLINE=1　　　　　　　　　　　　　　　　　　　　　　　　[MySQL的readline library,批量导入数据]    
-DMYSQL_UNIX_ADDR=/var/run/mysql/mysql.sock　　　　　　　　　　[MySQL的通讯目录]    
-DWITH-LIBWRAP=0　　　　　　　　　　　　　　　　　　　　　　　　　[是否支持libwrap]　    
-DENABLE_DOWNLOADS=1　　　　　　　　　　　　　　　　　　　　　　　[编译时允许自主下载相关文件]    
-DDEFAULT_CHARSET=utf8　　　　　　　　　　　　　　　　　　　　　　[设置默认字符集为utf8]    
-DDEFAULT_COLLATION=utf8_general_ci　　　　　　　　　　　　　　　[设置默认排序字符集规则]   
<https://dev.mysql.com/doc/refman/5.7/en/source-configuration-options.html>


### 常见问题
#### 1. mysqldump: Couldn't execute 'SHOW VARIABLES LIKE 'gtid\_mode'': Table 'performance_schema.session_variables' doesn't exist (1146)

先停止数据库，然后运行
```
mysql_upgrade -u root -p --force
```
重启服务