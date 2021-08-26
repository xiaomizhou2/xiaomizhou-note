### docker 镜像结构

镜像就是将应用程序及其需要的系统函数库、环境、配置、依赖打包而成。

1. 基础镜像：应用依赖的系统函数库、环境、配置、文件等
2. 层：在基础镜像的基础上添加安装包、依赖、配置等，每次操作都形成新的一层。
3. 入口：镜像运行入口，一般是程序启动的脚本和参数

### Dockerfile
**Dockerfile**就是一个文本文件，其中包含一个个的指令，用指令来说明要执行什么操作来构建镜像。每一个指令都会形成一层Layer。

| 指令       | 说明                                      | 示例                        |
| ---------- | ----------------------------------------- | --------------------------- |
| FROM       | 指定基础镜像                              | FROM centos:6               |
| ENV        | 设置环境变量,可在后面指令使用             | ENV key value               |
| COPY       | 拷贝本地文件到镜像的指定目录              | COPY ./mysql-5.7.rpm /tmp   |
| RUN        | 执行Linux的shell命令,一般是安装过程的命令 | RUN yum install gcc         |
| EXPOSE     | 指定容器运行时监听的端口,给镜像使用者看的 | EXPOSE 8888                 |
| ENTRYPOINT | 镜像中应用的启动命令,容器运时调用         | ENTRYPOINT java -jar xx.jar |

[语法doc](https://docs.docker.com/engine/reference/builder/)

dockerfile 构建示例

```
# 指定基础镜像
FROM ubuntu:16.04
# 配置环境变量，JDK的安装目录
ENV JAVA_DIR=/usr/local

# 拷贝jdk和java项目的包
COPY ./jdk8.tar.gz $JAVA_DIR/
COPY ./docker-demo.jar /tmp/app.jar

# 安装JDK
RUN cd $JAVA_DIR \
 && tar -xf ./jdk8.tar.gz \
 && mv ./jdk1.8.0_144 ./java8
 
# 配置环境变量
ENV JAVA_HOME=$JAVA_DIR/java8
ENV PATH=$PATH:$JAVA_HOME/bin

# 暴露端口
EXPOSE 8090

# 入口 java项目的启动命令
ENTRYPOINT java -jar /tmp/app.jar
```

构建项目命令
```
# . dockerfile 所在目录

docker build -t <镜像名称>:<版本号> .
```

#### 现成的安装好jdk的基础镜像名称  **java:8-alpine**

### DokcerCompose

Docker Compose 可以基于Compose文件帮我们快速的部署分布式应用，而无需手动一个个创建和运行容器

Compose文件是一个文本文件，通过指令定义集群中的每个容器如何运行

配置文件示例
```yml
version: "3.8"

services:
    mysql: 
        image: mysql:5.7.25
        environment: MYSQL_ROOT_PASSWORD:123
        volumes:
         - /tmp/mysql/data:/var/lib/mysql
         - /tmp/mysql/conf/hmy.cnf:/etc/mysql/conf.d/hmy.cnf
    web:
        build: .
        ports:
         - 8090:8090
```

### Docker私有镜像仓库

搭建镜像仓库可以基于Docker官方提供的DockerRegistry来实现

#### 简化版镜像仓库
Docker官方的Docker Registry 是一个基础版本的Docker镜像仓库，具备仓库管理的完整功能，但是没有图形化界面

搭建命令：
```shell
docker run -d \
    --restat=always \
    --name registry \
    -p 5000:5000
    -v registry-data:/var/lib/registry \
    registry
```

#### 带有图形化界面的仓库版本
使用Docker Compose 部署带有图形化界面的Docker Registry

```
version: '3.0'
services: 
    registry: 
        image: registry
        volumes: 
          - ./registry-data:/var/lib/registry
    ui:
        image: joxit/docker-registry-ui:static
        ports:
          - 8080:80
        environment:
          - REGISTRY_TITLE=私有仓库名称
          - REGISTRY_URL=http://registry:5000
        depends_on:
          - registry
```

#### 在私有仓库推送或拉取镜像
推送镜像到私有镜像仓库必须先tag


```
# 1. 重新tag本地镜像，名字前缀为私有仓库地址
docker tag nginx:latest ip:port/nginx:1.0

# 2.推送镜像
docker push ip:port/nginx:1.0

# 3.拉取镜像
docker pull ip:port/nginx:1.0

```


​            