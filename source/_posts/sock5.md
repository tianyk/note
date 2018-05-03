---
title: Sock5
date: 2017-12-15 19:12:41
tags: sock5
---
## Sock5

### 安装
1. 环境准备
    ```
    yum -y install gcc automake autoconf libtool make
    yum -y install pam-devel openldap-devel cyrus-sasl-devel
    ```

2. 编译安装
    ```
    <http://sourceforge.net/projects/ss5/files/>
    tar zxvf ss5-3.8.9-8.tar.gz
    cd ss5-3.8.9
    ./configure  //notes:(默认是1080端口，如果想改端口的话，./configure –with-defaultport=5533
    make && make install
    ```

3. 启动
    ```
    chmod a+x /etc/init.d/ss5
    /etc/init.d/ss5 start 
    ```

### 配置
1. 安装服务
    ```
    chkconfig --add ss5
    chkconfig ss5 on
    ```

2. 权限配置
    ```
    vim /etc/opt/ss5/ss5.conf 
    # 修改 SHost SPort Authentication 
    auth 0.0.0.0/0 – -
    改为
    auth 0.0.0.0/0 – u
    permit – 0.0.0.0/0 – 0.0.0.0/0 – – – – -
    改成为
    permit u 0.0.0.0/0 – 0.0.0.0/0 – – – – -

    # 添加用户
    touch /etc/opt/ss5/ss5.passwd
    echo "username password" > /etc/opt/ss5/ss5.passwd

    # 重启
    service ss5 restart
    ```


### 参考
- [linux下搭建socks 5代理](http://www.ttlsa.com/linux/linux-setup-socks-5-ttlsa/)
- [用Proxifier自由访问互联网](http://awy.me/2014/06/yong-shadowsocks-he-proxifier-zi-you-fang-wen-hu-lian-wang/)
- [Proxifier系统全局代理的正确姿势](http://blackwolfsec.cc/2016/09/19/Proxifier_Shadowshocks/)










