---
title: cdn.md
date: 2016-08-15 17:05:03
tags: cdn
---
### CDN原理
![](/images/QQ20160815-0@2x.png)

1. 用户向浏览器输入`images.frim-x.com`这个域名，浏览器第一次发现本地没有dns缓存，则向网站的DNS服务器请求。①
2. 网站的DNS域名解析器设置了`CNAME`，指向了`firm-x.cname.cdn.com`,请求指向了CDN网络中的智能DNS负载均衡系统。②
3. 智能CDN's DNS服务器，接收到请求之后，会根据用户IP找到最匹配的一项，并且计算距离这个用户最近的Edge服务器，将这个最优点的IP返回给用户。③④
5. 用户向该IP节点（CDN服务器）发出请求。由于是第一次访问，CDN服务器会向原web站点请求，并缓存内容。请求结果发给用户。⑤

这里的加速的核心点就是这个智能路由，它负责把用户引到最优的服务器。

百度CDN配置
- CloudFlare的CDN服务器

    可以看到最终解析出来的A地址有`103.235.46.39`和`103.235.46.40`两个（这两个地址都位于百度香港机房，可能和CloudFlare服务海外用户有关）。可以看出经过两级`CNAME`到最终的IP。

    ![](/images/dig-dns.png)

    ![](/images/dig-dns-cname.png)

    ![](/images/dig-dns-cname2.png)

- 114DNS

    114DNS最终解析到的地址是`180.149.132.151`和`180.149.131.98`，这两个就是北京的机房。

    ![](/images/dig-114-dns.png)
    