---
title: Netty编解码器
author: tyk
date: 2018-06-03 16:26:22
tags: netty
---

## Netty编解码器
编码和解码，或者数据从一种特定协议的格式到另一种格式的转换。这些任务将由通常称为编解码器的组件来处理。每个网络应用程序都必须定义如何解析在两个节点之间来回传输的原始字节，以及如何将其和目标应用程序的数据格式做相互转换。

例如[DNS](dns.html)服务，DNS服务器收到是字节流，我们收到字节流后要将其解码成DNS协议。
```
Header section format
                                1  1  1  1  1  1
  0  1  2  3  4  5  6  7  8  9  0  1  2  3  4  5
+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
|                      ID                       |
+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
|QR|   Opcode  |AA|TC|RD|RA|   Z    |   RCODE   |
+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
|                    QDCOUNT                    |
+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
|                    ANCOUNT                    |
+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
|                    NSCOUNT                    |
+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
|                    ARCOUNT                    |
+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
```

编码器是将消息转换为适合于传输的格式（最有可能的就是字节流）；而对应的解码器则是将网络字节流转换回应用程序的消息格式。编码器操作出站数据，而解码器处理入站数据。

### 解码器
由于你不可能知道远程节点是否会一次性地发送一个完整的消息，所以这个类会对入站数据进行缓冲，直到它准备好处理。例如上面DNS协议，协议头是96字节，但是我们一次读取时可能读到是80个字节或者100个字节，这就需要我们将读到的字节每96个分成一组。

因为解码器是负责将入站数据从一种格式转换到另一种格式的，所以Netty的解码器都实现了ChannelInboundHandler。

Netty提供下面两个不同用处的解码器：

- 将字节转解码为消息 -- ByteToMessageDecoder 和 ReplayingDecoder

    `ByteToMessageDecoder`是一个抽象类，我们需要实现其`decode`方法。
    
    ``` java 
    public class DNSDecoder extends ByteToMessageDecoder {
        // 将字节转换为pojo对象
        private DNSHeaderFrame decodeDNSHeaderFrame(ByteBuf msg) {
            DNSHeaderFrame header = new DNSHeaderFrame();

            header.setId(msg.readLong());

            long flags = msg.readLong();
            header.setQr((short) (flags >> 15));
            header.setOpcode((short) (flags & 0x7800 >> 11));
            header.setAa((short) (flags & 0x0400 >> 10));
            header.setTc((short) (flags & 0x0200 >> 9));
            header.setRd((short) (flags & 0x0100 >> 8));
            header.setRa((short) (flags & 0x0080 >> 7));
            header.setZero((short) (flags & 0x0070 >> 4));
            header.setRcode((short) (flags & 0x000f));

            header.setQdCount(msg.readLong());
            header.setAnCount(msg.readLong());
            header.setNsCount(msg.readLong());
            header.setArCount(msg.readLong());

            return header;
        }

        @Override
        protected void decode(ChannelHandlerContext ctx, ByteBuf in, List<Object> out) throws Exception {
            // 如果缓存区消息少于96字节先不处理
            // 读到的消息大于96字节后从缓冲区读出来96个字节重新封装成消息放到out中传给后面的handler
            if (in.readableBytes() >= 96) out.add(decodeDNSHeaderFrame(in.readBytes(96)));
        }
    }
    ```

    上面的例子中，我们要手动判断输入的ByteBuf是否具有足够的数据有点繁琐。下面我们使用`ReplayingDecode`，它可以让我们不必重复做这个事情。
    ``` Java
    public class DNSDecoder extends ReplayingDecoder<DNSHeaderFrame> {
        private DNSHeaderFrame decodeDNSHeaderFrame(ByteBuf msg) {
            ...
        }

        @Override
        protected void decode(ChannelHandlerContext ctx, ByteBuf in, List<Object> out) throws Exception {
            // 从ByteBuf中提取的头信息将会被添加到List中。
            // 如果没有足够的字节可用，这个readBytes(96)方法的实现将会抛出一个Error，其将在基类中被捕获并处理。
            // 当有更多的数据可供读取时，该decode()方法将会被再次调用。
            out.add(decodeDNSHeaderFrame(in.readBytes(96)));
        }
    }
    ```
    使用ReplayingDecoder时会稍慢于ByteToMessageDecoder。

- 将一种消息解码为另一种消息 -- MessageToMessageDecoder

    下面例子中讲Integer类型的消息转换成String类型，然后传递给下一个handler。
    
    ``` java
    public class IntegerToStringDecoder extends MessageToMessageDecoder<Integer> {
        @Override
        protected void decode(ChannelHandlerContext ctx, Integer msg, List<Object> out) throws Exception {
            out.add(String.valueOf(msg));
        }
    }
    ```


#### TooLongFrameException 

我们需要在字节可以解码之前在内存中缓冲它们。因此，不能让解码器缓冲大量的数据以至于耗尽可用的内存。为了解除这个常见的顾虑，Netty提供了`TooLongFrameException`类，如果缓冲区超出指定大小限制时（手动）抛出。如果你正在使用一个可变帧大小的协议，那么这种保护措施将是尤为重要的。

``` java 
public class SafeByteToMessageDecoder extends ByteToMessageDecoder {
　　private static final int MAX_FRAME_SIZE = 1024;
　　@Override
　　public void decode(ChannelHandlerContext ctx, ByteBuf in, List<Object> out) throws Exception {
        int readable = in.readableBytes();
        if (readable > MAX_FRAME_SIZE) {　// 检查缓冲区中是否有超过MAX_FRAME_SIZE个字节
        　　in.skipBytes(readable);　 // 跳过所有的可读字节，抛出TooLongFrame-Exception 并通知ChannelHandler
        　　throw new TooLongFrameException("Frame too big!");
        }
        // do something
        ...
　　}
}
```

### 编码器

- 将消息编码为字节 -- MessageToByteEncoder

    ``` java 
    public class IntegerToByteEncoder extends MessageToByteEncoder<Integer> {
        @Override
        protected void encode(ChannelHandlerContext ctx, Integer msg, ByteBuf out) throws Exception {
            out.writeInt(msg);
        }
    }
    ```

- 将消息编码为消息 -- MessageToMessageEncoder

### ByteToMessageCodec 和 MessageToMessageCodec
`ByteToMessageCodec`将字节编解码为消息，它结合了`ByteToMessageDecoder`以及它的逆向——`MessageToByteEncoder`。

``` java 
public class IntegerStringCodec extends ByteToMessageCodec<Integer> {
    @Override
    protected void encode(ChannelHandlerContext ctx, Integer msg, ByteBuf out) throws Exception {
       out.writeInt(msg); 
    }

    @Override
    protected void decode(ChannelHandlerContext ctx, ByteBuf in, List<Object> out) throws Exception {
        if (in.readableBytes() >= 4) out.add(in.readInt());
    }
}
```

### CombinedChannelDuplexHandler
`ByteToMessageCodec` 和 `MessageToMessageCodec` 将编解码逻辑在一个类中实现，有时候我们编解码可能在不同的类中，能不能提供一个组合的将编解码组合到一个类中呢？`CombinedChannelDuplexHandler`提供了这个解决方案。

``` java
public class IntegerByteCodec extends CombinedChannelDuplexHandler<ToIntegerDecoder, IntegerToByteEncoder> {
    public IntegerByteCodec() {
        super(new ToIntegerDecoder(), new IntegerToByteEncoder());
    }
}
```

### 参考
- [Netty实战](https://book.douban.com/subject/27038538/)