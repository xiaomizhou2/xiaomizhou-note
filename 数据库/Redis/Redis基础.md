### Redis数据类型

#### **1. Redis适用场景**

  - 作为缓存使用

    1. 原始业务功能设计，比如秒杀、双十一活动

    2. 运营平台监控到的突发高频访问数据，比如突发的热点事件

    3. 高频、复杂的统计数据，比如在线人数、投票

  - 系统功能优化或升级

    1. 单服务升级集群

    2. Session管理

    3. Token管理

#### 2. **redis数据类型**

  1. string

  2. hash

  3. list

  4. set

  5. sorted_set

#### 3. string类型

1. **string类型基本介绍**

  - 存储的数据：单个数据，最简单的数据存储类型，也是常用的数据存储类型

  - 存储数据的格式：一个存储空间保存一个数据

  - 存储内容：通常使用字符串，如果字符串以整数的形式展示，可以作为数据操作使用

2. **string类型数据的基本操作**

  - 添加、修改数据    `set key value`

  - 获取数据   `get key`

  - 删除数据   `del key`

  - 添加、修改多个数据   `mset key1 value1 key2 value2 ...`

  - 获取多个数据   `get key1 key2 ...`

  - 获取数据字符个数   `strlen key`

  - 追加信息到原始信息尾部   `append key value`

3. **string类型数据的扩展操作**

  - 设置数值增加指定范围的值

```PowerShell
# 增加1
incr key

# 增加指定的值
incrby key [increment]

# 可以操作浮点值
incrbyfloat key [increment]
```

  - 设置数值数据减少指定范围的值

```PowerShell
# 减少1
decr key

# 减少指定的值
decrby key increment
```

  - string做为数值操作

    1. string在redi内部存储默认就是一个字符串，当遇到增减类操作incr或者decr时会自动转成数值型进行计算。

    2. redis所有的操作都是原子性的，采用单线程处理所有业务。命令是一个一个执行的，因此无需考虑并发带来的影响

    3. 注意：按数值进行操作的数据，如果原始数据不能转成数值或超越了redis数值上限范围，将报错。最大值 9223372036854775807

  - 设置数据具有指定的生命周期

```PowerShell
setex key seconds value -- 秒

psetex key milliseconds value -- 毫秒
```

1. string类型数据操作的注意事项

  - 数据最大存储量：512MB

#### 4.Hash类型

1. ###### hash类型介绍

   - 对一系列存储的数据进行编组，方便管理，典型应用 存储对象信息	

   - 一个存储空间保存多个键值对数据
   - hash类型：底层使用哈希表结构实现数据存储
   - hash存储结构优化：当field较少时用类数组结构，当field较多时用HashMap结构

2. ###### hash类型数据的基本操作

   - 添加、修改数据	`hset key field value`
   - 获取数据   `hget key field`   `hgetall key`
   - 删除数据   `hdel key field1 [field2]`
   - 添加、修改多个数据 `hmset key field1 value1 field2 value2 ...`
   - 获取多个数据   `hmget key field1 field2 ...`
   - 获取哈希表中字段的数量   `hlen key`
   - 获取哈希表中是否存在指定的字段   `hexists key field`

3. ###### hash类型数据的扩展操作

   - 获取哈希表中所有的字段名或字段值

     ```shell
     hkeys key
     hvals key
     ```

   - 设置指定字段的数值数据增加指定范围的值

     ```shell
     hincrby key field increment
     
     hincrbyfloat key field increment
     ```

4. ###### hash类型数据操作的注意事项

   - hash类型下的value只能存储字符串，不允许存储其他数据类型，不存在嵌套现象，如果数据未获取到，对应的值为 nil
   - 每个hash可以存储 `2^32 -1` 个键值对
   - hash类型十分贴近对象的数据存储方式，并且可以灵活添加删除对象属性。但hash设计的初衷不是为了存储大量对象而设计的，切记不可滥用，更不可以将hash作为对象列表使用
   - `hgetall` 操作可以获取全部属性，如果内部field过多，遍历整体数据库效率就会很低，有可能成为数据访问的瓶颈。 



#### 5. list类型

1. ###### list类型简单介绍

   - 数据存储需求：存储多个数据，并对数据进入存储空间的顺序进行区分
   - 存储结构：一个存储空间保存多个数据，且通过数据可以体现进入顺序
   - list类型：保存多个数据，底层使用双向链表存储结构实现

2. ###### list类型基本操作

   - 添加、修改数据

     ```shell
     -- 从链表左边插入
     lpush key value1 [value2] ...
     
     -- 从链表右边插入
     rpush key value1 [value2] ...
     ```

   - 获取数据

     ```shell
     -- 查询从start-stop的数据
     lrange key start stop
     
     -- 查询当前index的数据
     lindex key index
     
     -- 获取当前key的list长度
     llen key
     ```

   - 获取并移除数据

     ```shell
     -- 从左边弹出数据
     lpop key
     
     -- 从右边弹出数据
     rpop key
     ```

