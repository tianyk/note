### Linux信号机制与信号处理
信号(signal)是Linux进程间通信的一种机制，全称为软中断信号，也被称为软中断。信号本质上是在软件层次上对硬件中断机制的一种模拟。

### 常见信号
![](images/QQ20161114-0@2x.jpg)
每种信号都会有一个默认动作。默认动作就是脚本或程序接收到该信号所做出的默认操作。常见的默认动作有终止进程、退出程序、忽略信号、重启暂停的进程等，上表中也对部分默认动作进行了说明。

### 发送信号
有多种方式可以向程序或脚本发送信号，例如按下``<Ctrl+C>``组合键会发送`SIGINT`信号，终止当前进程。

还可以通过 kill 命令发送信号，语法为：
```shell
 kill -signal pid
```
signal为要发送的信号，可以是信号名称或数字；pid为接收信号的进程ID。例如：
```shell
kill -2 1001
```
将`SIGINT`信号发送给进程ID为1001的程序，程序会终止执行。
> kill的默认信号为`SIGTERM`15

### 捕获信号
```javascript
console.log('pid: %d', process.pid);

setInterval(() => console.log(new Date()), 2000);

['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGFPE', 'SIGALRM', 'SIGTERM'].forEach((signal) => {
    process.on(signal, () => {
        console.log(signal);
    });
});
```
> 如果在程序中捕获了信号，没有做退出处理，程序是不会退出的。可以在捕获信号后做一下清理工作然后退出。    
> 如果需要退出，需要手动调用`process.exit(0)`。*（非0代表异常退出）*        
> `SIGKILL`信号无法监听，无法被进程捕获，进程会立即退出。**慎用kill -9**

### 参考
[【1】](http://c.biancheng.net/cpp/html/2784.html)
