---
title: VirtualBox-CentOS7
date: 2016-12-06 19:07:36
tags: 
---
### VirtualBox下CentOS7常见问题

#### 启动后显示`CentOS7 Virtualbox  SMBus base address uninitialized upgrade BIOS or use force_addr=0xaddr`

1、检查一下 `i2c_piix4` 模块是否存在(一般正常安装都是已经加载的，确认一下比较好)
```
[root@localhost ~]# lsmod | grep i2c_piix4
i2c_piix4 11098 0
i2c_core 25799 1 i2c_piix4
```

2、编辑黑名单文件...
```
[root@localhost ~]# vi /etc/modprobe.d/blacklist.conf
```

3、将下面的语句加入黑名单的最后一行，`:wq`保存退出
```
blacklist i2c_piix4
```

4、reboot重启系统，那行错误就不见了...


#### 启动后无网络`Network is unreachable`
检查 `/etc/sysconfig/network-scripts/ifcfg-enp0s3`选项`ONBOOT`是否为`yes`。如果不为`yes`修改为`yes`然后重启。

#### 无`ifconfig`命令
```
yum install -y net-tools  
```


### 参考
[【解决VirtualBox下CentOS启动时"MBus base address uninitialized"错误】](http://www.slyar.com/blog/mbus-base-address-uninitialized.html)  
[【centos7没有安装ifconfig命令的解决方法】](http://www.centoscn.com/CentosBug/osbug/2014/0916/3750.html)  
[【CentOS 7 下 ifconfig command not found 解决办法】](https://my.oschina.net/u/1428349/blog/288708)  
[【CentOS 7 Network is unreachable】](https://my.oschina.net/u/1428349/blog/288708)   
