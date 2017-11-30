## mini-dubbo

dubbo、thrift、grpc <http://colobu.com/2016/09/05/benchmarks-of-popular-rpc-frameworks/>

### 主要设计架构
1. 服务管理中心
    1. 服务注册
        zookeeper/etcd 

2. RPC服务
    1. 序列化协议
        json/thrift/protobuf
    2. 传输层
        http netty/vert.x(防止主循环阻塞)
    

### json和thrift/protobuf比较
1. `thrift/protobuf` 等协议序列化后字节更小、序列化速度更快。`json`存在冗余，序列化效率也没有前两者高。
2. `thrift/protobuf` 需要定义schema，重新生成实体类（VO）。`json`可以直接使用现有实体类，我们只需要将`实体`和`Interface`对外发布即可。
3. `thrift/protobuf` 序列化后无法阅读，对人类不友好。
4. `thrift/protobuf` 能非常方便的实现跨语言序列化反序列化，`json`在跨语言时较麻烦。


### 注册服务协议
类似dubbo，服务器启动、停止时去注册、注销服务即可。为了防止出现`kill -9`等情况下服务不能注销，可以添加心跳检查或者无响应自动剔除等功能。
![](images/zk-dubbo2.jpg)
```
http://10.0.1.3:20880/cc.kekek.dubbo.demo.DemoService?anyhost=true&application=demo-provider&dubbo=2.5.7&generic=false&interface=com.example.demo.DemoService&methods=sayHello,sayName&pid=54299&side=provider&timestamp=1511263842858
```

### RPC(HTTP)协议
请求体类似 `multipart/form-data`，在原有协议上添加了type字段，用来定义此参数的实际类型。原有`Content-Type`也可以用来定义序列化格式`application/json`、`application/x-protobuf`、`application/x-thrift`等。
```
POST http://www.example.com/invoke?interface=com.example.rpc.service.UserService&method=hello&parameters=java.lang.Integer,java.lang.String,com.example.rpc.model.User HTTP/1.1
Content-Type:multipart/form-data; boundary=----RPCFormBoundaryrGKCBY7qhFd3TrwA

------RPCFormBoundaryrGKCBY7qhFd3TrwA
Content-Disposition: form-data; name="args[0]"; type="java.lang.Integer"

1
------RPCFormBoundaryrGKCBY7qhFd3TrwA
Content-Disposition: form-data; name="args[1]"; type="java.lang.String"

小明
------RPCFormBoundaryrGKCBY7qhFd3TrwA
Content-Disposition: form-data; name="args[2]"; type="com.example.rpc.model.User"
Content-Type: application/json

{"id":123,"name":"小明","age":18}
```

> GET /heartbeat 心跳接口

### 客户端伪代码
通过动态代理生成接口的实现类，通过动态代理在`invoke`方法里面发送网络请求到RPCServer。
```java 
    UserService userService = Proxy.newProxyInstance(this.getClass().getClassLoader(), new Class[]{service}, (proxy, method, objects) -> {
            Class<?> returnType = method.getReturnType();
            Parameter[] parameters = method.getParameters();

            String user = httpClient.post("http://localhost:1125/invoke")
                .addQuery("interface", "com.example.rpc.service.UserService") // serviceName
                .addQuery("method", method.getName())
                .addQuery("parameters", "java.lang.Integer") // parameters type
                .addBody('123\r\n'); // objects

            return JSON.parseObject(user, returnType);
        }); 
```

### 服务器端伪代码
首先根据`serviceName`获取具体实现类，然后获取具体的方法。最后通过反射调用调用实现类的方法即可。
``` java
public void invoke(HttpRequest req, HttpResponse res) {
    String service = req.getQuery('service');
    String methodName = req.getQuery('method');
    String[] parameters = req.getQuery('parameters');
    String[] body = req.getBody();

    Object bean = services.getBean(service);
    Method method = bean.getMethod(methodName, new Class[]{...}); // parameters to Class 
    Object returnValue =  method.invoke(bean, new Object[]{...}); // body to Object

    res.json(returnValue);
}
```
