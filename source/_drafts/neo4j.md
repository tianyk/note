---
title: neo4j
author: tyk
date: 2020-09-17 11:21:39
tags:
---

### 下载安装

```
rpm --import https://debian.neo4j.com/neotechnology.gpg.key

touch /etc/yum.repos.d/neo4j.repo

cat <<EOF>  /etc/yum.repos.d/neo4j.repo
[neo4j]
name=Neo4j Yum Repo
baseurl=http://yum.neo4j.com/stable
enabled=1
gpgcheck=1
EOF
```

```
sudo yum install java-11-openjdk.x86_64 neo4j -y
```

### 启动 

```
neo4j -h
```

```
neo4j start 
Directories in use:
  home:         /var/lib/neo4j
  config:       /etc/neo4j
  logs:         /var/log/neo4j
  plugins:      /var/lib/neo4j/plugins
  import:       /var/lib/neo4j/import
  data:         /var/lib/neo4j/data
  certificates: /var/lib/neo4j/certificates
  run:          /var/run/neo4j
Starting Neo4j.
Started neo4j (pid 30143). It is available at http://localhost:7474/
There may be a short delay until the server is ready.
See /var/log/neo4j/neo4j.log for current status.
```

```
# 设置密码
neo4j-admin set-initial-password --require-password-change 123456
```

```
# 设置管理员
neo4j-admin set-default-admin neo4j
```

### 名词解释

<https://www.w3cschool.cn/neo4j/neo4j_building_blocks.html>

- 节点 Node
	
	![](https://test-cos.coursebox.xdf.cn/DUm6x_MH7Xs-87v0XdclL.png)

- 属性
- 关系
- 标签
- 数据浏览器

### Nodes

User/Department/File 
File 目录、文件、软连接

<https://www.ruanyifeng.com/blog/2011/12/inode.html>

```
stat abc

  文件："abc"
  大小：3         	块：8          IO 块：4096   普通文件
设备：fd01h/64769d	Inode：84976       硬链接：1
权限：(0664/-rw-rw-r--)  Uid：( 1003/ sac_dev)   Gid：( 1003/ sac_dev)
最近访问：2020-02-20 00:06:40.943065890 +0800
最近更改：2020-02-20 00:07:19.793454666 +0800
最近改动：2020-02-20 00:07:19.793454666 +0800
创建时间：-
```

```
inode {

}
```

```ts
interface User {
	id: number;
	username: string;
}
```

```ts
interface Department {
	code: number;
	username: string;
}
```

```ts
interface Directory {
	// home
	uid: number;
	gid: number;
	name: string;
	mode: number;
}
```

<https://nodejs.org/api/fs.html#fs_class_fs_stats>

<http://nodejs.cn/api/fs.html#fs_class_fs_stats>
```ts
interface Stats {
	dev: 16777220,
	mode: 33188,
	nlink: 1,
	uid: 501,
	gid: 20,
	rdev: 0,
	blksize: 4096,
	ino: 14214074,
	size: 8,
	blocks: 8,
	atimeMs: 1561174616618.8555,
	mtimeMs: 1561174614584,
	ctimeMs: 1561174614583.8145,
	birthtimeMs: 1561174007710.7478,
	atime: 2019-06-22T03:36:56.619Z,
	mtime: 2019-06-22T03:36:54.584Z,
	ctime: 2019-06-22T03:36:54.584Z,
	birthtime: 2019-06-22T03:26:47.711Z
}
```

```ts
interface File {
	uid: number;
	gid: number;
	name: string;
	size: number;
	mime: string;
	mode: number;
	href: string;
	atime: number;
	mtime: number;
	ctime: number;
}
```

```ts
interface SymbolicLink {
	linkString: string;
}
```

### 标签

Label 可以看做关系型数据库的表

### 垃圾箱实现

删除后的文件解除关系，新关系建立到 `/trash` 

### 目录实现

根目录 `/` `/home/{user/department}`


### 使用示例

1. 创建一个节点

> 节点可以认为是关系型数据库中的一条数据

```
create (f:INode { 
	uid: 1000,
	cid: 1000,
	ino: 1001,
	size: 1024,
	mode: 10000
})
```

`create` 为创建语法，用来创建节点和关系。`f` 可以看做这条数据引用，`INode`可以看做表名。后面 `{}` 里面为节点的属性，可以看做是表的数据。

2. 查询

```
match (f:INode) 
where f.nio = 1000
return f;
```

`match`需要配和`return`语句。`f`可以看做引用，`INode`为表名。后面可以跟查询条件语句`where`，查询后的结果使用`return`返回。

3. 创建关系

```
match (f1:INode), (f2:INode) 
where f1.nio = 1000 and f2.nio = 1001
create (f1) - [r:ParentChild { property: value }] -> (f1)
return r;
```

先使用查询语句查到需要建立关系的节点，使用`create`语句创建关系 `->`。关系使用`[]`语法，可以有属性。

4. 删除语句

```
match (f:INode) 
where f.nio = 1001
delete f;
```
先使用`match` `where` 语句查询到节点，配合 `delete` 语句删除掉节点。

5. 更新属性

```
match (f:INode) 
where f.id = 1000 
set f.size = 4096;
```

```
match (f:INode) 
remove f.foo;
```

`set` 设置属性，`remove` 删除属性。

6. 排序

```
match (f:INode)
return f
order by f.id desc;
```

`return` 语句后跟 `order by` 语句进行排序。多个`property`逗号分隔

7. 合并 UNION 

```
<MATCH Command1>
   UNION
<MATCH Command2>
```

> 要求两个查询的列的名称和类型都相同。联合两个`Label`时，不同的节点又不同的前缀。可以使用 `as` 子句做统一。

> UNION 会去重，如果要返回重复行使用 `UNION ALL`

```
match (f:INode) 
return f.name as name 
union 
match (d:Dept) 
return d.name as name
```

8. 分页 

```
match (f:INode) 
return f 
skip 2 
limit 2;
```

> `skip` 和 `limit` 和 `SQL` 类似。有一个要注意的点 `skip` 要在 `limit` 之前。

9. merge

> `merge` 能创建唯一的节点，提供如果不存在则创建的功能

```
merge (f:INode {
	id: 0, name: '/'
});
```

10. NULL 

> `NULL` 可用来标识属性为空，用法和关系型数据库类型。

```
match (d:Dept) 
where d.id is null 
return d;
```

```
match (d:Dept) 
where d.id is not null 
return d;
```

11. IN 

```
match (f:INode) 
where f.id in [0, 1000] 
return f;
```

12. 函数

> 用在 `return` 子句

```
match (f:INode) 
return f.id, toUpper(f.name);
```

> 用在 `where` 子句

```
match (f:INode) 
where f.name = toUpper('/') 
return f;
```

13. 聚合

```
match (f:INode) 
return sum(f.size);
```

14. 创建一个唯一索引

```
create constraint on (f:INode) 
assert f.id is unique;
```

### 参考

- [https://neo4j.com/download-center/#community](https://neo4j.com/download-center/#community)
- [https://neo4j.com/docs/cypher-manual/current/administration/databases/](https://neo4j.com/docs/cypher-manual/current/administration/databases/)