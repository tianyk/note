RequestMappingHandlerMapping 分析
=========

HandlerMapping
---------
所有HandlerMapping的接口。在`DispatherServlet`中遍历所有的`HandlerMapping`获取第一个`getHandler`方法返回值不为空的`Handler`（HandlerExecutionChain对象实例）。

    HandlerExecutionChain getHandler(HttpServletRequest request) throws Exception;

RequestMappingHandlerMapping 
--------
类图关系  
![]('BaiduShurufa_2014-7-24_15-54-15.png')

**getHandler(...)**  
`getHandler(...)`方法实现定义在父类`AbstractHandlerMapping`中。里面通过调用`getHandlerInternal(...)`方法来获取一个handler实例。`getHandlerInternal(...)`方法是一个抽象方法，有子类`AbstractHandlerMethodMapping`实现。

	@Override
	public final HandlerExecutionChain getHandler(HttpServletRequest request) throws Exception {
		Object handler = getHandlerInternal(request);
		if (handler == null) {
			handler = getDefaultHandler(); // 可以通过setDefaultHandler注入
		}
		if (handler == null) {
			return null;
		}
		// Bean name or resolved handler?
		if (handler instanceof String) {
			String handlerName = (String) handler;
			handler = getApplicationContext().getBean(handlerName);
		}
		return getHandlerExecutionChain(handler, request);
	}


**getHandlerInternal(...)**

	@Override
	protected HandlerMethod getHandlerInternal(HttpServletRequest request) throws Exception {
		String lookupPath = getUrlPathHelper().getLookupPathForRequest(request);
		if (logger.isDebugEnabled()) {
			logger.debug("Looking up handler method for path " + lookupPath);
		}
		HandlerMethod handlerMethod = lookupHandlerMethod(lookupPath, request); // 通过请求路径匹配
		if (logger.isDebugEnabled()) {
			if (handlerMethod != null) {
				logger.debug("Returning handler method [" + handlerMethod + "]");
			}
			else {
				logger.debug("Did not find handler method for [" + lookupPath + "]");
			}
		}
		return (handlerMethod != null ? handlerMethod.createWithResolvedBean() : null);
	}

**getHandlerExecutionChain(...)**

	protected HandlerExecutionChain getHandlerExecutionChain(Object handler, HttpServletRequest request) {
		// 获取一个HandlerExecutionChain实例。
		// 如果不是HandlerExecutionChain类型的，则HandlerExecutionChain.handler = handler;
		HandlerExecutionChain chain =
			(handler instanceof HandlerExecutionChain) ?
				(HandlerExecutionChain) handler : new HandlerExecutionChain(handler);
		
		// 可以通过setInterceptors和adaptInterceptor来添加 
		chain.addInterceptors(getAdaptedInterceptors());
		
		// 根据URL再去匹配一次拦截器
		String lookupPath = urlPathHelper.getLookupPathForRequest(request);
		for (MappedInterceptor mappedInterceptor : mappedInterceptors) {
			if (mappedInterceptor.matches(lookupPath, pathMatcher)) {
				chain.addInterceptor(mappedInterceptor.getInterceptor());
			}
		}

		return chain;
	}

