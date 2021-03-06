---
title: cURL
date: 2016-12-28 16:30:44
updated: 2018-07-11 13:22:07
tags: curl 
---
## cURL

```
-X/--request [GET|POST|PUT|DELETE|…]  使用指定的http method发出 http request
-H/--header                           设置request里的header
-i/--include                          显示response的header
-d/--data                             设置 http parameters 
-v/--verbose                          小写的v参数，用于打印更多信息，包括发送的请求信息，这在调试脚本是特别有用。
-u/--user                             使用者账号、密码
-b/--cookie                           cookie  
-s/--slient                           减少输出的信息，比如进度
-o/--output <file>                    指定输出文件名称
-e/--referer                          <URL> 指定引用地址
-L                                    重定向

--resolve HOST:PORT:ADDRESS           设置解析地址
--retry <num>                         指定重试次数
--retry-delay SECONDS                 When retrying, wait this many seconds between each
--retry-max-time SECONDS              Retry only within this period>
--raw                                 raw response
```

### 示例
```
curl -X GET 'http:/example.com/_search?pretty=true' -d ' 
{
    "query": {
        "match": {
            "title": {
                "query": "白鹿原"
            }
        }
    }
} '
```

```
curl -X POST --cookie "token:abc;sesson_id:def" --header "HOST: www.baidu.com" --header "Content-Length: 0" http://127.0.0.1/dopost
```

```
curl -svo /dev/null 'https://www.baidu.com' --resolve www.baidu.com:443:127.0.0.1
```

### 参考
- [Linux命令之curl - 强大的网络传输工具](http://dbajun.iteye.com/blog/1813801)
- [使用curl指令測試REST服務](http://ju.outofmemory.cn/entry/84875)
- [curl自动化http操作](http://cizixs.com/2014/05/14/curl-automate-http)