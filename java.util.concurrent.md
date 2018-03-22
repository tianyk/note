## 并发编程
多线程在多核心机器中能减少资源浪费，充分利用多核性能。在单核心机器中能提高吞吐率。

`内存屏蔽`和`指令重排`是编发编程中出现问题的原因所在。Java内存模型分为`主内存`和`工作内存`两部分。JMM规定，线程写值时只能写到`工作内存`，不能直接写到`主内存`。JVM定期将`工作内存`的值刷会主内存。同样，读取`共享变量`的值时只能从`工作内存`中读取，`工作内存`不能直接读取`主内存`。
``` java
public class NoViisibility {
    private static boolean ready;
    private static int number;

    private static class ReaderThread extends Thread {
        @Override
        public void run() {
            while (!ready) Thread.yield();
            System.out.println(number);
        }
    }

    public static void main(String[] args) {
        /*
         * 由于指令重排，下面三行代码可能会以任意顺序执行。指令重排的前提是不会影响逻辑正确性。
         * 由于内存屏蔽，修改number、ready的值后子线程不一定能获取到最新的值。
         * 可能出现的结果：
         * 1. 由于读取不到number的值可能一直循环下去 （由于指令重排，此时的值可能是42也可能是0）
         * 2. 读取到了number输出是0
         * 3. 输出42
         * 注意：单线程环境下指令重排也会有，因为每次读取的都是线程内缓存所以不会出现读不到最新值的情况。
         */
        new ReaderThread().start();
        number = 42;
        ready = true;
    }
}
```

### 并发与同步
并发程序可以并行执行任务也可以串行来执行。并发是去同时应对多个任务，并行是同时去做多种任务。

并发在同时应对多种任务时，需要去处理同步的问题。

### 线程

#### 中断
`interrupted` 是一种协商机制，中断机制是一种协作机制，也就是说通过中断并不能直接终止另一个线程，而需要被中断的线程自己处理中断。可以理解为一种类似`kill -n`的信号。`interrupt`信号是通知线程应该中断了，具体到底中断还是继续运行，应该由被通知的线程自己处理。

- public void interrupt()

    + 将调用者线程的中断状态设为true。
    + 被通知中断的线程在阻塞时，会抛出`InterruptedException`异常，同时**将中断状态修改为false**。

- public boolean isInterrupted() 

    + 判断调用者线程的中断状态。
    
    ``` java 
    public boolean isInterrupted() {
        return isInterrupted(false);
    }
    ```

- public static boolean interrupted()

    + 返回当前线程的中断状态
    + 将当前线程的中断状态设为false
    
    ``` java
    /**
    * Tests if some Thread has been interrupted.  The interrupted state
    * is reset or not based on the value of ClearInterrupted that is
    * passed.
    * @param ClearInterrupted 是否清除中断状态
    * 清除中断状态
    */
    private native boolean isInterrupted(boolean ClearInterrupted);

    public static boolean interrupted() {
        return currentThread().isInterrupted(true);
    }
    ```

    ``` java 
    public class Interrupted {
        public static void main(String[] args) throws InterruptedException {
            Thread t = new Thread(() -> {
                // 中断后结束循环
                while (!Thread.currentThread().isInterrupted()) {
                    System.out.println(".");
                }

                // 重置中断状态，置线程状态为未中断。不然后续sleep报错
                Thread.interrupted();

                try {
                    Thread.sleep(4000);
                } catch (InterruptedException e) {
                    // 恢复中断 置线程状态为中断
                    Thread.currentThread().interrupt();
                }
            });

            t.start();

            Thread.sleep(4);
            // 中断线程
            t.interrupt();

            System.out.println(t.isInterrupted());
            System.out.println(t.isInterrupted());
            System.out.println(t.isInterrupted());
        }
    }
    ```

#### 中断任务
可中断任务
``` java 
try {
    Thread.sleep(1000);
} catch (InterruptedException ignore) {
    // 恢复中断状态
    Thread.currentThread.interrupt();
}
```

不可中断非阻塞任务
``` java 
while (!Thread.currentThread().isInterrupted()) {
    System.out.println(".");
}
```

