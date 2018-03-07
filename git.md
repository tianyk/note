## Git

### 安装
1. [下载](https://github.com/git/git/releases)最新版
``` shell
wget https://github.com/git/git/archive/v2.13.2.tar.gz
tar -zxf v2.13.2.tar.gz
```
2. 编译安装
``` shell
yum -y install gcc gcc-c++ make libtool zlib zlib-devel openssl openssl-devel  

sudo make prefix=/usr/local install
```
> 指定 prefix 为 /usr/local 会安装到 /usr/local/bin 下，指定 prefix 为 /use 会安装到/usr/bin 下。

### 配置
1. 设置代理
    ``` shell 
    git config --global https.proxy http://127.0.0.1:1080
    git config --global --unset http.proxy
    ```

2. 中文编码
    ``` shell
    git config --global core.quotepath false
    ```

### 常用命令

#### revert
`revert`会丢弃掉提交，并生成一个新的`commit`。
```shell 
git revert HEAD # 丢弃掉最新的提交
git revert HEAD^ 或 git git revert HEAD~1 # 丢弃掉倒数第二次提交 HEAD^^倒数第三次，等同于HEAD~2
git revert bb72c804 # 丢弃掉提交
```

#### reset 
`reset`恢复为某次提交，后面的变更会全部丢弃掉。
+ --soft – 缓存区和工作目录都不会被改变。
+ --mixed – 默认选项。缓存区和你指定的提交同步，但`工作目录`不受影响。
+ --hard – 缓存区和`工作目录`都同步到你指定的提交。
> 如果提交已经推送到远端仓库，`reset`后`push`时需要强制覆盖`-f`。

``` shell
git reset --hard HEAD^ # 恢复到上次提交
git reset --hard bb72c804 # 回复到bb72c804
```

### 参考
- [代码回滚：Reset、Checkout、Revert 的选择](https://github.com/geeeeeeeeek/git-recipes/wiki/5.2-%E4%BB%A3%E7%A0%81%E5%9B%9E%E6%BB%9A%EF%BC%9AReset%E3%80%81Checkout%E3%80%81Revert-%E7%9A%84%E9%80%89%E6%8B%A9)