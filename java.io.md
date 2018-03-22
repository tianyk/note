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