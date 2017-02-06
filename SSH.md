### 常用命令

1. SSH登陆时指定私钥
```
ssh username@ip -i ./xxx/privateKey -p prot
```

### 配置
在.ssh文件夹下新建`config`文件，示例：
```
Host www
    HostName 182.169.15.88
    Port 50
    User root
    IdentityFile ~/.ssh/id_rsa_2048

# git指定私钥
Host git.yunshipei.net
    HostName git.yunshipei.net
    User git
    Port 22
    IdentityFile ~/.ssh/git_id_rsa
```

访问的时候只需运行`ssh www`就能访问`182.169.15.88`服务器了


### 问题
1. 已经在`authorized_keys`加入过publicKey，但是还是要求输入密码。
```
# 1.权限问题
chmod 600 authorized_keys

restorecon -r -vv /root/.ssh
```
参考：[【1】](https://segmentfault.com/q/1010000000445726) [【2】](http://serverfault.com/questions/321534/public-key-authentication-fails-only-when-sshd-is-daemon) [【3】](http://www.cnblogs.com/qcly/archive/2013/07/27/3219535.html) [【4】](http://www.2cto.com/os/201212/173257.html)
