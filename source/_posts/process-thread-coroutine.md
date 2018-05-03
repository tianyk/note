---
title: 进程线程协程
date: 2016-08-16 19:08:26
tags: 
---
 ### 进程->线程->协程

在现实世界中，基本是是按着这样的顺序演化：process-->thread-->coroutine/fiber 其实是一个 context 切换开销从大到小的演化，process 切换开销最大，需要切换地址空间，所有的 CPU 状态，所有其他资源 thread 切换只需要切换 CPU 状态，当然是大部分的 CPU 状态，而 coroutine 切换，只需要切换很少的 CPU 状态，而且全部都在用户地址空间运行，不需要到内核空间。


* thread之間需要context-switch，而且成本很高，但是coroutine之間的切換很快
* coroutine的成本很低，可以很輕易的產生大量的coroutine
* 這些事情全是在同一個thread裡發生的，~~因此不會有race condition等問題發生~~ (還是可能會有)
* thread的context-switch雖然我們可以進行某種程度的控制，但是很多部份還是得靠OS來決定要先排程哪個thread，而coroutine的執行是由我們自己控制的


### 参考
- [process-->thread-->coroutine](http://blog.csdn.net/whinah/article/details/3501276)
- [淺談coroutine與gevent](http://blog.ez2learn.com/2010/07/17/talk-about-coroutine-and-gevent/)
- [协程的好处有哪些？](https://www.zhihu.com/question/20511233/answer/24260355)
