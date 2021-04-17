---
title: Mysql Explain 解释
date: 2017-01-17 18:27:32
tags: 
---
### Mysql Explain 解释

| 列名             | 类型               | 解释                                                                                                                                  |
|------------------|--------------------|-------------------------------------------------------------------------------------------------------------------------------------|
| **id**           |                    | SELECT语句的ID编号,优先执行编号较大的查询,如果编号相同,则从上向下执行                                                                         |
| **select_type**  | SIMPLE             | 一条没有UNION或子查询部分的SELECT语句                                                                                                    |
| \-               | PIMARY             | 最外层或最左侧的SELECT语句                                                                                                              |
| \-               | UNION              | UNION语句里的第二条或最后一条SELECT语句                                                                                                  |
| \-               | DEPENDENT UNION    | 和UNION类型的含义相似,但需要依赖于某个外层查询                                                                                             |
| \-               | UNION RESULT       | 一条UNION语句的结果                                                                                                                    |
| \-               | SUBQUERY           | 子查询中的第一个SELECT子句                                                                                                              |
| \-               | DEPENDENT SUBQUERY | 和SUBQUERY类型的含义相似,但需要依赖于某个外层查询                                                                                           |
| \-               | DERIVED            | FROM子句里的子查询                                                                                                                      |
| **table**        | t1                 | 各输出行里的信息是关于哪个数据表的                                                                                                         |
| **Partitions**   | NULL               | 将要使用的分区.只有EXPLAIN PARTITIONS ...语句才会显示这一列.非分区表显示为NULL                                                                |
| **type**         |                    | 联接操作的类型,性能由好到差依次如下                                                                                                        |
| \-               | system             | 表中仅有一行                                                                                                                           |
| \-               | const              | 单表中最多有一个匹配行                                                                                                                   |
| \-               | eq_ref             | 联接查询中,对于前表的每一行,在此表中只查询一条记录,使用了PRIMARY或UNIQUE                                                                       |
| \-               | ref                | 联接查询中,对于前表的每一行,在此表中只查询一条记录,使用了INDEX                                                                                 |
| \-               | ref_or_null        | 联接查询中,对于前表的每一行,在此表中只查询一条记录,使用了INDEX,但是条件中有NULL值查询                                                             |
| \-               | index_merge        | 多个索引合并                                                                                                                            |
| \-               | unique_subquery    | 举例说明: value IN (SELECT primary_key FROM single_table WHERE some_expr)                                                              |
| \-               | index_subquery     | 举例说明: value IN (SELECT key_column FROM single_table WHERE some_expr)                                                               |
| \-               | range              | 只检索给定范围的行,包括如下操作符: =, <>, >, >=, <, <=, IS NULL, <=>, BETWEEN, or IN()                                                     |
| \-               | index              | 扫描索引树(略比ALL快,因为索引文件通常比数据文件小)                                                                                           |
| \-               | ALL                | 前表的每一行数据都要跟此表匹配,全表扫描                                                                                                     |
| **possible_keys** | NULL               | MySQL认为在可能会用到的索引.NULL表示没有找到索引                                                                                           |
| **key**          | NULL               | 检索时,实际用到的索引名称.如果用了index_merge联接类型,此时会列出多个索引名称,NULL表示没有找到索引。可以使用 `force index (index_name)` 强制指定索引|
| **key_len**      | NULL               | 实际使用的索引的长度.如果是复合索引,那么只显示使用的最左前缀的大小                                                                              |
| **ref**          | NULL               | MySQL用来与索引值比较的值, 如果是单词const或者???,则表示比较对象是一个常数.如果是某个数据列的名称,则表示比较操作是逐个数据列进行的.NULL表示没有使用索引    |
| **rows**         |                    | MySQL为完成查询而需要在数据表里检查的行数的估算值.这个输出列里所有的值的乘积就是必须检查的数据行的各种可能组合的估算值                                   |
| **Extra**        | Using filesort     | 需要将索引值写到文件中并且排序,这样按顺序检索相关数据行                                                                                        |
| \-               | Using index        | MySQL可以不必检查数据文件, 只使用索引信息就能检索数据表信息                                                                                   |
| \-               | Using temporary    | 在使用 GROUP BY 或 ORDER BY 时,需要创建临时表,保存中间结果集                                                                                |
| \-               | Using where        | 利用SELECT语句中的WHERE子句里的条件进行检索操作                                                                                            |

### 实验

#### 实验1
> 参照物

```sql
explain select
    template.id as 'id', ifnull(likes.total, 0) as 'likes', ifnull(ratings.stars, 0) as 'ratings', ifnull(rating.star, 0) as 'rating', if(isnull(iLike.id), 0, 1) as 'isLike'
from template
left join (select template_id, avg(star) as 'stars' from rating group by template_id) ratings
on template.id = ratings.template_id
left join (select template_id, count(1) as total from `like` group by template_id) as likes
on template.id = likes.template_id
left join `like` as iLike
on template.id = iLike.template_id and iLike.user_id = 10000
left join rating
on template.id = rating.template_id and rating.user_id = 10000;
```

