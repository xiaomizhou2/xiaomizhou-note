### AMQP

Advanced Message Queuing Protocol，是用于在应用程序或之间传递业务消息的开放标准。该协议与语言和平台无关，更符合微服务中独立性的要求。



### Spring AMQP

发送消息：

1. 引入spring-amqp的依赖

2. 配置RabbitMQ地址

3. 利用RabbitTemplate的convertAndSend方法发送消息

   ```java
   @RunWith(SpringRunner.class)
   @SpringBootTest
   public class ApiTest {
   
       @Autowired
       private RabbitTemplate rabbitTemplate;
   
       @Test
       public void test_simpleQueue() {
           String queueName = "simple.queue";
           String message = "hello,spring amqp";
   
           rabbitTemplate.convertAndSend(queueName, message);
       }
   }
   ```

接收消息：

1. 配置RabbitMQ地址

2. 配置监听类进行监听接收消息

   ```java
   @Component
   public class SpringRabbitListener {
   
       @RabbitListener(queues = "simple.queue")
       public void listenSimpleQueueMessage(String msg) {
           System.out.println("消费者接收到消息：【" + msg + "】");
       }
   }
   ```

   

#### Work Queue 工作队列

![](https://gitee.com/zyx95ovo/pic-bed/raw/master/data/20210826164942.png)

工作队列，可以提高消息处理速度，避免队列消息堆积

具体实现：一个队列绑定多个消费者
