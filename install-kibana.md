1. 导入密钥
```
rpm --import https://packages.elastic.co/GPG-KEY-elasticsearch
```

2. 配置源  
在`/etc/yum.repos.d/`目录下新建`kibana.repo`写入一下内容。
```
[kibana-4.5]
name=Kibana repository for 4.5.x packages
baseurl=http://packages.elastic.co/kibana/4.5/centos
gpgcheck=1
gpgkey=http://packages.elastic.co/GPG-KEY-elasticsearch
enabled=1
```

3. 安装  
```
yum clean all
yum install kibana -y
```

4. 配置开机启动  
```
chkconfig --add kibana
```

5. 启动服务
```
service kibana start
```

6. 参考  
[【1】](https://www.elastic.co/guide/en/kibana/4.5/setup.html#setup-repositories)
