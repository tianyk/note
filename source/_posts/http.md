---
title: HTTP协议
date: 2018-02-05 15:16:45
tags: http
---
## HTTP 

### Hello, World.
```
rm -rf index.html
touch index.html

body="<h1>Hello, World.</h1>"

echo -e "HTTP/1.1 200 OK\r\n" >> index.html
echo -e "content-type: text/html; charset=utf-8\r\n" >> index.html
echo -e "content-length: ${#body}\r\n" >> index.html
echo -e "connection: close\r\n" >> index.html
echo -e "\r\n" >> index.html

echo "${body}" >> index.html

sudo nc -l 80 < index.html 
```

访问<http://127.0.0.1>

### HTTP/1.1 

#### keep-alive

#### Content-Length

#### Transfer-Encoding
[HTTP 分块传输编码](/2017/11/13/chunked-transfer-encoding/)