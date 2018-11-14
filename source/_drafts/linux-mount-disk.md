---
title: Linux挂载硬盘
author: tyk
date: 2018-09-12 11:45:47
tags:
---
## Linux挂载硬盘

1. fdisk -l

2. mkfs.ext4 /dev/sda

    ```
    mkfs -t ext4 /dev/sda 
    ```

3. mount 
    
    ```
    mkdir /data 
    ```

    vim /etc/fstab
    ```
    /dev/sda /data ext4 defaults,noatime 0 0
    ```

    mount -o remount /

