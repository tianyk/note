## HTTP 

### Hello, World.
```
rm -rf index.html
touch index.html

body="<h1>Hello, World.</h1>"

echo -e "HTTP/1.1 200 OK\r" >> index.html
echo -e "content-type: text/html; charset=utf-8\r" >> index.html
echo -e "content-length: ${#body}\r" >> index.html
echo -e "connection: close\r" >> index.html
echo -e "\r\n" >> index.html

echo "${body}" >> index.html

sudo nc -l 80 < index.html 
```

访问<http://127.0.0.1>

### HTTP/1.1 

#### keep-alive

#### Content-Length

#### Transfer-Encoding
[HTTP 分块传输编码](chunked-transfer-encoding.md)