不可中断阻塞任务
``` java 
public class SocketThread extends Thread {
    private Socket socket;

    public SocketThread(Socket socket) {
        this.socket = socket;
    }

    /**
     * 处理中断
     * 关闭socket触发IOException
     */
    @Override
    public void interrupt() {
        try {
            socket.close();
        } catch (IOException ignore) {
        } finally {
            super.interrupt();
        }
    }

    @Override
    public void run() {
        try (ReadableByteChannel channel = Channels.newChannel(socket.getInputStream())) {
            ByteBuffer buffer = ByteBuffer.allocateDirect(1024 * 10);

            while (-1 != channel.read(buffer)) {
                buffer.flip();
                // write
                buffer.clear();
            }

        } catch (IOException ignore) {
            // socket.close() 触发 IOException 线程退出
        }
    }
}
```

#### Shutdown Hook
JVM在退出前会首先调用所有注册的关闭钩子。JVM不保证调用顺序，钩子必须是线程安全的。我们在钩子里面可以做清理工作。钩子应当尽快退出，它会延迟JVM结束时间。
``` java 
Runtime.getRuntime().addShutdownHook(new Thread(() -> {
    // 清理工作
    System.out.println("exit");
}));
```

### 同步工具
#### 同步容器 
- Vector
- HashTable 
- Collections.synchronized(Collection|List|Map|Set|SortMap|SortSet)
    
    以上同步容器主要将实际容器封闭在同步容器内部，通过同一把锁（同步容器本身）保护对对象的所有访问。这种方式最重要的一点是防止被封闭的对象逸出。

#### 并发容器
- CopyOnWriteArrayList
- ConcurrentHashMap

#### 队列 
Queue、Deque

#### 同步工具类
- CountDownLatch

    + 确保某个计算在其需要的所有资源都被初始化之后才继续执行。
    + 确保某个服务在其所依赖的其它所有服务都启动后才启动。
    + 等待知道某个动作的所有参与者都就绪再继续执行。
    
    ``` java 
    /**
    * 模拟田径比赛
    */
    public class Track {
        public static void main(String[] args) throws InterruptedException {
            // 发令枪
            CountDownLatch startingGun = new CountDownLatch(1);
            Random random  = new Random();

            for (int i = 0; i < 5; i++) {
                // runner code
                final int number = i;

                // runner
                new Thread(() -> {
                    long start = 0;
                    System.out.printf("Runner-%d 准备好了\n", number);
                    try {
                        startingGun.await(); // 所有线程到这里开始等待一起执行
                        start = System.currentTimeMillis();

                        // 随机跑步时间
                        Thread.sleep(random.nextInt(1000));
                    } catch (InterruptedException ignore) { }

                    System.out.printf("Runner-%d 用时：%d ms\n", number, System.currentTimeMillis() - start);
                }).start();
            }

            Thread.sleep(1000);
            startingGun.countDown(); // startingGun 
        }
    }
    ```

- FutureTask    
    
    多个耗时的任务可以异步执行，通过`get`拿到执行后的结果。任务只会执行一次。
    
    ``` java 
    public class FutureTaskTest {
        public static void main(String[] args) {
            Random random = new Random();
            Callable<Integer> callable = () -> {
                // 模拟计算耗时
                Thread.sleep(random.nextInt(1000));
                // 返回结果
                return random.nextInt(10);
            };

            FutureTask<Integer> queryOne = new FutureTask<>(callable);
            FutureTask<Integer> queryTwo = new FutureTask<>(callable);

            try {
                new Thread(queryOne).start();
                new Thread(queryTwo).start();
                
                int revOne = queryOne.get();
                int revTwo = queryTwo.get();
                System.out.printf("%d + %d = %d\n", revOne, revTwo, revOne + revTwo);
                System.out.println(queryOne.get() + queryTwo.get());
            } catch (InterruptedException ignore) {
                //e.printStackTrace();
            } catch (ExecutionException e) {
                Throwable cause = e.getCause();
                //if (cause instanceof ) {
                //
                //} else {
                //
                //}
            }
        }
    }
    ```

