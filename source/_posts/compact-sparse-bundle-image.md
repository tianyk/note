---
title: 压缩稀疏镜像
date: 2017-03-21 15:50:13
tags: 
---
### 释放稀疏磁盘映像空洞

如果直接去删除镜像的文件后镜像大小不会改变，这时候需要去手动释放一下。

```
hdiutil compact /path/to/disk-image
```
