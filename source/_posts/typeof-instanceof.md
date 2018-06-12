---
title: typeof&instanceof.md
date: 2016-08-24 18:36:49
updated: 2018-06-12 18:08:02
tags: 
- typeof
- instanceof
---
`typeof`和`instanceof`是JavaScript中的两个操作符。一般情况下对于基本类型我们使用`typeof`，对于对象的具体类型用`instanceof`。

### typeof
`typeof`操作符返回一个字符串,表示未经求值的操作数(unevaluated operand)的类型。
下面的表格总结了 typeof 可能的返回值。
![](/images/QQ20160824-0@2x.jpg)
```javascript
// Numbers
typeof 37 === 'number';
typeof 3.14 === 'number';
typeof(42) === 'number';
typeof Math.LN2 === 'number';
typeof Infinity === 'number';
typeof NaN === 'number'; // Despite being "Not-A-Number"
typeof Number(1) === 'number'; // but never use this form!


// Strings
typeof '' === 'string';
typeof 'bla' === 'string';
typeof '1' === 'string'; // note that a number within a string is still typeof string
typeof (typeof 1) === 'string'; // typeof always returns a string
typeof String('abc') === 'string'; // but never use this form!


// Booleans
typeof true === 'boolean';
typeof false === 'boolean';
typeof Boolean(true) === 'boolean'; // but never use this form!


// Symbols
typeof Symbol() === 'symbol'
typeof Symbol('foo') === 'symbol'
typeof Symbol.iterator === 'symbol'


// Undefined
typeof undefined === 'undefined';
// 定义为初始化
typeof declaredButUndefinedVariable === 'undefined';
// 未定义
typeof undeclaredVariable === 'undefined';


// Objects
typeof {a: 1} === 'object';

// use Array.isArray or Object.prototype.toString.call
// to differentiate regular objects from arrays
typeof [1, 2, 4] === 'object';

typeof new Date() === 'object';


// The following is confusing. Don't use!
typeof new Boolean(true) === 'object';
typeof new Number(1) === 'object';
typeof new String('abc') === 'object';


// Functions
typeof function() {} === 'function';
typeof class C {} === 'function';
typeof Math.sin === 'function';
```

注意事项：
```javascript
// null is a null Object
typeof null === 'object'; // true

typeof NaN === 'number'; // true

// 其它都是object
typeof new Date() === 'object'; // true
typeof new Boolean(true) === 'object'; // true
typeof new Number(1) ==== 'object'; // true
typeof new String("abc") === 'object'; // true
```

### instanceof
`instanceof`运算符可以用来判断某个构造函数的`prototype`属性所指向的對象是否存在于另外一个要检测对象的原型链上。

`instanceof`运算符希望左操作数是一个对象，右操作数标识对象的类。如果左侧的对象是右侧类的实例，则表达式返回true；否则返回false。

为了计算表达式`o instanceof f`，JavaScript首先计算`f.prototype`，然后在原型链中查找o，如果找到，那么o是f（或者f的父类）的一个实例，表达式返回true。如果f.prototype不在o的原型链中的话，那么o就不是f的实例，instanceof返回false。

原型链
![](/images/1374057134_4751.png)

``` javascript
function Foo(y) {
    this.y = y;
}

Foo.prototype.x = 10;
Foo.prototype.calculate = function() {
    // ... 
}

var b = new Foo(20);
var c = new Foo(30);

b.__proto__ === Foo.prototype; // true 
b.__proto__ === Object.getPrototypeOf(b); // true 

b instanceof Foo; // true 
Foo.prototype.isPrototypeOf(b); // true 
```

JavaScript中有个原型链的概念，这个`链`一般是通过对象的`__proto__`属性来建立的。`prototype`代表原型，`prototype`对象都有一个`constructor`属性，指向它的构造函数。这里的`instanceof`就是去判断是否在一条原型链上。


### Object.prototype.toString()

每个对象都有一个`toString()`方法，当该对象被表示为一个文本值时，或者一个对象以预期的字符串方式引用时自动调用。默认情况下，`toString()`方法被每个`Object`对象继承。如果此方法在自定义对象中未被覆盖，`toString()` 返回 `[object type]`，其中`type`是对象的类型。以下代码说明了这一点：

可以通过`toString()` 来获取每个对象的类型。为了每个对象都能通过 `Object.prototype.toString()` （避免出现 null.toString() 和 undefined.toString() 的情况）来检测，需要以 `Function.prototype.call()` 或者 `Function.prototype.apply()` 的形式来调用，传递要检查的对象作为第一个参数，称为`thisArg`。

> Object.prototype.toString.call(v);

|   类型    |      toString      |
| --------- | ------------------ |
| Undefined | [object Undefined] |
| Null      | [object Null]      |
| Boolean   | [object Boolean]   |
| Number    | [object Number]    |
| String    | [object String]    |
| Symbol    | [object Symbol]    |
| Object    | [object Object]    |
| -         |        -           |
| Function  | [object Function]  |
| Array     | [object Array]     |
| Date      | [object Date]      |
| RegExp    | [object RegExp]    |

### 参考
- [typeof](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/typeof) 
- [instanceof](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof) 
- [Object.prototype.toString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString)
- [JavaScript探秘：构造函数 Constructor](http://www.nowamagic.net/librarys/veda/detail/1642)
