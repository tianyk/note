---
title: java-redis-session.md
date: 2016-08-29 18:51:51
tags: 
---
### 思路
很多时候服务器需要用集群的方式进行部署，这种情况有有一个问题需要解决，那就是Session。根据Java EE规范，HttpSession默认是由各个厂商自己来实现的。例如Tomcat默认的HttpSession就是用用Map来实现的。这种默认的实现在集群环境中有很大的问题，无法实现Session共享。这种应用内Session有个很大的问题是Session太多时会占用太多的堆内存，合理的思路是应该找专业的第三方缓存来存放Session。
很多应用现在都在使用Redis或者Memcache来做缓存，我们也可以把Session放到这种专业缓存中。

如何放进去？这是个问题。

有一个类叫做`HttpServletRequestWrapper`，一看这个名字就知道它使用的是装饰器模式。我们可以从这里入手来用第三方缓存来存储Session。我们通过拦截器来把包装原来的`HttpServletRequest`和`HttpServletResponse`实现。
![](/images/QQ20160829-0@2x.jpg)
``` java
@Override
public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
    request = new HttpServletRedisRequest((HttpServletRequest) request);
    response = new HttpServletRedisResponse((HttpServletResponse) response, (HttpServletRequest) request);

    chain.doFilter(request, response);
}
```
> 我们可以在Filter中的`init`方法中初始化Redis连接池，在`destroy`方法中销毁连接

在`HttpServletRedisRequest`里面我们重写getSession方法，替换成自己的Session实现。
``` java
public class HttpServletRedisRequest extends HttpServletRequestWrapper {
    private HttpServletRequest request;
    private String sid;

    /**
     * Constructs a request object wrapping the given request.
     *
     * @param request
     * @throws IllegalArgumentException if the request is null
     */
    public HttpServletRedisRequest(HttpServletRequest request) {
        super(request);

        this.request = request;
        this.sid = request.getHeader(TOKEN_HEADER_NAME);
    }


    @Override
    public HttpSession getSession() {
        return this.getSession(true);
    }

    @Override
    public HttpSession getSession(boolean create) {
        if (sid != null && sid.length() > 0) {
            return sessionManage.get(sid, this.getServletContext());
        } else if (create) {
            HttpSession session = sessionManage.newSession(this.getServletContext());
            this.sid = session.getId();
            return session;
        } else {
            return null;
        }
    }

    @Override
    public String getRequestedSessionId() {
        return this.sid;
    }

    @Override
    public void setAttribute(String name, Object o) {
        super.setAttribute(name, o);
    }
}

```

在`HttpServletRedisResponse`中，把SessionID放到响应头或者Cookie中响应给浏览器。
``` java
public class HttpServletRedisResponse extends HttpServletResponseWrapper {
    private HttpServletRequest request;    
    private HttpServletResponse response;

    public HttpServletRedisResponse(HttpServletResponse response, HttpServletRequest request) {
       super(response);
       this.request = request;
       this.response = response;

       response.setHeader(TOKEN_HEADER_NAME, request.getRequestedSessionId());
    }
}

```

### 装饰器模式详解
这里的tomcat的HttpRequest实现是`org.apache.catalina.connector.RequestFacade`，这个类实现了`HttpServletRequest`接口。
在`HttpServletRequestWrapper`类中维护了一个要包装的request对象，而`HttpServletRequestWrapper`类实现了`HttpServletRequest`接口。在`HttpServletRequestWrapper`的实现中，默认都是调用包装对象的方法。我们创建的包装类继承了`HttpServletRequestWrapper`，在这里我们重写了`getSession`方法，这里当我们调用`getSession`方法时会调用自己写的实现。当我们调用其它方法时，会调用父类`HttpServletRequestWrapper`实现，而在父类中方法的实现却是调用的被包装类的实现。这样就实现了被包装对象的增强。

这里的核心是，这个包装类。它和被包装对象实现同一个接口，在他内部引用了一个被包装对象。默认首先是调用的被包装对象的实现，当子类重写包装类时，这时在调用就加入了自定义的实现。
