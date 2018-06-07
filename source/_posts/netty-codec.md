---
title: Netty编解码器
author: tyk
tags: netty
date: 2018-06-03 16:26:22
---



## Netty编解码器
编码和解码，或者数据从一种特定协议的格式到另一种格式的转换。这些任务将由通常称为编解码器的组件来处理。每个网络应用程序都必须定义如何解析在两个节点之间来回传输的原始字节，以及如何将其和目标应用程序的数据格式做相互转换。

例如[WebSocket](websocket.html)服务，WebSocket服务器收到是字节流，我们收到字节流后要将其解码成WebSocket消息。
```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-------+-+-------------+-------------------------------+
|F|R|R|R| opcode|M| Payload len |    Extended payload length    |
|I|S|S|S|  (4)  |A|     (7)     |             (16/64)           |
|N|V|V|V|       |S|             |   (if payload len==126/127)   |
| |1|2|3|       |K|             |                               |
+-+-+-+-+-------+-+-------------+ - - - - - - - - - - - - - - - +
|     Extended payload length continued, if payload len == 127  |
+ - - - - - - - - - - - - - - - +-------------------------------+
|                               |Masking-key, if MASK set to 1  |
+-------------------------------+-------------------------------+
| Masking-key (continued)       |          Payload Data         |
+-------------------------------- - - - - - - - - - - - - - - - +
:                     Payload Data continued ...                :
+ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +
|                     Payload Data continued ...                |
+---------------------------------------------------------------+
```

编码器是将消息转换为适合于传输的格式（最有可能的就是字节流）；而对应的解码器则是将网络字节流转换回应用程序的消息格式。编码器操作出站数据，而解码器处理入站数据。

### 解码器
因为解码器是负责将入站数据从一种格式转换到另一种格式的，所以Netty的解码器都实现了`ChannelInboundHandler`。

Netty提供下面两个不同用处的解码器：

