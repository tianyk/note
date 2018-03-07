## Redis
`Redis`是一个专业的缓存数据库，像`Memcache`一样。和`Memcache`不同的是，`Redis`支持更丰富的数据类型及持久化。

### 数据类型

#### String 
get、set、incr、decr、len、append、
#### Hash 

#### List 

#### Set 

#### Sorted Set 

### 持久化
#### RDB
子进程直接dump整个缓存。

优点
- 恢复快
- 格式简单适合做备份

缺点
- 容易丢失数据
- `SAVE`会造成服务器暂停

#### AOF
像binlog一样，存储的是每个操作命令。

优点
- flush间隔更小，可靠性较高
- 不会造成服务器暂停

缺点
- 文件较大、恢复较慢


### 参考
- [持久化（persistence）](http://redisdoc.com/topic/persistence.html)
