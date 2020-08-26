---
title: cookie-samesite
author: tyk
date: 2020-07-24 17:25:29
tags:
---

Chrome 80 开始 Cookie SameSite 属性默认为`Lax`，可能会导致部分**跨站**的请求丢失Cookie ( withCredentials 也无效）

![cooke-samesite](/images/cookie-samesite.png)
![cooke-samesite-warning](/images/cookie-samesite-warning.png)