- 将字节转解码为消息 -- ByteToMessageDecoder 和 ReplayingDecoder

    `ByteToMessageDecoder`是一个抽象类，我们需要实现其`decode`方法。
    
    由于你不可能知道远程节点是否会一次性地发送一个完整的消息，所以这个类会对入站数据进行缓冲，直到有足够的数据准备好处理。
    
    ``` java 
    public class ToIntegerDecoder extends ByteToMessageDecoder {
        @Override
        protected void decode(ChannelHandlerContext ctx, ByteBuf in, List<Object> out) throws Exception {
            if (in.readableBytes() >= 4) out.add(in.readInt());
        }
    }
    ```

    上面的例子中，我们要手动判断输入的ByteBuf是否具有足够的数据有点繁琐。下面我们使用`ReplayingDecode`，它可以让我们不必重复做这个事情。
    ``` java
    public class ToIntegerDecoder extends ReplayingDecoder<Integer> {
        @Override
        protected void decode(ChannelHandlerContext ctx, ByteBuf in, List<Object> out) throws Exception {
            out.add(in.readInt());
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

> 注意：每次调用`decode`方法后即没新message产生缓冲区也无变化，缓存区数据将在下一轮`channelRead`事件触发后处理。原因也很好理解，如果一次`decoder`后没新message产生也没缓存消耗，再执行一次`decoder`将还是同样的结果（所有条件都没变化），处理不好这会造成死循环。[代码32行](https://github.com/netty/netty/blob/4.1/codec/src/main/java/io/netty/handler/codec/ByteToMessageDecoder.java#L438)

``` java 
protected void callDecode(ChannelHandlerContext ctx, ByteBuf in, List<Object> out) {
    try {
        while (in.isReadable()) {
            int outSize = out.size();

            if (outSize > 0) {
                fireChannelRead(ctx, out, outSize);
                out.clear();

                // Check if this handler was removed before continuing with decoding.
                // If it was removed, it is not safe to continue to operate on the buffer.
                //
                // See:
                // - https://github.com/netty/netty/issues/4635
                if (ctx.isRemoved()) {
                    break;
                }
                outSize = 0;
            }

            int oldInputLength = in.readableBytes();
            decodeRemovalReentryProtection(ctx, in, out);

            // Check if this handler was removed before continuing the loop.
            // If it was removed, it is not safe to continue to operate on the buffer.
            //
            // See https://github.com/netty/netty/issues/1664
            if (ctx.isRemoved()) {
                break;
            }

            if (outSize == out.size()) {
                if (oldInputLength == in.readableBytes()) {
                    break;
                } else {
                    continue;
                }
            }

            if (oldInputLength == in.readableBytes()) {
                throw new DecoderException(
                        StringUtil.simpleClassName(getClass()) +
                                ".decode() did not read anything but decoded a message.");
            }

            if (isSingleDecode()) {
                break;
            }
        }
    } catch (DecoderException e) {
        throw e;
    } catch (Exception cause) {
        throw new DecoderException(cause);
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

#### WebSocketFrameDecoder 

解析WebSocket消息协议示例

``` java
public class WebSocketFrameDecoder extends ByteToMessageDecoder {
    private static final short MAX_FRAME_SIZE = 1024 * 10; // 10kb

    private static final byte READ_HEADER = 1;
    private static final byte READ_EXT_PAYLOAD_LEN_16 = 2;
    private static final byte READ_EXT_PAYLOAD_LEN_64 = 4;
    private static final byte READ_MASK_KEY = 8;
    private static final byte READ_PAYLOAD = 16;

    private byte STATE = READ_HEADER;

    // frame
    private byte fin;
    private byte opcode;
    private byte mask;
    private long payloadLen;
    // 无符号byte
    private short[] maskKey = new short[4];
    private byte[] payload;

    private void reset() {
        STATE = READ_HEADER;
    }

    @Override
    protected void decode(ChannelHandlerContext ctx, ByteBuf in, List<Object> out) throws Exception {
        if (STATE == READ_HEADER) {
            if (in.readableBytes() < 2) return;
            int header = in.readUnsignedShort();
            fin = (byte) (header >> 15);
            opcode = (byte) (header & 0b0000111100000000 >> 8);
            mask = (byte) ((header & 0b0000000010000000) >> 7);
            payloadLen = header & 0b0000000001111111;

            if (payloadLen == 127) STATE = READ_EXT_PAYLOAD_LEN_64;
            else if (payloadLen == 126) STATE = READ_EXT_PAYLOAD_LEN_16;
            else STATE = READ_MASK_KEY;
        } else if (STATE == READ_EXT_PAYLOAD_LEN_16) {
            if (in.readableBytes() < 2) return;
            payloadLen = in.readUnsignedShort();

            STATE = READ_MASK_KEY;
        } else if (STATE == READ_EXT_PAYLOAD_LEN_64) {
            if (in.readableBytes() < 8) return;
            // 协议规定64位时最高有效位必须是0
            payloadLen = in.readLong();

            STATE = READ_MASK_KEY;
        } else if (STATE == READ_MASK_KEY) {
            if (mask == 1) {
                if (in.readableBytes() < 4) return;

                maskKey[0] = in.readUnsignedByte();
                maskKey[1] = in.readUnsignedByte();
                maskKey[2] = in.readUnsignedByte();
                maskKey[3] = in.readUnsignedByte();
            }
            STATE = READ_PAYLOAD;
        } else if (STATE == READ_PAYLOAD) {
            if (payloadLen > MAX_FRAME_SIZE) {
                //bad frame. you should close the channel.
                in.skipBytes(in.readableBytes());
                throw new TooLongFrameException("Frame too big!");
            }

            if (in.readableBytes() < payloadLen) return;

            payload = new byte[(int) payloadLen];
            int pos = 0;
            while (in.isReadable() && payloadLen > 0) {
                payload[pos] = (byte) (in.readByte() ^ maskKey[pos % 4]);
                pos++;
                payloadLen--;
            }

            out.add(new WebSocketFrame(fin, opcode, mask, payload.length, maskKey, payload));
            reset(); // next frame
        }
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