3. ###### list 类型数据扩展操作

   - 规定时间内获取并移除数据

     ```shell
     blpop key1 [key2] timeout
     
     brpop key1 [key2] timeout
     ```

   - 移除指定数据

     ```shell
     lrem key count value
     ```

4. ###### list 类型数据操作注意事项

   - list 中保存的数据都是string类型的，数据总量是有限的，最多`2^32-1`个元素
   - list 具有索引的概念，但是操作数据时通常以队列的形式进行入队出队操作，或以栈的形式进行入栈出栈操作
   - 获取全部数据操作结束索引设置为-1
   - list 可以对数据进行分页操作，通常第一页的信息来自于list，第2页及更多的信息通过数据库的形式加载。

#### 6. set 类型

1. ###### set 类型基本介绍

   - 存储需求：存储大量的数据，在查询方面提供更改的效率
   - 存储结构，能够确保大量的数据，高效的内部存储机制，便于查询
   - set类型：与hash存储结构完全相同，仅存储键，不存储值，并且值是不允许重复的

2. ###### set 类型数据的基本操作

   - 添加数据   `sadd key member1 [member2]`
   - 获取全部数据   `smembers key`
   - 删除数据   `srem key member1 [member2]`
   - 获取集合数据总量   `scard key`
   - 判断集合中是否包含指定数据   `sismember key member`

3. ###### set 类型数据的扩展操作

   - 随机获取集合中指定数量的数据   `srandmember key [count]`

   - 随机获取集合中的某个数据并将该数据移除集合   `spop key`

   - **Tips:redis 应用于随机推荐类信息检索，例如热点歌单推荐，热点新闻推荐，热卖旅游线路，应有APP推荐等**

   - 求两个集合的交、并、差集
   
     ```shell
     -- 交集
     sinter key1 [key2]
     
     -- 并集
     sunion key1 [key2]
     
     -- 差集
     sdiff key1 [key2]
     ```
   
   - 求两个集合的交、并、差集并存储到指定集合中
   
     ```shell
     sinterstore destination key1 [key2]
     
     sunionstore destination key1 [key2]
     
     sdiffstore destination key1 [key2]
     ```
   
   - 将指定数据从原始集合中移动到目标集合中
   
     ```shell
     smove source destination member
     ```
   
4. ###### set 类型数据操作的注意事项

   - set 类型不允许数据重复，如果添加的数据在set中已经存在，将只保留一份
   - set 虽然与hash的存储结构相同，但是无法启用hash中存储值的空间



#### 6. sorted_set 类型

1. ###### sorted_set 基本介绍

   - 数据排序有利于数据的有效展示，需要提供提供一种可以根据自身特征进行排序的方式
   - 在set的存储结构上添加可排序字段

2. ###### sorted_set 类型数据的基本操作

   - 添加数据

     ```shell
     zadd key score1 member1 [score2 member2]
     ```

   - 获取全部数据

     ```shell
     -- 加上 withscores 带上分数
     
     -- 由小到大
     zrange key start stop [WITHSCORES]
     
     -- 由大到小
     zrevrange key start stop [WITHSCORES]
     ```

   - 删除数据

     ```she
     zrem key member [member...]
     ```

   - 按条件获取数据

     ```
     zrangebyscore key min max [WITHSCORES] [LIMIT]
     
     zrevrangescore key max min [WITHSCORES] [LIMIT]
     ```

   - 按条件删除数据

     ```
     zremrangebyrank key start stop
     
     zremrangebyscore key min max
     ```

   - 获取集合数据总量

     ```
     zcard key
     
     zcount key min max
     ```

   - 集合交、并操作

     ```
     zinterstore destination numkeys key [key ...] [AGGREGATE SUM|MIN|MAX]
     
     zunionstore destination numkeys key [key ...] [AGGREGATE SUM|MIN|MAX]
     ```

   <font color=#0099ff>注意：</font>

   - <font color=#0099ff>min与max用于限定搜索查询的条件</font>

   - <font color=#0099ff>start与stop用于限定查询范围，作用于索引，表示开始和结束索引</font>

   - <font color=#0099ff>offset与count用于限定查询范围，作用于查询结果，表示开始位置和数据总量</font>

     

3. ###### sorted_set 类型数据的扩展操作

   - 获取数据对应的索引

     ```
     zrank key member
     
     zrevrank key member
     ```

   - score 值获取与修改

     ```
     zscore key member
     
     zincrby key increment member
     ```

4. ###### sorted_set 类型数据操作的注意事项

   - score 保存的数据存储空间是64位，如果是整数范围是-9007199254740992~9007199254740992
   - score 保存的数据也可以是一个双精度的double值，基于双精度浮点数的特征，可能会丢失精度，使用时要慎重
   - sorted_set 底层存储还是基于set 结构的，因此数据不能重复，如果重复添加相同的数据，score值将被反复覆盖，保留最后一次修改的结果
