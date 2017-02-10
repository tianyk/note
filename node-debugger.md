### 简介

V8 提供了一个强大的调试器，可以通过 TCP 协议从外部访问。Node.js 提供了一个内建调试器来帮助开发者调试应用程序。想要开启调试器我们需要在代码中加入debugger标签，当 Node.js 执行到 debugger 标签时会自动暂停。

### 开启调试模式

#### 以debug模式启动node进程

```shell
node --debug[=port] filename （这种方式，其实就是在指定的端口（默认为 5858）监听远程调试连接）
```

```shell
node --debug-brk[=port] filename （这种方式在监听的同时，会在代码执行的时候，强制断点在第一行，这样有个好处就是：可以debug到node内部的是如何运行的）
```

#### 对已经在运行的node进程开启debug模式
1. 查找node进程

    ```
    $ ps -ef | grep node
    501 42630  2945   0  3:42下午 ttys001    0:02.30 node app.js
    ```

2. 发送`USR1`信号

    ```
    $ kill -s USR1 42630
    ```

#### Windows
1. 获得进程号  

    ```sh
    > tasklist /FI "IMAGENAME eq node.exe"

    Image Name                     PID Session Name        Session#    Mem Usage
    ========================= ======== ================ =========== ============
    node.exe                      3084 Console                    1     11,964 K
    ```

2. 开启debug模式

    ```
    > node -e "process._debugProcess(3084)"
    ```

### 参考
[【1】](https://github.com/node-inspector/node-inspector) [【2】](http://zqdevres.qiniucdn.com/data/20130414223730/index.html)
