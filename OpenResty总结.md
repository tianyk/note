- <https://gist.github.com/tianyk/e50ba80444cd114962493589a9efd3fa>
- <http://openresty-reference.readthedocs.io/en/latest/Lua_Nginx_API>
- <http://www.londonlua.org/scripting_nginx_with_lua/slides.html>
- <https://github.com/iresty/nginx-lua-module-zh-wiki>


### 
```
.
├── bin
│   ├── openresty
├── COPYRIGHT
├── lua/                                                # 项目lua代码
│   └── auth.lua
├── luajit/                                             # luajit
├── lualib/                                             # lua 第三方模块
│   ├── nginx-jwt.lua
│   ├── ngx                                             # ngx lua 模块
│   │   ├── balancer.lua
│   │   └── ...
│   └── resty                                           # openresty 第三方模块
│       ├── memcached.lua
│       ├── ...
├── nginx/                                              # nginx
├── openssl/
├── pcre/
├── site/
└── zlib/
```

![](images/openresty_phases.png)