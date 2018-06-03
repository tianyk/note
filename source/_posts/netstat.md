---
title: netstat
author: tyk
date: 2018-05-30 10:23:28
updated: 2018-06-03 10:39:20
tags:
---

## Netstat

Netstat 是一款命令行工具，可用于列出系统上所有的网络套接字连接情况，包括 tcp, udp 以及 unix 套接字，另外它还能列出处于监听状态（即等待接入请求）的套接字。如果你想确认系统上的 Web 服务有没有起来，你可以查看80端口有没有打开。

### 语法及选项
```
netstat(选项)
```

```
-a或--all：显示所有连线中的Socket；
-A<网络类型>或--<网络类型>：列出该网络类型连线中的相关地址；
-c或--continuous：持续列出网络状态；
-C或--cache：显示路由器配置的快取信息；
-e或--extend：显示网络其他相关信息；
-F或--fib：显示FIB；
-g或--groups：显示多重广播功能群组组员名单；
-h或--help：在线帮助；
-i或--interfaces：显示网络界面信息表单；
-l或--listening：显示监控中的服务器的Socket；
-M或--masquerade：显示伪装的网络连线；
-n或--numeric：直接使用ip地址，而不通过域名服务器；
-N或--netlink或--symbolic：显示网络硬件外围设备的符号连接名称；
-o或--timers：显示计时器；
-p或--programs：显示正在使用Socket的程序识别码和程序名称；
-r或--route：显示Routing Table；
-s或--statistice：显示网络工作信息统计表；
-t或--tcp：显示TCP传输协议的连线状况；
-u或--udp：显示UDP传输协议的连线状况；
-v或--verbose：显示指令执行过程；
-V或--version：显示版本信息；
-w或--raw：显示RAW传输协议的连线状况；
-x或--unix：此参数的效果和指定"-A unix"参数相同；
--ip或--inet：此参数的效果和指定"-A inet"参数相同。
```

### 例子
1. 列出所有连接

    ``` shell 
    $ netstat -a 
    Active Internet connections (servers and established)
    Proto Recv-Q Send-Q Local Address               Foreign Address             State      
    tcp        0      0 *:mysql                     *:*                         LISTEN      
    tcp        0      0 *:http                      *:*                         LISTEN      
    tcp        0      0 *:ssh                       *:*                         LISTEN      
    tcp        0      0 *:https                     *:*                         LISTEN      
    tcp        0    440 172.22.203.148:ssh          1.203.10.198:51439          ESTABLISHED 
    tcp        0      0 172.22.203.148:http         39.116.52.213:45566         ESTABLISHED 
    udp        0      0 172.22.203.148:ntp          *:*                                     
    Active UNIX domain sockets (servers and established)
    Proto RefCnt Flags       Type       State         I-Node Path
    unix  2      [ ACC ]     STREAM     LISTENING     125319903 /var/lib/mysql/mysql.sock
    unix  2      [ ]         DGRAM                    125678271 
    unix  2      [ ]         STREAM     CONNECTED     125330402 
    unix  2      [ ]         STREAM     CONNECTED     125330400 
    unix  2      [ ]         DGRAM                    125320497 
    unix  2      [ ]         STREAM     CONNECTED     125303610 
    ```
    上面命令会列出来服务器上所有的tcp、udp及unix套接字等连接信息。

2. 只列出 TCP 或 UDP 协议的连接

    使用 -t 选项列出 TCP 协议的连接：

    ``` shell
    $ netstat -at
    Active Internet connections (servers and established)
    Proto Recv-Q Send-Q Local Address               Foreign Address             State      
    tcp        0      0 *:mysql                     *:*                         LISTEN      
    tcp        0      0 *:http                      *:*                         LISTEN      
    tcp        0      0 *:ssh                       *:*                         LISTEN      
    tcp        0      0 *:https                     *:*                         LISTEN      
    tcp        0    440 172.22.203.148:ssh          1.203.10.198:51439          ESTABLISHED 
    ```
    使用 -u 选项列出 UDP 协议的连接：

    ``` shell
    Active Internet connections (servers and established)
    Proto Recv-Q Send-Q Local Address               Foreign Address             State      
    udp        0      0 172.22.203.148:ntp          *:*                                     
    udp        0      0 *:ntp                       *:*   
    ```

