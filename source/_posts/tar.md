---
title: tar.md
date: 2016-08-22 14:45:24
tags: 
---
### tar命令
tar命令用来压缩和解压文件，它本身不具有压缩功能，它是调用压缩功能实现的。

#### 参数
主选项
* -c 建立压缩档案
* -x 解压
* -t 查看内容
* -r 追加文件
* -u 更新压缩包文件

辅助项
* -z 有gzip属性的
* -j 有bz2属性的
* -Z 有compress属性的
* -v 显示所有过程
* -O 将文件解开到标准输出
* -C 切换到指定目录
* -f 指定压缩文件
> 参数-f是必须的
> -f: 使用档案名字，切记，这个参数是最后一个参数，后面只能接档案名。

#### 常用命令
查看     
`tar -tf note.tar.gz`   在不解压的情况下查看压缩包的内容  

压缩  
`tar -cvf note.tar *.md` -c是表示产生新的包，-f指定包的文件名    
`tar -czf note.tar.gz *.md` 使用gzip压缩    
`tar -cjf note.tar.bz2 *.md` 使用bzip2压缩   
`tar -cZf note.tar.Z *.md` 使用compress压缩

解压    
`tar –xvf file.tar` 解压tar包
`tar -xzvf file.tar.gz` 解压tar.gz
`tar -xjvf file.tar.bz2`  解压tar.bz2
`tar –xZvf file.tar.Z` 解压tar.Z

其他命令  
`tar -rf note.tar tar_new.md` 表示追加note.md到包中  
`tar -uf note.tar tar.md` 表示更新tar.md文件  
`tar -cf note.tar -C ./output/` 解压文件到output目录中

### 参考
[【1】](http://www.cnblogs.com/peida/archive/2012/11/30/2795656.html) [【2】](http://www.cnblogs.com/jyaray/archive/2011/04/30/2033362.html)
