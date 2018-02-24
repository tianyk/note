### Linux平台查看端口占用情况

1. `netstat -nlp | grep :80`

2. `lsof -i :80 | grep LISTEN`  
    `yum install lsof`

3. `fuser 8080/tcp`
    `fuser -k 8080/tcp` 会杀死这个进程

### 参考
- [Finding the PID of the process using a specific port?](http://unix.stackexchange.com/questions/106561/finding-the-pid-of-the-process-using-a-specific-port)
- [How to kill a process running on particular port in Linux?](https://stackoverflow.com/questions/11583562/how-to-kill-a-process-running-on-particular-port-in-linux)