3. 禁用反向域名解析，加快查询速度
    
    当你不想让主机，端口和用户名显示，使用netstat -n。例如上面的例子中会显示mysql、ssh、http等信息。
    
    ``` shell
    Active Internet connections (servers and established)
    Proto Recv-Q Send-Q Local Address               Foreign Address             State      
    tcp        0      0 0.0.0.0:3306                0.0.0.0:*                   LISTEN      
    tcp        0      0 0.0.0.0:80                  0.0.0.0:*                   LISTEN      
    tcp        0      0 0.0.0.0:22                  0.0.0.0:*                   LISTEN      
    tcp        0      0 0.0.0.0:443                 0.0.0.0:*                   LISTEN      
    tcp        0     40 172.22.203.148:22           1.203.80.198:51439          ESTABLISHED 
    ```

    如果只是不想让这三个名称中的一个被显示，使用以下命令:
    ``` shell
    netsat -a --numeric-ports
    netsat -a --numeric-hosts
    netsat -a --numeric-users
    ```
    
4. 持续输出netstat信息

    `-c`每隔一秒输出网络信息。
    
    ``` shell
    netstat -act
    ```

    上面例子会每隔一秒打印一次所有的tcp连接信息。
    
5. 只列出监听中的连接

    任何网络服务的后台进程都会打开一个端口，用于监听接入的请求。这些正在监听的套接字也和连接的套接字一样，也能被 netstat 列出来。使用 -l 选项列出正在监听的套接字。
    
    ``` shell
    $ netstat -lt
    Active Internet connections (only servers)
    Proto Recv-Q Send-Q Local Address               Foreign Address             State      
    tcp        0      0 *:mysql                     *:*                         LISTEN      
    tcp        0      0 *:http                      *:*                         LISTEN      
    tcp        0      0 *:ssh                       *:*                         LISTEN      
    tcp        0      0 *:https                     *:*                         LISTEN  
    ```

    上面例子会列出所有监听的tcp连接。如果我们想找到Nginx服务器是哪个进程，就可以使用这个命令：
    
    ``` shell
    $  netstat -nltp | grep :80
    tcp        0      0 0.0.0.0:80                  0.0.0.0:*                   LISTEN      10236/nginx 
    ```
    > 其中`-p`用于显示进程信息

6. 打印网络接口

    netstat 也能打印网络接口信息，-i 选项就是为这个功能而生。
    
    ``` shell 
    $ netstat -i
    Kernel Interface table
    Iface       MTU Met    RX-OK RX-ERR RX-DRP RX-OVR    TX-OK TX-ERR TX-DRP TX-OVR Flg
    eth0       1500   0 66299097      0      0      0 56635148      0      0      0 BMRU
    lo        65536   0 490435979      0      0      0 490435979      0      0      0 LRU
    ```
    上面输出的信息比较原始。我们将 `-e` 选项和 `-i` 选项搭配使用，可以输出用户友好的信息。
    ``` shell
    $ netstat -ie
    Kernel Interface table
    eth0    Link encap:Ethernet  HWaddr 00:16:3E:16:15:19  
            inet addr:172.22.203.148  Bcast:172.22.203.255  Mask:255.255.240.0
            UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
            RX packets:66299089 errors:0 dropped:0 overruns:0 frame:0
            TX packets:56635140 errors:0 dropped:0 overruns:0 carrier:0
            collisions:0 txqueuelen:1000 
            RX bytes:34498067027 (32.1 GiB)  TX bytes:96455017529 (89.8 GiB)

    lo      Link encap:Local Loopback  
            inet addr:127.0.0.1  Mask:255.0.0.0
            UP LOOPBACK RUNNING  MTU:65536  Metric:1
            RX packets:490435979 errors:0 dropped:0 overruns:0 frame:0
            TX packets:490435979 errors:0 dropped:0 overruns:0 carrier:0
            collisions:0 txqueuelen:0 
            RX bytes:33910368878 (31.5 GiB)  TX bytes:33910368878 (31.5 GiB)
    ```

7. 配合 watch 命令监视和某个IP的所有连接

    ``` shell 
    $ watch -d -n0 "netstat -t | grep 1.203.80.198"
    ```

8. 统计连接状态
    ``` shell 
    $ netstat -n | awk '/^tcp/ {++S[$NF]} END {for(a in S) print a, S[a]}'
    CLOSE_WAIT 2
    ESTABLISHED 4
    ```
    状态说明
    ```
    CLOSED：无连接是活动的或正在进行
    LISTEN：服务器在等待进入呼叫
    SYN_RECV：一个连接请求已经到达，等待确认
    SYN_SENT：应用已经开始，打开一个连接
    ESTABLISHED：正常数据传输状态
    FIN_WAIT1：应用说它已经完成
    FIN_WAIT2：另一边已同意释放
    ITMED_WAIT：等待所有分组死掉
    CLOSING：两边同时尝试关闭
    TIME_WAIT：另一边已初始化一个释放
    LAST_ACK：等待所有分组死掉
    ```

### 参考
- [netstat 的10个基本用法](https://linux.cn/article-2434-1.html)
- [netstat命令](http://man.linuxde.net/netstat)