---
title: Netty ChannelGroup 
author: tyk
date: 2018-06-06 10:33:01
tags:
---

## ChannelGroup 分析
`ChannelGroup` 用来管理一组 `Channel`，我们可以很方便的对一组 `Channel` 做同样的操作。从类图关系来看，`ChannelGroup`本质上还是一个`Set`。

![ChannelGroup](/images/channelgroup.png)

``` java 
ChannelGroup channels = new DefaultChannelGroup(GlobalEventExecutor.INSTANCE);
```
    
查看[DefaultChannelGroup](https://github.com/netty/netty/blob/4.1/transport/src/main/java/io/netty/channel/group/DefaultChannelGroup.java#L138)实现，我们添加`Channel`时都会注册一个事件，当`Channel`关闭后会自动把它从`ChannelGroup`删除掉。所以，我们只需要正常关闭`Channel`。

``` java 
private final ChannelFutureListener remover = new ChannelFutureListener() {
    @Override
    public void operationComplete(ChannelFuture future) throws Exception {
        remove(future.channel());
    }
};

@Override
public boolean add(Channel channel) {
    ... 
    boolean added = map.putIfAbsent(channel.id(), channel) == null;
    if (added) {
        channel.closeFuture().addListener(remover);
    }
    ... 
}
```

