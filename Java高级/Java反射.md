# Java反射

**反射是框架设计的灵魂**

### 一、反射

##### 1.1 反射机制：

- 将类的各个组成部分封装为对象，这就是反射机制



##### 1.2 反射的好处：

- 可以在程序运行过程中，操作这些对象
- 可以解耦，提高程序的可扩展性



##### 1.3 Java代码在计算机中经历的三个阶段

- Source源代码阶段：*.java被编译成 *.class字节码文件

- Class类对象阶段：*.class 字节码文件被类加载器加载进内存，并将其封装成Class对象（用于在内存中描述字节码文件），Class对象将原字节码文件中的**成员变量**抽取出来封装成数组 **Field[]**，将原字节码文件中的**构造函数**抽取出来封装成数组 **Construction[]**, 在将**成员方法**封装成 **Method[]**。当然Class类内不止这三个，还封装了很多，我们常用的就这三个。

  ![Snipaste_2021-07-03_22-44-53-1](https://gitee.com/zyx95ovo/pic-bed/raw/master/data/Snipaste_2021-07-03_22-44-53-1.png)

- RunTime运行时阶段：创建对象的过程new

###  二、获取Class对象的方式

##### 2.1 获取Class对象的三种方式

- 【Source】<font color=#FF4500>Class.forName("全类名")</font>：将字节码文件加载进内存，返回Class对象。

  **多用于配置文件，将类名定义在配置文件中。读取文件，加载类。**

- 【Class】<font color=#FF4500>类名.class</font>：通过类名的属性class获取

  **多用于参数的传递**

- 【Runtime】<font color=#FF4500>对象.getClass()</font>：getClass() 方法是定义在Object类中的方法

  **多用于对象的获取字节码的方式**

##### 2.2 三种获取方法的代码


```java
public class Reflect {

    public static void main(String[] args) throws ClassNotFoundException {
        //方式一：Class.forName
        Class<?> clazz1 = Class.forName("Teacher");
        System.out.println("clazz1:" + clazz1);

        //方式二：类名.class
        Class<Teacher> clazz2 = Teacher.class;
        System.out.println("clazz2:" + clazz2);

        //方式三：对象.getClass()
        Teacher teacher = new Teacher();
        Class<? extends Teacher> clazz3 = teacher.getClass();
        System.out.println("clazz3:" + clazz3);

        //比较三个对象
        System.out.println("clazz1 == clazz2:" + (clazz1 == clazz2));
        System.out.println("clazz1 == clazz3:" + (clazz1 == clazz3));

        //结论：同一个字节码文件(*.class)在一次程序运行过程中，只会被加载一次，无论通过哪一种方式获取的Class对象都是同一个
    }

}
```

![image-20210703235428258](https://gitee.com/zyx95ovo/pic-bed/raw/master/data/image-20210703235428258.png)



### 三、Class对象功能

##### 3.1 获取功能

- 获取成员变量们

  ```java
  Field[] getFields(); //获取所有public修饰的成员变量
  Field getField(String name); //获取指定名称的public修饰的成员变量
  
  Field[] getDeclaredFields(); //获取所有的成员变量，不考虑修饰符
  Field getDeclaredField(String name); //获取指定名称的成员变量,不考虑修饰符
  ```

- 获取构造方法们

  ```java
  Constructor<?>[] getConstructors();
  Constructor<T> getConstructor(Class<?>... parameterTypes);
  
  Constructor<?>[] getDeclaredConstructors();
  Constructor<T> getDeclaredConstructor(Class<?>... parameterTypes);
  ```

- 获取成员方法们

  ```java
  Method[] getMethods();
  Method getMethod(String name, Class<?>... parameterTypes);
  
  Method[] getDeclaredMethods();
  Method getDeclaredMethod(String name, Class<?>... parameterTypes);
  ```



##### 3.2 Field：成员变量

- 设置值：void set(Object obj, Object value);
- 获取值：get(Object obj);
- 忽略访问权限修饰符的安全检查 **setAccessible(true)** 暴力反射

##### 3.3 Constructor：构造方法

- 创建对象：T newInstance(Object... initargs);

- 分为有参构造和无参构造，无参构造可以直接使用Class对象的newInstance方法

  ```java
  @Test
  public void reflect4() throws Exception {
      Class personClass = Person.class;
  
      //Constructor<?>[] getConstructors()
      Constructor[] constructors = personClass.getConstructors();
      for(Constructor constructor : constructors){   //Constructor 对象reflect包下的 import java.lang.reflect.Constructor;
          System.out.println(constructor);
      }
  
      System.out.println("==========================================");
  
      //获取无参构造函数   注意：Person类中必须要有无参的构造函数，不然抛出异常
      Constructor constructor1 = personClass.getConstructor();
      System.out.println("constructor1 = " + constructor1);
      //获取到构造函数后可以用于创建对象
      Object person1 = constructor1.newInstance();//Constructor类内提供了初始化方法newInstance();方法
      System.out.println("person1 = " + person1);
  
  
      System.out.println("==========================================");
  
      //获取有参的构造函数  //public Person(String name, Integer age) 参数类型顺序要与构造函数内一致，且参数类型为字节码类型
      Constructor constructor2 = personClass.getConstructor(String.class,Integer.class);
      System.out.println("constructor2 = " + constructor2);
      //创建对象
      Object person2 = constructor2.newInstance("张三", 23);   //获取的是有参的构造方法，就必须要给参数
      System.out.println(person2);
  
      System.out.println("=========================================");
  
      //对于一般的无参构造函数，我们都不会先获取无参构造器之后在进行初始化。而是直接调用Class类内的newInstance()方法
      Object person3 = personClass.newInstance();
      System.out.println("person3 = " + person3);
      //我们之前使用的 Class.forName("").newInstance; 其本质上就是调用了类内的无参构造函数来完成实例化的
      //故可以得出结论 我们以后在使用  Class.forName("").newInstance; 反射创建对象时，一定要保证类内有无参构造函数
  }
  ```



3.4 Method：方法对象

- 执行方法：Object invoke(Object obj, Object... args);

- 获取方法名称：String getName();

  ```java
  /**
   * 3. 获取成员方法们：
   *    * Method[] getMethods()
   *    * Method getMethod(String name, 类<?>... parameterTypes)
   */
  @Test
  public void reflect5() throws Exception {
      Class personClass = Person.class;
  
      //获取指定名称的方法    
      Method eat_method1 = personClass.getMethod("eat");
      //执行方法
      Person person = new Person();
      Object rtValue = eat_method1.invoke(person);//如果方法有返回值类型可以获取到，没有就为null
      //输出返回值 eat方法没有返回值，故输出null
      System.out.println("rtValue = " + rtValue);
  
      System.out.println("--------------------------------------------");
  
      //获取有参的构造函数  有两个参数 第一个方法名 第二个参数列表 ，不同的参数是不同的方法（重载）
      Method eat_method2 = personClass.getMethod("eat", String.class);
      //执行方法
      eat_method2.invoke(person,"饭");
  
      System.out.println("============================================");
  
      //获取方法列表
      Method[] methods = personClass.getMethods();
      for(Method method : methods){     //注意：获取到的方法名称不仅仅是我们在Person类内看到的方法
          System.out.println(method);   //继承下来的方法也会被获取到（当然前提是public修饰的）
      }
  }
  ```

  
