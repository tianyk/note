---
title: 树莓派设置WIFI.md
date: 2016-07-13 19:37:04
tags: RaspberryPi
---

### 连接带WIFI
编辑wpa_supplicant.conf 
`sudo vi /etc/wpa_supplicant/wpa_supplicant.conf`
在最后加入
```
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
