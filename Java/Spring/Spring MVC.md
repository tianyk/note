##Spring MVC分析总结

###主要类及接口
1.  `DispatcherServlet`   
前端转发器

2.  `HandlerMapping` 主要实现类（Annotation方式）   
从Spring 2.5开始使用`DefaultAnnotationHandlerMapping`，Spring 3.1以后`RequestMappingHandlerMapping`取代原来的`DefaultAnnotationHandlerMapping`。这两个用来开启支持`@Controller`注解。备注（`DefaultAnnotationHandlerMapping`只能返回Controller对象，不会映射到Controller中的方法级别）    
![539a70282d623a9b76e4ca49.png](http://images.53788b3fdd428.d01.nanoyun.com/539a70282d623a9b76e4ca49.png '539a70282d623a9b76e4ca49.png')   

3.  `HandlerInterceptor`    
![539a6f8b2d62fea03d06e31d.png](http://images.53788b3fdd428.d01.nanoyun.com/539a6f8b2d62fea03d06e31d.png '539a6f8b2d62fea03d06e31d.png')    

4.  `HandlerAdapter` 主要实现类（Annotation方式）    
从Spring 2.5开始使用`AnnotationMethodHandlerAdapter`，Spring 3.1以后使用`RequestMappingHandlerAdapter`取代`AnnotationMethodHandlerAdapter`。这两个注解用来开启对`@RequestMapping`的支持。    
![539a76af2d6226a72ac5ccac.png](http://images.53788b3fdd428.d01.nanoyun.com/539a76af2d6226a72ac5ccac.png '539a76af2d6226a72ac5ccac.png')    

5.  `HandlerExecutionChain `   
`HandlerMapping`接口中定义的唯一方法`getHandler(HttpServletRequest request)`方法的返回值即为`HandlerExecutionChain`类型

6.  `ModelAndView`    
它是SpringMVC中对视图和数据的一个聚合类。其中的视图，就是由SpringMVC的最后一个核心接口`View`所抽象

###主要类及接口之间的关系
1.  `DispatcherServlet`中有一个`HandlerMapping`和`HandlerAdapter`实现类的列表。    
![539a695f2d627aa457f62161.jpg](http://images.53788b3fdd428.d01.nanoyun.com/539a695f2d627aa457f62161.jpg '539a695f2d627aa457f62161.jpg')    

2.  `DispatherServlet`通过调用`getHandler(HttpServletRequest request)`遍历`HandlerMapping`，调用`HandlerMapping`的`getHandler(HttpServletRequest request)`方法返回一个`HandlerExecutionChain`。返回第一个不为空的`HandlerExecutionChain`。    
![539a6c0c2d62142faa71e41d.png](http://images.53788b3fdd428.d01.nanoyun.com/539a6c0c2d62142faa71e41d.png '539a6c0c2d62142faa71e41d.png')    
`HandlerMapping`的实现`RequestMappingHandlerMapping`分析。`RequestMappingHandlerMapping`的`getHandler`有其间接父类`AbstractHandlerMapping`实现。    
![539a7e3f2d62f431b0b7419a.png](http://images.53788b3fdd428.d01.nanoyun.com/539a7e3f2d62f431b0b7419a.png '539a7e3f2d62f431b0b7419a.png')  
里面主要有两个方法`protected abstract Object getHandlerInternal(HttpServletRequest request) throws Exception;`用来返回一个`handler`，子类来实现其逻辑。`RequestMappingHandlerMapping`没有实现此方法，具体实现有间接父类`AbstractHandlerMethodMapping`实现。    
![539a80d92d62853e3dff49bf.png](http://images.53788b3fdd428.d01.nanoyun.com/539a80d92d62853e3dff49bf.png '539a80d92d62853e3dff49bf.png')    
它的返回值是一个`HandlerMethod`对象。`lockupPath`是请求的url。eg:请求`http://movie.douban.com/subject/112345`那么`lockupPaht='subject/112345'`。接下来调用`lookupHandlerMethod(String lookupPath, HttpServletRequest request)`返回一个`HandlerMethod`。    
![539ab71e2d620dbade3ac9b2.png](http://images.53788b3fdd428.d01.nanoyun.com/539ab71e2d620dbade3ac9b2.png '539ab71e2d620dbade3ac9b2.png')  
首先从`urlMap`来匹配，如果没有匹配到再从`handlerMethods`中查找匹配。匹配的记录放置到`Match`类型的列表`matches`中。排序后取出第一个匹配记录`bestMatch`，返回其`handlerMethod`属性。
取出来`handler`对象以后，接着调用`getHandlerExecutionChain(handler, request)`，配置一些`HandlerInterceptor`,封装成一个`HandlerExecutionChain`返回。       
![539abc522d621ca5c938806f.png](http://images.53788b3fdd428.d01.nanoyun.com/539abc522d621ca5c938806f.png '539abc522d621ca5c938806f.png')    
`urlMap`

	    {    
		    /simple=[{[/simple],methods=[],params=[],headers=[],consumes=[],produces=[],custom=[]}],     
		    /simple/revisited=[{[/simple/revisited],methods=[GET],params=[],headers=[],consumes=[],produces=[text/plain],custom=[]}]    
	    }   
`handlerMethods`

		{    
			{[/simple],methods=[],params=[],headers=[],consumes=[],produces=[],custom=[]}=public java.lang.String org.springframework.samples.mvc.simple.SimpleController.simple(),     
			{[/simple/revisited],methods=[GET],params=[],headers=[],consumes=[],produces=[text/plain],custom=[]}=public java.lang.String org.springframework.samples.mvc.simple.SimpleControllerRevisited.simple()    
		}     
由代码可以看出，经过`RequestMappingHandlerMapping`的`getHandler`返回的`HandlerExecutionChain`的`handler`实际是一个`HandlerMethod`对象。此对象的实际上是我们`Controller`中对应处理方法的描述。

3.  `HandlerExecutionChain`中有一个`HandlerInterceptor`的类表,一个拦截器链。`HandlerExecutionChain`中封装`handler`对象就是用`@Controller`注解标识的类的一个实例。    
![539a6de32d62f0e26b208343.png](http://images.53788b3fdd428.d01.nanoyun.com/539a6de32d62f0e26b208343.png '539a6de32d62f0e26b208343.png')    

4.  `DispatcherServlet`通过调用`getHandlerAdapter(Object handler)`遍历`HandlerAdapter`。其中参数`handler`为`HandlerExecutionChain.handler HandlerExecutionChain.getHandler()`。返回第一个`supports(Object handler)`方法返回`true`的`HandlerAdapter`。    
![539a75e42d622be4dd6ecdf0.png](http://images.53788b3fdd428.d01.nanoyun.com/539a75e42d622be4dd6ecdf0.png '539a75e42d622be4dd6ecdf0.png')   

5.  `HandlerAdapter`通过调用`handle(HttpServletRequest request, HttpServletResponse response, Object handler)`方法，返回一个`ModelAndView`对象。它是SpringMVC中对视图和数据的一个聚合类。其中的视图，就是由SpringMVC的最后一个核心接口`View`所抽象。所有的数据，最后会作为一个Map对象传递到`View`实现类中的`render`方法，调用这个`void render(Map<String, ?> model, HttpServletRequest request, HttpServletResponse response)`方法，就完成了视图到响应的渲染。这个`View`实现类，就是来自`HandlerAdapter`中的`handle`方法的返回结果。

###ContextLoaderListener分析
1.  Spring容器和SpringMVC的初始化过程
`ContextLoaderListener`实现了`ServletContextListener`接口，Servlet容器启动时会初始化一个`WebApplicationContext`的实现类，并将其作为`ServletContext`的一个属性设置到Servlet环境中。    
`ServletContextListener#contextInitialized(ServletContextEvent event)`
![539ac9d22d629640292183c0.png](http://images.53788b3fdd428.d01.nanoyun.com/539ac9d22d629640292183c0.png '539ac9d22d629640292183c0.png')     
`initWebApplicationContext(ServletContext servletContext)`    
![539acc0b2d62cf99db8ea5fc.png](http://images.53788b3fdd428.d01.nanoyun.com/539acc0b2d62cf99db8ea5fc.png '539acc0b2d62cf99db8ea5fc.png')     
`String ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE = WebApplicationContext.class.getName() + ".ROOT";`    
ContextLoaderListener所初始化的这个Spring容器上下文，被称为根上下文。    

###DispatcherServlet分析
SpringMVC在`DispatcherServlet`的初始化过程中，同样会初始化一个`WebApplicationContext`的实现类，作为自己独有的上下文，这个独有的上下文，会将上面的根上下文作为自己的父上下文，来存放SpringMVC的配置元素，然后同样作为ServletContext的一个属性，被设置到ServletContext中。    

####DispatcherServlet初始化    
![539b28613a40d016d46a8a82.png](http://images.53788b3fdd428.d01.nanoyun.com/539b28613a40d016d46a8a82.png '539b28613a40d016d46a8a82.png')    
`DispatcherServlet`的初始化入口方法`init()`定义在父类`HttpServletBean`中，`HttpServletBean`直接继承`HttpServlet`。在`init()`方法中有一个主要调用了一个方法`initServletBean()`。在`HttpServletBean`中它是一个抽象方法，有子类去实现其逻辑。在`FrameworkServlet`中对其进行了实现，其中最主要的操作是`this.webApplicationContext = initWebApplicationContext();`调用`initWebApplicationContext()`来获得一个`WebApplicationContext`对象。方法的逻辑如下：   
	1.  获取由`ContextLoaderListener`初始化并注册在`ServletContext`中的根上下文，记为`rootContext`     
	2.  如果`webApplicationContext`已经不为空，表示这个Servlet类是通过编程式注册到容器中的（Servlet 3.0+中的ServletContext.addServlet() ），上下文也由编程式传入。若这个传入的上下文还没被初始化，将rootContext上下文设置为它的父上下文，然后将其初始化，否则直接使用。    
	3.  通过wac变量的引用是否为null，判断第2步中是否已经完成上下文的设置（即上下文是否已经用编程式方式传入），如果wac==null成立，说明该Servlet不是由编程式注册到容器中的。此时以`contextAttribute`属性的值为键，在ServletContext中查找上下文，查找得到，说明上下文已经以别的方式初始化并注册在contextAttribute下，直接使用。    
	4.  检查wac变量的引用是否为null，如果wac==null成立，说明2、3两步中的上下文初始化策略都没成功，此时调用`createWebApplicationContext(rootContext)`，建立一个全新的以`rootContext`(`setParent(parent)`)为父上下文的上下文，作为SpringMVC配置元素的容器上下文。大多数情况下我们所使用的上下文，就是这个新建的上下文。    
	5.  以上三种初始化上下文的策略，都会回调onRefresh(ApplicationContext context)方法（回调的方式根据不同策略有不同），`onRefresh`方法在`DispatcherServlet`类中被覆写，以上面得到的上下文为依托，完成SpringMVC中默认实现类的初始化。    
	6.  最后，将这个上下文发布到ServletContext中，也就是将上下文以一个和Servlet类在web.xml中注册名字有关的值为键，设置为ServletContext的一个属性。你可以通过改变publishContext的值来决定是否发布到ServletContext中，默认为true。   
![539b2f7b3a404eb5a36a9f5d.png](http://images.53788b3fdd428.d01.nanoyun.com/539b2f7b3a404eb5a36a9f5d.png '539b2f7b3a404eb5a36a9f5d.png')    
`FrameworkServlet`这个类，在SpringMVC类体系中的设计目的，它是用来抽离出建立`WebApplicationContext`上下文这个过程的。

####DispatcherServlet策略初始化
在`DispatcherServlet#onRefresh(ApplicationContext context)`直接调用`initStrategies(context)`来初始化各种策略。    
![539b32fc3a40d89f8cd85200.png](http://images.53788b3fdd428.d01.nanoyun.com/539b32fc3a40d89f8cd85200.png '539b32fc3a40d89f8cd85200.png')    
	1.  **initMultipartResolver** 通过`this.multipartResolver = context.getBean(MULTIPART_RESOLVER_BEAN_NAME, MultipartResolver.class);`获得是一个`MultipartResolver`实现，用来处理文件上传    
	2.  **initLocaleResolver** 用来处理本地化    
	3.  **initThemeResolver** 用来处理主题    
	4.  **initHandlerMappings** 初始化`handlerMappings`
	![539b38443a4065d7fd2fa97d.png](http://images.53788b3fdd428.d01.nanoyun.com/539b38443a4065d7fd2fa97d.png '539b38443a4065d7fd2fa97d.png')    
	`detectAllHandlerMappings`变量默认为true，所以在初始化HandlerMapping接口默认实现类的时候，会把上下文中所有HandlerMapping类型的Bean都注册在handlerMappings这个List变量中,并对其进行排序（降序`AbstractHandlerMapping#order = Integer.MAX_VALUE`，order对getHandler的结果会有所影响）。如果你手工将其设置为false，那么将尝试获取名为`handlerMapping	`的Bean，新建一个只有一个元素的List，将其赋给handlerMappings。如果经过上面的过程，handlerMappings变量仍为空，那么说明你没有在上下文中提供自己HandlerMapping类型的Bean定义。此时，SpringMVC将采用默认初始化策略来初始化handlerMappings。`DefaultStrategies`的信息在`DispatcherServlet.properties`配置。    
	5.  **initHandlerAdapters** 初始化`handlerAdapters` 具体实现和`initHandlerMappings(context)`相同    
	6.  **initHandlerExceptionResolvers** 处理器异常解析，可以将异常映射到相应的统一错误界面，从而显示用户友好的界面（而不是给用户看到具体的错误信息）    
	7.  **initRequestToViewNameTranslator** 当处理器没有返回逻辑视图名等相关信息时，自动将请求URL映射为逻辑视图名；    
	8.  **initViewResolvers** ViewResolver将把逻辑视图名解析为具体的View，通过这种策略模式，很容易更换其他视图技术；如InternalResourceViewResolver将逻辑视图名映射为jsp视图     
	9.  **initFlashMapManager** 用于管理FlashMap的策略接口，FlashMap用于存储一个请求的输出，当进入另一个请求时作为该请求的输入，通常用于重定向场景    
> Flash 属性 和 RedirectAttribute：通过FlashMap存储一个请求的输出，当进入另一个请求时作为该请求的输入，典型场景如重定向（POST-REDIRECT-GET模式，1、POST时将下一次需要的数据放在FlashMap；2、重定向；3、通过GET访问重定向的地址，此时FlashMap会把1放到FlashMap的数据取出放到请求中，并从FlashMap中删除；从而支持在两次请求之间保存数据并防止了重复表单提交）。
> Spring Web MVC提供FlashMapManager用于管理FlashMap，默认使用SessionFlashMapManager，即数据默认存储在session中。

###请求转发的入口    
就像任何一个注册在容器中的Servlet一样，DispatcherServlet也是通过自己的service()方法来接收和转发Http请求到具体的doGet()或doPost()这些方法的。以一次典型的GET请求为例，经过HttpServlet基类中service()方法的委派，请求会被转发到doGet()方法中。doGet()方法，在DispatcherServlet的父类FrameworkServlet类中被覆写。
![539b40143a406c49961276c1.png](http://images.53788b3fdd428.d01.nanoyun.com/539b40143a406c49961276c1.png '539b40143a406c49961276c1.png')    
