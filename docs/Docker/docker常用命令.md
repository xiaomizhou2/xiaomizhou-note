```shell
###################################镜像命令###########################
# 下载镜像文件
docker pull 镜像名称:版本号
# 查询所有本地镜像
docker images
# 删除镜像
docker rmi [镜像ID/镜像名称]
# 镜像导出到本地
docker save -o [文件名] [镜像名称:tag]
# 将本地镜像进行加载
docker load -i [文件名]

###################################容器命令###########################
# 查询所有实例
docker ps -a
# 进入容器实例进行交互
docker exec -it [容器ID/容器Name] bash
#docker 容器自动重启
docker update <容器ID> --restart=always
# 删除容器
docker rm <容器ID>
# 查看容器运行日志 添加 -f 持续查看日志
docker logs [容器ID]
# 暂停容器
docker pause
# 恢复容器
docker unpause

###############################docker run 命令详解#######################
# 创建并运行一个容器
docker run 
# 给容器起名字
-- name
# 将宿主机端口与容器端口进行映射绑定
-p 宿主机端口:容器端口
# 后台运行容器
-d
# 最后跟上镜像名称
    
# 将容器文件目录挂载到宿主机
-v [宿主机路径]:[容器路径]

##############################操作数据卷##############################
docker volume [command]

- create 创建一个volume 
 
- inspect 显示一个或多个volume的信息

- ls 列出所有的volume 
 
- prune 删除未使用的volume 
 
- rm 删除一个或多个指定的volume

```

