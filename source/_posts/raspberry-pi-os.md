---
title: 树莓派安装操作系统
date: 2016-07-13 19:28:40
tags: RaspberryPi
---
### 安装步骤

1. [下载](https://www.raspberrypi.org/downloads/raspbian/)系统镜像
2. `diskutil list` 找到SD卡
3. `diskutil unmountDisk /dev/disk4` 
4. `sudo dd bs=1m if=2016-05-27-raspbian-jessie.img of=/dev/rdisk4`

参考：[【1】](https://www.raspberrypi.org/documentation/installation/installing-images/mac.md)