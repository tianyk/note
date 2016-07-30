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
yum install elasticsearch -y
```

4. 参考  
[【1】](https://www.elastic.co/guide/en/elasticsearch/reference/current/setup-repositories.html)
