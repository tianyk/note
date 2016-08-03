### elasticsearch和传统数据库对照关系

> 在Elasticsearch中，文档归属于一种类型(type),而这些类型存在于索引(index)中，我们可以画一些简单的对比图来类比传统关系型数据库：

```
Relational DB -> Databases -> Tables -> Rows -> Columns
Elasticsearch -> Indices   -> Types  -> Documents -> Fields
```                                                                                                                                                                                                                
Elasticsearch集群可以包含多个索引(indices)（数据库），每一个索引可以包含多个类型(types)（表），每一个类型包含多个文档(documents)（行），然后每个文档包含多个字段(Fields)（列）。

### logstash elasticsearch output 配置

<https://www.elastic.co/guide/en/logstash/current/plugins-outputs-elasticsearch.html>

![](images/QQ20160803-0.png)

### 参考
[【1】](http://es.xiaoleilu.com/010_Intro/25_Tutorial_Indexing.html)
