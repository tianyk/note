---
title: await-vs-return-vs-return-await
author: tyk
date: 2018-05-28 19:50:03
tags: 
- async 
- await
---
## await vs return vs return await

在写`async`函数时，`await`、`return`和`return await`是不同的，选择正确的写法很重要。

从下面这个`async`函数开始吧：

``` javascript
async function waitAndMaybeReject() {
  // Wait one second
  await new Promise(r => setTimeout(r, 1000));
  // Toss a coin
  const isHeads = Boolean(Math.round(Math.random()));

  if (isHeads) return 'yay';
  throw Error('Boo!');
}
```

这个函数1秒后返回一个Promise，返回`yay`和抛出异常的概率都是50%。下面我们用不同的方式调用它：

### Just calling
``` javascript 
async function foo() {
  try {
    // waitAndMaybeReject 将返回一个 promise; 
    waitAndMaybeReject();
  }
  catch (e) {
    return 'caught';
  }
}
```
如果你调用`foo`，返回的promise对象总是立即返回`undefined`，不会等待。

因为我们没用`await`或者`return`执行`waitAndMaybeReject`函数，对于`waitAndMaybeReject`我们不能做什么。这种写法一般是错的。

> `waitAndMaybeReject`会立即返回一个promise，foo函数会立即结束。我们不会看到`waitAndMaybeReject`函数内部延迟执行的1s。`waitAndMaybeReject`函数内部抛出的任何异常和结果我们也无法捕获或者接受。

### Awaiting
``` javascript 
async function foo() {
  try {
    await waitAndMaybeReject();
  }
  catch (e) {
    return 'caught';
  }
}
```
如果你调用`foo`，返回的promise将在1秒后返回一个`undefined`或者`caught`。

因为我们等待`waitAndMaybeReject()`的执行结果，它抛出的异常将会被`catch`语句捕获，如果它正常执行这个函数什么将不会返回任何值`undefined`。

> 这里相当于调用了`waitAndMaybeReject`函数，如果`waitAndMaybeReject`抛出异常我们将忽略掉异常重新返回一个`caught`字符串，如果`waitAndMaybeReject`没有抛出异常，`foo`函数将无返回值`undefined`。

### Returning
``` javascript
async function foo() {
  try {
    return waitAndMaybeReject();
  }
  catch (e) {
    return 'caught';
  }
}
```

如果你调用`foo`，这个返回的promise对象将等待1秒后返回`yay`或者抛出一个`Boo!`异常。

这里我们`foo`的返回值其实就是`waitAndMaybeReject`的返回值，我们的`catch`语句将永远不会执行。

> 这个`foo`函数的封装毫无意义，相当于直接调用`waitAndMaybeReject`。

### Return-awaiting
``` javascript
async function foo() {
  try {
    return await waitAndMaybeReject();
  }
  catch (e) {
    return 'caught';
  }
}
```

我们调用`foo`后，返回的promise将等待1秒后返回一个`yay`或者`caught`。

当我们等待`waitAndMaybeReject()`的结果时，它如果抛出异常将被我们的`catch`语句捕获，我们会返回一个`catch`字符串，如果这个函数正常执行，我们将返回它的返回值`yay`。

我们将上面函数拆分成两步就是下面的形式：
``` javascript
async function foo() {
  try {
    // Wait for the result of waitAndMaybeReject() to settle,
    // and assign the fulfilled value to fulfilledValue:
    const fulfilledValue = await waitAndMaybeReject();
    // If the result of waitAndMaybeReject() rejects, our code
    // throws, and we jump to the catch block.
    // Otherwise, this block continues to run:
    return fulfilledValue;
  }
  catch (e) {
    return 'caught';
  }
}
```

注意：如果没有`try/catch`包裹的`return await`函数是冗余的，可以使用[ESLint](https://github.com/eslint/eslint/blob/master/docs/rules/no-return-await.md)去检测。但是在`try/catch`里面是允许的。
> 如果没有`try/catch`包裹时`waitAndMaybeReject`抛异常，将会从`foo`里面抛出去，如果正确返回将会从foo的结果中获取。这相当于`return waitAndMaybeReject()`，我们直接使用`waitAndMaybeReject()`返回的promise比`foo`返回的promise更简单清晰。

### 参考
- [await vs return vs return await](https://jakearchibald.com/2017/await-vs-return-vs-return-await/)

