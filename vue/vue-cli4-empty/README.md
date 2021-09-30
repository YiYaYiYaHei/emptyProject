# vue-cli4-empty
- 本项目旨在快速开发后台管理系统，提供此类项目前端架构和部分常用功能组件的使用。
- 项目主要基于：vue2、elementui、axios、less、vuex、vue-router开发

## 1、项目主要功能
- eslint配置；
- 常用工具方法提供；
- 异步请求相关方法整合，接口文件整合；
- 路由的快速配置（含权限配置）；
- 根据路由配置，系统导航的配置（默认顶部+左侧导航，可选顶部导航或左侧导航）；
- 常用公共组件的提供：BaseDialog、BaseTable、BaseText；
- 组件常用方法和数据提供：mixins；
- 表单自定义验证规则；
- 系统名、版本号、代理的统一配置；
- 同一浏览器以最后一次登录为准
- 默认前端未操作10分钟自动退出（操作事件mousemove、keyup 、click）
- 默认25分钟前端刷新一次token
- ...

## 2、浏览器兼容说明
1. 整体架构支持 >= IE10+;
2. 最佳体验 >= IE11+;

## 3、项目目录结构说明
```
|-- vue-cli4-empty
    |-- public
    |   |-- template                      // 项目中使用的静态模板文件
    |-- src
        |-- main.js                       // 项目入口
        |-- apis
        |   |-- login.js                  // 登录相关接口（请求接口按功能模块划分命名）
        |-- assets
        |   |-- images
        |   |-- js
        |   |   |-- echartOptions.js       // echarts常用图表配置
        |   |   |-- map                    // echarts地市数据
        |   |-- styles
        |       |-- common.less            // 全局样式（在scoped中也能使用）
        |       |-- index.less
        |       |-- reset.less             // 浏览器样式重置
        |       |-- resetElementUI.less    // 部分element样式重置
        |       |-- theme                  // 主题样式（element-ui官网生成）
        |-- common
        |   |-- filters.js                 // 全局注册的过滤器
        |   |-- index.js                   // 注册全局过滤器、指令、原型、组件
        |   |-- components                 // 全局注册的组件（建议以Base命名）
        |   |-- directives                 // 全局注册的指令
        |-- Layout                         // 系统布局模块
        |-- mixins                         // 混入（按需引入）
        |-- pages                          // 存放页面组件（按功能模块划分命名）
        |   |-- Index.vue                  // 系统页面入口
        |   |-- IndexIframe.vue            // 子系统嵌套示例
        |   |-- 按功能模块来命名
        |       |-- comp                   // 该模块公共组件
        |-- router
        |   |-- config.js                  // 导航配置
        |   |-- index.js                   // 路由挂载
        |   |-- routes.js                  // 生成路由配置
        |-- store
        |   |-- index.js
        |   |-- modules
        |       |-- userInfo.js
        |-- utils                         // 公用方法
            |-- dict.js                   // 系统中常用的枚举
            |-- request.js                // axios
            |-- tools.js                  // 工具方法
            |-- validates.js              // 表单自定义验证规则
    |-- .env                              //  环境变量配置，一般情况下只需要这个文件就可以了
    |-- .env.development                  // 开发环境环境变量配置
    |-- .env.production                   // 生产环境环境变量配置
    |-- .eslintignore                     // 设置某文件/某文件夹不进行eslint格式验证
    |-- .eslintrc.js                      // eslint配置
    |-- .gitignore                        // git上传忽略上传文件/文件夹
    |-- babel.config.js
    |-- package-lock.json
    |-- package.json
    |-- README.md
    |-- vue.config.js
    |-- webstorm.config.js                 // 处理webstorm配置路径别名后，ctrl+左键失效
```

## 4、开发说明
1. 整个项目属于单页面开发，所有路由都在（router/config.js）中进行配置；
2. 所有通用、多页面公用数据状态缓存在Vuex中，按功能进行文件管理，所有功能文件放在（store/modules）文件夹下，在index.js中进行集成；
3. 所有页面功能开发按功能模块包管理方式并以.vue文件存在，建议使用 大驼峰 命名方式（例如：/pages/GoodsManage/GoodsCreated.vue）；
4. 所有公共组件、指令、过滤器、原型都定义在common文件夹；
5. 针对不同模块的接口地址，以 (模块名.js) 命名并放在(apis)文件夹下

## 5、项目环境安装与运行
1. 运行项目：(运行前确保依赖安装完成且无失败项, 已设置localhost和本地ip均可访问)
 `npm run start`
2. 重启项目：(与运行一致，但不会自动打开浏览器页签)
 `npm run restart`
3. 打包发布命令：
 `npm run build`
4. 打包文件名修改:
  `修改vue.config.js中的outputDir参数`
5. 项目标题修改：
   `修改.env的VUE_APP_SYSTEM_NAME参数`

# nginx配置
```
vue-router history模式下的ngnix代理
server {
        listen       9600;
        server_name  localhost;
        client_max_body_size 2G;   # 配置文件上传大小
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
    location /apis/ {
      proxy_pass http://localhost:8090/;

      proxy_set_header Upgrade websocket;  # 配置允许创建websocket
      proxy_set_header Connection Upgrade; # 配置允许创建websocket
    }
```

