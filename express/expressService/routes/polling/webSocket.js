/*********************************************************************
 * express 实现 webSocket
 * 注意点：
 * 1、send只能发送 字符串/buffer，由于接收到的是Buffer，所以如果需要传对象，需要先将buffer转字符串，再使用JSON.stringify；
 * 2、使用nodejs-websocket包，webSocket和http不能使用一个端口，会报“Error: listen EADDRINUSE: address already in use :::13666”，所以改用ws；
 * 3、使用ws共用一个端口是根据请求头中 Connection:Upgrade 和 Upgrade:websocket 这两个字段确认是否是webSocket；
 *    webSocket和http共用一个端口: https://blog.csdn.net/qq_44856695/article/details/120250286
 *********************************************************************/

const WS = require('ws');

// 不区分地址 - 即ws://localhost:13666 和 ws://localhost:13666/test都能访问到
const bindWs = (httpServer) => {
  const ws = new WS.Server({server: httpServer});
  ws.on('connection', (connect) => wsConnect(connect, '不区分地址'))
}

// ws连接 - 发送消息/关闭连接
const wsConnect = (connect, type) => {
  connect.on('message', (str) => {
    // send只能发送字符串/buffer，接收到的str是buffer类型，使用toString转成字符串
    connect.send(JSON.stringify({type, data: str.toString()}));
    setTimeout(() => {
      // 服务端主动关闭连接
      connect.close();
    }, 3000);
  });
  connect.on('close', (code, reason) => {
    console.log('关闭连接了', code, reason);
  })
}

// 区分地址 - 即只有 ws://localhost:13666/test/:id  和 ws://localhost:13666/test1/:id 能访问，获取id：req.url.match(/\/\d/g)[0].slice(1)
const bindWss = (httpServer) => {
  // ws://localhost:13666/test/:id 使用的ws
  const ws = new WS.Server({noServer: true});
  ws.on('connection', (connect) => wsConnect(connect, 'first'));

  // ws://localhost:13666/test1/:id 使用的ws
  const ws1 = new WS.Server({noServer: true});
  ws1.on('connection', (connect) => wsConnect(connect, 'second'));

  httpServer.on('upgrade', (req, socket, head) => {
    if (req.url.startsWith('/test/')) {
      ws.handleUpgrade(req, socket, head, (connect) => {
        ws.emit('connection', connect, req);
      });
    } else if (req.url.startsWith('/test1/')) {
      ws1.handleUpgrade(req, socket, head, (connect) => {
        ws1.emit('connection', connect, req);
      });
    } else {
      console.log('ws接口不存在');
      socket.destroy();
    }
  })
}
module.exports = function(httpServer) {
  bindWss(httpServer);
}