### 安装
```
yum install httpd-tools
or
yum install apr-util
```

### 使用
``` shell
> ab -n 10000 -c 200 http://10.0.1.4/redis # -n 后面的10000代表总共发出10000个请求；-c后面的200表示采用200个并发（模拟200个人同时访问），后面的网址表示测试的目标URL。
This is ApacheBench, Version 2.3 <$Revision: 1748469 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking 10.0.1.4 (be patient)
Completed 1000 requests
Completed 2000 requests
Completed 3000 requests
Completed 4000 requests
Completed 5000 requests
Completed 6000 requests
Completed 7000 requests
Completed 8000 requests
Completed 9000 requests
Completed 10000 requests
Finished 10000 requests


Server Software:        nginx/1.11.3
Server Hostname:        10.0.1.4
Server Port:            80

Document Path:          /redis # 测试的页面
Document Length:        28 bytes # 页面大小

Concurrency Level:      200 # 并发请求数
Time taken for tests:   4.512 seconds # 整个测试持续的时间
Complete requests:      10000 # 完成的请求数
Failed requests:        170 # 失败的请求数
   (Connect: 0, Receive: 0, Length: 170, Exceptions: 0)
Total transferred:      1700170 bytes # 整个场景中的网络传输量
HTML transferred:       280170 bytes # 整个场景中的HTML内容传输量
Requests per second:    2216.07 [#/sec] (mean) # 吞吐率，大家最关心的指标之一，相当于 LR 中的每秒事务数，后面括号中的 mean 表示这是一个平均值
Time per request:       90.250 [ms] (mean) # 用户平均请求等待时间，大家最关心的指标之二，相当于 LR 中的平均事务响应时间，后面括号中的 mean 表示这是一个平均值
Time per request:       0.451 [ms] (mean, across all concurrent requests) # 服务器平均请求处理时间，大家最关心的指标之三
Transfer rate:          367.94 [Kbytes/sec] received # 平均每秒网络上的流量，可以帮助排除是否存在网络流量过大导致响应时间延长的问题

# 这段表示网络上消耗的时间的分解
Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        2   23   7.9     24     157
Processing:    14   66  22.4     70     243
Waiting:       14   66  22.4     70     243
Total:         20   89  23.4     95     255

# 这段是每个请求处理时间的分布情况，50%的处理时间在95ms内，66%的处理时间在98ms内...，重要的是看90%的处理时间。
Percentage of the requests served within a certain time (ms)
  50%     95
  66%     98
  75%     99
  80%    100
  90%    102
  95%    106
  98%    110
  99%    224
 100%    255 (longest request)
>
```

### 参考
[【1】](http://www.jianshu.com/p/43d04d8baaf7) [【2】](http://www.ha97.com/4617.html)
