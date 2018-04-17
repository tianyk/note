## InnoDB存储引擎 - 姜承尧

### 第四章 表
本章主要讲的是数据在表中是如何存放的。数据都被逻辑地存放在一个空间中，称之为表空间（tablespace）。表空间又由段（segment）、区（extent）、页（page）组成。

![逻辑存储结构](images/WX20180413-150336@2x.png)

表空间有各种段组合而成，常见的段有`数据段`、`索引段`、`回滚段`。段的内部是一个个区组成，区大小固定为`1MB`。区有连续的页构成，默认情况下一个页`16KB`，也就是说有连续的64个页组成一个区。使用`innodb_page_size`可以设置页的大小。页是InnoDB磁盘管理的最小单位，每次读取写入都是最少一个页。

InnoDB记录是以行的形式存储的，这就意味着页中存的是一行一行的数据（一个页最多能存16KB/2-200行的记录，即7992行记录）。

最初版本的InnoDB提供`Compact`和`Redundant`两种格式来存放行数据，最新的版本默认使用`Compact`格式。使用命令`SHOW TABLE STATUS LIKE 'table_name'`可以查看当前表使用的行格式，`row_format`属性即表示正在使用的格式。
![row format](images/innodb-row-format.png)

// TODO 文件格式
除了行格式外，还有一个叫做文件格式。以前支持的`Compact`和`Redundant`格式称为`Antelope`文件格式。`Antelope`是`innodb-base`的文件格式，新的文件格式称为Barracuda文件格式。Barracuda文件格式下拥有两种新的行记录格式：`Compressed`和`Dynamic`。`Barracude`也支持`Antelope`文件格式。使用命令`SHOW VARIABLES LIKE'innodb_file_format'`可以查看当前的文件格式。

|文件格式	| 支持行格式	| 特性|
|---------|---------|---------|
|Antelope | COMPACT、REDUNDANT|Compact和redumdant的区别在就是在于首部的存存内容区别。compact的存储格式为首部为一个非NULL的变长字段长度列表。redundant的存储格式为首部是一个字段长度偏移列表（每个字段占用的字节长度及其相应的位移）。在Antelope中对于变长字段，低于768字节的，不会进行overflow page存储，某些情况下会减少结果集IO。|
Barracuda| DYNAMIC、COMPRESSED|这两者主要是功能上的区别功能上的。　另外在行里的变长字段和Antelope的区别是只存20个字节，其它的overflow page存储。
另外这两都需要开启innodb_file_per_table=1|

![barracuda-overflow-page](images/barracuda-overflow-page.png)

行溢出指的是数据放在了数据页之外，一个页如果至少能放置两条数据那么就不会发生行溢出的情况。varchar也可能发生行溢出，blob也可能不发生溢出。前提条件至少保证一个页能存放两条记录。

InnoDB数据页内部存储结构，InnoDB数据页由以下7个部分组成：
![数据页内部存储结构](images/innodb-page-struct.png)
其中File Header、Page Header、File Trailer的大小是固定的，分别为38、56、8字节，这些空间用来标记该页的一些信息，如Checksum，数据页所在B+树索引的层数等。User Records、Free Space、Page Directory这些部分为实际的行记录存储空间，因此大小是动态的。

- File Header（文件头）

- Page Header（页头）

- Infimun和Supremum Records

    在InnoDB存储引擎中，每个数据页中有两个虚拟的行记录，用来限定记录的边界。Infimum记录是比该页中任何主键值都要小的值，Supremum指比任何可能大的值还要大的值。

    ![](images/infimun&supremum-records.png)

- User Records（用户记录，即行记录）

- Free Space（空闲空间）

    Free Space很明显指的就是空闲空间，同样也是个链表数据结构。在一条记录被删除后，该空间会被加入到空闲链表中。

- Page Directory（页目录）

- File Trailer（文件结尾信息）

    为了检测页是否已经完整地写入磁盘（如可能发生的写入过程中磁盘损坏、机器关机等），InnoDB存储引擎的页中设置了File Trailer部分。File Trailer只有一个FIL_PAGE_END_LSN部分，占用8字节。前4字节代表该页的checksum值，最后4字节和File Header中的FIL_PAGE_LSN相同。

分区表