---
title: WebP
date: 2017-04-08 11:01:09
tags: 
---
## WebP

###  Can i use WebP
1. 根据accept请求头判断

    如果是Chrome浏览器它会在请求头`accept`中加入`image/webp`。
    ```
    accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8
    
    or 

    accept: image/webp,image/apng,image/*,*/*;q=0.8
    ```

2. 前端检测
    ``` JavaScript
    // check_webp_feature:
    //   'feature' can be one of 'lossy', 'lossless', 'alpha' or 'animation'.
    //   'callback(feature, result)' will be passed back the detection result (in an asynchronous way!)
    function check_webp_feature(feature, callback) {
        var kTestImages = {
            lossy: "UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",
            lossless: "UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==",
            alpha: "UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==",
            animation: "UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA"
        };
        var img = new Image();
        img.onload = function () {
            var result = (img.width > 0) && (img.height > 0);
            callback(feature, result);
        };
        img.onerror = function () {
            callback(feature, false);
        };
        img.src = "data:image/webp;base64," + kTestImages[feature];
    }
    ```

### 例子
如果使用了`内容协商`的方式返回了webp格式的图片，在使用CDN或缓存的情况我们需要在响应头加入[Vary](http-vary.html)字段来告诉该如何缓存。

``` nginx 
location ~ ^/webp/(.*)\.(jpg|png|gif)$ {
    set $filename    $1;
    # 判断是否支持webp及文件是否存在
    set $swebp       0; 

    # $swebp 第一位用来判断客户端是否支持webp
    if ($http_accept ~* "image\/webp") {
        set $swebp   1;
    }

    # $swebp 第二位用来判断对应的webp文件是否存在
    if (-f "${document_root}/webp/${filename}.webp") {
        set $swebp   "${swebp}1";
    }

    if ($swebp = "11") {
        # add_header Vary   "Accept,Content-Type";
        # add_header Vary   "Content-Type";
        add_header   Vary   Accept;
        rewrite ^ /webp/${filename}.webp break;
    }
}
```

访问 <http://example.kekek.cc/webp/2018-FIFA-World-Cup.png> 查看

下面两幅图分别为在Chrome和Firefox浏览器中访问的响应：
**Chrome**
![Chrome WebP](/images/webp-chrome.png)

**Firefox**
![Firefox WebP](/images/webp-firefox.png)

### 参考
- [What is WebP? Why should I use it?](https://developers.google.com/speed/webp/faq) 
- [美团在webp方面的实践](http://zmx.im/blog?bname=webp) 
- [WEBP是什么呢？](http://www.btorange.com/2013/06/14/webp.html) 
- [扒一扒“WEBP格式”的图片](http://blog.csdn.net/u013063153/article/details/52677737) 
- [WebP Support – It’s More Than You Think](https://optimus.keycdn.com/support/webp-support/)
