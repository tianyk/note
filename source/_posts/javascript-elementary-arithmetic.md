---
title: JavaScript模拟四则运算
date: 2018-05-04 11:28:24
tags: 
- javascript
- this
- bind
---

![](/images/elementary-arithmetic.jpg)

``` javascript 
function add(num) {
    // 重点!!!这里的num是一个计算后的结果
    // 这里的this在调用处进行了修正，指向 A + B 中的 A。
    return function () {
        return this.value + num;
    }
}

function one(op) {
    var _one = { value: 1 };

    if (op) {
        op = op.bind(_one);
        // 关键点将本值绑定到操作函数上，让操作函数能访问本值
        // 返回 + - * / 操作结果
        return op();
    } else {
        // 返回本值
        return _one.value;
    }
}

console.log(one(add(one(add(one())))));
// setp_1 
// one();        // 1

// setp_2        one(add(one())) 第一步算出one()为1
// one(add(1)); // 2 add的this为one内部的`_one`

// setp_3        one(add(one(add(one())))) 上两步算出one(add(one()))为2
// one(add(2)); // 3 
```