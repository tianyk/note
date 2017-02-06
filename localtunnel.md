### 简介
Localtunnel 是一个可以让内网服务器暴露到公网上的开源项目。

### 客户端

#### 安装
```
$ npm install -g localtunnel
```
#### 使用

假设本地服务器在 8000 端口，我们可以通过下面的命令把本地服务器暴露到公网中

```
$ lt --port 8000
```
your url is: https://uhhzexcifv.localtunnel.me
通过上面的命令，我们不需要做其他设置就可以通过 https://uhhzexcifv.localtunnel.me 来访问我们本地服务器了。
> 可以使用--subdomain参数指定自己喜欢的子域名。

由于 `localtunnel.me` 是国外的服务器，访问速度有时候不太理想，这时候我们可以自己搭建 `localtunnel` 的服务端。


### 服务端

#### 安装
```
$ git clone git://github.com/defunctzombie/localtunnel-server.git
$ cd localtunnel-server
$ npm install
```

#### 使用
以监听 2000 端口为例：
```
# 直接使用
$ bin/server --port 2000
# 配合 pm2 使用
$ pm2 start bin/server --name lt -- --port 2000
```
启动服务端程序后，我们只要在使用客户端 lt 时加上 --host 参数，就可以指定服务端了。

```
# host 后面不要加 /
$ lt --host http://helloworld.com:2000 --port 8000
your url is: http://jhuyudvlum.helloworld.com:2000
```
这样，我们就可以通过自己的代理服务器来访问本地服务器了，不用经过第三方代理服务器，不必担心代理服务器的安全问题。

### 参考
[【1】](https://localtunnel.github.io/www/) [【2】](https://scarletsky.github.io/2016/01/17/localtunnel-usage/)
