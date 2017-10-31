<http://www.jfh.com/jfperiodical/article/949>

```
http {
    ...
    proxy_cache_path /usr/local/openresty/nginx/proxy_cache/ levels=1:2 keys_zone=my_cache:5m max_size=1g inactive=7d;
    ...
}

location / {
    ...
    proxy_cache my_cache;
    proxy_cache_revalidate on;
    proxy_cache_lock on;
    proxy_cache_use_stale error timeout http_500 http_502 http_503 http_504;
    proxy_cache_valid any 1d;
    ...
}

```
