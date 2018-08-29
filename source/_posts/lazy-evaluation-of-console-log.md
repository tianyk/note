---
title: console.log的延迟计算
author: tyk
date: 2018-08-29 10:52:23
tags:
---
## console.log的延迟计算

我们调试JavaScript时经常会用到`console.log`打印，但是`console.log`打印对象时不那么准确。看下面的例子：

``` javascript 
const user = { name: 'Ming' };
console.log(user);
user.name = 'Lee';
```

![](/images/console-log-lazy-evaluation.jpeg)

`user.name`的初始值为`Ming`，打印`user`看到的`name`值也是`Ming`。紧接着修改`user.name`值为`Lee`，然后再暂开前面打印`user`对象就看到`name`值变成了`Lee`。

这个展开看到的值是Chrome为了优化`console.log`进行的延迟计算，我们看到对象展开后的值是在展开时实时计算的。如果留意在展开对象时会有一个提示`Value below was evaluated just now.`。

为了避免上述问题在打印对象时可以将对象序列化：
``` javascript 
console.log(JSON.stringify(user));
```
