---
title: WebSocket
author: tyk
date: 2018-05-09 16:55:59
tags:
---
# TODO 
## WebSocket
HTTP是`请求响应`模型，在这个模型下服务器端是不能主动发消息给客户端的。这在很多场景下有诸多不便，例如消息通知等。为了解决这个问题，`WebSocket`应运而生。

在没有`WebSocket`之前，我们主要通过轮询来实现消息推送。为了提高消息的`实时性`我们要提高轮询频率，轮询频率提高后会给系统造成一些压力。

### 协议实现
![](/images/websocket.jpg)
在浏览器中WebSocket通过HTTP的[协议升级](https://httpwg.org/specs/rfc7230.html#header.upgrade)来实现。要发起 HTTP/1.1 协议升级，客户端必须在请求头部中指定这两个字段：

```
Connection: Upgrade
Upgrade: protocol-name[/protocol-version]
```

如果服务端不同意升级或者不支持 Upgrade 所列出的协议，直接忽略即可（当成 HTTP/1.1 请求，以 HTTP/1.1 响应）；如果服务端同意升级，那么需要这样响应：
```
HTTP/1.1 101 Switching Protocols
Connection: upgrade
Upgrade: protocol-name[/protocol-version]

[... data defined by new protocol ...]
```

协议完成升级后就和HTTP协议没有关系了，剩下的数据都以`WebSocket`协议进行传输。

下面是一个通过HTTP建立WebSocket请求的例子：
```
# 请求头
GET ws://example.com/ HTTP/1.1
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9
Cache-Control: no-cache
Connection: Upgrade
Host: 127.0.0.1:8081
Origin: http://example.com
Pragma: no-cache
Sec-WebSocket-Extensions: permessage-deflate; client_max_window_bits
Sec-WebSocket-Key: /3ZaE3COLK+dw4pHqCTarQ==
Sec-WebSocket-Version: 13
Upgrade: websocket
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36

# 响应头
HTTP/1.1 101 Switching Protocols
connection: upgrade
sec-websocket-accept: EMUWrlnRHG2LyGmmWMuWoFyBxnI=
upgrade: websocket
```

字段说明：

- Connection必须设置Upgrade，表示客户端希望连接升级。
- Upgrade字段必须设置WebSocket，表示希望升级到WebSocket协议。
- Sec-WebSocket-Key是随机的字符串，服务器端会用这些数据来构造出一个SHA-1的信息摘要。把`Sec-WebSocket-Key`加上一个特殊字符串`258EAFA5-E914-47DA-95CA-C5AB0DC85B11`，然后计算SHA-1摘要，之后进行BASE-64编码，将结果做为`Sec-WebSocket-Accept`头的值，返回给客户端。如此操作，可以尽量避免普通HTTP请求被误认为WebSocket协议。
- `Sec-WebSocket-Version` 表示支持的WebSocket版本。RFC6455要求使用的版本是13，之前草案的版本均应当弃用。
- Origin字段是可选的，通常用来表示在浏览器中发起此WebSocket连接所在的页面，类似于Referer。但是，与Referer不同的是，Origin只包含了协议和主机名称。
- 其他一些定义在HTTP协议中的字段，如Cookie等，也可以在WebSocket中使用。

要使用WebSocket首先得让客户端和服务器建立连接，首先需要通过验证KEY来做握手工作。

这个握手协议使用的是HTTP格式的请求，并再头部分带上一个`Sec-WebSocket-Key`字段，服务器对这个字段加上一个特定的字符串后做一次sha1运算，然后把结果用Base64的形式以同样的方式发送回去就可以完成握手的工作了。

``` JavaScript
// ws-handshake.js

const net = require('net');
const crypto = require('crypto');
const WS = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

const server = net.createServer((conn) => {
    conn.on('data', (data) => {
        if (!conn.isWebSocket) {
            // 获取发送过来的KEY
            let secKey = data.toString().match(/Sec-WebSocket-Key: (.+)/i)[1];
            // 连接上WS这个字符串，并做一次sha1运算，最后转换成Base64
            secKey = crypto.createHash('sha1').update(secKey + WS).digest('base64');
            // 输出返回给客户端的数据，这些字段都是必须的
            conn.write('HTTP/1.1 101 Switching Protocols\r\n');
            conn.write('Upgrade: websocket\r\n');
            conn.write('Connection: Upgrade\r\n');
            // 这个字段带上服务器处理后的KEY
            conn.write(`Sec-WebSocket-Accept: ${secKey}\r\n`);
            // 输出空行，使HTTP头结束
            conn.write('\r\n');

            conn.isWebSocket = true;
        } else {
            console.log(data.toString('hex'));
        }
    });
})

server.on('error', console.error);

server.listen(8124, () => console.log('server bound'));
```

WebSocket数据包不像HTML是纯文本形式的，它是一个二进制的协议包。
```
  0                   1                   2                   3
  0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
 +-+-+-+-+-------+-+-------------+-------------------------------+
 |F|R|R|R| opcode|M| Payload len |    Extended payload length    |
 |I|S|S|S|  (4)  |A|     (7)     |             (16/64)           |
 |N|V|V|V|       |S|             |   (if payload len==126/127)   |
 | |1|2|3|       |K|             |                               |
 +-+-+-+-+-------+-+-------------+ - - - - - - - - - - - - - - - +
 |     Extended payload length continued, if payload len == 127  |
 + - - - - - - - - - - - - - - - +-------------------------------+
 |                               |Masking-key, if MASK set to 1  |
 +-------------------------------+-------------------------------+
 | Masking-key (continued)       |          Payload Data         |
 +-------------------------------- - - - - - - - - - - - - - - - +
 :                     Payload Data continued ...                :
 + - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +
 |                     Payload Data continued ...                |
 +---------------------------------------------------------------+
```
- FIN: 1 bit

    指示这个是消息的最后片段。第一个片段可能也是最后的片段。

- RSV1, RSV2, RSV3: 1 bit each

    预留字段，默认为0。

- Opcode: 4 bits

    表示数据的类型。
    
    *  %x0 denotes a continuation frame

    *  %x1 denotes a text frame

    *  %x2 denotes a binary frame

    *  %x3-7 are reserved for further non-control frames

    *  %x8 denotes a connection close

    *  %x9 denotes a ping

    *  %xA denotes a pong

    *  %xB-F are reserved for further control frames

- Mask: 1 bit

    1位。

    标识这个数据帧的数据是否使用掩码，值为1表示使用掩码。从客户端发送的数据都为1。

- Payload length: 7 bits, 7+16 bits, or 7+64 bits

    7位。表示数据的长度。

    PayloadLength只有7位，换成无符号整型的话只有0到127的取值，这么小的数值当然无法描述较大的数据，因此规定当数据长度小于或等于125时候它才作为数据长度的描述，如果这个值为126，则时候后面的两个字节（16位）来储存储存数据长度，如果为127则用后面八个字节（64位，最高有效位必须是0）来储存数据长度。

- Masking-key: 0 or 4 bytes

    `Mask`的值为`1`时才有`Masking-key`。

- Payload 

    如果使用了掩码所有数据就需要和掩码做异或（^）运算。
    ```
    j                   = i MOD 4
    transformed-octet-i = original-octet-i XOR masking-key-octet-j
    ```
    ``` javascript
    for (var i = 0, ret = []; i < payload.length; i++) ret.push(payload[i] ^ MaskingKey[i % 4]);
    ```

示例：
``` javascript
let ws = new WebSocket('ws://example.com/');
ws.send('ok');
```

```  
bits: 1000 0001 1 0000010 00101011-01101000-10101000-11100111 0100010000000011

FIN                1 
Opcode             0001
Mask               1
PayloadLength      0000010
Masking-key        00101011-01101000-10101000-11100111
Payload            0100010000000011
```

``` javascript
function decodeWebSocketFrame (msg) {
    var pos = 0;
    // 读取前16位（帧头）
    let headerDecimal = msg.readUInt16BE(pos);
    post += 2;
    // 转为二进制
    // let headerBits = headerDecimal.toString(2).padStart(16, '0');
    // let fin = headerBits.slice(0, 1);
    // let opcode = headerBits.slice(4, 8);
    // let mask = headerBits.slice(8, 9);
    // let payloadLength = parseInt(headerBits.slice(9, 16), 2);
    let fin = headerDecimal >> 15;
    let opcode = (headerDecimal & 0b0000111100000000) >> 8; 
    let mask = headerDecimal & 0b0000000010000000;
    let payloadLength = headerDecimal & 0b0000000001111111;

    // 127
    if (payloadLength === 127) {
        // 最高有效位必须为0
        // 头32位补零到64位加后32位
        // let first32 = msg.readUInt32BE(pos) & 0b01111111111111111111111111111111 << 32;
        let first32 = msg.readUInt32BE(pos) << 32;
        post += 4;
        let second32 = msg.readUInt32BE(pos);
        pos += 4;
        payloadLength = first32 + second32;
    } else if (payloadLength === 126) {
        payloadLength = msg.readUInt16BE(pos);
        pos += 2;
    }
    
    let maskingKey = [];
    if (mask === 1) {
        // 4位掩码
        for (let i = 0; i < 4; i++) {
            maskingKey.push(msg.readUInt8BE(pos++));
        }
    }

    let payload = msg.slice(pos, pos + payloadLength);
    for (let i = 0; i < payloadLength; i++) {
        payload[i] = payload[i] ^ maskingKey[i % 4];
    }
    
    // fin = 1 表示结束
    if (fin === 1) payload = payload.toString();
    
    return {
        fin
        opcode,
        mask,
        maskingKey,
        payload
    };
}
```

### 参考
- [谈谈 HTTP/2 的协议协商机制](https://imququ.com/post/protocol-negotiation-in-http2.html)
- [The WebSocket Protocol](https://tools.ietf.org/html/rfc6455)
- [WebSocket(壹) 握手连接](https://www.web-tinker.com/article/20305.html)