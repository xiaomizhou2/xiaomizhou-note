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

###### 1.3.3 explain 之 table

展示这一行的数据是关于哪一张表的。

###### 1.3.4 explain 之 type

type 显示的是访问类型，是比较重要的一个指标，可取值为

| type   | 含义                                                         |
| ------ | ------------------------------------------------------------ |
| NULL   | MySQL不访问任何表，索引，直接返回结果                        |
| system | 表只有一行记录(等于系统表),这是const类型的特例，一般不会出现 |
| const  | 表示通过索引一次就找到了，const用于比较 primary key 或者 unique 索引。因为只匹配一行数据，所以很快。如将主键置于 where 列表中，MySQL 就能将该查询转换为一个常量。const 将“主键”或“唯一”索引的所有部分与常量值进行比较 |
| eq_ref | 类似ref，区别在于使用的是唯一索引，使用主键的关联查询，关联查询出的记录只有一条。常见于主键或唯一索引扫描 |
| ref    | 非唯一索引扫描，返回匹配某个单独值得所有行。本质上也是一种索引访问，返回所有匹配某个单独值的所有行（多个） |
| range  | 只检索给定返回的行，使用一个索引来选择行。where 之后出现 between ，<，>，in 等操作 |
| index  | index 与 ALL 的区别为 index 类型只是遍历了索引树，通常比 ALL 快，ALL 是遍历数据文件 |
| all    | 将遍历全表以找到匹配的行                                     |

###### 1.3.5 explain 之 key

```
possible_keys:显示可能应用在这张表的索引，一个或多个

key：实际使用的索引，如果为NULL，则没有使用索引

key_len:表示索引中使用的字节数，该值为索引字段最大可能长度，并非实际长度，在不损失精度的前提下，长度越短越好。

```

###### 1.3.6 explain 之 rows

扫描行的数量。

###### 1.3.7 explain 之 extra

其他的额外的执行计划信息，在该列展示

| extra           | 含义                                                         |
| --------------- | ------------------------------------------------------------ |
| using filesort  | 说明mysql会对数据使用一个外部的索引排序，而不是按照表内的索引顺序进行读取，称为**文件排序** |
| using temporary | 使用了临时表保存中间结果，MySQL在对查询结果排序时使用临时表。常见于 order by 和 group by |
| using index     | 表示相应的select 操作使用了覆盖索引，避免访问表的数据行，效率不错 |



##### 1.4 show profile 分析 SQL

MySQL 从 5.0.37 版本开始增加了对 show profiles 和 show profile 语句的支持。show profiles 能够在做SQL优化时帮助我们了解时间都耗费到哪里去了。



通过 have_profiling 参数，能够看到当前MySQL是否支持profile

![image-20210808152642003](https://gitee.com/zyx95ovo/pic-bed/raw/master/data/image-20210808152642003.png)

默认 profiling 是关闭的，可以通过 set 语句在 Session 级别开启 profiling

![image-20210808153541103](https://gitee.com/zyx95ovo/pic-bed/raw/master/data/image-20210808153541103.png)

```mysql
set profiling=1; //开启 profiling 开关
```

通过profile，我们能够更清楚地了解SQL执行的过程。  

1. 执行 show profiles 指令，来查看SQL语句执行的耗时

   ![image-20210808154746872](https://gitee.com/zyx95ovo/pic-bed/raw/master/data/image-20210808154746872.png)

2. 通过 show profile for query query_id 语句可以查看到该SQL执行过程中每个线程的状态和消耗时间

    ![image-20210808155003189](https://gitee.com/zyx95ovo/pic-bed/raw/master/data/image-20210808155003189.png)

```
TIP:
	Sending data 状态表示 MySQL 线程开始访问数据行并把结果返回给客户端，而不仅仅是返回客户端。由于在 Sending data 状态下，MySQL 线程往往需要做大量的磁盘读取操作，所以经常是整个查询中耗时最长的状态。
```

在获取到最消耗时间的线程状态后，MySQL支持进一步选择 all、cpu、block io、context switch、page faults 等明细类型查看MySQL在使用什么资源上耗费了过高的时间。



##### 1.5 trace 分析优化器执行计划

MySQL 5.6 提供了对SQL的跟踪 trace，通过 trace 文件能够进一步了解为什么优化器选择A计划，而不是B计划

打开trace ，设置格式为json，并设置 trace 最大能够使用的内存大小，避免解析过程中因为默认内存过小而不能够完整展示。

```mysql
set optimizer_trace="enabled=on",end_markers_in_json=on;

set optimizer_trace_max_mem_size=1000000;

-- trace 跟踪日志放在 information_schema.optimizer_trace 
select * from information_schema.optimizer_trace;
```

### 2. 索引的使用

索引是数据库优化最常用也是最重要的手段之一，通过索引通常可以帮助用户解决大多数的SQL性能优化问题。

##### 2.1 如何避免索引失效

- 全值匹配，对索引中的所有列都查询具体值

- 最左前缀法则

  如果索引了多列，要遵守最左前缀法则。指的是查询从索引的最左前列开始，并且中间不跳过索引中的列。跟顺序没有关系。

-  



