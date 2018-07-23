---
title: IP协议
author: tyk
date: 2018-06-07 14:57:39
tags:
- tcp 
- ip
- mac
- arp
- icmp
---
## IP协议

> IP 全称 INTERNET PROTOCOL

![](/images/tcp-ip-mac.png)

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|Version|  IHL  |Type of Service|          Total Length         |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|         Identification        |Flags|      Fragment Offset    |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|  Time to Live |    Protocol   |         Header Checksum       |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                       Source Address                          |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                    Destination Address                        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                    Options                    |    Padding    |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

- Version:  4 bits

    版本号，目前使用的是4。

- IHL:  4 bits

    IP 头部的长度。可选字段可导致头部长度变化，因此这里需要指定头部的长度。不是字节数，是32位的个数。头长度为`IHL * 32 bits or IHL * 4 bytes`。

- Type of Service:  8 bits

    表示包传输优先级。

- Total Length:  16 bits

    表示 IP 消息的总长度（最大65535 bytes）。TCP包的大小就是（Total Length - IHL）。

- Identification:  16 bits

    用于识别包的编号，一般为包的序列号。如果一个包被 IP 分片，则所有分片都拥有相同的 ID。

- Flags:  3 bits

    该字段有 3 个比特，其中 2 个比特有效，分别代表是否允许分片，以及当前包是否为分片包。

- Fragment Offset:  13 bits

    表示当前包的内容为整个 IP 消息的第几个字节开始的内容。

- Time to Live:  8 bits

    表示包的生存时间，这是为了避免网络出现回环时一个包永远在网络中打转。每经过一个路由器，这个值就会减 1，减到 0 时这个包就会被丢弃。一般会设置为*64*或者128。

- Protocol:  8 bits

    协议号表示协议的类型（以下均为十六进制）
    
    - TCP: 06
    - UDP: 11
    - ICMP: 01

- Header Checksum:  16 bits

    用于检查错误，现在已不使用。

- Source Address:  32 bits

    网络包发送方的 IP 地址。 TODO 根据路由表查询

- Destination Address:  32 bits

    网络包接收方的 IP 地址。

- Options:  variable

    除了上面的头部字段之外，还可以添加可选字段用于记录其他控制信息，但可选字段很少使用。


``` javascript
function parseIP(ip) {
    let _readerIndex = 0;
    let version, ihl, type, len, id, flags, offset, ttl, protocol, checksum, source = [], dest = [], options;

    version = ip.readUInt8(_readerIndex) >> 4;
    ihl = ip.readUInt8(_readerIndex) & 0x0f;
    _readerIndex++;

    type = ip.readUInt8(_readerIndex);
    _readerIndex++;

    len = ip.readUInt16BE(_readerIndex);
    _readerIndex += 2;

    id = ip.readUInt16BE(_readerIndex);
    _readerIndex += 2;

    flags = ip.readUInt16BE(_readerIndex) >> 13;
    offset = ip.readUInt16BE(_readerIndex) & 0x1fff;
    _readerIndex += 2;

    ttl = ip.readUInt8(_readerIndex);
    _readerIndex++;

    protocol = ip.readUInt8(_readerIndex);
    _readerIndex++;

    checksum = ip.readUInt16BE(_readerIndex);
    _readerIndex += 2;

    for (let p = 0; p < 4; p++) source[p] = ip.readUInt8(_readerIndex++);

    for (let p = 0; p < 4; p++) dest[p] = ip.readUInt8(_readerIndex++);

    if (_readerIndex < ihl * 4) options = ip.toString('hex', _readerIndex);

    return {
        version, ihl, type, len, id, flags, offset, ttl, protocol, checksum, source, dest, options
    };
}

console.log(parseIP(Buffer.from('4500004000004000400635c70a0001022f5eca91', 'hex')));
```

查看路由表
```
netstat -nr
```

### ICMP
ICMP（Internet Control Message Protocol）它是TCP/IP协议族的一个子协议，用于在IP主机、路由器之间传递控制消息。控制消息是指网络通不通、主机是否可达、路由是否可用等网络本身的消息。这些控制消息虽然并不传输用户数据，但是对于用户数据的传递起着重要的作用。

|          消息            | 类型 |   含义                                |
| ----------------------- | ---- | ------------------------------------ |
| Echo reply              | 0    | 响应 Echo 消息                        |
| Destination unreachable | 3    | 出于某些原因包没有到达目的地而是被丢弃，则通过此消息通知发送方。可能的原因包括目标 IP 地址在路由表中不存在；目标端口号不存在对应的套接字；需要分片，但分片被禁用 |
| Source quench           | 4    | 当发送的包数量超过路由器的转发能力时，超过的部分会被丢弃，这时会通过这一消息通知发送方。但是，并不是说遇到这种情况一定会发送这一消息。当路由器的性能不足时，可能连这条消息都不发送，就直接把多余的包丢弃了。当发送方收到这条消息时，必须降低发送速率 |
| Redirect                | 5    | 当查询路由表后判断该包的入口和出口为同一个网络接口时，则表示这个包不需要该路由器转发，可以由发送方直接发送给下一个路由器。遇到这种情况时，路由器会发送这条消息，给出下一个路由器的 IP 地址，指示发送方直接发送过去  |
| Echo                    | 8    | **ping** 命令发送的消息。收到这条消息的设备需返回一个 `Echo reply` 消息，以便确认通信对象是否存在 |
| Time exceeded           | 11   | 由于超过了 IP 头部中的 TTL 字段表示的存活时间而被路由器丢弃，此时路由器会向发送方发送这条消息 |
| Parameter problem       | 12   | 由于 IP 头部字段存在错误而被丢弃，此时会向发送方发送这条消息 |

### 参考
- [TRANSMISSION CONTROL PROTOCOL](https://tools.ietf.org/html/rfc793#section-3.1)
- [网络是怎么连接的](https://book.douban.com/subject/26941639/)
- [TCP/IP详解 卷1：协议](https://book.douban.com/subject/1088054/)
- [TCP/IP网络与协议（第二版）](https://book.douban.com/subject/1683696/)
- [为什么标准以太网接口缺省的MTU为1500？](https://www.zhihu.com/question/21524257)
- [细说TCP确认机制](https://community.emc.com/message/842879#842879)