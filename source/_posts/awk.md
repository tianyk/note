---
title: awk
date: 2018-04-25 19:11:29
updated: 2020-08-07 16:18:05
tags: awk
---

## awk

![](/images/awk.jpg)

awk 语法分`BEGIN`、`BODY`和`END`三部分，其中`BEGIN`和`END`可以省略。`BEGIN`和`END`只会执行一次，一般用于初始化和收尾操作，`BODY`部分会每一行都重复执行。

### 例子

1. 监听IP是`107.23.80.198`的机器对HTTP和HTTPS服务的所有连接

    ```
    $ netstat -t 
    Active Internet connections (w/o servers)
    Proto Recv-Q Send-Q Local Address               Foreign Address             State      
    tcp        0      0 172.22.203.148:https        122.224.64.42:opswmanager   SYN_RECV    
    tcp        0      0 172.22.203.148:http         39.106.12.213:45574         ESTABLISHED 
    tcp        0  17376 172.22.203.148:http         107.23.80.198:52924         ESTABLISHED 
    tcp        0  27512 172.22.203.148:http         107.23.80.198:52928         ESTABLISHED 
    tcp        0  34752 172.22.203.148:http         107.23.80.198:52925         ESTABLISHED 
    tcp        0      0 172.22.203.148:47400        106.11.68.13:http           ESTABLISHED 
    tcp      381      0 172.22.203.148:45978        100.100.25.3:http           CLOSE_WAIT  
    tcp        0  14480 172.22.203.148:http         107.23.80.198:52927         ESTABLISHED 
    tcp        0    120 172.22.203.148:ssh          107.23.80.198:51439         ESTABLISHED 
    tcp        0 228784 172.22.203.148:https        107.23.80.198:52921         ESTABLISHED 
    tcp        0  47784 172.22.203.148:http         107.23.80.198:52929         ESTABLISHED 
    tcp        0  18824 172.22.203.148:http         107.23.80.198:52926         ESTABLISHED 
    tcp      401      0 172.22.203.148:34764        106.11.68.13:http           CLOSE_WAIT  
    ```

    ``` shell 
    $ netstat -t | awk 'NR > 2 { if ((match($4, ":https") || match($4, ":http")) && match($5, "107.23.80.198")) {print}} '
    tcp        0  36200 172.17.204.148:http         107.23.80.198:53813          ESTABLISHED 
    tcp        0  13032 172.17.204.148:http         107.23.80.198:53855          ESTABLISHED 
    tcp        0  34752 172.17.204.148:http         107.23.80.198:53852          ESTABLISHED 
    tcp        0  15928 172.17.204.148:http         107.23.80.198:53854          ESTABLISHED 
    tcp        0 169416 172.17.204.148:https        107.23.80.198:52921          ESTABLISHED 
    tcp        0  17376 172.17.204.148:http         107.23.80.198:53853          ESTABLISHED 
    tcp        0  26064 172.17.204.148:http         107.23.80.198:53816          ESTABLISHED 
    ```

    这个例子中没有`BEGIN`和`END`部分（BEGIN和END部分需要有这两个关键字 `BEGIN {} {} END {}`）。`NR > 2` 首先跳过头两行，match用于字符串匹配，最后的print会打印整行（同`print $0`）

2. 统计Nginx每天的请求量

    ```
    awk '{arr[substr($4, 2, (index($4, ":") - 2))]++ } END {for (a in arr) print a, arr[a]}' /var/log/nginx/access.log
    ```

### 参考

- [三十分钟学会AWK](http://blog.jobbole.com/109089/)