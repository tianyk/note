---
title: Sharable Handler
author: tyk
date: 2018-05-24 17:05:59
tags:
- netty 
---

## @Sharable 

对于`@Sharable`文档里面是这样说明的
> 对于这种用法指在多个`ChannelPipeline`中共享同一个`ChannelHandler`，对应的`ChannelHandler`必须要使用`@Sharable`注解标注；否则，试图将它添加到多个`ChannelPipeline`时将会触发异常。

`@Sharable`其实就是一个`标识型的注解`，可以认为我们标识这个`ChannelHandler`是线程安全的。

下面例子中`ChannelInboundHandler1`是无状态的，`ChannelInboundHandler2`是有状态的。`ChannelInboundHandler1`天然是线程安全的，我们在多个`ChannelPipeline`使用同一个Handler示例就可以减少对象的频繁创建和垃圾回收。如果想在多个`ChannelPipeline`中共享`ChannelInboundHandler1`实例就要将其标注为`@Sharable`，否则需要每次都`new`一个新的实例。

``` java 
// 无状态
@ChannelHandler.Sharable
class ChannelInboundHandler1 extends ChannelInboundHandlerAdapter {
}

// 有状态
class ChannelInboundHandler2 extends ChannelInboundHandlerAdapter {
    private ChannelHandlerContext ctx;

    @Override
    public void handlerAdded(ChannelHandlerContext ctx) throws Exception {
        this.ctx = ctx;
    }
}

public class WebSocketChatServerInitializer extends ChannelInitializer<SocketChannel> { 
    private final ChannelInboundHandler1 channelInboundHandler1 =  new ChannelInboundHandler1();

    @Override
    public void initChannel(SocketChannel ch) throws Exception {
        ChannelPipeline pipeline = ch.pipeline();
        
        // channelInboundHandler1 线程安全的，多ChannelPipeline共享一个。
        pipeline.addLast("channelInboundHandler1", channelInboundHandler1);
        // channelInboundHandler1 非线程安全的，为每个ChannelPipeline都创建一个实例。
        pipeline.addLast("channelInboundHandler2", new ChannelInboundHandler2());
    }
}
```



