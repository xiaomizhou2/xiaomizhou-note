# MySQL视图

### 1. 视图概述

视图(View)是一种虚拟存在的表。视图并不在数据库中实际存在，行和列数据来自定义视图的查询中使用的表，并且是在使用视图时动态生成的。通俗的讲，视图就是一条SELECT语句执行后返回的结果集。所以我们在创建视图的时候，主要的工作就落在创建这条SQL查询语句上。



视图相对于其他普通的表的优势主要包括以下几项：

- 简单：使用视图的用户完全不需要关心后面对应的表的结构、关联条件和筛选条件，对用户来说已经是过滤好的复合条件的结果集
- 安全：使用视图的用户只能访问他们被允许查询的结果集，对表的权限管理并不能限制到某个行某个列，但是通过视图就可以简单的实现。
- 数据独立：一旦视图的结构确定了，可以屏蔽结构变化对用户的影响，源表增加列对视图没有影响；源表修改列名，则可以通过修改视图来解决，不会造成对访问者的影响。



### 2. 创建或者修改视图

创建视图的语法为：

```mysql
CREATE [OR REPLACE(替换)] [ALGORITHM = {UNDEFINED | MERGE | TEMPTABLE}]

VIEW view_name [(colum_name)]

AS select_statement
[WITH [CASCADED | LOCAL] CHECK OPTION]
```

修改视图的语法为：

```mysql
ALTER [ALGORITHM = {UNDEFINED | MERGE | TEMPTABLE}]

VIEW view_name [(colum_name)]

AS select_statement

[WITH [CASCADED | LOCAL] CHECK OPTION]
```

```mysql
选项：
  WITH [CASCADED | LOCAL] CHECK OPTION 决定了是否允许更新数据使记录不再满足视图的条件。
  
  LOCAL：只要满足本视图的条件就可以更新
  CASCADED：必须满足所有针对该视图的所有视图的条件才可更新。 --默认值
```

### 3. 查看视图

从MySQL 5.1版本开始，SHOW TABLES命令不仅会显示表的名字，也会显示视图的名字。



### 4. 删除视图

```mysql
DROP VIEW [IF EXISTS] view_name[, view_name] ...[RESTRICT | CASCADE]
```

