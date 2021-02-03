# 左侧菜单vue框架

# 开发说明
1. 模块样式需在(style)文件夹中创建对应文件，并在(style/index.less)中引入

```
vue-router history模式下的ngnix代理
server {
        listen       9600;
        server_name  localhost;
		location / {
			root  D:/webBC/anZhou/left_empty_project/leftEmptyProject;
            index  index.html index.htm;
            #方式1：
            # if (!-e $request_filename) {
            #     rewrite ^/(.*) /index.html last;
            #     break;
            # } 
            #方式2： 
            try_files $uri $uri/ /index.html;  
        }
    }
```
# Vue前端构架-结构目录及使用说明

## 浏览器兼容说明
1. 整体架构支持 >= IE10+;
2. 最佳体验 >= IE11+

## 项目结构说明
1. 整个项目属于单页面开发，所有路由都在入口文件（router/index.js）中进行配置，单独页面功能自行创建新文件进行配置开发；
2. 所有通用、多页面公用数据状态缓存在Vuex中，按功能进行文件管理，所有功能文件放在（store/modules）文件夹下，在index.js中进行集成；
3. 所有页面功能开发按功能模块包管理方式并以.vue文件存在；
4. 所有公共组件、指令、过滤器、原型都定义在components文件夹；
5. 针对不同模块的接口地址，以 (模块名.url.config.js) 命名并放在(config)文件夹下
6. 接口请求方法均在(api/common.js)中


## 项目环境安装与运行
1. 运行项目：(运行前确保依赖安装完成且无失败项, 已设置localhost和本地ip均可访问)
 `npm run start`
2. 重启项目：(与运行一致，但不会打开首页)
 `npm run restart`
3. 打包发布命令：
 `npm run build`
4. 打包文件名修改:
  `修改vue.config.js中的outputDir参数`
5. 项目标题修改：
   `修改vue.config.js中的title参数`
