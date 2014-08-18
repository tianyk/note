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


