### grep常用用法
[root@www ~]# grep [-acinv] [--color=auto] '搜寻字符串' filename   
选项与参数：   
-a ：将 binary 文件以 text 文件的方式搜寻数据   
-c ：计算找到 '搜寻字符串' 的次数   
-i ：忽略大小写的不同，所以大小写视为相同   
-n ：顺便输出行号   
-v ：反向选择，亦即显示出没有 '搜寻字符串' 内容的那一行！   
--color=auto ：可以将找到的关键词部分加上颜色的显示喔！   


### 常用命令
显示行号
```
grep -n root /etc/passwd
```

显示上下两行
```
grep  -C 2 root /etc/passwd
```

显示前五行
```
grep -B 2 root /etc/passwd  
```

显示后两行
```
grep -A 2 root /etc/passwd  
```

### 补充
1. [Linux中查看文件时显示行号](http://blog.sina.com.cn/s/blog_716844910100tfxv.html)



### 参考
[【1】](http://www.cnblogs.com/ggjucheng/archive/2013/01/13/2856896.html)[【2】](http://www.cnblogs.com/mfryf/p/3336288.html) [【3】](http://blog.sina.com.cn/s/blog_716844910100tfxv.html)
