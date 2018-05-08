---
title: python-virtualenv
date: 2016-11-25 15:42:15
tags: 
---
### Virtualenv
Virtualenv 通过创建独立Python开发环境的工具, 来解决依赖、版本以及间接权限
问题。Virtualenv 创建一个拥有自己安装目录的环境(沙箱), 这个环境不与其他虚拟环境共享库, 能够方便的管理python版本和管理python库。

### 安装
``` shell
[sudo] pip install virtualenv
```
或者
``` shell
[sudo] pip install https://github.com/pypa/virtualenv/tarball/develop
```

> pip安装参考[pip](/2016/11/25/pip/)

### 基本使用

#### 创建一个Python虚拟环境
``` shell
# 创建一个名为deeplearning的目录, 并且安装了deeplearning/bin/python, 创建了lib,include,bin目录,安装了pip

virtualenv deeplearning
```

#### 激活环境
``` shell
# Mac & Linux
source bin/activate[.sh|.fish|.csh]

# Win
打开 activate.bat
```

#### 退出环境
``` shell
deactivate
```


### 其它

#### 创建虚拟环境时指定Python版本
``` shell
virtualenv ENV3.5 --python=python3.5
```
另外
``` shell
virtualenv [OPTIONS] DEST_DIR

-p PYTHON_EXE, --python=PYTHON_EXE
指定所用的python解析器的版本，比如 --python=python2.5 就使用2.5版本的解析器创建新的隔离环境。
默认使用的是当前系统安装(/usr/bin/python)的python解析器。   
```

#### 生成可打包环境
某些特殊需求下,可能没有网络, 我们期望直接打包一个ENV, 可以解压后直接使用, 这时候可以使用`virtualenv --relocatable`指令将ENV修改为可更改位置的ENV。
```
virtualenv --relocatable ./
```

#### 创建一个干净的环境
加上了参数--no-site-packages，这样，已经安装到系统Python环境中的所有第三方包都不会复制过来。
```
virtualenv --no-site-packages ENV
```

### 参考
[【1】](http://www.jianshu.com/p/08c657bd34f1) [【2】](http://pythonguidecn.readthedocs.io/zh/latest/dev/virtualenvs.html)
