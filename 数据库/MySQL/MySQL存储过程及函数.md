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

##### 4.3 传递参数

语法格式：

```mysql
CREATE PROCEDURE proc_name([in / out / inout] 参数名 参数类型)

IN：该参数可以作为输入，也就是需要调用方传入值，默认
OUT：该参数作为输出，也就是该参数可以作为返回值
INOUT：既可以作为输入参数吗，也可以作为输出参数
```

- IN - 输入

  ```mysql
  -- 根据定义的年龄变量，判断年龄段信息
  CREATE PROCEDURE pro_test5(in age int)
  BEGIN
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

- OUT-输出

  ```mysql
  -- 根据定义的年龄变量，获取年龄段信息
  CREATE PROCEDURE pro_test6(in age int, out age_desc varchar(50))
  BEGIN
  	-- IF判断语句
  	IF age >= 0 AND age < 18 THEN SET age_desc = '未成年';
  	ELSEIF age >= 18 AND age <= 30 THEN SET age_desc = '青少年';
  	ELSEIF age > 30 AND age <= 50 THEN SET age_desc = '中年';
  	ELSE SET age_desc = '老年';
  	END IF;
  END;
  
  -- 调用存储过程
  CALL pro_test6(20, @age_desc); 
  
  SELECT @age_desc;
  ```

- **小知识**

  @age_desc：用户会话变量，代表整个会话过程中他是有作用的，这个类似于全局变量一样

  @@global.sort_buffer_size：这种叫做系统变量

##### 4.4 case 结构

语法结构：

```mysql
-- 方式一
CASE case_value
	WHEN when_value THEN statement_list
	[WHEN when_value THEN statement_list] ...
	[ELSE statement_list]
END CASE;

-- 方式二
CASE
	WHEN search_condition THEN statement_list
	[WHEN search_condition THEN statement_list] ...
	[ELSE statement_list]
END CASE;
```

示例：

```mysql
-- 给定一个月份，然后计算出所在的季度
CREATE PROCEDURE pro_test7(in month int, out desc varchar(50))
BEGIN
	CASE 
	WHEN month <= 3 AND month >= 1 THEN SET desc = '春'
	WHEN month <= 6 AND month >= 4 THEN SET desc = '夏'
	WHEN month <= 9 AND month >= 7 THEN SET desc = '秋'
	ELSE SET desc = '冬'
	END CASE;
END;
```

##### 4.5 while循环

语法结构：

```mysql
WHILE search_condition DO
	statement_list
END WHILE;
```

示例：

```mysql
-- 计算从1加到n的值
CREATE PROCEDURE pro_test8(n int)
BEGIN
	DECLARE total int DEFAULT 0;
	DECLARE start int DEFAULT 0;
	
	WHILE start <= n DO
	SET total = total + start;
	SET start++;
	END WHILE;
	
	SELECT total;
END;
```

##### 4.6 repeat循环

有条件的循环控制语句，当满足条件的时候退出循环。while是满足条件才执行，repeat是满足条件就推出循环。

语法结构：

```mysql
REPEAT
	statement_list
	UNTIL search_condition
END REPEAT;
```

示例：

```mysql
-- 计算从1加到n的值
CREATE PROCEDURE pro_test9(n int)
BEGIN
	DECLARE total int DEFAULT 0;
	
	REPEAT
	SET total = total + n;
	SET n = n - 1;
	UNTIL n = 0
	END REPEAT;
	
	SELECT total;
END;
```

##### 4.7 loop循环

LOOP实现简单的循环，退出循环的条件需要使用其他的语句定义，通常可以使用LEAVE语句实现，具体语法如下：

```mysql
[begin_label:] LOOP
	statement_list
END LOOP [end_label]
```

如果不在statement_list 中增加退出循环的语句，那么LOOP语句可以用来实现简单的死循环。

示例：

```mysql
-- 计算从1加到n的值
CREATE PROCEDURE pro_test10(n int)
BEGIN
	DECLARE total int DEFAULT 0;
	
	ins: LOOP
	IF n <=0 THEN 
		LEAVE ins;
	END IF;
	SET total = total + n;
	SET n = n - 1;
	END LOOP ins;
	
	SELECT total;
END;
```

##### 4.8 游标、光标

游标是用来存储查询结果集的数据类型，在存储过程和函数中可以使用光标对结果集进行循环的处理。光标的使用包括光标的声明、OPEN、FETCH和CLOSE,其语法分别如下：

```mysql
-- 声明光标
DECLARE cursor_name CURSOR FOR select_statement;

-- OPEN光标
OPEN cursor_name;

-- FETCH 光标
FETCH cursor_name INTO var_name[, var_name] ...

-- CLOSE 光标
CLOSE cursor_name;
```



### 5. 存储函数

语法结构：

```mysql
CREATE FUNCTION function_name([param type ...])
RETURNS type
BEGIN
	...
END;
```

示例：

```mysql
-- 定义一个存储过程，请求满足条件的总记录数
CREATE FUNCTION count_city(countryId int)
RETURNS int
BEGIN
	DECLARE cnum int;
	
	SELECT count(*) INTO cnum FROM city country_id = countryId;
	
	return cnum;
END;

-- 调用存储函数
SELECT count_city(1);
```

