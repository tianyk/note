---
title: Echo服务
author: tyk
date: 2018-08-17 15:58:34
tags:
---
## Echo服务
有些情况下调试网络客户端程序时会需要一个服务器配合测试，这时Echo服务就比较适合。它能充当一个Socket服务器，并且会把我们传过去的值返回来。

我们以`\n`或`\r\n`作为网络包的分隔符。

{% include_code https://raw.githubusercontent.com/tianyk/echo/master/echo.js %}

启动服务：
```  
ulimit -n 10240
nohup node echo.js >/var/log/echo.log 2>&1 & 
```

测试一下：
```  
telnet echo.kekek.cc 7000
```

[Github](https://github.com/tianyk/echo.git)
