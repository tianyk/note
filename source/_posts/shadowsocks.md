---
title: Shadowsocks
date: 2018-01-17 15:48:05
tags: 
---
## Shadowsocks
### 安装
``` shell 
pip install shadowsocks
```

`ssserver` & `sslocal`

### 服务器端
```
vim /etc/ss.json 
{
    "server": "host",
    "server_port": 4443,
    "local_port": 1080,
    "password": "password",
    "timeout": 600,
    "method": "aes-256-cfb"
}

ssserver -d start -c /etc/ss.json
```

### 客户端
```
sslocal -d start -c /etc/ss.json 
-p port
-s server
-k pass
-m encryption
-h help
```


### 参考 
<https://github.com/shadowsocks/shadowsocks/wiki>   
<https://shadowsocks.org/>
<https://github.com/shadowsocks>
<https://github.com/shadowsocksr-backup>