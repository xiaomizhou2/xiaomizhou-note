# docker 安装mysql和redis



## 1.mysql

```shell
# 创建实例并启动
docker run -p 3306:3306 --name mysql -v /mydata/mysql/log:/var/log/mysql -v /mydata/mysql/data:/var/lib/mysql -v /mydata/mysql/conf:/etc/mysql -e MYSQL_ROOT_PASSWORD=root -d mysql:5.7

	## 将容器的3306端口映射到主机的3306端口
	-p 3306:3306  
	实体机目录:容器内目录
	## 将日志文件夹挂载到实体机
	-v /mydata/mysql/log:/var/log/mysql
 
	## 将数据data文件夹挂载到实体机
	-v /mydata/mysql/data:/var/lib/mysql
	## 将配置文件夹挂载到实体机
	-v /mydata/mysql/conf:/etc/mysql
	## 设置root账户密码
	-e MYSQL_ROOT_PASSWORD=root
```



## 2.Redis

```shell
# 避坑 外部不创建redis.conf文件 会把这个当成目录 所以预先创建conf文件
mkdir -p /mydata/redis/conf
touch /mydata/redis/conf/redis.conf
# 创建实例启动
docker run -p 6379:6379 --name redis -v /mydata/redis/data:/data -v /mydata/redis/conf/redis.conf:/etc/redis/redis.conf -d redis redis-server /etc/redis/redis.conf

docker run -p 16379:6379 --name redis -v /home/ubuntu/docker-data/redis/data:/data -v /home/ubuntu/docker-data/redis/conf/redis.conf:/etc/redis/redis.conf -d redis redis-server /etc/redis/redis.conf
# 数据持久化设置 redis.conf里增加
appendonly yes --启动AOF的持久化策略
```

