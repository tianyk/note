---
title: 部署全球CDN网络
author: tyk
date: 2018-07-04 22:49:21
tags:
---
## 部署全球CDN网络

我们现在除了大陆的还有美国及东南亚的用户，在国内可以使用[阿里](https://www.aliyun.com/product/cdn)或者[腾讯](https://cloud.tencent.com/product/cdn)的CDN服务。但是上面两家在国外的节点不是很多，而国外厂商有[Amazon CloudFront](https://aws.amazon.com/cloudfront/)和[Cloudflare](https://www.cloudflare.com/)在大陆地区的服务又不好。那有没有办法让一个域名大陆用户使用阿里的服务，国外的用户是用CloudFront服务呢？

答案是有的，我们知道现在主流的CDN都是采用CNAME的形式配置DNS。CNAME的核心就是智能DNS，那我们如果搭建一个DNS让它给国内外用户返回不同的CNAME不就解决了吗，也就是CDN的DNS。所幸，不用我们麻烦自己去搭建这个智能DNS，现在像阿里的云DNS和DNSPod都提供了比我们需求更强大的功能。下面是具体网络拓扑图：

![暂缺]()

### 具体操作
> 由于暂时没有Amazon CloudFront和Cloudflare账号，国外CDN我就用腾讯CDN模拟了。实际操作时将腾讯CDN换成Amazon CloudFront或Cloudflare即可。

1. 首先分别在阿里CDN和腾讯CDN开启服务

    阿里CDN：s.kekek.cc.w.kunlunar.com.
    ![阿里CDN](/images/cdn-cn-kekek.png)

    腾讯CDN：s.kekek.cc.cdn.dnsv1.com.
    ![腾讯CDN](/images/cdn-world-kekek.png)

2. 为域名配置智能DNS
    
    境外服务配置为腾讯DNS的CNAME，默认线路（境内）配置为阿里CDN的CNANME。
    ![](/images/dns-kekek.png)


下面我们测试一下线路：
1. 114dns
```
$ dig @114.114.114.114 s.kekek.cc CNAME

; <<>> DiG 9.10.6 <<>> @114.114.114.114 s.kekek.cc CNAME
; (1 server found)
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 41126
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 0

;; QUESTION SECTION:
;s.kekek.cc.			IN	CNAME

;; ANSWER SECTION:
s.kekek.cc.		600	IN	CNAME	s.kekek.cc.w.kunlunar.com.

;; Query time: 2735 msec
;; SERVER: 114.114.114.114#53(114.114.114.114)
;; WHEN: Wed Jul 04 23:28:47 CST 2018
;; MSG SIZE  rcvd: 67
```

2. Cloudflare DNS
    > 使用 1.1.1.1 DNS相当于模拟用户在境外进行DNS查询。

    ```
    $ dig @1.1.1.1 s.kekek.cc CNAME

    ; <<>> DiG 9.10.6 <<>> @1.1.1.1 s.kekek.cc CNAME
    ; (1 server found)
    ;; global options: +cmd
    ;; Got answer:
    ;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 5551
    ;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

    ;; OPT PSEUDOSECTION:
    ; EDNS: version: 0, flags:; udp: 1452
    ;; QUESTION SECTION:
    ;s.kekek.cc.			IN	CNAME

    ;; ANSWER SECTION:
    s.kekek.cc.		345	IN	CNAME	s.kekek.cc.cdn.dnsv1.com.

    ;; Query time: 320 msec
    ;; SERVER: 1.1.1.1#53(1.1.1.1)
    ;; WHEN: Wed Jul 04 23:27:39 CST 2018
    ;; MSG SIZE  rcvd: 77
    ```

可以看到我们我们使用114DNS时，返回的CNAME为`s.kekek.cc.w.kunlunar.com.`，对应的就是我们配置的阿里CDN。使用Cloudflare DNS是模拟海外用户得到的CNAME是`s.kekek.cc.cdn.dnsv1.com.`，这个刚好是我们腾讯的CDN。

现在我们境内用户访问[s.kekek.cc](http://ss.kekek.cc)时就可以使用阿里的CDN提供加速了，境外用户访问时就可以由腾讯CDN提供加速服务了。

### 国内外源站问题
对于国内外是否是用同一个源站，两者都可。可以根据实际情况去测试哪种更符合自身业务，从洛杉矶到上海的最小延迟在`180ms`左右，也就是说境外用户访问首次加载的新资源时会出现比较严重的延迟。如果对首次加载延迟太在意可以使用一个源站，如果**频繁**回源可考虑境内境外使用不同的源站。

使用不同源站时可以采用主动文件同步、[Nginx代理缓存](nginx-proxy-cache.html)等方案同步两个源站资源。
