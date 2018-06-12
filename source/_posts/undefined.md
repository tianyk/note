---
title: undefined
date: 2016-08-24 18:36:49
updated: 2018-06-12 18:14:23
author: tyk
tags: 
- javascript
- undefined
---

## undefined

### 判断对象是不是`undefined`

``` javascript
var x;

// 方法一
console.log(typeof x === 'undefined');

// 方法二
console.log(x === undefined);
```
不要使用`==`比较，因为`null == undefined`为true。

### undefined & null
很多时候`undefined`和`null`差别不大，但是二者的**含义**完全不同。

`undefined`代表**未定义**，而null代表**值为空**。
``` javascript
typeof undefined;    // 'undefined'
typeof null;         // 'object'
```
可以看到`null`的类型是`object`，它表示的意思是一个为空的值。

### 参考
- [undefined与null的区别](http://www.ruanyifeng.com/blog/2014/03/undefined-vs-null.html)
