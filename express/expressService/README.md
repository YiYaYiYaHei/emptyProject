# expressService
- 基于Node.js的Web应用程序开发框架;
- 基于express4.0，官网地址：https://www.expressjs.com.cn/guide/writing-middleware.html;

## 1、主要功能
- 提供 文件上传、下载接口；
- 提供 大文件下载（包括分片下载）接口；
- 提供 mysql数据库连接和部分sql语句封装；
- 提供 记录接口日志功能；
- 提供 webSocket连接；
- 热更新（supervisor）；

## 2、目录结构说明
```
|-- emptyService
    |-- app.js                             // 入口文件
    |-- global.config.js                   // 全局配置文件
    |-- package.json
    |-- README.md
    |-- public                             // 静态文件（上传、下载所存放的目录）
    |   |-- test.jpg
    |-- routes                             // 路由
        |-- index.js                       // 路由注册文件
        |-- common                         // 路由公共模块
        |   |-- bigFileReq.js              // 大文件下载
        |   |-- common.js                  // 公共处理文件（接口返回字段处理等）
        |   |-- fileReq.js                 // 文件上传、下载
        |   |-- webSocket.js               // webSocket
        |-- db                             // 数据库处理
        |   |-- mysql_db_conf.js           // mysql数据库
        |-- modules                        // 路由功能模块（按功能模块划分命名）
            |-- demo.js
```

## 3、开发说明
1. 所有路由按功能模块划分，放至(routes/modules)文件夹下，已在(routes/index.js)下作自动引入，无需手动引入；
2. 已做热更新操作，修改后无需重启；

## 4、项目环境安装与运行
1. 运行前请安装`supervisor`（`npm install supervisor -g`）
2. 运行项目：
   `supervisor app.js`