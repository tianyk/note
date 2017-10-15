### nginx root & alias

`root`是指定一个项目根目录，`alias`表示一个拼接的意思。

例如我们请求路径为`https://www.domain.com/images/logo.png`

**root**
```
location ^~ /images/ {
    root /var/www;
}
```
实际映射路径是 `/var/www/images/logo.png`

**alias**
``` 
location ^~ /images/ {
    alias /var/www/;
}
```

实际映射路径是 `/var/www/logo.png`


> 注意：`alias`的后面如果指定的是一个文件夹斜杠不能省略。`alias`的最终处理是拼接的过程。