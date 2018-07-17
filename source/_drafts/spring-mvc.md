---
title: spring-mvc
author: tyk
date: 2018-07-11 11:16:29
tags:
---

1. DispatcherServlet 

    1. 负责`WebApplicationContext`的初始化
    2. SpringMVC请求入口

2. HandlerMapping  

    负责将Controller挂在到上面

    1. RequestMappingHandlerMapping

        处理`@RequestMapping`配置的

    2. BeanNameUrlHandlerMapping

        负责通过 xml 配置的

3. HandlerAdapter 

    具体处理请求的逻辑

4. HandlerMethodArgumentResolver

    解析handler参数的

5. HandlerMethodReturnValueHandler

    处理返回值的


