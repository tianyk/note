---
title: 软连接与硬链接
date: 2017-02-06 15:18:57
tags: 
---
### 简介
Linux 链接分两种，一种被称为硬链接（Hard Link），另一种被称为符号链接（Symbolic Link）。默认情况下，`ln`命令产生硬链接。

![](/images/QQ20170206-155521@2x.jpg)

### 硬连接
硬连接指通过索引节点来进行连接。在Linux的文件系统中，保存在磁盘分区中的文件不管是什么类型都给它分配一个编号，称为索引节点号（Inode Index）。在 Linux 中，多个文件名指向同一索引节点是存在的。一般这种连接就是硬连接。硬连接的作用是允许一个文件拥有多个有效路径名，这样用户就可以建立硬连接到重要文件，以防止“误删”的功能。其原因如上所述，因为对应该目录的索引节点有一个以上的连接。只删除一个连接并不影响索引节点本身和其它的连接，**只有当最后一个连接被删除后，文件的数据块及目录的连接才会被释放**。也就是说，文件真正删除的条件是与之相关的所有硬连接文件均被删除。  

**硬链接文件和源文件虽然看起来像是两个文件，但是只占用一个文件的磁盘空间。**  

**硬连接不可以作用于目录**。因为每个目录下面都会有一个`.`和`..`也就是说每个目录下面的子目录肯定会有它本身和它上一级目录，那么一旦设置了硬链接则会造成一种混乱，设置会导致死循环。硬链接的文件并不会占用空间大小，它只是复制了该文件的一份`inode`信息。

``` shell
ln 源文件 目标文件
```

### 软连接
软连接可以理解为，源文件的快捷方式，软连接文件记录的是源文件的路径，占用空间非常小。它实际上是一个特殊的文件。在符号连接中，**文件实际上是一个文本文件，其中包含的有另一文件的位置信息**。  
软链接克服了硬链接的不足，没有任何文件系统的限制，任何用户可以创建指向目录的符号链接。因而现在更为广泛使用，它具有更大的灵活性，甚至 **可以跨越不同机器、不同网络对文件进行链接**。

``` shell
ln –s 源文件 目标文件
```

### 参考
[【1】](http://blog.csdn.net/longerzone/article/details/23870297) [【2】](http://www.cnblogs.com/xiaochaohuashengmi/archive/2011/10/05/2199534.html)