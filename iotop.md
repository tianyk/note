### iotop命令

iotop 命令是一个用来监视磁盘 I/O 使用状况的 top 类工具。iotop 具有与 top 相似的 UI，其中包括 PID、用户、I/O、进程等相关信息。Linux 下的 IO 统计工具如 iostat，nmon 等大多数是只能统计到 per 设备的读写情况，如果你想知道每个进程是如何使用IO的就比较麻烦，使用 iotop 命令可以很方便的查看。

### 安装

#### Ubuntu

``` shell
apt-get install iotop
```

#### CentOS

``` shell
yum install iotop
```

#### 编译安装
``` shell
wget http://guichaz.free.fr/iotop/files/iotop-0.4.4.tar.gz
tar zxf iotop-0.4.4.tar.gz
python setup.py build
python setup.py install
```

### 语法

```
iotop (选项)
```

### 选项
```
-o：只显示有io操作的进程
-b：批量显示，无交互，主要用作记录到文件。
-n NUM：显示NUM次，主要用于非交互式模式。
-d SEC：间隔SEC秒显示一次。
-p PID：监控的进程pid。
-u USER：监控的进程用户。
```

#### iotop常用快捷键：
左右箭头：改变排序方式，默认是按IO排序。
r：改变排序顺序。
o：只显示有IO输出的进程。
p：进程/线程的显示方式的切换。
a：显示累积使用量。
q：退出。

### 参考
[【1】](http://man.linuxde.net/iotop)
