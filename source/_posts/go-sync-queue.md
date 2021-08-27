---
title: 从一个并发安全的队列聊聊Golang的并发
author: tyk
tags:
  - queue
  - golang
date: 2021-08-27 10:45:57
---



## 从一个并发安全的队列聊聊Golang的并发

在有多个`goroutines`同时访问并且至少有一个`goroutines`在修改数据的情况下就会存在并发问题。Golang处理并发安全有锁和`channel`两种方案，前者通过加锁方式保证同一时刻只有一个操作在访问数据，后者是将操作串行化来来实现同一时刻只能有一个操作访问数据。

> [Advice](https://golang.org/ref/mem#tmp_1)
> 
> Programs that modify data being simultaneously accessed by multiple goroutines must serialize such access.
> To serialize access, protect the data with channel operations or other synchronization primitives such as those in the sync and sync/atomic packages.
> If you must read the rest of this document to understand the behavior of your program, you are being too clever.
> Don't be clever.

一个简单的队列最少有`Add`和`Pop`两个操作，队列内部一般通过列表或者链表来存放数据。这两个操作都是对底层的列表或者链表的写操作。底层的列表和链表并不是并发安全的，在多个`goroutines`在同时`Add`或`Pop`时就会有并发问题。

```go
import (
    "context"
    "sync"

    "github.com/pkg/errors"
)

// waitWithCancel 可取消的 Wait
func waitWithCancel(ctx context.Context, cond *sync.Cond) error {
    if ctx.Done() != nil {
        done := make(chan struct{})
        go func() {
            cond.Wait()
            close(done)
        }()

        select {
        case <-ctx.Done():
            return errors.Wrap(ctx.Err(), "cancel wait")
        case <-done:
            return nil
        }
    } else {
        cond.Wait()
        return nil
    }
}

type Queue struct {
    elements []interface{}
    capacity int

    // 队列未空条件队列
    notEmptyCond *sync.Cond
    // 队列未满条件队列
    notFullCond *sync.Cond
}

func (q *Queue) Size() int {
    return len(q.elements)
}

func (q *Queue) isFull() bool {
    return q.Size() >= q.capacity
}

func (q *Queue) isEmpty() bool {
    return q.Size() == 0
}

// Pop
// 可以使用 `Context` 来终止 Wait 阻塞
func (q *Queue) Pop(ctx context.Context) (ele interface{}, err error) {
    q.notEmptyCond.L.Lock()
    defer func() {
        // Wait 内部已经释放了锁，避免 `unlock of unlocked mutex` 错误
        if originalErr := errors.Cause(err);
            originalErr != context.DeadlineExceeded && originalErr != context.Canceled {
            q.notEmptyCond.L.Unlock()
        }
    }()

    for q.isEmpty() {
        err = waitWithCancel(ctx, q.notEmptyCond)
        if err != nil {
            return
        }
    }

    ele = q.elements[q.Size()-1]
    q.elements = q.elements[:q.Size()-1]
    // 此时队列中已经 Pop 一个值，不再满。发送队列不为满的信号激活再此条件 `Wait` 的操作
    q.notFullCond.Signal()
    return
}

// Add
// 可以使用 `Context` 来终止 Wait 阻塞
func (q *Queue) Add(ctx context.Context, ele interface{}) (err error) {
    q.notEmptyCond.L.Lock()
    defer func() {
       // Wait 内部已经释放了锁，避免 `unlock of unlocked mutex` 错误
       if originalErr := errors.Cause(err);
           originalErr != context.DeadlineExceeded && originalErr != context.Canceled {
           q.notEmptyCond.L.Unlock()
       }
    }()

    for q.isFull() {
       err = waitWithCancel(ctx, q.notFullCond)
       if err != nil {
           return
       }
    }

    q.elements = append(q.elements, ele)
    // 此时队列中已经有值，发送队列不为空的信号激活再此条件 `Wait` 的操作
    q.notEmptyCond.Signal()
    return
}

func NewQueue(capacity int) *Queue {
    var lock sync.Mutex
    notEmptyCond := sync.NewCond(&lock)
    notFullCond := sync.NewCond(&lock)

    return &Queue{
        elements: make([]interface{}, 0, capacity),
        capacity: capacity,

        notEmptyCond: notEmptyCond,
        notFullCond:  notFullCond,
    }
}
```

### 参考

- [Java并发编程 内置条件队列](https://kekek.cc/post/java.util.concurrent.html#%E5%86%85%E7%BD%AE%E6%9D%A1%E4%BB%B6%E9%98%9F%E5%88%97)
- [Go 语言设计与实现 6.1 上下文 Context](https://draveness.me/golang/docs/part3-runtime/ch06-concurrency/golang-context/)
- [Go 语言设计与实现 6.2 同步原语与锁](https://draveness.me/golang/docs/part3-runtime/ch06-concurrency/golang-sync-primitives/)