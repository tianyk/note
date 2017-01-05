### RabbitMQ

#### 安装

由于RabbitMQ是基于Erlang语言开发的，所以要使用RabbitMQ的前提当然是要安装其运行环境。  
> 不同版本的RabbitMQ对Erlang版本的要求不同，安装时需要注意

```
yum install erlang
```

安装RabbitMQ

```
wget http://www.rabbitmq.com/releases/rabbitmq-server/v3.3.5/rabbitmq-server-3.3.5-1.noarch.rpm

yum install rabbitmq-server-3.3.5-1.noarch.rpm
```

加入开机启动服务

```
chkconfig rabbitmq-server on
```

然后启动

```
service rabbitmq-server start
```

启用web管理  
查看web管理是否启用，运行

```
rabbitmq-plugins list -e
```

如果打印的列表中没有rabbitmq_management，需要开启该插件才可以使用，运行

```
rabbitmq-plugins enable rabbitmq_management
```

创建用户

```
rabbitmqctl delete_user guest # 删除guest用户

rabbitmqctl add_user admin 123456 # 添加一个用户

rabbitmqctl set_user_tags admin administrator # 授予角色

rabbitmqctl set_permissions -p / admin '.*' '.*' '.*' # 授权
```

开放防火墙端口

```
iptables -A INPUT -p tcp -m multitport --dports 5672,55672 -j ACCEPT
iptables -A OUTPUT -p tpc -m multitport --sports 5672,55672 -j ACCEPT

```

#### Node.js使用RabbitMQ

### 参考

[【1】](http://www.qaulau.com/linux-centos-install-rabbitmq/) [【2】](https://my.oschina.net/hncscwc/blog/262246)
