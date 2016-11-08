### 阿里云Docker镜像加速
#### 注册私人镜像   
[镜像加速](http://mirror.aliyun.com/)
![](images/阿里云Docker镜像加速.jpeg)

#### 配置加速器   
1. Ubuntu
```shell
echo "DOCKER_OPTS=\"\$DOCKER_OPTS --registry-mirror=你的镜像加速地址\"" | sudo tee -a /etc/default/docker
sudo service docker restart
```
2. Centos
```shell
sudo sed -i 's|OPTIONS=|OPTIONS=--registry-mirror=你的镜像加速地址|g' /etc/sysconfig/docker
sudo service docker restart
```

### 参考
[【1】](https://baichuan.taobao.com/doc2/detail.htm?treeId=39&articleId=103049&docType=1)
