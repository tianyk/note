SpringMVC 流程
=============

服务器启动阶段（`DispatcherServlet`初始化阶段）
-------------

1. 启动后`ContextLoaderListener`首先会在初始化方法`contextInitialized(ServletContextEvent event)`中调用`initWebApplicationContext(event.getServletContext())`来在创建一个`WebApplicationContext`。并将其作为`ServletContext`的一个属性设置到Servlet环境中。这个上下文对象为跟上下文对象。       
**ContextLoader#initWebApplicationContext(ServletContext servletContext)**

    	servletContext.setAttribute(WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE, this.context);


2.  `DispatcherServlet`初始化过程中中也会创建一个`WebApplicationContext`对象，并将`ContextLoaderListener`创建的上下文对象作为父上下文。同样也会将其作为`ServletContext`的一个属性。    
**FrameworkServlet#initWebApplicationContext()**

		String attrName = getServletContextAttributeName();    
		getServletContext().setAttribute(attrName, wac);
创建完上下文对象后还会调用`onRefresh`进行一系列初始化工作。    
**DispatcherServlet#initStrategies(ApplicationContext context)**

		initMultipartResolver(context); 
		initLocaleResolver(context);
		initThemeResolver(context);
		initHandlerMappings(context);
		initHandlerAdapters(context);
		initHandlerExceptionResolvers(context);
		initRequestToViewNameTranslator(context);
		initViewResolvers(context);
		initFlashMapManager(context);
这几个init方法的实现思路基本相同，首先从Bean容器中过的特定类型的类的实例。如果没有找到，则使用默认配置。即`DispatcherServlet.properties`中的配置。    
**DispatcherServlet#initHandlerAdapters(ApplicationContext context)**

		private void initHandlerAdapters(ApplicationContext context) {
			this.handlerAdapters = null;
	
			if (this.detectAllHandlerAdapters) {
				// Find all HandlerAdapters in the ApplicationContext, including ancestor contexts.
				Map<String, HandlerAdapter> matchingBeans =
						BeanFactoryUtils.beansOfTypeIncludingAncestors(context, HandlerAdapter.class, true, false);
				if (!matchingBeans.isEmpty()) {
					this.handlerAdapters = new ArrayList<HandlerAdapter>(matchingBeans.values());
					// We keep HandlerAdapters in sorted order.
					// 排序后对后来的getHandlerAdapter的结果会有所影响
					OrderComparator.sort(this.handlerAdapters);
				}
			}
			else {
				try {
					HandlerAdapter ha = context.getBean(HANDLER_ADAPTER_BEAN_NAME, HandlerAdapter.class);
					this.handlerAdapters = Collections.singletonList(ha);
				}
				catch (NoSuchBeanDefinitionException ex) {
					// Ignore, we'll add a default HandlerAdapter later.
				}
			}
	
			// Ensure we have at least some HandlerAdapters, by registering
			// default HandlerAdapters if no other adapters are found.
			if (this.handlerAdapters == null) {
				this.handlerAdapters = getDefaultStrategies(context, HandlerAdapter.class);
				if (logger.isDebugEnabled()) {
					logger.debug("No HandlerAdapters found in servlet '" + getServletName() + "': using default");
				}
			}
		}

经过一系列的init方法后`DispatcherServlet`正式初始化完成。


请求-响应阶段
--------------
1.  发起请求    
`DispatcherServlet`是一个标准的Servlet。当我们发送一个GET请求后，会有`DispatcherServlet`的`doGet(HttpServletRequest request, HttpServletResponse response)`来处理。    
**FrameworkServlet#doGet(HttpServletRequest request, HttpServletResponse response)**    
`processRequest(request, response);`在`processRequest`这一阶段主要调用`doService`,然后是`doDispatch`。
2.  处理请求   
在`doDispatch`主要有一下几步操作。    
1) 首先调用`getHandler`首先获得一个`HandlerMapping`对象，然后调用其`getHandler`方法返回一个`HandlerExecutionChain`对象。具体查看`HandlerMapping`实现类，例如`RequestMappingHandlerMapping`    
**DispatcherServlet#getHandler(HttpServletRequest request)**

		protected HandlerExecutionChain getHandler(HttpServletRequest request) throws Exception {
			for (HandlerMapping hm : this.handlerMappings) {
				if (logger.isTraceEnabled()) {
					logger.trace(
							"Testing handler map [" + hm + "] in DispatcherServlet with name '" + getServletName() + "'");
				}
				HandlerExecutionChain handler = hm.getHandler(request);
				if (handler != null) {
					return handler;
				}
			}
			return null;
		}
