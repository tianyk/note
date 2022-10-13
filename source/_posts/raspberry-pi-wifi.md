---
title: 树莓派设置WIFI
date: 2016-07-13 19:37:04
updated: 2018-09-10 13:51:48
tags: RaspberryPi
---

### 启动设置WIFI

新建 `wpa_supplicant.conf`
```
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
network={
    ssid="路由名称"
    psk="密码"
}
```

重启电脑

### 扫描WiFi
```
sudo iwlist wlan0 scan | grep ESSID
```

### 设置静态IP
编辑/etc/network/interfaces
`sudo vi /etc/network/interfaces`

找到`allow-hotplug wlan0`一栏
修改为
```
iface wlan0 inet static
    address 192.168.0.118
    gateway 192.168.0.1
    netmask 255.255.255.0 
```

注意，如果`/etc/network/interfaces`有如下提示：
```
# Please note that this file is written to be used with dhcpcd
# For static IP, consult /etc/dhcpcd.conf and 'man dhcpcd.conf'
```
需要在`/etc/dhcpcd.conf`配置静态IP
```
interface eth0
static ip_address=192.168.1.4/24 # /24表示掩码为 255.255.255.0
static routers=192.168.1.1
static domain_name_servers=114.114.114.114 114.114.115.115
```