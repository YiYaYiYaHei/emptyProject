const http = require('http');
const SSE = require('sse');

var sseClients = [];

module.exports = (httpServe) => {
  var sse = new SSE(httpServe, { path: '/sse', verifyRequest: (req) => {
    return true;
  }});
  sse.on('connection', function(client) {
    client.on('close', function() {
      let index = sseClients.indexOf(client);
      if (index > -1) {
        sseClients.splice(index, 1);
      }
    });
    sseClients.push(client);
    client.send('Hello world');
    client.count = 1;
    setInterval(() => {
      sseClients.forEach(function (item, index) {
        item.send(`[${sseClients.length}]服务端推送给客户端${index} : ${item.count}`);
        item.count++;
      });
    }, 1000);
  });
}