以`RequestMethodHandlerMapping`为例，此对象中主要包含一个`HandlerMethod`实例及处理此请求的拦截器。    
2) 调用`getHandlerAdapter`来得到第一个`supports(handler)`为`true`的`HandlerAdapter`。    
**DispatcherServlet#getHandlerAdapter(Object handler)**

		protected HandlerAdapter getHandlerAdapter(Object handler) throws ServletException {
			for (HandlerAdapter ha : this.handlerAdapters) {
				if (logger.isTraceEnabled()) {
					logger.trace("Testing handler adapter [" + ha + "]");
				}
				if (ha.supports(handler)) {
					return ha;
				}
			}
			throw new ServletException("No adapter for handler [" + handler +
					"]: The DispatcherServlet configuration needs to include a HandlerAdapter that supports this handler");
		}
3) 然后调用`HandlerExecutionChain#applyPreHandle(...)`开始应用拦截器，一个一个调用其`preHandle`方法。    
**HandlerExecutionChain#applyPreHandle(HttpServletRequest request, HttpServletResponse response)**

		boolean applyPreHandle(HttpServletRequest request, HttpServletResponse response) throws Exception {
			if (getInterceptors() != null) {
				for (int i = 0; i < getInterceptors().length; i++) {
					HandlerInterceptor interceptor = getInterceptors()[i];
					if (!interceptor.preHandle(request, response, this.handler)) {
						triggerAfterCompletion(request, response, null);
						return false;
					}
					this.interceptorIndex = i;
				}
			}
			return true;
		}   
4) 接着调用`HandlerAdapter.handle(...)`得到一个`ModelAndView`对象,里面封装了数据对象及具体的View对象。具体实现需要查看`HandlerAdapter`实现类。例如：`RequestMappingHandlerAdapter`,HandlerAdapter里面有一些`HandlerMethodArgumentResolver`和`HandlerMethodReturnValueHandler`来负责对方法参数及返回类型的解析。    
5) 然后调用`HandlerExecutionChain#applyPostHandle(...)`再次应用拦截器，调用其`postHandle`方法。    
**HandlerExecutionChain#applyPreHandleapplyPostHandle(HttpServletRequest request, HttpServletResponse response, ModelAndView mv)**    

		void applyPostHandle(HttpServletRequest request, HttpServletResponse response, ModelAndView mv) throws Exception {
			if (getInterceptors() == null) {
				return;
			}
			for (int i = getInterceptors().length - 1; i >= 0; i--) {
				HandlerInterceptor interceptor = getInterceptors()[i];
				interceptor.postHandle(request, response, this.handler, mv);
			}
		}
6) 最后一步`processDispatchResult`处理结果，相应给客户端。在`processDispatchResult`首先调用了`render`方法    
**DispatcherServlet#processDispatchResult(HttpServletRequest request, HttpServletResponse response, HandlerExecutionChain mappedHandler, ModelAndView mv, Exception exception)**

		render(mv, request, response);
最后是`HandlerExecutionChain#triggerAfterCompletion(...)`,调用拦截器的`afterCompletion`方法。拦截器处理流程至此结束。    
分析一下`reader`方法。首先调用`resolveViewName`，在里面先遍历所有的`ViewResolver`实例,调用其`resolveViewName`方法，返回第一不为空的`View`实例。    
**DispatcherServlet#resolveViewName(String viewName, Map<String, Object> model, Locale locale, HttpServletRequest request)**

		protected View resolveViewName(String viewName, Map<String, Object> model, Locale locale,
				HttpServletRequest request) throws Exception {
	
			for (ViewResolver viewResolver : this.viewResolvers) {
				View view = viewResolver.resolveViewName(viewName, locale);
				if (view != null) {
					return view;
				}
			}
			return null;
		}
`ViewResolver#resolveViewName`具体可参看`InternalResourceViewResolver`实现。    
最后调用`View`的`render`方法。`render(Map<String, ?> model, HttpServletRequest request, HttpServletResponse response)`方法的具体实现可参考`View`实现类`JstlView`。   
在`JstlView`中主要是调用`renderMergedOutputModel`，首先Model对象数据放置到`request`中，然后得到一个`RequestDispatcher`,最后调用其`forward`方法响应给客户端。

至此一个请求-响应过程结束。

