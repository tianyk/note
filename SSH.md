### 常用命令

1. SSH登陆时指定私钥
```
ssh username@ip -i ./xxx/privateKey -p prot
```

### 问题
1. 已经在`authorized_keys`加入过publicKey，但是还是要求输入密码。
```
restorecon -r -vv /root/.ssh
```
参考：[【1】](https://segmentfault.com/q/1010000000445726) [【2】](http://serverfault.com/questions/321534/public-key-authentication-fails-only-when-sshd-is-daemon) [【3】](http://www.cnblogs.com/qcly/archive/2013/07/27/3219535.html) [【4】](http://www.2cto.com/os/201212/173257.html)
