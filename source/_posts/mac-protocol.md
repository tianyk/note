---
title: MAC协议
author: tyk
date: 2018-06-09 14:57:39
tags:
- tcp 
- ip
- mac
- arp
- icmp
---

## MAC协议
![](/images/ip-mac.png)
- MAC 头部（用于以太网协议）
- IP 头部（用于 IP 协议）

首先，发送方将包的目的地，也就是要访问的服务器的 IP 地址写入 IP 头部中。这样一来，我们就知道这个包应该发往哪里，IP 协议就可以根据这一地址查找包的传输方向，从而找到下一个路由器的位置，也就是图中的路由器 R1。接下来，IP 协议会**委托**以太网协议将包传输过去。这时，IP 协议会查找下一个路由器的以太网地址（MAC 地址），并将这个地址写入 MAC 头部中。这样一来，以太网协议就知道要将这个包发到哪一个路由器上了。路由器中有一张 IP 协议的表，可根据这张表以及 IP 头部中记录的目的地信息查出接下来应该发往哪个路由器。为了将包发到下一个路由器，我们还需要查出下一个路由器的 MAC 地址，并记录到 MAC 头部中，大家可以理解为改写了 MAC 头部。这样，网络包就又被发往下一个节点了。

### MAC（Medium Access Control）协议
MAC 地址是在网卡生产时写入 ROM 里的，只要将这个值读取出来写入 MAC 头部就可以了。

```
 0                   1
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|          Destination          |
+-                             -+
|            Ethernet           |
+-                             -+
|            Address            |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|             Source            |
+-                             -+
|            Ethernet           |
+-                             -+
|            Address            |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|         Ethernet Type         |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|             IPv6              |
+-                             -+
|            header             |
+-                             -+
|             and               |
+-                             -+
/            payload ...        /
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

- Destination Ethernet Address: 48 bits

    接收方 MAC 地址

- Source Ethernet Address: 48 bits

    发送方 MAC 地址

- Ethernet Type: 16 bits

    以太网类型。下面是一些常见的类型，一般在 TCP/IP 通信中只使用 0800 和 0806 这两种。
    + 0000-05DC：IEEE 802.3
    + 0800　　　：IP 协议
    + 0806　　　：ARP 协议
    + 86DD 　  ：　IPv6

{% include_code parse_mac.js %}

### ARP（Address Resolution Protocol）

![](/images/arp.png)

- 查看所有缓存

    ``` shell
    $ arp -a 
    bogon (10.0.1.1) at c:51:1:e2:ab:64 on en0 ifscope [ethernet]
    bogon (10.0.1.5) at 68:ef:43:2c:7b:7e on en0 ifscope [ethernet]
    bogon (10.0.1.15) at 70:1c:e7:47:ef:50 on en0 ifscope [ethernet]
    localhost (10.0.1.255) at ff:ff:ff:ff:ff:ff on en0 ifscope [ethernet]
    ...
    ```

- 查询指定网络接口的缓存

    ``` shell
    $ arp -i en0 -a
    bogon (10.0.1.1) at c:51:1:e2:ab:64 on en0 ifscope [ethernet]
    bogon (10.0.1.15) at 70:1c:e7:47:ef:50 on en0 ifscope [ethernet]
    localhost (10.0.1.255) at ff:ff:ff:ff:ff:ff on en0 ifscope [ethernet]
    ? (224.0.0.251) at 1:0:5e:0:0:fb on en0 ifscope permanent [ethernet]
    ? (239.255.255.250) at 1:0:5e:7f:ff:fa on en0 ifscope permanent [ethernet]
    ...
    ```

- 查询指定主机的arp条目

    ``` shell 
    $ arp -a 172.16.0.108
    ```

- 删除指定主机的arp条目

    ``` shell 
    $ sudo arp -d 10.0.1.8
    10.0.1.8 (10.0.1.8) deleted
    ```

- 设置指定主机与MAC地址的映射

    ``` shell 
    $ arp -s 172.16.0.108 00:50:56:82:52:2c
    ```

### 参考
- [TRANSMISSION CONTROL PROTOCOL](https://tools.ietf.org/html/rfc793#section-3.1)
- [网络是怎么连接的](https://book.douban.com/subject/26941639/)
- [TCP/IP详解 卷1：协议](https://book.douban.com/subject/1088054/)
- [TCP/IP网络与协议（第二版）](https://book.douban.com/subject/1683696/)
- [为什么标准以太网接口缺省的MTU为1500？](https://www.zhihu.com/question/21524257)
- [细说TCP确认机制](https://community.emc.com/message/842879#842879)