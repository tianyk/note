---
title: Linux内核
date: 2016-09-06 21:01:30
updated: 2018-07-20 15:15:49
category: linux 
tags: kernel
---
## Linux内核

### 查看内核及发行版
1. `uname -a`：查看Linux内核版本
2. `cat /etc/issue`：查看发行版

### 升级CentOS6内核
1. 导入public key

    ```
    rpm --import https://www.elrepo.org/RPM-GPG-KEY-elrepo.org
    ```

2. 添加ELRepo

    - RHEL-7, SL-7 or CentOS-7：
        ```
        rpm -Uvh http://www.elrepo.org/elrepo-release-7.0-3.el7.elrepo.noarch.rpm
        ```
    -  RHEL-6, SL-6 or CentOS-6：
        ```
        rpm -Uvh http://www.elrepo.org/elrepo-release-6-8.el6.elrepo.noarch.rpm
        ```
        
3. 升级Kernel

    > 在 ELRepo 中有两个内核选项，一个是 kernel-lt(长期支持版本)，一个是 kernel-ml(主线最新版本)，采用长期支持版本(kernel-lt)。
    ```
    # kernel-lt
    yum --enablerepo=elrepo-kernel install kernel-lt -y 
    or
    # kernel-ml
    yum --enablerepo=elrepo-kernel install kernel-ml -y 
    ```

4. 安装完成，需要修改grub

    > 根据安装好以后的内核位置，修改 default 的值，一般是修改为0，因为 default 从 0 开始，一般新安装的内核在第一个位置，所以设置default=0。
    ```
    vim /etc/grub.conf
    ```

5. 重启服务器

    ```
    reboot 
    ```

### 参考
- [CentOS6.X 升级内核Kernel](https://blog.csdn.net/wh211212/article/details/78683753)
- [ELRepo.org](http://elrepo.org/tiki/tiki-index.php)