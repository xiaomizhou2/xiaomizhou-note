# MySQL索引

#### 1.1 索引概述

- 索引是帮助MySQL高效获取数据的数据结构

  ![image-20210704222239119](https://gitee.com/zyx95ovo/pic-bed/raw/master/data/image-20210704222239119.png)

  一般来说索引本身也很大，不可能全部存储在内存中，因此索引往往以索引文件的形式存储在磁盘上。索引是数据库中用来提高性能的最常用的工具。

#### 1.2 索引的优势劣势

**优势：**

- 类似于书籍的目录索引，提高数据检索的效率，降低数据库的IO成本
- 通过索引列对数据进行排序，降低数据排序成本，降低CPU的消耗

**劣势：**

- 实际上索引也是一张表，该表中保存了主键与索引字段，并指向实体类的记录，所以索引列也是要占空间的。
- 虽然索引大大提高了查询效率，同时也降低更新表的速度。

#### 1.3 索引数据结构

索引是在MySQL的存储引擎层中实现的，所以每种存储引擎的索引都不一定完全相同，也不是所有的存储引擎都支持所有的索引类型的。MySQL目前提供了以下4种索引：

- B-tree索引：最常见的索引类型，大部分索引都支持B数索引

- Hash索引：只有Memory引擎支持，使用场景简单。

- R-tree索引(空间索引)：空间索引是 **MyISAM** 引擎的一个特殊索引类型，主要用于地理空间数据类型。

- Full-text(全文索引)：全文索引也是 **MyISAM** 的一个特殊索引类型，主要用于全文索引，InnoDB从MySQL5.6版本开始支持全文索引

  ![image-20210704223908913](https://gitee.com/zyx95ovo/pic-bed/raw/master/data/image-20210704223908913.png)

我们平常说的索引一般都是指B+树结构组织的索引。其中聚集索引、复合索引、前缀索引、唯一索引默认都是使用B+tree树索引，统称为索引。

##### 1.3.1 B-tree 结构

B-tree又叫多路平衡搜索树，一颗m叉的B-tree特性如下：

- 树中每个节点最多包含m个子叉

- 除根节点和叶子节点外，每个节点至少有**[ceil(m/2)]**个子叉

- 若根节点不是叶子节点，则至少有两个子叉

- 所有的叶子节点都在同一层

- 每个非叶子节点由 n个key 与 n+1个指针 组成，其中**[ceil(m/2)-1] <= n <= m-1**

  插入顺序：![image-20210706153654523](https://gitee.com/zyx95ovo/pic-bed/raw/master/data/image-20210706153654523.png)

![image-20210706104604935](https://gitee.com/zyx95ovo/pic-bed/raw/master/data/image-20210706104604935.png)

​	B-tree树和二叉树相比，查询数据的效率更高，因为相同的数据量来说，B-tree 的层级结构比二叉树小，因此搜索速度更快。



##### 1.3.2 B+tree 结构

B+tree为B-tree的变种，B+tree与B-tree的区别为：

- m叉B+tree最多含有m个key，而B-tree最多含有m-1个key
- B+tree的叶子节点保存所有的key信息，依key大小顺序排列
- 所有的非叶子节点都可以看作是key的索引部分

![image-20210706153731483](https://gitee.com/zyx95ovo/pic-bed/raw/master/data/image-20210706153731483.png)

##### 1.3.3 MySQL的B+tree结构

MySQL索引数据结构对经典的B+tree进行了优化，在B+tree的基础上，增加一个指向相邻叶子节点的链表指针，就形成了带有顺序指针的B+tree，提高区间访问的性能。

MySQL的B+tree索引结构示意图：

![image-20210706154050221](https://gitee.com/zyx95ovo/pic-bed/raw/master/data/image-20210706154050221.png)



#### 1.4 索引分类

- 单值索引：即一个索引只包含单个列，一个表可以有多个单例索引
- 唯一索引：索引列的值必须唯一，但允许有空值
- 复合索引：即一个索引包含多个列



#### 1.5 索引语法

- 创建索引

  ```sql
  # [索引类型]
  CREATE [UNIQUE|FULLTEXT|SPATIAL] INDEX index_name
  
  ON table_name(index_column_name[(length)][ASC | DESC])
  
  # MySQL中表中主键默认都有主键索引
  ```

- 查看索引

  ```sql
  SHOW INDEX FROM table_name
  ```

- 删除索引

  ```sql
  DROP INDEX index_name ON table_name
  ```

- ALTER 添加

  ```sql
  ALTER TABLE table_name ADD PRIMARY KEY(column_name);
  # 添加一个主键，这意味着索引值必须是唯一的，且不能为null
  
  ALTER TABLE table_name ADD UNIQUE index_name(column_name);
  # 添加唯一索引，索引的值必须是唯一的（NULL可以出现多次）
  
  ALTER TABLE table_name ADD INDEX index_name(column_name);
  # 添加普通索引
  
  ALTER TABLE table_name ADD FULLTEXT index_name(column_name);
  # 添加全文索引
  ```

  



#### 1.6 索引的设计原则

- 对查询频次较高，且数据量比较大的表建立索引。
- 索引字段的选择，最佳候选列应当从where子句的条件中提取，如果where子句中的组合比较多，那么应当挑选最常用的、过滤效果好的列的组合。
- 使用唯一索引，区分度越高，使用索引的效率越高
- 索引可以有效的提升查询数据的效率，但索引数量不是多多益善，索引越多，维护索引的代价自然也就水涨船高。对于插入、更新、删除等DML操作比较频繁的表来说，索引过多，会引入相当高的维护代价，降低DML操作的效率，增加相应操作的时间消耗。另外索引过多的话，MySQL也会犯选择困难症，虽然最终仍会找到一个可用的索引，但无疑提高了选择的代价
- 使用短索引，索引创建之后也是用硬盘来存储的，因此提升索引访问的I/O效率，也可以提高总体的访问效率，假如构成索引的字段总长度比较短，那么再给定大小的存储块内可以存储更多的索引值，相应的可以有效的提升MySQL访问索引的I/O效率。
- 利用最左前缀，N个列组合而成的组合索引，那么相当于创建了N个索引，如果查询时where子句中使用了组成该索引的前几个字段，那么这条查询SQL可以利用组合索引来提升查询效率。

