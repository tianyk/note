---
title: 时间同步.md
date: 2016-08-08 15:36:52
tags: 
---
1. 安装ntpdate
```
yum install ntpdate.x86_64

OR

apt-get install ntpdate
```

2. 同步时间
```
ntpdate time.nist.gov
```

3. 定时同步
```
# 每10分钟同步一次
crontab -e
*/10 * * * * /usr/sbin/ntpdate time.nist.gov
```

> ntp 服务器使用udp，默认端口123
