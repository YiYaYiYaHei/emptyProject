const express = require("express");
const app = express();
const PORT = 13666;

// 配置http/https
const isHttps = false;
const https = require('https');
const path = require('path');
const fs = require('fs');

// 引入路由
const routes = require('./routes/index.js');
const webSocket = require('./routes/polling/webSocket');
const sse = require('./routes/polling/sse');


// 服务端开启gzip支持
var compression = require('compression');
//尽量在其他中间件前使用compression
app.use(compression());

// 将指定目录下的文件对外开放  http://localhost:13666/test.jpg就可以访问到public下的文件了
app.use(express.static('public'));

// 对于get请求参数可以直接通过req.query获取，post请求需要转码再使用req.body获取
app.use(express.urlencoded());

// app.all() 用于在所有HTTP 请求方法的路径上加载中间件函数, 所有的路由都会走这
app.all('*', (req, res, next) => {
  // 设置跨域访问
  res.header("Access-Control-Allow-Origin", "*");
  /**
   * 解决跨域
   * 包含自定义header字段的跨域请求，浏览器会先向服务器发送OPTIONS请求，探测该服务器是否允许自定义的跨域字段。如果允许，则继续实际的POST／GET正常请求，否则，返回标题所示错误。
   * 若报跨域:...by CORS policy: Request header field range is not allowed by Access-Control-Allow-Headers in preflight response，只需在响应头中包含该字段即可(加入range)
  */
  res.header("Access-Control-Allow-Headers", "content-type,x-requested-with,Authorization,x-ui-request,lang,accept,access-control-allow-origin,range");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");

  // 所有接口都会走这，所以可以添加全局处理方法，比如过滤器
  console.log('哈哈哈哈这里可以添加过滤器哦~');
  next();
});

/**
 * 基本路由，也可以使用router -- https://www.expressjs.com.cn/guide/routing.html
 * app.method(url, cbList)
 * method - 方法：get、post、put、delete
 * cbList - 回调函数，可以是个数组/函数，使用next就会调用下一个回调；参数req、res、next
*/
let httpServe = null;
if (isHttps) {
  var privateCrt = fs.readFileSync(path.join(process.cwd(), 'cert/server.pem'), 'utf8');
  var privateKey = fs.readFileSync(path.join(process.cwd(), 'cert/server.key'), 'utf8');
  const HTTPS_OPTOIN = {
    key: privateKey,
    cert: privateCrt
  };
  httpServe = https.createServer(HTTPS_OPTOIN, app);
  httpServe.listen(PORT, () => {
    console.log('\033[;32m expressService listening at ' + (isHttps ? 'https' : 'http') + '://localhost:' + PORT + '\033[0m');
  });
} else {
  httpServe = app.listen(PORT, () => {
    console.log('\033[;32m expressService listening at http://localhost:' + PORT + '\033[0m');
  });
};

routes(app);

webSocket(httpServe);
sse(httpServe);