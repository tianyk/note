---
title: 家用NAS搭建
author: tyk
date: 2019-05-25 22:53:15
tags:
---
## 家用NAS搭建

手里有一个树莓派，刚好有几张闲置的SD卡。闲来没事搭建个`NAS`（Network Attached Storage）服务。使用树莓派搭建`NAS`服务优点就是省电，缺点是网卡有点差。我们访问`NAS`时最好使用`5G`网络。

### 部署及配置

1. 安装`samba`

    ``` shell 
    $ apt-get install samba samba-common-bin
    ```

2. 配置

    ``` shell 
    $ vim /etc/samba/smb.conf
    ```

    找到`Share Definitions`部分在后面配置共享目录

    ```
    # [共享名] 
    [ytdl]
        comment = share # 共享描述
        path = /data/share/  # 共享目录
        valid users = pi # 允许访问该共享的用户 多个用户逗号分隔
        browseable = yes # 该指定共享目录可浏览
        public = no # 允许guest用户访问
        writable = yes # 允许可写
    ```

    > 配置完成重启服务器即可

3. 添加用户

    ```
    $ smbpasswd -a [user]
    ```

    > 根据提示输入密码即可

4. 启动和停止

    - 启动：/etc/init.d/samba restart
    - 停止：/etc/init.d/samba stop
    - 重启：/etc/init.d/samba restart
    - 重新加载配置文件：/etc/init.d/samba reload


### 参考

- [在树莓派上安装Samba实现树莓派与Windows间的文件共享](https://www.jianshu.com/p/ead92b06318e)
- [Linux samba的配置和使用](https://blog.csdn.net/weixin_40806910/article/details/81917077)