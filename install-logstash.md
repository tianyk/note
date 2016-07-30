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

4. 参考  
[【1】](https://www.elastic.co/guide/en/logstash/current/installing-logstash.html#package-repositories)
