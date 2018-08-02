---
title: ES6箭头函数中的this
author: tyk
date: 2018-08-02 14:38:53
tags: 
- es6
- arrow-function
---
## ES6箭头函数中的this

ES6 开始引入了箭头函数，让代码看起来更简洁了。但是箭头函数传统函数不仅仅是写法上的不同，在`this`和`arguments`的处理方式也有着很大的区别。

### this是局部的
在箭头函数中`this`是**局部的**，它跟其它局部变量的常规处理是一致的。看下面的例子：

``` javascript 
function outer (age) {
    (() => {
        (() => {
            console.log(this.name, age);
        })();
    })();
}

outer.bind({name: '小明'})(10);

// => 小明 10
```

这例子中我们函数共有三层嵌套，里面是两层箭头函数，这里我们在最里层箭头函数内部引用了`this`和一个局部变量`age`。对局局部变量`age`的查找规则我们很清楚，先在当前作用域查找，如果没有就去父作用域查找，一直到最顶层（window、global）。在箭头函数中对`this`的查找规则和`age`是一样的，箭头函数本身并没有一个自己的`this`，它要一直往上层找，直到找到`this`为止。

同样，对于`arguments`的处理也是一样的。需要注意的一点是箭头函数本身是没有`arguments`变量的。


### 注意事项
箭头函数虽然写起来更加简单，但是我们不能不加区分的在任何地方都用箭头函数替代传统函数，特别是在函数内部涉及`this`绑定时。看下面的例子：

``` javascript
function sayName(fn) {
    const _fn = fn.bind({ name: '小明' });
    _fn();
}

sayName(function() { console.log('My name is', this.name); });
// => My name is 小明

// 错误写法
sayName(() => console.log('My name is', this.name));
// => My name is 
```

也正是这个原因[Koa 1.x](https://github.com/koajs/koa/tree/v1.x)中我们可以中间件中使用`this`引用到`context`，而在[Koa 2.x](https://github.com/koajs/koa/tree/2.0.0)中需要将`context`作为参数传到中间件内部。

``` javascript
// koa1.x
app.use(function *(next) {
    var start = new Date;
    yield next;
    var ms = new Date - start;
    console.log('%s %s - %s', this.method, this.url, ms);
});

// koa 2.x
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});
```

### 参考
- [ES6 箭头函数中的 this？你可能想多了](https://www.cnblogs.com/vajoy/p/4902935.html)