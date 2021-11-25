/** 引入 http 包 */
const http = require('http');

/** 引入 net 包 */
const net = require('net');

/** 引入 websocket 类 */
const WebSocketServer = require('ws').Server;

/** 本机 ip 地址 */
const localhost = '127.0.0.1';

/** 开放的 vnc websocket 转发端口 */
const vnc_port = 8112;

/** 打印提示信息 */
console.log(`成功创建 WebSocket 代理 : ${localhost} : ${vnc_port}`);

/** 建立基于 vnc_port 的 websocket 服务器 */
const vnc_server = http.createServer();
vnc_server.listen(vnc_port, function () {
    const web_socket_server = new WebSocketServer({server: vnc_server});
    web_socket_server.on('connection', web_socket_handler);
});

/** websocket 处理器 */
const web_socket_handler = function (client, req) {
    /** 获取请求url */
    const url = req.url;
    console.log("====", url);

    /** 截取主机地址 */
    const host = url.substring(url.indexOf('/') + 1, url.indexOf(':'));

    /** 截取端口号 */
    const port = Number(url.substring(url.indexOf(':') + 1));

    /** 打印日志 */
    console.log(`WebSocket 连接 : 版本 ${client.protocolVersion}, 协议 ${client.protocol}`);

    /** 连接到 VNC Server */
    const target = net.createConnection(port, host, function () {
        console.log('连接至目标主机');
    });

    /** 数据事件 */
    target.on('data', function (data) {
        try {
            client.send(data);
        } catch (error) {
            console.log('客户端已关闭，清理到目标主机的连接');
            target.end();
        }
    });

    /** 结束事件 */
    target.on('end', function () {
        console.log('目标主机已关闭');
        client.close();
    });

    /** 错误事件 */
    target.on('error', function () {
        console.log('目标主机连接错误');
        target.end();
        client.close();
    });

    /** 消息事件 */
    client.on('message', function (msg) {
        target.write(msg);
    });

    /** 关闭事件 */
    client.on('close', function (code, reason) {
        console.log(`WebSocket 客户端断开连接：${code} [${reason}]`);
        target.end();
    });

    /** 错误事件 */
    client.on('error', function (error) {
        console.log(`WebSocket 客户端出错：${error}`);
        target.end();
    });
};