- Semaphore    

    Semaphore中管理者一组虚拟的许可证，许可证的数量通过构造函数指定。获得操作前只有获得许可证后才能继续执行，执行结束后释放许可证。常用于连接池等类似的场景。
    
    ``` java 
    /**
    * 模拟银行窗口
    */
    public class BankWindow {
        public static void main(String[] args) {
            Random random = new Random();
            // 共六个窗口工作
            Semaphore window = new Semaphore(6);

            // 共20个顾客在排队办理
            for (int i = 0; i < 20; i++) {
                final int number = i;
                new Thread(() -> {
                    try {
                        System.out.printf("顾客%d等待中..\n", number);
                        window.acquire(); // 获得一个牌
                        System.out.printf("开始为顾客%d办理业务\n", number);
                        Thread.sleep(random.nextInt(1000));
                        System.out.printf("顾客%d办理完成\n", number);
                    } catch (InterruptedException ignore) {
                    } finally {
                        window.release(); // 归还牌 
                    }
                }).start();
            }
        }
    }
    ```

- Barrier 
    
    同`CountDownLatch`不同的地方是`CyclicBarrier`是先干后集合，而`CountDownLatch`一般是先集合后开始干。

    ``` java 
    /**
    * 模拟银行金库。
    * 金库大门共三把锁，分别有三个经理拿着钥匙。
    * 只有三个经理人都开锁时，金库大门才会开。
    */
    public class BankVault {
        public static void main(String[] args) {
            Random random = new Random();
            int lockNumber = 3;
            // 保险库大门有三把锁
            CyclicBarrier bankVaultDoor = new CyclicBarrier(lockNumber, () -> {
                System.out.println("大门已开");
            });

            for (int i = 0; i < lockNumber; i++) {
                final int number = i;
                // 经理人
                new Thread(() -> {
                    try {
                        System.out.printf("经理%d开始开锁\n", number);
                        // 模拟每个经理人的开锁时间
                        Thread.sleep(random.nextInt(1000));

                        System.out.printf("经理%d开始开锁完成\n", number);
                        // 开锁
                        bankVaultDoor.await();
                    } catch (InterruptedException ignore) {
                    } catch (BrokenBarrierException e) {
                        //await中断
                    }
                }).start();
            }
        }
    }
    ```

### 锁

- 内置锁 

### 线程池
- ThreadPoolExecutor
    + corePoolSize 初始线程池大小
    + maximumPoolSize 最大线程池大小
    + keepAliveTime 不活动线程存活时间
    + workQueue 任务缓冲队列
    + threadFactory 创建工作线程的工厂，特殊情况下我们需要定制我们的工作线程。
    
    工作线程满了后新任务可以放到队列中，队列分为有界队列和无界。使用无界队列在工作线程处理不及时时可能会出现排队任务太多，内存溢出情况。

    使用有界队列时，如果队列满了以后有不同的`饱和策略`来处理。
    
    ``` java 
    ThreadPoolExecutor executorService = new ThreadPoolExecutor(1, 3, 60, TimeUnit.SECONDS, new ArrayBlockingQueue<Runnable>(5));
    //executorService.setRejectedExecutionHandler(new ThreadPoolExecutor.DiscardPolicy());
    //executorService.setRejectedExecutionHandler(new ThreadPoolExecutor.DiscardOldestPolicy());
    //executorService.setRejectedExecutionHandler(new ThreadPoolExecutor.AbortPolicy());
    executorService.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());

    for (int i = 0; i < 15; i++) {
        Thread.sleep(10);
        final int task = i;
        System.out.printf("put task %d\n", task);
        try {
            executorService.submit(() -> {
                try {
                    Thread.sleep(2000);
                    System.out.printf("run task: %d; thread: %s \n", task, Thread.currentThread().getName());
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            });
        } catch (Exception e) {
            System.out.println(e.getClass());
            System.out.printf("put fail %d [%s]\n", task, e.getMessage());
        }
    }
    ```

