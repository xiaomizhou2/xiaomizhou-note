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

  

