### 基于名字的虚拟主机

```
server {
    listen      80;
    server_name example.org www.example.org;
    ...
}

server {
    listen      80;
    server_name example.net www.example.net;
    ...
}

server {
    listen      80;
    server_name example.com www.example.com;
    ...
}
```

在这个配置中，`Nginx`仅仅检查请求的`Host`头以决定该请求应由哪个虚拟主机来处理。如果`Host`头没有匹配任意一个虚拟主机，或者请求中根本没有包含`Host`头，那`Nginx`会将请求分发到定义在此端口上的默认虚拟主机。在以上配置中，**第一个** 被列出的虚拟主机即`Nginx`的默认虚拟主机——这是`Nginx`的默认行为。而且，可以显式地设置某个主机为默认虚拟主机，即在`listen`指令中设置`default_server`参数：
```
server {
    listen      80 default_server;
    server_name example.net www.example.net;
    ...
}
```

> `default_server` 参数从0.8.21版开始可用。在之前的版本中，应该使用"default"参数代替。    
> `.example.com` 会匹配`example.com`和`www.example.com`。

> Nginx是根据`Host`来查找虚拟主机的。下面例子我们使用IP发起的请求，但是在请求头中`Host`加上了域名`Nginx`就会去查找`www.example.com`这个主机。
``` shell 
curl --header "Host: www.example.com" http://127.0.0.1/
```

### 如何防止处理未定义主机名的请求
如果不允许请求中缺少`Host`头，可以定义如下主机，丢弃这些请求：
```
server {
    listen       80;
    server_name  "";
    return       444;
}
```
在这里，我们设置主机名为空字符串以匹配未定义“Host”头的请求，而且返回了一个nginx特有的，非http标准的返回码444，它可以用来关闭连接。
> 从0.8.48版本开始，这已成为主机名的默认设置，所以可以省略`server_name ""`。而之前的版本使用机器的`hostname`作为主机名的默认值。

### 基于域名和IP混合的虚拟主机
```
server {
    listen      192.168.1.1:80;
    server_name example.org www.example.org;
    ...
}

server {
    listen      192.168.1.1:80;
    server_name example.net www.example.net;
    ...
}

server {
    listen      192.168.1.2:80;
    server_name example.com www.example.com;
    ...
}
```
这个配置中，nginx 首先测试请求的 IP 地址和端口是否匹配某个 server 配置块中的 listen 指令配置。接着 nginx 继续测试请求的 Host 头是否匹配这个 server 块中的某个 server_name 的值。如果主机名没有找到，nginx 将把这个请求交给默认虚拟主机处理。例如，一个从 192.168.1.1:80 端口收到的访问 www.example.com 的请求将被监听 192.168.1.1:80 端口的默认虚拟主机处理，本例中就是第一个服务器，因为这个端口上没有定义名为 www.example.com 的虚拟主机。  

> 首先匹配listen然后匹配server，如果没有全匹配的，那就用第一个匹配上listen的。

默认服务器是监听端口的属性，所以不同的监听端口可以设置不同的默认服务器：
```
server {
    listen      192.168.1.1:80;
    server_name example.org www.example.org;
    ...
}

server {
    listen      192.168.1.1:80 default_server;
    server_name example.net www.example.net;
    ...
}

server {
    listen      192.168.1.2:80 default_server;
    server_name example.com www.example.com;
    ...
}
```


### 参考
- [Nginx如何处理一个请求](http://tengine.taobao.org/nginx_docs/cn/docs/http/request_processing.html)
