---
title: mysql-user
author: tyk
date: 2019-08-09 16:48:40
tags:
---

### MySQL用户和权限 

1. 创建用户

	create user 'user'@'host' identified 'password';

	> host 为 % 代表所有

2. 修改密码

	set password for 'user'@'host' = password('NewPassword'); 

3. 授予权限 

	grant all on database.table to 'user'@'host';

	> `with grant option` 用户可以授予权限通过 grant 语句授权给其它用户 

4. 撤销权限 
	
5. 删除用户

	drop user 'user'@'host';