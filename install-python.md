### Install Python

#### 下载源码
``` shell
wget https://www.python.org/ftp/python/2.7.12/Python-2.7.12.tgz
```


#### 解压
``` shell
tar -zxvf Python-2.7.12.tgz
```

#### 编译安装
``` shell
cd Python-2.7.12
```

``` shell
./configure  
make all
make install
make clean
make distclean
```

~~#### 建立软连接，使系统默认的 python指向 python2.7~~
```
ln -s /usr/local/bin/python2.7 /usr/bin/python  
```

####  查看版本
```
python -V
```
