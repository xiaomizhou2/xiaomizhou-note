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

