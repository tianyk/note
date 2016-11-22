### telnet 连接 redis

``` shell
> telnet 10.0.1.3 6379
Trying 10.0.1.3...
Connected to 10.0.1.3.
Escape character is '^]'.
set name tyk
+OK
get name
$3
tyk
set age 10
+OK
get age
$2
10
quit
+OK
Connection closed by foreign host.
>
```

### 退出 telnet
`ctrl + ]` 然后 `quit`


### 参考
[【1】](http://www.cnblogs.com/peida/archive/2013/03/13/2956992.html) [【2】](http://www.cnblogs.com/kuailewangzi1212/archive/2006/11/29/576986.html) [【3】](http://wangyifeng.blog.51cto.com/2144905/398950)
