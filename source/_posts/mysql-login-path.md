---
title: mysql-login-path
author: tyk
date: 2020-09-28 14:26:16
tags:
---



## login-path

`login-path` 选项能实现快捷登录MySQL服务器，我们不需要每次都输入用户名、host、密码等登录认证信息，是一种即安全又遍历的方法。

使用 `mysql_config_editor` 工具将登录MySQL服务的认证信息加密保存在 `.mylogin.cnf` 文件（默认位于用户主目录）。之后 MySQL 客户端工具可通过读取该加密文件连接 MySQL，避免重复输入登录信息和敏感信息暴露。

### 配置 login-path

```bash
mysql_config_editor set --login-path=dev --user=dev --host=172.26.8.143 --password
```

可以配置多个登录信息。`login-path`可以看做登录信息的别名，方便使用时引用。更详细的配置信息查看 `mysql_config_editor set --help`。

```bash
mysql_config_editor set --login-path=test --user=test --host=172.26.8.144 --password
```

这里又配置了一个 `login-path` 为 `test` 的登录信息。

### 查看配置过的登录信息 

```shell
mysql_config_editor print --all
```

```ini
[dev]
user = dev
password = *****
host = 172.26.8.143
[test]
user = test
password = *****
host = 172.26.8.144
```

### 使用 `login-path` 登录

```shell
mysql --login-path=dev
```

### 删除 `login-path` 

```shell
mysql_config_editor remove --login-path=dev
```

### 参考 
- [MySQL login-path 本地快捷登录](https://www.cnblogs.com/David-domain/p/11176474.html)
- [MySQL Configuration Utility](https://dev.mysql.com/doc/refman/5.7/en/mysql-config-editor.html)