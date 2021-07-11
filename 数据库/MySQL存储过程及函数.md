# MySQL存储过程及函数

### 1. 存储过程和函数概述

​	存储过程和函数是**事先经过编译并存储**在数据库中的一段SQL语句的集合，调用存储过程和函数可以简化应用开发人员的很多工作，减少数据在数据库和应用服务器之间的传输，对于提高数据处理的效率是有好处的。

存储过程和函数的区别在于函数必须有返回值,而存储过程没有

函数：是一个有返回值的过程

过程：是一个没有返回值的函数



### 2. 创建及调用存储过程

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

-- 调用存储过程
CALL procedure_name
```



### 3. 查看及删除存储过程

```mysql
-- 查询db_name数据库中的所有的存储过程
SELECT name FROM mysql.proc WHERE db = 'db_name';

-- 查询存储过程的状态信息
SHOW PROCEDURE status;

-- 查询某个存储过程的定义
SHOW CREATE PROCEDURE proc_name;

-- 删除存储过程
DROP PROCEDURE [IF EXISTS] proc_name;
```



### 4. 语法

存储过程是可以编程的，意味着可以使用变量、表达式、控制结构来完成比较复杂的功能

##### 4.1 变量

- DECLARE

  通过DECLARE可以定义一个局部变量，该变量的作用范围只能在BEGIN...END块中。

  ```mysql
  DECLARE var_name[, ...] type [DEFAUIT value]
  ```

  示例：

  ```mysql
  CREATE PROCEDURE pro_test2()
  BEGIN
  	DECLARE num int DEFAULT 5;
  	SELECT num;
  END;
  ```

- SET

  直接赋值使用SET，可以赋常量或者赋表达式，具体语法如下：

  ```mysql
  SET var_name = expr[, var_name = expr]...
  ```

  示例：

  ```mysql
  CREATE PROCEDURE pro_test3()
  BEGIN
  	DECLARE NAME VARCHAR(20);
  	SET NAME = 'MYSQL';
  	SELECT NAME;
  END;
  ```

  也可以使用SELECT...INTO方式进行赋值操作：

  ```mysql
  CREATE PROCEDURE pro_test5()
  BEGIN
  	DECLARE countnum int;
  	SELECT COUNT(*) INTO countnum FROM city;
  	SELECT countnum;
  END;
  ```




##### 4.2 if 条件判断

语法结构：

```mysql
IF search_condition THEN statement_list
[ELSEIF search_condition THEN statement_list] ...
[ELSE statement_list]
END IF;
```

示例：

```mysql
-- 根据年龄判断所处年龄段

0-18 -- 未成年

18-30 -- 青少年

30-50 -- 中年

50以上 -- 老年

# 实现语法
CREATE PROCEDURE pro_test4()
BEGIN
	-- 定义变量
	DECLARE age int DEFAULT 18;
	DECLARE age_desc VARCHAR(50) DEFAULT '';
	-- IF判断语句
	IF age >= 0 AND age < 18 THEN SET age_desc = '未成年';
	ELSEIF age >= 18 AND age <= 30 THEN SET age_desc = '青少年';
	ELSEIF age > 30 AND age <= 50 THEN SET age_desc = '中年';
	ELSE SET age_desc = '老年';
	END IF;
	-- 查询
	SELECT age_desc;
END;
```

