-r 递归
-j 会忽略目录结构
-q 静默
```
zip -rjq Documents.zip /Users/you/Documents
```

``` 忽略外层，保留内层目录结构
cd /Users/you/Documents && zip -rq Documents.zip *
```
