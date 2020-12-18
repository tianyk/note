---
title: SSH
date: 2016-07-25 10:12:21
updated: 2019-09-25 19:36:24
tags: ssh
---
### 常用命令

1. SSH登陆时指定私钥
``` shell
ssh username@ip -i ./xxx/privateKey -p prot
```

2. SSH代理 

``` shell
ssh -N -L -f 0.0.0.0:3306:127.0.0.1:3306 user@host 
```

- -N 只发送数据不连接
- -L 映射  localhost:localport:remotehost:remoteport 代理主机
- -f 后台运行

经过本机`3306`端口的流量都经`user@host`机器转发到`127.0.0.1:3306`上去


### 配置
在.ssh文件夹下新建`config`文件，示例：
```
Host www
    HostName 192.168.1.111
    Port 50
    User root
    IdentityFile ~/.ssh/id_rsa_2048

# git指定私钥
Host api
    HostName api.domain.com
    User git
    Port 22
    IdentityFile ~/.ssh/git_id_rsa
```

访问的时候只需运行`ssh www`就能访问`192.168.1.111`服务器了


### SSH配置
/etc/ssh/sshd_config

1. 禁止密码登陆

    vim /etc/ssh/sshd_config
    ```
    PasswordAuthentication no 
    ```
    修改后重新加载配置

2. 避免自动断开

    vim /etc/ssh/sshd_config
    ```
    # 60s 一次心跳
    ClientAliveInterval 60
    # 5 次失败后自动段考
    ClientAliveCountMax 5 
    ```
    修改后重新加载配置

### 常见问题
1. 已经在`authorized_keys`加入过publicKey，但是还是要求输入密码。
    > 权限问题，一般.ssh目录的文件权限为`600`。
    ``` shell 
    chmod 600 authorized_keys
    restorecon -r -vv /root/.ssh
    ```

2. `ssh-copy-id` 命令  
    `ssh-copy-id`命令可以把本地主机的公钥复制到远程主机的 authorized_keys 文件上，ssh-copy-id 命令也会给远程主机的用户主目录（home）和 ~/.ssh, 和~/.ssh/authorized_keys设置合适的权限。
    ```shell
    ssh-copy-id user@server
    ssh-copy-id -i ~/.ssh/id_rsa.pub user@server
    ```

3. `sshpass` 输入密码
    ssh 登录时不能指定密码，有时间很不方便。使用 sshpass 可以来处理这个问题。
    ```shell
    sshpass -p 'passwd' ssh user@domain
    ```

4. 连接自动断开
    修改`/etc/ssh/sshd_config` `ClientAliveInterval`和`ClientAliveInterval`参数
    ```
    # 指定了服务器端向客户端请求消息的时间间隔。默认是0，不发送，而ClientAliveInterval 60表示每分钟发送一次。
    ClientAliveInterval 60
    # ClientAliveCountMax表示服务器发出请求后客户端没有响应的次数达到一定值, 就自动断开。
    ClientAliveCountMax 3
    ```


### 参考
- [CentOS SSH公钥登录问题](https://segmentfault.com/q/1010000000445726)
- [public key authentication fails ONLY when sshd is daemon](http://serverfault.com/questions/321534/public-key-authentication-fails-only-when-sshd-is-daemon)
- [一次由SELinux引起的ssh公钥认证失败问题](https://web.archive.org/web/20170801031147/http://www.cnblogs.com/qcly/archive/2013/07/27/3219535.html) 
- [ssh免密码登录(公钥登录)失败的原因](http://www.2cto.com/os/201212/173257.html) 
- [Linux命令之非交互SSH密码验证-sshpass](http://blog.csdn.net/wangjunjun2008/article/details/19993395)
