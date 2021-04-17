---
title: system-time
author: tyk
date: 2020-08-07 16:20:03
updated: 2020-08-19 10:30:07
tags:
---

## 计算机系统时间

我们常说的计算机系统（类Unix系统）时间是一个相对值，它表示距离`1970年1月1日00:00:00`过去的秒数。

时间通常在程序中有时间戳和日期字符串两种表现形式。但是在计算机中其实只有一种，就是时间戳。使用时间戳是永远不会出问题，但是使用日期字符串某些时候就会出现问题。出现问题的原因一般就是因为省略了时区。

### 时区

我们生活中常常用日期字符串来表示时间，如下：

{% jsfiddle pLxr4mqt result %}

可能有些人在程序中也会使用日期字符串来初始化日期：

```js
new Date('2020-08-07 18:21:33');
```

很多情况下这样都没有问题，但是一旦用户分布在不同时区或修改系统时区时就会出现问题。上面的日期字符串其实隐含了一个条件`时区`，比如我们生活中常说“今天下午五点见个面”这里隐含的条件就是大家都在东八区。

在东八区（北京时间）时，上面的时间等价于这个形式：

```js 
new Date('2020-08-07T18:21:33+08:00');
```

但是在东九区（东京时间）它等价于：

```js 
new Date('2020-08-07T18:21:33+09:00');
```

这两个时间并不是同一个日期。这就是日期字符串在夸时区出现问题的原因。

在实际开发中，我们应该避免使用简单字符串格式`YYYY-MM-DD HH:mm:ss`表示日期，这是非常危险的。如果要使用字符串来存储和初始化日期应该加上时区，使用`ISO 8601`格式的字符串`YYYY-MM-DDTHH:mm:ss.sssZ`。

### 参考 
- [ISO 8601](https://www.wikiwand.com/zh-hans/ISO_8601)
- [toISOString](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString)


