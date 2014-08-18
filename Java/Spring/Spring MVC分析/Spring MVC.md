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

7.  `ViewResolver`
视图解析器    

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

####请求转发的入口    
就像任何一个注册在容器中的Servlet一样，DispatcherServlet也是通过自己的service()方法来接收和转发Http请求到具体的doGet()或doPost()这些方法的。以一次典型的GET请求为例，经过HttpServlet基类中service()方法的委派，请求会被转发到doGet()方法中。doGet()方法，在DispatcherServlet的父类FrameworkServlet类中被覆写。
![539b40143a406c49961276c1.png](http://images.53788b3fdd428.d01.nanoyun.com/539b40143a406c49961276c1.png '539b40143a406c49961276c1.png')    
两者都接着调用`processRequest`方法。    
![539bb8733a405f98c6cdc236.png](http://images.53788b3fdd428.d01.nanoyun.com/539bb8733a405f98c6cdc236.png '539bb8733a405f98c6cdc236.png')    
前一部分是将当前请求的Locale对象和属性(首先备份`LocaleContext previousLocaleContext = LocaleContextHolder.getLocaleContext();`)，分别设置(`initContextHolders`)到LocaleContextHolder和RequestContextHolder这两个抽象类中的ThreadLocal对象中，也就是分别将这两个东西和请求线程做了绑定。接着去获取一个中央异步请求处理管理器`WebAsyncManager`，首先从request属性中查找`servletRequest.getAttribute(WEB_ASYNC_MANAGER_ATTRIBUTE)`如果没有着创建一个新的，并将其放置到request对象中。然后调用`doService(request, response)`方法。在doService()处理结束后，再恢复(`resetContextHolders(request, previousLocaleContext, previousAttributes)`)回请求前的LocaleContextHolder和RequestContextHolder，也即解除线程绑定。每次请求处理结束后，容器上下文都发布(`publishRequestHandledEvent(request, startTime, failureCause)`)了一个ServletRequestHandledEvent事件，你可以注册监听器来监听该事件。    
`doService()`方法由`DispatcherServlet`自己实现。    
![539bc9df3a404f46ff9fa55d.png](http://images.53788b3fdd428.d01.nanoyun.com/539bc9df3a404f46ff9fa55d.png '539bc9df3a404f46ff9fa55d.png')    
几个requet.setAttribute()方法的调用，将前面在初始化流程中实例化的对象设置到http请求的属性中，供下一步处理使用，其中有容器的上下文对象、本地化解析器等SpringMVC特有的编程元素。接着调用`doDispatch()`    

####请求转发的抽象描述
DispatcherServlet所接收的Http请求，经过层层转发，最终都是汇总到这个方法中来进行最后的请求分发和处理。    

	protected void doDispatch(HttpServletRequest request, HttpServletResponse response) throws Exception {
		HttpServletRequest processedRequest = request;
		HandlerExecutionChain mappedHandler = null;
		boolean multipartRequestParsed = false;

		WebAsyncManager asyncManager = WebAsyncUtils.getAsyncManager(request);

		try {
			ModelAndView mv = null;
			Exception dispatchException = null;

			try {
				processedRequest = checkMultipart(request);
				multipartRequestParsed = processedRequest != request;

				// Determine handler for the current request.
				mappedHandler = getHandler(processedRequest);
				if (mappedHandler == null || mappedHandler.getHandler() == null) {
					noHandlerFound(processedRequest, response);
					return;
				}

				// Determine handler adapter for the current request.
				HandlerAdapter ha = getHandlerAdapter(mappedHandler.getHandler());

				// Process last-modified header, if supported by the handler.
				String method = request.getMethod();
				boolean isGet = "GET".equals(method);
				if (isGet || "HEAD".equals(method)) {
					long lastModified = ha.getLastModified(request, mappedHandler.getHandler());
					if (logger.isDebugEnabled()) {
						String requestUri = urlPathHelper.getRequestUri(request);
						logger.debug("Last-Modified value for [" + requestUri + "] is: " + lastModified);
					}
					if (new ServletWebRequest(request, response).checkNotModified(lastModified) && isGet) {
						return;
					}
				}

				if (!mappedHandler.applyPreHandle(processedRequest, response)) {
					return;
				}

				try {
					// Actually invoke the handler.
					mv = ha.handle(processedRequest, response, mappedHandler.getHandler());
				}
				finally {
					if (asyncManager.isConcurrentHandlingStarted()) {
						return;
					}
				}

				applyDefaultViewName(request, mv);
				mappedHandler.applyPostHandle(processedRequest, response, mv);
			}
			catch (Exception ex) {
				dispatchException = ex;
			}
			processDispatchResult(processedRequest, response, mappedHandler, mv, dispatchException);
		}
		catch (Exception ex) {
			triggerAfterCompletion(processedRequest, response, mappedHandler, ex);
		}
		catch (Error err) {
			triggerAfterCompletionWithError(processedRequest, response, mappedHandler, err);
		}
		finally {
			if (asyncManager.isConcurrentHandlingStarted()) {
				// Instead of postHandle and afterCompletion
				mappedHandler.applyAfterConcurrentHandlingStarted(processedRequest, response);
				return;
			}
			// Clean up any resources used by a multipart request.
			if (multipartRequestParsed) {
				cleanupMultipart(processedRequest);
			}
		}
	}

1.  首先判断一下是不是`multipart/form-data`请求。如果是的将request包装为`MultipartHttpServletRequest `返回。    
2.  接下来就是调用`getHandler`遍历`HandlerMapping`,调用`getHandler`返回第一个一个`HandlerExecutionChain`。    
3.  然后调用`getHandlerAdapter`传入`HandlerExecutionChain#handler`来遍历HandlerAdapter获得第一个`supports(handler)`为`true`的HandlerAdapter（如果使用注解方式，此HandlerAdapter即为`RequestMappingHandlerAdapter`）。    
4.  接下来调用`getLastModified`来判断获得上次更新时间，然后判断有没有变化。没有变化则直接返回流程介绍，主要是使用缓存。    
5.  然后调用`applyPreHandle`，此时开始拦截器才`HandlerInterceptor`开始登场。依次调用其`preHandle`方法。    
![539bcefe3a400c3b2d2fd610.png](http://images.53788b3fdd428.d01.nanoyun.com/539bcefe3a400c3b2d2fd610.png '539bcefe3a400c3b2d2fd610.png')
6.  接下来一个重要的操作！调用`HandlerAdapter`的handler方法，返回一个`ModelAndView`。下面分析一下`RequestMappingHandlerAdapter`实现。    
![539bd21d3a40e5a384c0a4c8.png](http://images.53788b3fdd428.d01.nanoyun.com/539bd21d3a40e5a384c0a4c8.png '539bd21d3a40e5a384c0a4c8.png')    
`RequestMappingHandlerAdapter`使用父类`AbstractHandlerMethodAdapter`的实现。    
![539bd2cf3a4071777d6e5427.png](http://images.53788b3fdd428.d01.nanoyun.com/539bd2cf3a4071777d6e5427.png '539bd2cf3a4071777d6e5427.png')    
`handler`方法里面直接调用了`handleInternal`，同样`handleInternal`也是一个抽象方法`protected abstract ModelAndView handleInternal(HttpServletRequest request, HttpServletResponse response, HandlerMethod handlerMethod) throws Exception;`除了request、response对象外，它接收的第三个参数是`HandlerMethod`,即此时`HandlerExecutionChain#handler`的真实类型，`handleInternal`的具体实现还是有`RequestMappingHandlerAdapter`自己完成    
![539bd38b3a406c8d7959c319.png](http://images.53788b3fdd428.d01.nanoyun.com/539bd38b3a406c8d7959c319.png '539bd38b3a406c8d7959c319.png')    
首先来调用`checkAndPrepare`里面主要调用`applyCacheSeconds`来对cache支持`last-modified`。然后有一个`synchronizeOnSession`参数，是否同步此次请求，默认为`false`。然后调用`invokeHandleMethod(request, response, handlerMethod)`    

		private ModelAndView invokeHandleMethod(HttpServletRequest request,
				HttpServletResponse response, HandlerMethod handlerMethod) throws Exception {
	
			ServletWebRequest webRequest = new ServletWebRequest(request, response);
	
			WebDataBinderFactory binderFactory = getDataBinderFactory(handlerMethod);
			ModelFactory modelFactory = getModelFactory(handlerMethod, binderFactory);
			ServletInvocableHandlerMethod requestMappingMethod = createRequestMappingMethod(handlerMethod, binderFactory);
	
			ModelAndViewContainer mavContainer = new ModelAndViewContainer();
			mavContainer.addAllAttributes(RequestContextUtils.getInputFlashMap(request));
			modelFactory.initModel(webRequest, mavContainer, requestMappingMethod);
			mavContainer.setIgnoreDefaultModelOnRedirect(this.ignoreDefaultModelOnRedirect);
	
			AsyncWebRequest asyncWebRequest = WebAsyncUtils.createAsyncWebRequest(request, response);
			asyncWebRequest.setTimeout(this.asyncRequestTimeout);
	
			final WebAsyncManager asyncManager = WebAsyncUtils.getAsyncManager(request);
			asyncManager.setTaskExecutor(this.taskExecutor);
			asyncManager.setAsyncWebRequest(asyncWebRequest);
			asyncManager.registerCallableInterceptors(this.callableInterceptors);
			asyncManager.registerDeferredResultInterceptors(this.deferredResultInterceptors);
	
			if (asyncManager.hasConcurrentResult()) {
				Object result = asyncManager.getConcurrentResult();
				mavContainer = (ModelAndViewContainer) asyncManager.getConcurrentResultContext()[0];
				asyncManager.clearConcurrentResult();
	
				if (logger.isDebugEnabled()) {
					logger.debug("Found concurrent result value [" + result + "]");
				}
				requestMappingMethod = requestMappingMethod.wrapConcurrentResult(result);
			}
	
			requestMappingMethod.invokeAndHandle(webRequest, mavContainer);
	
			if (asyncManager.isConcurrentHandlingStarted()) {
				return null;
			}
	
			return getModelAndView(mavContainer, modelFactory, webRequest);
		}    

首先得到一个`ServletInvocableHandlerMethod`里面除了`handlerMethod`还有`HandlerMethodArgumentResolverComposite`和`HandlerMethodReturnValueHandlerComposite`用于处理方法参数及返回类型。还有一个类型`ParameterNameDiscoverer`。
> 通过Java标准Reflection API是取不到方法参数的名称的，要达到这个目的，除了可以通过读取class文件中的debug信息（可能在compile的时候没有启用）， 也可以使用类似ASM这样的类库获得， 不过， Spring framework中已经对读取方法参数名称这一功能进行了抽象和实现，我们可以直接拿过来用， 这一抽象接口为org.springframework.core.ParameterNameDiscoverer。
> ParameterNameDiscoverer主要有三个实现类：
> LocalVariableTableParameterNameDiscoverer
> PrioritizedParameterNameDiscoverer
> AspectJAdviceParameterNameDiscoverer    
> [参考](http://spring21.iteye.com/blog/456628)

到这一步已经获取处理本次请求的Controller方法信息。    
接下来是获取一个`ModelAndViewContainer`对象，首先从request对象中查找`request.getAttribute(DispatcherServlet.INPUT_FLASH_MAP_ATTRIBUTE)`，放置到`ModelAndViewContainer`中。然后ModelFactory的initModel方法准备模型数据。

		Map<String, ?> attributesInSession = this.sessionAttributesHandler.retrieveAttributes(request);
		//1.1、将与@SessionAttributes注解相关的会话对象放入模型数据中
		mavContainer.mergeAttributes(attributesInSession);
		//1.2、调用@ModelAttribute方法添加表单引用对象
		invokeModelAttributeMethods(request, mavContainer);
		//1.3、验证模型数据中是否包含@SessionAttributes注解相关的会话对象，不包含抛出异常
		for (String name : findSessionAttributeArguments(handlerMethod)) {
			if (!mavContainer.containsAttribute(name)) {
		        //1.4、此处防止在@ModelAttribute注解方法又添加了会话对象
		        //如在@ModelAttribute注解方法调用session.setAttribute("user", new UserModel());
				Object value = this.sessionAttributesHandler.retrieveAttribute(request, name);
				if (value == null) {
					throw new HttpSessionRequiredException("Expected session attribute '" + name + "'");
				}
				mavContainer.addAttribute(name, value);
		} 

ModelFactory.invokeModelAttributeMethods

		private void invokeModelAttributeMethods(NativeWebRequest request, ModelAndViewContainer mavContainer)
				throws Exception {
	
			for (InvocableHandlerMethod attrMethod : this.attributeMethods) {
				String modelName = attrMethod.getMethodAnnotation(ModelAttribute.class).value();
				 //1.2.1、如果模型数据中包含同名数据则不再添加  
				if (mavContainer.containsAttribute(modelName)) {
					continue;
				}
				
				//1.2.2、调用@ModelAttribute注解方法并将返回值添加到模型数据中，此处省略实现代码
				Object returnValue = attrMethod.invokeForRequest(request, mavContainer);
				
				if (!attrMethod.isVoid()){
					String returnValueName = getNameForReturnValue(returnValue, attrMethod.getReturnType());
					if (!mavContainer.containsAttribute(returnValueName)) {
						mavContainer.addAttribute(returnValueName, returnValue);
					}
				}
			}
		}

接下来是对异步请求的支持，设置timeout等一系列操作。接下来`requestMappingMethod.invokeAndHandle(webRequest, mavContainer)` 调用功能处理方法。    
![539c50a23a40f981a9338916.png](http://images.53788b3fdd428.d01.nanoyun.com/539c50a23a40f981a9338916.png '539c50a23a40f981a9338916.png')    
首先调用我们Controller中处理逻辑的方法`Object returnValue = invokeForRequest(webRequest, mavContainer, providedArgs);`    


    



