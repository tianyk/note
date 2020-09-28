---
title: Storing-trees-in-RDBMS
author: tyk
date: 2020-09-22 20:01:05
tags:
---

```sql
CREATE TABLE `inode` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=100002 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `inode_tree` (
  `ancestor` int(11) unsigned NOT NULL,
  `descendant` int(11) unsigned NOT NULL,
  `depth` int(11) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`ancestor`,`descendant`,`depth`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

```sql
insert into inode (id, name) 
values 
(0, '/'),
(1, 'home'),
(1001, 'ming'),
(1002, 'xdf'),
(10001, 'desktop'),
(10002, 'desktop'),
(10003, 'documents'),
(10004, 'documents'),
(10005, 'movies'),
(10006, 'movies'),
(10007, 'trash'),
(10008, 'trash'),
(100001, '文档.pdf');
```

``` sql
-- 新增一个节点
insert into inode_tree(ancestor, descendant, depth)
	-- 在 `A` 后面添加后代 `B`
	-- 给所有后代是 `A` 的节点都添加后代 `B`
	-- 深度 `+1` 
	select t.`ancestor`, 10008, t.`depth` + 1 as depth
	from inode_tree as t 
	where t.`descendant` = 1002
union all
	-- 添加当前节点，深度为 0
	select 10008, 10008, 0;
```

```sql
drop function if exists addNode; 

DELIMITER ;;
create function addNode(parent_id int, node_name varchar(100)) 
	returns int
begin
	-- 新节点 ID
	declare node_id int unsigned;
	insert into inode(name) value(node_name);
	select last_insert_id() into node_id;

	-- 新增一个节点
	insert into inode_tree(ancestor, descendant, depth)
		-- 在 `A` 后面添加后代 `B`
		-- 给所有后代是 `A` 的节点都添加后代 `B`
		-- 深度 `+1` 
		select t.`ancestor`, node_id, t.`depth` + 1 as depth
		from inode_tree as t 
		where t.`descendant` = parent_id
	union all
		-- 添加当前节点，深度为 0
		select node_id, node_id, 0;
	return 0;
end;;
DELIMITER ;
```

```sql
-- 删除一个节点（包括子节点）
delete from inode_tree t
where t.`descendant` in (
	-- 先查询出祖先为 `A` 的节点，查出 `A` 的所有后代。这就是所有要删除的节点
	-- 再删除所有关系中子孙为这些节点的关系 
	select t.`descendant`
	from inode_tree as t 
	where t.`ancestor` = 1002
) as tt;
```

```sql
drop function if exists delNode; 

DELIMITER ;;
create function delNode(node_id int) 
	returns int
begin
	-- 删除一个节点（包括子节点）
	delete t, ino
	from inode_tree as t
		join inode_tree as _t
		on t.`descendant` = _t.`descendant`
		join inode as ino
		on ino.`id` = _t.`descendant`
	where _t.`ancestor` = node_id;
	
	return 0;
end;;
DELIMITER ;
```

```sql 
-- 删除一个节点（包括子节点）
delete t
from inode_tree as t
	join inode_tree as _t
	on t.`descendant` = _t.`descendant`
where _t.`ancestor` = 1002
```

```sql

-- 孤立节点
delete tree
from inode_tree as tree
-- 查询所有父节点
join inode_tree as supertree
on tree.`ancestor` = supertree.`ancestor`  
-- 查询所有子节点
join inode_tree as subtree 
on tree.`descendant` = subtree.`descendant`
-- 父节点（排除自己）
where supertree.`descendant` = 3 and supertree.`ancestor` != 3
-- 子节点
and subtree.`ancestor` = 3;

select t.* from inode_tree t
where t.`ancestor` in (
	-- 父节点 (1, 2)
	select distinct supertree.`ancestor`
	from inode_tree as supertree
	where supertree.`descendant` = 3 and supertree.`ancestor` != 3
)
and t.`descendant` in (
	-- 子节点 (5, 6, 7, 9)
	select distinct subtree.`descendant`
	from inode_tree as subtree
	where subtree.`ancestor` = 3 
)
```

```sql
-- 移动节点

select supertree.`ancestor`, subtree.`descendant`, supertree.`depth` + subtree.`depth` + 1 as depth
from inode_tree as supertree
cross join inode_tree as subtree
where supertree.`descendant` = 14 
and subtree.`ancestor` = 3;

```

``` sql
drop function if exists mvNode; 

DELIMITER ;;
create function mvNode(node_id int, parent_id int) 
	returns int
begin
	-- 孤立节点
	delete tree
	from inode_tree as tree
		-- 查询所有父节点
		join inode_tree as supertree
		on tree.`ancestor` = supertree.`ancestor`  
		-- 查询所有子节点
		join inode_tree as subtree 
		on tree.`descendant` = subtree.`descendant`
		-- 父节点（排除自己）
	where supertree.`descendant` = node_id and supertree.`ancestor` != node_id
		-- 子节点
		and subtree.`ancestor` = node_id;

	-- 建立新关系
	insert into inode_tree(ancestor, descendant, depth)
		-- 新节点到父节点的深度 + 子节点到子节点祖先的深度 + 1（重新挂载后深度 +1）
		select supertree.`ancestor`, subtree.`descendant`, supertree.`depth` + subtree.`depth` + 1 as depth
		-- 新节点的父节点
		from inode_tree as supertree
		-- 旧节点的子节点（包括自己）笛卡尔积
		cross join inode_tree as subtree
		where supertree.`descendant` = parent_id 
		and subtree.`ancestor` = node_id;

	return 0;
end;;
DELIMITER ;
```