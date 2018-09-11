---
title: 安装Python
date: 2016-12-06 19:07:36
updated: 2018-09-11 18:53:05
tags: python
---
## 安装Python

### 源码安装
1. 下载源码

    ```shell
    wget https://www.python.org/ftp/python/2.7.12/Python-2.7.12.tgz
    ```

2. 解压

    ```shell
    tar -zxvf Python-2.7.12.tgz
    ```

3. 编译安装

    ```shell
    cd Python-2.7.12
    ```

    ```shell
    ./configure  
    make all
    make install
    make clean
    make distclean
    ```

4. 建立软连接，使系统默认的 python指向 python2.7

    ```
    ln -s /usr/local/bin/python2.7 /usr/bin/python  
    ```

5. 查看版本

    ```
    python -V
    ```

### pyenv

由于Python3和2不兼容，系统中使用的部分软件可能是使用的Python2编写的，例如yum。我们开发中可能又需要使用Python3，如果直接装全局的Python3可能很多软件就无法运行。这种情况下就需要一个Python版本管理软件，pyenv正是解决这种问题的。

#### 安装

<https://github.com/pyenv/pyenv-installer>

```
curl -L https://github.com/pyenv/pyenv-installer/raw/master/bin/pyenv-installer | bash
```

#### 常用命令
1. pyenv versions：列出系统安装的Python版本

2. pyenv version：查看当前版本

3. pyenv install 3.7.0：安装3.7.0版本到系统

    如果直接安装太慢可以采用离线安装的方法：
    ```
    wget https://www.python.org/ftp/python/3.7.0/Python-3.7.0.tar.xz -P ~/.pyenv/cache
    export PYENV_ROOT=$HOME/.pyenv
    pyenv install 3.7.0 
    ```
    
4. pyenv uninstall 3.7.0：卸载3.7.0版本

5. pyenv global 3.7.0：设置全局Python版本

6. pyenv local 3.7.0：设置本地（当前目录）Python版本

7. pyenv shell 3.7.0：设置当前Shell Python版本

    这个版本的优先级比 local 和 global 都要高。`pyenv shell --unset`（或者使用`unset PYENV_VERSION`）用来取消之前的设定。


### 常见问题

1. 升级后YUM不能使用

    编辑`/usr/bin/yum`，将头部的`#!/usr/bin/python`改为`#!/usr/bin/python2.6`

2. [zipimport.ZipImportError](https://github.com/pypa/pip/issues/1919)

    ```shell 
    ./configure --prefix= --with-zlib-dir=/usr/local/lib
    ```
3. ModuleNotFoundError: No module named '_ctypes'

    ```
    apt-get install libffi-dev 
    # or 
    yum install libffi-devel
    ```