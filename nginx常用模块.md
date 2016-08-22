### NGX_HTTP_AUTH_BASIC_MODULE
这个模块用来做Basic Auth认证的，默认就已经安装过了。

生成密码
```
printf "username:$(openssl passwd -crypt password)\n" >> conf/htpasswd
```
修改配置文件
```
server {
    listen 80;
    server_name elk.my-guide.cc;

    location / {
         auth_basic            "elk.my-guide.cc";
         auth_basic_user_file  htpasswd;
         proxy_pass            http://elk.my-guide.cc:5601;
    }
}
```
> 需要注意的是如果`auth_basic_user_file`使用相对路径来指定，那么它相对的是conf文件。

重新加载配置
```
nginx -s reload
```
