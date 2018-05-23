---
title: 安装nginx.md
date: 2016-08-22 14:45:24
tags: nginx
---
### 源码安装
#### 下载
去[download](http://nginx.org/en/download.html)页面选着合适的版本，下载源码
```
wget http://nginx.org/download/nginx-1.11.3.tar.gz
tar -zxvf nginx-1.11.3.tar.gz
```

#### 安装依赖
```
yum -y install gcc gcc-c++ make libtool zlib zlib-devel openssl openssl-devel pcre pcre-devel
```

#### 编译
1、configure
编译的时候可以指定一些参数。nginx安装目录、配置文件路径、插件等等。  
nginx大部分常用模块，编译时`./configure --help`以`--without`开头的都默认安装。
`--prefix=PATH`: 指定nginx的安装目录。默认 `/usr/local/nginx`  
`--conf-path=PATH`: 设置nginx.conf配置文件的路径。nginx允许使用不同的配置文件启动，通过命令行中的-c选项。默认为prefix/conf/nginx.conf  
`--user=name`: 设置nginx工作进程的用户。安装完成后，可以随时在nginx.conf配置文件更改user指令。默认的用户名是nobody。--group=name类似
`--with-pcre`: 设置PCRE库的源码路径，如果已通过yum方式安装，使用--with-pcre自动找到库文件。使用--with-pcre=PATH时，需要从PCRE网站下载pcre库的源码（版本4.4 - 8.30）并解压，剩下的就交给Nginx的./configure和make来完成。perl正则表达式使用在location指令和 ngx_http_rewrite_module模块中  
`--with-zlib=PATH`: 指定 zlib（版本1.1.3 - 1.2.5）的源码解压目录。在默认就启用的网络传输压缩模块ngx_http_gzip_module时需要使用zlib   
`--with-http_ssl_module`: 使用https协议模块。默认情况下，该模块没有被构建。前提是openssl与openssl-devel已安装  
`--with-http_stub_status_module`: 用来监控 Nginx 的当前状态  
`--with-http_realip_module`: 通过这个模块允许我们改变客户端请求头中客户端IP地址值(例如X-Real-IP 或 X-Forwarded-For)，意义在于能够使得后台服务器记录原始客户端的IP地址  
`--add-module=PATH`: 添加第三方外部模块，如nginx_upstream_check_module或缓存模块。每次添加新的模块都要重新编译（Tengine可以在新加入module时无需重新编译）  
e.g,
```shell
./configure \
--user=nginx \
--group=nginx \
--add-module=./plugins/nginx_upstream_check_module/
```

2、make
```
make & make install
```

### 常用命令
1. 启动

    ``` shell
    nginx -c filename # 默认 conf/nginx.conf
    ```

2. 停止

    ``` shell 
    nginx -s stop 

    kill -QUIT `cat /nginx/logs/nginx.pid`
    ```
    
3. 平滑升级
    
    ``` shell 
    kill -USR2 `cat /nginx/logs/nginx.pid.oldbin`
    kill -WINCH `cat /nginx/logs/nginx.pid.oldbin` # 逐步旧Server的停止工作进程
    ```
    
4. 重新加载文件

    ``` shell
    nginx -s relaod 

    kill -HUP `cat /nginx/logs/nginx.pid`
    ```

5. 检验配置文件

    ``` shell
    nginx -t -c filename 
    ```

6. 日志切割

    ``` shell 
    kill -USR1 `cat /nginx/logs/nginx.pid`
    ```

6. 
### 参考
[【1】](https://segmentfault.com/a/1190000002797601)
