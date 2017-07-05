`typeof`和`instanceof`是JavaScript中的两个操作符。

### typeof
typeof操作符返回一个字符串,表示未经求值的操作数(unevaluated operand)的类型。
下面的表格总结了 typeof 可能的返回值。
![](images/QQ20160824-0@2x.jpg)
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

typeof new Date() === 'object'; // true
typeof new Boolean(true) === 'object'; // true
typeof new Number(1) ==== 'object'; // true
typeof new String("abc") === 'object'; // true
```

### instanceof
instanceof运算符可以用来判断某个构造函数的prototype属性所指向的對象是否存在于另外一个要检测对象的原型链上。

instanceof运算符希望左操作数是一个对象，右操作数标识对象的类。如果左侧的对象是右侧类的实例，则表达式返回true；否则返回false。

为了计算表达式o instanceof f，JavaScript首先计算f.prototype，然后在原型链中查找o，如果找到，那么o是f（或者f的父类）的一个实例，表达式返回true。如果f.prototype不在o的原型链中的话，那么o就不是f的实例，instanceof返回false。

原型链
![](images/1374057134_4751.png)

JavaScript中有个原型链的概念，这个`链`一般是通过对象的`__proto__`属性来建立的。`prototype`代表原型，`prototype`对象都有一个`constructor`属性，指向它的构造函数。这里的instanceof就是去判断是否在一条原型链上。

### Object.toString
> Object.prototype.toString.call(v);

|类型|toString|
|---|---|
|Undefined | [object Undefined] |
|Null | [object Null] |
|Boolean | [object Boolean] |
|Number | [object Number] |
|String | [object String] |
|Symbol| [object Symbol] |
|Object| [object Object] |
|-| - |
|Function| [object Function] |
|Array| [object Array] |
|Date| [object Date] |
|RegExp| [object RegExp] |





### 参考
[【1】](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/typeof) [【2】](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof) [【3】](http://www.nowamagic.net/librarys/veda/detail/1642)
