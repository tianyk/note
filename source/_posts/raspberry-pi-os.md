---
title: 树莓派安装操作系统
date: 2016-07-13 19:28:40
updated: 2018-09-06 01:45:10
tags: RaspberryPi
---
## 树莓派安装操作系统

### 安装步骤

1. [下载](https://www.raspberrypi.org/downloads/raspbian/)系统镜像

2. 如果是`.zip`文件解压镜像

3. 格式化SD卡

    必须是`FAT32`格式

4. `diskutil list` 找到SD卡

    ```
    /dev/disk0 (internal):
    #:                       TYPE NAME                    SIZE       IDENTIFIER
    0:      GUID_partition_scheme                         500.3 GB   disk0
    1:                        EFI EFI                     314.6 MB   disk0s1
    2:                 Apple_APFS Container disk1         500.0 GB   disk0s2

    /dev/disk1 (synthesized):
    #:                       TYPE NAME                    SIZE       IDENTIFIER
    0:      APFS Container Scheme -                      +500.0 GB   disk1
                                Physical Store disk0s2
    1:                APFS Volume Macintosh HD            171.9 GB   disk1s1
    2:                APFS Volume Preboot                 39.8 MB    disk1s2
    3:                APFS Volume Recovery                519.0 MB   disk1s3
    4:                APFS Volume VM                      4.3 GB     disk1s4

    /dev/disk2 (external, physical):
    #:                       TYPE NAME                    SIZE       IDENTIFIER
    0:     FDisk_partition_scheme                        *32.0 GB    disk2
    1:             Windows_FAT_32 boot                    66.1 MB    disk2s1
    2:                      Linux                         31.9 GB    disk2s2
    ```

5. 卸载设备

    > 此处的`/dev/disk2`为上条命令查到的SD卡
    
    ```
    diskutil unmountDisk /dev/disk2
    ```

6. 将镜像写入SD卡

    ```
    sudo dd bs=1m if=2016-05-27-raspbian-jessie.img of=/dev/rdisk2
    ```

### 登陆系统

1. 使用网线链接到路由器

2. 登陆路由器管理界面查看树莓派IP

    或者使用nmap扫描端口 
    ```
    nmap -p22 10.0.1.3/24
    ```
    > 10.0.1.3 为你本机IP

3. SSH登陆到树莓派
    
    > 默认用户名为`pi`，密码为`raspberry`。    
    > 注意：新版`raspberrypi`操作系统`SSH`服务并没有开机启动！！！此时需要在在磁盘目录新建一个名为`ssh`的文件。

    ```
    ssh pi@host
    ```

4. 修改默认密码

    ```
    passwd pi
    ```

5. 启用root用户

    1. 设置root用户密码
    
        ```
        sudo passwd root
        ```

    2. 解锁root用户

        ```
        sudo passwd --unlock root
        ```
    3. 允许root SSH登陆
    
        ```
        sudo vi /etc/ssh/sshd_config
        ```
        找到`PermitRootLogin`一行修改为`PermitRootLogin yes`

### 参考
- [INSTALLING OPERATING SYSTEM IMAGES ON MAC OS](https://www.raspberrypi.org/documentation/installation/installing-images/mac.md)