---
title: pyenv
author: tyk
date: 2018-09-06 16:41:10
tags:
---

### 安装

<https://github.com/pyenv/pyenv-installer>

```
curl -L https://github.com/pyenv/pyenv-installer/raw/master/bin/pyenv-installer | bash
```

### 常用命令
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
1. ModuleNotFoundError: No module named '_ctypes'

    ```
    apt-get install libffi-dev 
    # or 
    yum install libffi-devel
    ```