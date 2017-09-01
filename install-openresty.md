### 介绍
[OpenResty](https://openresty.org)是一个叫[lua-nginx-module](https://github.com/openresty/lua-nginx-module)的nginx模块发展来的，这个模块能让我们在config文件中编写lua脚本来构建Web应用系统。OpenResty可以让你的Web服务直接跑在 Nginx 服务内部。

### 安装

#### Linux包安装
[参考](https://openresty.org/cn/linux-packages.html)

#### 作为nginx模块安装
准备
1. [下载](http://luajit.org/download.html)LuaJIT
2. [下载](https://github.com/simpl/ngx_devel_kit/tags)最新的`ngx_devel_kit`模块
3. [下载](https://github.com/openresty/lua-nginx-module/tags)最新的`lua-nginx-module`模块
4. [下载](http://nginx.org/)最新的nginx

安装
```
# 编译luajit
tar zxvf LuaJIT-2.0.2.tar.gz

cd LuaJIT-2.0.2

make install PREFIX=/usr/local/luajit
echo "/usr/local/luajit/lib" > /etc/ld.so.conf.d/usr_local_luajit_lib.conf

ldconfig


# 配置luajit环境变量
export LUAJIT_LIB=/usr/local/luajit/lib

export LUAJIT_INC=/usr/local/luajit/include/luajit-2.0


# 编译nginx

./configure \
    --with-ld-opt="-Wl,-rpath,/usr/local/luajit/lib" \
    --add-module=/path/to/ngx_devel_kit \
    --add-module=/path/to/lua-nginx-module

make -j2
make install
```
> 和正常编译nginx差别不大，多了点lua环境的配置


### 常见问题
#### 缺少pcre模块
[安装文档](http://www.linuxfromscratch.org/blfs/view/svn/general/pcre.html)      
> http://www.micmiu.com/enterprise-app/server/nginx-libpcre-so-1/    
> 缺少头文件 `yum whatprovides */bzlib.h` 搜索、安装

### 参考
[【1】](http://blog.csdn.net/guowenyan001/article/details/48250427) [【2】](https://github.com/openresty/lua-nginx-module#installation) [【3】](http://openresty.org/cn/linux-packages.html)
