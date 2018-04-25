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

### 并发编程中的问题

- 死锁

- 饥饿

- 活锁


### 线程

- start 

    启动一个线程。

- run 

    直接在当前线程内运行。可用于线程封装，比如线程池内运行线程可以直接在线程池线程中调用被传入线程的run方法。

- sleep

    线程休眠，会释放CPU资源但是不会释放锁。
    
- yield 

    短暂让出CPU资源，不像sleep时间结束后进入`RUNNABLE`状态，它会立即进入`RUNNABLE`状态等待CPU资源。它同样不会释放锁。

- join 

    用于线程协调。调用t.join()当前线程会等待线程t执行完再继续执行。

- interrupt

    中断，类似一种信号，是一种协商机制。具体查看下面的中断机制。

- wait、notify/notifyAll 

    这两者属于Object类上的方法，用于线程*通讯*（其实没有讯息，类似一个通知机制）。具体查看下面的内置条件队列。


#### 线程状态

![](images/thread-state.jpg)

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

#### 内置条件队列
这里的条件是一种状态，当达到这种状态后我们可以进行后面的操作。例如，`队列空`、`队列满`都是一种状态，当队列为空时我们不能take操作，当队列满时我们不能push操作。当遇到上述状态时，我们可以可能需要等待，等待状态变更我们能进一步执行。等待的方式有多种，我们可以`自旋`也可以`休眠`。如果等待时间过久，`自旋`会浪费大量的CPU资源。如果`休眠`我们系统将不够灵敏。如果能有一种`通知机制`，当状态变更时通知我们的线程醒来再次检查状态。

Java里面wait/notify就是这种机制。当我们在一个把锁上wait时，线程将释放锁和CPU资源处于休眠状态。当在一把锁上调用notify/notifyAll时将唤醒前面等待的线程。这既避免了`自旋`过久对于CPU的浪费，也解决了`休眠`时不能立即唤醒的问题。

我们可以看做每一把锁上面都有一个队列，队列里面存放的是这把锁上的`wait`事件。当在这把锁上调用`notify`/`notifyAll`时会唤醒队列里面的线程。

``` java 
public class Queue<T> {
    private final ArrayList<T> list = new ArrayList<>();
    private int capacity;

    public Queue() {
        this(Integer.MAX_VALUE);
    }

    public Queue(int capacity) {
        this.capacity = capacity;
    }

    private boolean isFull() {
        return list.size() >= capacity;
    }

    private boolean isEmpty() {
        return list.isEmpty();
    }

    private T take() throws InterruptedException {
        return take(0);
    }

    private T take(long timeout) throws InterruptedException {
        // 封闭条件队列
        synchronized (list) {
            while (isEmpty()) list.wait(timeout);

            T t = list.remove(0);
            list.notifyAll();
            return t;
        }
    }

    private void push(T t) throws InterruptedException {
        push(t, 0);
    }

    private void push(T t, long timeout) throws InterruptedException {
        synchronized (list) {
            while (isFull()) {
                list.wait(timeout);
            }

            list.add(t);
            list.notifyAll();
        }
    }
}
```

自Java 1.5开始，Java并发包提供了新的选择，我们可以使用`Condition`来实现条件队列。它与传统的不同之处在于，在同一把锁上，我们可以创建多个条件队列，不同的条件可以放到不同的队列中。上例中有个弊端，当我们`notifyAll`时`isEmpty`和`isFull`条件等待的线程都会被唤醒。另外一个弊端是所有线程都会被唤醒，但是不是所有的线程获取锁再继续执行时就能满足条件，有可能会再次进入等待。例如对于生产者消费者模型，有多个消费者等待而此时只有一个生产者只生产了一个，那么所有消费者都被唤醒时，只有一个会成功抢到任务。其它会在唤醒后再次等待。还有一种情况是由于所有条件都在一个队列中，这个队列中可能既`队列空`又有`队列满`两种等待条件。我们一个`notifyAll`会唤醒两者，而实际情况是我们只想唤醒一种条件。例如，`push`时只想唤醒`队列空`条件的等待，而`take`时只想唤醒`队列满`条件的等待。这种无差别的唤醒同样会造成一种浪费。

