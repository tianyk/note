---
title: HTTP 分块传输编码
date: 2017-11-13 18:29:12
tags: 
- http
- transfer-encoding
---
## HTTP分块传输编码
HTTP 分块传输编码是 `HTTP/1.1` 版本新增的内容。主要用于解决我们事先不太好确定内容大小的问题，每次可以只传输一部分内容。它的格式是首行一个十六进制的块大小，然后`\r\n`块正文。可以传输多个块，最后一个块大小0代表整个响应结束。

```
HTTP/1.1 200 OK 
Content-Type: text/plain 
Transfer-Encoding: chunked

7\r\n
Mozilla\r\n 
9\r\n
Developer\r\n
7\r\n
Network\r\n
0\r\n 
\r\n
```

### 头信息

- TE    
用在请求首部中，告知服务器可以使用哪些传输编码扩展。如果这个首部起名叫 `Accept-Transfer-Encoding`，它的意义就会更直白。

- Transfer-Encoding    
告知接收方为了可靠地传输报文，已经对其进行了何种编码。


## 参考
- [Transfer-Encoding - MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Transfer-Encoding)
