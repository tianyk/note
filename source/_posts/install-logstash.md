---
title: install-logstash
date: 2016-07-30 20:07:24
tags: 
- elasticsearch
- logstash
---
1. 导入密钥
```
rpm --import https://packages.elastic.co/GPG-KEY-elasticsearch
```

2. 配置源  
在`/etc/yum.repos.d/`目录下新建`logstash.repo`写入一下内容。
```
[logstash-2.3]
name=Logstash repository for 2.3.x packages
baseurl=https://packages.elastic.co/logstash/2.3/centos
gpgcheck=1
gpgkey=https://packages.elastic.co/GPG-KEY-elasticsearch
enabled=1
```

3. 安装  
```
yum clean all
yum install logstash
```

4. 安装目录介绍
```
[root@doog-os ~]# whereis logstash
logstash: /etc/logstash /opt/logstash/bin/logstash.bat /opt/logstash/bin/logstash

/opt/logstash/bin/logstash      #执行文件
/etc/logstash/conf.d/           #配置文件目录      
```

5. 添加开机启动
```
chkconfig --add kibana

# logstash服务的配置文件
/etc/sysconfig/logstash   
```


6. 参考  
[【1】](https://www.elastic.co/guide/en/logstash/current/installing-logstash.html#package-repositories)