``` java 
public class Queue<T> {
    private final ArrayList<T> list = new ArrayList<>();
    private final ReentrantLock lock = new ReentrantLock();
    // 为队列满和队列空分别创建条件队列
    private final Condition isFull = lock.newCondition();
    private final Condition isEmpty = lock.newCondition();

    private int capacity;

    public Queue() {
        this(Integer.MAX_VALUE);
    }

    public Queue(int capacity) {
        this.capacity = capacity;
    }

    private boolean isFull() {
        return list.size() >= capacity;
    }

    private boolean isEmpty() {
        return list.isEmpty();
    }

    private T take() throws InterruptedException {
        return take(0);
    }

    private T take(long timeout) throws InterruptedException {
        lock.lock();
        try {
            while (isEmpty()) isEmpty.await(timeout, TimeUnit.MILLISECONDS);

            T t = list.remove(0);
            // 不同等待条件分队列后就不需要全部唤醒（signalAll）了
            // 以前我们不能使用的原因两种条件等待都在一个队列里，由于我们不能控制唤醒谁就可能会唤醒一个我们不想唤醒的等待。
            // 例如我们在take后push操作上的等待应该可以执行了，由于无差别的唤醒可能我们会又唤醒一个take操作上的等待。
            isFull.signal();
            return t;
        } finally {
            lock.unlock();
        }
    }

    private void push(T t) throws InterruptedException {
        push(t, 0);
    }

    private void push(T t, long timeout) throws InterruptedException {
        lock.lock();
        try {
            while (isFull()) isFull.await(timeout, TimeUnit.MILLISECONDS);

            list.add(t);
            isEmpty.signal();
        } finally {
            lock.unlock();
        }
    }
}
```

### 同步工具
#### 同步容器 
- Vector

    最初版本的同步集合，所有方法均使用synchronized加锁同步。

- HashTable 

    最初版本的同步哈希表，所有方法均加锁同步。
    
- Collections.synchronized(Collection|List|Map|Set|SortMap|SortSet)
    
    以上同步容器使用装饰器模式实现，将一个线程不安全的List/Map封闭在容器内部，通过同一把锁（同步容器本身）保护对对象的所有操作。这种方式最重要的一点是防止被封闭的对象逸出。

    ``` java 
    static class SynchronizedList<E>
        extends SynchronizedCollection<E>
        implements List<E> {
        private static final long serialVersionUID = -7754090372962971524L;

        final List<E> list;

        SynchronizedList(List<E> list) {
            super(list);
            this.list = list;
        }
        SynchronizedList(List<E> list, Object mutex) {
            super(list, mutex);
            this.list = list;
        }
        
        ...
    
        public E get(int index) {
            // 所有操作上都使用锁同步
            synchronized (mutex) {return list.get(index);}
        }
        public E set(int index, E element) {
            synchronized (mutex) {return list.set(index, element);}
        }
        public void add(int index, E element) {
            synchronized (mutex) {list.add(index, element);}
        }
        public E remove(int index) {
            synchronized (mutex) {return list.remove(index);}
        }

        ...
    }
    ```

#### 并发容器
- CopyOnWriteArrayList

    写入时复制的思想，每次更新时都会重新copy一份新的数据。由于每次修改都会复制底层数组，当容器规模较大时将会产生较大的开销。对于容器修改尽量调用批量操作的API，减少容器数据复制操作。

    多线程可以同时对容器进行迭代，不会彼此干扰或与修改容器的线程相互干扰。写入时复制不会抛出`ConcurrentModificationException`异常，迭代的是创建迭代器时的元素，修改操作不会对迭代的数据有影响（修改后被迭代的数组和容器此时的数组已经不是同一个了）。

    ``` java 
    // CopyOnWriteArrayList.add 
    public boolean add(E e) {
        // 排它锁保证了并发的安全性(可见性/原子性)，所有的更新操作使用同一把锁
        final ReentrantLock lock = this.lock;
        lock.lock();
        try {
            // 容器底层数组
            Object[] elements = getArray();
            int len = elements.length;
            // 复制原数组到新数组中
            Object[] newElements = Arrays.copyOf(elements, len + 1);
            // 将元素添加到新数组中
            newElements[len] = e;
            // 重置容器底层数组
            setArray(newElements);
            return true;
        } finally {
            lock.unlock();
        }
    }

    // 遍历操作
    // 遍历的是创建迭代器时的数组，后面再修改已经不是修改的此数组了。
    public ListIterator<E> listIterator() {
        return new COWIterator<E>(getArray(), 0);
    }
    ```
    
