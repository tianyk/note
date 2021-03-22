---
title: 用OpenResty实现统一登录系统
author: tyk
date: 2018-05-07 11:13:47
tags: 
- openresty
- sso
---

## OpenResty统一登录系统

一个大的系统往往会有多个子系统组成，要实现用户在多个系统间只有切换，我们往往需要一个统一的登录权限系统或者一个统一的规则。

大多数系统前置都会使用`Nginx`做负载或者分发，如果我们把登录这块抽取出来放到`Nginx`里面下层的子系统就不需要都去处理这方面的问题了。这样整个系统更加统一清晰、子系统只需要关注自身业务即可。

### 设计及实现

![](/images/openresty-sso.jpg)

这里可以使用[JWT](https://jwt.io/)来实现`TOKEN`，登录成功后将`TOKEN`写入`Cookie`中。发起请求时先从`Cookie`中获取`TOKEN`然后校验，校验成功后将`TOKEN`解析后的内容追加到Cookie中再向后面的业务系统分发。

``` lua 
-- sso.lua 
-- TODO 

```
