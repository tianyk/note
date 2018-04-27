### ByteBuffer
[ByteBuffer](https://my.oschina.net/flashsword/blog/159613) 可以在堆外分配内存，减少垃圾回收。

``` java 
ByteBuffer byteBuffer = ByteBuffer.allocateDirect(100);
System.out.printf("capacity: %d, position: %d, limit: %d\n", byteBuffer.capacity(), byteBuffer.position(), byteBuffer.limit());
byteBuffer.putInt(1);
System.out.printf("putInt capacity: %d, position: %d, limit: %d\n", byteBuffer.capacity(), byteBuffer.position(), byteBuffer.limit());
byteBuffer.putLong(1);
System.out.printf("putLong capacity: %d, position: %d, limit: %d\n", byteBuffer.capacity(), byteBuffer.position(), byteBuffer.limit());
byteBuffer.flip();
System.out.printf("flip capacity: %d, position: %d, limit: %d\n", byteBuffer.capacity(), byteBuffer.position(), byteBuffer.limit());
byteBuffer.getInt();
System.out.printf("getInt capacity: %d, position: %d, limit: %d\n", byteBuffer.capacity(), byteBuffer.position(), byteBuffer.limit());
byteBuffer.getLong();
System.out.printf("getLong capacity: %d, position: %d, limit: %d\n", byteBuffer.capacity(), byteBuffer.position(), byteBuffer.limit());
byteBuffer.limit(byteBuffer.capacity());
System.out.printf("resetLimit capacity: %d, position: %d, limit: %d\n", byteBuffer.capacity(), byteBuffer.position(), byteBuffer.limit());
byteBuffer.put((byte) 127);
System.out.printf("putByte capacity: %d, position: %d, limit: %d\n", byteBuffer.capacity(), byteBuffer.position(), byteBuffer.limit());
byteBuffer.mark();
System.out.printf("mark capacity: %d, position: %d, limit: %d\n", byteBuffer.capacity(), byteBuffer.position(), byteBuffer.limit());
byteBuffer.putInt(1);
System.out.printf("putInt capacity: %d, position: %d, limit: %d\n", byteBuffer.capacity(), byteBuffer.position(), byteBuffer.limit());
byteBuffer.reset();
System.out.printf("reset capacity: %d, position: %d, limit: %d\n", byteBuffer.capacity(), byteBuffer.position(), byteBuffer.limit());
byteBuffer.clear();
System.out.printf("clear capacity: %d, position: %d, limit: %d\n", byteBuffer.capacity(), byteBuffer.position(), byteBuffer.limit());
byteBuffer.position(13);
System.out.printf("resetPosition capacity: %d, position: %d, limit: %d\n", byteBuffer.capacity(), byteBuffer.position(), byteBuffer.limit());
byteBuffer.flip();
System.out.printf("flip capacity: %d, position: %d, limit: %d\n", byteBuffer.capacity(), byteBuffer.position(), byteBuffer.limit());
System.out.println(byteBuffer.arrayOffset());
byteBuffer.remaining(); // return limit - position;
byteBuffer.hasRemaining(); // return position < limit;
if (byteBuffer.hasRemaining()) byteBuffer.get();

//byteBuffer.mark();
//byteBuffer.flip();
//byteBuffer.getInt();
//if (byteBuffer.position() < byteBuffer.limit())
//    byteBuffer.getInt();
//System.out.println(byteBuffer.position());
```

#### ByteBuffer vs ByteBuf（Netty）
[Netty ByteBuf和Nio ByteBuffer](http://blog.csdn.net/jeffleo/article/details/69230112)

### Channel 

``` java 
// Files.copy(Paths.get(args[0]), Paths.get(args[1]));

try (FileChannel read = FileChannel.open(Paths.get(args[0]));
        FileChannel write = FileChannel.open(Paths.get(args[1]), CREATE, TRUNCATE_EXISTING, WRITE);) {

    ByteBuffer buffer = ByteBuffer.allocateDirect(1024 * 10);
    while (-1 != read.read(buffer)) {
        buffer.flip();
        write.write(buffer);
        buffer.clear();
    }
}
```


### ECHO
- 传统IO

    ``` java 
    public class OIOEchoServer {
        private final String host;
        private final int port;
        private final int poolSize;
        private final ExecutorService executor;

        public OIOEchoServer(String host, int port) {
            this(host, port, Runtime.getRuntime().availableProcessors());
        }

        public OIOEchoServer(String host, int port, int poolSize) {
            this.host = host;
            this.port = port;
            this.poolSize = poolSize;

            this.executor = Executors.newFixedThreadPool(poolSize);
        }

        static class EchoHandler implements Runnable {
            private final Socket socket;

            public EchoHandler(Socket socket) {
                this.socket = socket;
            }

            @Override
            public void run() {
                try (InputStream in = socket.getInputStream(); OutputStream out = socket.getOutputStream();){
                    byte[] buffer = new byte[1024];
                    int read = 0;
                    while (-1 != (read = in.read(buffer))) {
                        out.write(buffer, 0, read);
                    }
                } catch (IOException ignored) { }
            }
        }

        public void start() {
            try (ServerSocket server = new ServerSocket()) {
                server.bind(new InetSocketAddress(host, port));
                
                // accept 阻塞 SO_TIMEOUT 2000ms
                //server.setSoTimeout(2000);

                while (true) {
                    try {
                        Socket socket = server.accept();
                        executor.submit(new EchoHandler(socket));
                    } catch (SocketTimeoutException ignored) {
                        System.out.println("timeout");
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        public static void main(String[] args) {
            new OIOEchoServer("127.0.0.1", 8080).start();
        }
    }
    ```

- NIO 

    ![](images/nio-selector.png)

    ``` java 
    public class NIOEchoServer {
        private final String host;
        private final int port;
        private volatile boolean shutdown = false;

        public NIOEchoServer(String host, int port) {
            this.host = host;
            this.port = port;
        }

        public void shutdown() {
            System.out.println("shutdown");
            shutdown = true;
        }

        public void start() {
            try (ServerSocketChannel server = ServerSocketChannel.open();
                Selector selector = Selector.open();) {
                server.bind(new InetSocketAddress(host, port));
                server.configureBlocking(false);

                // 第二个参数是感兴趣的事件，默认常量有4个（连接、接受、读、写），
                // 定义在SelectionKey类中，但并不是所有Channel都一定支持，可以用validOps()判断。
                // ServerSocketChannel 默认只支持 {@link SelectionKey#OP_ACCEPT} 事件
                server.register(selector, SelectionKey.OP_ACCEPT);

                // 主循环 主循环阻塞会影响后面所有事件
                while (!shutdown) {
                    System.out.println(Thread.currentThread().isInterrupted());
                    if (0 == selector.select(2000)) continue;

                    // try...catch
                    Iterator<SelectionKey> keys = selector.selectedKeys().iterator();
                    while (keys.hasNext()) {
                        SelectionKey key = keys.next();
                        keys.remove();
                        if (!key.isValid()) continue;

                        // 客户端发起连接
                        if (key.isValid() && key.isConnectable()) {
                            //System.out.println("connect");
                        }

                        // 服务器接收连接
                        if (key.isValid() && key.isAcceptable()) {
                            //System.out.println("accept");
                            ServerSocketChannel serverChannel = (ServerSocketChannel) key.channel();
                            SocketChannel socket = serverChannel.accept();
                            socket.configureBlocking(false);
                            // 共用同一个selector
                            socket.register(selector, SelectionKey.OP_CONNECT | SelectionKey.OP_READ | SelectionKey.OP_WRITE);
                        }

                        if (key.isValid() && key.isReadable()) {
                            //System.out.println("read");
                            SocketChannel socket = (SocketChannel) key.channel();

                            ByteBuffer buffer = ByteBuffer.allocateDirect(1024);
                            // 0 or -1
                            while (socket.read(buffer) > 0) {
                                buffer.flip();
                                if (key.isWritable()) socket.write(buffer);
                                buffer.clear();
                            }
                            socket.close();
                        }

                        if (key.isValid() && key.isWritable()) {
                            //System.out.println("write");
                        }
                    }
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        public static void main(String[] args) {
            new NIOEchoServer("127.0.0.1", 8080).start();
        }
    }
    ```

- NIO2

    ``` java
    public class NIO2EchoServer {
        private final String host;
        private final int port;

        public NIO2EchoServer(String host, int port) {
            this.host = host;
            this.port = port;
        }

        public void start() {
            try {
                AsynchronousChannelGroup group = AsynchronousChannelGroup.withThreadPool(Executors.newCachedThreadPool());
                AsynchronousServerSocketChannel server = AsynchronousServerSocketChannel.open(group).bind(new InetSocketAddress(host, 8080));

                // 复用ServerAcceptCompletionHandler，避免创建过多对象。
                ServerAcceptCompletionHandler serverHandler = new ServerAcceptCompletionHandler();
                server.accept(server, serverHandler);
                group.awaitTermination(Long.MAX_VALUE, TimeUnit.SECONDS);
            } catch (IOException e) {
                e.printStackTrace();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

        }

        static class ClientReadCompletionHandler implements CompletionHandler<Integer, AsynchronousSocketChannel> {
            private final ByteBuffer buffer;

            public ClientReadCompletionHandler(int bufferCapacity) {
                this.buffer = ByteBuffer.allocateDirect(bufferCapacity);
            }

            public ByteBuffer getBuffer() {
                return buffer;
            }

            @Override
            public void completed(Integer read, final AsynchronousSocketChannel socket) {
                buffer.flip();

                // 错误示例：
                // write 是非阻塞的，我们不能想当然认为后面的buffer.clear后于write执行。
                // 如果先于write执行，那么write时将无数据可写。
                // socket.write(buffer);
                // buffer.clear();
                // socket.read(buffer, socket, this);

                // ClientWriteCompletionHandler
                socket.write(buffer, socket, new CompletionHandler<Integer, AsynchronousSocketChannel>() {
                    @Override
                    public void completed(Integer write, AsynchronousSocketChannel socket) {
                        buffer.clear();
                        socket.read(buffer, socket, ClientReadCompletionHandler.this);
                    }

                    @Override
                    public void failed(Throwable exc, AsynchronousSocketChannel socket) {
                    }
                });
            }

            @Override
            public void failed(Throwable exc, AsynchronousSocketChannel attachment) {

            }
        }

        static class ServerAcceptCompletionHandler implements CompletionHandler<AsynchronousSocketChannel, AsynchronousServerSocketChannel> {
            @Override
            public void completed(AsynchronousSocketChannel socket, AsynchronousServerSocketChannel server) {
                // 开始监听新的请求，回调处理有ServerCompletionHandler处理
                server.accept(server, this);

                // 开始读数据，读到的数据有ClientCompletionHandler处理
                ClientReadCompletionHandler clientHandler = new ClientReadCompletionHandler(3);
                socket.read(clientHandler.getBuffer(), socket, clientHandler);
            }

            @Override
            public void failed(Throwable exc, AsynchronousServerSocketChannel server) {
                System.out.println("fail");
            }
        }

        public static void main(String[] args) throws IOException, InterruptedException {
            new NIO2EchoServer("127.0.0.1", 8080).start();
        }
    }
    ```


Mina、Netty、Grizzly