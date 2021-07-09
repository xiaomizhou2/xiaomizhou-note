# MySQL存储过程及函数

### 1. 存储过程和函数概述

​	存储过程和函数是**事先经过编译并存储**在数据库中的一段SQL语句的集合，调用存储过程和函数可以简化应用开发人员的很多工作，减少数据在数据库和应用服务器之间的传输，对于提高数据处理的效率是有好处的。

存储过程和函数的区别在于函数必须有返回值,而存储过程没有

函数：是一个有返回值的过程

过程：是一个没有返回值的函数



### 2. 创建存储过程

```mysql
CREATE PROCEDURE procedure_name([proc_parameter[, ...]])
begin
-- SQL语句
end;

########示例#############
CREATE PROCEDURE pro_test1()
begin
SELECT 'HELLO MYSQL';
end;

DELIMITER 该关键字用来声明SQL语句的分隔符，默认情况下MySQL
```



