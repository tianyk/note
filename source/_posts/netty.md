---
title: netty
date: 2018-04-25 19:11:29
updated: 2018-05-09 16:55:19
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


### Decoder 
解码器
- ByteToMessageDecoder
    用于将字节转化为消息。你不能确定远端是否会一次发送完一个完整的“信息”,因此这个类会缓存入站的数据,直到准备好了用于处理。
    ``` java 
    // Server
    public class IntegerServer {
        private final String host;
        private final int port;
        private static final Random random = new Random();

        public IntegerServer(String host, int port) {
            this.host = host;
            this.port = port;
        }

        static class IntServerHandler extends ChannelInboundHandlerAdapter {
            @Override
            public void channelActive(ChannelHandlerContext ctx) throws Exception {
                int w = random.nextInt();
                System.out.printf("write: %d\n", w);
                ctx.writeAndFlush(w).addListener(ChannelFutureListener.CLOSE);
            }
        }

        static class IntegerEncode extends MessageToByteEncoder<Integer> {
            @Override
            protected void encode(ChannelHandlerContext ctx, Integer msg, ByteBuf out) throws Exception {
                out.writeInt(msg);
            }
        }

        // in  ----->  IntServerHandler -------+
        //                                     |
        // out <------  IntegerEncode   <------+
        public void start() {
            EventLoopGroup bossEventLoop = new NioEventLoopGroup();
            EventLoopGroup workerEventLoop = new NioEventLoopGroup();
            try {
                ServerBootstrap server = new ServerBootstrap();
                server.group(bossEventLoop, workerEventLoop)
                        .channel(NioServerSocketChannel.class)
                        .childHandler(new ChannelInitializer<SocketChannel>() {
                            @Override
                            protected void initChannel(SocketChannel ch) throws Exception {
                                ch.pipeline().addFirst(new IntegerEncode(), new IntServerHandler());
                            }
                        })
                        .option(ChannelOption.SO_BACKLOG, 128)
                        .childOption(ChannelOption.SO_KEEPALIVE, true);

                try {
                    ChannelFuture f = server.bind(new InetSocketAddress(host, port)).sync();
                    f.channel().closeFuture().sync();
                } catch (InterruptedException ignored) {
                }

            } finally {
                bossEventLoop.shutdownGracefully();
                workerEventLoop.shutdownGracefully();
            }
        }

        public static void main(String[] args) {
            new IntegerServer("127.0.0.1", 8080).start();
        }
    }


    // Client
    public class IntegerClient {
        private final String host;
        private final int port;

        public IntegerClient(String host, int port) {
            this.host = host;
            this.port = port;
        }

        static class IntegerDecoder extends ByteToMessageDecoder {
            @Override
            protected void decode(ChannelHandlerContext ctx, ByteBuf in, List<Object> out) throws Exception {
                // int 32位 4个字节
                // 如果接受不到4个字节则持续接收
                if (in.readableBytes() < 4) return;

                // 如果buf中已经读到了4个或者超过4个字节就读取4个作为一个整体封装一下放到list中传给后面的handler
                //out.add(in.readBytes(4));
                out.add(in.readInt());
            }
        }

        static class IntegerClientHandler extends ChannelInboundHandlerAdapter {
            @Override
            public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
                int r = (int) msg;
                System.out.printf("read: %d\n", r);
            }
        }

        public void start() {
            EventLoopGroup worker = new NioEventLoopGroup();
            try {
                Bootstrap bootstrap = new Bootstrap();
                bootstrap.group(worker)
                        .channel(NioSocketChannel.class)
                        .handler(new ChannelInitializer<SocketChannel>() {
                            @Override
                            protected void initChannel(SocketChannel ch) throws Exception {
                                ch.pipeline().addFirst(new IntegerDecoder(), new IntegerClientHandler());
                            }
                        });

                ChannelFuture f = bootstrap.connect(new InetSocketAddress(host, port)).sync();
                f.channel().closeFuture().sync();
            } catch (InterruptedException ignored) {
            } finally {
                worker.shutdownGracefully();
            }
        }

        public static void main(String[] args) {
            new IntegerClient("127.0.0.1", 8080).start();
        }
    }
    ```
- ReplayingDecoder

- MessageToMessageDecoder

    