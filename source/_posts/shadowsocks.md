---
title: Shadowsocks
date: 2018-01-17 15:48:05
updated: 2018-06-27 16:36:02
tags: shadowsocks
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

### 部署脚本
``` shell 
#!/bin/sh

# install pip 
curl -s "https://bootstrap.pypa.io/get-pip.py" | python

# isntall shadowsocks
pip install shadowsocks

# 获取IP
ip=`curl -s https://api.ipify.org`;
# 服务端口
port=4433
# 密码
pass="password"

# 配置文件
# 如果无法启动尝试绑定服务器IP为0.0.0.0
rm -rf /etc/ss.json 
touch /etc/ss.json 
echo -e "{ \n \
    \"server\": \"$ip\", \n \
    \"server_port\": $port, \n \
    \"local_port\": 1080, \n \
    \"password\": \"$pass\", \n \
    \"timeout\": 600, \n \
    \"method\": \"aes-256-cfb\" \n \
}" > /etc/ss.json 

# 防火墙
iptables -I INPUT 1 -p tcp --dport 4433 -j ACCEPT
iptables -I OUTPUT 1 -p tcp --sport 4433 -j ACCEPT

iptable -I INPUT 5 -p icmp -j ACCEPT

service iptables save
service iptables reload

# 启动服务
ssserver -d start -c /etc/ss.json
```

### 参考 
<https://github.com/shadowsocks/shadowsocks/wiki>   
<https://shadowsocks.org/>
<https://github.com/shadowsocks>
<https://github.com/shadowsocksr-backup>