---
title: logstash
date: 2016-08-08 15:53:59
tags: 
- logstash
- log
---
## Logstash

### 配置示例
适配
```
[2016-02-04 00:00:12.653] [INFO] access - pid: 12792 from 101.51.18.127:59983 at: 2016-02-03T16:00:09.516Z - ["Wed, 03 Feb 2016 16:00:09 GMT \"GET /api/dosomething 304 1 ms - - - 1.0\" \"xOXp3I1tHwXMyD2oA0MlWpYqD-PiCBhL 13471600000 171.139.119.147\" \"\" \"Mozilla/5.0 (Linux; Android 4.4.4; 2014811 Build/KTU84P) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/33.0.0.0 Mobile Safari/537.36\""]
```

```
input {
    stdin { }
    file {
        path => ["/root/2016-02-log/access.log-2016-02-04"]
        start_position => "beginning"
        codec => multiline {
            pattern => "^\["
            negate => true
            what => "previous"
        }
    }
}

filter {
    grok {
        match => {
            "message" => "\[%{TIMESTAMP_ISO8601}\] \[%{LOGLEVEL:level}\] %{WORD:type} - pid: %{POSINT:pid} from %{IP:host}:%{POSINT:port} at: %{TIMESTAMP_ISO8601} - \[\"%{DAY}, %{MONTHDAY:monthday} %{MONTH:month} %{YEAR:year} %{TIME:time} GMT%{SPACE}?%{ISO8601_TIMEZONE}? \\\"%{WORD:method} %{URIPATHPARAM:http_request} %{INT:http_status_code} (?:%{INT:response_time} ms|-) - (?:%{INT:content_length}|-) - %{NUMBER:http_version}\\" \\"(?:%{NOTSPACE:sid}|NoSessionID) (?:%{INT:mobile}|NoMobile|NoUserInfo) %{IP:remote-addr}\\" \\"%{DATA:referrer}\\\" \\\"%{DATA:user_agent}\\\"\"\]"
        }
        add_field => {
            "timestamp" => "%{year}-%{month}-%{monthday} %{time}"
        }
    }
    date {
        match => ["timestamp",  "YYYY-MMM-dd HH:mm:ss", "YYYY-MM-dd HH:mm:ss.SSS", "ISO8601"]  
        locale => "en-US"  
        remove_field => ["time" ,"month", "monthday", "year", "timestamp"]  
    }
}

output {
    stdout {
        codec => "json"
    }
    file {
        path => ["/root/logdash-demo/access.log"]
        codec => "json_lines"
    }
}
```


### 调试
<http://grokdebug.herokuapp.com/>

![](/images/ZErzrBkkjE.gif)
