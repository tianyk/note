<https://gist.github.com/tianyk/e50ba80444cd114962493589a9efd3fa>

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