- ConcurrentHashMap

    `ConcurrentHashMap`使用`锁分段`的思想，将原来的一个锁应用在整个容器上拆分为多个锁每个锁锁定容器一部分数据的形式。这能减少锁竞争，提高程序的可伸缩性。

#### 队列 
Queue、Deque

|  -   |            -             |                         -                          |
| ------- | ------------------------ | -------------------------------------------------- |
| add     | 增加一个元索             | 如果队列已满，则抛出一个IIIegaISlabEepeplian异常   |
| remove  | 移除并返回队列头部的元素 | 如果队列为空，则抛出一个NoSuchElementException异常 |
| element | 返回队列头部的元素       | 如果队列为空，则抛出一个NoSuchElementException异常 |
| offer   | 添加一个元素并返回true   | 如果队列已满，则返回false                          |
| poll    | 移除并返问队列头部的元素 | 如果队列为空，则返回null                           |
| peek    | 返回队列头部的元素       | 如果队列为空，则返回null                           |
| put     | 添加一个元素             | 如果队列满，则阻塞                                 |
| take    | 移除并返回队列头部的元素 | 如果队列为空，则阻塞                               |

- LinkedBlockingQueue

- ArrayBlockingQueue

- DelayQueue
    
- SynchronousQueue 

    `SynchronousQueue`并不是一个真正的队列，它没有存储功能，不缓存元素。它维护的是是一组工作线程，任务直接从生产者到消费者手中，中间没有延迟。`newCachedThreadPool`使用的正是这种队列。

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
    
    ![FutureTask](images/FutureTask.png)
    ![Future](images/future.png)

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
                
                // 未执行完的情况下，get时会阻塞。
                // 最终执行时间取决于执行时间最长的任务。
                int revOne = queryOne.get();
                int revTwo = queryTwo.get();
                System.out.printf("%d + %d = %d\n", revOne, revTwo, revOne + revTwo);
                System.out.println(queryOne.get() + queryTwo.get());
            } catch (InterruptedException ignore) {
                // e.printStackTrace();
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
    // 模拟银行窗口
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
    // 模拟银行金库。
    // 金库大门共三把锁，分别有三个经理拿着钥匙。
    // 只有三个经理人都开锁时，金库大门才会开。
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

- ForkJoin
    
    ForkJoin采用分治算法，将大任务拆分成小任务来处理。通常情况下我们不需要直接继承ForkJoinTask类，而只需要继承它的子类，Fork/Join框架提供了以下两个子类：
    
    - RecursiveAction：用于没有返回结果的任务。
    - RecursiveTask ：用于有返回结果的任务。
    
    常用模式：
    ``` Java
    Result solve(Problem problem) {
        if (problem is small) {
            // 直接解决
            directly solve problem
        } else {
            // 拆分问题
            split problem into independent parts
            fork new subtasks to solve each part
            join all subtasks
            compose result from subresults
        }
    }
    ```

    Fork/Join求和
    ``` java 
    public class ForkJoinSum extends RecursiveTask<Long> {
        private int[] nums;
        private int low;
        private int high;
        private int THRESHOLD = 10;

        public ForkJoinSum(int[] nums) {
            this(nums, 0, nums.length);
        }

        public ForkJoinSum(int[] nums, int low, int high) {
            this.nums = nums;
            this.low = low;
            this.high = high;
        }

        @Override
        protected Long compute() {
            // 小任务直接处理
            if (high - low < THRESHOLD) {
                return Arrays.stream(Arrays.copyOfRange(nums, low, high)).asLongStream().sum();
            } else {
                // 大人物先拆分再合并结果
                ForkJoinSum left = new ForkJoinSum(nums, low, low + (high - low) / 2);
                ForkJoinSum right = new ForkJoinSum(nums, low + (high - low) / 2, high);

                // ！！！不要两个线程都fork，不然当前线程将无任务可做。
                // invokeAll其中left会在当前线程内执行，right会fork在线程池中另一个线程中执行。
                invokeAll(left, right);
                return left.join() + right.join();
            }
        }

        public static void main(String[] args) {
            int count = 100;
            int[] nums = new int[count];
            Random random = new Random();
            for (int i = 0; i < count; i++) nums[i] = random.nextInt(count);

            ForkJoinPool pool = new ForkJoinPool(4); // 最大并发数4
            ForkJoinSum task = new ForkJoinSum(nums);

            long ret = pool.invoke(task);
            System.out.println(ret);
        }
    }
    ```
    
### 锁

- 内置锁 
    
    内置锁能同时保证`原子性`和`可见性`。内置锁是独占锁，会增加串行代码比例，降低程序的可伸缩性。
    
    内置锁是一种可重入锁，如果已经获得了锁，后面在遇到相同的锁时可以直接进入。

    是用不用的锁组合时一定要注意加锁的顺序，避免交叉造成死锁的问题。

    ``` java 
    // 锁为实例(this)对象 
    synchronized (this) {

    }
    
    public synchronized void fun() {

    }
    ```

    ``` java
    // 特定的锁对象，可以将锁对象封闭在程序内部。
    synchronized (lock) {
        
    }
    ```
    

    ``` java 
    // 锁为class对象
    public static synchronized fun() {
        
    }
    ```

- ReentrantLock 

    `ReentrantLock`提供了和`synchronized`一样的互斥性及内存可见性。在大多数场景下使用`synchronized`就够了，但是内置锁有一些局限性。例如，我们无法中断一个等待获取锁的线程。但是使用`ReentrantLock`也有缺点，我们必须手动释放锁。`ReentrantLock`和内置锁性能相当，仅当内置锁不能满足需求时才考虑使用`ReentrantLock`。就性能而言，我们也应当首选内置锁，因为内置锁的JVM的内置属性，它能执行一些优化。
    
    `ReentrantLock`可以提供公平锁，线程按照它们发出请求的顺序来获得锁。非公平锁允许`插队`行为，当请求一把非公平锁时，如果在发出请求时同时改锁状态变为可用，那么这个线程将跳过所有等待线程而获得这个锁。由于公平锁所有线程在等待锁时都要排队，这将会增加线程切换降低性能，而`插队`将减少一次上下文切换。当持有锁的时间较长时，应该使用公平锁。

    `ReentrantLock`实现了`Lock`接口。
    ```java 
    public interface Lock {

        // 获得一把锁
        void lock();

        // 获得一把锁，锁获取时可以中断
        void lockInterruptibly() throws InterruptedException;

        // 获取一把锁，获得返回true
        boolean tryLock();

        // 尝试获得一把锁，等待一定的时间。获得返回true
        boolean tryLock(long time, TimeUnit unit) throws InterruptedException;

        // 释放锁
        void unlock();

        // 条件队列
        Condition newCondition();
    }
    ```

    组合运用
    ```java
    public class ConcurrentIncrease {

        private int total = 0;
        private ReentrantLock lock = new ReentrantLock();

        public int incr() {
            lock.lock();
            try {
                ++total;
                // 内部输出后会发生IO阻塞，会放弃CPU资源
                // System.out.printf("total: %d\n", total);
                return total;
            } finally {
                lock.unlock();
            }
        }

        public static void main(String[] args) {
            int count = 100;
            final ConcurrentIncrease increase = new ConcurrentIncrease();

            CountDownLatch start = new CountDownLatch(count);
            CyclicBarrier done = new CyclicBarrier(count, () -> {
                System.out.printf("total: %d\n", increase.total);
            });

            for (int i = 0; i < count; i++) {
                new Thread(() -> {
                    try {
                        start.await();
                    } catch (InterruptedException ignored) { }

                    System.out.println(increase.incr());

                    try {
                        done.await();
                    } catch (InterruptedException | BrokenBarrierException ignored) { }
                }).start();

                start.countDown();
            }
        }
    }
    ```

- ReadWriteLock 

    `ReentrantLock`和内置锁都是互斥锁，每次只能有一个线程持有锁。互斥锁是一种保守的加锁策略，它可以避免`写\写`和`读\写`的冲突，但它同时也限制了`读\读`。读写锁正是来解决这一问题的，只要能保证每个线程都能读到最新的数据，并且读数据时不会有其它线程来修改数据，那就不会发生问题。使用了读写锁后，一个资源可以同时被多个读操作或者一个写操作，但二者不能同时进行。

    读写锁实现方式
    - **释放优先**。当写入线程释放写锁时，如果正在排队的同时存在读和写线程，改优先选择读线程还是写线程。
    - **读线程插队**。如果锁有读线程获取，但是有写线程等待，那么新到的读线程是否能立即获得锁，还是排队在写线程后面。
    - **重入性**。读取锁和写入锁是否可重入。
    - **降级**。如果一个线程持有写入锁，它是否能再不释放该锁的情况下获取读锁。这个线程将同时拥有读写锁，同时将阻止其它线程对被保护资源的读写。
    - **升级**。读锁能否由于其它正在等待的读线程和写线程升级为一个写入锁。（这协商不好将发生死锁的情况，如果两个读锁同时要升级为写锁）。

    ``` java 
    public class ReadWriteMap <K,V> {
        private final Map<K, V> map;
        private final ReadWriteLock lock = new ReentrantReadWriteLock();
        private final Lock r = lock.readLock();
        private final Lock w = lock.writeLock();

        public ReadWriteMap(Map<K, V> map) {
            this.map = map;
        }

        public V put(K key, V value) {
            w.lock();
            try {
                return map.put(key, value);
            } finally {
                w.unlock();
            }
        }

        public V get(Object key) {
            r.lock();
            try {
                return map.get(key);
            } finally {
                r.unlock();
            }
        }

        ... 
        // remove/putAll/clear/size/isEmpty/containsKey/containsValue
    }
    ```

#### 原子变量

CAS 伪类
``` java 
/**
 * CAS 的典型使用模式是：首先从 V 中读取值 A ，并根据 A 计算新值 B ，
 * 然后再通过 CAS 以原子方式将 V 中的值由 A 变成 B （只要在这期间没有任何线程将 V 的值修改为其他值）。
 * 由于 CAS 能检测到来自其他线程的干扰，因此即使不使用锁也能够实现原子的读一改一写操作序列。
 */
public class CAS<T> {
    private T value;

    public CAS(T value) {
        this.value = value;
    }

    public synchronized T get() {
        return value;
    }

    /**
     * 比较成功则换值
     *
     * 对于 i = 1; i = i + 1
     * 我们的预期是1，操作后应该结果是2；
     * 如果此时i确实是1，那就说明没人修改，那就直接将预期结果2赋值给它。
     * @param expectedValue 期望值，即我们看到的值
     * @param newValue      新值
     * @return
     */
    public synchronized T compareAndSwap(T expectedValue, T newValue) {
        T oldValue = value;
        if (value == expectedValue)
            value = newValue;
        return oldValue;
    }

    /**
     * {@link #compareAndSwap(int, int)} 返回的是旧值，也就是我们期望的那个值的。
     * <br>
     * 如果它的返回值和我们的期望值一样，说明此时交换成功了。
     * @param expectedValue 期望值
     * @param newValue      新值
     * @return
     */
    public synchronized boolean compareAndSet(T expectedValue, T newValue) {
        return (expectedValue == compareAndSwap(expectedValue, newValue));
    }
}

class CASCounter {
    private CAS<Integer> value;

    public CASCounter(int value) {
        this.value = new CAS<>(value);
    }

    public int getValue() {
        return value.get();
    }

    public int increment() {
        int v;
        do {
            v = value.get();
            // 相等表示替换成功，失败则重试
        } while (v == value.compareAndSwap(v, v + 1));
        return v + 1;
    }
}
```

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


#### 线程池停止
- shutdown 

    非阻塞方法。停止线程，会等待所有工作及排队线程都执行完毕。

- shutdownNow

    非阻塞。先停止正在执行的线程，然后返回正在等待的任务。

- awaitTermination(timeout, unit)

    阻塞等待最长`timeout`等待线程池结束。

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
对容器迭代的时候如果同时对其进行修就会抛出`ConcurrentModificationException`。这类似一种**预警机制**，它将计数器与容器变化关联。如果迭代期间计数器被修改那么`hasNext`或者`next`将抛出异常。在迭代期间迭代器可能并没有意识到容器已经修改了，这是一种权衡机制来尽量避免并发修改操作对程序的影响。

`modCount`是List的一个成员变量，表示容器修改(add/remove)次数。    
`expectedModCount`是`Iterator`内部变量，这个值的初始值就是`modCount`的值。如果迭代过程中修改了容器，`modCount`就会改变，而此时`expectedModCount`还是`modCount`的旧值。    

> 不管是简单的for，还是增强for循环编译后都是Iterator迭代。
> 直接调用`Iterator.remove`来删除元素不会出现`ConcurrentModificationException`异常，其方法内部会重新修正`modCount`和`expectedModCount`的值。

``` java    
public Iterator<E> iterator() {
    return new Itr();
}

/**
* An optimized version of AbstractList.Itr
* 内部类，可以直接访问宿主类属性。用于容器迭代。
*/
private class Itr implements Iterator<E> {
    int cursor;       // index of next element to return
    int lastRet = -1; // index of last element returned; -1 if no such
    // 保留原始的modCount值，可以看做是oldModCount
    int expectedModCount = modCount;

    public boolean hasNext() {
        return cursor != size;
    }

    @SuppressWarnings("unchecked")
    public E next() {
        // 每次迭代是都检查 
        checkForComodification();
        
        int i = cursor;
        if (i >= size)
            throw new NoSuchElementException();
        Object[] elementData = ArrayList.this.elementData;
        if (i >= elementData.length)
            throw new ConcurrentModificationException();
        cursor = i + 1;
        return (E) elementData[lastRet = i];
    }

    public void remove() {
        if (lastRet < 0)
            throw new IllegalStateException();
        checkForComodification();

        try {
            ArrayList.this.remove(lastRet);
            cursor = lastRet;
            lastRet = -1;
            // 直接调用it.remove()后不会触发ConcurrentModificationException异常
            // 这里会重置expectedModCount的值
            expectedModCount = modCount;
        } catch (IndexOutOfBoundsException ex) {
            throw new ConcurrentModificationException();
        }
    }

    @Override
    @SuppressWarnings("unchecked")
    public void forEachRemaining(Consumer<? super E> consumer) {
        Objects.requireNonNull(consumer);
        final int size = ArrayList.this.size;
        int i = cursor;
        if (i >= size) {
            return;
        }
        final Object[] elementData = ArrayList.this.elementData;
        if (i >= elementData.length) {
            throw new ConcurrentModificationException();
        }
        while (i != size && modCount == expectedModCount) {
            consumer.accept((E) elementData[i++]);
        }
        // update once at end of iteration to reduce heap write traffic
        cursor = i;
        lastRet = i - 1;
        checkForComodification();
    }

    final void checkForComodification() {
        // modCount 为宿主类属性，实时的
        // expectedModCount 为创建迭代器时的 modCount
        if (modCount != expectedModCount)
            throw new ConcurrentModificationException();
    }
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

另外：`Arrays.asList`方法返回的是一个`fixed-size`list，我们调用它的修改成操作时也会抛出`UnsupportedOperationException`异常。对其重新封装`new ArrayList<>(Arrays.asList("a", "b", "c"))`后就不会出现此问题。

``` java 
List<String> strs = Collections.unmodifiableList(new ArrayList<>(Arrays.asList("a", "b", "c")));
strs.remove("b");
```