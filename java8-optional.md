## Java Optional
`Optional`类是为了避免空指针问题在Java8中新增的一个类。`Optional`并不是真正避免避免空指针的，他只是用来`提醒`我们需要注意空指针问题，我们应该先调用它的`isPresent()`发放去检查一下实际的值是不是空。

函数返回值，我们时常会忘记判断返回值是不是空。如果返回值是`Optional<T>`类型，这会提醒我们去检查。
> 注意：如果返回值是`Optional<T>`类型，我们都会假定这个返回值不可能是`null`，不然`Optional`类就毫无意义了。
``` java
String str = doSomething();
if (null != str) System.out.print(str.get().length());

// 等同于如下

Optional<String> str = doSomething(); // 假定str不可能是null
if (str.isPresent()) System.out.print(str.get().length());
```

### Optional 类使用说明
[Java 8 Optional类深度解析](http://www.importnew.com/6675.html)

