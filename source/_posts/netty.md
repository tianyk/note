---
title: netty
date: 2018-04-25 19:11:29
tags: 
---
## Netty

![](/images/netty-components.png)

![](/images/ChannelFuture.png)

- Bootstrap

    启动引导类。
    
    - ServerBootstrap

        用于服务器端。

    - Bootstrap 

        用于客户端。

- Channel

    可以看做是一个`Socket`或者NIO中的一个`Channel`。提供了bind, close, config, connect, isActive, isOpen, isWritable, read, write大量操作方法。

- ChannelHandler

    真正处理数据的类。ChannelHandler有两种ChannelInboundHandler（入站）和ChannelOutboundHandler（出站）


    - ChannelInboundHandler 
    
        处理进站数据和所有状态更改事件

    - ChannelOutboundHandler 
        
        处理出站数据，允许拦截各种操作

- ChannelPipeline

    ChannelHandler链条。数据从一个ChannelHandler流向另外一个。

- EventLoop

    类似NIO中的`Selector`。

- ChannelFuture

    Netty中所有的操作都是异步的，操作结果我们只能从`ChannelFuture`获取。


