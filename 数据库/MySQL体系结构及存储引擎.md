# 一、MySQL体系结构

![image-20210712180655182](https://gitee.com/zyx95ovo/pic-bed/raw/master/data/image-20210712180655182.png)

整个MySQL Server由以下组成：

- Connection Pool:连接池组件
- Management Services & Utilities：管理服务和工具组件
- SQL Interface：SQL接口组件
- Parser：查询分析器组件
- Optimizer：优化器组件
- Caches & Buffers：缓冲池组件
- Pluggable Storage Engines：存储引擎
- File System：文件系统

# 二、存储引擎

### 1. 存储引擎概述

- 和大多数的数据库不同，MySQL中有一个存储引擎的概念，针对不同的存储需求可以选择最优的存储引擎
- 存储引擎就是存储数据，建立索引，更新查询数据等等技术的实现方式。存储引擎是基于表的，而不是基于库的。所以存储引擎也可被称为表类型。
- Oracle，SqlServer等数据库只有一种存储引擎。MySQL提供了插件式的存储引擎架构。所以MySQL存在多种存储引擎，可以根据需要使用相应引擎，或者编写存储引擎。
- MySQL5.0支持的存储引擎包含：InnoDB、MyISAM、BDB、MEMORY、MERGE、EXAMPLE、NDB Cluster、ARCHIVE、CSV、BLACKHOLE、FEDERATED等，其中InnoDB和BDB提供事务安全表，其他存储引擎是非事务安全表。
- SHOW ENGINES 查询当前数据库支持的存储引擎
- 创建新表时如果不指定存储引擎，系统会使用默认的存储引擎，MySQL5.5以前的默认存储引擎是MyISAM，5.5之后是InnoDB



### 2. 存储引擎的特性

| 特点         | InnoDB            | MyISAM | MEMORY | MERGE | NDB  |
| :----------- | ----------------- | ------ | ------ | ----- | ---- |
| 存储限制     | 64TB              | 有     | 有     | 没有  | 有   |
| 事务安全     | 支持              |        |        |       |      |
| 锁机制       | 行锁(适合高并发)  | 表锁   | 表锁   | 表锁  | 行锁 |
| B树索引      | 支持              | 支持   | 支持   | 支持  | 支持 |
| 哈希索引     |                   |        | 支持   |       |      |
| 哈希索引     | 支持(5.6版本之后) | 支持   |        |       |      |
| 集群索引     | 支持              |        |        |       |      |
| 数据索引     | 支持              |        |        |       |      |
| 索引缓存     | 支持              | 支持   | 支持   | 支持  | 支持 |
| 数据可压缩   |                   | 支持   |        |       |      |
| 空间使用     | 高                | 低     | N/A    | 低    | 低   |
| 内存使用     | 高                | 低     | 中等   | 低    | 高   |
| 批量插入速度 | 低                | 高     | 高     | 高    | 高   |
| 支持外键     | 支持              |        |        |       |      |



### 3. InnoDB特性

InnoDB存储引擎是MySQL的默认存储引擎，InnoDB存储引擎提供了具有提交、回滚、崩溃恢复能力的事务安全，但是对比MyISAM的存储引擎，InnoDB写的处理效率差一些，并且会占用更多的磁盘空间以保留数据和索引。

InnoDB存储引擎不同于其他存储引擎的特点：

- 事务控制

  ```mysql
  create table goods_innodb(
      id int NOT NULL AUTO_INCREMENT,
      name varchar(20) NOT NULL,
      primary key(id)
  )ENGINE=innodb DEFAULT CHARSET=utf8;
  
  -- 手动开启事务
  start transaction;
  -- 插入数据
  insert into goods_innodb(id, name) values(null, 'Meta20');
  -- 提交事务
  commit;
  ```

- 外键约束

  MySQL支持外键的存储引擎只有InnoDB，在创建外键的时候，要求父表必须有对应的索引，子表在创建外键的时候，也会自动的创建对应的索引。

  下面两张表中，country_innodb是父表，country_id为主键索引，city_innodb表是子表，country_id字段为外键，对应country_innodb表的主键country_id。

  ```mysql
  create table country_innodb(
  	country_id int NOT NULL AUTO_INCREMENT,
      country_name varchar(100) NOT NULL,
      primary key(country_id)
  )ENGINE=InnoDB DEFAULT CHARSET=utf8;
  
  create table city_innodb(
  	city_id int NOT NULL AUTO_INCREMENT,
      city_name varchar(50) NOT NULL,
      country_id int NOT NULL,
      primary key(city_id),
      key idx_fk_country_id(country_id),
      CONSTRAINT `fk_city_country` FOREIGN KEY(country_id) REFERENCES country_innodb(country_id) ON DELETE RESTRICT ON UPDATE CASCADE
  )ENGINE=InnoDB DEFAULT CHARSET=utf8;
  
  insert into country_innodb values(null, 'China'),(null, 'America'),(null, 'Japan');
  insert into city_innodb values(null, 'xian', 1),(null, 'NewYork', 2),(null, 'Beijing', 1);
  ```

  在创建索引时，可以指定在删除、更新父表时，对子表进行相应的操作，包括RESTRICT、CASCADE、SET NULL和NO ACTION。

  RESTRICT和NO ACTION相同，是指在子表有关联记录的情况下，父表不能更新；

  CASCADE表示父表在更新或者删除时，更新或删除子表对应的记录；

  SET NULL则表示父表在更新或者删除的时候，子表的对应字段被SET NULL。

  针对上面的两张表，子表的外键指定时 ON DELETE RESTRICT ON UPDATE CASCADE 方式的，那么在主表删除记录的时候，如果子表有对应记录，则不允许删除，主表在更新记录的时候。，如果子表有对应记录，则子表对应更新

- 存储方式

  InnoDB存储表和索引有以下两种方式：

  1. 使用共享表空间存储，这种方式创建的表的表结构保存在.frm文件中，数据和索引保存在innodb_data_home_dir和innodb_data_file_path定义的表空间中，可以是多个文件。
  2. 使用多表空间存储，这种方式创建的表的表结构仍然存在.frm文件中，但是每个表的数据和索引单独保存在.ibd中



### 4. MyISAM

MyISAM不支持事务，也不支持外键，其优势是访问的速度快，对事务的完整性没有要求或者以SELECT、INSERT为主的应用基本上都可以使用这个引擎来创建表。

- 不支持事务

  ```mysql
  create table goods_myisam(
  	id int NOT NULL AUTO_INCREMENT,
      name varchar(20) NOT NULL,
      primary key(id)
  )ENGINE=myisam DEFAULT CHARSET=uft8;
  ```

- 文件存储方式

  每个MyISAM在磁盘上存储成3个文件，其文件名和表名相同，但拓展名分别为：.frm（存储定义表）、.MYD（MYData，存储数据）、.MYI（MYIndex，存储索引）



### 5. Memory

​	Memory存储引擎将表的数据存放在内存中。每个Memory表对应一个磁盘文件，格式是 **.frm** ，该文件只存储表的结构，而其数据文件都是存储在内存中，这样有利于数据的快速处理，提高整个表的效率。Memory类型的表访问非常的快，因为他的数据是存放在内存中的，并且默认使用HASH索引，但是服务一关闭，表中的数据就会丢失。

 

### 6. 存储引擎的选择

​	在选择存储引擎时，应根据应用系统的特点选择合适的存储引擎。对于复杂的应有洗头膏，还可以根据实际情况选择多种存储引擎进行组合。以下是几种常见的存储引擎的使用环境。

- InnoDB：是MySQL的默认存储引擎，用于事务处理应有程序，支持外键。如果应用对事务的完整性有比较高的要求，在并发条件下要求数据的一致性，数据操作除了插入和查询以外，还包含很多的更新、删除操作，那么InnoDB存储引擎是比较合适的选择。InnoDB存储引擎除了有效的降低由于删除和更新导致的锁定，还可以确保事务的完整提交和回滚，对于类似于计费系统或者财务系统等对数据准确性要求比较高的系统，InnoDB是最合适的选择。
- MyISAM：如果应用是以读操作和插入操作为主，只有很少的更新和删除操作，并且对事务完整性、并发性要求不是很高，那么选择这个存储引擎是非常合适的。
- Memory：将所有数据保存在RAM中，在需要快速定位记录和其他类似数据环境下，可以提供几块的访问。Memory的缺陷就是对表的大小有限制，太大的表无法缓存在内存中，其次要确保表的数据可以恢复，数据库异常终止后表中的数据是可以恢复的。Memory表通常用于更新不太频繁的小表，可以快速得到访问结果

