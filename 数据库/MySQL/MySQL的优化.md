# MySQL的优化

### 1.优化SQL步骤

##### 1.1 查看SQL执行频率

MySQL客户端连接成功后，通过show[session | global] status 命令可以提供服务器状态信息。此命令可以根据需要加上参数“session"或者”global”来显示session级(当前连接)的统计结果和global级(自数据库上次启动至今)的统计结果。如果不写，默认使用参数是“session"

```mysql
# 查看当前session中统计的增删改查等参数
show status like 'Com_______' # 占位7个字符

# 查看innoDB参数信息
show status like 'Innodb_rows_%'
```

##### 1.2 定位低效率执行SQL

可以通过以下两种方式定位执行效率较低的SQL语句：

- 慢查询日志：通过慢查询日志定位那些执行效率较低的SQL语句，用--log-slow-queries[=file_name]选项启动时，mysqld写一个包含所有执行时间超过long_query_time 秒的SQL语句的日志文件。

- show processlist:慢查询日志在查询结束以后才记录，所以在应用反映执行效率出现问题的时候查询慢查询日志并不能定位问题，可使用show processlist 命令查看当前MySQL在进行的线程，包括线程的状态、是否锁表等，可以实时的查看SQL的执行情况，同时对一些锁表操作进行优化。

  ![image-20210723161234507](https://gitee.com/zyx95ovo/pic-bed/raw/master/data/image-20210723161234507.png)

```tex
1) id列，用户登录mysql时，系统分配的"connection_id"，可以使用函数 connection_id()查看

2）user列，显示当前用户。如果不是root，这个命令就只显示用户权限范围的sql语句

3）host列，显示这个语句是从那个ip的那个端口上发的，可以用来跟踪出现问题语句的用户

4）db列，显示这个进程目前连接的是那个数据库

5）command列，显示当前连接的执行命令，一般取值为休眠(sleep)，查询（query）,连接（connect）等

6）time列，显示这个状态持续的时间，单位是秒

7）state列，显示使用当前连接的sql语句的状态。state描述的是语句执行的某一个状态。一个SQL语句，以查询为例，可能需要经过 copying to tmp table、sorting result、sending data等状态才可以完成

8）info列，显示这个sql语句，是判断语句的一个重要的依据
```

##### 1.3 explain分析执行计划

可以通过**explain**或者**desc**命令获取MySQL如何执行SELECT语句的信息，包括在SELECT语句执行过程中表如何连接和连接的顺序。

查询SQL语句的执行计划：

```mysql
explain select * from tb_item where id = 1;
```

![image-20210723163803585](https://gitee.com/zyx95ovo/pic-bed/raw/master/data/image-20210723163803585.png)

```mysql
explain select * from tb_iten where title = 'test'
```

![image-20210723163903024](https://gitee.com/zyx95ovo/pic-bed/raw/master/data/image-20210723163903024.png)

| 字段          | 含义                                                         |
| ------------- | ------------------------------------------------------------ |
| id            | select查询的序列号，是一组数字，表示查询中执行select子句或者操作表的顺序 |
| select_type   | 表示select的类型，常见的取值有SIMPLE（简单表，即不使用表连接或者子查询）、PRIMARY(主查询，即外层的查询)、UNION(UNION中的第二个或者后面的查询语句)、SUBQUERY（子查询中的第一个SELECT）等 |
| table         | 输出结果集的表                                               |
| type          | 表示表的连接类型，性能由好到差的连接类型为(system  ---> const ---> eq_ref ---> ref ---> ref_or_null ---> index_merge ---> index_subquery ---> range ---> index ---> all) |
| possible_keys | 表示查询时，可能使用的索引                                   |
| key           | 实际使用的索引                                               |
| key_len       | 索引字段的长度                                               |
| rows          | 扫描行的数量                                                 |
| extra         | 执行情况的说明和描述                                         |
| ref           | 引用                                                         |

###### 1.3.1 explain之id

select查询的序列号，是一组数字，表示查询中执行select子句或者操作表的顺序。id情况有三种：

- id相同表示加载表的顺序时从上到下的
- id不同，id值越大，优先级越高，越先被执行
- id有相同，也有不同，同时存在。id相同的可以认为是一组，从上往下顺序执行；在所有组中，id值越大，优先级越高，越先执行。

###### 1.3.2 explain之select_type

表示SELECT 的类型，常见的取值如下

| select_type  | 含义                                                         |
| ------------ | ------------------------------------------------------------ |
| SIMPLE       | 简单的select查询，查询中不包含子查询或者UNION                |
| PRIMARY      | 查询中若包含任何复杂的子查询，最外层查询标记为该标识         |
| SUBQUERY     | 在SELECT或WHERE列表中包含了子查询                            |
| DERIVED      | 在FROM列表中包含的子查询，被标记为DERIVED(衍生)MYSQL会递归执行这些子查询，把结果放在临时表中 |
| UNION        | 若第二个SELECT出现在UNION之后，则标记为UNION；若UNION包含在FROM子句的子查询中，外层SELECT将被标记为DERIVED |
| UNION RESULT | 从UNION表获取结果的SELECT                                    |

