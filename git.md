### Git

#### Install
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
