---
title: dig
date: 2017-08-31 14:30:44
tags: 
- dns 
- dig
---
## dig
dig命令是常用的域名查询工具，可以用来测试域名系统工作是否正常。

``` bash 
yum install bind-utils
```

### 语法
dig @DNS_SERVER DOMAIN_NAME [ANY|ANY|A|MX|SIG]

- 查询域名的A地址

    ```
    dig @8.8.8.8 www.baidu.com A
    ```

- 查询域名的CNAME 

    ```
    dig @8.8.8.8 www.baidu.com CNAME
    ```

## 参考
- [使用dig命令解析域名](http://blog.csdn.net/reyleon/article/details/12976889)
- [dig命令使用大全](http://www.cnblogs.com/daxian2012/archive/2013/01/10/2854126.html)
- [dig命令](http://man.linuxde.net/dig)