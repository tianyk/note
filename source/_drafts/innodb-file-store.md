---
title: InnoDB存储
author: tyk
date: 2018-09-01 16:14:14
tags:
---
## InnoDB存储

页、区、段、表空间

### 页

页是InnoDB访问的最小I/O单元，页的默认大小是16KB。


**Page file header**
|          Name           | Size |                       Remarks                    |
| ----------------------- | ---- | ------------------------------------------------- |
| FIL_PAGE_SPACE          | 4    | 4 ID of the space the page is in                   |
| FIL_PAGE_OFFSET         | 4    | ordinal page number from start of space            |
| FIL_PAGE_PREV           | 4    | offset of previous page in key order            |
| FIL_PAGE_NEXT           | 4    | offset of next page in key order                  |
| FIL_PAGE_LSN            | 8    | log serial number of page's latest log record        |
| FIL_PAGE_TYPE           | 2    | current defined types are: `FIL_PAGE_INDEX`, `FIL_PAGE_UNDO_LOG`, `FIL_PAGE_INODE`, `FIL_PAGE_IBUF_FREE_LIST`   |
| FIL_PAGE_FILE_FLUSH_LSN | 8    | "the file has been flushed to disk at least up to this lsn" (log serial number), valid only on the first page of the file |
| FIL_PAGE_ARCH_LOG_NO    | 4    | the latest archived log file number at the time that FIL_PAGE_FILE_FLUSH_LSN was written (in the log)                     |


### 区

为了使得数据库系统获得更好的I/O性能，InnoDB存储引擎对于空间的申请不是每次以16KB的方式申请，而是以区的方式。一个区的大小为1MB，总共64个页。区的申请由space header（空间头部信息）进行管理。space header不是一个完整的页，其信息保存在页（0，0）中，用于区的管理和分配操作。space header一共占用112个字节。


### 参考
- [High-Altitude View](https://dev.mysql.com/doc/internals/en/innodb-page-overview.html)