- newFixedThreadPool
    
    大小固定的线程池。注意`LinkedBlockingQueue`是无界的。

    ``` java 
    public static ExecutorService newFixedThreadPool(int nThreads) {
        return new ThreadPoolExecutor(nThreads, nThreads,
                                        0L, TimeUnit.MILLISECONDS,
                                        new LinkedBlockingQueue<Runnable>());
    }
    ```

- newCachedThreadPool    

    可缓存的线程池，会回收空闲的线程。注意：这种方式创建的线程池`maximumPoolSize`为`Integer.MAX_VALUE`。

    ``` java 
    public static ExecutorService newCachedThreadPool() {
        return new ThreadPoolExecutor(0, Integer.MAX_VALUE,
                                        60L, TimeUnit.SECONDS,
                                        new SynchronousQueue<Runnable>());
    }
    ```

- newSingleThreadExecutor   
 
    创建一个单线程线程

    ``` java 
    public static ExecutorService newSingleThreadExecutor() {
        return new FinalizableDelegatedExecutorService
            (new ThreadPoolExecutor(1, 1,
                                    0L, TimeUnit.MILLISECONDS,
                                    new LinkedBlockingQueue<Runnable>()));
    }
    ```

- newScheduledThreadPool   

    创建一个可延迟执行的线程池。注意：线程池大小为`Integer.MAX_VALUE`。

#### 饱和策略
- Abort 

    默认策略直接拒绝新任务，抛出`RejectedExecutionException`异常。

- Discard

    悄悄的丢弃最新的任务，不会有任何异常抛出。

- DiscardOld 

    同`Discard`恰恰相反，悄悄的抛弃最旧的待执行任务。

- CallerRuns

    及不抛弃，也不会抛异常。线程池和队列都满时会在调用了`execute`的线程中执行，这种情况主线程可能会被阻塞。


### 常见异常

#### ConcurrentModificationException
对容器迭代的时候如果同时对其进行修就会抛出`ConcurrentModificationException`。这类似一种预警机制，它将计数器与容器变化关联。如果迭代期间计数器被修改那么`hasNext`或者`next`将抛出异常。在迭代期间迭代器可能并没有意识到容器已经修改了，这是一种权衡机制来尽量避免并发修改操作对程序的影响。

`modCount`是List的一个成员变量，表示容器修改(add/remove)次数。    
`expectedModCount`是`Iterator`内部变量，这个值的初始值就是`modCount`的值。如果迭代过程中修改了容器，`modCount`就会改变，而此时`expectedModCount`还是`modCount`的旧值。    

> 直接调用`Iterator.remove`来删除元素不会出现`ConcurrentModificationException`异常，其方法内部会重新修正`modCount`和`expectedModCount`的值。

``` java 
final void checkForComodification() {
    if (modCount != expectedModCount)
    throw new ConcurrentModificationException();
}
```

``` java 
// 如果这里没有即时抛出`ConcurrentModificationException`异常，
// 因为我们在循环开始前已经取过size值，那么后面肯定会因为删除元素抛出`ArrayIndexOutOfBoundsException`异常。
// 这种机制被称为及时失败（fail-fast），及早发现问题抛出问题避免无意义的操作，因为最终迭代过程可能出现异常。
for (int i = 0; i < strs.size(); i++) {
    if ("pill".equals(strs.get(i))) strs.remove(strs.get(i));
}
```
解决方法使用`CopyOnWriteArrayList`替代`ArrayList`。

#### UnsupportedOperationException
容器逸出时，为了避免容器被修改可以使用`Collections.unmodifiable(Map|List)`等静态方法包装容器来保护原始容器不被修改。

调用这些容器的修改操作(add/remove)时会抛出UnsupportedOperationException异常。

另外：`Arrays.asList`方法返回的是一个`fixed-size`list，我们调用它的修改成操作时也会抛出`UnsupportedOperationException`异常。对齐重新封装`new ArrayList<>(Arrays.asList("a", "b", "c"))`后就不会出现此问题。

``` java 
List<String> strs = Collections.unmodifiableList(new ArrayList<>(Arrays.asList("a", "b", "c")));
strs.remove("b");
```