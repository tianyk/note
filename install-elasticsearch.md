1. 导入密钥
```
rpm --import https://packages.elastic.co/GPG-KEY-elasticsearch
```

2. 配置源  
在`/etc/yum.repos.d/`目录下新建`elasticsearch.repo`写入一下内容。
```
[elasticsearch-2.x]
name=Elasticsearch repository for 2.x packages
baseurl=https://packages.elastic.co/elasticsearch/2.x/centos
gpgcheck=1
gpgkey=https://packages.elastic.co/GPG-KEY-elasticsearch
enabled=1
```

3. 安装  
```
yum clean all
# 需要jre支持
yum install java-1.8.0-openjdk.x86_64 elasticsearch -y
```

4. 配置开机启动
```
chkconfig --add elasticsearch
```

5. 启动服务
```
service elasticsearch start
```

6. 参考  
[【1】](https://www.elastic.co/guide/en/elasticsearch/reference/current/setup-repositories.html) [【2】](https://www.elastic.co/guide/en/elasticsearch/reference/current/rpm.html)