| id | select_type | table      | type  | possible_keys | key     | key_len | ref  | rows | Extra                           |
|----|-------------|------------|-------|---------------|---------|---------|------|------|---------------------------------|     
|  1 | PRIMARY     | template   | index | NULL          | PRIMARY | 4       | NULL |   64 | Using index                     |
|  1 | PRIMARY     | derived2   | ALL   | NULL          | NULL    | NULL    | NULL |    7 |                                 |
|  1 | PRIMARY     | derived3   | ALL   | NULL          | NULL    | NULL    | NULL |    5 |                                 |
|  1 | PRIMARY     | iLike      | ALL   | NULL          | NULL    | NULL    | NULL |    5 |                                 |
|  1 | PRIMARY     | rating     | ALL   | NULL          | NULL    | NULL    | NULL |    7 |                                 |
|  3 | DERIVED     | like       | ALL   | NULL          | NULL    | NULL    | NULL |    5 | Using temporary; Using filesort |
|  2 | DERIVED     | rating     | ALL   | NULL          | NULL    | NULL    | NULL |    7 | Using temporary; Using filesort |


#### 实验2
> 调整子句顺序(6,7 -> 4,5) 对比实验1

```sql
explain select
    template.id as 'id', ifnull(likes.total, 0) as 'likes', ifnull(ratings.stars, 0) as 'ratings', ifnull(rating.star, 0) as 'rating', if(isnull(iLike.id), 0, 1) as 'isLike'
from template
left join (select template_id, count(1) as total from `like` group by template_id) as likes
on template.id = likes.template_id
left join (select template_id, avg(star) as 'stars' from rating group by template_id) ratings
on template.id = ratings.template_id
left join `like` as iLike
on template.id = iLike.template_id and iLike.user_id = 10000
left join rating
on template.id = rating.template_id and rating.user_id = 10000;
```

| id | select_type | table      | type  | possible_keys | key     | key_len | ref  | rows | Extra                           |      
|----|-------------|------------|-------|---------------|---------|---------|------|------|---------------------------------|     
|  1 | PRIMARY     | template   | index | NULL          | PRIMARY | 4       | NULL |   64 | Using index                     |      
|  1 | PRIMARY     | derived2   | ALL   | NULL          | NULL    | NULL    | NULL |    5 |                                 |      
|  1 | PRIMARY     | derived3   | ALL   | NULL          | NULL    | NULL    | NULL |    7 |                                 |      
|  1 | PRIMARY     | iLike      | ALL   | NULL          | NULL    | NULL    | NULL |    5 |                                 |      
|  1 | PRIMARY     | rating     | ALL   | NULL          | NULL    | NULL    | NULL |    7 |                                 |      
|  3 | DERIVED     | rating     | ALL   | NULL          | NULL    | NULL    | NULL |    7 | Using temporary; Using filesort |      
|  2 | DERIVED     | like       | ALL   | NULL          | NULL    | NULL    | NULL |    5 | Using temporary; Using filesort |      


#### 实验3
> 调整子句顺序(10,11 -> 8,9) 对比实验2

```sql
explain select
    template.id as 'id', ifnull(likes.total, 0) as 'likes', ifnull(ratings.stars, 0) as 'ratings', ifnull(rating.star, 0) as 'rating', if(isnull(iLike.id), 0, 1) as 'isLike'
from template
left join (select template_id, count(1) as total from `like` group by template_id) as likes
on template.id = likes.template_id
left join (select template_id, avg(star) as 'stars' from rating group by template_id) ratings
on template.id = ratings.template_id
left join rating
on template.id = rating.template_id and rating.user_id = 10000
left join `like` as iLike
on template.id = iLike.template_id and iLike.user_id = 10000;
```

| id | select_type | table      | type  | possible_keys | key     | key_len | ref  | rows | Extra                           |
|----|-------------|------------|-------|---------------|---------|---------|------|------|---------------------------------|     
|  1 | PRIMARY     | template   | index | NULL          | PRIMARY | 4       | NULL |   65 | Using index                     |
|  1 | PRIMARY     | derived2   | ALL   | NULL          | NULL    | NULL    | NULL |    5 |                                 |
|  1 | PRIMARY     | derived3   | ALL   | NULL          | NULL    | NULL    | NULL |    7 |                                 |
|  1 | PRIMARY     | rating     | ALL   | NULL          | NULL    | NULL    | NULL |    7 |                                 |
|  1 | PRIMARY     | iLike      | ALL   | NULL          | NULL    | NULL    | NULL |    5 |                                 |
|  3 | DERIVED     | rating     | ALL   | NULL          | NULL    | NULL    | NULL |    7 | Using temporary; Using filesort |
|  2 | DERIVED     | like       | ALL   | NULL          | NULL    | NULL    | NULL |    5 | Using temporary; Using filesort |


1. 表连接中有子查询的先执行(对比实验1、2、3)，相同情况下排在后面的优先级高(对比实验1、2)。
2. 表连接，从上到下执行(对比实验2、3)


### 参考
[【1】](https://github.com/Yhzhtk/note/issues/39)
