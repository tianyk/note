---
title: Execute-bash-script-from-URL
date: 2016-11-25 15:42:15
tags: curl 
---
### curl 脚本并直接执行

```
bash <(curl -s http://mywebsite.com/myscript.txt)
```


```
source <(curl -s http://mywebsite.com/myscript.txt)
```

```
curl -fsSL "http://mywebsite.com/myscript.sh" | /bin/sh
```


### 参考
[【1】](https://stackoverflow.com/questions/5735666/execute-bash-script-from-url) [【2】](https://www.v2ex.com/t/218912)
