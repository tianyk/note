---
title: Install-Docker-Compose
date: 2016-11-08 18:43:57
tags: docker
---
### Install Docker Compose
```shell
curl -L "https://github.com/docker/compose/releases/download/1.8.1/docker-compose-$(uname -s)-$(uname -m)" > /usr/local/bin/docker-compose
```

```shell
chmod +x /usr/local/bin/docker-compose
```

```shell
docker-compose --version
```

### 参考
[【1】](https://docs.docker.com/compose/install/)
