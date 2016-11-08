### Linux平台查看端口占用情况

1. `netstat -nlp | grep :80`
2. `lsof -i :80 | grep LISTEN`  
    `yum install lsof`


### 参考
[【1】](http://unix.stackexchange.com/questions/106561/finding-the-pid-of-the-process-using-a-specific-port)
