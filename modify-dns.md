### Linux临时或永久修改DNS

### 临时修改DNS
```
sudo vim /etc/resolv.conf
```

```
nameserver 114.114.114.114 #修改成你的主DNS
nameserver 114.114.115.115 #修改成你的备用DNS
search localhost #你的域名
```

输入`:wq`保存退出

### 永久修改网卡


### 参考
