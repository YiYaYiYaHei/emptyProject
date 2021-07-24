// 处理使用别名后，ctrl+左键进不去方法体的问题

// File > Settings > Languages & Frameworks > JavaScript > Webpack 设置webpack configuration file为当前文件。
const webpackConfig = require('@vue/cli-service/webpack.config.js');
module.exports = webpackConfig;
