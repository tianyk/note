### 类加载阶段
1. 加载和验证

    从磁盘或者网络中读取class文件，检查class文件是否符合规范。

2. 准备和解析

    分配内存（静态变量初始化），找出类的依赖关系。

3. 初始化

    初始化静态变量，还会运行静态初始化代码块。

### ClassLoader
类加载采用`双亲委派模型`，`双亲委派模型`要求除了顶层的启动类加载器外，其余的类加载器都应当有自己的父类（不是继承关系，使用组合实现）加载器。`双亲委派模型`要求类加载器收到了类加载的请求要先委派给父类加载器去完成，只有当父加载器反馈自己无法完成这个加载请求（它的搜索范围中没有找到所需的类）时，子加载器才会尝试自己去加载。

这保证了虚拟机的安全性，我们不能自定义一个类加载器去加载我们自己写的`java.lang.Object`。
1. Bootstrap ClassLoader

    负责加载`＜JAVA_HOME＞\lib`中的类。

2. Extension ClassLoader

    负责加载`＜JAVA_HOME＞\lib\ext`目录中的类。

3. Application ClassLoader

    负责加载用户类路径（ClassPath）上所指定的类库，开发者可以直接使用这个类加载器。如果应用程序中没有自定义过自己的类加载器，一般情况下这个就是程序中默认的类加载器。
    
    > ClassPath用来告诉解释器从哪里寻找类，可以使用`-classpath`选项，或者设定`CLASSPATH`环境变量。一般我们会配置全局`CLASSPATH`，多个文件夹用分隔符分隔。注意：一般都以`.`开头，这代表当前文件夹。没有这个配置，我们直接在文件夹中运行`java [ClassName]`是找不到类的，因为它不会再当前文件夹查找。

自定义类加载器
``` java 
/**
 * 自定义类加载器一般继承于 {@link java.lang.ClassLoader}。<br>
 * 用户需要实现{@link #findClass(String)}方法加载class文件，
 * 然后调用{@link #defineClass(String, byte[], int, int)}将类文件（表示为字节数据）转换成类对象。
 */
public class SecureClassLoader extends ClassLoader {
    private String classpath;
    private String privateKey;

    /**
     * @param classpath
     * @param secret RSA私钥
     */
    public SecureClassLoader(String classpath, String secret) {
        this.classpath = classpath;
        this.privateKey = secret;
    }

    @Override
    protected Class<?> findClass(String name) throws ClassNotFoundException {
        try {
            return loadSecureClass(name);
        } catch (Exception ignored) {
            throw new ClassNotFoundException();
        }
    }

    private Class<?> loadSecureClass(String name) throws IOException {
        String[] className = name.split("\\.");
        className[className.length - 1] += ".class";

        byte[] classData = Files.readAllBytes(Paths.get(classpath, className));
        // 解密数据
        // classData = RSA.decrypt(classData, privateKey);

        return defineClass(name, classData, 0, classData.length);
    }

    public static void main(String[] args) throws Throwable {
        SecureClassLoader classLoader = new SecureClassLoader(args[0], args[1]);

        Class<?> personClass = classLoader.loadClass("cc.kekek.java.Person");

        // 构造实例
        Constructor<?> personConstructor = personClass.getConstructor(String.class, Byte.TYPE);
        Object ming = personConstructor.newInstance("小明", (byte) 10);
        System.out.println("ming = " + ming);

        System.out.println("one year later...");

        // 反射方式
        Method setAge = personClass.getMethod("setAge", Byte.TYPE);
        setAge.invoke(ming, (byte) 11);
        // 方法句柄方式
        MethodType methodType = MethodType.methodType(Void.TYPE, String.class);
        MethodHandle handle = MethodHandles.lookup().findVirtual(personClass, "setName", methodType);
        handle.invoke(ming, "ming");
        System.out.println("ming = " + ming);
    }
}
```
