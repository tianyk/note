HandlerAdapter 分析
===============	


HandlerAdapter
--------------
	public interface HandlerAdapter {
		// 传入参数为HandlerExecutionChain#handler 
		boolean supports(Object handler);
		
		ModelAndView handle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception;
	
		long getLastModified(HttpServletRequest request, Object handler);
	
	}


RequestMappingHandlerAdapter
---------------

1.  继承关系    
![539bd21d3a40e5a384c0a4c8.png](http://images.53788b3fdd428.d01.nanoyun.com/539bd21d3a40e5a384c0a4c8.png)
2.  supports方法实现    
**AbstractHandlerMethodAdapter#supports(Object handler)**

		public final boolean supports(Object handler) {
			return handler instanceof HandlerMethod && supportsInternal((HandlerMethod) handler);
		}
**RequestMappingHandlerAdapter#supportsInternal(HandlerMethod handlerMethod)**

		protected boolean supportsInternal(HandlerMethod handlerMethod) {
			return true;
		}
supportsInternal方法只返回`true`，如果handler是`HandlerMethod`类型则返回`true`。即支持对此handler的处理。
3.  handle方法实现    
**AbstractHandlerMethodAdapter#handle(HttpServletRequest request, HttpServletResponse response, Object handler)**

		public final ModelAndView handle(HttpServletRequest request, HttpServletResponse response, Object handler)
				throws Exception {
			return handleInternal(request, response, (HandlerMethod) handler);
		}
子类需要自己去实现`handleInternal`的逻辑    
首先进行缓存控制。通过`cacheSecondsForSessionAttributeHandlers`设置缓存时间。`< 0`不做设置，`= 0`禁用缓存，`> 0`缓存。默认为0。具体查看：    
	> 1、cacheSeconds = 0时，则将设置如下响应头数据：
	> Pragma：no-cache             // HTTP 1.0的不缓存响应头
	> Expires：1L                  // useExpiresHeader=true时，HTTP 1.0
	> Cache-Control ：no-cache      // useCacheControlHeader=true时，HTTP 1.1
	> Cache-Control ：no-store       // useCacheControlNoStore=true时，该设置是防止Firefox缓存
	> 
	> 2、cacheSeconds > 0时，则将设置如下响应头数据：
	> Expires：System.currentTimeMillis() + cacheSeconds * 1000L    // useExpiresHeader=true时，HTTP 1.0
	> Cache-Control ：max-age=cacheSeconds                    // useCacheControlHeader=true时，HTTP 1.1
	> 
	> 3、cacheSeconds<0时，则什么都不设置，即保留上次的缓存设置。 		
接着调用`invokeHandleMethod`方法，`synchronizeOnSession`表示该控制器是否在执行时同步session，从而保证该会话的用户串行访问该控制器。  
在`invokeHandleMethod`中对实际方法的调用主要是同`ServletInvocableHandlerMethod`处理的。它里面有两个主要对象`HandlerMethodArgumentResolverComposite`处理方法参数，`HandlerMethodReturnValueHandlerComposite`处理方法返回类型。这来两个类型都各自维护着`HandlerMethodArgumentResolver`和`HandlerMethodReturnValueHandler`类型的列表。此列表在`HandlerAdapter`中配置。    
以`argumentResolvers`为例，每次调用其`supportsParameter`来匹配参数解析。    

		MethodParameter[] parameters = getMethodParameters();
		Object[] args = new Object[parameters.length];
		for (int i = 0; i < parameters.length; i++) {
			MethodParameter parameter = parameters[i];
			parameter.initParameterNameDiscovery(this.parameterNameDiscoverer);
			GenericTypeResolver.resolveParameterType(parameter, getBean().getClass());
			args[i] = resolveProvidedArgument(parameter, providedArgs);
			if (args[i] != null) {
				continue;
			}
			if (this.argumentResolvers.supportsParameter(parameter)) {
				try {
					args[i] = this.argumentResolvers.resolveArgument(
							parameter, mavContainer, request, this.dataBinderFactory);
					continue;
				}
				catch (Exception ex) {
					if (logger.isTraceEnabled()) {
						logger.trace(getArgumentResolutionErrorMessage("Error resolving argument", i), ex);
					}
					throw ex;
				}
			}
			if (args[i] == null) {
				String msg = getArgumentResolutionErrorMessage("No suitable resolver for argument", i);
				throw new IllegalStateException(msg);
			}
		}
首先来循环遍历参数列表。在supportsParameter方法里面继续遍历`argumentResolvers`调用其`supportsParameter`返回第一个为true的HandlerMethodArgumentResolver。然后调用其`resolveArgument`方法解析参数。    
再看一下对返回类型的解析。首先调用`HandlerMethodReturnValueHandlerComposite#handleReturnValue`,在里面调用`getReturnValueHandler`方法,遍历其`returnValueHandlers`返回第一个`supportsReturnType`为`true`的`HandlerMethodReturnValueHandler`。最后调用其`handleReturnValue`方法来解析返回值。实现参考:ViewNameMethodReturnValueHandler，返回一个String类型的逻辑视图名有其进行解析。
