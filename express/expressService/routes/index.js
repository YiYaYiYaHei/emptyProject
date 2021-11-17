/*********************************************************************
 * 模块接口引用入口(自动引入modules下的js文件, common下非common.js、webSocket.js文件)
 *********************************************************************/

const fs = require('fs');
const path = require('path');

const Apis = [];
// __dirname为当前文件所在目录的路径
const filePathList = [{path: path.join(__dirname, 'modules'), reg: '\.js$'}, {path: path.join(__dirname, 'common'), reg: /^.+(?<!common|webSocket)\.js$/}];

for(const item of filePathList) {
  const filePath = item.path;
  // 链式写法：① 获取到modules目录下的文件；② 返回js文件的文件名；③ 循环引入js文件
  fs.readdirSync(filePath)
    .filter((fileName) => {
      return new RegExp(item.reg).test(fileName);
    })
    .forEach((fileName) => {
      /**
       * 使用require(`${filePath}\\${fileName}`)返回的是空对象，所以换成了path.join();
       * path.join() - 使用特定于平台的分隔符作为定界符将所有给定的 path 片段连接在一起，然后规范化生成的路径。(windows和linux的\不一样，所以建议使用path)
       */
      Apis.push(require(path.join(filePath, fileName)));
    });
}


module.exports = app => {
  for(let item of Apis) {
    item(app);
  }
};
