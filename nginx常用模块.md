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

### NGX_HTTP_SUB_MODULE
这个模块可以让我们来修改网站响应内容中。

默认这个模块是没编译到Nginx中的，在配置的时候我们加上`--with-http_sub_module`就可以了。

它主要有三个指令
- sub_filter
    ```
    # 这里会将网页里的`dog`替换成`pig`
    sub_filter dog pig;

    # 在头部引入一段js。注意，我们只能使用一次sub_filter，如果有多个地方或者更复杂的替换使用下面的`NGX_HTTP_SUBSTITUTIONS_FILTER_MODULE`模块
    sub_filter </head> '</head><script language="javascript" src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>';
    ```
- sub_filter_types
    ```
    # 指定需要被替换的MIME类型,默认为'text/html'，如果制定为*，那么所有的
    sub_filter_types text/javascript text/css;
    ```
- sub_filter_once
    ```
    字符串替换一次还是多次替换，默认替换一次。如果网页中有多个`dog`字符串，如果开启once只会替换第一个。
    sub_filter_once on;
    ```

### NGX_HTTP_SUBSTITUTIONS_FILTER_MODULE
[NGX_HTTP_SUBSTITUTIONS_FILTER_MODULE](https://github.com/yaoweibin/ngx_http_substitutions_filter_module)和NGX_HTTP_SUB_MODULE类似，不过功能更强大，在这里我们可以使用正则去匹配。

这是一个第三方模块，编译时需要加上`--add-module=/path/to/ngx_http_substitutions_filter_module`。

它主用两个指令
- subs_filter
    ```
    # 替换`<script src="jquery.min.js?v=3.2.1"></script>`的版本为URL上v参数值。
    # 例如：我们请求`index.html?v=2.2.2`，处理后我们拿到的网页内容就是`<script src="jquery.min.js?v=2.2.2"></script>`。
    # $arg_v取出query上的v的值。$arg代表query，$arg_{x}代表query上{x}的值。
    subs_filter jquery\.min\.js\?v=\d\.\d\.\d jquery.min.js?v=$arg_v or;
    # subs_filter 可以写多个
    subs_filter dog pig;
    ```
    subs_filter 第三个参数，替换模式。我们可以选择字符串替换或者正则替换
    - g(default):替换所有匹配的字符串。
    - i: 执行不区分大小写的匹配。
    - o: 只需将第一个。
    - r:该模式是作为一个正则表达式处理，默认是固定的字符串。

- subs_filter_types
    ```
    # 指定需要被替换的MIME类型,默认为'text/html'，如果制定为*，那么所有的
    sub_filter_types text/javascript text/css;
    ```
#### 参考
[Nginx编译安装第三方模块http_substitutions_filter_module](http://rmingwang.com/install-nginx-third-modules-http_sub_module.html)